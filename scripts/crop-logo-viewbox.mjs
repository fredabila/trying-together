// One-off: the exported logo SVG wraps a 1254x1254 PNG whose artwork only
// occupies a 859x538 region, leaving transparent padding on all sides. Rewrite
// the wrapper to draw the image directly and crop the viewBox to the artwork.
import { readFileSync, writeFileSync } from 'node:fs';

const SRC = 'public/tt-logo.svg';
const BOX = { x: 201, y: 359, w: 859, h: 538 };
const NATIVE = 1254;

const href = readFileSync(SRC, 'utf8').match(/xlink:href="(data:image\/png;base64,[^"]+)"/)?.[1];
if (!href) throw new Error('no embedded PNG found in ' + SRC);

writeFileSync(
  SRC,
  `<svg viewBox="${BOX.x} ${BOX.y} ${BOX.w} ${BOX.h}" width="${BOX.w}" height="${BOX.h}" fill="none" xmlns="http://www.w3.org/2000/svg">\n` +
    `<image width="${NATIVE}" height="${NATIVE}" href="${href}"/>\n` +
    `</svg>\n`,
);
console.log('cropped to', `${BOX.w}x${BOX.h}`);
