<template>
  <Teleport to="body">
    <div class="tkt-overlay" @click.self="$emit('close')">
      <div class="tkt-sheet">

        <!-- ── Header ── -->
        <div class="tkt-header">
          <div class="tkt-header__logo">BANGBET</div>
          <div class="tkt-header__id">BET ID #{{ bet.ticketId }}</div>
          <button class="tkt-header__close" @click="$emit('close')">✕</button>
        </div>

        <!-- ── Status banner ── -->
        <div class="tkt-banner" :class="'tkt-banner--' + bet.status">
          <span class="tkt-banner__icon">{{ statusIcon }}</span>
          <div class="tkt-banner__text">
            <div class="tkt-banner__label">{{ statusLabel }}</div>
            <div class="tkt-banner__amount">UGX {{ (bet.status === 'won' ? bet.payout : bet.potentialWin).toLocaleString() }}</div>
          </div>
        </div>

        <!-- ── Summary row ── -->
        <div class="tkt-summary">
          <div class="tkt-summary__item">
            <span class="tkt-summary__lbl">Odds</span>
            <span class="tkt-summary__val">{{ bet.totalOdds }}</span>
          </div>
          <div class="tkt-summary__sep"></div>
          <div class="tkt-summary__item">
            <span class="tkt-summary__lbl">Stake</span>
            <span class="tkt-summary__val">UGX {{ bet.stake.toLocaleString() }}</span>
          </div>
          <div class="tkt-summary__sep"></div>
          <div class="tkt-summary__item">
            <span class="tkt-summary__lbl">{{ bet.status === 'won' ? 'Won' : 'Potential' }}</span>
            <span class="tkt-summary__val tkt-summary__val--hi">UGX {{ (bet.status === 'won' ? bet.payout : bet.potentialWin).toLocaleString() }}</span>
          </div>
        </div>

        <!-- ── Selections ── -->
        <div class="tkt-selections">
          <div
            v-for="(sel, i) in bet.selections"
            :key="i"
            class="tkt-sel"
            :class="'tkt-sel--' + (sel.result ?? (bet.status === 'pending' ? 'pending' : 'lost'))"
          >
            <div class="tkt-sel__top">
              <span class="tkt-sel__time">{{ sel.time ?? bet.date }}</span>
              <span class="tkt-sel__odd">{{ sel.odds }}</span>
            </div>
            <div class="tkt-sel__match">{{ sel.match }}</div>
            <div class="tkt-sel__bottom">
              <span class="tkt-sel__league">{{ sel.league ?? '' }}</span>
              <span class="tkt-sel__pick">{{ sel.market }}: <strong>{{ sel.team }}</strong></span>
              <span class="tkt-sel__result-badge" :class="'rb--' + (sel.result ?? (bet.status === 'pending' ? 'pending' : 'lost'))">
                {{ resultLabel(sel.result, bet.status) }}
              </span>
            </div>
            <div v-if="sel.score" class="tkt-sel__score">FT: {{ sel.score }}</div>
          </div>
        </div>

        <!-- ── Footer ── -->
        <div class="tkt-footer">
          <div class="tkt-footer__placed">Bet placed on {{ bet.date }}</div>
          <button class="tkt-footer__close-btn" @click="$emit('close')">Close</button>
        </div>

      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Selection {
  match: string;
  team: string;
  market: string;
  odds: number;
  time?: string;
  league?: string;
  score?: string;
  result?: 'won' | 'lost' | 'pending';
}

interface Bet {
  ticketId: string | number;
  date: string;
  selections: Selection[];
  stake: number;
  totalOdds: number;
  potentialWin: number;
  payout: number;
  status: 'pending' | 'won' | 'lost';
  type: string;
}

const props = defineProps<{ bet: Bet }>();
defineEmits<{ close: [] }>();

const statusIcon = computed(() => {
  if (props.bet.status === 'won')     return '🏆';
  if (props.bet.status === 'lost')    return '❌';
  return '⏳';
});

const statusLabel = computed(() => {
  if (props.bet.status === 'won')  return 'WINNING';
  if (props.bet.status === 'lost') return 'LOST';
  return 'PENDING';
});

function resultLabel(result: string | undefined, betStatus: string) {
  const r = result ?? (betStatus === 'pending' ? 'pending' : 'lost');
  if (r === 'won')     return 'WIN';
  if (r === 'lost')    return 'LOST';
  return 'PENDING';
}
</script>

<style scoped>
.tkt-overlay {
  position: fixed;
  inset: 0;
  background: rgba(10, 10, 20, 0.6);
  backdrop-filter: blur(3px);
  z-index: 500;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 0;
}

@media (min-width: 600px) {
  .tkt-overlay {
    align-items: center;
    padding: 20px;
  }
}

