<template>
  <section class="jp-pool">
    <div class="jp-pool__grid">

      <!-- Sports Jackpot -->
      <div class="jp-card">
        <div class="jp-card__head">
          <span class="jp-card__title">Sports Jackpot</span>
          <span class="jp-card__badge jp-card__badge--muswin">Must Win</span>
        </div>
        <div class="jp-card__body">
          <span class="jp-card__tier">Grand</span>
          <span class="jp-card__sep"></span>
          <span class="jp-card__currency">USH</span>
          <span class="jp-card__amount">{{ sportsDisplay }}</span>
        </div>
      </div>

      <!-- Casino Jackpot -->
      <div class="jp-card">
        <div class="jp-card__head">
          <span class="jp-card__title">Casino Jackpot</span>
          <span class="jp-card__badge jp-card__badge--bolt">⚡</span>
        </div>
        <div class="jp-card__body">
          <span class="jp-card__tier">Super</span>
          <span class="jp-card__sep"></span>
          <span class="jp-card__currency">USH</span>
          <span class="jp-card__amount">{{ casinoDisplay }}</span>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

const sports = ref(1_706_115);
const casino = ref(4_861_240);

function fmt(n: number) {
  return Math.floor(n).toLocaleString('en-US');
}

const sportsDisplay = computed(() => fmt(sports.value));
const casinoDisplay = computed(() => fmt(casino.value));

const ivs: ReturnType<typeof setInterval>[] = [];

onMounted(() => {
  ivs.push(setInterval(() => { sports.value += Math.floor(Math.random() * 12) + 1; }, 80));
  ivs.push(setInterval(() => { casino.value += Math.floor(Math.random() * 18) + 1; }, 60));
});

onUnmounted(() => ivs.forEach(clearInterval));
</script>

<style scoped>
.jp-pool {
  padding: 6px 10px 4px;
}

.jp-pool__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
}

.jp-card {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0,0,0,0.10);
  background: #fff;
}

.jp-card__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 8px;
  background: #fff;
}

.jp-card__title {
  font-size: 11px;
  font-weight: 700;
  color: #292a33;
  white-space: nowrap;
}

.jp-card__badge {
  font-size: 9px;
  font-weight: 700;
  border-radius: 10px;
  padding: 2px 6px;
  white-space: nowrap;
  line-height: 1.4;
}

.jp-card__badge--muswin {
  background: #10a310;
  color: #fff;
}

.jp-card__badge--bolt {
  background: #10a310;
  color: #fff;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  font-size: 10px;
}

.jp-card__body {
  display: flex;
  align-items: center;
  gap: 4px;
  background: #10a310;
  padding: 5px 8px;
}

.jp-card__tier {
  font-size: 10px;
  font-weight: 700;
  color: #fff;
  white-space: nowrap;
}

.jp-card__sep {
  width: 1px;
  height: 12px;
  background: rgba(255,255,255,0.4);
  flex-shrink: 0;
}

.jp-card__currency {
  font-size: 9px;
  font-weight: 700;
  color: rgba(255,255,255,0.85);
  flex-shrink: 0;
}

.jp-card__amount {
  font-size: 11px;
  font-weight: 800;
  color: #fff;
  letter-spacing: 0.3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
