""".venv/bin/python test_listen.py - the stage-2 word match, on what Whisper
actually wrote for real puck clips (2026-11-23 replays)."""
from listen import says_jarvis

for heard in ["Jarvis.", "Hey, Javas.", "Page, Arvis.", "Jervis, turn on the light",
              "What? Jarvis. I uh."]:
    assert says_jarvis(heard), heard
for heard in ["Thanks, Travis.", "Service!", "Charges!", "Hey, drivers, walk time.",
              "Sorry, miss.", "", "I fucking love those guys."]:
    assert not says_jarvis(heard), heard
print("listen ok")
