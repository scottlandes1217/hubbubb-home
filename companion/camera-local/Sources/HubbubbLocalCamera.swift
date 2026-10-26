import AppKit
import AVFoundation
import Vision
import Security
import Network

private let appTitle = "Hubbubb Local Camera"

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
        print("RoomMap self-test passed")
    }
}

@_silgen_name("HubbubbLinkCameraNudge")
private func hubbubbLinkCameraNudge(_ pan: Float, _ tilt: Float) -> Int32

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
        application.setActivationPolicy(.regular)
        let delegate = CameraAppDelegate()
        application.delegate = delegate
        application.run()
    }
}

private final class CameraAppDelegate: NSObject, NSApplicationDelegate {
    private var window: NSWindow?

    func applicationDidFinishLaunching(_ notification: Notification) {
        installMainMenu()
        let controller = CameraViewController()
        controller.preferredContentSize = NSSize(width: 1200, height: 760)
        let window = NSWindow(
            contentRect: NSRect(x: 0, y: 0, width: 1200, height: 760),
            styleMask: [.titled, .closable, .miniaturizable, .resizable],
            backing: .buffered,
            defer: false
        )
        window.title = appTitle
        window.contentViewController = controller
        window.setContentSize(NSSize(width: 1200, height: 760))
        window.center()
        window.minSize = NSSize(width: 960, height: 700)
        window.makeKeyAndOrderFront(nil)
        window.orderFrontRegardless()
        DispatchQueue.main.async { controller.startCameraIfNeeded() }
        self.window = window
        NSApp.activate(ignoringOtherApps: true)
    }

