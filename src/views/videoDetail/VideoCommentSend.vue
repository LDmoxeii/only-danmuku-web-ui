<template>
  <!-- eslint-disable vue/valid-v-for, vue/require-v-for-key -->
  <div class="send-panel">
    <Avatar
      :avatar="
        Object.keys(loginStore.userInfo).length == 0
          ? ''
          : loginStore.userInfo.avatar
      "
    />
    <div class="input-panel">
      <template v-if="showSend">
        <el-form
          ref="formDataRef"
          :model="formData"
          :rules="rules"
          @submit.prevent
        >
          <!--input输入-->
          <el-form-item
            label=""
            class="input-area"
          >
            <el-input
              id="inputPanel"
              ref="inputRef"
              v-model="formData.content"
              clearable
              :placeholder="formData.nickName ? '@' + formData.nickName : ''"
              :rows="1"
              type="textarea"
              resize="none"
              :show-word-limit="true"
              :maxlength="500"
              :autosize="{ minRows: 1, maxRows: 5 }"
            />
            <div
              v-if="formData.imgPath"
              class="comment-image"
            >
              <Cover
                fit="cover"
                :source="formData.imgPath"
              />
              <span
                class="del iconfont icon-close"
                @click="delImage"
              />
            </div>
          </el-form-item>
        </el-form>
        <div class="op-panel">
          <div class="op-btns">
            <el-popover
              ref="elPopoverRef"
              :width="500"
              trigger="click"
              :show-arrow="false"
              :offset="5"
              placement="bottom-start"
            >
              <template #reference>
                <div class="iconfont icon-emoji" />
              </template>
              <template #default>
                <el-tabs
                  v-model="activeEmoji"
                  @click.stop
                >
                  <el-tab-pane
                    v-for="emoji in emojiList"
                    :key="emoji.name"
                    :label="emoji.name"
                    :name="emoji.name"
                  >
                    <div class="emoji-list">
                      <div
                        v-for="item in emoji.emojiList"
                        :key="item"
                        class="emoji-item"
                        @click="sendEmoji(item)"
                      >
                        {{ item }}
                      </div>
                    </div>
                  </el-tab-pane>
                </el-tabs>
              </template>
            </el-popover>
            <el-upload
              ref="uploaderRef"
              :multiple="false"
              :show-file-list="false"
              :http-request="selectFile"
              :accept="proxy.imageAccept"
            >
              <div class="iconfont icon-image" />
            </el-upload>
          </div>
          <div class="send-btn">
            <el-button
              type="primary"
              @mousedown="submitComment"
            >
              发布
            </el-button>
          </div>
        </div>
      </template>
      <div
        v-else
        class="no-send"
      >
        UP主已关闭评论区
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import emojiList from "@/utils/Emoji";
import { mitter } from "@/eventbus/eventBus";
import { uploadImage } from "@/api/file";
import { postComment as apiPostComment } from '@/api/comment'
import { getCurrentInstance, inject, onBeforeUnmount, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useLoginStore } from "@/stores/loginStore";

const { proxy } = getCurrentInstance() as any;
const route = useRoute();

const loginStore = useLoginStore();

const props = defineProps({
  sendType: {
    type: Number,
    default: 0,
  },
  showSend: {
    type: Boolean,
    default: true,
  },
});

const formData = ref<any>({});
const formDataRef = ref<any>();

const rules: any = {
  content: [{required: true, message: "请输入评论内容"}],
};

//插入图片
const selectFile = (file: any) => {
  formData.value.imgPath = file.file;
};

const delImage = () => {
  formData.value.imgPath = null;
};

const showReply = inject<any>("showReply");
const submitComment = async (event: MouseEvent) => {
  event.preventDefault();

  if (Object.keys(loginStore.userInfo).length == 0) {
    loginStore.setLogin(true);
    return;
  }

  const params: any =
      props.sendType === 0
          ? {
            content: formData.value.content,
            imgPath: formData.value.imgPath,
          }
          : Object.assign({}, formData.value);

  if (!params.content) {
    proxy.Message.warning("请输入评论");
    return;
  }
  params.videoId = route.params.videoId as any;
  //上传图片
  if (params.imgPath) {
    const imgPath = await uploadImage(params.imgPath, true);
    params.imgPath = imgPath;
  }
  try { await apiPostComment(params as any) } catch (e) { return }
  
  formDataRef.value.resetFields();
  formData.value = {};
  proxy.Message.success("发布成功");
  showReply();
  mitter.emit("postCommentSuccess");
};

//插入表情
const elPopoverRef = ref<any>();
const activeEmoji = ref<string>("笑脸");
const sendEmoji = (emoji: string) => {
  formData.value.content = formData.value.content
      ? formData.value.content + emoji
      : emoji;
  elPopoverRef.value.hide();
};

onMounted(() => {
  mitter.on("initCommentData", (data) => {
    if (props.sendType != 0) {
      formData.value = Object.assign({}, data);
    }
  });
});

onBeforeUnmount(() => {
  mitter.off("initCommentData");
});
</script>

<style lang="scss" scoped>
.send-panel {
  margin-top: 20px;
  display: flex;

  .input-panel {
    flex: 1;
    margin-left: 15px;

    :deep(.el-form-item) {
      margin-bottom: 0px;
    }

    .no-send {
      background: #ebebeb;
      text-align: center;
      padding: 15px;
      border-radius: 5px;
      color: var(--text3);
    }

    .input-area {
      border: 1px solid #ddd;
      border-radius: 5px;
      padding: 8px;

      :deep(.el-textarea__inner) {
        box-shadow: none;
        padding: 0px;
      }

      .comment-image {
        margin-top: 5px;
        width: 72px;
        height: 72px;
        display: flex;
        align-items: center;
        position: relative;

        .del {
          position: absolute;
          top: 0px;
          right: 0px;
          background: #0003;
          width: 20px;
          height: 20px;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 0px 5px 0px 5px;
          cursor: pointer;
        }
      }
    }

    .op-panel {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 5px;

      .op-btns {
        display: flex;
        align-items: center;

        .iconfont {
          cursor: pointer;
          border: 1px solid #ddd;
          padding: 3px 8px;
          margin-right: 5px;
          border-radius: 5px;
        }
      }
    }
  }
}

.emoji-list {
  .emoji-item {
    float: left;
    font-size: 23px;
    padding: 2px;
    text-align: center;
    border-radius: 3px;
    margin-left: 10px;
    margin-top: 5px;
    cursor: pointer;

    &:hover {
      background: #ddd;
    }
  }
}
</style>


