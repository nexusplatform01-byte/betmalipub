<template>
  <div class="md-page">

    <!-- Header -->
    <div class="md-header">
      <button class="md-back" @click="$router.back()">
        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
      </button>
      <div class="md-header__league">
        <span>{{ match?.leagueName || 'Match Detail' }}</span>
      </div>
      <div v-if="match?.sport" class="md-header__sport">{{ match.sport }}</div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="md-loading">
      <div class="spinner"></div>
      <p>Loading match…</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="md-error">
      <p>{{ error }}</p>
      <button class="btn-retry" @click="loadMatch">Retry</button>
    </div>

    <template v-else-if="match">

      <!-- Hero -->
      <div class="md-hero">
        <div class="md-hero__teams">
          <div class="md-hero__side">
            <div class="md-hero__badge">{{ initials(match.home) }}</div>
            <span class="md-hero__name">{{ match.home }}</span>
          </div>
          <div class="md-hero__mid">
            <template v-if="liveData">
              <div class="md-hero__score">{{ liveData.homeScore }} – {{ liveData.awayScore }}</div>
              <div class="md-hero__live-badge">
                <span class="dot red"></span>{{ liveData.minute }}'
              </div>
            </template>
            <template v-else>
              <span class="md-hero__vs">VS</span>
              <span class="md-hero__time">{{ formattedTime }}</span>
            </template>
          </div>
          <div class="md-hero__side">
            <div class="md-hero__badge">{{ initials(match.away) }}</div>
            <span class="md-hero__name">{{ match.away }}</span>
          </div>
        </div>

        <!-- 1X2 hero odds -->
        <div class="md-hero__odds" v-if="home1x2">
          <button class="md-hero__odd" :class="{ selected: isSelected('1') }" @click="placeBet(match.home, home1x2!, '1')">
            <span class="md-hero__odd-label">1</span>
            <span class="md-hero__odd-val">{{ home1x2 }}</span>
          </button>
          <button v-if="draw1x2" class="md-hero__odd" :class="{ selected: isSelected('X') }" @click="placeBet('Draw', draw1x2!, 'X')">
            <span class="md-hero__odd-label">X</span>
            <span class="md-hero__odd-val">{{ draw1x2 }}</span>
          </button>
          <button class="md-hero__odd" :class="{ selected: isSelected('2') }" @click="placeBet(match.away, away1x2!, '2')">
            <span class="md-hero__odd-label">2</span>
            <span class="md-hero__odd-val">{{ away1x2 }}</span>
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
        <div v-if="!marketGroups.length" class="md-empty">No markets available</div>
        <div v-for="group in marketGroups" :key="group.id" class="md-group">
          <div class="md-group__head" @click="group.open = !group.open">
            <span class="md-group__title">{{ group.title }}</span>
            <span class="md-group__meta">{{ group.markets.length }} market{{ group.markets.length !== 1 ? 's' : '' }}
              <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14" :style="{ transform: group.open ? 'rotate(180deg)' : 'none', transition: '.2s' }"><path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/></svg>
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

      <!-- STATISTICS TAB -->
      <div v-if="activeTab === 'stats'" class="md-stats-tab">
        <template v-if="liveData">
          <div class="md-stat-live-header">
            <span class="live-dot-text"><span class="dot red"></span> LIVE {{ liveData.minute }}'</span>
            <span>{{ match.home }} {{ liveData.homeScore }} – {{ liveData.awayScore }} {{ match.away }}</span>
          </div>
          <div class="md-stat-row" v-for="stat in liveStats" :key="stat.label">
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
        </template>
        <template v-else>
          <div class="md-prematch-stats">
            <div class="prematch-block">
              <div class="prematch-icon">📅</div>
              <div class="prematch-title">{{ match.home }} vs {{ match.away }}</div>
              <div class="prematch-sub">{{ formattedTime }}</div>
            </div>
            <div class="prematch-odds-grid" v-if="home1x2">
              <div class="prematch-odds-row">
                <div class="prematch-odds-item">
                  <span class="prematch-odds-label">1 — {{ match.home }}</span>
                  <span class="prematch-odds-val">{{ home1x2 }}</span>
                </div>
                <div v-if="draw1x2" class="prematch-odds-item">
                  <span class="prematch-odds-label">X — Draw</span>
                  <span class="prematch-odds-val">{{ draw1x2 }}</span>
                </div>
                <div class="prematch-odds-item">
                  <span class="prematch-odds-label">2 — {{ match.away }}</span>
                  <span class="prematch-odds-val">{{ away1x2 }}</span>
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
import {
  fetchMatchDetail,
  fetchLiveEvents,
  parseMarketGroups,
  formatKickOff,
  type MarketGroup,
} from '@/services/topbetApi'

const route = useRoute()
const store = useAppStore()
const showBetslip = ref(false)
const activeTab = ref('markets')

const match = ref<any>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const marketGroups = ref<MarketGroup[]>([])
const liveData = ref<{ homeScore: number; awayScore: number; minute: number } | null>(null)

const matchId = computed(() => route.params.id as string)

const home1x2 = computed(() => match.value?.betMap?.['1']?.['NULL']?.ov ?? null)
const draw1x2 = computed(() => match.value?.betMap?.['2']?.['NULL']?.ov ?? null)
const away1x2 = computed(() => match.value?.betMap?.['3']?.['NULL']?.ov ?? null)
const totalMarkets = computed(() => Object.keys(match.value?.betMap || {}).length)

