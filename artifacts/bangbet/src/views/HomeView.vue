<template>
  <div class="page">
    <AppHeader />
    <SportMenu active-name="Football" />
    <main>
      <BannerSlider />

      <!-- Live Matches -->
      <div class="section">
        <div class="section-header">
          <div class="section-title">
            <span class="live-dot"></span>
            Live Now ({{ store.liveMatches.length }})
          </div>
          <RouterLink to="/sports/Football" class="section-more">See All ›</RouterLink>
        </div>
        <MatchCard v-for="match in store.liveMatches" :key="match.id" :match="match" />
      </div>

      <!-- Top Matches -->
      <div class="section">
        <div class="section-header">
          <div class="section-title">⭐ Top Matches</div>
          <RouterLink to="/sports/Football" class="section-more">See All ›</RouterLink>
        </div>
        <MatchCard v-for="match in store.topMatches" :key="match.id" :match="match" />
      </div>

      <!-- Jackpot Banner -->
      <div class="section">
        <div class="section-header">
          <div class="section-title">🏆 Sports Jackpot</div>
          <RouterLink to="/jackpot" class="section-more">Play ›</RouterLink>
        </div>
        <div style="margin:0 10px 8px; border-radius:8px; overflow:hidden; cursor:pointer;" @click="$router.push('/jackpot')">
          <img src="/static/img/Bg_SpotsJP_H5.83a074b.png" alt="Jackpot" style="width:100%;display:block;border-radius:8px;" />
        </div>
      </div>

      <!-- Footer -->
      <div class="site-footer">
        <img src="/static/img/Logo_HomeFooter_Bangbet.db450bf.png" alt="Bangbet" class="footer-logo" />
        <div class="footer-social">
          <img src="/static/img/Icon_Facebook_48.636a718.png" alt="Facebook" />
          <img src="/static/img/Icon_Twitter_48.6ec2c11.png" alt="Twitter" />
          <img src="/static/img/Icon_Instagram_48.bd94330.png" alt="Instagram" />
          <img src="/static/img/Icon_TikTok_48.3ee5e3d.png" alt="TikTok" />
          <img src="/static/img/Icon_LiveHelp_48.deda86e.png" alt="Live Help" />
        </div>
        <p class="footer-text">
          Bangbet is licensed and regulated by the National Gaming Board of Uganda.<br/>
          Gambling is for adults 18+. Please gamble responsibly.
        </p>
      </div>
    </main>

    <!-- Betslip FAB -->
    <div v-if="store.betslip.length" class="betslip-fab" @click="showBetslip = true">
      <span class="betslip-count">{{ store.betslip.length }}</span>
      <span>Bet</span>
    </div>

    <!-- Betslip Panel -->
    <div v-if="showBetslip" class="modal-overlay" @click.self="showBetslip = false">
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

    <BottomNav />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import AppHeader from "@/components/AppHeader.vue";
import BottomNav from "@/components/BottomNav.vue";
import SportMenu from "@/components/SportMenu.vue";
import BannerSlider from "@/components/BannerSlider.vue";
import MatchCard from "@/components/MatchCard.vue";
import { useAppStore } from "@/stores/app";

const store = useAppStore();
const showBetslip = ref(false);
const stakeAmount = ref<number | string>(1000);

const totalOdds = computed(() =>
  store.betslip.reduce((acc, b) => acc * b.odds, 1)
);

const potentialWin = computed(() =>
  Math.round(Number(stakeAmount.value || 0) * totalOdds.value).toLocaleString()
);

function placeBet() {
  alert(`Bet placed! Potential win: UGX ${potentialWin.value}`);
  store.betslip.splice(0);
  showBetslip.value = false;
  stakeAmount.value = 1000;
}
</script>
