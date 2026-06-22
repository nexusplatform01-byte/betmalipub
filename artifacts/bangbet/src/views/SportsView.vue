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
      <div v-if="loading" class="empty-state">
        <div class="spinner"></div>
        <p>Loading {{ sportName }} matches…</p>
      </div>

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

        <!-- Load More -->
        <div v-if="hasMore" class="load-more-wrap">
          <button class="load-more-btn" :disabled="loadingMore" @click="loadMore">
            <span v-if="loadingMore" class="spinner-sm"></span>
            <span v-else>Load More Matches</span>
          </button>
        </div>

        <!-- End of matches -->
        <div v-else-if="filteredGroups.length > 0" class="end-note">
          All {{ sportName }} matches loaded
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
import { computed, ref, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import AppHeader from "@/components/AppHeader.vue";
import BottomNav from "@/components/BottomNav.vue";
import SportMenu from "@/components/SportMenu.vue";
import MatchCard from "@/components/MatchCard.vue";
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

onMounted(() => init(sportCode.value));
watch(sportCode, (code) => init(code));

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
.load-more-wrap {
  display: flex;
  justify-content: center;
  padding: 16px;
}
.load-more-btn {
  background: #c026d3;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 28px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: opacity 0.15s;
}
.load-more-btn:disabled { opacity: 0.65; cursor: default; }
.spinner-sm {
  width: 14px; height: 14px;
  border: 2px solid rgba(255,255,255,0.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin .7s linear infinite;
  display: inline-block;
}
@keyframes spin { to { transform: rotate(360deg); } }
.end-note {
  text-align: center;
  font-size: 12px;
  color: #9ca3af;
  padding: 16px;
}
.empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 50px 20px; gap: 10px; }
.spinner { width: 28px; height: 28px; border: 3px solid #e6e7eb; border-top-color: #c026d3; border-radius: 50%; animation: spin .7s linear infinite; }
</style>
