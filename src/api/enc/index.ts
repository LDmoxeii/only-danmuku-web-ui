import request from '@/utils/Request'

// 前台：签发加密播放 token（分P fileId）
export const issueEncToken = (fileId: string | number) =>
  request<{ token: string; expireAt: number; allowedQualities?: string }>({
    url: '/video/enc/token',
    method: 'post',
    data: { fileId }
  })

// 前台：加密资源 URL（服务端会替换 __TOKEN__）
export const encMasterUrl = (fileId: string | number, token: string) =>
  `/api/video/enc/videoResource/${fileId}/master.m3u8?token=${encodeURIComponent(token)}`

export const encPlaylistUrl = (fileId: string | number, quality: string, token: string) =>
  `/api/video/enc/videoResource/${fileId}/${quality}/index.m3u8?token=${encodeURIComponent(token)}`

export const encSegmentUrl = (fileId: string | number, quality: string, ts: string) =>
  `/api/video/enc/videoResource/${fileId}/${quality}/${ts}`
