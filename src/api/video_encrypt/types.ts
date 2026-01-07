export type IssueTokenRequest = {
  fileId: string | number
}

export type IssueTokenResponse = {
  token: string
  expireAt: number
  allowedQualities: string | null
}

export type GetVideEncVariantsRequest = {
  fileId: string | number
}

export type VideoEncQualityItem = {
  quality: string
  authPolicy: number
  playable: boolean
}

export type GetVideEncVariantsResponse = {
  qualities: VideoEncQualityItem[]
}
