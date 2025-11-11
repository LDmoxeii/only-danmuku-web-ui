import type { PageData } from '../_types'

export interface LoadVideoParams {
  pageNum: number
  pageSize?: number
  parentCategoryId?: string | number
  categoryId?: string | number
}

export interface VideoItem {
  videoId: string | number
  videoName: string
  videoCover: string
  playCount?: number
  danmuCount?: number
  likeCount?: number
  collectCount?: number
  createTime?: string
  duration?: number
}

export type LoadVideoResult = PageData<VideoItem>

export interface PListItem {
  fileId: string | number
  fileName: string
  title?: string
  duration?: number
}

export interface VideoInfo {
  videoId: string | number
  videoName: string
  videoCover: string
  userId: string | number
  danmuCount?: number
  playCount?: number
  createTime?: string
  interaction?: string | null
}

export interface GetInfoResult {
  videoInfo: VideoInfo
  userActionList: any[]
}

export interface SearchParams {
  pageNum: number
  pageSize?: number
  keyword: string
  orderType?: number
}

export type SearchResult = PageData<VideoItem>

