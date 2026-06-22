<template>
  <div class="page">
    <AppHeader />

    <!-- ═══ DESKTOP NAV BAR (hidden on mobile) ═══ -->
    <nav class="dt-topnav">
      <button
        v-for="tab in desktopNavTabs" :key="tab.label"
        class="dt-topnav__tab"
        :class="{ active: tab.label === 'Sportsbook' }"
        @click="tab.route && $router.push(tab.route)"
      >
        <span>{{ tab.icon }}</span> {{ tab.label }}
        <span v-if="tab.badge" class="dt-topnav__badge">{{ tab.badge }}</span>
      </button>
    </nav>

    <!-- ═══ DESKTOP SHELL ═══ -->
    <div class="dt-shell">

      <!-- LEFT SIDEBAR -->
      <aside class="dt-sidebar">
        <div class="dt-sidebar__search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <input placeholder="Search sport or league…" />
        </div>

        <div class="dt-sidebar__section">
          <div class="dt-sidebar__head">🏅 Sports</div>
          <RouterLink
            v-for="s in sidebarSports" :key="s.name"
            :to="s.route"
            class="dt-sidebar__item"
            :class="{ active: s.name === 'Football' }"
          >
            <img :src="s.icon" class="dt-sidebar__item-icon" onerror="this.style.display='none'" />
            <span class="dt-sidebar__item-name">{{ s.name }}</span>
            <span class="dt-sidebar__item-count">{{ s.count }}</span>
          </RouterLink>
        </div>

        <div class="dt-sidebar__section">
          <div class="dt-sidebar__head">🌍 Top Leagues</div>
          <button v-for="l in topLeagues" :key="l.name" class="dt-sidebar__item">
            <span class="dt-sidebar__league-flag">{{ l.flag }}</span>
            <span class="dt-sidebar__item-name">{{ l.name }}</span>
          </button>
        </div>
      </aside>

      <!-- CENTER CONTENT -->
      <main class="dt-center">
        <template v-if="!selectedMatch">
        <div class="dt-banner-wrap"><BannerSlider /></div>
        <SportMenu active-name="Football" />
        <JackpotSection />

        <div class="section">
          <div class="section-header">
            <div class="section-title"><span class="live-dot"></span> Live Now ({{ store.liveMatches.length }})</div>
            <RouterLink to="/sports/Football" class="section-more">See All ›</RouterLink>
          </div>
          <!-- Mobile: card grid -->
          <div class="mob-only">
            <MatchCard v-for="match in store.liveMatches" :key="match.id" :match="match" />
          </div>
          <!-- Desktop: Fortebet-style row table -->
          <div class="dt-match-table dt-only">
            <div class="dtmt__head">
              <div class="dtmt__col-match">Match</div>
              <div class="dtmt__col-odd">1</div>
              <div class="dtmt__col-odd">X</div>
              <div class="dtmt__col-odd">2</div>
              <div class="dtmt__col-odd">1X</div>
              <div class="dtmt__col-odd">X2</div>
              <div class="dtmt__col-odd">12</div>
            </div>
            <div v-for="match in store.liveMatches" :key="match.id" class="dtmt__row" @click="openMatch(match)">
              <div class="dtmt__col-match">
                <div class="dtmt__league">
                  <span class="dtmt__live-badge">Live</span> {{ match.league }}
                </div>
                <div class="dtmt__teams">
                  <span class="dtmt__team-name">{{ match.homeTeam }}</span>
                  <span class="dtmt__score">{{ match.homeScore }}-{{ match.awayScore }}</span>
                  <span class="dtmt__team-name">{{ match.awayTeam }}</span>
                </div>
                <div class="dtmt__time">{{ match.minute }}'</div>
              </div>
              <button class="dtmt__odd-btn" @click.stop="addOdd(match,'1',match.markets.home)">{{ match.markets.home }}</button>
              <button class="dtmt__odd-btn" :class="{ 'dtmt__odd-btn--na': !match.markets.draw }" @click.stop="match.markets.draw && addOdd(match,'X',match.markets.draw)">{{ match.markets.draw ?? '-' }}</button>
              <button class="dtmt__odd-btn" @click.stop="addOdd(match,'2',match.markets.away)">{{ match.markets.away }}</button>
              <button class="dtmt__odd-btn" :class="{ 'dtmt__odd-btn--na': !match.markets.draw }" @click.stop="match.markets.draw && addOdd(match,'1X',dc(match.markets.home,match.markets.draw))">{{ dc(match.markets.home,match.markets.draw) }}</button>
              <button class="dtmt__odd-btn" :class="{ 'dtmt__odd-btn--na': !match.markets.draw }" @click.stop="match.markets.draw && addOdd(match,'X2',dc(match.markets.draw,match.markets.away))">{{ dc(match.markets.draw,match.markets.away) }}</button>
              <button class="dtmt__odd-btn" @click.stop="addOdd(match,'12',dc(match.markets.home,match.markets.away))">{{ dc(match.markets.home,match.markets.away) }}</button>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-header">
            <div class="section-title">⭐ Top Matches</div>
            <RouterLink to="/sports/Football" class="section-more">See All ›</RouterLink>
          </div>
          <!-- Mobile: card grid -->
          <div class="mob-only">
            <MatchCard v-for="match in store.topMatches" :key="match.id" :match="match" />
          </div>
          <!-- Desktop: Fortebet-style row table -->
          <div class="dt-match-table dt-only">
            <div class="dtmt__head">
              <div class="dtmt__col-match">Match</div>
              <div class="dtmt__col-odd">1</div>
              <div class="dtmt__col-odd">X</div>
              <div class="dtmt__col-odd">2</div>
              <div class="dtmt__col-odd">1X</div>
              <div class="dtmt__col-odd">X2</div>
              <div class="dtmt__col-odd">12</div>
            </div>
            <div v-for="match in store.topMatches" :key="match.id" class="dtmt__row" @click="openMatch(match)">
              <div class="dtmt__col-match">
                <div class="dtmt__league">{{ match.league }}</div>
                <div class="dtmt__teams">
                  <span class="dtmt__team-name">{{ match.homeTeam }}</span>
                  <span class="dtmt__vs">vs</span>
                  <span class="dtmt__team-name">{{ match.awayTeam }}</span>
                </div>
                <div class="dtmt__time">{{ match.startTime }}</div>
              </div>
              <button class="dtmt__odd-btn" @click.stop="addOdd(match,'1',match.markets.home)">{{ match.markets.home }}</button>
              <button class="dtmt__odd-btn" :class="{ 'dtmt__odd-btn--na': !match.markets.draw }" @click.stop="match.markets.draw && addOdd(match,'X',match.markets.draw)">{{ match.markets.draw ?? '-' }}</button>
              <button class="dtmt__odd-btn" @click.stop="addOdd(match,'2',match.markets.away)">{{ match.markets.away }}</button>
              <button class="dtmt__odd-btn" :class="{ 'dtmt__odd-btn--na': !match.markets.draw }" @click.stop="match.markets.draw && addOdd(match,'1X',dc(match.markets.home,match.markets.draw))">{{ dc(match.markets.home,match.markets.draw) }}</button>
              <button class="dtmt__odd-btn" :class="{ 'dtmt__odd-btn--na': !match.markets.draw }" @click.stop="match.markets.draw && addOdd(match,'X2',dc(match.markets.draw,match.markets.away))">{{ dc(match.markets.draw,match.markets.away) }}</button>
              <button class="dtmt__odd-btn" @click.stop="addOdd(match,'12',dc(match.markets.home,match.markets.away))">{{ dc(match.markets.home,match.markets.away) }}</button>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-header">
            <div class="section-title">🏆 Sports Jackpot</div>
            <RouterLink to="/jackpot" class="section-more">Play ›</RouterLink>
          </div>
          <div style="margin:0 10px 8px;border-radius:8px;overflow:hidden;cursor:pointer" @click="$router.push('/jackpot')">
            <img :src="'/static/img/Bg_SpotsJP_H5.83a074b.png'" alt="Jackpot" style="width:100%;display:block;border-radius:8px" />
          </div>
        </div>

        <div class="site-footer">
          <img :src="'/static/img/Logo_HomeFooter_Bangbet.db450bf.png'" alt="Bangbet" class="footer-logo" />
          <div class="footer-social">
            <img :src="'/static/img/Icon_Facebook_48.636a718.png'" alt="Facebook" />
            <img :src="'/static/img/Icon_Twitter_48.6ec2c11.png'" alt="Twitter" />
            <img :src="'/static/img/Icon_Instagram_48.bd94330.png'" alt="Instagram" />
            <img :src="'/static/img/Icon_TikTok_48.3ee5e3d.png'" alt="TikTok" />
            <img :src="'/static/img/Icon_LiveHelp_48.deda86e.png'" alt="Live Help" />
          </div>
          <p class="footer-text">Bangbet is licensed and regulated by the National Gaming Board of Uganda.<br/>Gambling is for adults 18+. Please gamble responsibly.</p>
        </div>
        </template>
        <MatchDetailPanel v-else :match="(selectedMatch as any)" @close="selectedMatch = null" />
      </main>

      <!-- RIGHT BETSLIP PANEL -->
      <aside class="dt-right">
        <!-- Betslip widget -->
        <div class="dt-bs">
          <div class="dt-bs__header">
            <button class="dt-bs__tab active">🎟 Bet Slip</button>
            <button class="dt-bs__tab">My Bets</button>
          </div>

          <div v-if="store.betslip.length === 0" class="dt-bs__empty">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="36" height="36"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
            <p>Add events from the list to create a bet slip</p>
          </div>

          <div v-else>
            <div class="dt-bs__items-scroll">
              <div v-for="bet in store.betslip" :key="bet.matchId" class="dt-bs__item">
                <div class="dt-bs__item-left">
                  <div class="dt-bs__item-team">{{ bet.team }}</div>
                  <div class="dt-bs__item-mkt">{{ bet.market }}</div>
                </div>
                <div class="dt-bs__item-right">
                  <span class="dt-bs__item-odds">{{ bet.odds }}</span>
                  <button class="dt-bs__item-del" @click="store.betslip.splice(store.betslip.findIndex(b=>b.matchId===bet.matchId),1)">✕</button>
                </div>
              </div>
            </div>

            <div class="dt-bs__stake-row">
              <label>Stake (UGX)</label>
              <input v-model="stakeAmount" type="number" placeholder="Min 500" />
            </div>
            <div class="dt-bs__summary">
              <div class="dt-bs__summary-row">
                <span>Total Odds</span>
                <strong>{{ totalOdds.toFixed(2) }}</strong>
              </div>
              <div class="dt-bs__summary-row">
                <span>Potential Win</span>
                <strong class="win">UGX {{ potentialWin }}</strong>
              </div>
            </div>
            <button class="dt-bs__place-btn" @click="placeBet">Place Bet</button>
            <button class="dt-bs__clear-btn" @click="store.betslip.splice(0)">Clear All</button>
          </div>
        </div>

        <!-- Promotions widget -->
        <div class="dt-promo">
          <div class="dt-promo__head">🎁 Promotions</div>
          <div class="dt-promo__item" v-for="p in promos" :key="p.title">
            <span class="dt-promo__icon">{{ p.icon }}</span>
            <div>
              <div class="dt-promo__title">{{ p.title }}</div>
              <div class="dt-promo__sub">{{ p.sub }}</div>
            </div>
          </div>
        </div>

        <!-- Live scores widget -->
        <div class="dt-livescores">
          <div class="dt-livescores__head">
            <span class="live-dot"></span> Live Scores
          </div>
          <div v-for="m in store.liveMatches.slice(0,3)" :key="m.id" class="dt-livescores__row" @click="openMatch(m)">
            <div class="dt-livescores__teams">
              <span>{{ m.homeTeam }}</span>
              <span>{{ m.awayTeam }}</span>
            </div>
            <div class="dt-livescores__score">
              <span>{{ m.homeScore }}</span>
              <span>{{ m.awayScore }}</span>
            </div>
            <span class="dt-livescores__min">{{ m.minute }}'</span>
          </div>
        </div>
      </aside>
    </div>

    <!-- ── MOBILE ONLY ── betslip FAB -->
    <div v-if="store.betslip.length" class="betslip-fab mob-only" @click="showBetslip = true">
      <span class="betslip-count">{{ store.betslip.length }}</span>
      <span>Bet</span>
    </div>

    <!-- ── MOBILE ONLY ── betslip modal -->
    <div v-if="showBetslip" class="modal-overlay mob-only" @click.self="showBetslip = false">
      <div class="modal" style="position:relative">
        <button class="modal__close" @click="showBetslip = false">✕</button>
        <h2 class="modal__title">Betslip ({{ store.betslip.length }})</h2>
        <div v-for="bet in store.betslip" :key="bet.matchId" style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--border)">
          <div>
            <div style="font-size:13px;font-weight:600;color:var(--text-dark)">{{ bet.team }}</div>
            <div style="font-size:11px;color:var(--text-grey)">Market: {{ bet.market }}</div>
          </div>
          <span style="font-size:16px;font-weight:700;color:var(--green)">{{ bet.odds }}</span>
        </div>
        <div style="margin-top:14px">
          <div class="form-group">
            <label class="form-label">Stake (UGX)</label>
            <input v-model="stakeAmount" class="form-input" type="number" placeholder="Min 1 UGX" />
          </div>
          <div style="display:flex;justify-content:space-between;margin-bottom:10px;font-size:13px">
            <span style="color:var(--text-grey)">Total Odds:</span>
            <span style="font-weight:700;color:var(--green)">{{ totalOdds.toFixed(2) }}</span>
          </div>
          <div style="display:flex;justify-content:space-between;margin-bottom:14px;font-size:13px">
            <span style="color:var(--text-grey)">Potential Win:</span>
            <span style="font-weight:700;color:#10a310">UGX {{ potentialWin }}</span>
          </div>
          <button class="btn-full" @click="placeBet">Place Bet</button>
        </div>
      </div>
    </div>

    <BottomNav @open-betslip="showBetslip = true" class="mob-only" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from 'vue-router';
