import type { PageData, PageParam } from '../_types'

export type SaveVideoPostRequest = {
  videoCover: string
  videoName: string
  parentCategoryId: string | number
  categoryId?: string | number | null
  postType: number
  originInfo?: string | null
  tags: string
  introduction?: string | null
  interaction?: string | null
  uploadFileList: string
}

export type UpdateVideoPostRequest = {
  videoPostId: string | number
  videoCover: string
  videoName: string
  parentCategoryId: string | number
  categoryId?: string | number | null
  postType: number
  originInfo?: string | null
  tags: string
  introduction?: string | null
  interaction?: string | null
  uploadFileList: string
}

export interface GetVideoPostPageRequest extends PageParam {
  status?: number | null
  videoNameFuzzy?: string | null
}

export type VideoPostItem = {
  videoPostId: string | number
  videoId: string | number | null
  videoCover: string | null
  videoName: string | null
  duration: number | null
  createTime: string
  lastUpdateTime: string | null
  status: number | null
  statusName: string | null
  interaction: string | null
  playCount: number | null
  likeCount: number | null
  danmukuCount: number | null
  commentCount: number | null
  coinCount: number | null
  collectCount: number | null
}

export type GetVideoPostPageResponse = PageData<VideoPostItem>

export type GetVideoByVideoIdRequest = {
  videoId: string | number
}

export type VideoInfo = {
  videoId: string | null
  videoCover: string | null
  videoName: string | null
  parentCategoryId: string | number | null
  categoryId: string | number | null
  postType: number | null
  originInfo: string | null
  tags: string | null
  introduction: string | null
  interaction: string | null
  status: number | null
}

export type VideoFileItem = {
  fileId: string | null
  uploadId: string | null
  fileIndex: number | null
  fileName: string | null
  fileSize: number | null
  filePath: string | null
  duration: number | null
  transferResult: number | null
}

export type GetVideoByVideoIdResponse = {
  videoInfo: VideoInfo | null
  videoInfoFileList: VideoFileItem[] | null
}

export type GetVideoPostCountInfoResponse = {
  inProgress: number | null
  auditPassCount: number | null
  auditFailCount: number | null
}

export type SaveVideoPostInteractionRequest = {
  videoPostId: string | number
  interaction: string
}

export type DeleteVideoRequest = {
  videoId: string | number
}
