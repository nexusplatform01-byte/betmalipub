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

      <!-- Upcoming by League -->
      <template v-if="upcomingByLeague.length">
        <div class="section" v-for="lg in upcomingByLeague" :key="lg.name">
          <div class="section-header">
            <div class="section-title">{{ lg.flag }} {{ lg.name }} <span class="section-count">({{ lg.matches.length }})</span></div>
          </div>
          <MatchCard v-for="match in lg.matches" :key="match.id" :match="match" />
        </div>
      </template>

      <div v-if="loading" class="empty-state">
        <div class="empty-state__icon">⏳</div>
        <p>Loading {{ sportName }} matches…</p>
      </div>

      <div v-else-if="!liveFiltered.length && !upcomingByLeague.length" class="empty-state">
        <div class="empty-state__icon">⚽</div>
        <p>No matches found for "{{ sportName }}"</p>
      </div>
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
import { fetchTopMatches, SPORT_CODE_MAP, type Match } from "@/services/topbetApi";
import { leagueFlag } from "@/composables/useHomeMatches";

const route = useRoute();
const store = useAppStore();
const query = ref("");
const sportMatches = ref<Match[]>([]);
const loading = ref(false);

const sportName = computed(() => (route.params.sport as string) || "Football");

const sportCode = computed(() => {
  const name = sportName.value;
  return SPORT_CODE_MAP[name] || SPORT_CODE_MAP[name.replace(/ /g, '')] || 'S';
});

async function loadSportMatches() {
  loading.value = true;
  try {
    sportMatches.value = await fetchTopMatches(sportCode.value);
  } catch (e) {
    console.error('[Bangbet] SportsView fetch error:', e);
  } finally {
    loading.value = false;
  }
}

onMounted(loadSportMatches);
watch(sportCode, loadSportMatches);

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

const upcomingByLeague = computed(() => {
  const filtered = sportMatches.value.filter((m) => {
    return (
      !query.value ||
      m.homeTeam.toLowerCase().includes(query.value.toLowerCase()) ||
      m.awayTeam.toLowerCase().includes(query.value.toLowerCase()) ||
      m.league.toLowerCase().includes(query.value.toLowerCase())
    );
  });

  const map = new Map<string, Match[]>();
  for (const m of filtered) {
    const key = m.league || 'Other';
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(m);
  }

  return Array.from(map.entries()).map(([name, matches]) => ({
    name,
    flag: leagueFlag(name),
    matches,
  }));
});
</script>

<style scoped>
.section-count {
  color: #a0a3b1;
  font-size: 12px;
  font-weight: 400;
}
</style>
