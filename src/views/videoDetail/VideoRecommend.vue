<template>
  <VideoItem
    v-for="item in dataList"
    :key="item.videoId"
    :data="item"
    :layout-type="1"
    :margin-top="20"
  />
</template>

<script setup lang="ts">
import { ref, inject, watch } from "vue";
import type { Ref } from "vue";

const dataList = ref<any[]>([]);

const videoInfo = inject<Ref<any>>("videoInfo");
import { getVideoRecommend as apiGetVideoRecommend } from '@/api/video'
const loadDataList = async () => {
  if (!videoInfo?.value || !videoInfo.value.videoId) {
    return;
  }
  const list = await apiGetVideoRecommend(
    videoInfo.value.videoName,
    videoInfo.value.videoId
  );
  if (!list) return
  dataList.value = list
}

watch(
  () => videoInfo?.value?.videoId,
  (videoId) => {
    if (!videoId) return;
    loadDataList();
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped>
</style>
