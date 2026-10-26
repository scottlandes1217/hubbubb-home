import AppKit
import AVFoundation
import Vision
import Security
import Network
import ServiceManagement


@_silgen_name("HubbubbLinkCameraZoomInitialize")
private func hubbubbLinkCameraZoomInitialize(
    _ minimum: UnsafeMutablePointer<Int>, _ maximum: UnsafeMutablePointer<Int>,
    _ step: UnsafeMutablePointer<Int>, _ current: UnsafeMutablePointer<Int>
) -> Int32

@_silgen_name("HubbubbLinkCameraZoomSet")
private func hubbubbLinkCameraZoomSet(_ value: Int) -> Int32

@_silgen_name("HubbubbLinkCameraPanStep")
private func hubbubbLinkCameraPanStep(_ direction: Int32) -> Int32

@_silgen_name("HubbubbLinkCameraGetPosition")
private func hubbubbLinkCameraGetPosition(_ pan: UnsafeMutablePointer<Float>, _ tilt: UnsafeMutablePointer<Float>) -> Int32
@_silgen_name("HubbubbLinkCameraPointAt")
private func hubbubbLinkCameraPointAt(_ pan: Float, _ tilt: Float) -> Int32

private func cameraPosition() -> (pan: Float, tilt: Float)? {
    var pan: Float = 0, tilt: Float = 0
    return hubbubbLinkCameraGetPosition(&pan, &tilt) == 1 ? (pan, tilt) : nil
}

/// Where people have actually been seen, as camera pan/tilt in 5° pan bins.
/// Searching only that span skips the walls, the corners and the back of the
/// TV without anyone marking them: nobody is ever seen there.
private struct RoomMap {
    static let binDegrees: Float = 5
    // Sightings before the map is trusted, and per bin before a bin counts
    // (one false detection at the wall must not widen the search for good).
    static let needed = 30
    static let perBin = 3
    var bins: [Int: (count: Int, tiltSum: Float)] = [:]

    mutating func add(pan: Float, tilt: Float) {
        let bin = Int((pan / Self.binDegrees).rounded(.down))
        let old = bins[bin] ?? (0, 0)
        // Capped so years of sitting on the couch don't drown out the kitchen.
        guard old.count < 1000 else { return }
        bins[bin] = (old.count + 1, old.tiltSum + tilt)
    }

    /// Pan span to sweep and the tilt to hold at a given pan, or nil until learned.
    var search: (low: Float, high: Float, tilt: (Float) -> Float)? {
        let trusted = bins.filter { $0.value.count >= Self.perBin }
        guard bins.values.reduce(0, { $0 + $1.count }) >= Self.needed,
              let low = trusted.keys.min(), let high = trusted.keys.max() else { return nil }
        return (Float(low) * Self.binDegrees, Float(high + 1) * Self.binDegrees, { pan in
            // Head height where people were seen nearest this direction.
            let nearest = trusted.min { abs(Float($0.key) * Self.binDegrees - pan) < abs(Float($1.key) * Self.binDegrees - pan) }!
            return nearest.value.tiltSum / Float(nearest.value.count)
        })
    }

    static func load() -> RoomMap {
        var map = RoomMap()
        let stored = UserDefaults.standard.dictionary(forKey: "roomMap") as? [String: [Double]] ?? [:]
        for (key, value) in stored where value.count == 2 {
            if let bin = Int(key) { map.bins[bin] = (Int(value[0]), Float(value[1])) }
        }
        return map
    }

    func save() {
        let stored = Dictionary(uniqueKeysWithValues: bins.map { (String($0.key), [Double($0.value.count), Double($0.value.tiltSum)]) })
        UserDefaults.standard.set(stored, forKey: "roomMap")
    }

    /// `HubbubbLocalCamera --self-test`
    static func selfTest() {
        var map = RoomMap()
        for _ in 0..<20 { map.add(pan: -60, tilt: -20) }   // couch
        precondition(map.search == nil, "not trusted before \(needed) sightings")
        for _ in 0..<12 { map.add(pan: 12, tilt: -5) }     // kitchen, standing
        map.add(pan: 120, tilt: 0)                          // one false hit at the wall
        guard let search = map.search else { fatalError("should be learned") }
        precondition(search.low == -60 && search.high == 15, "span is \(search.low)...\(search.high)")
        precondition(search.tilt(-50) == -20 && search.tilt(10) == -5, "tilt follows the nearest seen spot")
        let still = Gimbal.step(error: CGPoint(x: 0.06, y: 0), zoom: 1, moving: false, gain: 0.45)
        precondition(!still.moving, "small error inside the dead zone stays still")
        let settling = Gimbal.step(error: CGPoint(x: 0.06, y: 0), zoom: 1, moving: true, gain: 0.45)
        precondition(settling.moving && settling.pan > 0, "but finishes a move it started")
        let wide = Gimbal.step(error: CGPoint(x: 0.2, y: 0), zoom: 1, moving: false, gain: 0.45)
        let tight = Gimbal.step(error: CGPoint(x: 0.2, y: 0), zoom: 4, moving: false, gain: 0.45)
        precondition(wide.pan > tight.pan * 3.9 && wide.pan <= 8, "moves scale down with zoom")
        precondition(Gimbal.exitDirection(lastX: 0.8, velocityX: -1) == 1, "edge wins")
        precondition(Gimbal.exitDirection(lastX: 0.5, velocityX: -0.3) == -1, "then motion")
        var book = ItemBook()
        book.items["airpods case"] = .init(name: "AirPods case", description: "", image: "")
        book.items["car keys"] = .init(name: "car keys", description: "", image: "")
        precondition(book.match("Where are my AirPods?")?.name == "AirPods case", "plural and partial names match")
        precondition(book.match("have you seen my key")?.name == "car keys", "singular matches plural")
        precondition(book.match("what's on the whiteboard") == nil, "unrelated questions match nothing")
        // Seated with a laptop: face 0.10 tall with the chin at y 0.60.
        let face = CGRect(x: 0.45, y: 0.60, width: 0.08, height: 0.10)
        let body = CGRect(x: 0.35, y: 0.20, width: 0.30, height: 0.50)
        precondition(GestureGate.isRaised(wrist: CGPoint(x: 0.6, y: 0.50), face: face, body: body, reach: 1.5), "thumbs up at chest counts")
        precondition(!GestureGate.isRaised(wrist: CGPoint(x: 0.5, y: 0.30), face: face, body: body, reach: 1.5), "hands on the keyboard never count")
        precondition(!GestureGate.isRaised(wrist: CGPoint(x: 0.5, y: 0.40), face: nil, body: body, reach: 1.5), "no face: lower body half never counts")
        let head = GestureGate.head(face, hair: 0.9, chin: 0.6)
        precondition(head.contains(CGPoint(x: 0.49, y: 0.56)), "a fork at the mouth, under the chin, is in the head zone")
        precondition(!head.contains(CGPoint(x: 0.6, y: 0.50)), "a thumbs up beside the chest is not")
        let held = (0..<5).map { CGPoint(x: 0.6 + CGFloat($0) * 0.002, y: 0.5) }
        let eating = [CGPoint(x: 0.5, y: 0.3), CGPoint(x: 0.5, y: 0.45), CGPoint(x: 0.5, y: 0.55), CGPoint(x: 0.5, y: 0.4)]
        precondition(GestureGate.isSteady(held, tolerance: 0.02), "a held pose is steady")
        precondition(!GestureGate.isSteady(eating, tolerance: 0.02), "hand-to-mouth is not")
        print("RoomMap self-test passed")
    }
}

@_silgen_name("HubbubbLinkCameraNudge")
private func hubbubbLinkCameraNudge(_ pan: Float, _ tilt: Float) -> Int32

/// Things the user has shown the camera: what each looks like (a description
/// and a cropped photo) and where it was last seen. The photo is handed to the
/// vision model with the room view, so "my AirPods" means *these* AirPods.
private struct ItemBook {
    struct Item: Codable {
        var name: String
        var description: String
        var image: String
        var lastSeen: String?
        var lastSeenAt: Date?
    }
    var items: [String: Item] = [:]

    static var folder: URL {
        FileManager.default.urls(for: .applicationSupportDirectory, in: .userDomainMask)[0]
            .appendingPathComponent("Hubbubb Local Camera/items")
    }

    static func load() -> ItemBook {
        let data = try? Data(contentsOf: folder.appendingPathComponent("items.json"))
        return ItemBook(items: data.flatMap { try? JSONDecoder().decode([String: Item].self, from: $0) } ?? [:])
    }

    func save() throws {
        try FileManager.default.createDirectory(at: Self.folder, withIntermediateDirectories: true)
        try JSONEncoder().encode(items).write(to: Self.folder.appendingPathComponent("items.json"), options: .atomic)
    }

    static func words(_ text: String) -> Set<String> {
        Set(text.lowercased().split { !$0.isLetter && !$0.isNumber }.map { word in
            // "airpods" and "airpod", "keys" and "key" are the same thing here.
            word.count > 3 && word.hasSuffix("s") ? String(word.dropLast()) : String(word)
        })
    }

    /// The taught item a question is about: the one sharing the most
    /// meaningful words with it ("my", "the" and other short words don't count).
    func match(_ question: String) -> Item? {
        let asked = Self.words(question)
        let scored = items.values.map { item in
            (item, Self.words(item.name).filter { $0.count >= 3 && asked.contains($0) }.count)
        }
        return scored.filter { $0.1 > 0 }.max { $0.1 < $1.1 }?.0
    }
}

/// When a hand may gesture at all: raised to chest height or above, judged
/// against its owner's face (Vision y grows upward; face.minY is the chin).
/// Hands on a keyboard or in a lap sit well below that, whatever shape they
/// make. With no face in view, the top half of the upper-body box stands in.
private enum GestureGate {
    static func isRaised(wrist: CGPoint, face: CGRect?, body: CGRect, reach: CGFloat) -> Bool {
        if let face { return wrist.y >= face.minY - face.height * reach }
        return wrist.y >= body.midY
    }

    /// The head, where a hand means eating or a scratch, not a gesture: the face
    /// box, `hair` face heights above it, `chin` below it (the mouth and a fork
    /// on its way there), and a sliver either side. Padding wide to the sides
    /// blocked gestures held beside the face, so the reach is up and down.
    static func head(_ face: CGRect, hair: CGFloat, chin: CGFloat) -> CGRect {
        CGRect(x: face.minX - face.width * 0.15, y: face.minY - face.height * chin,
               width: face.width * 1.3, height: face.height * (1 + hair + chin))
    }

    /// Whether a wrist held still: every recent position within `tolerance`
    /// of their average. Hand-to-mouth eating never settles; a held pose does.
    static func isSteady(_ points: [CGPoint], tolerance: CGFloat) -> Bool {
        guard !points.isEmpty else { return false }
        let mean = CGPoint(x: points.map(\.x).reduce(0, +) / CGFloat(points.count),
                           y: points.map(\.y).reduce(0, +) / CGFloat(points.count))
        return points.allSatisfy { hypot($0.x - mean.x, $0.y - mean.y) <= tolerance }
    }
}

