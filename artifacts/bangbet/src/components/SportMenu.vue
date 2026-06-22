<template>
  <div class="sport-menu">
    <div
      v-for="item in store.sportsMenu"
      :key="item.id"
      class="sport-menu__item"
      :class="{ active: store.activeSport === item.name }"
      @click="select(item)"
    >
      <div class="sport-menu__icon-wrap">
        <img :src="item.icon" :alt="item.name" class="sport-menu__icon" />
      </div>
      <span class="sport-menu__name">{{ item.name }}</span>
      <span v-if="item.isNew" class="sport-menu__badge">New</span>
      <span v-if="item.selfText" class="sport-menu__selftext">{{ item.selfText }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from "@/stores/app";
import { useRouter } from "vue-router";

const store = useAppStore();
const router = useRouter();

const FILTER_SPORTS = new Set([
  "Football", "World Cup", "Basketball", "Tennis", "Table Tennis",
  "Ice Hockey", "Volleyball", "Handball", "Rugby", "Baseball",
  "Am.Football", "Darts", "Cricket",
]);

function select(item: { name: string; route: string }) {
  if (FILTER_SPORTS.has(item.name)) {
    store.activeSport = item.name;
  } else {
    router.push(item.route);
  }
}
</script>
