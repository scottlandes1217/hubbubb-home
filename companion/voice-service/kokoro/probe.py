"""Self-check: Describe answers, every British male synthesizes. Fails loud."""
import asyncio, struct, sys, time
from wyoming.client import AsyncTcpClient
from wyoming.info import Describe, Info
from wyoming.tts import Synthesize, SynthesizeVoice
from wyoming.audio import AudioChunk, AudioStop

TEXT = "Good evening sir. The front door is locked, and your first meeting is at ten."

async def main():
    client = AsyncTcpClient("127.0.0.1", 10201)
    await client.connect()
    await client.write_event(Describe().event())
    event = await client.read_event()
    assert Info.is_type(event.type), event.type
    info = Info.from_event(event)
    names = [v.name for v in info.tts[0].voices]
    assert "en-GB" in info.tts[0].voices[0].languages
    print(f"describe ok: {len(names)} voices advertised")
    await client.disconnect()

    for voice in ("bm_george", "bm_fable", "bm_lewis", "bm_daniel"):
        assert voice in names, voice
        client = AsyncTcpClient("127.0.0.1", 10201)
        await client.connect()
        t0 = time.monotonic()
        await client.write_event(
            Synthesize(text=TEXT, voice=SynthesizeVoice(name=voice)).event())
        frames, rate, peak = 0, 24000, 0
        while True:
            event = await client.read_event()
            if event is None or AudioStop.is_type(event.type):
                break
            if AudioChunk.is_type(event.type):
                chunk = AudioChunk.from_event(event)
                rate = chunk.rate
                frames += len(chunk.audio) // 2
                samples = struct.unpack(f"<{len(chunk.audio)//2}h", chunk.audio)
                peak = max(peak, max(abs(s) for s in samples))
        wall = time.monotonic() - t0
        assert frames > rate, "under a second of audio"
        assert peak > 3000, f"near-silent output (peak {peak})"
        print(f"{voice}: {frames/rate:.2f}s audio @ {rate}Hz in {wall:.2f}s, peak {peak/32767:.0%}")
        await client.disconnect()
    print("self-check passed")

asyncio.run(main())
