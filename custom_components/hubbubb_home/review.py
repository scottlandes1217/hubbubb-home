"""The nightly review: what the house's own code got wrong yesterday.

The overnight sweep in nightly.py watches the house. This watches the work -
it reads the transcripts of your coding sessions, finds defects the day
actually demonstrated, and proposes automations for things you asked for out
loud and did not get.

Two pieces of that cannot live in Home Assistant: the transcripts are on the
machine where you code, and so is the agent CLI. Both sit behind the
companion's `/review` endpoint, which returns a report and nothing else.
Everything that decides *what is asked* and *what is kept* is here, so the
prompt and the harvesting can change without touching any developer machine.

The inventory is the reason this module exists at all. Before it, the review
saw only transcripts, so it inferred "this capability is missing" from a
failed utterance and invented entity ids from English words - proposing a
front-door automation that already existed and was running, and a
`switch.misters` for what is actually a valve.
"""

from __future__ import annotations

import logging
import re
from typing import Any

from homeassistant.core import CALLBACK_TYPE, HomeAssistant, callback
from homeassistant.helpers.storage import Store
from homeassistant.util import dt as dt_util

from .const import DOMAIN

_LOGGER = logging.getLogger(__name__)

# The agent reads a day of transcripts and writes a report; the
# companion caps its own run at 1800s, so allow for that plus travel.
REVIEW_TIMEOUT = 1900

# Domains worth proposing automations against; the rest is diagnostic noise.
ACTIONABLE = (
    "light.", "switch.", "valve.", "fan.", "climate.", "cover.",
    "media_player.", "scene.", "script.", "automation.", "timer.",
    "lock.", "vacuum.", "input_boolean.", "assist_satellite.",
)

# A draft is a fenced block tagged yaml-draft carrying its own id.
DRAFT_FENCE = re.compile(r"```yaml-draft\n(.*?)```", re.S)
DRAFT_ID = re.compile(r"^\s*(?:-\s*)?id:\s*jarvis_draft_([a-z0-9_]+)", re.M)
FINDINGS_TAIL = re.compile(r"FINDINGS:\s*(\d+)\s*$")

PREAMBLE = """You are reviewing yesterday's sessions to improve the code that
runs this house.

Below is a digest of what the user actually said and every tool error that
occurred. The user's own words are the signal: a correction, a repeated
request, or visible frustration means something did not behave as it should.
Assistant prose is deliberately absent - it is the model's own account of
events, and feeding a model its own reasoning back confirms mistakes rather
than catching them.
"""

TASK = """
Your task:

- Report the defects the day actually demonstrated, worst first. Quote the
  evidence: the user's words, or the tool error. No speculation.
- Then, under a heading 'SUGGESTIONS', propose up to THREE conveniences the
  digest shows would save real friction - something asked for twice, or
  worked around out loud.

Two rules that matter more than the rest:

- CHECK THE INVENTORY FIRST. If an automation for the idea already exists, do
  NOT propose it. The user asking for something already built is evidence of a
  DEFECT - the sentence does not match, or speech recognition is failing - so
  report it as one, naming the automation.
- Every entity_id you write MUST appear verbatim in the inventory. Never
  invent one from the English name: the misters may be a valve, a room's fan
  may be a named appliance, a speaker may be an assist_satellite. If what you
  need is not listed, say so plainly and propose nothing.

For each convenience that is an automation, emit its complete YAML in a fenced
block tagged `yaml-draft`, with `id: jarvis_draft_<slug>` and
`initial_state: false` so it stages disabled. Do not enable anything.

End your reply with a single line: FINDINGS: <number of defects>.
"""


