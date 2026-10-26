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

/// One line in ~/Library/Logs/Hubbubb Local Camera.log - what the camera
/// decided and why, for when it does something odd. Started afresh past 1 MB.
private let logQueue = DispatchQueue(label: "com.hubbubb.camera.log")
private func note(_ format: String, _ args: CVarArg...) {
    let line = "\(ISO8601DateFormatter().string(from: Date())) \(String(format: format, arguments: args))\n"
    logQueue.async {
        let url = FileManager.default.urls(for: .libraryDirectory, in: .userDomainMask)[0]
            .appendingPathComponent("Logs/Hubbubb Local Camera.log")
        if let size = (try? FileManager.default.attributesOfItem(atPath: url.path))?[.size] as? Int, size > 1_000_000 {
            try? FileManager.default.removeItem(at: url)
        }
        if let handle = try? FileHandle(forWritingTo: url) {
            handle.seekToEndOfFile()
            handle.write(Data(line.utf8))
            try? handle.close()
        } else {
            try? Data(line.utf8).write(to: url)
        }
    }
}

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
        precondition(Gimbal.exitTilt(lastY: 0.7, velocityY: 0) == 1, "standing up leaves out of the top")
        precondition(Gimbal.exitTilt(lastY: 0.5, velocityY: 0.4) == 1, "rising fast counts too")
        precondition(Gimbal.exitTilt(lastY: 0.5, velocityY: 0) == 0, "a sideways exit needs no tilt")
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
        precondition(GestureGate.isFacing(yaw: 0.1, pitch: -0.2, limit: 25), "looking at the camera")
        // Nose centred between the eyes is facing, upright or tilted 60 degrees.
        precondition(abs(GestureGate.turn(leftEye: CGPoint(x: 0.45, y: 0.5), rightEye: CGPoint(x: 0.55, y: 0.5), nose: CGPoint(x: 0.5, y: 0.45))) < 0.01, "facing, upright")
        let tilt = CGVector(dx: -0.866, dy: 0.5)  // head tilted ~60 degrees
        let le = Upright.picture(CGPoint(x: 0.45, y: 0.5), around: CGPoint(x: 0.5, y: 0.5), up: tilt)
        let re = Upright.picture(CGPoint(x: 0.55, y: 0.5), around: CGPoint(x: 0.5, y: 0.5), up: tilt)
        let no = Upright.picture(CGPoint(x: 0.5, y: 0.45), around: CGPoint(x: 0.5, y: 0.5), up: tilt)
        precondition(abs(GestureGate.turn(leftEye: le, rightEye: re, nose: no)) < 0.01, "facing, head tilted on a pillow")
        precondition(GestureGate.turn(leftEye: CGPoint(x: 0.45, y: 0.5), rightEye: CGPoint(x: 0.55, y: 0.5), nose: CGPoint(x: 0.535, y: 0.45)) > 0.25, "turned away")
        precondition(!GestureGate.isFacing(yaw: 0, pitch: -0.7, limit: 25), "looking down at a phone")
        precondition(!GestureGate.isFacing(yaw: 0.8, pitch: 0, limit: 25), "looking across at the dog")
        for mood in ["listening", "thinking", "speaking"] {
            for step in 0..<200 {
                let o = Mood.offset(mood, t: Double(step) * 0.05, strength: 1)
                precondition(abs(o.pan) <= 12.01 && abs(o.tilt) <= 8.01, "\(mood) stays within a few degrees")
            }
        }
        precondition(Mood.offset("speaking", t: 1, strength: 0) == (0, 0), "strength 0 is still")
        precondition(Mood.offset("idle", t: 1, strength: 1) == (0, 0), "idle is still")
        // Sitting at 1x: upper body 0.35 tall, face 0.08 - zoom in to fill 70%.
        let seated = Framing.zoom(current: 1, face: CGRect(x: 0.46, y: 0.6, width: 0.06, height: 0.08), body: CGRect(x: 0.4, y: 0.3, width: 0.2, height: 0.35), fill: 0.7)
        precondition(abs(seated - 2) < 0.01, "seated zooms to fit the upper body (\(seated))")
        // Standing close at 2x: upper body already 0.9 tall - zoom out, not in.
        let standing = Framing.zoom(current: 2, face: CGRect(x: 0.45, y: 0.6, width: 0.1, height: 0.15), body: CGRect(x: 0.3, y: 0.05, width: 0.4, height: 0.9), fill: 0.7)
        precondition(standing < 2, "standing up close zooms out (\(standing))")
        // Whatever the body, the face never ends up taller than a quarter of the frame.
        let faceOnly = Framing.zoom(current: 1, face: CGRect(x: 0.45, y: 0.5, width: 0.08, height: 0.1), body: nil, fill: 0.7)
        precondition(0.1 * faceOnly <= 0.25, "face-only framing stays loose (\(faceOnly))")
        precondition(Framing.aim(face: CGRect(x: 0.4, y: 0.6, width: 0.1, height: 0.1), body: .zero).y < 0.5, "aim below the face, so it sits high")
        for scale in [0.02, 0.05, 0.15] as [CGFloat] {
            precondition(HandShape.classify(HandShape.sample("thumbs_up", scale: scale)) == "thumbs_up", "thumbs up at hand size \(scale)")
            precondition(HandShape.classify(HandShape.sample("open", scale: scale)) == "open_palm", "open palm at hand size \(scale)")
            precondition(HandShape.classify(HandShape.sample("fist", scale: scale)) == nil, "a fist is no gesture at \(scale)")
        }
        // Taught samples: a thumbs-up taught at one size and place matches at
        // another, and from the other hand; a fist matches nothing.
        var taught = GestureTemplates()
        taught.samples["thumbs_up"] = [HandVector.make(HandShape.sample("thumbs_up", scale: 0.05))!]
        taught.samples["open_palm"] = [HandVector.make(HandShape.sample("open", scale: 0.05))!]
        precondition(taught.match(HandShape.sample("thumbs_up", scale: 0.12, at: CGPoint(x: 0.3, y: 0.4)), within: 0.35) == "thumbs_up", "taught thumbs up, any size")
        let left = HandShape.sample("thumbs_up", scale: 0.05).mapValues { CGPoint(x: 1.2 - $0.x, y: $0.y) }
        precondition(taught.match(left, within: 0.35) == "thumbs_up", "taught right hand, shown with the left")
        precondition(taught.match(HandShape.sample("fist", scale: 0.05), within: 0.2) == nil, "a fist is not a taught gesture")
        let mouth = CGRect(x: 0.4, y: 0.5, width: 0.1, height: 0.2)
        let atMouth = (0..<10).map { CGPoint(x: 0.42 + CGFloat($0) * 0.005, y: 0.52 + CGFloat($0) * 0.01) }
        let beside = atMouth.enumerated().map { $0.offset < 2 ? $0.element : CGPoint(x: 0.6, y: 0.55) }
        precondition(GestureGate.atHead(atMouth, head: mouth), "a hand at the mouth is at the head")
        precondition(!GestureGate.atHead(beside, head: mouth), "a fingertip grazing it is not")
        // Elbows: a forearm up is raised; a hand in the lap is not, even when
        // the camera's angle puts it close to the face in the picture.
        let arm = [(wrist: CGPoint(x: 0.6, y: 0.4), elbow: CGPoint(x: 0.62, y: 0.3))]
        precondition(GestureGate.elbow(for: CGPoint(x: 0.61, y: 0.41), arms: arm) != nil, "finds the arm for a hand")
        precondition(GestureGate.isRaised(wrist: CGPoint(x: 0.6, y: 0.4), elbow: CGPoint(x: 0.62, y: 0.3)), "wrist above elbow: raised")
        precondition(!GestureGate.isRaised(wrist: CGPoint(x: 0.55, y: 0.45), elbow: CGPoint(x: 0.5, y: 0.47)), "wrist level with or below the elbow: resting")
        precondition(!GestureGate.isRaised(wrist: CGPoint(x: 0.62, y: 0.42), elbow: CGPoint(x: 0.5, y: 0.4)), "forearm flat on a mouse: resting")
        precondition(GestureGate.elbow(for: CGPoint(x: 0.2, y: 0.2), arms: arm) == nil, "a far-off arm is someone else's")
        // Lying on the couch, head to the left: their up is the picture's left.
        let lying = CGVector(dx: -1, dy: 0)
        // Shoulders: sitting up gives straight up; lying head-left gives left.
        let sitting = Upright.up(leftShoulder: CGPoint(x: 0.4, y: 0.5), rightShoulder: CGPoint(x: 0.6, y: 0.5), nose: CGPoint(x: 0.5, y: 0.6))!
        precondition(abs(sitting.dx) < 0.01 && sitting.dy > 0.99, "upright shoulders: up is up")
        let lyingShoulders = Upright.up(leftShoulder: CGPoint(x: 0.5, y: 0.45), rightShoulder: CGPoint(x: 0.5, y: 0.6), nose: CGPoint(x: 0.42, y: 0.52))!
        precondition(lyingShoulders.dx < -0.99, "lying head-left: up is left")
        precondition(Upright.point(Upright.picture(CGPoint(x: 0.3, y: 0.7), around: CGPoint(x: 0.5, y: 0.5), up: lying),
                                   around: CGPoint(x: 0.5, y: 0.5), up: lying).x.distance(to: 0.3).magnitude < 0.0001, "frames round-trip")
        let wristLying = CGPoint(x: 0.6, y: 0.5)
        // Lying down, a thumb pointed at the ceiling is still a thumbs-up: shapes
        // use the room's up, so the same hand reads the same.
        precondition(HandShape.classify(HandShape.sample("thumbs_up", scale: 0.05, at: wristLying)) == "thumbs_up", "thumbs up, any posture")
        precondition(GestureGate.isRaised(wrist: CGPoint(x: 0.44, y: 0.51), elbow: CGPoint(x: 0.5, y: 0.5), up: lying), "forearm up toward the head, lying down")
        precondition(!GestureGate.isRaised(wrist: CGPoint(x: 0.5, y: 0.6), elbow: CGPoint(x: 0.5, y: 0.5), up: lying), "an arm resting along the couch is not raised")
        // Reclining, the arm held straight up: raised by the room's up, even if
        // not by the body's - the live check accepts either.
        let straightUp = (wrist: CGPoint(x: 0.5, y: 0.6), elbow: CGPoint(x: 0.5, y: 0.5))
        precondition(GestureGate.isRaised(wrist: straightUp.wrist, elbow: straightUp.elbow)
                     || GestureGate.isRaised(wrist: straightUp.wrist, elbow: straightUp.elbow, up: lying), "reclining, a hand held straight up counts")
        let flat = (wrist: CGPoint(x: 0.6, y: 0.5), elbow: CGPoint(x: 0.5, y: 0.5))
        precondition(!(GestureGate.isRaised(wrist: flat.wrist, elbow: flat.elbow)
                       || GestureGate.isRaised(wrist: flat.wrist, elbow: flat.elbow, up: lying)), "a forearm lying flat on the blanket, away from the head, does not")
        let head = GestureGate.head(face, hair: 0.9, chin: 0.25)
        precondition(head.contains(CGPoint(x: 0.49, y: 0.58)), "a fork at the mouth, just under the chin, is in the head zone")
        precondition(!head.contains(CGPoint(x: 0.6, y: 0.50)), "a thumbs up beside the chest is not")
        let held = (0..<5).map { CGPoint(x: 0.6 + CGFloat($0) * 0.002, y: 0.5) }
        let eating = [CGPoint(x: 0.5, y: 0.3), CGPoint(x: 0.5, y: 0.45), CGPoint(x: 0.5, y: 0.55), CGPoint(x: 0.5, y: 0.4)]
        precondition(GestureGate.isSteady(held, tolerance: 0.02), "a held pose is steady")
        precondition(!GestureGate.isSteady(eating, tolerance: 0.02), "hand-to-mouth is not")
        print("RoomMap self-test passed")
    }
}

