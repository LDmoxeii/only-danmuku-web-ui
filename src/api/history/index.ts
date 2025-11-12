import request from '@/utils/Request'
import type {PageData} from '../_types'
import type {HistoryItem} from './types'

const base = '/history'

export async function loadHistory(params: { pageNum: number; pageSize?: number }): Promise<PageData<HistoryItem>> {
  return await request<PageData<HistoryItem>>({url: `${base}/loadHistory`, params})
}

export async function cleanHistory(): Promise<any> {
  return await request<any>({url: `${base}/cleanHistory`})
}

export async function delHistory(videoId: string | number): Promise<any> {
  return await request<any>({url: `${base}/delHistory`, params: {videoId}})
}

