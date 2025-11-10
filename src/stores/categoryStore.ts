import { defineStore } from 'pinia'

interface CategoryMap { [key: string]: any }
interface CategoryState {
  categoryMap: CategoryMap
  categoryList: any[]
  cureentPCategory: any
}

const useCategoryStore = defineStore('categoryStore', {
  state: (): CategoryState => ({ categoryMap: {}, categoryList: [], cureentPCategory: {} }),
  actions: {
    saveCategoryMap(data: CategoryMap) { this.categoryMap = data },
    saveCategoryList(data: any[]) { this.categoryList = data },
    setCureentPCategory(data?: string) {
      if (data) this.cureentPCategory = this.categoryMap[data] || {}
      else this.cureentPCategory = {}
    }
  }
})
export { useCategoryStore }
