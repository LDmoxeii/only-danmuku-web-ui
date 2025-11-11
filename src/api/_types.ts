// 通用分页返回
export interface PageData<T> {
  list: T[]
  pageNum: number
  pageSize: number
  totalCount: number
  pageTotal?: number
}

// 通用空返回
export type Empty = Record<string, never>

