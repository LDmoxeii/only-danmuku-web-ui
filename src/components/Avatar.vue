<template>
  <div :style="{ width: width + 'px', height: width + 'px' }">
    <router-link
      v-if="userId"
      :to="`/user/${userId}`"
      target="_blank"
    >
      <Cover
        :lazy="lazy"
        :width="width"
        :source="avatar"
        :default-img="defaultAvatar"
        border-radius="50%"
        :scale="1"
      />
    </router-link>
    <Cover
      v-else
      :lazy="lazy"
      :source="avatar"
      :default-img="defaultAvatar"
      border-radius="50%"
      :scale="1"
      :width="width"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
const defaultAvatar = ref("user.png");
withDefaults(
  defineProps<{
    width?: number;
    avatar?: string;
    userId?: string | number;
    lazy?: boolean;
  }>(),
  { width: 50, lazy: true, avatar: "", userId: "" }
);
</script>

<style lang="scss" scoped>
</style>
