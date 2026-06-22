<template>
  <div class="page">
    <AppHeader />

    <!-- Desktop top-nav -->
    <nav class="dt-topnav">
      <button
        v-for="tab in desktopNavTabs" :key="tab.label"
        class="dt-topnav__tab"
        :class="{ active: tab.label === 'Results' }"
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
        <div class="dt-sidebar__section">
          <div class="dt-sidebar__head">🏅 Sport Filter</div>
          <button
            v-for="f in filters" :key="f.id"
            class="dt-sidebar__item"
            :class="{ active: activeFilter === f.id }"
            @click="activeFilter = f.id"
          >
            <span class="dt-sidebar__icon">{{ f.icon }}</span>
            <span class="dt-sidebar__item-name">{{ f.label }}</span>
          </button>
        </div>

        <div class="dt-sidebar__section">
          <div class="dt-sidebar__head">📅 Date</div>
          <button
            v-for="d in dateTabs" :key="d.key"
            class="dt-sidebar__item"
            :class="{ active: activeDate === d.key }"
            @click="activeDate = d.key"
          >
            <span class="dt-sidebar__icon">📆</span>
            <div class="dt-sidebar__date-wrap">
              <span class="dt-sidebar__date-day">{{ d.day }}</span>
              <span class="dt-sidebar__date-val">{{ d.date }}</span>
            </div>
          </button>
        </div>

        <div class="dt-sidebar__section">
          <div class="dt-sidebar__head">⚡ Quick Links</div>
          <RouterLink to="/" class="dt-sidebar__item dt-sidebar__item--link">
            <span class="dt-sidebar__icon">⚽</span>
            <span class="dt-sidebar__item-name">Sportsbook</span>
          </RouterLink>
          <RouterLink to="/casino" class="dt-sidebar__item dt-sidebar__item--link">
            <span class="dt-sidebar__icon">🎰</span>
            <span class="dt-sidebar__item-name">Casino</span>
          </RouterLink>
          <RouterLink to="/jackpot" class="dt-sidebar__item dt-sidebar__item--link">
            <span class="dt-sidebar__icon">🏆</span>
            <span class="dt-sidebar__item-name">Jackpot</span>
          </RouterLink>
          <RouterLink to="/virtuals" class="dt-sidebar__item dt-sidebar__item--link">
            <span class="dt-sidebar__icon">🎮</span>
            <span class="dt-sidebar__item-name">Virtuals</span>
          </RouterLink>
        </div>

        <div class="dt-sidebar__resp">
          <div class="dt-sidebar__resp-title">🛡 Responsible Gaming</div>
          <p class="dt-sidebar__resp-text">Bet within your limits. 18+ only.</p>
          <div class="dt-sidebar__resp-logos">
            <span class="dt-sidebar__resp-badge">18+</span>
            <span class="dt-sidebar__resp-badge">NGB</span>
            <span class="dt-sidebar__resp-badge">GamCare</span>
          </div>
        </div>
      </aside>

      <!-- CENTER CONTENT -->
      <main class="dt-center">

        <!-- Page header -->
        <div class="res-page-header">
          <div class="res-page-header__title">
            <span class="res-page-header__icon">📋</span>
            <span>Results</span>
          </div>
          <!-- Mobile filters (hidden on desktop) -->
          <div class="res-filters mob-only">
            <button
              v-for="f in filters" :key="f.id"
              class="res-filter-btn"
              :class="{ active: activeFilter === f.id }"
              @click="activeFilter = f.id"
            >{{ f.icon }} {{ f.label }}</button>
          </div>
        </div>

        <!-- Date tabs -->
        <div class="res-date-tabs">
          <button
            v-for="d in dateTabs" :key="d.key"
            class="res-date-tab"
            :class="{ active: activeDate === d.key }"
            @click="activeDate = d.key"
          >
            <span class="res-date-tab__day">{{ d.day }}</span>
            <span class="res-date-tab__date">{{ d.date }}</span>
          </button>
        </div>

        <!-- Results list -->
        <div class="res-content">
          <template v-if="filteredGroups.length">
            <div v-for="group in filteredGroups" :key="group.league" class="res-group">
              <div class="res-group__hdr">
                <span class="res-group__flag">{{ group.flag }}</span>
                <span class="res-group__league">{{ group.league }}</span>
                <span class="res-group__count">{{ group.matches.length }} matches</span>
              </div>
              <RouterLink
                v-for="m in group.matches" :key="m.id"
                :to="`/results/${m.id}`"
                class="res-card"
              >
                <div class="res-card__time">FT</div>

                <div class="res-card__body">
                  <div class="res-card__team res-card__team--home" :class="{ 'res-card__team--winner': m.homeScore > m.awayScore }">
                    <span class="res-card__name">{{ m.home }}</span>
                    <span class="res-card__badge" v-if="m.homeScore > m.awayScore">W</span>
                  </div>

                  <div class="res-card__score">
                    <span class="res-card__num" :class="{ 'res-card__num--high': m.homeScore > m.awayScore }">{{ m.homeScore }}</span>
                    <span class="res-card__sep">–</span>
                    <span class="res-card__num" :class="{ 'res-card__num--high': m.awayScore > m.homeScore }">{{ m.awayScore }}</span>
                  </div>

                  <div class="res-card__team res-card__team--away" :class="{ 'res-card__team--winner': m.awayScore > m.homeScore }">
                    <span class="res-card__badge" v-if="m.awayScore > m.homeScore">W</span>
                    <span class="res-card__name">{{ m.away }}</span>
                  </div>
                </div>

                <div class="res-card__meta">
                  <span v-if="m.redCards" class="res-card__rc">🟥 {{ m.redCards }}</span>
                  <span class="res-card__arrow">›</span>
                </div>
              </RouterLink>
            </div>
          </template>
          <div v-else class="res-empty">
            <div class="res-empty__icon">⚽</div>
            <p>No results available for this selection.</p>
          </div>
        </div>

      </main>

      <!-- RIGHT PANEL -->
      <aside class="dt-right">

        <!-- Promotions -->
        <div class="dt-promo-widget">
          <div class="dt-promo-widget__head">🎁 Promotions</div>
          <RouterLink to="/promotions" class="dt-promo-widget__item" v-for="p in promotions" :key="p.title">
            <span class="dt-promo-widget__emoji">{{ p.icon }}</span>
            <div class="dt-promo-widget__info">
              <div class="dt-promo-widget__title">{{ p.title }}</div>
              <div class="dt-promo-widget__sub">{{ p.sub }}</div>
            </div>
          </RouterLink>
        </div>

        <!-- Live Scores -->
        <div class="dt-livescores-widget">
          <div class="dt-livescores-widget__head">
            <span class="dt-live-dot"></span> Live Scores
          </div>
          <div v-for="s in liveScores" :key="s.home" class="dt-livescores-widget__row">
            <div class="dt-livescores-widget__teams">
              <span class="dt-livescores-widget__team">{{ s.home }}</span>
              <span class="dt-livescores-widget__score">{{ s.hs }} – {{ s.as }}</span>
              <span class="dt-livescores-widget__team">{{ s.away }}</span>
            </div>
            <span class="dt-livescores-widget__min">{{ s.min }}'</span>
          </div>
        </div>

        <!-- App Download Banner -->
        <div class="dt-app-banner">
          <span class="dt-app-banner__icon">📱</span>
          <div class="dt-app-banner__text">
            <div class="dt-app-banner__title">Download App</div>
            <div class="dt-app-banner__sub">Bet on the go</div>
          </div>
          <button class="dt-app-banner__btn">Get App</button>
        </div>

      </aside>

    </div>

    <BottomNav />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import AppHeader from '@/components/AppHeader.vue';
