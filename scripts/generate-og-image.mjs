// Builds the 1200x630 social share card: the full logo lockup centred on cream.
// Static PNG rather than a runtime ImageResponse — the card is the same for the
// whole site, so there is nothing to render per request.
//
// Run: node scripts/generate-og-image.mjs
import { readFileSync } from 'node:fs';
import sharp from 'sharp';

const CREAM = { r: 0xf5, g: 0xf0, b: 0xe8, alpha: 1 };
const ART = { left: 201, top: 359, width: 859, height: 538 };

const logoSvg = readFileSync('public/tt-logo.svg', 'utf8');
const sourcePng = Buffer.from(logoSvg.match(/base64,([A-Za-z0-9+/=]+)/)[1], 'base64');

const lockup = await sharp(sourcePng)
  .extract(ART)
  .flatten({ background: CREAM })
  .resize({ width: 720 })
  .png()
  .toBuffer();

const info = await sharp({
  create: { width: 1200, height: 630, channels: 4, background: CREAM },
})
  .composite([{ input: lockup, gravity: 'centre' }])
  .png()
  .toFile('public/og-image.png');

console.log(`public/og-image.png ${info.width}x${info.height}`);
