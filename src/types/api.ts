export interface BackendErrorBody {
  type?: string;
  detail?: string;
  status_code?: number;
}

export interface BackendErrorEnvelope {
  detail?: unknown;
  message?: string;
  error?: BackendErrorBody | string;
}
