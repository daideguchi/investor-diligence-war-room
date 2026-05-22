import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs/promises';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const appPath = `file://${path.join(root, 'index.html')}`;
const videoDir = path.join(root, 'media', 'demo-video-raw');
const finalVideo = path.join(root, 'media', 'investor-diligence-war-room-demo.webm');

await fs.rm(videoDir, { recursive: true, force: true });
await fs.mkdir(videoDir, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1440, height: 1080 },
  recordVideo: {
    dir: videoDir,
    size: { width: 1440, height: 1080 },
  },
});
const page = await context.newPage();
await page.goto(appPath);
await page.waitForSelector('#buildBtn');
await page.waitForTimeout(800);

await page.fill('#company', 'Shiproom OS');
await page.fill('#website', 'https://github.com/daideguchi/shiproom-os');
await page.selectOption('#stage', 'seed');
await page.fill('#market', 'AI launch governance');
await page.fill(
  '#notes',
  'Team built a launch governance room for AI teams that need proof checklists, human approval, fallback planning, and public release packets. Early signal is strong for solo builders and small AI teams. Main diligence risk is whether teams will pay before an incident or compliance requirement forces the workflow.'
);
await page.selectOption('#evidenceMode', 'public website plus notes');
await page.waitForTimeout(700);
await page.click('#buildBtn');
await page.waitForTimeout(1200);
await page.locator('#memo').scrollIntoViewIfNeeded();
await page.waitForTimeout(1800);
await page.getByRole('heading', { name: 'Evidence vs Assumptions' }).scrollIntoViewIfNeeded();
await page.waitForTimeout(1200);
await page.getByRole('heading', { name: 'Next Investor Questions' }).scrollIntoViewIfNeeded();
await page.waitForTimeout(1600);

const video = page.video();
await context.close();
await browser.close();

const rawPath = await video.path();
await fs.rm(finalVideo, { force: true });
await fs.rename(rawPath, finalVideo);
await fs.rm(videoDir, { recursive: true, force: true });

console.log('investor_diligence_demo_video_ok');
console.log(`video=${path.relative(root, finalVideo)}`);
