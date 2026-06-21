<template>
  <div class="page">
    <AppHeader />
    <div class="page-title-bar">
      <span class="page-title">🎁 Promotions</span>
    </div>

    <div class="tab-bar">
      <button
        v-for="tab in tabs"
        :key="tab"
        class="tab-btn"
        :class="{ active: activeTab === tab }"
        @click="activeTab = tab"
      >{{ tab }}</button>
    </div>

    <div style="padding:10px;background:var(--bg-main);">
      <div v-for="promo in store.promotions" :key="promo.id" class="promo-card">
        <img :src="promo.image" :alt="promo.title" class="promo-card__img" />
        <div class="promo-card__body">
          <span class="promo-card__tag">{{ promo.tag }}</span>
          <h3 class="promo-card__title">{{ promo.title }}</h3>
          <p class="promo-card__desc">{{ promo.description }}</p>
          <button style="background:var(--accent);color:#000;border:none;padding:10px;border-radius:5px;font-size:13px;font-weight:700;cursor:pointer;width:100%;margin-top:10px;">
            Claim Offer
          </button>
        </div>
      </div>
    </div>

    <BottomNav />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import AppHeader from "@/components/AppHeader.vue";
import BottomNav from "@/components/BottomNav.vue";
import { useAppStore } from "@/stores/app";

const store = useAppStore();
const tabs = ["All", "Sports", "Casino", "FreeBet", "Jackpot"];
const activeTab = ref("All");
</script>
