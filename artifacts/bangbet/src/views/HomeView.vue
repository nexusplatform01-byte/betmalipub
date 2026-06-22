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
          <button
            v-for="s in sidebarSports" :key="s.name"
            class="dt-sidebar__item"
            :class="{ active: s.name === store.activeSport }"
            @click="store.activeSport = s.name"
          >
            <img :src="s.icon" class="dt-sidebar__item-icon" onerror="this.style.display='none'" />
            <span class="dt-sidebar__item-name">{{ s.name }}</span>
            <span class="dt-sidebar__item-count">{{ s.count }}</span>
          </button>
        </div>

        <div class="dt-sidebar__section">
          <div class="dt-sidebar__head">🌍 Top Leagues</div>
          <button v-for="l in topLeagues" :key="l.name" class="dt-sidebar__item">
            <span class="dt-sidebar__league-flag">{{ l.flag }}</span>
            <span class="dt-sidebar__item-name">{{ l.name }}</span>
          </button>
        </div>

        <div class="dt-sidebar__section">
          <div class="dt-sidebar__head">🔥 More Sports</div>
          <button v-for="s in moreSports" :key="s.name" class="dt-sidebar__item">
            <span class="dt-sidebar__league-flag">{{ s.icon }}</span>
            <span class="dt-sidebar__item-name">{{ s.name }}</span>
            <span class="dt-sidebar__item-count">{{ s.count }}</span>
          </button>
        </div>

        <div class="dt-sidebar__section">
          <div class="dt-sidebar__head">🏟 Competitions</div>
          <button v-for="c in popularComps" :key="c.name" class="dt-sidebar__item">
            <span class="dt-sidebar__league-flag">{{ c.flag }}</span>
            <span class="dt-sidebar__item-name">{{ c.name }}</span>
            <span v-if="c.live" class="dt-sidebar__live-chip">LIVE</span>
          </button>
        </div>

        <div class="dt-sidebar__section">
          <div class="dt-sidebar__head">⚡ Quick Links</div>
          <RouterLink to="/casino" class="dt-sidebar__item dt-sidebar__item--link">
            <span class="dt-sidebar__league-flag">🎰</span>
            <span class="dt-sidebar__item-name">Casino Games</span>
          </RouterLink>
          <RouterLink to="/jackpot" class="dt-sidebar__item dt-sidebar__item--link">
            <span class="dt-sidebar__league-flag">🏆</span>
            <span class="dt-sidebar__item-name">Jackpot</span>
          </RouterLink>
          <RouterLink to="/sports/virtuals" class="dt-sidebar__item dt-sidebar__item--link">
            <span class="dt-sidebar__league-flag">🎮</span>
            <span class="dt-sidebar__item-name">Virtual Sports</span>
          </RouterLink>
          <RouterLink to="/promotions" class="dt-sidebar__item dt-sidebar__item--link">
            <span class="dt-sidebar__league-flag">🎁</span>
            <span class="dt-sidebar__item-name">Promotions</span>
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
        <template v-if="!selectedMatch">
        <div class="dt-banner-wrap"><BannerSlider /></div>
        <SportMenu />
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
              <button class="dtmt__odd-btn" :class="{ 'dtmt__odd-btn--hot': getMaxOdd(match) === match.markets.home }" @click.stop="addOdd(match,'1',match.markets.home)">
                <span class="dtmt__odd-inner">
                  <img v-if="getMaxOdd(match) === match.markets.home" src="https://uxwing.com/wp-content/themes/uxwing/download/e-commerce-currency-shopping/hot-icon.png" class="dtmt__flame" />
                  {{ match.markets.home }}
                </span>
              </button>
              <button class="dtmt__odd-btn" :class="{ 'dtmt__odd-btn--na': !match.markets.draw, 'dtmt__odd-btn--hot': match.markets.draw && getMaxOdd(match) === match.markets.draw }" @click.stop="match.markets.draw && addOdd(match,'X',match.markets.draw)">
                <span class="dtmt__odd-inner">
                  <img v-if="match.markets.draw && getMaxOdd(match) === match.markets.draw" src="https://uxwing.com/wp-content/themes/uxwing/download/e-commerce-currency-shopping/hot-icon.png" class="dtmt__flame" />
                  {{ match.markets.draw ?? '-' }}
                </span>
              </button>
              <button class="dtmt__odd-btn" :class="{ 'dtmt__odd-btn--hot': getMaxOdd(match) === match.markets.away }" @click.stop="addOdd(match,'2',match.markets.away)">
                <span class="dtmt__odd-inner">
                  <img v-if="getMaxOdd(match) === match.markets.away" src="https://uxwing.com/wp-content/themes/uxwing/download/e-commerce-currency-shopping/hot-icon.png" class="dtmt__flame" />
                  {{ match.markets.away }}
                </span>
              </button>
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
              <button class="dtmt__odd-btn" :class="{ 'dtmt__odd-btn--hot': getMaxOdd(match) === match.markets.home }" @click.stop="addOdd(match,'1',match.markets.home)">
                <span class="dtmt__odd-inner">
                  <img v-if="getMaxOdd(match) === match.markets.home" src="https://uxwing.com/wp-content/themes/uxwing/download/e-commerce-currency-shopping/hot-icon.png" class="dtmt__flame" />
                  {{ match.markets.home }}
                </span>
              </button>
              <button class="dtmt__odd-btn" :class="{ 'dtmt__odd-btn--na': !match.markets.draw, 'dtmt__odd-btn--hot': match.markets.draw && getMaxOdd(match) === match.markets.draw }" @click.stop="match.markets.draw && addOdd(match,'X',match.markets.draw)">
                <span class="dtmt__odd-inner">
                  <img v-if="match.markets.draw && getMaxOdd(match) === match.markets.draw" src="https://uxwing.com/wp-content/themes/uxwing/download/e-commerce-currency-shopping/hot-icon.png" class="dtmt__flame" />
                  {{ match.markets.draw ?? '-' }}
                </span>
              </button>
              <button class="dtmt__odd-btn" :class="{ 'dtmt__odd-btn--hot': getMaxOdd(match) === match.markets.away }" @click.stop="addOdd(match,'2',match.markets.away)">
                <span class="dtmt__odd-inner">
                  <img v-if="getMaxOdd(match) === match.markets.away" src="https://uxwing.com/wp-content/themes/uxwing/download/e-commerce-currency-shopping/hot-icon.png" class="dtmt__flame" />
                  {{ match.markets.away }}
                </span>
              </button>
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

        <!-- ── WORLD CUP 2026 FIXTURES ── -->
        <div class="section dt-only" v-show="['Football','World Cup'].includes(store.activeSport)">
          <div class="section-header">
            <div class="section-title">🌍 World Cup 2026</div>
            <span class="section-more">See All ›</span>
          </div>
          <div class="dt-match-table">
            <div class="dtmt__head">
              <div class="dtmt__col-match">Match</div>
              <div class="dtmt__col-odd">1</div><div class="dtmt__col-odd">X</div><div class="dtmt__col-odd">2</div>
              <div class="dtmt__col-odd">1X</div><div class="dtmt__col-odd">X2</div><div class="dtmt__col-odd">12</div>
            </div>
            <div v-for="m in wcMatches" :key="m.id" class="dtmt__row" @click="addOdd(m,'1',m.markets.home)">
              <div class="dtmt__col-match">
                <div class="dtmt__league">{{ m.league }}</div>
                <div class="dtmt__teams">
                  <span class="dtmt__team-name">{{ m.homeTeam }}</span>
                  <span class="dtmt__vs">vs</span>
                  <span class="dtmt__team-name">{{ m.awayTeam }}</span>
                </div>
                <div class="dtmt__time">{{ m.startTime }}</div>
              </div>
              <button class="dtmt__odd-btn" @click.stop="addOdd(m,'1',m.markets.home)">{{ m.markets.home }}</button>
              <button class="dtmt__odd-btn" @click.stop="m.markets.draw && addOdd(m,'X',m.markets.draw)">{{ m.markets.draw ?? '-' }}</button>
              <button class="dtmt__odd-btn" @click.stop="addOdd(m,'2',m.markets.away)">{{ m.markets.away }}</button>
              <button class="dtmt__odd-btn" @click.stop="m.markets.draw && addOdd(m,'1X',dc(m.markets.home,m.markets.draw))">{{ dc(m.markets.home,m.markets.draw) }}</button>
              <button class="dtmt__odd-btn" @click.stop="m.markets.draw && addOdd(m,'X2',dc(m.markets.draw,m.markets.away))">{{ dc(m.markets.draw,m.markets.away) }}</button>
              <button class="dtmt__odd-btn" @click.stop="addOdd(m,'12',dc(m.markets.home,m.markets.away))">{{ dc(m.markets.home,m.markets.away) }}</button>
            </div>
          </div>
        </div>

        <!-- ── PREMIER LEAGUE FIXTURES ── -->
        <div class="section dt-only" v-show="store.activeSport === 'Football'">
          <div class="section-header">
            <div class="section-title">🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League</div>
            <span class="section-more">See All ›</span>
          </div>
          <div class="dt-match-table">
            <div class="dtmt__head">
              <div class="dtmt__col-match">Match</div>
              <div class="dtmt__col-odd">1</div><div class="dtmt__col-odd">X</div><div class="dtmt__col-odd">2</div>
              <div class="dtmt__col-odd">1X</div><div class="dtmt__col-odd">X2</div><div class="dtmt__col-odd">12</div>
            </div>
            <div v-for="m in plMatches" :key="m.id" class="dtmt__row">
              <div class="dtmt__col-match">
                <div class="dtmt__league">{{ m.league }}</div>
                <div class="dtmt__teams">
                  <span class="dtmt__team-name">{{ m.homeTeam }}</span>
                  <span class="dtmt__vs">vs</span>
                  <span class="dtmt__team-name">{{ m.awayTeam }}</span>
                </div>
                <div class="dtmt__time">{{ m.startTime }}</div>
              </div>
              <button class="dtmt__odd-btn" @click.stop="addOdd(m,'1',m.markets.home)">{{ m.markets.home }}</button>
              <button class="dtmt__odd-btn" @click.stop="m.markets.draw && addOdd(m,'X',m.markets.draw)">{{ m.markets.draw ?? '-' }}</button>
              <button class="dtmt__odd-btn" @click.stop="addOdd(m,'2',m.markets.away)">{{ m.markets.away }}</button>
              <button class="dtmt__odd-btn" @click.stop="m.markets.draw && addOdd(m,'1X',dc(m.markets.home,m.markets.draw))">{{ dc(m.markets.home,m.markets.draw) }}</button>
              <button class="dtmt__odd-btn" @click.stop="m.markets.draw && addOdd(m,'X2',dc(m.markets.draw,m.markets.away))">{{ dc(m.markets.draw,m.markets.away) }}</button>
              <button class="dtmt__odd-btn" @click.stop="addOdd(m,'12',dc(m.markets.home,m.markets.away))">{{ dc(m.markets.home,m.markets.away) }}</button>
            </div>
          </div>
        </div>

        <!-- ── CHAMPIONS LEAGUE ── -->
        <div class="section dt-only" v-show="store.activeSport === 'Football'">
          <div class="section-header">
            <div class="section-title">🇪🇺 Champions League</div>
            <span class="section-more">See All ›</span>
          </div>
          <div class="dt-match-table">
            <div class="dtmt__head">
              <div class="dtmt__col-match">Match</div>
              <div class="dtmt__col-odd">1</div><div class="dtmt__col-odd">X</div><div class="dtmt__col-odd">2</div>
              <div class="dtmt__col-odd">1X</div><div class="dtmt__col-odd">X2</div><div class="dtmt__col-odd">12</div>
            </div>
            <div v-for="m in uclMatches" :key="m.id" class="dtmt__row">
              <div class="dtmt__col-match">
                <div class="dtmt__league">{{ m.league }}</div>
                <div class="dtmt__teams">
                  <span class="dtmt__team-name">{{ m.homeTeam }}</span>
                  <span class="dtmt__vs">vs</span>
                  <span class="dtmt__team-name">{{ m.awayTeam }}</span>
                </div>
                <div class="dtmt__time">{{ m.startTime }}</div>
              </div>
              <button class="dtmt__odd-btn" @click.stop="addOdd(m,'1',m.markets.home)">{{ m.markets.home }}</button>
              <button class="dtmt__odd-btn" @click.stop="m.markets.draw && addOdd(m,'X',m.markets.draw)">{{ m.markets.draw ?? '-' }}</button>
              <button class="dtmt__odd-btn" @click.stop="addOdd(m,'2',m.markets.away)">{{ m.markets.away }}</button>
              <button class="dtmt__odd-btn" @click.stop="m.markets.draw && addOdd(m,'1X',dc(m.markets.home,m.markets.draw))">{{ dc(m.markets.home,m.markets.draw) }}</button>
              <button class="dtmt__odd-btn" @click.stop="m.markets.draw && addOdd(m,'X2',dc(m.markets.draw,m.markets.away))">{{ dc(m.markets.draw,m.markets.away) }}</button>
              <button class="dtmt__odd-btn" @click.stop="addOdd(m,'12',dc(m.markets.home,m.markets.away))">{{ dc(m.markets.home,m.markets.away) }}</button>
            </div>
          </div>
        </div>

        <!-- ── BASKETBALL NBA ── -->
        <div class="section dt-only" v-show="store.activeSport === 'Basketball'">
          <div class="section-header">
            <div class="section-title">🏀 Basketball — NBA</div>
            <span class="section-more">See All ›</span>
          </div>
          <div class="dt-match-table">
            <div class="dtmt__head">
              <div class="dtmt__col-match">Match</div>
              <div class="dtmt__col-odd">1</div><div class="dtmt__col-odd">X</div><div class="dtmt__col-odd">2</div>
              <div class="dtmt__col-odd">HDP</div><div class="dtmt__col-odd">O2.5</div><div class="dtmt__col-odd">U2.5</div>
            </div>
            <div v-for="m in nbaMatches" :key="m.id" class="dtmt__row">
              <div class="dtmt__col-match">
                <div class="dtmt__league">{{ m.league }}</div>
                <div class="dtmt__teams">
                  <span class="dtmt__team-name">{{ m.homeTeam }}</span>
                  <span class="dtmt__vs">vs</span>
                  <span class="dtmt__team-name">{{ m.awayTeam }}</span>
                </div>
                <div class="dtmt__time">{{ m.startTime }}</div>
              </div>
              <button class="dtmt__odd-btn" @click.stop="addOdd(m,'1',m.markets.home)">{{ m.markets.home }}</button>
              <button class="dtmt__odd-btn dtmt__odd-btn--na">-</button>
              <button class="dtmt__odd-btn" @click.stop="addOdd(m,'2',m.markets.away)">{{ m.markets.away }}</button>
              <button class="dtmt__odd-btn" @click.stop="addOdd(m,'HDP',m.markets.hdp ?? 1.90)">{{ m.markets.hdp ?? '1.90' }}</button>
              <button class="dtmt__odd-btn" @click.stop="addOdd(m,'O2.5',m.markets.over ?? 1.85)">{{ m.markets.over ?? '1.85' }}</button>
              <button class="dtmt__odd-btn" @click.stop="addOdd(m,'U2.5',m.markets.under ?? 1.95)">{{ m.markets.under ?? '1.95' }}</button>
            </div>
          </div>
        </div>

        <!-- ── UGANDA PREMIER LEAGUE ── -->
        <div class="section dt-only" v-show="store.activeSport === 'Football'">
          <div class="section-header">
            <div class="section-title">🇺🇬 Uganda Premier League</div>
            <span class="section-more">See All ›</span>
          </div>
          <div class="dt-match-table">
            <div class="dtmt__head">
              <div class="dtmt__col-match">Match</div>
              <div class="dtmt__col-odd">1</div><div class="dtmt__col-odd">X</div><div class="dtmt__col-odd">2</div>
              <div class="dtmt__col-odd">1X</div><div class="dtmt__col-odd">X2</div><div class="dtmt__col-odd">12</div>
            </div>
            <div v-for="m in uplMatches" :key="m.id" class="dtmt__row">
              <div class="dtmt__col-match">
                <div class="dtmt__league">{{ m.league }}</div>
                <div class="dtmt__teams">
                  <span class="dtmt__team-name">{{ m.homeTeam }}</span>
                  <span class="dtmt__vs">vs</span>
                  <span class="dtmt__team-name">{{ m.awayTeam }}</span>
                </div>
                <div class="dtmt__time">{{ m.startTime }}</div>
              </div>
              <button class="dtmt__odd-btn" @click.stop="addOdd(m,'1',m.markets.home)">{{ m.markets.home }}</button>
              <button class="dtmt__odd-btn" @click.stop="m.markets.draw && addOdd(m,'X',m.markets.draw)">{{ m.markets.draw ?? '-' }}</button>
              <button class="dtmt__odd-btn" @click.stop="addOdd(m,'2',m.markets.away)">{{ m.markets.away }}</button>
              <button class="dtmt__odd-btn" @click.stop="m.markets.draw && addOdd(m,'1X',dc(m.markets.home,m.markets.draw))">{{ dc(m.markets.home,m.markets.draw) }}</button>
              <button class="dtmt__odd-btn" @click.stop="m.markets.draw && addOdd(m,'X2',dc(m.markets.draw,m.markets.away))">{{ dc(m.markets.draw,m.markets.away) }}</button>
              <button class="dtmt__odd-btn" @click.stop="addOdd(m,'12',dc(m.markets.home,m.markets.away))">{{ dc(m.markets.home,m.markets.away) }}</button>
            </div>
          </div>
        </div>
        <!-- ── TENNIS ── -->
        <div class="section dt-only" v-show="['Tennis','Table Tennis'].includes(store.activeSport)">
          <div class="section-header">
            <div class="section-title">🎾 {{ store.activeSport }} — ATP Tour</div>
            <span class="section-more">See All ›</span>
          </div>
          <div class="dt-match-table">
            <div class="dtmt__head">
              <div class="dtmt__col-match">Match</div>
              <div class="dtmt__col-odd">1</div><div class="dtmt__col-odd">2</div>
              <div class="dtmt__col-odd">HDP</div><div class="dtmt__col-odd">O3.5</div><div class="dtmt__col-odd">U3.5</div><div class="dtmt__col-odd">-</div>
            </div>
            <div v-for="m in tennisMatches" :key="m.id" class="dtmt__row">
              <div class="dtmt__col-match">
                <div class="dtmt__league">{{ m.league }}</div>
                <div class="dtmt__teams">
                  <span class="dtmt__team-name">{{ m.homeTeam }}</span>
                  <span class="dtmt__vs">vs</span>
                  <span class="dtmt__team-name">{{ m.awayTeam }}</span>
                </div>
                <div class="dtmt__time">{{ m.startTime }}</div>
              </div>
              <button class="dtmt__odd-btn" @click.stop="addOdd(m,'1',m.markets.home)">{{ m.markets.home }}</button>
              <button class="dtmt__odd-btn" @click.stop="addOdd(m,'2',m.markets.away)">{{ m.markets.away }}</button>
              <button class="dtmt__odd-btn" @click.stop="addOdd(m,'HDP',m.markets.hdp)">{{ m.markets.hdp }}</button>
              <button class="dtmt__odd-btn" @click.stop="addOdd(m,'O3.5',m.markets.over)">{{ m.markets.over }}</button>
              <button class="dtmt__odd-btn" @click.stop="addOdd(m,'U3.5',m.markets.under)">{{ m.markets.under }}</button>
              <button class="dtmt__odd-btn dtmt__odd-btn--na">-</button>
            </div>
          </div>
        </div>

        <!-- ── VOLLEYBALL ── -->
        <div class="section dt-only" v-show="['Volleyball','Handball'].includes(store.activeSport)">
          <div class="section-header">
            <div class="section-title">🏐 {{ store.activeSport }} — International</div>
            <span class="section-more">See All ›</span>
          </div>
          <div class="dt-match-table">
            <div class="dtmt__head">
              <div class="dtmt__col-match">Match</div>
              <div class="dtmt__col-odd">1</div><div class="dtmt__col-odd">2</div>
              <div class="dtmt__col-odd">HDP</div><div class="dtmt__col-odd">O4.5</div><div class="dtmt__col-odd">U4.5</div><div class="dtmt__col-odd">-</div>
            </div>
            <div v-for="m in volleyMatches" :key="m.id" class="dtmt__row">
              <div class="dtmt__col-match">
                <div class="dtmt__league">{{ m.league }}</div>
                <div class="dtmt__teams">
                  <span class="dtmt__team-name">{{ m.homeTeam }}</span>
                  <span class="dtmt__vs">vs</span>
                  <span class="dtmt__team-name">{{ m.awayTeam }}</span>
                </div>
                <div class="dtmt__time">{{ m.startTime }}</div>
              </div>
              <button class="dtmt__odd-btn" @click.stop="addOdd(m,'1',m.markets.home)">{{ m.markets.home }}</button>
              <button class="dtmt__odd-btn" @click.stop="addOdd(m,'2',m.markets.away)">{{ m.markets.away }}</button>
              <button class="dtmt__odd-btn" @click.stop="addOdd(m,'HDP',m.markets.hdp)">{{ m.markets.hdp }}</button>
              <button class="dtmt__odd-btn" @click.stop="addOdd(m,'O4.5',m.markets.over)">{{ m.markets.over }}</button>
              <button class="dtmt__odd-btn" @click.stop="addOdd(m,'U4.5',m.markets.under)">{{ m.markets.under }}</button>
              <button class="dtmt__odd-btn dtmt__odd-btn--na">-</button>
            </div>
          </div>
        </div>

        <!-- ── ICE HOCKEY ── -->
        <div class="section dt-only" v-show="store.activeSport === 'Ice Hockey'">
          <div class="section-header">
            <div class="section-title">🏒 Ice Hockey — NHL</div>
            <span class="section-more">See All ›</span>
          </div>
          <div class="dt-match-table">
            <div class="dtmt__head">
              <div class="dtmt__col-match">Match</div>
              <div class="dtmt__col-odd">1</div><div class="dtmt__col-odd">X</div><div class="dtmt__col-odd">2</div>
              <div class="dtmt__col-odd">1X</div><div class="dtmt__col-odd">X2</div><div class="dtmt__col-odd">12</div>
            </div>
            <div v-for="m in iceHockeyMatches" :key="m.id" class="dtmt__row">
              <div class="dtmt__col-match">
                <div class="dtmt__league">{{ m.league }}</div>
                <div class="dtmt__teams">
                  <span class="dtmt__team-name">{{ m.homeTeam }}</span>
                  <span class="dtmt__vs">vs</span>
                  <span class="dtmt__team-name">{{ m.awayTeam }}</span>
                </div>
                <div class="dtmt__time">{{ m.startTime }}</div>
              </div>
              <button class="dtmt__odd-btn" @click.stop="addOdd(m,'1',m.markets.home)">{{ m.markets.home }}</button>
              <button class="dtmt__odd-btn" @click.stop="m.markets.draw && addOdd(m,'X',m.markets.draw)">{{ m.markets.draw ?? '-' }}</button>
              <button class="dtmt__odd-btn" @click.stop="addOdd(m,'2',m.markets.away)">{{ m.markets.away }}</button>
              <button class="dtmt__odd-btn" @click.stop="m.markets.draw && addOdd(m,'1X',dc(m.markets.home,m.markets.draw))">{{ dc(m.markets.home,m.markets.draw) }}</button>
              <button class="dtmt__odd-btn" @click.stop="m.markets.draw && addOdd(m,'X2',dc(m.markets.draw,m.markets.away))">{{ dc(m.markets.draw,m.markets.away) }}</button>
              <button class="dtmt__odd-btn" @click.stop="addOdd(m,'12',dc(m.markets.home,m.markets.away))">{{ dc(m.markets.home,m.markets.away) }}</button>
            </div>
          </div>
        </div>

        <!-- ── OTHER SPORTS PLACEHOLDER ── -->
        <div class="section dt-only" v-show="!['Football','World Cup','Basketball','Tennis','Table Tennis','Volleyball','Handball','Ice Hockey'].includes(store.activeSport)">
          <div style="text-align:center;padding:40px 20px;color:#9599a4;">
            <div style="font-size:32px;margin-bottom:10px;">⚽</div>
            <div style="font-weight:700;font-size:14px;color:#292a33;margin-bottom:6px;">{{ store.activeSport }} markets loading…</div>
            <div style="font-size:12px;">More {{ store.activeSport }} fixtures will appear here shortly.</div>
          </div>
        </div>

        </template>
        <MatchDetailPanel v-else :match="(selectedMatch as any)" @close="selectedMatch = null" />
      </main>

      <!-- RIGHT BETSLIP PANEL -->
      <aside class="dt-right">
        <!-- Betslip widget -->
        <div class="dt-bs">
          <div class="dt-bs__header">
            <button class="dt-bs__tab" :class="{ active: betslipTab === 'slip' }" @click="betslipTab = 'slip'">🎟 Bet Slip</button>
            <button class="dt-bs__tab" :class="{ active: betslipTab === 'mybets' }" @click="betslipTab = 'mybets'">My Bets <span v-if="store.myBets.length" class="dt-bs__mybets-count">{{ store.myBets.length }}</span></button>
          </div>

          <!-- BET SLIP TAB -->
          <template v-if="betslipTab === 'slip'">
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
          </template>

          <!-- MY BETS TAB -->
          <template v-else>
            <div v-if="store.myBets.length === 0" class="dt-bs__empty">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="36" height="36"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
              <p>No bets placed yet</p>
            </div>
            <div v-else class="dt-mybets-list">
              <div v-for="b in store.myBets" :key="b.id" class="dt-mybet">
                <div class="dt-mybet__head">
                  <span class="dt-mybet__date">{{ b.date }}</span>
                  <span class="dt-mybet__status" :class="`dt-mybet__status--${b.status}`">{{ b.status }}</span>
                </div>
                <div v-for="sel in b.selections" :key="sel.market" class="dt-mybet__sel">
                  <div class="dt-mybet__sel-team">{{ sel.team }}</div>
                  <div class="dt-mybet__sel-row">
                    <span class="dt-mybet__sel-mkt">{{ sel.market }}</span>
                    <span class="dt-mybet__sel-odds">@ {{ sel.odds }}</span>
                  </div>
                </div>
                <div class="dt-mybet__footer">
                  <span>Stake: <strong>UGX {{ b.stake.toLocaleString() }}</strong></span>
                  <span>To Win: <strong class="win">UGX {{ b.potentialWin.toLocaleString() }}</strong></span>
                </div>
              </div>
            </div>
          </template>
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
          <div v-for="m in store.liveMatches" :key="m.id" class="dt-livescores__row" @click="openMatch(m)">
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

        <!-- Today's Tips widget -->
        <div class="dt-tips">
          <div class="dt-tips__head">🎯 Today's Tips</div>
          <div v-for="t in todaysTips" :key="t.match" class="dt-tips__item">
            <div class="dt-tips__match">{{ t.match }}</div>
            <div class="dt-tips__row">
              <span class="dt-tips__pick">{{ t.pick }}</span>
              <span class="dt-tips__odds">{{ t.odds }}</span>
            </div>
            <div class="dt-tips__confidence">
              <span class="dt-tips__conf-label">Confidence</span>
              <div class="dt-tips__conf-bar">
                <div class="dt-tips__conf-fill" :style="{ width: t.confidence + '%', background: t.confidence >= 75 ? '#10a310' : t.confidence >= 55 ? '#f59e0b' : '#e04040' }"></div>
              </div>
              <span class="dt-tips__conf-pct">{{ t.confidence }}%</span>
            </div>
          </div>
        </div>

        <!-- Recent Results widget -->
        <div class="dt-results">
          <div class="dt-results__head">📋 Recent Results</div>
          <div v-for="r in recentResults" :key="r.match" class="dt-results__item">
            <div class="dt-results__teams">
              <span>{{ r.home }}</span>
              <span class="dt-results__score-box">{{ r.score }}</span>
              <span>{{ r.away }}</span>
            </div>
            <div class="dt-results__meta">{{ r.league }} · {{ r.time }}</div>
          </div>
        </div>

        <!-- Casino Highlights widget -->
        <div class="dt-casino-widget">
          <div class="dt-casino-widget__head">🎰 Casino Highlights</div>
          <div v-for="g in casinoHighlights" :key="g.name" class="dt-casino-widget__item" @click="$router.push('/casino')">
            <span class="dt-casino-widget__emoji">{{ g.emoji }}</span>
            <div class="dt-casino-widget__info">
              <div class="dt-casino-widget__name">{{ g.name }}</div>
              <div class="dt-casino-widget__players">{{ g.players }} playing now</div>
            </div>
            <span class="dt-casino-widget__hot" v-if="g.hot">🔥</span>
          </div>
          <button class="dt-casino-widget__cta" @click="$router.push('/casino')">Play Casino →</button>
        </div>

        <!-- Jackpot countdown widget -->
        <div class="dt-jackpot-widget">
          <div class="dt-jackpot-widget__head">🏆 Next Jackpot Draw</div>
          <div class="dt-jackpot-widget__prize">UGX 856,241,380</div>
          <div class="dt-jackpot-widget__label">Gold Jackpot Pool</div>
          <div class="dt-jackpot-widget__timer">
            <div class="dt-jackpot-widget__unit"><span class="dt-jackpot-widget__num">02</span><span class="dt-jackpot-widget__lbl">HRS</span></div>
            <span class="dt-jackpot-widget__sep">:</span>
            <div class="dt-jackpot-widget__unit"><span class="dt-jackpot-widget__num">37</span><span class="dt-jackpot-widget__lbl">MIN</span></div>
            <span class="dt-jackpot-widget__sep">:</span>
            <div class="dt-jackpot-widget__unit"><span class="dt-jackpot-widget__num">14</span><span class="dt-jackpot-widget__lbl">SEC</span></div>
          </div>
          <button class="dt-jackpot-widget__btn" @click="$router.push('/jackpot')">Join Jackpot</button>
        </div>

        <!-- App Download Banner -->
        <div class="dt-app-banner">
          <div class="dt-app-banner__icon">📱</div>
          <div class="dt-app-banner__text">
            <div class="dt-app-banner__title">Get the Bangbet App</div>
            <div class="dt-app-banner__sub">Bet anytime, anywhere</div>
          </div>
          <button class="dt-app-banner__btn">Download</button>
        </div>
      </aside>
    </div>

    <!-- ══════════════════════ FULL-WIDTH DARK FOOTER ══════════════════════ -->
    <footer class="site-footer-full">
      <div class="sff__top">
        <div class="sff__brand">
          <img :src="'/static/img/Logo_HomeFooter_Bangbet.db450bf.png'" alt="Bangbet" class="sff__logo" onerror="this.style.display='none'" />
          <p class="sff__tagline">Uganda's #1 Sports Betting & Casino Platform</p>
          <div class="sff__social">
            <a href="#" class="sff__social-btn" aria-label="Facebook">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            <a href="#" class="sff__social-btn" aria-label="Twitter">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
            </a>
            <a href="#" class="sff__social-btn" aria-label="Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
            </a>
            <a href="#" class="sff__social-btn" aria-label="TikTok">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.79 1.52V6.76a4.85 4.85 0 0 1-1.02-.07z"/></svg>
            </a>
            <a href="#" class="sff__social-btn" aria-label="WhatsApp">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M11.999 2C6.477 2 2 6.477 2 12c0 1.89.522 3.655 1.427 5.166L2 22l4.975-1.303A9.946 9.946 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 11.999 2z"/></svg>
            </a>
          </div>
        </div>

        <div class="sff__links">
          <div class="sff__col">
            <div class="sff__col-head">Sports</div>
            <a href="#" class="sff__link">Football</a>
            <a href="#" class="sff__link">Basketball</a>
            <a href="#" class="sff__link">Tennis</a>
            <a href="#" class="sff__link">Cricket</a>
            <a href="#" class="sff__link">Ice Hockey</a>
            <a href="#" class="sff__link">Volleyball</a>
          </div>
          <div class="sff__col">
            <div class="sff__col-head">Games</div>
            <RouterLink to="/casino" class="sff__link">Live Casino</RouterLink>
            <RouterLink to="/jackpot" class="sff__link">Jackpot</RouterLink>
            <RouterLink to="/sports/virtuals" class="sff__link">Virtuals</RouterLink>
            <a href="#" class="sff__link">Pick 12</a>
            <a href="#" class="sff__link">Lucky 777</a>
            <a href="#" class="sff__link">EKIVULU</a>
          </div>
          <div class="sff__col">
            <div class="sff__col-head">Account</div>
            <a href="#" class="sff__link">My Profile</a>
            <a href="#" class="sff__link">Deposit</a>
            <a href="#" class="sff__link">Withdraw</a>
            <a href="#" class="sff__link">Transaction History</a>
            <a href="#" class="sff__link">My Bets</a>
            <a href="#" class="sff__link">Promotions</a>
          </div>
          <div class="sff__col">
            <div class="sff__col-head">Help & Legal</div>
            <a href="#" class="sff__link">How to Bet</a>
            <a href="#" class="sff__link">FAQs</a>
            <a href="#" class="sff__link">Live Chat Support</a>
            <a href="#" class="sff__link">Terms & Conditions</a>
            <a href="#" class="sff__link">Privacy Policy</a>
            <a href="#" class="sff__link">Responsible Gaming</a>
          </div>
        </div>
      </div>

      <div class="sff__partners">
        <span class="sff__partner-label">Payment Methods</span>
        <div class="sff__partner-chips">
          <span class="sff__chip">📱 MTN Mobile Money</span>
          <span class="sff__chip">📱 Airtel Money</span>
          <span class="sff__chip">💳 Visa</span>
          <span class="sff__chip">💳 Mastercard</span>
          <span class="sff__chip">🏦 Bank Transfer</span>
        </div>
      </div>

      <div class="sff__bottom">
        <div class="sff__badges">
          <span class="sff__badge sff__badge--age">18+</span>
          <span class="sff__badge">NGB Licensed</span>
          <span class="sff__badge">GamCare</span>
          <span class="sff__badge">SSL Secured</span>
          <span class="sff__badge">Responsible Gaming</span>
        </div>
        <p class="sff__legal">
          Bangbet is licensed and regulated by the National Gaming Board of Uganda (NGB). Gambling is for adults 18 years and above only.
          Gambling can be addictive — please play responsibly. If you need help, call the NGB Helpline: <strong>0800 100 066</strong> (toll free).
        </p>
        <p class="sff__copyright">© {{ new Date().getFullYear() }} Bangbet. All rights reserved.</p>
      </div>
    </footer>

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

