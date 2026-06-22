<template>
  <div class="page">
    <AppHeader />

    <!-- Back bar -->
    <div class="rd-topbar">
      <button class="rd-back" @click="$router.back()">
        <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
        Results
      </button>
      <span class="rd-topbar__comp">
        <span class="rd-topbar__flag">{{ match.flag }}</span>
        {{ match.league }}
      </span>
    </div>

    <!-- Hero score card -->
    <div class="rd-hero">
      <div class="rd-hero__status">FULL TIME</div>

      <div class="rd-hero__teams">
        <!-- Home -->
        <div class="rd-hero__side">
          <div class="rd-hero__crest rd-hero__crest--home">
            {{ match.home.charAt(0) }}
          </div>
          <div class="rd-hero__team-name">{{ match.home }}</div>
          <div class="rd-hero__scorers">
            <div v-for="g in match.homeGoals" :key="g.min" class="rd-hero__scorer">
              ⚽ {{ g.player }} {{ g.min }}'<span v-if="g.type === 'pen'"> (P)</span><span v-if="g.type === 'og'"> (OG)</span>
            </div>
          </div>
        </div>

        <!-- Score -->
        <div class="rd-hero__score-wrap">
          <div class="rd-hero__score">
            <span class="rd-hero__num" :class="{ 'rd-hero__num--lead': match.homeScore > match.awayScore }">{{ match.homeScore }}</span>
            <span class="rd-hero__dash">–</span>
            <span class="rd-hero__num" :class="{ 'rd-hero__num--lead': match.awayScore > match.homeScore }">{{ match.awayScore }}</span>
          </div>
          <div class="rd-hero__ht">HT {{ match.htHome }}–{{ match.htAway }}</div>
        </div>

        <!-- Away -->
        <div class="rd-hero__side rd-hero__side--away">
          <div class="rd-hero__crest rd-hero__crest--away">
            {{ match.away.charAt(0) }}
          </div>
          <div class="rd-hero__team-name">{{ match.away }}</div>
          <div class="rd-hero__scorers">
            <div v-for="g in match.awayGoals" :key="g.min" class="rd-hero__scorer">
              ⚽ {{ g.player }} {{ g.min }}'<span v-if="g.type === 'pen'"> (P)</span><span v-if="g.type === 'og'"> (OG)</span>
            </div>
          </div>
        </div>
      </div>

      <div class="rd-hero__meta">
        <span>📅 {{ match.date }}</span>
        <span>🕐 {{ match.time }}</span>
        <span>🏟 {{ match.venue }}</span>
      </div>
    </div>

    <!-- Tabs -->
    <div class="rd-tabs">
      <button
        v-for="t in tabs" :key="t"
        class="rd-tab"
        :class="{ active: activeTab === t }"
        @click="activeTab = t"
      >{{ t }}</button>
    </div>

    <!-- Tab content -->
    <div class="rd-body">

      <!-- ── MATCH EVENTS ── -->
      <div v-if="activeTab === 'Events'" class="rd-timeline">
        <div
          v-for="e in match.timeline" :key="e.min + e.player"
          class="rd-event"
          :class="e.side === 'home' ? 'rd-event--home' : 'rd-event--away'"
        >
          <div v-if="e.side === 'home'" class="rd-event__detail">
            <span class="rd-event__icon">{{ eventIcon(e.type) }}</span>
            <div class="rd-event__info">
              <span class="rd-event__player">{{ e.player }}</span>
              <span class="rd-event__assist" v-if="e.assist">Assist: {{ e.assist }}</span>
            </div>
          </div>
          <div v-else class="rd-event__placeholder"></div>

          <div class="rd-event__min">{{ e.min }}'</div>

          <div v-if="e.side === 'away'" class="rd-event__detail">
            <div class="rd-event__info">
              <span class="rd-event__player">{{ e.player }}</span>
              <span class="rd-event__assist" v-if="e.assist">Assist: {{ e.assist }}</span>
            </div>
            <span class="rd-event__icon">{{ eventIcon(e.type) }}</span>
          </div>
          <div v-else class="rd-event__placeholder"></div>
        </div>
      </div>

      <!-- ── STATS ── -->
      <div v-else-if="activeTab === 'Stats'" class="rd-stats">
        <div v-for="s in match.stats" :key="s.label" class="rd-stat">
          <div class="rd-stat__vals">
            <span class="rd-stat__home">{{ s.home }}</span>
            <span class="rd-stat__label">{{ s.label }}</span>
            <span class="rd-stat__away">{{ s.away }}</span>
          </div>
          <div class="rd-stat__bar">
            <div
              class="rd-stat__bar-home"
              :style="{ width: barWidth(s.home, s.away, 'home') + '%' }"
            ></div>
            <div
              class="rd-stat__bar-away"
              :style="{ width: barWidth(s.home, s.away, 'away') + '%' }"
            ></div>
          </div>
        </div>
      </div>

      <!-- ── LINEUPS ── -->
      <div v-else-if="activeTab === 'Lineups'" class="rd-lineups">
        <div class="rd-lineup-col">
          <div class="rd-lineup__team">{{ match.home }}</div>
          <div class="rd-lineup__formation">{{ match.homeFormation }}</div>
          <div v-for="p in match.homeLineup" :key="p.num" class="rd-lineup__player">
            <span class="rd-lineup__num">{{ p.num }}</span>
            <span class="rd-lineup__name">{{ p.name }}</span>
            <span v-if="p.goal" class="rd-lineup__event">⚽</span>
            <span v-if="p.yellow" class="rd-lineup__event">🟨</span>
            <span v-if="p.red" class="rd-lineup__event">🟥</span>
            <span v-if="p.sub" class="rd-lineup__event rd-lineup__event--sub">↓</span>
          </div>
        </div>
        <div class="rd-lineup__divider"></div>
        <div class="rd-lineup-col">
          <div class="rd-lineup__team">{{ match.away }}</div>
          <div class="rd-lineup__formation">{{ match.awayFormation }}</div>
          <div v-for="p in match.awayLineup" :key="p.num" class="rd-lineup__player">
            <span class="rd-lineup__num">{{ p.num }}</span>
            <span class="rd-lineup__name">{{ p.name }}</span>
            <span v-if="p.goal" class="rd-lineup__event">⚽</span>
            <span v-if="p.yellow" class="rd-lineup__event">🟨</span>
            <span v-if="p.red" class="rd-lineup__event">🟥</span>
            <span v-if="p.sub" class="rd-lineup__event rd-lineup__event--sub">↓</span>
          </div>
        </div>
      </div>

      <!-- ── H2H ── -->
      <div v-else-if="activeTab === 'H2H'" class="rd-h2h">
        <div class="rd-h2h__summary">
          <div class="rd-h2h__col rd-h2h__col--home">
            <div class="rd-h2h__wins">{{ match.h2h.homeWins }}</div>
            <div class="rd-h2h__label">{{ match.home }} Wins</div>
          </div>
          <div class="rd-h2h__col rd-h2h__col--draw">
            <div class="rd-h2h__wins">{{ match.h2h.draws }}</div>
            <div class="rd-h2h__label">Draws</div>
          </div>
          <div class="rd-h2h__col rd-h2h__col--away">
            <div class="rd-h2h__wins">{{ match.h2h.awayWins }}</div>
            <div class="rd-h2h__label">{{ match.away }} Wins</div>
          </div>
        </div>
        <div class="rd-h2h__list">
          <div v-for="g in match.h2h.games" :key="g.date" class="rd-h2h__row">
            <span class="rd-h2h__date">{{ g.date }}</span>
            <span class="rd-h2h__home">{{ match.home }}</span>
            <span class="rd-h2h__score-cell" :class="{
              'rd-h2h__score-cell--hw': g.hs > g.as,
              'rd-h2h__score-cell--aw': g.as > g.hs,
            }">{{ g.hs }}–{{ g.as }}</span>
            <span class="rd-h2h__away">{{ match.away }}</span>
            <span class="rd-h2h__comp">{{ g.comp }}</span>
          </div>
        </div>
      </div>

    </div>

    <BottomNav />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import AppHeader from '@/components/AppHeader.vue';
