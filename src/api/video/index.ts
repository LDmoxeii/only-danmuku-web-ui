import request from '@/utils/Request'
import type { LoadVideoParams, LoadVideoResult, PListItem, GetInfoResult, SearchParams, SearchResult, VideoItem } from './types'

const base = '/video'

export async function loadRecommendVideo(): Promise<VideoItem[]> {
    return await request<VideoItem[]>({url: `${base}/loadRecommendVideo`, method: 'post'})
}

export async function loadVideo(params: LoadVideoParams): Promise<LoadVideoResult> {
    return await request<LoadVideoResult>({url: `${base}/loadVideo`, method: 'post', params})
}

export async function loadVideoPList(videoId: string | number): Promise<PListItem[]> {
    return await request<PListItem[]>({url: `${base}/loadVideoPList`, method: 'post', params: {videoId}})
}

export async function getVideoInfo(videoId: string | number): Promise<GetInfoResult> {
    return await request<GetInfoResult>({url: `${base}/getVideoInfo`, method: 'post', params: {videoId}})
}

export async function getVideoRecommend(keyword: string, videoId: string | number): Promise<VideoItem[]> {
    return await request<VideoItem[]>({
        url: `${base}/getVideoRecommend`,
        method: 'post',
        data: {keyword, videoId}
    })
}

export async function reportVideoPlayOnline(fileId: string | number, deviceId: string): Promise<number> {
    return await request<number>({
        url: `${base}/reportVideoPlayOnline`,
        method: 'post',
        params: {fileId, deviceId}
    })
}

export async function search(params: SearchParams): Promise<SearchResult> {
    return await request<SearchResult>({url: `${base}/search`, method: 'post', params})
}

export async function getSearchKeywordTop(): Promise<string[]> {
    return await request<string[]>({url: `${base}/getSearchKeywordTop`, method: 'post'})
}

export async function loadHotVideoList(params: { pageNum: number; pageSize?: number }): Promise<LoadVideoResult> {
    return await request<LoadVideoResult>({url: `${base}/loadHotVideoList`, method: 'post', params})
}
