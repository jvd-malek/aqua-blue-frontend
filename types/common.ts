export type ApiResponse<T> = {
  success: boolean
  message?: string
} & T

export type PaginatedResponse<T> = {
  totalPages: number
  currentPage: number
  total: number
} & T
