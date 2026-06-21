<template>
  <div class="md-page">

    <!-- Header -->
    <div class="md-header">
      <button class="md-back" @click="$router.back()">
        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
      </button>
      <div class="md-header__league">
        <img :src="match.leagueLogo" width="16" height="16" />
        <span>{{ match.league }}</span>
      </div>
    </div>

    <!-- Hero -->
    <div class="md-hero">
      <div class="md-hero__teams">
        <div class="md-hero__side">
          <div class="md-hero__badge">H</div>
          <span class="md-hero__name">{{ match.homeTeam }}</span>
        </div>
        <div class="md-hero__mid">
          <span class="md-hero__vs">VS</span>
          <span class="md-hero__time">{{ match.isLive ? `${match.minute}'` : match.startTime }}</span>
        </div>
        <div class="md-hero__side">
          <div class="md-hero__badge">A</div>
          <span class="md-hero__name">{{ match.awayTeam }}</span>
        </div>
      </div>
      <!-- 1X2 hero odds -->
      <div class="md-hero__odds">
        <button class="md-hero__odd" :class="{ selected: isSelected('1') }" @click="placeBet(match.homeTeam, match.markets.home, '1')">
          <span class="md-hero__odd-label">1</span>
          <span class="md-hero__odd-val">{{ match.markets.home }}</span>
        </button>
        <button v-if="match.markets.draw" class="md-hero__odd" :class="{ selected: isSelected('X') }" @click="placeBet('Draw', match.markets.draw, 'X')">
          <span class="md-hero__odd-label">X</span>
          <span class="md-hero__odd-val">{{ match.markets.draw }}</span>
        </button>
        <button class="md-hero__odd" :class="{ selected: isSelected('2') }" @click="placeBet(match.awayTeam, match.markets.away, '2')">
          <span class="md-hero__odd-label">2</span>
          <span class="md-hero__odd-val">{{ match.markets.away }}</span>
        </button>
      </div>
    </div>

    <!-- Tabs -->
    <div class="md-tabs">
      <button
        v-for="tab in tabs" :key="tab.id"
        class="md-tab"
        :class="{ active: activeTab === tab.id }"
        @click="activeTab = tab.id"
      >
        <span v-if="tab.icon" class="md-tab__icon">{{ tab.icon }}</span>
        {{ tab.label }}
        <span v-if="tab.count" class="md-tab__count">({{ tab.count }})</span>
      </button>
    </div>

    <!-- Markets tab -->
    <div v-if="activeTab === 'markets'" class="md-markets">
      <div v-for="group in marketGroups" :key="group.id" class="md-group">
        <div class="md-group__head" @click="group.open = !group.open">
          <span class="md-group__title">{{ group.title }}</span>
          <span class="md-group__meta">{{ group.markets.length }} markets
            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14" :style="{ transform: group.open ? 'rotate(180deg)' : 'none', transition: '.2s' }">
              <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/>
            </svg>
          </span>
        </div>

        <div v-if="group.open">
          <div v-for="mkt in group.markets" :key="mkt.name" class="md-market">
            <div class="md-market__name">{{ mkt.name }}</div>
            <div class="md-market__odds" :class="mkt.outcomes.length === 2 ? 'two-col' : 'three-col'">
              <button
                v-for="outcome in mkt.outcomes" :key="outcome.label"
                class="md-odd-btn"
                :class="{ selected: isSelected(`${mkt.name}-${outcome.label}`) }"
                @click="placeBet(outcome.label, outcome.odds, `${mkt.name}-${outcome.label}`)"
              >
                <span class="md-odd-btn__label">{{ outcome.label }}</span>
                <span class="md-odd-btn__val">{{ outcome.odds }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Statistics tab -->
    <div v-if="activeTab === 'stats'" class="md-stats">
      <div class="md-stat-row" v-for="stat in stats" :key="stat.label">
        <span class="md-stat-home">{{ stat.home }}</span>
        <div class="md-stat-bar-wrap">
          <div class="md-stat-bar">
            <div class="md-stat-bar__fill md-stat-bar__fill--home" :style="{ width: stat.homePct + '%' }"></div>
            <div class="md-stat-bar__fill md-stat-bar__fill--away" :style="{ width: stat.awayPct + '%', marginLeft: 'auto' }"></div>
          </div>
          <span class="md-stat-label">{{ stat.label }}</span>
        </div>
        <span class="md-stat-away">{{ stat.away }}</span>
      </div>
    </div>

    <!-- AI Chat tab placeholder -->
    <div v-if="activeTab === 'aichat'" class="md-aichat">
      <div class="md-aichat__icon">🤖</div>
      <p>AI match analysis coming soon</p>
    </div>

    <div style="height:60px"></div>
    <BottomNav @open-betslip="showBetslip = true" />

    <!-- Betslip panel -->
    <div v-if="showBetslip" class="modal-overlay" @click.self="showBetslip = false">
      <div class="modal" style="position:relative">
        <button class="modal__close" @click="showBetslip = false">✕</button>
        <h2 class="modal__title">Betslip ({{ store.betslip.length }})</h2>
        <div v-for="bet in store.betslip" :key="bet.matchId" style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--border)">
          <div>
            <div style="font-size:13px;font-weight:600;color:var(--text-dark)">{{ bet.team }}</div>
            <div style="font-size:11px;color:var(--text-grey)">{{ bet.market }}</div>
          </div>
          <span style="font-size:16px;font-weight:700;color:var(--green)">{{ bet.odds }}</span>
        </div>
        <button class="btn-full" style="margin-top:14px" @click="showBetslip = false">Place Bet</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { useAppStore } from '@/stores/app';
