<template>
  <div class="category-video-body">
    <div
      id="category-list"
      :class="['category-list', categoryFxied ? 'category-fxied' : '']"
    >
      <div class="category-title">
        {{ categoryStore.cureentPCategory.categoryName }}
      </div>
      <div
        :class="['category-item', !route.params.categoryCode ? 'active' : '']"
        @click="jump()"
      >
        首页
      </div>
      <div
        v-for="item in categoryStore.cureentPCategory.children"
        :key="item.categoryCode"
        :class="[
          'category-item',
          route.params.categoryCode == item.categoryCode ? 'active' : '',
        ]"
        @click="jump(item)"
      >
        {{ item.categoryName }}
      </div>
    </div>
    <VideoList />
  </div>
</template>

<script setup lang="ts">
import { mitter } from '@/eventbus/eventBus'
import VideoList from '@/views/videoList/VideoList.vue'
import { useNavAction } from '@/stores/navActionStore'
const navActionStore = useNavAction()

import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()

import { useCategoryStore } from '@/stores/categoryStore'
const categoryStore = useCategoryStore()

const jump = (item: { categoryCode?: string } = { categoryCode: '' }) => {
  if (!item.categoryCode) {
    router.push({ name: 'categoryVideo' })
    return
  }
  router.push({
    name: 'subCategoryVideo',
    params: { categoryCode: item.categoryCode },
  })
}

// 分类栏距离顶部距离
const categoryTopDistance = ref<number>(200)
// 分类栏是否固定
const categoryFxied = ref<boolean>(false)

// 上一次滚动位置
let initScrollTop = 0
// 是否向下滚动
let scrollDown = true
const scrollHandler = (curScrollTop: number) => {
  scrollDown = curScrollTop - initScrollTop > 0
  initScrollTop = curScrollTop

  if (curScrollTop >= categoryTopDistance.value) {
    categoryFxied.value = true
    // 当分类栏固定在顶部时，如果向下滚动则隐藏 header，向上滚动则显示
    navActionStore.setFixedHeader(!scrollDown)
  } else {
    categoryFxied.value = false
    // 未到固定高度时始终显示 header
    navActionStore.setFixedHeader(false)
  }
}

onMounted(() => {
  // 获取分类栏距离顶部的初始距离
  const categoryEl = document.querySelector<HTMLElement>('#category-list')
  categoryTopDistance.value = categoryEl?.getBoundingClientRect().top ?? 0

  // 初始化导航 store
  navActionStore.setShowHeader(true)
  navActionStore.setFixedHeader(false)
  navActionStore.setFixedCategory(false)
  navActionStore.setShowCategory(true)
  navActionStore.setForceFixedHeader(false)

  mitter.on('windowScroll', (curScrollTop) => {
    scrollHandler(curScrollTop as number)
  })
})

onUnmounted(() => {
  mitter.off('windowScroll')
})
</script>

<style lang="scss" scoped>
.category-video-body {
  margin-top: 30px;
  .category-list {
    display: flex;
    align-items: center;
    line-height: 30px;
    position: sticky;
    top: 0;
    height: 60px;
    background: #fff;
    z-index: 2;
    .category-title {
      font-size: 24px;
      margin-right: 40px;
      cursor: pointer;
    }
    .category-item {
      margin-right: 40px;
      font-size: 15px;
      cursor: pointer;
      border-bottom: 3px solid #fff;
      &:hover {
        color: var(--blue);
        border-color: var(--blue);
      }
    }
    .active {
      color: var(--blue);
      border-color: var(--blue);
    }
  }
  .category-fxied {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  }
}
</style>
