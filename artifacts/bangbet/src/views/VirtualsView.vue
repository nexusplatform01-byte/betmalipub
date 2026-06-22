<template>
  <div class="virt-page">
    <AppHeader />

    <!-- Top bar -->
    <div class="virt-topbar">
      <div class="virt-topbar__kick">
        <span class="virt-topbar__kick-lbl">Time to kickoff:</span>
        <span class="virt-topbar__kick-time">{{ cdDisplay }}</span>
      </div>
      <div class="virt-topbar__title">⚽ VIRTUAL SOCCER</div>
      <div class="virt-topbar__note">New match every 5 minutes!</div>
    </div>

    <!-- Mobile match tabs -->
    <div class="virt-mtabs">
      <button
        v-for="(m, i) in matches" :key="m.id"
        class="virt-mtab"
        :class="{ 'virt-mtab--active': activeCol === i }"
        @click="activeCol = i"
      >
        <span class="virt-mtab__num">{{ m.id }}</span>
        <span class="virt-mtab__teams">{{ m.home }} vs {{ m.away }}</span>
      </button>
    </div>

    <!-- Main layout -->
    <div class="virt-layout">

      <!-- Match columns -->
      <div class="virt-cols">
        <div
          v-for="(match, mi) in matches" :key="match.id"
          class="virt-col"
          :class="{ 'virt-col--active': activeCol === mi }"
        >
          <!-- Match card wrapper -->
          <div class="virt-match-card">
            <!-- Match header -->
            <div class="virt-col__hdr">
              <span class="virt-col__num">#{{ match.id }}</span>
              <div class="virt-col__teams">
                <span class="virt-col__team">{{ match.home }}</span>
                <span class="virt-col__vs">vs</span>
                <span class="virt-col__team">{{ match.away }}</span>
              </div>
            </div>

            <!-- Full Time Result -->
            <div class="virt-sec">FULL TIME RESULT</div>
            <div class="virt-row virt-row--3">
              <button
                v-for="o in ftrOdds(match)"
                :key="o.fk"
                class="virt-odd"
                :class="{ 'virt-odd--sel': isSel(match.id, o.fk) }"
                @click="pick(match.id, o.gk, o.fk, `FT:${o.lbl}`, o.val)"
              >
                <span class="virt-odd__lbl">{{ o.lbl }}</span>
                <span class="virt-odd__val">{{ o.val }}</span>
              </button>
            </div>

            <!-- 1st Half Result -->
            <div class="virt-sec">1ST HALF RESULT</div>
            <div class="virt-row virt-row--3">
              <button
                v-for="o in htrOdds(match)"
                :key="o.fk"
                class="virt-odd"
                :class="{ 'virt-odd--sel': isSel(match.id, o.fk) }"
                @click="pick(match.id, o.gk, o.fk, `HT:${o.lbl}`, o.val)"
              >
                <span class="virt-odd__lbl">{{ o.lbl }}</span>
                <span class="virt-odd__val">{{ o.val }}</span>
              </button>
            </div>

            <!-- Total Goals -->
            <div class="virt-sec">TOTAL GOALS</div>
            <div v-for="pair in match.mkts.goalPairs" :key="pair[0].lbl" class="virt-row virt-row--2">
              <button
                v-for="o in pair" :key="`${match.id}_goal_${o.lbl}`"
                class="virt-odd"
                :class="{ 'virt-odd--sel': isSel(match.id, `${match.id}_goal_${o.lbl}`) }"
                @click="pick(match.id, `${match.id}_goals_${o.line}`, `${match.id}_goal_${o.lbl}`, o.lbl, o.val)"
              >
                <span class="virt-odd__lbl">{{ o.lbl }}</span>
                <span class="virt-odd__val">{{ o.val }}</span>
              </button>
            </div>

            <!-- Correct Score -->
            <div class="virt-sec">CORRECT SCORE</div>
            <div class="virt-cs-grid">
              <button
                v-for="cs in match.mkts.cs" :key="`${match.id}_cs_${cs.score}`"
                class="virt-odd virt-odd--cs"
                :class="{ 'virt-odd--sel': isSel(match.id, `${match.id}_cs_${cs.score}`) }"
                @click="pick(match.id, `${match.id}_cs`, `${match.id}_cs_${cs.score}`, cs.score, cs.val)"
              >
                <span class="virt-odd__score">{{ cs.score }}</span>
                <span class="virt-odd__val">{{ cs.val }}</span>
              </button>
            </div>
            <button
              class="virt-odd virt-odd--full"
              :class="{ 'virt-odd--sel': isSel(match.id, `${match.id}_cs_other`) }"
              @click="pick(match.id, `${match.id}_cs`, `${match.id}_cs_other`, 'Any other', match.mkts.csOther)"
            >
              <span class="virt-odd__lbl">Any other result</span>
              <span class="virt-odd__val">{{ match.mkts.csOther }}</span>
            </button>

            <!-- BTTS Full Time -->
            <div class="virt-sec">BOTH TEAMS TO SCORE: FULL TIME</div>
            <div class="virt-row virt-row--2">
              <button
                class="virt-odd"
                :class="{ 'virt-odd--sel': isSel(match.id, `${match.id}_bttsft_y`) }"
                @click="pick(match.id, `${match.id}_bttsft`, `${match.id}_bttsft_y`, 'BTTS Yes', match.mkts.bttsft.y)"
              ><span class="virt-odd__lbl">Yes</span><span class="virt-odd__val">{{ match.mkts.bttsft.y }}</span></button>
              <button
                class="virt-odd"
                :class="{ 'virt-odd--sel': isSel(match.id, `${match.id}_bttsft_n`) }"
                @click="pick(match.id, `${match.id}_bttsft`, `${match.id}_bttsft_n`, 'BTTS No', match.mkts.bttsft.n)"
              ><span class="virt-odd__lbl">No</span><span class="virt-odd__val">{{ match.mkts.bttsft.n }}</span></button>
            </div>

            <!-- BTTS 1st Half -->
            <div class="virt-sec">BOTH TEAMS TO SCORE: 1ST HALF</div>
            <div class="virt-row virt-row--2">
              <button
                class="virt-odd"
                :class="{ 'virt-odd--sel': isSel(match.id, `${match.id}_bttshf_y`) }"
                @click="pick(match.id, `${match.id}_bttshf`, `${match.id}_bttshf_y`, 'HT BTTS Yes', match.mkts.bttshf.y)"
              ><span class="virt-odd__lbl">Yes</span><span class="virt-odd__val">{{ match.mkts.bttshf.y }}</span></button>
              <button
                class="virt-odd"
                :class="{ 'virt-odd--sel': isSel(match.id, `${match.id}_bttshf_n`) }"
                @click="pick(match.id, `${match.id}_bttshf`, `${match.id}_bttshf_n`, 'HT BTTS No', match.mkts.bttshf.n)"
              ><span class="virt-odd__lbl">No</span><span class="virt-odd__val">{{ match.mkts.bttshf.n }}</span></button>
            </div>
          </div>
          <!-- end virt-match-card -->
        </div>
      </div>

      <!-- Right panel (desktop only) -->
      <div class="virt-side">
        <div class="virt-side__tabs">
          <button class="virt-side__tab" :class="{ 'virt-side__tab--active': sideTab === 'stream' }" @click="sideTab = 'stream'">STREAM</button>
          <button class="virt-side__tab" :class="{ 'virt-side__tab--active': sideTab === 'tracker' }" @click="sideTab = 'tracker'">TRACKER</button>
        </div>
        <div v-show="sideTab === 'stream'" class="virt-stream">
          <div class="virt-stream__inner">
            <div class="virt-stream__live">● LIVE</div>
            <div class="virt-stream__pitch">⚽</div>
            <div class="virt-stream__msg">Stream available in app</div>
            <button class="virt-stream__expand">⤢ EXPAND STREAM</button>
          </div>
        </div>
        <div v-show="sideTab === 'tracker'" class="virt-stream">
          <div class="virt-stream__inner" style="font-size:11px;color:#aaa;text-align:center;padding:20px 10px;">
            Match tracker starts at kickoff
          </div>
        </div>
        <!-- Bet Slip -->
        <div class="virt-bs">
          <div class="virt-bs__hdr">BET SLIP · VIRTUAL SOCCER</div>
          <div v-if="!slipEntries.length" class="virt-bs__empty">
            <div class="virt-bs__empty-icon">⚠</div>
            <div>Your Ticket is still empty</div>
          </div>
          <template v-else>
            <div v-for="e in slipEntries" :key="e.gk" class="virt-bs__item">
              <div class="virt-bs__item-left">
                <div class="virt-bs__item-mid">Match {{ e.mid }}</div>
                <div class="virt-bs__item-lbl">{{ e.label }}</div>
              </div>
              <span class="virt-bs__item-odds">{{ e.odds }}</span>
              <button class="virt-bs__item-del" @click="removeSel(e.mid)">✕</button>
            </div>
            <div class="virt-bs__stake-row">
              <label class="virt-bs__stake-lbl">Stake (UGX)</label>
              <input v-model.number="virtStake" type="number" class="virt-bs__stake-input" min="500" step="500" />
            </div>
            <div class="virt-bs__totals">
              <div>Total Odds: <strong>{{ totalOdds }}</strong></div>
              <div>To Win: <strong>UGX {{ potentialWin.toLocaleString() }}</strong></div>
            </div>
            <button class="virt-bs__btn" @click="placeVirtBet">Place Virtual Bet</button>
          </template>
        </div>
      </div>

    </div>

    <!-- Results bar -->
    <div class="virt-results-bar">
      <button class="virt-results-bar__btn">RESULTS</button>
      <span class="virt-results-bar__sep">|</span>
      <span class="virt-results-bar__lbl">LAST 3 RESULTS</span>
      <span class="virt-results-bar__sep">|</span>
      <span v-for="r in lastResults" :key="r.id" class="virt-results-bar__item">
        <strong>{{ r.id }}:</strong> {{ r.home }} vs {{ r.away }} <span class="virt-results-bar__score">{{ r.score }}</span> ({{ r.ht }})
        <span class="virt-results-bar__sep"> | </span>
      </span>
    </div>

    <!-- Mobile bet slip FAB -->
    <div v-if="slipEntries.length" class="virt-fab" @click="showMobileSlip = true">
      <span class="virt-fab__count">{{ slipEntries.length }}</span>
      <span>Bet Slip</span>
    </div>

    <!-- Mobile bet slip sheet -->
    <Transition name="slide-up">
      <div v-if="showMobileSlip" class="virt-overlay" @click.self="showMobileSlip = false">
        <div class="virt-sheet">
          <div class="virt-sheet__hdr">
            <span>BET SLIP · VIRTUAL SOCCER</span>
            <button class="virt-sheet__close" @click="showMobileSlip = false">✕</button>
          </div>
          <div class="virt-sheet__body">
            <div v-if="!slipEntries.length" class="virt-bs__empty">
              <div class="virt-bs__empty-icon">⚠</div>
              <div>Your Ticket is still empty</div>
            </div>
            <template v-else>
              <div v-for="e in slipEntries" :key="e.gk" class="virt-bs__item">
                <div class="virt-bs__item-left">
                  <div class="virt-bs__item-mid">Match {{ e.mid }}</div>
                  <div class="virt-bs__item-lbl">{{ e.label }}</div>
                </div>
                <span class="virt-bs__item-odds">{{ e.odds }}</span>
                <button class="virt-bs__item-del" @click="removeSel(e.mid)">✕</button>
              </div>
              <div class="virt-bs__stake-row">
                <label class="virt-bs__stake-lbl">Stake (UGX)</label>
                <input v-model.number="virtStake" type="number" class="virt-bs__stake-input" min="500" step="500" />
              </div>
              <div class="virt-bs__totals">
                <div>Total Odds: <strong>{{ totalOdds }}</strong></div>
                <div>To Win: <strong>UGX {{ potentialWin.toLocaleString() }}</strong></div>
              </div>
              <button class="virt-bs__btn" @click="placeVirtBet">Place Virtual Bet</button>
            </template>
          </div>
        </div>
      </div>
    </Transition>

    <BottomNav />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
