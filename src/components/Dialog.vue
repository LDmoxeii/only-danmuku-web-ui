<template>
  <el-dialog
    :show-close="showClose"
    :draggable="draggable"
    :model-value="show"
    :close-on-click-modal="false"
    class="cust-dialog"
    :top="top + 'px'"
    :width="width"
    @close="close"
  >
    <template #header>
      <div
        v-if="title"
        class="title"
      >
        {{ title }}
      </div>
      <slot
        v-else
        name="header"
      />
    </template>
    <div
      class="dialog-body"
      :style="{ 'max-height': maxHeight + 'px', padding: padding + 'px' }"
    >
      <slot />
    </div>
    <template v-if="(buttons && buttons.length > 0) || showCancel">
      <div class="dialog-footer">
        <el-button
          v-if="showCancel"
          link
          @click="close"
        >
          取消
        </el-button>
        <el-button
          v-for="(btn, index) in buttons"
          :key="index"
          :type="btn.type || 'primary'"
          @click="btn.click"
        >
          {{ btn.text }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'

type DialogButton = {
  text: string
  click: () => void | Promise<void>
  type?: string
}

const props = defineProps({
  draggable: {
    type: Boolean,
    default: true,
  },
  title: {
    type: String,
    default: "",
  },
  show: {
    type: Boolean,
    default: false,
  },
  showClose: {
    type: Boolean,
    default: true,
  },
  showCancel: {
    type: Boolean,
    default: true,
  },
  top: {
    type: Number,
    default: 50,
  },
  width: {
    type: String,
    default: "30%",
  },
  buttons: {
    type: Array as PropType<DialogButton[]>,
    default: () => [],
  },
  padding: {
    type: Number,
    default: 15,
  },
});

const maxHeight = window.innerHeight - props.top - 120;

const emit = defineEmits<{ (e: 'close'): void }>();
const close = (): void => {
  emit('close');
};
</script>

<style lang="scss">
.cust-dialog {
  padding: 0 !important;
  margin-bottom: 5px !important;
  .el-dialog__header {
    padding: 16px;
  }
  .title {
    font-size: 20px;
  }
  .dialog-body {
    min-height: 80px;
    overflow: auto;
    overflow-x: hidden;
    padding: 20px;
  }
  .dialog-footer {
    border-top: 1px solid #ddd;
    text-align: right;
    padding: 5px 20px;
  }
}
</style>
