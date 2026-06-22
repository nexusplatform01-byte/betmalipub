<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal" style="position:relative">
      <button class="modal__close" @click="$emit('close')">✕</button>
      <img :src="'/static/images/Img_Logo_Yellow_66.png'" alt="Bangbet" class="modal__logo" />
      <h2 class="modal__title">Create Account</h2>
      <div class="form-group">
        <label class="form-label">Phone Number</label>
        <input v-model="phone" class="form-input" type="tel" placeholder="07XXXXXXXXX" />
      </div>
      <div class="form-group">
        <label class="form-label">Password</label>
        <input v-model="password" class="form-input" type="password" placeholder="Create password" />
      </div>
      <div class="form-group">
        <label class="form-label">Promo Code (Optional)</label>
        <input v-model="promoCode" class="form-input" type="text" placeholder="Enter promo code" />
      </div>
      <button class="btn-full" @click="doRegister">Register</button>
      <div class="modal__switch">
        Already have an account? <a @click="$emit('switch')">Login</a>
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
const promoCode = ref("");

function doRegister() {
  if (phone.value.length >= 10 && password.value.length >= 6) {
    store.login(phone.value);
    emit("close");
  }
}
</script>
