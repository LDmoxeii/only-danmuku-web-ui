export type GetDanmukuListRequest = {
  fileId: string | number
  videoId: string | number
}

export type DanmukuItem = {
  danmukuId: string | null
  fileId: string | null
  videoId: string | null
  userId: string | null
  text: string | null
  mode: number | null
  color: string | null
  time: number | null
  postTime: string | null
  videoName: string | null
  videoCover: string | null
  nickName: string | null
}

export type PostDanmukuRequest = {
  videoId: string | number
  fileId: string | number
  text: string
  mode: number
  color: string
  time: number
}
