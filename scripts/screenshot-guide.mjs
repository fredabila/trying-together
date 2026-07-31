// Dev-only: screenshots the Studio's Guide tab so its layout can be reviewed.
// The Studio is a large client bundle, so the first compile can take a while.
//
// Run: node scripts/screenshot-guide.mjs [baseUrl]
import { chromium } from 'playwright';

const base = process.argv[2] ?? 'http://localhost:3000';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });

const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
page.on('console', (m) => m.type() === 'error' && errors.push(m.text().slice(0, 300)));

console.log('loading /studio/guide …');
await page.goto(`${base}/studio/guide`, { waitUntil: 'domcontentloaded', timeout: 240000 });

// Wait for the guide's own heading rather than a fixed sleep.
try {
  await page.getByText('STUDIO GUIDE').waitFor({ timeout: 180000 });
  console.log('guide mounted');
} catch {
  console.log('guide heading never appeared — capturing whatever rendered');
}
await page.waitForTimeout(2500);
await page.screenshot({ path: 'shots/guide-default.png', fullPage: false });

// Click a couple of sections to prove navigation works.
for (const label of ['Audio, players & links', 'When something looks wrong']) {
  try {
    await page.getByRole('button', { name: new RegExp(label, 'i') }).click({ timeout: 15000 });
    await page.waitForTimeout(900);
    const slug = label.toLowerCase().replace(/[^a-z]+/g, '-').replace(/^-|-$/g, '');
    await page.screenshot({ path: `shots/guide-${slug}.png`, fullPage: false });
    console.log('captured:', label);
  } catch (e) {
    console.log('could not click', label, '-', String(e).split('\n')[0]);
  }
}

// And the search box.
try {
  await page.getByPlaceholder('Search the guide…').fill('transcript');
  await page.waitForTimeout(900);
  await page.screenshot({ path: 'shots/guide-search.png', fullPage: false });
  console.log('captured: search');
} catch (e) {
  console.log('search failed -', String(e).split('\n')[0]);
}

console.log(errors.length ? `PAGE ERRORS:\n${errors.join('\n')}` : 'no page errors');
await browser.close();
