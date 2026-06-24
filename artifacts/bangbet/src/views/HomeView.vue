<template>
  <div class="page">
    <AppHeader />

    <!-- ═══ DESKTOP NAV BAR (hidden on mobile) ═══ -->
    <nav class="dt-topnav">
      <button
        v-for="tab in desktopNavTabs" :key="tab.label"
        class="dt-topnav__tab"
        :class="{ active: tab.active }"
        @click="tab.route && $router.push(tab.route)"
      >
        <span class="dt-topnav__tab-icon" v-html="tab.icon"></span> {{ tab.label }}
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
          <div class="dt-sidebar__head">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="15" r="6"/><path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32"/></svg>
            Sports
          </div>
          <button
            v-for="s in sidebarSports" :key="s.name"
            class="dt-sidebar__item"
            :class="{ active: s.name === store.activeSport && !activeLeague }"
            @click="selectSport(s.name)"
          >
            <img :src="s.icon" class="dt-sidebar__item-icon" onerror="this.style.display='none'" />
            <span class="dt-sidebar__item-name">{{ s.name }}</span>
            <span class="dt-sidebar__item-count">{{ s.count }}</span>
          </button>
        </div>

        <div class="dt-sidebar__section">
          <div class="dt-sidebar__head">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            Top Leagues
          </div>
          <button
            v-for="l in topLeagues"
            :key="l.name"
            class="dt-sidebar__item"
            :class="{ active: activeLeague === l.name }"
            @click="selectLeague(l.name)"
          >
            <span class="dt-sidebar__league-dot"></span>
            <span class="dt-sidebar__item-name">{{ l.name }}</span>
            <span v-if="l.live" class="dt-sidebar__live-chip">LIVE</span>
          </button>
        </div>

        <div class="dt-sidebar__section">
          <div class="dt-sidebar__head">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>
            More Sports
          </div>
          <button
            v-for="s in moreSports"
            :key="s.name"
            class="dt-sidebar__item"
            :class="{ active: s.name === store.activeSport && !activeLeague }"
            @click="selectSport(s.name)"
          >
            <img :src="s.icon" class="dt-sidebar__item-icon" onerror="this.style.display='none'" />
            <span class="dt-sidebar__item-name">{{ s.name }}</span>
            <span class="dt-sidebar__item-count">{{ s.count }}</span>
          </button>
        </div>

        <div class="dt-sidebar__section">
          <div class="dt-sidebar__head">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Competitions
          </div>
          <button
            v-for="c in popularComps"
            :key="c.name"
            class="dt-sidebar__item"
            :class="{ active: activeLeague === c.name }"
            @click="selectLeague(c.name)"
          >
            <span class="dt-sidebar__league-dot"></span>
            <span class="dt-sidebar__item-name">{{ c.name }}</span>
            <span v-if="c.live" class="dt-sidebar__live-chip">LIVE</span>
          </button>
        </div>

        <div class="dt-sidebar__section">
          <div class="dt-sidebar__head">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            Quick Links
          </div>
          <RouterLink to="/casino" class="dt-sidebar__item dt-sidebar__item--link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="3"/><circle cx="8" cy="8" r="1.5" fill="currentColor" stroke="none"/><circle cx="16" cy="8" r="1.5" fill="currentColor" stroke="none"/><circle cx="8" cy="16" r="1.5" fill="currentColor" stroke="none"/><circle cx="16" cy="16" r="1.5" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none"/></svg>
            <span class="dt-sidebar__item-name">Casino Games</span>
          </RouterLink>
          <RouterLink to="/jackpot" class="dt-sidebar__item dt-sidebar__item--link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/></svg>
            <span class="dt-sidebar__item-name">Jackpot</span>
          </RouterLink>
          <RouterLink to="/virtuals" class="dt-sidebar__item dt-sidebar__item--link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="6" y1="12" x2="10" y2="12"/><line x1="8" y1="10" x2="8" y2="14"/><line x1="15" y1="13" x2="15.01" y2="13"/><line x1="18" y1="11" x2="18.01" y2="11"/><path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z"/></svg>
            <span class="dt-sidebar__item-name">Virtual Sports</span>
          </RouterLink>
          <RouterLink to="/promotions" class="dt-sidebar__item dt-sidebar__item--link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>
            <span class="dt-sidebar__item-name">Promotions</span>
          </RouterLink>
        </div>

        <div class="dt-sidebar__resp">
          <div class="dt-sidebar__resp-title">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            Responsible Gaming
          </div>
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

        <!-- ══ BOOSTED MATCHES SECTION ══ -->
        <div class="section">
          <div class="section-header">
            <div class="section-title">
              <span class="boosted-badge">
                <img src="https://uxwing.com/wp-content/themes/uxwing/download/e-commerce-currency-shopping/hot-icon.png" class="boosted-badge__flame" />
                Boosted
              </span>
              Matches
            </div>
            <RouterLink to="/sports/Football" class="section-more mob-only">See All ›</RouterLink>
          </div>

          <!-- ── SKELETON (loading) ── -->
          <template v-if="store.boostedLoading">
            <div class="mob-only">
              <div v-for="i in 4" :key="i" class="skel-card">
                <div class="skel-line skel-line--sm" style="width:55%"></div>
                <div class="skel-teams">
                  <div class="skel-line skel-line--md" style="width:38%"></div>
                  <div class="skel-score-box"></div>
                  <div class="skel-line skel-line--md" style="width:38%"></div>
                </div>
                <div class="skel-odds-row">
                  <div class="skel-odd-btn"></div>
                  <div class="skel-odd-btn"></div>
                  <div class="skel-odd-btn"></div>
                </div>
              </div>
            </div>
            <div class="dt-match-table dt-only">
              <div class="dtmt__head">
                <div class="dtmt__col-match">Match</div>
                <div class="dtmt__col-odd">1</div><div class="dtmt__col-odd">X</div><div class="dtmt__col-odd">2</div>
                <div class="dtmt__col-odd">1X</div><div class="dtmt__col-odd">X2</div><div class="dtmt__col-odd">12</div>
              </div>
              <div v-for="i in 6" :key="i" class="dtmt__row dtmt__row--skel">
                <div class="dtmt__col-match">
                  <div class="skel-line skel-line--sm" style="width:45%;margin-bottom:6px"></div>
                  <div class="skel-line skel-line--lg" style="width:80%;margin-bottom:5px"></div>
                  <div class="skel-line skel-line--sm" style="width:30%"></div>
                </div>
                <div v-for="j in 6" :key="j" class="skel-odd-pill"></div>
              </div>
            </div>
          </template>

          <!-- ── EMPTY STATE ── -->
          <template v-else-if="store.boostedMatches.length === 0">
            <div class="boosted-empty">No boosted matches available right now.</div>
          </template>

          <!-- ── LOADED ── -->
          <template v-else>
            <div class="mob-only">
              <MatchCard v-for="match in store.boostedMatches" :key="match.id" :match="match" />
            </div>
            <!-- Desktop: full 1X2 + DC columns with padlocks -->
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
              <div v-for="match in store.boostedMatches" :key="match.id" class="dtmt__row" @click="openMatch(match)">
                <div class="dtmt__col-match">
                  <div class="dtmt__league">
                    <span v-if="match.isLive" class="dtmt__live-badge">Live</span>
                    <img src="https://uxwing.com/wp-content/themes/uxwing/download/e-commerce-currency-shopping/hot-icon.png" class="dtmt__boosted-pin-img" />
                    <img :src="match.leagueLogo" class="dtmt__league-icon" />
                    {{ match.league }}
                  </div>
                  <div class="dtmt__teams">
                    <span class="dtmt__team-name">{{ match.homeTeam }}</span>
                    <span v-if="match.isLive" class="dtmt__score">{{ match.homeScore ?? 0 }}-{{ match.awayScore ?? 0 }}</span>
                    <span v-else class="dtmt__vs">vs</span>
                    <span class="dtmt__team-name">{{ match.awayTeam }}</span>
                  </div>
                  <div class="dtmt__time">
                    <span v-if="match.isLive"><span class="dtmt__live-min">{{ match.minute ? match.minute + '\'' : match.status }}</span></span>
                    <span v-else>{{ match.startTime }}</span>
                    <span v-if="match.marketsCount" class="dtmt__mkt-count">+{{ match.marketsCount }}</span>
                  </div>
                </div>
                <!-- 1 -->
                <button class="dtmt__odd-btn" :class="{ selected: isDtSel(match,'1'), 'dtmt__odd-btn--na': !match.markets.home || match.markets.home <= 0 }" @click.stop="match.markets.home > 0 && addOdd(match,'1',match.markets.home)">
                  <span class="dtmt__odd-inner">
                    <svg v-if="!match.markets.home || match.markets.home <= 0" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    <template v-else>
                      <img v-if="match.markets.home > 0 && match.markets.home >= (match.markets.draw || 0) && match.markets.home >= (match.markets.away || 0)" src="https://uxwing.com/wp-content/themes/uxwing/download/e-commerce-currency-shopping/hot-icon.png" class="dtmt__flame" />
                      {{ fmtOdd(match.markets.home) }}
                    </template>
                  </span>
                </button>
                <!-- X -->
                <button class="dtmt__odd-btn" :class="{ selected: isDtSel(match,'X'), 'dtmt__odd-btn--na': !match.markets.draw || match.markets.draw <= 0 }" @click.stop="match.markets.draw && match.markets.draw > 0 && addOdd(match,'X',match.markets.draw)">
                  <span class="dtmt__odd-inner">
                    <svg v-if="!match.markets.draw || match.markets.draw <= 0" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    <template v-else>
                      <img v-if="match.markets.draw > 0 && match.markets.draw > match.markets.home && match.markets.draw >= (match.markets.away || 0)" src="https://uxwing.com/wp-content/themes/uxwing/download/e-commerce-currency-shopping/hot-icon.png" class="dtmt__flame" />
                      {{ fmtOdd(match.markets.draw) }}
                    </template>
                  </span>
                </button>
                <!-- 2 -->
                <button class="dtmt__odd-btn" :class="{ selected: isDtSel(match,'2'), 'dtmt__odd-btn--na': !match.markets.away || match.markets.away <= 0 }" @click.stop="match.markets.away > 0 && addOdd(match,'2',match.markets.away)">
                  <span class="dtmt__odd-inner">
                    <svg v-if="!match.markets.away || match.markets.away <= 0" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    <template v-else>
                      <img v-if="match.markets.away > 0 && match.markets.away > match.markets.home && match.markets.away > (match.markets.draw || 0)" src="https://uxwing.com/wp-content/themes/uxwing/download/e-commerce-currency-shopping/hot-icon.png" class="dtmt__flame" />
                      {{ fmtOdd(match.markets.away) }}
                    </template>
                  </span>
                </button>
                <!-- 1X -->
                <button class="dtmt__odd-btn" :class="{ selected: isDtSel(match,'1X'), 'dtmt__odd-btn--na': dc(match.markets.home,match.markets.draw)==='-' }" @click.stop="dc(match.markets.home,match.markets.draw)!=='-' && addOdd(match,'1X',dc(match.markets.home,match.markets.draw))">
                  <svg v-if="dc(match.markets.home,match.markets.draw)==='-'" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  <span v-else>{{ dc(match.markets.home,match.markets.draw) }}</span>
                </button>
                <!-- X2 -->
                <button class="dtmt__odd-btn" :class="{ selected: isDtSel(match,'X2'), 'dtmt__odd-btn--na': dc(match.markets.draw,match.markets.away)==='-' }" @click.stop="dc(match.markets.draw,match.markets.away)!=='-' && addOdd(match,'X2',dc(match.markets.draw,match.markets.away))">
                  <svg v-if="dc(match.markets.draw,match.markets.away)==='-'" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  <span v-else>{{ dc(match.markets.draw,match.markets.away) }}</span>
                </button>
                <!-- 12 -->
                <button class="dtmt__odd-btn" :class="{ selected: isDtSel(match,'12'), 'dtmt__odd-btn--na': dc(match.markets.home,match.markets.away)==='-' }" @click.stop="dc(match.markets.home,match.markets.away)!=='-' && addOdd(match,'12',dc(match.markets.home,match.markets.away))">
                  <svg v-if="dc(match.markets.home,match.markets.away)==='-'" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  <span v-else>{{ dc(match.markets.home,match.markets.away) }}</span>
                </button>
              </div>
            </div>
          </template>
        </div>

        <!-- League filter banner -->
        <div v-if="activeLeague" class="dt-league-filter-bar">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          <span>{{ activeLeague }}</span>
          <button class="dt-league-filter-bar__clear" @click="activeLeague = ''">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="section">
          <div class="section-header">
            <div class="section-title">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              Top Matches
            </div>
            <RouterLink to="/sports/Football" class="section-more mob-only">See All ›</RouterLink>
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
                <div class="dtmt__league"><img :src="match.leagueLogo" class="dtmt__league-icon" />{{ match.league }}</div>
                <div class="dtmt__teams">
                  <span class="dtmt__team-name">{{ match.homeTeam }}</span>
                  <span class="dtmt__vs">vs</span>
                  <span class="dtmt__team-name">{{ match.awayTeam }}</span>
                </div>
                <div class="dtmt__time">{{ match.startTime }}</div>
              </div>
              <button class="dtmt__odd-btn" :class="{ selected: isDtSel(match,'1'), 'dtmt__odd-btn--na': !match.markets.home || match.markets.home <= 0 }" @click.stop="match.markets.home > 0 && addOdd(match,'1',match.markets.home)">
                <span class="dtmt__odd-inner">
                  <img v-if="match.markets.home > 0 && match.markets.home >= (match.markets.draw || 0) && match.markets.home >= (match.markets.away || 0)" src="https://uxwing.com/wp-content/themes/uxwing/download/e-commerce-currency-shopping/hot-icon.png" class="dtmt__flame" />
                  {{ fmtOdd(match.markets.home) }}
                </span>
              </button>
              <button class="dtmt__odd-btn" :class="{ selected: isDtSel(match,'X'), 'dtmt__odd-btn--na': !match.markets.draw || match.markets.draw <= 0 }" @click.stop="match.markets.draw && match.markets.draw > 0 && addOdd(match,'X',match.markets.draw)">
                <span class="dtmt__odd-inner">
                  <img v-if="match.markets.draw > 0 && match.markets.draw > match.markets.home && match.markets.draw >= (match.markets.away || 0)" src="https://uxwing.com/wp-content/themes/uxwing/download/e-commerce-currency-shopping/hot-icon.png" class="dtmt__flame" />
                  {{ fmtOdd(match.markets.draw) }}
                </span>
              </button>
              <button class="dtmt__odd-btn" :class="{ selected: isDtSel(match,'2'), 'dtmt__odd-btn--na': !match.markets.away || match.markets.away <= 0 }" @click.stop="match.markets.away > 0 && addOdd(match,'2',match.markets.away)">
                <span class="dtmt__odd-inner">
                  <img v-if="match.markets.away > 0 && match.markets.away > match.markets.home && match.markets.away > (match.markets.draw || 0)" src="https://uxwing.com/wp-content/themes/uxwing/download/e-commerce-currency-shopping/hot-icon.png" class="dtmt__flame" />
                  {{ fmtOdd(match.markets.away) }}
                </span>
              </button>
              <button class="dtmt__odd-btn" :class="{ selected: isDtSel(match,'1X'), 'dtmt__odd-btn--na': dc(match.markets.home,match.markets.draw)==='−' }" @click.stop="dc(match.markets.home,match.markets.draw)!=='-' && addOdd(match,'1X',dc(match.markets.home,match.markets.draw))">{{ dc(match.markets.home,match.markets.draw) }}</button>
              <button class="dtmt__odd-btn" :class="{ selected: isDtSel(match,'X2'), 'dtmt__odd-btn--na': dc(match.markets.draw,match.markets.away)==='-' }" @click.stop="dc(match.markets.draw,match.markets.away)!=='-' && addOdd(match,'X2',dc(match.markets.draw,match.markets.away))">{{ dc(match.markets.draw,match.markets.away) }}</button>
              <button class="dtmt__odd-btn" :class="{ selected: isDtSel(match,'12'), 'dtmt__odd-btn--na': dc(match.markets.home,match.markets.away)==='-' }" @click.stop="dc(match.markets.home,match.markets.away)!=='-' && addOdd(match,'12',dc(match.markets.home,match.markets.away))">{{ dc(match.markets.home,match.markets.away) }}</button>
            </div>
          </div>
          <!-- Infinite scroll sentinel + load-more row (both views) -->
          <div ref="topSentinel" class="top-sentinel"></div>
          <div v-if="store.topLoadingMore || store.topMatchesHasMore" class="load-more-wrap">
            <button class="load-more-btn" :disabled="store.topLoadingMore" @click="store.loadMoreTopMatches()">
              <span v-if="store.topLoadingMore" class="load-more-btn__inner">
                <span class="lm-spinner"></span>
                <span>Loading matches…</span>
              </span>
              <span v-else class="load-more-btn__inner">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
                Load More Matches
              </span>
            </button>
          </div>
        </div>

        <div class="section">
          <div class="section-header">
            <div class="section-title">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#c026d3" stroke-width="2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/></svg>
              Sports Jackpot
            </div>
            <RouterLink to="/jackpot" class="section-more">Play ›</RouterLink>
          </div>
          <div style="margin:0 10px 8px;border-radius:8px;overflow:hidden;cursor:pointer" @click="$router.push('/jackpot')">
            <img :src="'/static/img/Bg_SpotsJP_H5.83a074b.png'" alt="Jackpot" style="width:100%;display:block;border-radius:8px" />
          </div>
        </div>

        <!-- ── REAL SPORT PANEL — shown when non-default sport is selected ── -->
        <template v-if="showSportPanel">
          <!-- Live matches for this sport -->
          <div class="section" v-if="store.liveMatches.filter(m => m.sportCode === activeSportCode).length">
            <div class="section-header">
              <div class="section-title"><span class="live-dot"></span> Live {{ store.activeSport }} ({{ store.liveMatches.filter(m => m.sportCode === activeSportCode).length }})</div>
            </div>
            <div class="mob-only">
              <MatchCard v-for="m in store.liveMatches.filter(lm => lm.sportCode === activeSportCode)" :key="m.id" :match="m" />
            </div>
            <div class="dt-match-table dt-only">
              <div class="dtmt__head">
                <div class="dtmt__col-match">Match</div>
                <div class="dtmt__col-odd">1</div><div class="dtmt__col-odd">X</div><div class="dtmt__col-odd">2</div>
                <div class="dtmt__col-odd">1X</div><div class="dtmt__col-odd">X2</div><div class="dtmt__col-odd">12</div>
              </div>
              <div v-for="m in store.liveMatches.filter(lm => lm.sportCode === activeSportCode)" :key="m.id" class="dtmt__row" @click="openMatch(m)">
                <div class="dtmt__col-match">
                  <div class="dtmt__league"><span class="dtmt__live-badge">Live</span> {{ m.league }}</div>
                  <div class="dtmt__teams">
                    <span class="dtmt__team-name">{{ m.homeTeam }}</span>
                    <span class="dtmt__score">{{ m.homeScore }}-{{ m.awayScore }}</span>
                    <span class="dtmt__team-name">{{ m.awayTeam }}</span>
                  </div>
                  <div class="dtmt__time">{{ m.minute }}'</div>
                </div>
                <button class="dtmt__odd-btn" @click.stop="addOdd(m,'1',m.markets.home)">{{ m.markets.home }}</button>
                <button class="dtmt__odd-btn" :class="{'dtmt__odd-btn--na':!m.markets.draw}" @click.stop="m.markets.draw && addOdd(m,'X',m.markets.draw)">{{ m.markets.draw ?? '-' }}</button>
                <button class="dtmt__odd-btn" @click.stop="addOdd(m,'2',m.markets.away)">{{ m.markets.away }}</button>
                <button class="dtmt__odd-btn" :class="{'dtmt__odd-btn--na':!m.markets.draw}" @click.stop="m.markets.draw && addOdd(m,'1X',m.markets.dc1X ?? dc(m.markets.home,m.markets.draw))">{{ m.markets.dc1X ?? dc(m.markets.home,m.markets.draw) }}</button>
                <button class="dtmt__odd-btn" :class="{'dtmt__odd-btn--na':!m.markets.draw}" @click.stop="m.markets.draw && addOdd(m,'X2',m.markets.dcX2 ?? dc(m.markets.draw,m.markets.away))">{{ m.markets.dcX2 ?? dc(m.markets.draw,m.markets.away) }}</button>
                <button class="dtmt__odd-btn" @click.stop="addOdd(m,'12',m.markets.dc12 ?? dc(m.markets.home,m.markets.away))">{{ m.markets.dc12 ?? dc(m.markets.home,m.markets.away) }}</button>
              </div>
            </div>
          </div>

          <!-- Loading state -->
          <div v-if="sportLoading" class="sport-panel-loading">
            <div class="sp-spinner"></div>
            <span>Loading {{ store.activeSport }} matches…</span>
          </div>

          <!-- Leagues with matches -->
          <template v-else>
            <div class="section" v-for="lg in sportLeagueGroups" :key="lg.id">
              <div class="section-header">
                <div class="section-title">{{ lg.flag }} {{ lg.name }} <span class="section-count-sm">({{ lg.matches.length }})</span></div>
              </div>
              <!-- Mobile -->
              <div class="mob-only">
                <MatchCard v-for="m in lg.matches" :key="m.id" :match="m" />
              </div>
              <!-- Desktop table -->
              <div class="dt-match-table dt-only">
                <div class="dtmt__head">
                  <div class="dtmt__col-match">Match</div>
                  <div class="dtmt__col-odd">1</div><div class="dtmt__col-odd">X</div><div class="dtmt__col-odd">2</div>
                  <div class="dtmt__col-odd">1X</div><div class="dtmt__col-odd">X2</div><div class="dtmt__col-odd">12</div>
                </div>
                <div v-for="m in lg.matches" :key="m.id" class="dtmt__row" @click="openMatch(m)">
                  <div class="dtmt__col-match">
                    <div class="dtmt__league"><img :src="m.leagueLogo" class="dtmt__league-icon" />{{ m.league }}</div>
                    <div class="dtmt__teams">
                      <span class="dtmt__team-name">{{ m.homeTeam }}</span>
                      <span class="dtmt__vs">vs</span>
                      <span class="dtmt__team-name">{{ m.awayTeam }}</span>
                    </div>
                    <div class="dtmt__time">{{ m.startTime }}</div>
                  </div>
                  <button class="dtmt__odd-btn" :class="{ selected: isDtSel(m,'1') }" @click.stop="addOdd(m,'1',m.markets.home)">{{ m.markets.home }}</button>
                  <button class="dtmt__odd-btn" :class="{ selected: isDtSel(m,'X'), 'dtmt__odd-btn--na': !m.markets.draw }" @click.stop="m.markets.draw && addOdd(m,'X',m.markets.draw)">{{ m.markets.draw ?? '-' }}</button>
                  <button class="dtmt__odd-btn" :class="{ selected: isDtSel(m,'2') }" @click.stop="addOdd(m,'2',m.markets.away)">{{ m.markets.away }}</button>
                  <button class="dtmt__odd-btn" :class="{ selected: isDtSel(m,'1X'), 'dtmt__odd-btn--na': !m.markets.draw }" @click.stop="m.markets.draw && addOdd(m,'1X',m.markets.dc1X ?? dc(m.markets.home,m.markets.draw))">{{ m.markets.dc1X ?? dc(m.markets.home,m.markets.draw) }}</button>
                  <button class="dtmt__odd-btn" :class="{ selected: isDtSel(m,'X2'), 'dtmt__odd-btn--na': !m.markets.draw }" @click.stop="m.markets.draw && addOdd(m,'X2',m.markets.dcX2 ?? dc(m.markets.draw,m.markets.away))">{{ m.markets.dcX2 ?? dc(m.markets.draw,m.markets.away) }}</button>
                  <button class="dtmt__odd-btn" :class="{ selected: isDtSel(m,'12') }" @click.stop="addOdd(m,'12',m.markets.dc12 ?? dc(m.markets.home,m.markets.away))">{{ m.markets.dc12 ?? dc(m.markets.home,m.markets.away) }}</button>
                </div>
              </div>
            </div>

            <!-- Load more -->
            <div v-if="sportHasMore" class="load-more-wrap">
              <button class="load-more-btn" :disabled="sportLoadingMore" @click="loadMoreSport">
                <span v-if="sportLoadingMore">Loading…</span>
                <span v-else>Load More {{ store.activeSport }} Matches</span>
              </button>
            </div>
            <div v-else-if="sportLeagueGroups.length > 0" class="end-note">All {{ store.activeSport }} matches loaded</div>
            <div v-else-if="!sportLoading && !store.liveMatches.filter(m => m.sportCode === activeSportCode).length" class="sport-empty">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom:8px;opacity:0.4"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <div style="font-weight:700;color:#292a33;margin-bottom:4px;">No {{ store.activeSport }} matches right now</div>
              <div style="font-size:12px;color:#9599a4;">Check back soon for upcoming fixtures</div>
            </div>
          </template>
        </template>

        </template>
        <MatchDetailPanel v-else :match="(selectedMatch as any)" @close="selectedMatch = null" />
      </main>

      <!-- RIGHT BETSLIP PANEL -->
      <aside class="dt-right">
        <!-- Betslip widget -->
        <div class="dt-bs">
          <div class="dt-bs__header">
            <button class="dt-bs__tab" :class="{ active: betslipTab === 'slip' }" @click="betslipTab = 'slip'">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:3px"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z"/></svg>
              Bet Slip
            </button>
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

              <!-- Bet Bonus Banner -->
              <div class="dt-bs__bonus">
                <div class="dt-bs__bonus-header">
                  <span class="dt-bs__bonus-title">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:3px"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>
                    Bet Bonus
                  </span>
                  <span class="dt-bs__bonus-max">Up to 500%</span>
                </div>
                <div class="dt-bs__bonus-bar-wrap">
                  <div class="dt-bs__bonus-bar" :style="{ width: Math.min(bonusPercent / 10, 100) + '%' }"></div>
                </div>
                <div class="dt-bs__bonus-row">
                  <span v-if="bonusPercent > 0" class="dt-bs__bonus-active">+{{ bonusPercent }}% applied!</span>
                  <span v-else class="dt-bs__bonus-hint">Add 1 more pick to unlock bonus</span>
                  <span v-if="nextBonusTier" class="dt-bs__bonus-next">+{{ nextBonusTier.need }} → {{ nextBonusTier.pct }}%</span>
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
                <div v-if="bonusPercent > 0" class="dt-bs__summary-row">
                  <span>Bonus</span>
                  <strong style="color:#c026d3">+{{ bonusPercent }}%</strong>
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
          <div class="dt-promo__head"><img src="/promo-gift.png" alt="" class="sidebar-head-icon" /> Promotions</div>
          <div class="dt-promo__item" v-for="p in promos" :key="p.title">
            <span class="dt-promo__icon" v-html="p.icon"></span>
            <div>
              <div class="dt-promo__title">{{ p.title }}</div>
              <div class="dt-promo__sub">{{ p.sub }}</div>
            </div>
          </div>
        </div>

        <!-- Live scores widget -->
        <div class="dt-livescores">
          <div class="dt-livescores__head">
            <img src="/live-icon.png" alt="" class="sidebar-head-icon" /> Live Scores
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
          <div class="dt-tips__head"><img src="/tips-icon.png" alt="" class="sidebar-head-icon" /> Today's Tips</div>
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
          <div class="dt-results__head"><img src="/results-icon.png" alt="" class="sidebar-head-icon" /> Recent Results</div>
          <div v-for="r in recentResults" :key="r.home + r.away" class="dt-results__item">
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
          <div class="dt-casino-widget__head">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="3"/><circle cx="8" cy="8" r="1.5" fill="currentColor" stroke="none"/><circle cx="16" cy="8" r="1.5" fill="currentColor" stroke="none"/><circle cx="8" cy="16" r="1.5" fill="currentColor" stroke="none"/><circle cx="16" cy="16" r="1.5" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none"/></svg>
            Casino Highlights
          </div>
          <div v-for="g in casinoHighlights" :key="g.name" class="dt-casino-widget__item" @click="$router.push('/casino')">
            <span class="dt-casino-widget__icon-wrap" v-html="g.icon"></span>
            <div class="dt-casino-widget__info">
              <div class="dt-casino-widget__name">{{ g.name }}</div>
              <div class="dt-casino-widget__players">{{ g.players }} playing now</div>
            </div>
            <svg v-if="g.hot" width="13" height="13" viewBox="0 0 24 24" fill="#ef4444" stroke="none"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>
          </div>
          <button class="dt-casino-widget__cta" @click="$router.push('/casino')">Play Casino →</button>
        </div>

        <!-- Jackpot countdown widget -->
        <div class="dt-jackpot-widget">
          <div class="dt-jackpot-widget__head">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/></svg>
            Next Jackpot Draw
          </div>
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
          <div class="dt-app-banner__icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18" stroke-width="3"/></svg>
          </div>
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
            <RouterLink to="/virtuals" class="sff__link">Virtuals</RouterLink>
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
          <span class="sff__chip"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18" stroke-width="3"/></svg> MTN Mobile Money</span>
          <span class="sff__chip"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18" stroke-width="3"/></svg> Airtel Money</span>
          <span class="sff__chip"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg> Visa</span>
          <span class="sff__chip"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg> Mastercard</span>
          <span class="sff__chip"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="22" x2="21" y2="22"/><line x1="6" y1="18" x2="6" y2="11"/><line x1="10" y1="18" x2="10" y2="11"/><line x1="14" y1="18" x2="14" y2="11"/><line x1="18" y1="18" x2="18" y2="11"/><polygon points="12 2 20 7 4 7"/></svg> Bank Transfer</span>
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

        <!-- Mobile Bet Bonus Banner -->
        <div class="mob-bs-bonus">
          <div class="mob-bs-bonus__header">
            <span class="mob-bs-bonus__title">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:2px"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>
              Bet Bonus
            </span>
            <span class="mob-bs-bonus__max">Up to 500%</span>
          </div>
          <div class="mob-bs-bonus__bar-wrap">
            <div class="mob-bs-bonus__bar" :style="{ width: Math.min(bonusPercent / 10, 100) + '%' }"></div>
          </div>
          <div class="mob-bs-bonus__row">
            <span v-if="bonusPercent > 0" class="mob-bs-bonus__active">+{{ bonusPercent }}% applied!</span>
            <span v-else class="mob-bs-bonus__hint">Add 1 more pick to unlock bonus</span>
            <span v-if="nextBonusTier" class="mob-bs-bonus__next">+{{ nextBonusTier.need }} pick → {{ nextBonusTier.pct }}%</span>
          </div>
        </div>

        <div style="margin-top:14px">
          <div class="form-group">
            <label class="form-label">Stake (UGX)</label>
            <input v-model="stakeAmount" class="form-input" type="number" placeholder="Min 500 UGX" />
          </div>
          <div style="display:flex;justify-content:space-between;margin-bottom:6px;font-size:13px">
            <span style="color:var(--text-grey)">Total Odds:</span>
            <span style="font-weight:700;color:var(--green)">{{ totalOdds.toFixed(2) }}</span>
          </div>
          <div v-if="bonusPercent > 0" style="display:flex;justify-content:space-between;margin-bottom:6px;font-size:13px">
            <span style="color:var(--text-grey)">Bonus:</span>
            <span style="font-weight:700;color:#c026d3">+{{ bonusPercent }}%</span>
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
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import { useRouter } from 'vue-router';
import AppHeader from "@/components/AppHeader.vue";
import BottomNav from "@/components/BottomNav.vue";
import SportMenu from "@/components/SportMenu.vue";
import JackpotSection from "@/components/JackpotSection.vue";
import BannerSlider from "@/components/BannerSlider.vue";
import MatchCard from "@/components/MatchCard.vue";
import MatchDetailPanel from "@/components/MatchDetailPanel.vue";
import { useAppStore } from "@/stores/app";
import { useHomeMatches, leagueFlag } from "@/composables/useHomeMatches";
import { useSportMatches } from "@/composables/useSportMatches";
import { useBandaMatches } from "@/composables/useBandaMatches";
import { SPORT_CODE_MAP } from "@/services/topbetApi";

