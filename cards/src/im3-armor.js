/* One faceplate for the dock, its flying hologram, and the power-up suit.
   Coordinates are 24 x 24 so the small icon retains the same silhouette. */
export const HELMET_OUTLINE = 'M8 2.2 12 1.6 16 2.2 19.3 4.6 20 10.8 19.1 16.4 16.3 20.6 14.5 22H9.5L7.7 20.6 4.9 16.4 4 10.8 4.7 4.6Z';
export const HELMET_PLATES = [
  'M5 5 7.5 3.9 9.3 8H14.7L16.5 3.9 19 5 18.4 10.1 15 11.1H9L5.6 10.1Z',
  'M9.3 8 9.6 10.4M14.7 8 14.4 10.4',
  'M5.2 12 6.2 15.2 8.4 18.2 9.2 17.4H14.8L15.6 18.2 17.8 15.2 18.8 12',
  'M5.2 14.2 5.8 17.1 8 20 8.4 18.2M18.8 14.2 18.2 17.1 16 20 15.6 18.2',
  'M8 20 9.5 19H14.5L16 20M9.5 21H14.5',
];
export const HELMET_EYES = 'M5.6 10.9 10.6 12 10.1 12.9 6.3 12.3ZM18.4 10.9 13.4 12 13.9 12.9 17.7 12.3Z';

// Frames from reference-study/first-hq.mp4, 15.7–18.45 seconds at 24 fps.
// Keep the original suit AND its meter together: geometry, assembly and
// percentage cannot drift. The atlas is embedded so the versioned card has no separate asset request.
import armorAtlas from "./im3-armor-atlas.js";
let atlas, film;
export function prepareArmor() {
  if (!atlas && typeof Image !== 'undefined') {
    atlas = new Image();
    atlas.onload = () => {
      // Remove the recording's black field so the hologram sits directly
      // on this dashboard. Normalize cyan luminance, retaining fine wires.
      film = document.createElement('canvas');
      film.width = atlas.naturalWidth; film.height = atlas.naturalHeight;
      const c = film.getContext('2d', {willReadFrequently:true});
      c.drawImage(atlas, 0, 0);
      const pixels = c.getImageData(0, 0, film.width, film.height), d = pixels.data;
      for (let i = 0; i < d.length; i += 4) {
        const bright = Math.max(d[i], d[i+1], d[i+2]);
        const a = Math.max(0, Math.min(1, (bright-30)/95));
        // Keep the trailer's incidental upper-right controls out of the suit.
        const x = (i/4 % film.width) % 360;
        const y = Math.floor(i/4 / film.width) % 525;
        const edge = Math.min(1, x/12, (359-x)/12, y/12, (524-y)/8);
        d[i+3] = 255*a*edge*(x>316 && y<185 ? 0 : 1);
        if (bright) for (let j=0;j<3;j++) d[i+j] = d[i+j]/bright*255;
      }
      c.putImageData(pixels, 0, 0);
    };
    atlas.src = armorAtlas;
  }
}
export function drawArmorSequence(ctx, cx, cy, half, u, outro = false) {
  prepareArmor();
  if (!film) return false;
  const frame = outro ? Math.min(65, 58 + Math.floor(u * 8)) : Math.min(57, Math.floor(Math.max(0, u) * 58));
  const h = half * 1.94, w = h * 360 / 525;
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  ctx.drawImage(film, frame % 9 * 360, Math.floor(frame / 9) * 525, 360, 525,
    cx - w / 2, cy - h / 2, w, h);
  ctx.restore();
  return true;
}
