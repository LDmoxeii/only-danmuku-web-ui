<template>
  <div class="theme-body">
    <el-drawer
      v-model="showDrawer"
      lock-scroll
      title="选择背景"
      direction="btt"
      size="45%"
    >
      <el-scrollbar height="100%">
        <div class="theme-gird-list">
          <div
            v-for="item in themeCount"
            class="grid-item"
            @click="selectTheme(item)"
          >
            <img
              :src="proxy.Utils.getLocalImage('uhome-bg/' + item + '.png')"
             alt="">
            <div
              v-if="currentTheme == item"
              class="checked iconfont icon-checked"
            />
          </div>
        </div>
      </el-scrollbar>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, getCurrentInstance } from 'vue'
const { proxy } = getCurrentInstance() as any
import { saveTheme as apiSaveTheme } from '@/api/uhome'

const showDrawer = ref<boolean>(false);

const themeCount = 10;
const currentTheme = ref<number>(0);

const emit = defineEmits(['changeTheme']);
const selectTheme = async (item: number) => {
  currentTheme.value = item;
  try {
    await apiSaveTheme(item)
  } catch (e) { return }
  showDrawer.value = false;
  emit("changeTheme", item);
};

const show = (theme: number) => {
  showDrawer.value = true;
  currentTheme.value = theme;
};
defineExpose({
  show,
});
</script>

<style lang="scss" scoped>
.theme-body {
  :deep(.el-drawer__body) {
    padding: 0;
  }
  :deep(.el-drawer__header) {
    margin-bottom: 0;
  }
  .theme-gird-list {
    margin: 0 auto;
    width: 1400px;
    display: grid;
    grid-gap: 20px;
    grid-template-columns: repeat(5, 1fr);
    .grid-item {
      position: relative;
      cursor: pointer;
      .checked {
        position: absolute;
        top: 0;
        right: 0;
        color: var(--blue);
        font-size: 30px;
      }

      img {
        width: 100%;
        object-fit: fill;
        border: 2px solid #ddd;
        &:hover {
          border: 2px solid var(--blue);
        }
      }
    }
  }
}
</style>
