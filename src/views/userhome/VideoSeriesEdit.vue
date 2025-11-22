<template>
  <Dialog
    :show="dialogConfig.show"
    :title="dialogConfig.title"
    :buttons="dialogConfig.buttons"
    width="500px"
    :show-cancel="false"
    @close="dialogConfig.show = false"
  >
    <el-form
      ref="formDataRef"
      :model="formData"
      :rules="rules"
      label-width="80px"
      @submit.prevent
    >
      <!--input输入-->
      <template v-if="step == 1">
        <el-form-item
          label="列表名称"
          prop="seriesName"
        >
          <el-input
            v-model="formData.seriesName"
            clearable
            placeholder="请填写名称"
            :maxlength="100"
            show-word-limit
          />
        </el-form-item>
        <!--textarea输入-->
        <el-form-item
          label="列表简介"
          prop=""
        >
          <el-input
            v-model="formData.seriesDescription"
            clearable
            placeholder="请填写简介（选填）"
            type="textarea"
            :rows="5"
            :maxlength="200"
            show-word-limit
            resize="none"
          />
        </el-form-item>
      </template>
      <template v-if="step == 2">
        <el-scrollbar max-height="400px">
          <el-checkbox-group v-model="formData.videoIds">
            <div
              v-for="item in videoList"
              :key="item.videoId"
              class="video-item"
            >
              <div class="check">
                <el-checkbox :value="item.videoId" />
              </div>
              <div class="cover">
                <Cover :source="item.videoCover" />
              </div>
              <div class="video-info">
                <div class="video-name">
                  {{ item.videoName }}
                </div>
                <div class="play-info">
                  <div class="iconfont icon-play2">
                    {{ item.playCount }}
                  </div>
                  <div class="create-time">
                    {{ proxy.Utils.formatDate(item.createTime) }}
                  </div>
                </div>
              </div>
            </div>
          </el-checkbox-group>
        </el-scrollbar>
      </template>
      <div class="op-btns">
        <el-button
          v-if="step == 1 || opType == 2"
          link
          @click="cancel"
        >
          取消
        </el-button>
        <el-button
          v-if="step == 1 && opType != 1"
          type="primary"
          @click="nextStep"
        >
          下一步
        </el-button>
        <el-button
          v-if="step == 2 && opType != 2"
          type="primary"
          @click="preStep"
        >
          上一步
        </el-button>
        <el-button
          v-if="step == 2 || opType == 1"
          type="primary"
          @click="submit"
        >
          确定
        </el-button>
      </div>
    </el-form>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, getCurrentInstance, nextTick } from 'vue'
const { proxy } = getCurrentInstance() as any
import { useRoute } from 'vue-router'
import Dialog from "@/components/Dialog.vue";
const route = useRoute()

const dialogConfig = ref<any>({
  show: false,
  title: '视频列表',
})

const opType = ref<number>(0)
const step = ref<number>(1)
const formData = ref<any>({
  videoIds: [],
})
const formDataRef = ref<any>()
const rules = {
  seriesName: [{ required: true, message: '请输入名称' }],
}

const show = (data: any = {}, _opType: number = 0) => {
  loadVideoList()

  opType.value = _opType
  if (_opType === 0 || _opType == 1) {
    //新增系列,修改系列
    step.value = 1
  } else if (_opType == 2) {
    //增加视频
    step.value = 2
  }
  dialogConfig.value.show = true
  nextTick(() => {
    formDataRef.value.resetFields()
    formData.value = Object.assign({}, data)
    formData.value.videoIds = []
  })
}
defineExpose({
  show,
})

const emit = defineEmits(['reload'])

const cancel = () => {
  dialogConfig.value.show = false
}

const nextStep = () => {
  formDataRef.value.validate(async (valid: boolean) => {
    if (!valid) {
      return
    }
    step.value = 2
  })
}
const preStep = () => {
  formDataRef.value.validate(async (valid: boolean) => {
    if (!valid) {
      return
    }
    step.value = 1
  })
}

const submit = () => {
  formDataRef.value.validate(async (valid: boolean) => {
    if (!valid) {
      return
    }
    const params = Object.assign({}, formData.value)
    if (params.videoIds.length == 0 && step.value == 2) {
      proxy.Message.warning('请选择视频')
      return
    }
    params.videoIds = params.videoIds.join(',')
    try {
      if (opType.value == 2) {
        await (await import('@/api/uhome/series')).saveSeriesVideo(params)
      } else {
        await (await import('@/api/uhome/series')).saveVideoSeries(params)
      }
    } catch (e) { return }
    proxy.Message.success('保存成功')
    dialogConfig.value.show = false
    emit('reload')
  })
}

// 候选视频列表（第二步勾选）
const videoList = ref<any[]>([])
const loadVideoList = async () => {
  try {
    const res = await (await import('@/api/uhome/series')).loadAllVideo({ seriesId: route.params.seriesId as any })
    videoList.value = res as any
  } catch (e) { return }
}
</script>

<style lang="scss" scoped>
.op-btns {
  text-align: right;
}
.video-item {
  display: flex;
  margin-bottom: 10px;
  padding-right: 15px;
  align-items: center;
  .check {
    width: 30px;
  }
  .cover {
    width: 100px;
  }
  .video-info {
    flex: 1;
    margin-left: 5px;
    min-width: 0;
    .video-name {
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .play-info {
      margin-top: 5px;
      font-size: 13px;
      color: var(--text3);
      display: flex;
      justify-content: space-between;
      .iconfont {
        font-size: 13px;
        &::before {
          font-size: 16px;
          margin-right: 3px;
        }
      }
    }
  }
}
:deep(.el-checkbox-group) {
  font-size: 13px;
  line-height: normal;
}
</style>
