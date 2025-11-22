<template>
  <div class="summary-panel">
    <div
      class="summary"
      :style="{ height: expandType ? 'auto' : '90px' }"
    >
      <div
        id="summary-inner"
        class="summary-inner"
        v-html="videoInfo.introduction"
      />
    </div>
    <div
      v-show="showExpandBtn"
      class="expand-btn"
      @click="expand"
    >
      {{ expandType ? "收起" : "展开更多" }}
    </div>
    <div class="tag-list">
      <router-link
        v-for="item in videoInfo.tags"
        :key="item"
        :to="`/search?keyword=${item}`"
        class="tag-item"
        target="_blank"
      >
        {{ item }}
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, inject } from "vue";

const videoInfo = inject<any>("videoInfo");

const showExpandBtn = ref<boolean>(false);
//是否展开
const expandType = ref<boolean>(false);
const expand = () => {
  expandType.value = !expandType.value;
};

onMounted(() => {
  const el = document.querySelector("#summary-inner") as HTMLElement | null;
  const height = el ? el.clientHeight : 0;
  if (height > 90) {
    expandType.value = false;
    showExpandBtn.value = true;
  } else {
    expandType.value = true;
    showExpandBtn.value = false;
  }
});
</script>

<style lang="scss" scoped>
.summary-panel {
  padding: 20px 0;
  border-bottom: 1px solid #ddd;
  .summary {
    overflow: hidden;
  }
  .expand-btn {
    display: inline-block;
    margin-top: 5px;
    cursor: pointer;
    &:hover {
      color: var(--blue);
    }
  }
  .tag-list {
    margin-top: 20px;
    display: flex;
    flex-wrap: wrap;
    .tag-item {
      cursor: pointer;
      text-decoration: none;
      color: var(--text2);
      background: #f1f2f3;
      border-radius: 16px;
      height: 32px;
      line-height: 32px;
      padding: 0 12px;
      margin: 0 12px 8px 0;
    }
  }
}
</style>
