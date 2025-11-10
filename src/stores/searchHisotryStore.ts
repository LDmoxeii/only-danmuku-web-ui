import { defineStore } from 'pinia'
import VueCookies from 'vue-cookies'

interface SearchState { searchHistory: string[] }

const useSearchHistoryStore = defineStore('searchHistoryState', {
  state: (): SearchState => ({ searchHistory: [] }),
  actions: {
    initHistory() { this.searchHistory = (VueCookies as any).get('searchHistory') || [] },
    addHistory(data: string) {
      if (this.searchHistory.includes(data)) return
      if (this.searchHistory.length >= 10) this.searchHistory.pop()
      this.searchHistory.unshift(data)
      ;(VueCookies as any).set('searchHistory', this.searchHistory)
    },
    delHistory(data: string) {
      this.searchHistory = this.searchHistory.filter((item) => item !== data)
      ;(VueCookies as any).set('searchHistory', this.searchHistory)
    },
    cleanHistory() {
      this.searchHistory = []
      ;(VueCookies as any).set('searchHistory', [])
    }
  }
})
export { useSearchHistoryStore }