@_silgen_name("HubbubbLinkCameraDiagnostics")
private func hubbubbLinkCameraDiagnostics(_ zoom: UnsafeMutablePointer<Int>, _ videoMode: UnsafeMutablePointer<Int32>) -> Int32
@_silgen_name("HubbubbLinkCameraTakeControl")
private func hubbubbLinkCameraTakeControl() -> Int32
@_silgen_name("HubbubbLinkCameraIdentity")
private func hubbubbLinkCameraIdentity(_ buffer: UnsafeMutablePointer<CChar>, _ size: Int32) -> Int32
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

/// A person's own "up" - hips to neck - and points seen in their frame, so
/// every gesture rule reads the same lying on the couch as sitting up.
/// Vectors are in aspect-corrected units (x scaled for 16:9).
private enum Upright {
    static let vertical = CGVector(dx: 0, dy: 1)

    static func up(neck: CGPoint, root: CGPoint) -> CGVector? {
        let dx = (neck.x - root.x) * 16 / 9, dy = neck.y - root.y
        let length = hypot(dx, dy)
        return length > 0.02 ? CGVector(dx: dx / length, dy: dy / length) : nil
    }

    /// Up from the shoulders when the hips are hidden (a laptop, a blanket):
    /// square to the shoulder line, on the side the nose is.
    static func up(leftShoulder l: CGPoint, rightShoulder r: CGPoint, nose: CGPoint) -> CGVector? {
        let sx = (r.x - l.x) * 16 / 9, sy = r.y - l.y
        let length = hypot(sx, sy)
        guard length > 0.02 else { return nil }
        var up = CGVector(dx: -sy / length, dy: sx / length)
        let mid = CGPoint(x: (l.x + r.x) / 2, y: (l.y + r.y) / 2)
        let toNose = CGVector(dx: (nose.x - mid.x) * 16 / 9, dy: nose.y - mid.y)
        if up.dx * toNose.dx + up.dy * toNose.dy < 0 { up = CGVector(dx: -up.dx, dy: -up.dy) }
        return up
    }

    /// `p` as it would look if the person were upright, turning about `c`.
    static func point(_ p: CGPoint, around c: CGPoint, up: CGVector) -> CGPoint {
        let vx = (p.x - c.x) * 16 / 9, vy = p.y - c.y
        let along = vx * up.dx + vy * up.dy, side = vx * up.dy - vy * up.dx
        return CGPoint(x: c.x + side * 9 / 16, y: c.y + along)
    }

    /// The reverse: an upright point back into the picture (for tests).
    static func picture(_ q: CGPoint, around c: CGPoint, up: CGVector) -> CGPoint {
        let side = (q.x - c.x) * 16 / 9, along = q.y - c.y
        return CGPoint(x: c.x + (side * up.dy + along * up.dx) * 9 / 16, y: c.y + (-side * up.dx + along * up.dy))
    }

