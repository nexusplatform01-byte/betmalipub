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

        <!-- ── Heading image (won/lost) or coloured bar (pending) ── -->
        <div class="tkt-heading">
          <img
            v-if="bet.status === 'won'"
            src="/static/winner-banner.jpg"
            class="tkt-heading__img"
            alt="Winner"
          />
          <img
            v-else-if="bet.status === 'lost'"
            src="/static/lost-banner.png"
            class="tkt-heading__img tkt-heading__img--lost"
            alt="Better luck next time"
          />
          <div v-else class="tkt-heading__bar hbar--pending">
            <span class="tkt-heading__bar-text">⏳ BET PENDING</span>
          </div>
        </div>

        <!-- ── Ticket ID strip ── -->
        <div class="tkt-idstrip">
          <span>Type: <strong>{{ bet.type }}</strong></span>
          <span>{{ bet.selections.length }} {{ bet.selections.length === 1 ? 'Selection' : 'Selections' }}</span>
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

        <!-- ── Summary box (white + cyan border) ── -->
        <div class="tkt-summary-box">
          <div class="tkt-sb-row">
            <span class="tkt-sb-lbl">Odds:</span>
            <span class="tkt-sb-val">{{ bet.totalOdds.toFixed(2) }}</span>
          </div>
          <div class="tkt-sb-row">
            <span class="tkt-sb-lbl">Stake:</span>
            <span class="tkt-sb-val">UGX {{ bet.stake.toLocaleString() }}.00</span>
          </div>
          <div class="tkt-sb-row">
            <span class="tkt-sb-lbl tkt-sb-lbl--bold">Potential Winnings:</span>
            <span class="tkt-sb-val">UGX {{ bet.potentialWin.toLocaleString() }}</span>
          </div>
          <div v-if="bet.winBonus" class="tkt-sb-row">
            <span class="tkt-sb-lbl">Win Bonus:</span>
            <span class="tkt-sb-val">UGX {{ bet.winBonus.toLocaleString() }}</span>
          </div>
          <div class="tkt-sb-row tkt-sb-row--payout">
            <span class="tkt-sb-lbl tkt-sb-lbl--bold">Payout:</span>
            <span class="tkt-sb-val tkt-sb-val--payout" :class="'pv--' + bet.status">
              {{ payoutLabel }} UGX {{ (bet.status === 'won' ? bet.payout : bet.potentialWin).toLocaleString() }}
            </span>
          </div>
        </div>

        <!-- ── Cash Out button (pending only) ── -->
        <div v-if="bet.status === 'pending'" class="tkt-cashout">
          <button class="tkt-cashout__btn">
            💰 Cash Out &nbsp;·&nbsp; UGX {{ cashoutAmount.toLocaleString() }}
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

const cashoutAmount = computed(() =>
  Math.round(props.bet.stake * props.bet.totalOdds * 0.72)
);

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

/* ── Sheet (compact square card) ── */
.tkt-sheet {
  width: 100%;
  max-width: 360px;
  max-height: 90vh;
  background: #fff;
  border-radius: 14px;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  animation: tkt-pop 0.2s cubic-bezier(0.34, 1.3, 0.64, 1);
  scrollbar-width: none;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.45);
}
.tkt-sheet::-webkit-scrollbar { display: none; }

@keyframes tkt-pop {
  from { opacity: 0; transform: scale(0.9); }
  to   { opacity: 1; transform: scale(1); }
}

/* ── Top bar ── */
.tkt-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 9px 12px;
  background: #1a1b22;
  flex-shrink: 0;
}
.tkt-topbar__inner { display: flex; align-items: center; gap: 7px; }
.tkt-topbar__icon  { font-size: 15px; line-height: 1; }
.tkt-topbar__id {
  font-size: 12px;
  font-weight: 800;
  color: #fff;
  letter-spacing: 0.4px;
}
.tkt-topbar__close {
  width: 24px; height: 24px;
  border-radius: 50%;
  border: 1.5px solid rgba(255,255,255,0.3);
  background: rgba(255,255,255,0.1);
  color: #fff;
  font-size: 10px;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  transition: background 0.15s;
}
.tkt-topbar__close:hover { background: rgba(255,255,255,0.2); }

