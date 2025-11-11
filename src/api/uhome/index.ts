import request from '@/utils/Request'
import type { PageData } from '../_types'
import type { UserInfo, FocusFansItem, UserHomeVideoItem } from './types'

const base = '/uhome'

// types moved to ./types

export async function getUserInfo(userId: string | number): Promise<UserInfo | null> {
  const res = await request({ url: `${base}/getUserInfo`, params: { userId } })
  return res ?? null
}

export async function updateUserInfo(params: { nickName: string; avatar: string; sex: number; birthday?: string; school?: string; personIntroduction?: string; noticeInfo?: string }): Promise<any> {
  const res = await request({ url: `${base}/updateUserInfo`, params })
  return res ?? null
}

export async function saveTheme(theme: number): Promise<any> {
  const res = await request({ url: `${base}/saveTheme`, params: { theme } })
  return res ?? null
}

export async function focus(focusUserId: string | number): Promise<any> {
  const res = await request({ url: `${base}/focus`, params: { focusUserId } })
  return res ?? null
}

export async function cancelFocus(focusUserId: string | number): Promise<any> {
  const res = await request({ url: `${base}/cancelFocus`, params: { focusUserId } })
  return res ?? null
}

// types moved to ./types

export async function loadFocusList(params: { pageNum: number; pageSize?: number }): Promise<PageData<FocusFansItem> | null> {
  const res = await request({ url: `${base}/loadFocusList`, params })
  return res ?? null
}

export async function loadFansList(params: { pageNum: number; pageSize?: number }): Promise<PageData<FocusFansItem> | null> {
  const res = await request({ url: `${base}/loadFansList`, params })
  return res ?? null
}

// types moved to ./types

export async function loadVideoList(params: { pageNum: number; pageSize?: number; userId?: string | number; type?: number; videoName?: string; orderType?: number }): Promise<PageData<UserHomeVideoItem> | null> {
  const res = await request({ url: `${base}/loadVideoList`, params })
  return res ?? null
}

export async function loadUserCollection(params: { pageNum: number; pageSize?: number; userId?: string | number }): Promise<PageData<UserHomeVideoItem> | null> {
  const res = await request({ url: `${base}/loadUserCollection`, params })
  return res ?? null
}
