<template>
  <div
    class="main-container"
    :style="{
      'max-width': proxy.bodyMaxWidth + 'px',
      'min-width': proxy.bodyMinWidth + 'px',
    }"
  >
    <div
      v-show="navActionStore.showHeader"
      class="header"
      :style="{
        'background-image': `url(${
          backgroundImage
            ? backgroundImage
            : proxy.Utils.getLocalImage('banner_bg.png')
        })`,
      }"
    >
      <LayoutHeader
        theme="light"
        :hot-search-list="hotSearchList"
      />
    </div>
    <!--固定在顶部的-->
    <div
      v-show="
        (navActionStore.fixedHeader && showFixedHeader) ||
          navActionStore.forceFixedHeader
      "
      class="header-fixed"
      :style="{
        'max-width': proxy.bodyMaxWidth + 'px',
        'min-width': proxy.bodyMinWidth + 'px',
      }"
    >
      <LayoutHeader
        theme="dark"
        :hot-search-list="hotSearchList"
      />
    </div>
    <!--显示fixed分类-->
    <div
      v-show="navActionStore.fixedCategory && showFixedCategory"
      class="category-fixed"
      :style="{
        'max-width': proxy.bodyMaxWidth + 'px',
        'min-width': proxy.bodyMinWidth + 'px',
      }"
      @mouseover="lineCategoryMouseHandler(1)"
      @mouseout="lineCategoryMouseHandler(0)"
    >
      <div class="category-fixed-inner">
        <Category
          :show-type="1"
          :mouse-over="mouseOver"
        />
      </div>
    </div>
    <div
      class="body-container"
      :style="{
        'max-width': proxy.bodyMaxWidth + 'px',
        'min-width': proxy.bodyMinWidth + 'px',
      }"
    >
      <div
        v-show="navActionStore.showCategory"
        class="category"
      >
        <Category :show-type="0" />
      </div>
      <div class="body-main">
        <router-view />
      </div>
    </div>
  </div>
  <Account />
</template>

<script setup lang="ts">
import { mitter } from '@/eventbus/eventBus'
import Account from '@/views/account/Account.vue'
import { useNavAction } from '@/stores/navActionStore'
const navActionStore = useNavAction()

import { useLoginStore } from '@/stores/loginStore'
const loginStore = useLoginStore()

import { useCategoryStore } from '@/stores/categoryStore'
const categoryStore = useCategoryStore()

import Category from './Category.vue'
import LayoutHeader from './LayoutHeader.vue'
import { sourcePath } from '@/api/file'
import {
  ref,
  getCurrentInstance,
  onMounted,
  onUnmounted,
  watch,
  computed,
} from 'vue'
const { proxy } = getCurrentInstance() as any

const mouseOver = ref<boolean>(false)
const lineCategoryMouseHandler = (type: number) => {
  mouseOver.value = type == 1;
}

const showFixedHeader = ref<boolean>(false)
const showFixedCategory = ref<boolean>(false)

const showFixedTopHandler = (curScrollTop: number) => {
  showFixedHeader.value = curScrollTop > 20;
  showFixedCategory.value = curScrollTop > 250;
}

onMounted(() => {
  window.addEventListener('scroll', windowScrollHandler)
  window.addEventListener('resize', windowResizeHandler)
})

onUnmounted(() => {
  window.removeEventListener('scroll', windowScrollHandler)
  window.removeEventListener('resize', windowResizeHandler)
})

const windowScrollHandler = () => {
  const curScrollTop = window.scrollY
  showFixedTopHandler(curScrollTop)
  mitter.emit('windowScroll', curScrollTop)
}

const windowResizeHandler = () => {
  mitter.emit('windowResize')
}

const backgroundImage = computed(() => {
  const background = categoryStore.cureentPCategory
    ? categoryStore.cureentPCategory.background
    : null
  if (background) {
    return sourcePath + background
  } else {
    return null
  }
})

//热搜
const hotSearchList = ref<any[]>([])
import { getSearchKeywordTop as apiGetSearchKeywordTop } from '@/api/video'
const getSearchKeywordTop = async () => {
  const data = await apiGetSearchKeywordTop()
  if (!data) return
  hotSearchList.value = data
}
getSearchKeywordTop()

//获取消息数
import { getNoReadCountGroup as apiGetNoReadCountGroup } from '@/api/user_message'
const getNoReadCount = async () => {
  if (Object.keys(loginStore.userInfo).length == 0) return
  const list = await apiGetNoReadCountGroup()
  if (!list) return
  const total = list.reduce((sum, item) => sum + (item.messageCount || 0), 0)
  loginStore.saveMessageNoReadCount(total)
}
watch(
  () => loginStore.userInfo,
  (newVal, _) => {
    if (newVal) {
      getNoReadCount()
    }
  },
  { immediate: true, deep: true }
)
</script>

<style>
body {
  background: #ededed !important;
}
</style>
<style lang="scss" scoped>
.main-container {
  position: relative;
  margin: 0 auto;
  background: #fff;
  min-height: calc(100vh);
  .header {
    margin: 0 auto;
    height: 180px;
    background-color: #7c9ce1;
    background-position: center;
    background-repeat: no-repeat;
    width: 100%;
    position: relative;
  }

  .header-fixed {
    position: fixed;
    width: 100%;
    z-index: 1001;
    top: 0;
    background: #fff;
    height: 64px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  }
  .category-fixed {
    position: fixed;
    z-index: 1000;
    top: 64px;
    width: 100%;
    background: #fff;
    padding: 10px 150px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
    .category-fixed-inner {
      margin: 0 auto;
    }
  }
  .body-container {
    padding: 0 var(--bodyPadding);
    .category {
      margin-top: 20px;
    }
  }
}

@media screen and (max-width: 1500px) {
  .main-container {
    .body-container {
      padding: 0 60px;
    }
  }
}
</style>

