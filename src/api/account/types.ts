export type CheckCodeResponse = {
  checkCodeKey: string
  checkCode: string
}

export type AccountRegisterRequest = {
  email: string
  nickName: string
  registerPassword: string
  checkCodeKey: string
  checkCode: string
}

export type AccountLoginRequest = {
  email: string
  password: string
  checkCodeKey: string
  checkCode: string
}

export type AccountLoginResponse = {
  userId: string | number
  nickName: string
  avatar: string | null
  expireAt: number
  token: string
}

export type GetUserCountInfoResponse = {
  fansCount: number
  currentCoinCount: number
  focusCount: number
}
