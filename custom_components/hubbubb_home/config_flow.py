"""Setup, in one screen.

The original of this system took eight hundred and fifty lines of hand-pasted
YAML to stand up. Everything it needed is either created by the integration or
asked for here, and the only genuinely required answer is what to call the
assistant.
"""

from __future__ import annotations

import logging
from typing import Any

import voluptuous as vol
from homeassistant.config_entries import (
    ConfigEntry,
    ConfigFlow,
    ConfigFlowResult,
    OptionsFlow,
)
from homeassistant.core import callback
from homeassistant.data_entry_flow import section
from homeassistant.helpers.aiohttp_client import async_get_clientsession
from homeassistant.helpers.selector import (
    BooleanSelector,
    EntitySelector,
    EntitySelectorConfig,
    TextSelector,
    TextSelectorConfig,
    TextSelectorType,
    TimeSelector,
)

from .companion import CompanionClient, CompanionError
from .const import (
    CONF_ACK,
    CONF_ANNOUNCE,
    CONF_ASSISTANT_NAME,
    CONF_ATV,
    CONF_ATV_ENTITIES,
    CONF_BRIEFING_ENABLED,
    CONF_BRIEFING_TARGET,
    CONF_BRIEFING_TIME,
    CONF_CALENDARS,
    CONF_PERSON_CALENDARS,
    CONF_COMPANION,
    CONF_COMPANION_TOKEN,
    CONF_COMPANION_URL,
    CONF_HOUSEHOLD_LIST,
    CONF_HUBBUBB,
    CONF_HUBBUBB_ID,
    CONF_HUBBUBB_OAUTH_ID,
    CONF_HUBBUBB_OAUTH_SECRET,
    CONF_HUBBUBB_PEOPLE,
    CONF_HUBBUBB_SECRET,
    CONF_HUBBUBB_URL,
    CONF_IGNORE,
    CONF_PERSON_LISTS,
    CONF_NIGHTLY_ENABLED,
    CONF_NIGHTLY_TIME,
    CONF_QUIET_FINDINGS,
    CONF_NOTIFY,
    CONF_PROMPT,
    CONF_QUIET_END,
    CONF_QUIET_START,
    DEFAULT_QUIET_END,
    DEFAULT_QUIET_START,
    CONF_APPROVERS,
    CONF_SENTENCES,
    CONF_SENTENCES_SECTION,
    CONF_SPEAKER_MAP,
    CONF_TTS,
    CONF_VOICE,
    CONF_VOICE_TOKEN,
    CONF_VOICE_URL,
    CONF_WEATHER,
    DEFAULT_ACK,
    DEFAULT_BRIEFING_TIME,
    DEFAULT_NAME,
    DEFAULT_NIGHTLY_TIME,
    DEFAULT_PROMPT,
    DOMAIN,
    SENTENCE_FILES,
)
from .hubbubb import HubbubbClient, HubbubbError

_LOGGER = logging.getLogger(__name__)

_PASSWORD = TextSelector(TextSelectorConfig(type=TextSelectorType.PASSWORD))
_URL = TextSelector(TextSelectorConfig(type=TextSelectorType.URL))

STEP_USER = vol.Schema(
    {
        vol.Required(CONF_ASSISTANT_NAME, default=DEFAULT_NAME): str,
        vol.Required(CONF_HUBBUBB): section(
            vol.Schema(
                {
                    vol.Optional(CONF_HUBBUBB_URL): _URL,
                    vol.Optional(CONF_HUBBUBB_ID): str,
                    vol.Optional(CONF_HUBBUBB_SECRET): _PASSWORD,
                }
            ),
            {"collapsed": True},
        ),
        vol.Required(CONF_COMPANION): section(
            vol.Schema(
                {
                    vol.Optional(CONF_COMPANION_URL): _URL,
                    vol.Optional(CONF_COMPANION_TOKEN): _PASSWORD,
                }
            ),
            {"collapsed": True},
        ),
    }
)


