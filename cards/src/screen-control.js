// Map taps through object-fit: contain. Ignore taps in the letterbox bars.
export function screenPoint(rect, width, height, clientX, clientY) {
  if (!(width > 0 && height > 0 && rect.width > 0 && rect.height > 0)) return null;
  const scale = Math.min(rect.width / width, rect.height / height);
  const w = width * scale, h = height * scale;
  const x = (clientX - rect.left - (rect.width - w) / 2) / w;
  const y = (clientY - rect.top - (rect.height - h) / 2) / h;
  return x >= 0 && x <= 1 && y >= 0 && y <= 1 ? { x, y } : null;
}

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

export function screenFieldAt(fields, point) {
  return Array.isArray(fields) && fields.some(f =>
    point.x >= f.x && point.x <= f.x + f.width &&
    point.y >= f.y && point.y <= f.y + f.height);
}

export function screenKeyboardPose(canvas, viewport, image, point, zoom) {
  const scale = Math.min(canvas.width / image.width, canvas.height / image.height);
  const x = (canvas.width - image.width * scale) / 2 + point.x * image.width * scale;
  const y = (canvas.height - image.height * scale) / 2 + point.y * image.height * scale;
  return {
    x: clamp(viewport.width / 2 - x * zoom, Math.min(0, viewport.width - canvas.width * zoom), 0),
    y: clamp(viewport.height / 2 - y * zoom, Math.min(0, viewport.height - canvas.height * zoom), 0),
    z: zoom,
  };
}

// All coordinates are local to the screen viewport. A gesture that ever
// pinched, dragged or was cancelled can never become a remote click.
export class ScreenGesture {
  constructor() {
    this.pose = { x: 0, y: 0, z: 1 };
    this.points = new Map();
  }
  down(id, x, y, width, height, canvasWidth = width, canvasHeight = height) {
    this.width = width;
    this.height = height;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.pose = this.constrain(this.pose);
    if (!this.points.size) this.blocked = false;
    this.points.set(id, { x, y });
    if (this.points.size > 1) this.blocked = true;
    this.rebase();
  }
  rebase() {
    this.start = [...this.points.values()].map(p => ({ ...p }));
    this.origin = { ...this.pose };
  }
  constrain({ x, y, z }) {
    return { x: clamp(x, Math.min(0, this.width - this.canvasWidth * z), 0),
      y: clamp(y, Math.min(0, this.height - this.canvasHeight * z), 0), z };
  }
  move(id, x, y) {
    if (!this.points.has(id)) return;
    this.points.set(id, { x, y });
    const points = [...this.points.values()];
    const a = this.start[0], b = points[0], pose = this.origin;
    if (points.length >= 2) {
      const c = this.start[1], d = points[1];
      const distance = Math.hypot(c.x - a.x, c.y - a.y);
      if (distance < 1) return;
      const z = clamp(pose.z * Math.hypot(d.x - b.x, d.y - b.y) / distance, 1, 8);
      this.pose = this.constrain({
        x: (b.x + d.x) / 2 - ((a.x + c.x) / 2 - pose.x) * z / pose.z,
        y: (b.y + d.y) / 2 - ((a.y + c.y) / 2 - pose.y) * z / pose.z, z,
      });
    } else {
      const dx = b.x - a.x, dy = b.y - a.y;
      if (Math.hypot(dx, dy) > 6) this.blocked = true;
      if (this.blocked && (pose.z > 1 || this.canvasHeight > this.height || this.canvasWidth > this.width)) {
        this.pose = this.constrain({ x: pose.x + dx, y: pose.y + dy, z: pose.z });
      }
    }
  }
  up(id, cancelled = false) {
    if (!this.points.has(id)) return false;
    const tap = !cancelled && !this.blocked && this.points.size === 1;
    this.points.delete(id);
    if (this.points.size) {
      this.blocked = true;
      this.rebase();
    }
    return tap;
  }
}
