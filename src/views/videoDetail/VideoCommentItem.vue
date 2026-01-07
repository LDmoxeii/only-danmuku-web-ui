<template>
  <!-- eslint-disable vue/no-v-html, vue/singleline-html-element-content-newline, vue/max-attributes-per-line, vue/html-indent -->
  <div class="comment-item">
    <Avatar
      :width="replyLevel == 1 ? 50 : 30"
      :avatar="data.avatar"
      :user-id="data.userId"
    />
    <div class="comment-content-panel">
      <div class="nick-name-panel">
        <router-link
          :to="`/user/${data.userId}`"
          class="nick-name"
        >
          {{ data.nickName }}
        </router-link>
        <template v-if="data.replyUserId">
          <div class="reply-title">回复</div>
          <router-link
            :to="`/user/${data.replyUserId}`"
            class="reply-nick-name"
          >
            @{{ data.replyNickName }}
          </router-link>
        </template>
      </div>
      <div class="comment-message">
        <Tag v-if="data.topType == 1" :type="0" />
        <span v-html="proxy.Utils.resetHtmlContent(data.content)" />
      </div>
      <div v-if="data.imgPath" class="image-show">
        <Cover
          :source="proxy.Utils.getFileName(data.imgPath) + proxy.imageThumbnailSuffix"
          :preview="true"
          fit="cover"
        />
      </div>
      <div class="comment-op">
        <div class="op-left">
          <div class="comment-time">
            {{ data.postTime }}
          </div>
          <div
            :class="['iconfont icon-good', data.likeCountActive ? 'active' : '']"
            @click="doLike(data)"
          >
            {{ data.likeCount == 0 ? '' : data.likeCount }}
          </div>
          <div
            :class="[
              'iconfont icon-no-good',
              data.hateCountActive ? 'active' : '',
            ]"
            @click="doHate(data)"
          >
            {{ data.hateCount == 0 ? '' : data.hateCount }}
          </div>
          <div
            class="reply-btn"
            @click="showReplyHandler(data, replyLevel!)"
          >
            回复
          </div>
        </div>
        <el-dropdown
          v-if="
            data.userId == loginStore.userInfo.userId ||
            videoInfo.userId == loginStore.userInfo.userId
          "
        >
          <span class="op-right iconfont icon-more" />
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-if="
                  videoInfo.userId == loginStore.userInfo.userId &&
                  data.pcommentId == 0
                "
                @click="topComment"
              >
                {{ data.topType == 1 ? '取消置顶' : '置顶' }}
              </el-dropdown-item>
              <el-dropdown-item
                v-if="
                  videoInfo.userId == loginStore.userInfo.userId ||
                  data.userId == loginStore.userInfo.userId
                "
                @click="delComment"
              >
                删除
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <div class="reply-list">
        <VideoCommentItem
          v-for="item in data.children"
          :key="item.commentId"
          :data="item"
          :reply-level="2"
        />
      </div>
      <VideoCommentSend
        v-if="replyLevel == 1 && data.showReply"
        :send-type="1"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import Tag from '@/components/Tag.vue'
import { doAction as apiDoAction } from '@/api/user_action'
import { userDelComment as apiUserDelComment, userTopComment as apiUserTopComment, userCancelTopComment as apiUserCancelTopComment } from '@/api/video_comment'
import { ACTION_TYPE } from '@/utils/Constants'

import VideoCommentSend from './VideoCommentSend.vue'
import VideoCommentItem from './VideoCommentItem.vue'
import Avatar from '@/components/Avatar.vue'
import { getCurrentInstance, nextTick, inject } from 'vue'
const { proxy } = getCurrentInstance() as any
import { useRoute } from 'vue-router'
const route = useRoute()

import { useLoginStore } from '@/stores/loginStore'
const loginStore = useLoginStore()

import { mitter } from '@/eventbus/eventBus'

const props = withDefaults(defineProps<{
  data: any
  replyLevel?: number
}>(), {
  replyLevel: 1,
})

