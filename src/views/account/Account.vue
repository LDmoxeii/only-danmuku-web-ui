<template>
  <div>
    <Dialog
        :show="loginStore.showLogin"
        :buttons="dialogConfig.buttons"
        width="1000px"
        :showCancel="false"
        @close="closeDialog"
        :padding="0"
        :draggable="false"
        :top="100"
    >
      <div class="dialog-panel">
        <div class="bg">
          <img :src="proxy.Utils.getLocalImage('login_bg.png')" alt=""/>
        </div>
        <el-form
            class="login-register"
            :model="formData"
            :rules="rules"
            ref="formDataRef"
        >
          <div class="tab-panel">
            <div :class="[opType == 0 ? '' : 'active']" @click="showPanel(1)">
              登录
            </div>
            <el-divider direction="vertical"/>
            <div :class="[opType == 1 ? '' : 'active']" @click="showPanel(0)">
              注册
            </div>
          </div>
          <!--input输入-->
          <el-form-item prop="email">
            <el-input
                size="large"
                clearable
                placeholder="请输入邮箱"
                v-model="formData.email"
                maxLength="150"
            >
              <template #prefix>
                <span class="iconfont icon-account"></span>
              </template>
            </el-input>
          </el-form-item>
          <!--登录密码-->
          <el-form-item prop="password" v-if="opType == 1">
            <el-input
                show-password
                size="large"
                placeholder="请输入密码"
                v-model="formData.password"
            >
              <template #prefix>
                <span class="iconfont icon-password"></span>
              </template>
            </el-input>
          </el-form-item>
          <!--注册-->
          <div v-if="opType == 0">
            <el-form-item prop="nickName" v-if="opType == 0">
              <el-input
                  size="large"
                  clearable
                  placeholder="请输入昵称"
                  v-model="formData.nickName"
                  maxLength="20"
              >
                <template #prefix>
                  <span class="iconfont icon-account"></span>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="registerPassword">
              <el-input
                  show-password
                  type="password"
                  size="large"
                  placeholder="请输入密码"
                  v-model="formData.registerPassword"
              >
                <template #prefix>
                  <span class="iconfont icon-password"></span>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="reRegisterPassword">
              <el-input
                  show-password
                  type="password"
                  size="large"
                  placeholder="请再次输入密码"
                  v-model="formData.reRegisterPassword"
              >
                <template #prefix>
                  <span class="iconfont icon-password"></span>
                </template>
              </el-input>
            </el-form-item>
          </div>
          <el-form-item prop="checkCode">
            <div class="check-code-panel">
              <el-input
                  size="large"
                  placeholder="请输入验证码"
                  v-model="formData.checkCode"
                  @keyup.enter="doSubmit"
              >
                <template #prefix>
                  <span class="iconfont icon-check code"></span>
                </template>
              </el-input>
              <img
                  :src="checkCodeInfo.checkCode"
                  class="check-code"
                  @click="changeCheckCode()"
               alt=""/>
            </div>
          </el-form-item>
          <el-form-item class="bottom-btn">
            <el-button
                type="primary"
                size="large"
                class="login-btn"
                @click="doSubmit"
            >
              <span v-if="opType == 0">注册</span>
              <span v-if="opType == 1">登录</span>
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </Dialog>
  </div>
</template>


<SCRIPT_REPLACEMENT_MARK/>
<script setup lang="ts">
import {ref, getCurrentInstance, nextTick, onMounted, onUpdated,} from "vue";
import type {FormInstance, FormItemRule} from 'element-plus'
import {checkCode as apiCheckCode, register as apiRegister, login as apiLogin} from '@/api/account'
import type {CheckCode} from "@/api/account/types.ts";
import {useLoginStore} from "@/stores/loginStore";

const {proxy} = getCurrentInstance() as any;
const loginStore = useLoginStore();
const checkCodeInfo = ref<CheckCode>({checkCode: "", checkCodeKey: ""});

const changeCheckCode = async () => {
  const result = await apiCheckCode()
  if (!result) return
  checkCodeInfo.value = result
};

//登录，注册 弹出配置
const dialogConfig = ref<any>({
  show: true,
});

const checkRePassword = (
    rule: FormItemRule & { message?: string },
    value: string,
    callback: (error?: Error) => void
) => {
  if (value !== formData.value.registerPassword) {
    callback(new Error(rule?.message || ''));
  } else {
    callback();
  }
};

// 0:注册 1:登录
const opType = ref<number>(1);
const formData = ref<any>({});
const formDataRef = ref<FormInstance | null>(null);
const rules: any = {
  email: [
    {required: true, message: "请输入邮箱"},
    {validator: proxy.Verify.email, message: "请输入正确的邮箱"},
  ],
  password: [{required: true, message: "请输入密码"}],
  nickName: [{required: true, message: "请输入昵称"}],
  registerPassword: [
    {required: true, message: "请输入密码"},
    {
      validator: proxy.Verify.password,
      message: "密码只能是数字，字母，特殊字符 8-18位",
    },
  ],
  reRegisterPassword: [
    {required: true, message: "请再次输入密码"},
    {
      validator: checkRePassword,
      message: "两次输入的密码不一致",
    },
  ],
  checkCode: [{required: true, message: "请输入图片验证码"}],
};

//重置表单
const resetForm = () => {
  changeCheckCode();
  nextTick(() => {
    formDataRef.value?.resetFields();
    formData.value = {};
  });
};

// 登录、注册、重置密码  提交表单
const doSubmit = () => {
  formDataRef.value?.validate(async (valid: boolean) => {
    if (!valid) {
      return;
    }
    const params: Record<string, any> = {...formData.value};
    params.checkCodeKey = checkCodeInfo.value.checkCodeKey;
    try {
      if (opType.value == 0) {
        await apiRegister(params as any)
        proxy.Message.success("注册成功,请登录");
        showPanel(1);
      } else {
        const result = await apiLogin(params as any)
        proxy.Message.success("登录成功");
        loginStore.setLogin(false);
        loginStore.saveUserInfo(result as any);
      }
    } catch (e) {
      await changeCheckCode();
      return
    }
  });
};

const closeDialog = () => {
  dialogConfig.value.show = false;
  loginStore.setLogin(false);
};

const showPanel = (type: number) => {
  opType.value = type;
  if (loginStore.showLogin) {
    resetForm();
  }
};

onUpdated(() => {
  showPanel(1);
});

onMounted(() => {
  showPanel(1);
});
</script>

<style lang="scss">
.dialog-panel {
  display: flex;
  align-items: center;
  justify-content: space-around;

  .bg {
    width: 450px;
    height: 580px;
    overflow: hidden;

    img {
      width: 100%;
    }
  }

  .login-register {
    width: 350px;

    .tab-panel {
      margin: 10px auto;
      display: flex;
      width: 130px;
      font-size: 18px;
      align-items: center;
      justify-content: space-around;
      cursor: pointer;

      .active {
        color: var(--blue2);
      }
    }

    .no-account {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }

    .login-btn {
      width: 100%;
    }

    .bottom-btn {
      margin-bottom: 0;
    }
  }
}

.check-code-panel {
  display: flex;

  .check-code {
    margin-left: 5px;
    cursor: pointer;
  }
}
</style>

