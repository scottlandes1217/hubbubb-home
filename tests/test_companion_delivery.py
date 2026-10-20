"""Exercise delivery without loading the daemon's local account configuration."""
import ast
from pathlib import Path
import sys
import unittest
from unittest.mock import Mock


SOURCE = (Path(sys.argv.pop()) if len(sys.argv) > 1 else
          Path(__file__).resolve().parents[1] / "companion/claude-code-companion.py")


class DeliveryTests(unittest.TestCase):
    def setUp(self):
        tree = ast.parse(SOURCE.read_text())
        delivery = next(n for n in tree.body
                        if isinstance(n, ast.FunctionDef) and n.name == "deliver")
        self.env = {
            "window_exists": Mock(return_value=True),
            "find_claude": Mock(return_value=True),
            "capture_pane": Mock(return_value="❯"),
            "clear_composer": Mock(),
            "subprocess": Mock(), "time": Mock(),
            "mark_voice_prompt": Mock(), "tag_owner": Mock(),
            "TMUX": "tmux", "PASTE_BUFFER": "test",
        }
        exec(compile(ast.Module(body=[delivery], type_ignores=[]),
                     str(SOURCE), "exec"), self.env)

    def test_trust_prompt_does_not_receive_keys(self):
        self.env["capture_pane"].return_value = (
            "❯ No, exit\n  Yes, I trust this folder\nEnter to confirm")
        ok, detail = self.env["deliver"]("hello", "@9", spoken=False)
        self.assertFalse(ok)
        self.assertIn("trust approval", detail)
        self.env["subprocess"].run.assert_not_called()
        self.env["clear_composer"].assert_not_called()
        self.env["capture_pane"].assert_called_once_with("@9", 0)

    def test_ready_composer_receives_message(self):
        self.assertEqual(self.env["deliver"]("hello", "@9", spoken=False),
                         (True, "sent"))
        calls = self.env["subprocess"].run.call_args_list
        self.assertEqual(calls[0].kwargs["input"], b"hello")
        self.assertEqual(calls[-1].args[0][-1], "Enter")

    def test_exited_session_does_not_receive_keys(self):
        self.env["find_claude"].return_value = None
        self.assertFalse(self.env["deliver"]("hello", "@9")[0])
        self.env["subprocess"].run.assert_not_called()


if __name__ == "__main__":
    unittest.main()
