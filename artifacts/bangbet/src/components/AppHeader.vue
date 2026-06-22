<template>
  <header class="header">
    <img :src="'/static/images/Img_Logo_Yellow_66.png'" alt="Bangbet" class="header__logo" />

    <!-- Desktop centre: quick stats -->
    <div class="header__dt-stats">
      <div class="header__dt-stat">
        <span class="header__dt-stat-val">251</span>
        <span class="header__dt-stat-lbl">Football</span>
      </div>
      <div class="header__dt-stat-sep"></div>
      <div class="header__dt-stat">
        <span class="header__dt-stat-val live">24</span>
        <span class="header__dt-stat-lbl">Live Now</span>
      </div>
      <div class="header__dt-stat-sep"></div>
      <div class="header__dt-stat">
        <span class="header__dt-stat-val">UGX 50M</span>
        <span class="header__dt-stat-lbl">Jackpot</span>
      </div>
    </div>

    <div class="header__actions" v-if="!store.isLoggedIn">
      <button class="btn-login" @click="openLogin">Login</button>
      <button class="btn-register" @click="openRegister">Register</button>
    </div>
    <div class="header__actions" v-else>
      <div class="header__balance">
        <span class="header__balance-amount">{{ store.currency }} {{ store.balance.toLocaleString() }}</span>
        <span class="header__balance-label">Available Balance</span>
      </div>
      <button class="btn-register" style="padding:6px 10px;font-size:12px">Deposit</button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { inject } from "vue";
import { useAppStore } from "@/stores/app";

const store = useAppStore();
const openLogin  = inject<() => void>("openLogin",  () => {});
const openRegister = inject<() => void>("openRegister", () => {});
</script>

<style scoped>
/* Desktop header extras — hidden on mobile */
.header__dt-stats {
  display: none;
}

@media (min-width: 1024px) {
  .header__dt-stats {
    display: flex;
    align-items: center;
    gap: 6px;
    flex: 1;
    justify-content: center;
  }
  .header__dt-stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 8px;
  }
  .header__dt-stat-val {
    font-size: 11px;
    font-weight: 900;
    color: #ffe60f;
    line-height: 1.1;
  }
  .header__dt-stat-val.live {
    color: #ff6b6b;
    animation: pulse-live 1.5s infinite;
  }
  @keyframes pulse-live {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
  }
  .header__dt-stat-lbl {
    font-size: 7px;
    color: rgba(255,255,255,0.7);
    font-weight: 600;
    letter-spacing: .3px;
    text-transform: uppercase;
  }
  .header__dt-stat-sep {
    width: 1px;
    height: 16px;
    background: rgba(255,255,255,0.2);
  }
}
</style>
