<template>
  <div class="page">
    <AppHeader />
    <div class="page-title-bar">
      <span class="page-title">🎰 Casino</span>
    </div>

    <div style="padding: 12px 10px 4px; display:flex; gap:8px; overflow-x:auto;">
      <button
        v-for="tab in tabs"
        :key="tab"
        :style="{ background: activeTab === tab ? 'var(--accent)' : 'var(--bg-card)', color: activeTab === tab ? '#000' : 'var(--text-secondary)', border: '1px solid ' + (activeTab === tab ? 'var(--accent)' : 'var(--border)'), borderRadius: '20px', padding: '6px 14px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', flexShrink: '0' }"
        @click="activeTab = tab"
      >{{ tab }}</button>
    </div>

    <div class="casino-grid">
      <div v-for="game in filteredGames" :key="game.id" class="casino-card">
        <div class="casino-card__img">{{ game.emoji }}</div>
        <div class="casino-card__name">{{ game.name }}</div>
      </div>
    </div>

    <BottomNav />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import AppHeader from "@/components/AppHeader.vue";
import BottomNav from "@/components/BottomNav.vue";

const tabs = ["All", "Slots", "Live Casino", "Table Games", "Crash"];
const activeTab = ref("All");

const games = [
  { id: 1, name: "Aviator", emoji: "✈️", category: "Crash" },
  { id: 2, name: "Lucky777", emoji: "🎰", category: "Slots" },
  { id: 3, name: "Roulette", emoji: "🎡", category: "Table Games" },
  { id: 4, name: "Blackjack", emoji: "🃏", category: "Table Games" },
  { id: 5, name: "Baccarat", emoji: "🀄", category: "Live Casino" },
  { id: 6, name: "Sweet Bonanza", emoji: "🍭", category: "Slots" },
  { id: 7, name: "Gates of Olympus", emoji: "⚡", category: "Slots" },
  { id: 8, name: "Big Bass Bonanza", emoji: "🎣", category: "Slots" },
  { id: 9, name: "Crazy Time", emoji: "🎊", category: "Live Casino" },
  { id: 10, name: "Mines", emoji: "💣", category: "Crash" },
  { id: 11, name: "Plinko", emoji: "🎯", category: "Crash" },
  { id: 12, name: "Dragon Tiger", emoji: "🐉", category: "Live Casino" },
  { id: 13, name: "Book of Ra", emoji: "📖", category: "Slots" },
  { id: 14, name: "Wolf Gold", emoji: "🐺", category: "Slots" },
  { id: 15, name: "Live Roulette", emoji: "🎲", category: "Live Casino" },
];

const filteredGames = computed(() =>
  activeTab.value === "All" ? games : games.filter((g) => g.category === activeTab.value)
);
</script>
