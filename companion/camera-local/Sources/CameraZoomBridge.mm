#include <algorithm>
#include <memory>
#include <map>
#include <mutex>
#include <string>
#include <vector>

#include "uvc_camera.h"

namespace {
std::mutex cameraMutex;
std::unique_ptr<uvc::UVCCameraController> cameraController;
std::unique_ptr<uvc::UVCCameraExtendController> cameraExtendController;
CameraControlInfo zoomRange{};
CameraControlInfo panRange{};
CameraControlInfo tiltRange{};
bool trackingModeAvailable = false;
int cachedTrackingState = 0;
}

extern "C" int HubbubbLinkCameraZoomInitialize(long *minimum, long *maximum, long *step, long *current) {
    std::lock_guard<std::mutex> lock(cameraMutex);
    std::vector<UVCCameraInfo> cameras;
    uvc::GetUVCCameraList(cameras);
    const auto found = std::find_if(cameras.begin(), cameras.end(), [](const UVCCameraInfo &camera) {
        return camera.friendly_name.find("Insta360 Link 2") != std::string::npos
            || camera.display_name.find("Insta360 Link 2") != std::string::npos;
    });
    if (found == cameras.end()) return 0;

    auto candidate = std::make_unique<uvc::UVCCameraController>(*found);
    auto extendCandidate = std::make_unique<uvc::UVCCameraExtendController>(*found);
    candidate->GetPanTiltAbsoluteRange(panRange, tiltRange);
    cameraController = std::move(candidate);
    cameraExtendController = std::move(extendCandidate);
    VideoMode currentMode = VideoMode::Normal;
    VideoModeAuxiliaryData auxiliary{};
    trackingModeAvailable = cameraExtendController->GetVideoMode(currentMode, auxiliary);
    std::map<ExtendFuction, bool> extendStatus;
    if (cameraExtendController->GetExtendFuncStatus(extendStatus)) {
        const auto tracking = extendStatus.find(ExtendFuction::EnableTracking);
        if (tracking != extendStatus.end()) cachedTrackingState = tracking->second ? 1 : 0;
    } else {
        cachedTrackingState = trackingModeAvailable && static_cast<int>(currentMode) == 2 ? 1 : 0;
    }
    long value = 0;
    if (!cameraController->GetZoomAbsoluteRange(zoomRange) || !cameraController->GetZoomAbsolute(value)) return 0;
    if (minimum) *minimum = zoomRange.min;
    if (maximum) *maximum = zoomRange.max;
    if (step) *step = std::max(1L, zoomRange.step);
    if (current) *current = value;
    return 1;
}

extern "C" int HubbubbLinkCameraPanStep(int direction) {
    std::lock_guard<std::mutex> lock(cameraMutex);
    if (!cameraController || (direction != -1 && direction != 1)) return 0;
    if (!cameraController->GetPanTiltAbsoluteRange(panRange, tiltRange)) return 0;
    // Range.cur tracks current position in the Link SDK's UVC controller.
    const long step = std::max(1L, panRange.step) * 6; // about 6 degrees per click
    const long targetPan = std::clamp(panRange.cur + direction * step, panRange.min, panRange.max);
    return cameraController->SetPanTiltAbsolute(targetPan, tiltRange.cur) ? 1 : 0;
}

constexpr float unitsPerDegree = 3600.0f;

// Where the camera points, in degrees (0, 0 = straight ahead).
extern "C" int HubbubbLinkCameraGetPosition(float *pan, float *tilt) {
    std::lock_guard<std::mutex> lock(cameraMutex);
    if (!cameraController || !cameraController->GetPanTiltAbsoluteRange(panRange, tiltRange)) return 0;
    if (pan) *pan = panRange.cur / unitsPerDegree;
    if (tilt) *tilt = tiltRange.cur / unitsPerDegree;
    return 1;
}