const formattedTime = computed(() => {
  if (!match.value?.kickOffTime) return ''
  return formatKickOff(match.value.kickOffTime)
})

const tabs = computed(() => [
  { id: 'markets', label: 'Markets', icon: '📋', count: totalMarkets.value || null },
  { id: 'stats',   label: 'Statistics', icon: '📊', count: null },
  { id: 'aichat',  label: 'AI Chat', icon: '🤖', count: null },
])

const liveStats = computed(() => {
  if (!liveData.value) return []
  const { homeScore, awayScore } = liveData.value
  const total = homeScore + awayScore || 1
  return [
    {
      label: 'Goals',
      home: String(homeScore),
      away: String(awayScore),
      homePct: Math.round((homeScore / total) * 100),
      awayPct: Math.round((awayScore / total) * 100),
    },
  ]
})

function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || '')
    .join('')
}

async function loadMatch() {
  loading.value = true
  error.value = null
  try {
    const data = await fetchMatchDetail(matchId.value)
    if (data?.status === 404 || data?.error) {
      error.value = 'Match not found'
      return
    }
    match.value = data
    marketGroups.value = parseMarketGroups(
      data.betMap || {},
      data.home || '',
      data.away || '',
    )
  } catch (e) {
    error.value = 'Failed to load match data'
    console.error('[MatchDetailView] load error:', e)
  } finally {
    loading.value = false
  }
}

async function checkLive() {
  try {
    const { matches } = await fetchLiveEvents()
    const m = matches.find((x) => x.id === matchId.value)
    if (m) {
      liveData.value = {
        homeScore: m.homeScore ?? 0,
        awayScore: m.awayScore ?? 0,
        minute: m.minute ?? 0,
      }
    }
  } catch (_) {}
}

onMounted(async () => {
  await Promise.all([loadMatch(), checkLive()])
})

function isSelected(key: string) {
  return store.betslip.some((b) => b.matchId === `${matchId.value}-${key}`)
}

function placeBet(team: string, odds: number, key: string) {
  if (!odds) return
  store.addToBetslip({
    matchId: `${matchId.value}-${key}`,
    baseMatchId: matchId.value,
    team,
    odds,
    market: key,
  })
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

/* header */
.md-header {
  display: flex;
  align-items: center;
  gap: 10px;
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
.md-group { background: #fff; overflow: hidden; margin-bottom: 6px; border-top: 1px solid #e6e7eb; border-bottom: 1px solid #e6e7eb; width: 100%; box-sizing: border-box; }
.md-group__head { display: flex; align-items: center; justify-content: space-between; padding: 11px 14px; cursor: pointer; border-bottom: 1px solid #f0f0f0; }
.md-group__title { font-size: 13px; font-weight: 700; color: #292a33; }
.md-group__meta { display: flex; align-items: center; gap: 3px; font-size: 11px; color: #6a6f7a; }
.md-market { padding: 10px 12px 12px; border-bottom: 1px solid #f4f4f6; box-sizing: border-box; width: 100%; }
.md-market:last-child { border-bottom: none; }
.md-market__name { font-size: 11px; font-weight: 600; color: #6a6f7a; margin-bottom: 7px; }
.md-market__odds { display: grid; gap: 6px; width: 100%; box-sizing: border-box; }
.md-market__odds.two-col   { grid-template-columns: 1fr 1fr; }
.md-market__odds.three-col { grid-template-columns: 1fr 1fr 1fr; }
.md-odd-btn { display: flex; flex-direction: column; align-items: center; padding: 8px 4px; background: #f2f3f5; border: 1.5px solid #e6e7eb; border-radius: 8px; cursor: pointer; transition: background .15s, border-color .15s; position: relative; }
.md-odd-btn.selected { background: rgba(192,38,211,.08); border-color: #c026d3; }
.md-odd-btn__label { font-size: 10px; color: #6a6f7a; font-weight: 500; }
.md-odd-btn__val { font-size: 14px; font-weight: 800; color: #292a33; }
.md-odd-btn.selected .md-odd-btn__val { color: #c026d3; }
.md-odd-btn.selected::after { content: '✓'; position: absolute; top: 2px; right: 4px; font-size: 8px; font-weight: 900; color: #c026d3; line-height: 1; }

/* statistics tab */
.md-stats-tab { padding: 12px 14px; }
.md-stat-live-header { background: #1e293b; color: #fff; border-radius: 8px; padding: 10px 14px; display: flex; justify-content: space-between; align-items: center; font-size: 12px; font-weight: 600; margin-bottom: 12px; }
.live-dot-text { display: flex; align-items: center; gap: 5px; color: #f87171; }
.md-stat-row { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
.md-stat-home, .md-stat-away { font-size: 12px; font-weight: 700; color: #292a33; min-width: 32px; }
.md-stat-away { text-align: right; }
.md-stat-bar-wrap { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 3px; }
.md-stat-bar { width: 100%; height: 5px; background: #e6e7eb; border-radius: 3px; display: flex; overflow: hidden; }
.md-stat-bar__fill { height: 100%; border-radius: 3px; transition: width .5s; }
.md-stat-bar__fill--home { background: #c026d3; }
.md-stat-bar__fill--away { background: #16a34a; }
.md-stat-label { font-size: 10px; color: #6a6f7a; font-weight: 500; }

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
</style>
