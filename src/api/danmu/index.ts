import request from '@/utils/Request'

const base = '/danmu'

export type DanmuItem = {
  danmukuId: string | number
  fileId: string | number
  videoId: string | number
  userId: string | number
  text: string
  mode: number
  color: string
  time: number
  postTime?: string
  nickName?: string
}

export async function loadDanmu(params: { fileId: string | number; videoId: string | number }): Promise<DanmuItem[] | null> {
  const res = await request({ url: `${base}/loadDanmu`, params })
  return res?.data ?? null
}

export async function postDanmu(params: { videoId: string | number; fileId: string | number; text: string; mode: number; color: string; time: number }): Promise<any> {
  const res = await request({ url: `${base}/postDanmu`, params })
  return res?.data ?? null
}