const router = useRouter();
const store = useAppStore();
const {
  wcMatches,
  plMatches,
  uclMatches,
  uplMatches,
  nbaMatches,
  tennisMatches,
  volleyMatches,
  soccerMatches,
  basketballMatches,
} = useHomeMatches();

const FOOTBALL_SPORTS = new Set(['Football', 'World Cup', 'Basketball', 'Tennis', 'Table Tennis', 'Volleyball', 'Handball', 'Ice Hockey']);
const activeSportCode = computed(() => SPORT_CODE_MAP[store.activeSport] || 'S');
const { leagueGroups: sportLeagueGroups, loading: sportLoading, loadingMore: sportLoadingMore, hasMore: sportHasMore, init: initSportMatches, loadMore: loadMoreSport } = useSportMatches(activeSportCode);
const showSportPanel = computed(() => !FOOTBALL_SPORTS.has(store.activeSport));

watch(() => store.activeSport, (newSport) => {
  if (!FOOTBALL_SPORTS.has(newSport)) {
    const code = SPORT_CODE_MAP[newSport] || 'S';
    initSportMatches(code);
  }
}, { immediate: false });
const showBetslip = ref(false);
const stakeAmount = ref<number | string>(1000);
const selectedMatch = ref<any | null>(null);
const activeLeague = ref('');

