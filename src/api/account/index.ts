import request from '@/utils/Request'

const base = '/account'

export type CheckCode = { checkCodeKey: string; checkCode: string }
export type LoginResponse = { userId: number; nickName: string; avatar?: string; expireAt: number; token: string }

export async function checkCode(): Promise<CheckCode | null> {
  const res = await request({ url: `${base}/checkCode` })
  return res?.data ?? null
}

export async function register(params: { email: string; nickName: string; registerPassword: string; checkCodeKey: string; checkCode: string }): Promise<any> {
  const res = await request({ url: `${base}/register`, params })
  return res?.data ?? null
}

export async function login(params: { email: string; password: string; checkCodeKey: string; checkCode: string }): Promise<LoginResponse | null> {
  const res = await request({ url: `${base}/login`, params })
  return res?.data ?? null
}

export async function autoLogin(): Promise<LoginResponse | null> {
  const res = await request({ url: `${base}/autoLogin` })
  return res?.data ?? null
}

export async function logout(): Promise<any> {
  const res = await request({ url: `${base}/logout` })
  return res?.data ?? null
}

export async function getUserCountInfo(): Promise<{ focusCount: number; fansCount: number; currentCoinCount: number } | null> {
  const res = await request({ url: `${base}/getUserCountInfo` })
  return res?.data ?? null
}

