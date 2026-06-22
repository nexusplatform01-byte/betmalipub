<template>
  <div class="profile-page">
    <DepositModal  v-if="showDepositModal"  @close="showDepositModal = false" />
    <WithdrawModal v-if="showWithdrawModal" @close="showWithdrawModal = false" />
    <AppHeader />

    <div class="profile-wrap">
      <!-- Sidebar -->
      <aside class="profile-sidebar">
        <div class="ps-card">
          <div class="ps-avatar">{{ initials }}</div>
          <div class="ps-name">{{ store.userName }}</div>
          <div class="ps-id">ID: #BB{{ uid }}</div>
          <div class="ps-balance-row">
            <div class="ps-bal">
              <span class="ps-bal-label">Balance</span>
              <span class="ps-bal-amount">{{ store.currency }} {{ store.balance.toLocaleString() }}</span>
            </div>
            <div class="ps-bal">
              <span class="ps-bal-label">Bonus</span>
              <span class="ps-bal-amount">{{ store.currency }} 0</span>
            </div>
          </div>
          <div class="ps-actions">
            <button class="ps-btn ps-btn--deposit" @click="doDeposit">+ Deposit</button>
            <button class="ps-btn ps-btn--withdraw" @click="doWithdraw">− Withdraw</button>
          </div>
        </div>

        <nav class="ps-nav">
          <button v-for="item in navItems" :key="item.id"
            class="ps-nav-item" :class="{ active: activeTab === item.id }"
            @click="activeTab = item.id">
            <span class="ps-nav-icon" v-html="item.icon"></span>
            <span class="ps-nav-label">{{ item.label }}</span>
            <svg class="ps-nav-chevron" viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
          </button>
        </nav>

        <button class="ps-logout" @click="doLogout">
          <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M16 13v-2H7V8l-5 4 5 4v-3z"/><path d="M20 3H10a2 2 0 00-2 2v4h2V5h10v14H10v-4H8v4a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2z"/></svg>
          Logout
        </button>
      </aside>

      <!-- Main content -->
      <main class="profile-main">

        <!-- ── OVERVIEW ── -->
        <section v-if="activeTab === 'overview'" class="tab-section">
          <h2 class="tab-title">Overview</h2>
          <div class="overview-stats">
            <div class="stat-card">
              <div class="stat-icon" style="background:#ede9fe">🎯</div>
              <div class="stat-info">
                <span class="stat-val">24</span>
                <span class="stat-lbl">Total Bets</span>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon" style="background:#dcfce7">✅</div>
              <div class="stat-info">
                <span class="stat-val" style="color:#16a34a">14</span>
                <span class="stat-lbl">Won</span>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon" style="background:#fee2e2">❌</div>
              <div class="stat-info">
                <span class="stat-val" style="color:#dc2626">10</span>
                <span class="stat-lbl">Lost</span>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon" style="background:#fef9c3">💰</div>
              <div class="stat-info">
                <span class="stat-val" style="color:#ca8a04">{{ store.currency }} 125,400</span>
                <span class="stat-lbl">Total Won</span>
              </div>
            </div>
          </div>

          <div class="overview-grid">
            <div class="ov-panel">
              <div class="ov-panel-header">Recent Activity</div>
              <div class="ov-activity" v-for="a in recentActivity" :key="a.id">
                <div class="ov-act-left">
                  <span class="ov-act-badge" :class="a.type">{{ a.type === 'win' ? 'W' : a.type === 'loss' ? 'L' : 'P' }}</span>
                  <div>
                    <div class="ov-act-match">{{ a.match }}</div>
                    <div class="ov-act-date">{{ a.date }}</div>
                  </div>
                </div>
                <span class="ov-act-amount" :class="a.type">{{ a.amount }}</span>
              </div>
            </div>

            <div class="ov-panel">
              <div class="ov-panel-header">Account Status</div>
              <div class="ov-status-row">
                <span class="ov-status-label">Verification</span>
                <span class="ov-status-badge badge-green">Verified</span>
              </div>
              <div class="ov-status-row">
                <span class="ov-status-label">Account Level</span>
                <span class="ov-status-badge badge-gold">⭐ Silver</span>
              </div>
              <div class="ov-status-row">
                <span class="ov-status-label">Member Since</span>
                <span class="ov-status-val">Jan 2024</span>
              </div>
              <div class="ov-status-row">
                <span class="ov-status-label">Responsible Gaming</span>
                <span class="ov-status-badge badge-blue">Active</span>
              </div>
              <div class="ov-progress-wrap">
                <div class="ov-progress-label">
                  <span>Level Progress to Gold</span>
                  <span>58%</span>
                </div>
                <div class="ov-progress-bar"><div class="ov-progress-fill" style="width:58%"></div></div>
              </div>
            </div>
          </div>
        </section>

        <!-- ── WALLET ── -->
        <section v-if="activeTab === 'wallet'" class="tab-section">
          <h2 class="tab-title">Wallet</h2>
          <div class="wallet-hero">
            <div class="wh-label">Available Balance</div>
            <div class="wh-amount">{{ store.currency }} {{ store.balance.toLocaleString() }}</div>
            <div class="wh-bonus">+ Bonus: {{ store.currency }} 0</div>
            <div class="wh-btns">
              <button class="wh-btn wh-btn--dep" @click="doDeposit">Deposit</button>
              <button class="wh-btn wh-btn--wit" @click="doWithdraw">Withdraw</button>
            </div>
          </div>

          <div class="wallet-methods">
            <div class="wm-title">Deposit Methods</div>
            <div class="wm-grid">
              <div class="wm-card" v-for="m in depositMethods" :key="m.name" @click="doDeposit">
                <span class="wm-icon">{{ m.icon }}</span>
                <span class="wm-name">{{ m.name }}</span>
                <span class="wm-limit">Min {{ store.currency }} {{ m.min }}</span>
              </div>
            </div>
          </div>

          <div class="wallet-methods">
            <div class="wm-title">Withdrawal Methods</div>
            <div class="wm-grid">
              <div class="wm-card" v-for="m in withdrawMethods" :key="m.name" @click="doWithdraw">
                <span class="wm-icon">{{ m.icon }}</span>
                <span class="wm-name">{{ m.name }}</span>
                <span class="wm-limit">Min {{ store.currency }} {{ m.min }}</span>
              </div>
            </div>
          </div>

          <div class="wallet-limits">
            <div class="wm-title">Betting Limits</div>
            <div class="wl-row"><span>Min Bet</span><strong>{{ store.currency }} 500</strong></div>
            <div class="wl-row"><span>Max Bet</span><strong>{{ store.currency }} 5,000,000</strong></div>
            <div class="wl-row"><span>Max Payout per Bet</span><strong>{{ store.currency }} 50,000,000</strong></div>
            <div class="wl-row"><span>Daily Deposit Limit</span><strong>Not set</strong></div>
            <button class="wl-set-btn">Set Deposit Limit</button>
          </div>
        </section>

        <!-- ── MY BETS ── -->
        <section v-if="activeTab === 'mybets'" class="tab-section">
          <BetTicketModal v-if="viewingBet" :bet="viewingBet" @close="viewingBet = null" />
          <h2 class="tab-title">My Bets</h2>
          <div class="bets-filter">
            <button v-for="f in betFilters" :key="f" class="bf-btn" :class="{ active: betFilter === f }" @click="betFilter = f">{{ f }}</button>
          </div>
          <div class="bets-list">
            <div class="tkt-row" v-for="bet in filteredBets" :key="bet.id">
              <div class="tkt-row__left">
                <div class="tkt-row__id">TICKET: <span>{{ bet.ticketId }}</span></div>
                <div class="tkt-row__meta">
                  <span class="tkt-row__type">{{ bet.type }}</span>
                  <span class="tkt-row__dot">·</span>
                  <span class="tkt-row__count">{{ bet.selections.length }} {{ bet.selections.length === 1 ? 'match' : 'matches' }}</span>
                  <span class="tkt-row__dot">·</span>
                  <span class="tkt-row__stake">UGX {{ bet.stake.toLocaleString() }}</span>
                </div>
                <div class="tkt-row__date">{{ bet.date }}</div>
              </div>
              <div class="tkt-row__right">
                <span class="tkt-row__status" :class="'tkt-s--' + bet.status">
                  {{ bet.status === 'won' ? '🏆 Won' : bet.status === 'lost' ? '❌ Lost' : '⏳ Pending' }}
                </span>
                <button class="tkt-row__view-btn" @click="viewingBet = bet">View →</button>
              </div>
            </div>
            <div v-if="filteredBets.length === 0" class="bets-empty">No {{ betFilter.toLowerCase() }} bets found.</div>
          </div>
        </section>

        <!-- ── TRANSACTIONS ── -->
        <section v-if="activeTab === 'transactions'" class="tab-section">
          <h2 class="tab-title">Transactions</h2>
          <div class="bets-filter">
            <button v-for="f in txFilters" :key="f" class="bf-btn" :class="{ active: txFilter === f }" @click="txFilter = f">{{ f }}</button>
          </div>
          <div class="tx-table">
            <div class="tx-head">
              <span>Date</span><span>Type</span><span>Method</span><span>Amount</span><span>Status</span>
            </div>
            <div class="tx-row" v-for="tx in filteredTx" :key="tx.id">
              <span class="tx-date">{{ tx.date }}</span>
              <span class="tx-type" :class="tx.type">{{ tx.type }}</span>
              <span class="tx-method">{{ tx.method }}</span>
              <span class="tx-amount" :class="tx.type">{{ tx.type === 'deposit' ? '+' : '-' }} {{ store.currency }} {{ tx.amount.toLocaleString() }}</span>
              <span class="tx-status" :class="'tx-s-' + tx.status">{{ tx.status }}</span>
            </div>
            <div v-if="filteredTx.length === 0" class="bets-empty">No transactions found.</div>
          </div>
        </section>

        <!-- ── SETTINGS ── -->
        <section v-if="activeTab === 'settings'" class="tab-section">
          <h2 class="tab-title">Settings</h2>

          <div class="settings-group">
            <div class="sg-title">Personal Information</div>
            <div class="sg-field">
              <label class="sg-label">Full Name</label>
              <input class="sg-input" v-model="settings.name" placeholder="Your full name" />
            </div>
            <div class="sg-field">
              <label class="sg-label">Email Address</label>
              <input class="sg-input" v-model="settings.email" type="email" placeholder="email@example.com" />
            </div>
            <div class="sg-field">
              <label class="sg-label">Phone Number</label>
              <input class="sg-input" v-model="settings.phone" type="tel" placeholder="+256 700 000000" />
            </div>
            <div class="sg-field">
              <label class="sg-label">Date of Birth</label>
              <input class="sg-input" v-model="settings.dob" type="date" />
            </div>
            <button class="sg-save-btn" @click="saveSettings">Save Changes</button>
          </div>

          <div class="settings-group">
            <div class="sg-title">Change Password</div>
            <div class="sg-field">
              <label class="sg-label">Current Password</label>
              <input class="sg-input" type="password" placeholder="••••••••" />
            </div>
            <div class="sg-field">
              <label class="sg-label">New Password</label>
              <input class="sg-input" type="password" placeholder="••••••••" />
            </div>
            <div class="sg-field">
              <label class="sg-label">Confirm New Password</label>
              <input class="sg-input" type="password" placeholder="••••••••" />
            </div>
            <button class="sg-save-btn">Update Password</button>
          </div>

          <div class="settings-group">
            <div class="sg-title">Notifications</div>
            <div class="sg-toggle-row" v-for="n in notifSettings" :key="n.key">
              <div>
                <div class="sg-toggle-label">{{ n.label }}</div>
                <div class="sg-toggle-desc">{{ n.desc }}</div>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" v-model="n.enabled" />
                <span class="toggle-track"></span>
              </label>
            </div>
          </div>

          <div class="settings-group">
            <div class="sg-title">Responsible Gaming</div>
            <div class="sg-toggle-row">
              <div>
                <div class="sg-toggle-label">Deposit Limit</div>
                <div class="sg-toggle-desc">Set a daily/weekly/monthly deposit cap</div>
              </div>
              <button class="sg-small-btn">Set</button>
            </div>
            <div class="sg-toggle-row">
              <div>
                <div class="sg-toggle-label">Self-Exclusion</div>
                <div class="sg-toggle-desc">Temporarily suspend your account</div>
              </div>
              <button class="sg-small-btn sg-small-btn--danger">Suspend</button>
            </div>
            <div class="sg-toggle-row">
              <div>
                <div class="sg-toggle-label">Reality Check</div>
                <div class="sg-toggle-desc">Periodic reminders while playing</div>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" v-model="realityCheck" />
                <span class="toggle-track"></span>
              </label>
            </div>
          </div>
        </section>

      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from "vue";
