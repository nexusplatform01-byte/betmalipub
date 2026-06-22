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

  interface PlacedBet {
    id: string;
    date: string;
    selections: { team: string; market: string; odds: number }[];
    stake: number;
    totalOdds: number;
    potentialWin: number;
    status: "pending" | "won" | "lost";
  }

  const myBets = ref<PlacedBet[]>([]);

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

  function saveBet(selections: BetItem[], stake: number, totalOdds: number) {
    myBets.value.unshift({
      id: `bet_${Date.now()}`,
      date: new Date().toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }),
      selections: selections.map((s) => ({ team: s.team, market: s.market, odds: s.odds })),
      stake,
      totalOdds: Number(totalOdds.toFixed(2)),
      potentialWin: Math.round(stake * totalOdds),
      status: "pending",
    });
  }

  return {
    isLoggedIn,
    balance,
    currency,
    country,
    userName,
    betslip,
    activeSport,
    myBets,
    sportsMenu,
    liveMatches,
    topMatches,
    promotions,
    login,
    logout,
    deposit,
    withdraw,
    addToBetslip,
    saveBet,
  };
});
