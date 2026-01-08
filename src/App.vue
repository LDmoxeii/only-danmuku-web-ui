<template>
  <el-config-provider
    :locale="zhCn"
    :message="config"
  >
    <router-view />
  </el-config-provider>
</template>

<script setup lang="ts">
import {onBeforeMount, ref} from 'vue'
import {ElConfigProvider} from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import VueCookies from 'vue-cookies'
import FingerprintJS from '@fingerprintjs/fingerprintjs'

import {useLoginStore} from '@/stores/loginStore'
import {useSysSettingStore} from '@/stores/sysSettingStore'
import {useCategoryStore} from '@/stores/categoryStore'
import {useSearchHistoryStore} from '@/stores/searchHisotryStore'

import {autoLogin as apiAutoLogin} from '@/api/account'
import {getSetting as apiGetSetting} from '@/api/setting'
import {loadAllCategory as apiLoadAllCategory} from '@/api/category'

const loginStore = useLoginStore()
const sysSettingStore = useSysSettingStore()
const categoryStore = useCategoryStore()
const searchHistoryStore = useSearchHistoryStore()

const config = ref({ max: 1 })

// 设备ID：首选现有 cookie，否则生成 uuid 保存
const getDeviceId = async () => {
  let deviceId = (VueCookies as any).get('deviceId') as string | undefined
  if (!deviceId) {
    try {
      const fp = await FingerprintJS.load()
      const result = await fp.get()
      deviceId = result.visitorId
    } catch (_) {
      deviceId = (globalThis.crypto && 'randomUUID' in globalThis.crypto)
          ? (globalThis.crypto as any).randomUUID()
          : Math.random().toString(36).slice(2) + Date.now().toString(36)
    }
    ;(VueCookies as any).set('deviceId', deviceId, -1)
  }
  loginStore.saveDeviceId(deviceId!)
}

// 自动登录：若存在 Authorization cookie，则后端校验并返回用户信息
const autoLogin = async () => {
  const token = (VueCookies as any).get('Authorization')
  if (!token) return
  try {
    const data = await apiAutoLogin()
    loginStore.saveUserInfo(data as any)
  } catch (_) {
    // ignore
  }
}

// 系统设置
const getSysSetting = async () => {
  try {
    const data = await apiGetSetting()
    sysSettingStore.saveSetting(data)
  } catch (_) {}
}

// 分类
const loadCategory = async () => {
  try {
    const list = await apiLoadAllCategory()
    const map: Record<string, any> = {}
    ;(list || []).forEach((cat: any) => {
      map[cat.categoryCode] = cat
      ;(cat.children || []).forEach((sub: any) => {
        map[sub.categoryCode] = sub
      })
    })
    categoryStore.saveCategoryMap(map)
    categoryStore.saveCategoryList(list as any[])
  } catch (_) {}
}

onBeforeMount(() => {
  getDeviceId()
  autoLogin()
  getSysSetting()
  loadCategory()
  searchHistoryStore.initHistory()
})
</script>

<style scoped></style>
