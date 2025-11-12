import request from '@/utils/Request'

const base = '/file'

export async function preUploadVideo(params: { fileName: string; chunks: number }, opts?: { onError?: (msg: any) => void; showError?: boolean }): Promise<number> {
  return await request<number>({
    url: `${base}/preUploadVideo`,
    params,
    errorCallback: opts?.onError,
    showError: opts?.showError
  })
}

export async function uploadVideo(params: { chunkFile: File; chunkIndex: number; uploadId: number | string }, opts?: { onProgress?: (e: ProgressEvent) => void; onError?: (msg: any) => void; showError?: boolean }): Promise<any> {
  const form = new FormData()
  form.append('chunkFile', params.chunkFile)
  form.append('chunkIndex', String(params.chunkIndex))
  form.append('uploadId', String(params.uploadId))
  return await request<any>({
    url: `${base}/uploadVideo`,
    data: form,
    uploadProgressCallback: opts?.onProgress,
    errorCallback: opts?.onError,
    showError: opts?.showError
  })
}

export async function delUploadVideo(uploadId: number | string): Promise<any> {
  return await request<any>({ url: `${base}/delUploadVideo`, params: { uploadId } })
}

export async function uploadImage(file: File, createThumbnail: boolean): Promise<string> {
  const form = new FormData()
  form.append('file', file)
  form.append('createThumbnail', String(createThumbnail))
  return await request<string>({ url: `${base}/uploadImage`, data: form })
}

export const getVideoResource = (fileId: string | number) => `/api/file/videoResource/${fileId}/`
export const sourcePath = '/api/file/getResource?sourceName='
