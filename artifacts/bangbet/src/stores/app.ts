import { defineStore } from "pinia";
import { ref } from "vue";
import { sportsMenu, liveMatches, topMatches, promotions } from "./mockData";

export const useAppStore = defineStore("app", () => {
  const isLoggedIn = ref(false);
  const balance = ref(0);
  const currency = ref("UGX");
  const country = ref("ug");
  const userName = ref("");
  const betslip = ref<BetItem[]>([]);
  const activeSport = ref("Football");

  interface BetItem {
    matchId: string;
    baseMatchId: string;
    team: string;
    odds: number;
    market: string;
  }

  function login(phone: string, name?: string) {
    isLoggedIn.value = true;
    balance.value = 50000;
    userName.value = name || phone;
  }

  function logout() {
    isLoggedIn.value = false;
    balance.value = 0;
    userName.value = "";
    betslip.value = [];
  }

  function deposit(amount: number) {
    balance.value += amount;
  }

  function withdraw(amount: number) {
    if (balance.value >= amount) balance.value -= amount;
  }

  function addToBetslip(item: BetItem) {
    const sameSelection = betslip.value.findIndex((b) => b.matchId === item.matchId);
    if (sameSelection !== -1) {
      betslip.value.splice(sameSelection, 1);
    } else {
      const idx = betslip.value.findIndex((b) => b.baseMatchId === item.baseMatchId);
      if (idx !== -1) betslip.value.splice(idx, 1);
      betslip.value.push(item);
    }
  }

  return {
    isLoggedIn,
    balance,
    currency,
    country,
    userName,
    betslip,
    activeSport,
    sportsMenu,
    liveMatches,
    topMatches,
    promotions,
    login,
    logout,
    deposit,
    withdraw,
    addToBetslip,
  };
});
