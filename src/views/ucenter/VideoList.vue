<template>
  <div class="video-tab">
    <div class="tab">
      视频管理
    </div>
    <div class="search">
      <el-input
        v-model="videoNameFuzzy"
        clearable
        placeholder="搜索稿件"
        size="small"
        @keyup.enter="loadVideoList"
      >
        <template #suffix>
          <span class="iconfont icon-search" />
        </template>
      </el-input>
    </div>
  </div>
  <div class="video-manage">
    <div class="top-info">
      <div class="all-video-panel">
        <div
          class="all-video"
          @click="cleanStatusLoad"
        >
          全部稿件<span class="count-info">{{
            (countInfo.inProgress ?? 0) +
              (countInfo.auditPassCount ?? 0) +
              (countInfo.auditFailCount ?? 0)
          }}</span>
        </div>
      </div>
      <div class="video-status">
        <span
          :class="['item', status == 0 ? 'active' : '']"
          @click="statusLoad(0)"
        >进行中<span class="count-info">{{
          countInfo.inProgress
        }}</span></span>
        <el-divider direction="vertical" />
        <span
          :class="['item', status == 4 ? 'active' : '']"
          @click="statusLoad(4)"
        >已通过<span class="count-info">{{
          countInfo.auditPassCount
        }}</span></span>
        <el-divider direction="vertical" />
        <span
          :class="['item', status == 5 ? 'active' : '']"
          @click="statusLoad(5)"
        >未通过<span class="count-info">{{
          countInfo.auditFailCount
        }}</span></span>
      </div>
    </div>
    <div class="video-list">
      <DataList
        :data-source="dataSource"
        @load-data="loadVideoList"
      >
        <template #default="{ data }">
          <VideoItem
            :data="data"
            @reload="loadVideoList"
          />
        </template>
      </DataList>
    </div>
  </div>
</template>

<script setup lang="ts">
import VideoItem from "./VideoItem.vue";
import { ref, onMounted, onUnmounted } from 'vue'

const videoNameFuzzy = ref<string>('');
const status = ref<number | null>(null);
const statusLoad = (_status: number) => {
  status.value = _status;
  loadVideoList();
};
const cleanStatusLoad = () => {
  status.value = null;
  loadVideoList();
};

const dataSource = ref<GetVideoPostPageResponse>({
  list: [],
  pageNum: 1,
  pageSize: 15,
  pageTotal: 1,
  totalCount: 0,
});
import { loadVideoList as apiUcenterLoadVideoList, getVideoCountInfo as apiUcenterGetVideoCountInfo } from '@/api/u_center_video_post'
import type {
  GetVideoPostCountInfoResponse,
  GetVideoPostPageResponse
} from "@/api/u_center_video_post/types.ts";
const loadVideoList = async () => {
  let params: any = {
    pageNum: dataSource.value.pageNum,
    pageSize: dataSource.value.pageSize,
    videoNameFuzzy: videoNameFuzzy.value,
    status: status.value,
  };
  let result = await apiUcenterLoadVideoList(params)
  if (!result) return
  dataSource.value = result
};
loadVideoList();

const countInfo = ref<GetVideoPostCountInfoResponse>({ inProgress: 0, auditPassCount: 0, auditFailCount: 0 });
const loadCountInfo = async () => {
  let result = await apiUcenterGetVideoCountInfo()
  if (!result) return
  countInfo.value = result
};
loadCountInfo();

let timmer = ref<any>(null);
const startTimer = () => {
  timmer.value = setInterval(() => {
    loadVideoList();
    loadCountInfo();
  }, 5000);
};

const cleanTimer = () => {
  if (timmer.value !== null) {
    clearInterval(timmer.value);
    timmer.value = null;
  }
};
onMounted(() => {
  startTimer();
});

onUnmounted(() => {
  cleanTimer();
});
</script>

<style lang="scss" scoped>
.video-tab {
  border-bottom: 1px solid #ddd;
  display: flex;
  padding: 0 40px;
  justify-content: space-between;
  .tab {
    cursor: pointer;
    font-weight: bold;
    font-size: 16px;
    color: var(--blue);
    padding-bottom: 15px;
    border-bottom: 3px solid var(--blue);
  }
  .search {
    width: 200px;
  }
}
.video-manage {
  margin-top: 10px;
  padding: 0 40px 10px 40px;
  .top-info {
    .count-info {
      padding: 0 5px;
    }
    .all-video-panel {
      display: flex;
      .all-video {
        cursor: pointer;
        font-size: 14px;
        color: var(--blue);
      }
    }
    .video-status {
      margin-top: 10px;
      display: flex;
      align-items: center;
      .item {
        cursor: pointer;
        font-size: 13px;
        margin-right: 0;
        color: var(--text2);
        &:hover {
          color: var(--blue);
        }
      }
      .active {
        color: var(--blue);
      }
    }
  }
}
</style>
