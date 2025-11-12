import request from '@/utils/Request'
import type {PageData} from '../_types'
import type {FocusFansItem, UserHomeVideoItem, UserInfo} from './types'

const base = '/uhome'

// types moved to ./types

export async function getUserInfo(userId: string | number): Promise<UserInfo> {
  const res = await request<UserInfo>({ url: `${base}/getUserInfo`, method: 'post', params: { userId } })
  return res
}

export async function updateUserInfo(params: { nickName: string; avatar: string; sex: number; birthday?: string; school?: string; personIntroduction?: string; noticeInfo?: string }): Promise<any> {
  const res = await request<any>({ url: `${base}/updateUserInfo`, method: 'post', params })
  return res
}

export async function saveTheme(theme: number): Promise<any> {
  return await request<any>({url: `${base}/saveTheme`, method: 'post', params: {theme}})
}

export async function focus(focusUserId: string | number): Promise<any> {
  return await request<any>({url: `${base}/focus`, method: 'post', params: {focusUserId}})
}

export async function cancelFocus(focusUserId: string | number): Promise<any> {
  return await request<any>({url: `${base}/cancelFocus`, method: 'post', params: {focusUserId}})
}

export async function loadFocusList(params: { pageNum: number; pageSize?: number }): Promise<PageData<FocusFansItem>> {
  return await request<PageData<FocusFansItem>>({url: `${base}/loadFocusList`, method: 'post', params})
}

export async function loadFansList(params: { pageNum: number; pageSize?: number }): Promise<PageData<FocusFansItem>> {
  return await request<PageData<FocusFansItem>>({url: `${base}/loadFansList`, method: 'post', params})
}

export async function loadVideoList(params: { pageNum: number; pageSize?: number; userId?: string | number; type?: number; videoName?: string; orderType?: number }): Promise<PageData<UserHomeVideoItem>> {
  return await request<PageData<UserHomeVideoItem>>({url: `${base}/loadVideoList`, method: 'post', params})
}

export async function loadUserCollection(params: { pageNum: number; pageSize?: number; userId?: string | number }): Promise<PageData<UserHomeVideoItem>> {
  return await request<PageData<UserHomeVideoItem>>({url: `${base}/loadUserCollection`, method: 'post', params})
}