import BottomNav from '@/components/BottomNav.vue';

const route = useRoute();
const activeTab = ref('Events');
const tabs = ['Events', 'Stats', 'Lineups', 'H2H'];

function eventIcon(type: string) {
  if (type === 'goal')    return '⚽';
  if (type === 'pen')     return '⚽';
  if (type === 'og')      return '⚽';
  if (type === 'yellow')  return '🟨';
  if (type === 'red')     return '🟥';
  if (type === 'sub')     return '🔄';
  return '📋';
}

function barWidth(home: any, away: any, side: 'home' | 'away') {
  const h = parseFloat(String(home)) || 0;
  const a = parseFloat(String(away)) || 0;
  const total = h + a;
  if (total === 0) return 50;
  return side === 'home' ? Math.round((h / total) * 100) : Math.round((a / total) * 100);
}

// Detailed match data keyed by id
const matchData: Record<string, any> = {
  r01: {
    id: 'r01', flag: '🇺🇬', league: 'Uganda Premier League',
    home: 'KCCA FC', away: 'Vipers SC',
    homeScore: 2, awayScore: 1, htHome: 1, htAway: 0,
    date: 'Sun 22 Jun 2026', time: '15:00', venue: 'StarTimes Stadium, Lugogo',
    homeGoals: [{ player: 'M. Katerega', min: 23 }, { player: 'B. Nsimbe', min: 71 }],
    awayGoals: [{ player: 'O. Bukenya', min: 56 }],
    timeline: [
      { min: 23, type: 'goal',   side: 'home', player: 'M. Katerega',  assist: 'B. Nsimbe' },
      { min: 34, type: 'yellow', side: 'away', player: 'P. Waiswa' },
      { min: 56, type: 'goal',   side: 'away', player: 'O. Bukenya',   assist: 'T. Ssali' },
      { min: 61, type: 'sub',    side: 'home', player: 'A. Mugabi → G. Lwanga' },
      { min: 71, type: 'goal',   side: 'home', player: 'B. Nsimbe',    assist: 'M. Katerega' },
      { min: 78, type: 'yellow', side: 'home', player: 'D. Sserwadda' },
      { min: 85, type: 'sub',    side: 'away', player: 'I. Orit → H. Ochen' },
      { min: 90, type: 'yellow', side: 'away', player: 'P. Waiswa' },
    ],
    stats: [
      { label: 'Possession %',     home: '54',  away: '46'  },
      { label: 'Shots',            home: '14',  away: '9'   },
      { label: 'Shots on Target',  home: '6',   away: '4'   },
      { label: 'Corners',          home: '7',   away: '3'   },
      { label: 'Fouls',            home: '11',  away: '16'  },
      { label: 'Yellow Cards',     home: '1',   away: '3'   },
      { label: 'Red Cards',        home: '0',   away: '0'   },
      { label: 'Offsides',         home: '2',   away: '3'   },
      { label: 'Passes',           home: '387', away: '311' },
      { label: 'Pass Accuracy %',  home: '81',  away: '76'  },
    ],
    homeFormation: '4-3-3', awayFormation: '4-4-2',
    homeLineup: [
      { num: 1,  name: 'C. Lukwago',    goal: false },
      { num: 2,  name: 'A. Mugabi',     sub: true },
      { num: 4,  name: 'I. Bukenya' },
      { num: 5,  name: 'R. Ssekibuule' },
      { num: 3,  name: 'J. Ochieng' },
      { num: 6,  name: 'D. Sserwadda',  yellow: true },
      { num: 8,  name: 'E. Ssemakula' },
      { num: 10, name: 'A. Kawooya' },
      { num: 7,  name: 'M. Katerega',   goal: true },
      { num: 9,  name: 'B. Nsimbe',     goal: true },
      { num: 11, name: 'T. Mawejje' },
    ],
    awayLineup: [
      { num: 1,  name: 'B. Alionzi' },
      { num: 2,  name: 'E. Wasswa' },
      { num: 5,  name: 'R. Kavuma' },
      { num: 4,  name: 'H. Musoke' },
      { num: 3,  name: 'A. Anywarach' },
      { num: 7,  name: 'P. Waiswa',     yellow: true },
      { num: 6,  name: 'T. Ssali' },
      { num: 8,  name: 'D. Kakooza' },
      { num: 10, name: 'M. Bayo' },
      { num: 11, name: 'O. Bukenya',    goal: true },
      { num: 9,  name: 'I. Orit',       sub: true },
    ],
    h2h: {
      homeWins: 8, draws: 4, awayWins: 5,
      games: [
        { date: '12 Mar 2026', hs: 1, as: 0, comp: 'UPL' },
        { date: '8 Nov 2025',  hs: 2, as: 2, comp: 'UPL' },
        { date: '25 Jul 2025', hs: 1, as: 2, comp: 'CC'  },
        { date: '3 Apr 2025',  hs: 3, as: 1, comp: 'UPL' },
        { date: '1 Dec 2024',  hs: 0, as: 0, comp: 'UPL' },
      ],
    },
  },
  r04: {
    id: 'r04', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', league: 'English Premier League',
    home: 'Arsenal', away: 'Tottenham',
    homeScore: 2, awayScore: 0, htHome: 1, htAway: 0,
    date: 'Sun 22 Jun 2026', time: '16:30', venue: 'Emirates Stadium, London',
    homeGoals: [{ player: 'B. Saka', min: 38 }, { player: 'L. Trossard', min: 74 }],
    awayGoals: [],
    timeline: [
      { min: 12, type: 'yellow', side: 'away', player: 'P. Sarr' },
      { min: 38, type: 'goal',   side: 'home', player: 'B. Saka',      assist: 'M. Ødegaard' },
      { min: 45, type: 'yellow', side: 'away', player: 'Y. Bissouma' },
      { min: 53, type: 'sub',    side: 'away', player: 'D. Kulusevski → B. Johnson' },
      { min: 58, type: 'yellow', side: 'home', player: 'T. Partey' },
      { min: 64, type: 'sub',    side: 'home', player: 'L. Trossard → G. Martinelli' },
      { min: 74, type: 'goal',   side: 'home', player: 'L. Trossard',  assist: 'B. White' },
      { min: 88, type: 'red',    side: 'away', player: 'R. Bentancur' },
      { min: 90, type: 'sub',    side: 'home', player: 'M. Ødegaard → F. Vieira' },
    ],
    stats: [
      { label: 'Possession %',     home: '62', away: '38'  },
      { label: 'Shots',            home: '18', away: '8'   },
      { label: 'Shots on Target',  home: '7',  away: '2'   },
      { label: 'Corners',          home: '9',  away: '2'   },
      { label: 'Fouls',            home: '10', away: '17'  },
      { label: 'Yellow Cards',     home: '1',  away: '2'   },
      { label: 'Red Cards',        home: '0',  away: '1'   },
      { label: 'Offsides',         home: '1',  away: '4'   },
      { label: 'Passes',           home: '541', away: '322' },
      { label: 'Pass Accuracy %',  home: '88', away: '79'  },
    ],
    homeFormation: '4-3-3', awayFormation: '4-2-3-1',
    homeLineup: [
      { num: 1,  name: 'D. Raya' },
      { num: 4,  name: 'B. White' },
      { num: 6,  name: 'G. Magalhães' },
      { num: 12, name: 'J. Timber' },
      { num: 35, name: 'O. Zinchenko' },
      { num: 5,  name: 'T. Partey',    yellow: true },
      { num: 8,  name: 'M. Ødegaard',  sub: true },
      { num: 29, name: 'K. Havertz' },
      { num: 7,  name: 'B. Saka',      goal: true },
      { num: 11, name: 'L. Trossard',  goal: true, sub: true },
      { num: 9,  name: 'K. Nketiah' },
    ],
    awayLineup: [
      { num: 1,  name: 'G. Vicario' },
      { num: 23, name: 'P. Porro' },
      { num: 6,  name: 'C. Romero' },
      { num: 15, name: 'M. Van de Ven' },
      { num: 33, name: 'D. Udogie' },
      { num: 17, name: 'Y. Bissouma',  yellow: true },
      { num: 30, name: 'R. Bentancur', red: true },
      { num: 20, name: 'P. Sarr',      yellow: true },
      { num: 21, name: 'D. Kulusevski',sub: true },
      { num: 10, name: 'J. Maddison' },
      { num: 23, name: 'H. Son' },
    ],
    h2h: {
      homeWins: 14, draws: 7, awayWins: 10,
      games: [
        { date: '24 Sep 2025', hs: 1, as: 0, comp: 'EPL' },
        { date: '28 Apr 2025', hs: 3, as: 2, comp: 'EPL' },
        { date: '15 Jan 2025', hs: 2, as: 2, comp: 'EPL' },
        { date: '12 May 2024', hs: 0, as: 1, comp: 'EPL' },
        { date: '22 Oct 2023', hs: 2, as: 2, comp: 'EPL' },
      ],
    },
  },
};

