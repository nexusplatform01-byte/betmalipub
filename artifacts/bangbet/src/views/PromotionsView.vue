<template>
  <div class="page">
    <AppHeader />
    <div class="page-title-bar">
      <span class="page-title">🎁 Promotions</span>
    </div>

    <div style="padding: 12px 10px 4px; display:flex; gap:8px; overflow-x:auto;">
      <button
        v-for="tab in tabs"
        :key="tab"
        :style="{ background: activeTab === tab ? 'var(--accent)' : 'var(--bg-card)', color: activeTab === tab ? '#000' : 'var(--text-secondary)', border: '1px solid ' + (activeTab === tab ? 'var(--accent)' : 'var(--border)'), borderRadius: '20px', padding: '6px 14px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', flexShrink: '0' }"
        @click="activeTab = tab"
      >{{ tab }}</button>
    </div>

    <div style="padding: 10px;">
      <div v-for="promo in store.promotions" :key="promo.id" style="background:var(--bg-card); border-radius:10px; overflow:hidden; margin-bottom:12px; border:1px solid var(--border);">
        <img :src="promo.image" :alt="promo.title" style="width:100%; height:140px; object-fit:cover; display:block;" />
        <div style="padding:12px 14px;">
          <span style="background:var(--accent); color:#000; font-size:10px; font-weight:700; padding:2px 6px; border-radius:3px;">{{ promo.tag }}</span>
          <h3 style="font-size:15px; font-weight:700; margin-top:8px; margin-bottom:4px;">{{ promo.title }}</h3>
          <p style="font-size:12px; color:var(--text-secondary); line-height:1.5; margin-bottom:12px;">{{ promo.description }}</p>
          <button style="background:var(--accent); color:#000; border:none; padding:10px 20px; border-radius:6px; font-size:13px; font-weight:700; cursor:pointer; width:100%;">
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