/// The follow controller's math, kept pure so `--self-test` can check it.
private enum Gimbal {
    /// One correction, in degrees, for a subject `error` off center (in frame
    /// fractions). Proportional and zoom-aware, so it neither crawls at 1× nor
    /// overshoots at 4×. Hysteresis: starts beyond 10% off, keeps going until
    /// within 3%, so it settles instead of twitching at the edge of a dead zone.
    static func step(error: CGPoint, zoom: CGFloat, moving: Bool, gain: CGFloat) -> (pan: Float, tilt: Float, moving: Bool) {
        let size = max(abs(error.x), abs(error.y))
        guard moving ? size > 0.03 : size > 0.10 else { return (0, 0, false) }
        // Link 2: about 70° × 43° across the frame at 1×.
        let pan = max(-8, min(8, error.x * 70 / zoom * gain))
        let tilt = max(-5, min(5, error.y * 43 / zoom * gain))
        return (Float(pan), Float(tilt), true)
    }

    /// Which way someone left the frame: the edge they were near, else the
    /// way they were moving.
    static func exitDirection(lastX: CGFloat, velocityX: CGFloat) -> Float {
        if lastX > 0.6 { return 1 }
        if lastX < 0.4 { return -1 }
        return velocityX >= 0 ? 1 : -1
    }
}

@main
private enum HubbubbLocalCameraApp {
    static func main() {
        if CommandLine.arguments.contains("--self-test") {
            RoomMap.selfTest()
            return
        }
        let application = NSApplication.shared
        // No window and no Dock icon: Home Assistant is the interface.
        application.setActivationPolicy(.accessory)
        let service = CameraService()
        service.start()
        withExtendedLifetime(service) { application.run() }
    }
}

/// The camera as a background service on this Mac. Home Assistant drives it
/// through CameraServer: settings, live view, people, things, and an event
/// feed of gestures and who is in view. What a gesture *does* lives in Home
/// Assistant; this side only sees, and runs the one thing only a Mac can
/// (Screen Mirroring to the TV).
private final class CameraService {
    private let session = AVCaptureSession()
    private let sessionQueue = DispatchQueue(label: "com.hubbubb.camera.session")
    private var processor: LocalVisionProcessor?
    private var server: CameraServer?
    private let lock = NSLock()
    private var status = "Starting the camera…"
    private let jpegContext = CIContext(options: [.useSoftwareRenderer: false])
    private var lastFrameSent = Date.distantPast

    // Tuning knobs Home Assistant may set: name -> (allowed range, default).
    // Each is read where it is used, from these same defaults.
    private static let knobs: [String: (range: ClosedRange<Double>, value: Double)] = [
        "followGain": (0.1...1.0, 0.45),
        "gestureReach": (0.5...3.0, 1.5),
        "hairReach": (0...2, 0.9),
        "chinReach": (0...1.5, 0.6),
        "steadiness": (0.1...1.0, 0.35),
        "faceMatchThreshold": (0.2...1.2, 0.6),
        "searchDegrees": (10...120, 45),
        "searchTilt": (-60...30, -20),
    ]
    private var follow: Bool {
        get { UserDefaults.standard.object(forKey: "localAIFollowingEnabled") as? Bool ?? true }
        set { UserDefaults.standard.set(newValue, forKey: "localAIFollowingEnabled") }
    }
    private var autoZoom: Bool {
        get { UserDefaults.standard.object(forKey: "autoZoomEnabled") as? Bool ?? true }
        set { UserDefaults.standard.set(newValue, forKey: "autoZoomEnabled") }
    }
    private var manualZoom: Double {
        get { UserDefaults.standard.object(forKey: "manualZoom") as? Double ?? 1 }
        set { UserDefaults.standard.set(newValue, forKey: "manualZoom") }
    }

    func start() {
        // A background service has no window to open it from: start at login.
        // macOS shows a one-time "login item added" notice; System Settings →
        // General → Login Items turns it off.
        if SMAppService.mainApp.status != .enabled {
            do { try SMAppService.mainApp.register() } catch { NSLog("Hubbubb camera: could not add a login item: \(error)") }
        }
        server = CameraServer { [weak self] method, path, query, body in
            self?.route(method, path, query, body) ?? .json("503 Service Unavailable", ["ok": false])
        }
        if server == nil { NSLog("Hubbubb camera: no companion token or port \(CameraServer.port) busy; Home Assistant cannot connect") }
        switch AVCaptureDevice.authorizationStatus(for: .video) {
        case .authorized:
            configure()
        case .notDetermined:
            AVCaptureDevice.requestAccess(for: .video) { [weak self] granted in
                granted ? self?.configure() : self?.setStatus("Camera access denied. Allow it in System Settings → Privacy & Security → Camera.")
            }
        default:
            setStatus("Camera access is blocked. Allow Hubbubb Local Camera in System Settings → Privacy & Security → Camera.")
        }
    }

    private func setStatus(_ text: String) {
        lock.lock()
        status = text
        lock.unlock()
    }

    /// Open the Link 2 and start analysing. Retries every 10 s until the camera
    /// is plugged in and free: there is no window to say "try again" from.
    private func configure() {
        sessionQueue.async { [weak self] in
            guard let self, self.processor == nil else { return }
            let discovery = AVCaptureDevice.DiscoverySession(
                deviceTypes: [.external, .builtInWideAngleCamera, .continuityCamera], mediaType: .video, position: .unspecified)
            guard let camera = discovery.devices.first(where: { $0.localizedName.localizedCaseInsensitiveContains("Insta360 Link 2") }),
                  let input = try? AVCaptureDeviceInput(device: camera) else {
                self.setStatus("Insta360 Link 2 not found or busy. Plug it in by USB and quit Insta360 Link Controller; retrying.")
                self.sessionQueue.asyncAfter(deadline: .now() + 10) { [weak self] in self?.configure() }
                return
            }
            var zoomMinimum = 0, zoomMaximum = 0, zoomStep = 1, currentZoom = 100
            let zoomSupported = hubbubbLinkCameraZoomInitialize(&zoomMinimum, &zoomMaximum, &zoomStep, &currentZoom) == 1
            self.session.beginConfiguration()
            guard self.session.canAddInput(input) else {
                self.session.commitConfiguration()
                self.setStatus("Could not open the camera; another app may be using it. Retrying.")
                self.sessionQueue.asyncAfter(deadline: .now() + 10) { [weak self] in self?.configure() }
                return
            }
            self.session.addInput(input)
            if self.session.canSetSessionPreset(.hd4K3840x2160) {
                self.session.sessionPreset = .hd4K3840x2160
            } else if self.session.canSetSessionPreset(.hd1920x1080) {
                self.session.sessionPreset = .hd1920x1080
            }
            let output = AVCaptureVideoDataOutput()
            output.alwaysDiscardsLateVideoFrames = true
            output.videoSettings = [kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_420YpCbCr8BiPlanarFullRange]
            let processor = LocalVisionProcessor(
                zoomRange: zoomSupported ? (zoomMinimum, zoomMaximum, zoomStep, currentZoom) : nil,
                preview: { [weak self] image, message in self?.preview(image, message) },
                gesture: { [weak self] gesture, person, held in
                    self?.server?.push(["type": "gesture", "gesture": gesture, "person": person ?? NSNull(), "held": held])
                },
                presence: { [weak self] people, animals in
                    self?.server?.push(["type": "presence", "people": people, "animals": animals])
                }
            )
            output.setSampleBufferDelegate(processor, queue: DispatchQueue(label: "com.hubbubb.camera.vision"))
            if self.session.canAddOutput(output) { self.session.addOutput(output) }
            self.session.commitConfiguration()
            self.processor = processor
            self.applySettings()
            self.setStatus(zoomSupported ? "Connected to \(camera.localizedName)."
                : "Connected to \(camera.localizedName), but its zoom and pan controls did not initialize.")
            self.session.startRunning()
        }
    }

    private func applySettings() {
        processor?.updateSettings(autoZoom: autoZoom, zoomFactor: CGFloat(manualZoom), autoFollow: follow)
    }

    /// Each analysed frame: remember the status line, and send the annotated
    /// preview to anyone watching, at most ~8 frames a second, 960 px wide.
    private func preview(_ image: CGImage?, _ message: String) {
        setStatus(message)
        guard let image, let server, server.watching, Date().timeIntervalSince(lastFrameSent) > 0.12 else { return }
        lastFrameSent = Date()
        let scale = min(1, 960 / CGFloat(image.width))
        let small = CIImage(cgImage: image).transformed(by: CGAffineTransform(scaleX: scale, y: scale))
        if let jpeg = jpegContext.jpegRepresentation(of: small, colorSpace: CGColorSpaceCreateDeviceRGB(),
                                                     options: [kCGImageDestinationLossyCompressionQuality as CIImageRepresentationOption: 0.7]) {
            server.pushFrame(jpeg)
        }
    }

    private func state() -> [String: Any] {
        lock.lock()
        let status = self.status
        lock.unlock()
        var settings: [String: Any] = ["follow": follow, "auto_zoom": autoZoom, "zoom": manualZoom]
        for (key, knob) in Self.knobs {
            settings[key] = UserDefaults.standard.object(forKey: key) as? Double ?? knob.value
        }
        var state: [String: Any] = ["status": status, "connected": processor != nil, "settings": settings,
                                    "knobs": Self.knobs.mapValues { ["min": $0.range.lowerBound, "max": $0.range.upperBound, "default": $0.value] }]
        if let processor {
            state.merge(processor.inView()) { $1 }
            state["enrolled"] = processor.enrolled()
            state["enrolling"] = processor.enrolling() ?? NSNull()
            state["room"] = processor.roomSpan()
        }
        return state
    }

    private func updateSettings(_ changes: [String: Any]) -> [String: Any] {
        if let value = changes["follow"] as? Bool { follow = value }
        if let value = changes["auto_zoom"] as? Bool { autoZoom = value }
        if let value = (changes["zoom"] as? NSNumber)?.doubleValue {
            manualZoom = min(4, max(1, value))
            autoZoom = false  // a chosen zoom is a manual zoom
        }
        for (key, knob) in Self.knobs {
            guard let value = (changes[key] as? NSNumber)?.doubleValue else { continue }
            UserDefaults.standard.set(min(knob.range.upperBound, max(knob.range.lowerBound, value)), forKey: key)
        }
        applySettings()
        server?.push(["type": "settings"])
        return state()
    }