// Point the camera at pan/tilt degrees, clamped to what it can reach.
extern "C" int HubbubbLinkCameraPointAt(float pan, float tilt) {
    std::lock_guard<std::mutex> lock(cameraMutex);
    if (!cameraController || !cameraController->GetPanTiltAbsoluteRange(panRange, tiltRange)) return 0;
    const long targetPan = std::clamp(std::lround(pan * unitsPerDegree), panRange.min, panRange.max);
    const long targetTilt = std::clamp(std::lround(tilt * unitsPerDegree), tiltRange.min, tiltRange.max);
    return cameraController->SetPanTiltAbsolute(targetPan, targetTilt) ? 1 : 0;
}

// Move the camera by pan/tilt degrees from where it points now.
extern "C" int HubbubbLinkCameraNudge(float pan, float tilt) {
    std::lock_guard<std::mutex> lock(cameraMutex);
    if (!cameraController || !cameraController->GetPanTiltAbsoluteRange(panRange, tiltRange)) return 0;
    const long targetPan = std::clamp(panRange.cur + std::lround(pan * unitsPerDegree), panRange.min, panRange.max);
    const long targetTilt = std::clamp(tiltRange.cur + std::lround(tilt * unitsPerDegree), tiltRange.min, tiltRange.max);
    return cameraController->SetPanTiltAbsolute(targetPan, targetTilt) ? 1 : 0;
}

// What the camera itself says: its zoom (raw units) and framing mode, where
// 0 is normal and anything else is the Link 2 framing on its own.
extern "C" int HubbubbLinkCameraDiagnostics(long *zoom, int *videoMode) {
    std::lock_guard<std::mutex> lock(cameraMutex);
    if (!cameraController || !cameraController->GetZoomAbsolute(*zoom)) return 0;
    VideoMode mode = VideoMode::Normal;
    VideoModeAuxiliaryData auxiliary{};
    *videoMode = cameraExtendController && cameraExtendController->GetVideoMode(mode, auxiliary) ? static_cast<int>(mode) : -1;
    return 1;
}

// Make this app the only thing steering the camera: normal (not AutoFraming
// or tracking) mode, and the Link 2's own hand gestures and AI zoom off - its
// palm and V gestures otherwise flip it into its own framing. Returns a mask
// of what had to change: 1 mode, 2 gestures, 4 AI zoom/tracking.
extern "C" int HubbubbLinkCameraTakeControl() {
    std::lock_guard<std::mutex> lock(cameraMutex);
    if (!cameraExtendController) return 0;
    int changed = 0;
    VideoMode mode = VideoMode::Normal;
    VideoModeAuxiliaryData auxiliary{};
    if (cameraExtendController->GetVideoMode(mode, auxiliary) && mode != VideoMode::Normal) {
        VideoModeAuxiliaryData none{};
        if (cameraExtendController->SetVideoMode(VideoMode::Normal, none)) changed |= 1;
    }
    std::map<Gesture, bool> gestures;
    if (cameraExtendController->GetGestureStatus(gestures)) {
        // One by one: the per-gesture status ignores EnableAllGesture, so only
        // this makes the next check come back quiet.
        for (const auto &entry : gestures) {
            if (entry.second && cameraExtendController->EnableGestureWork(entry.first, false)) changed |= 2;
        }
    }
    std::map<ExtendFuction, bool> functions;
    if (cameraExtendController->GetExtendFuncStatus(functions)) {
        for (auto func : {ExtendFuction::AiZoom, ExtendFuction::EnableTracking, ExtendFuction::EnableSingleTapTracking}) {
            const auto found = functions.find(func);
            if (found != functions.end() && found->second && cameraExtendController->EnableExtendFuncWork(func, false)) changed |= 4;
        }
    }
    return changed;
}

// Read-only identity: serial number and firmware, as "serial|firmware".
extern "C" int HubbubbLinkCameraIdentity(char *buffer, int size) {
    std::lock_guard<std::mutex> lock(cameraMutex);
    if (!cameraExtendController || !buffer || size <= 0) return 0;
    std::string serial;
    DeviceInfo info{};
    cameraExtendController->GetSerialNumber(serial);
    cameraExtendController->GetDeviceInfo(info);
    snprintf(buffer, size, "%s|%s", serial.c_str(), info.hostFirmwareVer.c_str());
    return 1;
}

