<template>
  <div
    :class="[layoutType == 'grid' ? 'data-list-grad' : '']"
    :style="{ 'grid-template-columns': `repeat(${gridCount}, 1fr)` }"
  >
    <template v-for="item in dataSource.list">
      <slot :data="item"></slot>
    </template>
  </div>
  <div class="bottom-loading" v-if="loading">
    <img :src="proxy.Utils.getLocalImage('playing.gif')" />数据加载中....
  </div>
  <div
    v-if="
      dataSource.pageNum >= (dataSource.pageTotal || 0) &&
      !loading &&
      dataSource.list.length > 0
    "
    class="reach-bottom"
  >
    {{ loadEndMsg }}
  </div>
  <NoData v-if="dataSource.list && dataSource.list.length == 0"> </NoData>
</template>

<script setup lang="ts">
import { mitter } from '@/eventbus/eventBus'
import { getCurrentInstance, onMounted, onUnmounted } from 'vue'
import type { PageData } from '@/api/_types'
const { proxy } = getCurrentInstance() as any

const props = withDefaults(
  defineProps<{
    layoutType?: 'grid' | string
    dataSource: PageData<any>
    loading?: boolean
    loadEndMsg?: string
    gridCount?: number
  }>(),
  {
    layoutType: 'grid',
    loading: false,
    loadEndMsg: '已到底部~~',
    gridCount: 5,
  }
)

const emit = defineEmits(['loadData'])
const scrollHandler = (curScrollTop: number) => {
  if (window.innerHeight + curScrollTop < document.body.offsetHeight) {
    return
  }
  const ds: any = (props as any).dataSource
  if (props.loading || ds.pageNum >= (ds.pageTotal || 0)) {
    return
  }
  let cur = Number(ds.pageNum)
  if (!Number.isFinite(cur) || cur < 1) {
    cur = 0
  }
  ds.pageNum = cur + 1
  emit('loadData')
};

onMounted(() => {
  mitter.on('windowScroll', (curScrollTop: number) => {
    scrollHandler(curScrollTop)
  })
});

onUnmounted(() => {
  mitter.off('windowScroll')
});
</script>

<style lang="scss" scoped>
.data-list-grad {
  display: grid;
  grid-gap: 20px;
  padding-bottom: 10px;
}

.reach-bottom {
  text-align: center;
  line-height: 40px;
  color: var(--text3);
}
.bottom-loading {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text3);
  img {
    width: 20px;
    margin-right: 10px;
  }
}
</style>