import AppHeader from "@/components/AppHeader.vue";
import BottomNav from "@/components/BottomNav.vue";
import SportMenu from "@/components/SportMenu.vue";
import JackpotSection from "@/components/JackpotSection.vue";
import BannerSlider from "@/components/BannerSlider.vue";
import MatchCard from "@/components/MatchCard.vue";
import MatchDetailPanel from "@/components/MatchDetailPanel.vue";
import { useAppStore } from "@/stores/app";

const router = useRouter();
const store = useAppStore();
const showBetslip = ref(false);
const stakeAmount = ref<number | string>(1000);
const selectedMatch = ref<any | null>(null);

function openMatch(match: any) {
  if (window.innerWidth >= 1024) {
    selectedMatch.value = match;
  } else {
    router.push(`/match/${match.id}`);
  }
}

const totalOdds = computed(() => store.betslip.reduce((acc, b) => acc * b.odds, 1));
const potentialWin = computed(() => Math.round(Number(stakeAmount.value || 0) * totalOdds.value).toLocaleString());

function placeBet() {
  alert(`Bet placed! Potential win: UGX ${potentialWin.value}`);
  store.betslip.splice(0);
  showBetslip.value = false;
  stakeAmount.value = 1000;
}

function dc(a: number | null, b: number | null): string {
  if (!a || !b) return '-';
  return (1 / (1/a + 1/b)).toFixed(2);
}
function getOver(m: any): string {
  const base = (m.markets.home + m.markets.away) / 2 * 0.72;
  return Math.max(1.55, Math.min(2.90, base)).toFixed(2);
}
function getUnder(m: any): string {
  const o = parseFloat(getOver(m));
  return Math.max(1.30, Math.min(2.50, (o * 0.9) / (o - 0.9))).toFixed(2);
}
function addOdd(match: any, market: string, odds: number | string) {
  store.addToBetslip({
    matchId: `${match.id}_${market}`,
    baseMatchId: match.id,
    team: `${match.homeTeam} vs ${match.awayTeam}`,
    market,
    odds: parseFloat(String(odds))
  });
}

