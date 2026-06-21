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

      <!-- Upcoming -->
      <div class="section" v-if="upcomingFiltered.length">
        <div class="section-header">
          <div class="section-title">📅 Upcoming</div>
        </div>
        <MatchCard v-for="match in upcomingFiltered" :key="match.id" :match="match" />
      </div>

      <div v-if="!liveFiltered.length && !upcomingFiltered.length" class="empty-state">
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
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import AppHeader from "@/components/AppHeader.vue";
import BottomNav from "@/components/BottomNav.vue";
import SportMenu from "@/components/SportMenu.vue";
import MatchCard from "@/components/MatchCard.vue";
import { useAppStore } from "@/stores/app";

const route = useRoute();
const store = useAppStore();
const query = ref("");

const sportName = computed(() => (route.params.sport as string) || "Football");

const liveFiltered = computed(() =>
  store.liveMatches.filter((m) => {
    const matchesSport = m.sport.toLowerCase() === sportName.value.toLowerCase() || sportName.value === "Football";
    const matchesQuery = !query.value || m.homeTeam.toLowerCase().includes(query.value.toLowerCase()) || m.awayTeam.toLowerCase().includes(query.value.toLowerCase());
    return matchesSport && matchesQuery;
  })
);

const upcomingFiltered = computed(() =>
  store.topMatches.filter((m) => {
    const matchesSport = sportName.value === "Football" || m.sport.toLowerCase() === sportName.value.toLowerCase();
    const matchesQuery = !query.value || m.homeTeam.toLowerCase().includes(query.value.toLowerCase()) || m.awayTeam.toLowerCase().includes(query.value.toLowerCase());
    return matchesSport && matchesQuery;
  })
);
</script>
