#!/bin/bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
APP="$ROOT/dist/Hubbubb Local Camera.app"
rm -rf "$ROOT/dist/Jarvis Local Camera.app"
CONTENTS="$APP/Contents"
SDK="$ROOT/vendor/Link-SDK/UVCCamera_mac"
FRAMEWORKS="$CONTENTS/Frameworks"

if [[ ! -f "$SDK/include/uvc_camera.h" || ! -f "$SDK/bin/libUVCCamera.dylib" ]]; then
  echo "Insta360 Link SDK is missing. From this directory run: git clone --depth 1 https://github.com/Insta360Develop/Link-SDK.git vendor/Link-SDK" >&2
  exit 1
fi

mkdir -p "$CONTENTS/MacOS"
mkdir -p "$FRAMEWORKS"
cp "$ROOT/Info.plist" "$CONTENTS/Info.plist"
cp "$SDK/bin/libUVCCamera.dylib" "$FRAMEWORKS/libUVCCamera.dylib"
xcrun clang++ -std=c++17 -O2 -dynamiclib \
  -I "$SDK/include" \
  "$ROOT/Sources/CameraZoomBridge.mm" \
  -L "$FRAMEWORKS" -lUVCCamera \
  -Wl,-rpath,@loader_path \
  -framework CoreFoundation -framework IOKit -framework Security \
  -o "$FRAMEWORKS/libHubbubbCameraControls.dylib"
xcrun swiftc -O \
  -parse-as-library \
  -L "$FRAMEWORKS" -lHubbubbCameraControls \
  -Xlinker -rpath -Xlinker @executable_path/../Frameworks \
  -framework AppKit \
  -framework AVFoundation \
  -framework Vision \
  -framework Security \
  -framework Network \
  -framework ServiceManagement \
  "$ROOT/Sources/HubbubbLocalCamera.swift" \
  -o "$CONTENTS/MacOS/HubbubbLocalCamera"

SIGNING_IDENTITY="Apple Development: Scott Landes (G2SW88SJM4)"
codesign --force --deep --sign "$SIGNING_IDENTITY" "$APP"

echo "Built: $APP"

