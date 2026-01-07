import request from '@/utils/Request'
import type {
  AccountLoginRequest,
  AccountLoginResponse,
  AccountRegisterRequest,
  CheckCodeResponse,
  GetUserCountInfoResponse
} from './types'

const base = '/account'

export async function checkCode(): Promise<CheckCodeResponse> {
  return await request<CheckCodeResponse>({ url: `${base}/checkCode`, method: 'post' })
}

export async function register(data: AccountRegisterRequest): Promise<void> {
  return await request<void>({ url: `${base}/register`, data, method: 'post' })
}

export async function login(data: AccountLoginRequest): Promise<AccountLoginResponse> {
  return await request<AccountLoginResponse>({ url: `${base}/login`, data, method: 'post' })
}

export async function autoLogin(): Promise<AccountLoginResponse | null> {
  return await request<AccountLoginResponse | null>({ url: `${base}/autoLogin`, method: 'post' })
}

export async function logout(): Promise<void> {
  return await request<void>({ url: `${base}/logout`, method: 'post' })
}

export async function getUserCountInfo(): Promise<GetUserCountInfoResponse> {
  return await request<GetUserCountInfoResponse>({ url: `${base}/getUserCountInfo`, method: 'post' })
}

