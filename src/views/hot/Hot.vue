<template>
  <div class="hot-container">
    <div class="hot-part-title-panel">
      <div class="hot-24">
        <div class="iconfont icon-hot" />
        <div>24小时热榜</div>
      </div>
    </div>
    <div class="data-list">
      <DataLoadMoreList
        :data-source="dataSource"
        :loading="loadingData"
        :grid-count="2"
        @load-data="loadDataList"
      >
        <template #default="{ data }">
          <VideoItem
            :data="data"
            :margin-top="20"
            :layout-type="1"
          />
        </template>
      </DataLoadMoreList>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { loadHotVideoList as apiLoadHotVideoList } from '@/api/video'

const loadingData = ref<boolean>(false)
const dataSource = ref<any>({
  list: [],
  pageNum: 1,
  pageSize: 15,
  pageTotal: 1,
  totalCount: 0,
});
const loadDataList = async () => {
  loadingData.value = true
  const result = await apiLoadHotVideoList({
    pageNum: dataSource.value.pageNum,
    pageSize: dataSource.value.pageSize,
  })
  loadingData.value = false
  if (!result) return
  const dataList = dataSource.value.list
  dataSource.value = Object.assign({}, result)
  if (result.pageNum > 1) dataSource.value.list = dataList.concat(result.list)
}
loadDataList()
</script>

<style lang="scss" scoped>
.hot-container {
  margin: 20px auto 0;
  min-width: 1070px;
  max-width: 1286px;
  .hot-part-title-panel {
    border-bottom: 1px solid #ddd;
    padding: 10px 0 20px 0;
    display: flex;
    .hot-24 {
      font-size: 20px;
      display: flex;
      align-items: center;
      position: relative;
      &::after {
        content: '';
        position: absolute;
        border-bottom: 2px solid var(--blue);
        width: 100%;
        bottom: -20px;
      }
      .icon-hot {
        width: 46px;
        height: 46px;
        background: #f07775;
        color: #fff;
        font-size: 20px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 10px;
      }
    }
  }
  .data-list {
    margin-top: 10px;
  }
}
</style>
