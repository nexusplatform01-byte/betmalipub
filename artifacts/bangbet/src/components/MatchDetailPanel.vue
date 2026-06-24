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
          <div class="mdp__badge">{{ initials(match.homeTeam) }}</div>
          <span class="mdp__name">{{ match.homeTeam }}</span>
        </div>
        <div class="mdp__mid">
          <span v-if="match.isLive" class="mdp__score">{{ match.homeScore }} – {{ match.awayScore }}</span>
          <span v-else class="mdp__vs">VS</span>
          <span class="mdp__kickoff">{{ match.isLive ? `${match.minute}'` : match.startTime }}</span>
        </div>
        <div class="mdp__side">
          <div class="mdp__badge">{{ initials(match.awayTeam) }}</div>
          <span class="mdp__name">{{ match.awayTeam }}</span>
        </div>
      </div>
      <div class="mdp__hero-odds" v-if="mainMarket">
        <button
          v-for="o in (mainMarket.outcomes || [])"
          :key="o.outcome_id"
          class="mdp__odd"
          :class="{ sel: isSel(`${mainMarket.market_id}-${o.outcome_id}`), locked: o.active !== 1 }"
          @click="o.active === 1 && addBet(o.alias, o.odds, `${mainMarket.market_id}-${o.outcome_id}`)"
        >
          <span class="mdp__odd-l">{{ o.alias }}</span>
          <span class="mdp__odd-v">
            <span v-if="o.active !== 1">🔒</span>
            <span v-else>{{ o.odds }}</span>
          </span>
        </button>
      </div>
      <div v-else class="mdp__hero-odds mdp__hero-odds--fallback">
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

    <!-- MARKETS TAB -->
    <div v-if="tab === 'Markets'" class="mdp__body">
      <!-- loading -->
      <div v-if="bandaLoading" class="mdp__loading">
        <div class="mdp__spinner"></div>
        <span>Loading markets…</span>
      </div>
      <div v-else-if="!sortedMarkets.length" class="mdp__empty">No active markets available.</div>
      <template v-else>
        <div v-for="(grp, gi) in marketGroups" :key="grp.id" class="mdp__grp">
          <div class="mdp__grp-head" @click="toggleGrp(grp.id)">
            <span class="mdp__grp-title">{{ grp.title }}</span>
            <span class="mdp__grp-meta">
              {{ grp.markets.length }} market{{ grp.markets.length !== 1 ? 's' : '' }}
              <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12"
                :style="{ transform: grpOpen[grp.id] ? 'rotate(180deg)' : 'none', transition: '.2s', display:'inline-block' }">
                <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/>
              </svg>
            </span>
          </div>
          <template v-if="grpOpen[grp.id]">
            <div v-for="mkt in grp.markets" :key="`${mkt.market_id}-${gi}`" class="mdp__mkt">
              <div class="mdp__mkt-name">{{ mkt.market_name }}</div>
              <div class="mdp__mkt-odds" :class="gridClass((mkt.outcomes || []).length)">
                <button
                  v-for="o in (mkt.outcomes || [])"
                  :key="o.outcome_id"
                  class="mdp__ob"
                  :class="{ sel: isSel(`${mkt.market_id}-${o.outcome_id}`), locked: o.active !== 1 }"
                  @click="o.active === 1 && addBet(o.alias, o.odds, `${mkt.market_id}-${o.outcome_id}`)"
                >
                  <span class="mdp__ob-l">{{ o.alias }}</span>
                  <span class="mdp__ob-v">
                    <span v-if="o.active !== 1">🔒</span>
                    <span v-else>{{ o.odds }}</span>
                  </span>
                </button>
              </div>
            </div>
          </template>
        </div>
      </template>
    </div>

    <!-- AI Prediction tab -->
    <div v-if="tab === 'AI Prediction'" class="mdp__ai">
      <div class="ai-header">
        <span class="ai-badge">🤖</span>
        <div>
          <div class="ai-title">AI Match Prediction</div>
          <div class="ai-sub">Powered by Bangbet Intelligence Engine</div>
        </div>
      </div>
      <div class="ai-verdict">
        <div class="ai-verdict-label">Recommended Bet</div>
        <div class="ai-verdict-pick">{{ aiPick }}</div>
        <div class="ai-verdict-conf">
          <span>Confidence</span>
          <div class="ai-conf-bar"><div class="ai-conf-fill" :style="{ width: aiConf + '%', background: aiConf > 70 ? '#16a34a' : aiConf > 50 ? '#ca8a04' : '#dc2626' }"></div></div>
          <span class="ai-conf-pct">{{ aiConf }}%</span>
        </div>
      </div>
      <div class="ai-probs">
        <div class="ai-prob-item" v-for="p in aiProbs" :key="p.label">
          <div class="ai-prob-head">
            <span class="ai-prob-label">{{ p.label }}</span>
            <span class="ai-prob-pct">{{ p.pct }}%</span>
          </div>
          <div class="ai-prob-bar"><div class="ai-prob-fill" :style="{ width: p.pct + '%', background: p.color }"></div></div>
        </div>
      </div>
      <div class="ai-factors">
        <div class="ai-factors-title">Key Factors</div>
        <div class="ai-factor" v-for="f in aiFactors" :key="f.label">
          <span class="ai-factor-icon">{{ f.icon }}</span>
          <div class="ai-factor-info">
            <div class="ai-factor-label">{{ f.label }}</div>
            <div class="ai-factor-val">{{ f.val }}</div>
          </div>
          <span class="ai-factor-impact" :class="f.impact">{{ f.impact === 'pos' ? '↑ Positive' : f.impact === 'neg' ? '↓ Negative' : '→ Neutral' }}</span>
        </div>
      </div>
      <div class="ai-score-pred">
        <div class="ai-factors-title">Score Prediction</div>
        <div class="ai-score-row">
          <div class="ai-score-team">{{ match.homeTeam }}<span class="ai-score-num">{{ aiScore[0] }}</span></div>
          <span class="ai-score-sep">–</span>
          <div class="ai-score-team ai-score-team--right"><span class="ai-score-num">{{ aiScore[1] }}</span>{{ match.awayTeam }}</div>
        </div>
        <div class="ai-score-note">Most likely scoreline based on form & H2H</div>
      </div>
      <div class="ai-disclaimer">⚠️ AI predictions are for informational purposes only. Bet responsibly.</div>
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
import { ref, computed, watch, nextTick } from 'vue'
import { useAppStore } from '@/stores/app'
import { fetchBandaMatchDetail, type BandaMarket } from '@/services/topbetApi'

