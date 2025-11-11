<template>
  <div :style="{ width: width + 'px', height: width + 'px' }">
    <router-link v-if="userId" :to="`/user/${userId}`" target="_blank">
      <Cover
        :lazy="lazy"
        :width="width"
        :source="avatar"
        :defaultImg="defaultAvatar"
        borderRadius="50%"
        :scale="1"
      >
      </Cover>
    </router-link>
    <Cover
      v-else
      :lazy="lazy"
      :source="avatar"
      :defaultImg="defaultAvatar"
      borderRadius="50%"
      :scale="1"
      :width="width"
    ></Cover>
  </div>
</template>

<script setup lang="ts">
import { ref, withDefaults } from "vue";
const defaultAvatar = ref("user.png");
const props = withDefaults(
  defineProps<{
    width?: number;
    avatar?: string;
    userId?: string | number;
    lazy?: boolean;
  }>(),
  { width: 50, lazy: true }
);
</script>

<style lang="scss" scoped>
</style>
