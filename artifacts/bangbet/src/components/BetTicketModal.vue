<template>
  <Teleport to="body">
    <div class="tkt-overlay" @click.self="$emit('close')">
      <div class="tkt-sheet">

        <!-- ── Top bar: BET ID ── -->
        <div class="tkt-topbar">
          <div class="tkt-topbar__inner">
            <span class="tkt-topbar__icon">🏆</span>
            <span class="tkt-topbar__id">BET ID #{{ bet.ticketId }}</span>
          </div>
          <button class="tkt-topbar__close" @click="$emit('close')">✕</button>
        </div>

        <!-- ── Status / congrats banner ── -->
        <div class="tkt-banner" :class="'tkt-banner--' + bet.status">
          <div class="tkt-banner__content">
            <div v-if="bet.status === 'won'" class="tkt-banner__sub">Congratulations on</div>
            <div class="tkt-banner__main">
              {{ statusHeadline }}
            </div>
            <div v-if="bet.status === 'won'" class="tkt-banner__amount">
              UGX {{ bet.payout.toLocaleString() }}
            </div>
          </div>
        </div>

        <!-- ── Summary list ── -->
        <div class="tkt-summary">
          <div class="tkt-summary__row">
            <span class="tkt-summary__lbl">Odds:</span>
            <span class="tkt-summary__val">{{ bet.totalOdds.toFixed(2) }}</span>
          </div>
          <div class="tkt-summary__row">
            <span class="tkt-summary__lbl">Stake:</span>
            <span class="tkt-summary__val">UGX {{ bet.stake.toLocaleString() }}</span>
          </div>
          <div class="tkt-summary__divider"></div>
          <div class="tkt-summary__row">
            <span class="tkt-summary__lbl">Potential Winnings:</span>
            <span class="tkt-summary__val">UGX {{ bet.potentialWin.toLocaleString() }}</span>
          </div>
          <div v-if="bet.winBonus" class="tkt-summary__row">
            <span class="tkt-summary__lbl">Win Bonus:</span>
            <span class="tkt-summary__val">UGX {{ bet.winBonus.toLocaleString() }}</span>
          </div>
          <div class="tkt-summary__row tkt-summary__row--payout">
            <span class="tkt-summary__lbl tkt-summary__lbl--payout">Payout:</span>
            <span class="tkt-summary__val tkt-summary__val--payout" :class="'payout--' + bet.status">
              {{ payoutLabel }} UGX {{ (bet.status === 'won' ? bet.payout : bet.potentialWin).toLocaleString() }}
            </span>
          </div>
        </div>

        <!-- ── Selections ── -->
        <div class="tkt-sels">
          <div
            v-for="(sel, i) in bet.selections"
            :key="i"
            class="tkt-sel"
            :class="'tkt-sel--' + selResult(sel)"
          >
            <div class="tkt-sel__body">
              <div class="tkt-sel__left">
                <div class="tkt-sel__time">{{ sel.time ?? bet.date }}</div>
                <div class="tkt-sel__match">{{ sel.match }}</div>
                <div v-if="sel.league" class="tkt-sel__league">{{ sel.league }}</div>
                <div class="tkt-sel__market">{{ sel.market }} | Full Time | {{ sel.team }}</div>
              </div>
              <div class="tkt-sel__right">
                <div class="tkt-sel__score">{{ sel.score || '' }}</div>
                <div class="tkt-sel__odds" :class="'odds--' + selResult(sel)">{{ sel.odds }}</div>
              </div>
            </div>
          </div>
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

const statusHeadline = computed(() => {
  if (props.bet.status === 'won')  return 'WINNING BIG';
  if (props.bet.status === 'lost') return 'BETTER LUCK NEXT TIME';
  return 'BET PENDING';
});

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
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(2px);
  z-index: 600;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}
@media (min-width: 600px) {
  .tkt-overlay { align-items: center; padding: 20px; }
}

