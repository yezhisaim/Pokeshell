/**
 * Browser smoke test: visits every view, captures screenshots, and fails loudly
 * on console errors, page errors, or failed requests.
 *
 *   node scripts/smoke.mjs            # against http://localhost:5173
 *   BASE=http://localhost:4173 node scripts/smoke.mjs
 */
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const BASE = process.env.BASE ?? 'http://localhost:5173'
const OUT = process.env.OUT ?? 'screenshots'
mkdirSync(OUT, { recursive: true })

const VIEWS = [
  { name: 'home', label: 'Session Home' },
  { name: 'missions', label: 'Missions' },
  { name: 'plan', label: 'Plan Board' },
  { name: 'handoff', label: 'Handoff' },
  { name: 'agent', label: 'Agent Session' },
  { name: 'review', label: 'Review' },
  { name: 'pokedex', label: 'My Pokédex' },
  { name: 'leaderboard', label: 'Leaderboard' },
]

const problems = []
const note = (where, kind, text) => {
  problems.push(`${kind.toUpperCase()} @ ${where}: ${text}`)
  console.log(`  [${kind}] ${text}`)
}

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })

page.on('console', (m) => {
  if (m.type() === 'error') note('console', 'console', m.text().slice(0, 300))
})
page.on('pageerror', (e) => note('page', 'pageerror', String(e).slice(0, 300)))
page.on('requestfailed', (r) => {
  const url = r.url()
  if (url.startsWith(BASE)) note('net', 'requestfailed', `${url} — ${r.failure()?.errorText}`)
})

console.log(`\n▸ ${BASE}`)

await page.goto(BASE, { waitUntil: 'networkidle' })

// Onboarding gate — dismiss it, it covers every view.
const enter = page.getByRole('button', { name: /enter the session/i })
if (await enter.count()) {
  await enter.click()
  await page.waitForTimeout(300)
  console.log('  dismissed onboarding')
}

for (const view of VIEWS) {
  const nav = page.getByRole('button', { name: view.label, exact: true })
  if (!(await nav.count())) {
    note('nav', 'missing', `nav item "${view.label}" not found`)
    continue
  }
  await nav.click()
  await page.waitForTimeout(450)

  const heading = await page.locator('.view-title').first().textContent().catch(() => null)
  const empty = await page.evaluate(() => document.body.innerText.trim().length)
  console.log(`  ${view.name.padEnd(12)} → "${(heading ?? '?').trim()}" (${empty} chars)`)
  if (empty < 200) note(view.name, 'blank', `view rendered only ${empty} chars`)

  await page.screenshot({ path: `${OUT}/${view.name}.png`, fullPage: true })
}

// Agent thread: send a message and confirm the agent answers.
console.log('\n▸ agent thread')
const agentNav = page.getByRole('button', { name: 'Agent Session', exact: true })
await agentNav.click()
await page.waitForTimeout(400)

const box = page.locator('.composer-input')
if (await box.count()) {
  await box.fill('map the branch overlap')
  await page.locator('.composer-send').click()
  // wait for the agent's reply to land
  await page
    .locator('.msg-assistant')
    .last()
    .waitFor({ timeout: 20000 })
    .catch(() => note('agent', 'no-reply', 'agent produced no assistant message'))
  await page.waitForTimeout(1200)

  const msgs = await page.locator('.msg-assistant').count()
  const tools = await page.locator('.agent-tool').count()
  console.log(`  assistant messages: ${msgs}, tool cards: ${tools}`)
  if (msgs === 0) note('agent', 'no-reply', 'no assistant message rendered')
  await page.screenshot({ path: `${OUT}/agent-thread.png`, fullPage: true })
} else {
  note('agent', 'no-composer', 'composer input not found')
}

// Join flow: wrong code is rejected, right code adds a teammate.
console.log('\n▸ join flow')
await page.getByRole('button', { name: /join session/i }).first().click()
await page.waitForTimeout(300)
await page.fill('#join-name', 'Smoke Tester')
await page.fill('#join-code', 'WRONG-CODE')
await page.getByRole('button', { name: /^join session$/i }).last().click()
await page.waitForTimeout(300)
const rejected = await page.getByRole('alert').count()
console.log(`  wrong code rejected: ${rejected > 0}`)
if (rejected === 0) note('join', 'no-reject', 'wrong code was not rejected')

await page.fill('#join-code', 'POKEBALL-42')
await page.getByRole('button', { name: /^join session$/i }).last().click()
await page.waitForTimeout(500)
const joined = await page.getByText('Smoke Tester').count()
console.log(`  correct code joined: ${joined > 0}`)
if (joined === 0) note('join', 'no-join', 'teammate did not appear after correct code')
await page.screenshot({ path: `${OUT}/joined.png`, fullPage: true })

await browser.close()

console.log(`\n${problems.length === 0 ? '✓ no problems found' : `✗ ${problems.length} problem(s)`}`)
for (const p of problems) console.log(`  - ${p}`)
process.exit(problems.length === 0 ? 0 : 1)