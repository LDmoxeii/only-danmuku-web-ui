<template>
  <div class="message-panel">
    <div class="left-panel">
      <div class="message-title">消息中心</div>
      <div :class="[
            'message-part',
            route.params.messageType == item.messageTypeCode ? 'active' : '',
          ]" v-for="item in messageNav" @click="selectMessageType(item)">
        <div :class="['iconfont', item.icon]">{{ item.name }}</div>
        <div class="message-count" v-if="item.noReadCount > 0">
          {{ item.noReadCount > 99 ? "99+" : item.noReadCount }}
        </div>
      </div>
    </div>
    <div class="right-panel">
      <div class="home" v-if="!route.params.messageType">
        <div class="iconfont icon-message"></div>
      </div>
      <div class="message-list" v-else>
        <DataList :dataSource="dataSource" @loadData="loadDataList">
          <template #default="{ data }">
            <MessageSys :data="data" v-if="data.messageType == 1" @delMessage="delMessage"></MessageSys>
            <MessageItem :data="data" v-else @delMessage="delMessage">
            </MessageItem>
          </template>
        </DataList>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import MessageSys from './MessageSys.vue'
import MessageItem from './MessageItem.vue'
import { ref, getCurrentInstance, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
const { proxy } = getCurrentInstance()
const router = useRouter()
const route = useRoute()

import { useLoginStore } from '@/stores/loginStore'
const loginStore = useLoginStore()

const messageNav = ref<any[]>([
  {
    name: '系统通知',
    messageTypeCode: 'sys',
    messageType: 1,
    noReadCount: 0,
    icon: 'icon-sys-message',
  },
  {
    name: '收到的赞',
    messageTypeCode: 'like',
    messageType: 2,
    noReadCount: 0,
    icon: 'icon-good',
  },
  {
    name: '收到收藏',
    messageTypeCode: 'collection',
    messageType: 3,
    noReadCount: 0,
    icon: 'icon-collection',
  },
  {
    name: '评论和@',
    messageTypeCode: 'comment',
    messageType: 4,
    noReadCount: 0,
    icon: 'icon-comment',
  },
])

const curMessageNav = ref<any>({})
const selectMessageType = (item: any) => {
  readAll(item)

  //设置总的消息数
  loginStore.readMessageCount(item.noReadCount)

  curMessageNav.value = item
  router.push(`/message/${item.messageTypeCode}`)
  loadDataList()
}

const dataSource = ref<any>({
  list: [],
  pageNum: 1,
  pageSize: 15,
  pageTotal: 1,
  totalCount: 0,
});
import { loadMessage as apiLoadMessage, delMessage as apiDelMessage, getNoReadCountGroup as apiGetNoReadCountGroup, readAll as apiReadAll } from '@/api/message'
const loadDataList = async () => {
  let params: any = {
    pageNum: dataSource.value.pageNum,
    messageType: curMessageNav.value.messageType,
  }
  let result = await apiLoadMessage(params)
  if (!result) return
  dataSource.value = result
}

const delMessage = (messageId: string) => {
  proxy.Confirm({
    message: '确定要删除消息吗？',
    okfun: async () => {
      let result = await apiDelMessage(messageId)
      if (!result) {
        return
      }
      loadDataList()
    },
  })
}

const getNoReadCountGroup = async () => {
  let result = await apiGetNoReadCountGroup()
  if (!result) return
  messageNav.value.forEach((nav) => {
    const messageTypeData = result.find((item: any) => item.messageType == nav.messageType)
    if (messageTypeData) nav.noReadCount = messageTypeData.messageCount
  })
}

getNoReadCountGroup()

const readAll = async (item: any) => {
  if (item.noReadCount == 0) {
    return
  }
  let result = await apiReadAll(item.messageType)
  if (!result) {
    return
  }
  item.noReadCount = 0
}

onMounted(() => {
  if (!route.params.messageType) {
    return
  }
  curMessageNav.value = messageNav.value.find((item) => {
    return item.messageTypeCode == route.params.messageType
  })
  loadDataList()
})
</script>

<style lang="scss" scoped>
.message-panel {
  display: flex;
  height: calc(100vh - 180px);
  width: 1200px;
  margin: 0px auto;
  .left-panel {
    background-image: url(../../assets/creation_bg.png);
    background-repeat: no-repeat;
    background-size: 100% auto;
    background-color: #fff;
    width: 200px;
    border-radius: 5px;
    padding: 20px 10px;
    border: 1px solid #ddd;
    margin: 10px 0px;
    .message-title {
      font-size: 20px;
      line-height: 45px;
      padding-left: 10px;
      font-weight: 600;
      color: #262626;
    }
    .message-part {
      cursor: pointer;
      line-height: 50px;
      border-radius: 5px;
      padding: 0px 10px;
      align-items: center;
      display: flex;
      align-items: center;
      font-size: 14px;
      &:hover {
        background: #f8f8f8;
      }

      .iconfont {
        &::before {
          margin-right: 5px;
        }
      }

      .message-count {
        background: #f56c6c;
        color: #fff;
        padding: 0px 4px;
        height: 20px;
        min-width: 20px;
        line-height: 20px;
        display: inline-block;
        border-radius: 5px;
        text-align: center;
        margin-left: 5px;
        font-size: 12px;
      }
    }

    .active {
      color: var(--blue);
      background: #f8f8f8;
    }
  }
  .right-panel {
    flex: 1;
    margin-left: 10px;
    background: #fff;
    border-radius: 5px;
    border: 1px solid #ddd;
    margin: 10px 0px;
    margin-left: 10px;
    .home {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      .iconfont {
        font-size: 200px;
        color: #ececec;
      }
    }
    .message-list {
      height: 100%;
      padding: 10px;
      overflow: auto;
    }
  }
}
</style>
