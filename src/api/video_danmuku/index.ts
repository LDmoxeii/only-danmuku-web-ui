import request from '@/utils/Request'
import type { DanmukuItem, GetDanmukuListRequest, PostDanmukuRequest } from './types'

const base = '/danmuku'

export async function loadDanmu(data: GetDanmukuListRequest): Promise<DanmukuItem[]> {
  return await request<DanmukuItem[]>({ url: `${base}/getList`, data, method: 'post' })
}

export async function postDanmu(data: PostDanmukuRequest): Promise<void> {
  return await request<void>({ url: `${base}/postDanmu`, data, method: 'post' })
}
