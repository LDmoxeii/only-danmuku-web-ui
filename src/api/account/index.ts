import request from '@/utils/Request'
import type {CheckCode, LoginResponse} from './types'

const base = '/account'

export async function checkCode(): Promise<CheckCode> {
  return await request<CheckCode>({url: `${base}/checkCode`})
}

export async function register(params: { email: string; nickName: string; registerPassword: string; checkCodeKey: string; checkCode: string }): Promise<any> {
  return await request<any>({url: `${base}/register`, params})
}

export async function login(params: { email: string; password: string; checkCodeKey: string; checkCode: string }): Promise<LoginResponse> {
  return await request<LoginResponse>({url: `${base}/login`, params})
}

export async function autoLogin(): Promise<LoginResponse> {
  return await request<LoginResponse>({url: `${base}/autoLogin`})
}

export async function logout(): Promise<any> {
  return await request<any>({url: `${base}/logout`})
}

export async function getUserCountInfo(): Promise<{ focusCount: number; fansCount: number; currentCoinCount: number }> {
  return await request<{
    focusCount: number;
    fansCount: number;
    currentCoinCount: number
  }>({url: `${base}/getUserCountInfo`})
}