const desktopNavTabs = [
  { label: 'Sportsbook', icon: '⚽', route: '/' },
  { label: 'Live',       icon: '🔴', route: '/sports/Football', badge: '24' },
  { label: 'Casino',     icon: '🎰', route: '/casino' },
  { label: 'Jackpot',    icon: '🏆', route: '/jackpot' },
  { label: 'Virtuals',   icon: '🎮', route: '/sports/virtuals' },
  { label: 'Statistics', icon: '📊', route: null },
  { label: 'Results',    icon: '📋', route: null },
];

const sidebarSports = [
  { name: 'Football',    icon: '/images/icon/Icon_Football_40.svg',         route: '/sports/Football',   count: 251 },
  { name: 'Basketball',  icon: '/images/icon/Icon_Basketball_40.svg',       route: '/sports/Basketball', count: 18  },
  { name: 'Tennis',      icon: '/images/icon/Icon_Tennis_40.svg',           route: '/sports/Tennis',     count: 47  },
  { name: 'Volleyball',  icon: '/images/icon/Icon_Volleyball_40.svg',       route: '/sports/Volleyball', count: 9   },
  { name: 'Ice Hockey',  icon: '/images/icon/Icon_IceHockey_40.svg',        route: '/sports/Ice Hockey', count: 6   },
  { name: 'Baseball',    icon: '/images/icon/Icon_Baseball_40.svg',         route: '/sports/Baseball',   count: 4   },
  { name: 'Cricket',     icon: '/images/icon/Icon_Cricket_40.svg',          route: '/sports/Cricket',    count: 3   },
];