function selectSport(name: string) {
  store.activeSport = name;
  activeLeague.value = '';
}

function selectLeague(name: string) {
  activeLeague.value = activeLeague.value === name ? '' : name;
}

const topSentinel = ref<HTMLElement | null>(null);
let topObserver: IntersectionObserver | null = null;

function setupTopObserver() {
  if (topObserver) topObserver.disconnect();
  topObserver = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && store.topMatchesHasMore && !store.topLoadingMore) {
        store.loadMoreTopMatches();
      }
    },
    { rootMargin: '300px' }
  );
  if (topSentinel.value) topObserver.observe(topSentinel.value);
}

onMounted(() => setupTopObserver());
watch(topSentinel, () => setupTopObserver());
onUnmounted(() => topObserver?.disconnect());

function openMatch(match: any) {
  if (window.innerWidth >= 1024) {
    selectedMatch.value = match;
  } else {
    router.push(`/match/${match.id}`);
  }
}

const totalOdds = computed(() => store.betslip.reduce((acc, b) => acc * b.odds, 1));

const BONUS_TIERS: [number, number][] = [
  [2, 40], [3, 80], [4, 120], [5, 160], [6, 200],
  [7, 250], [8, 300], [9, 400], [10, 500],
];
const bonusPercent = computed(() => {
  const n = store.betslip.length;
  if (n <= 1) return 0;
  const tier = [...BONUS_TIERS].reverse().find(([min]) => n >= min);
  return tier ? tier[1] : 0;
});
const nextBonusTier = computed(() => {
  const n = store.betslip.length;
  const next = BONUS_TIERS.find(([min]) => min > n);
  return next ? { need: next[0] - n, pct: next[1] } : null;
});
const potentialWin = computed(() => Math.round(Number(stakeAmount.value || 0) * totalOdds.value * (1 + bonusPercent.value / 100)).toLocaleString());

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
  const odds = [match.markets.home, match.markets.draw, match.markets.away].filter((v): v is number => v != null && v > 1.0);
  return odds.length ? Math.max(...odds) : 0;
}

