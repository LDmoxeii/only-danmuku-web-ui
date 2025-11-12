<template>
  <div v-if="dataSource.list != null && dataSource.list.length == 0">
    <NoData msg="空空如也" />
  </div>
  <div class="data-list-panel">
    <template v-for="item in dataSource.list">
      <slot :data="item"></slot>
    </template>
  </div>
  <div class="pagination" v-if="showPagination && dataSource.pageTotal > 1">
    <el-pagination v-if="dataSource.pageTotal > 1" background :total="dataSource.totalCount"
      :current-page="dataSource.pageNum" layout="prev, pager, next" @current-change="handlepageNumChange"
      :page-size="dataSource.pageSize"></el-pagination>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    dataSource: any
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
  padding: 10px 0px 5px 0px;
  text-align: right;
  overflow: hidden;
  height: 50px;
  :deep(.el-pagination) {
    float: right;
  }
}
</style>
