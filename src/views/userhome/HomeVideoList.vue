<template>
  <div v-if="dataSource.list && dataSource.list.length == 0">
    <NoData msg="空间主人还没有投过视频哦~~" />
  </div>
  <div
    v-else
    class="part-item"
  >
    <div class="part-title">
      <div class="title-panel">
        <router-link
          class="title"
          :to="`/user/${route.params.userId}/video`"
        >
          TA的视频
        </router-link>
        <div class="count-info">
          {{ dataSource.totalCount }}
        </div>
      </div>
      <router-link
        class="op-btn"
        :to="`/user/${route.params.userId}/video`"
      >
        更多&gt;
      </router-link>
    </div>
    <div class="video-list5">
      <VideoItem
        v-for="item in dataSource.list"
        :data="item"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import "@/assets/scss/uhome.scss";
import VideoItem from "./VideoItem.vue";
import { ref } from "vue";
import { useRoute } from "vue-router";
const route = useRoute();
import { loadVideoList as apiLoadVideoList } from '@/api/uhome'

const dataSource = ref<any>({
  list: [],
  pageNum: 1,
  pageSize: 15,
  pageTotal: 1,
  totalCount: 0,
});
const loadVideoList = async () => {
  const res = await apiLoadVideoList({ pageNum: 1, userId: route.params.userId as any, type: 0 })
  if (!res) return
  dataSource.value = res as any
};
loadVideoList();
</script>

<style lang="scss" scoped>
</style>
