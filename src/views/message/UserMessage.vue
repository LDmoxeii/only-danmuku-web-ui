<template>
  <div class="message-panel">
    <div class="left-panel">
      <div class="message-title">
        消息中心
      </div>
      <div
        v-for="item in messageNav"
        :class="[
          'message-part',
          route.params.messageType == item.messageTypeCode ? 'active' : '',
        ]"
        @click="selectMessageType(item)"
      >
        <div :class="['iconfont', item.icon]">
          {{ item.name }}
        </div>
        <div
          v-if="item.noReadCount > 0"
          class="message-count"
        >
          {{ item.noReadCount > 99 ? "99+" : item.noReadCount }}
        </div>
      </div>
    </div>
    <div class="right-panel">
      <div
        v-if="!route.params.messageType"
        class="home"
      >
        <div class="iconfont icon-message" />
      </div>
      <div
        v-else
        class="message-list"
      >
        <DataList
          :data-source="dataSource"
          @load-data="loadDataList"
        >
          <template #default="{ data }">
            <MessageSys
              v-if="data.messageType == 1"
              :data="data"
              @del-message="delMessage"
            />
            <MessageItem
              v-else
              :data="data"
              @del-message="delMessage"
            />
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
const { proxy } = getCurrentInstance() as any
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

const delMessage = (messageId: string | number) => {
  proxy.Confirm({
    message: '确定要删除消息吗？',
    okfun: async () => {
      try { await apiDelMessage(messageId) } catch (e) { return }
      await loadDataList()
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
  try { await apiReadAll(item.messageType) } catch (e) { return }
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
  margin: 0 auto;
  .left-panel {
    background-image: url(../../assets/creation_bg.png);
    background-repeat: no-repeat;
    background-size: 100% auto;
    background-color: #fff;
    width: 200px;
    border-radius: 5px;
    padding: 20px 10px;
    border: 1px solid #ddd;
    margin: 10px 0;
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
      padding: 0 10px;
      align-items: center;
      display: flex;
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
        padding: 0 4px;
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
    background: #fff;
    border-radius: 5px;
    border: 1px solid #ddd;
    margin: 10px 0 10px 10px;
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


