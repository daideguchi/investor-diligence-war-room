import { chromium } from 'playwright';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const pagePath = `file://${path.join(root, 'index.html')}`;

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1600 }, deviceScaleFactor: 1 });

try {
  await page.goto(pagePath, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Build Diligence Memo' }).click();

  const title = await page.locator('h1').innerText();
  if (title !== 'Investor Diligence War Room') {
    throw new Error(`unexpected title: ${title}`);
  }

  const memo = await page.locator('#memo').innerText();
  for (const marker of ['Evidence Receipts', 'Assumptions To Verify', 'Red Flags', 'Next Investor Questions', 'Claim Boundary']) {
    if (!memo.includes(marker)) {
      throw new Error(`memo missing marker: ${marker}`);
    }
  }

  const cards = await page.locator('.card').count();
  if (cards < 10) {
    throw new Error(`not enough cards: ${cards}`);
  }

  await page.screenshot({ path: path.join(root, 'media', 'investor-diligence-war-room-full.png'), fullPage: true });
  console.log('investor_diligence_verify_ok');
  console.log(`cards=${cards}`);
  console.log('screenshot=media/investor-diligence-war-room-full.png');
} finally {
  await browser.close();
}

