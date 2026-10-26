import AppKit
import AVFoundation
import Vision
import Security

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
@_silgen_name("HubbubbLinkCameraSearchStep")
private func hubbubbLinkCameraSearchStep(_ direction: Int32) -> Int32
@_silgen_name("HubbubbLinkCameraSearchBegin")
private func hubbubbLinkCameraSearchBegin() -> Int32

@_silgen_name("HubbubbLinkCameraFollowFace")
private func hubbubbLinkCameraFollowFace(_ centerX: Float, _ centerY: Float) -> Int32

@main
private enum HubbubbLocalCameraApp {
    static func main() {
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

        let centerButton = NSButton(title: "Reset camera zoom to 1×", target: self, action: #selector(recenterFraming))
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
        frame(103, NSRect(x: 18, y: height - 282, width: 290, height: 30))
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

private final class LocalVisionProcessor: NSObject, AVCaptureVideoDataOutputSampleBufferDelegate {
    private let handRequest = VNDetectHumanHandPoseRequest()
    private let faceRequest = VNDetectFaceRectanglesRequest()
    private let context = CIContext(options: [.useSoftwareRenderer: false])
    private let status: (CGImage?, String, String?) -> Void
    private let zoomUpdate: (CGFloat?, String?) -> Void
    private var frameNumber = 0
    private var recentGestureFrames: [String?] = []
    private var latchedGesture: String?
    private var missedGestureFrames = 0
    private var lastStatus = ""
    private let settingsLock = NSLock()
    private var autoZoomEnabled = true
    private var autoFollowEnabled = false
    private var currentZoomFactor: CGFloat
    private let zoomRange: (minimum: Int, maximum: Int, step: Int)?
    private let ptzQueue = DispatchQueue(label: "com.hubbubb.camera.ptz")
    private var lastAutoZoomUpdate = Date.distantPast
    private var lastAutoFollowUpdate = Date.distantPast
    private var smoothedFaceCenter: CGPoint?
    private var faceLostSince: Date?
    private var searchDirection: Int32 = 1
    private var searchSuggestedDirection: Int32 = 1
    private var searchNeedsBegin = true
    private var lastVolumeRepeat = Date.distantPast
    // Seconds between volume steps while thumbs up/down is held; lower = faster ramp.
    private let volumeRepeatInterval: TimeInterval = 0.35
    private var twoPalmHoldFrames = 0
    private var twoPalmLatched = false
    private var twoPalmMissFrames = 0

    init(
        zoomRange: (Int, Int, Int, Int)?,
        zoomUpdate: @escaping (CGFloat?, String?) -> Void,
        status: @escaping (CGImage?, String, String?) -> Void
    ) {
        self.status = status
        self.zoomUpdate = zoomUpdate
        if let (minimum, maximum, step, current) = zoomRange, maximum > minimum {
            self.zoomRange = (minimum, maximum, max(1, step))
            self.currentZoomFactor = 1 + CGFloat(current - minimum) / CGFloat(maximum - minimum) * 3
        } else {
            self.zoomRange = nil
            self.currentZoomFactor = 1
        }
        handRequest.maximumHandCount = 2
        super.init()
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
            try VNImageRequestHandler(cvPixelBuffer: pixelBuffer, orientation: .up).perform([faceRequest])
            let face = (faceRequest.results ?? []).max { $0.boundingBox.width * $0.boundingBox.height < $1.boundingBox.width * $1.boundingBox.height }
            if let face {
                let reacquired = faceLostSince != nil
                if reacquired {
                    smoothedFaceCenter = nil
                    ptzQueue.async { [weak self] in self?.searchNeedsBegin = true }
                }
                faceLostSince = nil
                let horizontalOffset = face.boundingBox.midX - 0.5
                if abs(horizontalOffset) > 0.05 {
                    searchSuggestedDirection = horizontalOffset > 0 ? 1 : -1
                }
                adjustHardwareZoom(forFace: face.boundingBox)
                adjustGimbal(forFace: face.boundingBox)
            } else {
                recoverLostFace()
            }
            let sourceImage = CIImage(cvPixelBuffer: pixelBuffer)
            guard let fullFrame = context.createCGImage(sourceImage, from: sourceImage.extent) else {
                throw CameraVisionError.previewFailed
            }
            handRequest.regionOfInterest = CGRect(x: 0, y: 0, width: 1, height: 1)
            try VNImageRequestHandler(cvPixelBuffer: pixelBuffer, orientation: .up).perform([handRequest])
            let detectedHands = handRequest.results ?? []
            // Vision may return a weak duplicate/false hand. Use its strongest
            // observation for one-hand actions, while keeping both for the
            // explicit two-open-palms gesture.
            let primaryHand = detectedHands.max { $0.confidence < $1.confidence }
            if let face,
               let primaryHand,
               handOverlapsFace(primaryHand, faceBounds: face.boundingBox) {
                recentGestureFrames.removeAll(keepingCapacity: true)
                latchedGesture = nil
                missedGestureFrames = 0
                twoPalmHoldFrames = 0
                twoPalmMissFrames = 0
                twoPalmLatched = false
                lastStatus = "Gesture paused while your hand is touching your face. Move it away to resume."
                status(fullFrame, lastStatus, nil)
                return
            }
            let openPalmCount = detectedHands.filter(isOpenPalmPose).count
            if detectedHands.count >= 2 && openPalmCount >= 2 {
                twoPalmHoldFrames += 1
                twoPalmMissFrames = 0
                if twoPalmHoldFrames >= 4 && !twoPalmLatched {
                    twoPalmLatched = true
                    recentGestureFrames.removeAll(keepingCapacity: true)
                    lastStatus = "Both palms recognized. Switching the Sync Box to the Mac display and enabling the extended screen."
                    status(fullFrame, lastStatus, "two_palms")
                } else if twoPalmLatched {
                    lastStatus = "Both palms recognized. Display action is running."
                    status(fullFrame, lastStatus, nil)
                } else {
                    lastStatus = "Hold both open palms steady: \(min(twoPalmHoldFrames, 4))/4 frames."
                    status(fullFrame, lastStatus, nil)
                }
                return
            }
            if twoPalmHoldFrames > 0 || twoPalmLatched {
                twoPalmMissFrames += 1
                if twoPalmMissFrames <= 4 {
                    lastStatus = "Keep both palms in view…"
                    status(fullFrame, lastStatus, nil)
                    return
                }
                twoPalmHoldFrames = 0
                twoPalmMissFrames = 0
                twoPalmLatched = false
            }
            let rawGesture = primaryHand.flatMap { classifyGesture($0) }
            let handsFound = detectedHands.count
            recentGestureFrames.append(rawGesture)
            if recentGestureFrames.count > 8 { recentGestureFrames.removeFirst() }
            // Vote across recent frames so a weak duplicate hand or one noisy
            // finger landmark cannot flip a held pose between 1/open/2 fingers.
            let gestureVotes = recentGestureFrames.compactMap { $0 }.reduce(into: [String: Int]()) { counts, id in
                counts[id, default: 0] += 1
            }
            let maximumGestureVotes = gestureVotes.values.max() ?? 0
            let leadingGesture = rawGesture.flatMap { gestureVotes[$0] == maximumGestureVotes ? $0 : nil }
                ?? latchedGesture.flatMap { gestureVotes[$0] == maximumGestureVotes ? $0 : nil }
                ?? gestureVotes.filter { $0.value == maximumGestureVotes }.keys.sorted().first
            let detectedGesture = leadingGesture
            let gestureHits = leadingGesture.flatMap { gestureVotes[$0] } ?? 0
            if let detectedGesture {
                let requiredHits = 5
                let gestureProgress = min(gestureHits, requiredHits)
                missedGestureFrames = 0
                if let latchedGesture, latchedGesture != detectedGesture {
                    self.latchedGesture = nil
                }
                let isVolume = detectedGesture == "thumbs_up" || detectedGesture == "thumbs_down"
                if gestureHits >= requiredHits && latchedGesture != detectedGesture {
                    latchedGesture = detectedGesture
                    lastVolumeRepeat = Date()
                    lastStatus = "\(gestureTitle(detectedGesture)) recognized. Running its assigned action."
                    status(fullFrame, lastStatus, detectedGesture)
                } else if isVolume, latchedGesture == detectedGesture, rawGesture == detectedGesture,
                          Date().timeIntervalSince(lastVolumeRepeat) > volumeRepeatInterval {
                    // Held thumbs keep stepping the volume: the longer the hold, the bigger the change.
                    lastVolumeRepeat = Date()
                    lastStatus = "\(gestureTitle(detectedGesture)) held. Stepping TV volume; drop your hand to stop."
                    status(fullFrame, lastStatus, detectedGesture)
                } else if let latchedGesture {
                    lastStatus = "\(gestureTitle(latchedGesture)) recognized. Running its assigned action."
                    status(fullFrame, lastStatus, nil)
                } else {
                    lastStatus = "\(gestureTitle(detectedGesture)): \(gestureProgress)/\(requiredHits) frames. Keep holding…"
                    status(fullFrame, lastStatus, nil)
                }
            } else {
                missedGestureFrames += 1
                if missedGestureFrames >= 8 {
                    latchedGesture = nil
                }
                let previousGesture = recentGestureFrames.compactMap { $0 }.last
                let previousHits = previousGesture.map { g in recentGestureFrames.filter { $0 == g }.count } ?? 0
                let requiredHits = 5
                let message = previousHits > 0 && missedGestureFrames < 8
                    ? "\(gestureTitle(previousGesture ?? "")): \(min(previousHits, requiredHits))/\(requiredHits) frames. Keep holding…"
                    : (face == nil
                    ? "No face found. Move into view; preview and gesture analysis stay local."
                    : (handsFound == 0
                        ? "Face framed, but no hand found. Raise one hand into the preview."
                        : "Hand detected. Hold up 1, 2, or 3 fingers to choose an HDMI input, or hold thumbs up/down for volume."))
                lastStatus = message
                let zoomMessage = face == nil ? message : "Face detected. Using camera zoom; showing the full feed. " + message
                status(fullFrame, zoomMessage, nil)
            }
        } catch {
            if lastStatus != "Local Vision could not analyze this frame." {
                lastStatus = "Local Vision could not analyze this frame."
                status(nil, lastStatus, nil)
            }
        }
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
        let faceHeight = face.height
        guard zoomRange != nil, faceHeight > 0.04 else { return }
        let now = Date()
        guard now.timeIntervalSince(lastAutoZoomUpdate) > 0.20 else { return }
        lastAutoZoomUpdate = now
        settingsLock.lock()
        let enabled = autoZoomEnabled
        let current = currentZoomFactor
        settingsLock.unlock()
        guard enabled else { return }
        // Let the gimbal center an off-axis face before tightening the view.
        guard abs(face.midX - 0.5) < 0.10, abs(face.midY - 0.5) < 0.12 else { return }
        let target = min(4, max(1, current * (0.40 / faceHeight)))
        let smoothed = current + (target - current) * 0.12
        guard abs(smoothed - current) > 0.04 else { return }
        applyHardwareZoom(smoothed)
    }

    private func recoverLostFace() {
        let now = Date()
        if faceLostSince == nil { faceLostSince = now }
        let lostFor = now.timeIntervalSince(faceLostSince ?? now)
        settingsLock.lock()
        let following = autoFollowEnabled
        let autoZoom = autoZoomEnabled
        let current = currentZoomFactor
        settingsLock.unlock()
        guard following, lostFor > 0.45 else { return }

        // Widen in small steps first; this usually reacquires someone who simply
        // stepped outside the tightly zoomed face box without moving the gimbal.
        if autoZoom, current > 1.03, now.timeIntervalSince(lastAutoZoomUpdate) > 0.20 {
            lastAutoZoomUpdate = now
            applyHardwareZoom(max(1, current + (1 - current) * 0.18))
            return
        }

        // Once wide, make a slow bounded sweep so a person who moved sideways
        // can be found again. A newly detected face immediately stops the sweep.
        guard lostFor > 1.5, now.timeIntervalSince(lastAutoFollowUpdate) > 0.28 else { return }
        lastAutoFollowUpdate = now
        let suggestedDirection = searchSuggestedDirection
        ptzQueue.async { [weak self] in
            guard let self else { return }
            if self.searchNeedsBegin {
                self.searchDirection = suggestedDirection
                guard hubbubbLinkCameraSearchBegin() == 1 else { return }
                self.searchNeedsBegin = false
            }
            let next = hubbubbLinkCameraSearchStep(self.searchDirection)
            if next != 0 { self.searchDirection = next }
        }
    }

    private func adjustGimbal(forFace face: CGRect) {
        settingsLock.lock()
        let enabled = autoFollowEnabled
        settingsLock.unlock()
        guard enabled else { return }
        let now = Date()
        guard now.timeIntervalSince(lastAutoFollowUpdate) > 0.20 else { return }
        lastAutoFollowUpdate = now
        let measuredCenter = CGPoint(x: face.midX, y: face.midY)
        let center: CGPoint
        if let smoothedFaceCenter {
            let smoothing: CGFloat = 0.30
            center = CGPoint(
                x: smoothedFaceCenter.x + (measuredCenter.x - smoothedFaceCenter.x) * smoothing,
                y: smoothedFaceCenter.y + (measuredCenter.y - smoothedFaceCenter.y) * smoothing
            )
        } else {
            center = measuredCenter
        }
        smoothedFaceCenter = center
        guard abs(center.x - 0.5) > 0.08 || abs(center.y - 0.5) > 0.08 else { return }
        let centerX = Float(center.x)
        let centerY = Float(center.y)
        ptzQueue.async {
            _ = hubbubbLinkCameraFollowFace(centerX, centerY)
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

