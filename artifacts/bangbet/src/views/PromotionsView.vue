<template>
  <div class="page">
    <AppHeader />
    <div class="page-title-bar">
      <button class="back-btn" @click="$router.back()">←</button>
      <span class="page-title">🎁 Promotions</span>
    </div>

    <!-- Filter tabs -->
    <div class="tab-bar">
      <button
        v-for="tab in tabs" :key="tab"
        class="tab-btn"
        :class="{ active: activeTab === tab }"
        @click="activeTab = tab"
      >{{ tab }}</button>
    </div>

    <!-- Hero banner -->
    <div class="promo-hero">
      <div class="promo-hero__content">
        <div class="promo-hero__tag">WELCOME OFFER</div>
        <div class="promo-hero__title">Get 200% on First Deposit</div>
        <div class="promo-hero__sub">Up to UGX 500,000 bonus · T&Cs apply</div>
        <button class="promo-hero__btn">Claim Now</button>
      </div>
      <div class="promo-hero__badge">🎁</div>
    </div>

    <!-- Promo grid -->
    <div class="promo-grid-wrap">
      <div class="promo-grid">
        <div v-for="promo in filteredPromos" :key="promo.id" class="promo-card">
          <div class="promo-card__img-wrap">
            <img :src="promo.image" :alt="promo.title" class="promo-card__img" />
            <span class="promo-card__tag" :class="`promo-card__tag--${promo.tagColor}`">{{ promo.tag }}</span>
          </div>
          <div class="promo-card__body">
            <h3 class="promo-card__title">{{ promo.title }}</h3>
            <p class="promo-card__desc">{{ promo.description }}</p>
            <div class="promo-card__footer">
              <span class="promo-card__expire">{{ promo.expires }}</span>
              <button class="promo-card__btn">Claim</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom info strip -->
    <div class="promo-info-strip">
      <div class="promo-info-item">
        <span class="promo-info-item__icon">💬</span>
        <span>Need help? Live chat available 24/7</span>
      </div>
      <div class="promo-info-item">
        <span class="promo-info-item__icon">📜</span>
        <span>All promotions subject to Terms & Conditions</span>
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

const tabs = ["All", "Sports", "Casino", "FreeBet", "Jackpot"];
const activeTab = ref("All");

interface Promo {
  id: number;
  title: string;
  description: string;
  image: string;
  tag: string;
  tagColor: string;
  category: string;
  expires: string;
}

const promos: Promo[] = [
  {
    id: 1,
    title: "200% Welcome Bonus",
    description: "200% bonus on your first deposit up to UGX 500,000. Play more, win more!",
    image: "/images/activity/CBpeWGUtsXzPJLy.jpg",
    tag: "NEW",
    tagColor: "green",
    category: "Sports",
    expires: "Ongoing",
  },
  {
    id: 2,
    title: "World Cup 2026 Special",
    description: "Bet on every World Cup 2026 match and earn exclusive prizes and bonuses.",
    image: "/images/activity/GSQbOIkdpYrchdo.jpg",
    tag: "HOT",
    tagColor: "red",
    category: "Sports",
    expires: "Until 19 Jul 2026",
  },
  {
    id: 3,
    title: "Weekly FreeBet",
    description: "Get a FREE BET every week when you wager UGX 5,000 or more on any sport.",
    image: "/images/activity/YwYzNXWqvuOZhVi.jpg",
    tag: "FREEBET",
    tagColor: "purple",
    category: "FreeBet",
    expires: "Every week",
  },
  {
    id: 4,
    title: "Sports Jackpot",
    description: "Predict all 12 matches correctly and take home the jackpot prize pool!",
    image: "/images/activity/ODJrAsrWagzljjh.jpg",
    tag: "JACKPOT",
    tagColor: "gold",
    category: "Jackpot",
    expires: "Weekly draw",
  },
  {
    id: 5,
    title: "Casino Welcome Package",
    description: "Get 50 free spins on your first casino deposit. No wagering on winnings!",
    image: "/images/activity/CBpeWGUtsXzPJLy.jpg",
    tag: "CASINO",
    tagColor: "blue",
    category: "Casino",
    expires: "Ongoing",
  },
  {
    id: 6,
    title: "Referral Bonus",
    description: "Refer a friend and earn UGX 10,000 when they make their first deposit.",
    image: "/images/activity/GSQbOIkdpYrchdo.jpg",
    tag: "REFER",
    tagColor: "green",
    category: "Sports",
    expires: "Ongoing",
  },
  {
    id: 7,
    title: "Acca Boost",
    description: "Get up to 500% bonus on your accumulator bets with 2+ selections.",
    image: "/images/activity/ODJrAsrWagzljjh.jpg",
    tag: "BOOST",
    tagColor: "red",
    category: "Sports",
    expires: "Ongoing",
  },
  {
    id: 8,
    title: "Cashback Monday",
    description: "Get 10% cashback on all losing bets placed over the weekend.",
    image: "/images/activity/YwYzNXWqvuOZhVi.jpg",
    tag: "CASHBACK",
    tagColor: "purple",
    category: "Sports",
    expires: "Every Monday",
  },
];

