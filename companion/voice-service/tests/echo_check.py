"""Self-echo fence: transcripts of our own TTS get dropped, humans survive.

Run from voice-service/:  .venv/bin/python tests/echo_check.py
"""

import json
import sys
import tempfile
import time
from pathlib import Path
from types import SimpleNamespace

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import service as svc


def main():
    with tempfile.TemporaryDirectory() as d:
        fake = SimpleNamespace(args=SimpleNamespace(data_dir=d))
        echo = svc.Service._is_self_echo
        tts = ("I was not working a second ago because I was still "
               "thinking about what to do, and I am currently doing it.")
        Path(d, "last-tts.json").write_text(json.dumps(
            [{"ts": time.time() - 5, "duration": 6.0, "text": tts}]))
        # garbled echo of our own playback -> dropped
        assert echo(fake, "I was not working because I was spending the "
                          "second to go, I'm currently doing it.", 5.0)
        # a real request during the window -> kept
        assert not echo(fake, "Set a timer for the laundry for an hour", 4.0)
        # short barge-in -> kept even if its words appear in the TTS
        assert not echo(fake, "not working", 1.0)
        # same echo long after playback ended -> kept
        Path(d, "last-tts.json").write_text(json.dumps(
            [{"ts": time.time() - 300, "duration": 6.0, "text": tts}]))
        assert not echo(fake, "I was not working because I was spending the "
                              "second to go, I'm currently doing it.", 5.0)
        # no file at all -> kept
        Path(d, "last-tts.json").unlink()
        assert not echo(fake, "I was not working because I was", 4.0)

    kill = svc._is_kill_phrase
    assert kill("Cancel.")
    assert kill("No, nevermind!")
    assert kill("Shut the fuck up!")
    assert kill("Jarvis, please stop")
    assert kill("Stop talking.")
    assert not kill("Stop the laundry timer")
    assert not kill("Cancel my three o'clock meeting")
    print("echo check ok")


main()
