<template>
  <div class="page p12-page">
    <AppHeader />
    <div class="page-title-bar">
      <button class="back-btn" @click="$router.back()">←</button>
      <span class="page-title">🎯 Pick 12</span>
    </div>

    <!-- Hero banner -->
    <div class="p12-hero">
      <div class="p12-hero__left">
        <div class="p12-hero__tag">FREE TO PLAY</div>
        <div class="p12-hero__title">Pick 12</div>
        <div class="p12-hero__sub">Predict 12 correct scores · Win big weekly</div>
      </div>
      <div class="p12-hero__right">
        <div class="p12-hero__prize-lbl">Weekly Prize</div>
        <div class="p12-hero__prize">UGX 10,000,000</div>
        <div class="p12-hero__deadline">Closes: Sun 28 Jun · 23:59</div>
      </div>
    </div>

    <!-- Rules strip -->
    <div class="p12-rules">
      <div class="p12-rule"><span class="p12-rule__icon">🆓</span> Free entry — no stake required</div>
      <div class="p12-rule"><span class="p12-rule__icon">🎯</span> Predict exact scores for all 12 matches</div>
      <div class="p12-rule"><span class="p12-rule__icon">🏆</span> Get all 12 correct to win UGX 10M</div>
      <div class="p12-rule"><span class="p12-rule__icon">📅</span> One entry per player per week</div>
    </div>

    <!-- Progress bar -->
    <div class="p12-progress">
      <div class="p12-progress__row">
        <span><strong>{{ filledCount }}</strong>/12 scores entered</span>
        <span v-if="filledCount < 12" class="p12-progress__hint">{{ 12 - filledCount }} left</span>
        <span v-else class="p12-progress__done">✓ All done! Submit now</span>
      </div>
      <div class="p12-progress__track">
        <div class="p12-progress__fill" :style="{ width: (filledCount / 12 * 100) + '%' }"></div>
      </div>
    </div>

    <!-- Submitted state -->
    <div v-if="submitted" class="p12-submitted">
      <div class="p12-submitted__icon">🎟</div>
      <div class="p12-submitted__title">Predictions Submitted!</div>
      <div class="p12-submitted__sub">Results will be available on Sunday after all matches finish.</div>
      <div class="p12-submitted__picks">
        <div v-for="(match, i) in matches" :key="match.id" class="p12-sub-row">
          <span class="p12-sub-row__num">{{ i + 1 }}</span>
          <span class="p12-sub-row__match">{{ match.home }} vs {{ match.away }}</span>
          <span class="p12-sub-row__score">{{ scores[i][0] }} – {{ scores[i][1] }}</span>
        </div>
      </div>
      <button class="p12-reset-btn" @click="resetEntry">Start New Entry</button>
    </div>

    <!-- Match prediction table -->
    <div v-else class="p12-table">
      <div class="p12-table__hdr">
        <div class="p12-th-num">#</div>
        <div class="p12-th-info">Match</div>
        <div class="p12-th-score">Home</div>
        <div class="p12-th-sep"></div>
        <div class="p12-th-score">Away</div>
      </div>

      <div v-for="(match, i) in matches" :key="match.id" class="p12-row" :class="{ 'p12-row--filled': scores[i][0] !== null && scores[i][1] !== null }">
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
        <div class="p12-score-sel">
          <button class="p12-score-btn" @click="decScore(i, 0)">−</button>
          <span class="p12-score-val">{{ scores[i][0] ?? '?' }}</span>
          <button class="p12-score-btn" @click="incScore(i, 0)">+</button>
        </div>
        <div class="p12-score-dash">–</div>
        <div class="p12-score-sel">
          <button class="p12-score-btn" @click="decScore(i, 1)">−</button>
          <span class="p12-score-val">{{ scores[i][1] ?? '?' }}</span>
          <button class="p12-score-btn" @click="incScore(i, 1)">+</button>
        </div>
      </div>
    </div>

    <!-- Submit footer -->
    <div v-if="!submitted" class="p12-footer">
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

    <!-- Past winners -->
    <div class="p12-winners">
      <div class="p12-winners__hdr">🏆 Recent Winners</div>
      <div v-for="w in pastWinners" :key="w.name" class="p12-winner-row">
        <span class="p12-winner-row__icon">🥇</span>
        <div class="p12-winner-row__info">
          <span class="p12-winner-row__name">{{ w.name }}</span>
          <span class="p12-winner-row__week">{{ w.week }}</span>
        </div>
        <span class="p12-winner-row__prize">UGX 10M</span>
      </div>
    </div>

    <div style="height:70px"></div>
    <BottomNav />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import AppHeader from '@/components/AppHeader.vue';
