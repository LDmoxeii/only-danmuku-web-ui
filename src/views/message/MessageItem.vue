<template>
  <div class="message-item">
    <Avatar
      :avatar="data.sendUserAvatar"
      :user-id="data.sendUserId"
    />
    <div class="user-info-panel">
      <div class="user-info">
        <router-link
          :to="`/user/${data.sendUserId}`"
          class="user-name"
          target="_blank"
        >
          {{ data.sendUserName }}
        </router-link>
        <span class="title-info">{{ convertTitle() }}</span>
      </div>
      <template v-if="data.messageType === 4">
        <div class="comment">
          {{ normalizedExtendDto?.messageContent }}
        </div>
        <div
          v-if="normalizedExtendDto?.messageContentReply"
          class="reply"
        >
          {{ normalizedExtendDto?.messageContentReply }}
        </div>
      </template>
      <div class="send-time">
        {{ proxy.Utils.formatDate(data.createTime) }}
        <span
          class="iconfont icon-delete"
          @click="delMessage(data.messageId)"
        />
      </div>
    </div>
    <div class="video-cover">
      <router-link
        :to="`/video/${data.videoId}`"
        target="_blank"
      >
        <Cover :source="data.videoCover" />
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance } from "vue";
const { proxy } = getCurrentInstance() as any;

const props = defineProps<{
  data: {
    sendUserAvatar?: string;
    sendUserId?: string | number;
    sendUserName?: string;
    messageType: number;
    extendDto?: string | { messageContent?: string; messageContentReply?: string };
    createTime?: string | number;
    messageId: string | number;
    videoId?: string | number;
    videoCover?: string;
  };
}>();

const normalizedExtendDto = computed(() => {
  const raw = props.data.extendDto;
  if (!raw) return {} as Record<string, string>;
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw) as Record<string, string>;
    } catch {
      return {} as Record<string, string>;
    }
  }
  return raw;
});

const MESSAGE_TYPE = {
  1: "系统消息",
  2: "点赞",
  3: "收藏",
  4: "评论",
} as const;

const convertTitle = (): string => {
  if (props.data.messageType === 4) {
    const extendDto = normalizedExtendDto.value;
    if (extendDto?.messageContentReply) {
      return "在视频中回复了你的评论";
    }
    return "在视频下发表了评论";
  } else {
    const typeKey = props.data.messageType as keyof typeof MESSAGE_TYPE;
    const typeText = MESSAGE_TYPE[typeKey] ?? "";
    return `${typeText}了你的视频`;
  }
};

const emit = defineEmits<{ (e: 'delMessage', messageId: string | number): void }>();
const delMessage = (messageId: string | number) => {
  emit('delMessage', messageId);
};
</script>

<style lang="scss" scoped>
.message-item {
  display: flex;
  padding: 10px 5px;
  border-bottom: 1px solid #ddd;
  align-items: center;
  .user-info-panel {
    margin-left: 10px;
    flex: 1;
    .user-info {
      .user-name {
        font-weight: bold;
        color: var(--text);
        text-decoration: none;
      }
      .title-info {
        margin-left: 5px;
        color: var(--text3);
        font-size: 13px;
      }
    }
    .comment {
      font-size: 13px;
      margin-top: 5px;
      color: var(--text2);
    }
    .reply {
      border-left: 2px solid #ddd;
      padding-left: 5px;
      font-size: 12px;
      margin-top: 5px;
    }
    .send-time {
      margin-top: 5px;
      font-size: 12px;
      color: var(--text3);
    }
    .icon-delete {
      font-size: 14px;
      cursor: pointer;
      margin-left: 10px;
    }
  }
  .video-cover {
    margin-left: 10px;
    width: 100px;
  }
}
</style>