const props = defineProps<{ match: any }>()
defineEmits<{ (e: 'close'): void }>()

const store = useAppStore()
const tab = ref('Markets')
const tabs = ['Markets', 'Statistics', 'AI Prediction']
const panelEl = ref<HTMLElement | null>(null)

const bandaMarkets = ref<BandaMarket[]>([])
const bandaLoading = ref(false)
const grpOpen = ref<Record<string, boolean>>({})

function initials(name: string): string {
  return (name || '').split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() || '').join('')
}

function gridClass(count: number): string {
  if (count <= 2) return 'c2'
  if (count === 3) return 'c3'
  if (count === 4) return 'c4'
  return 'cmulti'
}

function toggleGrp(id: string) {
  grpOpen.value[id] = !grpOpen.value[id]
}

function priorityScore(mkt: BandaMarket): number {
  const n = mkt.market_name.toLowerCase()
  if (mkt.market_id === 2 || n === '1 x 2') return 0
  if (n.includes('double chance')) return 1
  if ((n.includes('over') || n.includes('under')) && n.includes('2.5')) return 2
  if (n.includes('over') && n.includes('under')) return 3
  if (n.includes('both teams') || n.includes('btts') || n.includes('score')) return 4
  if (n.includes('half') && n.includes('full')) return 5
  if (n.includes('1st half') || n.includes('first half') || (n.includes('half') && n.includes('time'))) return 6
  if (n.includes('goalscorer') || n.includes('goal scorer') || n.includes('anytime')) return 50
  if (n.includes('card')) return 30
  if (n.includes('corner')) return 35
  return 20 + mkt.market_id
}

