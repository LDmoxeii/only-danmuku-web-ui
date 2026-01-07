export type GetVideoVariantsRequest = {
  fileId: string | number
}

export type GetVideoVariantsResponse = {
  qualities: string[]
  variantJson: string
}