import AppHeader from '@/components/AppHeader.vue';
import BottomNav from '@/components/BottomNav.vue';
import { useAppStore } from '@/stores/app';

const store = useAppStore();
const activeCol = ref(0);
const sideTab = ref<'stream' | 'tracker'>('stream');
const virtStake = ref(1000);
const showMobileSlip = ref(false);

// ─── Types ───────────────────────────────────────────────────────────────────
interface GoalOdd { lbl: string; line: number; val: number; }
interface CS       { score: string; val: number; }
interface VirtMatch {
  id: number;
  home: string;
  away: string;
  mkts: {
    ftr: { h: number; d: number; a: number };
    htr: { h: number; d: number; a: number };
    goalPairs: [GoalOdd, GoalOdd][];
    cs: CS[];
    csOther: number;
    bttsft: { y: number; n: number };
    bttshf: { y: number; n: number };
  };
}

// ─── Match Data ───────────────────────────────────────────────────────────────
const matches: VirtMatch[] = [
  {
    id: 177, home: 'V-LAZIO', away: 'V-MILAN',
    mkts: {
      ftr: { h: 2.55, d: 2.85, a: 2.75 },
      htr: { h: 3.65, d: 1.75, a: 3.85 },
      goalPairs: [
        [{ lbl: 'Under 1.5', line: 1.5, val: 3.35 }, { lbl: 'Over 1.5', line: 1.5, val: 1.30 }],
        [{ lbl: 'Under 2.5', line: 2.5, val: 1.75 }, { lbl: 'Over 2.5', line: 2.5, val: 2.00 }],
        [{ lbl: 'Under 3.5', line: 3.5, val: 1.25 }, { lbl: 'Over 3.5', line: 3.5, val: 3.85 }],
        [{ lbl: 'Under 4.5', line: 4.5, val: 1.05 }, { lbl: 'Over 4.5', line: 4.5, val: 7.20 }],
      ],
      cs: [
        { score: '1:0', val: 8.50 }, { score: '0:0', val: 9.00 }, { score: '0:1', val: 9.00 },
        { score: '2:0', val: 10.50 }, { score: '1:1', val: 7.00 }, { score: '0:2', val: 10.00 },
        { score: '2:1', val: 8.00 },  { score: '2:2', val: 10.50 }, { score: '1:2', val: 11.00 },
      ],
      csOther: 4.35,
      bttsft: { y: 1.85, n: 1.85 },
      bttshf: { y: 4.90, n: 1.15 },
    },
  },
  {
    id: 178, home: 'V-MAN.CITY', away: 'V-CHELSEA',
    mkts: {
      ftr: { h: 2.10, d: 3.10, a: 3.20 },
      htr: { h: 3.05, d: 1.85, a: 4.10 },
      goalPairs: [
        [{ lbl: 'Under 1.5', line: 1.5, val: 3.50 }, { lbl: 'Over 1.5', line: 1.5, val: 1.25 }],
        [{ lbl: 'Under 2.5', line: 2.5, val: 1.75 }, { lbl: 'Over 2.5', line: 2.5, val: 1.95 }],
        [{ lbl: 'Under 3.5', line: 3.5, val: 1.20 }, { lbl: 'Over 3.5', line: 3.5, val: 3.90 }],
        [{ lbl: 'Under 4.5', line: 4.5, val: 1.05 }, { lbl: 'Over 4.5', line: 4.5, val: 7.10 }],
      ],
      cs: [
        { score: '1:0', val: 7.50 }, { score: '0:0', val: 12.00 }, { score: '0:1', val: 10.00 },
        { score: '2:0', val: 9.00 },  { score: '1:1', val: 7.50 },  { score: '0:2', val: 12.00 },
        { score: '2:1', val: 7.00 },  { score: '2:2', val: 11.00 }, { score: '1:2', val: 11.50 },
      ],
      csOther: 4.30,
      bttsft: { y: 1.85, n: 1.85 },
      bttshf: { y: 5.10, n: 1.10 },
    },
  },
  {
    id: 179, home: 'V-SEVILLA', away: 'V-VALENCIA',
    mkts: {
      ftr: { h: 2.30, d: 3.00, a: 2.95 },
      htr: { h: 3.50, d: 1.70, a: 4.30 },
      goalPairs: [
        [{ lbl: 'Under 1.5', line: 1.5, val: 3.25 }, { lbl: 'Over 1.5', line: 1.5, val: 1.25 }],
        [{ lbl: 'Under 2.5', line: 2.5, val: 1.75 }, { lbl: 'Over 2.5', line: 2.5, val: 2.00 }],
        [{ lbl: 'Under 3.5', line: 3.5, val: 1.20 }, { lbl: 'Over 3.5', line: 3.5, val: 3.90 }],
        [{ lbl: 'Under 4.5', line: 4.5, val: 1.05 }, { lbl: 'Over 4.5', line: 4.5, val: 7.30 }],
      ],
      cs: [
        { score: '1:0', val: 8.00 }, { score: '0:0', val: 9.00 }, { score: '0:1', val: 10.00 },
        { score: '2:0', val: 9.50 },  { score: '1:1', val: 7.50 }, { score: '0:2', val: 11.00 },
        { score: '2:1', val: 7.50 },  { score: '2:2', val: 11.00 }, { score: '1:2', val: 10.50 },
      ],
      csOther: 4.30,
      bttsft: { y: 1.90, n: 1.80 },
      bttshf: { y: 4.80, n: 1.15 },
    },
  },
];

