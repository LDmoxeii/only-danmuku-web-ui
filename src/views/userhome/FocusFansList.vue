<template>
  <div class="body-container">
    <div class="body-title">
      {{ route.name == "uhomeFocus" ? "我的关注" : "我的粉丝" }}
    </div>
    <DataList
      :data-source="dataSource"
      @load-data="loadDataList"
    >
      <template #default="{ data }">
        <div class="data-item">
          <Avatar
            :avatar="data.otherAvatar"
            :user-id="data.otherUserId"
          />
          <div class="user-info">
            <div class="nick-name">
              <router-link
                :to="`/user/${data.otherUserId}`"
                target="_blank"
                class="a-link"
              >
                {{ data.otherNickName }}
              </router-link>
            </div>
            <div class="introduction">
              {{ data.otherPersonIntroduction || "这个人没有填简介啊~~~" }}
            </div>
          </div>
          <div class="op-btns">
            <div
              v-if="data.focusType == 1"
              class="focus-eachother"
            >
              已互粉
            </div>
            <el-button
              v-if="route.name == 'uhomeFocus' || data.focusType == 1"
              link
              type="primary"
              @click="cancelFocus(data.otherUserId)"
            >
              取消关注
            </el-button>

            <el-button
              v-if="route.name == 'uhomeFans' && data.focusType == 0"
              type="primary"
              @click="focus(data.otherUserId)"
            >
              关注
            </el-button>
          </div>
        </div>
      </template>
    </DataList>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, inject } from 'vue'
import { useRoute } from "vue-router";
import { loadFocusList as apiLoadFocusList, loadFansList as apiLoadFansList } from '@/api/u_home'
const route = useRoute();

const dataSource = ref<any>({
  list: [],
  pageNum: 1,
  pageSize: 15,
  pageTotal: 1,
  totalCount: 0,
});
const loadDataList = async () => {
  const params = {
    pageNum: dataSource.value.pageNum,
    pageSize: dataSource.value.pageSize,
  }
  try {
    const res = route.name == 'uhomeFocus' ? await apiLoadFocusList(params) : await apiLoadFansList(params)
    dataSource.value = res as any
  } catch (_) {}
};

const cancelFocusUser = inject<any>('cancelFocusUser');
const cancelFocus = (otherUserId: string) => {
  cancelFocusUser && cancelFocusUser(otherUserId, () => {
    loadDataList();
  });
};

const focusUser = inject<any>('focusUser');
const focus = (otherUserId: string) => {
  focusUser && focusUser(otherUserId, () => {
    loadDataList();
  });
};

watch(
  () => route.name,
  (newVal, _) => {
    if (newVal == "uhomeFocus" || newVal == "uhomeFans") {
      loadDataList();
    }
  },
  { immediate: true, deep: true }
);
</script>

<style lang="scss" scoped>
.body-container {
  background: #ffff;
  padding: 20px;
  border-radius: 5px;
  .body-title {
    font-size: 18px;
    color: #6d757a;
    border-bottom: 1px solid #e5e9ef;
    padding: 0 0 10px 0;
  }
  .data-item {
    display: flex;
    align-items: center;
    padding: 10px;
    .user-info {
      flex: 1;
      margin: 0 10px;
      .introduction {
        margin-top: 10px;
        font-size: 13px;
        color: #6d757a;
        overflow: hidden;
        white-space: nowrap;
        width: 100%;
        text-overflow: ellipsis;
        padding-right: 10px;
      }
    }
    .op-btns {
      display: flex;
      align-items: center;
      .focus-eachother {
        margin-right: 10px;
        color: var(--text3);
      }
    }
  }
}
</style>