const topLeagues = [
  { name: 'UEFA Champions League', flag: '🇪🇺' },
  { name: 'Premier League',        flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { name: 'La Liga',               flag: '🇪🇸' },
  { name: 'Serie A',               flag: '🇮🇹' },
  { name: 'Bundesliga',            flag: '🇩🇪' },
  { name: 'Uganda Premier League', flag: '🇺🇬' },
  { name: 'FIFA World Cup',        flag: '🌍' },
];

const promos = [
  { icon: '💰', title: '100% First Deposit',   sub: 'Up to UGX 500,000' },
  { icon: '⚡', title: 'Live Betting Boost',   sub: 'Extra 5% on winnings' },
  { icon: '🏆', title: 'Weekly Jackpot',        sub: 'Win UGX 50,000,000' },
];
</script>

<style scoped>
/* ══════════════════════════════════════════════
   MOBILE / DESKTOP visibility helpers
══════════════════════════════════════════════ */
.dt-only { display: none; }
@media (min-width: 1024px) {
  .mob-only { display: none !important; }
  .dt-only  { display: block; }
}

/* ══════════════════════════════════════════════
   DESKTOP TOP NAV BAR
══════════════════════════════════════════════ */
.dt-topnav {
  display: none;
}
@media (min-width: 1024px) {
  .dt-topnav {
    display: flex;
    align-items: center;
    gap: 2px;
    background: #1e1f28;
    padding: 0 24px;
    border-bottom: 2px solid #c026d3;
  }
  .dt-topnav__tab {
    display: flex; align-items: center; gap: 5px;
    padding: 8px 16px;
    background: none; border: none; cursor: pointer;
    font-size: 13px; font-weight: 600; color: #a0a3b1;
    border-bottom: 2.5px solid transparent;
    margin-bottom: -2px;
    transition: color 0.15s, border-color 0.15s;
    white-space: nowrap;
    position: relative;
  }
  .dt-topnav__tab:hover { color: #fff; }
  .dt-topnav__tab.active { color: #fff; border-bottom-color: #c026d3; }
  .dt-topnav__badge {
    background: #e04040;
    color: #fff;
    font-size: 9px;
    font-weight: 800;
    border-radius: 8px;
    padding: 1px 5px;
    line-height: 1.4;
  }
}

/* ══════════════════════════════════════════════
   DESKTOP SHELL  (3-column grid)
══════════════════════════════════════════════ */
.dt-shell {
  display: block;
}
@media (min-width: 1024px) {
  .dt-shell {
    display: grid;
    grid-template-columns: 180px 1fr 215px;
    gap: 0;
    width: 100%;
    min-height: calc(100vh - 120px);
    align-items: start;
    background: #f2f3f5;
  }
}

/* ══════════════════════════════════════════════
   LEFT SIDEBAR
══════════════════════════════════════════════ */
.dt-sidebar { display: none; }

@media (min-width: 1024px) {
  .dt-sidebar {
    display: flex;
    flex-direction: column;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 1px 6px rgba(0,0,0,.08);
    margin: 10px 0 10px 8px;
    overflow: hidden;
  }
  .dt-sidebar__search {
    display: flex; align-items: center; gap: 8px;
    padding: 10px 12px;
    background: #f5f6f9;
    border-bottom: 1px solid #e6e7eb;
    color: #888;
  }
  .dt-sidebar__search input {
    border: none; background: none; outline: none;
    font-size: 12px; color: #444; width: 100%;
  }
  .dt-sidebar__section { padding: 10px 0; }
  .dt-sidebar__head {
    font-size: 10px; font-weight: 800; color: #9599a4;
    letter-spacing: .8px; padding: 4px 14px 6px;
    text-transform: uppercase;
  }
  .dt-sidebar__item {
    display: flex; align-items: center; gap: 8px;
    padding: 8px 14px;
    background: none; border: none; cursor: pointer;
    font-size: 12.5px; color: #444; width: 100%; text-align: left;
    text-decoration: none;
    transition: background 0.12s;
    border-left: 3px solid transparent;
  }
  .dt-sidebar__item:hover { background: #f5f6f9; }
  .dt-sidebar__item.active,
  .dt-sidebar__item.router-link-active {
    background: rgba(192, 38, 211, 0.07);
    border-left-color: #c026d3;
    color: #c026d3;
    font-weight: 700;
  }
  .dt-sidebar__item-icon {
    width: 18px; height: 18px; object-fit: contain; flex-shrink: 0;
  }
  .dt-sidebar__item-name { flex: 1; }
  .dt-sidebar__item-count {
    font-size: 10px; color: #999; font-weight: 600;
    background: #f0f0f4; border-radius: 8px; padding: 1px 5px;
  }
  .dt-sidebar__league-flag { font-size: 14px; flex-shrink: 0; width: 18px; text-align: center; }
}

/* ══════════════════════════════════════════════
   CENTER COLUMN + FORTEBET MATCH TABLE
══════════════════════════════════════════════ */
.dt-center {
  min-width: 0;
}
@media (min-width: 1024px) {
  .dt-center { background: #f2f3f5; }

  /* ── section cards ── */
  .section {
    margin: 10px 8px 0;
    background: #fff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 1px 6px rgba(0,0,0,.07);
  }
  .section-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 10px 14px 8px;
    border-bottom: 1px solid #f0f0f4;
  }
  .section-title {
    font-size: 13px; font-weight: 800; color: #292a33;
    display: flex; align-items: center; gap: 6px;
  }
  .section-more {
    font-size: 11px; font-weight: 600; color: #c026d3;
    text-decoration: none;
  }
  .section-more:hover { text-decoration: underline; }

  /* ── hero banner soft edges ── */
  .dt-banner-wrap {
    margin: 10px 8px 0;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0,0,0,.12);
  }

  /* ── match table ── */
  .dt-match-table {
    background: #fff;
    border-radius: 8px;
    overflow: hidden;
    margin: 0 0 4px;
    box-shadow: 0 1px 4px rgba(0,0,0,.06);
  }
  .dtmt__head {
    display: grid;
    grid-template-columns: 1fr repeat(6, minmax(60px, 72px));
    background: #f5f6f9;
    border-bottom: 1px solid #e6e7eb;
    padding: 0 4px;
  }
  .dtmt__col-match {
    padding: 6px 10px;
    font-size: 10px; font-weight: 800; color: #9599a4;
    letter-spacing: .5px; text-transform: uppercase;
    min-width: 0; overflow: hidden;
  }
  .dtmt__col-odd {
    padding: 6px 4px;
    font-size: 10px; font-weight: 800; color: #9599a4;
    text-align: center; letter-spacing: .3px;
  }
  .dtmt__row {
    display: grid;
    grid-template-columns: 1fr repeat(6, minmax(60px, 72px));
    border-bottom: 1px solid #f0f0f4;
    cursor: pointer;
    transition: background 0.1s;
    align-items: center;
    padding: 0 4px;
  }
  .dtmt__row:last-child { border-bottom: none; }
  .dtmt__row:hover { background: #fafbfc; }
  .dtmt__col-match { padding: 6px 10px; min-width: 0; overflow: hidden; }
  .dtmt__league {
    font-size: 9px; color: #9599a4; font-weight: 600;
    margin-bottom: 1px; display: flex; align-items: center; gap: 4px;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .dtmt__live-badge {
    background: #e04040; color: #fff;
    font-size: 8px; font-weight: 800; padding: 1px 3px; border-radius: 3px;
    letter-spacing: .5px; flex-shrink: 0;
  }
  .dtmt__teams {
    font-size: 11px; font-weight: 700; color: #1a1b22;
    display: flex; align-items: center; gap: 4px;
    min-width: 0; overflow: hidden;
  }
  .dtmt__team-name {
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    min-width: 0; flex: 1;
    max-width: 42%;
  }
  .dtmt__score {
    background: #c026d3; color: #fff;
    font-size: 9px; font-weight: 800; padding: 1px 4px; border-radius: 4px;
    flex-shrink: 0;
  }
  .dtmt__vs { color: #aaa; font-weight: 400; font-size: 10px; flex-shrink: 0; }
  .dtmt__time { font-size: 9px; color: #9599a4; margin-top: 1px; }

  /* ── real styled odds boxes ── */
  .dtmt__odd-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1px;
    width: calc(100% - 8px);
    min-height: 40px;
    margin: 4px;
    background: #f2f3f5;
    border: 1.5px solid #e6e7eb;
    border-radius: 7px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 800;
    color: #292a33;
    transition: background 0.12s, border-color 0.12s, color 0.12s;
    padding: 3px 2px;
  }
  .dtmt__odd-btn:hover {
    background: rgba(192,38,211,0.08);
    border-color: #c026d3;
    color: #c026d3;
  }
  .dtmt__odd-btn.selected {
    background: rgba(192,38,211,0.1);
    border-color: #c026d3;
    color: #c026d3;
  }
  .dtmt__odd-btn--na {
    color: #b0b3bc;
    background: #f5f6f9;
    border-color: #e6e7eb;
    cursor: default;
    pointer-events: none;
  }
}

/* ══════════════════════════════════════════════
   RIGHT COLUMN
══════════════════════════════════════════════ */
.dt-right { display: none; }

@media (min-width: 1024px) {
  .dt-right {
    display: flex;
    flex-direction: column;
    gap: 10px;
    background: transparent;
    padding: 10px 8px 10px 0;
  }

  /* Betslip panel */
  .dt-bs {
    background: #fff;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 1px 6px rgba(0,0,0,.08);
  }
  .dt-bs__header {
    display: flex;
    border-bottom: 1px solid #e6e7eb;
  }
  .dt-bs__tab {
    flex: 1; padding: 11px 8px;
    background: none; border: none; cursor: pointer;
    font-size: 12px; font-weight: 700; color: #6a6f7a;
    border-bottom: 2.5px solid transparent;
    transition: color 0.15s;
  }
  .dt-bs__tab.active { color: #c026d3; border-bottom-color: #c026d3; }
  .dt-bs__empty {
    display: flex; flex-direction: column; align-items: center;
    padding: 30px 16px; color: #9599a4; gap: 10px; text-align: center;
    font-size: 12px; line-height: 1.5;
  }
  .dt-bs__items-scroll {
    max-height: 160px;
    overflow-y: auto;
  }
  .dt-bs__item {
    display: flex; justify-content: space-between; align-items: flex-start;
    padding: 10px 14px; border-bottom: 1px solid #f0f0f4;
  }
  .dt-bs__item-left { flex: 1; }
  .dt-bs__item-team { font-size: 12px; font-weight: 700; color: #292a33; }
  .dt-bs__item-mkt  { font-size: 10px; color: #6a6f7a; margin-top: 2px; }
  .dt-bs__item-right { display: flex; align-items: center; gap: 8px; }
  .dt-bs__item-odds { font-size: 14px; font-weight: 800; color: #c026d3; }
  .dt-bs__item-del  {
    background: none; border: none; cursor: pointer;
    font-size: 11px; color: #bbb; padding: 2px 4px;
  }
  .dt-bs__item-del:hover { color: #e04040; }
  .dt-bs__stake-row {
    padding: 12px 14px 6px;
    display: flex; flex-direction: column; gap: 5px;
  }
  .dt-bs__stake-row label { font-size: 11px; font-weight: 600; color: #6a6f7a; }
  .dt-bs__stake-row input {
    border: 1.5px solid #e6e7eb; border-radius: 6px;
    padding: 8px 10px; font-size: 13px; font-weight: 600;
    color: #292a33; outline: none; width: 100%;
  }
  .dt-bs__stake-row input:focus { border-color: #c026d3; }
  .dt-bs__summary { padding: 6px 14px 10px; }
  .dt-bs__summary-row {
    display: flex; justify-content: space-between;
    font-size: 12px; color: #6a6f7a; padding: 3px 0;
  }
  .dt-bs__summary-row strong { color: #292a33; }
  .dt-bs__summary-row strong.win { color: #10a310; }
  .dt-bs__place-btn {
    display: block; width: calc(100% - 28px); margin: 0 14px 8px;
    padding: 11px; background: linear-gradient(90deg, #c026d3, #a21caf);
    color: #fff; font-size: 14px; font-weight: 800; border: none;
    border-radius: 8px; cursor: pointer; transition: opacity 0.15s;
  }
  .dt-bs__place-btn:hover { opacity: 0.9; }
  .dt-bs__clear-btn {
    display: block; width: calc(100% - 28px); margin: 0 14px 14px;
    padding: 8px; background: #f5f6f9; color: #6a6f7a;
    font-size: 12px; font-weight: 600; border: 1px solid #e6e7eb;
    border-radius: 8px; cursor: pointer;
  }

  /* Promotions */
  .dt-promo {
    background: #fff; border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 1px 6px rgba(0,0,0,.06);
  }
  .dt-promo__head {
    font-size: 11px; font-weight: 800; color: #292a33;
    padding: 10px 14px; border-bottom: 1px solid #f0f0f4;
    text-transform: uppercase; letter-spacing: .5px;
  }
  .dt-promo__item {
    display: flex; align-items: flex-start; gap: 10px;
    padding: 10px 14px; border-bottom: 1px solid #f5f6f9;
  }
  .dt-promo__item:last-child { border-bottom: none; }
  .dt-promo__icon { font-size: 18px; flex-shrink: 0; }
  .dt-promo__title { font-size: 12px; font-weight: 700; color: #292a33; }
  .dt-promo__sub   { font-size: 10px; color: #6a6f7a; margin-top: 2px; }

  /* Live scores */
  .dt-livescores {
    background: #fff; border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 1px 6px rgba(0,0,0,.06);
  }
  .dt-livescores__head {
    display: flex; align-items: center; gap: 6px;
    font-size: 11px; font-weight: 800; color: #292a33;
    padding: 10px 14px; border-bottom: 1px solid #f0f0f4;
    text-transform: uppercase; letter-spacing: .5px;
  }
  .dt-livescores__row {
    display: flex; align-items: center; gap: 6px;
    padding: 8px 14px; border-bottom: 1px solid #f5f6f9;
    cursor: pointer; transition: background 0.12s;
  }
  .dt-livescores__row:last-child { border-bottom: none; }
  .dt-livescores__row:hover { background: #f9f9fc; }
  .dt-livescores__teams {
    flex: 1; display: flex; flex-direction: column; gap: 2px;
    font-size: 11px; font-weight: 600; color: #292a33;
  }
  .dt-livescores__score {
    display: flex; flex-direction: column; align-items: center; gap: 2px;
    font-size: 13px; font-weight: 800; color: #c026d3; min-width: 20px;
  }
  .dt-livescores__min {
    font-size: 10px; color: #e04040; font-weight: 700;
    background: rgba(224,64,64,0.1); border-radius: 4px; padding: 1px 4px;
  }
}

/* ══════════════════════════════════════════════
   DESKTOP HEADER OVERRIDES
══════════════════════════════════════════════ */
@media (min-width: 1024px) {
  :deep(.header) {
    padding: 0 24px;
    height: 58px;
  }
  :deep(.header__logo) {
    height: 36px;
  }
}
</style>
