import request from '@/utils/Request'
import type {DeleteVideoHistoryRequest, GetHistoryPageRequest, GetHistoryPageResponse} from './types'

const base = '/history'

export async function loadHistory(data: GetHistoryPageRequest): Promise<GetHistoryPageResponse> {
  return await request<GetHistoryPageResponse>({ url: `${base}/page`, data, method: 'post' })
}

export async function cleanHistory(): Promise<void> {
  return await request<void>({ url: `${base}/cleanHistory`, method: 'post' })
}

export async function delHistory(data: DeleteVideoHistoryRequest): Promise<void> {
  return await request<void>({ url: `${base}/delete`, data, method: 'post' })
}
