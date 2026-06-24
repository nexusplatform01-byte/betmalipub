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

const BANDA_BASE = 'https://fx.banda.software/ug/v2'

const LIVE_STATUSES = new Set(['live', 'inprogress', 'halftime', '1st_half', '2nd_half', 'pause', 'extra_time'])

function parseBandaOutcomes(outcomes: any[]): Pick<Match['markets'], 'home' | 'draw' | 'away'> {
  const get = (alias: string): number | null => {
    const o = outcomes.find((x: any) => x.alias === alias && x.active === 1)
    return o && typeof o.odds === 'number' ? o.odds : null
  }
  return {
    home: get('1') ?? 0,
    draw: get('X'),
    away: get('2') ?? 0,
  }
}

function parseBandaDate(dateStr: string): string {
  if (!dateStr) return ''
  const d = new Date(dateStr.replace(' ', 'T') + 'Z')
  return formatKickOff(d.getTime())
}

function mapBandaItem(item: any): Match {
  const outcomes: any[] = item.highlight_market?.outcomes || []
  const markets = parseBandaOutcomes(outcomes)
  const fs = item.fixture_status || {}
  const statusName: string = fs.status_name || 'not_started'
  const isLive = LIVE_STATUSES.has(statusName)
  const homeScore = fs.home_score !== '' && fs.home_score != null ? parseInt(fs.home_score) : undefined
  const awayScore = fs.away_score !== '' && fs.away_score != null ? parseInt(fs.away_score) : undefined
  const minute = fs.event_time ? parseInt(fs.event_time) || undefined : undefined
  return {
    id: String(item.match_id),
    sport: 'Football',
    sportCode: 'S',
    league: item.tournament || '',
    leagueId: String(item.tournament_id || ''),
    leagueLogo: SPORT_ICON('S'),
    homeTeam: item.home_team || '',
    awayTeam: item.away_team || '',
    homeScore,
    awayScore,
    minute,
    isLive,
    status: statusName,
    startTime: item.date ? parseBandaDate(item.date) : undefined,
    markets: { ...markets, dc1X: undefined, dcX2: undefined, dc12: undefined },
    marketsCount: fs.markets || 0,
  }
}

async function fetchBanda(url: string): Promise<any[]> {
  const res = await fetch(url, {
    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const json = await res.json()
  return json.data || []
}

export interface BandaMarket {
  market_name: string
  market_id: number
  specifier: string
  status: number
  status_name: string
  outcomes: Array<{
    alias: string
    outcome_name: string
    outcome_id: string
    outcome_type_id: number
    odds: number
    active: number
    probability: number
  }>
  handicap: boolean
}

export async function fetchBandaMatchDetail(matchId: string): Promise<BandaMarket[]> {
  try {
    const res = await fetch(`${BANDA_BASE}/match/${matchId}`, {
      headers: { 'Accept': 'application/json' },
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const json = await res.json()
    return json.markets || []
  } catch (e) {
    console.error('[Bangbet] banda match detail error:', String(e))
    return []
  }
}

export async function fetchBoostedMatches(): Promise<Match[]> {
  try {
    const items = await fetchBanda(
      `${BANDA_BASE}/highlights/1?page=1&per_page=10&boosted=1&highlight_market_id=0&tournament_id=0&category_id=0&upcoming=0&today=0&match_live_status=0`,
    )
    return items.map(mapBandaItem)
  } catch (e) {
    console.error('[Bangbet] boosted fetch error:', String(e))
    return []
  }
}

export async function fetchLiveEvents(): Promise<{ liveSports: any[]; matches: Match[] }> {
  try {
    // Fetch currently-live matches first
    const [liveItems, todayItems] = await Promise.all([
      fetchBanda(
        `${BANDA_BASE}/highlights/1?page=1&per_page=100&boosted=0&highlight_market_id=0&tournament_id=0&category_id=0&upcoming=0&today=1&match_live_status=1`,
      ),
      fetchBanda(
        `${BANDA_BASE}/highlights/1?page=1&per_page=50&boosted=0&highlight_market_id=0&tournament_id=0&category_id=0&upcoming=0&today=1&match_live_status=0`,
      ),
    ])

    // Merge: live items first, then fill with today's highlights (deduplicated)
    const seen = new Set<string>()
    const merged: any[] = []
    for (const item of liveItems) {
      seen.add(String(item.match_id))
      merged.push(item)
    }
    for (const item of todayItems) {
      if (!seen.has(String(item.match_id))) {
        seen.add(String(item.match_id))
        merged.push(item)
      }
    }

    const matches = merged.map(mapBandaItem)
    // Sort: truly live first, then by kick-off time
    matches.sort((a, b) => {
      if (a.isLive && !b.isLive) return -1
      if (!a.isLive && b.isLive) return 1
      return 0
    })

    return { liveSports: [], matches }
  } catch (e) {
    console.error('[Bangbet] banda fetch error:', String(e))
    return { liveSports: [], matches: [] }
  }
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
