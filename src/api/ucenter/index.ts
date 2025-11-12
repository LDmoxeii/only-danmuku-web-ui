import request from '@/utils/Request'
import type {PageData} from '../_types'
import type {UCenterVideoCountInfo} from './types'

const base = '/ucenter'

// 投稿/稿件
export async function postVideo(params: any): Promise<any> {
  return await request<any>({url: `${base}/postVideo`, params, showLoading: true})
}
export async function loadVideoList(params: { pageNum: number; pageSize?: number; videoNameFuzzy?: string; status?: number | null }): Promise<PageData<any>> {
  return await request<PageData<any>>({url: `${base}/loadVideoList`, params})
}
export async function getVideoByVideoId(videoPostId: string | number): Promise<any> {
  return await request<any>({url: `${base}/getVideoByVideoId`, params: {videoPostId}})
}
export async function getVideoCountInfo(): Promise<UCenterVideoCountInfo> {
  return await request<UCenterVideoCountInfo>({url: `${base}/getVideoCountInfo`})
}
export async function saveVideoInteraction(videoPostId: string | number, interaction: string): Promise<void> {
  return await request<void>({url: `${base}/saveVideoInteraction`, params: {videoPostId, interaction}})
}
export async function deleteVideo(videoPostId: string | number): Promise<void> {
  return await request<void>({url: `${base}/deleteVideo`, params: {videoPostId}})
}

// 互动（评论/弹幕）
export async function loadAllVideo(): Promise<Array<{ videoId: string | number; videoName: string }>> {
  return await request<Array<{ videoId: string | number; videoName: string }>>({url: `${base}/loadAllVideo`})
}
export async function loadComment(params: { pageNum: number; pageSize?: number; videoId?: string | number }): Promise<PageData<any>> {
  return await request<PageData<any>>({url: `${base}/loadComment`, params})
}
export async function delComment(commentId: string | number): Promise<void> {
  return await request<void>({url: `${base}/delComment`, params: {commentId}})
}
export async function loadDanmu(params: { pageNum: number; pageSize?: number; videoId?: string | number }): Promise<PageData<any>> {
  return await request<PageData<any>>({url: `${base}/loadDanmu`, params})
}
export async function delDanmu(danmuId: string | number): Promise<void> {
  return await request<void>({url: `${base}/delDanmu`, params: {danmuId}})
}

// 统计
export async function getActualTimeStatisticsInfo(): Promise<{ totalCountInfo: Record<string, number>; preDayData: Record<number, number> }> {
  return await request<{
    totalCountInfo: Record<string, number>;
    preDayData: Record<number, number>
  }>({url: `${base}/getActualTimeStatisticsInfo`})
}
export async function getWeekStatisticsInfo(dataType: number): Promise<Array<{ statisticsDate: string; statisticsCount: number }>> {
  return await request<Array<{
    statisticsDate: string;
    statisticsCount: number
  }>>({url: `${base}/getWeekStatisticsInfo`, params: {dataType}})
}