/* ── Heading image / bar ── */
.tkt-heading { flex-shrink: 0; }
.tkt-heading__img {
  width: 100%;
  display: block;
  height: 90px;
  object-fit: cover;
  object-position: center 30%;
}
.tkt-heading__img--lost {
  height: 110px;
  object-fit: contain;
  background: #fff8f8;
  object-position: center center;
}
.tkt-heading__bar {
  padding: 12px 14px;
  display: flex; align-items: center; justify-content: center;
}
.hbar--lost    { background: linear-gradient(135deg, #b91c1c, #dc2626); }
.hbar--pending { background: linear-gradient(135deg, #92400e, #d97706); }
.tkt-heading__bar-text {
  font-size: 13px; font-weight: 900; color: #fff; letter-spacing: 0.4px;
}

/* ── ID strip ── */
.tkt-idstrip {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 12px;
  background: #f8f9fa;
  border-bottom: 1px solid #eef0f2;
  font-size: 10px;
  color: #6b7280;
  flex-shrink: 0;
}
.tkt-idstrip strong { color: #1a1b22; }

/* ── Selections ── */
.tkt-sels { flex: 1; background: #fff; }

.tkt-sel {
  padding: 8px 12px;
  border-bottom: 1px solid #f3f4f6;
}
.tkt-sel:last-child { border-bottom: none; }

.tkt-sel__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}
.tkt-sel__time { font-size: 9px; color: #9ca3af; font-weight: 500; }

/* Status box */
.tkt-sel__status-box {
  font-size: 8px; font-weight: 900;
  letter-spacing: 0.5px;
  padding: 2px 7px;
  border-radius: 3px;
  text-transform: uppercase;
}
.sbox--won     { background: #16a34a; color: #fff; }
.sbox--lost    { background: #dc2626; color: #fff; }
.sbox--pending { background: #92400e; color: #fef3c7; }

.tkt-sel__main { display: flex; gap: 8px; align-items: flex-start; }

.tkt-sel__left {
  flex: 1; min-width: 0;
  display: flex; flex-direction: column; gap: 1px;
}
.tkt-sel__match  { font-size: 12px; font-weight: 800; color: #1a1b22; line-height: 1.3; }
.tkt-sel__league { font-size: 9px; color: #9ca3af; font-weight: 500; }
.tkt-sel__market { font-size: 9px; color: #6b7280; font-weight: 500; }

.tkt-sel__right {
  display: flex; flex-direction: column; align-items: flex-end;
  gap: 4px; flex-shrink: 0;
}
.tkt-sel__score { font-size: 10px; font-weight: 700; color: #6b7280; min-height: 12px; }
.tkt-sel__odds {
  font-size: 10px; font-weight: 800;
  border-radius: 4px; padding: 2px 6px;
  min-width: 28px; text-align: center; color: #fff;
}
.odds--won     { background: #7c3aed; }
.odds--lost    { background: #7c3aed; }
.odds--pending { background: #7c3aed; }

/* ── Summary box — white + cyan border ── */
.tkt-summary-box {
  margin: 10px 12px;
  border: 1.5px solid #22d3ee;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
  background: #fff;
}

.tkt-sb-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  padding: 7px 12px;
  border-bottom: 1px solid #f0fdff;
}
.tkt-sb-row:last-child { border-bottom: none; }

.tkt-sb-lbl {
  font-size: 12px;
  color: #374151;
  font-weight: 400;
}
.tkt-sb-lbl--bold { font-weight: 700; color: #111827; }

.tkt-sb-val {
  font-size: 12px;
  font-weight: 700;
  color: #111827;
  text-align: right;
}

.tkt-sb-row--payout {
  background: #f0fdff;
  padding: 9px 12px;
}
.tkt-sb-val--payout { font-size: 13px; font-weight: 900; }
.pv--won     { color: #16a34a; }
.pv--lost    { color: #dc2626; }
.pv--pending { color: #b45309; }

/* ── Cash Out ── */
.tkt-cashout {
  padding: 0 12px 10px;
  flex-shrink: 0;
}
.tkt-cashout__btn {
  width: 100%;
  padding: 11px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: #1a1b22;
  font-size: 13px;
  font-weight: 900;
  letter-spacing: 0.3px;
  cursor: pointer;
  transition: opacity 0.15s, transform 0.1s;
  box-shadow: 0 3px 8px rgba(217, 119, 6, 0.4);
}
.tkt-cashout__btn:hover  { opacity: 0.9; }
.tkt-cashout__btn:active { transform: scale(0.98); }

/* ── Footer ── */
.tkt-footer {
  padding: 8px 12px;
  text-align: center;
  font-size: 9px;
  color: #9ca3af;
  font-weight: 500;
  background: #f8f9fa;
  border-top: 1px solid #eef0f2;
  flex-shrink: 0;
}
</style>
