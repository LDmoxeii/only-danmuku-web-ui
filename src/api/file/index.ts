import request from '@/utils/Request'

const base = '/file'

export async function preUploadVideo(params: { fileName: string; chunks: number }): Promise<number | null> {
  const res = await request({ url: `${base}/preUploadVideo`, params })
  return res?.data ?? null
}

export async function uploadVideo(params: { chunkFile: File; chunkIndex: number; uploadId: number | string }): Promise<any> {
  const res = await request({ url: `${base}/uploadVideo`, params, dataType: 'file' as any })
  return res?.data ?? null
}

export async function delUploadVideo(uploadId: number | string): Promise<any> {
  const res = await request({ url: `${base}/delUploadVideo`, params: { uploadId }, dataType: 'file' as any })
  return res?.data ?? null
}

export async function uploadImage(file: File, createThumbnail: boolean): Promise<string | null> {
  const res = await request({ url: `${base}/uploadImage`, params: { file, createThumbnail }, dataType: 'file' as any })
  return res?.data ?? null
}

export const getVideoResource = (fileId: string | number) => `/api/file/videoResource/${fileId}/`
export const sourcePath = '/api/file/getResource?sourceName='

