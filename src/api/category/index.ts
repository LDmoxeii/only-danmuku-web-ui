import request from '@/utils/Request'
import type { CategoryNode } from './types'

const base = '/category'

export async function loadAllCategory(): Promise<CategoryNode[] | null> {
  const res = await request({ url: `${base}/loadAllCategory` })
  return res ?? null
}
