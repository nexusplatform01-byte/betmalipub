<template>
  <nav class="bnav">

    <!-- Home -->
    <RouterLink to="/" class="bnav__item" :class="{ active: $route.path === '/' }">
      <span class="bnav__icon">
        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
        </svg>
      </span>
      <span class="bnav__label">Home</span>
    </RouterLink>

    <!-- Sports -->
    <RouterLink to="/sports/Football" class="bnav__item" :class="{ active: $route.path.startsWith('/sports') }">
      <span class="bnav__icon">
        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.93V15h2v1.93c-3.02-.5-5.43-2.9-5.93-5.93H9v-2H7.07C7.57 5.97 9.98 3.57 13 3.07V5h-2V3.07C7.97 3.57 5.57 5.97 5.07 9H7v2H5.07c.5 3.03 2.9 5.43 5.93 5.93zM13 3.07c3.02.5 5.43 2.9 5.93 5.93H17v2h1.93c-.5 3.03-2.9 5.43-5.93 5.93V15h2v1.93c3.02-.5 5.43-2.9 5.93-5.93H19v-2h1.93C20.43 5.97 18.03 3.57 15 3.07V5h-2V3.07z"/>
        </svg>
      </span>
      <span class="bnav__label">Sports</span>
    </RouterLink>

    <!-- BetSlip — raised center circle -->
    <div class="bnav__center-wrap">
      <button
        class="bnav__betslip"
        :class="{ 'bnav__betslip--active': hasBets }"
        @click="$emit('openBetslip')"
      >
        <span v-if="hasBets" class="bnav__betslip-badge">{{ betCount }}</span>
        <svg viewBox="0 0 24 24" fill="currentColor" width="26" height="26">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14l-5-5 1.41-1.41L12 14.17l7.59-7.59L21 8l-9 9z"/>
        </svg>
      </button>
      <span class="bnav__label bnav__label--center">Betslip</span>
    </div>

    <!-- Casino -->
    <RouterLink to="/casino" class="bnav__item" :class="{ active: $route.path === '/casino' }">
      <span class="bnav__icon">
        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM7 7h2v2H7V7zm0 4h2v2H7v-2zm0 4h2v2H7v-2zm10 2h-6v-2h6v2zm0-4h-6v-2h6v2zm0-4h-6V7h6v2z"/>
        </svg>
      </span>
      <span class="bnav__label">Casino</span>
    </RouterLink>

    <!-- Account -->
    <RouterLink to="/account" class="bnav__item" :class="{ active: $route.path === '/account' }">
      <span class="bnav__icon">
        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
      </span>
      <span class="bnav__label">Account</span>
    </RouterLink>

  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAppStore } from '@/stores/app';

defineEmits<{ openBetslip: [] }>();

const store = useAppStore();
const betCount = computed(() => store.betslip.length);
const hasBets  = computed(() => store.betslip.length > 0);
</script>

<style scoped>
/* ── bar ────────────────────────────────────────────── */
.bnav {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 480px;
  height: 56px;
  background: linear-gradient(180deg, #32333d 0%, #1c1e24 100%);
  border-top: 1px solid rgba(255,255,255,0.07);
  box-shadow: 0 -2px 12px rgba(0,0,0,0.35);
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  z-index: 200;
  padding-bottom: 6px;
}

/* ── regular tab ────────────────────────────────────── */
.bnav__item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  gap: 3px;
  padding-bottom: 2px;
  cursor: pointer;
  text-decoration: none;
  color: rgba(255,255,255,0.38);
  transition: color 0.2s;
}
.bnav__item.active {
  color: #ffe60f;
}
.bnav__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}
.bnav__label {
  font-size: 9px;
  font-weight: 600;
  line-height: 1;
  letter-spacing: 0.2px;
}

/* ── center betslip wrapper ─────────────────────────── */
.bnav__center-wrap {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  gap: 3px;
  position: relative;
  padding-bottom: 2px;
}

/* the raised circle */
.bnav__betslip {
  position: absolute;
  bottom: 18px;               /* lifts above nav bar */
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: 3px solid #1c1e24;  /* matches nav bg for "cut-out" effect */
  background: radial-gradient(circle at 40% 35%, #4de87a, #10a310 55%, #097a09);
  box-shadow:
    0 0 0 2px rgba(16,163,16,0.35),
    0 4px 14px rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #fff;
  transition: transform 0.15s, box-shadow 0.15s;
  flex-shrink: 0;
}
.bnav__betslip:active {
  transform: scale(0.93);
  box-shadow: 0 2px 6px rgba(0,0,0,0.4);
}
.bnav__betslip--active {
  animation: betslip-pulse 2s ease-in-out infinite;
}

/* badge count */
.bnav__betslip-badge {
  position: absolute;
  top: -2px;
  right: -2px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  background: #ff4c4c;
  color: #fff;
  font-size: 9px;
  font-weight: 700;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1.5px solid #1c1e24;
}

.bnav__label--center {
  margin-top: 2px;
  color: rgba(255,255,255,0.38);
}

@keyframes betslip-pulse {
  0%, 100% { box-shadow: 0 0 0 2px rgba(16,163,16,0.35), 0 4px 14px rgba(0,0,0,0.5); }
  50%       { box-shadow: 0 0 0 5px rgba(16,163,16,0.20), 0 4px 18px rgba(0,0,0,0.5); }
}
</style>
