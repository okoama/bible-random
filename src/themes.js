const BASE = {
  '--bg': '#121816',
  '--bg-elev': '#1a211e',
  '--bg-hover': '#222b27',
  '--fg': '#e8eee9',
  '--fg-dim': '#9aa8a0',
  '--border': '#2a342f',
  '--ring-track': 'rgba(255, 255, 255, 0.08)',
}

export const THEMES = {
  sanctuary: { '--accent': '#c9a96a' },
  advent: { '--accent': '#ae84e0' },
  lent: { '--accent': '#9c72d4' },
  christmas: { '--accent': '#e8ba4d' },
  easter: { '--accent': '#e8ba4d' },
  ordinary: { '--accent': '#58c08c' },
  martyr: { '--accent': '#e05c5c' },
}

export const THEME_IDS = Object.keys(THEMES)

export const THEME_LABELS = {
  sanctuary: 'Sanctuary gold (default)',
  advent: 'Advent violet',
  lent: 'Lent violet',
  christmas: 'Christmas gold',
  easter: 'Easter gold',
  ordinary: 'Ordinary green',
  martyr: 'Martyr red',
}

const SEASON_THEME = {
  advent: 'advent',
  lent: 'lent',
  christmastide: 'christmas',
  eastertide: 'easter',
  ordinary: 'ordinary',
  martyr: 'martyr',
}

const day = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate())

const offsetDays = (date, n) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() + n)

const sundayOnOrAfter = (date) => {
  const d = day(date)
  return offsetDays(d, (7 - d.getDay()) % 7)
}

function easterSunday(year) {
  const a = year % 19
  const b = Math.floor(year / 100)
  const c = year % 100
  const d = Math.floor(b / 4)
  const e = b % 4
  const f = Math.floor((b + 8) / 25)
  const g = Math.floor((b - f + 1) / 3)
  const h = (19 * a + b - d - g + 15) % 30
  const i = Math.floor(c / 4)
  const k = c % 4
  const l = (32 + 2 * e + 2 * i - h - k) % 7
  const m = Math.floor((a + 11 * h + 22 * l) / 451)
  const month = Math.floor((h + l - 7 * m + 114) / 31)
  const date = ((h + l - 7 * m + 114) % 31) + 1
  return new Date(year, month - 1, date)
}

// Notable feasts whose liturgical colour is red (martyrs, apostles).
// Month/day use 0-based months to match Date#getMonth.
const MARTYR_FEASTS = [
  { month: 5, day: 29 }, // Sts Peter & Paul
  { month: 6, day: 25 }, // St James the Apostle
  { month: 7, day: 24 }, // St Bartholomew the Apostle
  { month: 8, day: 21 }, // St Matthew the Apostle
  { month: 9, day: 28 }, // Sts Simon & Jude
  { month: 10, day: 22 }, // St Cecilia
  { month: 11, day: 26 }, // St Stephen
  { month: 11, day: 28 }, // Holy Innocents
  { month: 11, day: 30 }, // St Andrew the Apostle
]

export function liturgicalSeason(date = new Date()) {
  const d = day(date)
  const y = d.getFullYear()
  const easter = easterSunday(y)
  const ashWednesday = offsetDays(easter, -46)
  const pentecost = offsetDays(easter, 49)
  const adventStart = sundayOnOrAfter(new Date(y, 10, 27))
  const christmasEnd = sundayOnOrAfter(new Date(y, 0, 7))
  const christmas = new Date(y, 11, 25)

  if (MARTYR_FEASTS.some((f) => f.month === d.getMonth() && f.day === d.getDate())) {
    return 'martyr'
  }
  if (d >= christmas || d <= christmasEnd) return 'christmastide'
  if (d >= adventStart) return 'advent'
  if (d >= ashWednesday && d < easter) return 'lent'
  if (d >= easter && d <= pentecost) return 'eastertide'
  return 'ordinary'
}

export function resolveTheme(theme) {
  if (theme && theme !== 'auto' && THEMES[theme]) return theme
  return SEASON_THEME[liturgicalSeason()]
}

export function applyTheme(themeId) {
  const vars = { ...BASE, ...THEMES[themeId] }
  const root = document.documentElement
  for (const [key, value] of Object.entries(vars)) {
    root.style.setProperty(key, value)
  }
}
