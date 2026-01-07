import request from '@/utils/Request'
import type { DoActionRequest } from './types'

const base = '/userAction'

export async function doAction(data: DoActionRequest): Promise<void> {
  return await request<void>({ url: `${base}/doAction`, method: 'post', data })
}

export const ACTION_TYPE = {
  VIDEO_LIKE: { value: 1 },
  VIDEO_COLLECT: { value: 2 },
  VIDEO_COIN: { value: 3 },
  COMMENT_LIKE: { value: 4 },
  COMMENT_HATE: { value: 5 },
} as const
