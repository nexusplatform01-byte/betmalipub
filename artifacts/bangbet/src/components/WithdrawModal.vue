<template>
  <Teleport to="body">
    <div class="wit-overlay" @click.self="$emit('close')">
      <div class="wit-modal">

        <div class="wit-header">
          <div class="wit-header__icon">💸</div>
          <div class="wit-header__text">
            <div class="wit-header__title">Withdraw Funds</div>
            <div class="wit-header__sub">Available: {{ store.currency }} {{ store.balance.toLocaleString() }}</div>
          </div>
          <button class="wit-close" @click="$emit('close')">✕</button>
        </div>

        <div class="wit-body">
          <div class="wit-group">
            <label class="wit-label">Enter Amount (UGX)</label>
            <div class="wit-input-wrap">
              <span class="wit-currency">UGX</span>
              <input
                ref="inputRef"
                v-model="rawAmount"
                class="wit-input"
                type="number"
                inputmode="numeric"
                placeholder="0"
                min="1000"
                @keydown.enter="doWithdraw"
              />
            </div>
            <p v-if="error" class="wit-error">{{ error }}</p>
          </div>

          <div class="wit-quick">
            <button
              v-for="q in quickAmounts" :key="q"
              class="wit-quick__btn"
              :class="{ active: rawAmount === String(q), disabled: q > store.balance }"
              :disabled="q > store.balance"
              @click="rawAmount = String(q)"
            >
              {{ q.toLocaleString() }}
            </button>
          </div>

          <button class="wit-btn-primary" :disabled="!rawAmount" @click="doWithdraw">
            Withdraw {{ rawAmount ? 'UGX ' + Number(rawAmount).toLocaleString() : '' }}
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

function doWithdraw() {
  const amt = Number(rawAmount.value);
  if (!rawAmount.value || isNaN(amt) || amt <= 0) {
    error.value = 'Please enter a valid amount.';
    return;
  }
  if (amt < 1000) {
    error.value = 'Minimum withdrawal is UGX 1,000.';
    return;
  }
  if (amt > store.balance) {
    error.value = `Insufficient balance. Max: UGX ${store.balance.toLocaleString()}`;
    return;
  }
  store.withdraw(amt);
  emit('close');
}
</script>

<style scoped>
.wit-overlay {
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

.wit-modal {
  background: #fff;
  border-radius: 16px;
  width: 100%;
  max-width: 360px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  animation: wit-pop 0.18s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes wit-pop {
  from { opacity: 0; transform: scale(0.90) translateY(12px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}

.wit-header {
  display: flex;
  align-items: center;
  gap: 10px;
  background: linear-gradient(135deg, #0ea5e9, #0369a1);
  padding: 16px 16px 14px;
}

.wit-header__icon { font-size: 22px; flex-shrink: 0; }

.wit-header__text { flex: 1; min-width: 0; }

.wit-header__title {
  font-size: 15px;
  font-weight: 800;
  color: #fff;
  line-height: 1.2;
}

.wit-header__sub {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.75);
  margin-top: 2px;
}

.wit-close {
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
.wit-close:hover { background: rgba(255, 255, 255, 0.28); }

.wit-body {
  padding: 20px 18px 22px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.wit-group { display: flex; flex-direction: column; gap: 6px; }

.wit-label {
  font-size: 11px;
  font-weight: 700;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.4px;
}

.wit-input-wrap {
  display: flex;
  align-items: center;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  overflow: hidden;
  transition: border-color 0.15s;
}
.wit-input-wrap:focus-within { border-color: #0ea5e9; }

.wit-currency {
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

.wit-input {
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
.wit-input::placeholder { color: #d1d5db; font-weight: 400; }
.wit-input::-webkit-inner-spin-button,
.wit-input::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }

.wit-error {
  font-size: 11px;
  color: #ef4444;
  margin: 0;
  font-weight: 600;
}

.wit-quick {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.wit-quick__btn {
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
.wit-quick__btn:hover:not(:disabled) {
  background: #eff6ff;
  border-color: #0ea5e9;
  color: #0369a1;
}
.wit-quick__btn.active {
  background: #eff6ff;
  border-color: #0ea5e9;
  color: #0369a1;
}
.wit-quick__btn.disabled,
.wit-quick__btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.wit-btn-primary {
  width: 100%;
  padding: 14px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(90deg, #0ea5e9, #0369a1);
  color: #fff;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  transition: opacity 0.15s, transform 0.1s;
  letter-spacing: 0.2px;
}
.wit-btn-primary:hover:not(:disabled) { opacity: 0.92; }
.wit-btn-primary:active:not(:disabled) { transform: scale(0.98); }
.wit-btn-primary:disabled { opacity: 0.45; cursor: not-allowed; }
</style>