import { useRouter } from "vue-router";
import { useAppStore } from "@/stores/app";
import AppHeader from "@/components/AppHeader.vue";
import DepositModal from "@/components/DepositModal.vue";
import WithdrawModal from "@/components/WithdrawModal.vue";
import BetTicketModal from "@/components/BetTicketModal.vue";

const store = useAppStore();
const router = useRouter();
const activeTab = ref("overview");
const betFilter = ref("All");
const txFilter = ref("All");
const realityCheck = ref(false);
const showDepositModal  = ref(false);
const showWithdrawModal = ref(false);
const viewingBet = ref<null | typeof allBets[0]>(null);

const uid = computed(() => String(Math.abs(store.userName.split("").reduce((a, c) => a + c.charCodeAt(0), 0) * 137)).slice(0, 6));

const initials = computed(() => {
  const name = store.userName || "U";
  return name.split(" ").map((w: string) => w[0]).slice(0, 2).join("").toUpperCase();
});

const navItems = [
  { id: "overview",     label: "Overview",      icon: `<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg>` },
  { id: "wallet",       label: "Wallet",         icon: `<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M21 18v1a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v1h-9a2 2 0 00-2 2v8a2 2 0 002 2h9zm-9-2h10V8H12v8zm4-2.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z"/></svg>` },
  { id: "mybets",       label: "My Bets",        icon: `<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z"/></svg>` },
  { id: "transactions", label: "Transactions",   icon: `<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/></svg>` },
  { id: "settings",     label: "Settings",       icon: `<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>` },
];

