import request from '@/utils/Request'
import type {
  DeleteMessageRequest, GetMessagePageRequest,
  GetMessagePageResponse, MessageGroupItem, ReadAllMessageRequest
} from './types'

const base = '/message'

export async function getNoReadCountGroup(): Promise<MessageGroupItem[]> {
  return await request<MessageGroupItem[]>({ url: `${base}/getNoReadCountGroup`, method: 'post' })
}

export async function readAll(data: ReadAllMessageRequest): Promise<void> {
  return await request<void>({ url: `${base}/readAll`, data, method: 'post' })
}

export async function loadMessage(data: GetMessagePageRequest): Promise<GetMessagePageResponse> {
  return await request<GetMessagePageResponse>({ url: `${base}/page`, data, method: 'post' })
}

export async function delMessage(data: DeleteMessageRequest): Promise<void> {
  return await request<void>({ url: `${base}/delete`, data, method: 'post' })
}
