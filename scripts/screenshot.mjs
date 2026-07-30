// Dev-only helper: screenshots pages at a few widths so layout can be reviewed
// without a browser. Not part of the build.
//
// Run: node scripts/screenshot.mjs [baseUrl]
import { chromium } from 'playwright';

const base = process.argv[2] ?? 'http://localhost:3000';
const shots = [
  { name: 'home-desktop', path: '/', width: 1440, height: 1100 },
  { name: 'home-mobile', path: '/', width: 390, height: 900 },
  { name: 'episodes-desktop', path: '/episodes', width: 1440, height: 900 },
  { name: 'about-desktop', path: '/about', width: 1440, height: 900 },
];

const browser = await chromium.launch();
for (const shot of shots) {
  const page = await browser.newPage({
    viewport: { width: shot.width, height: shot.height },
    deviceScaleFactor: 1,
  });
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));

  const res = await page.goto(base + shot.path, { waitUntil: 'networkidle' });
  // Let entrance animations settle so the capture is the resting state.
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `shots/${shot.name}.png`, fullPage: true });

  console.log(`${shot.name}: ${res.status()}${errors.length ? ` errors=${JSON.stringify(errors)}` : ''}`);
  await page.close();
}
await browser.close();
