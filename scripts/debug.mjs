import puppeteer from 'puppeteer';
import fs from 'fs';

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });

  page.on('response', response => {
    if (!response.ok()) {
      console.log('ERROR_URL:', response.url(), response.status());
    }
  });

  console.log('Navigating...');
  await page.goto('http://localhost:3002', { waitUntil: 'networkidle0' });
  await page.click('button:has-text("SKIP")').catch(() => {});
  await new Promise(r => setTimeout(r, 1000));
  await page.click('button:has-text("SKIP")').catch(() => {});
  await new Promise(r => setTimeout(r, 1000));
  await page.click('button:has-text("SKIP")').catch(() => {});
  await new Promise(r => setTimeout(r, 5000));
  
  await browser.close();
  console.log('Done.');
})();