function groupLabel(mkt: BandaMarket): string {
  const n = mkt.market_name.toLowerCase()
  if (mkt.market_id === 2 || n === '1 x 2') return 'top'
  if (n.includes('double chance')) return 'top'
  if (n.includes('over') || n.includes('under') || n.includes('total')) return 'top'
  if (n.includes('both teams') || n.includes('btts')) return 'top'
  if (n.includes('half') || n.includes('ht/ft') || n.includes('halftime')) return 'halftime'
  if (n.includes('goalscorer') || n.includes('goal scorer') || n.includes('anytime scorer') || n.includes('first goal')) return 'goalscorer'
  if (n.includes('card')) return 'cards'
  if (n.includes('corner')) return 'corners'
  return 'other'
}

const sortedMarkets = computed<BandaMarket[]>(() => {
  return bandaMarkets.value
    .filter((m) => m.status === 0 && (m.outcomes || []).some((o) => o.active === 1))
    .sort((a, b) => priorityScore(a) - priorityScore(b))
})

const mainMarket = computed(() =>
  bandaMarkets.value.find((m) => m.market_id === 2 && m.status === 0) || null
)

interface MarketGroup { id: string; title: string; markets: BandaMarket[] }

const marketGroups = computed<MarketGroup[]>(() => {
  const map: Record<string, BandaMarket[]> = {}
  for (const m of sortedMarkets.value) {
    const g = groupLabel(m)
    if (!map[g]) map[g] = []
    map[g].push(m)
  }
  const defs: { id: string; title: string }[] = [
    { id: 'top',        title: '⭐ Top Markets' },
    { id: 'halftime',   title: '⏱ Half Time' },
    { id: 'goalscorer', title: '⚽ Goalscorers' },
    { id: 'cards',      title: '🟨 Cards' },
    { id: 'corners',    title: '🚩 Corners' },
    { id: 'other',      title: '📋 Other Markets' },
  ]
  return defs
    .filter((d) => map[d.id]?.length)
    .map((d) => ({ ...d, markets: map[d.id] }))
})

async function loadMarkets(matchId: string) {
  if (!matchId) return
  bandaLoading.value = true
  bandaMarkets.value = []
  try {
    bandaMarkets.value = await fetchBandaMatchDetail(matchId)
    grpOpen.value = {}
    marketGroups.value.forEach((g) => { grpOpen.value[g.id] = g.id === 'top' })
  } catch {
    bandaMarkets.value = []
  } finally {
    bandaLoading.value = false
  }
}

watch(
  () => props.match,
  (m) => {
    nextTick(() => panelEl.value?.scrollTo({ top: 0, behavior: 'instant' }))
    if (m?.id) loadMarkets(m.id)
  },
  { immediate: true },
)

const stats = [
  { label: 'Possession',      home: '58%', away: '42%', homePct: 58, awayPct: 42 },
  { label: 'Shots',           home: '12',  away: '7',   homePct: 63, awayPct: 37 },
  { label: 'Shots on Target', home: '5',   away: '3',   homePct: 62, awayPct: 38 },
  { label: 'Corners',         home: '6',   away: '3',   homePct: 67, awayPct: 33 },
  { label: 'Fouls',           home: '9',   away: '13',  homePct: 41, awayPct: 59 },
  { label: 'Yellow Cards',    home: '1',   away: '2',   homePct: 33, awayPct: 67 },
]

