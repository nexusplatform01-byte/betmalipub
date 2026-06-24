<template>
  <div class="md-page">

    <!-- Header -->
    <div class="md-header">
      <button class="md-back" @click="$router.back()">
        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
      </button>
      <div class="md-header__league">
        <span>{{ storeMatch?.league || 'Match Detail' }}</span>
      </div>
      <div v-if="storeMatch?.sport" class="md-header__sport">{{ storeMatch.sport }}</div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="md-loading">
      <div class="spinner"></div>
      <p>Loading markets…</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="md-error">
      <p>{{ error }}</p>
      <button class="btn-retry" @click="loadMarkets">Retry</button>
    </div>

    <template v-else>

      <!-- Hero -->
      <div class="md-hero">
        <div class="md-hero__teams">
          <div class="md-hero__side">
            <div class="md-hero__badge">{{ initials(homeName) }}</div>
            <span class="md-hero__name">{{ homeName }}</span>
          </div>
          <div class="md-hero__mid">
            <template v-if="storeMatch?.isLive">
              <div class="md-hero__score">{{ storeMatch.homeScore ?? 0 }} – {{ storeMatch.awayScore ?? 0 }}</div>
              <div class="md-hero__live-badge">
                <span class="dot red"></span>{{ storeMatch.minute ? storeMatch.minute + '\'' : 'Live' }}
              </div>
            </template>
            <template v-else>
              <span class="md-hero__vs">VS</span>
              <span class="md-hero__time">{{ storeMatch?.startTime || '' }}</span>
            </template>
          </div>
          <div class="md-hero__side">
            <div class="md-hero__badge">{{ initials(awayName) }}</div>
            <span class="md-hero__name">{{ awayName }}</span>
          </div>
        </div>

        <!-- 1X2 hero odds from markets -->
        <div class="md-hero__odds" v-if="mainMarket">
          <button
            v-for="o in mainMarket.outcomes"
            :key="o.alias"
            class="md-hero__odd"
            :class="{ selected: isSelected(`1X2-${o.alias}`), locked: o.active !== 1 || mainMarket.status !== 0 }"
            @click="o.active === 1 && mainMarket.status === 0 && placeBet(o.alias, o.odds, `1X2-${o.alias}`)"
          >
            <span class="md-hero__odd-label">{{ o.alias }}</span>
            <span class="md-hero__odd-val">
              <span v-if="o.active !== 1 || mainMarket.status !== 0">🔒</span>
              <span v-else>{{ o.odds }}</span>
            </span>
          </button>
        </div>
      </div>

      <!-- Tabs -->
      <div class="md-tabs">
        <button v-for="tab in tabs" :key="tab.id" class="md-tab" :class="{ active: activeTab === tab.id }" @click="activeTab = tab.id">
          <span class="md-tab__icon">{{ tab.icon }}</span>
          {{ tab.label }}
          <span v-if="tab.count" class="md-tab__count">({{ tab.count }})</span>
        </button>
      </div>

      <!-- MARKETS TAB -->
      <div v-if="activeTab === 'markets'" class="md-markets">
        <div v-if="!sortedMarkets.length" class="md-empty">No markets available for this match.</div>

        <div v-for="(mkt, idx) in sortedMarkets" :key="`${mkt.market_id}-${idx}`" class="md-group">
          <!-- accordion header -->
          <div class="md-group__head" @click="toggleGroup(`${mkt.market_id}-${idx}`)">
            <div class="md-group__title-wrap">
              <span class="md-group__title">{{ mkt.market_name }}</span>
              <span v-if="mkt.status !== 0" class="md-group__suspended">Suspended</span>
            </div>
            <span class="md-group__meta">
              {{ (mkt.outcomes || []).length }} outcome{{ (mkt.outcomes || []).length !== 1 ? 's' : '' }}
              <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"
                :style="{ transform: openGroups[`${mkt.market_id}-${idx}`] ? 'rotate(180deg)' : 'none', transition: '.2s' }">
                <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/>
              </svg>
            </span>
          </div>

          <!-- outcomes -->
          <div v-if="openGroups[`${mkt.market_id}-${idx}`] && (mkt.outcomes || []).length" class="md-market">
            <div class="md-market__odds" :class="gridClass((mkt.outcomes || []).length)">
              <button
                v-for="o in (mkt.outcomes || [])"
                :key="o.outcome_id"
                class="md-odd-btn"
                :class="{
                  selected: isSelected(`${mkt.market_id}-${o.outcome_id}`),
                  locked: o.active !== 1 || mkt.status !== 0,
                }"
                @click="o.active === 1 && mkt.status === 0 && placeBet(o.alias, o.odds, `${mkt.market_id}-${o.outcome_id}`)"
              >
                <span class="md-odd-btn__label">{{ o.alias }}</span>
                <span class="md-odd-btn__val">
                  <span v-if="o.active !== 1 || mkt.status !== 0" class="md-lock">🔒</span>
                  <span v-else>{{ o.odds }}</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- STATISTICS TAB -->
      <div v-if="activeTab === 'stats'" class="md-stats-tab">
        <template v-if="storeMatch?.isLive">
          <div class="md-stat-live-header">
            <span class="live-dot-text"><span class="dot red"></span> LIVE {{ storeMatch.minute }}'</span>
            <span>{{ homeName }} {{ storeMatch.homeScore }} – {{ storeMatch.awayScore }} {{ awayName }}</span>
          </div>
        </template>
        <template v-else>
          <div class="md-prematch-stats">
            <div class="prematch-block">
              <div class="prematch-icon">📅</div>
              <div class="prematch-title">{{ homeName }} vs {{ awayName }}</div>
              <div class="prematch-sub">{{ storeMatch?.startTime || '' }}</div>
            </div>
            <div class="prematch-odds-grid" v-if="mainMarket">
              <div class="prematch-odds-row">
                <div v-for="o in mainMarket.outcomes" :key="o.alias" class="prematch-odds-item">
                  <span class="prematch-odds-label">{{ o.alias }}</span>
                  <span class="prematch-odds-val">
                    <span v-if="o.active !== 1">🔒</span>
                    <span v-else>{{ o.odds }}</span>
                  </span>
                </div>
              </div>
            </div>
            <div class="prematch-note">Live statistics will appear once the match kicks off.</div>
          </div>
        </template>
      </div>

      <!-- AI CHAT TAB -->
      <div v-if="activeTab === 'aichat'" class="md-aichat">
        <div class="md-aichat__icon">🤖</div>
        <p>AI match analysis coming soon</p>
      </div>

    </template>

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
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores/app'
import BottomNav from '@/components/BottomNav.vue'
import { fetchBandaMatchDetail, type BandaMarket } from '@/services/topbetApi'

