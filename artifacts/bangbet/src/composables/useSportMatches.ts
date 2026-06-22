import { ref, type Ref } from 'vue'
import { fetchSportLeagues, fetchLeagueMatches, type Match, type League } from '@/services/topbetApi'
import { leagueFlag } from '@/composables/useHomeMatches'

export interface LeagueGroup {
  id: string
  name: string
  flag: string
  count: number
  matches: Match[]
}

const BATCH_SIZE = 5

export function useSportMatches(sportCode: Ref<string>) {
  const leagueGroups = ref<LeagueGroup[]>([])
  const allLeagues = ref<League[]>([])
  const loading = ref(false)
  const loadingMore = ref(false)
  const hasMore = ref(false)
  const page = ref(0)
  const error = ref<string | null>(null)
  let currentSport = ''

  async function init(code: string) {
    if (code === currentSport && page.value > 0) return
    currentSport = code
    loading.value = true
    leagueGroups.value = []
    page.value = 0
    error.value = null
    try {
      allLeagues.value = await fetchSportLeagues(code)
      hasMore.value = allLeagues.value.length > BATCH_SIZE
      await loadBatch(code, 0)
    } catch (e) {
      error.value = String(e)
      console.error('[useSportMatches] init error:', e)
    } finally {
      loading.value = false
    }
  }

  async function loadBatch(code: string, pg: number) {
    const start = pg * BATCH_SIZE
    const batch = allLeagues.value.slice(start, start + BATCH_SIZE)
    hasMore.value = start + BATCH_SIZE < allLeagues.value.length
    if (!batch.length) return

    const results = await Promise.allSettled(
      batch.map((lg) =>
        fetchLeagueMatches(code, lg.id).then((matches) => ({
          id: lg.id,
          name: lg.name,
          flag: leagueFlag(lg.name),
          count: lg.count,
          matches,
        }))
      )
    )

    for (const r of results) {
      if (r.status === 'fulfilled' && r.value.matches.length > 0) {
        leagueGroups.value.push(r.value)
      }
    }
  }

  async function loadMore() {
    if (loadingMore.value || !hasMore.value) return
    loadingMore.value = true
    try {
      page.value++
      await loadBatch(currentSport, page.value)
    } finally {
      loadingMore.value = false
    }
  }

  async function reload(code: string) {
    currentSport = ''
    await init(code)
  }

  return { leagueGroups, loading, loadingMore, hasMore, error, init, loadMore, reload }
}
