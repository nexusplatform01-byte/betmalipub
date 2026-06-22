<template>
  <section class="jp-pool">
    <div class="jp-pool__header">
      <span class="jp-pool__icon">🏆</span>
      <span class="jp-pool__label">JACKPOT POOL</span>
      <span class="jp-pool__muswin">MUST WIN</span>
    </div>

    <div class="jp-pool__grid">
      <div
        v-for="tier in tiers"
        :key="tier.id"
        class="jp-card"
        :class="`jp-card--${tier.id}`"
      >
        <div class="jp-card__head">
          <img v-if="tier.medalImg" :src="tier.medalImg" class="jp-card__medal-img" />
          <span v-else class="jp-card__medal">{{ tier.medal }}</span>
          <span class="jp-card__name">{{ tier.name }}</span>
        </div>
        <div class="jp-card__body">
          <span class="jp-card__ush">USH</span>
          <div class="jp-card__digits">
            <template v-for="(slot, idx) in slots[tier.id]" :key="idx">
              <span v-if="slot.sep" class="jp-sep">,</span>
              <span v-else class="jp-digit-win">
                <span
                  class="jp-digit-reel"
                  :style="{
                    animationDuration: `${slot.dur}ms`,
                    animationDelay: `-${slot.offset}ms`,
                  }"
                >
                  <span v-for="d in 11" :key="d" class="jp-d">{{ (d - 1) % 10 }}</span>
                </span>
              </span>
            </template>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { reactive } from 'vue';

const DH = 20; // digit window height px — must match CSS .jp-digit-win height and @keyframes

interface Tier {
  id: string;
  name: string;
  medal: string;
  medalImg?: string;
  base: number;
  oneDur: number; // ms for ones to complete 0→9 cycle
}

const tiers: Tier[] = [
  { id: 'gold',    name: 'GOLD',    medal: '🥇', medalImg: 'https://www.fortebet.ug/assets/img/casino/jackpot-golden.png', base: 856_241_337, oneDur: 800    },
  { id: 'silver',  name: 'SILVER',  medal: '🥈', base: 432_817_658, oneDur: 2_500  },
  { id: 'bronze',  name: 'BRONZE',  medal: '🥉', base: 287_542_110, oneDur: 7_000  },
  { id: 'premium', name: 'PREMIUM', medal: '💎', base: 194_163_808, oneDur: 18_000 },
];

interface Slot { sep: boolean; dur: number; offset: number; }

function buildSlots(tier: Tier): Slot[] {
  const str = String(Math.floor(tier.base)).padStart(9, '0');
  const result: Slot[] = [];
  for (let i = 0; i < 9; i++) {
    if (i === 3 || i === 6) result.push({ sep: true, dur: 0, offset: 0 });
    const posFromRight = 8 - i;
    const digit = parseInt(str[i], 10);
    const dur = tier.oneDur * Math.pow(10, posFromRight);
    const offset = (digit / 10) * dur;
    result.push({ sep: false, dur, offset });
  }
  return result;
}

const slots = reactive<Record<string, Slot[]>>(
  Object.fromEntries(tiers.map(t => [t.id, buildSlots(t)]))
);
</script>

<style scoped>
/* ─── wrapper ──────────────────────────────────────────── */
.jp-pool { padding: 8px 10px 6px; }

.jp-pool__header {
  display: flex; align-items: center; gap: 6px; margin-bottom: 8px;
}
.jp-pool__icon  { font-size: 15px; }
.jp-pool__label {
  font-size: 12px; font-weight: 800;
  color: #292a33; letter-spacing: .5px; flex: 1;
}
.jp-pool__muswin {
  font-size: 9px; font-weight: 700;
  background: #10a310; color: #fff;
  border-radius: 10px; padding: 2px 8px;
}

/* 1 row · 4 equal columns */
.jp-pool__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 5px;
}

/* ─── card ──────────────────────────────────────────────── */
.jp-card {
  border-radius: 8px; overflow: hidden;
  box-shadow: 0 3px 10px rgba(0,0,0,.18);
  min-width: 0;
}

.jp-card__head {
  display: flex; align-items: center; gap: 3px;
  padding: 5px 6px 4px;
}
.jp-card__medal { font-size: 12px; flex-shrink: 0; }
.jp-card__medal-img { width: 22px; height: 22px; object-fit: contain; flex-shrink: 0; }
.jp-card__name  {
  font-size: 8px; font-weight: 900; letter-spacing: .4px;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}

.jp-card__body {
  display: flex; flex-direction: column;
  align-items: flex-start;
  padding: 4px 6px 8px;
  gap: 2px;
}

