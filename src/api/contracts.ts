export interface ApiErrorMeta {
  type: string
  detail: string
  status_code: number
}

export interface ApiError {
  detail: string | unknown[]
  error: string
  error_meta: ApiErrorMeta
}
