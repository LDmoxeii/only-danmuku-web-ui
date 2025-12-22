import request from '@/utils/Request'

export type EncQualityItem = {
  quality: string
  authPolicy: number
  playable: boolean
}

// Frontend: issue encrypted playback token (fileId per part)
export const issueEncToken = (fileId: string | number) =>
  request<{ token: string; expireAt: number; allowedQualities?: string }>({
    url: '/video/enc/token',
    method: 'post',
    data: { fileId },
    showError: false
  })

// Frontend: list encrypted qualities with playable status
export const listEncQualities = (fileId: string | number) =>
  request<{ qualities: EncQualityItem[] }>({
    url: '/video/enc/qualities',
    method: 'post',
    data: { fileId },
    showError: false
  })

// Frontend: encrypted resource URL (server replaces __TOKEN__)
export const encMasterUrl = (fileId: string | number, token: string) =>
  `/api/video/enc/videoResource/${fileId}/master.m3u8?token=${encodeURIComponent(token)}`

export const encPlaylistUrl = (fileId: string | number, quality: string, token: string) =>
  `/api/video/enc/videoResource/${fileId}/${quality}/index.m3u8?token=${encodeURIComponent(token)}`

export const encSegmentUrl = (fileId: string | number, quality: string, ts: string) =>
  `/api/video/enc/videoResource/${fileId}/${quality}/${ts}`
