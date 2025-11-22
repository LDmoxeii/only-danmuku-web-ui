<template>
  <div
    class="cover"
    :style="{width:coverWidth+'px', height: coverWidth * props.scale + 'px' }"
  >
    <el-image
      v-if="coverFile"
      :src="coverFile"
      fit="scale-down"
      :width="cutWidth"
    >
      <template #error>
        <div class="iconfont icon-image-error" />
      </template>
    </el-image>
    <div
      class="mask"
      @click="selectImage"
    >
      {{ props.coverImage?"重新上传":"上传" }}
    </div>
  </div>
  <ImageCoverCut
    ref="imageCoverCutRef"
    :cut-width="props.cutWidth"
    :scale="props.scale"
  />
</template>
<script setup lang="ts">
import ImageCoverCut from './ImageCoverCut.vue'
import {ref} from 'vue'
import {asyncComputed} from '@vueuse/core'

const props = defineProps({
  coverImage: {
    type: [String, File],
    default: undefined,
  },
  coverWidth: {
    type: Number,
    default: 100,
  },
  cutWidth: {
    type: Number,
    default: 150,
  },
  //高宽比例
  scale: {
    type: Number,
    default: 1,
  },
})

const coverFile = asyncComputed(async () => {
  if (!props.coverImage) {
    return null
  }
  if (typeof props.coverImage == 'string') {
    const { sourcePath } = await import('@/api/file')
    return sourcePath + props.coverImage
  } else if (props.coverImage instanceof File) {
    return await convertFile2Base64(props.coverImage)
  }
})

const convertFile2Base64 = (file: File) => {
  return new Promise<string | ArrayBuffer | null>((resolve) => {
    let img = new FileReader()
    img.readAsDataURL(file)
    img.onload = ({ target }: any) => {
      resolve(target.result)
    }
  })
}

const imageCoverCutRef = ref<any>()
const selectImage = async () => {
  imageCoverCutRef.value.show()
}
</script>

<style lang="scss" scoped>
.cover {
  background: #f0f0f0;
  position: relative;
  .mask {
    width: 100%;
    position: absolute;
    left: 0;
    bottom: 0;
    height: 30px;
    background: rgba(0, 0, 0, 0.7);
    opacity: 0.8;
    z-index: 1;
    color: #fff;
    text-align: center;
    cursor: pointer;
  }
}
</style>
