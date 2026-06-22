<template>
  <div class="cn-overlay" @click.self="$emit('close')">
    <div class="cn-modal">
      <button class="cn-close" @click="$emit('close')">✕</button>
      <img :src="'/static/images/Img_Logo_Yellow_66.png'" alt="Bangbet" class="cn-logo" />
      <h2 class="cn-title">Welcome Back</h2>
      <p class="cn-sub">Sign in to your account</p>

      <div class="cn-group">
        <label class="cn-label">Phone Number</label>
        <input v-model="phone" class="cn-input" type="tel" placeholder="07XXXXXXXXX" />
      </div>
      <div class="cn-group">
        <label class="cn-label">Password</label>
        <input v-model="password" class="cn-input" type="password" placeholder="Enter password" />
      </div>

      <button class="cn-btn-primary" @click="doLogin">Login</button>

      <div class="cn-divider"><span>or</span></div>

      <button class="cn-btn-google" @click="doGoogleLogin">
        <svg width="16" height="16" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
        Continue with Google
      </button>

      <div class="cn-switch">
        No account? <a @click="$emit('switch')">Register</a>
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
function doGoogleLogin() {
  store.login("google_user", "Google User");
  emit("close");
}
</script>

<style scoped>
.cn-overlay {
  position: fixed;
  inset: 0;
  background: rgba(60,35,15,0.45);
  z-index: 300;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(6px);
  padding: 16px;
}
.cn-modal {
  background: #FFFAF4;
  border-radius: 16px;
  width: 100%;
  max-width: 300px;
  padding: 20px 18px 18px;
  box-shadow: 0 8px 32px rgba(100,60,20,0.18);
  border: 1px solid #EDD9C0;
  position: relative;
}
.cn-close {
  position: absolute;
  top: 10px; right: 10px;
  background: #F0E4D4;
  border: none;
  color: #8B6548;
  font-size: 12px;
  width: 22px; height: 22px;
  border-radius: 50%;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
}
.cn-close:hover { background: #E2CEB4; }
.cn-logo { display: block; height: 22px; margin: 0 auto 10px; }
.cn-title { font-size: 15px; font-weight: 700; text-align: center; color: #3D2010; margin-bottom: 2px; }
.cn-sub { font-size: 11px; color: #9A7A60; text-align: center; margin-bottom: 14px; }
.cn-group { margin-bottom: 8px; }
.cn-label { font-size: 10px; font-weight: 600; color: #8B6548; display: block; margin-bottom: 3px; letter-spacing: 0.3px; text-transform: uppercase; }
.cn-input {
  width: 100%;
  background: #FFF5EC;
  border: 1.5px solid #E8D4BC;
  border-radius: 8px;
  padding: 8px 10px;
  color: #3D2010;
  font-size: 13px;
  outline: none;
  transition: border-color 0.2s;
}
.cn-input:focus { border-color: #C8956C; }
.cn-input::placeholder { color: #C4A882; }
.cn-btn-primary {
  width: 100%;
  background: linear-gradient(135deg, #d946ef, #a21caf);
  color: #fff;
  border: none;
  padding: 9px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 6px;
  box-shadow: 0 2px 10px rgba(162,28,175,0.28);
}
.cn-btn-primary:active { opacity: 0.87; }
.cn-divider {
  display: flex; align-items: center; gap: 8px;
  margin: 10px 0 8px;
  color: #C4A882; font-size: 10px;
}
.cn-divider::before, .cn-divider::after { content: ''; flex: 1; height: 1px; background: #E8D4BC; }
.cn-btn-google {
  width: 100%;
  background: #fff;
  border: 1.5px solid #E8D4BC;
  border-radius: 8px;
  padding: 8px;
  font-size: 12px;
  font-weight: 600;
  color: #3D2010;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 7px;
  transition: background 0.15s;
}
.cn-btn-google:hover { background: #FFF5EC; border-color: #C8956C; }
.cn-switch { text-align: center; margin-top: 12px; font-size: 11px; color: #9A7A60; }
.cn-switch a { color: #d946ef; cursor: pointer; font-weight: 700; }
</style>
