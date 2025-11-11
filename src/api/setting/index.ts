import request from '@/utils/Request'

const base = '/sysSetting'

export type SysSetting = {
  videoSize: number
  videoPCount: number
}

export async function getSetting(): Promise<SysSetting | null> {
  const res = await request({ url: `${base}/getSetting` })
  return res ?? null
}