import BottomNav from '@/components/BottomNav.vue';
import { liveMatches, topMatches } from '@/stores/mockData';

const route = useRoute();
const store = useAppStore();
const showBetslip = ref(false);
const activeTab = ref('markets');

const allMatches = [...liveMatches, ...topMatches];
const match = computed(() => allMatches.find(m => m.id === route.params.id) ?? allMatches[0]);

const tabs = [
  { id: 'markets', label: 'Markets', icon: '📋', count: 19 },
  { id: 'stats',   label: 'Statistics', icon: '📊', count: null },
  { id: 'aichat',  label: 'AI Chat', icon: '🤖', count: null },
];

// Build markets from base odds
const h = computed(() => match.value.markets.home);
const d = computed(() => match.value.markets.draw ?? 3.20);
const a = computed(() => match.value.markets.away);

const marketGroups = computed(() => reactive([
  {
    id: 'main', title: 'Main Markets', open: true,
    markets: [
      { name: 'Match Result (1X2)', outcomes: [
        { label: '1', odds: h.value },
        { label: 'X', odds: d.value },
        { label: '2', odds: a.value },
      ]},
      { name: 'Double Chance', outcomes: [
        { label: '1X', odds: +(Math.min(h.value, d.value) * 0.72).toFixed(2) },
        { label: 'X2', odds: +(Math.min(d.value, a.value) * 0.72).toFixed(2) },
        { label: '12', odds: +(Math.min(h.value, a.value) * 0.68).toFixed(2) },
      ]},
      { name: 'Over/Under Goals 1.5', outcomes: [
        { label: 'Over 1.5',  odds: +(1 + (1 / h.value) * 0.6).toFixed(2) },
        { label: 'Under 1.5', odds: +(1 + a.value * 0.9).toFixed(2) },
      ]},
      { name: 'Over/Under Goals 2.5', outcomes: [
        { label: 'Over 2.5',  odds: +(1 + (d.value / 2.2)).toFixed(2) },
        { label: 'Under 2.5', odds: +(1 + (h.value / 1.8)).toFixed(2) },
      ]},
      { name: 'Over/Under Goals 3.5', outcomes: [
        { label: 'Over 3.5',  odds: +(d.value * 0.88).toFixed(2) },
        { label: 'Under 3.5', odds: +(1 + (h.value * 0.22)).toFixed(2) },
      ]},
      { name: 'Over/Under Goals 4.5', outcomes: [
        { label: 'Over 4.5',  odds: +(a.value * 1.1).toFixed(2) },
        { label: 'Under 4.5', odds: +(1 + h.value * 0.12).toFixed(2) },
      ]},
      { name: 'Both Teams to Score', outcomes: [
        { label: 'Yes', odds: +(d.value * 0.55).toFixed(2) },
        { label: 'No',  odds: +(h.value * 0.85).toFixed(2) },
      ]},
      { name: 'First Team to Score', outcomes: [
        { label: match.value.homeTeam, odds: +(h.value * 0.82).toFixed(2) },
        { label: 'No Goal',           odds: +(a.value * 1.2).toFixed(2) },
        { label: match.value.awayTeam,odds: +(a.value * 0.78).toFixed(2) },
      ]},
      { name: 'Half Time Result', outcomes: [
        { label: '1', odds: +(h.value * 1.35).toFixed(2) },
        { label: 'X', odds: +(d.value * 0.72).toFixed(2) },
        { label: '2', odds: +(a.value * 1.4).toFixed(2) },
      ]},
    ],
  },
  {
    id: 'cards', title: 'Cards', open: false,
    markets: [
      { name: 'Total Cards Over/Under 3.5', outcomes: [
        { label: 'Over 3.5',  odds: 1.85 },
        { label: 'Under 3.5', odds: 1.95 },
      ]},
      { name: 'Total Cards Over/Under 4.5', outcomes: [
        { label: 'Over 4.5',  odds: 2.40 },
        { label: 'Under 4.5', odds: 1.55 },
      ]},
    ],
  },
  {
    id: 'corners', title: 'Corners', open: false,
    markets: [
      { name: 'Total Corners Over/Under 8.5', outcomes: [
        { label: 'Over 8.5',  odds: 1.80 },
        { label: 'Under 8.5', odds: 2.00 },
      ]},
      { name: 'Total Corners Over/Under 9.5', outcomes: [
        { label: 'Over 9.5',  odds: 2.10 },
        { label: 'Under 9.5', odds: 1.72 },
      ]},
    ],
  },
]));

