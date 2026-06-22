const BASE = 'https://www.topbet.ug'
const API = `${BASE}/restapi/offer/en`

export const SPORT_NAME_MAP: Record<string, string> = {
  S: 'Football', B: 'Basketball', T: 'Tennis', TT: 'Table Tennis',
  V: 'Volleyball', HB: 'Handball', SN: 'Snooker', E: 'Esports',
  VS: 'Virtual Sports', BB: 'Baseball', R: 'Rugby', F1: 'Formula 1',
  MM: 'MMA / UFC', BO: 'Boxing', IH: 'Ice Hockey', OR: 'Outright',
  SP: 'Special', GB: 'Group Betting', SF: 'Goalscorer', FL: 'Daily Special',
  SK: 'Special Basketball', ST: 'Special Tennis', EB: 'E-Basketball',
  W: 'Water Polo', AF: 'Am. Football', MO: 'Motorsport', FK: 'Futsal',
}

export const SPORT_CODE_MAP: Record<string, string> = {
  Football: 'S', Soccer: 'S', Basketball: 'B', Tennis: 'T',
  'Table Tennis': 'TT', Volleyball: 'V', Handball: 'HB', Snooker: 'SN',
  Esports: 'E', 'Virtual Sports': 'VS', Baseball: 'BB', Rugby: 'R',
  'Formula 1': 'F1', 'MMA / UFC': 'MM', Boxing: 'BO', 'Ice Hockey': 'IH',
  'Water Polo': 'W', 'Am. Football': 'AF', Futsal: 'FK',
}

export const SPORT_ICON = (code: string) =>
  `${BASE}/face/assets/sports-desk/sport_${code}.svg`

export interface Match {
  id: string
  sport: string
  sportCode: string
  league: string
  leagueId: string | number
  leagueLogo: string
  homeTeam: string
  awayTeam: string
  homeScore?: number
  awayScore?: number
  minute?: number
  startTime?: string
  isLive: boolean
  status?: string
  markets: {
    home: number
    draw: number | null
    away: number
    dc1X?: number | null
    dcX2?: number | null
    dc12?: number | null
    hdp?: number | null
    over?: number | null
    under?: number | null
  }
  marketsCount?: number
}

export interface SportCategory {
  id: string
  name: string
  count: number
  icon: string
}

export interface League {
  id: string
  name: string
  count: number
  sport: string
}

export interface MarketOutcome {
  label: string
  odds: number
}

export interface Market {
  name: string
  outcomes: MarketOutcome[]
}

export interface MarketGroup {
  id: string
  title: string
  open: boolean
  markets: Market[]
}

function ov(betMap: any, tt: string, sv = 'NULL'): number | null {
  const val = betMap?.[tt]?.[sv]?.ov
  return typeof val === 'number' ? val : null
}

function parseOdds(betMap: any) {
  return {
    home: ov(betMap, '1') ?? 1.0,
    draw: ov(betMap, '2'),
    away: ov(betMap, '3') ?? 1.0,
    dc1X: ov(betMap, '4'),
    dcX2: ov(betMap, '5'),
    dc12: ov(betMap, '6'),
  }
}

function parseScore(fd?: string): { home: number; away: number } {
  if (!fd) return { home: 0, away: 0 }
  const parts = fd.split(':')
  return parts.length >= 3
    ? { home: parseInt(parts[1]) || 0, away: parseInt(parts[2]) || 0 }
    : { home: 0, away: 0 }
}

export function formatKickOff(ts: number): string {
  const d = new Date(ts)
  const time = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  const now = new Date()
  const todayStr = now.toDateString()
  const tomorrowStr = new Date(Date.now() + 86_400_000).toDateString()
  if (d.toDateString() === todayStr) return `Today ${time}`
  if (d.toDateString() === tomorrowStr) return `Tomorrow ${time}`
  return (
    d.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short' }) +
    ` ${time}`
  )
}

function mapEsMatch(e: any, sportCode?: string): Match {
  const sc: string = e.sport || sportCode || 'S'
  return {
    id: String(e.id),
    sport: SPORT_NAME_MAP[sc] || sc,
    sportCode: sc,
    league: e.leagueName || '',
    leagueId: e.leagueId || '',
    leagueLogo: SPORT_ICON(sc),
    homeTeam: e.home || '',
    awayTeam: e.away || '',
    startTime: e.kickOffTime ? formatKickOff(e.kickOffTime) : undefined,
    isLive: false,
    markets: parseOdds(e.betMap),
    marketsCount: e.oddsCount,
  }
}

