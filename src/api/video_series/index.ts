import request from '@/utils/Request'
import type {
  ChangeVideoSeriesSortRequest,
  DeleteSeriesVideoRequest,
  DeleteVideoSeriesRequest,
  GetAllSeriesVideoListRequest,
  GetAllSeriesVideoListResponse,
  GetVideoSeriesDetailRequest,
  GetVideoSeriesDetailResponse,
  LoadVideoSeriesWithVideoRequest,
  LoadVideoSeriesWithVideoResponse,
  SaveSeriesVideoRequest,
  SaveVideoSeriesRequest,
  SaveVideoSeriesResponse,
  VideoSeriesLoadRequest,
  VideoSeriesLoadResponse
} from './types'

const base = '/uHome/series'

export async function loadVideoSeries(data: VideoSeriesLoadRequest): Promise<VideoSeriesLoadResponse> {
  return await request<VideoSeriesLoadResponse>({ url: `${base}/getVideoSeries`, method: 'post', data })
}

export async function changeVideoSeriesSort(data: ChangeVideoSeriesSortRequest): Promise<void> {
  return await request<void>({ url: `${base}/changeSort`, method: 'post', data })
}

export async function loadVideoSeriesWithVideo(data: LoadVideoSeriesWithVideoRequest): Promise<LoadVideoSeriesWithVideoResponse> {
  return await request<LoadVideoSeriesWithVideoResponse>({ url: `${base}/loadVideoSeriesWithVideo`, method: 'post', data })
}

export async function getVideoSeriesDetail(data: GetVideoSeriesDetailRequest): Promise<GetVideoSeriesDetailResponse> {
  return await request<GetVideoSeriesDetailResponse>({ url: `${base}/detail`, method: 'post', data })
}

export async function saveSeriesVideo(data: SaveSeriesVideoRequest): Promise<void> {
  return await request<void>({ url: `${base}/saveSeriesVideo`, method: 'post', data })
}

export async function delSeriesVideo(data: DeleteSeriesVideoRequest): Promise<void> {
  return await request<void>({ url: `${base}/delSeriesVideo`, method: 'post', data })
}

export async function delVideoSeries(data: DeleteVideoSeriesRequest): Promise<void> {
  return await request<void>({ url: `${base}/delVideoSeries`, method: 'post', data })
}

export async function saveVideoSeries(data: SaveVideoSeriesRequest): Promise<SaveVideoSeriesResponse> {
  return await request<SaveVideoSeriesResponse>({ url: `${base}/saveVideoSeries`, method: 'post', data })
}

export async function loadAllVideo(data: GetAllSeriesVideoListRequest): Promise<GetAllSeriesVideoListResponse> {
  return await request<GetAllSeriesVideoListResponse>({ url: `${base}/getAllVideoList`, method: 'post', data })
}
