export type CategoryNode = {
  categoryId: string | number
  categoryCode: string
  categoryName: string
  parentCategoryId: string | number
  icon: string | null
  background: string | null
  sort: number
  children: CategoryNode[]
}
