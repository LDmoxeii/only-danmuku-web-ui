<template>
  <div class="no-data">
    <div class="iconfont icon-empty"></div>
    <div class="msg">{{ msg }}</div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ msg?: string }>(), {
  msg: '暂无数据',
})
</script>

<style lang="scss">
.no-data {
  text-align: center;
  padding: 10px 0px;
  .icon-empty {
    color: #bbbbbb;
    font-size: 45px;
  }
  .msg {
    margin-top: 10px;
    color: #909399;
    font-size: 14px;
  }
}
</style>
