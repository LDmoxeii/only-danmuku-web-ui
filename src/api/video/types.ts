import type { PageData, PageParam } from '../_types'

export interface GetVideoPageRequest extends PageParam {
  parentCategoryId?: string | number | null
  categoryId?: string | number | null
}

export type VideoItem = {
  videoId: string | number
  videoCover: string | null
  videoName: string | null
  userId: string | number | null
  createTime: string
  lastUpdateTime: string | null
  parentCategoryId: string | number
  categoryId: string | number | null
  postType: number
  originInfo: string | null
  tags: string | null
  introduction: string | null
  duration: number
  playCount: number
  likeCount: number
  danmukuCount: number
  commentCount: number
  coinCount: number
  collectCount: number
  recommendType: number
  lastPlayTime: string | null
  nickName: string | null
  avatar: string | null
  categoryFullName: string | null
}

export type GetVideoPageResponse = PageData<VideoItem>

export type RecommendVideoItem = {
  videoId: string | null
  videoCover: string | null
  videoName: string | null
  userId: string | null
  nickName: string | null
  avatar: string | null
  playCount: number | null
  likeCount: number | null
  createTime: string
}

export type GetVideoPListRequest = {
  videoId: string | number
}

export type PListItem = {
  fileId: string | number
  videoId: string | number
  userId: string | number
  fileIndex: number
  fileName: string
  fileSize: number
  filePath: string
  duration: number
}

export type GetVideoDetailRequest = {
  videoId: string | number
}

export type VideoDetailInfo = {
  videoId: string | number
  videoCover: string
  videoName: string
  userId: string | number
  createTime: string
  postType: number
  originInfo: string | null
  tags: string | null
  introduction: string | null
  interaction: string | null
  playCount: number | null
  likeCount: number | null
  danmukuCount: number | null
  commentCount: number | null
  coinCount: number | null
  collectCount: number | null
}

export type VideoDetailUserAction = {
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

export type GetVideoDetailResponse = {
  videoInfo: VideoDetailInfo | null
  userActionList: VideoDetailUserAction[] | null
}

export type GetRecommendVideoListRequest = {
  keyword: string
  videoId: string | number
}

export type GetVideoRecommendItem = {
  videoId: string | number
  videoCover: string | null
  videoName: string | null
  userId: string | number | null
  createTime: number
  lastUpdateTime: number | null
  parentCategoryId: string | number
  categoryId: string | number | null
  postType: number
  originInfo: string | null
  tags: string | null
  introduction: string | null
  duration: number
  status: number
  playCount: number
  likeCount: number
  danmukuCount: number
  commentCount: number
  coinCount: number
  collectCount: number
  recommendType: number
  lastPlayTime: number | null
  nickName: string | null
  avatar: string | null
  categoryFullName: string | null
}

export interface VideoSearchRequest extends PageParam {
  keyword: string
  orderType?: number | null
}

export type VideoSearchItem = {
  videoId: string | number
  videoCover: string | null
  videoName: string | null
  userId: string | number | null
  createTime: string
  lastUpdateTime: string | null
  parentCategoryId: string | number
  categoryId: string | number | null
  postType: number
  originInfo: string | null
  tags: string | null
  introduction: string | null
  duration: number
  playCount: number
  likeCount: number
  danmukuCount: number
  commentCount: number
  coinCount: number
  collectCount: number
  recommendType: number
  lastPlayTime: string | null
  nickName: string | null
  avatar: string | null
  categoryFullName: string | null
}

export type VideoSearchResponse = PageData<VideoSearchItem>

export type ReportVideoPlayOnlineRequest = {
  fileId: string | number
  deviceId: string
}

export interface GetHotVidePageRequest extends PageParam {}

export type GetHotVidePageResponse = PageData<VideoSearchItem>