.tkt-sheet {
  background: #fff;
  width: 100%;
  max-width: 480px;
  max-height: 92vh;
  border-radius: 18px 18px 0 0;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  animation: tkt-slide 0.22s cubic-bezier(0.34, 1.2, 0.64, 1);
  scrollbar-width: none;
}
.tkt-sheet::-webkit-scrollbar { display: none; }

@media (min-width: 600px) {
  .tkt-sheet { border-radius: 16px; }
}

@keyframes tkt-slide {
  from { opacity: 0; transform: translateY(40px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── Header ── */
.tkt-header {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #1c1e24;
  padding: 14px 16px;
  flex-shrink: 0;
}

.tkt-header__logo {
  font-size: 15px;
  font-weight: 900;
  color: #ffe60f;
  letter-spacing: 1px;
  flex: 1;
}

.tkt-header__id {
  font-size: 11px;
  font-weight: 700;
  color: rgba(255,255,255,0.65);
  letter-spacing: 0.5px;
}

.tkt-header__close {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: 1.5px solid rgba(255,255,255,0.3);
  background: rgba(255,255,255,0.1);
  color: #fff;
  font-size: 11px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.15s;
}
.tkt-header__close:hover { background: rgba(255,255,255,0.2); }

/* ── Status banner ── */
.tkt-banner {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  flex-shrink: 0;
}

.tkt-banner--won  { background: linear-gradient(135deg, #15803d, #16a34a); }
.tkt-banner--lost { background: linear-gradient(135deg, #9f1239, #dc2626); }
.tkt-banner--pending { background: linear-gradient(135deg, #b45309, #d97706); }

.tkt-banner__icon { font-size: 26px; flex-shrink: 0; }

.tkt-banner__label {
  font-size: 11px;
  font-weight: 700;
  color: rgba(255,255,255,0.8);
  text-transform: uppercase;
  letter-spacing: 0.8px;
}

.tkt-banner__amount {
  font-size: 20px;
  font-weight: 900;
  color: #fff;
  line-height: 1.1;
  margin-top: 1px;
}

/* ── Summary ── */
.tkt-summary {
  display: flex;
  align-items: stretch;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  flex-shrink: 0;
}

.tkt-summary__item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 8px;
  gap: 3px;
}

.tkt-summary__sep {
  width: 1px;
  background: #e5e7eb;
  margin: 8px 0;
}

.tkt-summary__lbl {
  font-size: 9px;
  font-weight: 700;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.tkt-summary__val {
  font-size: 12px;
  font-weight: 800;
  color: #111827;
}

.tkt-summary__val--hi { color: #15803d; }

/* ── Selections ── */
.tkt-selections {
  flex: 1;
  padding: 8px 0;
}

.tkt-sel {
  padding: 10px 16px;
  border-bottom: 1px solid #f3f4f6;
  position: relative;
  border-left: 3px solid transparent;
}
.tkt-sel:last-child { border-bottom: none; }

.tkt-sel--won     { border-left-color: #16a34a; background: #f0fdf4; }
.tkt-sel--lost    { border-left-color: #dc2626; background: #fff5f5; }
.tkt-sel--pending { border-left-color: #d97706; background: #fffbeb; }

.tkt-sel__top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3px;
}

.tkt-sel__time {
  font-size: 9px;
  font-weight: 600;
  color: #9ca3af;
}

.tkt-sel__odd {
  font-size: 13px;
  font-weight: 900;
  color: #c026d3;
  background: #fdf4ff;
  border: 1px solid #e9d5ff;
  border-radius: 5px;
  padding: 1px 7px;
  line-height: 1.5;
}

.tkt-sel__match {
  font-size: 13px;
  font-weight: 800;
  color: #111827;
  margin-bottom: 4px;
  line-height: 1.3;
}

.tkt-sel__bottom {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.tkt-sel__league {
  font-size: 9px;
  color: #9ca3af;
  font-weight: 600;
  flex-shrink: 0;
}

.tkt-sel__pick {
  font-size: 10px;
  color: #6b7280;
  flex: 1;
  min-width: 0;
}
.tkt-sel__pick strong { color: #374151; font-weight: 800; }

.tkt-sel__result-badge {
  font-size: 8px;
  font-weight: 900;
  border-radius: 4px;
  padding: 2px 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  flex-shrink: 0;
}
.rb--won     { background: #dcfce7; color: #15803d; }
.rb--lost    { background: #fee2e2; color: #dc2626; }
.rb--pending { background: #fef3c7; color: #b45309; }

.tkt-sel__score {
  font-size: 10px;
  font-weight: 700;
  color: #6b7280;
  margin-top: 3px;
}

/* ── Footer ── */
.tkt-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
  flex-shrink: 0;
}

.tkt-footer__placed {
  font-size: 10px;
  color: #9ca3af;
  font-weight: 600;
}

.tkt-footer__close-btn {
  padding: 8px 20px;
  border-radius: 8px;
  border: none;
  background: #1c1e24;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.15s;
}
.tkt-footer__close-btn:hover { opacity: 0.85; }
</style>
