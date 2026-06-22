<template>
  <div class="page">
    <AppHeader />

    <!-- Desktop top-nav mirror -->
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

    <div class="res-shell">

      <!-- ── Filters ── -->
      <div class="res-filters">
        <button
          v-for="f in filters" :key="f.id"
          class="res-filter-btn"
          :class="{ active: activeFilter === f.id }"
          @click="activeFilter = f.id"
        >{{ f.label }}</button>
      </div>

      <!-- ── Date tabs ── -->
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

      <!-- ── Results list ── -->
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
  { label: 'Virtuals',   icon: '🎮', route: '/sports/virtuals' },
  { label: 'Results',    icon: '📋', route: '/results' },
];

const filters = [
  { id: 'all',        label: 'All Sports' },
  { id: 'football',   label: '⚽ Football' },
  { id: 'basketball', label: '🏀 Basketball' },
  { id: 'tennis',     label: '🎾 Tennis' },
];

const dateTabs = [
  { key: 'yesterday', day: 'Yesterday',   date: '21 Jun' },
  { key: 'today',     day: 'Today',       date: '22 Jun' },
  { key: '20jun',     day: 'Friday',      date: '20 Jun' },
  { key: '19jun',     day: 'Thursday',    date: '19 Jun' },
  { key: '18jun',     day: 'Wednesday',   date: '18 Jun' },
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

/* ── Shell ── */
.res-shell {
  max-width: 900px; margin: 0 auto; padding: 10px 10px 16px;
}
@media (min-width: 1024px) { .res-shell { padding: 14px 20px; } }

/* ── Filters ── */
.res-filters {
  display: flex; gap: 6px; overflow-x: auto; padding-bottom: 4px;
  scrollbar-width: none; margin-bottom: 10px;
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

/* ── Date tabs ── */
.res-date-tabs {
  display: flex; gap: 6px; overflow-x: auto; padding-bottom: 4px;
  scrollbar-width: none; margin-bottom: 10px;
}
.res-date-tabs::-webkit-scrollbar { display: none; }
.res-date-tab {
  flex-shrink: 0; display: flex; flex-direction: column; align-items: center;
  padding: 6px 12px; border-radius: 10px;
  border: 1.5px solid #e0e2ea; background: #fff;
  cursor: pointer; transition: background .12s, border-color .12s;
}
.res-date-tab.active { background: #f5e8fb; border-color: #d946ef; }
.res-date-tab__day { font-size: 9px; font-weight: 700; color: #9599a4; text-transform: uppercase; letter-spacing: .4px; }
.res-date-tab__date { font-size: 12px; font-weight: 800; color: #292a33; }
.res-date-tab.active .res-date-tab__day  { color: #a21caf; }
.res-date-tab.active .res-date-tab__date { color: #a21caf; }

/* ── Groups ── */
.res-group { margin-bottom: 12px; }
.res-group__hdr {
  display: flex; align-items: center; gap: 7px;
  background: #fff; border-radius: 10px 10px 0 0;
  padding: 8px 12px; border-bottom: 1px solid #f0f0f4;
}
.res-group__flag { font-size: 15px; flex-shrink: 0; }
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
.res-card__rc { font-size: 10px; }
.res-card__arrow { font-size: 16px; color: #d1d5db; font-weight: 700; }

/* ── Empty ── */
.res-empty {
  text-align: center; padding: 48px 20px;
  background: #fff; border-radius: 12px;
}
.res-empty__icon { font-size: 40px; margin-bottom: 10px; }
.res-empty p { font-size: 13px; color: #9599a4; }
</style>