// Fallback for unknown IDs
const fallbackMatch = (id: string) => ({
  id, flag: '⚽', league: 'Football', home: 'Home Team', away: 'Away Team',
  homeScore: 1, awayScore: 0, htHome: 0, htAway: 0,
  date: 'Sun 22 Jun 2026', time: '15:00', venue: 'National Stadium',
  homeGoals: [{ player: 'Player', min: 45 }], awayGoals: [],
  timeline: [{ min: 45, type: 'goal', side: 'home', player: 'Player' }],
  stats: [
    { label: 'Possession %',    home: '55', away: '45' },
    { label: 'Shots',           home: '12', away: '8'  },
    { label: 'Shots on Target', home: '5',  away: '3'  },
    { label: 'Corners',         home: '5',  away: '3'  },
    { label: 'Fouls',           home: '10', away: '12' },
  ],
  homeFormation: '4-4-2', awayFormation: '4-4-2',
  homeLineup: Array.from({ length: 11 }, (_, i) => ({ num: i+1, name: `Player ${i+1}` })),
  awayLineup: Array.from({ length: 11 }, (_, i) => ({ num: i+1, name: `Player ${i+1}` })),
  h2h: {
    homeWins: 5, draws: 3, awayWins: 4,
    games: [
      { date: '10 Jan 2026', hs: 1, as: 0, comp: 'League' },
      { date: '20 Sep 2025', hs: 0, as: 1, comp: 'League' },
    ],
  },
});

