# Hubbubb Home

A voice assistant for Home Assistant that you name yourself — an animated ring
that listens, a build screen that drives a real coding agent, house memory,
nightly proposals about your home, and a Hubbubb connection.

**Status: pre-alpha.** Cards are extracted and building; the integration lands next.

## What's here

| Card | Tag |
|---|---|
| Animated listening ring + build screen | `custom:hubbubb-ring-card` |
| Apple TV / Siri Remote | `custom:hubbubb-remote-card` |
| Voice timer countdowns | `custom:hubbubb-timers-card` |

Built files live in `custom_components/hubbubb_home/www/` and are served by the
integration, so there are no Lovelace resources to register by hand.

## Build

    npm install && npm run build && npm test

## Licence

MIT