const route = useRoute()
const store = useAppStore()
const showBetslip = ref(false)
const activeTab = ref('markets')

const matchId = computed(() => route.params.id as string)

const storeMatch = computed(() => {
  const id = matchId.value
  return (
    store.boostedMatches.find((m) => m.id === id) ||
    store.liveMatches.find((m) => m.id === id) ||
    (store as any).topMatches?.find((m: any) => m.id === id) ||
    null
  )
})

const homeName = computed(() => storeMatch.value?.homeTeam || 'Home')
const awayName = computed(() => storeMatch.value?.awayTeam || 'Away')

const markets = ref<BandaMarket[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const openGroups = ref<Record<string, boolean>>({})

function priorityScore(mkt: BandaMarket): number {
  const n = mkt.market_name.toLowerCase()
  if (mkt.market_id === 2 || n === '1 x 2') return 0
  if (n.includes('double chance')) return 1
  if ((n.includes('over') || n.includes('under')) && n.includes('2.5')) return 2
  if (n.includes('over') && n.includes('under')) return 3
  if (n.includes('both teams') || n.includes('btts')) return 4
  if (n.includes('half') && n.includes('full')) return 5
  if (n.includes('1st half') || n.includes('first half') || (n.includes('half') && n.includes('time'))) return 6
  if (n.includes('goalscorer') || n.includes('goal scorer') || n.includes('anytime')) return 50
  if (n.includes('card')) return 30
  if (n.includes('corner')) return 35
  return 20 + mkt.market_id
}

const sortedMarkets = computed<BandaMarket[]>(() =>
  markets.value
    .filter((m) => m.status === 0 && (m.outcomes || []).some((o) => o.active === 1))
    .sort((a, b) => priorityScore(a) - priorityScore(b))
)

const mainMarket = computed(() => sortedMarkets.value.find((m) => m.market_id === 2) || sortedMarkets.value[0] || null)

const totalMarkets = computed(() => sortedMarkets.value.length)

const tabs = computed(() => [
  { id: 'markets', label: 'Markets', icon: '📋', count: totalMarkets.value || null },
  { id: 'stats',   label: 'Statistics', icon: '📊', count: null },
  { id: 'aichat',  label: 'AI Chat', icon: '🤖', count: null },
])

function gridClass(count: number): string {
  if (count <= 2) return 'two-col'
  if (count === 3) return 'three-col'
  if (count === 4) return 'four-col'
  return 'multi-col'
}

function toggleGroup(key: string) {
  openGroups.value[key] = !openGroups.value[key]
}

function initials(name: string): string {
  return name.split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() || '').join('')
}