extern "C" int HubbubbLinkCameraZoomSet(long value) {
    std::lock_guard<std::mutex> lock(cameraMutex);
    if (!cameraController) return 0;
    value = std::clamp(value, zoomRange.min, zoomRange.max);
    const long step = std::max(1L, zoomRange.step);
    value = zoomRange.min + ((value - zoomRange.min + step / 2) / step) * step;
    value = std::clamp(value, zoomRange.min, zoomRange.max);
    return cameraController->SetZoomAbsolute(value) ? 1 : 0;
}

// Picture controls, by name: brightness, contrast, sharpness, white_balance
// (kelvin), white_balance_auto (0/1), exposure (EV, -3..+3) and iso (read
// only, what auto-exposure picked). -> 1 when read, with the range when the
// camera reports one (else min = max = 0).
extern "C" int HubbubbLinkCameraPictureGet(const char *name, double *value, double *minimum, double *maximum, double *step) {
    std::lock_guard<std::mutex> lock(cameraMutex);
    if (!cameraController || !cameraExtendController || !name) return 0;
    const std::string key(name);
    CameraControlInfo info{};
    bool ok = false;
    *minimum = *maximum = 0; *step = 1;
    if (key == "brightness") { int16_t v = 0; ok = cameraController->GetBrightnessValue(v) && cameraController->GetBrightnessRange(info); *value = v; }
    else if (key == "contrast") { uint16_t v = 0; ok = cameraController->GetContrastValue(v) && cameraController->GetContrastRange(info); *value = v; }
    else if (key == "sharpness") { uint16_t v = 0; ok = cameraController->GetSharpnessValue(v) && cameraController->GetSharpnessRange(info); *value = v; }
    else if (key == "white_balance") { uint16_t v = 0; ok = cameraController->GetWhitebalanceTemperatureValue(v) && cameraController->GetWhitebalanceTemperatureRange(info); *value = v; }
    else if (key == "white_balance_auto") { uint8_t m = 0; ok = cameraController->GetWhitebalanceTemperatureMode(m); *value = m; *maximum = 1; }
    else if (key == "exposure") { float v = 0; ok = cameraExtendController->GetExposureCompensation(v); *value = v; *minimum = -3; *maximum = 3; *step = 0.3; }
    else if (key == "iso") { uint16_t v = 0; ok = cameraExtendController->GetISOValue(v); *value = v; }
    if (info.max > info.min) { *minimum = info.min; *maximum = info.max; *step = std::max(1L, info.step); }
    return ok ? 1 : 0;
}

extern "C" int HubbubbLinkCameraPictureSet(const char *name, double value) {
    std::lock_guard<std::mutex> lock(cameraMutex);
    if (!cameraController || !cameraExtendController || !name) return 0;
    const std::string key(name);
    if (key == "brightness") return cameraController->SetBrightnessValue(static_cast<int16_t>(value)) ? 1 : 0;
    if (key == "contrast") return cameraController->SetContrastValue(static_cast<uint16_t>(value)) ? 1 : 0;
    if (key == "sharpness") return cameraController->SetSharpnessValue(static_cast<uint16_t>(value)) ? 1 : 0;
    // A temperature only sticks with auto white balance off.
    if (key == "white_balance") return cameraController->SetWhitebalanceTemperatureMode(0)
        && cameraController->SetWhitebalanceTemperatureValue(static_cast<uint16_t>(value)) ? 1 : 0;
    if (key == "white_balance_auto") return cameraController->SetWhitebalanceTemperatureMode(value > 0.5 ? 1 : 0) ? 1 : 0;
    if (key == "exposure") return cameraExtendController->SetExposureCompensation(static_cast<float>(std::clamp(value, -3.0, 3.0))) ? 1 : 0;
    return 0;
}