.jp-card__ush {
  font-size: 7px; font-weight: 700;
  opacity: .75; line-height: 1; color: #fff;
}

/* ─── digit reel ────────────────────────────────────────── */
.jp-card__digits {
  display: flex; align-items: center; gap: 0px;
}

.jp-sep {
  font-size: 10px; font-weight: 900;
  line-height: 1; margin: 0 1px; color: rgba(255,255,255,.6);
  align-self: center;
}

/* clip window — one digit tall */
.jp-digit-win {
  width: 11px;
  height: 20px;      /* = DH */
  overflow: hidden;
  position: relative;
  flex-shrink: 0;
  /* subtle inner border for each digit slot */
  border-radius: 2px;
  box-shadow: inset 0 1px 2px rgba(0,0,0,.35), inset 0 -1px 1px rgba(255,255,255,.15);
  background: rgba(0,0,0,.18);
  margin: 0 0.5px;
}

/* the spinning strip: 11 digits (0-9-0) */
.jp-digit-reel {
  display: flex; flex-direction: column;
  position: absolute; top: 0; left: 0; right: 0;
  animation: reel-spin linear infinite;
  will-change: transform;
}

.jp-d {
  width: 100%;
  height: 20px;       /* = DH */
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; font-weight: 900;
  font-variant-numeric: tabular-nums;
  flex-shrink: 0;
  /* metallic sheen added per-tier below */
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

@keyframes reel-spin {
  from { transform: translateY(0); }
  to   { transform: translateY(-200px); }  /* 10 × 20px */
}

/* ─── GOLD — molten amber metallic ─────────────────────── */
.jp-card--gold .jp-card__head {
  background: linear-gradient(135deg,#ffe455 0%,#f5a500 100%);
}
.jp-card--gold .jp-card__name { color: #5c3200; }
.jp-card--gold .jp-card__body {
  background: linear-gradient(160deg,#c87800 0%,#7a4000 100%);
}
.jp-card--gold .jp-digit-win {
  background: rgba(0,0,0,.22);
}
.jp-card--gold .jp-d {
  background-image: linear-gradient(180deg,
    #fffaaa 0%,
    #ffd700 20%,
    #e8a000 45%,
    #ffd700 70%,
    #fffaaa 100%
  );
  filter: drop-shadow(0 1px 1px rgba(80,30,0,.7));
}

/* ─── SILVER — polished steel ───────────────────────────── */
.jp-card--silver .jp-card__head {
  background: linear-gradient(135deg,#e4e8f0 0%,#b0b5c0 100%);
}
.jp-card--silver .jp-card__name { color: #1a1e28; }
.jp-card--silver .jp-card__body {
  background: linear-gradient(160deg,#5a6070 0%,#2e3240 100%);
}
.jp-card--silver .jp-d {
  background-image: linear-gradient(180deg,
    #ffffff 0%,
    #d0d5df 20%,
    #90959f 50%,
    #d0d5df 75%,
    #ffffff 100%
  );
  filter: drop-shadow(0 1px 1px rgba(0,0,0,.6));
}

/* ─── BRONZE — warm copper ──────────────────────────────── */
.jp-card--bronze .jp-card__head {
  background: linear-gradient(135deg,#f0a06a 0%,#c46830 100%);
}
.jp-card--bronze .jp-card__name { color: #3d1800; }
.jp-card--bronze .jp-card__body {
  background: linear-gradient(160deg,#8c4210 0%,#4a1e00 100%);
}
.jp-card--bronze .jp-d {
  background-image: linear-gradient(180deg,
    #ffd0a0 0%,
    #d4834a 20%,
    #8c4820 50%,
    #d4834a 75%,
    #ffd0a0 100%
  );
  filter: drop-shadow(0 1px 1px rgba(60,10,0,.65));
}

/* ─── PREMIUM — amethyst gem ────────────────────────────── */
.jp-card--premium .jp-card__head {
  background: linear-gradient(135deg,#c48aff 0%,#8840ee 100%);
}
.jp-card--premium .jp-card__name { color: #fff; }
.jp-card--premium .jp-card__body {
  background: linear-gradient(160deg,#5010a8 0%,#25006a 100%);
}
.jp-card--premium .jp-card__ush { color: #dcc8ff; }
.jp-card--premium .jp-d {
  background-image: linear-gradient(180deg,
    #f0e0ff 0%,
    #c080ff 20%,
    #8830d0 50%,
    #c080ff 75%,
    #f0e0ff 100%
  );
  filter: drop-shadow(0 1px 1px rgba(20,0,60,.7));
}
</style>
