<template>
  <div
    class="header-fixed"
    :style="{
      'max-width': proxy.bodyMaxWidth + 'px',
      'min-width': proxy.bodyMinWidth + 'px',
    }"
  >
    <LayoutHeader theme="dark" />
  </div>
  <div
    class="user-home-body-container"
    :style="{
      'max-width': proxy.bodyMaxWidth + 'px',
      'min-width': proxy.bodyMinWidth + 'px',
      'background-image': `url(${proxy.Utils.getLocalImage(
        'uhome-bg/' + (userInfo.theme || 0) + '.png'
      )})`,
    }"
  >
    <div class="user-home-body">
      <!-- <div class="header">
        <img :src="proxy.Utils.getLocalImage('user-home-bg.png')" />
      </div> -->
      <div class="user-info-panel">
        <div class="avatar">
          <Avatar
            :width="90"
            :avatar="userInfo.avatar"
            :user-id="userInfo.userId"
          />
        </div>
        <div class="user-info">
          <div class="user-name">
            <div>{{ userInfo.nickName }}</div>
            <div
              v-if="userInfo.sex == 1 || userInfo.sex == 2"
              :class="[
                'iconfont',
                userInfo.sex == 1 ? 'icon-sexw' : 'icon-sexm',
              ]"
            />
            <div
              v-if="myself"
              class="iconfont icon-edit"
              @click="updateUserInfo"
            />
          </div>
          <div class="introduction">
            {{ userInfo.personIntroduction }}
          </div>
        </div>
        <div
          v-if="!myself"
          class="focus-panel"
        >
          <div
            v-if="userInfo.haveFocus"
            class="btn-focus btn-cancel-focus"
            @click="cancelFocusUser(currentUserId)"
          >
            取消关注
          </div>
          <div
            v-else
            class="btn-focus"
            @click="focusUser(currentUserId)"
          >
            关注
          </div>
        </div>
      </div>
      <div class="home-nav">
        <div class="nav-panel">
          <router-link
            v-for="item in navList"
            :key="item.path"
            :class="[
              'nav-item iconfont',
              item.icon,
              item.pathNames.includes(route.name) ? 'active' : '',
            ]"
            :to="item.path"
          >
            {{ item.name }}
          </router-link>
        </div>
        <div class="search">
          <el-input
            v-model="videoName"
            placeholder="搜视频"
            style="width: 200px"
            @keyup.enter="searchVideo"
          >
            <template #suffix>
              <span class="iconfont icon-search" />
            </template>
          </el-input>
        </div>
        <div class="count-info">
          <router-link
            v-if="myself"
            class="count-item"
            :to="`/user/${currentUserId}/focus`"
          >
            <div class="title-info">
              关注数
            </div>
            <div class="count-value">
              {{ userInfo.focusCount }}
            </div>
          </router-link>
          <div
            v-else
            class="count-item"
          >
            <div class="title-info">
              关注数
            </div>
            <div class="count-value">
              {{ userInfo.focusCount }}
            </div>
          </div>

          <router-link
            v-if="myself"
            class="count-item"
            :to="`/user/${currentUserId}/fans`"
          >
            <div class="title-info">
              粉丝数
            </div>
            <div class="count-value">
              {{ userInfo.fansCount }}
            </div>
          </router-link>
          <div
            v-else
            class="count-item"
          >
            <div class="title-info">
              粉丝数
            </div>
            <div class="count-value">
              {{ userInfo.fansCount }}
            </div>
          </div>
          <div class="count-item">
            <div class="title-info">
              获赞数
            </div>
            <div class="count-value">
              {{ userInfo.likeCount }}
            </div>
          </div>
          <div class="count-item">
            <div class="title-info">
              播放数
            </div>
            <div class="count-value">
              {{ userInfo.playCount }}
            </div>
          </div>
        </div>
      </div>
      <div class="user-home-content">
        <router-view />
      </div>
    </div>
    <div
      v-if="
        loginStore.userInfo && userInfo.userId == loginStore.userInfo.userId
      "
      class="change-them-btn"
      @click="selectTheme"
    />
  </div>
  <Account />
  <UserInfoEdit
    ref="userInfoEditRef"
    @reload="loadUserInfo"
  />
  <UserHomeTheme
    ref="userHomeThemeRef"
    @change-theme="changeTheme"
  />