class ReviewReport:
    """The last review, kept across restarts.

    Kept whole rather than summarised: it is what gets read at the kitchen
    table, and what a session reads back when the fixes are approved.
    """

    def __init__(self, hass: HomeAssistant) -> None:
        self._store = Store(hass, 1, f"{DOMAIN}.review")
        self._listeners: list[CALLBACK_TYPE] = []
        self.report: str = ""
        self.findings: int | None = None
        self.drafts: list[dict] = []
        self.last_run: str | None = None
        self.detail: str = ""

    async def async_load(self) -> None:
        data = await self._store.async_load() or {}
        self.report = data.get("report", "")
        self.findings = data.get("findings")
        self.drafts = data.get("drafts", [])
        self.last_run = data.get("last_run")
        self.detail = data.get("detail", "")

    @callback
    def async_add_listener(self, update: CALLBACK_TYPE) -> CALLBACK_TYPE:
        self._listeners.append(update)

        def _remove() -> None:
            self._listeners.remove(update)

        return _remove

    async def async_update(self, **fields: Any) -> None:
        for key, value in fields.items():
            setattr(self, key, value)
        self.last_run = dt_util.now().isoformat()
        await self._store.async_save(
            {
                "report": self.report,
                "findings": self.findings,
                "drafts": self.drafts,
                "last_run": self.last_run,
                "detail": self.detail,
            }
        )
        for listener in self._listeners:
            listener()

    def spoken(self) -> str:
        """One sentence for the morning briefing."""
        if self.detail and not self.report:
            return f"The overnight review could not run: {self.detail}."
        parts = []
        if self.findings:
            parts.append(
                f"{self.findings} {'defect' if self.findings == 1 else 'defects'}"
            )
        if self.drafts:
            count = len(self.drafts)
            parts.append(
                f"{count} automation {'draft' if count == 1 else 'drafts'}"
            )
        if not parts:
            return ""
        return (
            "Also sir - overnight I left " + " and ".join(parts)
            + ". Say apply the nightly findings when you would like to review them."
        )


def inventory(hass: HomeAssistant) -> str:
    """What the house actually has, so the model stops guessing entity ids."""
    autos, things = [], []
    for state in hass.states.async_all():
        if not state.entity_id.startswith(ACTIONABLE):
            continue
        line = f"  {state.entity_id:<56} {state.name}"
        (autos if state.entity_id.startswith("automation.") else things).append(line)

    return (
        f"\n--- automations that already exist ({len(autos)}) ---\n"
        + "\n".join(sorted(autos))
        + f"\n\n--- entities you may target ({len(things)}) ---\n"
        + "\n".join(sorted(things))
        + "\n"
    )


def extract_drafts(report: str) -> list[dict]:
    """Every fenced yaml-draft block that names itself, newest report wins."""
    out = []
    for block in DRAFT_FENCE.findall(report):
        found = DRAFT_ID.search(block)
        if found:
            out.append({"slug": found.group(1), "yaml": block.strip()})
    return out


def build_brief(hass: HomeAssistant, previous: str = "") -> str:
    """Everything except the digest, which only the companion can supply."""
    brief = PREAMBLE + TASK + inventory(hass)
    if previous:
        # Without this the review forgets: a defect raised yesterday and not
        # mentioned again simply vanishes from today's input.
        brief += (
            "\n--- last night's report, so findings survive being ignored ---\n"
            + previous[-6000:]
            + "\n"
        )
    return brief


async def async_review(
    hass: HomeAssistant,
    companion,
    report: ReviewReport,
    hours: int = 24,
    projects: list[str] | None = None,
) -> None:
    """Ask the companion for a review, keep what comes back."""
    brief = build_brief(hass, report.report)
    try:
        answer = await companion.async_call(
            "review",
            {"brief": brief, "hours": hours, "projects": projects or []},
            "POST",
            timeout=REVIEW_TIMEOUT,
        )
    except Exception as err:  # noqa: BLE001 - a failed review must not be silent
        _LOGGER.warning("nightly review: %s", err)
        await report.async_update(detail=str(err), report="", findings=None, drafts=[])
        return

    if isinstance(answer, dict) and answer.get("ok") is False:
        detail = answer.get("detail") or "the companion refused"
        _LOGGER.warning("nightly review: %s", detail)
        await report.async_update(detail=detail, report="", findings=None, drafts=[])
        return

    text = ""
    if isinstance(answer, dict):
        text = (answer.get("report") or answer.get("content") or "").strip()
    elif isinstance(answer, str):
        text = answer.strip()
    if not text:
        await report.async_update(
            detail="the companion returned nothing", report="", findings=None, drafts=[]
        )
        return

    tail = FINDINGS_TAIL.search(text)
    drafts = extract_drafts(text)
    await report.async_update(
        report=text[-12000:],
        findings=int(tail.group(1)) if tail else None,
        drafts=drafts,
        detail="",
    )
    _LOGGER.info(
        "nightly review: %s finding(s), %d draft(s)",
        tail.group(1) if tail else "?",
        len(drafts),
    )
