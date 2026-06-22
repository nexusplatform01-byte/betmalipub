<template>
  <Teleport to="body">
    <div class="dep-overlay" @click.self="$emit('close')">
      <div class="dep-modal">

        <div class="dep-header">
          <div class="dep-header__icon">💰</div>
          <div class="dep-header__text">
            <div class="dep-header__title">Deposit Funds</div>
            <div class="dep-header__sub">Current balance: {{ store.currency }} {{ store.balance.toLocaleString() }}</div>
          </div>
          <button class="dep-close" @click="$emit('close')">✕</button>
        </div>

        <div class="dep-body">
          <div class="dep-group">
            <label class="dep-label">Enter Amount (UGX)</label>
            <div class="dep-input-wrap">
              <span class="dep-currency">UGX</span>
              <input
                ref="inputRef"
                v-model="rawAmount"
                class="dep-input"
                type="number"
                inputmode="numeric"
                placeholder="0"
                min="1000"
                @keydown.enter="doDeposit"
              />
            </div>
            <p v-if="error" class="dep-error">{{ error }}</p>
          </div>

          <div class="dep-quick">
            <button
              v-for="q in quickAmounts" :key="q"
              class="dep-quick__btn"
              :class="{ active: rawAmount === String(q) }"
              @click="rawAmount = String(q)"
            >
              +{{ q.toLocaleString() }}
            </button>
          </div>

          <button class="dep-btn-primary" :disabled="!rawAmount" @click="doDeposit">
            Deposit {{ rawAmount ? 'UGX ' + Number(rawAmount).toLocaleString() : '' }}
          </button>
        </div>

      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted } from 'vue';
import { useAppStore } from '@/stores/app';

const emit = defineEmits<{ close: [] }>();
const store = useAppStore();

const rawAmount = ref('');
const error = ref('');
const inputRef = ref<HTMLInputElement | null>(null);

const quickAmounts = [5000, 10000, 20000, 50000, 100000];

onMounted(() => nextTick(() => inputRef.value?.focus()));

function doDeposit() {
  const amt = Number(rawAmount.value);
  if (!rawAmount.value || isNaN(amt) || amt <= 0) {
    error.value = 'Please enter a valid amount.';
    return;
  }
  if (amt < 1000) {
    error.value = 'Minimum deposit is UGX 1,000.';
    return;
  }
  store.deposit(amt);
  emit('close');
}
</script>

<style scoped>
.dep-overlay {
  position: fixed;
  inset: 0;
  background: rgba(10, 10, 20, 0.55);
  backdrop-filter: blur(3px);
  z-index: 400;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.dep-modal {
  background: #fff;
  border-radius: 16px;
  width: 100%;
  max-width: 360px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  animation: dep-pop 0.18s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes dep-pop {
  from { opacity: 0; transform: scale(0.90) translateY(12px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}

/* ── Header ── */
.dep-header {
  display: flex;
  align-items: center;
  gap: 10px;
  background: linear-gradient(135deg, #c026d3, #7c3aed);
  padding: 16px 16px 14px;
}

.dep-header__icon {
  font-size: 22px;
  flex-shrink: 0;
}

.dep-header__text {
  flex: 1;
  min-width: 0;
}

.dep-header__title {
  font-size: 15px;
  font-weight: 800;
  color: #fff;
  line-height: 1.2;
}

.dep-header__sub {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.75);
  margin-top: 2px;
}

.dep-close {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: 1.5px solid rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
  font-size: 11px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.15s;
}
.dep-close:hover { background: rgba(255, 255, 255, 0.28); }

/* ── Body ── */
.dep-body {
  padding: 20px 18px 22px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* ── Input group ── */
.dep-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.dep-label {
  font-size: 11px;
  font-weight: 700;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.4px;
}

.dep-input-wrap {
  display: flex;
  align-items: center;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  overflow: hidden;
  transition: border-color 0.15s;
}
.dep-input-wrap:focus-within {
  border-color: #c026d3;
}

.dep-currency {
  background: #f3f4f6;
  padding: 0 12px;
  font-size: 12px;
  font-weight: 800;
  color: #6b7280;
  height: 48px;
  display: flex;
  align-items: center;
  border-right: 2px solid #e5e7eb;
  flex-shrink: 0;
}

.dep-input {
  flex: 1;
  border: none;
  outline: none;
  padding: 0 14px;
  font-size: 20px;
  font-weight: 800;
  color: #111827;
  height: 48px;
  background: transparent;
  min-width: 0;
}
.dep-input::placeholder { color: #d1d5db; font-weight: 400; }
.dep-input::-webkit-inner-spin-button,
.dep-input::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }

.dep-error {
  font-size: 11px;
  color: #ef4444;
  margin: 0;
  font-weight: 600;
}

/* ── Quick amounts ── */
.dep-quick {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.dep-quick__btn {
  flex: 1;
  min-width: calc(33% - 6px);
  padding: 7px 4px;
  border-radius: 8px;
  border: 1.5px solid #e5e7eb;
  background: #f9fafb;
  font-size: 11px;
  font-weight: 700;
  color: #374151;
  cursor: pointer;
  text-align: center;
  white-space: nowrap;
  transition: background 0.12s, border-color 0.12s, color 0.12s;
}
.dep-quick__btn:hover {
  background: #fdf4ff;
  border-color: #c026d3;
  color: #c026d3;
}
.dep-quick__btn.active {
  background: #fdf4ff;
  border-color: #c026d3;
  color: #c026d3;
}

/* ── Primary button ── */
.dep-btn-primary {
  width: 100%;
  padding: 14px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(90deg, #c026d3, #7c3aed);
  color: #fff;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  transition: opacity 0.15s, transform 0.1s;
  letter-spacing: 0.2px;
}
.dep-btn-primary:hover:not(:disabled) { opacity: 0.92; }
.dep-btn-primary:active:not(:disabled) { transform: scale(0.98); }
.dep-btn-primary:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
</style>
