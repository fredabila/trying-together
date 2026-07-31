// Dev-only: verifies the mobile header actually collapses and expands.
// Measures the nav's real rendered height in both states rather than trusting
// that the CSS reads correctly.
//
// Run: node scripts/check-header.mjs [baseUrl]
import { chromium } from 'playwright';

const base = process.argv[2] ?? 'http://localhost:3000';
const browser = await chromium.launch();

for (const width of [390, 768, 1440]) {
  const page = await browser.newPage({ viewport: { width, height: 800 } });
  // 'load' rather than 'networkidle': the dev server keeps a websocket open for
  // hot reload, so networkidle never settles.
  await page.goto(base, { waitUntil: 'load', timeout: 120000 });
  await page.locator('header').first().waitFor({ timeout: 60000 });
  await page.waitForTimeout(800);

  const nav = page.locator('header nav').first();
  const toggle = page.locator('header label').first();

  const toggleVisible = await toggle.isVisible();
  const closedBox = await nav.boundingBox();
  const headerClosed = await page.locator('header').first().boundingBox();

  let openBox = null;
  let headerOpen = null;
  if (toggleVisible) {
    await toggle.click();
    await page.waitForTimeout(700);
    openBox = await nav.boundingBox();
    headerOpen = await page.locator('header').first().boundingBox();
  }

  // Does anything overflow horizontally?
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );

  console.log(
    `${width}px | hamburger=${toggleVisible ? 'yes' : 'no'} | ` +
      `nav closed=${closedBox?.height.toFixed(0)}px` +
      (openBox ? ` open=${openBox.height.toFixed(0)}px` : '') +
      ` | header ${headerClosed?.height.toFixed(0)}px` +
      (headerOpen ? `→${headerOpen.height.toFixed(0)}px` : '') +
      ` | h-overflow=${overflow}px`,
  );

  if (width === 390) {
    await page.screenshot({ path: 'shots/header-mobile-open.png' });
    if (toggleVisible) {
      await toggle.click();
      await page.waitForTimeout(700);
      await page.screenshot({ path: 'shots/header-mobile-closed.png' });
    }
  }

  await page.close();
}

await browser.close();
