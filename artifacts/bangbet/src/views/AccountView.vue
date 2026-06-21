<template>
  <div class="page">
    <AppHeader />

    <!-- Logged out state -->
    <div v-if="!store.isLoggedIn" style="padding:40px 20px; text-align:center;">
      <img src="/static/images/Img_Logo_Yellow_66.png" alt="Bangbet" style="height:48px; margin-bottom:24px;" />
      <h2 style="font-size:20px; font-weight:700; margin-bottom:8px;">My Account</h2>
      <p style="color:var(--text-muted); font-size:14px; margin-bottom:28px; line-height:1.5;">
        Login to view your account, check your bets, and manage your balance.
      </p>
      <button class="btn-register" style="width:100%; padding:14px; font-size:16px; border-radius:8px; margin-bottom:12px;" @click="openLogin">Login</button>
      <button class="btn-login" style="width:100%; padding:14px; font-size:16px; border-radius:8px;" @click="openRegister">Register</button>
    </div>

    <!-- Logged in state -->
    <div v-else>
      <div class="account-header">
        <div class="account-avatar">B</div>
        <div>
          <div class="account-name">Bangbet User</div>
          <div class="account-phone">+256 XXX XXXXXX</div>
        </div>
        <div class="account-balance">
          <div class="account-balance__amount">{{ store.currency }} {{ store.balance.toLocaleString() }}</div>
          <div class="account-balance__label">Available Balance</div>
        </div>
      </div>

      <div class="action-btns">
        <button class="btn-deposit">💳 Deposit</button>
        <button class="btn-withdraw">💸 Withdraw</button>
      </div>

      <div class="menu-list">
        <div class="menu-item" v-for="item in menuItems" :key="item.label">
          <span class="menu-item__icon">{{ item.icon }}</span>
          <span class="menu-item__label">{{ item.label }}</span>
          <span class="menu-item__arrow">›</span>
        </div>
        <div class="menu-item" @click="store.logout()">
          <span class="menu-item__icon">🚪</span>
          <span class="menu-item__label" style="color:var(--red)">Logout</span>
          <span class="menu-item__arrow">›</span>
        </div>
      </div>
    </div>

    <BottomNav />
  </div>
</template>

<script setup lang="ts">
import { inject } from "vue";
import AppHeader from "@/components/AppHeader.vue";
import BottomNav from "@/components/BottomNav.vue";
import { useAppStore } from "@/stores/app";

const store = useAppStore();
const openLogin = inject<() => void>("openLogin", () => {});
const openRegister = inject<() => void>("openRegister", () => {});

const menuItems = [
  { icon: "📋", label: "My Bets" },
  { icon: "🏆", label: "Jackpot Bets" },
  { icon: "🎁", label: "Bonuses & Promotions" },
  { icon: "💰", label: "Transaction History" },
  { icon: "🔒", label: "Change Password" },
  { icon: "📞", label: "Customer Support" },
  { icon: "ℹ️", label: "Responsible Gambling" },
  { icon: "📱", label: "Download App" },
];
</script>
