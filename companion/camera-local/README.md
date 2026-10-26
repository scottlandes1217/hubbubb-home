# Hubbubb Local Camera

A small macOS prototype that reads the Insta360 Link 2 as a USB webcam and
uses Apple's Vision framework to recognize gestures locally. It displays the
full camera frame and uses the Link 2's hardware zoom control for manual or
face-based zoom. It does not digitally crop the preview in the Mac app. No
camera frames are uploaded or sent to any network service.

## Build

From this directory:

```sh
./build.sh
open "dist/Hubbubb Local Camera.app"
```

The build uses Insta360's official Link SDK for Link 2 lens zoom and pan/tilt
controls. The SDK checkout is kept in the ignored `vendor/`
directory and is bundled inside the app for local use. To set up a fresh
checkout, run:

```sh
git clone --depth 1 https://github.com/Insta360Develop/Link-SDK.git vendor/Link-SDK
```

The first launch asks macOS for camera access. The app requires macOS 14 or
newer and Xcode Command Line Tools with Swift and clang++. Quit Insta360 Link
Controller before launching so it releases the camera controls.

## Prototype behavior

- Prefers the **Insta360 Link 2** and tries 4K capture, falling back to 1080p.
- Uses local face detection to adjust the camera's hardware zoom. It leaves the
  camera's full feed intact; it does not digitally crop the preview.
- The zoom slider controls the Link 2's hardware zoom range (reported as 1×–4×).
- Left and right arrows on the preview pan the Link 2 by a small step per click.
- The AI following checkbox enables local Vision face detection to steer the
  camera's pan and tilt toward a visible face, using a damped, slower response
  to reduce jitter. No image is sent to a service.
- Runs Apple's built-in hand-pose Vision request locally on every third frame.
- Recognizes thumbs-up, thumbs-down, open palm, and peace sign. The controls
  panel shows each gesture's assigned action and has a test button.
- Thumbs up / thumbs down step the TV volume up / down, repeating every
  0.35 s while held (`volumeRepeatInterval`).
- Three fingers switches the Sync Box to Mac Second Display and extends the
  Mac to the Samsung via Screen Mirroring; one or two fingers stop extending. Configure a local Home Assistant URL, `media_player`
  entity, and access token in the app. The token is kept in macOS Keychain and
  the app only accepts local network hosts for this connection.
- Auto-zoom can be enabled or disabled from the panel; moving the zoom slider
  switches to manual camera zoom.
- Fires a local demo event after a steady detection. The event is written to
  the app's local console and shown in a prominent preview-window banner. It
  sends no cloud AI request. Configured Home Assistant actions send only the
  selected volume service command and entity ID over the local network.
- Uses no cloud model or runtime account. The only external dependency is
  Insta360's SDK for local camera controls.

This is a capture and local-inference prototype, not yet a virtual webcam.

