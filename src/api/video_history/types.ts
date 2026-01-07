import type {PageData, PageParam} from '../_types'

export interface GetHistoryPageRequest extends PageParam {}

export type HistoryItem = {
  historyId: string | number | null
  videoId: string | null
  videoName: string | null
  videoCover: string | null
  fileIndex: number | null
  playTime: string | null
}

export type GetHistoryPageResponse = PageData<HistoryItem>

export type DeleteVideoHistoryRequest = {
  videoId: string | number
}
