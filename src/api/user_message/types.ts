import type {PageData, PageParam} from '../_types'

export type MessageGroupItem = {
  messageType: number
  messageCount: number
}

export type ReadAllMessageRequest = {
  messageType?: number | null
}

export interface GetMessagePageRequest extends PageParam {
  messageType?: number | null
}

export type MessageItem = {
  messageId: string | number
  messageType: number
  readType: number
  extendDto: string | null
  createTime: number
  videoPostId: string | number | null
  videoId: string | number | null
  videoName: string | null
  videoCover: string | null
  sendUserId: string | number | null
  sendUserName: string | null
  sendUserAvatar: string | null
}

export type GetMessagePageResponse = PageData<MessageItem>

export type DeleteMessageRequest = {
  messageId: string | number
}
