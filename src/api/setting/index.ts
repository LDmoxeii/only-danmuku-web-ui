import request from '@/utils/Request'
import type {SysSetting} from './types'

const base = '/sysSetting'

export async function getSetting(): Promise<SysSetting> {
  return await request<SysSetting>({url: `${base}/getSetting`, method: 'post',})
}

