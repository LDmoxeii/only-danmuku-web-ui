import request from '@/utils/Request'
import type {
  CancelTopCommentRequest,
  DeleteCommentRequest,
  GetCommentPageRequest,
  GetCommentPageResult,
  PostCommentRequest,
  TopCommentRequest
} from './types'

const base = '/comment'

export async function loadComment(data: GetCommentPageRequest): Promise<GetCommentPageResult> {
  return await request<GetCommentPageResult>({ url: `${base}/page`, method: 'post', data })
}

export async function postComment(data: PostCommentRequest): Promise<void> {
  return await request<void>({ url: `${base}/post`, method: 'post', data })
}

export async function userDelComment(data: DeleteCommentRequest): Promise<void> {
  return await request<void>({ url: `${base}/delete`, method: 'post', data })
}

export async function userTopComment(data: TopCommentRequest): Promise<void> {
  return await request<void>({ url: `${base}/top`, method: 'post', data })
}

export async function userCancelTopComment(data: CancelTopCommentRequest): Promise<void> {
  return await request<void>({ url: `${base}/cancelTop`, method: 'post', data })
}
