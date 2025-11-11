import request from '@/utils/Request'
import type {CategoryNode} from './types'

const base = '/category'

export async function loadAllCategory(): Promise<CategoryNode[]> {
  return await request<CategoryNode[]>({url: `${base}/loadAllCategory`})
}