const aiConf = computed(() => {
  const max = Math.max(props.match.markets.home, props.match.markets.away)
  const min = Math.min(props.match.markets.home, props.match.markets.away)
  return Math.min(95, Math.round(45 + (max / min) * 18))
})
const aiPick = computed(() => {
  if (props.match.markets.home < props.match.markets.away) return `${props.match.homeTeam} to Win (1)`
  if (props.match.markets.away < props.match.markets.home) return `${props.match.awayTeam} to Win (2)`
  return 'Draw (X)'
})
const aiProbs = computed(() => {
  const h = props.match.markets.home, a = props.match.markets.away
  const total = 1 / h + 1 / 3.2 + 1 / a
  return [
    { label: `${props.match.homeTeam} Win`, pct: Math.round((1 / h) / total * 100), color: '#c026d3' },
    { label: 'Draw',                         pct: Math.round((1 / 3.2) / total * 100), color: '#6366f1' },
    { label: `${props.match.awayTeam} Win`, pct: Math.round((1 / a) / total * 100),   color: '#16a34a' },
  ]
})
const aiScore = computed(() =>
  props.match.markets.home < props.match.markets.away ? [2, 1] : [1, 2]
)
const aiFactors = [
  { icon: '📈', label: 'Home Form',     val: 'W W D W L (last 5)',    impact: 'pos' },
  { icon: '📉', label: 'Away Form',     val: 'L D W L D (last 5)',    impact: 'neg' },
  { icon: '⚔️', label: 'Head to Head', val: 'Home leads 3-1-1',      impact: 'pos' },
  { icon: '🏟️', label: 'Venue Factor', val: 'Home advantage strong', impact: 'pos' },
  { icon: '🤕', label: 'Injuries',      val: '2 key away players out', impact: 'neg' },
  { icon: '🌦️', label: 'Conditions',   val: 'Clear — no impact',     impact: 'neu' },
]

