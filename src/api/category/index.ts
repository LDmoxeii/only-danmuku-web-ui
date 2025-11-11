import request from '@/utils/Request'

const base = '/category'

export type CategoryNode = {
  categoryId: string | number
  categoryCode?: string
  categoryName: string
  icon?: string
  background?: string
  children?: CategoryNode[]
}

export async function loadAllCategory(): Promise<CategoryNode[] | null> {
  const res = await request({ url: `${base}/loadAllCategory` })
  return res?.data ?? null
}