const settings = reactive({ name: store.userName, email: "", phone: "", dob: "" });
const notifSettings = reactive([
  { key: "sms",   label: "SMS Notifications",   desc: "Receive bet results via SMS",         enabled: true  },
  { key: "email", label: "Email Notifications",  desc: "Promotions and account updates",      enabled: false },
  { key: "push",  label: "Push Notifications",   desc: "Live scores and match alerts",        enabled: true  },
  { key: "promo", label: "Promotional Offers",   desc: "Bonus offers and special deals",      enabled: true  },
]);

const depositMethods = [
  { name: "MTN MoMo", icon: "📱", min: "1,000" },
  { name: "Airtel Money", icon: "📲", min: "1,000" },
  { name: "Visa / Mastercard", icon: "💳", min: "10,000" },
  { name: "Bank Transfer", icon: "🏦", min: "50,000" },
];
const withdrawMethods = [
  { name: "MTN MoMo", icon: "📱", min: "5,000" },
  { name: "Airtel Money", icon: "📲", min: "5,000" },
  { name: "Bank Transfer", icon: "🏦", min: "50,000" },
];

const betFilters = ["All", "Pending", "Won", "Lost"];
const txFilters  = ["All", "Deposits", "Withdrawals"];

const allBets = [
  {
    id: 1, ticketId: "441823", type: "Single", status: "won" as const,
    stake: 5000, totalOdds: 4.10, potentialWin: 20500, winBonus: 8200, payout: 28700,
    date: "Jun 20, 2026 14:32",
    selections: [
      { match: "Arsenal vs Chelsea", team: "Arsenal Win", market: "Full Time Result", odds: 4.10,
        time: "2:00 pm Sat 20/06", league: "English Premier League", score: "2-0", result: "won" as const },
    ],
  },
  {
    id: 2, ticketId: "389104", type: "Double", status: "lost" as const,
    stake: 2000, totalOdds: 7.80, potentialWin: 15600, payout: 0,
    date: "Jun 18, 2026 19:05",
    selections: [
      { match: "KCCA FC vs Express FC", team: "KCCA Win", market: "Full Time (1X2)", odds: 2.10,
        time: "7:00 pm Wed 18/06", league: "Uganda Premier League", score: "0-1", result: "lost" as const },
      { match: "Man Utd vs Liverpool", team: "Draw", market: "Full Time (1X2)", odds: 3.71,
        time: "9:00 pm Wed 18/06", league: "English Premier League", score: "1-1", result: "won" as const },
    ],
  },
  {
    id: 3, ticketId: "512677", type: "Single", status: "pending" as const,
    stake: 10000, totalOdds: 2.20, potentialWin: 22000, payout: 0,
    date: "Jun 22, 2026 09:00",
    selections: [
      { match: "AC Milan vs Juventus", team: "AC Milan Win", market: "Full Time Result", odds: 2.20,
        time: "9:00 am Sun 22/06", league: "Serie A", score: "", result: "pending" as const },
    ],
  },
  {
    id: 4, ticketId: "298341", type: "Accumulator", status: "won" as const,
    stake: 3000, totalOdds: 12.30, potentialWin: 36900, winBonus: 14760, payout: 51660,
    date: "Jun 15, 2026 21:00",
    selections: [
      { match: "Barcelona vs Real Madrid", team: "Real Madrid Win", market: "Full Time Result", odds: 2.80,
        time: "9:00 pm Sun 15/06", league: "La Liga", score: "1-2", result: "won" as const },
      { match: "PSG vs Bayern Munich",    team: "Over 2.5 Goals",  market: "Both Teams To Score / Full Time Over", odds: 1.75,
        time: "11:00 pm Sun 15/06", league: "Champions League", score: "3-2", result: "won" as const },
      { match: "Chelsea vs Arsenal",      team: "Chelsea Win",     market: "Full Time Result", odds: 2.52,
        time: "1:00 am Mon 16/06", league: "English Premier League", score: "2-1", result: "won" as const },
    ],
  },
];

