<template>
  <div
    ref="videoItemRef"
    class="video-item"
  >
    <div class="video-cover">
      <Cover :source="data.videoCover" />
      <div class="duration">
        {{ proxy.Utils.convertSecondsToHMS(data.duration) }}
      </div>
    </div>
    <div class="video-info">
      <div class="video-name">
        <span v-if="data.status != 4">{{ data.videoName }}</span>
        <router-link
          v-else
          :to="`/video/${data.videoId}`"
          class="a-link"
          target="_blank"
        >
          {{ data.videoName }}
        </router-link>
        <span
          v-if="data.status == 1 || data.status == 3"
          class="status waiting"
        >{{ data.statusName }}</span>
        <span
          v-if="data.status == 2 || data.status == 5"
          class="status fail"
        >{{
          data.statusName
        }}</span>
      </div>
      <div class="video-time">
        {{ data.createTime }}
      </div>
      <div class="video-count">
        <span class="iconfont icon-play-solid">{{ data.playCount || 0 }}</span>
        <span class="iconfont icon-like-solid">{{ data.likeCount || 0 }}</span>
        <span class="iconfont icon-danmu-solid">{{
          data.danmuCount || 0
        }}</span>
        <span class="iconfont icon-comment-solid">{{
          data.commentCount || 0
        }}</span>
        <span class="iconfont icon-toubi">{{ data.coinCount || 0 }}</span>
        <span class="iconfont icon-collection-solid">{{
          data.collectCount || 0
        }}</span>
      </div>
    </div>
    <div class="op-panel">
      <div
        :class="['btn edit-btn', [1, 3].includes(data.status) ? 'disable' : '']"
        @click="jump('editVideo')"
      >
        <span class="iconfont icon-edit" />编辑
      </div>
      <el-popover
        class="cust-popover"
        placement="bottom-end"
        :width="300"
        trigger="hover"
        :show-arrow="false"
      >
        <template #reference>
          <div class="btn more-btn">
            <span class="iconfont icon-more" />
          </div>
        </template>
        <div class="more-edit-panel">
          <div class="more-btn-list">
            <div
              :class="[
                'more-edit-item',
                [1, 3].includes(data.status) ? 'disable' : '',
              ]"
              @click="jump('editVideo')"
            >
              <div class="iconfont icon-edit" />
              <div class="title">
                编辑稿件
              </div>
            </div>
            <div
              class="more-edit-item"
              @click="jump('danmu')"
            >
              <div class="iconfont icon-danmu" />
              <div class="title">
                弹幕管理
              </div>
            </div>
            <div
              class="more-edit-item"
              @click="jump('comment')"
            >
              <div class="iconfont icon-hudong" />
              <div class="title">
                评论管理
              </div>
            </div>
            <div class="interaction-op">
              <el-checkbox-group
                v-model="interactionInfo"
                @change="saveInteractionInfo"
              >
                <el-checkbox value="0">
                  关闭弹幕
                </el-checkbox>
                <el-checkbox value="1">
                  关闭评论
                </el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
          <div class="del-btn">
            <span
              class="iconfont icon-delete2"
              @click="deleteVideo"
            >删除稿件</span>
          </div>
        </div>
      </el-popover>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  getCurrentInstance,
  watch,
} from "vue";
import { useRouter } from "vue-router";
const { proxy } = getCurrentInstance() as any;
const router = useRouter();

// @E=0:UNKNOW:未知状态|1:TRANSCODING:转码中|2:TRANSCODE_FAILED:转码失败|3:PENDING_REVIEW:待审核|4:REVIEW_PASSED:审核成功|5:REVIEW_FAILED:审核失败;@T=VideoStatus

const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
});
const interactionInfo = ref<string[]>(
  props.data.interaction ? props.data.interaction.split(",") : []
);
// 监听后端返回的互动字段，保持复选框与数据同步
watch(
  () => props.data.interaction,
  (val: string) => {
    interactionInfo.value = val ? val.split(",") : []
  },
  { immediate: true }
)
import { saveVideoInteraction as apiSaveVideoInteraction, deleteVideo as apiDeleteVideo } from '@/api/ucenter'
const saveInteractionInfo = async (e: string[]) => {
  try { await apiSaveVideoInteraction(props.data.videoPostId, e.join(',')) } catch (err) { return }
};

const jumpUrl: Record<string, string> = {
  editVideo: "/ucenter/editVideo",
  danmu: "/ucenter/danmu",
  comment: "/ucenter/comment",
};

const jump = (type: keyof typeof jumpUrl) => {
  // 编辑等稿件相关页面使用视频稿件Id
  router.push(`${jumpUrl[type]}?videoPostId=${props.data.videoPostId}`);
};

const emit = defineEmits<{ (e: 'reload'): void }>();
const deleteVideo = () => {
  proxy.Confirm({
    message: `确定要删除【${props.data.videoName}】吗？`,
    okfun: async () => {
  try { await apiDeleteVideo(props.data.videoPostId) } catch (e) { return }
      proxy.Message.success("删除成功");
      emit("reload");
    },
  });
};
</script>

<style lang="scss" scoped>
.video-item {
  display: flex;
  border-bottom: 1px solid #ddd;
  padding: 30px 0px;
  align-items: center;
  .video-cover {
    min-width: 0;
    width: 155px;
    position: relative;
    .duration {
      position: absolute;
      right: 0px;
      bottom: 0px;
      padding: 3px;
      border-radius: 5px 0px 5px 0px;
      background: rgba(0, 0, 0, 0.7);
      opacity: 0.8;
      color: #fff;
      font-size: 13px;
    }
  }
  .video-info {
    flex: 1;
    margin: 0px 20px;
    .video-name {
      font-size: 16px;
      .status {
        font-size: 14px;
        margin-left: 5px;
      }
      .waiting {
        color: #e6a23c;
      }
      .fail {
        color: #f56c6c;
      }
      .sucess {
        color: #67c23a;
      }
    }
    .video-time {
      margin: 15px 0px;
      color: var(--text2);
    }
    .video-count {
      margin-top: 10px;
      color: var(--text3);
      display: flex;
      align-items: center;
      .iconfont {
        font-size: 14px;
        margin-right: 20px;
        &::before {
          font-size: 18px;
          margin-right: 5px;
        }
      }
    }
  }
  .op-panel {
    width: 120px;
    height: 33px;
    line-height: 33px;
    display: flex;
    justify-content: space-between;
    .btn {
      cursor: pointer;
      border: 1px solid #ddd;
      padding: 0px 8px;
      color: var(--text2);
      &:hover {
        border: 1px solid var(--blue);
      }
    }
    .icon-edit {
      margin-right: 5px;
    }
  }
}

.more-edit-panel {
  .more-btn-list {
    border-bottom: 1px solid #ddd;
    /*  display: grid;
    grid-gap: 20px;
    grid-template-columns: repeat(3, 1fr); */
    padding-bottom: 10px;
    display: flex;
    flex-wrap: wrap;
    .more-edit-item {
      text-align: center;
      cursor: pointer;
      width: 33%;
      .title {
        margin-top: 5px;
      }
      &:hover {
        color: var(--blue);
      }
    }
    .interaction-op {
      width: 200px;
      margin-top: 20px;
    }
  }
  .del-btn {
    text-align: center;
    margin: 10px 0px 5px 0px;
    cursor: pointer;
    &:hover {
      color: var(--blue);
    }
  }
}
</style>
