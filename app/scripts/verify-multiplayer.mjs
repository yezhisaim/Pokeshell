/**
 * Two isolated browser contexts (no shared BroadcastChannel, like two machines)
 * join the same mission through the relay: doc edits, chat and presence must
 * cross between them.
 *
 *   npm run dev   # in another shell
 *   node scripts/verify-multiplayer.mjs
 */
import { chromium } from 'playwright'

const BASE = process.env.BASE ?? 'http://localhost:5173'
const problems = []
const ok = (t) => console.log(`  ✓ ${t}`)
const bad = (t) => {
  problems.push(t)
  console.log(`  ✗ ${t}`)
}

const browser = await chromium.launch()

async function player(name) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const p = await ctx.newPage()
  p.on('pageerror', (e) => bad(`${name} pageerror: ${e}`))
  await p.goto(BASE, { waitUntil: 'networkidle' })
  await p.getByRole('button', { name: /enter the session/i }).click()
  await p.getByRole('button', { name: /join session/i }).first().click()
  await p.locator('#join-name').fill(name)
  await p.locator('#join-code').fill('123456789')
  await p.getByRole('dialog').getByRole('button', { name: /^join session$/i }).click()
  await p.getByRole('button', { name: /^Missions/ }).click()
  await p.locator('.mission').first().getByRole('button').last().click()
  await p.locator('[contenteditable="true"]').first().waitFor()
  return p
}

const doc = (p) => p.locator('[contenteditable="true"]').first()
const until = async (fn, ms = 6000) => {
  const end = Date.now() + ms
  while (Date.now() < end) {
    if (await fn()) return true
    await new Promise((r) => setTimeout(r, 150))
  }
  return false
}

console.log('\n▸ two machines, one mission')
const [a, b] = await Promise.all([player('Alice'), player('Bob')])

if (await until(async () => ((await doc(a).innerText()).length > 50) && (await doc(a).innerText()) === (await doc(b).innerText())))
  ok('both rooms converge on one seeded document (no duplicate seed)')
else bad('documents did not converge')

const lenA = (await doc(a).innerText()).length
await doc(a).click()
await a.keyboard.press('Control+End')
await a.keyboard.type(' ALICE-PROBE')
if (await until(async () => (await doc(b).innerText()).includes('ALICE-PROBE'))) ok('Alice edit reached Bob')
else bad('Alice edit never reached Bob')

await doc(b).click()
await b.keyboard.press('Control+Home')
await b.keyboard.type('BOB-PROBE ')
if (await until(async () => (await doc(a).innerText()).includes('BOB-PROBE'))) ok('Bob edit reached Alice')
else bad('Bob edit never reached Alice')

const [ta, tb] = [await doc(a).innerText(), await doc(b).innerText()]
if (ta === tb && ta.includes('ALICE-PROBE') && ta.includes('BOB-PROBE') && ta.length > lenA) ok('concurrent edits merged identically on both sides')
else bad('documents diverged after edits')

await a.locator('.composer-input, textarea').last().fill('hello from alice')
await a.keyboard.press('Enter')
if (await until(async () => (await b.locator('.mr-log, body').first().innerText()).includes('hello from alice'))) ok('chat message reached Bob')
else bad('chat message never reached Bob')

if (await until(async () => (await b.locator('[title^="Alice ·"]').count()) > 0)) ok('Bob sees Alice in presence')
else bad('presence missing')

await browser.close()
console.log(`\n${problems.length ? `✗ ${problems.length} problem(s)` : '✓ multiplayer works across isolated contexts'}`)
process.exit(problems.length ? 1 : 0)
