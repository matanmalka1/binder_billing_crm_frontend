export interface BinderDetailResponse {
  id: number;
  client_id: number;
  binder_number: string;
  status: string;
  received_at: string;
  returned_at: string | null;
  pickup_person_name: string | null;
  work_state: string | null;
  signals: string[];
}

export interface BinderListResponseExtended {
  items: BinderDetailResponse[];
  page: number;
  page_size: number;
  total: number;
}
