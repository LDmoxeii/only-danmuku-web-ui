import request from '@/utils/Request'
import type {PageData} from '../_types'
import type {HistoryItem} from './types'

const base = '/history'

export async function loadHistory(params: { pageNum: number; pageSize?: number }): Promise<PageData<HistoryItem>> {
  return await request<PageData<HistoryItem>>({url: `${base}/loadHistory`, params, method: 'post',})
}

export async function cleanHistory(): Promise<void> {
  return await request<void>({url: `${base}/cleanHistory`, method: 'post',})
}

export async function delHistory(videoId: string | number): Promise<void> {
  return await request<void>({url: `${base}/delHistory`, params: {videoId}, method: 'post',})
}
