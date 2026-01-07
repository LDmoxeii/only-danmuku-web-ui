import type { PageData, PageParam } from '../_types'

export type GetAllVideoListItem = {
  videoId: string | null
  videoCover: string | null
  videoName: string | null
  createTime: string
}

export interface GetCommentPageRequest extends PageParam {
  videoId?: string | null
}

export type CommentItem = {
  commentId: string | null
  avatar: string | null
  videoId: string | null
  videoName: string | null
  videoCover: string
  content: string | null
  imgPath: string | null
  userId: string | null
  nickName: string | null
  replyNickName: string | null
  postTime: string
}

export type GetCommentPageResponse = PageData<CommentItem>

export interface GetDanmukuPageRequest extends PageParam {
  videoId?: string | number | null
}

export type DanmukuItem = {
  danmukuId: string | number
  videoId: string | number
  videoName: string
  text: string
  userId: string | number
  nickName: string
  mode: number
  color: string
  time: number
  postTime: string
}

export type GetDanmukuPageResponse = PageData<DanmukuItem>

export type DeleteCommentRequest = {
  commentId: string | number
}

export type DeleteDanmukuRequest = {
  danmukuId: string | number
}