function fmtOdd(v: number | null | undefined): string {
  if (!v || v <= 0) return '-';
  return String(v);
}

function dc(a: number | null, b: number | null): string {
  if (!a || !b || a <= 0 || b <= 0) return '-';
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
function isDtSel(match: any, market: string) {
  return store.betslip.some(b => b.matchId === `${match.id}_${market}`);
}

const desktopNavTabs = computed(() => {
  const route = router.currentRoute.value.path;
  return [
    { label: 'Sportsbook', icon: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>', route: '/', active: route === '/' },
    { label: 'Live',       icon: '<span class="dt-live-dot"></span>', route: '/', badge: store.liveMatches.length ? String(store.liveMatches.length) : '', active: false },
    { label: 'Casino',     icon: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="3"/><circle cx="8" cy="8" r="1.5" fill="currentColor" stroke="none"/><circle cx="16" cy="8" r="1.5" fill="currentColor" stroke="none"/><circle cx="8" cy="16" r="1.5" fill="currentColor" stroke="none"/><circle cx="16" cy="16" r="1.5" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none"/></svg>', route: '/casino', active: route === '/casino' },
    { label: 'Jackpot',    icon: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/></svg>', route: '/jackpot', active: route === '/jackpot' },
    { label: 'Virtuals',   icon: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="6" y1="12" x2="10" y2="12"/><line x1="8" y1="10" x2="8" y2="14"/><line x1="15" y1="13" x2="15.01" y2="13"/><line x1="18" y1="11" x2="18.01" y2="11"/><path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z"/></svg>', route: '/virtuals', active: route === '/virtuals' },
    { label: 'Results',    icon: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="12" y2="17"/></svg>', route: '/results', active: route === '/results' },
  ];
});

const SIDEBAR_SPORT_CODES = ['S','B','T','V','HB','BB','TT','SN','R','BO','MM','F1','IH','W','E','AF'];
const sidebarSports = computed(() =>
  store.sports?.length
    ? store.sports
        .filter((s) => SIDEBAR_SPORT_CODES.includes(s.id))
        .sort((a, b) => SIDEBAR_SPORT_CODES.indexOf(a.id) - SIDEBAR_SPORT_CODES.indexOf(b.id))
        .map((s) => ({ name: s.name, icon: s.icon, route: `/sports/${s.name}`, count: s.count }))
    : [
        { name: 'Football',   icon: 'https://www.topbet.ug/face/assets/sports-desk/sport_S.svg',  route: '/sports/Football',   count: 0 },
        { name: 'Basketball', icon: 'https://www.topbet.ug/face/assets/sports-desk/sport_B.svg',  route: '/sports/Basketball', count: 0 },
        { name: 'Tennis',     icon: 'https://www.topbet.ug/face/assets/sports-desk/sport_T.svg',  route: '/sports/Tennis',     count: 0 },
      ]
);

const topLeagues = computed(() => {
  const liveLeagueNames = new Set(store.liveMatches.filter(m => m.isLive && m.league).map(m => m.league));
  const seen = new Set<string>();
  const result: { name: string; flag: string; live: boolean }[] = [];
  // Merge live matches first (so live leagues appear at top), then top matches
  const allMatches = [
    ...store.liveMatches.filter(m => m.isLive),
    ...store.liveMatches.filter(m => !m.isLive),
    ...store.topMatches,
  ];
  for (const m of allMatches) {
    if (!seen.has(m.league) && m.league) {
      seen.add(m.league);
      result.push({ name: m.league, flag: leagueFlag(m.league), live: liveLeagueNames.has(m.league) });
    }
  }
  if (!result.length) {
    return [
      { name: 'FIFA World Cup 2026',     flag: '🌍',          live: false },
      { name: 'UEFA Champions League',   flag: '🇪🇺',         live: false },
      { name: 'Premier League',          flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',       live: false },
      { name: 'La Liga',                 flag: '🇪🇸',         live: false },
      { name: 'Serie A',                 flag: '🇮🇹',         live: false },
      { name: 'Bundesliga',              flag: '🇩🇪',         live: false },
      { name: 'Uganda Premier League',   flag: '🇺🇬',         live: false },
    ];
  }
  return result.slice(0, 12);
});

// Real sports from API — exclude Football (S) which already has its own primary section
const PRIMARY_SPORTS = new Set(['S']);
const moreSports = computed(() => {
  if (!store.sports?.length) return [
    { icon: 'https://www.topbet.ug/face/assets/sports-desk/sport_HB.svg', name: 'Handball',     count: 0, id: 'HB' },
    { icon: 'https://www.topbet.ug/face/assets/sports-desk/sport_R.svg',  name: 'Rugby',        count: 0, id: 'R'  },
    { icon: 'https://www.topbet.ug/face/assets/sports-desk/sport_BO.svg', name: 'Boxing / MMA', count: 0, id: 'BO' },
    { icon: 'https://www.topbet.ug/face/assets/sports-desk/sport_SN.svg', name: 'Snooker',      count: 0, id: 'SN' },
  ];
  const SPORT_EMOJI: Record<string, string> = {
    B: 'https://www.topbet.ug/face/assets/sports-desk/sport_B.svg',
    T: 'https://www.topbet.ug/face/assets/sports-desk/sport_T.svg',
    TT: 'https://www.topbet.ug/face/assets/sports-desk/sport_TT.svg',
    V: 'https://www.topbet.ug/face/assets/sports-desk/sport_V.svg',
    HB: 'https://www.topbet.ug/face/assets/sports-desk/sport_HB.svg',
    SN: 'https://www.topbet.ug/face/assets/sports-desk/sport_SN.svg',
    E: 'https://www.topbet.ug/face/assets/sports-desk/sport_E.svg',
    BB: 'https://www.topbet.ug/face/assets/sports-desk/sport_BB.svg',
    R: 'https://www.topbet.ug/face/assets/sports-desk/sport_R.svg',
    BO: 'https://www.topbet.ug/face/assets/sports-desk/sport_BO.svg',
    MM: 'https://www.topbet.ug/face/assets/sports-desk/sport_MM.svg',
    F1: 'https://www.topbet.ug/face/assets/sports-desk/sport_F1.svg',
    IH: 'https://www.topbet.ug/face/assets/sports-desk/sport_IH.svg',
    W: 'https://www.topbet.ug/face/assets/sports-desk/sport_W.svg',
    AF: 'https://www.topbet.ug/face/assets/sports-desk/sport_AF.svg',
    FK: 'https://www.topbet.ug/face/assets/sports-desk/sport_S.svg',
    MO: 'https://www.topbet.ug/face/assets/sports-desk/sport_F1.svg',
    OR: 'https://www.topbet.ug/face/assets/sports-desk/sport_S.svg',
    VS: 'https://www.topbet.ug/face/assets/sports-desk/sport_E.svg',
  };
  return store.sports
    .filter(s => !PRIMARY_SPORTS.has(s.id) && s.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 8)
    .map(s => ({ icon: SPORT_EMOJI[s.id] ?? 'https://www.topbet.ug/face/assets/sports-desk/sport_S.svg', name: s.name, count: s.count, id: s.id }));
});

// Competitions derived from real match data — unique leagues with live indicator
const popularComps = computed(() => {
  const liveLeagueNames = new Set(store.liveMatches.filter(m => m.isLive && m.league).map(m => m.league));
  const seen = new Set<string>();
  const result: { flag: string; name: string; live: boolean }[] = [];
  const allMatches = [
    ...store.liveMatches,
    ...store.topMatches,
  ];
  for (const m of allMatches) {
    if (!seen.has(m.league) && m.league) {
      seen.add(m.league);
      result.push({ name: m.league, flag: leagueFlag(m.league), live: liveLeagueNames.has(m.league) });
    }
  }
  if (!result.length) return [
    { flag: '🇺🇬', name: 'Uganda Premier League', live: false },
    { flag: '🇪🇺', name: 'UEFA Europa League',    live: false },
    { flag: '🇧🇷', name: 'Brasileirão',            live: false },
    { flag: '🇫🇷', name: 'Ligue 1',               live: false },
  ];
  // Sort: live leagues first, then alphabetical
  return result
    .sort((a, b) => (b.live ? 1 : 0) - (a.live ? 1 : 0))
    .slice(0, 10);
});

const promos = [
  { icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c026d3" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>', title: '100% First Deposit', sub: 'Up to UGX 500,000' },
  { icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c026d3" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>', title: 'Live Betting Boost', sub: 'Extra 5% on winnings' },
  { icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c026d3" stroke-width="2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/></svg>', title: 'Weekly Jackpot', sub: 'Win UGX 50,000,000' },
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
  { icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c026d3" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="3"/><circle cx="8" cy="8" r="1.5" fill="#c026d3" stroke="none"/><circle cx="16" cy="8" r="1.5" fill="#c026d3" stroke="none"/><circle cx="8" cy="16" r="1.5" fill="#c026d3" stroke="none"/><circle cx="16" cy="16" r="1.5" fill="#c026d3" stroke="none"/><circle cx="12" cy="12" r="1.5" fill="#c026d3" stroke="none"/></svg>', name: 'Mega Fortune Slots',  players: '1,240', hot: true  },
  { icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c026d3" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="2"/><path d="M9 8h1M14 8h1M9 12h6M9 16h6"/></svg>', name: 'Live Blackjack VIP',  players: '876',   hot: false },
  { icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c026d3" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="2" x2="12" y2="9"/><line x1="12" y1="15" x2="12" y2="22"/></svg>', name: 'Lightning Roulette',  players: '2,105', hot: true  },
  { icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c026d3" stroke-width="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>', name: 'Crash Multiplier',    players: '3,421', hot: true  },
  { icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c026d3" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>', name: 'Teen Patti Live',     players: '598',   hot: false },
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

/* ── boosted badge: base styles (mobile + desktop) ── */
.boosted-badge {
  display: inline-flex; align-items: center; gap: 3px;
  background: linear-gradient(90deg, #f59e0b, #ef4444);
  color: #fff; font-size: 11px; font-weight: 900;
  padding: 2px 6px; border-radius: 4px; letter-spacing: .3px;
  white-space: nowrap;
}
.boosted-badge__flame {
  width: 12px; height: 12px; object-fit: contain; flex-shrink: 0;
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
  .dtmt__head .dtmt__col-match {
    text-transform: uppercase;
    letter-spacing: .5px;
  }
  .dtmt__col-match {
    padding: 6px 10px;
    font-size: 10px; font-weight: 800; color: #9599a4;
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
  .dtmt__league-icon { width: 22px; height: 22px; object-fit: cover; flex-shrink: 0; border-radius: 3px; overflow: hidden; }
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
  .dtmt__time { font-size: 9px; color: #9599a4; margin-top: 1px; display: flex; align-items: center; gap: 5px; }
  .dtmt__mkt-count { font-size: 8px; color: #c026d3; font-weight: 700; background: rgba(192,38,211,.08); border-radius: 4px; padding: 1px 4px; flex-shrink: 0; }
  .dtmt__boosted-pin { font-size: 10px; flex-shrink: 0; }

  /* ── boosted section styles ── */
  .boosted-badge {
    display: inline-flex; align-items: center; gap: 4px;
    background: linear-gradient(90deg, #f59e0b, #ef4444);
    color: #fff; font-size: 11px; font-weight: 900;
    padding: 2px 7px; border-radius: 4px; letter-spacing: .4px;
  }
  .boosted-badge__flame {
    width: 13px; height: 13px; object-fit: contain; flex-shrink: 0;
  }
  .boosted-empty {
    padding: 20px 14px; font-size: 12px; color: #9599a4; text-align: center;
  }
  .dtmt__boosted-pin-img {
    width: 11px; height: 11px; object-fit: contain; flex-shrink: 0; opacity: .85;
  }
  /* padlock / hot flame inside odds cell */
  .dtmt__odd-inner {
    display: flex; align-items: center; justify-content: center; gap: 2px;
  }
  .dtmt__lock { font-size: 12px; line-height: 1; }
  .dtmt__flame { width: 11px; height: 11px; object-fit: contain; flex-shrink: 0; }

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
  .dt-bs__bonus {
    margin: 8px 14px 4px;
    background: linear-gradient(135deg, rgba(192,38,211,0.07), rgba(162,28,175,0.04));
    border: 1px solid rgba(192,38,211,0.25);
    border-radius: 8px;
    padding: 8px 10px 7px;
  }
  .dt-bs__bonus-header {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 6px;
  }
  .dt-bs__bonus-title { font-size: 11px; font-weight: 700; color: #292a33; }
  .dt-bs__bonus-max { font-size: 10px; font-weight: 800; color: #c026d3; }
  .dt-bs__bonus-bar-wrap {
    height: 5px; background: #e8e9ed; border-radius: 4px; overflow: hidden;
    margin-bottom: 5px;
  }
  .dt-bs__bonus-bar {
    height: 100%;
    background: linear-gradient(90deg, #c026d3, #a21caf);
    border-radius: 4px;
    transition: width 0.4s ease;
    min-width: 3px;
  }
  .dt-bs__bonus-row {
    display: flex; justify-content: space-between; align-items: center;
  }
  .dt-bs__bonus-active { font-size: 10px; font-weight: 700; color: #c026d3; }
  .dt-bs__bonus-hint   { font-size: 10px; color: #9599a4; }
  .dt-bs__bonus-next   { font-size: 10px; color: #9599a4; }
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
  .sidebar-head-icon {
    width: 22px; height: 22px; object-fit: contain;
    display: inline-block; vertical-align: middle; margin-right: 4px; flex-shrink: 0;
  }
  .dt-promo__head {
    font-size: 11px; font-weight: 800; color: #292a33;
    padding: 10px 14px; border-bottom: 1px solid #f0f0f4;
    text-transform: uppercase; letter-spacing: .5px;
    display: flex; align-items: center;
  }
  .dt-promo__item {
    display: flex; align-items: flex-start; gap: 10px;
    padding: 10px 14px; border-bottom: 1px solid #f5f6f9;
  }
  .dt-promo__item:last-child { border-bottom: none; }
  .dt-promo__icon { font-size: 18px; flex-shrink: 0; }
  .dt-promo__gift-img { width: 32px; height: 32px; object-fit: contain; display: block; }
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
    display: flex; align-items: center;
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
    display: flex; align-items: center;
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

/* ══════════════════════════════════════════════
   SPORT PANEL — loading / load-more / empty
══════════════════════════════════════════════ */
.sport-panel-loading {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 24px 16px;
  color: #a0a3b1;
  font-size: 13px;
}
.sp-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid #3a3d4a;
  border-top-color: #c026d3;
  border-radius: 50%;
  animation: sp-spin 0.7s linear infinite;
}
@keyframes sp-spin { to { transform: rotate(360deg); } }

.section-count-sm {
  font-size: 11px;
  font-weight: 400;
  color: #9599a4;
}

.top-sentinel { height: 1px; width: 100%; }

.load-more-wrap {
  display: flex;
  justify-content: center;
  padding: 20px 0 12px;
}

.load-more-btn {
  position: relative;
  background: linear-gradient(135deg, #c026d3, #a21caf);
  color: #fff;
  border: none;
  border-radius: 50px;
  padding: 0;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  min-width: 200px;
  box-shadow: 0 4px 16px rgba(192, 38, 211, 0.35);
  transition: transform 0.15s, box-shadow 0.15s;
  overflow: hidden;
}
.load-more-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 22px rgba(192, 38, 211, 0.45);
}
.load-more-btn:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 2px 10px rgba(192, 38, 211, 0.3);
}
.load-more-btn:disabled {
  cursor: default;
  background: linear-gradient(135deg, #d580e0, #c059c9);
  box-shadow: none;
}
.load-more-btn__inner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 13px 28px;
}
.lm-spinner {
  width: 16px;
  height: 16px;
  border: 2.5px solid rgba(255, 255, 255, 0.35);
  border-top-color: #fff;
  border-radius: 50%;
  animation: lm-spin 0.7s linear infinite;
  flex-shrink: 0;
}
@keyframes lm-spin { to { transform: rotate(360deg); } }

.end-note {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  text-align: center;
  padding: 12px;
  font-size: 12px;
  color: #6a6f7a;
}

.sport-empty {
  text-align: center;
  padding: 40px 16px;
  color: #9599a4;
}
</style>
