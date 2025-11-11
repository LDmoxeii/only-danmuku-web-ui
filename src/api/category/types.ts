export type CategoryNode = {
  categoryId: string | number
  categoryCode?: string
  categoryName: string
  icon?: string
  background?: string
  children?: CategoryNode[]
}

