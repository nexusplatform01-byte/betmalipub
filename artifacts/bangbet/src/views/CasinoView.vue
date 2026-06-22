<template>
  <div class="page">
    <AppHeader />
    <div class="page-title-bar">
      <button class="back-btn" @click="$router.back()">←</button>
      <span class="page-title">🎰 Casino</span>
    </div>

    <!-- Category filter -->
    <div class="tab-bar">
      <button
        v-for="tab in tabs" :key="tab.id"
        class="tab-btn"
        :class="{ active: activeTab === tab.id }"
        @click="activeTab = tab.id"
      >{{ tab.label }}</button>
    </div>

    <!-- Featured / Top section -->
    <div v-if="activeTab === 'all'" class="cs-featured">
      <div class="cs-featured__hdr">
        <span class="cs-featured__title">🔥 Top Games</span>
      </div>
      <div class="cs-top-grid">
        <div v-for="g in topGames" :key="g.id" class="cs-top-card" :style="{ background: g.gradient }">
          <div class="cs-top-card__emoji">{{ g.emoji }}</div>
          <div class="cs-top-card__name">{{ g.name }}</div>
          <div v-if="g.badge" class="cs-top-card__badge">{{ g.badge }}</div>
          <button class="cs-top-card__play">Play</button>
        </div>
      </div>
    </div>

    <!-- All games grid -->
    <div class="cs-section">
      <div class="cs-section__hdr">
        <span class="cs-section__title">{{ activeTabLabel }}</span>
        <span class="cs-section__count">{{ filteredGames.length }} games</span>
      </div>
      <div class="cs-grid">
        <div v-for="game in filteredGames" :key="game.id" class="cs-card" :style="{ background: game.gradient }">
          <div class="cs-card__emoji">{{ game.emoji }}</div>
          <div class="cs-card__name">{{ game.name }}</div>
          <div v-if="game.badge" class="cs-card__badge">{{ game.badge }}</div>
          <button class="cs-card__play">▶ Play</button>
        </div>
      </div>
    </div>

    <div style="height:70px"></div>
    <BottomNav />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import AppHeader from "@/components/AppHeader.vue";
import BottomNav from "@/components/BottomNav.vue";

const tabs = [
  { id: "all",         label: "All" },
  { id: "Crash",       label: "🚀 Crash" },
  { id: "Slots",       label: "🎰 Slots" },
  { id: "Live Casino", label: "📺 Live" },
  { id: "Table Games", label: "🃏 Table" },
];
const activeTab = ref("all");
const activeTabLabel = computed(() => tabs.find(t => t.id === activeTab.value)?.label ?? "All Games");

interface Game {
  id: number;
  name: string;
  emoji: string;
  category: string;
  gradient: string;
  badge?: string;
}

const games: Game[] = [
  { id: 1,  name: "Aviator",            emoji: "✈️", category: "Crash",       gradient: "linear-gradient(135deg,#b91c1c,#7f1d1d)", badge: "HOT" },
  { id: 2,  name: "JetX",               emoji: "🚀", category: "Crash",       gradient: "linear-gradient(135deg,#1d4ed8,#1e3a8a)", badge: "NEW" },
  { id: 3,  name: "Mines",              emoji: "💣", category: "Crash",       gradient: "linear-gradient(135deg,#166534,#052e16)" },
  { id: 4,  name: "Plinko",             emoji: "🎯", category: "Crash",       gradient: "linear-gradient(135deg,#7c3aed,#4c1d95)" },
  { id: 5,  name: "Lucky777",           emoji: "🎰", category: "Slots",       gradient: "linear-gradient(135deg,#b45309,#78350f)", badge: "HOT" },
  { id: 6,  name: "Sweet Bonanza",      emoji: "🍭", category: "Slots",       gradient: "linear-gradient(135deg,#be185d,#831843)" },
  { id: 7,  name: "Gates of Olympus",   emoji: "⚡", category: "Slots",       gradient: "linear-gradient(135deg,#6d28d9,#3b0764)" },
  { id: 8,  name: "Big Bass Bonanza",   emoji: "🎣", category: "Slots",       gradient: "linear-gradient(135deg,#0369a1,#0c4a6e)" },
  { id: 9,  name: "Wolf Gold",          emoji: "🐺", category: "Slots",       gradient: "linear-gradient(135deg,#1e40af,#172554)" },
  { id: 10, name: "Book of Ra",         emoji: "📖", category: "Slots",       gradient: "linear-gradient(135deg,#92400e,#451a03)" },
  { id: 11, name: "Starburst",          emoji: "⭐", category: "Slots",       gradient: "linear-gradient(135deg,#a16207,#3f2c00)" },
  { id: 12, name: "Gonzo's Quest",      emoji: "🗿", category: "Slots",       gradient: "linear-gradient(135deg,#065f46,#022c22)" },
  { id: 13, name: "Crazy Time",         emoji: "🎊", category: "Live Casino", gradient: "linear-gradient(135deg,#c2410c,#7c2d12)", badge: "LIVE" },
  { id: 14, name: "Baccarat Live",      emoji: "🀄", category: "Live Casino", gradient: "linear-gradient(135deg,#9f1239,#500724)", badge: "LIVE" },
  { id: 15, name: "Dragon Tiger",       emoji: "🐉", category: "Live Casino", gradient: "linear-gradient(135deg,#991b1b,#450a0a)", badge: "LIVE" },
  { id: 16, name: "Live Roulette",      emoji: "🎲", category: "Live Casino", gradient: "linear-gradient(135deg,#064e3b,#022c22)", badge: "LIVE" },
  { id: 17, name: "Football Studio",   emoji: "⚽", category: "Live Casino", gradient: "linear-gradient(135deg,#166534,#052e16)", badge: "NEW" },
  { id: 18, name: "Roulette",           emoji: "🎡", category: "Table Games", gradient: "linear-gradient(135deg,#065f46,#022c22)" },
  { id: 19, name: "Blackjack",          emoji: "🃏", category: "Table Games", gradient: "linear-gradient(135deg,#1e3a8a,#0f2269)" },
  { id: 20, name: "Poker",              emoji: "♠️", category: "Table Games", gradient: "linear-gradient(135deg,#292a33,#111218)" },
];

