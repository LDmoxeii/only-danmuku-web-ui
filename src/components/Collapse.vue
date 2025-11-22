<template>
  <div
    class="title"
    @click="change"
  >
    <slot name="title" />
    <span :class="['iconfont', show ? 'icon-up' : 'icon-down']" />
  </div>
  <div
    v-show="show"
    class="content"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const show = ref<boolean>(false);

const change = (): void => {
  show.value = !show.value;
};
</script>

<style lang="scss" scoped>
.title {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f1f2f3;
  border-radius: 5px;
  height: 44px;
  padding: 0px 20px;
}
</style>