/* ── Sheet ── */
.tkt-sheet {
  width: 100%;
  max-width: 460px;
  max-height: 93vh;
  background: #fff;
  border-radius: 16px 16px 0 0;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  animation: sheet-up 0.24s cubic-bezier(0.34, 1.2, 0.64, 1);
  scrollbar-width: none;
}
.tkt-sheet::-webkit-scrollbar { display: none; }
@media (min-width: 600px) {
  .tkt-sheet { border-radius: 14px; }
}
@keyframes sheet-up {
  from { opacity: 0; transform: translateY(32px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── Top bar ── */
.tkt-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 11px 14px;
  background: #f5f6f7;
  border-bottom: 1px solid #e8e9ec;
  flex-shrink: 0;
}
.tkt-topbar__inner {
  display: flex;
  align-items: center;
  gap: 8px;
}
.tkt-topbar__icon { font-size: 18px; line-height: 1; }
.tkt-topbar__id {
  font-size: 13px;
  font-weight: 800;
  color: #1a1b22;
  letter-spacing: 0.3px;
}
.tkt-topbar__close {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: 1.5px solid #ccc;
  background: #fff;
  color: #555;
  font-size: 11px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.15s;
}
.tkt-topbar__close:hover { background: #f0f0f0; }

/* ── Banner ── */
.tkt-banner {
  padding: 14px 16px 16px;
  flex-shrink: 0;
}
.tkt-banner--won     { background: linear-gradient(135deg, #00a651, #00c462); }
.tkt-banner--lost    { background: linear-gradient(135deg, #cc2222, #e03333); }
.tkt-banner--pending { background: linear-gradient(135deg, #e07b00, #f59300); }

.tkt-banner__content { display: flex; flex-direction: column; gap: 2px; }

.tkt-banner__sub {
  font-size: 11px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.85);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.tkt-banner__main {
  font-size: 20px;
  font-weight: 900;
  color: #fff;
  letter-spacing: 0.5px;
  line-height: 1.1;
}
.tkt-banner__amount {
  font-size: 22px;
  font-weight: 900;
  color: #fff;
  margin-top: 2px;
}

/* ── Summary list ── */
.tkt-summary {
  padding: 0;
  background: #fff;
  flex-shrink: 0;
  border-bottom: 6px solid #f1f3f5;
}

.tkt-summary__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 9px 16px;
  border-bottom: 1px solid #f3f4f6;
}
.tkt-summary__row:last-child { border-bottom: none; }

.tkt-summary__divider {
  height: 6px;
  background: #f1f3f5;
}

.tkt-summary__lbl {
  font-size: 13px;
  color: #555b6a;
  font-weight: 500;
}
.tkt-summary__val {
  font-size: 13px;
  font-weight: 700;
  color: #1a1b22;
  text-align: right;
}

.tkt-summary__row--payout {
  padding: 11px 16px;
}
.tkt-summary__lbl--payout {
  font-size: 13px;
  font-weight: 700;
  color: #1a1b22;
}
.tkt-summary__val--payout {
  font-size: 14px;
  font-weight: 900;
}
.payout--won     { color: #00a651; }
.payout--lost    { color: #cc2222; }
.payout--pending { color: #e07b00; }

/* ── Selections ── */
.tkt-sels {
  flex: 1;
  background: #fff;
}

.tkt-sel {
  border-left: 4px solid #ccc;
  padding: 10px 14px 10px 12px;
  border-bottom: 1px solid #f0f1f3;
}
.tkt-sel:last-child { border-bottom: none; }

.tkt-sel--won     { border-left-color: #00a651; background: #f6fff9; }
.tkt-sel--lost    { border-left-color: #cc2222; background: #fff6f6; }
.tkt-sel--pending { border-left-color: #e07b00; background: #fffbf4; }

.tkt-sel__body {
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

.tkt-sel__time {
  font-size: 10px;
  color: #9ca3af;
  font-weight: 500;
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
  margin-top: 1px;
}

.tkt-sel__right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
  flex-shrink: 0;
  padding-top: 1px;
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
  line-height: 1.4;
  min-width: 36px;
  text-align: center;
}
.odds--won     { background: #00a651; color: #fff; }
.odds--lost    { background: #cc2222; color: #fff; }
.odds--pending { background: #e07b00; color: #fff; }

/* ── Footer ── */
.tkt-footer {
  padding: 12px 16px;
  text-align: center;
  font-size: 11px;
  color: #9ca3af;
  font-weight: 500;
  background: #f8f9fa;
  border-top: 1px solid #eef0f2;
  flex-shrink: 0;
}
</style>