    private func route(_ method: String, _ path: String, _ query: [String: String], _ body: [String: Any]) -> CameraServer.Reply {
        func ok(_ value: Any) -> CameraServer.Reply { .json("200 OK", value) }
        func bad(_ detail: String) -> CameraServer.Reply { .json("400 Bad Request", ["ok": false, "detail": detail]) }
        let name = (body["name"] as? String)?.trimmingCharacters(in: .whitespacesAndNewlines) ?? ""
        switch (method, path) {
        case ("GET", "/state"):
            return ok(state())
        case ("GET", "/people"):
            return ok(processor?.inView() ?? ["people": [], "animals": []])
        case ("GET", "/snapshot"):
            return server?.lastFrame.map { .jpeg($0) } ?? .json("503 Service Unavailable", ["ok": false, "detail": "no picture yet"])
        case ("GET", "/stream"):
            return .stream
        case ("GET", "/events"):
            return .poll(Int(query["after"] ?? "") ?? 0)
        case ("POST", "/settings"):
            return ok(updateSettings(body))
        case ("POST", "/pan"):
            guard let direction = (body["direction"] as? NSNumber)?.int32Value, direction == 1 || direction == -1 else {
                return bad("direction is 1 or -1")
            }
            return ok(["ok": hubbubbLinkCameraPanStep(direction) == 1])
        case ("POST", "/enroll"):
            guard let processor, !name.isEmpty, name.count <= 40 else { return bad("send a name, up to 40 characters") }
            processor.beginEnrollment(name: name)
            return ok(["ok": true])
        case ("POST", "/forget_person"):
            return ok(["ok": processor?.forget(name: name) ?? false])
        case ("GET", "/items"):
            return ok(["items": processor?.items() ?? []])
        case ("POST", "/forget_item"):
            return ok(["ok": processor?.forgetItem(name: name) ?? false])
        case ("POST", "/room_reset"):
            processor?.resetRoomMap()
            return ok(["ok": true])
        case ("POST", "/learn"):
            guard let processor, !name.isEmpty, name.count <= 60 else { return bad("send {\"name\": \"...\", \"hint\": \"...\"}") }
            let hint = (body["hint"] as? String).flatMap { $0.isEmpty ? nil : String($0.prefix(200)) }
                ?? "the thing the person is holding up to the camera"
            return ok(processor.learn(name: name, hint: hint))
        case ("POST", "/look"):
            guard let processor, let question = body["question"] as? String, !question.isEmpty, question.count <= 300 else {
                return bad("send {\"question\": \"...\"}")
            }
            return ok(processor.look(question: question))
        case ("POST", "/screen_sharing"):
            guard let on = body["on"] as? Bool else { return bad("send {\"on\": true or false}") }
            let done = DispatchSemaphore(value: 0)
            var reply: [String: Any] = [:]
            DispatchQueue.main.async {
                if on {
                    self.startScreenSharing { success, message in reply = ["ok": success, "detail": message]; done.signal() }
                } else {
                    self.stopScreenSharing { note in reply = ["ok": true, "detail": note.trimmingCharacters(in: .whitespaces)]; done.signal() }
                }
            }
            done.wait()
            return ok(reply)
        case ("GET", "/legacy_actions"):
            return ok(["gestures": legacyActions()])
        default:
            return .json("404 Not Found", ["ok": false, "detail": "no such path"])
        }
    }

    /// What the old windowed app did for each gesture, as Home Assistant
    /// actions, so the first Home Assistant setup can import it unchanged.
    private func legacyActions() -> [String: Any] {
        var gestures: [String: Any] = [:]
        let syncBox = "select.living_room_sync_box_hdmi_input"
        func input(_ option: String, sharing: Bool) -> [String: Any] {
            ["repeat": false, "actions": [
                ["action": "select.select_option", "target": ["entity_id": syncBox], "data": ["option": option]],
                ["action": "hubbubb_home.mac_screen_sharing", "data": ["on": sharing]],
            ]]
        }
        gestures["number_1"] = input("Apple TV", sharing: false)
        gestures["number_2"] = input("Mac Main Display", sharing: false)
        gestures["number_3"] = input("Mac Second Display", sharing: true)
        if let tv = UserDefaults.standard.string(forKey: "haMediaPlayer"), tv.hasPrefix("media_player."), tv.count > 13 {
            gestures["thumbs_up"] = ["repeat": true, "actions": [["action": "media_player.volume_up", "target": ["entity_id": tv]]]]
            gestures["thumbs_down"] = ["repeat": true, "actions": [["action": "media_player.volume_down", "target": ["entity_id": tv]]]]
            gestures["open_palm"] = ["repeat": false, "actions": [[
                "action": "remote.send_command",
                "target": ["entity_id": "remote." + tv.dropFirst("media_player.".count)],
                "data": ["command": "select"],
            ]]]
        }
        return gestures
    }

