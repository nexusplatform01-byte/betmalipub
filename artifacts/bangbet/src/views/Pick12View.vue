<template>
  <div class="page p12-page">
    <AppHeader />
    <div class="page-title-bar">
      <button class="back-btn" @click="$router.back()">←</button>
      <span class="page-title">🎯 Pick 12</span>
    </div>

    <!-- Mobile-only hero -->
    <div class="p12-hero p12-hero--mobile">
      <div class="p12-hero__left">
        <div class="p12-hero__tag">FREE TO PLAY</div>
        <div class="p12-hero__title">Pick 12</div>
        <div class="p12-hero__sub">Predict 12 exact scores · Win big weekly</div>
      </div>
      <div class="p12-hero__right">
        <div class="p12-hero__prize-lbl">Weekly Prize</div>
        <div class="p12-hero__prize">UGX 10,000,000</div>
        <div class="p12-hero__deadline">Closes: Sun 28 Jun · 23:59</div>
      </div>
    </div>

    <!-- Mobile-only rules strip -->
    <div class="p12-rules p12-rules--mobile">
      <div class="p12-rule"><span class="p12-rule__icon">🆓</span> Free entry — no stake required</div>
      <div class="p12-rule"><span class="p12-rule__icon">🎯</span> Predict exact scores for all 12 matches</div>
      <div class="p12-rule"><span class="p12-rule__icon">🏆</span> Get all 12 correct to win UGX 10M</div>
      <div class="p12-rule"><span class="p12-rule__icon">📅</span> One entry per player per week</div>
    </div>

    <!-- Mobile-only progress bar -->
    <div class="p12-progress p12-progress--mobile">
      <div class="p12-progress__row">
        <span><strong>{{ filledCount }}</strong>/12 scores entered</span>
        <span v-if="filledCount < 12" class="p12-progress__hint">{{ 12 - filledCount }} left</span>
        <span v-else class="p12-progress__done">✓ All done! Submit now</span>
      </div>
      <div class="p12-progress__track">
        <div class="p12-progress__fill" :style="{ width: (filledCount / 12 * 100) + '%' }"></div>
      </div>
    </div>

    <!-- 3-col desktop layout wrapper -->
    <div class="p12-desktop-layout">

      <!-- ══ LEFT SIDEBAR ══ -->
      <aside class="p12-sidebar p12-sidebar--left">

        <!-- Game hero card -->
        <div class="p12-sb-card p12-sb-game-card">
          <div class="p12-sb-game-card__tag">🆓 FREE TO PLAY</div>
          <div class="p12-sb-game-card__title">Pick 12</div>
          <div class="p12-sb-game-card__sub">Predict exact scores</div>
          <div class="p12-sb-game-card__prize-lbl">Weekly Prize</div>
          <div class="p12-sb-game-card__prize">UGX 10,000,000</div>
          <div class="p12-sb-game-card__deadline">⏰ Closes: Sun 28 Jun · 23:59</div>
        </div>

        <!-- Your predictions progress -->
        <div class="p12-sb-card">
          <div class="p12-sb-card__hdr">🎯 Your Predictions</div>
          <div class="p12-sb-picks-progress">
            <div class="p12-sb-picks-count">
              <strong :class="filledCount === 12 ? 'p12-done' : ''">{{ filledCount }}</strong>
              <span> / 12 entered</span>
            </div>
            <div class="p12-progress__track">
              <div class="p12-progress__fill" :style="{ width: (filledCount / 12 * 100) + '%' }"></div>
            </div>
          </div>
          <div class="p12-sb-pick-list">
            <div
              v-for="(match, i) in matches" :key="match.id"
              class="p12-sb-pick-item"
              :class="{ 'p12-sb-pick-item--done': scores[i][0] !== null && scores[i][1] !== null }"
            >
              <span class="p12-sb-pick-item__num">{{ i + 1 }}</span>
              <span class="p12-sb-pick-item__team">{{ match.home }} v {{ match.away }}</span>
              <span class="p12-sb-pick-item__score">
                {{ scores[i][0] !== null ? scores[i][0] : '?' }}–{{ scores[i][1] !== null ? scores[i][1] : '?' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Quick actions -->
        <div class="p12-sb-card">
          <div class="p12-sb-card__hdr">⚡ Quick Actions</div>
          <div class="p12-sb-actions">
            <button class="p12-sb-action-btn" :disabled="status !== 'open'" @click="autoFill">🎲 Auto Fill All</button>
            <button class="p12-sb-action-btn p12-sb-action-btn--clear" :disabled="status !== 'open'" @click="clearAll">✕ Clear All</button>
          </div>
        </div>

        <!-- Submit / Status card -->
        <div class="p12-sb-card">
          <div class="p12-sb-card__hdr">
            <template v-if="status === 'open'">📤 Submit Entry</template>
            <template v-else-if="status === 'pending'">⏳ Entry Pending</template>
            <template v-else-if="status === 'won'">🏆 You Won!</template>
            <template v-else>😔 Result: Lost</template>
          </div>
          <div class="p12-sb-submit-body">

            <!-- Open: show bet details + submit -->
            <template v-if="status === 'open'">
              <div class="p12-sb-bet-row">
                <span class="p12-sb-bet-lbl">Entry Fee</span>
                <span class="p12-sb-bet-val p12-sb-bet-val--free">FREE</span>
              </div>
              <div class="p12-sb-bet-row">
                <span class="p12-sb-bet-lbl">Prize Pool</span>
                <span class="p12-sb-bet-val">UGX 10M</span>
              </div>
              <div class="p12-sb-bet-row">
                <span class="p12-sb-bet-lbl">Predictions</span>
                <span class="p12-sb-bet-val" :class="filledCount === 12 ? 'p12-done' : ''">{{ filledCount }}/12</span>
              </div>
              <button
                class="p12-submit-btn p12-sb-play-btn"
                :class="{ 'p12-submit-btn--disabled': filledCount < 12 }"
                :disabled="filledCount < 12"
                @click="submitEntry"
              >
                <template v-if="filledCount < 12">Fill {{ 12 - filledCount }} more</template>
                <template v-else>🎯 Submit — FREE</template>
              </button>
            </template>

            <!-- Pending -->
            <template v-else-if="status === 'pending'">
              <div class="p12-sb-status p12-sb-status--pending">
                <div class="p12-sb-status__pulse"></div>
                <div class="p12-sb-status__icon">🎟</div>
                <div class="p12-sb-status__title">Awaiting Results</div>
                <div class="p12-sb-status__sub">Your entry is confirmed. Results are published automatically after all Sunday matches finish.</div>
                <div class="p12-sb-status__badge p12-sb-status__badge--pending">PENDING</div>
              </div>
            </template>

            <!-- Won -->
            <template v-else-if="status === 'won'">
              <div class="p12-sb-status p12-sb-status--won">
                <div class="p12-sb-status__icon">🎉</div>
                <div class="p12-sb-status__title">Jackpot Winner!</div>
                <div class="p12-sb-status__prize">UGX 10,000,000</div>
                <div class="p12-sb-status__sub">Prize credited to your account. New round opens next Monday.</div>
                <div class="p12-sb-status__badge p12-sb-status__badge--won">WON</div>
              </div>
            </template>

            <!-- Lost -->
            <template v-else>
              <div class="p12-sb-status p12-sb-status--lost">
                <div class="p12-sb-status__icon">😔</div>
                <div class="p12-sb-status__title">Not This Time</div>
                <div class="p12-sb-status__correct">{{ correctCount }}/12 correct</div>
                <div class="p12-sb-status__sub">Better luck next week! A new round opens automatically every Monday.</div>
                <div class="p12-sb-status__badge p12-sb-status__badge--lost">LOST</div>
              </div>
            </template>

          </div>
        </div>

      </aside>

      <!-- ══ CENTER: match table ══ -->
      <div class="p12-main">

        <!-- PENDING state -->
        <div v-if="status === 'pending'" class="p12-status-panel p12-status-panel--pending">
          <div class="p12-status-panel__glow"></div>
          <div class="p12-status-panel__icon">🎟</div>
          <div class="p12-status-panel__badge p12-status-panel__badge--pending">● PENDING</div>
          <div class="p12-status-panel__title">Entry Submitted!</div>
          <div class="p12-status-panel__sub">Your predictions are locked in. Results are published automatically once all Sunday matches finish. Check back then!</div>
          <div class="p12-status-panel__note">📅 Next round opens automatically every Monday morning.</div>
          <!-- Your locked picks -->
          <div class="p12-sub-picks">
            <div class="p12-sub-picks__hdr">Your locked predictions</div>
            <div v-for="(match, i) in matches" :key="match.id" class="p12-sub-row">
              <span class="p12-sub-row__num">{{ i + 1 }}</span>
              <span class="p12-sub-row__match">{{ match.home }} vs {{ match.away }}</span>
              <span class="p12-sub-row__score">{{ scores[i][0] }} – {{ scores[i][1] }}</span>
            </div>
          </div>
        </div>

        <!-- WON state -->
        <div v-else-if="status === 'won'" class="p12-status-panel p12-status-panel--won">
          <div class="p12-status-panel__confetti">🎊🎊🎊</div>
          <div class="p12-status-panel__icon">🏆</div>
          <div class="p12-status-panel__badge p12-status-panel__badge--won">✓ WON</div>
          <div class="p12-status-panel__title">Jackpot Winner!</div>
          <div class="p12-status-panel__prize">UGX 10,000,000</div>
          <div class="p12-status-panel__sub">Congratulations! You got all 12 scores correct. The prize has been credited to your account.</div>
          <div class="p12-status-panel__note">📅 A new round opens automatically next Monday.</div>
          <div class="p12-sub-picks">
            <div class="p12-sub-picks__hdr">Your winning predictions</div>
            <div v-for="(match, i) in matches" :key="match.id" class="p12-sub-row p12-sub-row--correct">
              <span class="p12-sub-row__num">{{ i + 1 }}</span>
              <span class="p12-sub-row__match">{{ match.home }} vs {{ match.away }}</span>
              <span class="p12-sub-row__score">{{ scores[i][0] }} – {{ scores[i][1] }}</span>
              <span class="p12-sub-row__tick">✓</span>
            </div>
          </div>
        </div>

        <!-- LOST state -->
        <div v-else-if="status === 'lost'" class="p12-status-panel p12-status-panel--lost">
          <div class="p12-status-panel__icon">😔</div>
          <div class="p12-status-panel__badge p12-status-panel__badge--lost">✗ LOST</div>
          <div class="p12-status-panel__title">Not This Time</div>
          <div class="p12-status-panel__correct">{{ correctCount }} out of 12 correct</div>
          <div class="p12-status-panel__sub">So close! Better luck next week. A new round opens automatically every Monday morning — no action needed.</div>
          <div class="p12-status-panel__note">📅 Next round opens automatically every Monday morning.</div>
          <div class="p12-sub-picks">
            <div class="p12-sub-picks__hdr">Your predictions vs results</div>
            <div
              v-for="(match, i) in matches" :key="match.id"
              class="p12-sub-row"
              :class="actualResults[i] && scores[i][0] === actualResults[i][0] && scores[i][1] === actualResults[i][1] ? 'p12-sub-row--correct' : 'p12-sub-row--wrong'"
            >
              <span class="p12-sub-row__num">{{ i + 1 }}</span>
              <span class="p12-sub-row__match">{{ match.home }} vs {{ match.away }}</span>
              <span class="p12-sub-row__score">{{ scores[i][0] }}–{{ scores[i][1] }}</span>
              <span class="p12-sub-row__actual">Actual: {{ actualResults[i]?.[0] }}–{{ actualResults[i]?.[1] }}</span>
              <span class="p12-sub-row__tick">{{ actualResults[i] && scores[i][0] === actualResults[i][0] && scores[i][1] === actualResults[i][1] ? '✓' : '✗' }}</span>
            </div>
          </div>
        </div>

        <!-- OPEN: match prediction table -->
        <div v-else class="p12-table">
          <div class="p12-table__hdr">
            <div class="p12-th-num">#</div>
            <div class="p12-th-info">Match</div>
            <div class="p12-th-score">Home</div>
            <div class="p12-th-sep"></div>
            <div class="p12-th-score">Away</div>
          </div>

          <div
            v-for="(match, i) in matches" :key="match.id"
            class="p12-row"
            :class="{ 'p12-row--filled': scores[i][0] !== null && scores[i][1] !== null }"
          >
            <div class="p12-row__num">{{ i + 1 }}</div>
            <div class="p12-row__info">
              <div class="p12-row__league">{{ match.league }}</div>
              <div class="p12-row__teams">
                <span class="p12-row__home">{{ match.home }}</span>
                <span class="p12-row__vs">vs</span>
                <span class="p12-row__away">{{ match.away }}</span>
              </div>
              <div class="p12-row__time">{{ match.time }}</div>
            </div>
            <input type="number" class="p12-score-input" min="0" max="9" placeholder="?"
              :value="scores[i][0] ?? ''"
              @change="setScore(i, 0, $event)" @input="setScore(i, 0, $event)" />
            <div class="p12-score-dash">–</div>
            <input type="number" class="p12-score-input" min="0" max="9" placeholder="?"
              :value="scores[i][1] ?? ''"
              @change="setScore(i, 1, $event)" @input="setScore(i, 1, $event)" />
          </div>
        </div>

        <!-- Mobile-only footer (only when open) -->
        <div v-if="status === 'open'" class="p12-footer p12-footer--mobile">
          <div class="p12-footer__info">
            <span>{{ filledCount }}/12 predictions</span>
            <span class="p12-footer__free">FREE ENTRY</span>
          </div>
          <button
            class="p12-submit-btn"
            :class="{ 'p12-submit-btn--disabled': filledCount < 12 }"
            :disabled="filledCount < 12"
            @click="submitEntry"
          >
            <template v-if="filledCount < 12">Enter {{ 12 - filledCount }} more scores</template>
            <template v-else>🎯 Submit My Picks — FREE</template>
          </button>
        </div>

        <!-- Mobile-only status banners -->
        <div v-if="status === 'pending'" class="p12-mobile-status p12-mobile-status--pending">
          <span class="p12-mobile-status__dot"></span> Your entry is <strong>Pending</strong> — results publish after Sunday's matches.
        </div>
        <div v-if="status === 'won'" class="p12-mobile-status p12-mobile-status--won">
          🏆 <strong>WON!</strong> UGX 10M credited to your account.
        </div>
        <div v-if="status === 'lost'" class="p12-mobile-status p12-mobile-status--lost">
          😔 <strong>Lost</strong> — {{ correctCount }}/12 correct. New round starts next Monday.
        </div>

      </div><!-- end p12-main -->

      <!-- ══ RIGHT SIDEBAR ══ -->
      <aside class="p12-sidebar p12-sidebar--right">

        <!-- How to play -->
        <div class="p12-sb-card">
          <div class="p12-sb-card__hdr">📖 How to Play</div>
          <ol class="p12-sb-steps">
            <li class="p12-sb-step"><span class="p12-sb-step__num">1</span><span>It's completely <strong>free</strong> — no stake needed</span></li>
            <li class="p12-sb-step"><span class="p12-sb-step__num">2</span><span>Enter the exact scoreline for all <strong>12 matches</strong></span></li>
            <li class="p12-sb-step"><span class="p12-sb-step__num">3</span><span>Submit before the deadline — <strong>Sun 28 Jun · 23:59</strong></span></li>
            <li class="p12-sb-step"><span class="p12-sb-step__num">4</span><span>Get all 12 exact scores correct → <strong>WIN UGX 10M!</strong></span></li>
          </ol>
          <div class="p12-sb-note">💡 Closest entry wins a consolation prize if nobody gets all 12.</div>
        </div>

        <!-- Past winners -->
        <div class="p12-sb-card">
          <div class="p12-sb-card__hdr">🏆 Recent Winners</div>
          <div class="p12-sb-winner" v-for="w in pastWinners" :key="w.name">
            <div class="p12-sb-winner__avatar">🥇</div>
            <div class="p12-sb-winner__info">
              <div class="p12-sb-winner__name">{{ w.name }}</div>
              <div class="p12-sb-winner__week">{{ w.week }}</div>
            </div>
            <div class="p12-sb-winner__prize">UGX 10M</div>
          </div>
        </div>

        <!-- Stats -->
        <div class="p12-sb-card">
          <div class="p12-sb-card__hdr">📊 This Week</div>
          <div class="p12-sb-stats">
            <div class="p12-sb-stat"><span class="p12-sb-stat__val">28,541</span><span class="p12-sb-stat__lbl">Entries so far</span></div>
            <div class="p12-sb-stat"><span class="p12-sb-stat__val">{{ filledCount }}/12</span><span class="p12-sb-stat__lbl">Your progress</span></div>
            <div class="p12-sb-stat"><span class="p12-sb-stat__val">6</span><span class="p12-sb-stat__lbl">Days remaining</span></div>
            <div class="p12-sb-stat"><span class="p12-sb-stat__val">12</span><span class="p12-sb-stat__lbl">Matches to predict</span></div>
          </div>
        </div>

        <!-- Mobile past winners (also visible on mobile at bottom) -->
        <div class="p12-sb-card p12-sb-card--rules-mobile">
          <div class="p12-sb-card__hdr">✅ Rules</div>
          <div class="p12-sb-rules-list">
            <div class="p12-sb-rule"><span>🆓</span> Free entry, no stake needed</div>
            <div class="p12-sb-rule"><span>🎯</span> Exact scores for all 12 matches</div>
            <div class="p12-sb-rule"><span>📅</span> One entry per player per week</div>
            <div class="p12-sb-rule"><span>🏆</span> All 12 correct wins UGX 10M</div>
          </div>
        </div>

      </aside>

    </div><!-- end p12-desktop-layout -->

    <div style="height:70px"></div>
    <BottomNav />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import AppHeader from '@/components/AppHeader.vue';
import BottomNav from '@/components/BottomNav.vue';

type Status = 'open' | 'pending' | 'won' | 'lost';
const status = ref<Status>('open');

interface P12Match { id: string; league: string; home: string; away: string; time: string; }

const matches: P12Match[] = [
  { id: 'p1',  league: 'EPL',           home: 'Arsenal',        away: 'Liverpool',    time: 'Sun 28 Jun 15:00' },
  { id: 'p2',  league: 'EPL',           home: 'Man City',       away: 'Chelsea',      time: 'Sun 28 Jun 15:00' },
  { id: 'p3',  league: 'La Liga',       home: 'Real Madrid',    away: 'Barcelona',    time: 'Sun 28 Jun 16:00' },
  { id: 'p4',  league: 'Bundesliga',    home: 'Bayern Munich',  away: 'Dortmund',     time: 'Sun 28 Jun 17:30' },
  { id: 'p5',  league: 'Ligue 1',       home: 'PSG',            away: 'Lyon',         time: 'Sun 28 Jun 17:00' },
  { id: 'p6',  league: 'Serie A',       home: 'Inter Milan',    away: 'AC Milan',     time: 'Sun 28 Jun 18:00' },
  { id: 'p7',  league: 'Eredivisie',    home: 'Ajax',           away: 'PSV',          time: 'Sun 28 Jun 14:00' },
  { id: 'p8',  league: 'Scottish PL',   home: 'Celtic',         away: 'Rangers',      time: 'Sun 28 Jun 13:00' },
  { id: 'p9',  league: 'Liga Portugal', home: 'Porto',          away: 'Sporting',     time: 'Sun 28 Jun 19:00' },
  { id: 'p10', league: 'Uganda PL',     home: 'KCCA FC',        away: 'Vipers SC',    time: 'Sun 28 Jun 15:00' },
  { id: 'p11', league: 'Süper Lig',     home: 'Galatasaray',    away: 'Besiktas',     time: 'Sun 28 Jun 18:00' },
  { id: 'p12', league: 'Brasileirao',   home: 'Flamengo',       away: 'Corinthians',  time: 'Sun 28 Jun 20:00' },
];

const scores = reactive<([number | null, number | null])[]>(
  Array.from({ length: 12 }, () => [null, null])
);

// Simulated actual results (revealed when status becomes won/lost)
const actualResults = ref<([number, number] | null)[]>(Array(12).fill(null));

const filledCount = computed(() =>
  scores.filter(s => s[0] !== null && s[1] !== null).length
);

const correctCount = computed(() => {
  if (!actualResults.value.some(r => r !== null)) return 0;
  return scores.filter((s, i) => {
    const r = actualResults.value[i];
    return r && s[0] === r[0] && s[1] === r[1];
  }).length;
});

function setScore(matchIdx: number, side: 0 | 1, event: Event) {
  const raw = (event.target as HTMLInputElement).value;
  if (raw === '' || raw === null) { scores[matchIdx][side] = null; return; }
  const val = parseInt(raw, 10);
  if (isNaN(val) || val < 0) { scores[matchIdx][side] = null; return; }
  scores[matchIdx][side] = Math.min(9, val);
}

function autoFill() {
  if (status.value !== 'open') return;
  scores.forEach((_, i) => {
    scores[i][0] = Math.floor(Math.random() * 5);
    scores[i][1] = Math.floor(Math.random() * 4);
  });
}

function clearAll() {
  if (status.value !== 'open') return;
  scores.forEach((_, i) => { scores[i][0] = null; scores[i][1] = null; });
}

function submitEntry() {
  if (filledCount.value < 12) return;
  status.value = 'pending';
  // Demo: simulate results arriving after 4 seconds
  setTimeout(() => {
    const results: [number, number][] = Array.from({ length: 12 }, () => [
      Math.floor(Math.random() * 4),
      Math.floor(Math.random() * 4),
    ]);
    actualResults.value = results;
    const correct = scores.filter((s, i) => s[0] === results[i][0] && s[1] === results[i][1]).length;
    status.value = correct === 12 ? 'won' : 'lost';
  }, 4000);
}

const pastWinners = [
  { name: 'James O. (Kampala)', week: 'Week of 15 Jun 2026' },
  { name: 'Sarah M. (Entebbe)', week: 'Week of 8 Jun 2026' },
  { name: 'David K. (Jinja)',   week: 'Week of 1 Jun 2026' },
];
</script>

<style scoped>
.p12-page { background: var(--bg-main); }

/* ─── Mobile-only hero ───────────────────────────────────── */
.p12-hero {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 14px;
  background: linear-gradient(135deg, #1c1e24 0%, #292a33 100%);
  gap: 12px;
}
.p12-hero__left { flex: 1; }
.p12-hero__tag {
  display: inline-block;
  font-size: 9px; font-weight: 900; letter-spacing: 1px;
  background: #10a310; color: #fff;
  border-radius: 10px; padding: 2px 8px; margin-bottom: 6px;
}
.p12-hero__title { font-size: 26px; font-weight: 900; color: #fff; line-height: 1; margin-bottom: 4px; }
.p12-hero__sub   { font-size: 11px; color: rgba(255,255,255,.55); }
.p12-hero__right { text-align: right; flex-shrink: 0; }
.p12-hero__prize-lbl { font-size: 9px; color: rgba(255,255,255,.5); margin-bottom: 2px; }
.p12-hero__prize     { font-size: 20px; font-weight: 900; color: #ffe60f; }
.p12-hero__deadline  { font-size: 9px; color: rgba(255,255,255,.4); margin-top: 4px; }

/* ─── Mobile-only rules strip ────────────────────────────── */
.p12-rules {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 6px; padding: 10px 10px 6px;
  background: #fff; border-bottom: 1px solid #ebebeb;
}
.p12-rule { display: flex; align-items: center; gap: 5px; font-size: 10px; color: #6a6f7a; }
.p12-rule__icon { font-size: 12px; }

/* ─── Progress ───────────────────────────────────────────── */
.p12-progress {
  background: #fff; padding: 8px 12px; border-bottom: 1px solid #ebebeb;
}
.p12-progress__row {
  display: flex; justify-content: space-between;
  font-size: 11px; color: #6a6f7a; margin-bottom: 5px;
}
.p12-progress__row strong { color: #292a33; }
.p12-progress__hint { color: #9599a4; }
.p12-progress__done { font-weight: 700; color: #10a310; }
.p12-progress__track { height: 5px; background: #e8e9ed; border-radius: 4px; overflow: hidden; }
.p12-progress__fill {
  height: 100%; border-radius: 4px;
  background: linear-gradient(90deg, #d946ef, #a21caf);
  transition: width .4s ease; min-width: 3px;
}

/* ─── 3-col layout wrapper ───────────────────────────────── */
.p12-desktop-layout { display: flex; flex-direction: column; }
.p12-sidebar { display: none; }

/* ─── Shared sidebar card ────────────────────────────────── */
.p12-sb-card {
  background: #fff; border-radius: 12px;
  box-shadow: 0 1px 6px rgba(0,0,0,.08); overflow: visible;
}
.p12-sb-card__hdr {
  font-size: 11px; font-weight: 800; letter-spacing: .4px;
  color: #292a33; padding: 10px 14px 8px;
  border-bottom: 1px solid #f0f1f5;
  background: #fafafa; border-radius: 12px 12px 0 0;
}

/* ── Game hero card ── */
.p12-sb-game-card {
  padding: 20px 16px 16px; text-align: center; color: #fff; overflow: hidden;
  background: linear-gradient(135deg, #1c1e24 0%, #3a1a6e 100%);
}
.p12-sb-game-card__tag {
  display: inline-block; font-size: 9px; font-weight: 900; letter-spacing: 1px;
  background: #10a310; color: #fff; border-radius: 10px; padding: 2px 10px; margin-bottom: 8px;
}
.p12-sb-game-card__title { font-size: 28px; font-weight: 900; line-height: 1; margin-bottom: 4px; }
.p12-sb-game-card__sub   { font-size: 10px; opacity: .65; margin-bottom: 14px; }
.p12-sb-game-card__prize-lbl { font-size: 9px; opacity: .6; margin-bottom: 4px; }
.p12-sb-game-card__prize     { font-size: 22px; font-weight: 900; color: #ffe60f; margin-bottom: 8px; }
.p12-sb-game-card__deadline  {
  font-size: 10px; opacity: .7;
  background: rgba(255,255,255,.1); border-radius: 6px; padding: 5px 10px;
}

/* ── Picks progress ── */
.p12-sb-picks-progress { padding: 10px 14px 6px; }
.p12-sb-picks-count { font-size: 11px; color: #6a6f7a; margin-bottom: 6px; }
.p12-sb-picks-count strong { font-size: 16px; color: #292a33; }
.p12-done { color: #10a310 !important; }

/* ── Mini picks list ── */
.p12-sb-pick-list { padding: 0 0 6px; }
.p12-sb-pick-item {
  display: flex; align-items: center; gap: 6px;
  padding: 5px 14px; border-top: 1px solid #f5f5f8;
  font-size: 10px; color: #9599a4;
}
.p12-sb-pick-item--done { background: #f9fff9; color: #292a33; }
.p12-sb-pick-item__num {
  width: 16px; height: 16px; border-radius: 50%;
  background: #e8eaf0; color: #9599a4;
  display: flex; align-items: center; justify-content: center;
  font-size: 9px; font-weight: 700; flex-shrink: 0;
}
.p12-sb-pick-item--done .p12-sb-pick-item__num { background: #dcf5dc; color: #10a310; }
.p12-sb-pick-item__team  { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.p12-sb-pick-item__score { font-size: 11px; font-weight: 900; color: #d946ef; min-width: 28px; text-align: right; flex-shrink: 0; }
.p12-sb-pick-item--done .p12-sb-pick-item__score { color: #d946ef; }

/* ── Quick actions ── */
.p12-sb-actions { display: flex; flex-direction: column; gap: 8px; padding: 10px 14px; }
.p12-sb-action-btn {
  width: 100%; padding: 9px 12px;
  border-radius: 8px; border: 1.5px solid #e0e2ea;
  background: #f5f6fa; color: #292a33;
  font-size: 12px; font-weight: 700; cursor: pointer;
  transition: background .12s, border-color .12s;
}
.p12-sb-action-btn:hover:not(:disabled) { background: #f5e8fb; border-color: #d946ef; color: #d946ef; }
.p12-sb-action-btn--clear:hover:not(:disabled) { background: #fff0f0; border-color: #e53e3e; color: #e53e3e; }
.p12-sb-action-btn:disabled { opacity: .4; cursor: not-allowed; }

/* ── Submit card ── */
.p12-sb-submit-body { padding: 10px 14px 14px; display: flex; flex-direction: column; gap: 8px; }
.p12-sb-bet-row  { display: flex; justify-content: space-between; align-items: center; }
.p12-sb-bet-lbl  { font-size: 11px; color: #9599a4; }
.p12-sb-bet-val  { font-size: 13px; font-weight: 800; color: #292a33; }
.p12-sb-bet-val--free { color: #10a310; }
.p12-sb-play-btn { margin-top: 4px; }
.p12-sb-confirmed { text-align: center; padding: 6px 0 2px; }
.p12-sb-confirmed__icon  { font-size: 28px; margin-bottom: 4px; }
.p12-sb-confirmed__title { font-size: 13px; font-weight: 800; color: #292a33; margin-bottom: 4px; }
.p12-sb-confirmed__sub   { font-size: 10px; color: #9599a4; margin-bottom: 8px; line-height: 1.4; }
.p12-sb-reset { padding: 8px 16px; font-size: 11px; }

/* ── Right sidebar ── */
.p12-sb-steps {
  margin: 0; padding: 10px 14px; list-style: none;
  display: flex; flex-direction: column; gap: 8px;
}
.p12-sb-step {
  display: flex; align-items: flex-start; gap: 8px;
  font-size: 11px; color: #6a6f7a; line-height: 1.45;
}
.p12-sb-step strong { color: #292a33; }
.p12-sb-step__num {
  display: flex; align-items: center; justify-content: center;
  width: 18px; height: 18px; border-radius: 50%;
  background: #d946ef; color: #fff;
  font-size: 9px; font-weight: 900; flex-shrink: 0; margin-top: 1px;
}
.p12-sb-note { font-size: 10px; color: #9599a4; padding: 0 14px 12px; line-height: 1.5; }

.p12-sb-winner {
  display: flex; align-items: center; gap: 8px;
  padding: 8px 14px; border-bottom: 1px solid #f5f5f8;
}
.p12-sb-winner:last-child { border-bottom: none; }
.p12-sb-winner__avatar { font-size: 20px; flex-shrink: 0; }
.p12-sb-winner__info   { flex: 1; min-width: 0; }
.p12-sb-winner__name   { font-size: 11px; font-weight: 700; color: #292a33; }
.p12-sb-winner__week   { font-size: 9px; color: #9599a4; }
.p12-sb-winner__prize  { font-size: 11px; font-weight: 900; color: #10a310; }

.p12-sb-stats {
  display: grid; grid-template-columns: 1fr 1fr;
  padding: 10px 14px 12px; gap: 10px;
}
.p12-sb-stat { display: flex; flex-direction: column; align-items: center; gap: 2px; }
.p12-sb-stat__val { font-size: 15px; font-weight: 900; color: #292a33; }
.p12-sb-stat__lbl { font-size: 9px; color: #9599a4; text-align: center; }

.p12-sb-rules-list { padding: 8px 14px 12px; display: flex; flex-direction: column; gap: 7px; }
.p12-sb-rule { display: flex; align-items: center; gap: 6px; font-size: 11px; color: #6a6f7a; }

/* ─── Table ──────────────────────────────────────────────── */
.p12-table { background: #fff; margin-top: 8px; }
.p12-table__hdr {
  display: grid;
  grid-template-columns: 28px 1fr 58px 16px 58px;
  padding: 6px 8px;
  border-bottom: 2px solid #d946ef;
  background: #fff;
}
.p12-th-num   { font-size: 9px; font-weight: 800; color: #9599a4; text-align: center; }
.p12-th-info  { font-size: 9px; font-weight: 800; color: #9599a4; padding-left: 4px; }
.p12-th-score { font-size: 9px; font-weight: 800; color: #9599a4; text-align: center; }

.p12-row {
  display: grid;
  grid-template-columns: 28px 1fr 58px 16px 58px;
  align-items: center;
  padding: 7px 8px;
  border-bottom: 1px solid #f0f0f4;
  transition: background .1s;
}
.p12-row--filled { background: rgba(217,70,239,.04); }

.p12-row__num    { font-size: 10px; font-weight: 700; color: #9599a4; text-align: center; }
.p12-row__info   { padding-right: 4px; }
.p12-row__league { font-size: 9px; color: #9599a4; margin-bottom: 2px; }
.p12-row__teams  { display: flex; align-items: center; gap: 3px; flex-wrap: wrap; }
.p12-row__home, .p12-row__away { font-size: 11px; font-weight: 700; color: #292a33; }
.p12-row__vs     { font-size: 9px; color: #9599a4; }
.p12-row__time   { font-size: 9px; color: #9599a4; margin-top: 1px; }

/* ── Number input ── */
.p12-score-input {
  width: 100%; height: 36px;
  border: 1.5px solid #e0e1e5;
  border-radius: 7px;
  background: #f5f6fa;
  font-size: 16px; font-weight: 900;
  color: #292a33;
  text-align: center;
  padding: 0 4px;
  -moz-appearance: textfield;
  transition: border-color .12s, background .12s;
}
.p12-score-input:focus { outline: none; border-color: #d946ef; background: #fff; }
.p12-score-input::placeholder { color: #c0c2cc; font-weight: 400; font-size: 13px; }
.p12-score-input::-webkit-outer-spin-button,
.p12-score-input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
.p12-row--filled .p12-score-input { border-color: #e8b4f5; color: #a21caf; background: #fdf5ff; }
.p12-score-input:disabled { opacity: .5; cursor: not-allowed; }

.p12-score-dash { text-align: center; font-size: 14px; font-weight: 700; color: #9599a4; }

/* ─── Footer ─────────────────────────────────────────────── */
.p12-footer {
  padding: 12px; background: #fff;
  border-top: 1px solid #ebebeb; margin-top: 8px;
}
.p12-footer__info {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 10px; font-size: 11px; color: #6a6f7a;
}
.p12-footer__free {
  font-size: 10px; font-weight: 800; letter-spacing: .5px;
  background: #10a310; color: #fff; border-radius: 10px; padding: 2px 8px;
}
.p12-submit-btn {
  display: block; width: 100%; padding: 13px; border: none; border-radius: 9px;
  font-size: 14px; font-weight: 800; cursor: pointer;
  background: linear-gradient(90deg, #d946ef, #a21caf); color: #fff;
  transition: opacity .15s;
}
.p12-submit-btn--disabled { opacity: 0.5; cursor: not-allowed; }

/* ─── Status panels (pending / won / lost) ───────────────── */
.p12-status-panel {
  background: #fff; padding: 28px 20px 20px; margin-top: 8px;
  text-align: center; position: relative; overflow: hidden;
}
.p12-status-panel__glow {
  position: absolute; top: -40px; left: 50%; transform: translateX(-50%);
  width: 200px; height: 200px; border-radius: 50%;
  background: rgba(59, 130, 246, .12); pointer-events: none;
}
.p12-status-panel__confetti { font-size: 28px; margin-bottom: 4px; letter-spacing: 4px; }
.p12-status-panel__icon  { font-size: 52px; margin-bottom: 8px; }
.p12-status-panel__badge {
  display: inline-flex; align-items: center; gap: 5px;
  font-size: 10px; font-weight: 900; letter-spacing: 1px;
  border-radius: 20px; padding: 3px 12px; margin-bottom: 10px;
}
.p12-status-panel__badge--pending { background: #fef3c7; color: #92400e; }
.p12-status-panel__badge--won     { background: #d1fae5; color: #065f46; }
.p12-status-panel__badge--lost    { background: #fee2e2; color: #991b1b; }
.p12-status-panel__title   { font-size: 22px; font-weight: 900; color: #292a33; margin-bottom: 6px; }
.p12-status-panel__prize   { font-size: 28px; font-weight: 900; color: #10a310; margin-bottom: 8px; }
.p12-status-panel__correct { font-size: 16px; font-weight: 800; color: #6a6f7a; margin-bottom: 8px; }
.p12-status-panel__sub  { font-size: 12px; color: #6a6f7a; line-height: 1.65; max-width: 400px; margin: 0 auto 10px; }
.p12-status-panel__note { font-size: 11px; color: #9599a4; margin-bottom: 18px; }

/* pending pulsing dot animation */
.p12-status-panel--pending .p12-status-panel__glow {
  animation: p12-glow-pulse 2s ease-in-out infinite;
}
@keyframes p12-glow-pulse {
  0%, 100% { opacity: .4; transform: translateX(-50%) scale(1); }
  50%       { opacity: .9; transform: translateX(-50%) scale(1.2); }
}

/* Sub picks list inside panels */
.p12-sub-picks { text-align: left; margin-top: 4px; border-top: 1px solid #f0f0f4; }
.p12-sub-picks__hdr {
  font-size: 10px; font-weight: 800; color: #9599a4;
  letter-spacing: .4px; padding: 10px 0 4px;
}
.p12-sub-row {
  display: flex; align-items: center; gap: 8px;
  padding: 6px 0; border-bottom: 1px solid #f0f0f4; font-size: 12px;
}
.p12-sub-row--correct { background: rgba(16,163,16,.04); }
.p12-sub-row--wrong   { background: rgba(239,68,68,.04); }
.p12-sub-row__num    { width: 20px; font-weight: 700; color: #9599a4; flex-shrink: 0; text-align: center; }
.p12-sub-row__match  { flex: 1; color: #292a33; font-weight: 600; font-size: 11px; }
.p12-sub-row__score  { font-weight: 900; color: #d946ef; flex-shrink: 0; }
.p12-sub-row__actual { font-size: 10px; color: #9599a4; flex-shrink: 0; }
.p12-sub-row__tick   { font-size: 12px; font-weight: 900; flex-shrink: 0; }
.p12-sub-row--correct .p12-sub-row__tick { color: #10a310; }
.p12-sub-row--wrong   .p12-sub-row__tick { color: #ef4444; }

/* Left sidebar status panels */
.p12-sb-status { text-align: center; padding: 10px 0 4px; }
.p12-sb-status__pulse {
  width: 8px; height: 8px; border-radius: 50%;
  background: #f59e0b; margin: 0 auto 8px;
  animation: p12-dot-pulse 1.4s ease-in-out infinite;
}
@keyframes p12-dot-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: .4; transform: scale(.6); }
}
.p12-sb-status__icon    { font-size: 30px; margin-bottom: 6px; }
.p12-sb-status__title   { font-size: 13px; font-weight: 800; color: #292a33; margin-bottom: 6px; }
.p12-sb-status__prize   { font-size: 17px; font-weight: 900; color: #10a310; margin-bottom: 6px; }
.p12-sb-status__correct { font-size: 13px; font-weight: 800; color: #6a6f7a; margin-bottom: 6px; }
.p12-sb-status__sub     { font-size: 10px; color: #9599a4; line-height: 1.5; margin-bottom: 10px; }
.p12-sb-status__badge {
  display: inline-block; font-size: 9px; font-weight: 900; letter-spacing: 1px;
  border-radius: 20px; padding: 3px 10px;
}
.p12-sb-status__badge--pending { background: #fef3c7; color: #92400e; }
.p12-sb-status__badge--won     { background: #d1fae5; color: #065f46; }
.p12-sb-status__badge--lost    { background: #fee2e2; color: #991b1b; }

/* Mobile status banner */
.p12-mobile-status {
  display: flex; align-items: center; gap: 8px;
  padding: 12px 14px; font-size: 12px; color: #292a33;
  margin-top: 8px; border-radius: 8px; margin: 8px 10px 0;
}
.p12-mobile-status--pending { background: #fef3c7; }
.p12-mobile-status--won     { background: #d1fae5; }
.p12-mobile-status--lost    { background: #fee2e2; }
.p12-mobile-status__dot {
  width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0;
  background: #f59e0b;
  animation: p12-dot-pulse 1.4s ease-in-out infinite;
}

.p12-reset-btn {
  background: #f0f1f5; border: 1px solid #e0e1e5;
  border-radius: 8px; padding: 10px 24px;
  font-size: 13px; font-weight: 700; color: #292a33; cursor: pointer;
}

/* ─── Desktop 3-col ──────────────────────────────────────── */
@media (min-width: 1024px) {
  .p12-hero--mobile     { display: none; }
  .p12-rules--mobile    { display: none; }
  .p12-progress--mobile { display: none; }
  .p12-footer--mobile   { display: none; }
  .p12-sb-card--rules-mobile { display: none; }

  .p12-desktop-layout {
    flex-direction: row;
    align-items: flex-start;
    gap: 14px;
    padding: 14px 20px;
  }

  /* Left sidebar */
  .p12-sidebar--left {
    display: flex; flex-direction: column; gap: 12px;
    width: 230px; flex-shrink: 0;
    position: sticky; top: 56px;
  }

  /* Center */
  .p12-main {
    flex: 1; min-width: 0;
    background: #fff; border-radius: 12px;
    box-shadow: 0 1px 6px rgba(0,0,0,.07); overflow: hidden;
  }
  .p12-table { margin-top: 0; border-radius: 0; }
  .p12-table__hdr,
  .p12-row {
    grid-template-columns: 34px 1fr 72px 20px 72px;
    padding: 9px 16px;
  }
  .p12-score-input { height: 38px; font-size: 17px; }
  .p12-row__home, .p12-row__away { font-size: 12px; }

  /* Right sidebar */
  .p12-sidebar--right {
    display: flex; flex-direction: column; gap: 12px;
    width: 230px; flex-shrink: 0;
    position: sticky; top: 56px;
  }
}
</style>
