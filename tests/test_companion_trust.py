"""Test Build trust dialogs against the repo or an installed companion."""
import ast
from pathlib import Path
import re
import sys
import unittest
from unittest.mock import Mock

SOURCE = (Path(sys.argv.pop()) if len(sys.argv) > 1 else
          Path(__file__).resolve().parents[1] / "companion/claude-code-companion.py")
SCREEN = """
Accessing workspace:

 /Users/example/Projects/home

Quick safety check: Is this a project you created or one you trust?
Claude Code'll be able to read, edit, and execute files here.

Security guide

❯ No, exit
  Yes, I trust this folder

Enter to confirm · Esc to cancel
"""


class TrustTests(unittest.TestCase):
    def setUp(self):
        names = {"workspace_trust_prompt", "answer_workspace_trust",
                 "pane_extras", "merge_ask"}
        nodes = [n for n in ast.parse(SOURCE.read_text()).body
                 if isinstance(n, ast.FunctionDef) and n.name in names]
        self.env = {"re": re, "capture_pane": Mock(return_value=SCREEN),
                    "subprocess": Mock(), "TMUX": "tmux"}
        exec(compile(ast.Module(body=nodes, type_ignores=[]), str(SOURCE),
                     "exec"), self.env)

    def test_full_warning_and_choices_reach_build(self):
        ask, activity = self.env["pane_extras"]("@9", SCREEN)
        self.assertIsNone(activity)
        self.assertIn("/Users/example/Projects/home", ask["text"])
        self.assertIn("read, edit, and execute", ask["text"])
        self.assertEqual([o["key"] for o in ask["options"]], ["×", "✓"])
        self.assertIs(self.env["merge_ask"](ask, {"questions": []}), ask)

    def test_accept_moves_then_confirms(self):
        self.env["answer_workspace_trust"]("@9", "✓")
        self.env["subprocess"].run.assert_called_once_with(
            ["tmux", "send-keys", "-t", "@9", "Down", "Enter"], check=True)

    def test_decline_confirms_no(self):
        self.env["answer_workspace_trust"]("@9", "×")
        self.env["subprocess"].run.assert_called_once_with(
            ["tmux", "send-keys", "-t", "@9", "Enter"], check=True)

    def test_decline_when_yes_is_selected(self):
        self.env["capture_pane"].return_value = SCREEN.replace(
            "❯ No, exit", "No, exit").replace(
            "  Yes, I trust this folder", "❯ Yes, I trust this folder")
        self.env["answer_workspace_trust"]("@9", "×")
        self.env["subprocess"].run.assert_called_once_with(
            ["tmux", "send-keys", "-t", "@9", "Up", "Enter"], check=True)

    def test_stale_prompt_cannot_receive_confirmation(self):
        self.env["capture_pane"].return_value = SCREEN + "\n➜ home git:(main)\n"
        with self.assertRaises(ValueError):
            self.env["answer_workspace_trust"]("@9", "✓")
        self.env["subprocess"].run.assert_not_called()

    def test_numbered_dialog_still_works(self):
        ask, _ = self.env["pane_extras"](
            "@9", "Continue?\n❯ 1. Yes\n  2. No\nEnter to select")
        self.assertEqual([o["key"] for o in ask["options"]], ["1", "2"])


if __name__ == "__main__":
    unittest.main()
