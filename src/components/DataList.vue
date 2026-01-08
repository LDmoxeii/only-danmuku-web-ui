<template>
  <div v-if="dataSource.list != null && dataSource.list.length == 0">
    <NoData msg="空空如也" />
  </div>
  <div class="data-list-panel">
    <template v-for="item in dataSource.list">
      <slot :data="item" />
    </template>
  </div>
  <div
    v-if="showPagination && (dataSource.pageTotal ?? 0) > 1"
    class="pagination"
  >
    <el-pagination
      v-if="(dataSource.pageTotal ?? 0) > 1"
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
    dataSource: PageData<any>
    showPagination?: boolean
  }>(),
  { showPagination: true }
)

const emit = defineEmits<{ (e: 'loadData'): void }>()
const handlepageNumChange = (_: number) => {
  emit('loadData')
}
</script>

<style lang="scss" scoped>
.data-list-panel {
  max-height: calc(100% - 50px);
  overflow: auto;
}
.pagination {
  padding: 10px 0 5px 0;
  text-align: right;
  overflow: hidden;
  height: 50px;
  :deep(.el-pagination) {
    float: right;
  }
}
</style>
