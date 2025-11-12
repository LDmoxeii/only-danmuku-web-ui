import request from '@/utils/Request'
import type {LoadCommentResult} from './types'

const base = '/comment'

export async function loadComment(params: { videoId: string | number; pageNum: number; pageSize?: number }): Promise<LoadCommentResult> {
  return await request<LoadCommentResult>({url: `${base}/loadComment`, method: 'post', params})
}

export async function postComment(params: { videoId: string | number; replyCommentId?: string | number; content: string; imgPath?: string }): Promise<void> {
  return await request<void>({url: `${base}/postComment`, method: 'post', params})
}

export async function userDelComment(commentId: string | number): Promise<void> {
  return await request<void>({url: `${base}/userDelComment`, method: 'post', params: {commentId}})
}

export async function userTopComment(commentId: string | number): Promise<void> {
  return await request<void>({url: `${base}/topComment`, method: 'post', params: {commentId}})
}

export async function userCancelTopComment(commentId: string | number): Promise<void> {
  return await request<void>({url: `${base}/cancelTopComment`, method: 'post', params: {commentId}})
}
