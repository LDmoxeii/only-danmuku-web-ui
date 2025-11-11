import request from '@/utils/Request'
import type { LoadVideoParams, LoadVideoResult, PListItem, GetInfoResult, SearchParams, SearchResult, VideoItem } from './types'

const base = '/video'

export async function loadRecommendVideo(): Promise<VideoItem[] | null> {
  const res = await request({ url: `${base}/loadRecommendVideo` })
  return res?.data ?? null
}

export async function loadVideo(params: LoadVideoParams): Promise<LoadVideoResult | null> {
  const res = await request({ url: `${base}/loadVideo`, params })
  return res?.data ?? null
}

export async function loadVideoPList(videoId: string | number): Promise<PListItem[] | null> {
  const res = await request({ url: `${base}/loadVideoPList`, params: { videoId } })
  return res?.data ?? null
}

export async function getVideoInfo(videoId: string | number): Promise<GetInfoResult | null> {
  const res = await request({ url: `${base}/getVideoInfo`, params: { videoId } })
  return res?.data ?? null
}

export async function getVideoRecommend(keyword: string, videoId: string | number): Promise<VideoItem[] | null> {
  const res = await request({ url: `${base}/getVideoRecommend`, params: { keyword, videoId } })
  return res?.data ?? null
}

export async function reportVideoPlayOnline(fileId: string | number, deviceId: string): Promise<number | null> {
  const res = await request({ url: `${base}/reportVideoPlayOnline`, params: { fileId, deviceId } })
  return res?.data ?? null
}

export async function search(params: SearchParams): Promise<SearchResult | null> {
  const res = await request({ url: `${base}/search`, params })
  return res?.data ?? null
}

export async function getSearchKeywordTop(): Promise<string[] | null> {
  const res = await request({ url: `${base}/getSearchKeywordTop` })
  return res?.data ?? null
}

export async function loadHotVideoList(params: { pageNum: number; pageSize?: number }): Promise<LoadVideoResult | null> {
  const res = await request({ url: `${base}/loadHotVideoList`, params })
  return res?.data ?? null
}

