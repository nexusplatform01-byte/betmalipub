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

      <div class="header__pill" @click="goProfile" title="View Profile">
        <div class="header__pill-avatar">{{ initials }}</div>
        <div class="header__pill-text">
          <span class="header__pill-label">Balance</span>
          <span class="header__pill-amount">{{ store.currency }} {{ store.balance.toLocaleString() }}</span>
        </div>
      </div>

      <button class="header__wallet-btn header__wallet-btn--plus" @click="doDeposit" title="Deposit">+</button>

      <button class="header__logout-btn" @click="doLogout" title="Logout">
        <svg viewBox="0 0 24 24" fill="none" width="14" height="14">
          <path d="M16 13v-2H7V8l-5 4 5 4v-3z" fill="currentColor"/>
          <path d="M20 3H10a2 2 0 00-2 2v4h2V5h10v14H10v-4H8v4a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2z" fill="currentColor"/>
        </svg>
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, inject } from "vue";
import { useRouter } from "vue-router";
import { useAppStore } from "@/stores/app";

const store = useAppStore();
const router = useRouter();
const openLogin    = inject<() => void>("openLogin",    () => {});
const openRegister = inject<() => void>("openRegister", () => {});

const initials = computed(() => {
  const name = store.userName || "U";
  return name.split(" ").map((w: string) => w[0]).slice(0, 2).join("").toUpperCase();
});

function goProfile() {
  router.push("/profile");
}

function doDeposit() {
  const amt = prompt("Deposit amount (UGX):");
  if (amt && !isNaN(Number(amt)) && Number(amt) > 0) store.deposit(Number(amt));
}
function doWithdraw() {
  const amt = prompt("Withdraw amount (UGX):");
  if (amt && !isNaN(Number(amt)) && Number(amt) > 0) store.withdraw(Number(amt));
}
function doLogout() {
  if (confirm("Are you sure you want to logout?")) store.logout();
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

/* Gold pill */
.header__pill {
  display: flex;
  align-items: center;
  gap: 0;
  background: #ffe60f;
  border-radius: 999px;
  padding: 2px 10px 2px 2px;
  box-shadow: 0 1px 6px rgba(0,0,0,0.18);
  cursor: pointer;
  transition: filter 0.15s;
}
.header__pill:hover { filter: brightness(0.96); }

.header__pill-avatar {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #16a34a;
  color: #fff;
  font-size: 11px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-right: 7px;
}

.header__pill-text {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}
.header__pill-label {
  font-size: 8px;
  color: rgba(0,0,0,0.5);
  text-transform: uppercase;
  letter-spacing: 0.4px;
  font-weight: 600;
}
.header__pill-amount {
  font-size: 12px;
  font-weight: 800;
  color: #1c1e24;
  white-space: nowrap;
}

/* +/- buttons */
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

/* Circle logout button */
.header__logout-btn {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 1.5px solid rgba(255,255,255,0.35);
  background: rgba(255,255,255,0.12);
  color: rgba(255,255,255,0.85);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.15s, border-color 0.15s, color 0.15s, transform 0.15s;
  margin-left: 2px;
}
.header__logout-btn:hover {
  background: rgba(239,68,68,0.25);
  border-color: rgba(239,68,68,0.6);
  color: #fca5a5;
  transform: scale(1.08);
}
.header__logout-btn:active { transform: scale(0.92); }
</style>
