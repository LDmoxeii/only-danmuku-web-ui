import { defineStore } from 'pinia'

interface UserInfo { [key: string]: any }
interface LoginState {
  showLogin: boolean
  userInfo: UserInfo
  messageNoReadCount: number
  deviceId: string | null
}

const useLoginStore = defineStore('loginState', {
  state: (): LoginState => ({
    showLogin: false,
    userInfo: {},
    messageNoReadCount: 0,
    deviceId: null
  }),
  actions: {
    setLogin(show: boolean) { this.showLogin = show },
    saveUserInfo(info: UserInfo) { this.userInfo = info },
    saveMessageNoReadCount(count: number) { this.messageNoReadCount = count },
    readMessageCount(count: number) { this.messageNoReadCount -= count },
    saveDeviceId(deviceId: string) { this.deviceId = deviceId }
  }
})
export { useLoginStore }