const lastResults = [
  { id: 175, home: 'V-Leverkusen', away: 'V-Wolfsburg', score: '1:3', ht: '1:2' },
  { id: 174, home: 'V-Lyon',       away: 'V-Marseille', score: '1:1', ht: '0:1' },
  { id: 173, home: 'V-Sevilla',    away: 'V-Atl.Madrid', score: '3:0', ht: '1:0' },
];

// ─── Odds helpers ─────────────────────────────────────────────────────────────
function ftrOdds(m: VirtMatch) {
  return [
    { fk: `${m.id}_ftr_1`, gk: `${m.id}_ftr`, lbl: '1', val: m.mkts.ftr.h },
    { fk: `${m.id}_ftr_x`, gk: `${m.id}_ftr`, lbl: 'X', val: m.mkts.ftr.d },
    { fk: `${m.id}_ftr_2`, gk: `${m.id}_ftr`, lbl: '2', val: m.mkts.ftr.a },
  ];
}
function htrOdds(m: VirtMatch) {
  return [
    { fk: `${m.id}_htr_1`, gk: `${m.id}_htr`, lbl: '1', val: m.mkts.htr.h },
    { fk: `${m.id}_htr_x`, gk: `${m.id}_htr`, lbl: 'X', val: m.mkts.htr.d },
    { fk: `${m.id}_htr_2`, gk: `${m.id}_htr`, lbl: '2', val: m.mkts.htr.a },
  ];
}

