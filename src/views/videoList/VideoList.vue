<template>
  <div class="data-list">
    <DataLoadMoreList :dataSource="dataSource" :loading="loadingData" @loadData="loadDataList">
      <template #default="{ data }">
        <VideoItem :data="data" :marginTop="20" ref="videoItemRef"></VideoItem>
      </template>
    </DataLoadMoreList>
  </div>
</template>

<script setup lang="ts">
import { useCategoryStore } from '@/stores/categoryStore'
const categoryStore = useCategoryStore()

import { mitter } from '@/eventbus/eventBus'
import {
  ref,
  reactive,
  getCurrentInstance,
  nextTick,
  watch,
  inject,
  onMounted,
  onUnmounted,
} from 'vue'
const { proxy } = getCurrentInstance() as any
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()
import { loadVideo as apiLoadVideo } from '@/api/video'

const categoryMap: any = categoryStore.categoryMap
const categoryIdInfo = ref<any>({})

const convertCode2Id = (pCategoryCode?: string, categoryCode?: string) => {
  let parentCategoryId: string = ''
  let categoryId: string = ''
  if (pCategoryCode) {
    parentCategoryId = categoryMap[pCategoryCode]
      ? categoryMap[pCategoryCode].categoryId
      : ''
  }
  if (categoryCode) {
    categoryId = categoryMap[categoryCode]
      ? categoryMap[categoryCode].categoryId
      : ''
  }
  categoryIdInfo.value = {
    parentCategoryId,
    categoryId,
  }
}
const loadingData = ref<boolean>(false)
const dataSource = ref<any>({
  list: [],
  pageNum: 1,
  pageSize: 15,
  pageTotal: 1,
  totalCount: 0,
});
const loadDataList = async () => {
  const params: any = { pageNum: dataSource.value.pageNum }
  Object.assign(params, categoryIdInfo.value)
  loadingData.value = true
  const result = await apiLoadVideo(params)
  loadingData.value = false
  if (!result) return
  const dataList = dataSource.value.list
  dataSource.value = Object.assign({}, result)
  if (result.pageNum > 1) dataSource.value.list = dataList.concat(result.list)
}

const initData = () => {
  convertCode2Id(route.params.pCategoryCode as string, route.params.categoryCode as string)
  loadDataList()
}

const categoryInit = ref<boolean>(false)
watch(
  () => route.params,
  (newVal, oldVal) => {
    if (newVal) {
      if (!categoryInit.value) {
        return
      }
      categoryStore.setCureentPCategory(route.params.pCategoryCode)
      initData()
    }
  },
  { immediate: true, deep: true }
)

watch(
  () => categoryStore.categoryMap,
  (newVal, oldVal) => {
    if (!newVal || Object.keys(newVal).length == 0) {
      return
    }
    categoryInit.value = true
    categoryStore.setCureentPCategory(route.params.pCategoryCode)
    initData()
  },
  { immediate: true, deep: true }
)
</script>

<style lang="scss" scoped>
</style>
