const BASE = 'https://www.topbet.ug'
const API = `${BASE}/restapi/offer/en`

export const SPORT_NAME_MAP: Record<string, string> = {
  S: 'Football',
  B: 'Basketball',
  T: 'Tennis',
  TT: 'Table Tennis',
  V: 'Volleyball',
  HB: 'Handball',
  SN: 'Snooker',
  E: 'Esports',
  VS: 'Virtual Sports',
  BB: 'Baseball',
  R: 'Rugby',
  F1: 'Formula 1',
  MM: 'MMA / UFC',
  BO: 'Boxing',
  IH: 'Ice Hockey',
  OR: 'Outright',
  SP: 'Special',
  GB: 'Group Betting',
  SF: 'Goalscorer',
  FL: 'Daily Special',
  SK: 'Special Basketball',
  ST: 'Special Tennis',
  EB: 'E-Basketball',
  W: 'Water Polo',
  AF: 'Am. Football',
  MO: 'Motorsport',
  CY: 'Cycling',
  BM: 'Biathlon',
  FK: 'Futsal',
  AU: 'Aussie Rules',
}

export const SPORT_CODE_MAP: Record<string, string> = {
  Football: 'S',
  Soccer: 'S',
  Basketball: 'B',
  Tennis: 'T',
  'Table Tennis': 'TT',
  Volleyball: 'V',
  Handball: 'HB',
  Snooker: 'SN',
  Esports: 'E',
  'Virtual Sports': 'VS',
  Baseball: 'BB',
  Rugby: 'R',
  'Formula 1': 'F1',
  'MMA / UFC': 'MM',
  Boxing: 'BO',
  'Ice Hockey': 'IH',
  'Water Polo': 'W',
  'Am. Football': 'AF',
  Futsal: 'FK',
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
  markets: { home: number; draw: number | null; away: number }
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

function parseOdds(betMap: any): { home: number; draw: number | null; away: number } {
  const home = (betMap?.['1']?.['NULL']?.ov ?? 1.0) as number
  const draw = (betMap?.['2']?.['NULL']?.ov ?? null) as number | null
  const away = (betMap?.['3']?.['NULL']?.ov ?? 1.0) as number
  return { home, draw, away }
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
  const nowDate = new Date().toDateString()
  const tomorrowDate = new Date(Date.now() + 86_400_000).toDateString()
  if (d.toDateString() === nowDate) return `Today ${time}`
  if (d.toDateString() === tomorrowDate) return `Tomorrow ${time}`
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

  const matches: Match[] = liveHeaders.map((h: any) => {
    const r = byId[h.id]
    const score = parseScore(h.fd)
    const sc: string = h.s || 'S'
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
      markets: { home: 1.0, draw: null, away: 1.0 },
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