// ─── Selection state — one pick per match ─────────────────────────────────────
// keyed by match id, value = { label, odds, fullKey }
interface SelEntry { label: string; odds: number; fullKey: string; mid: number; gk: string; }
const sels = reactive<Record<number, SelEntry>>({});

function pick(mid: number, gk: string, fk: string, label: string, odds: number) {
  // Toggle off if same odd is tapped again
  if (sels[mid]?.fullKey === fk) {
    delete sels[mid];
  } else {
    // Replace any existing selection for this match with the new one
    sels[mid] = { label, odds, fullKey: fk, mid, gk };
  }
}

function isSel(mid: number, fk: string): boolean {
  return sels[mid]?.fullKey === fk;
}

function removeSel(mid: number) {
  delete sels[mid];
}

const slipEntries = computed(() =>
  Object.values(sels).map(v => ({ gk: v.gk, mid: v.mid, label: v.label, odds: v.odds }))
);

const totalOdds = computed(() =>
  slipEntries.value.reduce((acc, e) => acc * e.odds, 1).toFixed(2)
);

const potentialWin = computed(() =>
  Math.round(virtStake.value * parseFloat(totalOdds.value))
);

function placeVirtBet() {
  if (!store.isLoggedIn) { alert('Please login to place bets'); return; }
  if (store.balance < virtStake.value) { alert('Insufficient balance'); return; }
  store.withdraw(virtStake.value);
  Object.keys(sels).forEach(k => delete (sels as Record<string, unknown>)[k]);
  showMobileSlip.value = false;
  alert('Virtual bet placed! Good luck! 🎉');
}

