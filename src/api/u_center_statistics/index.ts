import request from '@/utils/Request'
import type { GetActualTimeStatisticsResponse, GetWeekStatisticsInfoRequest, WeekStatisticsItem } from './types'

const base = '/uCenter'

export async function getActualTimeStatisticsInfo(): Promise<GetActualTimeStatisticsResponse> {
  return await request<GetActualTimeStatisticsResponse>({ url: `${base}/getActualTimeStatistics`, method: 'post' })
}

export async function getWeekStatisticsInfo(data: GetWeekStatisticsInfoRequest): Promise<WeekStatisticsItem[]> {
  return await request<WeekStatisticsItem[]>({ url: `${base}/getWeekStatisticsInfo`, method: 'post', data })
}