export async function fetchLiveEvents(): Promise<{ liveSports: any[]; matches: Match[] }> {
  const res = await fetch(`${BASE}/live/events/en`)
  const text = await res.text()
  const line = text.split('\n').find((l) => l.startsWith('data:')) || text.trim()
  const json = JSON.parse(line.replace(/^data:/, '').trim())
  const { liveSports = [], liveHeaders = [], liveResults = [] } = json

  const byId: Record<number, any> = {}
  for (const r of liveResults) byId[r.mi] = r

  // Try to fetch top-match odds for all live sports to enrich the live match list
  const liveSportCodes: string[] = [...new Set(liveHeaders.map((h: any) => h.s || 'S'))] as string[]
  const oddsById: Record<string, Match['markets']> = {}
  try {
    await Promise.all(
      liveSportCodes.map(async (sc) => {
        const topRes = await fetch(`${API}/top/desk?annex=13&sport=${sc}&locale=en`)
        const topData = await topRes.json()
        for (const e of topData.esMatches || []) {
          oddsById[String(e.id)] = parseOdds(e.betMap)
        }
      }),
    )
  } catch (_) { /* best-effort */ }

  const matches: Match[] = liveHeaders.map((h: any) => {
    const r = byId[h.id]
    const score = parseScore(h.fd)
    const sc: string = h.s || 'S'
    const enriched = oddsById[String(h.id)]
    const markets = enriched ?? (r?.bm ? parseOdds(r.bm) : null)
    return {
      id: String(h.id),
      sport: SPORT_NAME_MAP[sc] || h.sn || sc,
      sportCode: sc,
      league: h.lg || '',
      leagueId: '',
      leagueLogo: SPORT_ICON(sc),
      homeTeam: h.h || '',
      awayTeam: h.a || '',
      homeScore: score.home,
      awayScore: score.away,
      minute: r?.cm ? parseInt(r.cm) : undefined,
      isLive: true,
      status: h.ls,
      markets: markets ?? { home: 0, draw: null, away: 0 },
      marketsCount: h.mc,
    }
  })

  return { liveSports, matches }
}

export async function fetchTopMatches(sport = 'S'): Promise<Match[]> {
  const res = await fetch(`${API}/top/desk?annex=13&sport=${sport}&locale=en`)
  const data = await res.json()
  return (data.esMatches || []).map((e: any) => mapEsMatch(e, sport))
}

export async function fetchAllSports(): Promise<SportCategory[]> {
  const res = await fetch(`${API}/categories/s?annex=13&locale=en`)
  const data = await res.json()
  return (data.categories || []).map((c: any) => ({
    id: c.id as string,
    name: (SPORT_NAME_MAP[c.id] || c.name) as string,
    count: c.count as number,
    icon: SPORT_ICON(c.id),
  }))
}

export async function fetchSportLeagues(sportCode: string): Promise<League[]> {
  const res = await fetch(`${API}/categories/sport/${sportCode}/l?annex=13&locale=en`)
  const data = await res.json()
  return (data.categories || []).map((c: any) => ({
    id: String(c.id),
    name: c.name as string,
    count: c.count as number,
    sport: sportCode,
  }))
}

export async function fetchLeagueMatches(
  sportCode: string,
  leagueId: string | number,
): Promise<Match[]> {
  const res = await fetch(
    `${API}/sport/${sportCode}/league/${leagueId}/desk?annex=13&locale=en`,
  )
  const data = await res.json()
  return (data.esMatches || []).map((e: any) => mapEsMatch(e, sportCode))
}

export async function fetchMatchDetail(matchId: string): Promise<any> {
  const res = await fetch(`${API}/match/${matchId}?annex=13&locale=en`)
  return res.json()
}

