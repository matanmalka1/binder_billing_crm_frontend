export interface SearchResult {
  result_type: string;
  client_id: number;
  client_name: string;
  id_number?: string | null;
  client_status?: string | null;
  binder_id: number | null;
  binder_number: string | null;
  signals?: string[] | null;
}

export interface DocumentSearchResult {
  id: number;
  client_id: number;
  business_id: number;
  client_name: string;
  document_type: string;
  original_filename: string | null;
  tax_year: number | null;
  status: string;
}

export interface SearchResponse {
  results: SearchResult[];
  documents: DocumentSearchResult[];
  page: number;
  page_size: number;
  total: number;
}

export interface SearchParams {
  query?: string;
  client_name?: string;
  id_number?: string;
  binder_number?: string;
  signal_type?: string[];
  has_signals?: boolean;
  page?: number;
  page_size?: number;
}
