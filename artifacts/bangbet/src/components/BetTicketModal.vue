<template>
  <Teleport to="body">
    <div class="tkt-overlay" @click.self="$emit('close')">
      <div class="tkt-sheet">

        <!-- ── Top bar: BET ID + close ── -->
        <div class="tkt-topbar">
          <div class="tkt-topbar__inner">
            <span class="tkt-topbar__icon">🏆</span>
            <span class="tkt-topbar__id">BET ID #{{ bet.ticketId }}</span>
          </div>
          <button class="tkt-topbar__close" @click="$emit('close')">✕</button>
        </div>

        <!-- ── Heading image (won) or coloured bar (lost/pending) ── -->
        <div class="tkt-heading">
          <img
            v-if="bet.status === 'won'"
            src="/static/winner-banner.jpg"
            class="tkt-heading__img"
            alt="Winner"
          />
          <div v-else class="tkt-heading__bar" :class="'hbar--' + bet.status">
            <span class="tkt-heading__bar-text">
              {{ bet.status === 'lost' ? '❌ BETTER LUCK NEXT TIME' : '⏳ BET PENDING' }}
            </span>
          </div>
        </div>

        <!-- ── Selections ── -->
        <div class="tkt-sels">
          <div
            v-for="(sel, i) in bet.selections"
            :key="i"
            class="tkt-sel"
          >
            <div class="tkt-sel__top">
              <span class="tkt-sel__time">{{ sel.time ?? bet.date }}</span>
              <span class="tkt-sel__status-box" :class="'sbox--' + selResult(sel)">
                {{ selResult(sel).toUpperCase() }}
              </span>
            </div>
            <div class="tkt-sel__main">
              <div class="tkt-sel__left">
                <div class="tkt-sel__match">{{ sel.match }}</div>
                <div v-if="sel.league" class="tkt-sel__league">{{ sel.league }}</div>
                <div class="tkt-sel__market">{{ sel.market }} | {{ sel.team }}</div>
              </div>
              <div class="tkt-sel__right">
                <div class="tkt-sel__score">{{ sel.score || '' }}</div>
                <div class="tkt-sel__odds" :class="'odds--' + selResult(sel)">{{ sel.odds }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- ── Summary gradient box ── -->
        <div class="tkt-grad-box" :class="'grad--' + bet.status">
          <div class="tkt-grad-grid">
            <div class="tkt-grad-item">
              <span class="tkt-grad-lbl">Odds:</span>
              <span class="tkt-grad-val">{{ bet.totalOdds.toFixed(2) }}</span>
            </div>
            <div class="tkt-grad-item">
              <span class="tkt-grad-lbl">Stake:</span>
              <span class="tkt-grad-val">UGX {{ bet.stake.toLocaleString() }}</span>
            </div>
            <div class="tkt-grad-item">
              <span class="tkt-grad-lbl">Potential Winnings:</span>
              <span class="tkt-grad-val">UGX {{ bet.potentialWin.toLocaleString() }}</span>
            </div>
            <div v-if="bet.winBonus" class="tkt-grad-item">
              <span class="tkt-grad-lbl">Win Bonus:</span>
              <span class="tkt-grad-val">UGX {{ bet.winBonus.toLocaleString() }}</span>
            </div>
            <div class="tkt-grad-item tkt-grad-item--payout">
              <span class="tkt-grad-lbl tkt-grad-lbl--payout">Payout:</span>
              <span class="tkt-grad-val tkt-grad-val--payout">
                {{ payoutLabel }} UGX {{ (bet.status === 'won' ? bet.payout : bet.potentialWin).toLocaleString() }}
              </span>
            </div>
          </div>
        </div>

        <!-- ── Cash Out button (pending only) ── -->
        <div v-if="bet.status === 'pending'" class="tkt-cashout">
          <button class="tkt-cashout__btn">
            💰 Cash Out
          </button>
        </div>

        <!-- ── Footer ── -->
        <div class="tkt-footer">
          Bet placed on {{ bet.date }}
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
  winBonus?: number;
  payout: number;
  status: 'pending' | 'won' | 'lost';
  type: string;
}

const props = defineProps<{ bet: Bet }>();
defineEmits<{ close: [] }>();

const payoutLabel = computed(() => {
  if (props.bet.status === 'won')  return 'WON';
  if (props.bet.status === 'lost') return 'LOST';
  return 'POTENTIAL';
});

function selResult(sel: Selection): string {
  return sel.result ?? (props.bet.status === 'pending' ? 'pending' : 'lost');
}
</script>

<style scoped>
/* ── Overlay ── */
.tkt-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(3px);
  z-index: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

/* ── Sheet (square card) ── */
.tkt-sheet {
  width: 100%;
  max-width: 420px;
  max-height: 92vh;
  background: #fff;
  border-radius: 16px;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  animation: tkt-pop 0.22s cubic-bezier(0.34, 1.3, 0.64, 1);
  scrollbar-width: none;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
}
.tkt-sheet::-webkit-scrollbar { display: none; }

@keyframes tkt-pop {
  from { opacity: 0; transform: scale(0.92); }
  to   { opacity: 1; transform: scale(1); }
}