</template>

<script setup lang="ts">
import UserHomeTheme from "./UserHomeTheme.vue";
import UserInfoEdit from "./UserInfoEdit.vue";
import Account from "@/views/account/Account.vue";
import LayoutHeader from "@/views/layout/LayoutHeader.vue";
import { computed, getCurrentInstance, provide, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
const { proxy } = getCurrentInstance() as any;
const route = useRoute();
const router = useRouter();
import { useLoginStore } from "@/stores/loginStore";
const loginStore = useLoginStore();
const currentUserId = route.params.userId as string;

const navList = ref<{ name: string; path: string; icon: string; pathNames: string[] }[]>([
  {
    name: "主页",
    path: "/user/" + currentUserId,
    icon: "icon-home",
    pathNames: ["uhome", "uhomeFans", "uhomeFocus"],
  },
  {
    name: "投稿",
    path: "/user/" + currentUserId + "/video",
    icon: "icon-play",
    pathNames: ["uhomeMyVideo"],
  },
  {
    name: "视频列表",
    path: "/user/" + currentUserId + "/series",
    icon: "icon-playlist",
    pathNames: ["uhomeSeries", "uhomeSeriesDetail"],
  },
  {
    name: "收藏",
    path: "/user/" + currentUserId + "/collection",
    icon: "icon-collection",
    pathNames: ["collection"],
  },
]);
//是否是自己
const myself = computed(() => {
  return loginStore.userInfo.userId == currentUserId;
});

const userInfo = ref<any>({});
provide("userInfo", userInfo);
import { getUserInfo as apiGetUserInfo } from '@/api/u_home'
const loadUserInfo = async () => {
  const data = await apiGetUserInfo({ userId: currentUserId })
  if (!data) return
  const noticeInfo = data.noticeInfo
    ? data.noticeInfo.replace(/\r\n/g, '<br>').replace(/\n/g, '<br>')
    : data.noticeInfo
  userInfo.value = { ...data, noticeInfo }

  if (
    Object.keys(loginStore.userInfo).length > 0 &&
    loginStore.userInfo.userId == currentUserId &&
    loginStore.userInfo.avatar !== data.avatar
  ) {
    loginStore.userInfo.avatar = data.avatar
  }
};
loadUserInfo();

const userInfoEditRef = ref<any>();
const updateUserInfo = () => {
  userInfoEditRef.value.show(userInfo.value);
};

const focusUser = async (
  focusUserId: number | string,
  changeCountType: number = 0,
  fn?: () => void
) => {
  if (Object.keys(loginStore.userInfo).length == 0) {
    loginStore.setLogin(true);
    return;
  }
  const focusId = focusUserId
  try { await (await import('@/api/u_home')).focus({ focusUserId: focusId }) } catch (e) { return }
  if (changeCountType == 0) {
    userInfo.value.haveFocus = true;
    userInfo.value.fansCount++;
  } else {
    userInfo.value.focusCount++;
  }
  if (fn) {
    fn();
  }
};
const cancelFocusUser = async (
  focusUserId: number | string,
  changeCountType: number = 0,
  fn?: () => void
) => {
  const focusId = focusUserId
  try { await (await import('@/api/u_home')).cancelFocus({ focusUserId: focusId }) } catch (e) { return }
  if (changeCountType == 0) {
    userInfo.value.haveFocus = false;
    userInfo.value.fansCount--;
  } else {
    userInfo.value.focusCount--;
  }
  if (fn) {
    fn();
  }
};

provide("cancelFocusUser", (focusUserId: number | string, fn?: () => void) => {
  cancelFocusUser(focusUserId, 1, fn);
});

provide("focusUser", (focusUserId: number | string, fn?: () => void) => {
  focusUser(focusUserId, 1, fn);
});

const videoName = ref<string>("");
const searchVideo = () => {
  router.push({
    path: `/user/${route.params.userId}/video`,
    query: {
      videoName: videoName.value,
    },
  });
};

const userHomeThemeRef = ref<any>();
const selectTheme = () => {
  userHomeThemeRef.value.show(userInfo.value.theme);
};

const changeTheme = (theme: any) => {
  userInfo.value.theme = theme;
};
</script>
<style lang="scss" scoped>
.header-fixed {
  background: #fff;
  height: 64px;
  margin: 0px auto;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
}

.user-home-body-container {
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  margin: 0px auto;
  .user-home-body {
    margin: 0px auto;
    position: relative;
    min-height: calc(100vh - 64px);
    width: 1300px;
    .header {
      height: 250px;
      overflow: hidden;
    }

    .user-info-panel {
      background: #fff;
      position: relative;
      padding: 5px 30px 5px 0px;
      border-radius: 0px 0px 5px 5px;
      display: flex;
      align-items: center;

      .avatar {
        position: absolute;
        left: 20px;
        top: -35px;
      }

      .user-info {
        flex: 1;
        color: var(--text);
        margin-left: 120px;

        .user-name {
          font-size: 20px;
          font-weight: bold;
          display: flex;
          align-items: center;

          .iconfont {
            font-weight: normal;
            margin-left: 10px;
            color: var(--text3);
            cursor: pointer;
          }

          .icon-sexw {
            font-size: 20px;
            color: #f25d8e;
          }

          .icon-sexm {
            font-size: 20px;
            color: #5fd4f2;
          }
        }

        .introduction {
          color: var(--text3);
          margin-top: 5px;
          min-height: 20px;
        }
      }

      .focus-panel {
        .btn-focus {
          background: #f25d8e;
          color: #fff;
          padding: 8px 25px;
          border-radius: 5px;
          cursor: pointer;

          &:hover {
            opacity: 0.7;
          }
        }

        .btn-cancel-focus {
          background: #fff;
          color: var(--text);
          border: 1px solid #ddd;
        }
      }
    }

    .home-nav {
      top: 0px;
      position: sticky;
      margin-top: 10px;
      background: #fff;
      border-radius: 5px;
      display: flex;
      align-items: center;
      padding: 0px 20px;
      z-index: 1000;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);

      .nav-panel {
        display: flex;
        align-items: center;

        .nav-item {
          text-decoration: none;
          margin-right: 35px;
          position: relative;
          display: flex;
          align-items: center;
          color: var(--text2);
          line-height: 65px;
          font-size: 14px;

          &::before {
            margin-right: 5px;
            font-size: 20px;
          }

          &:hover {
            color: var(--blue);

            &::after {
              content: "";
              border: 2px solid var(--blue);
              position: absolute;
              bottom: 0px;
              left: 0px;
              width: 100%;
            }
          }
        }

        .active {
          color: var(--blue);

          &::after {
            content: "";
            border: 2px solid var(--blue);
            position: absolute;
            bottom: 0px;
            left: 0px;
            width: 100%;
          }
        }
      }

      .search {
        margin-left: 20px;
        flex: 1;
      }

      .count-info {
        display: flex;
        text-align: center;
        font-size: 13px;

        .count-item {
          padding: 0px 10px;
          text-decoration: none;

          .title-info {
            color: var(--text3);
          }

          .count-value {
            margin-top: 5px;
          }
        }

        a.count-item {
          .title-info {
            color: var(--blue2);
          }

          color: var(--blue2);
        }
      }
    }

    .user-home-content {
      margin-top: 10px;
    }
  }
}

.change-them-btn {
  position: absolute;
  top: 64px;
  right: 0px;
  width: 58px;
  height: 49px;
  background-image: url("../../assets/theme-trigger.png");
  background-position: 0px 0px;
  background-repeat: no-repeat;
  cursor: pointer;
  &:hover {
    background-position: -522px 0px;
  }
}
</style>

