import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const videoPath = path.join(__dirname, 'dist/assets/videos/BatCaverna360_BatComputerArea.mp4');
const outputPath = path.join(__dirname, 'public/assets/textures/BatCaverna360_BatComputerArea.jpg');

console.log('Extracting frame from video:', videoPath);

const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.setViewport({ width: 4096, height: 2048 });

await page.setContent(`
<!DOCTYPE html>
<html>
<head><style>body,html{margin:0;padding:0;background:#000;overflow:hidden;}</style></head>
<body>
  <video id="v" style="width:4096px;height:2048px;" muted crossorigin="anonymous"></video>
  <canvas id="c" width="4096" height="2048" style="display:none;"></canvas>
</body>
</html>
`);

// Load the video via data URL to avoid file:// cross-origin issues
const videoBuffer = fs.readFileSync(videoPath);
const videoB64 = videoBuffer.toString('base64');

const result = await page.evaluate(async (b64) => {
  const video = document.getElementById('v');
  const canvas = document.getElementById('c');
  const ctx = canvas.getContext('2d');

  // Load from data URL
  video.src = 'data:video/mp4;base64,' + b64;
  video.load();

  await new Promise((resolve, reject) => {
    video.oncanplay = resolve;
    video.onerror = reject;
    setTimeout(reject, 15000);
  });

  // Seek to 2 seconds for a nice frame
  video.currentTime = 2;
  await new Promise(resolve => {
    video.onseeked = resolve;
    setTimeout(resolve, 3000);
  });

  // Draw frame
  ctx.drawImage(video, 0, 0, 4096, 2048);
  return canvas.toDataURL('image/jpeg', 0.85);
}, videoB64);

// Save the image
const base64Data = result.replace(/^data:image\/jpeg;base64,/, '');
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, Buffer.from(base64Data, 'base64'));

console.log('✅ Frame saved to:', outputPath);
await browser.close();
