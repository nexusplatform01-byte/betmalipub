import { defineStore } from "pinia";
import { ref } from "vue";
import { sportsMenu, liveMatches, topMatches, promotions } from "./mockData";

export const useAppStore = defineStore("app", () => {
  const isLoggedIn = ref(false);
  const balance = ref(0);
  const currency = ref("UGX");
  const country = ref("ug");
  const betslip = ref<BetItem[]>([]);
  const activeSport = ref("Football");

  interface BetItem {
    matchId: string;
    baseMatchId: string;
    team: string;
    odds: number;
    market: string;
  }

  function login(phone: string) {
    isLoggedIn.value = true;
    balance.value = 50000;
    console.log("Logged in:", phone);
  }

  function logout() {
    isLoggedIn.value = false;
    balance.value = 0;
    betslip.value = [];
  }

  function addToBetslip(item: BetItem) {
    const sameSelection = betslip.value.findIndex((b) => b.matchId === item.matchId);
    if (sameSelection !== -1) {
      // tapping the same odd again → deselect
      betslip.value.splice(sameSelection, 1);
    } else {
      // remove any other odd already selected for this match, then add new one
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
    betslip,
    activeSport,
    sportsMenu,
    liveMatches,
    topMatches,
    promotions,
    login,
    logout,
    addToBetslip,
  };
});
