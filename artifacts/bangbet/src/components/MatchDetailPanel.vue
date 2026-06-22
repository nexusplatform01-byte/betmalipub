<template>
  <div class="mdp" ref="panelEl">
    <div class="mdp__header">
      <button class="mdp__back" @click="$emit('close')">
        <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
        Back
      </button>
      <span class="mdp__league-label">{{ match.league }}</span>
      <span v-if="match.isLive" class="mdp__live-pill">LIVE {{ match.minute }}'</span>
    </div>

    <div class="mdp__hero">
      <div class="mdp__teams-row">
        <div class="mdp__side">
          <div class="mdp__badge">H</div>
          <span class="mdp__name">{{ match.homeTeam }}</span>
        </div>
        <div class="mdp__mid">
          <span v-if="match.isLive" class="mdp__score">{{ match.homeScore }} – {{ match.awayScore }}</span>
          <span v-else class="mdp__vs">VS</span>
          <span class="mdp__kickoff">{{ match.isLive ? `${match.minute}'` : match.startTime }}</span>
        </div>
        <div class="mdp__side">
          <div class="mdp__badge">A</div>
          <span class="mdp__name">{{ match.awayTeam }}</span>
        </div>
      </div>
      <div class="mdp__hero-odds">
        <button class="mdp__odd" :class="{ sel: isSel('1') }" @click="addBet(match.homeTeam, match.markets.home, '1')">
          <span class="mdp__odd-l">1</span>
          <span class="mdp__odd-v">{{ match.markets.home }}</span>
        </button>
        <button v-if="match.markets.draw" class="mdp__odd" :class="{ sel: isSel('X') }" @click="addBet('Draw', match.markets.draw, 'X')">
          <span class="mdp__odd-l">X</span>
          <span class="mdp__odd-v">{{ match.markets.draw }}</span>
        </button>
        <button class="mdp__odd" :class="{ sel: isSel('2') }" @click="addBet(match.awayTeam, match.markets.away, '2')">
          <span class="mdp__odd-l">2</span>
          <span class="mdp__odd-v">{{ match.markets.away }}</span>
        </button>
      </div>
    </div>

    <div class="mdp__tabs">
      <button v-for="t in tabs" :key="t" class="mdp__tab" :class="{ active: tab === t }" @click="tab = t">{{ t }}</button>
    </div>

    <div v-if="tab === 'Markets'" class="mdp__body">
      <div v-for="g in groups" :key="g.id" class="mdp__grp">
        <div class="mdp__grp-head" @click="g.open = !g.open">
          <span class="mdp__grp-title">{{ g.title }}</span>
          <span class="mdp__grp-meta">
            {{ g.markets.length }} markets
            <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12" :style="{ transform: g.open ? 'rotate(180deg)' : 'none', transition: '.2s', display:'inline-block' }"><path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/></svg>
          </span>
        </div>
        <div v-if="g.open">
          <div v-for="m in g.markets" :key="m.name" class="mdp__mkt">
            <div class="mdp__mkt-name">{{ m.name }}</div>
            <div class="mdp__mkt-odds" :class="m.outcomes.length === 2 ? 'c2' : 'c3'">
              <button
                v-for="o in m.outcomes" :key="o.label"
                class="mdp__ob"
                :class="{ sel: isSel(`${m.name}-${o.label}`) }"
                @click="addBet(o.label, o.odds, `${m.name}-${o.label}`)"
              >
                <span class="mdp__ob-l">{{ o.label }}</span>
                <span class="mdp__ob-v">{{ o.odds }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="tab === 'Statistics'" class="mdp__stats">
      <div class="mdp__stat-row" v-for="s in stats" :key="s.label">
        <span class="mdp__stat-h">{{ s.home }}</span>
        <div class="mdp__stat-mid">
          <div class="mdp__stat-bar">
            <div class="mdp__bar-home" :style="{ width: s.homePct + '%' }"></div>
            <div class="mdp__bar-away" :style="{ width: s.awayPct + '%' }"></div>
          </div>
          <span class="mdp__stat-lbl">{{ s.label }}</span>
        </div>
        <span class="mdp__stat-a">{{ s.away }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch, nextTick } from 'vue';
import { useAppStore } from '@/stores/app';

const props = defineProps<{ match: any }>();
defineEmits<{ (e: 'close'): void }>();

const store = useAppStore();
const tab = ref('Markets');
const tabs = ['Markets', 'Statistics'];
const panelEl = ref<HTMLElement | null>(null);
watch(() => props.match, () => { nextTick(() => panelEl.value?.scrollTo({ top: 0, behavior: 'instant' })); }, { immediate: true });

const h = computed(() => props.match.markets.home);
const d = computed(() => props.match.markets.draw ?? 3.20);
const a = computed(() => props.match.markets.away);

const groups = computed(() => reactive([
  {
    id: 'main', title: 'Main Markets', open: true,
    markets: [
      { name: 'Match Result (1X2)', outcomes: [
        { label: '1', odds: h.value }, { label: 'X', odds: d.value }, { label: '2', odds: a.value }
      ]},
      { name: 'Double Chance', outcomes: [
        { label: '1X', odds: +(Math.min(h.value, d.value) * 0.72).toFixed(2) },
        { label: 'X2', odds: +(Math.min(d.value, a.value) * 0.72).toFixed(2) },
        { label: '12', odds: +(Math.min(h.value, a.value) * 0.68).toFixed(2) },
      ]},
      { name: 'Over/Under 2.5', outcomes: [
        { label: 'Over 2.5',  odds: +(1 + (d.value / 2.2)).toFixed(2) },
        { label: 'Under 2.5', odds: +(1 + (h.value / 1.8)).toFixed(2) },
      ]},
      { name: 'Both Teams to Score', outcomes: [
        { label: 'Yes', odds: +(d.value * 0.55).toFixed(2) },
        { label: 'No',  odds: +(h.value * 0.85).toFixed(2) },
      ]},
      { name: 'Half Time Result', outcomes: [
        { label: '1', odds: +(h.value * 1.35).toFixed(2) },
        { label: 'X', odds: +(d.value * 0.72).toFixed(2) },
        { label: '2', odds: +(a.value * 1.4).toFixed(2) },
      ]},
    ],
  },
  {
    id: 'cards', title: 'Cards', open: true,
    markets: [
      { name: 'Cards Over/Under 3.5', outcomes: [{ label: 'Over 3.5', odds: 1.85 }, { label: 'Under 3.5', odds: 1.95 }] },
      { name: 'Cards Over/Under 4.5', outcomes: [{ label: 'Over 4.5', odds: 2.40 }, { label: 'Under 4.5', odds: 1.55 }] },
    ],
  },
  {
    id: 'corners', title: 'Corners', open: true,
    markets: [
      { name: 'Corners Over/Under 8.5', outcomes: [{ label: 'Over 8.5', odds: 1.80 }, { label: 'Under 8.5', odds: 2.00 }] },
      { name: 'Corners Over/Under 9.5', outcomes: [{ label: 'Over 9.5', odds: 2.10 }, { label: 'Under 9.5', odds: 1.72 }] },
    ],
  },
]));

const stats = [
  { label: 'Possession',      home: '58%', away: '42%', homePct: 58, awayPct: 42 },
  { label: 'Shots',           home: '12',  away: '7',   homePct: 63, awayPct: 37 },
  { label: 'Shots on Target', home: '5',   away: '3',   homePct: 62, awayPct: 38 },
  { label: 'Corners',         home: '6',   away: '3',   homePct: 67, awayPct: 33 },
  { label: 'Fouls',           home: '9',   away: '13',  homePct: 41, awayPct: 59 },
  { label: 'Yellow Cards',    home: '1',   away: '2',   homePct: 33, awayPct: 67 },
];

function isSel(key: string) {
  return store.betslip.some(b => b.matchId === `${props.match.id}-${key}`);
}
function addBet(team: string, odds: number, key: string) {
  store.addToBetslip({ matchId: `${props.match.id}-${key}`, baseMatchId: props.match.id, team, odds, market: key });
}
</script>

<style scoped>
.mdp {
  background: #f2f3f5;
  overflow-y: auto;
  height: 100%;
}

.mdp__header {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 14px;
  background: linear-gradient(135deg, #c026d3, #a21caf);
  color: #fff;
  position: sticky; top: 0; z-index: 5;
}
.mdp__back {
  display: flex; align-items: center; gap: 5px;
  background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.3);
  border-radius: 6px; padding: 5px 10px;
  color: #fff; cursor: pointer; font-size: 12px; font-weight: 600;
  transition: background 0.15s; flex-shrink: 0;
}
.mdp__back:hover { background: rgba(255,255,255,0.25); }
.mdp__league-label { font-size: 12px; color: rgba(255,255,255,0.85); font-weight: 600; flex: 1; }
.mdp__live-pill {
  background: #e04040; color: #fff;
  font-size: 9px; font-weight: 800; padding: 2px 6px; border-radius: 8px;
  letter-spacing: .5px; flex-shrink: 0;
}

.mdp__hero {
  background:
    linear-gradient(160deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 100%),
    url('https://www.shutterstock.com/shutterstock/videos/3745993915/thumb/1.jpg') center/cover no-repeat;
  padding: 14px 16px 12px; color: #fff;
}
.mdp__teams-row {
  display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 12px;
}
.mdp__side { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 6px; }
.mdp__badge {
  width: 36px; height: 36px; border-radius: 8px;
  background: rgba(255,255,255,0.2); border: 1.5px solid rgba(255,255,255,0.35);
  display: flex; align-items: center; justify-content: center;
  font-size: 16px; font-weight: 900;
}
.mdp__name {
  font-size: 11px; font-weight: 700; text-align: center; line-height: 1.3;
  max-width: 90px; word-break: break-word;
}
.mdp__mid { display: flex; flex-direction: column; align-items: center; gap: 4px; padding-top: 4px; }
.mdp__score { font-size: 20px; font-weight: 900; letter-spacing: 1px; }
.mdp__vs { font-size: 14px; font-weight: 900; }
.mdp__kickoff {
  font-size: 10px; color: rgba(255,255,255,0.75);
  background: rgba(0,0,0,0.18); border-radius: 4px; padding: 1px 6px;
}

.mdp__hero-odds { display: flex; gap: 8px; }
.mdp__odd {
  flex: 1; background: rgba(192,38,211,0.28); border: 1.5px solid rgba(217,70,239,0.55);
  border-radius: 8px; display: flex; flex-direction: column; align-items: center;
  padding: 6px 4px; cursor: pointer; color: #fff;
  transition: background 0.15s, border-color 0.15s;
}
.mdp__odd.sel { background: rgba(192,38,211,0.7); border-color: #e879f9; }
.mdp__odd-l { font-size: 10px; font-weight: 600; opacity: .8; }
.mdp__odd-v { font-size: 15px; font-weight: 800; }

.mdp__tabs {
  display: flex; background: #fff; border-bottom: 1px solid #e6e7eb;
}
.mdp__tab {
  flex: 1; padding: 10px 6px;
  font-size: 12px; font-weight: 600; color: #6a6f7a;
  background: none; border: none; cursor: pointer;
  border-bottom: 2.5px solid transparent;
  transition: color 0.15s, border-color 0.15s;
}
.mdp__tab.active { color: #c026d3; border-bottom-color: #c026d3; }

.mdp__body { padding-bottom: 16px; }
.mdp__grp {
  background: #fff; margin: 8px 8px 0;
  border: 1px solid #e6e7eb;
  border-radius: 12px; overflow: hidden;
}
.mdp__grp-head {
  display: flex; align-items: center; justify-content: space-between;
  padding: 10px 14px; cursor: pointer; border-bottom: 1px solid #f0f0f0;
}
.mdp__grp-title { font-size: 13px; font-weight: 700; color: #292a33; }
.mdp__grp-meta { display: flex; align-items: center; gap: 3px; font-size: 11px; color: #6a6f7a; }
.mdp__mkt {
  padding: 8px 12px 10px; border-bottom: 1px solid #f4f4f6; box-sizing: border-box;
}
.mdp__mkt:last-child { border-bottom: none; }
.mdp__mkt-name { font-size: 11px; font-weight: 600; color: #6a6f7a; margin-bottom: 6px; }
.mdp__mkt-odds { display: grid; gap: 6px; }
.mdp__mkt-odds.c2 { grid-template-columns: 1fr 1fr; }
.mdp__mkt-odds.c3 { grid-template-columns: 1fr 1fr 1fr; }
.mdp__ob {
  display: flex; flex-direction: column; align-items: center;
  padding: 7px 4px; background: #f2f3f5; border: 1.5px solid #e6e7eb;
  border-radius: 8px; cursor: pointer; transition: background 0.15s, border-color 0.15s;
  position: relative;
}
.mdp__ob.sel { background: rgba(192,38,211,0.08); border-color: #c026d3; }
.mdp__ob-l { font-size: 10px; color: #6a6f7a; font-weight: 500; }
.mdp__ob-v { font-size: 13px; font-weight: 800; color: #292a33; }
.mdp__ob.sel .mdp__ob-v { color: #c026d3; }
.mdp__ob.sel::after {
  content: '✓'; position: absolute; top: 2px; right: 4px;
  font-size: 8px; font-weight: 900; color: #c026d3;
}

.mdp__stats { padding: 12px 14px; background: #fff; margin-top: 4px; }
.mdp__stat-row { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
.mdp__stat-h, .mdp__stat-a {
  font-size: 12px; font-weight: 700; color: #292a33; min-width: 32px;
}
.mdp__stat-a { text-align: right; }
.mdp__stat-mid { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 2px; }
.mdp__stat-bar {
  width: 100%; height: 5px; background: #e6e7eb; border-radius: 3px; display: flex; overflow: hidden;
}
.mdp__bar-home { height: 100%; background: #c026d3; border-radius: 3px; }
.mdp__bar-away { height: 100%; background: #16a34a; border-radius: 3px; margin-left: auto; }
.mdp__stat-lbl { font-size: 10px; color: #6a6f7a; font-weight: 500; }
</style>