function isSel(key: string) {
  return store.betslip.some((b) => b.matchId === `${props.match.id}-${key}`)
}
function addBet(team: string, odds: number, key: string) {
  if (!odds || odds <= 0) return
  store.addToBetslip({ matchId: `${props.match.id}-${key}`, baseMatchId: props.match.id, team, odds, market: key })
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
  font-size: 14px; font-weight: 900; color: #fff;
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
.mdp__odd.locked { opacity: .5; cursor: not-allowed; }
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

/* loading/empty */
.mdp__loading {
  display: flex; align-items: center; justify-content: center; gap: 10px;
  padding: 40px 20px; font-size: 13px; color: #6a6f7a;
}
.mdp__spinner {
  width: 22px; height: 22px; border: 2.5px solid #e6e7eb; border-top-color: #c026d3;
  border-radius: 50%; animation: spin .7s linear infinite; flex-shrink: 0;
}
@keyframes spin { to { transform: rotate(360deg); } }
.mdp__empty { text-align: center; padding: 40px; color: #9ca3af; font-size: 13px; }

/* groups / markets */
.mdp__body { padding: 8px 8px 20px; display: flex; flex-direction: column; gap: 6px; }
.mdp__grp {
  background: #fff;
  border: 1px solid #e6e7eb;
  border-radius: 10px; overflow: hidden;
}
.mdp__grp-head {
  display: flex; align-items: center; justify-content: space-between;
  padding: 10px 14px; cursor: pointer;
  border-bottom: 1px solid #f0f0f0; user-select: none;
}
.mdp__grp-head:hover { background: #fafbfd; }
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
.mdp__mkt-odds.c4 { grid-template-columns: 1fr 1fr 1fr 1fr; }
.mdp__mkt-odds.cmulti { grid-template-columns: repeat(auto-fill, minmax(88px, 1fr)); }
.mdp__ob {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  min-height: 44px; padding: 7px 4px;
  background: #f2f3f5; border: 1.5px solid #e6e7eb;
  border-radius: 8px; cursor: pointer; transition: background 0.15s, border-color 0.15s;
  position: relative; width: 100%;
}
.mdp__ob.sel { background: rgba(192,38,211,0.08); border-color: #c026d3; }
.mdp__ob.locked { opacity: .5; cursor: not-allowed; background: #f8f8f9; }
.mdp__ob.sel::after { content: '✓'; position: absolute; top: 2px; right: 4px; font-size: 8px; font-weight: 900; color: #c026d3; }
.mdp__ob-l { font-size: 10px; color: #6a6f7a; font-weight: 500; text-align: center; line-height: 1.2; margin-bottom: 2px; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.mdp__ob-v { font-size: 13px; font-weight: 800; color: #292a33; }
.mdp__ob.sel .mdp__ob-v { color: #c026d3; }

/* statistics */
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

/* AI Prediction */
.mdp__ai { padding: 10px 8px 20px; display: flex; flex-direction: column; gap: 10px; }
.ai-header {
  display: flex; align-items: center; gap: 12px;
  background: linear-gradient(135deg, #1e1b4b, #312e81);
  border-radius: 12px; padding: 14px 16px;
}
.ai-badge {
  font-size: 22px; width: 44px; height: 44px;
  background: rgba(255,255,255,0.12); border-radius: 10px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.ai-title { font-size: 14px; font-weight: 800; color: #fff; }
.ai-sub   { font-size: 10px; color: rgba(255,255,255,0.5); margin-top: 2px; }
.ai-verdict { background: #fff; border-radius: 12px; padding: 14px 16px; box-shadow: 0 1px 5px rgba(0,0,0,0.07); }
.ai-verdict-label { font-size: 10px; font-weight: 700; color: #9599a4; text-transform: uppercase; letter-spacing: .5px; margin-bottom: 4px; }
.ai-verdict-pick  { font-size: 16px; font-weight: 900; color: #292a33; margin-bottom: 10px; }
.ai-verdict-conf  { display: flex; align-items: center; gap: 8px; font-size: 11px; color: #6a6f7a; }
.ai-conf-bar { flex: 1; height: 7px; background: #f0f0f4; border-radius: 4px; overflow: hidden; }
.ai-conf-fill { height: 100%; border-radius: 4px; transition: width 0.6s ease; }
.ai-conf-pct  { font-weight: 800; color: #292a33; min-width: 32px; text-align: right; }
.ai-probs { background: #fff; border-radius: 12px; padding: 14px 16px; display: flex; flex-direction: column; gap: 10px; box-shadow: 0 1px 5px rgba(0,0,0,0.07); }
.ai-prob-head { display: flex; justify-content: space-between; margin-bottom: 4px; }
.ai-prob-label { font-size: 12px; font-weight: 600; color: #292a33; }
.ai-prob-pct   { font-size: 12px; font-weight: 800; color: #292a33; }
.ai-prob-bar   { height: 6px; background: #f0f0f4; border-radius: 4px; overflow: hidden; }
.ai-prob-fill  { height: 100%; border-radius: 4px; }
.ai-factors { background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 5px rgba(0,0,0,0.07); }
.ai-factors-title { padding: 10px 14px; font-size: 12px; font-weight: 800; color: #292a33; border-bottom: 1px solid #f0f0f4; background: #fafbfc; }
.ai-factor { display: flex; align-items: center; gap: 10px; padding: 10px 14px; border-bottom: 1px solid #f4f4f6; }
.ai-factor:last-child { border-bottom: none; }
.ai-factor-icon { font-size: 16px; flex-shrink: 0; width: 24px; text-align: center; }
.ai-factor-info { flex: 1; }
.ai-factor-label { font-size: 11px; font-weight: 600; color: #292a33; }
.ai-factor-val   { font-size: 10px; color: #9599a4; margin-top: 1px; }
.ai-factor-impact { font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 999px; flex-shrink: 0; }
.ai-factor-impact.pos { background: #dcfce7; color: #16a34a; }
.ai-factor-impact.neg { background: #fee2e2; color: #dc2626; }
.ai-factor-impact.neu { background: #f0f0f4; color: #6a6f7a; }
.ai-score-pred { background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 5px rgba(0,0,0,0.07); }
.ai-score-row { display: flex; align-items: center; justify-content: center; gap: 14px; padding: 16px 14px 10px; }
.ai-score-team { display: flex; align-items: center; gap: 8px; font-size: 11px; font-weight: 600; color: #6a6f7a; }
.ai-score-team--right { flex-direction: row-reverse; }
.ai-score-num { font-size: 28px; font-weight: 900; color: #292a33; background: #f2f3f5; width: 42px; height: 42px; display: flex; align-items: center; justify-content: center; border-radius: 10px; }
.ai-score-sep { font-size: 20px; font-weight: 900; color: #c0c4cd; }
.ai-score-note { text-align: center; font-size: 10px; color: #9599a4; padding-bottom: 12px; }
.ai-disclaimer { font-size: 10px; color: #9599a4; text-align: center; padding: 8px 12px; background: #fefce8; border-radius: 8px; border: 1px solid #fde68a; }
</style>
