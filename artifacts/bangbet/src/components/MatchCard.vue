<template>
  <div class="match-card">
    <div class="match-card__header">
      <img :src="match.leagueLogo" :alt="match.league" class="match-card__league-icon" />
      <span class="match-card__league">{{ match.league }}</span>
      <span v-if="match.isLive" class="match-card__live-badge">Live</span>
      <span v-else class="match-card__time">{{ match.startTime }}</span>
    </div>
    <div class="match-card__body">
      <div class="match-card__teams">
        <span class="match-card__team">{{ match.homeTeam }}</span>
        <div v-if="match.isLive" style="text-align:center; min-width:60px">
          <div class="match-card__score">
            <span>{{ match.homeScore }}</span>
            <span style="font-size:12px; color: var(--text-muted)">-</span>
            <span>{{ match.awayScore }}</span>
          </div>
          <div class="match-card__minute">
            <span style="width:6px;height:6px;background:var(--live-red);border-radius:50%;display:inline-block;animation:pulse 1.5s infinite"></span>
            {{ match.minute }}'
          </div>
        </div>
        <div v-else style="text-align:center; min-width:40px; color: var(--text-muted); font-size:11px">vs</div>
        <span class="match-card__team match-card__team--away">{{ match.awayTeam }}</span>
      </div>
      <div class="match-card__markets" :class="{ 'match-card__markets--two': !match.markets.draw }">
        <button class="odds-btn" :class="{ selected: isSelected(match.id, 'home') }" @click="placeBet(match.id, match.homeTeam, match.markets.home, '1')">
          <span class="odds-btn__label">1</span>
          <span class="odds-btn__value">{{ match.markets.home }}</span>
        </button>
        <button v-if="match.markets.draw" class="odds-btn" :class="{ selected: isSelected(match.id, 'draw') }" @click="placeBet(match.id, 'Draw', match.markets.draw, 'X')">
          <span class="odds-btn__label">X</span>
          <span class="odds-btn__value">{{ match.markets.draw }}</span>
        </button>
        <button class="odds-btn" :class="{ selected: isSelected(match.id, 'away') }" @click="placeBet(match.id, match.awayTeam, match.markets.away, '2')">
          <span class="odds-btn__label">2</span>
          <span class="odds-btn__value">{{ match.markets.away }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from "@/stores/app";

const props = defineProps<{
  match: {
    id: string;
    sport: string;
    league: string;
    leagueLogo: string;
    homeTeam: string;
    awayTeam: string;
    homeScore?: number;
    awayScore?: number;
    minute?: number;
    startTime?: string;
    isLive: boolean;
    markets: { home: number; draw: number | null; away: number };
  };
}>();

const store = useAppStore();

function isSelected(matchId: string, side: string) {
  return store.betslip.some((b) => b.matchId === `${matchId}-${side}`);
}

function placeBet(matchId: string, team: string, odds: number, market: string) {
  store.addToBetslip({ matchId: `${matchId}-${market}`, team, odds, market });
}
</script>