/* ── Top bar ── */
.tkt-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 11px 14px;
  background: #1a1b22;
  flex-shrink: 0;
}
.tkt-topbar__inner { display: flex; align-items: center; gap: 8px; }
.tkt-topbar__icon { font-size: 17px; line-height: 1; }
.tkt-topbar__id {
  font-size: 13px;
  font-weight: 800;
  color: #fff;
  letter-spacing: 0.4px;
}
.tkt-topbar__close {
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
.tkt-topbar__close:hover { background: rgba(255,255,255,0.2); }

/* ── Heading ── */
.tkt-heading { flex-shrink: 0; }
.tkt-heading__img {
  width: 100%;
  display: block;
  max-height: 200px;
  object-fit: cover;
  object-position: center;
}
.tkt-heading__bar {
  padding: 18px 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.hbar--lost    { background: linear-gradient(135deg, #b91c1c, #dc2626); }
.hbar--pending { background: linear-gradient(135deg, #92400e, #d97706); }
.tkt-heading__bar-text {
  font-size: 16px;
  font-weight: 900;
  color: #fff;
  letter-spacing: 0.5px;
}

/* ── Selections ── */
.tkt-sels {
  flex: 1;
  background: #fff;
  border-bottom: 1px solid #f0f1f3;
}

.tkt-sel {
  padding: 10px 14px;
  border-bottom: 1px solid #f3f4f6;
}
.tkt-sel:last-child { border-bottom: none; }

.tkt-sel__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 5px;
}

.tkt-sel__time {
  font-size: 10px;
  color: #9ca3af;
  font-weight: 500;
}

/* ── Status box badge ── */
.tkt-sel__status-box {
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 0.6px;
  padding: 3px 8px;
  border-radius: 4px;
  text-transform: uppercase;
}
.sbox--won     { background: #16a34a; color: #fff; }
.sbox--lost    { background: #dc2626; color: #fff; }
.sbox--pending { background: #92400e; color: #fef3c7; }

.tkt-sel__main {
  display: flex;
  gap: 8px;
  align-items: flex-start;
}

.tkt-sel__left {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.tkt-sel__match {
  font-size: 13px;
  font-weight: 800;
  color: #1a1b22;
  line-height: 1.3;
}
.tkt-sel__league {
  font-size: 10px;
  color: #9ca3af;
  font-weight: 500;
}
.tkt-sel__market {
  font-size: 10px;
  color: #6b7280;
  font-weight: 500;
}

.tkt-sel__right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 5px;
  flex-shrink: 0;
}
.tkt-sel__score {
  font-size: 11px;
  font-weight: 700;
  color: #6b7280;
  min-height: 14px;
}
.tkt-sel__odds {
  font-size: 12px;
  font-weight: 900;
  border-radius: 6px;
  padding: 3px 9px;
  min-width: 36px;
  text-align: center;
  color: #fff;
}
.odds--won     { background: #16a34a; }
.odds--lost    { background: #dc2626; }
.odds--pending { background: #92400e; }

/* ── Gradient summary box ── */
.tkt-grad-box {
  margin: 0;
  padding: 16px 16px 14px;
  flex-shrink: 0;
}
.grad--won     { background: linear-gradient(145deg, #064e3b, #047857, #059669); }
.grad--lost    { background: linear-gradient(145deg, #7f1d1d, #991b1b, #b91c1c); }
.grad--pending { background: linear-gradient(145deg, #78350f, #92400e, #b45309); }

.tkt-grad-grid {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.tkt-grad-item {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  padding: 6px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
}
.tkt-grad-item:last-child { border-bottom: none; }

.tkt-grad-lbl {
  font-size: 12px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.75);
}
.tkt-grad-val {
  font-size: 13px;
  font-weight: 800;
  color: #fff;
  text-align: right;
}

.tkt-grad-item--payout {
  margin-top: 4px;
  padding-top: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.25);
  border-bottom: none;
}
.tkt-grad-lbl--payout {
  font-size: 13px;
  font-weight: 700;
  color: #fff;
}
.tkt-grad-val--payout {
  font-size: 15px;
  font-weight: 900;
  color: #fef08a;
}

/* ── Cash Out ── */
.tkt-cashout {
  padding: 12px 16px;
  background: #fff;
  border-top: 1px solid #f0f1f3;
  flex-shrink: 0;
}
.tkt-cashout__btn {
  width: 100%;
  padding: 13px;
  border: none;
  border-radius: 10px;
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: #1a1b22;
  font-size: 15px;
  font-weight: 900;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: opacity 0.15s, transform 0.1s;
  box-shadow: 0 3px 10px rgba(217, 119, 6, 0.45);
}
.tkt-cashout__btn:hover  { opacity: 0.9; }
.tkt-cashout__btn:active { transform: scale(0.98); }

/* ── Footer ── */
.tkt-footer {
  padding: 10px 16px;
  text-align: center;
  font-size: 10px;
  color: #9ca3af;
  font-weight: 500;
  background: #f8f9fa;
  border-top: 1px solid #eef0f2;
  flex-shrink: 0;
}
</style>
