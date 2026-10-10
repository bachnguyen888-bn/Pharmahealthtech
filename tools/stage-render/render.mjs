// Render scene.html in headless Chromium (software WebGL) and save PNG/WebP outputs.
import { chromium } from 'playwright';
import fs from 'node:fs';
const [url, out, w = '1920', h = '1080'] = process.argv.slice(2);
const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const p = await b.newPage({ viewport: { width: 800, height: 450 } });
const logs = []; p.on('console', (m) => logs.push(m.type() + ': ' + m.text())); p.on('pageerror', (e) => logs.push('pageerror: ' + e.message));
const t0 = Date.now();
await p.goto(`${url}${url.includes('?') ? '&' : '?'}w=${w}&h=${h}`);
await p.waitForFunction(() => window.__done === true, null, { timeout: 300000 });
const png = await p.evaluate(() => document.querySelector('canvas').toDataURL('image/png'));
fs.writeFileSync(out, Buffer.from(png.split(',')[1], 'base64'));
console.log('rendered in', Date.now() - t0, 'ms'); if (logs.length) console.log(logs.slice(0, 10).join('\n'));
await b.close();
