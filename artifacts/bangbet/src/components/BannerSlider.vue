<template>
  <div class="banner-slider" @touchstart="onTouchStart" @touchend="onTouchEnd">
    <div class="banner-track" :style="{ transform: `translateX(-${current * 100}%)` }">
      <div v-for="banner in banners" :key="banner.id" class="banner-slide">
        <RouterLink :to="banner.link">
          <img :src="banner.image" :alt="`Banner ${banner.id}`" />
        </RouterLink>
      </div>
    </div>
    <div class="banner-dots">
      <div
        v-for="(_, i) in banners"
        :key="i"
        class="banner-dot"
        :class="{ active: current === i }"
        @click="current = i"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { banners } from "@/stores/mockData";

const current = ref(0);
let timer: ReturnType<typeof setInterval>;
let touchStartX = 0;

onMounted(() => {
  timer = setInterval(() => {
    current.value = (current.value + 1) % banners.length;
  }, 3500);
});

onUnmounted(() => clearInterval(timer));

function onTouchStart(e: TouchEvent) {
  touchStartX = e.touches[0].clientX;
}

function onTouchEnd(e: TouchEvent) {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 40) {
    if (diff > 0) current.value = (current.value + 1) % banners.length;
    else current.value = (current.value - 1 + banners.length) % banners.length;
  }
}
</script>
