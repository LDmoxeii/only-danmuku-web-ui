import request from '@/utils/Request'
import type { DanmuItem, GetDanmukuListRequest, PostDanmukuRequest } from './types'

const base = '/danmuku'

export async function loadDanmu(data: GetDanmukuListRequest): Promise<DanmuItem[]> {
  return await request<DanmuItem[]>({ url: `${base}/getList`, data, method: 'post' })
}

export async function postDanmu(data: PostDanmukuRequest): Promise<void> {
  return await request<void>({ url: `${base}/postDanmu`, data, method: 'post' })
}
