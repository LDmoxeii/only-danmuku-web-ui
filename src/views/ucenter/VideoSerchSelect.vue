<template>
  <div class="search-panel">
    <!-- 下拉框 -->
    <el-select
      v-model="searchForm.videoId"
      clearable
      placeholder="选择视频搜索"
      @change="loadData"
    >
      <el-option
        v-for="item in allVideoList"
        :key="item.videoId"
        :value="item.videoId"
        :label="item.videoName"
      />
    </el-select>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { loadAllVideo as apiLoadAllVideo } from '@/api/u_center_interact'
const route = useRoute()

type VideoItem = { videoId: string | null; videoName: string | null }

const searchForm = ref<{ videoId: number | string | undefined }>({
  videoId: route.query.videoId as any,
})
const allVideoList = ref<VideoItem[]>([])
const loadAllVideo = async () => {
  const list = await apiLoadAllVideo()
  allVideoList.value = list as any
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
