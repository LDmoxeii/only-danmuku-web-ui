import request from '@/utils/Request'
import type { DanmuItem } from './types'

const base = '/danmu'

export async function loadDanmu(params: { fileId: string | number; videoId: string | number }): Promise<DanmuItem[] | null> {
  const res = await request({ url: `${base}/loadDanmu`, params })
  return res ?? null
}

export async function postDanmu(params: { videoId: string | number; fileId: string | number; text: string; mode: number; color: string; time: number }): Promise<any> {
  const res = await request({ url: `${base}/postDanmu`, params })
  return res ?? null
}
