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
        <div v-if="match.isLive" style="text-align:center;min-width:60px">
          <div class="match-card__score">
            <span>{{ match.homeScore }}</span>
            <span style="font-size:12px;color:var(--text-muted)">-</span>
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

      <!-- Odds row -->
      <div class="match-card__markets" :class="{ 'match-card__markets--two': !match.markets.draw }">
        <button
          class="odds-btn"
          :class="{ selected: isSelected(match.id, '1') }"
          @click.stop="placeBet(match.id, match.homeTeam, match.markets.home, '1')"
        >
          <span class="odds-btn__label">1</span>
          <span class="odds-btn__value">
            {{ match.markets.home }}
            <span v-if="maxOdd === match.markets.home" class="odds-btn__flame">🔥</span>
          </span>
          <span v-if="isSelected(match.id, '1')" class="odds-btn__check">✓</span>
        </button>

        <button
          v-if="match.markets.draw"
          class="odds-btn"
          :class="{ selected: isSelected(match.id, 'X') }"
          @click.stop="placeBet(match.id, 'Draw', match.markets.draw, 'X')"
        >
          <span class="odds-btn__label">X</span>
          <span class="odds-btn__value">
            {{ match.markets.draw }}
            <span v-if="maxOdd === match.markets.draw" class="odds-btn__flame">🔥</span>
          </span>
          <span v-if="isSelected(match.id, 'X')" class="odds-btn__check">✓</span>
        </button>

        <button
          class="odds-btn"
          :class="{ selected: isSelected(match.id, '2') }"
          @click.stop="placeBet(match.id, match.awayTeam, match.markets.away, '2')"
        >
          <span class="odds-btn__label">2</span>
          <span class="odds-btn__value">
            {{ match.markets.away }}
            <span v-if="maxOdd === match.markets.away" class="odds-btn__flame">🔥</span>
          </span>
          <span v-if="isSelected(match.id, '2')" class="odds-btn__check">✓</span>
        </button>
      </div>
    </div>

    <!-- Footer: 4 quick-action tabs -->
    <div class="mc-footer">
      <button class="mc-tab" @click.stop="$router.push(`/match/${match.id}`)">
        <svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13"><path d="M5 9h2v11H5zm4-4h2v15H9zm4 7h2v8h-2zm4-5h2v13h-2z"/></svg>
        <span>Statistics</span>
      </button>
      <button class="mc-tab" @click.stop="$router.push(`/match/${match.id}`)">
        <svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/></svg>
        <span>Prediction</span>
      </button>
      <button class="mc-tab" @click.stop="$router.push(`/match/${match.id}`)">
        <svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
        <span>H2H</span>
      </button>
      <button class="mc-tab mc-tab--markets" @click.stop="$router.push(`/match/${match.id}`)">
        <svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13"><path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z"/></svg>
        <span>Markets</span>
        <span class="mc-mkts-pill">+19</span>
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
/* ── selected checkmark ── */
.odds-btn {
  position: relative;
}
.odds-btn__check {
  position: absolute;
  top: 3px;
  right: 4px;
  font-size: 9px;
  font-weight: 900;
  color: #c026d3;
  line-height: 1;
}

/* ── footer tabs ── */
.mc-footer {
  display: flex;
  align-items: center;
  border-top: 1px solid var(--border);
}

.mc-tab {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3px;
  padding: 6px 2px;
  background: none;
  border: none;
  border-right: 1px solid var(--border);
  cursor: pointer;
  font-size: 9.5px;
  font-weight: 600;
  color: var(--text-grey);
  transition: background 0.14s, color 0.14s;
  white-space: nowrap;
}
.mc-tab:last-child { border-right: none; }
.mc-tab:active { background: #f2f3f5; }

.mc-tab--markets {
  color: #c026d3;
}

.mc-mkts-pill {
  background: #c026d3;
  color: #fff;
  font-size: 8px;
  font-weight: 700;
  border-radius: 3px;
  padding: 1px 3px;
  line-height: 1.4;
}
</style>
