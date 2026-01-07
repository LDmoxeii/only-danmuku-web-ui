<template>
  <div
    v-if="seriesList.length > 0"
    class="my-video-list-title"
  >
    <router-link
      class="title"
      :to="`/user/${route.params.userId}/series`"
    >
      我的视频列表
    </router-link>
    <span
      v-if="myself"
      class="iconfont icon-add op-btn new-btn"
      @click="showVieoSeries"
    >新建</span>
  </div>
  <div
    v-for="item in seriesList"
    :key="item.seriesId"
    class="part-item"
  >
    <div class="part-title">
      <div class="title-panel">
        <router-link
          class="title"
          :to="`/user/${route.params.userId}/series/${item.seriesId}`"
        >
          {{ item.seriesName }}
        </router-link>
        <div class="count-info">
          {{ item.videoInfoList.length }}
        </div>
      </div>
      <router-link
        class="op-btn"
        :to="`/user/${route.params.userId}/series/${item.seriesId}`"
      >
        更多&gt;
      </router-link>
    </div>
    <div class="video-list5">
      <VideoItem
        v-for="video in item.videoInfoList"
        :key="video.videoId"
        :data="video"
      />
    </div>
  </div>
  <VideoSeriesEdit
    ref="videoSeriesEditRef"
    @reload="loadSeriesList"
  />
</template>

<script setup lang="ts">
import "@/assets/scss/uhome.scss";
import VideoSeriesEdit from "./VideoSeriesEdit.vue";
import VideoItem from "./VideoItem.vue";
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
const route = useRoute();
import { useLoginStore } from "@/stores/loginStore";
const loginStore = useLoginStore();

//是否是自己
const myself = computed(() => {
  return loginStore.userInfo.userId == route.params.userId;
});

//视频系列
const seriesList = ref<any[]>([]);
import { loadVideoSeriesWithVideo as apiLoadVideoSeriesWithVideo } from '@/api/video_series'
const loadSeriesList = async () => {
  const res = await apiLoadVideoSeriesWithVideo({ userId: route.params.userId })
  if (!res) return
  const list = res.list || []
  seriesList.value = list.map((item) => ({
    ...item,
    videoInfoList: item.videoInfoList || [],
  }))
};
loadSeriesList();

const videoSeriesEditRef = ref<any>();
const showVieoSeries = () => {
  videoSeriesEditRef.value.show();
};
</script>

<style lang="scss" scoped>
.my-video-list-title {
  margin-top: 15px;
  .title {
    text-decoration: none;
    color: var(--text);
    font-size: 16px;
  }
  .new-btn {
    margin-left: 10px;
    padding: 5px 10px;
    cursor: pointer;
  }
}

.part-title {
  .title-panel {
    .title {
      font-size: 15px;
    }
  }
}
</style>

