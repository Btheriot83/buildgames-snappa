import { chromium } from 'playwright'
import { mkdirSync, statSync } from 'fs'
import { dirname } from 'path'
const url = process.argv[2]
const out = process.argv[3]
const waitMs = Number(process.argv[4] || 900)
mkdirSync(dirname(out), { recursive: true })
const browser = await chromium.launch({
  headless: true,
  args: ['--no-sandbox','--disable-dev-shm-usage','--disable-gpu','--disable-extensions'],
})
const page = await browser.newPage({ viewport: { width: 1100, height: 720 } })
await page.route('**/*.{woff,woff2,ttf,otf}', (r) => r.abort())
await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 25000 })
await page.waitForTimeout(waitMs)
await page.evaluate(() => {
  document.querySelectorAll('video').forEach((v) => { try { v.pause(); v.removeAttribute('src'); v.load(); } catch {} })
})
await page.screenshot({ path: out, animations: 'disabled', timeout: 12000 })
await browser.close()
console.log('wrote', out, statSync(out).size)
