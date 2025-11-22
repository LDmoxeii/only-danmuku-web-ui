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
import {
  ref,
  inject,
} from "vue";

const dataList = ref<any[]>([]);

const videoInfo = inject<any>("videoInfo");
import { getVideoRecommend as apiGetVideoRecommend } from '@/api/video'
const loadDataList = async () => {
  const list = await apiGetVideoRecommend(videoInfo.value.videoName, videoInfo.value.videoId)
  if (!list) return
  dataList.value = list
}
loadDataList()
</script>

<style lang="scss" scoped>
</style>
