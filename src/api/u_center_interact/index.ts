import request from '@/utils/Request'
import type {
  DeleteCommentRequest,
  DeleteDanmukuRequest,
  GetAllVideoListItem,
  GetCommentPageRequest,
  GetCommentPageResponse,
  GetDanmukuPageRequest,
  GetDanmukuPageResponse
} from './types'

const base = '/uCenter'

export async function loadAllVideo(): Promise<GetAllVideoListItem[]> {
  return await request<GetAllVideoListItem[]>({ url: `${base}/getAllVideoList`, method: 'post' })
}

export async function loadComment(data: GetCommentPageRequest): Promise<GetCommentPageResponse> {
  return await request<GetCommentPageResponse>({ url: `${base}/getCommentPage`, method: 'post', data })
}

export async function delComment(data: DeleteCommentRequest): Promise<void> {
  return await request<void>({ url: `${base}/delComment`, method: 'post', data })
}

export async function loadDanmuku(data: GetDanmukuPageRequest): Promise<GetDanmukuPageResponse> {
  return await request<GetDanmukuPageResponse>({ url: `${base}/getDanmukuPage`, method: 'post', data })
}

export async function delDanmuku(data: DeleteDanmukuRequest): Promise<void> {
  return await request<void>({ url: `${base}/deleteDanmuku`, method: 'post', data })
}
