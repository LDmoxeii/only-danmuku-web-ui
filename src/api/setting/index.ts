import request from '@/utils/Request'
import type { SysSetting } from './types'

const base = '/sysSetting'

export async function getSetting(): Promise<SysSetting | null> {
  const res = await request({ url: `${base}/getSetting` })
  return res ?? null
}
