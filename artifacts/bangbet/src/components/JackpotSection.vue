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
          <span class="jp-card__medal">{{ tier.medal }}</span>
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

const DH = 14; // digit window height in px (must match CSS --dh)

interface Tier {
  id: string;
  name: string;
  medal: string;
  base: number;
  /** ms for ones digit to complete one full 0-9 cycle */
  oneDur: number;
}

const tiers: Tier[] = [
  { id: 'gold',    name: 'GOLD',    medal: '🥇', base: 856_241_337, oneDur: 800   },
  { id: 'silver',  name: 'SILVER',  medal: '🥈', base: 432_817_658, oneDur: 2_500 },
  { id: 'bronze',  name: 'BRONZE',  medal: '🥉', base: 287_542_110, oneDur: 7_000 },
  { id: 'premium', name: 'PREMIUM', medal: '💎', base: 194_163_808, oneDur: 18_000 },
];

interface Slot {
  sep: boolean;
  dur: number;
  offset: number;
}

function buildSlots(tier: Tier): Slot[] {
  const str = String(Math.floor(tier.base)).padStart(9, '0');
  const result: Slot[] = [];

  for (let i = 0; i < 9; i++) {
    if (i === 3 || i === 6) result.push({ sep: true, dur: 0, offset: 0 });

    const posFromRight = 8 - i; // 0=ones, 1=tens, 2=hundreds …
    const digit = parseInt(str[i], 10);

    // each step left is 10× slower
    const dur = tier.oneDur * Math.pow(10, posFromRight);

    // negative animationDelay = how far into the cycle we start
    // digit N → start at N/10 through the cycle
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
/* ─── layout ─────────────────────────────── */
.jp-pool { padding: 8px 10px 6px; }

.jp-pool__header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
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

/* 1 row, 4 cols */
.jp-pool__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 5px;
}

/* ─── card shell ──────────────────────────── */
.jp-card {
  border-radius: 7px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0,0,0,.13);
  min-width: 0;
}

.jp-card__head {
  display: flex; align-items: center; gap: 3px;
  padding: 4px 5px 3px;
}
.jp-card__medal { font-size: 11px; flex-shrink: 0; }
.jp-card__name  {
  font-size: 8.5px; font-weight: 800;
  letter-spacing: .3px; white-space: nowrap;
  overflow: hidden; text-overflow: ellipsis;
}

.jp-card__body {
  display: flex; flex-direction: column; gap: 0;
  padding: 3px 5px 5px;
}
.jp-card__ush {
  font-size: 7px; font-weight: 700;
  opacity: .8; line-height: 1.3;
}

/* ─── digit reel ──────────────────────────── */
.jp-card__digits {
  display: flex; align-items: center; gap: 1px;
}

.jp-sep {
  font-size: 8px; font-weight: 900;
  color: rgba(255,255,255,.7);
  line-height: 1;
  margin: 0 1px;
}

/* Fixed-height window – clips reel */
.jp-digit-win {
  width: 8px;
  height: 14px;           /* --dh */
  overflow: hidden;
  position: relative;
  flex-shrink: 0;
}

/* The spinning strip: 11 digits tall (0-9-0 for seamless loop) */
.jp-digit-reel {
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0; left: 0;
  animation: reel-spin linear infinite;
  will-change: transform;
}

.jp-d {
  width: 8px;
  height: 14px;           /* --dh */
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 9.5px;
  font-weight: 900;
  color: #fff;
  font-variant-numeric: tabular-nums;
  flex-shrink: 0;
}

@keyframes reel-spin {
  from { transform: translateY(0); }
  to   { transform: translateY(-140px); } /* 10 × 14px */
}

/* ─── tier colours ────────────────────────── */

/* GOLD */
.jp-card--gold .jp-card__head {
  background: linear-gradient(135deg,#ffe455 0%,#f5a500 100%);
}
.jp-card--gold .jp-card__name { color: #5c3200; }
.jp-card--gold .jp-card__body {
  background: linear-gradient(135deg,#f9c613 0%,#e8870a 100%);
}
.jp-card--gold .jp-card__ush { color: #fff8d0; }

/* SILVER */
.jp-card--silver .jp-card__head {
  background: linear-gradient(135deg,#e4e8f0 0%,#b0b5c0 100%);
}
.jp-card--silver .jp-card__name { color: #2a2d35; }
.jp-card--silver .jp-card__body {
  background: linear-gradient(135deg,#9da3b0 0%,#6b7280 100%);
}
.jp-card--silver .jp-card__ush { color: #e8eaf0; }

/* BRONZE */
.jp-card--bronze .jp-card__head {
  background: linear-gradient(135deg,#f0a06a 0%,#c46830 100%);
}
.jp-card--bronze .jp-card__name { color: #3d1800; }
.jp-card--bronze .jp-card__body {
  background: linear-gradient(135deg,#c47038 0%,#8c4210 100%);
}
.jp-card--bronze .jp-card__ush { color: #ffd8b8; }

/* PREMIUM */
.jp-card--premium .jp-card__head {
  background: linear-gradient(135deg,#c48aff 0%,#8840ee 100%);
}
.jp-card--premium .jp-card__name { color: #fff; }
.jp-card--premium .jp-card__body {
  background: linear-gradient(135deg,#7c30e8 0%,#4510aa 100%);
}
.jp-card--premium .jp-card__ush { color: #dcc8ff; }
</style>
