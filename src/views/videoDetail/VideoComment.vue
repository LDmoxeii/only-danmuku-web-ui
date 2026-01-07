<template>
  <div class="comment-panel">
    <div class="comment-title">
      <div class="title">
        评论<span class="comment-count">{{ dataSource.totalCount }}</span>
      </div>
      <div
        :class="['order-type-item', orderType === 0 ? 'active' : '']"
        @click="changeOrder(0)"
      >
        最热
      </div>
      <el-divider direction="vertical" />
      <div
        :class="['order-type-item', orderType === 1 ? 'active' : '']"
        @click="changeOrder(1)"
      >
        最新
      </div>
    </div>
    <div class="comment-content-panel">
      <VideoCommentSend
        :send-type="0"
        :show-send="showComment"
      />
      <div class="comment-list">
        <DataLoadMoreList
          :data-source="dataSource"
          :loading="loadingData"
          layout-type="list"
          load-end-msg="没有更多评论了"
          @load-data="loadCommentList"
        >
          <template #default="{ data }">
            <VideoCommentItem :data="data" />
          </template>
        </DataLoadMoreList>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, onMounted, onUnmounted, provide, ref } from 'vue'
import { useRoute } from 'vue-router'
import { mitter } from '@/eventbus/eventBus'
import { ACTION_TYPE } from '@/utils/Constants'
import { loadComment as apiLoadComment } from '@/api/video_comment'
import VideoCommentItem from './VideoCommentItem.vue'
import VideoCommentSend from './VideoCommentSend.vue'

const route = useRoute()

// 判断当前视频是否允许评论（interaction 包含“1”表示关闭）
const videoInfo = inject<any>('videoInfo')
const showComment = computed(() => {
  return (
    !videoInfo?.value ||
    videoInfo.value.interaction == null ||
    videoInfo.value.interaction.indexOf('1') === -1
  )
})

const loadingData = ref(false)
const dataSource = ref<any>({
  list: [],
  pageNum: 1,
  pageSize: 15,
  pageTotal: 1,
  totalCount: 0,
})
const orderType = ref(0)

// 控制哪一条评论显示回复框
const showReplyHandler = (commentId: number | string) => {
  dataSource.value.list.forEach((item: any) => {
    item.showReply = item.commentId === commentId
  })
}
provide('showReply', showReplyHandler)

const changeOrder = (type: number) => {
  orderType.value = type
  dataSource.value.pageNum = 1
  dataSource.value.list = []
  loadCommentList()
}

// 根据接口返回的 pCommentId 构建父子评论树
const buildCommentTree = (rows: any[]): any[] => {
  const map = new Map<string, any>()

  rows.forEach((raw) => {
    const rawPid = (raw as any).pCommentId ?? (raw as any).pcommentId ?? 0
    const pid =
      rawPid === undefined || rawPid === null || rawPid === '' ? 0 : rawPid

    const node: any = raw
    node.pCommentId = pid
    node.children = []

    map.set(String(node.commentId), node)
  })

  const roots: any[] = []

  map.forEach((node) => {
    const pid = node.pCommentId ?? 0
    const isRoot = !pid || pid === 0 || pid === '0'

    if (isRoot) {
      roots.push(node)
      return
    }

    const parent = map.get(String(pid))
    if (parent) {
      if (!Array.isArray(parent.children)) {
        parent.children = []
      }
      parent.children.push(node)
    } else {
      // 没有找到父评论时，当作根评论避免数据丢失
      roots.push(node)
    }
  })

  return roots
}

const loadCommentList = async () => {
  if (!showComment.value) {
    return
  }
  loadingData.value = true
  const result = await apiLoadComment({
    videoId: route.params.videoId,
    pageNum: dataSource.value.pageNum,
    pageSize: dataSource.value.pageSize,
  })
  loadingData.value = false
  if (!result) {
    return
  }

  const userActionMap: any = {}
  const userActionList = result.userActionList as any[]
  userActionList.forEach((item) => {
    userActionMap[item.commentId] = item
  })

  const commentData = result.commentData
  // 先根据 pCommentId 将扁平列表转成父子结构
  commentData.list = buildCommentTree(commentData.list as any[])

  const setActiveDeep = (item: any) => {
    setCommentActive(userActionMap, item)
    ;(item.children || []).forEach((sub: any) => setActiveDeep(sub))
  }

  commentData.list.forEach((item: any) => {
    setActiveDeep(item)
  })

  const dataList = dataSource.value.list
  dataSource.value = Object.assign({}, commentData)
  if (commentData.pageNum > 1) {
    dataSource.value.list = dataList.concat(commentData.list)
  }
}
loadCommentList()

// 设置点赞 / 踩 选中状态
const setCommentActive = (userActionMap: Record<string, any>, item: any) => {
  const userActon = userActionMap[item.commentId]
  if (userActon) {
    if (ACTION_TYPE.COMMENT_LIKE.value == userActon.actionType) {
      item.likeCountActive = true
    } else if (ACTION_TYPE.COMMENT_HATE.value == userActon.actionType) {
      item.hateCountActive = true
    }
  }
}

onMounted(() => {
  // 发表评论 / 回复成功后刷新，保持最新
  mitter.on('postCommentSuccess', () => {
    dataSource.value.pageNum = 1
    dataSource.value.list = []
    loadCommentList()
  })

  // 删除评论
  mitter.on(
    'delCommentCallback',
    ({ pCommentId, commentId }: { pCommentId: number; commentId: number }) => {
      if (pCommentId == 0) {
        dataSource.value.list = dataSource.value.list.filter((item: any) => {
          return item.commentId != commentId
        })
        dataSource.value.totalCount--
      } else {
        const pComment = dataSource.value.list.find((item: any) => {
          return item.commentId == pCommentId
        })
        if (pComment && pComment.children) {
          pComment.children = pComment.children.filter((item: any) => {
            return item.commentId != commentId
          })
        }
      }
    },
  )

  // 置顶 / 取消置顶后刷新
  mitter.on('topCommentCallback', () => {
    dataSource.value.pageNum = 1
    dataSource.value.list = []
    loadCommentList()
  })
})

onUnmounted(() => {
  mitter.off('postCommentSuccess')
  mitter.off('delCommentCallback')
  mitter.off('topCommentCallback')
})
</script>

<style lang="scss" scoped>
.comment-panel {
  margin-top: 20px;

  .comment-title {
    display: flex;
    align-items: center;
    font-size: 15px;

    .title {
      font-size: 20px;
      font-weight: 500;

      .comment-count {
        margin-left: 5px;
        font-size: 14px;
        margin-right: 30px;
        color: var(--text2);
      }
    }

    .order-type-item {
      cursor: pointer;
    }

    .active {
      color: var(--blue);
    }
  }

  .comment-content-panel {
    padding-left: 10px;
    position: relative;

    .comment-list {
      padding-bottom: 20px;
    }
  }
}
</style>


