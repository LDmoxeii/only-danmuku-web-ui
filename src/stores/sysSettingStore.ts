import { defineStore } from 'pinia'

interface SysSettingState { sysSetting: Record<string, any> }

const useSysSettingStore = defineStore('sysSetting', {
  state: (): SysSettingState => ({ sysSetting: {} }),
  actions: {
    saveSetting(data: Record<string, any>) { this.sysSetting = data }
  }
})
export { useSysSettingStore }
