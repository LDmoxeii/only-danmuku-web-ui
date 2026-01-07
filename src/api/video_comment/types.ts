import type { PageData, PageParam } from '../_types'

export interface GetCommentPageRequest extends PageParam {
  videoId: string | number
}

export type CommentItem = {
  commentId: string | null
  pCommentId: string | null
  videoId: string | null
  videoUserId: string | null
  videoName: string | null
  videoCover: string | null
  content: string | null
  imgPath: string | null
  userId: string | null
  nickName: string | null
  avatar: string | null
  likeCount: number | null
  hateCount: number | null
  haveLike: number | null
  topType: number | null
  replyUserId: string | null
  replyNickName: string | null
  replyAvatar: string | null
  postTime: string
  childrenCount: number | null
  children: CommentItem[] | null
}

export type CommentUserAction = {
  actionId: string | number
  userId: string | number
  videoId: string | number
  videoName: string
  videoCover: string
  videoUserId: string | number
  commentId: string | number | null
  actionType: number | null
  actionCount: number | null
  cationTime: string
}

export type GetCommentPageResult = {
  commentData: PageData<CommentItem>
  userActionList: CommentUserAction[] | null
}

export type PostCommentRequest = {
  videoId: string | number
  replyCommentId?: number | null
  content: string
  imgPath?: string | null
}

export type DeleteCommentRequest = {
  commentId: string | number
}

export type TopCommentRequest = {
  commentId: string | number
}

export type CancelTopCommentRequest = {
  commentId: string | number
}
