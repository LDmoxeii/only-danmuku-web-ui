import request from '@/utils/Request'
import type { DeleteUploadSessionRequest, PreUploadVideoRequest, UploadVideoRequest } from './types'

const base = '/file'

export async function preUploadVideo(data: PreUploadVideoRequest, opts?: { onError?: (msg: any) => void; showError?: boolean }): Promise<string | number> {
  return await request<string | number>({
    url: `${base}/preUploadVideo`,
    data,
    errorCallback: opts?.onError,
    showError: opts?.showError,
    method: 'post',
  })
}

export async function uploadVideo(data: UploadVideoRequest, opts?: { onProgress?: (e: ProgressEvent) => void; onError?: (msg: any) => void; showError?: boolean }): Promise<void> {
  const form = new FormData()
  form.append('chunkFile', data.chunkFile)
  form.append('chunkIndex', String(data.chunkIndex))
  form.append('uploadId', data.uploadId)
  return await request<void>({
    url: `${base}/uploadVideo`,
    data: form,
    uploadProgressCallback: opts?.onProgress,
    errorCallback: opts?.onError,
    showError: opts?.showError,
    method: 'post'
  })
}

export async function delUploadVideo(data: DeleteUploadSessionRequest): Promise<void> {
  return await request<void>({ url: `${base}/deleteUploadSession`, data, method: 'post' })
}

export async function uploadImage(file: File, createThumbnail: boolean): Promise<string> {
  const form = new FormData()
  form.append('file', file)
  form.append('createThumbnail', String(createThumbnail))
  return await request<string>({ url: `${base}/uploadImage`, data: form, method: 'post' })
}

export const sourcePath = '/api/file/getResource?sourceName='