const match = computed(() => matchData[route.params.id as string] ?? fallbackMatch(route.params.id as string));
</script>

<style scoped>
.page { min-height: 100vh; background: #f5f6fa; padding-bottom: 60px; }
@media (min-width: 1024px) { .page { padding-bottom: 0; } }

/* ── Top bar ── */
.rd-topbar {
  display: flex; align-items: center; gap: 12px;
  padding: 10px 14px; background: #fff;
  border-bottom: 1px solid #ebebeb; position: sticky; top: 0; z-index: 50;
}
.rd-back {
  display: flex; align-items: center; gap: 4px;
  background: none; border: none; cursor: pointer;
  font-size: 12px; font-weight: 700; color: #d946ef;
  padding: 0;
}
.rd-topbar__comp {
  flex: 1; text-align: center;
  font-size: 11px; font-weight: 700; color: #6a6f7a;
  display: flex; align-items: center; justify-content: center; gap: 5px;
}
.rd-topbar__flag { font-size: 14px; }

/* ── Hero ── */
.rd-hero {
  background: linear-gradient(135deg, #1c1e24 0%, #2d1f3d 100%);
  padding: 20px 16px 16px; text-align: center;
}
.rd-hero__status {
  font-size: 9px; font-weight: 900; letter-spacing: 2px;
  color: rgba(255,255,255,.5); text-transform: uppercase; margin-bottom: 16px;
}

.rd-hero__teams {
  display: grid; grid-template-columns: 1fr auto 1fr;
  align-items: flex-start; gap: 12px; margin-bottom: 14px;
}

.rd-hero__side {
  display: flex; flex-direction: column; align-items: center; gap: 6px;
}
.rd-hero__side--away { align-items: center; }

.rd-hero__crest {
  width: 44px; height: 44px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 18px; font-weight: 900; color: #fff;
  flex-shrink: 0;
}
.rd-hero__crest--home { background: linear-gradient(135deg, #d946ef, #a21caf); }
.rd-hero__crest--away { background: linear-gradient(135deg, #3b82f6, #1d4ed8); }

.rd-hero__team-name {
  font-size: 12px; font-weight: 800; color: #fff; text-align: center; line-height: 1.2;
}

.rd-hero__scorers {
  display: flex; flex-direction: column; gap: 2px; align-items: center;
}
.rd-hero__scorer {
  font-size: 9px; color: rgba(255,255,255,.6); white-space: nowrap;
}

.rd-hero__score-wrap { display: flex; flex-direction: column; align-items: center; gap: 4px; }
.rd-hero__score      { display: flex; align-items: center; gap: 6px; }
.rd-hero__num {
  font-size: 42px; font-weight: 900; color: rgba(255,255,255,.5);
  line-height: 1; min-width: 36px; text-align: center;
}
.rd-hero__num--lead { color: #fff; }
.rd-hero__dash { font-size: 28px; color: rgba(255,255,255,.3); font-weight: 300; }
.rd-hero__ht { font-size: 9px; color: rgba(255,255,255,.4); font-weight: 700; letter-spacing: .5px; }

.rd-hero__meta {
  display: flex; justify-content: center; gap: 14px; flex-wrap: wrap;
  font-size: 10px; color: rgba(255,255,255,.45);
}

/* ── Tabs ── */
.rd-tabs {
  display: flex; background: #fff;
  border-bottom: 1px solid #ebebeb; overflow-x: auto;
  scrollbar-width: none; position: sticky; top: 41px; z-index: 40;
}
.rd-tabs::-webkit-scrollbar { display: none; }
.rd-tab {
  flex: 1; min-width: 70px; padding: 10px 6px;
  border: none; background: none; font-size: 11px; font-weight: 700;
  color: #9599a4; cursor: pointer;
  border-bottom: 2.5px solid transparent; transition: color .15s;
  white-space: nowrap;
}
.rd-tab.active { color: #d946ef; border-bottom-color: #d946ef; }

/* ── Body ── */
.rd-body { max-width: 680px; margin: 0 auto; padding: 10px 10px 16px; }
@media (min-width: 1024px) { .rd-body { padding: 14px 0; } }

/* ── Timeline ── */
.rd-timeline { display: flex; flex-direction: column; }

.rd-event {
  display: grid; grid-template-columns: 1fr 44px 1fr;
  align-items: center; gap: 0;
  padding: 8px 0; border-bottom: 1px solid #f0f0f4;
  background: #fff;
}
.rd-event:first-child { border-top: 1px solid #f0f0f4; }

.rd-event__min {
  font-size: 10px; font-weight: 900; color: #9599a4;
  background: #f3f4f6; border-radius: 10px;
  padding: 2px 6px; text-align: center;
}

.rd-event__detail {
  display: flex; align-items: center; gap: 6px; padding: 0 10px;
}
.rd-event--home .rd-event__detail { justify-content: flex-end; }
.rd-event--away .rd-event__detail { justify-content: flex-start; }

.rd-event__placeholder { }
.rd-event__icon { font-size: 14px; flex-shrink: 0; }
.rd-event__info { display: flex; flex-direction: column; }
.rd-event__player { font-size: 11px; font-weight: 700; color: #292a33; }
.rd-event__assist { font-size: 9px; color: #9599a4; }

/* ── Stats ── */
.rd-stats {
  background: #fff; border-radius: 12px;
  overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,.06);
}
.rd-stat { padding: 10px 14px; border-bottom: 1px solid #f5f5f8; }
.rd-stat:last-child { border-bottom: none; }

.rd-stat__vals {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 5px;
}
.rd-stat__home, .rd-stat__away {
  font-size: 13px; font-weight: 900; color: #292a33; min-width: 28px;
}
.rd-stat__away { text-align: right; }
.rd-stat__label { font-size: 10px; color: #9599a4; font-weight: 600; text-align: center; flex: 1; }

.rd-stat__bar {
  display: flex; height: 5px; border-radius: 4px; overflow: hidden; gap: 2px;
}
.rd-stat__bar-home {
  background: linear-gradient(90deg, #d946ef, #a21caf);
  border-radius: 4px; transition: width .4s;
}
.rd-stat__bar-away {
  background: linear-gradient(90deg, #3b82f6, #1d4ed8);
  border-radius: 4px; transition: width .4s;
}

/* ── Lineups ── */
.rd-lineups {
  display: grid; grid-template-columns: 1fr 1px 1fr;
  background: #fff; border-radius: 12px;
  overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,.06);
}
.rd-lineup__divider { background: #f0f0f4; }
.rd-lineup-col { padding: 12px 10px; }
.rd-lineup__team { font-size: 12px; font-weight: 900; color: #292a33; margin-bottom: 2px; text-align: center; }
.rd-lineup__formation { font-size: 9px; color: #9599a4; text-align: center; margin-bottom: 10px; font-weight: 700; }
.rd-lineup__player {
  display: flex; align-items: center; gap: 5px;
  padding: 5px 0; border-bottom: 1px solid #f5f5f8;
  font-size: 11px;
}
.rd-lineup__player:last-child { border-bottom: none; }
.rd-lineup__num {
  width: 18px; height: 18px; border-radius: 50%;
  background: #f0f1f5; font-size: 9px; font-weight: 800; color: #6a6f7a;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.rd-lineup__name { flex: 1; color: #292a33; font-weight: 600; font-size: 10px; }
.rd-lineup__event { font-size: 10px; }
.rd-lineup__event--sub { color: #ef4444; font-weight: 900; font-size: 11px; }

/* ── H2H ── */
.rd-h2h { background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,.06); }

.rd-h2h__summary {
  display: grid; grid-template-columns: 1fr 1fr 1fr;
  padding: 14px; border-bottom: 1px solid #f0f0f4;
}
.rd-h2h__col { display: flex; flex-direction: column; align-items: center; gap: 3px; }
.rd-h2h__wins { font-size: 26px; font-weight: 900; color: #292a33; }
.rd-h2h__col--home .rd-h2h__wins { color: #d946ef; }
.rd-h2h__col--away .rd-h2h__wins { color: #3b82f6; }
.rd-h2h__label { font-size: 9px; color: #9599a4; font-weight: 700; text-align: center; }

.rd-h2h__list { }
.rd-h2h__row {
  display: grid;
  grid-template-columns: 56px 1fr 40px 1fr 36px;
  align-items: center; gap: 4px;
  padding: 8px 12px; border-bottom: 1px solid #f5f5f8;
  font-size: 10px;
}
.rd-h2h__row:last-child { border-bottom: none; }
.rd-h2h__date { color: #9599a4; font-weight: 600; font-size: 9px; }
.rd-h2h__home { color: #292a33; font-weight: 700; text-align: right; }
.rd-h2h__away { color: #292a33; font-weight: 700; }
.rd-h2h__comp { color: #9599a4; font-size: 9px; font-weight: 600; text-align: right; }
.rd-h2h__score-cell {
  text-align: center; font-weight: 900; font-size: 12px; color: #6b7280;
  background: #f3f4f6; border-radius: 6px; padding: 2px 4px;
}
.rd-h2h__score-cell--hw { background: #f5e8fb; color: #a21caf; }
.rd-h2h__score-cell--aw { background: #eff6ff; color: #1d4ed8; }
</style>
