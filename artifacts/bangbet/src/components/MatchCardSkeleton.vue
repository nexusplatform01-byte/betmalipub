<template>
  <div class="match-card">
    <div class="match-card__header">
      <span class="sk-circ"></span>
      <span class="sk-bar" style="width:120px;height:9px;margin-left:4px"></span>
      <span class="sk-bar" style="width:50px;height:9px;margin-left:auto"></span>
    </div>
    <div class="match-card__body">
      <div class="sk-teams-row">
        <span class="sk-bar" style="width:95px;height:12px"></span>
        <span class="sk-bar" style="width:22px;height:9px;margin:0 8px"></span>
        <span class="sk-bar" style="width:85px;height:12px"></span>
      </div>
      <div class="sk-odds-row">
        <span class="sk-odds-btn"></span>
        <span class="sk-odds-btn"></span>
        <span class="sk-odds-btn"></span>
      </div>
    </div>
    <div class="mc-footer sk-footer">
      <span class="sk-bar" style="width:38px;height:8px"></span>
      <span class="sk-bar" style="width:38px;height:8px"></span>
      <span class="sk-bar" style="width:38px;height:8px"></span>
      <span class="sk-bar" style="width:38px;height:8px"></span>
    </div>
  </div>
</template>

<style scoped>
.match-card__header {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 6px 12px;
  background: #fafafa;
  border-bottom: 1px solid #f0f1f3;
}

.match-card__body {
  padding: 8px 12px;
}

.sk-teams-row {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.sk-odds-row {
  display: flex;
  gap: 8px;
}

.mc-footer.sk-footer {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 7px 12px;
  border-top: 1px solid #f0f1f3;
}

@keyframes sk-shimmer {
  0%   { background-position: -200% center; }
  100% { background-position:  200% center; }
}

.sk-bar,
.sk-circ,
.sk-odds-btn {
  background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: sk-shimmer 1.4s ease-in-out infinite;
  display: inline-block;
  border-radius: 4px;
}

.sk-circ {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  flex-shrink: 0;
}

.sk-odds-btn {
  flex: 1;
  height: 40px;
  border-radius: 8px;
  min-width: 0;
}
</style>