import BottomNav from '@/components/BottomNav.vue';

const submitted = ref(false);

// 12 match predictions
interface P12Match { id: string; league: string; home: string; away: string; time: string; }

const matches: P12Match[] = [
  { id: 'p1',  league: 'EPL',           home: 'Arsenal',          away: 'Liverpool',       time: 'Sun 28 Jun 15:00' },
  { id: 'p2',  league: 'EPL',           home: 'Man City',         away: 'Chelsea',         time: 'Sun 28 Jun 15:00' },
  { id: 'p3',  league: 'La Liga',       home: 'Real Madrid',      away: 'Barcelona',       time: 'Sun 28 Jun 16:00' },
  { id: 'p4',  league: 'Bundesliga',    home: 'Bayern Munich',    away: 'Dortmund',        time: 'Sun 28 Jun 17:30' },
  { id: 'p5',  league: 'Ligue 1',       home: 'PSG',              away: 'Lyon',            time: 'Sun 28 Jun 17:00' },
  { id: 'p6',  league: 'Serie A',       home: 'Inter Milan',      away: 'AC Milan',        time: 'Sun 28 Jun 18:00' },
  { id: 'p7',  league: 'Eredivisie',    home: 'Ajax',             away: 'PSV',             time: 'Sun 28 Jun 14:00' },
  { id: 'p8',  league: 'Scottish PL',   home: 'Celtic',           away: 'Rangers',         time: 'Sun 28 Jun 13:00' },
  { id: 'p9',  league: 'Liga Portugal', home: 'Porto',            away: 'Sporting',        time: 'Sun 28 Jun 19:00' },
  { id: 'p10', league: 'Uganda PL',     home: 'KCCA FC',          away: 'Vipers SC',       time: 'Sun 28 Jun 15:00' },
  { id: 'p11', league: 'Süper Lig',     home: 'Galatasaray',      away: 'Besiktas',        time: 'Sun 28 Jun 18:00' },
  { id: 'p12', league: 'Brasileirao',   home: 'Flamengo',         away: 'Corinthians',     time: 'Sun 28 Jun 20:00' },
];

// scores[i] = [homeGoals, awayGoals] — null means not yet set
const scores = reactive<([number | null, number | null])[]>(
  Array.from({ length: 12 }, () => [null, null])
);

const filledCount = computed(() =>
  scores.filter(s => s[0] !== null && s[1] !== null).length
);

function incScore(matchIdx: number, side: 0 | 1) {
  const cur = scores[matchIdx][side];
  scores[matchIdx][side] = cur === null ? 0 : Math.min(9, cur + 1);
}

function decScore(matchIdx: number, side: 0 | 1) {
  const cur = scores[matchIdx][side];
  if (cur === null) { scores[matchIdx][side] = 0; return; }
  if (cur === 0) { scores[matchIdx][side] = null; return; }
  scores[matchIdx][side] = cur - 1;
}

function submitEntry() {
  if (filledCount.value < 12) return;
  submitted.value = true;
}

function resetEntry() {
  scores.forEach((_, i) => { scores[i][0] = null; scores[i][1] = null; });
  submitted.value = false;
}

