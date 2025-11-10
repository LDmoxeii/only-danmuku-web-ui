import { defineStore } from 'pinia'

interface NavActionState {
  fixedHeader: boolean
  fixedCategory: boolean
  showHeader: boolean
  showCategroy: boolean
  forceFixedHeader: boolean
  [key: string]: any
}

const useNavAction = defineStore('navAction', {
  state: (): NavActionState => ({
    fixedHeader: true,
    fixedCategory: true,
    showHeader: true,
    showCategroy: true,
    forceFixedHeader: false
  }),
  actions: {
    setFixedHeader(fixedHeader: boolean) { this.fixedHeader = fixedHeader },
    setFixedCategory(fixedCategory: boolean) { this.fixedCategory = fixedCategory },
    setShowHeader(showHeader: boolean) { this.showHeader = showHeader },
    setShowCategory(showCategory: boolean) { (this as any).showCategory = showCategory },
    setForceFixedHeader(forceFixedHeader: boolean) { this.forceFixedHeader = forceFixedHeader }
  }
})
export { useNavAction }
