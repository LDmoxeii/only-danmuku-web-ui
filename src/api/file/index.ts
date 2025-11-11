import request from '@/utils/Request'

const base = '/file'

export async function preUploadVideo(params: { fileName: string; chunks: number }, opts?: { onError?: (msg: any) => void; showError?: boolean }): Promise<number | null> {
  const res = await request({ url: `${base}/preUploadVideo`, params, errorCallback: opts?.onError, showError: opts?.showError })
  return res ?? null
}

export async function uploadVideo(params: { chunkFile: File; chunkIndex: number; uploadId: number | string }, opts?: { onProgress?: (e: ProgressEvent) => void; onError?: (msg: any) => void; showError?: boolean }): Promise<any> {
  const res = await request({ url: `${base}/uploadVideo`, params, dataType: 'file' as any, uploadProgressCallback: opts?.onProgress, errorCallback: opts?.onError, showError: opts?.showError })
  return res ?? null
}

export async function delUploadVideo(uploadId: number | string): Promise<any> {
  const res = await request({ url: `${base}/delUploadVideo`, params: { uploadId }, dataType: 'file' as any })
  return res ?? null
}

export async function uploadImage(file: File, createThumbnail: boolean): Promise<string | null> {
  const res = await request({ url: `${base}/uploadImage`, params: { file, createThumbnail }, dataType: 'file' as any })
  return res ?? null
}

export const getVideoResource = (fileId: string | number) => `/api/file/videoResource/${fileId}/`
export const sourcePath = '/api/file/getResource?sourceName='