// ─── Countdown ────────────────────────────────────────────────────────────────
const cdSecs = ref(Math.floor(Math.random() * 300));
const cdDisplay = computed(() => {
  const m = Math.floor(cdSecs.value / 60);
  const s = cdSecs.value % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
});

let timer: ReturnType<typeof setInterval>;
onMounted(() => {
  timer = setInterval(() => {
    if (cdSecs.value > 0) {
      cdSecs.value--;
    } else {
      cdSecs.value = 300;
    }
  }, 1000);
});
onUnmounted(() => clearInterval(timer));
</script>

<style scoped>
/* ─── Page ─────────────────────────────────────────────────────────────────── */
.virt-page {
  background: #f2f3f7;
  min-height: 100vh;
  color: #1a1a2e;
}

/* ─── Top bar ───────────────────────────────────────────────────────────────── */
.virt-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 14px;
  background: #fff;
  border-bottom: 1px solid #e8e9ef;
}
.virt-topbar__kick { display: flex; align-items: center; gap: 6px; }
.virt-topbar__kick-lbl { font-size: 11px; color: #888; }
.virt-topbar__kick-time { font-size: 15px; font-weight: 900; color: #c026d3; font-variant-numeric: tabular-nums; }
.virt-topbar__title { font-size: 16px; font-weight: 900; color: #1a1a2e; letter-spacing: .5px; }
.virt-topbar__note { font-size: 10px; color: #aaa; font-style: italic; text-align: right; }

/* ─── Mobile match tabs ─────────────────────────────────────────────────────── */
.virt-mtabs {
  display: flex;
  background: #fff;
  border-bottom: 2px solid #e8e9ef;
  overflow-x: auto;
}
.virt-mtab {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 8px 6px;
  background: none;
  border: none;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  transition: background .15s;
}
.virt-mtab--active { background: rgba(192,38,211,.07); border-bottom-color: #c026d3; }
.virt-mtab__num { font-size: 9px; font-weight: 700; color: #c026d3; }
.virt-mtab__teams { font-size: 8.5px; color: #666; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 110px; }

/* ─── Layout ────────────────────────────────────────────────────────────────── */
.virt-layout {
  display: flex;
  min-height: 0;
  flex: 1;
  padding: 10px 8px;
  gap: 8px;
}

.virt-cols {
  flex: 1;
  min-width: 0;
  overflow-y: auto;
}

/* Mobile: show only active column */
.virt-col { display: none; }
.virt-col--active { display: block; }

/* ─── Match card wrapper ─────────────────────────────────────────────────────── */
.virt-match-card {
  background: #fff;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 1px 6px rgba(0,0,0,.07), 0 0 1px rgba(0,0,0,.06);
  margin-bottom: 10px;
}

/* ─── Match column header ───────────────────────────────────────────────────── */
.virt-col__hdr {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: #fff;
  border-bottom: 1px solid #f0f1f5;
}
.virt-col__num { font-size: 12px; font-weight: 900; color: #c026d3; flex-shrink: 0; }
.virt-col__teams { display: flex; align-items: center; gap: 5px; flex-wrap: wrap; }
.virt-col__team { font-size: 13px; font-weight: 800; color: #1a1a2e; }
.virt-col__vs { font-size: 9px; color: #bbb; }

/* ─── Section header ────────────────────────────────────────────────────────── */
.virt-sec {
  font-size: 9px;
  font-weight: 800;
  letter-spacing: .6px;
  color: #999;
  background: #f8f8fb;
  padding: 5px 14px;
  text-align: center;
  border-top: 1px solid #f0f1f5;
  border-bottom: 1px solid #f0f1f5;
}

/* ─── Odds rows ─────────────────────────────────────────────────────────────── */
.virt-row {
  display: grid;
  gap: 6px;
  padding: 8px 10px;
  background: #fff;
}
.virt-row--3 { grid-template-columns: repeat(3, 1fr); }
.virt-row--2 { grid-template-columns: repeat(2, 1fr); }

/* ─── Odds button — mobile style ────────────────────────────────────────────── */
.virt-odd {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 11px;
  background: #f5f6fa;
  border: 1.5px solid #e8e9ef;
  border-radius: 8px;
  cursor: pointer;
  transition: background .12s, border-color .12s, transform .08s;
  gap: 4px;
  min-height: 38px;
  position: relative;
}
.virt-odd:hover {
  background: #ede8f8;
  border-color: #c026d3;
}
.virt-odd:active { transform: scale(.97); }

.virt-odd--sel {
  background: linear-gradient(135deg, #f3e8ff, #ede0fc);
  border-color: #c026d3;
  box-shadow: 0 0 0 1px rgba(192,38,211,.2);
}

.virt-odd__lbl {
  font-size: 11px;
  font-weight: 700;
  color: #555;
}
.virt-odd__val {
  font-size: 12px;
  font-weight: 900;
  color: #c026d3;
}
.virt-odd--sel .virt-odd__lbl { color: #7e22ce; }
.virt-odd--sel .virt-odd__val { color: #7e22ce; }

/* Selected checkmark */
.virt-odd--sel::after {
  content: '✓';
  position: absolute;
  top: 3px;
  right: 5px;
  font-size: 8px;
  font-weight: 900;
  color: #c026d3;
}

/* Correct score grid */
.virt-cs-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  padding: 8px 10px;
  background: #fff;
}
.virt-odd--cs {
  flex-direction: row;
  justify-content: space-between;
}
.virt-odd__score {
  font-size: 11px;
  font-weight: 700;
  color: #555;
}

/* Full-width "Any other result" button */
.virt-odd--full {
  width: calc(100% - 20px);
  margin: 0 10px 8px;
  border-radius: 8px;
}

/* ─── Right side panel ──────────────────────────────────────────────────────── */
.virt-side { display: none; }

/* ─── Stream placeholder ────────────────────────────────────────────────────── */
.virt-stream { background: #f8f8fb; flex: 1; min-height: 120px; border-bottom: 1px solid #eee; }
.virt-stream__inner { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px 12px; gap: 8px; }
.virt-stream__live { font-size: 10px; font-weight: 700; color: #ff4c4c; letter-spacing: 1px; }
.virt-stream__pitch { font-size: 36px; opacity: .3; }
.virt-stream__msg { font-size: 10px; color: #aaa; text-align: center; }
.virt-stream__expand {
  margin-top: 8px;
  background: #c026d3;
  color: #fff;
  border: none;
  padding: 8px 14px;
  font-size: 10px;
  font-weight: 700;
  border-radius: 6px;
  cursor: pointer;
  letter-spacing: .5px;
}

/* ─── Bet slip ──────────────────────────────────────────────────────────────── */
.virt-bs { background: #fff; }
.virt-bs__hdr {
  font-size: 10px; font-weight: 800; letter-spacing: .5px;
  color: #c026d3;
  padding: 8px 12px;
  background: #fdf4ff;
  border-top: 2px solid #c026d3;
  border-bottom: 1px solid #f0e6ff;
}
.virt-bs__empty {
  display: flex; flex-direction: column; align-items: center; gap: 6px;
  padding: 20px 12px;
  color: #bbb; font-size: 11px; text-align: center;
}
.virt-bs__empty-icon { font-size: 22px; }

.virt-bs__item {
  display: flex; align-items: center; gap: 6px;
  padding: 7px 10px;
  border-bottom: 1px solid #f5f5f8;
}
.virt-bs__item-left { flex: 1; min-width: 0; }
.virt-bs__item-mid { font-size: 9px; color: #aaa; }
.virt-bs__item-lbl { font-size: 11px; font-weight: 700; color: #1a1a2e; }
.virt-bs__item-odds { font-size: 12px; font-weight: 900; color: #c026d3; flex-shrink: 0; }
.virt-bs__item-del { background: none; border: none; color: #ccc; font-size: 12px; cursor: pointer; padding: 2px 4px; flex-shrink: 0; }

.virt-bs__stake-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: 8px 10px;
  border-top: 1px solid #f5f5f8;
}
.virt-bs__stake-lbl { font-size: 10px; color: #888; }
.virt-bs__stake-input {
  width: 90px;
  background: #f8f8fb; border: 1.5px solid #e0c8f0; border-radius: 6px;
  color: #1a1a2e; font-size: 12px; font-weight: 700;
  padding: 5px 8px; text-align: right;
  outline: none;
}
.virt-bs__stake-input:focus { border-color: #c026d3; }

.virt-bs__totals {
  padding: 6px 10px 8px;
  font-size: 10px; color: #888;
  display: flex; flex-direction: column; gap: 3px;
}
.virt-bs__totals strong { color: #1a1a2e; }

.virt-bs__btn {
  display: block; width: calc(100% - 20px);
  margin: 0 10px 10px;
  background: linear-gradient(90deg, #c026d3, #7e22ce);
  color: #fff; border: none;
  padding: 10px; border-radius: 8px;
  font-size: 12px; font-weight: 800; cursor: pointer;
  letter-spacing: .3px;
}

/* ─── Results bar ───────────────────────────────────────────────────────────── */
.virt-results-bar {
  display: flex; align-items: center; gap: 6px;
  padding: 8px 12px;
  background: #fff;
  border-top: 2px solid #e8e9ef;
  overflow-x: auto;
  flex-shrink: 0;
}
.virt-results-bar__btn {
  background: #c026d3; color: #fff; border: none;
  padding: 5px 12px; border-radius: 5px;
  font-size: 10px; font-weight: 800; cursor: pointer;
  white-space: nowrap; flex-shrink: 0;
}
.virt-results-bar__sep { color: #ddd; font-size: 10px; flex-shrink: 0; }
.virt-results-bar__lbl { font-size: 9px; font-weight: 700; color: #aaa; white-space: nowrap; flex-shrink: 0; }
.virt-results-bar__item { font-size: 10px; color: #666; white-space: nowrap; flex-shrink: 0; }
.virt-results-bar__score { color: #c026d3; font-weight: 700; }

/* ─── Mobile bet slip FAB ───────────────────────────────────────────────────── */
.virt-fab {
  position: fixed; bottom: 70px; right: 14px;
  z-index: 50;
  display: flex; align-items: center; gap: 6px;
  background: linear-gradient(135deg, #c026d3, #7e22ce);
  color: #fff; border: none;
  padding: 10px 16px; border-radius: 24px;
  font-size: 13px; font-weight: 800; cursor: pointer;
  box-shadow: 0 4px 16px rgba(192,38,211,.35);
}
.virt-fab__count {
  background: #fff; color: #7e22ce;
  font-size: 11px; font-weight: 900;
  border-radius: 10px; padding: 1px 6px; min-width: 18px; text-align: center;
}

/* ─── Mobile slip overlay ───────────────────────────────────────────────────── */
.virt-overlay {
  position: fixed; inset: 0; z-index: 100;
  background: rgba(0,0,0,.4);
  display: flex; align-items: flex-end;
}
.virt-sheet {
  background: #fff;
  width: 100%;
  border-radius: 16px 16px 0 0;
  overflow: hidden;
  max-height: 80vh;
  display: flex; flex-direction: column;
}
.virt-sheet__hdr {
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 16px;
  background: #fdf4ff;
  border-bottom: 2px solid #c026d3;
  font-size: 11px; font-weight: 800; color: #c026d3; letter-spacing: .5px;
}
.virt-sheet__close { background: none; border: none; color: #bbb; font-size: 18px; cursor: pointer; }
.virt-sheet__body { overflow-y: auto; flex: 1; }

/* ─── Slide-up transition ───────────────────────────────────────────────────── */
.slide-up-enter-active, .slide-up-leave-active { transition: opacity .25s, transform .25s; }
.slide-up-enter-from, .slide-up-leave-to { opacity: 0; transform: translateY(100%); }

/* ─── DESKTOP ───────────────────────────────────────────────────────────────── */
@media (min-width: 1024px) {
  .virt-mtabs { display: none; }
  .virt-fab   { display: none; }

  .virt-layout {
    height: calc(100vh - 170px);
    overflow: hidden;
    padding: 12px;
    gap: 12px;
    align-items: flex-start;
  }

  .virt-cols {
    flex: 1;
    display: flex;
    gap: 12px;
    overflow-y: auto;
    height: 100%;
    align-items: flex-start;
  }

  .virt-col {
    display: block !important;
    flex: 1;
    min-width: 240px;
    height: 100%;
    overflow-y: auto;
  }

  .virt-match-card {
    margin-bottom: 0;
    height: 100%;
    overflow-y: auto;
    border-radius: 14px;
  }

  .virt-side {
    display: flex;
    flex-direction: column;
    width: 240px;
    flex-shrink: 0;
    overflow-y: auto;
    background: #fff;
    border-radius: 14px;
    box-shadow: 0 1px 6px rgba(0,0,0,.07);
    height: 100%;
  }

  .virt-side__tabs {
    display: flex;
    border-bottom: 1px solid #eee;
    border-radius: 14px 14px 0 0;
    overflow: hidden;
  }
  .virt-side__tab {
    flex: 1;
    background: #f8f8fb; border: none;
    padding: 10px;
    font-size: 10px; font-weight: 800; letter-spacing: .5px;
    color: #aaa;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    transition: all .15s;
  }
  .virt-side__tab--active { color: #c026d3; border-bottom-color: #c026d3; background: #fff; }

  .virt-col__hdr { position: sticky; top: 0; z-index: 5; }
}
</style>
