"""Sentence splitting for streamed TTS: only split where a human would.

Run from voice-service/:  kokoro/.venv/bin/python tests/sentence_check.py
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "kokoro"))

from server import split_sentences as split


def main():
    # one sentence in, one sentence out - short replies behave as before
    assert split("The front door is locked.") == ["The front door is locked."]
    assert split("Done") == ["Done"]
    assert split("") == []

    # the point of the exercise
    assert split("Good evening sir. The front door is locked, and your "
                 "first meeting is at ten.") == [
        "Good evening sir.",
        "The front door is locked, and your first meeting is at ten.",
    ]
    assert len(split("Is the garage shut? It is. I closed it an hour ago.")) == 2

    # decimals and numbers stay whole
    assert split("It is 21.5 degrees outside and the pool is at 28.3 "
                 "degrees.") == [
        "It is 21.5 degrees outside and the pool is at 28.3 degrees."]
    assert split("The reading is 1. 5 volts on that line.") == [
        "The reading is 1. 5 volts on that line."]

    # abbreviations, times and initials
    assert split("Dr. Nolan is here to see you about the roof.") == [
        "Dr. Nolan is here to see you about the roof."]
    assert split("Your meeting is at 3 p.m. Vega is picking up the "
                 "children.") == [
        "Your meeting is at 3 p.m. Vega is picking up the children."]
    assert split("Mrs. Hale called, e.g. About the fence again.") == [
        "Mrs. Hale called, e.g. About the fence again."]
    assert split("J. K. Rowling is on the shelf in the hall.") == [
        "J. K. Rowling is on the shelf in the hall."]

    # ellipsis is a pause, not a boundary
    assert split("Well... Nobody has fed the cat this evening.") == [
        "Well... Nobody has fed the cat this evening."]

    # a short trailing fragment rides on the sentence before it
    assert split("The laundry timer has eight minutes left. Nothing "
                 "else.") == [
        "The laundry timer has eight minutes left. Nothing else."]
    # ...but a real second sentence stands on its own
    assert split("The laundry timer has eight minutes left. Nothing else "
                 "needs you tonight.") == [
        "The laundry timer has eight minutes left.",
        "Nothing else needs you tonight.",
    ]

    # every split is lossless apart from the whitespace between sentences
    for text in ("One thing here. Then another thing. And a third thing now.",
                 "Ready? Set. Go and open the garage door for me."):
        assert " ".join(split(text)) == " ".join(text.split())

    print("sentence check ok")


main()
