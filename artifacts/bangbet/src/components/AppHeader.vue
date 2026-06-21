<template>
  <header class="header">
    <img src="/static/images/Img_Logo_Yellow_66.png" alt="Bangbet" class="header__logo" />
    <div class="header__actions" v-if="!store.isLoggedIn">
      <button class="btn-login" @click="openLogin">Login</button>
      <button class="btn-register" @click="openRegister">Register</button>
    </div>
    <div class="header__actions" v-else>
      <div class="header__balance">
        <span class="header__balance-amount">{{ store.currency }} {{ store.balance.toLocaleString() }}</span>
        <span class="header__balance-label">Available Balance</span>
      </div>
      <button class="btn-register" style="padding: 6px 10px; font-size: 12px;">Deposit</button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { inject } from "vue";
import { useAppStore } from "@/stores/app";

const store = useAppStore();
const openLogin = inject<() => void>("openLogin", () => {});
const openRegister = inject<() => void>("openRegister", () => {});
</script>
