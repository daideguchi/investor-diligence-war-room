import { chromium } from 'playwright';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import http from 'node:http';
import fs from 'node:fs/promises';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.webm': 'video/webm',
};

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || '/', 'http://localhost');
  const relative = url.pathname === '/' ? '/index.html' : url.pathname;
  const filePath = path.normalize(path.join(root, relative));
  if (!filePath.startsWith(root)) {
    res.writeHead(403);
    res.end('forbidden');
    return;
  }
  try {
    const body = await fs.readFile(filePath);
    res.writeHead(200, { 'content-type': contentTypes[path.extname(filePath)] || 'text/plain' });
    res.end(body);
  } catch {
    res.writeHead(404);
    res.end('not found');
  }
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const { port } = server.address();

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1600 }, deviceScaleFactor: 1 });

try {
  await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Build Diligence Memo' }).click();

  const title = await page.locator('h1').innerText();
  if (title !== 'Investor Diligence War Room') {
    throw new Error(`unexpected title: ${title}`);
  }

  const memo = await page.locator('#memo').innerText();
  for (const marker of ['Evidence Score Guardrail', 'Evidence Receipts', 'Assumptions To Verify', 'Red Flags', 'Next Investor Questions', 'Claim Boundary']) {
    if (!memo.includes(marker)) {
      throw new Error(`memo missing marker: ${marker}`);
    }
  }

  const guardrail = await page.locator('#guardrailText').innerText();
  if (!guardrail.includes('capped') || !guardrail.includes('evidence mode')) {
    throw new Error(`unexpected guardrail text: ${guardrail}`);
  }

  const body = await page.locator('body').innerText();
  if (!body.includes('One-Sentence Pitch') || !body.includes('judge hook') || !body.includes('speed does not become overconfidence')) {
    throw new Error('missing one-sentence judge hook');
  }

  const cards = await page.locator('.card').count();
  if (cards < 10) {
    throw new Error(`not enough cards: ${cards}`);
  }

  const aiProof = await page.locator('#aiProofText').innerText();
  if (!aiProof.includes('Live call: yes') || !aiProof.includes('does not prove investment advice')) {
    throw new Error('AI proof did not load expected claim boundary');
  }

  await page.getByRole('button', { name: '日本語' }).click();
  await page.waitForFunction(() => document.querySelector('#aiProofText')?.innerText.includes('ライブ呼び出し'));
  const japaneseBody = await page.locator('body').innerText();
  if (!japaneseBody.includes('投資デューデリジェンス司令室') || !japaneseBody.includes('速さが過信に変わらない')) {
    throw new Error('Japanese UI toggle failed');
  }
  for (const marker of ['証拠スコアの安全装置', 'メモのみ', 'リスク 1', '次に聞く投資家質問', '主張の境界', 'ライブ呼び出し']) {
    if (!japaneseBody.includes(marker)) {
      throw new Error(`Japanese dynamic UI missing marker: ${marker}`);
    }
  }
  for (const leaked of ['Evidence Score Guardrail', 'notes only', 'Next Investor Questions', 'Raw score ', 'Live call:']) {
    if (japaneseBody.includes(leaked)) {
      throw new Error(`Japanese UI leaked English dynamic text: ${leaked}`);
    }
  }

  await page.screenshot({ path: path.join(root, 'media', 'investor-diligence-war-room-full.png'), fullPage: true });
  console.log('investor_diligence_verify_ok');
  console.log(`cards=${cards}`);
  console.log('screenshot=media/investor-diligence-war-room-full.png');
} finally {
  await browser.close();
  server.close();
}