const topGames = computed(() =>
  games.filter(g => g.badge === "HOT" || g.badge === "LIVE").slice(0, 4)
);

const filteredGames = computed(() =>
  activeTab.value === "all" ? games : games.filter(g => g.category === activeTab.value)
);
</script>

<style scoped>
/* ─── Featured / Top ────────────────────────────────────── */
.cs-featured { padding: 10px 10px 4px; background: var(--bg-main); }
.cs-featured__hdr { display: flex; align-items: center; margin-bottom: 8px; }
.cs-featured__title { font-size: 13px; font-weight: 800; color: #292a33; }

.cs-top-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-bottom: 8px;
}

.cs-top-card {
  border-radius: 12px;
  overflow: hidden;
  padding: 16px 12px 12px;
  display: flex; flex-direction: column;
  align-items: center; gap: 4px;
  position: relative;
  min-height: 120px;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(0,0,0,.2);
  transition: transform .12s;
}
.cs-top-card:active { transform: scale(.97); }
.cs-top-card__emoji { font-size: 34px; }
.cs-top-card__name  { font-size: 12px; font-weight: 800; color: rgba(255,255,255,.9); text-align: center; }
.cs-top-card__badge {
  position: absolute; top: 8px; right: 8px;
  font-size: 7px; font-weight: 900; letter-spacing: .5px;
  background: #ffe60f; color: #292a33;
  border-radius: 8px; padding: 2px 6px;
}
.cs-top-card__play {
  margin-top: 4px;
  background: rgba(255,255,255,.2); color: #fff; border: 1px solid rgba(255,255,255,.3);
  border-radius: 16px; padding: 4px 14px;
  font-size: 11px; font-weight: 700; cursor: pointer;
}

/* ─── Games section ──────────────────────────────────────── */
.cs-section { padding: 8px 10px; background: var(--bg-main); }
.cs-section__hdr { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
.cs-section__title { font-size: 13px; font-weight: 800; color: #292a33; }
.cs-section__count { font-size: 11px; color: #9599a4; }

.cs-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.cs-card {
  border-radius: 10px;
  overflow: hidden;
  padding: 12px 8px 10px;
  display: flex; flex-direction: column;
  align-items: center; gap: 3px;
  position: relative;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,.18);
  transition: transform .12s;
  min-height: 100px;
}
.cs-card:active { transform: scale(.96); }
.cs-card__emoji { font-size: 26px; }
.cs-card__name  { font-size: 10px; font-weight: 700; color: rgba(255,255,255,.85); text-align: center; line-height: 1.2; }
.cs-card__badge {
  position: absolute; top: 5px; right: 5px;
  font-size: 6px; font-weight: 900; letter-spacing: .5px;
  background: #ffe60f; color: #292a33;
  border-radius: 6px; padding: 1px 4px;
}
.cs-card__play {
  margin-top: 4px;
  background: rgba(255,255,255,.15); color: rgba(255,255,255,.85); border: 1px solid rgba(255,255,255,.2);
  border-radius: 12px; padding: 3px 10px;
  font-size: 9px; font-weight: 700; cursor: pointer;
}

/* ─── Desktop grid ───────────────────────────────────────── */
@media (min-width: 1024px) {
  .cs-featured, .cs-section { padding: 14px 24px; }

  .cs-top-grid { grid-template-columns: repeat(4, 1fr); gap: 12px; }
  .cs-top-card { min-height: 160px; padding: 20px 16px 14px; }
  .cs-top-card__emoji { font-size: 44px; }
  .cs-top-card__name  { font-size: 14px; }

  .cs-grid { grid-template-columns: repeat(6, 1fr); gap: 12px; }
  .cs-card  { min-height: 130px; padding: 16px 10px 12px; }
  .cs-card__emoji { font-size: 32px; }
  .cs-card__name  { font-size: 11px; }
}

@media (min-width: 1400px) {
  .cs-grid { grid-template-columns: repeat(8, 1fr); }
  .cs-top-grid { grid-template-columns: repeat(6, 1fr); }
}
</style>