const pastWinners = [
  { name: 'James O. (Kampala)', week: 'Week of 15 Jun 2026' },
  { name: 'Sarah M. (Entebbe)', week: 'Week of 8 Jun 2026' },
  { name: 'David K. (Jinja)',   week: 'Week of 1 Jun 2026' },
];
</script>

<style scoped>
.p12-page { background: var(--bg-main); }

/* ─── Hero ───────────────────────────────────────────────── */
.p12-hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
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
.p12-hero__sub { font-size: 11px; color: rgba(255,255,255,.55); }

.p12-hero__right { text-align: right; flex-shrink: 0; }
.p12-hero__prize-lbl { font-size: 9px; color: rgba(255,255,255,.5); margin-bottom: 2px; }
.p12-hero__prize { font-size: 20px; font-weight: 900; color: #ffe60f; }
.p12-hero__deadline { font-size: 9px; color: rgba(255,255,255,.4); margin-top: 4px; }

/* ─── Rules ──────────────────────────────────────────────── */
.p12-rules {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  padding: 10px 10px 6px;
  background: #fff;
  border-bottom: 1px solid #ebebeb;
}
.p12-rule {
  display: flex; align-items: center; gap: 5px;
  font-size: 10px; color: #6a6f7a;
}
.p12-rule__icon { font-size: 12px; }

/* ─── Progress ───────────────────────────────────────────── */
.p12-progress {
  background: #fff;
  padding: 8px 12px;
  border-bottom: 1px solid #ebebeb;
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
  transition: width .4s ease;
  min-width: 3px;
}

/* ─── Table ──────────────────────────────────────────────── */
.p12-table { background: #fff; margin-top: 8px; }
.p12-table__hdr {
  display: grid;
  grid-template-columns: 28px 1fr 64px 16px 64px;
  padding: 6px 8px;
  border-bottom: 2px solid #d946ef;
  background: #fff;
}
.p12-th-num  { font-size: 9px; font-weight: 800; color: #9599a4; text-align: center; }
.p12-th-info { font-size: 9px; font-weight: 800; color: #9599a4; padding-left: 4px; }
.p12-th-score { font-size: 9px; font-weight: 800; color: #9599a4; text-align: center; }
.p12-th-sep  { }

.p12-row {
  display: grid;
  grid-template-columns: 28px 1fr 64px 16px 64px;
  align-items: center;
  padding: 8px 8px;
  border-bottom: 1px solid #f0f0f4;
  transition: background .1s;
}
.p12-row--filled { background: rgba(217,70,239,.04); }

.p12-row__num { font-size: 10px; font-weight: 700; color: #9599a4; text-align: center; }
.p12-row__info { padding-right: 4px; }
.p12-row__league { font-size: 9px; color: #9599a4; margin-bottom: 2px; }
.p12-row__teams { display: flex; align-items: center; gap: 3px; flex-wrap: wrap; }
.p12-row__home, .p12-row__away { font-size: 11px; font-weight: 700; color: #292a33; }
.p12-row__vs { font-size: 9px; color: #9599a4; }
.p12-row__time { font-size: 9px; color: #9599a4; margin-top: 1px; }

/* Score selector */
.p12-score-sel { display: flex; align-items: center; justify-content: center; gap: 3px; }
.p12-score-btn {
  width: 22px; height: 22px;
  background: #f0f1f5; border: 1px solid #e0e1e5;
  border-radius: 4px; font-size: 14px; font-weight: 700;
  color: #292a33; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  line-height: 1; padding: 0;
  transition: background .12s;
}
.p12-score-btn:active { background: #d946ef; color: #fff; border-color: #d946ef; }

.p12-score-val {
  min-width: 18px;
  text-align: center;
  font-size: 15px; font-weight: 900;
  color: #292a33;
}
.p12-row--filled .p12-score-val { color: #d946ef; }

.p12-score-dash { text-align: center; font-size: 13px; font-weight: 700; color: #9599a4; }

/* ─── Footer ─────────────────────────────────────────────── */
.p12-footer {
  padding: 12px 12px;
  background: #fff;
  border-top: 1px solid #ebebeb;
  margin-top: 8px;
}
.p12-footer__info {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 10px; font-size: 11px; color: #6a6f7a;
}
.p12-footer__free {
  font-size: 10px; font-weight: 800; letter-spacing: .5px;
  background: #10a310; color: #fff;
  border-radius: 10px; padding: 2px 8px;
}
.p12-submit-btn {
  display: block; width: 100%;
  padding: 13px; border: none; border-radius: 9px;
  font-size: 14px; font-weight: 800; cursor: pointer;
  background: linear-gradient(90deg, #d946ef, #a21caf);
  color: #fff;
  transition: opacity .15s;
}
.p12-submit-btn--disabled { opacity: 0.5; cursor: not-allowed; }

/* ─── Submitted state ────────────────────────────────────── */
.p12-submitted {
  background: #fff;
  padding: 20px 16px;
  margin-top: 8px;
  text-align: center;
}
.p12-submitted__icon  { font-size: 44px; margin-bottom: 10px; }
.p12-submitted__title { font-size: 20px; font-weight: 900; color: #292a33; margin-bottom: 6px; }
.p12-submitted__sub   { font-size: 12px; color: #6a6f7a; margin-bottom: 16px; line-height: 1.6; }

.p12-submitted__picks { text-align: left; max-width: 480px; margin: 0 auto 16px; }
.p12-sub-row {
  display: flex; align-items: center; gap: 8px;
  padding: 6px 0;
  border-bottom: 1px solid #f0f0f4;
  font-size: 12px;
}
.p12-sub-row__num   { width: 20px; font-weight: 700; color: #9599a4; flex-shrink: 0; text-align: center; }
.p12-sub-row__match { flex: 1; color: #292a33; font-weight: 600; }
.p12-sub-row__score { font-weight: 900; color: #d946ef; flex-shrink: 0; }

.p12-reset-btn {
  background: #f0f1f5; border: 1px solid #e0e1e5;
  border-radius: 8px; padding: 10px 24px;
  font-size: 13px; font-weight: 700; color: #292a33; cursor: pointer;
}

/* ─── Past winners ───────────────────────────────────────── */
.p12-winners {
  background: #fff;
  margin-top: 8px;
  padding: 12px;
}
.p12-winners__hdr { font-size: 13px; font-weight: 800; color: #292a33; margin-bottom: 10px; }

.p12-winner-row {
  display: flex; align-items: center; gap: 10px;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f4;
}
.p12-winner-row__icon { font-size: 18px; }
.p12-winner-row__info { flex: 1; }
.p12-winner-row__name { font-size: 12px; font-weight: 700; color: #292a33; display: block; }
.p12-winner-row__week { font-size: 10px; color: #9599a4; }
.p12-winner-row__prize { font-size: 13px; font-weight: 900; color: #10a310; flex-shrink: 0; }

/* ─── Desktop ────────────────────────────────────────────── */
@media (min-width: 1024px) {
  .p12-hero { padding: 20px 24px; }
  .p12-hero__title { font-size: 32px; }
  .p12-hero__prize { font-size: 26px; }

  .p12-rules { grid-template-columns: repeat(4, 1fr); padding: 10px 16px; }

  .p12-table, .p12-footer, .p12-submitted, .p12-progress, .p12-winners {
    max-width: 860px;
    margin-left: auto;
    margin-right: auto;
  }

  .p12-table__hdr,
  .p12-row {
    grid-template-columns: 36px 1fr 80px 20px 80px;
    padding: 10px 16px;
  }

  .p12-score-btn { width: 26px; height: 26px; }
  .p12-score-val { font-size: 16px; }

  .p12-footer { max-width: 860px; }
}
</style>
