export type DoActionRequest = {
  videoId: string | number
  actionType: number
  actionCount?: number
  commentId?: string | number | null
}
