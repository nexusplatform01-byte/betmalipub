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
            <span style="font-size:12px; color:var(--text-muted)">-</span>
            <span>{{ match.awayScore }}</span>
          </div>
          <div class="match-card__minute">
            <span style="width:6px;height:6px;background:var(--live-red);border-radius:50%;display:inline-block;animation:pulse 1.5s infinite"></span>
            {{ match.minute }}'
          </div>
        </div>
        <div v-else style="text-align:center;min-width:40px;color:var(--text-muted);font-size:11px">vs</div>
        <span class="match-card__team match-card__team--away">{{ match.awayTeam }}</span>
      </div>

      <div class="match-card__markets" :class="{ 'match-card__markets--two': !match.markets.draw }">
        <button class="odds-btn" :class="{ selected: isSelected(match.id, 'home') }" @click.stop="placeBet(match.id, match.homeTeam, match.markets.home, '1')">
          <span class="odds-btn__label">1</span>
          <span class="odds-btn__value">{{ match.markets.home }}<span v-if="maxOdd === match.markets.home" class="odds-btn__flame">🔥</span></span>
        </button>
        <button v-if="match.markets.draw" class="odds-btn" :class="{ selected: isSelected(match.id, 'draw') }" @click.stop="placeBet(match.id, 'Draw', match.markets.draw, 'X')">
          <span class="odds-btn__label">X</span>
          <span class="odds-btn__value">{{ match.markets.draw }}<span v-if="maxOdd === match.markets.draw" class="odds-btn__flame">🔥</span></span>
        </button>
        <button class="odds-btn" :class="{ selected: isSelected(match.id, 'away') }" @click.stop="placeBet(match.id, match.awayTeam, match.markets.away, '2')">
          <span class="odds-btn__label">2</span>
          <span class="odds-btn__value">{{ match.markets.away }}<span v-if="maxOdd === match.markets.away" class="odds-btn__flame">🔥</span></span>
        </button>
      </div>
    </div>

    <!-- Footer: stats + markets -->
    <div class="match-card__footer">
      <button class="mc-footer-btn mc-footer-btn--stats" @click.stop="$router.push(`/match/${match.id}`)">
        <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12">
          <path d="M5 9h2v11H5zm4-4h2v15H9zm4 7h2v8h-2zm4-5h2v13h-2z"/>
        </svg>
        <span>Statistics</span>
      </button>
      <button class="mc-footer-btn mc-footer-btn--markets" @click.stop="$router.push(`/match/${match.id}`)">
        <span>Markets</span>
        <span class="mc-mkts-count">+19</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
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

const maxOdd = computed(() => {
  const odds = [props.match.markets.home, props.match.markets.draw, props.match.markets.away].filter(Boolean) as number[];
  return Math.max(...odds);
});

function isSelected(matchId: string, side: string) {
  return store.betslip.some((b) => b.matchId === `${matchId}-${side}`);
}

function placeBet(matchId: string, team: string, odds: number, market: string) {
  store.addToBetslip({ matchId: `${matchId}-${market}`, team, odds, market });
}
</script>

<style scoped>
.match-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 10px 6px;
  border-top: 1px solid var(--border);
  gap: 6px;
}

.mc-footer-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 10px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 5px;
  transition: background 0.15s;
}

.mc-footer-btn--stats {
  color: var(--text-grey);
  border: 1px solid var(--border);
}
.mc-footer-btn--stats:active { background: var(--bg-main); }

.mc-footer-btn--markets {
  color: #c026d3;
  border: 1px solid rgba(192,38,211,0.3);
  margin-left: auto;
}
.mc-footer-btn--markets:active { background: rgba(192,38,211,0.06); }

.mc-mkts-count {
  background: #c026d3;
  color: #fff;
  font-size: 9px;
  font-weight: 700;
  border-radius: 4px;
  padding: 1px 4px;
}
</style>