import BottomNav from '@/components/BottomNav.vue';

const $router = useRouter();

const desktopNavTabs = [
  { label: 'Sportsbook', icon: '⚽', route: '/' },
  { label: 'Live',       icon: '🔴', route: '/sports/Football', badge: '24' },
  { label: 'Casino',     icon: '🎰', route: '/casino' },
  { label: 'Jackpot',    icon: '🏆', route: '/jackpot' },
  { label: 'Virtuals',   icon: '🎮', route: '/virtuals' },
  { label: 'Results',    icon: '📋', route: '/results' },
];

const filters = [
  { id: 'all',        label: 'All Sports',  icon: '🌐' },
  { id: 'football',   label: 'Football',    icon: '⚽' },
  { id: 'basketball', label: 'Basketball',  icon: '🏀' },
  { id: 'tennis',     label: 'Tennis',      icon: '🎾' },
];

const dateTabs = [
  { key: 'yesterday', day: 'Yesterday',   date: '21 Jun' },
  { key: 'today',     day: 'Today',       date: '22 Jun' },
  { key: '20jun',     day: 'Friday',      date: '20 Jun' },
  { key: '19jun',     day: 'Thursday',    date: '19 Jun' },
  { key: '18jun',     day: 'Wednesday',   date: '18 Jun' },
];