const filteredBets = computed(() => {
  if (betFilter.value === "All") return allBets;
  return allBets.filter(b => b.status === betFilter.value.toLowerCase());
});

const allTx = [
  { id: 1, date: "Jun 22, 2026", type: "deposit",    method: "MTN MoMo",    amount: 50000, status: "completed" },
  { id: 2, date: "Jun 20, 2026", type: "withdrawal",  method: "MTN MoMo",    amount: 20000, status: "completed" },
  { id: 3, date: "Jun 18, 2026", type: "deposit",    method: "Airtel Money", amount: 10000, status: "completed" },
  { id: 4, date: "Jun 15, 2026", type: "withdrawal",  method: "Bank",        amount: 36900, status: "completed" },
  { id: 5, date: "Jun 10, 2026", type: "deposit",    method: "Visa Card",   amount: 100000, status: "completed" },
];

const filteredTx = computed(() => {
  if (txFilter.value === "All") return allTx;
  if (txFilter.value === "Deposits") return allTx.filter(t => t.type === "deposit");
  return allTx.filter(t => t.type === "withdrawal");
});

const recentActivity = [
  { id: 1, type: "win",     match: "Arsenal vs Chelsea",         date: "Jun 20", amount: "+UGX 20,500" },
  { id: 2, type: "loss",    match: "KCCA FC vs Express FC",       date: "Jun 18", amount: "-UGX 2,000" },
  { id: 3, type: "pending", match: "AC Milan vs Juventus",        date: "Jun 22", amount: "UGX 22,000" },
  { id: 4, type: "win",     match: "Barcelona vs Real Madrid",    date: "Jun 15", amount: "+UGX 36,900" },
];