const betslipTab = ref<'slip' | 'mybets'>('slip');

function placeBet() {
  if (!stakeAmount.value || Number(stakeAmount.value) < 500) {
    alert('Minimum stake is UGX 500');
    return;
  }
  store.saveBet([...store.betslip], Number(stakeAmount.value), totalOdds.value);
  alert(`Bet placed! Potential win: UGX ${potentialWin.value}`);
  store.betslip.splice(0);
  showBetslip.value = false;
  stakeAmount.value = 1000;
  betslipTab.value = 'mybets';
}

function getMaxOdd(match: any): number {
  const odds = [match.markets.home, match.markets.draw, match.markets.away].filter((v): v is number => v != null);
  return Math.max(...odds);
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

const moreSports = [
  { icon: '🏐', name: 'Handball',        count: 12 },
  { icon: '🏉', name: 'Rugby',           count: 8  },
  { icon: '🥊', name: 'Boxing / MMA',   count: 5  },
  { icon: '⛳', name: 'Golf',            count: 3  },
  { icon: '🏏', name: 'Table Tennis',   count: 22 },
  { icon: '🎱', name: 'Snooker',        count: 7  },
  { icon: '🏈', name: 'Am. Football',   count: 6  },
  { icon: '🏇', name: 'Horse Racing',   count: 14 },
];

const popularComps = [
  { flag: '🇺🇬', name: 'Uganda Premier League', live: true  },
  { flag: '🇪🇺', name: 'UEFA Europa League',    live: true  },
  { flag: '🇧🇷', name: 'Brasileirão',            live: false },
  { flag: '🇫🇷', name: 'Ligue 1',               live: false },
  { flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', name: 'Scottish Premiership',  live: false },
  { flag: '🌍', name: 'AFCON Qualifiers',        live: true  },
  { flag: '🌎', name: 'CONCACAF Nations',        live: false },
];

const todaysTips = [
  { match: 'Arsenal vs Chelsea',        pick: 'Arsenal Win',  odds: '1.85', confidence: 78 },
  { match: 'Real Madrid vs Atletico',   pick: 'Both Score',   odds: '1.72', confidence: 65 },
  { match: 'Man City vs Liverpool',     pick: 'Over 2.5',     odds: '1.64', confidence: 82 },
  { match: 'AC Milan vs Inter',         pick: 'Draw',         odds: '3.10', confidence: 51 },
];

const recentResults = [
  { home: 'KCCA FC',   score: '2 - 1', away: 'Express FC', league: 'UPL',      time: 'FT' },
  { home: 'Barcelona', score: '3 - 0', away: 'Sevilla',    league: 'La Liga',  time: 'FT' },
  { home: 'Bayern',    score: '1 - 1', away: 'Dortmund',   league: 'Bundesliga', time: 'FT' },
  { home: 'PSG',       score: '4 - 1', away: 'Lyon',       league: 'Ligue 1',  time: 'FT' },
  { home: 'Juventus',  score: '0 - 2', away: 'Napoli',     league: 'Serie A',  time: 'FT' },
];

const casinoHighlights = [
  { emoji: '🎰', name: 'Mega Fortune Slots',  players: '1,240', hot: true  },
  { emoji: '🃏', name: 'Live Blackjack VIP',  players: '876',   hot: false },
  { emoji: '🎡', name: 'Lightning Roulette',  players: '2,105', hot: true  },
  { emoji: '🎲', name: 'Crash Multiplier',    players: '3,421', hot: true  },
  { emoji: '🎴', name: 'Teen Patti Live',     players: '598',   hot: false },
];

const wcMatches = [
  { id:'wc1', league:'FIFA World Cup 2026 · Group A', homeTeam:'Uganda',    awayTeam:'Morocco',    startTime:'Today 18:00', markets:{ home:4.50, draw:3.20, away:1.75 } },
  { id:'wc2', league:'FIFA World Cup 2026 · Group B', homeTeam:'Senegal',   awayTeam:'Ghana',      startTime:'Today 20:30', markets:{ home:2.10, draw:3.00, away:3.20 } },
  { id:'wc3', league:'FIFA World Cup 2026 · Group C', homeTeam:'Nigeria',   awayTeam:'Cameroon',   startTime:'Today 21:00', markets:{ home:1.95, draw:3.10, away:3.60 } },
  { id:'wc4', league:'FIFA World Cup 2026 · Group D', homeTeam:'Egypt',     awayTeam:'Algeria',    startTime:'Tomorrow 17:00', markets:{ home:2.30, draw:2.90, away:2.80 } },
  { id:'wc5', league:'FIFA World Cup 2026 · Group E', homeTeam:'Brazil',    awayTeam:'Argentina',  startTime:'Tomorrow 20:00', markets:{ home:2.05, draw:3.20, away:3.10 } },
  { id:'wc6', league:'FIFA World Cup 2026 · Group F', homeTeam:'France',    awayTeam:'Germany',    startTime:'Tomorrow 21:00', markets:{ home:1.85, draw:3.40, away:3.80 } },
];

const plMatches = [
  { id:'pl1', league:'Premier League · Matchday 38', homeTeam:'Man City',    awayTeam:'Arsenal',    startTime:'Today 14:00', markets:{ home:1.75, draw:3.60, away:4.20 } },
  { id:'pl2', league:'Premier League · Matchday 38', homeTeam:'Liverpool',   awayTeam:'Chelsea',    startTime:'Today 14:00', markets:{ home:1.60, draw:3.80, away:5.00 } },
  { id:'pl3', league:'Premier League · Matchday 38', homeTeam:'Tottenham',   awayTeam:'Man Utd',    startTime:'Today 16:30', markets:{ home:1.90, draw:3.40, away:3.80 } },
  { id:'pl4', league:'Premier League · Matchday 38', homeTeam:'Everton',     awayTeam:'Aston Villa',startTime:'Today 16:30', markets:{ home:2.50, draw:3.10, away:2.60 } },
  { id:'pl5', league:'Premier League · Matchday 38', homeTeam:'Brighton',    awayTeam:'Newcastle',  startTime:'Today 16:30', markets:{ home:2.20, draw:3.20, away:3.00 } },
];

const uclMatches = [
  { id:'ucl1', league:'UEFA Champions League · QF', homeTeam:'Real Madrid',  awayTeam:'Bayern',     startTime:'Wed 21:00', markets:{ home:1.85, draw:3.50, away:3.90 } },
  { id:'ucl2', league:'UEFA Champions League · QF', homeTeam:'PSG',          awayTeam:'Barcelona',  startTime:'Wed 21:00', markets:{ home:2.10, draw:3.20, away:3.30 } },
  { id:'ucl3', league:'UEFA Champions League · QF', homeTeam:'Man City',     awayTeam:'Inter',      startTime:'Thu 21:00', markets:{ home:1.70, draw:3.70, away:4.50 } },
  { id:'ucl4', league:'UEFA Champions League · QF', homeTeam:'Atletico',     awayTeam:'Dortmund',   startTime:'Thu 21:00', markets:{ home:2.20, draw:3.10, away:3.00 } },
];

const nbaMatches = [
  { id:'nba1', league:'NBA · Playoffs', homeTeam:'Lakers',    awayTeam:'Celtics',   startTime:'Today 02:30', markets:{ home:2.10, draw:null, away:1.70, hdp:1.88, over:1.85, under:1.95 } },
  { id:'nba2', league:'NBA · Playoffs', homeTeam:'Warriors',  awayTeam:'Nets',      startTime:'Today 05:00', markets:{ home:1.65, draw:null, away:2.20, hdp:1.90, over:1.82, under:1.98 } },
  { id:'nba3', league:'NBA · Playoffs', homeTeam:'Heat',      awayTeam:'Bucks',     startTime:'Today 05:30', markets:{ home:2.40, draw:null, away:1.55, hdp:1.92, over:1.88, under:1.92 } },
  { id:'nba4', league:'NBA · Playoffs', homeTeam:'76ers',     awayTeam:'Raptors',   startTime:'Tomorrow 02:00', markets:{ home:1.80, draw:null, away:2.00, hdp:1.88, over:1.85, under:1.95 } },
];

const uplMatches = [
  { id:'upl1', league:'Uganda Premier League · GW 28', homeTeam:'Vipers SC',     awayTeam:'KCCA FC',       startTime:'Sat 16:00', markets:{ home:1.95, draw:3.20, away:3.60 } },
  { id:'upl2', league:'Uganda Premier League · GW 28', homeTeam:'SC Villa',      awayTeam:'Express FC',    startTime:'Sat 14:00', markets:{ home:2.30, draw:3.00, away:2.80 } },
  { id:'upl3', league:'Uganda Premier League · GW 28', homeTeam:'Onduparaka',    awayTeam:'URA FC',        startTime:'Sun 14:00', markets:{ home:2.80, draw:2.90, away:2.40 } },
  { id:'upl4', league:'Uganda Premier League · GW 28', homeTeam:'Police FC',     awayTeam:'BUL FC',        startTime:'Sun 16:00', markets:{ home:2.10, draw:3.10, away:3.20 } },
  { id:'upl5', league:'Uganda Premier League · GW 28', homeTeam:'Wakiso Giants', awayTeam:'Mbarara City',  startTime:'Sun 16:00', markets:{ home:1.85, draw:3.30, away:3.80 } },
];

const tennisMatches = [
  { id:'ten1', league:'ATP Roland Garros · R16', homeTeam:'Djokovic, N.',  awayTeam:'Alcaraz, C.',   startTime:'Today 13:00', markets:{ home:1.65, away:2.15, hdp:1.88, over:1.82, under:1.98 } },
  { id:'ten2', league:'ATP Roland Garros · R16', homeTeam:'Sinner, J.',    awayTeam:'Zverev, A.',    startTime:'Today 15:30', markets:{ home:1.55, away:2.40, hdp:1.90, over:1.85, under:1.95 } },
  { id:'ten3', league:'WTA Roland Garros · QF',  homeTeam:'Swiatek, I.',   awayTeam:'Gauff, C.',     startTime:'Today 17:00', markets:{ home:1.45, away:2.65, hdp:1.88, over:1.80, under:2.00 } },
  { id:'ten4', league:'ATP Roland Garros · R16', homeTeam:'Medvedev, D.',  awayTeam:'Tsitsipas, S.', startTime:'Tomorrow 12:00', markets:{ home:1.80, away:1.95, hdp:1.90, over:1.88, under:1.92 } },
  { id:'ten5', league:'ATP Challenger · Final',  homeTeam:'Norrie, C.',    awayTeam:'Wawrinka, S.',  startTime:'Tomorrow 14:00', markets:{ home:1.70, away:2.10, hdp:1.88, over:1.85, under:1.95 } },
];

const volleyMatches = [
  { id:'vol1', league:'CEV Champions League · SF', homeTeam:'Lube Civitanova', awayTeam:'Zenit Kazan',   startTime:'Today 18:00', markets:{ home:1.75, away:2.00, hdp:1.88, over:1.82, under:1.98 } },
  { id:'vol2', league:'CEV Champions League · SF', homeTeam:'Perugia',         awayTeam:'Trentino',      startTime:'Today 20:30', markets:{ home:1.90, away:1.85, hdp:1.88, over:1.85, under:1.95 } },
  { id:'vol3', league:'FIVB Nations League',       homeTeam:'Brazil',           awayTeam:'Poland',        startTime:'Tomorrow 16:00', markets:{ home:1.65, away:2.15, hdp:1.88, over:1.80, under:2.00 } },
  { id:'vol4', league:'FIVB Nations League',       homeTeam:'USA',              awayTeam:'France',        startTime:'Tomorrow 18:00', markets:{ home:1.60, away:2.25, hdp:1.88, over:1.85, under:1.95 } },
];

const iceHockeyMatches = [
  { id:'ih1', league:'NHL Playoffs · Conference Final', homeTeam:'Florida Panthers', awayTeam:'NY Rangers',   startTime:'Today 02:00', markets:{ home:1.80, draw:4.50, away:2.00 } },
  { id:'ih2', league:'NHL Playoffs · Conference Final', homeTeam:'Edmonton Oilers',  awayTeam:'Dallas Stars', startTime:'Today 03:00', markets:{ home:2.05, draw:4.20, away:1.75 } },
  { id:'ih3', league:'KHL · Playoff',                   homeTeam:'CSKA Moscow',      awayTeam:'SKA St. Pete', startTime:'Tomorrow 18:00', markets:{ home:1.70, draw:4.60, away:2.10 } },
  { id:'ih4', league:'NHL Regular',                     homeTeam:'Boston Bruins',    awayTeam:'Toronto Leafs',startTime:'Tomorrow 01:00', markets:{ home:1.75, draw:4.40, away:2.05 } },
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
    height: calc(100vh - 96px);
    align-items: stretch;
    background: #f2f3f5;
    overflow: hidden;
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
    overflow-y: auto;
    overflow-x: hidden;
    min-height: 0;
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
  .dt-center {
    background: #f2f3f5;
    overflow-y: auto;
    overflow-x: hidden;
    min-height: 0;
  }

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
    align-items: center;
    justify-content: center;
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
    padding: 3px 4px;
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
  .dtmt__odd-inner {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    line-height: 1;
  }
  .dtmt__flame {
    width: 14px;
    height: 14px;
    object-fit: contain;
    flex-shrink: 0;
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
    overflow-y: auto;
    overflow-x: hidden;
    min-height: 0;
  }

  /* Betslip panel */
  .dt-bs {
    background: #fff;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 1px 6px rgba(0,0,0,.08);
    flex-shrink: 0;
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
  .dt-bs__mybets-count {
    display: inline-flex; align-items: center; justify-content: center;
    background: #c026d3; color: #fff; font-size: 9px; font-weight: 800;
    border-radius: 8px; padding: 1px 5px; margin-left: 4px; line-height: 1.4;
  }

  /* My Bets list */
  .dt-mybets-list { padding: 8px 10px; display: flex; flex-direction: column; gap: 8px; }
  .dt-mybet {
    border: 1px solid #f0f0f4; border-radius: 8px; overflow: hidden;
    font-size: 11px;
  }
  .dt-mybet__head {
    display: flex; justify-content: space-between; align-items: center;
    padding: 6px 10px; background: #f5f6f9; border-bottom: 1px solid #f0f0f4;
  }
  .dt-mybet__date { color: #6a6f7a; font-size: 10px; }
  .dt-mybet__status {
    font-size: 9px; font-weight: 800; text-transform: uppercase;
    border-radius: 4px; padding: 2px 6px;
  }
  .dt-mybet__status--pending { background: #fff3cd; color: #856404; }
  .dt-mybet__status--won     { background: #d1fae5; color: #065f46; }
  .dt-mybet__status--lost    { background: #fee2e2; color: #991b1b; }
  .dt-mybet__sel { padding: 6px 10px; border-bottom: 1px solid #f5f6f9; }
  .dt-mybet__sel-team { font-weight: 600; color: #292a33; margin-bottom: 2px; }
  .dt-mybet__sel-row { display: flex; justify-content: space-between; }
  .dt-mybet__sel-mkt { color: #6a6f7a; }
  .dt-mybet__sel-odds { font-weight: 700; color: #c026d3; }
  .dt-mybet__footer {
    display: flex; justify-content: space-between;
    padding: 6px 10px; background: #fafafa; font-size: 10px; color: #6a6f7a;
  }
  .dt-mybet__footer .win { color: #10a310; }

  /* Promotions */
  .dt-promo {
    background: #fff; border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 1px 6px rgba(0,0,0,.06);
    flex-shrink: 0;
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
    flex-shrink: 0;
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

  /* ── LEFT SIDEBAR: live chip ── */
  .dt-sidebar__live-chip {
    font-size: 8px; font-weight: 800; color: #fff;
    background: #e04040; border-radius: 4px; padding: 1px 4px;
    letter-spacing: .4px; flex-shrink: 0;
  }
  .dt-sidebar__item--link { color: #444; }

  /* ── LEFT SIDEBAR: responsible gaming block ── */
  .dt-sidebar__resp {
    margin: 8px 10px 12px;
    background: #f5f6f9;
    border-radius: 8px;
    padding: 10px 12px;
    border: 1px solid #e6e7eb;
  }
  .dt-sidebar__resp-title {
    font-size: 10px; font-weight: 800; color: #6a6f7a;
    text-transform: uppercase; letter-spacing: .6px; margin-bottom: 4px;
  }
  .dt-sidebar__resp-text {
    font-size: 10px; color: #9599a4; margin: 0 0 8px; line-height: 1.4;
  }
  .dt-sidebar__resp-logos {
    display: flex; gap: 5px; flex-wrap: wrap;
  }
  .dt-sidebar__resp-badge {
    font-size: 9px; font-weight: 800; color: #6a6f7a;
    border: 1.5px solid #d0d2db; border-radius: 4px;
    padding: 2px 6px; background: #fff;
  }

  /* ── RIGHT: Today's Tips ── */
  .dt-tips {
    background: #fff; border-radius: 10px;
    overflow: hidden; box-shadow: 0 1px 6px rgba(0,0,0,.06);
    flex-shrink: 0;
  }
  .dt-tips__head {
    font-size: 11px; font-weight: 800; color: #292a33;
    padding: 10px 14px; border-bottom: 1px solid #f0f0f4;
    text-transform: uppercase; letter-spacing: .5px;
  }
  .dt-tips__item {
    padding: 9px 14px; border-bottom: 1px solid #f5f6f9;
  }
  .dt-tips__item:last-child { border-bottom: none; }
  .dt-tips__match { font-size: 11px; font-weight: 700; color: #292a33; margin-bottom: 4px; }
  .dt-tips__row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px; }
  .dt-tips__pick {
    font-size: 10px; color: #c026d3; font-weight: 700;
    background: rgba(192,38,211,0.08); border-radius: 4px; padding: 2px 6px;
  }
  .dt-tips__odds {
    font-size: 13px; font-weight: 800; color: #292a33;
  }
  .dt-tips__confidence {
    display: flex; align-items: center; gap: 6px;
  }
  .dt-tips__conf-label { font-size: 9px; color: #9599a4; white-space: nowrap; }
  .dt-tips__conf-bar {
    flex: 1; height: 4px; background: #eee; border-radius: 2px; overflow: hidden;
  }
  .dt-tips__conf-fill { height: 100%; border-radius: 2px; transition: width 0.3s; }
  .dt-tips__conf-pct { font-size: 9px; font-weight: 700; color: #6a6f7a; white-space: nowrap; }

  /* ── RIGHT: Recent Results ── */
  .dt-results {
    background: #fff; border-radius: 10px;
    overflow: hidden; box-shadow: 0 1px 6px rgba(0,0,0,.06);
    flex-shrink: 0;
  }
  .dt-results__head {
    font-size: 11px; font-weight: 800; color: #292a33;
    padding: 10px 14px; border-bottom: 1px solid #f0f0f4;
    text-transform: uppercase; letter-spacing: .5px;
  }
  .dt-results__item {
    padding: 7px 14px; border-bottom: 1px solid #f5f6f9;
  }
  .dt-results__item:last-child { border-bottom: none; }
  .dt-results__teams {
    display: flex; align-items: center; justify-content: space-between;
    font-size: 11px; font-weight: 700; color: #292a33; gap: 6px;
  }
  .dt-results__score-box {
    background: #1e1f28; color: #fff;
    font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 4px;
    white-space: nowrap; flex-shrink: 0;
  }
  .dt-results__meta { font-size: 9px; color: #9599a4; margin-top: 2px; }

  /* ── RIGHT: Casino Highlights ── */
  .dt-casino-widget {
    background: #fff; border-radius: 10px;
    overflow: hidden; box-shadow: 0 1px 6px rgba(0,0,0,.06);
    flex-shrink: 0;
  }
  .dt-casino-widget__head {
    font-size: 11px; font-weight: 800; color: #292a33;
    padding: 10px 14px; border-bottom: 1px solid #f0f0f4;
    text-transform: uppercase; letter-spacing: .5px;
  }
  .dt-casino-widget__item {
    display: flex; align-items: center; gap: 10px;
    padding: 8px 14px; border-bottom: 1px solid #f5f6f9;
    cursor: pointer; transition: background 0.12s;
  }
  .dt-casino-widget__item:hover { background: #fafbfc; }
  .dt-casino-widget__emoji { font-size: 18px; flex-shrink: 0; }
  .dt-casino-widget__info { flex: 1; }
  .dt-casino-widget__name { font-size: 11px; font-weight: 700; color: #292a33; }
  .dt-casino-widget__players { font-size: 9px; color: #9599a4; margin-top: 1px; }
  .dt-casino-widget__hot { font-size: 13px; flex-shrink: 0; }
  .dt-casino-widget__cta {
    display: block; width: calc(100% - 28px); margin: 10px 14px;
    padding: 9px; background: linear-gradient(90deg, #1e1f28, #2d2e3d);
    color: #fff; font-size: 12px; font-weight: 700; border: none;
    border-radius: 7px; cursor: pointer; transition: opacity 0.15s; text-align: center;
  }
  .dt-casino-widget__cta:hover { opacity: 0.85; }

  /* ── RIGHT: Jackpot Countdown ── */
  .dt-jackpot-widget {
    background: linear-gradient(135deg, #1e1f28 0%, #2d1a3a 100%);
    border-radius: 10px; overflow: hidden;
    box-shadow: 0 1px 6px rgba(0,0,0,.15);
    padding: 14px; text-align: center;
    flex-shrink: 0;
  }
  .dt-jackpot-widget__head {
    font-size: 10px; font-weight: 800; color: #d4a843;
    text-transform: uppercase; letter-spacing: .6px; margin-bottom: 6px;
  }
  .dt-jackpot-widget__prize {
    font-size: 16px; font-weight: 900; color: #f5c842;
    margin-bottom: 2px; line-height: 1.2;
  }
  .dt-jackpot-widget__label {
    font-size: 9px; color: #9599a4; margin-bottom: 10px;
  }
  .dt-jackpot-widget__timer {
    display: flex; align-items: center; justify-content: center; gap: 4px;
    margin-bottom: 12px;
  }
  .dt-jackpot-widget__unit {
    display: flex; flex-direction: column; align-items: center;
    background: rgba(255,255,255,0.08); border-radius: 6px; padding: 5px 8px;
    min-width: 38px;
  }
  .dt-jackpot-widget__num { font-size: 18px; font-weight: 900; color: #fff; line-height: 1; }
  .dt-jackpot-widget__lbl { font-size: 8px; color: #9599a4; font-weight: 700; letter-spacing: .4px; margin-top: 2px; }
  .dt-jackpot-widget__sep { font-size: 18px; font-weight: 900; color: #f5c842; margin-bottom: 10px; }
  .dt-jackpot-widget__btn {
    display: block; width: 100%; padding: 10px;
    background: linear-gradient(90deg, #d4a843, #f5c842);
    color: #1e1f28; font-size: 13px; font-weight: 800; border: none;
    border-radius: 7px; cursor: pointer; transition: opacity 0.15s;
  }
  .dt-jackpot-widget__btn:hover { opacity: 0.9; }

  /* ── RIGHT: App Download Banner ── */
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
  .dt-app-banner__sub { font-size: 10px; color: rgba(255,255,255,0.75); margin-top: 1px; }
  .dt-app-banner__btn {
    background: #fff; color: #c026d3;
    font-size: 11px; font-weight: 800; border: none;
    border-radius: 6px; padding: 6px 10px; cursor: pointer;
    white-space: nowrap; flex-shrink: 0;
    transition: opacity 0.15s;
  }
  .dt-app-banner__btn:hover { opacity: 0.9; }

  /* make both sidebars stretch full height */
  .dt-sidebar {
    align-self: stretch;
  }
  .dt-right {
    align-self: stretch;
  }
}

/* ══════════════════════════════════════════════
   FULL-WIDTH DARK FOOTER
══════════════════════════════════════════════ */
.site-footer-full {
  background: #0f1016;
  color: #a0a3b1;
  width: 100%;
  margin-top: 0;
  padding-bottom: env(safe-area-inset-bottom, 0);
}

.sff__top {
  display: flex;
  flex-direction: column;
  gap: 28px;
  padding: 32px 16px 24px;
  border-bottom: 1px solid #1e2030;
}

@media (min-width: 1024px) {
  .sff__top {
    flex-direction: row;
    align-items: flex-start;
    padding: 36px 32px 28px;
    gap: 40px;
  }
}

.sff__brand {
  flex-shrink: 0;
  max-width: 220px;
}
.sff__logo {
  height: 36px;
  object-fit: contain;
  margin-bottom: 10px;
  display: block;
  filter: brightness(0) invert(1);
}
.sff__tagline {
  font-size: 12px;
  color: #6a6f7a;
  line-height: 1.5;
  margin: 0 0 14px;
}
.sff__social {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.sff__social-btn {
  display: flex; align-items: center; justify-content: center;
  width: 34px; height: 34px;
  border-radius: 8px;
  background: #1a1b26;
  color: #a0a3b1;
  border: 1px solid #2a2b38;
  transition: background 0.15s, color 0.15s;
  text-decoration: none;
}
.sff__social-btn:hover {
  background: #c026d3;
  color: #fff;
  border-color: #c026d3;
}

.sff__links {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px 16px;
  flex: 1;
}
@media (min-width: 768px) {
  .sff__links {
    grid-template-columns: repeat(4, 1fr);
  }
}
.sff__col-head {
  font-size: 11px;
  font-weight: 800;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: .8px;
  margin-bottom: 10px;
}
.sff__link {
  display: block;
  font-size: 12px;
  color: #6a6f7a;
  text-decoration: none;
  margin-bottom: 7px;
  transition: color 0.15s;
}
.sff__link:hover { color: #c026d3; }

.sff__partners {
  padding: 18px 16px;
  border-bottom: 1px solid #1e2030;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
@media (min-width: 1024px) {
  .sff__partners {
    flex-direction: row;
    align-items: center;
    padding: 18px 32px;
  }
}
.sff__partner-label {
  font-size: 10px;
  font-weight: 800;
  color: #6a6f7a;
  text-transform: uppercase;
  letter-spacing: .6px;
  white-space: nowrap;
  flex-shrink: 0;
}
.sff__partner-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.sff__chip {
  font-size: 11px;
  font-weight: 600;
  color: #a0a3b1;
  background: #1a1b26;
  border: 1px solid #2a2b38;
  border-radius: 6px;
  padding: 5px 10px;
}

.sff__bottom {
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
}
@media (min-width: 1024px) {
  .sff__bottom {
    padding: 20px 32px;
  }
}
.sff__badges {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
}
.sff__badge {
  font-size: 10px;
  font-weight: 800;
  color: #a0a3b1;
  border: 1.5px solid #2a2b38;
  border-radius: 5px;
  padding: 3px 8px;
  background: #1a1b26;
  letter-spacing: .4px;
}
.sff__badge--age {
  background: #c026d3;
  color: #fff;
  border-color: #c026d3;
}
.sff__legal {
  font-size: 11px;
  color: #4a4d5a;
  line-height: 1.6;
  max-width: 680px;
  margin: 0;
}
.sff__legal strong { color: #6a6f7a; }
.sff__copyright {
  font-size: 11px;
  color: #3a3d4a;
  margin: 0;
}
</style>
