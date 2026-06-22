<template>
  <header class="header">
    <img :src="'/static/images/Img_Logo_Yellow_66.png'" alt="Bangbet" class="header__logo" />

    <nav class="header__nav" v-if="!store.isLoggedIn">
      <a class="header__nav-link" href="#">App</a>
      <a class="header__nav-link" href="#">Contact</a>
    </nav>

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
</style>
