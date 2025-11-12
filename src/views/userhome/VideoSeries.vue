<template>
  <div class="video-list-panel">
    <div class="video-title">视频列表</div>
    <VueDraggable
      v-model="videoSeriesList"
      @Update="changeSort"
      handle=".move-handler"
      class="video-list"
      draggable=".list-item"
    >
      <template v-for="(item) in videoSeriesList" :key="item.seriesId">
        <div
          class="video-item-add"
          @click="showVieoSeries"
          v-if="item.seriesId == 'add'"
        >
          <div class="iconfont icon-add"></div>
          <div class="add-info">新建视频列表</div>
        </div>
        <div class="list-item" v-else @click="jump(item)">
          <div class="cover">
            <div class="move-handler iconfont icon-move" v-if="myself"></div>
            <Cover :source="item.cover"></Cover>
          </div>
          <div class="list-name">{{ item.seriesName }}</div>
          <div class="create-time">
            {{ proxy.Utils.formatDate(item.updateTime) }}
          </div>
        </div>
      </template>
    </VueDraggable>
    <NoData v-if="videoSeriesList.length == 0" msg="暂无视频列表"></NoData>
  </div>
  <VideoSeriesEdit
    ref="videoSeriesEditRef"
    @reload="loadVideoSeries"
  ></VideoSeriesEdit>
</template>

<script setup lang="ts">
import { VueDraggable } from "vue-draggable-plus";
import VideoSeriesEdit from "./VideoSeriesEdit.vue";
import { ref, getCurrentInstance, computed } from "vue";
const { proxy } = getCurrentInstance() as any;
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();

import { useLoginStore } from "@/stores/loginStore";
const loginStore = useLoginStore();

//是否是自己
const myself = computed(() => {
  return loginStore.userInfo.userId == route.params.userId;
});

const videoSeriesList = ref<any[]>([]);
const loadVideoSeries = async () => {
  const res = await (await import('@/api/uhome/series')).loadVideoSeries({ userId: route.params.userId as any })
  if (!res) return
  videoSeriesList.value = res as any
  if (myself.value) {
    videoSeriesList.value.unshift({ seriesId: 'add' })
  }
};
loadVideoSeries();
const videoSeriesEditRef = ref<any>();
const showVieoSeries = () => {
  videoSeriesEditRef.value.show();
};

const changeSort = async () => {
  let seriesIds = videoSeriesList.value.map((item: any) => item.seriesId)
  seriesIds.splice(0, 1)
  try { await (await import('@/api/uhome/series')).changeVideoSeriesSort(seriesIds.join(',')) } catch (e) { return }
  proxy.Message.success('����ɹ�')
};

const jump = (item: any) => {
  router.push(`/user/${route.params.userId}/series/${item.seriesId}`);
};
</script>

<style lang="scss" scoped>
.video-list-panel {
  padding: 20px;
  border-radius: 5px;
  background: #fff;
  .video-title {
    font-size: 18px;
  }
  .video-list {
    margin-top: 20px;
    display: grid;
    grid-gap: 20px;
    grid-template-columns: repeat(6, 1fr);
    .video-item-add {
      border-radius: 5px;
      width: 100%;
      height: 150px;
      border: 2px dashed #ddd;
      text-align: center;
      color: var(--text3);
      cursor: pointer;
      .icon-add {
        font-size: 40px;
        padding-top: 40px;
      }
    }
    .list-item {
      .cover {
        position: relative;
        .move-handler {
          width: 100%;
          height: 30px;
          cursor: move;
          position: absolute;
          left: 0px;
          top: 0px;
          background: #fff;
          z-index: 100;
          border-radius: 5px 5px 0px 0px;
          border: 1px solid #ddd;
          display: flex;
          align-items: center;
          justify-content: center;
          display: none;
        }
        &:hover {
          .move-handler {
            display: flex;
          }
        }
      }
      .list-name {
        margin-top: 5px;
      }
      .create-time {
        margin-top: 5px;
        color: var(--text3);
      }
    }
  }
}
</style>