async def _validate(hass, data: dict) -> dict[str, str]:
    """Check whatever optional credentials were actually filled in."""
    errors: dict[str, str] = {}
    session = async_get_clientsession(hass)

    hub = data.get(CONF_HUBBUBB) or {}
    filled = [
        bool(hub.get(k))
        for k in (CONF_HUBBUBB_URL, CONF_HUBBUBB_ID, CONF_HUBBUBB_SECRET)
    ]
    if any(filled):
        if not all(filled):
            errors[CONF_HUBBUBB] = "hubbubb_incomplete"
        else:
            client = HubbubbClient(
                session,
                hub[CONF_HUBBUBB_URL],
                hub[CONF_HUBBUBB_ID],
                hub[CONF_HUBBUBB_SECRET],
            )
            try:
                await client.async_verify()
            except HubbubbError as err:
                _LOGGER.debug("Hubbubb rejected setup: %s", err)
                errors[CONF_HUBBUBB] = "hubbubb_auth"

    companion = data.get(CONF_COMPANION) or {}
    if companion.get(CONF_COMPANION_URL):
        client = CompanionClient(
            session,
            companion[CONF_COMPANION_URL],
            companion.get(CONF_COMPANION_TOKEN),
        )
        # GET, not POST. /health is a read - posting to it is a 404, which
        # reads back as "nothing answered at that address" and sends people
        # hunting for a network fault that is not there.
        try:
            await client.async_call("health", method="GET")
        except CompanionError as err:
            _LOGGER.debug("companion unreachable at setup: %s", err)
            errors[CONF_COMPANION] = "companion_unreachable"
        else:
            # Health says something is listening; it does not say the token is
            # right, because health is deliberately unauthenticated. Ask for
            # something real so a wrong token is caught on this form rather
            # than as a 503 in the build panel an hour later.
            try:
                await client.async_call("status", method="GET")
            except CompanionError as err:
                _LOGGER.debug("companion refused status: %s", err)
                errors[CONF_COMPANION] = "companion_refused"

    return errors


class HubbubbHomeConfigFlow(ConfigFlow, domain=DOMAIN):
    """Name the assistant; everything else is optional."""

    VERSION = 1

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        errors: dict[str, str] = {}
        if user_input is not None:
            await self.async_set_unique_id(DOMAIN)
            self._abort_if_unique_id_configured()
            errors = await _validate(self.hass, user_input)
            if not errors:
                return self.async_create_entry(
                    title=user_input[CONF_ASSISTANT_NAME],
                    data=user_input,
                )

        return self.async_show_form(
            step_id="user",
            data_schema=self.add_suggested_values_to_schema(
                STEP_USER, user_input
            ),
            errors=errors,
        )

    @staticmethod
    @callback
    def async_get_options_flow(entry: ConfigEntry) -> OptionsFlow:
        return HubbubbHomeOptionsFlow()