const stats = [
  { label: 'Possession',   home: '58%', away: '42%', homePct: 58, awayPct: 42 },
  { label: 'Shots',        home: '12',  away: '7',   homePct: 63, awayPct: 37 },
  { label: 'Shots on Target', home: '5', away: '3',  homePct: 62, awayPct: 38 },
  { label: 'Corners',      home: '6',   away: '3',   homePct: 67, awayPct: 33 },
  { label: 'Fouls',        home: '9',   away: '13',  homePct: 41, awayPct: 59 },
  { label: 'Yellow Cards', home: '1',   away: '2',   homePct: 33, awayPct: 67 },
];

function isSelected(key: string) {
  return store.betslip.some(b => b.matchId === `${match.value.id}-${key}`);
}
function placeBet(team: string, odds: number, key: string) {
  store.addToBetslip({ matchId: `${match.value.id}-${key}`, team, odds, market: key });
}
</script>

<style scoped>
.md-page {
  min-height: 100vh;
  background: #f2f3f5;
  padding-bottom: 60px;
  overflow-x: hidden;
  width: 100%;
  box-sizing: border-box;
}

/* ── header ── */
.md-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  background: linear-gradient(135deg, #c026d3, #a21caf);
  color: #fff;
}
.md-back {
  background: none; border: none; color: #fff; cursor: pointer;
  display: flex; align-items: center; padding: 0;
}
.md-header__league {
  display: flex; align-items: center; gap: 6px;
  font-size: 13px; font-weight: 600;
}

/* ── hero ── */
.md-hero {
  background:
    linear-gradient(160deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 100%),
    url('https://www.shutterstock.com/shutterstock/videos/3745993915/thumb/1.jpg') center/cover no-repeat;
  padding: 16px 14px 14px;
  color: #fff;
}
.md-hero__teams {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 14px;
}
.md-hero__side {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}
.md-hero__badge {
  width: 36px; height: 36px;
  border-radius: 8px;
  background: rgba(255,255,255,0.22);
  display: flex; align-items: center; justify-content: center;
  font-size: 16px; font-weight: 900; color: #fff;
  border: 1.5px solid rgba(255,255,255,0.35);
}
.md-hero__name {
  font-size: 11px; font-weight: 700; text-align: center;
  line-height: 1.3; color: rgba(255,255,255,0.95);
}
.md-hero__mid {
  display: flex; flex-direction: column; align-items: center;
  gap: 4px; padding-top: 4px;
}
.md-hero__vs {
  font-size: 14px; font-weight: 900; color: #fff;
}
.md-hero__time {
  font-size: 10px; color: rgba(255,255,255,0.75);
  background: rgba(0,0,0,0.18);
  border-radius: 4px; padding: 1px 6px;
}