const promotions = [
  { icon: '💰', title: '100% First Deposit', sub: 'Up to UGX 500,000' },
  { icon: '⚡', title: 'Live Betting Boost',  sub: 'Extra 5% on winnings' },
  { icon: '🏆', title: 'Weekly Jackpot',      sub: 'Win UGX 50,000,000' },
];

const liveScores = [
  { home: 'KCCA FC',    away: 'Express FC',  hs: 1, as: 0, min: 63 },
  { home: 'Arsenal',    away: 'Chelsea',      hs: 2, as: 1, min: 78 },
  { home: 'AC Milan',   away: 'Juventus',     hs: 0, as: 0, min: 34 },
];

const activeFilter = ref('football');
const activeDate   = ref('today');

interface ResultMatch {
  id: string;
  sport: string;
  home: string;
  away: string;
  homeScore: number;
  awayScore: number;
  minute?: number;
  redCards?: number;
}
interface ResultGroup { league: string; flag: string; sport: string; matches: ResultMatch[]; }

const allGroups: Record<string, ResultGroup[]> = {
  today: [
    {
      league: 'Uganda Premier League', flag: '🇺🇬', sport: 'football',
      matches: [
        { id: 'r01', sport: 'football', home: 'KCCA FC',       away: 'Vipers SC',      homeScore: 2, awayScore: 1 },
        { id: 'r02', sport: 'football', home: 'Express FC',    away: 'SC Villa',        homeScore: 0, awayScore: 0 },
        { id: 'r03', sport: 'football', home: 'Wakiso Giants', away: 'Mbarara City',    homeScore: 3, awayScore: 2, redCards: 1 },
      ],
    },
    {
      league: 'English Premier League', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', sport: 'football',
      matches: [
        { id: 'r04', sport: 'football', home: 'Arsenal',       away: 'Tottenham',       homeScore: 2, awayScore: 0 },
        { id: 'r05', sport: 'football', home: 'Man United',    away: 'Aston Villa',     homeScore: 1, awayScore: 1 },
        { id: 'r06', sport: 'football', home: 'Wolves',        away: 'Everton',         homeScore: 3, awayScore: 1 },
        { id: 'r07', sport: 'football', home: 'Newcastle',     away: 'Brighton',        homeScore: 0, awayScore: 2 },
      ],
    },
    {
      league: 'La Liga', flag: '🇪🇸', sport: 'football',
      matches: [
        { id: 'r08', sport: 'football', home: 'Real Madrid',   away: 'Atletico Madrid', homeScore: 2, awayScore: 2 },
        { id: 'r09', sport: 'football', home: 'Sevilla',       away: 'Real Sociedad',   homeScore: 1, awayScore: 0, redCards: 1 },
      ],
    },
    {
      league: 'Serie A', flag: '🇮🇹', sport: 'football',
      matches: [
        { id: 'r10', sport: 'football', home: 'Juventus',      away: 'Napoli',          homeScore: 1, awayScore: 2 },
        { id: 'r11', sport: 'football', home: 'Lazio',         away: 'Roma',            homeScore: 1, awayScore: 1 },
      ],
    },
    {
      league: 'NBA', flag: '🇺🇸', sport: 'basketball',
      matches: [
        { id: 'r12', sport: 'basketball', home: 'Lakers',      away: 'Warriors',        homeScore: 112, awayScore: 108 },
        { id: 'r13', sport: 'basketball', home: 'Celtics',     away: 'Heat',            homeScore: 101, awayScore: 97 },
      ],
    },
    {
      league: 'ATP Wimbledon', flag: '🇬🇧', sport: 'tennis',
      matches: [
        { id: 'r14', sport: 'tennis', home: 'C. Alcaraz',     away: 'N. Djokovic',     homeScore: 3, awayScore: 1 },
        { id: 'r15', sport: 'tennis', home: 'J. Sinner',      away: 'D. Medvedev',     homeScore: 2, awayScore: 3 },
      ],
    },
  ],
  yesterday: [
    {
      league: 'English Premier League', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', sport: 'football',
      matches: [
        { id: 'r20', sport: 'football', home: 'Liverpool',     away: 'Man City',        homeScore: 3, awayScore: 2 },
        { id: 'r21', sport: 'football', home: 'Chelsea',       away: 'Leicester',       homeScore: 4, awayScore: 1 },
      ],
    },
    {
      league: 'Bundesliga', flag: '🇩🇪', sport: 'football',
      matches: [
        { id: 'r22', sport: 'football', home: 'Bayern Munich', away: 'Dortmund',        homeScore: 2, awayScore: 0 },
        { id: 'r23', sport: 'football', home: 'Bayer Leverkusen', away: 'Leipzig',      homeScore: 1, awayScore: 1 },
      ],
    },
    {
      league: 'Ligue 1', flag: '🇫🇷', sport: 'football',
      matches: [
        { id: 'r24', sport: 'football', home: 'PSG',           away: 'Marseille',       homeScore: 3, awayScore: 1, redCards: 1 },
        { id: 'r25', sport: 'football', home: 'Nice',          away: 'Lyon',            homeScore: 0, awayScore: 2 },
      ],
    },
  ],
  '20jun': [
    {
      league: 'UEFA Champions League', flag: '🇪🇺', sport: 'football',
      matches: [
        { id: 'r30', sport: 'football', home: 'Barcelona',     away: 'Inter Milan',     homeScore: 2, awayScore: 1 },
        { id: 'r31', sport: 'football', home: 'PSG',           away: 'Man City',        homeScore: 1, awayScore: 3 },
      ],
    },
    {
      league: 'Europa League', flag: '🇪🇺', sport: 'football',
      matches: [
        { id: 'r32', sport: 'football', home: 'Arsenal',       away: 'Bayer Leverkusen',homeScore: 2, awayScore: 2 },
        { id: 'r33', sport: 'football', home: 'Roma',          away: 'Ajax',            homeScore: 1, awayScore: 0 },
      ],
    },
  ],
  '19jun': [
    {
      league: 'Uganda Premier League', flag: '🇺🇬', sport: 'football',
      matches: [
        { id: 'r40', sport: 'football', home: 'Onduparaka',    away: 'KCCA FC',         homeScore: 0, awayScore: 1 },
        { id: 'r41', sport: 'football', home: 'BUL FC',        away: 'Express FC',      homeScore: 2, awayScore: 2 },
      ],
    },
  ],
  '18jun': [
    {
      league: 'English Premier League', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', sport: 'football',
      matches: [
        { id: 'r50', sport: 'football', home: 'Man City',      away: 'Chelsea',         homeScore: 1, awayScore: 0 },
        { id: 'r51', sport: 'football', home: 'Arsenal',       away: 'Liverpool',       homeScore: 2, awayScore: 2 },
        { id: 'r52', sport: 'football', home: 'Tottenham',     away: 'Aston Villa',     homeScore: 3, awayScore: 0 },
      ],
    },
  ],
};

