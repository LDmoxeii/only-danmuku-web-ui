import request from '@/utils/Request'
import type {
    BindPhoneRequest,
    CancelFocusRequest,
    GetVideoPageResponse,
    FocusRequest,
    GetCollectionPageRequest, GetCollectionPageResponse,
    GetCustomerProfileDetailRequest,
    GetFansPageRequest,
    GetFocusPageRequest, GetFocusPageResponse, GetFansPageResponse,
    GetVideoPageRequest,
    SaveThemeRequest,
    UpdateCustomerProfileRequest,
    UserInfo
} from './types'

const base = '/uHome'

export async function getUserInfo(data: GetCustomerProfileDetailRequest): Promise<UserInfo> {
    return await request<UserInfo>({url: `${base}/customerProfile/detail`, method: 'post', data})
}

export async function updateUserInfo(data: UpdateCustomerProfileRequest): Promise<void> {
    return await request<void>({url: `${base}/customerProfile/update`, method: 'post', data})
}

export async function saveTheme(data: SaveThemeRequest): Promise<void> {
    return await request<void>({url: `${base}/saveTheme`, method: 'post', data})
}

export async function focus(data: FocusRequest): Promise<void> {
    return await request<void>({url: `${base}/focus`, method: 'post', data})
}

export async function cancelFocus(data: CancelFocusRequest): Promise<void> {
    return await request<void>({url: `${base}/cancelFocus`, method: 'post', data})
}

export async function loadFocusList(data: GetFocusPageRequest): Promise<GetFocusPageResponse> {
    return await request<GetFocusPageResponse>({url: `${base}/getFocusPage`, method: 'post', data})
}

export async function loadFansList(data: GetFansPageRequest): Promise<GetFansPageResponse> {
    return await request<GetFansPageResponse>({url: `${base}/getFansPage`, method: 'post', data})
}

export async function loadVideoList(data: GetVideoPageRequest): Promise<GetVideoPageResponse> {
    return await request<GetVideoPageResponse>({url: `${base}/getVideoPage`, method: 'post', data})
}

export async function loadUserCollection(data: GetCollectionPageRequest): Promise<GetCollectionPageResponse> {
    return await request<GetCollectionPageResponse>({url: `${base}/getCollectionPage`, method: 'post', data})
}

export async function bindPhone(data: BindPhoneRequest): Promise<void> {
    return await request<void>({url: `${base}/bindPhone`, method: 'post', data})
}
