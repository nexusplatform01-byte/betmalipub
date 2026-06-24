import { defineStore } from "pinia";
import { ref } from "vue";
import { sportsMenu, promotions } from "./mockData";
import {
  fetchLiveEvents,
  fetchHighlightMatches,
  fetchAllSports,
  fetchBoostedMatches,
  type Match,
  type SportCategory,
} from "@/services/topbetApi";

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

  const liveMatches = ref<Match[]>([]);
  const topMatches = ref<Match[]>([]);
  const boostedMatches = ref<Match[]>([]);
  const sports = ref<SportCategory[]>([]);
  const liveSportsData = ref<any[]>([]);
  const liveLoading = ref(false);
  const topLoading = ref(false);
  const topLoadingMore = ref(false);
  const topMatchesPage = ref(1);
  const topMatchesLastPage = ref(1);
  const topMatchesHasMore = ref(false);
  const boostedLoading = ref(false);
  const sportsLoading = ref(false);

  let liveTimer: ReturnType<typeof setInterval> | null = null;

  async function loadLiveMatches() {
    liveLoading.value = true;
    try {
      const { liveSports, matches } = await fetchLiveEvents();
      liveMatches.value = matches;
      liveSportsData.value = liveSports;
    } catch (e) {
      console.error("[Bangbet] live fetch error:", e);
    } finally {
      liveLoading.value = false;
    }
  }

  function hasAllOdds(m: Match): boolean {
    return m.markets.home > 0 &&
      m.markets.draw != null && m.markets.draw > 0 &&
      m.markets.away > 0;
  }

  async function loadTopMatches() {
    topLoading.value = true;
    topMatchesPage.value = 1;
    try {
      const result = await fetchHighlightMatches(1, 50);
      topMatches.value = result.data.filter(hasAllOdds);
      topMatchesLastPage.value = result.lastPage;
      topMatchesHasMore.value = result.lastPage > 1;
    } catch (e) {
      console.error("[Bangbet] top matches fetch error:", e);
    } finally {
      topLoading.value = false;
    }
  }

  async function loadMoreTopMatches() {
    if (topLoadingMore.value || !topMatchesHasMore.value) return;
    const nextPage = topMatchesPage.value + 1;
    if (nextPage > topMatchesLastPage.value) { topMatchesHasMore.value = false; return; }
    topLoadingMore.value = true;
    try {
      const result = await fetchHighlightMatches(nextPage, 50);
      topMatches.value = [...topMatches.value, ...result.data.filter(hasAllOdds)];
      topMatchesPage.value = nextPage;
      topMatchesHasMore.value = nextPage < result.lastPage;
    } catch (e) {
      console.error("[Bangbet] load more top matches error:", e);
    } finally {
      topLoadingMore.value = false;
    }
  }

  async function loadBoostedMatches() {
    boostedLoading.value = true;
    try {
      boostedMatches.value = await fetchBoostedMatches();
    } catch (e) {
      console.error("[Bangbet] boosted matches fetch error:", e);
    } finally {
      boostedLoading.value = false;
    }
  }

  async function loadSports() {
    sportsLoading.value = true;
    try {
      sports.value = await fetchAllSports();
    } catch (e) {
      console.error("[Bangbet] sports fetch error:", e);
    } finally {
      sportsLoading.value = false;
    }
  }

  function startLiveRefresh() {
    if (liveTimer) return;
    liveTimer = setInterval(loadLiveMatches, 30_000);
  }

  loadBoostedMatches();
  loadLiveMatches();
  loadTopMatches();
  loadSports();
  startLiveRefresh();

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
    const same = betslip.value.findIndex((b) => b.matchId === item.matchId);
    if (same !== -1) {
      betslip.value.splice(same, 1);
    } else {
      const idx = betslip.value.findIndex((b) => b.baseMatchId === item.baseMatchId);
      if (idx !== -1) betslip.value.splice(idx, 1);
      betslip.value.push(item);
    }
  }

  function saveBet(selections: BetItem[], stake: number, totalOdds: number) {
    myBets.value.unshift({
      id: `bet_${Date.now()}`,
      date: new Date().toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }),
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
    boostedMatches,
    promotions,
    sports,
    liveSportsData,
    liveLoading,
    topLoading,
    boostedLoading,
    sportsLoading,
    login,
    logout,
    deposit,
    withdraw,
    addToBetslip,
    saveBet,
    loadLiveMatches,
    loadTopMatches,
    loadMoreTopMatches,
    loadBoostedMatches,
    loadSports,
    topLoadingMore,
    topMatchesHasMore,
    topMatchesPage,
    topMatchesLastPage,
  };
});
