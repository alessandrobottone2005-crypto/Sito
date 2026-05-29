import puppeteer from 'puppeteer';
import fs from 'fs';

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });

const logs = [];
page.on('console', msg => logs.push(msg.text()));
page.on('pageerror', err => console.log('ERROR:', err.message));

await page.goto('file:///Users/alessandrobottonedesigner/Desktop/IUAD/UI:UX%20/Esercizi/WebsiteBatmanStatue/Projects/ProvaSito/dist/index.html', { waitUntil: 'domcontentloaded' });

// Wait for intro screen
await new Promise(r => setTimeout(r, 3000));
await page.screenshot({ path: 'screenshot-intro.png' });
console.log('📸 Intro screenshot taken');

// Skip phases using the dev skip button
// Click skip button (⚡ Salta) to go to BatComputer
await page.click('button[title="Salta alla fase successiva (Dev)"]').catch(() => {
  console.log('Skip button not found, trying JS click');
});
await new Promise(r => setTimeout(r, 2000));
await page.screenshot({ path: 'screenshot-batcomputer.png' });
console.log('📸 BatComputer screenshot taken');

console.log('PANORAMA LOGS:', logs.filter(l => l.includes('[Panorama]')));

await browser.close();
console.log('Done! Check screenshot-batcomputer.png');
