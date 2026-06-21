<template>
  <div class="app-wrapper">
    <RouterView />
    <LoginModal v-if="showLogin" @close="showLogin = false" @switch="showLogin = false; showRegister = true" />
    <RegisterModal v-if="showRegister" @close="showRegister = false" @switch="showRegister = false; showLogin = true" />
  </div>
</template>

<script setup lang="ts">
import { ref, provide } from "vue";
import LoginModal from "@/components/LoginModal.vue";
import RegisterModal from "@/components/RegisterModal.vue";

const showLogin = ref(false);
const showRegister = ref(false);

provide("openLogin", () => { showLogin.value = true; });
provide("openRegister", () => { showRegister.value = true; });
</script>
