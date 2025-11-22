<template>
  <div class="video-panel">
    <div class="video-title-panel">
      <div class="video-title">
        我的视频
      </div>
      <MyTab
        v-model="activeTab"
        :tags="[
          { name: '最新发布' },
          { name: '最多播放' },
          { name: '最多收藏' },
        ]"
        @click-handler="loadVideoList"
      />
    </div>
    <div v-if="dataSource.list && dataSource.list.length == 0">
      <NoData msg="空间主人还没有投过视频哦~~" />
    </div>
    <DataGridList
      v-else
      :data-source="dataSource"
      @load-data="loadVideoList"
    >
      <template #default="{ data }">
        <VideoItem :data="data" />
      </template>
    </DataGridList>
  </div>
</template>

<script setup lang="ts">
import VideoItem from './VideoItem.vue'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
import { loadVideoList as apiLoadVideoList } from '@/api/uhome'

const activeTab = ref<number>(0)

const videoName = ref<string | undefined>()
const dataSource = ref<any>({
  list: [],
  pageNum: 1,
  pageSize: 15,
  pageTotal: 1,
  totalCount: 0,
});
const loadVideoList = async () => {
  let params: any = {
    pageNum: dataSource.value.pageNum,
    videoName: videoName.value,
    orderType: activeTab.value,
  }
  params.userId = route.params.userId
  const res = await apiLoadVideoList(params)
  if (!res) return
  dataSource.value = res as any
}
loadVideoList()

watch(
  () => route.query.videoName,
  (newVal, _) => {
    if (typeof newVal === 'string') {
      videoName.value = newVal
    } else if (Array.isArray(newVal)) {
      videoName.value = (newVal[0] as string) || undefined
    } else {
      videoName.value = undefined
    }
    loadVideoList()
  },
  { immediate: true, deep: true }
)
</script>

<style lang="scss" scoped>
.video-panel {
  padding: 20px;
  background: #fff;
  border-radius: 5px;
  .video-title-panel {
    display: flex;
    align-items: center;
    .video-title {
      font-size: 18px;
    }
  }
}
</style>