const filteredPromos = computed(() =>
  activeTab.value === "All" ? promos : promos.filter(p => p.category === activeTab.value)
);
</script>

<style scoped>
/* ─── Hero banner ────────────────────────────────────────── */
.promo-hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 10px 10px 4px;
  padding: 18px 16px;
  background: linear-gradient(135deg, #c026d3 0%, #6d28d9 100%);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(192,38,211,.3);
}
.promo-hero__content { flex: 1; }
.promo-hero__tag {
  display: inline-block;
  font-size: 9px; font-weight: 900; letter-spacing: .8px;
  background: #ffe60f; color: #292a33;
  border-radius: 10px; padding: 2px 8px; margin-bottom: 6px;
}
.promo-hero__title { font-size: 18px; font-weight: 900; color: #fff; margin-bottom: 4px; line-height: 1.2; }
.promo-hero__sub   { font-size: 10px; color: rgba(255,255,255,.7); margin-bottom: 10px; }
.promo-hero__btn {
  background: #ffe60f; color: #292a33; border: none;
  padding: 8px 18px; border-radius: 20px;
  font-size: 12px; font-weight: 800; cursor: pointer;
}
.promo-hero__badge { font-size: 52px; opacity: .2; flex-shrink: 0; }

/* ─── Promo grid ─────────────────────────────────────────── */
.promo-grid-wrap { padding: 6px 10px 10px; }
.promo-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
}

/* ─── Promo card ─────────────────────────────────────────── */
.promo-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,.08);
}
.promo-card__img-wrap { position: relative; }
.promo-card__img { width: 100%; height: 140px; object-fit: cover; display: block; }
.promo-card__tag {
  position: absolute; top: 8px; left: 8px;
  font-size: 9px; font-weight: 900; letter-spacing: .5px;
  border-radius: 10px; padding: 3px 10px; color: #fff;
}
.promo-card__tag--green  { background: #10a310; }
.promo-card__tag--red    { background: #ff4c4c; }
.promo-card__tag--purple { background: #c026d3; }
.promo-card__tag--gold   { background: linear-gradient(90deg,#ffd700,#c87800); color: #3d1800; }
.promo-card__tag--blue   { background: #2563eb; }

.promo-card__body { padding: 12px 14px; }
.promo-card__title { font-size: 14px; font-weight: 800; color: #292a33; margin-bottom: 5px; }
.promo-card__desc  { font-size: 12px; color: #6a6f7a; line-height: 1.5; margin-bottom: 10px; }
.promo-card__footer { display: flex; align-items: center; justify-content: space-between; }
.promo-card__expire { font-size: 10px; color: #9599a4; }
.promo-card__btn {
  background: var(--bg-header);
  background: linear-gradient(90deg, #c026d3, #a21caf);
  color: #fff; border: none;
  padding: 8px 18px; border-radius: 20px;
  font-size: 12px; font-weight: 700; cursor: pointer;
}

/* ─── Info strip ─────────────────────────────────────────── */
.promo-info-strip {
  padding: 10px 14px 8px;
  background: #fff;
  border-top: 1px solid #ebebeb;
  display: flex; flex-direction: column; gap: 6px;
}
.promo-info-item {
  display: flex; align-items: center; gap: 6px;
  font-size: 11px; color: #9599a4;
}
.promo-info-item__icon { font-size: 14px; }

/* ─── Desktop layout ─────────────────────────────────────── */
@media (min-width: 1024px) {
  .promo-hero {
    max-width: 1100px;
    margin: 12px auto 6px;
    padding: 24px 28px;
  }
  .promo-hero__title { font-size: 24px; }
  .promo-hero__badge { font-size: 72px; opacity: .15; }

  .promo-grid-wrap { max-width: 1100px; margin: 0 auto; padding: 8px 16px 16px; }

  .promo-grid { grid-template-columns: repeat(2, 1fr); gap: 14px; }

  .promo-card__img { height: 180px; }

  .promo-info-strip {
    max-width: 1100px;
    margin: 0 auto;
    flex-direction: row;
    justify-content: space-between;
  }
}

@media (min-width: 1400px) {
  .promo-grid { grid-template-columns: repeat(3, 1fr); }
}
</style>
