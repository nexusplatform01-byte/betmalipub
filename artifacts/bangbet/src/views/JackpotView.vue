<template>
  <div class="page jp-page">
    <AppHeader />

    <div class="page-title-bar">
      <button class="back-btn" @click="$router.back()">←</button>
      <span class="page-title">🏆 Sports Jackpot</span>
    </div>

    <!-- Spinning jackpot pool (same as homepage) -->
    <JackpotSection />

    <!-- Tier selector tabs -->
    <div class="jpt-tabs-wrap">
      <div class="jpt-tabs">
        <button
          v-for="t in tiers" :key="t.id"
          class="jpt-tab"
          :class="[`jpt-tab--${t.id}`, { 'jpt-tab--active': activeTier === t.id }]"
          @click="activeTier = t.id"
        >
          <span class="jpt-tab__medal">{{ t.medal }}</span>
          <div class="jpt-tab__text">
            <span class="jpt-tab__name">{{ t.name }}</span>
            <span class="jpt-tab__stake">UGX {{ t.stake.toLocaleString() }}</span>
          </div>
          <span v-if="betPlaced[t.id]" class="jpt-tab__pill">✓</span>
        </button>
      </div>
    </div>

    <!-- Per-tier panels -->
    <template v-for="t in tiers" :key="'panel-'+t.id">
      <div v-show="activeTier === t.id" class="jpt-panel" :data-tier="t.id">

        <!-- 3-col desktop layout wrapper -->
        <div class="jpt-desktop-layout">

          <!-- ══ LEFT SIDEBAR ══ -->
          <aside class="jpt-sidebar jpt-sidebar--left">

            <!-- Tier hero card -->
            <div class="jpt-sb-card jpt-sb-hero-card" :class="`jpt-sb-hero-card--${t.id}`">
              <div class="jpt-sb-hero-card__medal">{{ t.medal }}</div>
              <div class="jpt-sb-hero-card__name">{{ t.name }} JACKPOT</div>
              <div class="jpt-sb-hero-card__prize">{{ t.prizeDisplay }}</div>
              <div class="jpt-sb-hero-card__stake">Entry: UGX {{ t.stake.toLocaleString() }}</div>
              <div class="jpt-sb-cdown-mini">
                <div class="jpt-sb-cdown-mini__lbl">⏱ Closes in</div>
                <div class="jpt-sb-cdown-mini__vals">
                  <span class="jpt-sb-cdown-mini__block">{{ cd[t.id].h }}<small>h</small></span>
                  <span class="jpt-sb-cdown-mini__sep">:</span>
                  <span class="jpt-sb-cdown-mini__block">{{ cd[t.id].m }}<small>m</small></span>
                  <span class="jpt-sb-cdown-mini__sep">:</span>
                  <span class="jpt-sb-cdown-mini__block">{{ cd[t.id].s }}<small>s</small></span>
                </div>
              </div>
            </div>

            <!-- Pick progress -->
            <div class="jpt-sb-card">
              <div class="jpt-sb-card__hdr">🎯 Your Picks</div>
              <div class="jpt-sb-picks-progress">
                <div class="jpt-sb-picks-count">
                  <strong :class="picksCount(t.id) === 12 ? 'jpt-done' : ''">{{ picksCount(t.id) }}</strong>
                  <span> / 12 selected</span>
                </div>
                <div class="jpt-progress__track">
                  <div class="jpt-progress__fill" :class="`jpt-progress__fill--${t.id}`"
                    :style="{ width: (picksCount(t.id)/12*100) + '%' }"></div>
                </div>
              </div>
              <!-- Mini picks list -->
              <div class="jpt-sb-pick-list">
                <div
                  v-for="(match, idx) in t.matches" :key="match.id"
                  class="jpt-sb-pick-item"
                  :class="{ 'jpt-sb-pick-item--done': picks[t.id][idx] !== null }"
                >
                  <span class="jpt-sb-pick-item__num">{{ idx + 1 }}</span>
                  <span class="jpt-sb-pick-item__team">{{ match.home }} v {{ match.away }}</span>
                  <span class="jpt-sb-pick-item__val" :class="`jpt-sb-pick-item__val--${t.id}`">
                    {{ picks[t.id][idx] ?? '—' }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Quick actions -->
            <div class="jpt-sb-card">
              <div class="jpt-sb-card__hdr">⚡ Quick Actions</div>
              <div class="jpt-sb-actions">
                <button class="jpt-sb-action-btn" :disabled="betPlaced[t.id]" @click="autoPick(t.id, t.matches)">🎲 Auto Pick All</button>
                <button class="jpt-sb-action-btn jpt-sb-action-btn--clear" :disabled="betPlaced[t.id]" @click="clearPicks(t.id)">✕ Clear Picks</button>
              </div>
            </div>

            <!-- Bet / place button -->
            <div class="jpt-sb-card">
              <div class="jpt-sb-card__hdr">💰 Your Bet</div>
              <div class="jpt-sb-bet-body">
                <template v-if="results[t.id]">
                  <div class="jpt-result" :class="results[t.id]!.won ? 'jpt-result--win' : 'jpt-result--loss'">
                    <div class="jpt-result__icon">{{ results[t.id]!.won ? '🎉' : '😔' }}</div>
                    <div class="jpt-result__title">{{ results[t.id]!.won ? 'JACKPOT WON!' : 'Better luck next time!' }}</div>
                    <div v-if="results[t.id]!.won" class="jpt-result__prize">{{ t.prizeDisplay }}</div>
                    <div class="jpt-result__sub">
                      {{ results[t.id]!.won ? 'Prize credited!' : `${results[t.id]!.correct}/12 correct.` }}
                    </div>
                  </div>
                </template>
                <template v-else-if="betPlaced[t.id]">
                  <div class="jpt-sb-confirmed">
                    <div class="jpt-sb-confirmed__icon">🎟</div>
                    <div class="jpt-sb-confirmed__title">Entry Confirmed!</div>
                    <div class="jpt-sb-confirmed__sub">Awaiting results when jackpot closes.</div>
                    <div class="jpt-sb-confirmed__stake">Paid: <strong>UGX {{ t.stake.toLocaleString() }}</strong></div>
                  </div>
                </template>
                <template v-else>
                  <div class="jpt-sb-bet-row">
                    <span class="jpt-sb-bet-lbl">Fixed Stake</span>
                    <span class="jpt-sb-bet-val">UGX {{ t.stake.toLocaleString() }}</span>
                  </div>
                  <div class="jpt-sb-bet-row">
                    <span class="jpt-sb-bet-lbl">Prize Pool</span>
                    <span class="jpt-sb-bet-val" style="font-size:11px">{{ t.prizeDisplay }}</span>
                  </div>
                  <div class="jpt-sb-bet-row">
                    <span class="jpt-sb-bet-lbl">Picks</span>
                    <span class="jpt-sb-bet-val" :class="picksCount(t.id) === 12 ? 'jpt-done' : ''">{{ picksCount(t.id) }}/12</span>
                  </div>
                  <button
                    class="jpt-btn jpt-sb-play-btn"
                    :class="[`jpt-btn--${t.id}`, { 'jpt-btn--disabled': picksCount(t.id) < 12 }]"
                    :disabled="picksCount(t.id) < 12"
                    @click="placeBet(t.id, t)"
                  >
                    <template v-if="!store.isLoggedIn">🔐 Login to Play</template>
                    <template v-else-if="picksCount(t.id) < 12">
                      Pick {{ 12 - picksCount(t.id) }} more
                    </template>
                    <template v-else>🎰 Play Now</template>
                  </button>
                </template>
              </div>
            </div>

          </aside>

          <!-- ══ CENTER: match table ══ -->
          <div class="jpt-main">

            <!-- Mobile hero (hidden on desktop, shown on mobile) -->
            <div class="jpt-hero jpt-hero--mobile" :class="`jpt-hero--${t.id}`">
              <div class="jpt-hero__prize-col">
                <div class="jpt-hero__badge">{{ t.name }} JACKPOT</div>
                <div class="jpt-hero__prize">{{ t.prizeDisplay }}</div>
                <div class="jpt-hero__matches-badge">12 Matches · 1X2 Only</div>
                <div class="jpt-hero__stake-tag">
                  <span class="jpt-hero__stake-lbl">Fixed Entry Stake</span>
                  <span class="jpt-hero__stake-val">UGX {{ t.stake.toLocaleString() }}</span>
                </div>
              </div>
              <div class="jpt-hero__cdown-col">
                <div class="jpt-hero__cdown-lbl">⏱ Jackpot closes in</div>
                <div class="jpt-cdown" :class="`jpt-cdown--${t.id}`">
                  <div class="jpt-cdown__block">
                    <span class="jpt-cdown__val">{{ cd[t.id].h }}</span>
                    <span class="jpt-cdown__unit">HRS</span>
                  </div>
                  <span class="jpt-cdown__sep">:</span>
                  <div class="jpt-cdown__block">
                    <span class="jpt-cdown__val">{{ cd[t.id].m }}</span>
                    <span class="jpt-cdown__unit">MIN</span>
                  </div>
                  <span class="jpt-cdown__sep">:</span>
                  <div class="jpt-cdown__block">
                    <span class="jpt-cdown__val">{{ cd[t.id].s }}</span>
                    <span class="jpt-cdown__unit">SEC</span>
                  </div>
                </div>
                <div class="jpt-cdown__note">Last match ends {{ t.lastMatchDisplay }}</div>
              </div>
            </div>

            <!-- Mobile progress -->
            <div class="jpt-progress jpt-progress--mobile">
              <div class="jpt-progress__row">
                <span class="jpt-progress__count"><strong>{{ picksCount(t.id) }}</strong>/12 picks made</span>
                <span v-if="picksCount(t.id) < 12" class="jpt-progress__hint">{{ 12 - picksCount(t.id) }} more to go</span>
                <span v-else class="jpt-progress__done">✓ All picks done!</span>
              </div>
              <div class="jpt-progress__track">
                <div class="jpt-progress__fill" :class="`jpt-progress__fill--${t.id}`"
                  :style="{ width: (picksCount(t.id)/12*100) + '%' }"></div>
              </div>
            </div>

            <!-- Loading state -->
            <div v-if="loading" class="jpt-loading">
              <div class="jpt-loading__spinner">⚽</div>
              <div class="jpt-loading__txt">Loading real matches...</div>
            </div>

            <!-- Match table -->
            <div v-else class="jpt-table">
              <div class="jpt-table__hdr" :class="`jpt-table__hdr--${t.id}`">
                <div class="jpt-th jpt-th--num">#</div>
                <div class="jpt-th jpt-th--info">Match</div>
                <div class="jpt-th jpt-th--odd">1</div>
                <div class="jpt-th jpt-th--odd">X</div>
                <div class="jpt-th jpt-th--odd">2</div>
              </div>
              <div
                v-for="(match, idx) in t.matches" :key="match.id"
                class="jpt-row"
                :class="{ 'jpt-row--picked': picks[t.id][idx] !== null }"
              >
                <div class="jpt-row__num">{{ idx + 1 }}</div>
                <div class="jpt-row__info">
                  <div class="jpt-row__league">{{ match.league }}</div>
                  <div class="jpt-row__teams">
                    <span class="jpt-row__team">{{ match.home }}</span>
                    <span class="jpt-row__vs">vs</span>
                    <span class="jpt-row__team">{{ match.away }}</span>
                  </div>
                  <div class="jpt-row__time">{{ match.time }}</div>
                </div>
                <button class="jpt-odd" :class="{ 'jpt-odd--active': picks[t.id][idx] === '1' }"
                  :disabled="betPlaced[t.id]" @click="setPick(t.id, idx, '1')">{{ match.odds[0] }}</button>
                <button class="jpt-odd" :class="{ 'jpt-odd--active': picks[t.id][idx] === 'X' }"
                  :disabled="betPlaced[t.id]" @click="setPick(t.id, idx, 'X')">{{ match.odds[1] }}</button>
                <button class="jpt-odd" :class="{ 'jpt-odd--active': picks[t.id][idx] === '2' }"
                  :disabled="betPlaced[t.id]" @click="setPick(t.id, idx, '2')">{{ match.odds[2] }}</button>
              </div>
            </div>

            <!-- Mobile footer -->
            <div class="jpt-footer jpt-footer--mobile">
              <template v-if="results[t.id]">
                <div class="jpt-result" :class="results[t.id]!.won ? 'jpt-result--win' : 'jpt-result--loss'">
                  <div class="jpt-result__icon">{{ results[t.id]!.won ? '🎉' : '😔' }}</div>
                  <div class="jpt-result__title">{{ results[t.id]!.won ? '🏆 JACKPOT WON!' : 'Better luck next time!' }}</div>
                  <div v-if="results[t.id]!.won" class="jpt-result__prize">{{ t.prizeDisplay }}</div>
                  <div class="jpt-result__sub">
                    {{ results[t.id]!.won ? 'Prize credited!' : `You got ${results[t.id]!.correct} out of 12 correct.` }}
                  </div>
                </div>
              </template>
              <template v-else-if="betPlaced[t.id]">
                <div class="jpt-waiting">
                  <div class="jpt-waiting__icon">🎟</div>
                  <div class="jpt-waiting__title">Entry Confirmed!</div>
                  <div class="jpt-waiting__sub">Awaiting results when the jackpot closes.</div>
                  <div class="jpt-waiting__stake">Stake paid: <strong>UGX {{ t.stake.toLocaleString() }}</strong></div>
                </div>
              </template>
              <template v-else>
                <div class="jpt-footer__summary">
                  <div class="jpt-footer__picks-info">
                    <span class="jpt-footer__picks-count">{{ picksCount(t.id) }}/12 picks</span>
                    <span class="jpt-footer__picks-dot">·</span>
                    <span class="jpt-footer__picks-note">{{ picksCount(t.id) < 12 ? 'Select all to play' : 'Ready!' }}</span>
                  </div>
                  <div class="jpt-footer__stake-display">Stake: <strong>UGX {{ t.stake.toLocaleString() }}</strong></div>
                </div>
                <button class="jpt-btn" :class="[`jpt-btn--${t.id}`, { 'jpt-btn--disabled': picksCount(t.id) < 12 }]"
                  :disabled="picksCount(t.id) < 12" @click="placeBet(t.id, t)">
                  <template v-if="!store.isLoggedIn">🔐 Login to Play</template>
                  <template v-else-if="picksCount(t.id) < 12">Select {{ 12 - picksCount(t.id) }} more match{{ 12 - picksCount(t.id) !== 1 ? 'es' : '' }}</template>
                  <template v-else>🎰 Play {{ t.name }} Jackpot — UGX {{ t.stake.toLocaleString() }}</template>
                </button>
              </template>
            </div>

          </div><!-- end jpt-main -->

          <!-- ══ RIGHT SIDEBAR ══ -->
          <aside class="jpt-sidebar jpt-sidebar--right">

            <!-- All prize pools -->
            <div class="jpt-sb-card">
              <div class="jpt-sb-card__hdr">🏆 Prize Pools</div>
              <div class="jpt-sb-prize-list">
                <div v-for="tier in tiers" :key="tier.id" class="jpt-sb-prize-row" :class="`jpt-sb-prize-row--${tier.id}`"
                  @click="activeTier = tier.id">
                  <span class="jpt-sb-prize-row__medal">{{ tier.medal }}</span>
                  <div class="jpt-sb-prize-row__info">
                    <span class="jpt-sb-prize-row__name">{{ tier.name }}</span>
                    <span class="jpt-sb-prize-row__stake">UGX {{ tier.stake.toLocaleString() }} entry</span>
                  </div>
                  <span class="jpt-sb-prize-row__amount">{{ tier.prizeDisplay.replace('UGX ', '') }}</span>
                </div>
              </div>
            </div>

            <!-- How to play -->
            <div class="jpt-sb-card">
              <div class="jpt-sb-card__hdr">📖 How to Play</div>
              <ol class="jpt-sb-steps">
                <li class="jpt-sb-step"><span class="jpt-sb-step__num">1</span><span>Pick your jackpot tier</span></li>
                <li class="jpt-sb-step"><span class="jpt-sb-step__num">2</span><span>Predict 1, X or 2 for all <strong>12 matches</strong></span></li>
                <li class="jpt-sb-step"><span class="jpt-sb-step__num">3</span><span>Pay the fixed stake &amp; confirm</span></li>
                <li class="jpt-sb-step"><span class="jpt-sb-step__num">4</span><span>Get all 12 right → <strong>WIN!</strong></span></li>
              </ol>
              <div class="jpt-sb-note">💡 11 correct = 50% prize · 10 correct = 20% prize</div>
            </div>

            <!-- Recent winners -->
            <div class="jpt-sb-card">
              <div class="jpt-sb-card__hdr">🎉 Recent Winners</div>
              <div class="jpt-sb-winner" v-for="w in recentWinners" :key="w.name">
                <div class="jpt-sb-winner__avatar">{{ w.avatar }}</div>
                <div class="jpt-sb-winner__info">
                  <div class="jpt-sb-winner__name">{{ w.name }}</div>
                  <div class="jpt-sb-winner__tier">{{ w.tier }} · {{ w.date }}</div>
                </div>
                <div class="jpt-sb-winner__prize">{{ w.prize }}</div>
              </div>
            </div>

            <!-- Entry stats -->
            <div class="jpt-sb-card">
              <div class="jpt-sb-card__hdr">📊 Today's Entries</div>
              <div class="jpt-sb-stats">
                <div class="jpt-sb-stat"><span class="jpt-sb-stat__val">4,821</span><span class="jpt-sb-stat__lbl">Total entries</span></div>
                <div class="jpt-sb-stat"><span class="jpt-sb-stat__val">{{ picksCount(t.id) }}/12</span><span class="jpt-sb-stat__lbl">Your picks</span></div>
                <div class="jpt-sb-stat"><span class="jpt-sb-stat__val">3</span><span class="jpt-sb-stat__lbl">Today's winners</span></div>
                <div class="jpt-sb-stat"><span class="jpt-sb-stat__val">12</span><span class="jpt-sb-stat__lbl">Matches today</span></div>
              </div>
            </div>

          </aside>

        </div><!-- end jpt-desktop-layout -->

      </div>
    </template>

    <div style="height: 70px"></div>
    <BottomNav />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import { useAppStore } from '@/stores/app';
import AppHeader from '@/components/AppHeader.vue';
import BottomNav from '@/components/BottomNav.vue';
import JackpotSection from '@/components/JackpotSection.vue';
import { fetchHighlightMatches, type Match } from '@/services/topbetApi';

const store = useAppStore();
const activeTier = ref('gold');
const loading = ref(true);

// ─── Types ───────────────────────────────────────────────
interface JpMatch {
  id: string;
  league: string;
  home: string;
  away: string;
  time: string;
  odds: [number, number, number];
}

interface JpTier {
  id: string;
  name: string;
  medal: string;
  stake: number;
  prizeDisplay: string;
  lastMatchDisplay: string;
  endsAt: number;
  matches: JpMatch[];
}

interface CdState { h: string; m: string; s: string; done: boolean; }
interface ResultState { won: boolean; correct: number; }

// ─── Helpers ─────────────────────────────────────────────
function todayAt(h: number, m: number): number {
  const d = new Date();
  d.setHours(h, m, 0, 0);
  if (d.getTime() <= Date.now()) d.setDate(d.getDate() + 1);
  return d.getTime();
}

function pad(n: number) { return String(n).padStart(2, '0'); }

function fmtCountdown(endsAt: number): CdState {
  const diff = Math.max(0, endsAt - Date.now());
  if (diff === 0) return { h: '00', m: '00', s: '00', done: true };
  const totalSec = Math.floor(diff / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return { h: pad(h), m: pad(m), s: pad(s), done: false };
}

// ─── Tier metadata (matches loaded from API) ──────────────
const TIER_DEFS = [
  { id: 'gold',    name: 'GOLD',    medal: '🥇', stake: 10_000, prizeDisplay: 'UGX 856,241,337', lastMatchDisplay: 'Today 21:30', endsAt: todayAt(21, 30) },
  { id: 'silver',  name: 'SILVER',  medal: '🥈', stake: 8_500,  prizeDisplay: 'UGX 432,817,658', lastMatchDisplay: 'Today 19:30', endsAt: todayAt(19, 30) },
  { id: 'bronze',  name: 'BRONZE',  medal: '🥉', stake: 5_000,  prizeDisplay: 'UGX 287,542,110', lastMatchDisplay: 'Today 22:30', endsAt: todayAt(22, 30) },
  { id: 'premium', name: 'PREMIUM', medal: '💎', stake: 2_000,  prizeDisplay: 'UGX 194,163,808', lastMatchDisplay: 'Today 17:30', endsAt: todayAt(17, 30) },
];

const tiers = ref<JpTier[]>(TIER_DEFS.map(td => ({ ...td, matches: [] })));

// ─── Reactive state (keyed by tier id) ───────────────────
const picks = reactive<Record<string, (string | null)[]>>(
  Object.fromEntries(TIER_DEFS.map(t => [t.id, Array(12).fill(null)]))
);
const betPlaced = reactive<Record<string, boolean>>(
  Object.fromEntries(TIER_DEFS.map(t => [t.id, false]))
);
const results = reactive<Record<string, ResultState | null>>(
  Object.fromEntries(TIER_DEFS.map(t => [t.id, null]))
);
const cd = reactive<Record<string, CdState>>(
  Object.fromEntries(TIER_DEFS.map(t => [t.id, fmtCountdown(t.endsAt)]))
);

// ─── Pick helpers ─────────────────────────────────────────
function picksCount(tid: string): number {
  return (picks[tid] || []).filter(p => p !== null).length;
}

function setPick(tid: string, idx: number, val: string) {
  if (betPlaced[tid]) return;
  picks[tid][idx] = picks[tid][idx] === val ? null : val;
}

function autoPick(tid: string, matches: JpMatch[]) {
  if (betPlaced[tid]) return;
  const opts = ['1', 'X', '2'];
  matches.forEach((_, i) => {
    picks[tid][i] = opts[Math.floor(Math.random() * 3)];
  });
}

function clearPicks(tid: string) {
  if (betPlaced[tid]) return;
  picks[tid] = Array(12).fill(null);
}

// ─── Place bet ────────────────────────────────────────────
function placeBet(tid: string, tier: JpTier) {
  if (!store.isLoggedIn) { alert('Please login first'); return; }
  if (store.balance < tier.stake) { alert('Insufficient balance'); return; }
  store.withdraw(tier.stake);
  betPlaced[tid] = true;
}

// ─── Simulate results when countdown done ────────────────
function simulateResults(tid: string) {
  const outcomes = ['1', 'X', '2'];
  const correct = picks[tid].filter(() => {
    const outcome = outcomes[Math.floor(Math.random() * 3)];
    return picks[tid].includes(outcome);
  }).length;
  const won = correct === 12;
  results[tid] = { won, correct };
  if (won) {
    const tier = tiers.value.find(t => t.id === tid)!;
    store.deposit(tier.stake + 500_000);
  }
}

// ─── Map API match → JpMatch ─────────────────────────────
function mapToJpMatch(m: Match, idx: number, prefix: string): JpMatch {
  const h = m.markets.home > 0 ? m.markets.home : 2.00;
  const d = (m.markets.draw != null && m.markets.draw > 0) ? m.markets.draw : 3.20;
  const a = m.markets.away > 0 ? m.markets.away : 3.00;
  return {
    id: `${prefix}${idx}`,
    league: m.league || 'Football',
    home: m.homeTeam,
    away: m.awayTeam,
    time: m.startTime || 'Today',
    odds: [
      parseFloat(h.toFixed(2)),
      parseFloat(d.toFixed(2)),
      parseFloat(a.toFixed(2)),
    ],
  };
}

// ─── Recent winners ───────────────────────────────────────
const recentWinners = [
  { name: 'John K.', avatar: '🧑', tier: '🥇 Gold', date: 'Yesterday', prize: 'UGX 856M' },
  { name: 'Amina W.', avatar: '👩', tier: '🥈 Silver', date: '2 days ago', prize: 'UGX 432M' },
  { name: 'David O.', avatar: '👨', tier: '🥉 Bronze', date: '3 days ago', prize: 'UGX 287M' },
];

// ─── Countdown interval ───────────────────────────────────
let timer: ReturnType<typeof setInterval>;

onMounted(async () => {
  timer = setInterval(() => {
    for (const t of TIER_DEFS) {
      const state = fmtCountdown(t.endsAt);
      cd[t.id] = state;
      if (state.done && betPlaced[t.id] && !results[t.id]) {
        simulateResults(t.id);
      }
    }
  }, 1000);

  try {
    const { data } = await fetchHighlightMatches(1, 80);
    const valid = data.filter(m => m.homeTeam && m.awayTeam);

    if (valid.length >= 12) {
      const getSlice = (offset: number): Match[] => {
        const out: Match[] = [];
        for (let i = 0; i < 12; i++) {
          out.push(valid[(offset + i) % valid.length]);
        }
        return out;
      };
      tiers.value = TIER_DEFS.map((td, ti) => ({
        ...td,
        matches: getSlice(ti * 12).map((m, i) => mapToJpMatch(m, i, td.id[0])),
      }));
    }
  } catch (e) {
    console.error('[Jackpot] Failed to load real matches:', e);
  } finally {
    loading.value = false;
  }
});

onUnmounted(() => clearInterval(timer));
</script>

<style scoped>
/* ─── page ─────────────────────────────────────────────── */
.jp-page { background: #f0f1f5; min-height: 100vh; }

/* ─── tier tabs ─────────────────────────────────────────── */
.jpt-tabs-wrap {
  background: #1c1e24;
  padding: 8px 8px 0;
  position: sticky;
  top: 0;
  z-index: 40;
}
.jpt-tabs {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 4px;
}
.jpt-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 8px 4px 10px;
  border: none;
  background: rgba(255,255,255,0.07);
  border-radius: 8px 8px 0 0;
  cursor: pointer;
  position: relative;
  transition: background 0.15s;
}
.jpt-tab--active { background: rgba(255,255,255,0.15); }
.jpt-tab__medal { font-size: 20px; line-height: 1; }
.jpt-tab__text { display: flex; flex-direction: column; align-items: center; gap: 1px; }
.jpt-tab__name { font-size: 9px; font-weight: 900; letter-spacing: .5px; color: #fff; }
.jpt-tab__stake { font-size: 7.5px; font-weight: 600; color: rgba(255,255,255,0.55); white-space: nowrap; }
.jpt-tab__pill {
  position: absolute; top: 4px; right: 4px;
  background: #10a310; color: #fff;
  font-size: 7px; font-weight: 800;
  border-radius: 8px; padding: 1px 4px;
}

/* Gold tab accent */
.jpt-tab--gold.jpt-tab--active { border-bottom: 3px solid #ffd700; }
.jpt-tab--silver.jpt-tab--active { border-bottom: 3px solid #c0c8d8; }
.jpt-tab--bronze.jpt-tab--active { border-bottom: 3px solid #d4834a; }
.jpt-tab--premium.jpt-tab--active { border-bottom: 3px solid #c080ff; }

/* ─── loading ───────────────────────────────────────────── */
.jpt-loading {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; padding: 48px 16px; gap: 12px;
}
.jpt-loading__spinner { font-size: 32px; animation: jpt-spin 1s linear infinite; }
.jpt-loading__txt { font-size: 13px; color: #888; }
@keyframes jpt-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

/* ─── panel ─────────────────────────────────────────────── */
.jpt-panel { background: #f0f1f5; }

/* ─── hero ──────────────────────────────────────────────── */
.jpt-hero {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 14px 16px;
  margin: 0;
}
.jpt-hero--gold    { background: linear-gradient(135deg, #c87800 0%, #7a4000 100%); }
.jpt-hero--silver  { background: linear-gradient(135deg, #5a6070 0%, #2e3240 100%); }
.jpt-hero--bronze  { background: linear-gradient(135deg, #8c4210 0%, #4a1e00 100%); }
.jpt-hero--premium { background: linear-gradient(135deg, #5010a8 0%, #25006a 100%); }

.jpt-hero__prize-col { flex: 1; min-width: 0; }

.jpt-hero__badge {
  display: inline-block;
  font-size: 8px; font-weight: 900; letter-spacing: 1px;
  background: rgba(255,255,255,0.18);
  color: rgba(255,255,255,0.9);
  border-radius: 10px;
  padding: 2px 8px;
  margin-bottom: 6px;
}
.jpt-hero__prize {
  font-size: 18px; font-weight: 900;
  color: #fff;
  text-shadow: 0 2px 8px rgba(0,0,0,0.4);
  line-height: 1.1;
  margin-bottom: 4px;
}
.jpt-hero--gold .jpt-hero__prize   { color: #ffe87a; }
.jpt-hero--silver .jpt-hero__prize { color: #e8eaf0; }
.jpt-hero--bronze .jpt-hero__prize { color: #ffd0a0; }
.jpt-hero--premium .jpt-hero__prize{ color: #e8c8ff; }

.jpt-hero__matches-badge {
  font-size: 9px; font-weight: 700;
  color: rgba(255,255,255,0.65);
  margin-bottom: 8px;
}
.jpt-hero__stake-tag {
  display: flex; align-items: center; gap: 6px;
  background: rgba(0,0,0,0.22);
  border-radius: 6px;
  padding: 5px 8px;
  width: fit-content;
}
.jpt-hero__stake-lbl { font-size: 9px; color: rgba(255,255,255,0.6); }
.jpt-hero__stake-val { font-size: 13px; font-weight: 900; color: #fff; }

/* countdown */
.jpt-hero__cdown-col { text-align: right; flex-shrink: 0; }
.jpt-hero__cdown-lbl { font-size: 9px; color: rgba(255,255,255,0.6); margin-bottom: 4px; }

.jpt-cdown {
  display: flex;
  align-items: center;
  gap: 4px;
  justify-content: flex-end;
}
.jpt-cdown__block {
  display: flex; flex-direction: column; align-items: center;
  background: rgba(0,0,0,0.30);
  border-radius: 6px;
  padding: 5px 8px;
  min-width: 44px;
}
.jpt-cdown__val {
  font-size: 22px; font-weight: 900;
  color: #fff;
  font-variant-numeric: tabular-nums;
  line-height: 1;
}
.jpt-cdown--gold .jpt-cdown__val    { color: #ffe87a; }
.jpt-cdown--silver .jpt-cdown__val  { color: #e8eaf0; }
.jpt-cdown--bronze .jpt-cdown__val  { color: #ffd0a0; }
.jpt-cdown--premium .jpt-cdown__val { color: #e8c8ff; }

.jpt-cdown__unit {
  font-size: 7px; font-weight: 700; letter-spacing: .5px;
  color: rgba(255,255,255,0.5);
  margin-top: 2px;
}
.jpt-cdown__sep {
  font-size: 20px; font-weight: 900; color: rgba(255,255,255,0.5);
  margin-bottom: 12px;
}
.jpt-cdown__note {
  font-size: 8.5px; color: rgba(255,255,255,0.5);
  margin-top: 5px; text-align: right;
}

/* ─── progress ──────────────────────────────────────────── */
.jpt-progress {
  background: #fff;
  padding: 8px 14px;
  border-bottom: 1px solid #ebebeb;
}
.jpt-progress__row {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 5px;
}
.jpt-progress__count { font-size: 11px; color: #6a6f7a; }
.jpt-progress__count strong { color: #292a33; }
.jpt-progress__hint { font-size: 11px; color: #9599a4; }
.jpt-progress__done { font-size: 11px; font-weight: 700; color: #10a310; }

.jpt-progress__track {
  height: 5px; background: #e8e9ed; border-radius: 4px; overflow: hidden;
}
.jpt-progress__fill {
  height: 100%; border-radius: 4px;
  transition: width 0.4s ease;
  min-width: 3px;
}
.jpt-progress__fill--gold    { background: linear-gradient(90deg, #ffd700, #e8a000); }
.jpt-progress__fill--silver  { background: linear-gradient(90deg, #b0b5c0, #5a6070); }
.jpt-progress__fill--bronze  { background: linear-gradient(90deg, #d4834a, #8c4210); }
.jpt-progress__fill--premium { background: linear-gradient(90deg, #c080ff, #5010a8); }

/* ─── match table ───────────────────────────────────────── */
.jpt-table { background: #fff; margin-top: 8px; }

.jpt-table__hdr {
  display: grid;
  grid-template-columns: 28px 1fr 52px 52px 52px;
  padding: 6px 8px;
  border-bottom: 2px solid #ebebeb;
}
.jpt-table__hdr--gold    { border-bottom-color: #ffd700; }
.jpt-table__hdr--silver  { border-bottom-color: #b0b5c0; }
.jpt-table__hdr--bronze  { border-bottom-color: #d4834a; }
.jpt-table__hdr--premium { border-bottom-color: #c080ff; }

.jpt-th { font-size: 10px; font-weight: 800; color: #6a6f7a; letter-spacing: .3px; }
.jpt-th--num  { text-align: center; }
.jpt-th--info { padding-left: 4px; }
.jpt-th--odd  { text-align: center; }

.jpt-row {
  display: grid;
  grid-template-columns: 28px 1fr 52px 52px 52px;
  align-items: center;
  padding: 8px 8px;
  border-bottom: 1px solid #f0f0f4;
  transition: background 0.12s;
}
.jpt-row--picked { background: rgba(16, 163, 16, 0.04); }

.jpt-row__num {
  font-size: 10px; font-weight: 700; color: #9599a4;
  text-align: center;
}
.jpt-row__info { padding-right: 4px; }
.jpt-row__league { font-size: 9px; font-weight: 600; color: #9599a4; margin-bottom: 2px; }
.jpt-row__teams { display: flex; align-items: center; gap: 3px; flex-wrap: wrap; }
.jpt-row__team { font-size: 11px; font-weight: 700; color: #292a33; }
.jpt-row__vs { font-size: 9px; color: #9599a4; }
.jpt-row__time { font-size: 9px; color: #9599a4; margin-top: 2px; }

/* odds buttons */
.jpt-odd {
  display: flex; align-items: center; justify-content: center;
  width: 44px; height: 38px;
  margin: 0 auto;
  background: #f2f3f5;
  border: 1.5px solid #e6e7eb;
  border-radius: 7px;
  font-size: 12px; font-weight: 800;
  color: #292a33;
  cursor: pointer;
  transition: all 0.14s;
}
.jpt-odd:disabled { opacity: 0.6; cursor: default; }
.jpt-odd--active {
  background: linear-gradient(135deg, #c026d3, #a21caf);
  border-color: #a21caf;
  color: #fff;
}

/* tier-colored active odd */
.jpt-panel[data-tier="gold"] .jpt-odd--active {
  background: linear-gradient(135deg, #ffd700, #c87800);
  border-color: #c87800;
  color: #3d1800;
}
.jpt-panel[data-tier="silver"] .jpt-odd--active {
  background: linear-gradient(135deg, #b0b8cc, #5a6070);
  border-color: #5a6070;
  color: #fff;
}
.jpt-panel[data-tier="bronze"] .jpt-odd--active {
  background: linear-gradient(135deg, #d4834a, #8c4210);
  border-color: #8c4210;
  color: #fff;
}
.jpt-panel[data-tier="premium"] .jpt-odd--active {
  background: linear-gradient(135deg, #c080ff, #5010a8);
  border-color: #5010a8;
  color: #fff;
}

/* ─── footer ────────────────────────────────────────────── */
.jpt-footer {
  padding: 14px 12px;
  background: #fff;
  border-top: 1px solid #ebebeb;
  margin-top: 8px;
}

.jpt-footer__summary {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 10px;
}
.jpt-footer__picks-info { display: flex; align-items: center; gap: 5px; }
.jpt-footer__picks-count { font-size: 11px; font-weight: 700; color: #292a33; }
.jpt-footer__picks-dot { color: #9599a4; font-size: 10px; }
.jpt-footer__picks-note { font-size: 11px; color: #9599a4; }
.jpt-footer__stake-display { font-size: 12px; color: #6a6f7a; }
.jpt-footer__stake-display strong { color: #292a33; }

/* place bet button */
.jpt-btn {
  display: block; width: 100%;
  padding: 13px; border: none; border-radius: 9px;
  font-size: 14px; font-weight: 800;
  cursor: pointer;
  transition: opacity 0.15s;
}
.jpt-btn--disabled { opacity: 0.5; cursor: not-allowed; }
.jpt-btn--gold    { background: linear-gradient(90deg, #ffd700, #c87800); color: #3d1800; }
.jpt-btn--silver  { background: linear-gradient(90deg, #b0b8cc, #3a4050); color: #fff; }
.jpt-btn--bronze  { background: linear-gradient(90deg, #d4834a, #8c4210); color: #fff; }
.jpt-btn--premium { background: linear-gradient(90deg, #c080ff, #5010a8); color: #fff; }
.jpt-btn:not(.jpt-btn--disabled):hover { opacity: 0.9; }

/* ─── waiting state ─────────────────────────────────────── */
.jpt-waiting {
  text-align: center; padding: 16px 10px;
}
.jpt-waiting__icon { font-size: 32px; margin-bottom: 8px; }
.jpt-waiting__title { font-size: 16px; font-weight: 800; color: #292a33; margin-bottom: 4px; }
.jpt-waiting__sub { font-size: 12px; color: #6a6f7a; margin-bottom: 8px; line-height: 1.5; }
.jpt-waiting__stake { font-size: 12px; color: #6a6f7a; }
.jpt-waiting__stake strong { color: #292a33; }

/* ─── result state ──────────────────────────────────────── */
.jpt-result {
  text-align: center; padding: 20px 12px;
  border-radius: 10px;
}
.jpt-result--win  { background: linear-gradient(135deg, rgba(16,163,16,0.08), rgba(16,163,16,0.04)); border: 2px solid #10a310; }
.jpt-result--loss { background: rgba(0,0,0,0.03); border: 1px solid #ebebeb; }

.jpt-result__icon  { font-size: 40px; margin-bottom: 8px; }
.jpt-result__title { font-size: 18px; font-weight: 900; margin-bottom: 6px; }
.jpt-result--win .jpt-result__title  { color: #10a310; }
.jpt-result--loss .jpt-result__title { color: #292a33; }

.jpt-result__prize {
  font-size: 22px; font-weight: 900; color: #ffd700;
  text-shadow: 0 1px 6px rgba(0,0,0,0.2);
  margin-bottom: 6px;
}
.jpt-result__sub { font-size: 12px; color: #6a6f7a; line-height: 1.5; }

/* ─── desktop 3-col layout ──────────────────────────────── */
.jpt-desktop-layout { display: flex; flex-direction: column; }
.jpt-sidebar { display: none; }
.jpt-hero--mobile { display: block; }
.jpt-progress--mobile { display: block; }
.jpt-footer--mobile { display: block; }

/* ── Shared sidebar card styles (always defined, shown on desktop) ── */
.jpt-sb-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 1px 6px rgba(0,0,0,.08);
  overflow: visible;
}
.jpt-sb-card__hdr {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: .4px;
  color: #292a33;
  padding: 10px 14px 8px;
  border-bottom: 1px solid #f0f1f5;
  background: #fafafa;
  border-radius: 12px 12px 0 0;
}

/* ── Left sidebar hero card ── */
.jpt-sb-hero-card {
  padding: 18px 14px 14px;
  text-align: center;
  color: #fff;
  overflow: hidden;
  position: relative;
}
.jpt-sb-hero-card--gold    { background: linear-gradient(135deg, #c87800 0%, #f5a623 100%); }
.jpt-sb-hero-card--silver  { background: linear-gradient(135deg, #4a5568 0%, #718096 100%); }
.jpt-sb-hero-card--bronze  { background: linear-gradient(135deg, #7b3a10 0%, #c05621 100%); }
.jpt-sb-hero-card--premium { background: linear-gradient(135deg, #5b21b6 0%, #a855f7 100%); }
.jpt-sb-hero-card__medal  { font-size: 36px; line-height: 1; margin-bottom: 4px; }
.jpt-sb-hero-card__name   { font-size: 10px; font-weight: 900; letter-spacing: 1px; opacity: .85; margin-bottom: 4px; }
.jpt-sb-hero-card__prize  { font-size: 20px; font-weight: 900; margin-bottom: 4px; }
.jpt-sb-hero-card__stake  { font-size: 10px; opacity: .75; margin-bottom: 10px; }

/* ── Mini countdown ── */
.jpt-sb-cdown-mini { background: rgba(0,0,0,.2); border-radius: 8px; padding: 8px 10px; }
.jpt-sb-cdown-mini__lbl { font-size: 9px; opacity: .7; margin-bottom: 4px; }
.jpt-sb-cdown-mini__vals { display: flex; align-items: center; justify-content: center; gap: 4px; }
.jpt-sb-cdown-mini__block {
  font-size: 18px; font-weight: 900;
  background: rgba(255,255,255,.15);
  border-radius: 6px;
  padding: 2px 8px;
  min-width: 38px;
  text-align: center;
}
.jpt-sb-cdown-mini__block small { font-size: 8px; font-weight: 600; opacity: .7; margin-left: 1px; }
.jpt-sb-cdown-mini__sep { font-size: 16px; font-weight: 900; opacity: .6; }

/* ── Picks progress ── */
.jpt-sb-picks-progress { padding: 10px 14px 6px; }
.jpt-sb-picks-count { font-size: 11px; color: #6a6f7a; margin-bottom: 6px; }
.jpt-sb-picks-count strong { font-size: 16px; color: #292a33; }
.jpt-done { color: #10a310 !important; }

/* ── Mini picks list ── */
.jpt-sb-pick-list { padding: 0 0 6px; }
.jpt-sb-pick-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 14px;
  border-top: 1px solid #f5f5f8;
  font-size: 10px;
  color: #9599a4;
  transition: background .1s;
}
.jpt-sb-pick-item--done { background: #f9fff9; color: #292a33; }
.jpt-sb-pick-item__num {
  width: 16px; height: 16px; border-radius: 50%;
  background: #e8eaf0; color: #9599a4;
  display: flex; align-items: center; justify-content: center;
  font-size: 9px; font-weight: 700; flex-shrink: 0;
}
.jpt-sb-pick-item--done .jpt-sb-pick-item__num { background: #dcf5dc; color: #10a310; }
.jpt-sb-pick-item__team { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.jpt-sb-pick-item__val {
  font-size: 11px; font-weight: 900; color: #c026d3;
  min-width: 18px; text-align: right; flex-shrink: 0;
}
.jpt-sb-pick-item__val--gold    { color: #c87800; }
.jpt-sb-pick-item__val--silver  { color: #5a6070; }
.jpt-sb-pick-item__val--bronze  { color: #8c4210; }
.jpt-sb-pick-item__val--premium { color: #7e22ce; }

/* ── Quick actions ── */
.jpt-sb-actions { display: flex; flex-direction: column; gap: 8px; padding: 10px 14px; }
.jpt-sb-action-btn {
  width: 100%; padding: 9px 12px;
  border-radius: 8px; border: 1.5px solid #e0e2ea;
  background: #f5f6fa; color: #292a33;
  font-size: 12px; font-weight: 700; cursor: pointer;
  transition: background .12s, border-color .12s;
}
.jpt-sb-action-btn:hover:not(:disabled) { background: #ebe8f5; border-color: #c026d3; color: #c026d3; }
.jpt-sb-action-btn--clear:hover:not(:disabled) { background: #fff0f0; border-color: #e53e3e; color: #e53e3e; }
.jpt-sb-action-btn:disabled { opacity: .4; cursor: not-allowed; }

/* ── Bet body ── */
.jpt-sb-bet-body { padding: 10px 14px 14px; display: flex; flex-direction: column; gap: 8px; }
.jpt-sb-bet-row { display: flex; justify-content: space-between; align-items: center; }
.jpt-sb-bet-lbl { font-size: 11px; color: #9599a4; }
.jpt-sb-bet-val { font-size: 13px; font-weight: 800; color: #292a33; }
.jpt-sb-play-btn { margin-top: 4px; }

/* ── Confirmed state ── */
.jpt-sb-confirmed { text-align: center; padding: 8px 0; }
.jpt-sb-confirmed__icon  { font-size: 28px; margin-bottom: 4px; }
.jpt-sb-confirmed__title { font-size: 13px; font-weight: 800; color: #292a33; margin-bottom: 4px; }
.jpt-sb-confirmed__sub   { font-size: 10px; color: #9599a4; margin-bottom: 8px; line-height: 1.4; }
.jpt-sb-confirmed__stake { font-size: 11px; color: #292a33; }

/* ── Prize list ── */
.jpt-sb-prize-list { padding: 4px 0; }
.jpt-sb-prize-row {
  display: flex; align-items: center; gap: 8px;
  padding: 8px 14px; border-bottom: 1px solid #f5f5f8;
  cursor: pointer; transition: background .12s;
}
.jpt-sb-prize-row:last-child { border-bottom: none; }
.jpt-sb-prize-row:hover { background: #fafafa; }
.jpt-sb-prize-row__medal { font-size: 20px; flex-shrink: 0; }
.jpt-sb-prize-row__info  { flex: 1; min-width: 0; }
.jpt-sb-prize-row__name  { display: block; font-size: 11px; font-weight: 800; color: #292a33; }
.jpt-sb-prize-row__stake { font-size: 9px; color: #9599a4; }
.jpt-sb-prize-row__amount { font-size: 11px; font-weight: 900; text-align: right; }
.jpt-sb-prize-row--gold .jpt-sb-prize-row__amount    { color: #c87800; }
.jpt-sb-prize-row--silver .jpt-sb-prize-row__amount  { color: #5a6070; }
.jpt-sb-prize-row--bronze .jpt-sb-prize-row__amount  { color: #8c4210; }
.jpt-sb-prize-row--premium .jpt-sb-prize-row__amount { color: #7e22ce; }

/* ── How to play ── */
.jpt-sb-steps {
  margin: 0; padding: 10px 14px; list-style: none;
  display: flex; flex-direction: column; gap: 8px;
}
.jpt-sb-step {
  display: flex; align-items: flex-start; gap: 8px;
  font-size: 11px; color: #6a6f7a; line-height: 1.45;
}
.jpt-sb-step strong { color: #292a33; }
.jpt-sb-step__num {
  display: flex; align-items: center; justify-content: center;
  width: 18px; height: 18px; border-radius: 50%;
  background: #c026d3; color: #fff;
  font-size: 9px; font-weight: 900; flex-shrink: 0; margin-top: 1px;
}
.jpt-sb-note { font-size: 10px; color: #9599a4; padding: 0 14px 12px; line-height: 1.5; }

/* ── Winners ── */
.jpt-sb-winner {
  display: flex; align-items: center; gap: 8px;
  padding: 8px 14px; border-bottom: 1px solid #f5f5f8;
}
.jpt-sb-winner:last-child { border-bottom: none; }
.jpt-sb-winner__avatar { font-size: 22px; flex-shrink: 0; }
.jpt-sb-winner__info   { flex: 1; min-width: 0; }
.jpt-sb-winner__name   { font-size: 11px; font-weight: 700; color: #292a33; }
.jpt-sb-winner__tier   { font-size: 9px; color: #9599a4; }
.jpt-sb-winner__prize  { font-size: 11px; font-weight: 900; color: #10a310; }

/* ── Stats ── */
.jpt-sb-stats {
  display: grid; grid-template-columns: 1fr 1fr;
  padding: 10px 14px 12px; gap: 10px;
}
.jpt-sb-stat { display: flex; flex-direction: column; align-items: center; gap: 2px; }
.jpt-sb-stat__val { font-size: 16px; font-weight: 900; color: #292a33; }
.jpt-sb-stat__lbl { font-size: 9px; color: #9599a4; text-align: center; }

/* ─── Desktop layout ─────────────────────────────────────── */
@media (min-width: 1024px) {
  .jpt-hero--mobile     { display: none; }
  .jpt-progress--mobile { display: none; }
  .jpt-footer--mobile   { display: none; }

  .jpt-desktop-layout {
    flex-direction: row;
    align-items: flex-start;
    gap: 14px;
    padding: 14px 20px;
  }

  /* Left sidebar */
  .jpt-sidebar--left {
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 230px;
    flex-shrink: 0;
    position: sticky;
    top: 56px;
  }

  /* Center */
  .jpt-main {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 1px 6px rgba(0,0,0,.07);
    overflow: hidden;
  }
  .jpt-table { margin-top: 0; border-radius: 0; }
  .jpt-table__hdr,
  .jpt-row {
    grid-template-columns: 34px 1fr 68px 68px 68px;
    padding: 9px 14px;
  }
  .jpt-odd { width: 56px; height: 40px; font-size: 13px; }
  .jpt-row__team  { font-size: 11px; }
  .jpt-row__league { font-size: 10px; }

  /* Right sidebar */
  .jpt-sidebar--right {
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 230px;
    flex-shrink: 0;
    position: sticky;
    top: 56px;
  }
}
</style>
