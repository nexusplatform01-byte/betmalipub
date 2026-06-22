<template>
  <header class="header">
    <img :src="'/static/images/Img_Logo_Yellow_66.png'" alt="Bangbet" class="header__logo" />

    <nav class="header__nav" v-if="!store.isLoggedIn">
      <a class="header__nav-link" href="#">App</a>
      <a class="header__nav-link" href="#">Contact</a>
    </nav>

    <!-- Logged OUT -->
    <div class="header__actions" v-if="!store.isLoggedIn">
      <button class="btn-login" @click="openLogin">Login</button>
      <button class="btn-register" @click="openRegister">Register</button>
    </div>

    <!-- Logged IN -->
    <div class="header__user" v-else>
      <button class="header__wallet-btn header__wallet-btn--minus" @click="doWithdraw" title="Withdraw">−</button>

      <div class="header__balance-wrap">
        <span class="header__balance-label">Balance</span>
        <span class="header__balance-amount">{{ store.currency }} {{ store.balance.toLocaleString() }}</span>
      </div>

      <button class="header__wallet-btn header__wallet-btn--plus" @click="doDeposit" title="Deposit">+</button>

      <div class="header__avatar" :title="store.userName">{{ initials }}</div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, inject } from "vue";
import { useAppStore } from "@/stores/app";

const store = useAppStore();
const openLogin    = inject<() => void>("openLogin",    () => {});
const openRegister = inject<() => void>("openRegister", () => {});

const initials = computed(() => {
  const name = store.userName || "U";
  return name.split(" ").map((w: string) => w[0]).slice(0, 2).join("").toUpperCase();
});

function doDeposit() {
  const amt = prompt("Deposit amount (UGX):");
  if (amt && !isNaN(Number(amt)) && Number(amt) > 0) store.deposit(Number(amt));
}
function doWithdraw() {
  const amt = prompt("Withdraw amount (UGX):");
  if (amt && !isNaN(Number(amt)) && Number(amt) > 0) store.withdraw(Number(amt));
}
</script>

<style scoped>
.header__nav {
  display: none;
}

@media (min-width: 1024px) {
  .header__nav {
    display: flex;
    align-items: center;
    gap: 4px;
    flex: 1;
    padding-left: 24px;
  }
  .header__nav-link {
    padding: 4px 14px;
    font-size: 13px;
    font-weight: 600;
    color: rgba(255,255,255,0.80);
    text-decoration: none;
    border-radius: 6px;
    transition: color 0.15s, background 0.15s;
    letter-spacing: 0.2px;
  }
  .header__nav-link:hover {
    color: #fff;
    background: rgba(255,255,255,0.10);
  }
}

/* ── Logged-in user row ── */
.header__user {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-left: auto;
}

.header__balance-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  line-height: 1.1;
}
.header__balance-label {
  font-size: 8px;
  color: rgba(255,255,255,0.55);
  text-transform: uppercase;
  letter-spacing: 0.4px;
}
.header__balance-amount {
  font-size: 12px;
  font-weight: 800;
  color: #ffe60f;
  white-space: nowrap;
}

.header__wallet-btn {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: none;
  font-size: 16px;
  font-weight: 700;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: transform 0.15s, opacity 0.15s;
}
.header__wallet-btn:active { transform: scale(0.9); opacity: 0.8; }

.header__wallet-btn--plus {
  background: #16a34a;
  color: #fff;
}
.header__wallet-btn--minus {
  background: rgba(255,255,255,0.18);
  color: #fff;
}

.header__avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ffe60f, #f59e0b);
  color: #1c1e24;
  font-size: 11px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  cursor: pointer;
  border: 2px solid rgba(255,255,255,0.25);
}
</style>
