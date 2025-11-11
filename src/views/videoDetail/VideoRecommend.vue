<template>
  <template v-for="item in dataList">
    <VideoItem :data="item" :layoutType="1" :marginTop="20"></VideoItem>
  </template>
</template>

<script setup lang="ts">
import {
  ref,
  getCurrentInstance,
  inject,
} from "vue";
const { proxy } = getCurrentInstance() as any;

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
