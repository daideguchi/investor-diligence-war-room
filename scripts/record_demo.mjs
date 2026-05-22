import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs/promises';
import http from 'http';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const videoDir = path.join(root, 'media', 'demo-video-raw');
const finalVideo = path.join(root, 'media', 'investor-diligence-war-room-demo.webm');
const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.webm': 'video/webm',
};

await fs.rm(videoDir, { recursive: true, force: true });
await fs.mkdir(videoDir, { recursive: true });

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

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1440, height: 1080 },
  recordVideo: {
    dir: videoDir,
    size: { width: 1440, height: 1080 },
  },
});
const page = await context.newPage();
await page.goto(`http://127.0.0.1:${port}/`);
await page.waitForSelector('#buildBtn');
await page.waitForTimeout(5000);

await page.fill('#company', 'Shiproom OS');
await page.fill('#website', 'https://github.com/daideguchi/shiproom-os');
await page.selectOption('#stage', 'seed');
await page.fill('#market', 'AI launch governance');
await page.waitForTimeout(2500);
await page.fill(
  '#notes',
  'Team built a launch governance room for AI teams that need proof checklists, human approval, fallback planning, and public release packets. Early signal is strong for solo builders and small AI teams. Main diligence risk is whether teams will pay before an incident or compliance requirement forces the workflow.'
);
await page.selectOption('#evidenceMode', 'public website plus notes');
await page.waitForTimeout(3500);
await page.click('#buildBtn');
await page.waitForTimeout(6500);
await page.getByRole('heading', { name: 'Evidence vs Assumptions' }).scrollIntoViewIfNeeded();
await page.waitForTimeout(6500);
await page.getByRole('heading', { name: 'Risk Map' }).scrollIntoViewIfNeeded();
await page.waitForTimeout(5000);
await page.getByRole('heading', { name: 'Next Investor Questions' }).scrollIntoViewIfNeeded();
await page.waitForTimeout(6500);
await page.locator('#memo').scrollIntoViewIfNeeded();
await page.waitForTimeout(9000);
await page.getByRole('heading', { name: 'AI Proof' }).scrollIntoViewIfNeeded();
await page.waitForTimeout(9000);

const video = page.video();
await context.close();
await browser.close();
server.close();

const rawPath = await video.path();
await fs.rm(finalVideo, { force: true });
await fs.rename(rawPath, finalVideo);
await fs.rm(videoDir, { recursive: true, force: true });

console.log('investor_diligence_demo_video_ok');
console.log(`video=${path.relative(root, finalVideo)}`);
