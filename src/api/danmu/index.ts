import request from '@/utils/Request'
import type {DanmuItem} from './types'

const base = '/danmu'

export async function loadDanmu(params: { fileId: string | number; videoId: string | number }): Promise<DanmuItem[] | null> {
  return await request<DanmuItem[]>({url: `${base}/loadDanmu`, params})
}

export async function postDanmu(params: { videoId: string | number; fileId: string | number; text: string; mode: number; color: string; time: number }): Promise<any> {
  return await request<any>({url: `${base}/postDanmu`, params})
}