    private func installMainMenu() {
        let mainMenu = NSMenu()
        let appMenuItem = NSMenuItem()
        let appMenu = NSMenu(title: appTitle)
        appMenu.addItem(withTitle: "Quit \(appTitle)", action: #selector(NSApplication.terminate(_:)), keyEquivalent: "q")
        appMenuItem.submenu = appMenu
        mainMenu.addItem(appMenuItem)

        let editMenuItem = NSMenuItem()
        let editMenu = NSMenu(title: "Edit")
        let pasteItem = NSMenuItem(title: "Paste", action: #selector(NSText.paste(_:)), keyEquivalent: "v")
        pasteItem.keyEquivalentModifierMask = [.command]
        editMenu.addItem(pasteItem)
        editMenuItem.submenu = editMenu
        mainMenu.addItem(editMenuItem)
        NSApp.mainMenu = mainMenu
    }

    func applicationShouldTerminateAfterLastWindowClosed(_ sender: NSApplication) -> Bool {
        true
    }
}

private final class CameraViewController: NSViewController {
    private let session = AVCaptureSession()
    private let sessionQueue = DispatchQueue(label: "com.hubbubb.camera.session")
    private let previewImage = NSImageView()
    private let statusLabel = NSTextField(labelWithString: "Requesting camera access…")
    private let controlFeedbackLabel = NSTextField(labelWithString: "Camera controls are ready.")
    private let eventLabel = NSTextField(labelWithString: "WAITING FOR A GESTURE  •  local actions")
    private let panel = NSView()
    private let gestureScrollView = NSScrollView()
    private let gestureContentView = NSView()
    private let framingCheckbox = NSButton(checkboxWithTitle: "Auto-zoom to my face", target: nil, action: nil)
    private let trackingCheckbox = NSButton(checkboxWithTitle: "AI following", target: nil, action: nil)
    private let leftPanButton = NSButton(title: "◀", target: nil, action: nil)
    private let rightPanButton = NSButton(title: "▶", target: nil, action: nil)
    private let zoomSlider = NSSlider(value: 1.0, minValue: 1.0, maxValue: 4.0, target: nil, action: nil)
    private let zoomLabel = NSTextField(labelWithString: "1.0×")
    private var localFollowingEnabled = UserDefaults.standard.object(forKey: "localAIFollowingEnabled") as? Bool ?? true
    private var gestureRows: [String: NSTextField] = [:]
    private var testButtons: [NSButton] = []
    private let programmedGestures: [(id: String, title: String, assignment: String)] = [
        ("thumbs_up", "Thumbs up", "TV volume up (hold for more)"),
        ("open_palm", "Open palm", "Apple TV center / select button"),
        ("thumbs_down", "Thumbs down", "TV volume down (hold for more)"),
        ("number_1", "One finger", "Apple TV HDMI input"),
        ("number_2", "Two fingers", "Mac Main Display HDMI input"),
        ("number_3", "Three fingers", "Mac Second Display + start screen sharing"),
        ("two_palms", "Both palms", "Toggle TV extended display")
    ]
    private var configured = false
    private var didRequestCamera = false
    private var processor: LocalVisionProcessor?
    private var lookServer: LookServer?
    private var pendingTVButtonSteps = 0
    private var tvVolumeActionInFlight = false

    init() {
        super.init(nibName: nil, bundle: nil)
    }

    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    override func loadView() {
        let root = NSView(frame: NSRect(x: 0, y: 0, width: 1200, height: 760))
        root.wantsLayer = true
        root.layer?.backgroundColor = NSColor.black.cgColor
        view = root

        previewImage.imageScaling = .scaleProportionallyUpOrDown
        previewImage.imageAlignment = .alignCenter
        previewImage.wantsLayer = true
        previewImage.layer?.backgroundColor = NSColor.black.cgColor
        root.addSubview(previewImage)
        for button in [leftPanButton, rightPanButton] {
            button.bezelStyle = .circular
            button.font = .systemFont(ofSize: 23, weight: .semibold)
            button.contentTintColor = .white
            button.wantsLayer = true
            button.layer?.backgroundColor = NSColor.black.withAlphaComponent(0.55).cgColor
            root.addSubview(button)
        }
        leftPanButton.target = self
        leftPanButton.action = #selector(panLeft)
        rightPanButton.target = self
        rightPanButton.action = #selector(panRight)
        panel.wantsLayer = true
        panel.layer?.backgroundColor = NSColor(calibratedWhite: 0.10, alpha: 1).cgColor
        root.addSubview(panel)

        configureOverlay(statusLabel, fontSize: 15, weight: .semibold)
        configureOverlay(eventLabel, fontSize: 15, weight: .bold)
        statusLabel.stringValue = "Local vision is idle. Waiting for the camera…"
        eventLabel.stringValue = "WAITING FOR A GESTURE  •  local actions"
        root.addSubview(statusLabel)
        root.addSubview(eventLabel)
        buildControlPanel()
        layoutControlPanel(height: 760)
    }

    override func viewDidLayout() {
        super.viewDidLayout()
        let bounds = view.bounds
        let panelWidth: CGFloat = 340
        let previewWidth = bounds.width - panelWidth
        previewImage.frame = NSRect(x: 0, y: 0, width: previewWidth, height: bounds.height)
        leftPanButton.frame = NSRect(x: 20, y: (bounds.height - 52) / 2, width: 52, height: 52)
        rightPanButton.frame = NSRect(x: previewWidth - 72, y: (bounds.height - 52) / 2, width: 52, height: 52)
        panel.frame = NSRect(x: previewWidth, y: 0, width: panelWidth, height: bounds.height)
        let margin: CGFloat = 18
        statusLabel.frame = NSRect(x: margin, y: bounds.height - 50, width: previewWidth - margin * 2, height: 24)
        eventLabel.frame = NSRect(x: margin, y: 18, width: previewWidth - margin * 2, height: 34)
        layoutControlPanel(height: bounds.height)
    }

    override func viewDidAppear() {
        super.viewDidAppear()
        DispatchQueue.main.async { [weak self] in
            self?.startCameraIfNeeded()
        }
    }

    func startCameraIfNeeded() {
        guard !didRequestCamera else { return }
        didRequestCamera = true
        setStatus("Requesting camera access…")
        requestCameraAccess()
    }

    private func configureOverlay(_ label: NSTextField, fontSize: CGFloat, weight: NSFont.Weight) {
        label.font = .systemFont(ofSize: fontSize, weight: weight)
        label.textColor = .white
        label.backgroundColor = NSColor.black.withAlphaComponent(0.66)
        label.drawsBackground = true
        label.isBezeled = false
        label.isEditable = false
        label.isSelectable = false
        label.lineBreakMode = .byTruncatingTail
    }

    private func buildControlPanel() {
        let title = panelLabel("CAMERA CONTROLS", size: 16, weight: .bold)
        title.tag = 100
        panel.addSubview(title)
        let caption = panelLabel("Everything here runs on this Mac.", size: 12, weight: .regular)
        caption.tag = 101
        panel.addSubview(caption)

        framingCheckbox.state = .on
        framingCheckbox.font = .systemFont(ofSize: 13, weight: .medium)
        framingCheckbox.target = self
        framingCheckbox.action = #selector(toggleAutoZoom)
        panel.addSubview(framingCheckbox)

        trackingCheckbox.state = localFollowingEnabled ? .on : .off
        trackingCheckbox.font = .systemFont(ofSize: 13, weight: .medium)
        trackingCheckbox.target = self
        trackingCheckbox.action = #selector(toggleTracking)
        panel.addSubview(trackingCheckbox)

        let zoomTitle = panelLabel("Camera zoom (Link 2)", size: 13, weight: .semibold)
        zoomTitle.tag = 102
        panel.addSubview(zoomTitle)
        zoomSlider.target = self
        zoomSlider.action = #selector(setManualZoom)
        panel.addSubview(zoomSlider)
        zoomLabel.font = .monospacedDigitSystemFont(ofSize: 12, weight: .medium)
        zoomLabel.textColor = .white
        zoomLabel.alignment = .right
        panel.addSubview(zoomLabel)

        let enrollButton = NSButton(title: "Enroll a person…", target: self, action: #selector(enrollPerson))
        enrollButton.bezelStyle = .rounded
        enrollButton.tag = 108
        panel.addSubview(enrollButton)

        let centerButton = NSButton(title: "Zoom to 1×", target: self, action: #selector(recenterFraming))
        centerButton.bezelStyle = .rounded
        centerButton.tag = 103
        panel.addSubview(centerButton)

        let volumeSetupButton = NSButton(title: "Set up TV volume actions…", target: self, action: #selector(configureTVVolume))
        volumeSetupButton.bezelStyle = .rounded
        volumeSetupButton.tag = 107
        panel.addSubview(volumeSetupButton)

        let gesturesTitle = panelLabel("PROGRAMMED GESTURES", size: 14, weight: .bold)
        gesturesTitle.tag = 104
        panel.addSubview(gesturesTitle)
        gestureScrollView.drawsBackground = false
        gestureScrollView.hasVerticalScroller = true
        gestureScrollView.autohidesScrollers = true
        gestureScrollView.borderType = .noBorder
        gestureScrollView.documentView = gestureContentView
        panel.addSubview(gestureScrollView)
        for (index, gesture) in programmedGestures.enumerated() {
            let row = panelLabel("\(gesture.title)\n→ \(gesture.assignment)", size: 12, weight: .medium)
            row.lineBreakMode = .byWordWrapping
            row.maximumNumberOfLines = 2
            gestureContentView.addSubview(row)
            gestureRows[gesture.id] = row
            let button = NSButton(title: "Test", target: self, action: #selector(testGesture(_:)))
            button.bezelStyle = .rounded
            button.tag = index
            gestureContentView.addSubview(button)
            testButtons.append(button)
        }
        let note = panelLabel("Hold 1 for Apple TV, 2 for Mac Main Display, or 3 for Mac Second Display and screen sharing. Hold thumbs up or down for TV volume. One open palm presses Apple TV center/select; both palms toggle the TV display. Keep hands away from your face.", size: 11, weight: .regular)
        note.textColor = NSColor(calibratedWhite: 0.72, alpha: 1)
        note.lineBreakMode = .byWordWrapping
        note.maximumNumberOfLines = 3
        note.tag = 105
        panel.addSubview(note)
        controlFeedbackLabel.font = .systemFont(ofSize: 11, weight: .medium)
        controlFeedbackLabel.textColor = NSColor(calibratedWhite: 0.82, alpha: 1)
        controlFeedbackLabel.lineBreakMode = .byWordWrapping
        controlFeedbackLabel.maximumNumberOfLines = 2
        controlFeedbackLabel.tag = 106
        panel.addSubview(controlFeedbackLabel)
    }

    private func panelLabel(_ text: String, size: CGFloat, weight: NSFont.Weight) -> NSTextField {
        let label = NSTextField(labelWithString: text)
        label.font = .systemFont(ofSize: size, weight: weight)
        label.textColor = .white
        label.lineBreakMode = .byTruncatingTail
        return label
    }

    private func layoutControlPanel(height: CGFloat) {
        func frame(_ tag: Int, _ rect: NSRect) { panel.viewWithTag(tag)?.frame = rect }
        frame(100, NSRect(x: 18, y: height - 48, width: 300, height: 22))
        frame(101, NSRect(x: 18, y: height - 70, width: 300, height: 18))
        framingCheckbox.frame = NSRect(x: 14, y: height - 111, width: 300, height: 24)
        trackingCheckbox.frame = NSRect(x: 14, y: height - 140, width: 300, height: 24)
        frame(107, NSRect(x: 18, y: height - 181, width: 290, height: 28))
        frame(102, NSRect(x: 18, y: height - 211, width: 180, height: 20))
        zoomSlider.frame = NSRect(x: 14, y: height - 242, width: 238, height: 24)
        zoomLabel.frame = NSRect(x: 258, y: height - 242, width: 56, height: 24)
        frame(103, NSRect(x: 18, y: height - 282, width: 120, height: 30))
        frame(108, NSRect(x: 144, y: height - 282, width: 164, height: 30))
        frame(104, NSRect(x: 18, y: height - 312, width: 300, height: 22))
        let scrollFrame = NSRect(x: 10, y: 132, width: 320, height: max(140, height - 472))
        gestureScrollView.frame = scrollFrame
        let contentHeight = CGFloat(testButtons.count) * 53 + 12
        gestureContentView.frame = NSRect(x: 0, y: 0, width: scrollFrame.width - 18, height: contentHeight)
        for (index, button) in testButtons.enumerated() {
            let y = contentHeight - 48 - CGFloat(index) * 53
            gestureRows[programmedGestures[index].id]?.frame = NSRect(x: 8, y: y, width: 210, height: 42)
            button.frame = NSRect(x: 226, y: y + 6, width: 68, height: 28)
        }
        gestureScrollView.contentView.scroll(to: NSPoint(x: 0, y: max(0, contentHeight - scrollFrame.height)))
        gestureScrollView.reflectScrolledClipView(gestureScrollView.contentView)
        frame(105, NSRect(x: 18, y: 24, width: 300, height: 58))
        frame(106, NSRect(x: 18, y: 91, width: 300, height: 34))
    }

    @objc private func toggleAutoZoom() {
        processor?.updateSettings(
            autoZoom: framingCheckbox.state == .on,
            zoomFactor: CGFloat(zoomSlider.doubleValue),
            autoFollow: localFollowingEnabled
        )
    }

    @objc private func panLeft() { panCamera(direction: -1, description: "left") }

    @objc private func panRight() { panCamera(direction: 1, description: "right") }

    private func panCamera(direction: Int32, description: String) {
        sessionQueue.async { [weak self] in
        let succeeded = hubbubbLinkCameraPanStep(direction) == 1
            DispatchQueue.main.async {
                let message = succeeded ? "Panned camera \(description)." : "Could not pan the Link 2 camera."
                self?.controlFeedbackLabel.stringValue = message
                self?.setStatus(message)
            }
        }
    }

    @objc private func toggleTracking() {
        localFollowingEnabled.toggle()
        UserDefaults.standard.set(localFollowingEnabled, forKey: "localAIFollowingEnabled")
        let enabled = localFollowingEnabled
        trackingCheckbox.state = enabled ? .on : .off
        processor?.updateSettings(
            autoZoom: framingCheckbox.state == .on,
            zoomFactor: CGFloat(zoomSlider.doubleValue),
            autoFollow: enabled
        )
        let message = enabled
            ? "Local AI following is on. Vision will steer the camera toward your face."
            : "Local AI following is off."
        controlFeedbackLabel.stringValue = message
        setStatus(message)
    }

    @objc private func setManualZoom() {
        framingCheckbox.state = .off
        zoomLabel.stringValue = String(format: "%.1f×", zoomSlider.doubleValue)
        processor?.updateSettings(autoZoom: false, zoomFactor: CGFloat(zoomSlider.doubleValue), autoFollow: localFollowingEnabled)
    }

    @objc private func recenterFraming() {
        zoomSlider.doubleValue = 1.0
        framingCheckbox.state = .off
        processor?.updateSettings(autoZoom: false, zoomFactor: 1.0, autoFollow: localFollowingEnabled)
        setStatus("Camera lens zoom reset to 1×. The preview is the full camera feed.")
    }

    @objc private func enrollPerson() {
        guard let processor else {
            controlFeedbackLabel.stringValue = "Wait for the camera to connect before enrolling."
            return
        }
        let nameField = NSTextField(string: "")
        nameField.placeholderString = "Name, as Jarvis should say it"
        nameField.frame = NSRect(x: 0, y: 0, width: 300, height: 24)
        let alert = NSAlert()
        alert.messageText = "Enroll a person"
        let known = processor.enrolledNames
        alert.informativeText = "Stand alone in front of the camera, then press Start and slowly turn your head. "
            + "Face samples stay on this Mac. Enrolling a name again replaces it."
            + (known.isEmpty ? "" : "\nAlready enrolled: \(known.joined(separator: ", ")).")
        alert.accessoryView = nameField
        alert.addButton(withTitle: "Start")
        alert.addButton(withTitle: "Cancel")
        alert.window.initialFirstResponder = nameField
        guard alert.runModal() == .alertFirstButtonReturn else { return }
        let name = nameField.stringValue.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !name.isEmpty, name.count <= 40 else {
            controlFeedbackLabel.stringValue = "Enter a name to enroll."
            return
        }
        processor.beginEnrollment(name: name)
        controlFeedbackLabel.stringValue = "Enrolling \(name). Follow the prompt on the preview."
    }

    /// Who the camera recognizes, for Jarvis's "who is speaking" guess.
    /// Sent as a Home Assistant event with the same local token as the TV actions.
    private func postPresence(_ people: [String]) {
        let defaults = UserDefaults.standard
        guard let base = defaults.string(forKey: "haBaseURL"),
              let token = loadToken(), !token.isEmpty,
              let url = URL(string: "\(base)/api/events/hubbubb_home_camera_people") else { return }
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = try? JSONSerialization.data(withJSONObject: ["people": people])
        URLSession.shared.dataTask(with: request).resume()
    }

    @objc private func testGesture(_ sender: NSButton) {
        guard programmedGestures.indices.contains(sender.tag) else { return }
        let gesture = programmedGestures[sender.tag].id
        handleGesture(gesture)
    }

    private func showGestureEvent(_ gesture: String) {
        print("Hubbubb local gesture event: \(gesture)")
        eventLabel.stringValue = "EVENT FIRED  •  \(gesture)  •  local demo event"
    }

    private func handleGesture(_ gesture: String) {
        if gesture == "number_1" || gesture == "number_2" || gesture == "number_3" {
            let input = gesture == "number_1" ? "Apple TV" : (gesture == "number_2" ? "Mac Main Display" : "Mac Second Display")
            selectCameraInput(input, startScreenSharing: gesture == "number_3")
            return
        }
        if gesture == "two_palms" {
            toggleMacTVExtension()
            return
        }
        if gesture == "open_palm" {
            sendTVSelect()
            return
        }
        guard gesture == "thumbs_up" || gesture == "thumbs_down" else {
            showGestureEvent(gesture)
            return
        }
        // The vision processor repeats thumbs events while the pose is held,
        // so each event is one volume step and a longer hold means more volume.
        sendTVVolumeStep(up: gesture == "thumbs_up")
    }

    private func selectCameraInput(_ input: String, startScreenSharing: Bool) {
        let defaults = UserDefaults.standard
        guard let base = defaults.string(forKey: "haBaseURL"),
              let token = loadToken(), !token.isEmpty,
              let stateURL = URL(string: "\(base)/api/states/select.living_room_sync_box_hdmi_input") else {
            controlFeedbackLabel.stringValue = "Set up the local Home Assistant connection before switching Sync Box inputs."
            return
        }
        var request = URLRequest(url: stateURL)
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        URLSession.shared.dataTask(with: request) { [weak self] data, response, error in
            DispatchQueue.main.async {
                guard let self else { return }
                guard error == nil,
                      let response = response as? HTTPURLResponse,
                      (200..<300).contains(response.statusCode),
                      let data,
                      let state = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
                      let attributes = state["attributes"] as? [String: Any],
                      let options = attributes["options"] as? [String],
                      options.contains(input) else {
                    self.controlFeedbackLabel.stringValue = "Could not read the Sync Box HDMI input list from Home Assistant."
                    return
                }
                self.controlFeedbackLabel.stringValue = "Switching Hue Sync Box to \(input)…"
                self.selectSyncBoxInput(named: input, base: base, token: token) { [weak self] succeeded in
                    guard let self else { return }
                    guard succeeded else {
                        self.controlFeedbackLabel.stringValue = "Home Assistant could not switch the Sync Box to \(input)."
                        return
                    }
                    self.eventLabel.stringValue = "EVENT FIRED  •  Sync Box input: \(input)"
                    guard startScreenSharing else {
                        self.controlFeedbackLabel.stringValue = "Hue Sync Box switched to \(input)."
                        self.stopScreenSharing { [weak self] note in
                            self?.controlFeedbackLabel.stringValue = "Hue Sync Box switched to \(input)." + note
                        }
                        return
                    }
                    self.controlFeedbackLabel.stringValue = "Mac Second Display selected. Starting screen sharing…"
                    self.startScreenSharing { [weak self] success, message in
                        guard let self else { return }
                        self.controlFeedbackLabel.stringValue = message
                        if success { self.eventLabel.stringValue = "EVENT FIRED  •  Mac Second Display + screen sharing" }
                    }
                }
            }
        }.resume()
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
                completion(false, "Could not start Samsung Screen Mirroring: \(detail). Allow Hubbubb Local Camera under Privacy & Security → Accessibility and Automation, then try gesture 3 again.")
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

    /// Runs a UI script off the main thread; completes with nil on success or the error text.
    private func runScreenMirroringScript(_ script: String, completion: @escaping (String?) -> Void) {
        DispatchQueue.global(qos: .userInitiated).async {
            var error: NSDictionary?
            let result = NSAppleScript(source: script)?.executeAndReturnError(&error)
            DispatchQueue.main.async {
                completion(result != nil && error == nil ? nil
                    : error?[NSAppleScript.errorMessage] as? String ?? "macOS blocked the Screen Mirroring controls")
            }
        }
    }

    private func toggleMacTVExtension() {
        let defaults = UserDefaults.standard
        let base = defaults.string(forKey: "haBaseURL")
        let token = loadToken()
        guard let base, let token, !token.isEmpty else {
            controlFeedbackLabel.stringValue = "Set up the local Home Assistant connection before toggling the Mac TV display."
            return
        }
        guard let stateURL = URL(string: "\(base)/api/states/select.living_room_sync_box_hdmi_input") else { return }
        var request = URLRequest(url: stateURL)
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        URLSession.shared.dataTask(with: request) { [weak self] data, response, error in
            DispatchQueue.main.async {
                guard let self else { return }
                guard error == nil,
                      let response = response as? HTTPURLResponse,
                      (200..<300).contains(response.statusCode),
                      let data,
                      let state = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
                      let currentInput = state["state"] as? String else {
                    self.controlFeedbackLabel.stringValue = "Could not read the Sync Box input; the Mac display was not changed."
                    return
                }
                let macInput = "Mac Second Display"
                let extendedDisplayIsActive = self.isMacTVDisplayExtended()

                // The selected Sync Box input is authoritative. The old
                // UserDefaults flag could get out of sync after a failed display
                // handshake, leaving the gesture stuck in the "turn on" branch.
                if currentInput == macInput && extendedDisplayIsActive {
                    let previousInput = defaults.string(forKey: "macTVPreviousSyncInput") ?? "Apple TV"
                    let layoutChanged = self.configureTVDisplay(extended: false)
                    self.selectSyncBoxInput(named: previousInput, base: base, token: token) { [weak self] succeeded in
                        guard let self else { return }
                        if succeeded {
                            defaults.set(false, forKey: "macTVExtensionActive")
                            self.controlFeedbackLabel.stringValue = layoutChanged
                                ? "TV extension stopped. Sync Box returned to \(previousInput)."
                                : "Sync Box returned to \(previousInput); macOS did not report a separate TV display to turn off."
                            self.eventLabel.stringValue = "EVENT FIRED  •  Mac TV extension off"
                        } else {
                            self.controlFeedbackLabel.stringValue = "Could not return the Sync Box to \(previousInput); the TV extension may still be active."
                        }
                    }
                    return
                }

                let previousInput = currentInput == macInput
                    ? (defaults.string(forKey: "macTVPreviousSyncInput") ?? "Apple TV")
                    : currentInput
                if currentInput != macInput {
                    defaults.set(currentInput, forKey: "macTVPreviousSyncInput")
                    self.controlFeedbackLabel.stringValue = "Switching the Hue Sync Box from \(currentInput) to Mac Second Display…"
                    self.selectSyncBoxInput(named: macInput, base: base, token: token) { [weak self] succeeded in
                        guard let self else { return }
                        guard succeeded else {
                            self.controlFeedbackLabel.stringValue = "Could not switch the Hue Sync Box to Mac Second Display."
                            return
                        }
                        self.waitForMacTVDisplay(attempt: 0, previousInput: previousInput, base: base, token: token)
                    }
                } else {
                    self.controlFeedbackLabel.stringValue = "Mac Second Display is selected. Enabling the extended desktop…"
                    self.waitForMacTVDisplay(attempt: 0, previousInput: previousInput, base: base, token: token)
                }
            }
        }.resume()
    }

    private func waitForMacTVDisplay(attempt: Int, previousInput: String?, base: String, token: String) {
        if configureTVDisplay(extended: true) {
            UserDefaults.standard.set(true, forKey: "macTVExtensionActive")
            controlFeedbackLabel.stringValue = "Hue Sync Box is on Mac Second Display; Mac TV extended desktop is on."
            eventLabel.stringValue = "EVENT FIRED  •  Mac TV extension on"
            return
        }
        guard attempt < 12 else {
            let failure = "Mac Second Display is selected, but macOS does not report a second active display; the extended desktop was not enabled."
            guard let previousInput else {
                controlFeedbackLabel.stringValue = failure
                return
            }
            controlFeedbackLabel.stringValue = failure + " Returning the Sync Box to \(previousInput)…"
            selectSyncBoxInput(named: previousInput, base: base, token: token) { [weak self] succeeded in
                guard let self else { return }
                self.controlFeedbackLabel.stringValue = succeeded
                    ? failure + " Sync Box returned to \(previousInput)."
                    : failure + " Sync Box could not return to \(previousInput)."
                UserDefaults.standard.set(false, forKey: "macTVExtensionActive")
            }
            return
        }
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) { [weak self] in
            self?.waitForMacTVDisplay(attempt: attempt + 1, previousInput: previousInput, base: base, token: token)
        }
    }

    private func selectSyncBoxInput(named input: String, base: String, token: String, completion: @escaping (Bool) -> Void) {
        guard let serviceURL = URL(string: "\(base)/api/services/select/select_option") else {
            completion(false)
            return
        }
        var request = URLRequest(url: serviceURL)
        request.httpMethod = "POST"
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = try? JSONSerialization.data(withJSONObject: [
            "entity_id": "select.living_room_sync_box_hdmi_input",
            "option": input
        ])
        URLSession.shared.dataTask(with: request) { _, response, error in
            DispatchQueue.main.async {
                let succeeded = error == nil && (response as? HTTPURLResponse).map { (200..<300).contains($0.statusCode) } == true
                completion(succeeded)
            }
        }.resume()
    }

    private func configureTVDisplay(extended: Bool) -> Bool {
        var displays = [CGDirectDisplayID](repeating: 0, count: 16)
        var displayCount: UInt32 = 0
        let listResult = displays.withUnsafeMutableBufferPointer {
            CGGetActiveDisplayList(UInt32($0.count), $0.baseAddress, &displayCount)
        }
        guard listResult == .success else {
            return false
        }
        let active = Array(displays.prefix(Int(displayCount)))
        let builtIn = active.first(where: { CGDisplayIsBuiltin($0) != 0 })
        let main = CGMainDisplayID()
        let external = active.first(where: { $0 != main && CGDisplayIsBuiltin($0) == 0 })
            ?? active.first(where: { CGDisplayIsBuiltin($0) == 0 && builtIn != nil })
        guard let external, let master = builtIn ?? active.first(where: { $0 != external }) else { return false }
        var configuration: CGDisplayConfigRef?
        guard CGBeginDisplayConfiguration(&configuration) == .success, let configuration else { return false }
        let targetMaster = extended ? kCGNullDirectDisplay : master
        let configureResult = CGConfigureDisplayMirrorOfDisplay(configuration, external, targetMaster)
        let completionResult = CGCompleteDisplayConfiguration(configuration, .forSession)
        return configureResult == .success && completionResult == .success
    }

    private func isMacTVDisplayExtended() -> Bool {
        var displays = [CGDirectDisplayID](repeating: 0, count: 16)
        var displayCount: UInt32 = 0
        let result = displays.withUnsafeMutableBufferPointer {
            CGGetActiveDisplayList(UInt32($0.count), $0.baseAddress, &displayCount)
        }
        guard result == .success else { return false }
        let main = CGMainDisplayID()
        return displays.prefix(Int(displayCount)).contains {
            $0 != main && CGDisplayIsBuiltin($0) == 0 && CGDisplayIsInMirrorSet($0) == 0
        }
    }

    @objc private func configureTVVolume() {
        let defaults = UserDefaults.standard
        let hostField = NSTextField(string: defaults.string(forKey: "haBaseURL") ?? "http://homeassistant.local:8123")
        let entityField = NSTextField(string: defaults.string(forKey: "haMediaPlayer") ?? "media_player.")
        let tokenField = NSSecureTextField(string: "")
        let stack = NSStackView(views: [
            labeledField("Home Assistant URL", hostField),
            labeledField("TV media_player entity", entityField),
            labeledField("Long-lived access token", tokenField)
        ])
        stack.orientation = .vertical
        stack.alignment = .leading
        stack.spacing = 10
        stack.frame = NSRect(x: 0, y: 0, width: 420, height: 150)
        let alert = NSAlert()
        alert.messageText = "Connect TV volume to Home Assistant"
        alert.informativeText = "Only volume commands go to this local Home Assistant address. Camera video and gesture images stay on this Mac. Use a LAN address or .local host. The token is stored in macOS Keychain."
        alert.accessoryView = stack
        alert.addButton(withTitle: "Save")
        alert.addButton(withTitle: "Cancel")
        guard alert.runModal() == .alertFirstButtonReturn else { return }
        let host = URL(string: hostField.stringValue.trimmingCharacters(in: .whitespacesAndNewlines))?.host ?? ""
        guard let url = URL(string: hostField.stringValue.trimmingCharacters(in: .whitespacesAndNewlines)),
              ["http", "https"].contains(url.scheme ?? ""), isLocalHost(host),
              entityField.stringValue.trimmingCharacters(in: .whitespacesAndNewlines).hasPrefix("media_player.") else {
            controlFeedbackLabel.stringValue = "Enter a local Home Assistant URL and a media_player entity ID."
            return
        }
        defaults.set(url.absoluteString.trimmingCharacters(in: CharacterSet(charactersIn: "/")), forKey: "haBaseURL")
        defaults.set(entityField.stringValue.trimmingCharacters(in: .whitespacesAndNewlines), forKey: "haMediaPlayer")
        if !tokenField.stringValue.isEmpty, !storeToken(tokenField.stringValue) {
            controlFeedbackLabel.stringValue = "Could not save the token to macOS Keychain."
            return
        }
        controlFeedbackLabel.stringValue = "TV volume actions are configured for \(entityField.stringValue)."
    }

    private func labeledField(_ title: String, _ field: NSTextField) -> NSView {
        let label = NSTextField(labelWithString: title)
        let column = NSStackView(views: [label, field])
        column.orientation = .vertical
        column.alignment = .leading
        column.spacing = 3
        field.widthAnchor.constraint(equalToConstant: 410).isActive = true
        return column
    }

    private func isLocalHost(_ host: String) -> Bool {
        let name = host.lowercased()
        if name == "localhost" || name.hasSuffix(".local") { return true }
        let parts = name.split(separator: ".").compactMap { Int($0) }
        guard parts.count == 4, parts.allSatisfy({ (0...255).contains($0) }) else { return false }
        return parts[0] == 10 || parts[0] == 127 || (parts[0] == 192 && parts[1] == 168)
            || (parts[0] == 172 && (16...31).contains(parts[1]))
    }

    private func storeToken(_ token: String) -> Bool {
        let query: [String: Any] = [kSecClass as String: kSecClassGenericPassword,
                                   kSecAttrService as String: "com.hubbubb.local-camera",
                                   kSecAttrAccount as String: "home-assistant-token"]
        SecItemDelete(query as CFDictionary)
        var item = query
        item[kSecValueData as String] = Data(token.utf8)
        return SecItemAdd(item as CFDictionary, nil) == errSecSuccess
    }

    private func loadToken() -> String? {
        let query: [String: Any] = [kSecClass as String: kSecClassGenericPassword,
                                   kSecAttrService as String: "com.hubbubb.local-camera",
                                   kSecAttrAccount as String: "home-assistant-token",
                                   kSecReturnData as String: true,
                                   kSecMatchLimit as String: kSecMatchLimitOne]
        var result: CFTypeRef?
        guard SecItemCopyMatching(query as CFDictionary, &result) == errSecSuccess,
              let data = result as? Data else { return nil }
        return String(data: data, encoding: .utf8)
    }

    private func sendTVVolumeStep(up: Bool) {
        let defaults = UserDefaults.standard
        guard let base = defaults.string(forKey: "haBaseURL"),
              let entity = defaults.string(forKey: "haMediaPlayer"),
              let token = loadToken(), !token.isEmpty else {
            controlFeedbackLabel.stringValue = "Set up a local Home Assistant connection before using TV volume gestures."
            eventLabel.stringValue = "GESTURE RECOGNIZED  •  Home Assistant setup needed"
            return
        }
        pendingTVButtonSteps += up ? 1 : -1
        processTVVolumeButtonStep(base: base, entity: entity, token: token)
    }

    private func sendTVSelect() {
        let defaults = UserDefaults.standard
        guard let base = defaults.string(forKey: "haBaseURL"),
              let entity = defaults.string(forKey: "haMediaPlayer"),
              let token = loadToken(), !token.isEmpty else {
            controlFeedbackLabel.stringValue = "Set up the Apple TV media player in the local Home Assistant connection first."
            eventLabel.stringValue = "GESTURE RECOGNIZED  •  Apple TV remote setup needed"
            return
        }
        guard entity.hasPrefix("media_player."),
              let url = URL(string: "\(base)/api/services/remote/send_command") else { return }
        let remoteEntity = "remote." + String(entity.dropFirst("media_player.".count))
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = try? JSONSerialization.data(withJSONObject: ["entity_id": remoteEntity, "command": ["select"]])
        URLSession.shared.dataTask(with: request) { [weak self] _, response, error in
            DispatchQueue.main.async {
                guard let self else { return }
                if let error {
                    self.controlFeedbackLabel.stringValue = "Apple TV select command failed: \(error.localizedDescription)"
                    return
                }
                guard let response = response as? HTTPURLResponse, (200..<300).contains(response.statusCode) else {
                    self.controlFeedbackLabel.stringValue = "Home Assistant rejected select. Check that \(remoteEntity) is the matching Apple TV remote entity."
                    return
                }
                self.controlFeedbackLabel.stringValue = "Apple TV center / select button sent."
                self.eventLabel.stringValue = "EVENT FIRED  •  Apple TV select"
            }
        }.resume()
    }

    private func processTVVolumeButtonStep(base: String, entity: String, token: String) {
        guard !tvVolumeActionInFlight, pendingTVButtonSteps != 0 else { return }
        tvVolumeActionInFlight = true
        let up = pendingTVButtonSteps > 0
        pendingTVButtonSteps -= up ? 1 : -1
        let service = up ? "volume_up" : "volume_down"
        guard let url = URL(string: "\(base)/api/services/media_player/\(service)") else {
            tvVolumeActionInFlight = false
            return
        }
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = try? JSONSerialization.data(withJSONObject: ["entity_id": entity])
        URLSession.shared.dataTask(with: request) { [weak self] _, response, error in
            DispatchQueue.main.async {
                guard let self else { return }
                self.tvVolumeActionInFlight = false
                if let error {
                    self.pendingTVButtonSteps = 0
                    self.controlFeedbackLabel.stringValue = "Home Assistant volume command failed: \(error.localizedDescription)"
                    return
                }
                guard let response = response as? HTTPURLResponse, (200..<300).contains(response.statusCode) else {
                    self.pendingTVButtonSteps = 0
                    self.controlFeedbackLabel.stringValue = "Home Assistant rejected the volume command. Check the Apple TV entity."
                    return
                }
                self.controlFeedbackLabel.stringValue = "TV volume \(up ? "up" : "down"); keep holding the thumb for more."
                self.eventLabel.stringValue = "EVENT FIRED  •  TV volume \(up ? "up" : "down")"
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.12) {
                    self.processTVVolumeButtonStep(base: base, entity: entity, token: token)
                }
            }
        }.resume()
    }

    private func requestCameraAccess() {
        switch AVCaptureDevice.authorizationStatus(for: .video) {
        case .authorized:
            configureAndStart()
        case .notDetermined:
            AVCaptureDevice.requestAccess(for: .video) { [weak self] granted in
                DispatchQueue.main.async {
                    guard let self else { return }
                    if granted {
                        self.configureAndStart()
                    } else {
                        self.setStatus("Camera access denied. Allow it in System Settings → Privacy & Security → Camera.")
                    }
                }
            }
        case .denied, .restricted:
            setStatus("Camera access is blocked. Allow Hubbubb Local Camera in System Settings → Privacy & Security → Camera.")
        @unknown default:
            setStatus("Could not determine camera permission.")
        }
    }

    private func configureAndStart() {
        sessionQueue.async { [weak self] in
            guard let self, !self.configured else { return }
            let discovery = AVCaptureDevice.DiscoverySession(
                deviceTypes: [.external, .builtInWideAngleCamera, .continuityCamera],
                mediaType: .video,
                position: .unspecified
            )
            guard let camera = discovery.devices.first(where: {
                $0.localizedName.localizedCaseInsensitiveContains("Insta360 Link 2")
            }) else {
                let available = discovery.devices.map(\.localizedName).joined(separator: ", ")
                DispatchQueue.main.async {
                    self.setStatus(available.isEmpty
                        ? "No camera found. Connect the Insta360 Link 2 by USB and quit Insta360 Link Controller."
                        : "Insta360 Link 2 not found. Cameras visible to macOS: \(available)")
                }
                return
            }

            var zoomMinimum = 0
            var zoomMaximum = 0
            var zoomStep = 1
            var currentZoom = 100
            let zoomSupported = hubbubbLinkCameraZoomInitialize(
                &zoomMinimum, &zoomMaximum, &zoomStep, &currentZoom
            ) == 1

            do {
                let input = try AVCaptureDeviceInput(device: camera)
                self.session.beginConfiguration()
                if self.session.canAddInput(input) {
                    self.session.addInput(input)
                } else {
                    self.session.commitConfiguration()
                    DispatchQueue.main.async { self.setStatus("Could not open the camera. Quit other apps using it and retry.") }
                    return
                }

                if self.session.canSetSessionPreset(.hd4K3840x2160) {
                    self.session.sessionPreset = .hd4K3840x2160
                } else if self.session.canSetSessionPreset(.hd1920x1080) {
                    self.session.sessionPreset = .hd1920x1080
                }

                let output = AVCaptureVideoDataOutput()
                output.alwaysDiscardsLateVideoFrames = true
                output.videoSettings = [
                    kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_420YpCbCr8BiPlanarFullRange
                ]
                let processor = LocalVisionProcessor(
                    zoomRange: zoomSupported ? (zoomMinimum, zoomMaximum, zoomStep, currentZoom) : nil,
                    zoomUpdate: { [weak self] factor, message in
                        DispatchQueue.main.async {
                            if let factor {
                                self?.zoomSlider.doubleValue = Double(factor)
                                self?.zoomLabel.stringValue = String(format: "%.1f×", factor)
                            }
                            if let message {
                                self?.controlFeedbackLabel.stringValue = message
                            }
                        }
                    },
                    presence: { [weak self] people in
                        DispatchQueue.main.async { self?.postPresence(people) }
                    },
                    status: { [weak self] image, message, gesture in
                    DispatchQueue.main.async {
                        if let image {
                            self?.previewImage.image = NSImage(cgImage: image, size: .zero)
                        }
                        self?.setStatus(message)
                        if let gesture {
                            self?.handleGesture(gesture)
                        }
                    }
                    }
                )
                self.processor = processor
                self.lookServer = LookServer(processor: processor)
                output.setSampleBufferDelegate(processor, queue: DispatchQueue(label: "com.hubbubb.camera.vision"))
                if self.session.canAddOutput(output) {
                    self.session.addOutput(output)
                }
                self.session.commitConfiguration()
                self.configured = true

                DispatchQueue.main.async {
                    self.trackingCheckbox.isEnabled = true
                    self.trackingCheckbox.state = self.localFollowingEnabled ? .on : .off
                    if zoomSupported {
                        let factor = 1 + Double(currentZoom - zoomMinimum) / Double(max(1, zoomMaximum - zoomMinimum)) * 3
                        self.zoomSlider.doubleValue = factor
                        self.zoomLabel.stringValue = String(format: "%.1f×", factor)
                        self.framingCheckbox.isEnabled = true
                        self.zoomSlider.isEnabled = true
                        self.processor?.updateSettings(
                            autoZoom: self.framingCheckbox.state == .on,
                            zoomFactor: CGFloat(self.zoomSlider.doubleValue),
                            autoFollow: self.localFollowingEnabled
                        )
                        self.controlFeedbackLabel.stringValue = "Hardware lens zoom is ready. Face detection stays on this Mac."
                        self.setStatus("Connected to \(camera.localizedName). Using camera zoom controls; full feed stays visible.")
                    } else {
                        self.framingCheckbox.isEnabled = false
                        self.zoomSlider.isEnabled = false
                        self.controlFeedbackLabel.stringValue = "Camera connected, but hardware zoom could not initialize."
                        self.setStatus("Camera feed connected, but Link 2 hardware zoom control could not initialize.")
                    }
                }
                self.session.startRunning()
            } catch {
                DispatchQueue.main.async { self.setStatus("Camera setup failed: \(error.localizedDescription)") }
            }
        }
    }

    private func setStatus(_ value: String) {
        statusLabel.stringValue = value
    }
}

/// One hand-gesture vote buffer. Each person in view gets their own, so two
/// people's hands never vote in the same pool.
private struct GestureVotes {
    var recent: [String?] = []
    var latched: String?
    var missed = 0
    var lastVolumeRepeat = Date.distantPast
    var twoPalmHold = 0
    var twoPalmMiss = 0
    var twoPalmLatched = false
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
    private let status: (CGImage?, String, String?) -> Void
    private let zoomUpdate: (CGFloat?, String?) -> Void
    private let presence: ([String]) -> Void
    private var frameNumber = 0
    private var tracks: [Track] = []
    private var nextTrackID = 1
    // Hands Vision found but could not tie to anyone (body out of frame).
    private var looseVotes = GestureVotes()
    private var lastStatus = ""
    // Enrolled faces: name -> feature prints of that face.
    private var gallery: [String: [VNFeaturePrintObservation]] = [:]
    private var enrollName: String?
    private var enrollSamples: [VNFeaturePrintObservation] = []
    private let enrollTarget = 20
    // Feature-print distance under which a face counts as an enrolled person.
    // Calibration knob: the overlay shows each face's nearest distance; tune with
    // `defaults write home.jarvis.local-camera faceMatchThreshold 0.5`.
    // ponytail: generic image feature prints, not a face-ID model; swap in a
    // Core ML face embedding if two people keep getting confused.
    private let faceMatchThreshold = Float(UserDefaults.standard.object(forKey: "faceMatchThreshold") as? Double ?? 0.6)
    private var lastPresence: [String] = []
    private var lastPresenceSent = Date.distantPast
    // What the most recent frame held, for /look and /people (under settingsLock).
    private var latestFrame: CGImage?
    private var latestNames: [String] = []
    private var latestAnimals: [String] = []
    private var followPausedUntil = Date.distantPast
    private let lookQueue = DispatchQueue(label: "com.hubbubb.camera.look")
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
    // Seconds between volume steps while thumbs up/down is held; lower = faster ramp.
    private let volumeRepeatInterval: TimeInterval = 0.35

    init(
        zoomRange: (Int, Int, Int, Int)?,
        zoomUpdate: @escaping (CGFloat?, String?) -> Void,
        presence: @escaping ([String]) -> Void,
        status: @escaping (CGImage?, String, String?) -> Void
    ) {
        self.status = status
        self.zoomUpdate = zoomUpdate
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
            reportPresence(names, now: now)

            // Gestures, per person: each visible track votes with its own hands.
            let hands = handRequest.results ?? []
            var handsByTrack: [Int: [VNHumanHandPoseObservation]] = [:]
            var looseHands: [VNHumanHandPoseObservation] = []
            for hand in hands {
                if let owner = owner(of: hand) { handsByTrack[owner, default: []].append(hand) } else { looseHands.append(hand) }
            }
            var messages: [String] = []
            var fired: [String] = []
            for index in tracks.indices where tracks[index].visible {
                let result = updateGestures(&tracks[index].votes, hands: handsByTrack[tracks[index].id] ?? [], face: tracks[index].face)
                if let message = result.message {
                    messages.append(tracks[index].name.map { "\($0): \(message)" } ?? message)
                }
                if let gesture = result.fired {
                    fired.append(gesture)
                    // Whoever gestures has the room's attention: keep them in frame.
                    tracks[index].lastSeen = now
                }
            }
            let loose = updateGestures(&looseVotes, hands: looseHands, face: nil)
            if let message = loose.message { messages.append(message) }
            if let gesture = loose.fired { fired.append(gesture) }

            let people = visible.map { $0.name ?? "someone" }
            let idle = visible.isEmpty
                ? "No one in view. Preview and gesture analysis stay local."
                : (hands.isEmpty
                    ? "\(people.joined(separator: ", ")) in view. Raise a hand to gesture."
                    : "Hand detected. Hold up 1, 2, or 3 fingers to choose an HDMI input, or hold thumbs up/down for volume.")
            lastStatus = enrollMessage ?? messages.first ?? idle
            status(annotate(fullFrame, animals: animals), lastStatus, nil)
            for gesture in fired { status(nil, lastStatus, gesture) }
        } catch {
            if lastStatus != "Local Vision could not analyze this frame." {
                lastStatus = "Local Vision could not analyze this frame."
                status(nil, lastStatus, nil)
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
    ) -> (message: String?, fired: String?) {
        // Vision may return a weak duplicate/false hand. Use its strongest
        // observation for one-hand actions, while keeping both for the
        // explicit two-open-palms gesture.
        let primaryHand = hands.max { $0.confidence < $1.confidence }
        if let face, let primaryHand, handOverlapsFace(primaryHand, faceBounds: face) {
            votes = GestureVotes(lastVolumeRepeat: votes.lastVolumeRepeat)
            return ("Gesture paused while a hand is touching a face. Move it away to resume.", nil)
        }
        if hands.count >= 2 && hands.filter(isOpenPalmPose).count >= 2 {
            votes.twoPalmHold += 1
            votes.twoPalmMiss = 0
            if votes.twoPalmHold >= 4 && !votes.twoPalmLatched {
                votes.twoPalmLatched = true
                votes.recent.removeAll(keepingCapacity: true)
                return ("Both palms recognized. Switching the Sync Box to the Mac display and enabling the extended screen.", "two_palms")
            }
            if votes.twoPalmLatched { return ("Both palms recognized. Display action is running.", nil) }
            return ("Hold both open palms steady: \(min(votes.twoPalmHold, 4))/4 frames.", nil)
        }
        if votes.twoPalmHold > 0 || votes.twoPalmLatched {
            votes.twoPalmMiss += 1
            if votes.twoPalmMiss <= 4 { return ("Keep both palms in view…", nil) }
            votes.twoPalmHold = 0
            votes.twoPalmMiss = 0
            votes.twoPalmLatched = false
        }
        let rawGesture = primaryHand.flatMap { classifyGesture($0) }
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
        let isVolume = detectedGesture == "thumbs_up" || detectedGesture == "thumbs_down"
        if gestureHits >= requiredHits && votes.latched != detectedGesture {
            votes.latched = detectedGesture
            votes.lastVolumeRepeat = Date()
            return ("\(gestureTitle(detectedGesture)) recognized. Running its assigned action.", detectedGesture)
        }
        if isVolume, votes.latched == detectedGesture, rawGesture == detectedGesture,
           Date().timeIntervalSince(votes.lastVolumeRepeat) > volumeRepeatInterval {
            // Held thumbs keep stepping the volume: the longer the hold, the bigger the change.
            votes.lastVolumeRepeat = Date()
            return ("\(gestureTitle(detectedGesture)) held. Stepping TV volume; drop your hand to stop.", detectedGesture)
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

    private func saveGallery() {
        let url = Self.galleryURL
        try? FileManager.default.createDirectory(at: url.deletingLastPathComponent(), withIntermediateDirectories: true)
        if let data = try? NSKeyedArchiver.archivedData(withRootObject: gallery as NSDictionary, requiringSecureCoding: true) {
            try? data.write(to: url, options: .completeFileProtection)
        }
    }

    /// Start collecting face samples for `name` from whoever is alone in view.
    /// Enrolling an existing name replaces their samples.
    func beginEnrollment(name: String) {
        settingsLock.lock()
        enrollName = name
        settingsLock.unlock()
    }

    var enrolledNames: [String] {
        settingsLock.lock()
        defer { settingsLock.unlock() }
        return gallery.keys.sorted()
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
        if frameNumber.isMultiple(of: 6), let print = featurePrint(handler, face: face) {
            enrollSamples.append(print)
        }
        guard enrollSamples.count >= enrollTarget else {
            return "Enrolling \(name): \(enrollSamples.count)/\(enrollTarget). Turn your head a little left, right, up and down."
        }
        settingsLock.lock()
        gallery[name] = enrollSamples
        enrollName = nil
        settingsLock.unlock()
        enrollSamples = []
        saveGallery()
        for index in tracks.indices where tracks[index].visible { tracks[index].name = name }
        return "Enrolled \(name). The camera will recognize them from now on."
    }

    /// Re-check one face per frame: unnamed faces often, named ones now and then.
    private func identifyFaces(_ handler: VNImageRequestHandler, now: Date) {
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
    private func reportPresence(_ names: [String], now: Date) {
        guard !gallery.isEmpty,
              names != lastPresence || now.timeIntervalSince(lastPresenceSent) > 20 else { return }
        lastPresence = names
        lastPresenceSent = now
        presence(names)
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
        // Pause only when a confidently tracked hand joint enters the detected
        // face itself. A padded zone around the face incorrectly blocked nearby gestures.
        return points.contains(where: faceBounds.contains)
    }

    private func applyHardwareZoom(_ factor: CGFloat) {
        guard let range = zoomRange else { return }
        let clamped = min(4, max(1, factor))
        settingsLock.lock()
        currentZoomFactor = clamped
        settingsLock.unlock()
        let rawValue = range.minimum + Int((clamped - 1) / 3 * CGFloat(range.maximum - range.minimum))
        ptzQueue.async { [weak self] in
            guard hubbubbLinkCameraZoomSet(rawValue) == 1 else {
                self?.zoomUpdate(nil, "Camera rejected the lens zoom command. Check camera controls.")
                return
            }
            self?.zoomUpdate(clamped, nil)
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
                guard let reply = askVisionModel(question, image: image, visible: visible) else {
                    result = ["error": "The vision model on the Mac did not answer."]
                    break
                }
                result = reply.merging(visible) { current, _ in current }
                if reply["found"] as? Bool == true { break }
                if let answer = reply["answer"] as? String { seen.append(answer) }
            }
            // Always point back where it was: the answer is in words, and a model
            // that misread a soundbar as a bicycle should not leave the camera on it.
            ptzQueue.sync { _ = hubbubbLinkCameraPointAt(start.pan, start.tilt) }
            if result["found"] as? Bool != true, !seen.isEmpty { result["looked_at"] = seen }
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
        let scale = min(1, 1280 / CGFloat(frame.width))
        let image = CIImage(cgImage: frame).transformed(by: CGAffineTransform(scaleX: scale, y: scale))
        return context.jpegRepresentation(of: image, colorSpace: CGColorSpaceCreateDeviceRGB(),
                                          options: [kCGImageDestinationLossyCompressionQuality as CIImageRepresentationOption: 0.8])
    }

    /// One question, one image, to Ollama on this Mac. -> {"found", "answer"} or nil.
    private func askVisionModel(_ question: String, image: Data, visible: [String: Any]) -> [String: Any]? {
        // The house model is multimodal, so no second model has to load.
        let model = UserDefaults.standard.string(forKey: "visionModel") ?? "huihui_ai/Qwen3.6-abliterated:35b-a3b"
        let people = (visible["people"] as? [String]).flatMap { $0.isEmpty ? nil : $0.joined(separator: ", ") } ?? "nobody recognized"
        let prompt = """
        You are the eyes of a home assistant, looking through a camera in the user's home.
        Question: \(question)
        People recognized in view by face recognition (trust these names): \(people).
        Reply with JSON only: {"seen": "...", "found": true or false, "answer": "..."}.
        First fill "seen": list the main things actually in the image. Then "found": true only if something \
        in "seen" clearly is what the question asks about, or the question is about what is in view. If you \
        are not sure, found is false - never guess. "answer" is one or two short spoken sentences; say where \
        things are relative to furniture or other objects. If it is not visible, say briefly what you see instead.
        """
        guard let url = URL(string: "http://127.0.0.1:11434/api/chat") else { return nil }
        var request = URLRequest(url: url, timeoutInterval: 90)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = try? JSONSerialization.data(withJSONObject: [
            "model": model, "stream": false, "think": false, "format": "json",
            "messages": [["role": "user", "content": prompt, "images": [image.base64EncodedString()]]]
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
        if let parsed = (try? JSONSerialization.jsonObject(with: Data(content.utf8))) as? [String: Any],
           parsed["answer"] is String {
            return ["found": parsed["found"] as? Bool ?? false, "answer": parsed["answer"] as Any]
        }
        return ["found": false, "answer": content]
    }

    private func gestureTitle(_ id: String) -> String {
        switch id {
        case "thumbs_up": return "Thumbs up"
        case "open_palm": return "Open palm"
        case "thumbs_down": return "Thumbs down"
        case "number_1": return "One finger"
        case "number_2": return "Two fingers"
        case "number_3": return "Three fingers"
        case "two_palms": return "Both palms"
        default: return "Gesture"
        }
    }

    private func isOpenPalmPose(_ observation: VNHumanHandPoseObservation) -> Bool {
        func point(_ joint: VNHumanHandPoseObservation.JointName) -> VNRecognizedPoint? {
            try? observation.recognizedPoint(joint)
        }
        guard let thumb = point(.thumbTip), let indexMCP = point(.indexMCP),
              let littleMCP = point(.littleMCP),
              thumb.confidence > 0.12, indexMCP.confidence > 0.12, littleMCP.confidence > 0.12 else { return false }
        let fingers: [(VNHumanHandPoseObservation.JointName, VNHumanHandPoseObservation.JointName, VNHumanHandPoseObservation.JointName)] = [
            (.indexTip, .indexPIP, .indexMCP), (.middleTip, .middlePIP, .middleMCP),
            (.ringTip, .ringPIP, .ringMCP), (.littleTip, .littlePIP, .littleMCP)
        ]
        let extendedCount = fingers.reduce(into: 0) { count, joints in
            guard let tip = point(joints.0), let pip = point(joints.1), let mcp = point(joints.2),
                  tip.confidence > 0.10, pip.confidence > 0.10, mcp.confidence > 0.10 else { return }
            let tipToMCP = hypot(tip.location.x - mcp.location.x, tip.location.y - mcp.location.y)
            let pipToMCP = hypot(pip.location.x - mcp.location.x, pip.location.y - mcp.location.y)
            if tipToMCP > pipToMCP * 1.45 { count += 1 }
        }
        let palmWidth = hypot(indexMCP.location.x - littleMCP.location.x, indexMCP.location.y - littleMCP.location.y)
        let thumbSpread = hypot(thumb.location.x - indexMCP.location.x, thumb.location.y - indexMCP.location.y)
        return extendedCount == 4 && palmWidth > 0.025 && thumbSpread > palmWidth * 0.55
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


/// Jarvis's way in: Home Assistant asks the camera questions over the LAN.
///   GET  /people  -> {"people": [...], "animals": [...]}
///   POST /look    {"question": "..."} -> {"found", "answer", "people", ...}
/// Every request needs the companion's token (same Mac, same file), so no
/// second secret has to be set up. Answers are words; frames never leave.
private final class LookServer {
    static let port: UInt16 = 8791
    private let listener: NWListener
    private let token: String
    private let processor: LocalVisionProcessor
    private let queue = DispatchQueue(label: "com.hubbubb.camera.server", attributes: .concurrent)

    init?(processor: LocalVisionProcessor) {
        let path = NSString(string: "~/.claude/hooks/.voice-token").expandingTildeInPath
        guard let token = try? String(contentsOfFile: path, encoding: .utf8)
                .trimmingCharacters(in: .whitespacesAndNewlines), !token.isEmpty,
              let port = NWEndpoint.Port(rawValue: Self.port),
              let listener = try? NWListener(using: .tcp, on: port) else { return nil }
        self.token = token
        self.processor = processor
        self.listener = listener
        listener.newConnectionHandler = { [weak self] connection in self?.serve(connection) }
        listener.start(queue: queue)
    }

    private func serve(_ connection: NWConnection) {
        connection.start(queue: queue)
        receive(connection, buffer: Data())
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
            let request = lines.first?.split(separator: " ").map(String.init) ?? []
            let (status, reply) = self.handle(request, headers: headers, body: Data(body))
            let json = (try? JSONSerialization.data(withJSONObject: reply)) ?? Data("{}".utf8)
            let response = "HTTP/1.1 \(status)\r\nContent-Type: application/json\r\nContent-Length: \(json.count)\r\nConnection: close\r\n\r\n"
            connection.send(content: Data(response.utf8) + json, completion: .contentProcessed { _ in connection.cancel() })
        }
    }

    private func handle(_ request: [String], headers: [String: String], body: Data) -> (String, Any) {
        guard Self.sameSecret(headers["authorization"] ?? "", "Bearer \(token)") else {
            return ("401 Unauthorized", ["ok": false, "detail": "missing or wrong token"])
        }
        switch (request.first, request.dropFirst().first) {
        case ("GET", "/people"):
            return ("200 OK", processor.inView())
        case ("POST", "/look"):
            let question = ((try? JSONSerialization.jsonObject(with: body)) as? [String: Any])?["question"] as? String
            guard let question, !question.isEmpty, question.count <= 300 else {
                return ("400 Bad Request", ["ok": false, "detail": "send {\"question\": \"...\"}"])
            }
            return ("200 OK", processor.look(question: question))
        default:
            return ("404 Not Found", ["ok": false, "detail": "no such path"])
        }
    }

    private static func sameSecret(_ a: String, _ b: String) -> Bool {
        let x = Array(a.utf8), y = Array(b.utf8)
        guard x.count == y.count else { return false }
        return zip(x, y).reduce(0) { $0 | ($1.0 ^ $1.1) } == 0
    }
}
