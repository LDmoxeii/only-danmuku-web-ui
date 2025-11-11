<template>
  <div class="body-container">
    <div class="body-title">我的粉丝</div>
    <DataList :dataSource="dataSource" @loadData="loadDataList">
      <template #default="{ data }">
        <div class="data-item">
          <Avatar :avatar="data.otherAvatar" :userId="data.otherUserId"></Avatar>
          <div class="user-info">
            <div class="nick-name">
              <router-link :to="`/user/${data.otherUserId}`" target="_blank" class="a-link">
                {{ data.otherNickName }}
              </router-link>
            </div>
            <div class="introduction">
              {{ data.otherPersonIntroduction || "这个人没有填简介啊~~~" }}
            </div>
          </div>
          <div class="op-btns">
            <div v-if="data.focusType == 1" class="focus-eachother">已互粉</div>
            <el-button link type="primary" v-if="data.focusType == 1" @click="cancelFocus(data.otherUserId)">取消关注</el-button>
            <el-button type="primary" v-if="data.focusType == 0" @click="focus(data.otherUserId)">关注</el-button>
          </div>
        </div>
      </template>
    </DataList>
  </div>
</template>

<script setup lang="ts">
import { ref, getCurrentInstance } from 'vue'
import { useRouter, useRoute } from 'vue-router'
const { proxy } = getCurrentInstance() as any
const router = useRouter()
const route = useRoute()

const dataSource = ref<any>({
  list: [],
  pageNum: 1,
  pageSize: 15,
  pageTotal: 1,
  totalCount: 0,
})
const loadDataList = async () => {
  const params: any = {
    pageNum: dataSource.value.pageNum,
    pageSize: dataSource.value.pageSize,
  }
  const result = await proxy.Request({
    url: proxy.Api.uHomeFansList,
    params,
  })
  if (!result) return
  dataSource.value = result.data
}

const focus = async (otherUserId: string) => {
  const result = await proxy.Request({
    url: proxy.Api.uHomeFocus,
    showLoading: true,
    params: { focusUserId: otherUserId },
  })
  if (!result) return
  loadDataList()
}

const cancelFocus = async (otherUserId: string) => {
  const result = await proxy.Request({
    url: proxy.Api.uHomeCancelFocus,
    showLoading: true,
    params: { focusUserId: otherUserId },
  })
  if (!result) return
  loadDataList()
}
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
    padding: 0px 0px 10px 0px;
  }
  .data-item {
    display: flex;
    align-items: center;
    padding: 10px;
    .user-info {
      flex: 1;
      margin: 0px 10px;
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
