import request from '@/utils/Request'
import type {
  GetHotVidePageRequest,
  GetHotVidePageResponse,
  GetVideoRecommendItem,
  GetRecommendVideoListRequest,
  GetVideoDetailRequest,
  GetVideoDetailResponse,
  GetVideoPageRequest,
  GetVideoPageResponse,
  GetVideoPListRequest,
  PListItem,
  RecommendVideoItem,
  ReportVideoPlayOnlineRequest,
  VideoSearchRequest,
  VideoSearchResponse
} from './types'

const base = '/video'

export async function loadRecommendVideo(): Promise<RecommendVideoItem[]> {
  return await request<RecommendVideoItem[]>({ url: `${base}/getRecommendVideoList`, method: 'post' })
}

export async function loadVideo(data: GetVideoPageRequest): Promise<GetVideoPageResponse> {
  return await request<GetVideoPageResponse>({ url: `${base}/page`, method: 'post', data })
}

export async function loadVideoPList(data: GetVideoPListRequest): Promise<PListItem[]> {
  return await request<PListItem[]>({ url: `${base}/getVideoPList`, method: 'post', data })
}

export async function getVideoInfo(data: GetVideoDetailRequest): Promise<GetVideoDetailResponse> {
  return await request<GetVideoDetailResponse>({ url: `${base}/detail`, method: 'post', data })
}

export async function getVideoRecommend(data: GetRecommendVideoListRequest): Promise<GetVideoRecommendItem[]> {
  return await request<GetVideoRecommendItem[]>({
    url: `${base}/getVideoRecommendList`,
    method: 'post',
    data
  })
}

export async function reportVideoPlayOnline(data: ReportVideoPlayOnlineRequest): Promise<number> {
  return await request<number>({
    url: `${base}/reportVideoPlayOnline`,
    method: 'post',
    data
  })
}

export async function search(data: VideoSearchRequest): Promise<VideoSearchResponse> {
  return await request<VideoSearchResponse>({ url: `${base}/search`, method: 'post', data })
}

export async function getSearchKeywordTop(): Promise<string[]> {
  return await request<string[]>({ url: `${base}/getSearchKeywordTop`, method: 'post' })
}

export async function loadHotVideoList(data: GetHotVidePageRequest): Promise<GetHotVidePageResponse> {
  return await request<GetHotVidePageResponse>({ url: `${base}/getHotVidePage`, method: 'post', data })
}
