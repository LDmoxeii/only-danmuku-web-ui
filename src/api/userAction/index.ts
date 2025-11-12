import request from '@/utils/Request'

const base = '/userAction'

export async function doAction(params: { videoId: string | number; actionType: number; actionCount?: number; commentId?: string | number }): Promise<null | any> {
  return await request<any>({url: `${base}/doAction`, method: 'post', params})
}

export const ACTION_TYPE = {
  VIDEO_LIKE: { value: 1 },
  VIDEO_COLLECT: { value: 2 },
  VIDEO_COIN: { value: 3 },
  COMMENT_LIKE: { value: 4 },
  COMMENT_HATE: { value: 5 },
} as const
