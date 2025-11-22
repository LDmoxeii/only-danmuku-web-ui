<template>
  <div v-if="dataSource.list != null && dataSource.list.length == 0">
    <NoData msg="空空如也" />
  </div>
  <div
    class="data-list"
    :style="{ 'grid-template-columns': `repeat(${gridCount}, 1fr)` }"
  >
    <template v-for="item in dataSource.list">
      <slot :data="item" />
    </template>
  </div>
  <div
    v-if="showPagination && dataSource.pageTotal > 1"
    class="pagination"
  >
    <el-pagination
      v-if="dataSource.pageTotal > 1"
      background
      :total="dataSource.totalCount"
      :current-page="dataSource.pageNum"
      layout="prev, pager, next"
      :page-size="dataSource.pageSize"
      @current-change="handlepageNumChange"
    />
  </div>
</template>

<script setup lang="ts">
import type { PageData } from '@/api/_types'

withDefaults(
  defineProps<{
    gridCount?: number
    dataSource: PageData<any>
    showPagination?: boolean
  }>(),
  { gridCount: 5, showPagination: true }
)

const emit = defineEmits<{ (e: 'loadData'): void }>()
const handlepageNumChange = (_pageNum: number) => {
  emit('loadData')
}
</script>

<style lang="scss" scoped>
.data-list {
  display: grid;
  grid-gap: 20px;
}
.pagination {
  margin-top: 20px;
  padding: 10px 0 5px 0;
  text-align: center;
  overflow: hidden;
  height: 50px;
  display: flex;
  justify-content: left;
}
</style>
