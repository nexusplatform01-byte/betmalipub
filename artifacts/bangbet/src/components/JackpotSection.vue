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
          <span class="jp-card__amount">{{ displayAmounts[tier.id] }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue';

interface Tier {
  id: string;
  name: string;
  medal: string;
  base: number;
  tickMs: number;
  incPerTick: number;
}

const tiers: Tier[] = [
  { id: 'gold',    name: 'GOLD',    medal: '🥇', base: 856_241_337, tickMs: 500,  incPerTick: 200_000 },
  { id: 'silver',  name: 'SILVER',  medal: '🥈', base: 432_817_658, tickMs: 800,  incPerTick: 50_000  },
  { id: 'bronze',  name: 'BRONZE',  medal: '🥉', base: 287_542_110, tickMs: 1200, incPerTick: 20_000  },
  { id: 'premium', name: 'PREMIUM', medal: '💎', base: 194_163_808, tickMs: 2000, incPerTick: 8_000   },
];

const amounts = reactive<Record<string, number>>(
  Object.fromEntries(tiers.map(t => [t.id, t.base]))
);

const displayAmounts = reactive<Record<string, string>>(
  Object.fromEntries(tiers.map(t => [t.id, fmt(t.base)]))
);

function fmt(n: number): string {
  return Math.floor(n).toLocaleString('en-US');
}

const ivs: ReturnType<typeof setInterval>[] = [];

onMounted(() => {
  tiers.forEach(t => {
    const iv = setInterval(() => {
      const inc = Math.floor(Math.random() * t.incPerTick) + Math.floor(t.incPerTick * 0.5);
      amounts[t.id] += inc;
      if (amounts[t.id] >= 1_000_000_000) amounts[t.id] = t.base;
      displayAmounts[t.id] = fmt(amounts[t.id]);
    }, t.tickMs);
    ivs.push(iv);
  });
});

onUnmounted(() => ivs.forEach(clearInterval));
</script>

<style scoped>
.jp-pool {
  padding: 8px 10px 6px;
}

.jp-pool__header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
}

.jp-pool__icon {
  font-size: 15px;
}

.jp-pool__label {
  font-size: 12px;
  font-weight: 800;
  color: #292a33;
  letter-spacing: 0.5px;
  flex: 1;
}

.jp-pool__muswin {
  font-size: 9px;
  font-weight: 700;
  background: #10a310;
  color: #fff;
  border-radius: 10px;
  padding: 2px 8px;
  letter-spacing: 0.3px;
}

/* ── 2×2 grid ── */
.jp-pool__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
}

/* ── Base card ── */
.jp-card {
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.13);
}

.jp-card__head {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 6px 9px 5px;
}

.jp-card__medal {
  font-size: 14px;
  line-height: 1;
}

.jp-card__name {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.4px;
}

.jp-card__body {
  display: flex;
  align-items: baseline;
  gap: 3px;
  padding: 5px 9px 7px;
}

.jp-card__ush {
  font-size: 9px;
  font-weight: 700;
  opacity: 0.88;
  flex-shrink: 0;
}

.jp-card__amount {
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-variant-numeric: tabular-nums;
}

/* ── GOLD — rich yellow/amber gradient ── */
.jp-card--gold {
  background: linear-gradient(135deg, #f9c613 0%, #e8870a 100%);
}
.jp-card--gold .jp-card__head {
  background: linear-gradient(135deg, #ffe455 0%, #f5a500 100%);
}
.jp-card--gold .jp-card__name  { color: #5c3200; }
.jp-card--gold .jp-card__body  { background: linear-gradient(135deg, #f9c613 0%, #e8870a 100%); }
.jp-card--gold .jp-card__ush   { color: #fff8e0; }
.jp-card--gold .jp-card__amount { color: #fff; text-shadow: 0 1px 3px rgba(0,0,0,0.25); }

/* ── SILVER — cool steel gradient ── */
.jp-card--silver {
  background: linear-gradient(135deg, #c8cdd8 0%, #8c9099 100%);
}
.jp-card--silver .jp-card__head {
  background: linear-gradient(135deg, #e4e8f0 0%, #b0b5c0 100%);
}
.jp-card--silver .jp-card__name  { color: #2a2d35; }
.jp-card--silver .jp-card__body  { background: linear-gradient(135deg, #9da3b0 0%, #6b7280 100%); }
.jp-card--silver .jp-card__ush   { color: #e8eaf0; }
.jp-card--silver .jp-card__amount { color: #fff; text-shadow: 0 1px 3px rgba(0,0,0,0.30); }

/* ── BRONZE — warm copper gradient ── */
.jp-card--bronze {
  background: linear-gradient(135deg, #d4834a 0%, #a0521e 100%);
}
.jp-card--bronze .jp-card__head {
  background: linear-gradient(135deg, #f0a06a 0%, #c46830 100%);
}
.jp-card--bronze .jp-card__name  { color: #3d1800; }
.jp-card--bronze .jp-card__body  { background: linear-gradient(135deg, #c47038 0%, #8c4210 100%); }
.jp-card--bronze .jp-card__ush   { color: #ffd8b8; }
.jp-card--bronze .jp-card__amount { color: #fff; text-shadow: 0 1px 3px rgba(0,0,0,0.30); }

/* ── PREMIUM — deep purple/gem gradient ── */
.jp-card--premium {
  background: linear-gradient(135deg, #9b59f7 0%, #5b18cc 100%);
}
.jp-card--premium .jp-card__head {
  background: linear-gradient(135deg, #c48aff 0%, #8840ee 100%);
}
.jp-card--premium .jp-card__name  { color: #fff; }
.jp-card--premium .jp-card__body  { background: linear-gradient(135deg, #7c30e8 0%, #4510aa 100%); }
.jp-card--premium .jp-card__ush   { color: #dcc8ff; }
.jp-card--premium .jp-card__amount { color: #fff; text-shadow: 0 1px 4px rgba(0,0,0,0.35); }
</style>
