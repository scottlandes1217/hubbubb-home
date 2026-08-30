# Wake words

The wake word is decided on the satellite itself, before any audio reaches
this service — changing it never touches the STT or speaker-ID setup.

## Stock "Hey Jarvis" (zero code)

The Home Assistant Voice PE ships with three on-device microWakeWord models:
**Okay Nabu**, **Hey Jarvis**, and **Hey Mycroft**. Switch in the device page:
Settings → Devices & Services → ESPHome → your Voice PE → the **Wake word**
select. Done in thirty seconds.

## A fully custom phrase

Train your own microWakeWord model and load it into the puck's ESPHome config:

1. Use the official microWakeWord training notebook
   (<https://github.com/kahrendt/microWakeWord> — `notebooks/`, runs on Colab
   with a GPU runtime). It generates thousands of synthetic clips of your
   phrase with Piper voices, augments them with room noise, and distills a
   model small enough for the puck.
2. The notebook outputs a `.tflite` model plus a JSON manifest. Host both (a
   GitHub raw URL works) and reference the manifest from the Voice PE's
   ESPHome config:

   ```yaml
   micro_wake_word:
     models:
       - model: https://example.com/your_phrase.json
   ```

   then reflash from the ESPHome dashboard.
3. Expect a tuning loop: the notebook's probability cutoff and the number of
   training steps trade false accepts against missed wakes. Test in the real
   room, not just the notebook's metrics.

**Household bias**: the training set is synthetic by default, which makes the
model speaker-independent. Mixing in real recordings of the household saying
the phrase (the notebook accepts extra positive samples) biases it toward the
voices that actually live here — fewer TV-triggered wakes, and it pairs
naturally with the enrollment clips the speaker-ID service collects.
