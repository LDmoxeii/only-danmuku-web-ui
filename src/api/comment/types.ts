import type { PageData } from '../_types'

export interface CommentItem {
  commentId: string | number
  pCommentId: string | number
  videoId: string | number
  userId: string | number
  nickName: string
  avatar?: string
  content: string
  imgPath?: string | null
  likeCount?: number
  hateCount?: number
  haveLike?: number
  topType?: number
  postTime?: string
  childrenCount?: number
  children?: CommentItem[]
  showReply?: boolean
}

export interface LoadCommentResult {
  commentData: PageData<CommentItem>
  userActionList: any[]
}

