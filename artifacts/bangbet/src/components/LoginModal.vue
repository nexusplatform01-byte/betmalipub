<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal" style="position:relative">
      <button class="modal__close" @click="$emit('close')">✕</button>
      <img src="/static/images/Img_Logo_Yellow_66.png" alt="Bangbet" class="modal__logo" />
      <h2 class="modal__title">Welcome Back</h2>
      <div class="form-group">
        <label class="form-label">Phone Number</label>
        <input v-model="phone" class="form-input" type="tel" placeholder="07XXXXXXXXX" />
      </div>
      <div class="form-group">
        <label class="form-label">Password</label>
        <input v-model="password" class="form-input" type="password" placeholder="Enter password" />
      </div>
      <button class="btn-full" @click="doLogin">Login</button>
      <div class="modal__switch">
        Don't have an account? <a @click="$emit('switch')">Register Now</a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAppStore } from "@/stores/app";

const emit = defineEmits(["close", "switch"]);
const store = useAppStore();
const phone = ref("");
const password = ref("");

function doLogin() {
  if (phone.value.length >= 10) {
    store.login(phone.value);
    emit("close");
  }
}
</script>