    private func startScreenSharing(completion: @escaping (Bool, String) -> Void) {
        // The Samsung stays connected in Screen Mirroring; extending means opening
        // its "Choose Content" dialog and picking Extended Display.
        let script = #"""
        tell application "System Events"
            -- macOS 27 hosts status items in MenuBarAgent and exposes no device names,
            -- so match by accessibility identifier and the row's status text.
            if not (exists window "Control Center" of process "ControlCenter") then
                set opened to false
                tell process "MenuBarAgent"
                    repeat with g in groups of menu bar 1
                        set mi to menu bar item 1 of g
                        if value of attribute "AXIdentifier" of mi is "com.apple.menuextra.screen-mirroring" then
                            click mi
                            set opened to true
                            exit repeat
                        end if
                    end repeat
                    if not opened then
                        repeat with g in groups of menu bar 1
                            set mi to menu bar item 1 of g
                            if value of attribute "AXIdentifier" of mi is "com.apple.menuextra.controlcenter" then click mi
                        end repeat
                    end if
                end tell
                delay 0.8
                if not opened then
                    tell process "ControlCenter"
                        set els to entire contents of window "Control Center"
                        repeat with i from 1 to count of els
                            set e to item i of els
                            try
                                if value of attribute "AXIdentifier" of e is "controlcenter-screen-mirroring" then
                                    click e
                                    exit repeat
                                end if
                            end try
                        end repeat
                    end tell
                    delay 0.8
                end if
            end if
            tell process "ControlCenter"
                set els to entire contents of window "Control Center"
                set deviceID to missing value
                repeat with i from 1 to count of els
                    set e to item i of els
                    try
                        if role of e is "AXStaticText" and value of e is "Connected" then
                            set deviceID to value of attribute "AXIdentifier" of e
                            exit repeat
                        end if
                    end try
                end repeat
                if deviceID is missing value then
                    key code 53
                    error "No connected screen is waiting for content. If the Samsung is already extended, nothing to do; otherwise connect SAMSUNG once from Screen Mirroring"
                end if
                repeat with i from 1 to count of els
                    set e to item i of els
                    try
                        if role of e is "AXButton" and value of attribute "AXIdentifier" of e is deviceID then
                            click e
                            exit repeat
                        end if
                    end try
                end repeat
            end tell
            delay 1
            tell process "ControlCenterHelper"
                set dialog to group 1 of window 1
                if (value of static text 1 of dialog) does not contain "SAMSUNG" then
                    click button 4 of dialog
                    error "The connected screen is not the Samsung"
                end if
                click button 3 of dialog -- Extended Display
                delay 0.3
                click button 5 of dialog -- Start Mirroring
            end tell
        end tell
        """#
        runScreenMirroringScript(script) { detail in
            if let detail {
                completion(false, "Could not start Samsung Screen Mirroring: \(detail). Allow Hubbubb Local Camera under Privacy & Security → Accessibility and Automation, then try again.")
            } else {
                completion(true, "Samsung Screen Mirroring was started in extended-display mode.")
            }
        }
    }
    private func stopScreenSharing(completion: @escaping (String) -> Void) {
        // Screen Mirroring rows are identified by CoreGraphics display ID ("Display:4").
        guard let samsung = NSScreen.screens.first(where: { $0.localizedName.localizedCaseInsensitiveContains("samsung") }),
              let displayID = samsung.deviceDescription[NSDeviceDescriptionKey("NSScreenNumber")] as? NSNumber else {
            completion("")
            return
        }
        // "Stop Extending" keeps the Samsung connected, which gesture 3 relies on.
        let script = #"""
        tell application "System Events"
            if not (exists window "Control Center" of process "ControlCenter") then
                tell process "MenuBarAgent"
                    repeat with g in groups of menu bar 1
                        set mi to menu bar item 1 of g
                        if value of attribute "AXIdentifier" of mi is "com.apple.menuextra.screen-mirroring" then click mi
                    end repeat
                end tell
                delay 0.8
            end if
            tell process "ControlCenter"
                set els to entire contents of window "Control Center"
                set matches to {}
                repeat with i from 1 to count of els
                    set e to item i of els
                    try
                        if role of e is "AXButton" and value of attribute "AXIdentifier" of e is "screen-mirroring-device-Display:DISPLAY_ID" then set end of matches to e
                    end try
                end repeat
                -- An extending row has Change and Stop Extending; Stop is the last one.
                if (count of matches) < 2 then
                    key code 53
                    error "the Samsung is not listed as extending"
                end if
                click (last item of matches)
            end tell
        end tell
        """#.replacingOccurrences(of: "DISPLAY_ID", with: displayID.stringValue)
        runScreenMirroringScript(script) { detail in
            completion(detail.map { " Could not stop Samsung screen sharing: \($0)." } ?? " Samsung screen sharing stopped.")
        }
    }
    private func runScreenMirroringScript(_ script: String, completion: @escaping (String?) -> Void) {
        DispatchQueue.global(qos: .userInitiated).async {
            var error: NSDictionary?
            let result = NSAppleScript(source: script)?.executeAndReturnError(&error)
            DispatchQueue.main.async {
                completion(result != nil && error == nil ? nil
                    : error?[NSAppleScript.errorMessage] as? String ?? "macOS blocked the Screen Mirroring controls")
            }
        }
    }}

/// One hand-gesture vote buffer. Each person in view gets their own, so two
/// people's hands never vote in the same pool.
private struct GestureVotes {
    var recent: [String?] = []
    var latched: String?
    var missed = 0
    var lastVolumeRepeat = Date.distantPast
    // Off until then: a hand was just at the head (eating, a scratch).
    var pausedUntil = Date.distantPast
    // The gesturing wrist's recent positions; a gesture has to be held still.
    var wrists: [CGPoint] = []
}

/// A person followed across frames: matched frame to frame by position, so
/// their name and gesture votes survive a blink or a turned head.
private extension CGRect {
    var area: CGFloat { width * height }
}

private struct Track {
    let id: Int
    var body: CGRect
    var face: CGRect?
    var lastSeen: Date
    var visible = true
    var name: String?
    var nearest: (name: String, distance: Float)?
    var nameMisses = 0
    var lastIdentified = Date.distantPast
    var votes = GestureVotes()

    /// Where to point the camera: the face, else the top of the body box.
    var aim: CGRect {
        face ?? CGRect(x: body.minX, y: body.maxY - body.height * 0.3, width: body.width, height: body.height * 0.3)
    }
}

private final class LocalVisionProcessor: NSObject, AVCaptureVideoDataOutputSampleBufferDelegate {
    private let handRequest = VNDetectHumanHandPoseRequest()
    private let faceRequest = VNDetectFaceRectanglesRequest()
    private let humanRequest = VNDetectHumanRectanglesRequest()
    private let animalRequest = VNRecognizeAnimalsRequest()
    private let context = CIContext(options: [.useSoftwareRenderer: false])
    private let preview: (CGImage?, String) -> Void
    private let gesture: (String, String?, Bool) -> Void
    private let presence: ([String], [String]) -> Void
    private var frameNumber = 0
    private var tracks: [Track] = []
    private var nextTrackID = 1
    private var lastStatus = ""
    // Enrolled faces: name -> feature prints of that face.
    private var gallery: [String: [VNFeaturePrintObservation]] = [:]
    private var enrollName: String?
    private var enrollSamples: [VNFeaturePrintObservation] = []
    private let enrollTarget = 20
    // Feature-print distance under which a face counts as an enrolled person.
    // Calibration knob: the overlay shows each face's nearest distance; tune with
    // the Home Assistant panel's tuning section.
    // ponytail: generic image feature prints, not a face-ID model; swap in a
    // Core ML face embedding if two people keep getting confused.
    private var faceMatchThreshold: Float {
        Float(UserDefaults.standard.object(forKey: "faceMatchThreshold") as? Double ?? 0.6)
    }
    private var lastPresence: [String] = []
    private var lastPresenceSent = Date.distantPast
    // What the most recent frame held, for /look and /people (under settingsLock).
    private var latestFrame: CGImage?
    private var latestNames: [String] = []
    private var latestAnimals: [String] = []
    private var followPausedUntil = Date.distantPast
    private let lookQueue = DispatchQueue(label: "com.hubbubb.camera.look")
    private var itemBook = ItemBook.load()  // lookQueue only
    private var looking = false
    private let settingsLock = NSLock()
    private var autoZoomEnabled = true
    private var autoFollowEnabled = false
    private var currentZoomFactor: CGFloat
    private let zoomRange: (minimum: Int, maximum: Int, step: Int)?
    private let ptzQueue = DispatchQueue(label: "com.hubbubb.camera.ptz")
    private var lastAutoZoomUpdate = Date.distantPast
    private var lastAutoFollowUpdate = Date.distantPast
    private var smoothedFaceCenter: CGPoint?
    private var lastCenterTime = Date.distantPast
    private var velocityX: CGFloat = 0
    private var gimbalMoving = false
    private var chased = false
    private var faceLostSince: Date?
    // ptzQueue-only: the sweep's current pan and direction, and the room map.
    private var searchPan: Float?
    private var searchCenter: Float?
    private var searchDirection: Float = 1
    private var roomMap = RoomMap.load()
    private var lastSighting: (pan: Float, tilt: Float)?
    private var lastMapUpdate = Date.distantPast
    // Seconds between "held" repeats while a gesture is held (Home Assistant
    // runs the action on each when the gesture is set to repeat).
    private let volumeRepeatInterval: TimeInterval = 0.35

    init(
        zoomRange: (Int, Int, Int, Int)?,
        preview: @escaping (CGImage?, String) -> Void,
        gesture: @escaping (String, String?, Bool) -> Void,
        presence: @escaping ([String], [String]) -> Void
    ) {
        self.preview = preview
        self.gesture = gesture
        self.presence = presence
        if let (minimum, maximum, step, current) = zoomRange, maximum > minimum {
            self.zoomRange = (minimum, maximum, max(1, step))
            self.currentZoomFactor = 1 + CGFloat(current - minimum) / CGFloat(maximum - minimum) * 3
        } else {
            self.zoomRange = nil
            self.currentZoomFactor = 1
        }
        // Room for everyone's hands, not just one person's pair.
        handRequest.maximumHandCount = 6
        super.init()
        gallery = Self.loadGallery()
    }

    func updateSettings(autoZoom: Bool, zoomFactor: CGFloat, autoFollow: Bool) {
        settingsLock.lock()
        autoZoomEnabled = autoZoom
        autoFollowEnabled = autoFollow
        settingsLock.unlock()
        if !autoZoom { applyHardwareZoom(zoomFactor) }
    }

    func captureOutput(
        _ output: AVCaptureOutput,
        didOutput sampleBuffer: CMSampleBuffer,
        from connection: AVCaptureConnection
    ) {
        frameNumber += 1
        guard frameNumber.isMultiple(of: 3),
              let pixelBuffer = CMSampleBufferGetImageBuffer(sampleBuffer) else { return }

        do {
            let handler = VNImageRequestHandler(cvPixelBuffer: pixelBuffer, orientation: .up)
            handRequest.regionOfInterest = CGRect(x: 0, y: 0, width: 1, height: 1)
            try handler.perform([faceRequest, humanRequest, animalRequest, handRequest])
            let animals = (animalRequest.results ?? []).filter { $0.confidence > 0.5 }
            let now = Date()
            updateTracks(
                humans: (humanRequest.results ?? []).map(\.boundingBox),
                faces: (faceRequest.results ?? []).map(\.boundingBox),
                animals: animals.map(\.boundingBox),
                now: now
            )
            let visible = tracks.filter(\.visible)
            identifyFaces(handler, now: now)
            let enrollMessage = enroll(handler, visible: tracks.filter(\.visible))

            if visible.isEmpty {
                recoverLostFace()
            } else {
                if faceLostSince != nil {
                    smoothedFaceCenter = nil
                    chased = false
                    velocityX = 0
                    ptzQueue.async { [weak self] in self?.searchPan = nil }
                }
                faceLostSince = nil
                frame(visible)
            }

            let sourceImage = CIImage(cvPixelBuffer: pixelBuffer)
            guard let fullFrame = context.createCGImage(sourceImage, from: sourceImage.extent) else {
                throw CameraVisionError.previewFailed
            }
            let names = Array(Set(visible.compactMap(\.name))).sorted()
            let animalNames = animals.compactMap { $0.labels.first?.identifier.lowercased() }
            settingsLock.lock()
            latestFrame = fullFrame
            latestNames = names
            latestAnimals = animalNames
            settingsLock.unlock()
            reportPresence(names, animals: animalNames, now: now)

            // Gestures, per person: each visible track votes with its own hands.
            let hands = handRequest.results ?? []
            var handsByTrack: [Int: [VNHumanHandPoseObservation]] = [:]
            // A hand nobody in view owns can't be judged raised or not, so it never gestures.
            for hand in hands {
                if let owner = owner(of: hand) { handsByTrack[owner, default: []].append(hand) }
            }
            // Calibration knob: how far below the chin a gesturing wrist may be,
            // in face heights. Lower if typing still triggers; higher if a
            // relaxed thumbs-up at the chest is missed.
            let reach = CGFloat(UserDefaults.standard.object(forKey: "gestureReach") as? Double ?? 1.5)
            var messages: [String] = []
            var fired: [(gesture: String, person: String?, held: Bool)] = []
            var raisedHands = 0
            for index in tracks.indices where tracks[index].visible {
                let track = tracks[index]
                let raised = (handsByTrack[track.id] ?? []).filter { hand in
                    guard let wrist = try? hand.recognizedPoint(.wrist), wrist.confidence > 0.1 else { return false }
                    return GestureGate.isRaised(wrist: wrist.location, face: track.face, body: track.body, reach: reach)
                }
                raisedHands += raised.count
                let result = updateGestures(&tracks[index].votes, hands: raised, face: track.face)
                if let message = result.message {
                    messages.append(tracks[index].name.map { "\($0): \(message)" } ?? message)
                }
                if let gesture = result.fired {
                    fired.append((gesture.id, track.name, gesture.held))
                    // Whoever gestures has the room's attention: keep them in frame.
                    tracks[index].lastSeen = now
                }
            }

            let people = visible.map { $0.name ?? "someone" }
            let idle = visible.isEmpty
                ? "No one in view. Preview and gesture analysis stay local."
                : (hands.isEmpty
                    ? "\(people.joined(separator: ", ")) in view. Raise a hand to gesture."
                    : raisedHands == 0
                    ? "Hands are low (typing?), so gestures are ignored. Raise a hand to chest height to gesture."
                    : "Hand raised. Hold a gesture steady to run its action.")
            lastStatus = enrollMessage ?? messages.first ?? idle
            preview(annotate(fullFrame, animals: animals), lastStatus)
            for event in fired { gesture(event.gesture, event.person, event.held) }
        } catch {
            if lastStatus != "Local Vision could not analyze this frame." {
                lastStatus = "Local Vision could not analyze this frame."
                preview(nil, lastStatus)
            }
        }
    }

    /// Match this frame's people to the tracks from earlier frames.
    private func updateTracks(humans: [CGRect], faces: [CGRect], animals: [CGRect], now: Date) {
        func center(_ r: CGRect) -> CGPoint { CGPoint(x: r.midX, y: r.midY) }
        func inside(_ r: CGRect, _ boxes: [CGRect]) -> Bool { boxes.contains { $0.contains(center(r)) } }
        // A face inside a dog is the dog's. A face inside a person (holding the
        // dog) is still the person's.
        let faces = faces.filter { !inside($0, animals) || inside($0, humans) }
        let bodies = humans.filter { body in
            faces.contains { body.contains(center($0)) }
                || !animals.contains { $0.intersection(body).area > body.area * 0.5 }
        }
        var people: [(body: CGRect, face: CGRect?)] = bodies.map { body in
            (body, faces.filter { body.contains(center($0)) }.max { $0.area < $1.area })
        }
        // A face with no body box (close to the lens, body cut off) is a person too.
        for face in faces where !people.contains(where: { $0.face == face }) {
            people.append((face.insetBy(dx: -face.width * 0.5, dy: 0).union(face.offsetBy(dx: 0, dy: -face.height * 2)), face))
        }

        var matched = Set<Int>()
        for person in people {
            let candidates = tracks.indices.filter { !matched.contains($0) }
            let best = candidates.min { hypot(center(tracks[$0].body).x - center(person.body).x, center(tracks[$0].body).y - center(person.body).y)
                < hypot(center(tracks[$1].body).x - center(person.body).x, center(tracks[$1].body).y - center(person.body).y) }
            if let best, hypot(center(tracks[best].body).x - center(person.body).x, center(tracks[best].body).y - center(person.body).y) < 0.25 {
                tracks[best].body = person.body
                tracks[best].face = person.face
                tracks[best].lastSeen = now
                matched.insert(best)
            } else {
                tracks.append(Track(id: nextTrackID, body: person.body, face: person.face, lastSeen: now))
                nextTrackID += 1
                matched.insert(tracks.count - 1)
            }
        }
        for index in tracks.indices { tracks[index].visible = matched.contains(index) }
        // Brief dropouts keep the track (and its name and votes); then it's gone.
        tracks.removeAll { !$0.visible && now.timeIntervalSince($0.lastSeen) > 1.5 }
    }

    /// Point the camera at whoever is in view: one person's face, or the group.
    private func frame(_ visible: [Track]) {
        let aim = visible.map(\.aim).reduce(visible[0].aim) { $0.union($1) }
        // Someone near the middle of the frame: note where the camera points.
        let now = Date()
        if abs(aim.midX - 0.5) < 0.2, abs(aim.midY - 0.5) < 0.25, now.timeIntervalSince(lastMapUpdate) > 2 {
            lastMapUpdate = now
            ptzQueue.async { [weak self] in
                guard let self, let position = cameraPosition() else { return }
                self.lastSighting = position
                self.roomMap.add(pan: position.pan, tilt: position.tilt)
                self.roomMap.save()
            }
        }
        if visible.count == 1, let face = visible[0].face {
            adjustHardwareZoom(forFace: face)
        } else if visible.count > 1 {
            // Fit everyone: the group's bodies should span about 80% of the frame.
            let group = visible.map(\.body).reduce(visible[0].body) { $0.union($1) }
            adjustHardwareZoom(toFit: group)
        }
        adjustGimbal(forFace: aim)
    }

    /// The visible track a hand belongs to: the nearest body, if it's close.
    private func owner(of hand: VNHumanHandPoseObservation) -> Int? {
        guard let wrist = try? hand.recognizedPoint(.wrist), wrist.confidence > 0.1 else { return nil }
        let point = wrist.location
        let scored = tracks.filter(\.visible).map { track -> (Int, CGFloat) in
            // Arms reach past the shoulders; a wrist beside the body is still theirs.
            let reach = track.body.insetBy(dx: -track.body.width * 0.5, dy: -track.body.height * 0.2)
            let dx = max(reach.minX - point.x, 0, point.x - reach.maxX)
            let dy = max(reach.minY - point.y, 0, point.y - reach.maxY)
            return (track.id, hypot(dx, dy))
        }
        guard let best = scored.min(by: { $0.1 < $1.1 }), best.1 < 0.15 else { return nil }
        return best.0
    }

    /// One person's gesture state machine: their hands this frame in, a status
    /// line (nil when idle) and at most one fired gesture out.
    private func updateGestures(
        _ votes: inout GestureVotes, hands: [VNHumanHandPoseObservation], face: CGRect?
    ) -> (message: String?, fired: (id: String, held: Bool)?) {
        // Vision may return a weak duplicate/false hand: use its strongest.
        let primaryHand = hands.max { $0.confidence < $1.confidence }
        let now = Date()
        // Any hand at the head - eating, a scratch, hair - turns gestures off
        // for two seconds; a meal keeps renewing that, so it stays off.
        if let face, hands.contains(where: { handOverlapsFace($0, faceBounds: face) }) {
            votes = GestureVotes(lastVolumeRepeat: votes.lastVolumeRepeat, pausedUntil: now.addingTimeInterval(2))
            return ("Gestures paused: a hand is at a face, mouth or hair.", nil)
        }
        if now < votes.pausedUntil {
            return ("Gestures paused for a moment: a hand was just at a face (eating?).", nil)
        }
        // Held still or it doesn't count. Tolerance scales with the face, so it
        // means the same up close and across the room.
        let wrist = primaryHand.flatMap { try? $0.recognizedPoint(.wrist) }.flatMap { $0.confidence > 0.1 ? $0.location : nil }
        if let wrist { votes.wrists.append(wrist) } else { votes.wrists.removeAll() }
        if votes.wrists.count > 5 { votes.wrists.removeFirst() }
        let tolerance = (face?.height ?? 0.1) * CGFloat(UserDefaults.standard.object(forKey: "steadiness") as? Double ?? 0.35)
        let steady = votes.wrists.count >= 3 && GestureGate.isSteady(votes.wrists, tolerance: tolerance)
        let rawGesture = steady ? primaryHand.flatMap { classifyGesture($0) } : nil
        votes.recent.append(rawGesture)
        if votes.recent.count > 8 { votes.recent.removeFirst() }
        // Vote across recent frames so a weak duplicate hand or one noisy
        // finger landmark cannot flip a held pose between 1/open/2 fingers.
        let gestureVotes = votes.recent.compactMap { $0 }.reduce(into: [String: Int]()) { counts, id in
            counts[id, default: 0] += 1
        }
        let maximumGestureVotes = gestureVotes.values.max() ?? 0
        let latched = votes.latched
        let leadingGesture = rawGesture.flatMap { gestureVotes[$0] == maximumGestureVotes ? $0 : nil }
            ?? latched.flatMap { gestureVotes[$0] == maximumGestureVotes ? $0 : nil }
            ?? gestureVotes.filter { $0.value == maximumGestureVotes }.keys.sorted().first
        let requiredHits = 5
        guard let detectedGesture = leadingGesture else {
            votes.missed += 1
            if votes.missed >= 8 { votes.latched = nil }
            let previousGesture = votes.recent.compactMap { $0 }.last
            let previousHits = previousGesture.map { g in votes.recent.filter { $0 == g }.count } ?? 0
            guard previousHits > 0 && votes.missed < 8, let previousGesture else { return (nil, nil) }
            return ("\(gestureTitle(previousGesture)): \(min(previousHits, requiredHits))/\(requiredHits) frames. Keep holding…", nil)
        }
        let gestureHits = gestureVotes[detectedGesture] ?? 0
        votes.missed = 0
        if let latched = votes.latched, latched != detectedGesture { votes.latched = nil }
        if gestureHits >= requiredHits && votes.latched != detectedGesture {
            votes.latched = detectedGesture
            votes.lastVolumeRepeat = Date()
            return ("\(gestureTitle(detectedGesture)) recognized. Running its assigned action.", (detectedGesture, false))
        }
        if votes.latched == detectedGesture, rawGesture == detectedGesture,
           Date().timeIntervalSince(votes.lastVolumeRepeat) > volumeRepeatInterval {
            // Still held: report it again, so a "repeat while held" action (volume)
            // keeps stepping. Home Assistant ignores it for one-shot actions.
            votes.lastVolumeRepeat = Date()
            return ("\(gestureTitle(detectedGesture)) held. Drop your hand to stop.", (detectedGesture, true))
        }
        if let latched = votes.latched {
            return ("\(gestureTitle(latched)) recognized. Running its assigned action.", nil)
        }
        return ("\(gestureTitle(detectedGesture)): \(min(gestureHits, requiredHits))/\(requiredHits) frames. Keep holding…", nil)
    }

    // MARK: - Who is who

    private static var galleryURL: URL {
        let base = FileManager.default.urls(for: .applicationSupportDirectory, in: .userDomainMask)[0]
        return base.appendingPathComponent("Hubbubb Local Camera/faces.archive")
    }

    private static func loadGallery() -> [String: [VNFeaturePrintObservation]] {
        guard let data = try? Data(contentsOf: galleryURL),
              let stored = try? NSKeyedUnarchiver.unarchivedObject(
                ofClasses: [NSDictionary.self, NSArray.self, NSString.self, VNFeaturePrintObservation.self], from: data
              ) as? [String: [VNFeaturePrintObservation]] else { return [:] }
        return stored
    }

    /// -> nil when saved, else why not.
    private func saveGallery() -> String? {
        let url = Self.galleryURL
        do {
            try FileManager.default.createDirectory(at: url.deletingLastPathComponent(), withIntermediateDirectories: true)
            settingsLock.lock()
            let snapshot = gallery
            settingsLock.unlock()
            let data = try NSKeyedArchiver.archivedData(withRootObject: snapshot as NSDictionary, requiringSecureCoding: true)
            try data.write(to: url, options: .atomic)
            return nil
        } catch {
            return error.localizedDescription
        }
    }

    /// Start collecting face samples for `name` from whoever is alone in view.
    /// Enrolling an existing name replaces their samples.
    func beginEnrollment(name: String) {
        settingsLock.lock()
        enrollName = name
        enrollSamples = []
        settingsLock.unlock()
    }

    /// Everyone enrolled, with how many face samples each has.
    func enrolled() -> [[String: Any]] {
        settingsLock.lock()
        defer { settingsLock.unlock() }
        return gallery.keys.sorted().map { ["name": $0, "samples": gallery[$0]?.count ?? 0] }
    }

    /// The enrollment in progress, if any.
    func enrolling() -> [String: Any]? {
        settingsLock.lock()
        defer { settingsLock.unlock() }
        return enrollName.map { ["name": $0, "samples": enrollSamples.count, "target": enrollTarget] }
    }

    func forget(name: String) -> Bool {
        settingsLock.lock()
        let removed = gallery.removeValue(forKey: name) != nil
        settingsLock.unlock()
        if removed { _ = saveGallery() }
        return removed
    }

    /// Everything taught, newest sighting first, photos inline (they are small).
    func items() -> [[String: Any]] {
        lookQueue.sync {
            itemBook.items.values.sorted { ($0.lastSeenAt ?? .distantPast) > ($1.lastSeenAt ?? .distantPast) }.map { item in
                let photo = try? Data(contentsOf: ItemBook.folder.appendingPathComponent(item.image))
                return [
                    "name": item.name, "description": item.description,
                    "last_seen": item.lastSeen ?? NSNull(),
                    "last_seen_at": item.lastSeenAt.map { $0.timeIntervalSince1970 } ?? NSNull(),
                    "photo": photo?.base64EncodedString() ?? NSNull(),
                ]
            }
        }
    }

    func forgetItem(name: String) -> Bool {
        lookQueue.sync {
            guard let item = itemBook.items.removeValue(forKey: name.lowercased()) else { return false }
            try? FileManager.default.removeItem(at: ItemBook.folder.appendingPathComponent(item.image))
            try? itemBook.save()
            return true
        }
    }

    func resetRoomMap() {
        ptzQueue.sync {
            roomMap = RoomMap()
            roomMap.save()
        }
    }

    /// The learned search span, for display.
    func roomSpan() -> [String: Any] {
        ptzQueue.sync {
            let sightings = roomMap.bins.values.reduce(0) { $0 + $1.count }
            guard let search = roomMap.search else {
                return ["learned": false, "sightings": sightings, "needed": RoomMap.needed]
            }
            return ["learned": true, "sightings": sightings, "low": search.low, "high": search.high]
        }
    }

    private func featurePrint(_ handler: VNImageRequestHandler, face: CGRect) -> VNFeaturePrintObservation? {
        let request = VNGenerateImageFeaturePrintRequest()
        request.imageCropAndScaleOption = .scaleFill
        request.regionOfInterest = face.insetBy(dx: -face.width * 0.15, dy: -face.height * 0.15)
            .intersection(CGRect(x: 0, y: 0, width: 1, height: 1))
        try? handler.perform([request])
        return request.results?.first
    }

    /// Returns a status line while enrolling, nil otherwise.
    private func enroll(_ handler: VNImageRequestHandler, visible: [Track]) -> String? {
        settingsLock.lock()
        let name = enrollName
        settingsLock.unlock()
        guard let name else { return nil }
        let faces = visible.compactMap(\.face)
        guard faces.count == 1, let face = faces.first, face.height > 0.06 else {
            return "Enrolling \(name): only \(name)'s face should be in view, close enough to see clearly."
        }
        // Samples and the gallery change under the lock: Home Assistant reads
        // enrollment progress and the enrolled list from the server's thread.
        let print = frameNumber.isMultiple(of: 6) ? featurePrint(handler, face: face) : nil
        settingsLock.lock()
        if let print { enrollSamples.append(print) }
        let count = enrollSamples.count
        if count >= enrollTarget {
            gallery[name] = enrollSamples
            enrollName = nil
            enrollSamples = []
        }
        settingsLock.unlock()
        guard count >= enrollTarget else {
            return "Enrolling \(name): \(count)/\(enrollTarget). Turn your head a little left, right, up and down."
        }
        let failure = saveGallery()
        for index in tracks.indices where tracks[index].visible { tracks[index].name = name }
        if let failure {
            return "Enrolled \(name) for now, but could not save it (\(failure)); it will be forgotten on restart."
        }
        return "Enrolled \(name). The camera will recognize them from now on."
    }

    /// Re-check one face per frame: unnamed faces often, named ones now and then.
    private func identifyFaces(_ handler: VNImageRequestHandler, now: Date) {
        settingsLock.lock()
        let gallery = self.gallery
        settingsLock.unlock()
        guard !gallery.isEmpty else { return }
        let due = tracks.indices.filter { index in
            guard tracks[index].visible, let face = tracks[index].face, face.height > 0.05 else { return false }
            let age = now.timeIntervalSince(tracks[index].lastIdentified)
            return age > (tracks[index].name == nil ? 0.3 : 2.0)
        }
        guard let index = due.min(by: { tracks[$0].lastIdentified < tracks[$1].lastIdentified }),
              let face = tracks[index].face,
              let print = featurePrint(handler, face: face) else { return }
        tracks[index].lastIdentified = now
        let ranked = gallery.compactMap { name, samples -> (name: String, distance: Float)? in
            let distances = samples.compactMap { sample -> Float? in
                var distance: Float = 0
                return (try? print.computeDistance(&distance, to: sample)) != nil ? distance : nil
            }
            return distances.min().map { (name, $0) }
        }.sorted { $0.distance < $1.distance }
        tracks[index].nearest = ranked.first
        // Too close between two enrolled people is a guess, not a match.
        let clear = ranked.count < 2 || ranked[1].distance - ranked[0].distance > 0.03
        if let best = ranked.first, best.distance < faceMatchThreshold, clear {
            tracks[index].name = best.name
            tracks[index].nameMisses = 0
        } else {
            tracks[index].nameMisses += 1
            if tracks[index].nameMisses >= 3 { tracks[index].name = nil }
        }
    }

    /// Tell Home Assistant who is in view when that changes, and every 20 s
    /// so it knows the answer is still current.
    private func reportPresence(_ names: [String], animals: [String], now: Date) {
        let seen = names + ["|"] + animals.sorted()
        guard seen != lastPresence || now.timeIntervalSince(lastPresenceSent) > 20 else { return }
        lastPresence = seen
        lastPresenceSent = now
        presence(names, animals)
    }

    /// The preview, half size, with people and animals boxed and labeled.
    private func annotate(_ image: CGImage, animals: [VNRecognizedObjectObservation]) -> CGImage {
        let width = min(image.width, 1920)
        let height = image.height * width / image.width
        guard let canvas = CGContext(data: nil, width: width, height: height, bitsPerComponent: 8, bytesPerRow: 0,
                                     space: CGColorSpaceCreateDeviceRGB(),
                                     bitmapInfo: CGImageAlphaInfo.premultipliedFirst.rawValue) else { return image }
        let size = CGSize(width: width, height: height)
        canvas.draw(image, in: CGRect(origin: .zero, size: size))
        func box(_ r: CGRect, _ color: NSColor, _ label: String) {
            let rect = VNImageRectForNormalizedRect(r, width, height)
            canvas.setStrokeColor(color.cgColor)
            canvas.setLineWidth(4)
            canvas.stroke(rect)
            let text = NSAttributedString(string: " \(label) ", attributes: [
                .font: NSFont.systemFont(ofSize: 26, weight: .bold),
                .foregroundColor: NSColor.white,
                .backgroundColor: color
            ])
            canvas.textPosition = CGPoint(x: rect.minX, y: min(rect.maxY + 8, size.height - 30))
            CTLineDraw(CTLineCreateWithAttributedString(text), canvas)
        }
        for track in tracks where track.visible {
            var label = track.name ?? "Person"
            if let nearest = track.nearest { label += String(format: "  (%@ %.2f)", nearest.name, nearest.distance) }
            box(track.face ?? track.body, track.name == nil ? .systemGreen : .systemBlue, label)
        }
        for animal in animals {
            box(animal.boundingBox, .systemOrange, animal.labels.first?.identifier ?? "Animal")
        }
        return canvas.makeImage() ?? image
    }

    private enum CameraVisionError: Error {
        case previewFailed
    }

    private func handOverlapsFace(_ hand: VNHumanHandPoseObservation, faceBounds: CGRect) -> Bool {
        let joints: [VNHumanHandPoseObservation.JointName] = [
            .wrist, .thumbCMC, .thumbMP, .thumbIP, .thumbTip,
            .indexMCP, .indexPIP, .indexDIP, .indexTip,
            .middleMCP, .middlePIP, .middleDIP, .middleTip,
            .ringMCP, .ringPIP, .ringDIP, .ringTip,
            .littleMCP, .littlePIP, .littleDIP, .littleTip
        ]
        let points = joints.compactMap { joint -> CGPoint? in
            guard let point = try? hand.recognizedPoint(joint), point.confidence > 0.12 else { return nil }
            return point.location
        }
        guard !points.isEmpty else { return false }
        // Calibration knobs, in face heights: `hairReach` above the face box,
        // `chinReach` below it.
        let defaults = UserDefaults.standard
        let head = GestureGate.head(
            faceBounds,
            hair: CGFloat(defaults.object(forKey: "hairReach") as? Double ?? 0.9),
            chin: CGFloat(defaults.object(forKey: "chinReach") as? Double ?? 0.6)
        )
        return points.contains(where: head.contains)
    }

    private func applyHardwareZoom(_ factor: CGFloat) {
        guard let range = zoomRange else { return }
        let clamped = min(4, max(1, factor))
        settingsLock.lock()
        currentZoomFactor = clamped
        settingsLock.unlock()
        let rawValue = range.minimum + Int((clamped - 1) / 3 * CGFloat(range.maximum - range.minimum))
        ptzQueue.async {
            if hubbubbLinkCameraZoomSet(rawValue) != 1 { NSLog("Hubbubb camera: the Link 2 rejected a zoom command") }
        }
    }

    private func adjustHardwareZoom(forFace face: CGRect) {
        zoomToward(face, size: face.height, goal: 0.40)
    }

    private func adjustHardwareZoom(toFit group: CGRect) {
        zoomToward(group, size: max(group.width, group.height), goal: 0.80)
    }

    /// Ease the lens so `size` (a fraction of the frame) approaches `goal`.
    private func zoomToward(_ box: CGRect, size: CGFloat, goal: CGFloat) {
        guard zoomRange != nil, size > 0.04 else { return }
        let now = Date()
        guard now.timeIntervalSince(lastAutoZoomUpdate) > 0.20 else { return }
        lastAutoZoomUpdate = now
        settingsLock.lock()
        let enabled = autoZoomEnabled && now > followPausedUntil
        let current = currentZoomFactor
        settingsLock.unlock()
        guard enabled else { return }
        // Let the gimbal center an off-axis subject before tightening the view.
        guard abs(box.midX - 0.5) < 0.10, abs(box.midY - 0.5) < 0.12 else { return }
        let target = min(4, max(1, current * (goal / size)))
        let smoothed = current + (target - current) * 0.12
        guard abs(smoothed - current) > 0.04 else { return }
        applyHardwareZoom(smoothed)
    }

    /// Pan span to search and tilt per pan. ptzQueue only. Learned from where
    /// people have been seen; until then, `searchDegrees` (45) either side of
    /// the last sighting at `searchTilt` (-20°: the camera sits high on the TV).
    private func searchSpan() -> (low: Float, high: Float, tilt: (Float) -> Float) {
        if let learned = roomMap.search { return learned }
        let defaults = UserDefaults.standard
        let degrees = Float(defaults.object(forKey: "searchDegrees") as? Double ?? 45)
        let tilt = Float(defaults.object(forKey: "searchTilt") as? Double ?? -20)
        let center = lastSighting?.pan ?? searchCenter ?? cameraPosition()?.pan ?? 0
        return (center - degrees, center + degrees, { _ in tilt })
    }

    private func recoverLostFace() {
        let now = Date()
        if faceLostSince == nil { faceLostSince = now }
        let lostFor = now.timeIntervalSince(faceLostSince ?? now)
        settingsLock.lock()
        let following = autoFollowEnabled && now > followPausedUntil
        let autoZoom = autoZoomEnabled
        let current = currentZoomFactor
        settingsLock.unlock()
        // Search in bursts: sweep for 20 s, rest 25 s, sweep again. Never giving
        // up is how it kept looking for someone out of frame; never resting is
        // a camera panning all day in an empty room.
        let searchCycle = lostFor.truncatingRemainder(dividingBy: 45)
        guard following, lostFor > 0.3, searchCycle < 20 else { return }

        // Chase first: they walked out of one side, so zoom out at once and jump
        // about half a frame that way - usually that is exactly where they are.
        if !chased, let last = smoothedFaceCenter {
            chased = true
            lastAutoFollowUpdate = now
            let direction = Gimbal.exitDirection(lastX: last.x, velocityX: velocityX)
            let jump = Float(70 / current * 0.6)
            if autoZoom, current > 1.03 { applyHardwareZoom(1) }
            ptzQueue.async { [weak self] in
                guard let self, let position = cameraPosition() else { return }
                let target = position.pan + direction * jump
                self.searchCenter = target
                self.searchPan = target
                self.searchDirection = direction
                _ = hubbubbLinkCameraPointAt(target, position.tilt)
            }
            return
        }

        // Still nobody: sweep the room, carrying on in the direction they went.
        // A newly detected person immediately stops the sweep.
        guard lostFor > 1.5, now.timeIntervalSince(lastAutoFollowUpdate) > 0.28 else { return }
        lastAutoFollowUpdate = now
        ptzQueue.async { [weak self] in
            guard let self else { return }
            let (low, high, tilt) = self.searchSpan()
            if self.searchPan == nil {
                guard let position = cameraPosition() else { return }
                self.searchCenter = position.pan
                self.searchPan = min(high, max(low, position.pan))
            }
            var next = (self.searchPan ?? 0) + self.searchDirection * 6
            if next > high || next < low {
                self.searchDirection = -self.searchDirection
                next = min(high, max(low, next))
            }
            self.searchPan = next
            _ = hubbubbLinkCameraPointAt(next, tilt(next))
        }
    }

    private func adjustGimbal(forFace face: CGRect) {
        let now = Date()
        settingsLock.lock()
        let enabled = autoFollowEnabled && now > followPausedUntil
        let zoom = currentZoomFactor
        settingsLock.unlock()
        // Light smoothing against detection jitter; heavier smoothing is lag.
        let measured = CGPoint(x: face.midX, y: face.midY)
        let center = smoothedFaceCenter.map {
            CGPoint(x: $0.x + (measured.x - $0.x) * 0.5, y: $0.y + (measured.y - $0.y) * 0.5)
        } ?? measured
        if let last = smoothedFaceCenter, now.timeIntervalSince(lastCenterTime) > 0 {
            velocityX = velocityX * 0.6 + (center.x - last.x) / now.timeIntervalSince(lastCenterTime) * 0.4
        }
        smoothedFaceCenter = center
        lastCenterTime = now
        guard enabled, now.timeIntervalSince(lastAutoFollowUpdate) > 0.15 else { return }
        // Calibration knob: share of the error corrected per update. Higher is
        // snappier; too high and it overshoots, since each frame lags the move.
        let gain = CGFloat(UserDefaults.standard.object(forKey: "followGain") as? Double ?? 0.45)
        let step = Gimbal.step(error: CGPoint(x: center.x - 0.5, y: center.y - 0.5), zoom: zoom, moving: gimbalMoving, gain: gain)
        gimbalMoving = step.moving
        guard step.moving else { return }
        lastAutoFollowUpdate = now
        ptzQueue.async { _ = hubbubbLinkCameraNudge(step.pan, step.tilt) }
    }

    // MARK: - Looking for things

    /// Who and what the camera sees right now.
    func inView() -> [String: Any] {
        settingsLock.lock()
        defer { settingsLock.unlock() }
        return ["people": latestNames, "animals": latestAnimals]
    }

    /// Answer a question about the room from the camera, panning to search when
    /// the current view doesn't answer it. Frames go only to the vision model
    /// on this Mac. Blocks; call off the main thread.
    func look(question: String) -> [String: Any] {
        lookQueue.sync {
            settingsLock.lock()
            followPausedUntil = .distantFuture
            settingsLock.unlock()
            let start = ptzQueue.sync { cameraPosition() } ?? (0, 0)
            applyHardwareZoom(1)
            Thread.sleep(forTimeInterval: 1.0)
            // Three views across the span people use, minus any close to where
            // the camera already looks; the current tilt suits tables and floors.
            let (low, high, _) = ptzQueue.sync { searchSpan() }
            let positions = [low + (high - low) / 6, (low + high) / 2, high - (high - low) / 6]
                .filter { abs($0 - start.pan) > 20 }
            var seen: [String] = []
            var result: [String: Any] = [:]
            let item = itemBook.match(question)
            let reference = item.flatMap { try? Data(contentsOf: ItemBook.folder.appendingPathComponent($0.image)) }
            for position in [nil] + positions.map(Optional.some) {
                if let position {
                    ptzQueue.sync { _ = hubbubbLinkCameraPointAt(position, start.tilt) }
                    Thread.sleep(forTimeInterval: 1.8)  // let the gimbal settle and new frames arrive
                }
                guard let image = latestJPEG() else {
                    result = ["error": "The camera has no picture right now."]
                    break
                }
                let visible = inView()
                guard var reply = askVisionModel(question, image: image, visible: visible, item: item, reference: reference) else {
                    result = ["error": "The vision model on the Mac did not answer."]
                    break
                }
                // Too far to read or make out: aim, zoom in, ask once more.
                if let box = reply["closer"] as? CGRect {
                    moveCloser(to: box)
                    if let closer = latestJPEG(),
                       let second = askVisionModel(question, image: closer, visible: visible, item: item, reference: reference) {
                        reply = second
                    }
                    applyHardwareZoom(1)
                }
                reply.removeValue(forKey: "closer")
                result = reply.merging(visible) { current, _ in current }
                if reply["found"] as? Bool == true { break }
                if let answer = reply["answer"] as? String { seen.append(answer) }
            }
            // Always point back where it was: the answer is in words, and a model
            // that misread a soundbar as a bicycle should not leave the camera on it.
            ptzQueue.sync { _ = hubbubbLinkCameraPointAt(start.pan, start.tilt) }
            if result["found"] as? Bool != true, !seen.isEmpty { result["looked_at"] = seen }
            if var item {
                if result["found"] as? Bool == true, let answer = result["answer"] as? String {
                    item.lastSeen = answer
                    item.lastSeenAt = Date()
                    itemBook.items[item.name.lowercased()] = item
                    try? itemBook.save()
                } else if let lastSeen = item.lastSeen, let at = item.lastSeenAt {
                    let ago = RelativeDateTimeFormatter().localizedString(for: at, relativeTo: Date())
                    result["last_seen"] = "\(ago): \(lastSeen)"
                }
            }
            settingsLock.lock()
            followPausedUntil = Date()
            settingsLock.unlock()
            return result
        }
    }

    private func latestJPEG() -> Data? {
        settingsLock.lock()
        let frame = latestFrame
        settingsLock.unlock()
        guard let frame else { return nil }
        // 1920 wide: enough to read a whiteboard across the room.
        let scale = min(1, 1920 / CGFloat(frame.width))
        let image = CIImage(cgImage: frame).transformed(by: CGAffineTransform(scaleX: scale, y: scale))
        return context.jpegRepresentation(of: image, colorSpace: CGColorSpaceCreateDeviceRGB(),
                                          options: [kCGImageDestinationLossyCompressionQuality as CIImageRepresentationOption: 0.8])
    }

    /// One question, one image, to Ollama on this Mac. -> {"found", "answer"} or nil.
    private func askVisionModel(
        _ question: String, image: Data, visible: [String: Any], item: ItemBook.Item?, reference: Data?
    ) -> [String: Any]? {
        let people = (visible["people"] as? [String]).flatMap { $0.isEmpty ? nil : $0.joined(separator: ", ") } ?? "nobody recognized"
        var images = [image]
        var known = ""
        if let item {
            known = "The user has shown you their \(item.name) before: \(item.description)\n"
            if let reference {
                images.insert(reference, at: 0)
                known += "The first image is that item, as the user held it up. Answer about the second image, the room now.\n"
            }
        }
        let prompt = """
        You are the eyes of a home assistant, looking through a camera in the user's home.
        Question: \(question)
        \(known)People recognized in view by face recognition (trust these names): \(people).
        Reply with JSON only: {"seen": "...", "found": true or false, "closer": true or false, \
        "box": [x0, y0, x1, y1], "answer": "..."}.
        First fill "seen": list the main things actually in the image, including any readable text. Then "found": \
        true only if something in "seen" clearly is what the question asks about, or the question is about what \
        is in view. If you are not sure, found is false - never guess. "answer" is one or two short spoken \
        sentences; say where things are relative to furniture or other objects, and read text word for word \
        when asked what something says. If it is not visible, say briefly what you see instead.
        "closer": true only if the thing is visible but too small or far away to answer - text too small to \
        read, an object too small to make out. "box": where the thing asked about is, on a 0-1000 scale from \
        the top-left corner; [0, 0, 0, 0] if it is not visible.
        """
        guard let parsed = askOllama(prompt, images: images) else { return nil }
        guard let answer = parsed["answer"] as? String else {
            return ["found": false, "answer": parsed["raw"] as? String ?? "I could not make sense of the view."]
        }
        var reply: [String: Any] = ["found": parsed["found"] as? Bool ?? false, "answer": answer]
        if parsed["closer"] as? Bool == true, let box = (parsed["box"] as? [NSNumber])?.map({ CGFloat(truncating: $0) / 1000 }),
           box.count == 4, box[2] > box[0], box[3] > box[1] {
            reply["closer"] = CGRect(x: box[0], y: box[1], width: box[2] - box[0], height: box[3] - box[1])
        }
        return reply
    }

    /// Aim at `box` (0-1 fractions, top-left origin) and zoom so it fills about
    /// half the frame. Blocks while the camera moves.
    private func moveCloser(to box: CGRect) {
        settingsLock.lock()
        let zoom = currentZoomFactor
        settingsLock.unlock()
        // Same Link 2 field of view as following: ~70° × 43° at 1×.
        let pan = Float((box.midX - 0.5) * 70 / zoom)
        let tilt = Float((0.5 - box.midY) * 43 / zoom)
        ptzQueue.sync { _ = hubbubbLinkCameraNudge(pan, tilt) }
        applyHardwareZoom(min(4, zoom * 0.5 / max(box.width, box.height, 0.01)))
        Thread.sleep(forTimeInterval: 2.5)
    }

    /// One JSON-mode request to Ollama on this Mac. -> the reply's JSON, or
    /// {"raw": text} if it wasn't JSON, or nil if Ollama didn't answer.
    private func askOllama(_ prompt: String, images: [Data]) -> [String: Any]? {
        // The house model is multimodal, so no second model has to load.
        let model = UserDefaults.standard.string(forKey: "visionModel") ?? "huihui_ai/Qwen3.6-abliterated:35b-a3b"
        guard let url = URL(string: "http://127.0.0.1:11434/api/chat") else { return nil }
        var request = URLRequest(url: url, timeoutInterval: 90)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = try? JSONSerialization.data(withJSONObject: [
            "model": model, "stream": false, "think": false, "format": "json",
            "messages": [["role": "user", "content": prompt, "images": images.map { $0.base64EncodedString() }]]
        ])
        let done = DispatchSemaphore(value: 0)
        var content: String?
        URLSession.shared.dataTask(with: request) { data, _, _ in
            let reply = data.flatMap { try? JSONSerialization.jsonObject(with: $0) } as? [String: Any]
            content = (reply?["message"] as? [String: Any])?["content"] as? String
            done.signal()
        }.resume()
        done.wait()
        guard let content else { return nil }
        return (try? JSONSerialization.jsonObject(with: Data(content.utf8))) as? [String: Any] ?? ["raw": content]
    }

    /// Learn what one of the user's things looks like from the current view:
    /// a description and a cropped photo, saved under `name`. `hint` says which
    /// thing ("the thing they are holding up", "on the shelf by the door").
    func learn(name: String, hint: String) -> [String: Any] {
        lookQueue.sync {
            settingsLock.lock()
            let frame = latestFrame
            settingsLock.unlock()
            guard let frame, let image = latestJPEG() else { return ["error": "The camera has no picture right now."] }
            let prompt = """
            The user is showing a home camera something they call "\(name)". It is \(hint).
            Reply with JSON only: {"visible": true or false, "description": "...", "box": [x0, y0, x1, y1]}.
            "visible": whether you can clearly see that object. "description": one sentence on how it looks - \
            color, shape, material, size, markings - so it can be recognized again from across the room. \
            "box": where it is in the image, on a 0-1000 scale from the top-left corner.
            """
            guard let reply = askOllama(prompt, images: [image]) else {
                return ["error": "The vision model on the Mac did not answer."]
            }
            guard reply["visible"] as? Bool == true, let description = reply["description"] as? String else {
                return ["error": "I could not make out the \(name) - hold it up closer to the camera, or say where it is."]
            }
            // Crop to the thing, padded; the whole frame if the box makes no sense.
            var crop = frame
            if let box = (reply["box"] as? [NSNumber])?.map({ CGFloat(truncating: $0) / 1000 }), box.count == 4,
               box[2] > box[0], box[3] > box[1] {
                let w = CGFloat(frame.width), h = CGFloat(frame.height)
                let rect = CGRect(x: box[0] * w, y: box[1] * h, width: (box[2] - box[0]) * w, height: (box[3] - box[1]) * h)
                    .insetBy(dx: -(box[2] - box[0]) * w * 0.1, dy: -(box[3] - box[1]) * h * 0.1)
                crop = frame.cropping(to: rect.intersection(CGRect(x: 0, y: 0, width: w, height: h))) ?? frame
            }
            let file = name.lowercased().filter { $0.isLetter || $0.isNumber } + ".jpg"
            // 512 px is plenty to recognize it by, and keeps every later search fast.
            let shrink = min(1, 512 / CGFloat(max(crop.width, crop.height)))
            let small = CIImage(cgImage: crop).transformed(by: CGAffineTransform(scaleX: shrink, y: shrink))
            guard let jpeg = context.jpegRepresentation(of: small, colorSpace: CGColorSpaceCreateDeviceRGB()) else {
                return ["error": "Could not save the picture."]
            }
            do {
                try FileManager.default.createDirectory(at: ItemBook.folder, withIntermediateDirectories: true)
                try jpeg.write(to: ItemBook.folder.appendingPathComponent(file), options: .atomic)
                itemBook.items[name.lowercased()] = .init(name: name, description: description, image: file)
                try itemBook.save()
            } catch {
                return ["error": "Could not save what I learned: \(error.localizedDescription)"]
            }
            return ["learned": name, "looks_like": description]
        }
    }


    private func gestureTitle(_ id: String) -> String {
        switch id {
        case "thumbs_up": return "Thumbs up"
        case "open_palm": return "Open palm"
        case "thumbs_down": return "Thumbs down"
        case "number_1": return "One finger"
        case "number_2": return "Two fingers"
        case "number_3": return "Three fingers"
        default: return "Gesture"
        }
    }


    private func classifyGesture(_ observation: VNHumanHandPoseObservation) -> String? {
        func point(_ joint: VNHumanHandPoseObservation.JointName) -> VNRecognizedPoint? {
            try? observation.recognizedPoint(joint)
        }

        guard let thumbTip = point(.thumbTip),
              let thumbIP = point(.thumbIP),
              let thumbMCP = point(.thumbMP),
              let indexTip = point(.indexTip), let indexPIP = point(.indexPIP),
              let indexMCP = point(.indexMCP),
              let middleTip = point(.middleTip), let middlePIP = point(.middlePIP), let middleMCP = point(.middleMCP),
              let ringTip = point(.ringTip), let ringPIP = point(.ringPIP), let ringMCP = point(.ringMCP),
              let littleTip = point(.littleTip), let littlePIP = point(.littlePIP), let littleMCP = point(.littleMCP),
              [thumbTip, thumbIP, thumbMCP, indexTip, indexPIP, indexMCP, middleTip, middlePIP, middleMCP,
               ringTip, ringPIP, ringMCP, littleTip, littlePIP, littleMCP]
                .allSatisfy({ $0.confidence > 0.08 }) else { return nil }

        func distance(_ a: VNRecognizedPoint, _ b: VNRecognizedPoint) -> CGFloat {
            hypot(a.location.x - b.location.x, a.location.y - b.location.y)
        }
        let fingerTriples = [
            (indexTip, indexPIP, indexMCP), (middleTip, middlePIP, middleMCP),
            (ringTip, ringPIP, ringMCP), (littleTip, littlePIP, littleMCP)
        ]
        let curled = fingerTriples.map { tip, pip, mcp in
            distance(tip, mcp) < distance(pip, mcp) * 1.35
        }
        let extended = fingerTriples.map { tip, pip, mcp in
            distance(tip, mcp) > distance(pip, mcp) * 1.35 && tip.location.y > pip.location.y + 0.005
        }
        let curledFingers = curled.filter { $0 }.count
        let palmWidth = max(0.04, distance(indexMCP, littleMCP))

        // Vision coordinates increase upward. Requiring lift beyond both
        // thumb joints prevents a sideways thumb from counting as a thumbs-up.
        let thumbRaised = thumbTip.location.y > thumbIP.location.y + 0.025
            && thumbTip.location.y > thumbMCP.location.y + 0.055
        // Thumbs-down only needs the thumb angled downward, not straight down:
        // measure the base-to-tip angle (x scaled for the 16:9 frame) so it
        // works at any distance. -0.2 ≈ 12° below horizontal; raise toward 0 to loosen.
        let thumbDX = (thumbTip.location.x - thumbMCP.location.x) * 16 / 9
        let thumbDY = thumbTip.location.y - thumbMCP.location.y
        let thumbLowered = thumbDY / max(0.001, hypot(thumbDX, thumbDY)) < -0.2
        let extendedCount = extended.filter { $0 }.count
        let thumbToPalm = distance(thumbTip, indexMCP)
        let thumbToBase = distance(thumbTip, thumbMCP)
        switch extendedCount {
        case 1: return "number_1"
        case 2: return "number_2"
        case 3: return "number_3"
        default: break
        }

        if thumbRaised && curledFingers >= 3
            && thumbToPalm > palmWidth * 0.78 && thumbToBase > palmWidth * 0.52 {
            return "thumbs_up"
        }
        // A tilted thumb sits closer to the palm in the image, so allow a shorter reach.
        if thumbLowered && curledFingers >= 3
            && thumbToPalm > palmWidth * 0.55 && thumbToBase > palmWidth * 0.35 {
            return "thumbs_down"
        }
        let fingertipSpan = distance(indexTip, littleTip)
        if extendedCount == 4 && thumbToPalm > palmWidth * 0.78
            && fingertipSpan > palmWidth * 0.95 { return "open_palm" }
        return nil
    }
}


/// Home Assistant's way in, over the LAN. Every request needs the companion's
/// token (same Mac, same file), so no second secret has to be set up.
///   JSON endpoints are routed by CameraService.
///   GET /stream  -> MJPEG of the annotated preview, for the camera entity
///   GET /events?after=N -> long poll: {"seq", "events": [...]} after event N,
///                          answered at once if there are any, else within 25 s
private final class CameraServer {
    enum Reply {
        case json(String, Any)
        case jpeg(Data)
        case stream
        case poll(Int)
    }
    typealias Route = (_ method: String, _ path: String, _ query: [String: String], _ body: [String: Any]) -> Reply

    static let port: UInt16 = 8791
    private let listener: NWListener
    private let token: String
    private let route: Route
    private let queue = DispatchQueue(label: "com.hubbubb.camera.server", attributes: .concurrent)
    private let lock = NSLock()
    private var streams: [ObjectIdentifier: NWConnection] = [:]
    private var waiters: [ObjectIdentifier: (after: Int, connection: NWConnection)] = [:]
    private var events: [(seq: Int, event: [String: Any])] = []
    private var seq = 0
    private var frame: Data?

    init?(route: @escaping Route) {
        let path = NSString(string: "~/.claude/hooks/.voice-token").expandingTildeInPath
        guard let token = try? String(contentsOfFile: path, encoding: .utf8)
                .trimmingCharacters(in: .whitespacesAndNewlines), !token.isEmpty,
              let port = NWEndpoint.Port(rawValue: Self.port),
              let listener = try? NWListener(using: .tcp, on: port) else { return nil }
        self.token = token
        self.route = route
        self.listener = listener
        listener.newConnectionHandler = { [weak self] connection in
            connection.start(queue: self?.queue ?? .global())
            self?.receive(connection, buffer: Data())
        }
        listener.start(queue: queue)
    }

    /// Whether anyone is watching the live view (frames are only encoded then).
    var watching: Bool {
        lock.lock()
        defer { lock.unlock() }
        return !streams.isEmpty || frame == nil || Date().timeIntervalSince(frameAt) > 2
    }
    private var frameAt = Date.distantPast

    var lastFrame: Data? {
        lock.lock()
        defer { lock.unlock() }
        return frame
    }

    func pushFrame(_ jpeg: Data) {
        lock.lock()
        frame = jpeg
        frameAt = Date()
        let viewers = Array(streams.values)
        lock.unlock()
        let part = Data("--frame\r\nContent-Type: image/jpeg\r\nContent-Length: \(jpeg.count)\r\n\r\n".utf8) + jpeg + Data("\r\n".utf8)
        for connection in viewers {
            connection.send(content: part, completion: .contentProcessed { [weak self] error in
                if error != nil { self?.drop(connection) }
            })
        }
    }

    func push(_ event: [String: Any]) {
        lock.lock()
        seq += 1
        var stamped = event
        stamped["ts"] = Date().timeIntervalSince1970
        events.append((seq, stamped))
        if events.count > 200 { events.removeFirst(events.count - 200) }
        let ready = waiters
        waiters.removeAll()
        lock.unlock()
        for (_, waiter) in ready { answerPoll(waiter.connection, after: waiter.after) }
    }

    private func drop(_ connection: NWConnection) {
        lock.lock()
        streams.removeValue(forKey: ObjectIdentifier(connection))
        lock.unlock()
        connection.cancel()
    }

    private func answerPoll(_ connection: NWConnection, after: Int) {
        lock.lock()
        // A poller from before a restart can be ahead of us: send everything.
        let since = after > seq ? 0 : after
        let pending = events.filter { $0.seq > since }.map(\.event)
        let current = seq
        lock.unlock()
        send(connection, status: "200 OK", type: "application/json",
             body: (try? JSONSerialization.data(withJSONObject: ["seq": current, "events": pending])) ?? Data())
    }

    private func send(_ connection: NWConnection, status: String, type: String, body: Data) {
        let head = "HTTP/1.1 \(status)\r\nContent-Type: \(type)\r\nContent-Length: \(body.count)\r\nConnection: close\r\n\r\n"
        connection.send(content: Data(head.utf8) + body, completion: .contentProcessed { _ in connection.cancel() })
    }

    private func receive(_ connection: NWConnection, buffer: Data) {
        connection.receive(minimumIncompleteLength: 1, maximumLength: 65536) { [weak self] data, _, complete, error in
            guard let self else { return }
            var buffer = buffer
            if let data { buffer.append(data) }
            guard buffer.count < 65536, error == nil else { return connection.cancel() }
            guard let split = buffer.range(of: Data("\r\n\r\n".utf8)) else {
                return complete ? connection.cancel() : self.receive(connection, buffer: buffer)
            }
            let head = String(decoding: buffer[..<split.lowerBound], as: UTF8.self)
            let lines = head.components(separatedBy: "\r\n")
            var headers: [String: String] = [:]
            for line in lines.dropFirst() {
                let parts = line.split(separator: ":", maxSplits: 1)
                if parts.count == 2 { headers[parts[0].lowercased()] = parts[1].trimmingCharacters(in: .whitespaces) }
            }
            let body = buffer[split.upperBound...]
            if let length = Int(headers["content-length"] ?? "0"), body.count < length, !complete {
                return self.receive(connection, buffer: buffer)
            }
            self.handle(connection, request: lines.first ?? "", headers: headers, body: Data(body))
        }
    }

    private func handle(_ connection: NWConnection, request: String, headers: [String: String], body: Data) {
        func json(_ status: String, _ value: Any) {
            send(connection, status: status, type: "application/json",
                 body: (try? JSONSerialization.data(withJSONObject: value)) ?? Data("{}".utf8))
        }
        guard Self.sameSecret(headers["authorization"] ?? "", "Bearer \(token)") else {
            return json("401 Unauthorized", ["ok": false, "detail": "missing or wrong token"])
        }
        let parts = request.split(separator: " ").map(String.init)
        guard parts.count >= 2, let url = URLComponents(string: parts[1]) else {
            return json("400 Bad Request", ["ok": false, "detail": "bad request line"])
        }
        let query = Dictionary((url.queryItems ?? []).map { ($0.name, $0.value ?? "") }) { _, last in last }
        let fields = ((try? JSONSerialization.jsonObject(with: body)) as? [String: Any]) ?? [:]
        switch route(parts[0], url.path, query, fields) {
        case let .json(status, value):
            json(status, value)
        case let .jpeg(data):
            send(connection, status: "200 OK", type: "image/jpeg", body: data)
        case .stream:
            let head = "HTTP/1.1 200 OK\r\nContent-Type: multipart/x-mixed-replace; boundary=frame\r\nCache-Control: no-cache\r\nConnection: close\r\n\r\n"
            connection.send(content: Data(head.utf8), completion: .contentProcessed { [weak self] error in
                guard let self, error == nil else { return connection.cancel() }
                self.lock.lock()
                self.streams[ObjectIdentifier(connection)] = connection
                self.lock.unlock()
            })
        case let .poll(after):
            lock.lock()
            let ready = events.contains { $0.seq > after } || after > seq
            if !ready { waiters[ObjectIdentifier(connection)] = (after, connection) }
            lock.unlock()
            if ready { return answerPoll(connection, after: after) }
            queue.asyncAfter(deadline: .now() + 25) { [weak self] in
                guard let self else { return }
                self.lock.lock()
                let waiter = self.waiters.removeValue(forKey: ObjectIdentifier(connection))
                self.lock.unlock()
                if let waiter { self.answerPoll(waiter.connection, after: waiter.after) }
            }
        }
    }

    private static func sameSecret(_ a: String, _ b: String) -> Bool {
        let x = Array(a.utf8), y = Array(b.utf8)
        guard x.count == y.count else { return false }
        return zip(x, y).reduce(0) { $0 | ($1.0 ^ $1.1) } == 0
    }
}
