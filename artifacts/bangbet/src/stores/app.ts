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
    const exists = betslip.value.findIndex((b) => b.matchId === item.matchId);
    if (exists !== -1) {
      betslip.value.splice(exists, 1);
    } else {
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
