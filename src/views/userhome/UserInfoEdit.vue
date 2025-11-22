<template>
  <Dialog
    :show="dialogConfig.show"
    :title="dialogConfig.title"
    :buttons="dialogConfig.buttons"
    width="500px"
    @close="dialogConfig.show = false"
  >
    <el-form
      ref="formDataRef"
      :model="formData"
      :rules="rules"
      label-width="80px"
      @submit.prevent
    >
      <el-form-item
        label="UID"
        prop=""
      >
        {{ formData.userId }}
      </el-form-item>
      <!--input输入-->
      <el-form-item
        label="头像"
        prop="avatar"
      >
        <ImageCoverSelect
          :cover-width="150"
          :cut-width="150"
          :scale="1"
          :cover-image="formData.avatar"
        />
      </el-form-item>
      <el-form-item
        label="昵称"
        prop="nickName"
      >
        <el-input
          v-model="formData.nickName"
          clearable
          placeholder="昵称"
          :maxlength="20"
          show-word-limit
        />
      </el-form-item>
      <!-- 单选 -->
      <el-form-item
        label="性别"
        prop="sex"
      >
        <el-radio-group v-model="formData.sex">
          <el-radio :value="1">
            女
          </el-radio>
          <el-radio :value="2">
            男
          </el-radio>
          <el-radio :value="0">
            保密
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="出生日期"
        prop="birthday"
      >
        <el-date-picker
          v-model="formData.birthday"
          type="date"
          placeholder="请选择出生日期"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>
      <!--input输入-->
      <el-form-item
        label="学校"
        prop="school"
      >
        <el-input
          v-model="formData.school"
          clearable
          placeholder="学校信息"
          :maxlength="150"
          show-word-limit
        />
      </el-form-item>
      <!--textarea输入-->
      <el-form-item
        label="简介"
        prop="personIntroduction"
      >
        <el-input
          v-model="formData.personIntroduction"
          clearable
          placeholder="简介"
          type="textarea"
          :rows="3"
          :maxlength="80"
          resize="none"
          show-word-limit
        />
      </el-form-item>
      <el-form-item
        label="公告"
        prop="noticeInfo"
      >
        <el-input
          v-model="formData.noticeInfo"
          clearable
          placeholder="公告"
          type="textarea"
          :rows="5"
          :maxlength="300"
          resize="none"
          show-word-limit
        />
      </el-form-item>
    </el-form>
  </Dialog>
</template>

<script setup lang="ts">
import { uploadImage } from '@/api/file'
import { updateUserInfo as apiUpdateUserInfo } from '@/api/uhome'
import { ref, getCurrentInstance, nextTick, provide } from 'vue'
import Dialog from "@/components/Dialog.vue";
const { proxy } = getCurrentInstance() as any

const dialogConfig = ref<any>({
  show: false,
  title: '修改用户信息',
  buttons: [
    {
      type: 'primary',
      text: '确定',
      click: () => {
        submitForm()
      },
    },
  ],
})
provide('cutImageCallback', ({ coverImage }: { coverImage: File }) => {
  formData.value.avatar = coverImage
})

const formData = ref<any>({})
const formDataRef = ref<any>()
const rules = {
  avatar: [{ required: true, message: '请上传头像' }],
  nickName: [{ required: true, message: '请输入昵称' }],
  sex: [{ required: true, message: '请选择性别' }],
}

const show = (data: any) => {
  dialogConfig.value.show = true
  nextTick(() => {
    formDataRef.value.resetFields()
    formData.value = Object.assign({}, data)
  })
}
defineExpose({
  show,
})

const emit = defineEmits(['reload'])
const submitForm = () => {
  formDataRef.value.validate(async (valid: boolean) => {
    if (!valid) {
      return
    }
    let params: any = {}
    Object.assign(params, formData.value)

    if (params.avatar instanceof File) {
      const avatar = await uploadImage(params.avatar, true)
      if (!avatar) {
        return
      }
      params.avatar = avatar
    }

    try { await apiUpdateUserInfo(params) } catch (e) { return }
    dialogConfig.value.show = false
    proxy.Message.success('修改成功')
    emit('reload')
  })
}
</script>

<style lang="scss" scoped>
</style>
