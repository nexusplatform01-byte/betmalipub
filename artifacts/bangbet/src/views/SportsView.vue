<template>
  <div class="page">
    <AppHeader />

    <div class="search-bar">
      <input class="search-input" type="search" :placeholder="`Search ${sportName} matches...`" v-model="query" />
    </div>

    <main>
      <SportMenu :active-name="sportName" />

      <!-- Live Matches -->
      <div class="section" v-if="liveFiltered.length">
        <div class="section-header">
          <div class="section-title">
            <span class="live-dot"></span>
            Live ({{ liveFiltered.length }})
          </div>
        </div>
        <MatchCard v-for="match in liveFiltered" :key="match.id" :match="match" />
      </div>

      <!-- Loading skeleton -->
      <template v-if="loading">
        <MatchCardSkeleton v-for="n in 5" :key="n" />
      </template>

      <!-- Upcoming by League (paginated) -->
      <template v-else>
        <div v-if="filteredGroups.length === 0 && !liveFiltered.length" class="empty-state">
          <div class="empty-state__icon">🔍</div>
          <p>No {{ sportName }} matches found</p>
        </div>

        <div class="section" v-for="lg in filteredGroups" :key="lg.id">
          <div class="section-header">
            <div class="section-title">{{ lg.flag }} {{ lg.name }} <span class="section-count">({{ lg.matches.length }})</span></div>
          </div>
          <MatchCard v-for="match in lg.matches" :key="match.id" :match="match" />
        </div>

        <!-- Infinite scroll sentinel -->
        <div ref="sentinelEl" class="scroll-sentinel"></div>

        <!-- Load More button (fallback / manual trigger) -->
        <div v-if="hasMore || loadingMore" class="load-more-wrap">
          <button class="load-more-btn" :disabled="loadingMore" @click="loadMore">
            <span v-if="loadingMore" class="load-more-btn__inner">
              <span class="lm-spinner"></span>
              <span>Loading matches…</span>
            </span>
            <span v-else class="load-more-btn__inner">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
              Load More Matches
            </span>
          </button>
        </div>

        <!-- End of matches -->
        <div v-else-if="filteredGroups.length > 0" class="end-note">
          <span class="end-note__icon">✓</span> All {{ sportName }} matches loaded
        </div>
      </template>
    </main>

    <!-- Betslip FAB -->
    <div v-if="store.betslip.length" class="betslip-fab">
      <span class="betslip-count">{{ store.betslip.length }}</span>
      <span>Bet</span>
    </div>

    <BottomNav />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import AppHeader from "@/components/AppHeader.vue";
import BottomNav from "@/components/BottomNav.vue";
import SportMenu from "@/components/SportMenu.vue";
import MatchCard from "@/components/MatchCard.vue";
import MatchCardSkeleton from "@/components/MatchCardSkeleton.vue";
import { useAppStore } from "@/stores/app";
import { SPORT_CODE_MAP } from "@/services/topbetApi";
import { useSportMatches } from "@/composables/useSportMatches";

const route = useRoute();
const store = useAppStore();
const query = ref("");

const sportName = computed(() => (route.params.sport as string) || "Football");
const sportCode = computed(() => {
  const name = sportName.value;
  return SPORT_CODE_MAP[name] || SPORT_CODE_MAP[name.replace(/ /g, '')] || 'S';
});

const sportCodeRef = computed(() => sportCode.value);
const { leagueGroups, loading, loadingMore, hasMore, init, loadMore } = useSportMatches(sportCodeRef);

const sentinelEl = ref<HTMLElement | null>(null);
let observer: IntersectionObserver | null = null;

function setupObserver() {
  if (observer) observer.disconnect();
  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && hasMore.value && !loadingMore.value) {
        loadMore();
      }
    },
    { rootMargin: '200px' }
  );
  if (sentinelEl.value) observer.observe(sentinelEl.value);
}

onMounted(() => {
  init(sportCode.value);
  setupObserver();
});
watch(sportCode, (code) => {
  init(code);
});
watch(sentinelEl, () => setupObserver());
onUnmounted(() => observer?.disconnect());

const liveFiltered = computed(() =>
  store.liveMatches.filter((m) => {
    const matchesSport =
      m.sportCode === sportCode.value ||
      m.sport.toLowerCase() === sportName.value.toLowerCase();
    const matchesQuery =
      !query.value ||
      m.homeTeam.toLowerCase().includes(query.value.toLowerCase()) ||
      m.awayTeam.toLowerCase().includes(query.value.toLowerCase());
    return matchesSport && matchesQuery;
  })
);

const filteredGroups = computed(() => {
  if (!query.value) return leagueGroups.value;
  const q = query.value.toLowerCase();
  return leagueGroups.value
    .map((lg) => ({
      ...lg,
      matches: lg.matches.filter(
        (m) =>
          m.homeTeam.toLowerCase().includes(q) ||
          m.awayTeam.toLowerCase().includes(q) ||
          m.league.toLowerCase().includes(q),
      ),
    }))
    .filter((lg) => lg.matches.length > 0);
});
</script>

<style scoped>
.section-count {
  color: #a0a3b1;
  font-size: 12px;
  font-weight: 400;
}
.scroll-sentinel {
  height: 1px;
  width: 100%;
}

.load-more-wrap {
  display: flex;
  justify-content: center;
  padding: 20px 16px 28px;
}

.load-more-btn {
  position: relative;
  background: linear-gradient(135deg, #c026d3, #a21caf);
  color: #fff;
  border: none;
  border-radius: 50px;
  padding: 0;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  min-width: 200px;
  box-shadow: 0 4px 16px rgba(192, 38, 211, 0.35);
  transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
  overflow: hidden;
}
.load-more-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 22px rgba(192, 38, 211, 0.45);
}
.load-more-btn:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 2px 10px rgba(192, 38, 211, 0.3);
}
.load-more-btn:disabled {
  cursor: default;
  background: linear-gradient(135deg, #d580e0, #c059c9);
  box-shadow: none;
}
.load-more-btn__inner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 13px 28px;
}

.lm-spinner {
  width: 16px;
  height: 16px;
  border: 2.5px solid rgba(255, 255, 255, 0.35);
  border-top-color: #fff;
  border-radius: 50%;
  animation: lm-spin 0.7s linear infinite;
  flex-shrink: 0;
}
@keyframes lm-spin { to { transform: rotate(360deg); } }

.end-note {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 12px;
  color: #9ca3af;
  padding: 20px 16px 28px;
}
.end-note__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  background: #d1fae5;
  color: #059669;
  border-radius: 50%;
  font-size: 10px;
  font-weight: 900;
  flex-shrink: 0;
}
.empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 50px 20px; gap: 10px; }
.spinner { width: 28px; height: 28px; border: 3px solid #e6e7eb; border-top-color: #c026d3; border-radius: 50%; animation: spin .7s linear infinite; }
</style>
