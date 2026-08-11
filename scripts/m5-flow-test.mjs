import { chromium } from 'playwright-core'

const CHROME = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const URL = process.env.APP_URL || 'http://localhost:5173/'

const results = []
const check = (name, ok, detail = '') => {
  results.push({ name, ok, detail })
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  [' + detail + ']' : ''}`)
}

const textOf = (locator) => locator.textContent().then((t) => t.trim())

async function assertText(locator, expected, name) {
  const t = await textOf(locator)
  check(name, t === expected, `got "${t}"`)
}

const browser = await chromium.launch({ executablePath: CHROME, headless: true })
const page = await browser.newPage()
page.on('console', (m) => {
  if (m.type() === 'error') console.log('CONSOLE ERROR:', m.text())
})

await page.goto(URL, { waitUntil: 'networkidle' })

await page.evaluate(() => {
  localStorage.setItem('sacra-doctrina:speech', '1')
  localStorage.setItem('sacra-doctrina:research', '1')
  localStorage.setItem('sacra-doctrina:muted', '1')
})
await page.reload({ waitUntil: 'networkidle' })

// ---------- OFF THE CUFF ----------
check(
  'Off-the-cuff mode active',
  (await page.getByRole('radio', { name: /Off the cuff/ }).getAttribute('aria-checked')) === 'true',
)
await page.getByText('Start 1 min timer', { exact: true }).click()
const dlg = page.getByRole('dialog')
check('Timer overlay opens', await dlg.isVisible())
check(
  'Body scroll locked while dialog open',
  (await page.evaluate(() => document.body.style.overflow)) === 'hidden',
)
await assertText(dlg.locator('.timer__phase'), 'Speech timer', 'Speech phase label')
await assertText(dlg.locator('.timer__hint'), 'Ready.', 'Idle status "Ready."')
check('Arc visible with 3 items', (await dlg.locator('.arc li').count()) === 3)
check('All arc items lit initially', (await dlg.locator('.arc li.is-hit').count()) === 3)
check(
  'Overlay Start button present',
  await dlg.getByRole('button', { name: 'Start 1 min timer' }).isVisible(),
)

await dlg.locator('.timer__buttons .btn').last().focus()
await page.keyboard.press('Tab')
check(
  'Focus traps back to first dialog button',
  await dlg.getByRole('button', { name: 'Start 1 min timer' }).evaluate((el) => el === document.activeElement),
)
check(
  'Timer dialog labelled by phase',
  (await dlg.getAttribute('aria-labelledby')) === 'timer-phase',
)

await dlg.getByRole('button', { name: 'Start 1 min timer' }).click()
await page.waitForTimeout(1200)
const timeNow = await textOf(dlg.locator('.timer__time'))
check('Countdown ticking', timeNow !== '1:00', timeNow)
await assertText(dlg.locator('.timer__hint'), 'Speak.', 'Running status "Speak."')
check(
  'Overlay primary button hidden while running',
  (await dlg.locator('.timer__buttons .btn--primary').count()) === 0,
)

const speechCompleted = await page
  .getByText('Time.', { exact: true })
  .waitFor({ timeout: 75000 })
  .then(() => true)
  .catch(() => false)
check('Speech completes to "Time."', speechCompleted)
await assertText(dlg.locator('.timer__time'), '0:00', 'Countdown reaches 0:00')
check('All arc lit at end', (await dlg.locator('.arc li.is-hit').count()) === 3)

await page.keyboard.press('Escape')
await page.waitForTimeout(200)
check('Overlay closes on ESC', (await page.getByRole('dialog').count()) === 0)
check(
  'Body scroll restored after dialog close',
  (await page.evaluate(() => document.body.style.overflow)) === '',
)
check(
  'Focus restored to CTA button',
  await page.evaluate(() => document.activeElement?.textContent?.includes('min timer')),
)
check(
  'Reel live region announces topic',
  (await page.locator('.reel .sr-only[aria-live="polite"]').count()) === 1,
)

// ---------- DEEP RESEARCH ----------
await page.getByRole('radio', { name: /Deep research/ }).click()
await page.waitForTimeout(300)
check('Category picker hidden in deep research', (await page.locator('.select').count()) === 0)
check(
  'Deep-research CTA label',
  (await page.getByText('Start 1 min research', { exact: true }).count()) === 1,
)

await page.getByText('Start 1 min research', { exact: true }).click()
const dlg2 = page.getByRole('dialog')
await assertText(dlg2.locator('.timer__phase'), 'Research timer', 'Research phase label')
await assertText(dlg2.locator('.timer__hint'), 'Research.', 'Research idle status')

await dlg2.getByRole('button', { name: 'Start 1 min research' }).click()
await page.waitForTimeout(800)
await assertText(dlg2.locator('.timer__hint'), 'Researching.', 'Research running status')
check(
  '"Done researching" button present',
  await dlg2.getByRole('button', { name: 'Done researching' }).isVisible(),
)

await dlg2.getByRole('button', { name: 'Done researching' }).click()
await assertText(dlg2.locator('.timer__phase'), 'Ready to speak', 'Ready phase after research')
await assertText(dlg2.locator('.timer__hint'), 'Ready to speak.', 'Ready status')
check('"Up next" shown', await dlg2.getByText('Up next: 1 min to speak.').isVisible())
check('Arc hidden in ready stage', (await dlg2.locator('.arc').count()) === 0)

await dlg2.getByRole('button', { name: /ready to speak/ }).click()
await page.waitForTimeout(800)
await assertText(dlg2.locator('.timer__hint'), 'Speak.', 'Deep-research speech running')
await assertText(dlg2.locator('.timer__phase'), 'Speech timer', 'Speech phase in deep research')
check('Arc shown again in speech', (await dlg2.locator('.arc').count()) === 1)

const speechDone = await page
  .getByText('Time.', { exact: true })
  .waitFor({ timeout: 75000 })
  .then(() => true)
  .catch(() => false)
check('Deep-research speech completes to "Time."', speechDone)

// ---------- SETTINGS ----------
await page.keyboard.press('Escape')
await page.waitForTimeout(200)
await page.getByRole('button', { name: 'Settings' }).click()
const sdlg = page.getByRole('dialog', { name: 'Settings' })
check('Settings dialog opens', await sdlg.isVisible())
check(
  'Speech slider reflects 1',
  (await sdlg.locator('.field input[type="range"]').first().inputValue()) === '1',
)
await sdlg.locator('.field input[type="range"]').first().fill('2')
check(
  'Speech label updates to 2 min',
  (await textOf(sdlg.locator('.field__label').first())).includes('2 min'),
)
await sdlg.locator('.field input[type="range"]').nth(1).fill('2')
check(
  'Research label updates to 2 min',
  (await textOf(sdlg.locator('.field__label').nth(1))).includes('2 min'),
)
await sdlg.getByRole('button', { name: 'Done' }).click()
await page.waitForTimeout(200)
check('Settings dialog closed', (await page.getByRole('dialog', { name: 'Settings' }).count()) === 0)
check(
  'Persisted speech=2',
  (await page.evaluate(() => localStorage.getItem('sacra-doctrina:speech'))) === '2',
)
check(
  'Persisted research=2',
  (await page.evaluate(() => localStorage.getItem('sacra-doctrina:research'))) === '2',
)
check(
  'CTA now shows 2 min',
  (await page.getByText('Start 2 min research', { exact: true }).count()) === 1,
)

const fails = results.filter((r) => !r.ok)
console.log(`\n${results.length - fails.length}/${results.length} checks passed`)
await browser.close()
process.exit(fails.length ? 1 : 0)
