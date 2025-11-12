import request from '@/utils/Request'
import type {PageData} from '../_types'
import type {MessageGroupItem} from './types'

const base = '/message'

export async function getNoReadCountGroup(): Promise<MessageGroupItem[]> {
  return await request<MessageGroupItem[]>({url: `${base}/getNoReadCountGroup`})
}

export async function readAll(messageType: number): Promise<void> {
  return await request<void>({url: `${base}/readAll`, data: {messageType}})
}

export async function loadMessage(params: { pageNum: number; pageSize?: number; messageType: number }): Promise<PageData<any>> {
  return await request<PageData<any>>({url: `${base}/loadMessage`, data: params})
}

export async function delMessage(messageId: string | number): Promise<void> {
  return await request<void>({url: `${base}/delMessage`, data: {messageId}})
}
