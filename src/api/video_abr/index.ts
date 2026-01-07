import request from '@/utils/Request'
import type { GetVideoVariantsRequest, GetVideoVariantsResponse } from './types'

export const abrMasterUrl = (fileId: string | number) => `/api/video/abr/videoResource/${fileId}/master.m3u8`
export const abrPlaylistUrl = (fileId: string | number, quality: string) =>
  `/api/video/abr/videoResource/${fileId}/${quality}/index.m3u8`
export const abrSegmentUrl = (fileId: string | number, quality: string, ts: string) =>
  `/api/video/abr/videoResource/${fileId}/${quality}/${ts}`

export const fetchAbrVariants = (data: GetVideoVariantsRequest) =>
  request<GetVideoVariantsResponse>({
    url: '/video/abr/variants',
    method: 'post',
    data
  })
