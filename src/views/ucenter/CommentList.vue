<template>
  <div class="comment-panel">
    <VideoSearchSelect @load-data="loadData4VideoSelect" />
    <Table
      ref="tableInfoRef"
      :columns="columns"
      :fetch="loadDataList"
      :data-source="tableData"
      :options="tableOptions"
      :ext-height="tableOptions.extHeight"
    >
      <template #slotComment="{ row }">
        <div class="comment-info">
          <Avatar
            :avatar="row.avatar"
            :user-id="row.userId"
          />
          <div class="comment">
            <div>
              <router-link
                target="_blank"
                class="a-link nick-name"
                :to="`/user/${row.userId}`"
              >
                {{ row.nickName }}
              </router-link>
              <template v-if="row.replyUserId">
                回复@
                <router-link
                  target="_blank"
                  class="a-link nick-name"
                  :to="`/user/${row.replyUserId}`"
                >
                  {{ row.replyNickName }}
                </router-link>的评论
              </template>
            </div>

            <div class="content">
              {{ row.content }}
            </div>
            <div
              v-if="row.imgPath"
              class="image-show"
            >
              <Cover
                :source="row.imgPath + proxy.imageThumbnailSuffix"
                :preview="true"
                fit="cover"
              />
            </div>
            <div class="time-info">
              <div class="time">
                {{ row.postTime }}
              </div>
              <div
                class="iconfont icon-delete"
                @click="delComment(row.commentId)"
              />
            </div>
          </div>
        </div>
      </template>

      <template #slotVideo="{ row }">
        <router-link
          :to="`/video/${row.videoId}`"
          target="_blank"
          class="a-link"
        >
          <Cover :source="row.videoCover" />
          <div class="video-name">
            {{ row.videoName }}
          </div>
        </router-link>
      </template>
    </Table>
  </div>
</template>

<script setup lang="ts">
import VideoSearchSelect from "./VideoSerchSelect.vue";
import Table from "@/components/Table.vue";
import { ref, getCurrentInstance } from 'vue'
import { useRoute } from "vue-router";
const { proxy } = getCurrentInstance() as any
const route = useRoute();

const currentVideoId = ref<any>(route.query.videoId)
const loadData4VideoSelect = (videoId: any) => {
  currentVideoId.value = videoId;
  loadDataList();
};

const columns = [
  {
    label: "评论信息",
    scopedSlots: "slotComment",
  },
  {
    label: "视频信息",
    scopedSlots: "slotVideo",
    width: 150,
  },
];

const tableInfoRef = ref<any>();
const tableOptions = ref<any>({
  extHeight: 10,
});

const tableData = ref<any>({
  pageNum: 1,
  pageSize: 15,
});
import { loadComment as apiUcenterLoadComment, delComment as apiUcenterDelComment } from '@/api/ucenter'
const loadDataList = async () => {
  let params: any = {
    pageNum: tableData.value.pageNum,
    pageSize: tableData.value.pageSize,
    videoId: currentVideoId.value,
  };
  let result = await apiUcenterLoadComment(params)
  if (!result) return
  Object.assign(tableData.value, result)
};

const delComment = (commentId: string) => {
  proxy.Confirm({
    message: "确定要删除吗？",
    okfun: async () => {
      try { await apiUcenterDelComment(commentId) } catch (e) { return }
      proxy.Message.success("ɾ���ɹ�");
      loadDataList();
    },
  });
};
</script>

<style lang="scss" scoped>
.comment-panel {
  .comment-info {
    display: flex;
    .comment {
      margin-left: 10px;
    }
    .time-info {
      display: flex;
      font-size: 12px;
      .iconfont {
        margin-left: 5px;
        font-size: 13px;
        cursor: pointer;
      }
    }
  }
  .video-name {
    text-decoration: none;
    color: var(--text3);
    font-size: 13px;
    margin-top: 5px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
.image-show {
  width: 100px;
  height: 100px;
  overflow: hidden;
  margin: 5px 0px;
}
</style>