class HubbubbHomeOptionsFlow(OptionsFlow):
    """Everything tuneable after the fact."""

    async def async_step_init(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        entry = self.config_entry
        errors: dict[str, str] = {}

        if user_input is not None:
            errors = await _validate(self.hass, user_input)
            if not errors:
                # Credentials belong on the entry, everything else on options,
                # so a re-auth does not have to walk through the whole form.
                data = {**entry.data}
                for key in (CONF_ASSISTANT_NAME, CONF_HUBBUBB, CONF_COMPANION):
                    if key in user_input:
                        data[key] = user_input.pop(key)
                self.hass.config_entries.async_update_entry(
                    entry, data=data, title=data[CONF_ASSISTANT_NAME]
                )
                return self.async_create_entry(data=user_input)

        current = {**entry.data, **entry.options}
        # Pre-0.17 single toggle seeds all three per-file switches.
        legacy = current.get(CONF_SENTENCES, True)
        stored_sentences = current.get(CONF_SENTENCES_SECTION) or {}
        current = {
            **current,
            CONF_SENTENCES_SECTION: {
                name: stored_sentences.get(name, legacy)
                for name in SENTENCE_FILES
            },
        }
        schema = vol.Schema(
            {
                vol.Required(CONF_ASSISTANT_NAME): str,
                vol.Optional(CONF_PROMPT, default=DEFAULT_PROMPT): TextSelector(
                    TextSelectorConfig(type=TextSelectorType.TEXT, multiline=True)
                ),
                vol.Required(CONF_SENTENCES_SECTION): section(
                    vol.Schema(
                        {
                            vol.Optional(name, default=True): BooleanSelector()
                            for name in SENTENCE_FILES
                        }
                    ),
                    {"collapsed": True},
                ),
                vol.Required(CONF_ANNOUNCE): section(
                    vol.Schema(
                        {
                            vol.Optional(CONF_NOTIFY): str,
                            vol.Optional(CONF_ACK, default=DEFAULT_ACK): str,
                            vol.Optional(
                                CONF_QUIET_START, default=DEFAULT_QUIET_START
                            ): TimeSelector(),
                            vol.Optional(
                                CONF_QUIET_END, default=DEFAULT_QUIET_END
                            ): TimeSelector(),
                        }
                    ),
                    {"collapsed": True},
                ),
                vol.Required("overnight"): section(
                    vol.Schema(
                        {
                            vol.Optional(
                                CONF_NIGHTLY_ENABLED, default=True
                            ): BooleanSelector(),
                            vol.Optional(
                                CONF_NIGHTLY_TIME, default=DEFAULT_NIGHTLY_TIME
                            ): TimeSelector(),
                            vol.Optional(
                                CONF_QUIET_FINDINGS, default=True
                            ): BooleanSelector(),
                            vol.Optional(CONF_IGNORE, default=""): TextSelector(
                                TextSelectorConfig(
                                    type=TextSelectorType.TEXT, multiline=True
                                )
                            ),
                        }
                    ),
                    {"collapsed": True},
                ),
                vol.Required("briefing"): section(
                    vol.Schema(
                        {
                            vol.Optional(
                                CONF_BRIEFING_ENABLED, default=False
                            ): BooleanSelector(),
                            vol.Optional(
                                CONF_BRIEFING_TIME, default=DEFAULT_BRIEFING_TIME
                            ): TimeSelector(),
                            vol.Optional(CONF_BRIEFING_TARGET): EntitySelector(
                                EntitySelectorConfig(
                                    domain=["assist_satellite", "media_player"],
                                    multiple=True,
                                )
                            ),
                            vol.Optional(CONF_TTS): EntitySelector(
                                EntitySelectorConfig(domain="tts")
                            ),
                            vol.Optional(CONF_WEATHER): EntitySelector(
                                EntitySelectorConfig(domain="weather")
                            ),
                            vol.Optional(CONF_CALENDARS): EntitySelector(
                                EntitySelectorConfig(
                                    domain="calendar", multiple=True
                                )
                            ),
                            vol.Optional(
                                CONF_PERSON_CALENDARS, default=""
                            ): TextSelector(
                                TextSelectorConfig(
                                    type=TextSelectorType.TEXT, multiline=True
                                )
                            ),
                        }
                    ),
                    {"collapsed": True},
                ),
                vol.Required(CONF_VOICE): section(
                    vol.Schema(
                        {
                            vol.Optional(CONF_VOICE_URL): _URL,
                            vol.Optional(CONF_SPEAKER_MAP, default=""): TextSelector(
                                TextSelectorConfig(
                                    type=TextSelectorType.TEXT, multiline=True
                                )
                            ),
                            vol.Optional(CONF_APPROVERS, default=""): TextSelector(
                                TextSelectorConfig(
                                    type=TextSelectorType.TEXT, multiline=True
                                )
                            ),
                            vol.Optional(CONF_VOICE_TOKEN): _PASSWORD,
                            vol.Optional(CONF_PERSON_LISTS, default=""): TextSelector(
                                TextSelectorConfig(
                                    type=TextSelectorType.TEXT, multiline=True
                                )
                            ),
                            vol.Optional(CONF_HOUSEHOLD_LIST): EntitySelector(
                                EntitySelectorConfig(domain="todo")
                            ),
                        }
                    ),
                    {"collapsed": True},
                ),
                vol.Required(CONF_ATV): section(
                    vol.Schema(
                        {
                            vol.Optional(CONF_ATV_ENTITIES): EntitySelector(
                                EntitySelectorConfig(
                                    domain="media_player",
                                    integration="apple_tv",
                                    multiple=True,
                                )
                            ),
                        }
                    ),
                    {"collapsed": True},
                ),
                vol.Required(CONF_HUBBUBB): section(
                    vol.Schema(
                        {
                            vol.Optional(CONF_HUBBUBB_URL): _URL,
                            vol.Optional(CONF_HUBBUBB_ID): str,
                            vol.Optional(CONF_HUBBUBB_SECRET): _PASSWORD,
                            # Multiline, so not a password selector; the
                            # section is collapsed and the values live on
                            # entry.data with the other credentials.
                            vol.Optional(
                                CONF_HUBBUBB_PEOPLE, default=""
                            ): TextSelector(
                                TextSelectorConfig(
                                    type=TextSelectorType.TEXT, multiline=True
                                )
                            ),
                            # The house's OAuth client, for "Sign in with
                            # Hubbubb" in the Voice Studio. Not checked here:
                            # there is no grant to try without a person.
                            vol.Optional(CONF_HUBBUBB_OAUTH_ID): str,
                            vol.Optional(CONF_HUBBUBB_OAUTH_SECRET): _PASSWORD,
                        }
                    ),
                    {"collapsed": True},
                ),
                vol.Required(CONF_COMPANION): section(
                    vol.Schema(
                        {
                            vol.Optional(CONF_COMPANION_URL): _URL,
                            vol.Optional(CONF_COMPANION_TOKEN): _PASSWORD,
                        }
                    ),
                    {"collapsed": True},
                ),
            }
        )

        return self.async_show_form(
            step_id="init",
            data_schema=self.add_suggested_values_to_schema(
                schema, user_input or current
            ),
            errors=errors,
        )