const filteredGroups = computed(() => {
  const groups = allGroups[activeDate.value] ?? [];
  if (activeFilter.value === 'all') return groups;
  return groups.filter(g => g.sport === activeFilter.value);
});
</script>

<style scoped>
.page { min-height: 100vh; background: #f5f6fa; padding-bottom: 56px; }

/* ── Desktop top nav ── */
.dt-topnav {
  display: none;
  background: #1c1e24;
  padding: 0 20px;
  gap: 2px;
  overflow-x: auto;
}
@media (min-width: 1024px) {
  .dt-topnav { display: flex; }
  .page { padding-bottom: 0; }
}
.dt-topnav__tab {
  display: flex; align-items: center; gap: 6px;
  padding: 0 16px; height: 40px; border: none; background: none;
  color: rgba(255,255,255,.65); font-size: 12px; font-weight: 700;
  cursor: pointer; white-space: nowrap; position: relative;
  border-bottom: 2.5px solid transparent; transition: color .15s;
}
.dt-topnav__tab.active {
  color: #ffe60f; border-bottom-color: #ffe60f;
}
.dt-topnav__tab:hover:not(.active) { color: #fff; }
.dt-topnav__badge {
  background: #ef4444; color: #fff; font-size: 8px; font-weight: 900;
  border-radius: 10px; padding: 1px 5px; line-height: 1.5;
}

/* ── Desktop 3-column shell ── */
.dt-shell { display: block; }

@media (min-width: 1024px) {
  .dt-shell {
    display: grid;
    grid-template-columns: 180px 1fr 215px;
    gap: 0;
    width: 100%;
    height: calc(100vh - 96px);
    align-items: stretch;
    background: #f2f3f5;
    overflow: hidden;
  }
}

/* ── Left sidebar ── */
.dt-sidebar { display: none; }

@media (min-width: 1024px) {
  .dt-sidebar {
    display: flex;
    flex-direction: column;
    background: #fff;
    border-right: 1px solid #e6e7eb;
    overflow-y: auto;
    overflow-x: hidden;
    padding-bottom: 16px;
    align-self: stretch;
  }
  .dt-sidebar::-webkit-scrollbar { width: 3px; }
  .dt-sidebar::-webkit-scrollbar-thumb { background: #e0e2ea; border-radius: 3px; }

  .dt-sidebar__section { padding: 10px 0 4px; border-bottom: 1px solid #f0f0f4; }
  .dt-sidebar__section:last-child { border-bottom: none; }

  .dt-sidebar__head {
    font-size: 9px; font-weight: 800; color: #9599a4;
    text-transform: uppercase; letter-spacing: .6px;
    padding: 2px 12px 6px;
  }

  .dt-sidebar__item {
    display: flex; align-items: center; gap: 8px;
    padding: 7px 12px; width: 100%;
    border: none; background: none; cursor: pointer;
    text-align: left; text-decoration: none;
    transition: background .1s;
    border-left: 2.5px solid transparent;
  }
  .dt-sidebar__item:hover { background: #f5f6fa; }
  .dt-sidebar__item.active {
    background: #fdf4ff;
    border-left-color: #c026d3;
  }
  .dt-sidebar__item--link { color: inherit; }

  .dt-sidebar__icon { font-size: 14px; flex-shrink: 0; width: 18px; text-align: center; }
  .dt-sidebar__item-name { font-size: 11px; font-weight: 600; color: #292a33; flex: 1; }
  .dt-sidebar__item.active .dt-sidebar__item-name { color: #c026d3; font-weight: 700; }

  .dt-sidebar__date-wrap { display: flex; flex-direction: column; line-height: 1.2; }
  .dt-sidebar__date-day { font-size: 9px; font-weight: 700; color: #9599a4; }
  .dt-sidebar__date-val { font-size: 11px; font-weight: 700; color: #292a33; }
  .dt-sidebar__item.active .dt-sidebar__date-day,
  .dt-sidebar__item.active .dt-sidebar__date-val { color: #c026d3; }

  .dt-sidebar__resp {
    padding: 12px 12px 8px;
    background: #fafafa;
    margin-top: auto;
  }
  .dt-sidebar__resp-title { font-size: 9px; font-weight: 800; color: #6b7280; margin-bottom: 4px; }
  .dt-sidebar__resp-text  { font-size: 9px; color: #9ca3af; margin: 0 0 6px; }
  .dt-sidebar__resp-logos { display: flex; gap: 4px; flex-wrap: wrap; }
  .dt-sidebar__resp-badge {
    font-size: 8px; font-weight: 800; color: #6b7280;
    border: 1px solid #d1d5db; border-radius: 4px; padding: 1px 5px;
  }
}

/* ── Center content ── */
.dt-center { min-width: 0; }

@media (min-width: 1024px) {
  .dt-center {
    background: #f2f3f5;
    overflow-y: auto;
    overflow-x: hidden;
    min-height: 0;
    align-self: stretch;
  }
  .dt-center::-webkit-scrollbar { width: 4px; }
  .dt-center::-webkit-scrollbar-thumb { background: #ddd; border-radius: 4px; }
}

/* ── Right panel ── */
.dt-right { display: none; }

@media (min-width: 1024px) {
  .dt-right {
    display: flex;
    flex-direction: column;
    gap: 10px;
    background: transparent;
    padding: 10px 8px 10px 0;
    overflow-y: auto;
    overflow-x: hidden;
    min-height: 0;
    align-self: stretch;
  }
  .dt-right::-webkit-scrollbar { width: 3px; }
  .dt-right::-webkit-scrollbar-thumb { background: #ddd; border-radius: 3px; }

  /* Promo widget */
  .dt-promo-widget {
    background: #fff; border-radius: 10px;
    box-shadow: 0 1px 6px rgba(0,0,0,.08);
    overflow: hidden; flex-shrink: 0;
  }
  .dt-promo-widget__head {
    font-size: 11px; font-weight: 800; color: #292a33;
    padding: 10px 12px 8px; border-bottom: 1px solid #f0f0f4;
  }
  .dt-promo-widget__item {
    display: flex; align-items: center; gap: 8px;
    padding: 9px 12px; border-bottom: 1px solid #f5f6fa;
    text-decoration: none; transition: background .1s;
  }
  .dt-promo-widget__item:last-child { border-bottom: none; }
  .dt-promo-widget__item:hover { background: #fdf5ff; }
  .dt-promo-widget__emoji { font-size: 16px; flex-shrink: 0; }
  .dt-promo-widget__info { flex: 1; min-width: 0; }
  .dt-promo-widget__title { font-size: 11px; font-weight: 700; color: #292a33; }
  .dt-promo-widget__sub   { font-size: 9px; color: #9599a4; margin-top: 1px; }

  /* Live scores widget */
  .dt-livescores-widget {
    background: #fff; border-radius: 10px;
    box-shadow: 0 1px 6px rgba(0,0,0,.08);
    overflow: hidden; flex-shrink: 0;
  }
  .dt-livescores-widget__head {
    display: flex; align-items: center; gap: 6px;
    font-size: 11px; font-weight: 800; color: #292a33;
    padding: 10px 12px 8px; border-bottom: 1px solid #f0f0f4;
  }
  .dt-live-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: #ef4444; flex-shrink: 0;
    animation: live-pulse 1.4s ease-in-out infinite;
  }
  @keyframes live-pulse {
    0%,100% { opacity: 1; } 50% { opacity: 0.4; }
  }
  .dt-livescores-widget__row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 7px 12px; border-bottom: 1px solid #f5f6fa;
    gap: 6px;
  }
  .dt-livescores-widget__row:last-child { border-bottom: none; }
  .dt-livescores-widget__teams {
    display: flex; align-items: center; gap: 6px; flex: 1; min-width: 0;
  }
  .dt-livescores-widget__team {
    font-size: 10px; font-weight: 600; color: #4b5563;
    flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  .dt-livescores-widget__score {
    font-size: 11px; font-weight: 900; color: #c026d3;
    background: #fdf4ff; border-radius: 4px; padding: 1px 5px;
    flex-shrink: 0;
  }
  .dt-livescores-widget__min {
    font-size: 9px; font-weight: 700; color: #ef4444; flex-shrink: 0;
  }

  /* App download banner */
  .dt-app-banner {
    background: linear-gradient(135deg, #c026d3, #7c3aed);
    border-radius: 10px; padding: 12px 14px;
    display: flex; align-items: center; gap: 10px;
    box-shadow: 0 1px 6px rgba(192,38,211,0.25);
    flex-shrink: 0;
  }
  .dt-app-banner__icon { font-size: 24px; flex-shrink: 0; }
  .dt-app-banner__text { flex: 1; }
  .dt-app-banner__title { font-size: 12px; font-weight: 800; color: #fff; }
  .dt-app-banner__sub   { font-size: 10px; color: rgba(255,255,255,.75); margin-top: 1px; }
  .dt-app-banner__btn {
    background: #fff; color: #c026d3;
    font-size: 11px; font-weight: 800; border: none;
    border-radius: 6px; padding: 6px 10px; cursor: pointer;
    white-space: nowrap; flex-shrink: 0; transition: opacity .15s;
  }
  .dt-app-banner__btn:hover { opacity: .9; }
}

/* ── Page header ── */
.res-page-header {
  padding: 10px 12px 6px;
  display: flex; flex-direction: column; gap: 8px;
}

@media (min-width: 1024px) {
  .res-page-header {
    padding: 12px 10px 6px;
    flex-direction: row; align-items: center; justify-content: space-between;
  }
}

.res-page-header__title {
  display: flex; align-items: center; gap: 8px;
  font-size: 16px; font-weight: 900; color: #1a1b22;
}
.res-page-header__icon { font-size: 18px; }

/* ── Date tabs ── */
.res-date-tabs {
  display: flex; gap: 6px; overflow-x: auto; padding: 0 12px 8px;
  scrollbar-width: none;
}
.res-date-tabs::-webkit-scrollbar { display: none; }

@media (min-width: 1024px) {
  .res-date-tabs { padding: 0 10px 8px; }
}

.res-date-tab {
  flex-shrink: 0; display: flex; flex-direction: column; align-items: center;
  padding: 6px 12px; border-radius: 10px;
  border: 1.5px solid #e0e2ea; background: #fff;
  cursor: pointer; transition: background .12s, border-color .12s;
}
.res-date-tab.active { background: #f5e8fb; border-color: #d946ef; }
.res-date-tab__day  { font-size: 9px; font-weight: 700; color: #9599a4; text-transform: uppercase; letter-spacing: .4px; }
.res-date-tab__date { font-size: 12px; font-weight: 800; color: #292a33; }
.res-date-tab.active .res-date-tab__day,
.res-date-tab.active .res-date-tab__date { color: #a21caf; }

/* ── Mobile filters (shown inline on mobile, hidden on desktop) ── */
.mob-only { display: flex; }
@media (min-width: 1024px) { .mob-only { display: none; } }

.res-filters {
  gap: 6px; overflow-x: auto; padding-bottom: 4px;
  scrollbar-width: none;
}
.res-filters::-webkit-scrollbar { display: none; }
.res-filter-btn {
  flex-shrink: 0; padding: 6px 14px; border-radius: 20px;
  border: 1.5px solid #e0e2ea; background: #fff;
  font-size: 11px; font-weight: 700; color: #6a6f7a; cursor: pointer;
  transition: background .12s, border-color .12s, color .12s;
}
.res-filter-btn.active {
  background: #d946ef; border-color: #d946ef; color: #fff;
}

/* ── Content area ── */
.res-content {
  padding: 0 12px 16px;
}
@media (min-width: 1024px) {
  .res-content { padding: 0 10px 16px; }
}

/* ── Groups ── */
.res-group { margin-bottom: 10px; }
.res-group__hdr {
  display: flex; align-items: center; gap: 7px;
  background: #fff; border-radius: 10px 10px 0 0;
  padding: 8px 12px; border-bottom: 1px solid #f0f0f4;
}
.res-group__flag   { font-size: 15px; flex-shrink: 0; }
.res-group__league { font-size: 11px; font-weight: 800; color: #292a33; flex: 1; }
.res-group__count  { font-size: 9px; color: #9599a4; font-weight: 600; }

/* ── Result card ── */
.res-card {
  display: flex; align-items: center; gap: 8px;
  background: #fff; border-bottom: 1px solid #f0f0f4;
  padding: 9px 12px; text-decoration: none;
  transition: background .1s; cursor: pointer;
}
.res-card:last-child { border-bottom: none; border-radius: 0 0 10px 10px; }
.res-card:hover { background: #fdf5ff; }

.res-card__time {
  font-size: 9px; font-weight: 900; color: #6b7280;
  background: #f3f4f6; border-radius: 4px; padding: 2px 5px;
  min-width: 22px; text-align: center; flex-shrink: 0;
}

.res-card__body {
  flex: 1; display: flex; align-items: center; gap: 10px; min-width: 0;
}

.res-card__team {
  flex: 1; display: flex; align-items: center; min-width: 0;
}
.res-card__team--home { justify-content: flex-end; gap: 5px; }
.res-card__team--away { justify-content: flex-start; gap: 5px; }
.res-card__name {
  font-size: 12px; font-weight: 700; color: #4b5563;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.res-card__team--winner .res-card__name { color: #111827; font-weight: 800; }

.res-card__badge {
  font-size: 8px; font-weight: 900; color: #fff;
  background: #10a310; border-radius: 3px; padding: 1px 4px;
  flex-shrink: 0;
}

.res-card__score {
  display: flex; align-items: center; gap: 4px; flex-shrink: 0;
}
.res-card__num {
  font-size: 16px; font-weight: 900; color: #6b7280;
  min-width: 16px; text-align: center;
}
.res-card__num--high { color: #111827; }
.res-card__sep { font-size: 13px; color: #9ca3af; font-weight: 700; }

.res-card__meta {
  display: flex; align-items: center; gap: 5px; flex-shrink: 0;
}
.res-card__rc    { font-size: 10px; }
.res-card__arrow { font-size: 16px; color: #d1d5db; font-weight: 700; }

/* ── Empty state ── */
.res-empty {
  text-align: center; padding: 48px 20px;
  background: #fff; border-radius: 12px;
}
.res-empty__icon { font-size: 40px; margin-bottom: 10px; }
.res-empty p { font-size: 13px; color: #9599a4; }
</style>
