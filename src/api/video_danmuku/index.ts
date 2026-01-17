import request from '@/utils/Request'
import type { DanmukuItem, GetDanmukuListRequest, PostDanmukuRequest } from './types'

const base = '/danmuku'

export async function loadDanmuku(data: GetDanmukuListRequest): Promise<DanmukuItem[]> {
  return await request<DanmukuItem[]>({ url: `${base}/getList`, data, method: 'post' })
}

export async function postDanmuku(data: PostDanmukuRequest): Promise<void> {
  return await request<void>({ url: `${base}/postDanmuku`, data, method: 'post' })
}
