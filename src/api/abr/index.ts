import request from '@/utils/Request'

// 前台 GET 资源 URL
export const abrMasterUrl = (fileId: number) => `/video/abr/videoResource/${fileId}/master.m3u8`
export const abrPlaylistUrl = (fileId: number, quality: string) =>
  `/video/abr/videoResource/${fileId}/${quality}/index.m3u8`
export const abrSegmentUrl = (fileId: number, quality: string, ts: string) =>
  `/video/abr/videoResource/${fileId}/${quality}/${ts}`

// 档位列表（POST）
export const fetchAbrVariants = (fileId: number) =>
  request<{ qualities: string[]; variantJson: string }>({
    url: '/video/abr/variants',
    method: 'post',
    data: { fileId }
  })
