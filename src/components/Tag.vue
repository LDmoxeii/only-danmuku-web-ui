<template>
  <div
    class="tag"
    :style="{ border: `1px solid ${currentType.color}`, color: currentType.color }"
  >
    {{ currentType.text }}
  </div>
</template>

<script setup lang="ts">
import { computed, withDefaults } from 'vue'

type TagType = { text: string; color: string }

const TYPE: Record<number, TagType> = {
  0: { text: '标签', color: '#FF6699' },
}

const props = withDefaults(defineProps<{ type?: number }>(), { type: 0 })

const currentType = computed<TagType>(() => TYPE[props.type ?? 0]!)
</script>

<style lang="scss" scoped>
.tag {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 30px;
  height: 18px;
  border-radius: 3px;
  vertical-align: text-bottom;
  margin-bottom: 0.0666em;
  font-size: 12px;
  margin-right: 5px;
}
</style>
