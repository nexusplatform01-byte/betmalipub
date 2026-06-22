import { ref, computed, onMounted } from 'vue'
import { fetchTopMatches, type Match } from '@/services/topbetApi'

const FLAG_MAP: [string, string][] = [
  ['Premier League', '🏴󠁧󠁢󠁥󠁮󠁧󠁿'],
  ['Champions League', '🇪🇺'],
  ['Europa League', '🇪🇺'],
  ['La Liga', '🇪🇸'],
  ['Serie A', '🇮🇹'],
  ['Bundesliga', '🇩🇪'],
  ['Uganda', '🇺🇬'],
  ['World Cup', '🌍'],
  ['AFCON', '🌍'],
  ['CAF', '🌍'],
  ['Ligue 1', '🇫🇷'],
  ['NBA', '🇺🇸'],
  ['Roland Garros', '🇫🇷'],
  ['Wimbledon', '🇬🇧'],
  ['US Open', '🇺🇸'],
  ['Australian Open', '🇦🇺'],
]

export function leagueFlag(leagueName: string): string {
  const entry = FLAG_MAP.find(([k]) => leagueName.includes(k))
  return entry ? entry[1] : '⚽'
}

function leagueIncludes(m: Match, ...terms: string[]): boolean {
  const lg = m.league.toLowerCase()
  return terms.some((t) => lg.includes(t.toLowerCase()))
}

export function useHomeMatches() {
  const soccerMatches = ref<Match[]>([])
  const basketballMatches = ref<Match[]>([])
  const tennisMatchData = ref<Match[]>([])
  const volleyballMatchData = ref<Match[]>([])
  const loading = ref(true)
  const error = ref<string | null>(null)

  async function loadAll() {
    loading.value = true
    error.value = null
    try {
      const [soccer, bball, tennis, volleyball] = await Promise.all([
        fetchTopMatches('S'),
        fetchTopMatches('B'),
        fetchTopMatches('T'),
        fetchTopMatches('V').catch(() => [] as Match[]),
      ])
      soccerMatches.value = soccer
      basketballMatches.value = bball
      tennisMatchData.value = tennis
      volleyballMatchData.value = volleyball
    } catch (e) {
      error.value = String(e)
      console.error('[Bangbet] useHomeMatches error:', e)
    } finally {
      loading.value = false
    }
  }

  const wcMatches = computed(() =>
    soccerMatches.value.filter((m) =>
      leagueIncludes(m, 'world cup', 'FIFA WC', 'coupe du monde'),
    ),
  )

  const plMatches = computed(() =>
    soccerMatches.value.filter((m) =>
      leagueIncludes(m, 'premier league', 'english premier'),
    ),
  )

  const uclMatches = computed(() =>
    soccerMatches.value.filter((m) =>
      leagueIncludes(m, 'champions league', 'uefa champions', 'ucl'),
    ),
  )

  const uplMatches = computed(() =>
    soccerMatches.value.filter((m) =>
      leagueIncludes(m, 'uganda', 'upl', 'vipers', 'kcca'),
    ),
  )

  const nbaMatches = computed(() => {
    const nba = basketballMatches.value.filter((m) =>
      leagueIncludes(m, 'nba', 'national basketball association'),
    )
    const others = basketballMatches.value.filter(
      (m) => !leagueIncludes(m, 'nba', 'national basketball association'),
    )
    return [...nba, ...others].slice(0, 8)
  })

  const tennisMatches = computed(() => tennisMatchData.value.slice(0, 8))

  const volleyMatches = computed(() => volleyballMatchData.value.slice(0, 6))

  const allSoccerByLeague = computed<Record<string, Match[]>>(() => {
    const map: Record<string, Match[]> = {}
    for (const m of soccerMatches.value) {
      if (!map[m.league]) map[m.league] = []
      map[m.league].push(m)
    }
    return map
  })

  onMounted(loadAll)

  return {
    soccerMatches,
    basketballMatches,
    tennisMatchData,
    volleyballMatchData,
    wcMatches,
    plMatches,
    uclMatches,
    uplMatches,
    nbaMatches,
    tennisMatches,
    volleyMatches,
    allSoccerByLeague,
    loading,
    error,
    reload: loadAll,
  }
}
