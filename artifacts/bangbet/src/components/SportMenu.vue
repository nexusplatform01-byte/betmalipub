<template>
  <div class="sport-menu">
    <div
      v-for="item in store.sportsMenu"
      :key="item.id"
      class="sport-menu__item"
      :class="{ active: activeName === item.name }"
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

const props = defineProps<{ activeName?: string }>();
const store = useAppStore();
const router = useRouter();

function select(item: { name: string; route: string }) {
  router.push(item.route);
}
</script>
