// Generates the app icon set from the brand logo.
//
// The full lockup is a wide wordmark (859x538) that turns to mush at 32px, so
// the icon crops the one element that already reads as a self-contained mark:
// the "O" of TOGETHER, a gold arc over a black ring. It is near-square in the
// source art, so cropping it needs no distortion.
//
// Run: node scripts/generate-icons.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import sharp from 'sharp';

const CREAM = { r: 0xf5, g: 0xf0, b: 0xe8, alpha: 1 };

// Measured from the source art: the O glyph occupies 143x142 at (291, 646).
// Extract exactly that box — widening the crop instead would pull in the
// neighbouring "T" — then pad with cream for breathing room inside the tile.
const GLYPH = { x: 291, y: 646, w: 143, h: 142 };
const PAD = 18;
const crop = { left: GLYPH.x, top: GLYPH.y, width: GLYPH.w, height: GLYPH.h };

const logoSvg = readFileSync('public/tt-logo.svg', 'utf8');
const sourcePng = Buffer.from(logoSvg.match(/base64,([A-Za-z0-9+/=]+)/)[1], 'base64');

// Build the padded square master in its own pass. sharp applies `extend` after
// `resize` within a single pipeline, so padding and scaling cannot be chained
// here — doing so pads the already-shrunk glyph and inflates the tile.
const side = Math.max(GLYPH.w, GLYPH.h) + PAD * 2;
const master = await sharp(sourcePng)
  .extract(crop)
  .flatten({ background: CREAM })
  .extend({
    top: PAD + Math.round((side - PAD * 2 - GLYPH.h) / 2),
    bottom: PAD + Math.round((side - PAD * 2 - GLYPH.h) / 2),
    left: PAD + Math.round((side - PAD * 2 - GLYPH.w) / 2),
    right: PAD + Math.round((side - PAD * 2 - GLYPH.w) / 2),
    background: CREAM,
  })
  .png()
  .toBuffer();

/** The mark on cream, so it stays legible against light and dark browser tabs. */
function tile(size) {
  return sharp(master)
    .resize(size, size, { fit: 'contain', background: CREAM })
    // Next's ICO decoder rejects non-RGBA PNG entries, and flatten() drops the
    // alpha channel — put it back before encoding.
    .ensureAlpha()
    .png()
    .toBuffer();
}

/** ICO container wrapping PNG entries — supported by every browser in use. */
function buildIco(entries) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(entries.length, 4);

  let offset = 6 + entries.length * 16;
  const dir = [];
  for (const { size, data } of entries) {
    const e = Buffer.alloc(16);
    e[0] = size >= 256 ? 0 : size; // 0 means 256
    e[1] = size >= 256 ? 0 : size;
    e[2] = 0; // palette
    e[3] = 0; // reserved
    e.writeUInt16LE(1, 4); // color planes
    e.writeUInt16LE(32, 6); // bits per pixel
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    dir.push(e);
    offset += data.length;
  }
  return Buffer.concat([header, ...dir, ...entries.map((e) => e.data)]);
}

const icoSizes = [16, 32, 48];
const icoEntries = await Promise.all(
  icoSizes.map(async (size) => ({ size, data: await tile(size) })),
);
writeFileSync('src/app/favicon.ico', buildIco(icoEntries));

// Next serves these via the app-icons file convention; apple-icon wants 180px.
writeFileSync('src/app/icon.png', await tile(512));
writeFileSync('src/app/apple-icon.png', await tile(180));

console.log(`favicon.ico (${icoSizes.join('/')}), icon.png (512), apple-icon.png (180)`);