export function parseMarketGroups(
  betMap: Record<string, Record<string, { ov: number }>>,
  home: string,
  away: string,
): MarketGroup[] {
  const groups: MarketGroup[] = []

  function getOv(tt: string, sv = 'NULL'): number | null {
    const v = betMap?.[tt]?.[sv]?.ov
    return typeof v === 'number' && v > 0 ? v : null
  }

  function getAll(tt: string): { sv: string; val: number }[] {
    const m = betMap[tt] || {}
    return Object.entries(m)
      .map(([sv, d]) => ({ sv, val: (d as any).ov }))
      .filter((x) => typeof x.val === 'number' && x.val > 0)
  }

  // ── 1. Match Result (1X2) ──────────────────────────────────────────────────
  const h1 = getOv('1'), d1 = getOv('2'), a1 = getOv('3')
  if (h1 && a1) {
    const outcomes: MarketOutcome[] = [{ label: '1', odds: h1 }]
    if (d1) outcomes.push({ label: 'X', odds: d1 })
    outcomes.push({ label: '2', odds: a1 })
    groups.push({ id: 'result', title: 'Match Result (1X2)', open: true, markets: [{ name: 'Full Time', outcomes }] })
  }

  // ── 2. Double Chance ──────────────────────────────────────────────────────
  const dc1x = getOv('4'), dcx2 = getOv('5'), dc12 = getOv('6')
  if (dc1x && dcx2 && dc12) {
    groups.push({
      id: 'dc', title: 'Double Chance', open: true,
      markets: [{ name: 'Double Chance', outcomes: [
        { label: '1X', odds: dc1x }, { label: 'X2', odds: dcx2 }, { label: '12', odds: dc12 },
      ]}],
    })
  }

  // ── 3. Both Teams to Score (7=Yes, 8=No) ─────────────────────────────────
  const bttsY = getOv('7'), bttsN = getOv('8')
  if (bttsY && bttsN) {
    groups.push({
      id: 'btts', title: 'Both Teams to Score', open: false,
      markets: [{ name: 'BTTS', outcomes: [{ label: 'Yes', odds: bttsY }, { label: 'No', odds: bttsN }] }],
    })
  }

  // ── 4. Total Goals / Points (227=Over, 228=Under) ─────────────────────────
  const overs = getAll('227')
  const unders = getAll('228')
  if (overs.length && unders.length) {
    const ouMap: Record<string, { o?: number; u?: number }> = {}
    overs.forEach(({ sv, val }) => { ouMap[sv] = { ...ouMap[sv], o: val } })
    unders.forEach(({ sv, val }) => { ouMap[sv] = { ...ouMap[sv], u: val } })
    const ouMarkets: Market[] = Object.entries(ouMap)
      .filter(([, v]) => v.o && v.u)
      .map(([sv, v]) => {
        const line = sv.replace('total=', '')
        return { name: `Over / Under ${line}`, outcomes: [{ label: `Over ${line}`, odds: v.o! }, { label: `Under ${line}`, odds: v.u! }] }
      })
      .sort((a, b) => {
        const av = parseFloat(a.name.replace('Over / Under ', ''))
        const bv = parseFloat(b.name.replace('Over / Under ', ''))
        return av - bv
      })
    if (ouMarkets.length) {
      groups.push({ id: 'ou', title: 'Total Goals / Points', open: true, markets: ouMarkets })
    }
  }

  // ── 5. Asian Handicap (201=Home, 202=Away) ────────────────────────────────
  const homeHcps = getAll('201')
  if (homeHcps.length) {
    const awayHcps = getAll('202')
    const awayMap: Record<string, number> = {}
    awayHcps.forEach(({ sv, val }) => { awayMap[sv] = val })
    const hcpMarkets: Market[] = homeHcps.map(({ sv, val }) => {
      const line = sv.replace('hcp=', '')
      const awayOdds = awayMap[sv]
      if (!awayOdds) return null
      return { name: `Handicap ${parseFloat(line) > 0 ? '+' : ''}${line}`, outcomes: [{ label: '1', odds: val }, { label: '2', odds: awayOdds }] }
    }).filter(Boolean) as Market[]
    if (hcpMarkets.length) {
      groups.push({ id: 'hcp', title: 'Asian Handicap', open: false, markets: hcpMarkets.slice(0, 8) })
    }
  }

  // ── 6. 1st Half Result (13=Home, 14=Draw, 15=Away) ───────────────────────
  const htH = getOv('13'), htD = getOv('14'), htA = getOv('15')
  if (htH && htA) {
    const outcomes: MarketOutcome[] = [{ label: '1', odds: htH }]
    if (htD) outcomes.push({ label: 'X', odds: htD })
    outcomes.push({ label: '2', odds: htA })
    groups.push({ id: 'ht', title: '1st Half', open: false, markets: [{ name: '1st Half Result', outcomes }] })
  }

  // ── 7. 2nd Half Result (16,17,18) ─────────────────────────────────────────
  const h2H = getOv('16'), h2D = getOv('17'), h2A = getOv('18')
  if (h2H && h2A) {
    const outcomes: MarketOutcome[] = [{ label: '1', odds: h2H }]
    if (h2D) outcomes.push({ label: 'X', odds: h2D })
    outcomes.push({ label: '2', odds: h2A })
    groups.push({ id: 'h2', title: '2nd Half', open: false, markets: [{ name: '2nd Half Result', outcomes }] })
  }

  // ── 8. Corners Over/Under (229=Over, 230=Under) ───────────────────────────
  const cornersO = getAll('229')
  const cornersU = getAll('230')
  if (cornersO.length && cornersU.length) {
    const cuMap: Record<string, { o?: number; u?: number }> = {}
    cornersO.forEach(({ sv, val }) => { cuMap[sv] = { ...cuMap[sv], o: val } })
    cornersU.forEach(({ sv, val }) => { cuMap[sv] = { ...cuMap[sv], u: val } })
    const cuMarkets: Market[] = Object.entries(cuMap)
      .filter(([, v]) => v.o && v.u)
      .map(([sv, v]) => {
        const line = sv.replace('total=', '')
        return { name: `Corners Over / Under ${line}`, outcomes: [{ label: `Over ${line}`, odds: v.o! }, { label: `Under ${line}`, odds: v.u! }] }
      })
    if (cuMarkets.length) {
      groups.push({ id: 'corners', title: 'Corners', open: false, markets: cuMarkets })
    }
  }

  // ── 9. Winner (no draw) — 2-way (for basketball etc.) ─────────────────────
  const w1 = getOv('10'), w2 = getOv('11')
  if (w1 && w2 && !h1) {
    groups.push({
      id: 'winner', title: 'Winner', open: true,
      markets: [{ name: 'Match Winner', outcomes: [{ label: home, odds: w1 }, { label: away, odds: w2 }] }],
    })
  }

  return groups
}
