<template>
  <nav class="bottom-nav">
    <RouterLink to="/" class="bottom-nav__item" :class="{ active: $route.path === '/' }">
      <span class="bottom-nav__icon">🏠</span>
      <span class="bottom-nav__label">Home</span>
    </RouterLink>
    <RouterLink to="/sports/Football" class="bottom-nav__item" :class="{ active: $route.path.startsWith('/sports') }">
      <span class="bottom-nav__icon">⚽</span>
      <span class="bottom-nav__label">Sports</span>
    </RouterLink>
    <RouterLink to="/casino" class="bottom-nav__item" :class="{ active: $route.path === '/casino' }">
      <span class="bottom-nav__icon">🎰</span>
      <span class="bottom-nav__label">Casino</span>
    </RouterLink>
    <RouterLink to="/promotions" class="bottom-nav__item" :class="{ active: $route.path === '/promotions' }">
      <span class="bottom-nav__icon">🎁</span>
      <span class="bottom-nav__label">Promotions</span>
    </RouterLink>
    <RouterLink to="/account" class="bottom-nav__item" :class="{ active: $route.path === '/account' }">
      <span class="bottom-nav__icon">👤</span>
      <span class="bottom-nav__label">Account</span>
    </RouterLink>
  </nav>
</template>

<script setup lang="ts">
</script>
