import request from '@/utils/Request'
import type {
  DeleteVideoRequest,
  GetVideoByVideoIdRequest,
  GetVideoByVideoIdResponse,
  GetVideoPostCountInfoResponse,
  GetVideoPostPageRequest,
  GetVideoPostPageResponse,
  SaveVideoPostInteractionRequest,
  SaveVideoPostRequest,
  UpdateVideoPostRequest
} from './types'

const base = '/uCenter'

export async function createVideo(data: SaveVideoPostRequest): Promise<void> {
  return await request<void>({ url: `${base}/videoPost/save`, data, showLoading: true, method: 'post' })
}

export async function updateVideo(data: UpdateVideoPostRequest): Promise<void> {
  return await request<void>({ url: `${base}/videoPost//update`, data, showLoading: true, method: 'post' })
}

export async function loadVideoList(data: GetVideoPostPageRequest): Promise<GetVideoPostPageResponse> {
  return await request<GetVideoPostPageResponse>({ url: `${base}/videoPost/getPage`, data, method: 'post' })
}

export async function getVideoByVideoId(data: GetVideoByVideoIdRequest): Promise<GetVideoByVideoIdResponse> {
  return await request<GetVideoByVideoIdResponse>({ url: `${base}/getVideoByVideoId`, data, method: 'post' })
}

export async function getVideoCountInfo(): Promise<GetVideoPostCountInfoResponse> {
  return await request<GetVideoPostCountInfoResponse>({ url: `${base}/videoPost/getCountInfo`, method: 'post' })
}

export async function saveVideoInteraction(data: SaveVideoPostInteractionRequest): Promise<void> {
  return await request<void>({ url: `${base}/videoPost/saveInteraction`, data, method: 'post' })
}

export async function deleteVideo(data: DeleteVideoRequest): Promise<void> {
  return await request<void>({ url: `${base}/videoPost/delete`, data, method: 'post' })
}
