import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: "/", name: "home", component: HomeView },
    { path: "/sports/:sport?", name: "sports", component: () => import("@/views/SportsView.vue") },
    { path: "/casino", name: "casino", component: () => import("@/views/CasinoView.vue") },
    { path: "/promotions", name: "promotions", component: () => import("@/views/PromotionsView.vue") },
    { path: "/account", name: "account", component: () => import("@/views/AccountView.vue") },
    { path: "/jackpot", name: "jackpot", component: () => import("@/views/JackpotView.vue") },
    { path: "/match/:id", name: "match", component: () => import("@/views/MatchDetailView.vue") },
    { path: "/profile", name: "profile", component: () => import("@/views/UserProfileView.vue") },
  ],
  scrollBehavior: () => ({ top: 0 }),
});

export default router;
