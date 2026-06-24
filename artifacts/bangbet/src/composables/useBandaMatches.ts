import { ref } from 'vue'
import { fetchHighlightsBySport, type Match, type HighlightPage } from '@/services/topbetApi'

export function useBandaMatches(sportId: number, boosted = 0) {
  const matches = ref<Match[]>([])
  const loading = ref(false)
  const loadingMore = ref(false)
  const hasMore = ref(false)
  let currentPage = 1
  let lastPage = 1

  async function load() {
    if (loading.value) return
    loading.value = true
    matches.value = []
    currentPage = 1
    try {
      const result: HighlightPage = await fetchHighlightsBySport(sportId, 1, 20, boosted)
      matches.value = result.data
      lastPage = result.lastPage
      hasMore.value = lastPage > 1
    } catch (e) {
      console.error('[useBandaMatches] load error:', e)
    } finally {
      loading.value = false
    }
  }

  async function loadMore() {
    if (loadingMore.value || !hasMore.value) return
    loadingMore.value = true
    try {
      const next = currentPage + 1
      const result: HighlightPage = await fetchHighlightsBySport(sportId, next, 20, boosted)
      matches.value.push(...result.data)
      currentPage = next
      hasMore.value = next < lastPage
    } catch (e) {
      console.error('[useBandaMatches] loadMore error:', e)
    } finally {
      loadingMore.value = false
    }
  }

  return { matches, loading, loadingMore, hasMore, load, loadMore }
}
