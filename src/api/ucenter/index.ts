import request from '@/utils/Request'
import type { PageData } from '../_types'

const base = '/ucenter'

// 投稿/稿件
export async function postVideo(params: any): Promise<any> {
  const res = await request({ url: `${base}/postVideo`, params, showLoading: true })
  return res?.data ?? null
}
export async function loadVideoList(params: { pageNum: number; pageSize?: number; videoNameFuzzy?: string; status?: number | null }): Promise<PageData<any> | null> {
  const res = await request({ url: `${base}/loadVideoList`, params })
  return res?.data ?? null
}
export async function getVideoByVideoId(videoPostId: string | number): Promise<any> {
  const res = await request({ url: `${base}/getVideoByVideoId`, params: { videoPostId } })
  return res?.data ?? null
}
export async function getVideoCountInfo(): Promise<{ inProgress: number; auditPassCount: number; auditFailCount: number } | null> {
  const res = await request({ url: `${base}/getVideoCountInfo` })
  return res?.data ?? null
}
export async function saveVideoInteraction(videoPostId: string | number, interaction: string): Promise<any> {
  const res = await request({ url: `${base}/saveVideoInteraction`, params: { videoPostId, interaction } })
  return res?.data ?? null
}
export async function deleteVideo(videoPostId: string | number): Promise<any> {
  const res = await request({ url: `${base}/deleteVideo`, params: { videoPostId } })
  return res?.data ?? null
}

// 互动（评论/弹幕）
export async function loadAllVideo(): Promise<Array<{ videoId: string | number; videoName: string }>> {
  const res = await request({ url: `${base}/loadAllVideo` })
  return res?.data ?? []
}
export async function loadComment(params: { pageNum: number; pageSize?: number; videoId?: string | number }): Promise<PageData<any> | null> {
  const res = await request({ url: `${base}/loadComment`, params })
  return res?.data ?? null
}
export async function delComment(commentId: string | number): Promise<any> {
  const res = await request({ url: `${base}/delComment`, params: { commentId } })
  return res?.data ?? null
}
export async function loadDanmu(params: { pageNum: number; pageSize?: number; videoId?: string | number }): Promise<PageData<any> | null> {
  const res = await request({ url: `${base}/loadDanmu`, params })
  return res?.data ?? null
}
export async function delDanmu(danmuId: string | number): Promise<any> {
  const res = await request({ url: `${base}/delDanmu`, params: { danmuId } })
  return res?.data ?? null
}

// 统计
export async function getActualTimeStatisticsInfo(): Promise<{ totalCountInfo: Record<string, number>; preDayData: Record<number, number> } | null> {
  const res = await request({ url: `${base}/getActualTimeStatisticsInfo` })
  return res?.data ?? null
}
export async function getWeekStatisticsInfo(dataType: number): Promise<Array<{ statisticsDate: string; statisticsCount: number }> | null> {
  const res = await request({ url: `${base}/getWeekStatisticsInfo`, params: { dataType } })
  return res?.data ?? null
}

