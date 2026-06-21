<template>
  <section class="jackpot-section">
    <div class="jackpot-section__header">
      <span class="jackpot-section__trophy">🏆</span>
      <span class="jackpot-section__title">JACKPOT POOL</span>
      <span class="jackpot-section__must">MUST WIN</span>
    </div>

    <div class="jackpot-section__grid">
      <div
        v-for="tier in tiers"
        :key="tier.id"
        class="jackpot-card"
        :class="`jackpot-card--${tier.id}`"
      >
        <div class="jackpot-card__left">
          <span class="jackpot-card__medal">{{ tier.medal }}</span>
          <span class="jackpot-card__name">{{ tier.name }}</span>
          <span class="jackpot-card__dot"></span>
        </div>
        <div class="jackpot-card__ticker">
          <span class="jackpot-card__ush">USH</span>
          <div class="jackpot-card__digits">
            <template v-for="(slot, i) in getSlots(tier.id)" :key="i">
              <span v-if="slot === SEP" class="jackpot-sep">,</span>
              <span v-else class="jackpot-digit-window">
                <span
                  class="jackpot-digit-reel"
                  :style="{
                    transform: `translateY(-${(slot as number) * DIGIT_H}px)`,
                    transitionDuration: `${tier.transMs}ms`
                  }"
                >
                  <span v-for="d in 10" :key="d" class="jackpot-digit-char">{{ d - 1 }}</span>
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
import { ref, onMounted, onUnmounted } from 'vue';

const DIGIT_H = 18; // px — height of each digit row in the reel
const SEP     = ',' as const;

interface TierConfig {
  id: string;
  name: string;
  medal: string;
  base: number;
  tickMs: number;
  maxInc: number;
  transMs: number;
}

const tiers: TierConfig[] = [
  { id: 'gold',    name: 'GOLD',    medal: '🥇', base: 856_241_337, tickMs: 48,  maxInc: 79, transMs: 65  },
  { id: 'silver',  name: 'SILVER',  medal: '🥈', base: 432_817_658, tickMs: 93,  maxInc: 43, transMs: 120 },
  { id: 'bronze',  name: 'BRONZE',  medal: '🥉', base: 287_542_110, tickMs: 175, maxInc: 21, transMs: 220 },
  { id: 'premium', name: 'PREMIUM', medal: '💎', base: 194_163_808, tickMs: 330, maxInc: 9,  transMs: 400 },
];

const amounts = ref<Record<string, number>>(
  Object.fromEntries(tiers.map(t => [t.id, t.base]))
);

/** Returns array of digit numbers (0-9) or SEP for commas. Always 9 digits → "XXX,XXX,XXX" */
function getSlots(id: string): Array<number | typeof SEP> {
  const str = String(Math.min(Math.floor(amounts.value[id]), 999_999_999)).padStart(9, '0');
  return [
    +str[0], +str[1], +str[2], SEP,
    +str[3], +str[4], +str[5], SEP,
    +str[6], +str[7], +str[8],
  ];
}

const intervals: ReturnType<typeof setInterval>[] = [];

onMounted(() => {
  tiers.forEach(t => {
    const iv = setInterval(() => {
      let next = amounts.value[t.id] + Math.floor(Math.random() * t.maxInc) + 1;
      if (next >= 1_000_000_000) next = t.base;
      amounts.value[t.id] = next;
    }, t.tickMs);
    intervals.push(iv);
  });
});

onUnmounted(() => intervals.forEach(clearInterval));
</script>