async function loadMarkets() {
  loading.value = true
  error.value = null
  try {
    markets.value = await fetchBandaMatchDetail(matchId.value)
    sortedMarkets.value.forEach((m, i) => {
      openGroups.value[`${m.market_id}-${i}`] = true
    })
  } catch {
    error.value = 'Failed to load markets. Please try again.'
  } finally {
    loading.value = false
  }
}

function isSelected(key: string) {
  return store.betslip.some((b) => b.matchId === `${matchId.value}-${key}`)
}

function placeBet(label: string, odds: number, key: string) {
  if (!odds || odds <= 0) return
  store.addToBetslip({
    matchId: `${matchId.value}-${key}`,
    baseMatchId: matchId.value,
    team: label,
    odds,
    market: key,
  })
}

onMounted(() => {
  loadMarkets()
})
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

/* header */
.md-header {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 14px;
  background: linear-gradient(135deg, #c026d3, #a21caf);
  color: #fff;
}
.md-back { background: none; border: none; color: #fff; cursor: pointer; display: flex; align-items: center; padding: 0; }
.md-header__league { flex: 1; font-size: 13px; font-weight: 600; }
.md-header__sport { font-size: 11px; opacity: .75; }

/* loading / error */
.md-loading { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 80px 20px; gap: 12px; color: #6a6f7a; }
.spinner { width: 32px; height: 32px; border: 3px solid #e6e7eb; border-top-color: #c026d3; border-radius: 50%; animation: spin .7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.md-error { text-align: center; padding: 60px 20px; color: #e53e3e; }
.btn-retry { margin-top: 12px; padding: 8px 20px; background: #c026d3; color: #fff; border: none; border-radius: 8px; cursor: pointer; font-size: 13px; }

/* hero */
.md-hero {
  background:
    linear-gradient(160deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 100%),
    url('https://www.shutterstock.com/shutterstock/videos/3745993915/thumb/1.jpg') center/cover no-repeat;
  padding: 16px 14px 14px;
  color: #fff;
}
.md-hero__teams { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 14px; }
.md-hero__side { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 6px; }
.md-hero__badge { width: 36px; height: 36px; border-radius: 8px; background: rgba(255,255,255,.22); display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 900; color: #fff; border: 1.5px solid rgba(255,255,255,.35); }
.md-hero__name { font-size: 11px; font-weight: 700; text-align: center; line-height: 1.3; color: rgba(255,255,255,.95); }
.md-hero__mid { display: flex; flex-direction: column; align-items: center; gap: 4px; padding-top: 4px; }
.md-hero__vs { font-size: 14px; font-weight: 900; color: #fff; }
.md-hero__time { font-size: 10px; color: rgba(255,255,255,.75); background: rgba(0,0,0,.18); border-radius: 4px; padding: 1px 6px; }
.md-hero__score { font-size: 22px; font-weight: 900; color: #fff; letter-spacing: 1px; }
.md-hero__live-badge { display: flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 700; color: #fff; }

.dot { width: 7px; height: 7px; border-radius: 50%; display: inline-block; }
.dot.red { background: #ef4444; animation: pulse 1.4s infinite; }
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }

/* hero odds */
.md-hero__odds { display: flex; gap: 8px; }
.md-hero__odd { flex: 1; background: rgba(192,38,211,.28); border: 1.5px solid rgba(217,70,239,.55); border-radius: 8px; display: flex; flex-direction: column; align-items: center; padding: 6px 4px; cursor: pointer; color: #fff; transition: background .15s, border-color .15s; }
.md-hero__odd.selected { background: rgba(192,38,211,.7); border-color: #e879f9; }
.md-hero__odd.locked { opacity: .55; cursor: not-allowed; }
.md-hero__odd-label { font-size: 10px; font-weight: 600; opacity: .8; }
.md-hero__odd-val { font-size: 15px; font-weight: 800; }

/* tabs */
.md-tabs { display: flex; background: #fff; border-bottom: 1px solid #e6e7eb; overflow-x: auto; }
.md-tab { flex: 1; display: flex; align-items: center; justify-content: center; gap: 4px; padding: 11px 6px; font-size: 11px; font-weight: 600; color: #6a6f7a; background: none; border: none; cursor: pointer; border-bottom: 2.5px solid transparent; white-space: nowrap; transition: color .15s, border-color .15s; }
.md-tab.active { color: #c026d3; border-bottom-color: #c026d3; }
.md-tab__icon { font-size: 13px; }
.md-tab__count { font-size: 10px; color: inherit; opacity: .7; }

/* markets */
.md-markets { padding: 0; box-sizing: border-box; width: 100%; }
.md-empty { text-align: center; padding: 40px; color: #9ca3af; font-size: 13px; }

.md-group { background: #fff; overflow: hidden; margin-bottom: 4px; border-top: 1px solid #e6e7eb; border-bottom: 1px solid #e6e7eb; width: 100%; box-sizing: border-box; }
.md-group__head { display: flex; align-items: center; justify-content: space-between; padding: 11px 14px; cursor: pointer; user-select: none; }
.md-group__head:hover { background: #fafbfd; }
.md-group__title-wrap { display: flex; align-items: center; gap: 8px; min-width: 0; }
.md-group__title { font-size: 13px; font-weight: 700; color: #292a33; }
.md-group__suspended { font-size: 9px; font-weight: 800; background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; border-radius: 4px; padding: 1px 5px; letter-spacing: .4px; flex-shrink: 0; }
.md-group__meta { display: flex; align-items: center; gap: 3px; font-size: 11px; color: #6a6f7a; flex-shrink: 0; }

.md-market { padding: 10px 12px 14px; box-sizing: border-box; width: 100%; border-top: 1px solid #f4f4f6; }
.md-market__odds { display: grid; gap: 6px; width: 100%; box-sizing: border-box; }
.md-market__odds.two-col   { grid-template-columns: 1fr 1fr; }
.md-market__odds.three-col { grid-template-columns: 1fr 1fr 1fr; }
.md-market__odds.four-col  { grid-template-columns: 1fr 1fr 1fr 1fr; }
.md-market__odds.multi-col { grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); }

.md-odd-btn {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 8px 6px; min-height: 46px;
  background: #f2f3f5; border: 1.5px solid #e6e7eb; border-radius: 8px;
  cursor: pointer; transition: background .15s, border-color .15s;
  position: relative; width: 100%;
}
.md-odd-btn.selected { background: rgba(192,38,211,.08); border-color: #c026d3; }
.md-odd-btn.selected::after { content: '✓'; position: absolute; top: 3px; right: 5px; font-size: 8px; font-weight: 900; color: #c026d3; }
.md-odd-btn.locked { opacity: .5; cursor: not-allowed; background: #f8f8f9; }
.md-odd-btn__label { font-size: 10px; color: #6a6f7a; font-weight: 500; text-align: center; line-height: 1.2; margin-bottom: 2px; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.md-odd-btn__val { font-size: 14px; font-weight: 800; color: #292a33; }
.md-odd-btn.selected .md-odd-btn__val { color: #c026d3; }
.md-lock { font-size: 14px; line-height: 1; }

/* statistics tab */
.md-stats-tab { padding: 12px 14px; }
.md-stat-live-header { background: #1e293b; color: #fff; border-radius: 8px; padding: 10px 14px; display: flex; justify-content: space-between; align-items: center; font-size: 12px; font-weight: 600; margin-bottom: 12px; }
.live-dot-text { display: flex; align-items: center; gap: 5px; color: #f87171; }

/* pre-match stats */
.md-prematch-stats { display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 20px 0; }
.prematch-block { text-align: center; }
.prematch-icon { font-size: 40px; margin-bottom: 6px; }
.prematch-title { font-size: 15px; font-weight: 700; color: #292a33; }
.prematch-sub { font-size: 12px; color: #6a6f7a; margin-top: 2px; }
.prematch-odds-grid { width: 100%; background: #fff; border-radius: 10px; padding: 14px; box-shadow: 0 1px 4px rgba(0,0,0,.06); }
.prematch-odds-row { display: flex; gap: 10px; }
.prematch-odds-item { flex: 1; background: #f2f3f5; border-radius: 8px; padding: 10px 6px; text-align: center; }
.prematch-odds-label { display: block; font-size: 10px; color: #6a6f7a; margin-bottom: 4px; }
.prematch-odds-val { font-size: 16px; font-weight: 800; color: #292a33; }
.prematch-note { font-size: 11px; color: #9ca3af; text-align: center; padding: 0 20px; }

/* ai chat */
.md-aichat { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 20px; color: #6a6f7a; gap: 10px; }
.md-aichat__icon { font-size: 48px; }
.md-aichat p { font-size: 14px; }

/* modal */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.5); z-index: 200; display: flex; align-items: flex-end; justify-content: center; }
.modal { background: #fff; width: 100%; max-width: 480px; border-radius: 16px 16px 0 0; padding: 20px 16px; max-height: 70vh; overflow-y: auto; }
.modal__close { position: absolute; top: 14px; right: 16px; background: none; border: none; font-size: 18px; cursor: pointer; color: #6a6f7a; }
.modal__title { font-size: 16px; font-weight: 800; color: #292a33; margin-bottom: 12px; }
.btn-full { width: 100%; padding: 13px; background: linear-gradient(135deg, #c026d3, #a21caf); color: #fff; border: none; border-radius: 10px; font-size: 14px; font-weight: 800; cursor: pointer; }
</style>
