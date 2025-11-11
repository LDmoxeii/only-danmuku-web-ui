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

const loadDataList = async () => {
  let result = await proxy.Request({
    url: proxy.Api.getVideoRecommend,
    params: {
      keyword: videoInfo.value.videoName,
      videoId: videoInfo.value.videoId,
    },
  });
  if (!result) {
    return;
  }
  dataList.value = result.data;
};
loadDataList();
</script>

<style lang="scss" scoped>
</style>