function doDeposit() {
  showDepositModal.value = true;
}
function doWithdraw() {
  showWithdrawModal.value = true;
}
function doLogout() {
  if (confirm("Logout?")) { store.logout(); router.push("/"); }
}
function saveSettings() {
  store.userName = settings.name;
  alert("Settings saved!");
}
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: #f2f3f5;
  display: flex;
  flex-direction: column;
}
.profile-wrap {
  display: flex;
  gap: 20px;
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 16px 40px;
  width: 100%;
  box-sizing: border-box;
  align-items: flex-start;
}

/* ── Sidebar ── */
.profile-sidebar {
  width: 240px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: sticky;
  top: 20px;
}

.ps-card {
  background: linear-gradient(135deg, #1e1e2e 0%, #2d1b4e 100%);
  border-radius: 16px;
  padding: 20px 16px;
  color: #fff;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);
}
.ps-avatar {
  width: 60px; height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #c026d3, #7c3aed);
  color: #fff;
  font-size: 22px; font-weight: 800;
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 10px;
  border: 3px solid rgba(255,255,255,0.2);
  box-shadow: 0 2px 12px rgba(192,38,211,0.4);
}
.ps-name {
  font-size: 15px; font-weight: 700; color: #fff;
}
.ps-id {
  font-size: 11px; color: rgba(255,255,255,0.45); margin-top: 2px;
}
.ps-balance-row {
  display: flex; gap: 12px; margin: 14px 0 12px;
}
.ps-bal {
  flex: 1;
  background: rgba(255,255,255,0.08);
  border-radius: 10px;
  padding: 8px 6px;
  display: flex; flex-direction: column; gap: 2px;
}
.ps-bal-label { font-size: 9px; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: .4px; }
.ps-bal-amount { font-size: 11px; font-weight: 800; color: #ffe60f; }

.ps-actions { display: flex; gap: 8px; }
.ps-btn {
  flex: 1; padding: 8px 4px;
  border: none; border-radius: 8px;
  font-size: 12px; font-weight: 700; cursor: pointer;
  transition: opacity 0.15s;
}
.ps-btn:hover { opacity: 0.87; }
.ps-btn--deposit { background: #16a34a; color: #fff; }
.ps-btn--withdraw { background: rgba(255,255,255,0.12); color: #fff; border: 1px solid rgba(255,255,255,0.2); }

.ps-nav {
  background: #fff;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 1px 6px rgba(0,0,0,0.07);
}
.ps-nav-item {
  width: 100%; display: flex; align-items: center; gap: 10px;
  padding: 13px 16px;
  background: none; border: none; border-bottom: 1px solid #f0f0f4;
  cursor: pointer; text-align: left;
  transition: background 0.12s;
  color: #4a4f5c;
}
.ps-nav-item:last-child { border-bottom: none; }
.ps-nav-item:hover { background: #f8f9fb; }
.ps-nav-item.active { background: #faf0ff; color: #c026d3; }
.ps-nav-item.active .ps-nav-chevron { color: #c026d3; }
.ps-nav-icon { display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.ps-nav-label { flex: 1; font-size: 13px; font-weight: 600; }
.ps-nav-chevron { flex-shrink: 0; color: #c0c4cd; }

.ps-logout {
  display: flex; align-items: center; justify-content: center; gap: 8px;
  padding: 11px;
  background: #fff; border-radius: 12px;
  border: 1.5px solid #fca5a5;
  color: #dc2626; font-size: 13px; font-weight: 700;
  cursor: pointer; transition: background 0.15s;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
}
.ps-logout:hover { background: #fff1f2; }

/* ── Main ── */
.profile-main { flex: 1; min-width: 0; }

.tab-section { display: flex; flex-direction: column; gap: 16px; }
.tab-title {
  font-size: 20px; font-weight: 800; color: #1a1b22;
  padding-bottom: 4px;
  border-bottom: 2px solid #e6e7eb;
  margin-bottom: 4px;
}

/* Overview */
.overview-stats {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px;
}
.stat-card {
  background: #fff; border-radius: 14px;
  padding: 16px 14px; display: flex; align-items: center; gap: 12px;
  box-shadow: 0 1px 6px rgba(0,0,0,0.07);
}
.stat-icon {
  width: 42px; height: 42px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  font-size: 20px; flex-shrink: 0;
}
.stat-info { display: flex; flex-direction: column; gap: 2px; }
.stat-val { font-size: 18px; font-weight: 800; color: #1a1b22; }
.stat-lbl { font-size: 11px; color: #9599a4; font-weight: 500; }

.overview-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.ov-panel {
  background: #fff; border-radius: 14px; overflow: hidden;
  box-shadow: 0 1px 6px rgba(0,0,0,0.07);
}
.ov-panel-header {
  padding: 12px 16px; font-size: 13px; font-weight: 700; color: #292a33;
  border-bottom: 1px solid #f0f0f4; background: #fafbfc;
}
.ov-activity {
  display: flex; align-items: center; justify-content: space-between;
  padding: 10px 16px; border-bottom: 1px solid #f4f4f6;
}
.ov-activity:last-child { border-bottom: none; }
.ov-act-left { display: flex; align-items: center; gap: 10px; }
.ov-act-badge {
  width: 26px; height: 26px; border-radius: 50%;
  font-size: 11px; font-weight: 800; display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.ov-act-badge.win    { background: #dcfce7; color: #16a34a; }
.ov-act-badge.loss   { background: #fee2e2; color: #dc2626; }
.ov-act-badge.pending { background: #fef9c3; color: #ca8a04; }
.ov-act-match { font-size: 12px; font-weight: 600; color: #292a33; }
.ov-act-date  { font-size: 10px; color: #9599a4; margin-top: 1px; }
.ov-act-amount { font-size: 12px; font-weight: 700; }
.ov-act-amount.win  { color: #16a34a; }
.ov-act-amount.loss { color: #dc2626; }
.ov-act-amount.pending { color: #ca8a04; }

.ov-status-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: 10px 16px; border-bottom: 1px solid #f4f4f6;
}
.ov-status-label { font-size: 12px; color: #6a6f7a; }
.ov-status-val   { font-size: 12px; font-weight: 600; color: #292a33; }
.ov-status-badge {
  font-size: 11px; font-weight: 700; padding: 2px 10px; border-radius: 999px;
}
.badge-green { background: #dcfce7; color: #16a34a; }
.badge-gold  { background: #fef9c3; color: #92400e; }
.badge-blue  { background: #dbeafe; color: #1d4ed8; }

.ov-progress-wrap { padding: 12px 16px; }
.ov-progress-label {
  display: flex; justify-content: space-between;
  font-size: 11px; color: #6a6f7a; margin-bottom: 6px;
}
.ov-progress-bar {
  height: 6px; background: #e6e7eb; border-radius: 4px; overflow: hidden;
}
.ov-progress-fill {
  height: 100%; background: linear-gradient(90deg, #c026d3, #7c3aed); border-radius: 4px;
}

/* Wallet */
.wallet-hero {
  background: linear-gradient(135deg, #1e1e2e, #2d1b4e);
  border-radius: 16px; padding: 28px 24px;
  text-align: center; color: #fff;
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);
}
.wh-label { font-size: 12px; color: rgba(255,255,255,0.55); text-transform: uppercase; letter-spacing: .8px; }
.wh-amount { font-size: 32px; font-weight: 900; color: #ffe60f; margin: 8px 0 4px; }
.wh-bonus { font-size: 12px; color: rgba(255,255,255,0.45); margin-bottom: 20px; }
.wh-btns { display: flex; gap: 12px; justify-content: center; }
.wh-btn {
  padding: 10px 28px; border-radius: 10px; border: none;
  font-size: 14px; font-weight: 700; cursor: pointer; transition: opacity 0.15s;
}
.wh-btn:hover { opacity: 0.87; }
.wh-btn--dep { background: #16a34a; color: #fff; }
.wh-btn--wit { background: rgba(255,255,255,0.14); color: #fff; border: 1.5px solid rgba(255,255,255,0.25); }

.wallet-methods, .wallet-limits {
  background: #fff; border-radius: 14px; padding: 0;
  overflow: hidden; box-shadow: 0 1px 6px rgba(0,0,0,0.07);
}
.wm-title {
  padding: 13px 18px; font-size: 13px; font-weight: 700; color: #292a33;
  border-bottom: 1px solid #f0f0f4; background: #fafbfc;
}
.wm-grid {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 0;
}
.wm-card {
  display: flex; flex-direction: column; align-items: center; gap: 4px;
  padding: 16px 10px; border-right: 1px solid #f0f0f4;
  cursor: pointer; transition: background 0.15s;
}
.wm-card:last-child { border-right: none; }
.wm-card:hover { background: #faf0ff; }
.wm-icon { font-size: 24px; }
.wm-name { font-size: 11px; font-weight: 700; color: #292a33; text-align: center; }
.wm-limit { font-size: 10px; color: #9599a4; }

.wl-row {
  display: flex; justify-content: space-between; align-items: center;
  padding: 11px 18px; border-bottom: 1px solid #f4f4f6;
  font-size: 13px; color: #4a4f5c;
}
.wl-row:last-of-type { border-bottom: none; }
.wl-row strong { color: #292a33; }
.wl-set-btn {
  display: block; width: calc(100% - 36px); margin: 12px 18px;
  padding: 10px; background: #faf0ff; border: 1.5px solid #d946ef;
  border-radius: 8px; color: #c026d3; font-size: 13px; font-weight: 700;
  cursor: pointer; transition: background 0.15s;
}
.wl-set-btn:hover { background: #f3e8ff; }

/* My Bets */
.bets-filter {
  display: flex; gap: 8px; flex-wrap: wrap;
}
.bf-btn {
  padding: 7px 16px; border-radius: 999px;
  border: 1.5px solid #e6e7eb; background: #fff;
  font-size: 12px; font-weight: 600; color: #6a6f7a;
  cursor: pointer; transition: all 0.15s;
}
.bf-btn.active, .bf-btn:hover { background: #c026d3; border-color: #c026d3; color: #fff; }

.bets-list { display: flex; flex-direction: column; gap: 10px; }

/* Ticket row */
.tkt-row {
  display: flex; align-items: center; justify-content: space-between;
  gap: 10px;
  background: #fff; border-radius: 12px;
  box-shadow: 0 1px 6px rgba(0,0,0,0.07);
  padding: 12px 14px;
  border-left: 4px solid #e5e7eb;
  transition: box-shadow 0.15s;
}
.tkt-row:hover { box-shadow: 0 3px 12px rgba(0,0,0,0.11); }

/* status accent colors */
.tkt-row:has(.tkt-s--won)     { border-left-color: #16a34a; }
.tkt-row:has(.tkt-s--lost)    { border-left-color: #dc2626; }
.tkt-row:has(.tkt-s--pending) { border-left-color: #d97706; }

.tkt-row__left { display: flex; flex-direction: column; gap: 4px; flex: 1; min-width: 0; }

.tkt-row__id {
  font-size: 11px; font-weight: 600; color: #9ca3af; letter-spacing: 0.3px;
}
.tkt-row__id span { font-size: 13px; font-weight: 900; color: #111827; letter-spacing: 0.5px; }

.tkt-row__meta {
  display: flex; align-items: center; gap: 5px; flex-wrap: wrap;
}
.tkt-row__type  { font-size: 11px; font-weight: 700; color: #c026d3; }
.tkt-row__count { font-size: 11px; font-weight: 600; color: #374151; }
.tkt-row__stake { font-size: 11px; font-weight: 700; color: #374151; }
.tkt-row__dot   { font-size: 11px; color: #d1d5db; }
.tkt-row__date  { font-size: 10px; color: #9ca3af; margin-top: 1px; }

.tkt-row__right {
  display: flex; flex-direction: column; align-items: flex-end; gap: 8px; flex-shrink: 0;
}

.tkt-row__status {
  font-size: 11px; font-weight: 800; border-radius: 999px; padding: 3px 10px;
  white-space: nowrap;
}
.tkt-s--won     { background: #dcfce7; color: #15803d; }
.tkt-s--lost    { background: #fee2e2; color: #dc2626; }
.tkt-s--pending { background: #fef3c7; color: #b45309; }

.tkt-row__view-btn {
  font-size: 11px; font-weight: 800; color: #fff;
  background: #1c1e24; border: none; border-radius: 7px;
  padding: 6px 14px; cursor: pointer; white-space: nowrap;
  transition: opacity 0.15s;
}
.tkt-row__view-btn:hover { opacity: 0.8; }

.bets-empty {
  text-align: center; padding: 40px; color: #9599a4; font-size: 14px;
  background: #fff; border-radius: 14px;
}

/* Transactions */
.tx-table {
  background: #fff; border-radius: 14px; overflow: hidden;
  box-shadow: 0 1px 6px rgba(0,0,0,0.07);
}
.tx-head {
  display: grid; grid-template-columns: 1.4fr 1fr 1.2fr 1.4fr 1fr;
  padding: 10px 16px; background: #f5f6f9;
  font-size: 10px; font-weight: 800; color: #9599a4;
  text-transform: uppercase; letter-spacing: .4px;
  border-bottom: 1px solid #e6e7eb;
}
.tx-row {
  display: grid; grid-template-columns: 1.4fr 1fr 1.2fr 1.4fr 1fr;
  padding: 12px 16px; border-bottom: 1px solid #f4f4f6;
  align-items: center; font-size: 12px;
}
.tx-row:last-child { border-bottom: none; }
.tx-date { color: #6a6f7a; }
.tx-type { font-weight: 700; text-transform: capitalize; }
.tx-type.deposit    { color: #16a34a; }
.tx-type.withdrawal { color: #c026d3; }
.tx-method { color: #292a33; }
.tx-amount { font-weight: 800; }
.tx-amount.deposit    { color: #16a34a; }
.tx-amount.withdrawal { color: #dc2626; }
.tx-status { font-size: 11px; font-weight: 700; }
.tx-s-completed { color: #16a34a; }
.tx-s-pending   { color: #ca8a04; }
.tx-s-failed    { color: #dc2626; }

/* Settings */
.settings-group {
  background: #fff; border-radius: 14px; overflow: hidden;
  box-shadow: 0 1px 6px rgba(0,0,0,0.07);
}
.sg-title {
  padding: 13px 18px; font-size: 13px; font-weight: 700; color: #292a33;
  border-bottom: 1px solid #f0f0f4; background: #fafbfc;
}
.sg-field {
  padding: 12px 18px; border-bottom: 1px solid #f4f4f6;
  display: flex; flex-direction: column; gap: 5px;
}
.sg-field:last-of-type { border-bottom: none; }
.sg-label { font-size: 11px; font-weight: 600; color: #6a6f7a; text-transform: uppercase; letter-spacing: .3px; }
.sg-input {
  width: 100%; padding: 9px 12px; box-sizing: border-box;
  border: 1.5px solid #e6e7eb; border-radius: 8px;
  font-size: 13px; color: #292a33; background: #fafbfc;
  outline: none; transition: border-color 0.15s;
}
.sg-input:focus { border-color: #c026d3; background: #fff; }
.sg-save-btn {
  display: block; margin: 14px 18px;
  padding: 10px 24px; background: #c026d3; color: #fff;
  border: none; border-radius: 8px; font-size: 13px; font-weight: 700;
  cursor: pointer; transition: opacity 0.15s;
}
.sg-save-btn:hover { opacity: 0.87; }

.sg-toggle-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: 13px 18px; border-bottom: 1px solid #f4f4f6;
}
.sg-toggle-row:last-child { border-bottom: none; }
.sg-toggle-label { font-size: 13px; font-weight: 600; color: #292a33; }
.sg-toggle-desc  { font-size: 11px; color: #9599a4; margin-top: 2px; }

.toggle-switch { position: relative; display: inline-block; width: 38px; height: 22px; flex-shrink: 0; }
.toggle-switch input { opacity: 0; width: 0; height: 0; }
.toggle-track {
  position: absolute; inset: 0; background: #e6e7eb; border-radius: 999px;
  cursor: pointer; transition: background 0.2s;
}
.toggle-track::before {
  content: ''; position: absolute;
  width: 16px; height: 16px; border-radius: 50%; background: #fff;
  top: 3px; left: 3px; transition: transform 0.2s;
  box-shadow: 0 1px 4px rgba(0,0,0,0.18);
}
.toggle-switch input:checked + .toggle-track { background: #c026d3; }
.toggle-switch input:checked + .toggle-track::before { transform: translateX(16px); }

.sg-small-btn {
  padding: 6px 16px; border-radius: 8px;
  border: 1.5px solid #c026d3; background: #faf0ff;
  color: #c026d3; font-size: 12px; font-weight: 700;
  cursor: pointer; transition: background 0.15s; flex-shrink: 0;
}
.sg-small-btn:hover { background: #f3e8ff; }
.sg-small-btn--danger {
  border-color: #dc2626; background: #fff1f2; color: #dc2626;
}
.sg-small-btn--danger:hover { background: #fee2e2; }

@media (max-width: 1023px) {
  .profile-wrap { flex-direction: column; margin: 12px auto; gap: 12px; }
  .profile-sidebar { width: 100%; position: static; }
  .overview-stats { grid-template-columns: 1fr 1fr; }
  .overview-grid  { grid-template-columns: 1fr; }
  .wm-grid { grid-template-columns: 1fr 1fr; }
  .tx-head, .tx-row { grid-template-columns: 1fr 1fr 1fr; }
  .tx-head span:nth-child(3), .tx-row .tx-method,
  .tx-head span:nth-child(5), .tx-row .tx-status { display: none; }
}
</style>
