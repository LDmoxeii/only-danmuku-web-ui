import request from '@/utils/Request'
import type { LoadCommentResult } from './types'

const base = '/comment'

export async function loadComment(params: { videoId: string | number; pageNum: number; pageSize?: number }): Promise<LoadCommentResult | null> {
  const res = await request({ url: `${base}/loadComment`, params })
  return res?.data ?? null
}

export async function postComment(params: { videoId: string | number; replyCommentId?: string | number; content: string; imgPath?: string }): Promise<null | any> {
  const res = await request({ url: `${base}/postComment`, params })
  return res?.data ?? null
}

export async function userDelComment(commentId: string | number): Promise<null | any> {
  const res = await request({ url: `${base}/userDelComment`, params: { commentId } })
  return res?.data ?? null
}

export async function userTopComment(commentId: string | number): Promise<null | any> {
  const res = await request({ url: `${base}/topComment`, params: { commentId } })
  return res?.data ?? null
}

export async function userCancelTopComment(commentId: string | number): Promise<null | any> {
  const res = await request({ url: `${base}/cancelTopComment`, params: { commentId } })
  return res?.data ?? null
}

