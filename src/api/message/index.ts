import request from '@/utils/Request'
import type { PageData } from '../_types'

const base = '/message'

export async function getNoReadCountGroup(): Promise<Array<{ messageType: number; messageCount: number }> | null> {
  const res = await request({ url: `${base}/getNoReadCountGroup` })
  return res?.data ?? null
}

export async function readAll(messageType: number): Promise<any> {
  const res = await request({ url: `${base}/readAll`, params: { messageType } })
  return res?.data ?? null
}

export async function loadMessage(params: { pageNum: number; pageSize?: number; messageType: number }): Promise<PageData<any> | null> {
  const res = await request({ url: `${base}/loadMessage`, params })
  return res?.data ?? null
}

export async function delMessage(messageId: string | number): Promise<any> {
  const res = await request({ url: `${base}/delMessage`, params: { messageId } })
  return res?.data ?? null
}

