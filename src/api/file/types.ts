export type PreUploadVideoRequest = {
  fileName: string
  chunks: number
}

export type UploadVideoRequest = {
  chunkFile: Blob
  chunkIndex: number
  uploadId: string
}

export type DeleteUploadSessionRequest = {
  uploadId: string | number
}
