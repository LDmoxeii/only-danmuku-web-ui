export interface UserInfo {
  userId: string | number
  nickName: string
  avatar?: string
  sex?: number
  personIntroduction?: string
  noticeInfo?: string
  theme?: number
  currentCoinCount?: number
  fansCount?: number
  focusCount?: number
  likeCount?: number
  playCount?: number
  haveFocus?: boolean
}

export type FocusFansItem = {
  otherUserId: string | number
  otherNickName: string
  otherAvatar?: string
  otherPersonIntroduction?: string
  focusType?: number
}

export type UserHomeVideoItem = {
  videoId: string | number
  videoName: string
  videoCover: string
  playCount?: number
  danmuCount?: number
  likeCount?: number
  collectCount?: number
  createTime?: string
}

