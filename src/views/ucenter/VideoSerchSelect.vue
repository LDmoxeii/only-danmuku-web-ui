<template>
  <div class="search-panel">
    <!-- 下拉框 -->
    <el-select clearable placeholder="选择视频搜索" v-model="searchForm.videoId" @change="loadData">
      <el-option :value="item.videoId" :label="item.videoName" v-for="item in allVideoList"></el-option>
    </el-select>
  </div>
</template>

<script setup lang="ts">
import { ref, getCurrentInstance } from 'vue'
import { useRoute } from 'vue-router'
const { proxy } = getCurrentInstance() as any
const route = useRoute()

type VideoItem = { videoId: number | string; videoName: string }

const searchForm = ref<{ videoId: number | string | undefined }>({
  videoId: route.query.videoId as any,
})
const allVideoList = ref<VideoItem[]>([])
const loadAllVideo = async () => {
  const result = await proxy.Request({
    url: proxy.Api.ucLoadAllVideo,
  })
  if (!result) return
  allVideoList.value = result.data as VideoItem[]
}
loadAllVideo()

const emit = defineEmits<{
  (e: 'loadData', id: number | string | undefined): void
}>()
const loadData = (e: number | string | undefined) => {
  emit('loadData', e)
}
</script>

<style lang="scss" scoped>
.search-panel {
  width: 200px;
  float: right;
  height: 40px;
}
</style>