/* hero odds row */
.md-hero__odds {
  display: flex; gap: 8px;
}
.md-hero__odd {
  flex: 1;
  background: rgba(192, 38, 211, 0.28);
  border: 1.5px solid rgba(217, 70, 239, 0.55);
  border-radius: 8px;
  display: flex; flex-direction: column; align-items: center;
  padding: 6px 4px; cursor: pointer; color: #fff;
  transition: background 0.15s, border-color 0.15s;
}
.md-hero__odd.selected {
  background: rgba(192, 38, 211, 0.7);
  border-color: #e879f9;
  color: #fff;
}
.md-hero__odd-label { font-size: 10px; font-weight: 600; opacity: .8; }
.md-hero__odd-val   { font-size: 15px; font-weight: 800; }

/* ── tabs ── */
.md-tabs {
  display: flex;
  background: #fff;
  border-bottom: 1px solid #e6e7eb;
  overflow-x: auto;
}
.md-tab {
  flex: 1;
  display: flex; align-items: center; justify-content: center;
  gap: 4px;
  padding: 11px 6px;
  font-size: 11px; font-weight: 600;
  color: #6a6f7a;
  background: none; border: none; cursor: pointer;
  border-bottom: 2.5px solid transparent;
  white-space: nowrap;
  transition: color 0.15s, border-color 0.15s;
}
.md-tab.active {
  color: #c026d3;
  border-bottom-color: #c026d3;
}
.md-tab__icon { font-size: 13px; }
.md-tab__count { font-size: 10px; color: inherit; opacity: .7; }

/* ── market groups ── */
.md-markets {
  padding: 10px 10px 0;
  box-sizing: border-box;
  width: 100%;
}

.md-group {
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 8px;
  box-shadow: 0 1px 4px rgba(0,0,0,.06);
  width: 100%;
  box-sizing: border-box;
}
.md-group__head {
  display: flex; align-items: center; justify-content: space-between;
  padding: 11px 14px;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
}
.md-group__title {
  font-size: 13px; font-weight: 700; color: #292a33;
}
.md-group__meta {
  display: flex; align-items: center; gap: 3px;
  font-size: 11px; color: #6a6f7a;
}

/* individual market */
.md-market { padding: 10px 12px 12px; border-bottom: 1px solid #f4f4f6; box-sizing: border-box; width: 100%; }
.md-market:last-child { border-bottom: none; }
.md-market__name {
  font-size: 11px; font-weight: 600; color: #6a6f7a; margin-bottom: 7px;
}
.md-market__odds {
  display: grid; gap: 6px; width: 100%; box-sizing: border-box;
}
.md-market__odds.two-col   { grid-template-columns: 1fr 1fr; }
.md-market__odds.three-col { grid-template-columns: 1fr 1fr 1fr; }

.md-odd-btn {
  display: flex; flex-direction: column; align-items: center;
  padding: 8px 4px;
  background: #f2f3f5;
  border: 1.5px solid #e6e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
}
.md-odd-btn.selected {
  background: #d946ef22;
  border-color: #c026d3;
}
.md-odd-btn__label { font-size: 10px; color: #6a6f7a; font-weight: 500; }
.md-odd-btn__val   { font-size: 14px; font-weight: 800; color: #292a33; }
.md-odd-btn.selected .md-odd-btn__val { color: #c026d3; }

/* ── stats ── */
.md-stats { padding: 12px 14px; }
.md-stat-row {
  display: flex; align-items: center; gap: 8px; margin-bottom: 12px;
}
.md-stat-home, .md-stat-away {
  font-size: 12px; font-weight: 700; color: #292a33; min-width: 32px;
}
.md-stat-away { text-align: right; }
.md-stat-bar-wrap { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 3px; }
.md-stat-bar {
  width: 100%; height: 5px; background: #e6e7eb; border-radius: 3px;
  display: flex; overflow: hidden;
}
.md-stat-bar__fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.5s;
}
.md-stat-bar__fill--home { background: #c026d3; }
.md-stat-bar__fill--away { background: #16a34a; }
.md-stat-label { font-size: 10px; color: #6a6f7a; font-weight: 500; }

/* ── ai chat ── */
.md-aichat {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 60px 20px; color: #6a6f7a; gap: 10px;
}
.md-aichat__icon { font-size: 48px; }
.md-aichat p { font-size: 14px; }
</style>
