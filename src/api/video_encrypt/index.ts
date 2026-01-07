import request from '@/utils/Request'
import type { GetVideEncVariantsRequest, GetVideEncVariantsResponse, IssueTokenRequest, IssueTokenResponse } from './types'

export const issueEncToken = (data: IssueTokenRequest) =>
  request<IssueTokenResponse>({
    url: '/video/enc/issueToken',
    method: 'post',
    data,
    showError: false
  })

export const listEncQualities = (data: GetVideEncVariantsRequest) =>
  request<GetVideEncVariantsResponse>({
    url: '/video/enc/variants',
    method: 'post',
    data,
    showError: false
  })

export const encMasterUrl = (fileId: string | number, token: string) =>
  `/api/video/enc/videoResource/${fileId}/master.m3u8?token=${encodeURIComponent(token)}`

export const encPlaylistUrl = (fileId: string | number, quality: string, token: string) =>
  `/api/video/enc/videoResource/${fileId}/${quality}/index.m3u8?token=${encodeURIComponent(token)}`

export const encSegmentUrl = (fileId: string | number, quality: string, ts: string) =>
  `/api/video/enc/videoResource/${fileId}/${quality}/${ts}`
