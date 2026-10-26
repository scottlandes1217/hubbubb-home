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
long searchCenterPan = 0;
bool searchCenterValid = false;
constexpr long initialSearchRadius = 5L * 3600L;
long searchRadius = initialSearchRadius;
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

extern "C" int HubbubbLinkCameraSearchBegin() {
    std::lock_guard<std::mutex> lock(cameraMutex);
    if (!cameraController || !cameraController->GetPanTiltAbsoluteRange(panRange, tiltRange)) return 0;
    searchCenterPan = panRange.cur;
    searchCenterValid = true;
    searchRadius = initialSearchRadius;
    return 1;
}

// Search around the pan position where the person disappeared. Returns the
// direction to use next; it reverses at the window edges and doubles the
// window each time, so a search that started on the wrong thing (a dog's
// face) widens to the whole room instead of circling it forever.
extern "C" int HubbubbLinkCameraSearchStep(int direction) {
    std::lock_guard<std::mutex> lock(cameraMutex);
    if (!cameraController || (direction != -1 && direction != 1)) return 0;
    if (!cameraController->GetPanTiltAbsoluteRange(panRange, tiltRange)) return 0;
    const long step = std::max(1L, panRange.step) * 8; // quicker local sweep steps
    if (!searchCenterValid) {
        searchCenterPan = panRange.cur;
        searchCenterValid = true;
    }
    const long low = std::max(panRange.min, searchCenterPan - searchRadius);
    const long high = std::min(panRange.max, searchCenterPan + searchRadius);
    const long targetPan = std::clamp(panRange.cur + direction * step, low, high);
    if (targetPan == panRange.cur) {
        searchRadius = std::min(searchRadius * 2, panRange.max - panRange.min);
        return -direction;
    }
    return cameraController->SetPanTiltAbsolute(targetPan, tiltRange.cur) ? direction : 0;
}

// Pan to a fraction of the full range: -1 far left, 0 center, 1 far right.
extern "C" int HubbubbLinkCameraPanTo(float fraction) {
    std::lock_guard<std::mutex> lock(cameraMutex);
    if (!cameraController || !cameraController->GetPanTiltAbsoluteRange(panRange, tiltRange)) return 0;
    const long middle = (panRange.min + panRange.max) / 2;
    const long half = (panRange.max - panRange.min) / 2;
    const long target = std::clamp(middle + std::lround(std::clamp(fraction, -1.0f, 1.0f) * half),
                                   panRange.min, panRange.max);
    return cameraController->SetPanTiltAbsolute(target, tiltRange.cur) ? 1 : 0;
}

// Where the camera points now, on the same -1...1 scale; 0 if unknown.
extern "C" float HubbubbLinkCameraPanFraction() {
    std::lock_guard<std::mutex> lock(cameraMutex);
    if (!cameraController || !cameraController->GetPanTiltAbsoluteRange(panRange, tiltRange)) return 0;
    const long half = std::max(1L, (panRange.max - panRange.min) / 2);
    return static_cast<float>(panRange.cur - (panRange.min + panRange.max) / 2) / half;
}

extern "C" int HubbubbLinkCameraFollowFace(float centerX, float centerY) {
    std::lock_guard<std::mutex> lock(cameraMutex);
    if (!cameraController || centerX < 0.0f || centerX > 1.0f || centerY < 0.0f || centerY > 1.0f) return 0;
    if (!cameraController->GetPanTiltAbsoluteRange(panRange, tiltRange)) return 0;

    const float horizontalError = centerX - 0.5f;
    const float verticalError = centerY - 0.5f;
    constexpr float deadZone = 0.08f;
    if (std::abs(horizontalError) < deadZone && std::abs(verticalError) < deadZone) return 1;

    constexpr float unitsPerDegree = 3600.0f;
    constexpr float degreesPerFrameError = 10.0f;
    constexpr float maxDegreesPerUpdate = 0.65f;
    const long panStep = std::max(1L, panRange.step);
    const long tiltStep = std::max(1L, tiltRange.step);
    auto movement = [=](float error, long step) {
        const float degrees = std::clamp(error * degreesPerFrameError,
                                         -maxDegreesPerUpdate, maxDegreesPerUpdate);
        long units = std::lround(degrees * unitsPerDegree);
        if (units == 0 && std::abs(error) >= deadZone) units = error > 0 ? step : -step;
        return static_cast<long>(std::round(static_cast<double>(units) / step)) * step;
    };

    const long targetPan = std::clamp(panRange.cur + movement(horizontalError, panStep), panRange.min, panRange.max);
    const long targetTilt = std::clamp(tiltRange.cur + movement(verticalError, tiltStep), tiltRange.min, tiltRange.max);
    return cameraController->SetPanTiltAbsolute(targetPan, targetTilt) ? 1 : 0;
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
