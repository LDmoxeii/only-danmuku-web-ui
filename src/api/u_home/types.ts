import type {PageData, PageParam} from '../_types'

export type GetCustomerProfileDetailRequest = {
  userId: string | number
}

export type UserInfo = {
  userId: string | null
  nickName: string | null
  avatar: string | null
  sex: number | null
  birthday: string | null
  school: string | null
  personIntroduction: string | null
  noticeInfo: string | null
  grade: number | null
  theme: number | null
  currentCoinCount: number | null
  fansCount: number | null
  focusCount: number | null
  likeCount: number | null
  playCount: number | null
  haveFocus: boolean | null
}

export type UpdateCustomerProfileRequest = {
  nickName: string
  avatar: string
  sex: number
  birthday?: string | null
  school?: string | null
  personIntroduction?: string | null
  noticeInfo?: string | null
}

export type SaveThemeRequest = {
  theme: number
}

export type FocusRequest = {
  focusUserId: string | number
}

export type CancelFocusRequest = {
  focusUserId: string | number
}

export type FocusFansItem = {
  otherUserId: string | null
  otherNickName: string | null
  otherPersonIntroduction: string | null
  otherAvatar: string | null
  focusType: number | null
}

export type GetFocusPageResponse = PageData<FocusFansItem>

export type GetFansPageResponse = PageData<FocusFansItem>

export interface GetFocusPageRequest extends PageParam {}

export interface GetFansPageRequest extends PageParam {}

export interface GetVideoPageRequest extends PageParam {
  userId?: string | number
  type?: number | null
  videoName?: string | null
  orderType?: number | null
}

export type UserHomeVideoItem = {
  videoId: string | null
  videoCover: string | null
  videoName: string | null
  createTime: string
  playCount: number | null
  likeCount: number | null
  danmukuCount: number | null
  commentCount: number | null
}

export type GetVideoPageResponse = PageData<UserHomeVideoItem>

export interface GetCollectionPageRequest extends PageParam {
  userId?: string | number | null
}

export type CollectionItem = {
  actionId: string | number
  videoId: string | number
  videoUserId: string
  commentId: string | number
  actionType: number
  actionCount: number
  userId: string
  actionTime: string
  videoName: string
  videoCover: string
}

export type GetCollectionPageResponse = PageData<CollectionItem>

export type BindPhoneRequest = {
  phone: string
  smsCode: string
  captchaId: string
}
