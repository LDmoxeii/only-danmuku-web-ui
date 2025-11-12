import request from '@/utils/Request'
import type { SeriesBrief, SeriesWithVideos, SeriesDetailResult } from './types'

const base = '/uhome/series'

export async function loadVideoSeries(params: { userId: string | number }): Promise<SeriesBrief[]> {
  return await request<SeriesBrief[]>({ url: `${base}/loadVideoSeries`, method: 'post', params })
}

export async function changeVideoSeriesSort(seriesIds: string): Promise<void> {
  return await request<void>({ url: `${base}/changeVideoSeriesSort`, method: 'post', params: { seriesIds } })
}

export async function loadVideoSeriesWithVideo(params: { userId: string | number }): Promise<SeriesWithVideos[]> {
  return await request<SeriesWithVideos[]>({ url: `${base}/loadVideoSeriesWithVideo`, method: 'post', params })
}

export async function getVideoSeriesDetail(seriesId: string | number): Promise<SeriesDetailResult> {
  return await request<SeriesDetailResult>({ url: `${base}/getVideoSeriesDetail`, method: 'post', params: { seriesId } })
}

export async function saveSeriesVideo(params: { seriesId: string | number; videoIds: string }): Promise<void> {
  return await request<void>({ url: `${base}/saveSeriesVideo`, method: 'post', params })
}

export async function delSeriesVideo(params: { seriesId: string | number; videoId: string | number }): Promise<void> {
  return await request<void>({ url: `${base}/delSeriesVideo`, method: 'post', params })
}

export async function delVideoSeries(seriesId: string | number): Promise<void> {
  return await request<void>({ url: `${base}/delVideoSeries`, method: 'post', params: { seriesId } })
}

export async function saveVideoSeries(params: { seriesName: string; seriesDescription?: string; videoIds?: string; seriesId?: string | number }): Promise<void> {
  return await request<void>({ url: `${base}/saveVideoSeries`, method: 'post', params })
}

export async function loadAllVideo(params: { seriesId?: string | number }): Promise<any[]> {
  return await request<any[]>({ url: `${base}/loadAllVideo`, method: 'post', params })
}

