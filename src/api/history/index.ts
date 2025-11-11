import request from '@/utils/Request'
import type { PageData } from '../_types'
import type { HistoryItem } from './types'

const base = '/history'

// types moved to ./types

export async function loadHistory(params: { pageNum: number; pageSize?: number }): Promise<PageData<HistoryItem> | null> {
  const res = await request({ url: `${base}/loadHistory`, params })
  return res ?? null
}

export async function cleanHistory(): Promise<any> {
  const res = await request({ url: `${base}/cleanHistory` })
  return res ?? null
}

export async function delHistory(videoId: string | number): Promise<any> {
  const res = await request({ url: `${base}/delHistory`, params: { videoId } })
  return res ?? null
}
