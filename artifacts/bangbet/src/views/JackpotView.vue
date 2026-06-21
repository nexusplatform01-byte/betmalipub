<template>
  <div class="page">
    <AppHeader />
    <div class="page-title-bar">
      <button class="back-btn" @click="$router.back()">←</button>
      <span class="page-title">🏆 Sports Jackpot</span>
    </div>

    <div class="jackpot-banner">
      <div class="jackpot-label">Current Jackpot Prize</div>
      <div class="jackpot-amount">UGX 6,600,000</div>
      <div style="font-size:12px; color:var(--text-muted); margin-top:8px;">Predict 12 correct scores to win!</div>
    </div>

    <div style="padding:10px 10px 0;">
      <img src="/static/img/Bg_SportsJackpot_Up_36.b6e66f7.png" alt="Jackpot" style="width:100%; border-radius:8px; display:block; margin-bottom:10px;" />
    </div>

    <div class="section">
      <div class="section-header">
        <div class="section-title">📅 Jackpot Matches</div>
      </div>
      <MatchCard v-for="match in store.topMatches.slice(0, 6)" :key="match.id" :match="match" />
    </div>

    <div style="padding:0 10px 16px;">
      <button class="btn-full">Place Jackpot Bet</button>
    </div>

    <BottomNav />
  </div>
</template>

<script setup lang="ts">
import AppHeader from "@/components/AppHeader.vue";
import BottomNav from "@/components/BottomNav.vue";
import MatchCard from "@/components/MatchCard.vue";
import { useAppStore } from "@/stores/app";

const store = useAppStore();
</script>
