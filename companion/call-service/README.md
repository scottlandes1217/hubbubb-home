# Call service (Twilio Media Streams, port 8790)

Jarvis on the telephone. Twilio holds the call and streams the audio here over
one websocket; this service transcribes it on the STT the pucks already use,
asks a Home Assistant conversation agent what to say, and streams Kokoro's
reply back down the same socket. A call is just a very long-distance
microphone, so nothing here re-implements the voice stack.

- **Ports**: listens on 8790. Uses the Wyoming STT on 10300 and Kokoro on
  10201 — both already running as `com.hubbubb.voice-service` and
  `com.hubbubb.kokoro`.
- **Audio**: Twilio is 8 kHz mu-law in 20 ms frames both directions. `audioop`
  does the conversion, which is why the venv is Python 3.12 — 3.13 removed it.
- **The brain** is the Anthropic API called directly, and deliberately *not* an
  HA conversation agent. Measured on this house, same question, same models:

  | brain | to first spoken sentence |
  |---|---|
  | `conversation.ollama_mac` | 61.5s |
  | `conversation.claude_conversation` | 17.9s |
  | API direct, `claude-opus-5` effort low | 2.0s |
  | API direct, `claude-haiku-4-5` | 0.7s |

  HA ships the model every entity in the house on every turn. Latency is prompt
  size, and a caller does not need to know the state of the lights. The reply
  streams sentence by sentence into the voice, so the caller waits for a clause
  rather than a paragraph.
- **Turn-taking** is energy VAD: 700 ms of silence ends the caller's turn, and
  the caller talking over Jarvis cancels the reply and clears Twilio's buffer.

## Why the STT needs a name

Everything else on port 10300 is the puck in the living room, and `process()`
does a pile of things that are only true of that room: the self-echo fence
(the puck's line-out feeds its own microphone), speaker identification,
wake-word capture, and the household speaker webhook. A phone call is none of
those — there is no acoustic path from Jarvis's voice back into the caller's
microphone, the caller is not a household member, and HA must not be told
someone spoke in the house.

So a call announces itself: `Transcribe(name="call")`. The voice service reads
that name and takes the transcription-only path. Both sides share the constant
`CALL_CLIENT`. Without it a caller who repeats Jarvis back gets silently
dropped by the echo fence, which is a very hard bug to see from the outside.

## Test

```sh
.venv/bin/python service.py --self-check
```

No network: the mu-law/rate maths and the turn detector, which is where the
bugs are. The two integration legs are checked by round-tripping Kokoro's
output through the STT — it must come back as text under `name="call"` and as
`''` without it (the fence, still working for the house).

## Where the time goes

End to end, caller stops talking to first word back: **3.9s on Haiku, 6.7s on
Opus 5**. The remaining budget, in the order worth attacking:

1. **STT, 1.6-2.4s** and it grows with utterance length - faster-whisper is
   CPU-only on this Mac. `mlx-whisper` would put it on the M1's GPU.
2. **TTS, 1.2s** to the first frame. Piper on 10200 does it in 0.8s, and
   Kokoro's warmth is mostly thrown away by an 8 kHz mu-law phone codec
   anyway - worth an A/B on a real call.
3. **The 700 ms VAD hangover** is dead air on every turn. Transcribing
   speculatively at silence onset and discarding it if the caller resumes
   would hide it behind work already being done.

Note the phone band costs accuracy too: whisper heard "Bob" as "Barb" through
mu-law. Names are worth confirming back to the caller.

## Credentials

In the **login keychain**, never in this repo - the same place the share-remount
agent keeps its password. Read them with:

```sh
security find-generic-password -s jarvis-twilio -a account-sid    -w
security find-generic-password -s jarvis-twilio -a api-key-sid    -w
security find-generic-password -s jarvis-twilio -a api-key-secret -w
```

Twilio's REST auth is basic auth with the API key SID as the username and its
secret as the password, against `/Accounts/<account-sid>/` - the API key alone
is not enough, which is why all three are stored. The Anthropic key is not here;
it is read from HA's own config entry (see `ha_api_key`), so there is one key to
rotate rather than two.

The account is a **full** account, not a trial,
so calls can reach any number with no trial announcement in front of them.

## Still to wire

- A Twilio number to answer on, and `**61*<number>*11*20#` on the iPhone so
  unanswered calls forward here after 20 s.
- A public `wss://` endpoint. The droplet at 164.92.90.132 already reaches this
  Mac over WireGuard, so it needs a TLS terminator proxying to 10.66.0.2:8790.
- TwiML `<Connect><Stream>` pointing at it; outbound calls pass their
  instructions as `<Parameter name="brief">`.
- A launchd agent, once there is something to answer.
