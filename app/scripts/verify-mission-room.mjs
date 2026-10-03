/**
 * Verifies the mission click opens the Mission Room (not the Plan Board) and
 * that the shared markdown document syncs live across two tabs.
 *
 *   node scripts/verify-mission-room.mjs
 */
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const BASE = process.env.BASE ?? 'http://localhost:5173'
const OUT = 'screenshots'
mkdirSync(OUT, { recursive: true })

const problems = []
const bad = (w, t) => {
  problems.push(`${w}: ${t}`)
  console.log(`  ✗ ${w}: ${t}`)
}
const ok = (t) => console.log(`  ✓ ${t}`)

const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })

async function openTab() {
  const p = await ctx.newPage()
  p.on('pageerror', (e) => bad('pageerror', String(e).slice(0, 160)))
  p.on('console', (m) => {
    if (m.type() === 'error') bad('console', m.text().slice(0, 160))
  })
  await p.goto(BASE, { waitUntil: 'networkidle' })
  const enter = p.getByRole('button', { name: /enter the session/i })
  if (await enter.count()) await enter.click()
  await p.waitForTimeout(300)
  return p
}

console.log('\n▸ mission click routing')
const a = await openTab()
await a.getByRole('button', { name: /^Missions/ }).click()
await a.waitForTimeout(400)

// count the cards so we know how many missions are offered
const cards = await a.locator('.mission').count()
console.log(`  mission cards: ${cards}`)
if (cards !== 8) bad('catalog', `expected exactly 8 mission tiles (5 free + 3 premium), saw ${cards}`)

// click the first mission card's action
await a.locator('.mission').first().getByRole('button').last().click()
await a.waitForTimeout(900)

const heading = (await a.locator('.view-title').first().textContent().catch(() => '')) ?? ''
console.log(`  landed on: "${heading.trim()}"`)
if (/plan board/i.test(heading)) bad('routing', 'mission click still routed to Plan Board')
else ok(`routed to "${heading.trim()}"`)

const hasEditor = await a.locator('[contenteditable="true"], textarea').count()
if (hasEditor === 0) bad('editor', 'no markdown editor in the mission room')
else ok('markdown editor present')

const hasChat = await a.locator('.composer-input, textarea, input[type="text"]').count()
console.log(`  chat inputs: ${hasChat}`)

await a.screenshot({ path: `${OUT}/mission-room.png`, fullPage: true })

console.log('\n▸ cross-tab sync')
const b = await openTab()
await b.getByRole('button', { name: /^Missions/ }).click()
await b.waitForTimeout(300)
await b.locator('.mission').first().getByRole('button').last().click()
await b.waitForTimeout(1500)

const editor = a.locator('[contenteditable="true"]').first()
if ((await editor.count()) === 0) {
  bad('sync', 'no contentEditable editor to type into')
} else {
  await editor.click()
  await a.keyboard.press('End')
  await a.keyboard.type(' ## live-sync-probe')
  await a.waitForTimeout(1400)

  const bText = await b.locator('[contenteditable="true"]').first().innerText()
  if (bText.includes('live-sync-probe')) ok('edit in tab A appeared in tab B')
  else bad('sync', `tab B did not receive the edit (got ${bText.length} chars)`)

  // and the reverse direction
  const bEditor = b.locator('[contenteditable="true"]').first()
  await bEditor.click()
  await b.keyboard.press('End')
  await b.keyboard.type(' ## reverse-probe')
  await b.waitForTimeout(1400)
  const aText = await a.locator('[contenteditable="true"]').first().innerText()
  if (aText.includes('reverse-probe')) ok('edit in tab B appeared in tab A')
  else bad('sync', 'reverse direction failed')

  await b.screenshot({ path: `${OUT}/mission-room-tab-b.png`, fullPage: true })
}

console.log('\n▸ paywall on a premium mission')
const c = await openTab()
await c.getByRole('button', { name: /^Missions/ }).click()
await c.waitForTimeout(500)
const gate = c.locator('.mission.locked').filter({ hasText: 'Pro' }).last()
const cta = gate.getByRole('button', { name: /unlock|upgrade|checkout|start trial|get pro/i })
const ctaCount = await cta.count()
const label = (await cta.first().textContent().catch(() => '')) ?? ''
console.log(`  last card action: "${label.trim()}"`)
if (ctaCount > 0) ok(`premium mission is gated with a CTA: "${label.trim()}"`)
else bad('paywall', 'premium mission has no unlock/upgrade CTA')
await c.screenshot({ path: `${OUT}/missions-paywall.png`, fullPage: true })

await browser.close()
console.log(`\n${problems.length === 0 ? '✓ all checks passed' : `✗ ${problems.length} problem(s)`}`)
for (const p of problems) console.log(`  - ${p}`)
process.exit(problems.length === 0 ? 0 : 1)