    /// A box (a face) in the person's frame, turning about its centre.
    static func rect(_ r: CGRect, up: CGVector) -> CGRect {
        let c = CGPoint(x: r.midX, y: r.midY)
        let corners = [CGPoint(x: r.minX, y: r.minY), CGPoint(x: r.maxX, y: r.minY),
                       CGPoint(x: r.minX, y: r.maxY), CGPoint(x: r.maxX, y: r.maxY)].map { point($0, around: c, up: up) }
        let xs = corners.map(\.x), ys = corners.map(\.y)
        return CGRect(x: xs.min()!, y: ys.min()!, width: xs.max()! - xs.min()!, height: ys.max()! - ys.min()!)
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

    /// The better test, when the arm is seen: a gesture lifts the forearm, so
    /// the wrist sits above its elbow. Hands in a lap, on a keyboard or on the
    /// dog rest at or below the elbow - however close to the face the camera's
    /// downward angle makes them look. `margin` is in frame heights.
    static func isRaised(wrist: CGPoint, elbow: CGPoint, up: CGVector = Upright.vertical, margin: CGFloat = 0.01) -> Bool {
        // Lifted, not just level: the forearm at least ~25 degrees above the
        // person's horizontal (their "up", not the picture's, so lying down
        // counts the same). A forearm flat on a mouse can have the wrist a
        // hair above the elbow.
        let dx = (wrist.x - elbow.x) * 16 / 9, dy = wrist.y - elbow.y
        let along = dx * up.dx + dy * up.dy
        return along > margin && along / max(0.0001, hypot(dx, dy)) >= 0.42
    }

    /// The elbow for a hand: the body-pose wrist nearest the hand's wrist (if
    /// it is near), and that same arm's elbow.
    static func elbow(for wrist: CGPoint, arms: [(wrist: CGPoint, elbow: CGPoint)], near: CGFloat = 0.06) -> CGPoint? {
        arms.map { ($0, hypot($0.wrist.x - wrist.x, $0.wrist.y - wrist.y)) }
            .filter { $0.1 < near }.min { $0.1 < $1.1 }?.0.elbow
    }

    /// The head, where a hand means eating or a scratch, not a gesture: the face
    /// box, `hair` face heights above it, `chin` below it (the mouth and a fork
    /// on its way there), and a sliver either side. Padding wide to the sides
    /// blocked gestures held beside the face, so the reach is up and down.
    static func head(_ face: CGRect, hair: CGFloat, chin: CGFloat) -> CGRect {
        CGRect(x: face.minX - face.width * 0.15, y: face.minY - face.height * chin,
               width: face.width * 1.3, height: face.height * (1 + hair + chin))
    }

    /// Whether a face is turned toward the camera: head yaw and pitch (radians,
    /// as Vision reports them; nil when unknown) within `limit` degrees.
    /// Looking down at a phone or across at the dog fails this.
    static func isFacing(yaw: Double?, pitch: Double?, limit: Double) -> Bool {
        let radians = limit * .pi / 180
        return abs(yaw ?? 0) <= radians && abs(pitch ?? 0) <= radians
    }

    /// Whether a hand is *at* the head: a good share of its joints (not one
    /// fingertip clipping it) inside the zone. Eating puts most of the hand at
    /// the mouth; a thumbs-up beside the shoulder only grazes it.
    static func atHead(_ points: [CGPoint], head: CGRect, share: CGFloat = 0.4) -> Bool {
        guard !points.isEmpty else { return false }
        return CGFloat(points.filter(head.contains).count) / CGFloat(points.count) >= share
    }

    /// How far a face is turned from the camera, from where the nose sits
    /// between the eyes, measured along the eye line: 0 facing the camera,
    /// growing toward +-0.5 as the head turns to profile. Measured along the
    /// eyes, it reads the same with the head tilted on a pillow - unlike
    /// Vision's yaw, which reads a tilted head as turned away.
    static func turn(leftEye l: CGPoint, rightEye r: CGPoint, nose n: CGPoint) -> CGFloat {
        let ex = (r.x - l.x) * 16 / 9, ey = r.y - l.y
        let eyes = max(0.0001, hypot(ex, ey))
        let mx = (l.x + r.x) / 2, my = (l.y + r.y) / 2
        let nx = (n.x - mx) * 16 / 9, ny = n.y - my
        return (nx * ex + ny * ey) / (eyes * eyes)
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

/// Camera body language while Jarvis talks: an offset from where the camera
/// pointed when the mood began, in degrees, `t` seconds into it. Pure, so
/// `--self-test` can check it never wanders far.
private enum Mood {
    static func offset(_ mood: String, t: Double, strength: Double) -> (pan: Float, tilt: Float) {
        let s = max(0, min(1, strength))
        switch mood {
        case "listening":
            // Perk up: a quick lift that settles, like raising its head.
            let lift = t < 0.25 ? t / 0.25 : max(0.4, 1 - (t - 0.25) / 0.8)
            return (0, Float(8 * s * lift))
        case "thinking":
            // A slow glance up and to one side and back, every 3 s.
            let phase = sin(t.truncatingRemainder(dividingBy: 3) / 3 * 2 * .pi)
            return (Float(12 * s * max(0, phase)), Float(5 * s * max(0, phase)))
        case "speaking":
            // Nods with speech-like cadence: two mixed rhythms, never repeating exactly.
            let nod = 0.65 * sin(t * 2 * .pi / 0.9) + 0.35 * sin(t * 2 * .pi / 0.37 + 1.3)
            let sway = sin(t * 2 * .pi / 4.1)
            return (Float(3 * s * sway), Float(6 * s * nod))
        default:
            return (0, 0)
        }
    }
}

/// Hand shapes from joint positions, measured in hand sizes (not frame
/// fractions) so the same gesture reads the same at any zoom or distance.
/// Joints are named like Vision's: "thumbTip", "indexPIP", "wrist"...
private enum HandShape {
    static func classify(_ p: [String: CGPoint]) -> String? {
        func d(_ a: String, _ b: String) -> CGFloat {
            guard let x = p[a], let y = p[b] else { return 0 }
            return hypot(x.x - y.x, x.y - y.y)
        }
        guard let thumbTip = p["thumbTip"], let thumbIP = p["thumbIP"], let thumbMP = p["thumbMP"] else { return nil }
        // Hand size: palm length (wrist to middle knuckle), or palm width.
        let palmWidth = max(0.002, d("indexMCP", "littleMCP"))
        let size = max(palmWidth, d("wrist", "middleMCP"))
        let fingers = [("indexTip", "indexPIP", "indexMCP"), ("middleTip", "middlePIP", "middleMCP"),
                       ("ringTip", "ringPIP", "ringMCP"), ("littleTip", "littlePIP", "littleMCP")]
        // Tuned on real hands (hands.jsonl): side-on, curled fingers measure up
        // to ~1.6 knuckle-to-tip lengths; straight ones 1.8-2.6, pointing any way.
        let curled = fingers.filter { d($0.0, $0.2) < d($0.1, $0.2) * 1.6 }.count
        // Straight and pointing up (at least ~30 degrees above horizontal):
        // fingers spread on a mouse or keyboard point forward or down.
        let extended = fingers.filter { f in
            guard let tip = p[f.0], let mcp = p[f.2] else { return false }
            let dx = (tip.x - mcp.x) * 16 / 9, dy = tip.y - mcp.y
            return d(f.0, f.2) > d(f.1, f.2) * 1.7 && dy / max(0.0001, hypot(dx, dy)) > 0.5
        }.count
        switch extended {
        case 1: return "number_1"
        case 2: return "number_2"
        case 3: return "number_3"
        default: break
        }
        let thumbToPalm = d("thumbTip", "indexMCP")
        let thumbToBase = d("thumbTip", "thumbMP")
        // Vision y grows upward. The tip must rise above both thumb joints, by a
        // share of the hand, so a sideways thumb is not a thumbs-up.
        let thumbRaised = thumbTip.y > thumbIP.y + size * 0.10 && thumbTip.y > thumbMP.y + size * 0.25
        // Thumbs-down only needs the thumb angled downward (x scaled for 16:9).
        let dx = (thumbTip.x - thumbMP.x) * 16 / 9, dy = thumbTip.y - thumbMP.y
        let thumbLowered = dy / max(0.0001, hypot(dx, dy)) < -0.2
        if thumbRaised && curled >= 3 && thumbToBase > palmWidth * 0.35 { return "thumbs_up" }
        if thumbLowered && curled >= 3 && thumbToPalm > palmWidth * 0.55 && thumbToBase > palmWidth * 0.35 { return "thumbs_down" }
        // A relaxed open hand keeps its thumb at about half a palm out.
        if extended == 4 && thumbToPalm > palmWidth * 0.3 { return "open_palm" }
        return nil
    }

    /// The numbers behind a decision, for tuning against real hands.
    static func measures(_ p: [String: CGPoint]) -> [String: Any] {
        func d(_ a: String, _ b: String) -> Double {
            guard let x = p[a], let y = p[b] else { return -1 }
            return Double(hypot(x.x - y.x, x.y - y.y))
        }
        let palmWidth = max(0.002, d("indexMCP", "littleMCP"))
        let size = max(palmWidth, d("wrist", "middleMCP"))
        let fingers = [("indexTip", "indexPIP", "indexMCP"), ("middleTip", "middlePIP", "middleMCP"),
                       ("ringTip", "ringPIP", "ringMCP"), ("littleTip", "littlePIP", "littleMCP")]
        func r(_ v: Double) -> Double { (v * 100).rounded() / 100 }
        return [
            "size": r(size * 1000) / 1000, "palmWidth": r(palmWidth * 1000) / 1000,
            "curled": fingers.filter { d($0.0, $0.2) < d($0.1, $0.2) * 1.35 }.count,
            "fingerReach": fingers.map { r(d($0.0, $0.2) / max(0.0001, d($0.1, $0.2))) },
            "thumbAboveIP": r(Double((p["thumbTip"]?.y ?? 0) - (p["thumbIP"]?.y ?? 0)) / size),
            "thumbAboveMP": r(Double((p["thumbTip"]?.y ?? 0) - (p["thumbMP"]?.y ?? 0)) / size),
            "thumbToPalm": r(d("thumbTip", "indexMCP") / palmWidth),
            "thumbToBase": r(d("thumbTip", "thumbMP") / palmWidth),
            "joints": p.count,
        ]
    }

    /// A synthetic right hand at `scale` (fraction of the frame), for tests.
    static func sample(_ pose: String, scale s: CGFloat, at o: CGPoint = CGPoint(x: 0.6, y: 0.5)) -> [String: CGPoint] {
        func pt(_ x: CGFloat, _ y: CGFloat) -> CGPoint { CGPoint(x: o.x + x * s, y: o.y + y * s) }
        var p: [String: CGPoint] = ["wrist": pt(0, 0)]
        let knuckles: [(String, CGFloat)] = [("index", -0.3), ("middle", -0.1), ("ring", 0.1), ("little", 0.3)]
        for (name, x) in knuckles {
            p[name + "MCP"] = pt(x, 1)
            p[name + "PIP"] = pt(x, 1.4)
            // Curled fingers fold back toward the knuckle; extended ones reach up.
            p[name + "Tip"] = pose == "open" ? pt(x * 1.3, 2.0) : pt(x, 1.1)
            p[name + "DIP"] = pose == "open" ? pt(x * 1.15, 1.7) : pt(x, 1.35)
        }
        p["thumbCMC"] = pt(-0.3, 0.4)
        switch pose {
        case "thumbs_up":
            p["thumbMP"] = pt(-0.5, 0.9); p["thumbIP"] = pt(-0.55, 1.3); p["thumbTip"] = pt(-0.55, 1.7)
        case "open":
            p["thumbMP"] = pt(-0.6, 0.6); p["thumbIP"] = pt(-0.85, 0.8); p["thumbTip"] = pt(-1.05, 1.0)
        default:  // a fist: thumb tucked across
            p["thumbMP"] = pt(-0.45, 0.7); p["thumbIP"] = pt(-0.35, 0.85); p["thumbTip"] = pt(-0.2, 0.9)
        }
        return p
    }
}

/// A hand as numbers for matching against taught samples: every joint relative
/// to the wrist, in hand sizes (x scaled for 16:9), so the same pose matches
/// at any zoom, distance or place in the frame. Mirrored, a left hand matches
/// a right hand's samples.
private enum HandVector {
    static let order = [
        "wrist", "thumbCMC", "thumbMP", "thumbIP", "thumbTip",
        "indexMCP", "indexPIP", "indexDIP", "indexTip", "middleMCP", "middlePIP", "middleDIP", "middleTip",
        "ringMCP", "ringPIP", "ringDIP", "ringTip", "littleMCP", "littlePIP", "littleDIP", "littleTip",
    ]

    static func make(_ p: [String: CGPoint], mirrored: Bool = false) -> [Double]? {
        guard let w = p["wrist"], order.filter({ p[$0] != nil }).count >= 18 else { return nil }
        func rel(_ q: CGPoint) -> (Double, Double) { (Double((q.x - w.x) * 16 / 9), Double(q.y - w.y)) }
        let size = ["indexMCP", "middleMCP", "ringMCP", "littleMCP"].compactMap { p[$0] }
            .map { let r = rel($0); return hypot(r.0, r.1) }.max() ?? 0
        guard size > 0.001 else { return nil }
        return order.flatMap { name -> [Double] in
            guard let q = p[name] else { return [0, 0] }  // missing: at the wrist
            let r = rel(q)
            return [r.0 / size * (mirrored ? -1 : 1), r.1 / size]
        }
    }

    /// How different two hands are, in hand sizes: the average of the four
    /// joints that differ most. Averaging every joint would let a fist pass
    /// for a thumbs-up - they differ only in the thumb.
    static func distance(_ a: [Double], _ b: [Double]) -> Double {
        guard a.count == b.count, !a.isEmpty else { return .infinity }
        let gaps = stride(from: 0, to: a.count, by: 2).map { hypot(a[$0] - b[$0], a[$0 + 1] - b[$0 + 1]) }
        return gaps.sorted(by: >).prefix(4).reduce(0, +) / 4
    }
}

/// The gestures someone has taught the camera: their own hand, ~25 samples a
/// gesture. Matching against these beats any hand-written rule.
private struct GestureTemplates {
    var samples: [String: [[Double]]] = [:]

    static var url: URL {
        FileManager.default.urls(for: .applicationSupportDirectory, in: .userDomainMask)[0]
            .appendingPathComponent("Hubbubb Local Camera/gestures.json")
    }

    static func load() -> GestureTemplates {
        let data = try? Data(contentsOf: url)
        return GestureTemplates(samples: data.flatMap { try? JSONDecoder().decode([String: [[Double]]].self, from: $0) } ?? [:])
    }

    func save() throws {
        try FileManager.default.createDirectory(at: Self.url.deletingLastPathComponent(), withIntermediateDirectories: true)
        try JSONEncoder().encode(samples).write(to: Self.url, options: .atomic)
    }

    /// The taught gesture nearest this hand (either hand), if it is near
    /// enough and clearly nearer than the next-best gesture.
    func match(_ p: [String: CGPoint], within limit: Double) -> String? {
        let hands = [HandVector.make(p), HandVector.make(p, mirrored: true)].compactMap { $0 }
        guard !hands.isEmpty else { return nil }
        let ranked = samples.compactMap { gesture, taught -> (String, Double)? in
            let best = taught.flatMap { t in hands.map { HandVector.distance($0, t) } }.min()
            return best.map { (gesture, $0) }
        }.sorted { $0.1 < $1.1 }
        guard let first = ranked.first, first.1 < limit else { return nil }
        if ranked.count > 1, ranked[1].1 < first.1 * 1.15 { return nil }  // too close to call
        return first.0
    }
}

/// How to frame one person, kept pure so `--self-test` can check it.
private enum Framing {
    /// The zoom that frames them: the upper body fills `fill` of the frame's
    /// height, but the face never more than `maxFace` - so standing up close
    /// stays a half-body shot instead of a face filling the screen. No real
    /// body box (only a face seen) frames by the face alone.
    static func zoom(current: CGFloat, face: CGRect?, body: CGRect?, fill: CGFloat, maxFace: CGFloat = 0.25) -> CGFloat {
        var target: CGFloat = 4
        if let body { target = min(target, current * fill / max(body.height, 0.01)) }
        // Only a face (body not found): assume a half-body shot means a face
        // about an eighth of the frame tall, not a head shot.
        if let face { target = min(target, current * (body == nil ? maxFace * 0.5 : maxFace) / max(face.height, 0.01)) }
        return min(4, max(1, target))
    }

    /// Where to centre the camera: on the face across, and low enough that the
    /// face sits a third from the top rather than dead centre.
    static func aim(face: CGRect?, body: CGRect, up: CGVector = Upright.vertical) -> CGPoint {
        guard let face else { return CGPoint(x: body.midX, y: body.maxY - body.height * 0.3) }
        // Toward their body from the face, whichever way they are lying.
        return CGPoint(x: face.midX - 0.17 * up.dx * 9 / 16, y: face.midY - 0.17 * up.dy)
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

    /// Whether they left out of the top (stood up: +1), the bottom (-1), or
    /// neither (0), from where their face was last seen (Vision y grows upward).
    static func exitTilt(lastY: CGFloat, velocityY: CGFloat) -> Float {
        if lastY > 0.62 || velocityY > 0.25 { return 1 }
        if lastY < 0.3 || velocityY < -0.25 { return -1 }
        return 0
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
    private var controlWatchdog: DispatchSourceTimer?

    // Tuning knobs Home Assistant may set: name -> (allowed range, default).
    // Each is read where it is used, from these same defaults.
    private static let knobs: [String: (range: ClosedRange<Double>, value: Double)] = [
        "followGain": (0.1...1.0, 0.45),
        "gestureReach": (0.5...3.0, 1.0),
        "hairReach": (0...2, 0.9),
        "chinReach": (0...1.5, 0.25),
        "steadiness": (0.1...1.0, 0.35),
        "faceMatchThreshold": (0.2...1.2, 0.6),
        "searchDegrees": (10...120, 45),
        "searchTilt": (-60...30, -20),
        "holdSeconds": (0.3...2.0, 0.6),
        "handConfidence": (0.1...0.8, 0.25),
        "lookAngle": (10...60, 25),
        "lookTurn": (0.1...0.5, 0.33),
        "framingFill": (0.4...1.0, 0.7),
        "gestureMatch": (0.15...0.7, 0.35),
    ]
    private var follow: Bool {
        get { UserDefaults.standard.object(forKey: "localAIFollowingEnabled") as? Bool ?? true }
        set { UserDefaults.standard.set(newValue, forKey: "localAIFollowingEnabled") }
    }
    private var autoZoom: Bool {
        get { UserDefaults.standard.object(forKey: "autoZoomEnabled") as? Bool ?? true }
        set { UserDefaults.standard.set(newValue, forKey: "autoZoomEnabled") }
    }
    private var requireLooking: Bool {
        get { UserDefaults.standard.object(forKey: "requireLooking") as? Bool ?? true }
        set { UserDefaults.standard.set(newValue, forKey: "requireLooking") }
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
            do { try SMAppService.mainApp.register() } catch { note("Hubbubb camera: could not add a login item: \(error)") }
        }
        server = CameraServer { [weak self] method, path, query, body in
            self?.route(method, path, query, body) ?? .json("503 Service Unavailable", ["ok": false])
        }
        if server == nil { note("Hubbubb camera: no companion token or port \(CameraServer.port) busy; Home Assistant cannot connect") }
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
            processor.takeControl()
            self.applySettings()
            // Re-assert now and then: a tap on the camera's touch panel or the
            // Insta360 app can switch its own framing back on.
            let watchdog = DispatchSource.makeTimerSource(queue: self.sessionQueue)
            watchdog.schedule(deadline: .now() + 15, repeating: 15)
            watchdog.setEventHandler { [weak processor] in processor?.takeControl() }
            watchdog.resume()
            self.controlWatchdog = watchdog
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
        var settings: [String: Any] = ["follow": follow, "auto_zoom": autoZoom, "zoom": manualZoom,
                                       "require_looking": requireLooking]
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
            state["mood"] = processor.mood
            state["gestures"] = processor.gestureTraining()
            state["hardware"] = processor.hardware()
        }
        return state
    }

    private func updateSettings(_ changes: [String: Any]) -> [String: Any] {
        if let value = changes["follow"] as? Bool { follow = value }
        if let value = changes["auto_zoom"] as? Bool { autoZoom = value }
        if let value = changes["require_looking"] as? Bool { requireLooking = value }
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
        case ("POST", "/mood"):
            guard let processor, let mood = body["mood"] as? String,
                  ["listening", "thinking", "speaking", "idle"].contains(mood) else {
                return bad("mood is listening, thinking, speaking or idle")
            }
            processor.setMood(mood, strength: (body["strength"] as? NSNumber)?.doubleValue ?? 0.6)
            return ok(["ok": true])
        case ("GET", "/identity"):
            var buffer = [CChar](repeating: 0, count: 256)
            guard hubbubbLinkCameraIdentity(&buffer, 256) == 1 else { return bad("camera not connected") }
            let parts = String(cString: buffer).split(separator: "|", omittingEmptySubsequences: false).map(String.init)
            return ok(["serial": parts.first ?? "", "firmware": parts.count > 1 ? parts[1] : ""])
        case ("POST", "/gesture_teach"):
            guard let processor, let gesture = body["gesture"] as? String,
                  ["thumbs_up", "thumbs_down", "open_palm", "number_1", "number_2", "number_3"].contains(gesture) else {
                return bad("unknown gesture")
            }
            processor.beginTeaching(gesture)
            return ok(["ok": true])
        case ("POST", "/gesture_forget"):
            return ok(["ok": processor?.forgetTeaching(body["gesture"] as? String ?? "") ?? false])
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
    // One gesture at a time: after one fires, a different one waits.
    var lastFired: String?
    var quietUntil = Date.distantPast
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
    // Face turned toward the camera this frame: gestures need eye contact.
    var facing = false
    // The body box came from Vision's body detector, not guessed from a face.
    var bodySeen = true
    // Head yaw and pitch in degrees, for diagnosing "looking at the camera".
    var headAngles: (yaw: Double, pitch: Double)?
    // Their own up (hips to neck), smoothed; the picture's up until seen.
    var up = Upright.vertical
    // How turned from the camera, from eyes and nose (0 facing).
    var turn: CGFloat?
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
    // Arms: elbows tell a raised hand from one resting in a lap.
    private let bodyPoseRequest = VNDetectHumanBodyPoseRequest()
    // Eyes and nose, for a tilt-proof "looking at the camera".
    private let landmarksRequest = VNDetectFaceLandmarksRequest()
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
    private var latestHeads: [[String: Any]] = []
    private var followPausedUntil = Date.distantPast
    private var nobodyInView = true  // under settingsLock; read by the mood engine
    // Vision thread only: no re-framing until then (a hand is raised to gesture).
    private var framingHoldUntil = Date.distantPast
    // Vision thread only: the last classify failed for unclear finger joints.
    private var fingersUnclear = false
    private let lookQueue = DispatchQueue(label: "com.hubbubb.camera.look")
    private var itemBook = ItemBook.load()  // lookQueue only
    // Jarvis's body language (moodQueue only).
    private let moodQueue = DispatchQueue(label: "com.hubbubb.camera.mood")
    private var moodTimer: DispatchSourceTimer?
    private var moodBase: (pan: Float, tilt: Float)?
    private var currentMood = "idle"
    private var moodStrength = 0.6
    private var moodStarted = Date()
    private var moodRefreshed = Date()
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
    private var velocityY: CGFloat = 0
    // Alternate search passes between seated and standing head height.
    private var searchRaised = false
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
        // Revision 3 reports head yaw and pitch, for "looking at the camera".
        faceRequest.revision = VNDetectFaceRectanglesRequestRevision3
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
            try handler.perform([faceRequest, humanRequest, animalRequest, handRequest, bodyPoseRequest])
            let arms: [(wrist: CGPoint, elbow: CGPoint)] = (bodyPoseRequest.results ?? []).flatMap { body in
                [(VNHumanBodyPoseObservation.JointName.leftWrist, VNHumanBodyPoseObservation.JointName.leftElbow),
                 (.rightWrist, .rightElbow)].compactMap { wristJoint, elbowJoint in
                    guard let w = try? body.recognizedPoint(wristJoint), let e = try? body.recognizedPoint(elbowJoint),
                          w.confidence > 0.2, e.confidence > 0.2 else { return nil }
                    return (w.location, e.location)
                }
            }
            let torsos: [(neck: CGPoint, up: CGVector)] = (bodyPoseRequest.results ?? []).compactMap { body in
                func seen(_ joint: VNHumanBodyPoseObservation.JointName) -> CGPoint? {
                    (try? body.recognizedPoint(joint)).flatMap { $0.confidence > 0.2 ? $0.location : nil }
                }
                guard let neck = seen(.neck) else { return nil }
                // Hips to neck when the hips show; else square to the shoulders.
                if let root = seen(.root), let up = Upright.up(neck: neck, root: root) { return (neck, up) }
                if let l = seen(.leftShoulder), let r = seen(.rightShoulder), let nose = seen(.nose),
                   let up = Upright.up(leftShoulder: l, rightShoulder: r, nose: nose) { return (neck, up) }
                return nil
            }
            let animals = (animalRequest.results ?? []).filter { $0.confidence > 0.5 }
            let now = Date()
            updateTracks(
                humans: (humanRequest.results ?? []).map(\.boundingBox),
                faces: (faceRequest.results ?? []).map(\.boundingBox),
                animals: animals.map(\.boundingBox),
                now: now
            )
            // Which tracked faces look at the camera (yaw/pitch from the face request).
            let lookAngle = UserDefaults.standard.object(forKey: "lookAngle") as? Double ?? 25
            let faceObservations = faceRequest.results ?? []
            // Landmarks for the faces already found (no second face search).
            var landmarked: [VNFaceObservation] = []
            if !faceObservations.isEmpty {
                landmarksRequest.inputFaceObservations = faceObservations
                try? handler.perform([landmarksRequest])
                landmarked = landmarksRequest.results ?? []
            }
            // Calibration knob: how turned a face may be and still be "looking"
            // (0 facing, ~0.5 profile). Measured on the couch: facing the camera
            // lying down read 0.11-0.26, looking at a phone 0.44-0.62.
            let turnLimit = CGFloat(UserDefaults.standard.object(forKey: "lookTurn") as? Double ?? 0.33)
            for index in tracks.indices where tracks[index].visible {
                let observation = faceObservations.first { $0.boundingBox == tracks[index].face }
                let marks = landmarked.min { a, b in
                    guard let face = tracks[index].face else { return false }
                    return hypot(a.boundingBox.midX - face.midX, a.boundingBox.midY - face.midY)
                        < hypot(b.boundingBox.midX - face.midX, b.boundingBox.midY - face.midY)
                }
                let turn = marks.flatMap { Self.faceTurn($0) }
                tracks[index].turn = turn
                // Eyes and nose when seen (tilt-proof); Vision's yaw only if not.
                tracks[index].facing = turn.map { abs($0) <= turnLimit } ?? observation.map {
                    GestureGate.isFacing(yaw: $0.yaw?.doubleValue, pitch: $0.pitch?.doubleValue, limit: lookAngle)
                } ?? false
                tracks[index].headAngles = observation.map {
                    (($0.yaw?.doubleValue ?? .nan) * 180 / .pi, ($0.pitch?.doubleValue ?? .nan) * 180 / .pi)
                }
            }
            // Each person's up, from the torso whose neck is nearest their face.
            for index in tracks.indices where tracks[index].visible {
                let anchor = tracks[index].face.map { CGPoint(x: $0.midX, y: $0.midY) }
                    ?? CGPoint(x: tracks[index].body.midX, y: tracks[index].body.maxY)
                guard let torso = torsos.min(by: { hypot($0.neck.x - anchor.x, $0.neck.y - anchor.y) < hypot($1.neck.x - anchor.x, $1.neck.y - anchor.y) }),
                      hypot(torso.neck.x - anchor.x, torso.neck.y - anchor.y) < 0.25 else { continue }
                let old = tracks[index].up
                let mixed = CGVector(dx: old.dx * 0.7 + torso.up.dx * 0.3, dy: old.dy * 0.7 + torso.up.dy * 0.3)
                let length = max(0.0001, hypot(mixed.dx, mixed.dy))
                tracks[index].up = CGVector(dx: mixed.dx / length, dy: mixed.dy / length)
            }
            let visible = tracks.filter(\.visible)
            identifyFaces(handler, now: now)
            let enrollMessage = enroll(handler, visible: tracks.filter(\.visible))

            settingsLock.lock()
            nobodyInView = visible.isEmpty
            settingsLock.unlock()
            if visible.isEmpty {
                // Jarvis's nodding pauses following; never let it keep the camera
                // still while the person is out of view.
                if let lostSince = faceLostSince, now.timeIntervalSince(lostSince) > 0.8 { endMood(reason: "lost sight of them") }
                recoverLostFace()
            } else {
                if faceLostSince != nil {
                    smoothedFaceCenter = nil
                    chased = false
                    velocityX = 0
                    velocityY = 0
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
            latestHeads = visible.compactMap { track in
                track.headAngles.map { ["name": track.name ?? "someone", "yaw": $0.yaw.isNaN ? NSNull() : Int($0.yaw), "pitch": $0.pitch.isNaN ? NSNull() : Int($0.pitch), "looking": track.facing,
                                        "lean": Int(atan2(track.up.dx, track.up.dy) * 180 / .pi),
                                        "turn": track.turn.map { Double(Int($0 * 100)) / 100 } ?? NSNull()] }
            }
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
            let reach = CGFloat(UserDefaults.standard.object(forKey: "gestureReach") as? Double ?? 1.0)
            var messages: [String] = []
            var fired: [(gesture: String, person: String?, held: Bool)] = []
            var raisedHands = 0
            var lookingAway = 0
            // A deliberate gesture comes with a look at the camera; scrolling a
            // phone or petting the dog does not. Switchable in Home Assistant.
            let requireLooking = UserDefaults.standard.object(forKey: "requireLooking") as? Bool ?? true
            for index in tracks.indices where tracks[index].visible {
                let track = tracks[index]
                var raised = (handsByTrack[track.id] ?? []).filter { hand in
                    guard let wrist = try? hand.recognizedPoint(.wrist), wrist.confidence > 0.1 else { return false }
                    // Lifted against gravity or toward their head: reclining, people
                    // hold a hand straight up; lying flat, toward the head works too.
                    if let elbow = GestureGate.elbow(for: wrist.location, arms: arms) {
                        return GestureGate.isRaised(wrist: wrist.location, elbow: elbow)
                            || GestureGate.isRaised(wrist: wrist.location, elbow: elbow, up: track.up)
                    }
                    if let face = track.face {
                        let c = CGPoint(x: face.midX, y: face.midY)
                        return GestureGate.isRaised(wrist: wrist.location, face: face, body: track.body, reach: reach)
                            || GestureGate.isRaised(wrist: Upright.point(wrist.location, around: c, up: track.up),
                                                    face: Upright.rect(face, up: track.up), body: track.body, reach: reach)
                    }
                    return GestureGate.isRaised(wrist: wrist.location, face: nil, body: track.body, reach: reach)
                }
                if requireLooking && !track.facing && !raised.isEmpty {
                    lookingAway += raised.count
                    raised = []
                }
                raisedHands += raised.count
                // Teaching: sample the raised hand instead of acting on it.
                if let hand = raised.max(by: { $0.confidence < $1.confidence }), let line = teach(hand) {
                    messages.append(line)
                    continue
                }
                let result = updateGestures(&tracks[index].votes, hands: raised, face: track.face, up: track.up)
                if let message = result.message {
                    messages.append(tracks[index].name.map { "\($0): \(message)" } ?? message)
                }
                if let gesture = result.fired {
                    fired.append((gesture.id, track.name, gesture.held))
                    // Whoever gestures has the room's attention: keep them in frame.
                    tracks[index].lastSeen = now
                }
            }

            if raisedHands > 0 { framingHoldUntil = now.addingTimeInterval(1.2) }
            let people = visible.map { $0.name ?? "someone" }
            let idle = visible.isEmpty
                ? "No one in view. Preview and gesture analysis stay local."
                : (hands.isEmpty
                    ? "\(people.joined(separator: ", ")) in view. Raise a hand to gesture."
                    : lookingAway > 0 && raisedHands == 0
                    ? "Hand raised, but not looking at the camera, so it's ignored. Look at the camera to gesture."
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
        var people: [(body: CGRect, face: CGRect?, seen: Bool)] = bodies.map { body in
            (body, faces.filter { body.contains(center($0)) }.max { $0.area < $1.area }, true)
        }
        // A face with no body box (close to the lens, body cut off) is a person too.
        for face in faces where !people.contains(where: { $0.face == face }) {
            people.append((face.insetBy(dx: -face.width * 0.5, dy: 0).union(face.offsetBy(dx: 0, dy: -face.height * 2)), face, false))
        }

        var matched = Set<Int>()
        for person in people {
            let candidates = tracks.indices.filter { !matched.contains($0) }
            let best = candidates.min { hypot(center(tracks[$0].body).x - center(person.body).x, center(tracks[$0].body).y - center(person.body).y)
                < hypot(center(tracks[$1].body).x - center(person.body).x, center(tracks[$1].body).y - center(person.body).y) }
            if let best, hypot(center(tracks[best].body).x - center(person.body).x, center(tracks[best].body).y - center(person.body).y) < 0.25 {
                tracks[best].body = person.body
                tracks[best].face = person.face
                tracks[best].bodySeen = person.seen
                tracks[best].lastSeen = now
                matched.insert(best)
            } else {
                tracks.append(Track(id: nextTrackID, body: person.body, face: person.face, bodySeen: person.seen, lastSeen: now))
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
        // Someone is making a gesture: hold the shot still. Zooming or turning
        // under a held hand makes it look like it moved, and raising an arm
        // reshapes the body box the framing follows.
        if now < framingHoldUntil { return }
        settingsLock.lock()
        let current = currentZoomFactor
        settingsLock.unlock()
        if visible.count == 1 {
            // One person: a half-body shot, face a third from the top - the
            // same framing seated or standing. Calibration knob: `framingFill`.
            let person = visible[0]
            let fill = CGFloat(UserDefaults.standard.object(forKey: "framingFill") as? Double ?? 0.7)
            let point = Framing.aim(face: person.face, body: person.body, up: person.up)
            if person.face != nil || person.bodySeen {
                easeZoom(to: Framing.zoom(current: current, face: person.face, body: person.bodySeen ? person.body : nil, fill: fill), centeredOn: point)
            }
            adjustGimbal(forFace: CGRect(origin: point, size: .zero))
            return
        }
        // Fit everyone: the group's bodies should span about 80% of the frame.
        let group = visible.map(\.body).reduce(visible[0].body) { $0.union($1) }
        easeZoom(to: min(4, max(1, current * 0.8 / max(group.width, group.height, 0.01))), centeredOn: CGPoint(x: group.midX, y: group.midY))
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
        _ votes: inout GestureVotes, hands: [VNHumanHandPoseObservation], face: CGRect?, up: CGVector = Upright.vertical
    ) -> (message: String?, fired: (id: String, held: Bool)?) {
        // Vision may return a weak duplicate/false hand: use its strongest.
        let primaryHand = hands.max { $0.confidence < $1.confidence }
        let now = Date()
        // Any hand at the head - eating, a scratch, hair - turns gestures off
        // for two seconds; a meal keeps renewing that, so it stays off.
        if let face, hands.contains(where: { handOverlapsFace($0, faceBounds: face, up: up) }) {
            votes = GestureVotes(lastVolumeRepeat: votes.lastVolumeRepeat, pausedUntil: now.addingTimeInterval(1.2))
            return ("Gestures paused: a hand is at a face, mouth or hair.", nil)
        }
        if now < votes.pausedUntil {
            return ("Gestures paused for a moment: a hand was just at a face (eating?).", nil)
        }
        // Held still or it doesn't count. Tolerance scales with the face, so it
        // means the same up close and across the room.
        // Measured from the face, not the frame: the camera moving must not make
        // a still hand look like it moved.
        let anchor = face.map { CGPoint(x: $0.midX, y: $0.midY) } ?? .zero
        let wrist = primaryHand.flatMap { try? $0.recognizedPoint(.wrist) }
            .flatMap { $0.confidence > 0.1 ? CGPoint(x: $0.location.x - anchor.x, y: $0.location.y - anchor.y) : nil }
        if let wrist { votes.wrists.append(wrist) } else { votes.wrists.removeAll() }
        if votes.wrists.count > 5 { votes.wrists.removeFirst() }
        let tolerance = (face?.height ?? 0.1) * CGFloat(UserDefaults.standard.object(forKey: "steadiness") as? Double ?? 0.35)
        let steady = votes.wrists.count >= 3 && GestureGate.isSteady(votes.wrists, tolerance: tolerance)
        fingersUnclear = false
        let rawGesture = steady ? primaryHand.flatMap { classifyGesture($0) } : nil
        if steady, rawGesture == nil, let hand = primaryHand { recordUnrecognized(hand) }
        // Calibration knob: seconds a gesture must be held (about 10 analysed
        // frames a second). A pose a hand only passes through never gets there.
        let holdSeconds = UserDefaults.standard.object(forKey: "holdSeconds") as? Double ?? 0.6
        let requiredHits = max(3, Int((holdSeconds * 10).rounded()))
        votes.recent.append(rawGesture)
        if votes.recent.count > requiredHits + 3 { votes.recent.removeFirst(votes.recent.count - requiredHits - 3) }
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
        guard let detectedGesture = leadingGesture else {
            votes.missed += 1
            if votes.missed >= 8 { votes.latched = nil }
            let previousGesture = votes.recent.compactMap { $0 }.last
            let previousHits = previousGesture.map { g in votes.recent.filter { $0 == g }.count } ?? 0
            guard previousHits > 0 && votes.missed < 8, let previousGesture else {
                // Say why a raised hand isn't counting, so it can be fixed.
                guard primaryHand != nil else { return (nil, nil) }
                if votes.wrists.count >= 3 && !steady { return ("Hand moving - hold it still for a moment.", nil) }
                if fingersUnclear { return ("Fingers not clear - turn your palm or the back of your hand to the camera.", nil) }
                return (nil, nil)
            }
            return ("\(gestureTitle(previousGesture)): \(min(previousHits, requiredHits))/\(requiredHits) frames. Keep holding…", nil)
        }
        let gestureHits = gestureVotes[detectedGesture] ?? 0
        votes.missed = 0
        if let latched = votes.latched, latched != detectedGesture { votes.latched = nil }
        if gestureHits >= requiredHits && votes.latched != detectedGesture {
            // A hand changing shape passes through other gestures (three
            // fingers opening into a palm); only the first one counts.
            if Date() < votes.quietUntil, votes.lastFired != detectedGesture {
                return ("One gesture at a time - drop your hand, then make the next one.", nil)
            }
            votes.latched = detectedGesture
            votes.lastFired = detectedGesture
            votes.quietUntil = Date().addingTimeInterval(1.5)
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

    /// Play a mood ("listening", "thinking", "speaking", "idle") on the gimbal.
    /// Following pauses while it plays; "idle", or a minute without a refresh,
    /// returns the camera to where it was and hands back to following.
    func setMood(_ mood: String, strength: Double) {
        moodQueue.async { [self] in
            let now = Date()
            settingsLock.lock()
            let nobody = nobodyInView
            settingsLock.unlock()
            // Idle ends it; and with nobody in view the camera has better things
            // to do (finding them) than nodding at an empty couch.
            if mood == "idle" || nobody {
                if moodTimer != nil {
                    note("Hubbubb camera: mood idle%@", nobody && mood != "idle" ? " (nobody in view)" : "")
                    stopMood()
                }
                return
            }
            if moodTimer == nil {
                moodBase = ptzQueue.sync { cameraPosition() }
                guard moodBase != nil else { return }
                let timer = DispatchSource.makeTimerSource(queue: moodQueue)
                timer.schedule(deadline: .now(), repeating: 0.12)
                timer.setEventHandler { [weak self] in self?.moodTick() }
                moodTimer = timer
                timer.resume()
            }
            if mood != currentMood {
                moodStarted = now
                note("Hubbubb camera: mood %@", mood)
            }
            currentMood = mood
            moodStrength = strength
            moodRefreshed = now
            settingsLock.lock()
            followPausedUntil = .distantFuture
            settingsLock.unlock()
        }
    }

    var mood: String { moodQueue.sync { currentMood } }

    /// Keep the Link 2's own framing, gestures and AI zoom off, and our idea of
    /// the zoom matched to the lens. Called at start and every 15 s.
    func takeControl() {
        ptzQueue.async { [weak self] in
            guard let self else { return }
            let changed = hubbubbLinkCameraTakeControl()
            if changed != 0 {
                note("Hubbubb camera: took the camera back from its own %@",
                     [(1, "auto-framing"), (2, "hand gestures"), (4, "AI zoom/tracking")]
                        .filter { changed & Int32($0.0) != 0 }.map(\.1).joined(separator: ", "))
            }
            // Whatever moved the lens, start from where it really is.
            var raw = 0, mode: Int32 = 0
            if hubbubbLinkCameraDiagnostics(&raw, &mode) == 1, let range = self.zoomRange {
                let actual = 1 + CGFloat(raw - range.minimum) / CGFloat(range.maximum - range.minimum) * 3
                self.settingsLock.lock()
                let believed = self.currentZoomFactor
                self.currentZoomFactor = actual
                self.settingsLock.unlock()
                if abs(actual - believed) > 0.1 {
                    note("Hubbubb camera: lens was at %.1fx, not %.1fx; corrected", Double(actual), Double(believed))
                }
            }
        }
    }

    /// Eye and nose centres in picture coordinates -> GestureGate.turn.
    static func faceTurn(_ face: VNFaceObservation) -> CGFloat? {
        func centre(_ region: VNFaceLandmarkRegion2D?) -> CGPoint? {
            guard let points = region?.normalizedPoints, !points.isEmpty else { return nil }
            let box = face.boundingBox
            let x = points.map(\.x).reduce(0, +) / CGFloat(points.count), y = points.map(\.y).reduce(0, +) / CGFloat(points.count)
            return CGPoint(x: box.minX + x * box.width, y: box.minY + y * box.height)
        }
        guard let marks = face.landmarks, let l = centre(marks.leftEye), let r = centre(marks.rightEye),
              let n = centre(marks.noseCrest) ?? centre(marks.nose) else { return nil }
        return GestureGate.turn(leftEye: l, rightEye: r, nose: n)
    }

    /// The camera's own view of its zoom and mode, against what we believe.
    func hardware() -> [String: Any] {
        var raw = 0, mode: Int32 = -1
        let ok = ptzQueue.sync { hubbubbLinkCameraDiagnostics(&raw, &mode) } == 1
        settingsLock.lock()
        let believed = currentZoomFactor
        settingsLock.unlock()
        var factor: Double? = nil
        if ok, let range = zoomRange { factor = 1 + Double(raw - range.minimum) / Double(range.maximum - range.minimum) * 3 }
        return ["zoom_believed": believed, "zoom_actual": factor ?? NSNull(), "zoom_raw": ok ? raw : NSNull(), "video_mode": mode]
    }

    private func moodTick() {
        guard let base = moodBase else { return }
        if Date().timeIntervalSince(moodRefreshed) > 30 {
            note("Hubbubb camera: no word from Home Assistant for 30 s; ending the %@ motion", currentMood)
            return stopMood()
        }
        let o = Mood.offset(currentMood, t: Date().timeIntervalSince(moodStarted), strength: moodStrength)
        ptzQueue.async { _ = hubbubbLinkCameraPointAt(base.pan + o.pan, base.tilt + o.tilt) }
    }

    /// End any mood from the vision thread (person lost); a no-op when idle.
    private func endMood(reason: String) {
        moodQueue.async { [self] in
            guard moodTimer != nil else { return }
            note("Hubbubb camera: ending the %@ motion: %@", currentMood, reason)
            stopMood()
        }
    }

    private func stopMood() {
        moodTimer?.cancel()
        moodTimer = nil
        if let base = moodBase {
            ptzQueue.async { _ = hubbubbLinkCameraPointAt(base.pan, base.tilt) }
        }
        moodBase = nil
        currentMood = "idle"
        settingsLock.lock()
        followPausedUntil = Date().addingTimeInterval(0.5)
        settingsLock.unlock()
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
            var label = (track.name ?? "Person") + (track.facing ? " · looking" : "")
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

    private func handOverlapsFace(_ hand: VNHumanHandPoseObservation, faceBounds: CGRect, up: CGVector = Upright.vertical) -> Bool {
        let joints: [VNHumanHandPoseObservation.JointName] = [
            .wrist, .thumbCMC, .thumbMP, .thumbIP, .thumbTip,
            .indexMCP, .indexPIP, .indexDIP, .indexTip,
            .middleMCP, .middlePIP, .middleDIP, .middleTip,
            .ringMCP, .ringPIP, .ringDIP, .ringTip,
            .littleMCP, .littlePIP, .littleDIP, .littleTip
        ]
        let c = CGPoint(x: faceBounds.midX, y: faceBounds.midY)
        let points = joints.compactMap { joint -> CGPoint? in
            guard let point = try? hand.recognizedPoint(joint), point.confidence > 0.12 else { return nil }
            return Upright.point(point.location, around: c, up: up)  // hair is "above" in their frame
        }
        guard !points.isEmpty else { return false }
        // Calibration knobs, in face heights: `hairReach` above the face box,
        // `chinReach` below it.
        let defaults = UserDefaults.standard
        let head = GestureGate.head(
            Upright.rect(faceBounds, up: up),
            hair: CGFloat(defaults.object(forKey: "hairReach") as? Double ?? 0.9),
            chin: CGFloat(defaults.object(forKey: "chinReach") as? Double ?? 0.25)
        )
        return GestureGate.atHead(points, head: head)
    }

    private func applyHardwareZoom(_ factor: CGFloat) {
        guard let range = zoomRange else { return }
        let clamped = min(4, max(1, factor))
        settingsLock.lock()
        currentZoomFactor = clamped
        settingsLock.unlock()
        let rawValue = range.minimum + Int((clamped - 1) / 3 * CGFloat(range.maximum - range.minimum))
        ptzQueue.async {
            if hubbubbLinkCameraZoomSet(rawValue) != 1 { note("Hubbubb camera: the Link 2 rejected a zoom command") }
        }
    }

    /// Ease the lens toward `target`, a little each update.
    private func easeZoom(to target: CGFloat, centeredOn point: CGPoint) {
        guard zoomRange != nil else { return }
        let now = Date()
        guard now.timeIntervalSince(lastAutoZoomUpdate) > 0.20 else { return }
        lastAutoZoomUpdate = now
        settingsLock.lock()
        let enabled = autoZoomEnabled && now > followPausedUntil
        let current = currentZoomFactor
        settingsLock.unlock()
        guard enabled else { return }
        // Zooming out is always safe; zoom in only once the gimbal has them centred.
        guard target < current || (abs(point.x - 0.5) < 0.10 && abs(point.y - 0.5) < 0.12) else { return }
        // Out fast (standing up leaves a tight frame in a second), in gently.
        let nearEdge = abs(point.x - 0.5) > 0.3 || abs(point.y - 0.5) > 0.3
        let rate: CGFloat = target < current ? (nearEdge ? 0.7 : 0.35) : 0.12
        let smoothed = current + (target - current) * rate
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
            // Up or down first when that is how they left (standing up); sideways
            // only when they walked off the side.
            let rise = Gimbal.exitTilt(lastY: last.y, velocityY: velocityY)
            let direction = Gimbal.exitDirection(lastX: last.x, velocityX: velocityX)
            let sideways = rise == 0 || last.x > 0.75 || last.x < 0.25
            let jump = sideways ? Float(70 / current * 0.6) : 0
            let lift = rise * Float(43 / current * 0.6)
            note("Hubbubb camera: lost them at (%.2f, %.2f), zoom %.1f; chasing pan %+.0f° tilt %+.0f°",
                  Double(last.x), Double(last.y), Double(current), Double(direction * jump), Double(lift))
            // All the way out, whatever we believe the lens is at: finding them
            // wide is easy, and the belief can lag the lens (camera restarted).
            if autoZoom { applyHardwareZoom(1) }
            ptzQueue.async { [weak self] in
                guard let self, let position = cameraPosition() else { return }
                let target = position.pan + direction * jump
                self.searchCenter = target
                self.searchPan = target
                self.searchDirection = direction
                self.searchRaised = rise > 0
                _ = hubbubbLinkCameraPointAt(target, position.tilt + lift)
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
                // Each pass alternates seated and standing head height: the room
                // map mostly learns seated heads, and a standing one is ~15° up.
                self.searchRaised.toggle()
            }
            self.searchPan = next
            _ = hubbubbLinkCameraPointAt(next, tilt(next) + (self.searchRaised ? 15 : 0))
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
            velocityY = velocityY * 0.6 + (center.y - last.y) / now.timeIntervalSince(lastCenterTime) * 0.4
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
        return ["people": latestNames, "animals": latestAnimals, "heads": latestHeads]
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


    /// A raised, still hand that matched no gesture: keep its joints and the
    /// rule numbers (at most two a second) in ~/Library/Logs/Hubbubb Local
    /// Camera hands.jsonl, to tune the rules against real hands. Local only.
    private func recordUnrecognized(_ hand: VNHumanHandPoseObservation) {
        let now = Date()
        guard now.timeIntervalSince(lastHandRecord) > 0.5,
              let all = try? hand.recognizedPoints(.all) else { return }
        lastHandRecord = now
        var points: [String: CGPoint] = [:]
        var joints: [String: [Double]] = [:]
        for (joint, point) in all where point.confidence > 0.1 {
            let name = joint.rawValue.rawValue
            points[Self.jointNames[name] ?? name] = point.location
            joints[Self.jointNames[name] ?? name] = [Double(point.location.x), Double(point.location.y), Double(point.confidence)]
        }
        let line: [String: Any] = ["ts": now.timeIntervalSince1970, "joints": joints, "measures": HandShape.measures(points)]
        guard let data = try? JSONSerialization.data(withJSONObject: line) else { return }
        logQueue.async {
            let url = FileManager.default.urls(for: .libraryDirectory, in: .userDomainMask)[0]
                .appendingPathComponent("Logs/Hubbubb Local Camera hands.jsonl")
            if let handle = try? FileHandle(forWritingTo: url) {
                handle.seekToEndOfFile()
                handle.write(data + Data("\n".utf8))
                try? handle.close()
            } else {
                try? (data + Data("\n".utf8)).write(to: url)
            }
        }
    }
    private var lastHandRecord = Date.distantPast
    // Taught gestures, and a teaching in progress (under settingsLock).
    private var templates = GestureTemplates.load()
    private var teaching: String?
    private var teachSamples: [[Double]] = []
    private let teachTarget = 25
    // Vision's joint keys -> the names HandShape uses.
    private static let jointNames: [String: String] = [
        "VNHLKWRI": "wrist", "VNHLKTTIP": "thumbTip", "VNHLKTIP": "thumbIP", "VNHLKTMP": "thumbMP", "VNHLKTCMC": "thumbCMC",
        "VNHLKITIP": "indexTip", "VNHLKIDIP": "indexDIP", "VNHLKIPIP": "indexPIP", "VNHLKIMCP": "indexMCP",
        "VNHLKMTIP": "middleTip", "VNHLKMDIP": "middleDIP", "VNHLKMPIP": "middlePIP", "VNHLKMMCP": "middleMCP",
        "VNHLKRTIP": "ringTip", "VNHLKRDIP": "ringDIP", "VNHLKRPIP": "ringPIP", "VNHLKRMCP": "ringMCP",
        "VNHLKPTIP": "littleTip", "VNHLKPDIP": "littleDIP", "VNHLKPPIP": "littlePIP", "VNHLKPMCP": "littleMCP",
    ]

    private func classifyGesture(_ observation: VNHumanHandPoseObservation) -> String? {
        func point(_ joint: VNHumanHandPoseObservation.JointName) -> VNRecognizedPoint? {
            try? observation.recognizedPoint(joint)
        }
        // Calibration knob: how sure Vision must be of every finger joint. A
        // hand around a phone or in the dog's fur is mostly guessed joints.
        let handConfidence = Float(UserDefaults.standard.object(forKey: "handConfidence") as? Double ?? 0.25)

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
                .allSatisfy({ $0.confidence > handConfidence }) else {
            fingersUnclear = true
            return nil
        }

        let joints: [VNHumanHandPoseObservation.JointName: String] = [
            .wrist: "wrist", .thumbTip: "thumbTip", .thumbIP: "thumbIP", .thumbMP: "thumbMP",
            .indexTip: "indexTip", .indexPIP: "indexPIP", .indexMCP: "indexMCP",
            .middleTip: "middleTip", .middlePIP: "middlePIP", .middleMCP: "middleMCP",
            .ringTip: "ringTip", .ringPIP: "ringPIP", .ringMCP: "ringMCP",
            .littleTip: "littleTip", .littlePIP: "littlePIP", .littleMCP: "littleMCP",
        ]
        var points: [String: CGPoint] = [:]
        for (joint, name) in joints {
            if let found = point(joint), found.confidence > 0.1 { points[name] = found.location }
        }
        // Shapes are judged by the room's up, whatever the body is doing: lying
        // down, people still point a thumb at the ceiling or the floor.
        return shape(points)
    }

    /// Taught samples first; the rules only speak for gestures nobody taught.
    private func shape(_ points: [String: CGPoint]) -> String? {
        let limit = UserDefaults.standard.object(forKey: "gestureMatch") as? Double ?? 0.35
        if let taught = templates.match(points, within: limit) { return taught }
        let ruled = HandShape.classify(points)
        return ruled.flatMap { templates.samples[$0] == nil ? $0 : nil }
    }

    // MARK: - Teaching gestures

    /// Start collecting samples of `gesture` from the next raised hand.
    func beginTeaching(_ gesture: String) {
        settingsLock.lock()
        teaching = gesture
        teachSamples = []
        settingsLock.unlock()
    }

    func forgetTeaching(_ gesture: String) -> Bool {
        settingsLock.lock()
        let removed = templates.samples.removeValue(forKey: gesture) != nil
        let snapshot = templates
        settingsLock.unlock()
        if removed { try? snapshot.save() }
        return removed
    }

    /// Taught gestures and their sample counts, and any teaching in progress.
    func gestureTraining() -> [String: Any] {
        settingsLock.lock()
        defer { settingsLock.unlock() }
        return [
            "taught": templates.samples.mapValues(\.count),
            "teaching": teaching.map { ["gesture": $0, "samples": teachSamples.count, "target": teachTarget] } ?? NSNull(),
        ]
    }

    /// One raised hand while teaching: keep a sample. -> a status line.
    private func teach(_ hand: VNHumanHandPoseObservation) -> String? {
        settingsLock.lock()
        let gesture = teaching
        settingsLock.unlock()
        guard let gesture else { return nil }
        var points: [String: CGPoint] = [:]
        if let all = try? hand.recognizedPoints(.all) {
            for (joint, point) in all where point.confidence > 0.1 {
                points[Self.jointNames[joint.rawValue.rawValue] ?? joint.rawValue.rawValue] = point.location
            }
        }
        guard let vector = HandVector.make(points) else { return "Teaching \(gestureTitle(gesture)): show your whole hand to the camera." }
        settingsLock.lock()
        teachSamples.append(vector)
        let count = teachSamples.count
        var done = false
        if count >= teachTarget {
            templates.samples[gesture] = teachSamples
            teaching = nil
            teachSamples = []
            done = true
        }
        let snapshot = templates
        settingsLock.unlock()
        if done {
            try? snapshot.save()
            note("Hubbubb camera: taught %@ (%d samples)", gesture, count)
            return "Learned \(gestureTitle(gesture)). It will be recognized from your own hand now."
        }
        return "Teaching \(gestureTitle(gesture)): \(count)/\(teachTarget). Keep holding it, move it a little."
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