const videoInfo = inject<any>('videoInfo')
const showReply = inject<(commentId: number | string) => void>('showReply')!

const showReplyHandler = (item: any, replyLevel: number) => {
  showReply(replyLevel == 1 ? item.commentId : item.pCommentId)
  nextTick(() => {
    const commentData = {
      replyCommentId: item.commentId,
      nickName: item.nickName,
    }
    mitter.emit('initCommentData', commentData)
  })
}

const doLike = (data: any) => {
  apiDoAction({
    videoId: route.params.videoId,
    actionType: ACTION_TYPE.COMMENT_LIKE.value,
    commentId: data.commentId,
  }).then(() => {
    if (data.hateCountActive) {
      data.hateCountActive = false
      data.hateCount--
    }
    if (data.likeCountActive) {
      data.likeCountActive = false
      data.likeCount--
    } else {
      data.likeCount++
      data.likeCountActive = true
    }
  })
}

const doHate = (data: any) => {
  apiDoAction({
    videoId: route.params.videoId,
    actionType: ACTION_TYPE.COMMENT_HATE.value,
    commentId: data.commentId,
  }).then(() => {
    if (data.likeCountActive) {
      data.likeCountActive = false
      data.likeCount--
    }
    if (data.hateCountActive) {
      data.hateCountActive = false
      data.hateCount--
    } else {
      data.hateCount++
      data.hateCountActive = true
    }
  })
}

const delComment = () => {
  proxy.Confirm({
    message: '确定要删除评论',
    okfun: async () => {
      await apiUserDelComment({ commentId: props.data.commentId })
      mitter.emit('delCommentCallback', {
        pCommentId: props.data.pCommentId,
        commentId: props.data.commentId,
      })
    },
  })
}

const topComment = () => {
  proxy.Confirm({
    message: `确定要${props.data.topType == 1 ? '取消置顶' : '置顶'}吗？`,
    okfun: async () => {
      if (props.data.topType == 1) {
        await apiUserCancelTopComment({ commentId: props.data.commentId })
      } else {
        await apiUserTopComment({ commentId: props.data.commentId })
      }
      mitter.emit('topCommentCallback')
    },
  })
}
</script>

<style lang="scss" scoped>
.comment-item {
  display: flex;
  border-bottom: 1px solid #ddd;
  padding: 10px 0px;
  .comment-content-panel {
    flex: 1;
    margin-left: 15px;
    margin-top: 5px;
    .nick-name-panel {
      font-size: 14px;
      display: flex;
      align-items: center;
      vertical-align: middle;
      .nick-name {
        text-decoration: none;
        color: var(--text2);
      }
      .reply-title {
        margin: 0px 3px;
      }
      .reply-nick-name {
        text-decoration: none;
        color: var(--blue3);
      }
    }
    .comment-message {
      font-size: 14px;
      line-height: 20px;
      margin-top: 5px;
    }
    .image-show {
      margin-top: 10px;
      width: 100px;
      height: 100px;
    }
    .comment-op {
      margin-top: 10px;
      display: flex;
      color: var(--text3);
      align-items: center;
      font-size: 13px;
      justify-content: space-between;
      .op-left {
        display: flex;
        .comment-time {
          margin-right: 20px;
        }
        .iconfont {
          font-size: 13px;
          margin-right: 20px;
          cursor: pointer;
          &::before {
            font-size: 15px;
            margin-right: 5px;
          }
        }
        .active {
          &::before {
            color: var(--blue2);
          }
        }
        .reply-btn {
          cursor: pointer;
        }
      }
      .op-right {
        cursor: pointer;
        margin-right: 5px;
      }
    }
  }
}
.reply-list {
  .comment-item {
    border-bottom: none;
  }
  .comment-content-panel {
    .nick-name-panel {
      float: left;
      margin-right: 5px;
    }
    .comment-message {
      margin-top: 0px;
    }
  }
}
</style>

