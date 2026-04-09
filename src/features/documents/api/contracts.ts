export interface PermanentDocumentResponse {
  id: number;
  client_id: number;
  document_type: string;
  storage_key: string;
  tax_year: number | null;
  is_present: boolean;
  uploaded_by: number;
  uploaded_at: string;
  version: number;
  superseded_by: number | null;
  status: string;
  annual_report_id: number | null;
  original_filename: string | null;
  file_size_bytes: number | null;
  mime_type: string | null;
  notes: string | null;
  approved_by: number | null;
  approved_at: string | null;
  is_deleted: boolean;
}

export interface PermanentDocumentListResponse {
  items: PermanentDocumentResponse[];
}

export interface DocumentVersionsResponse {
  items: PermanentDocumentResponse[];
}

export interface OperationalSignalsResponse {
  client_id: number;
  missing_documents: string[];
}

export interface RejectDocumentRequest {
  notes: string;
}

export interface UpdateNotesRequest {
  notes: string;
}

export interface UploadDocumentPayload {
  business_id: number;
  client_id: number;
  document_type:
    | "id_copy"
    | "power_of_attorney"
    | "engagement_agreement"
    | "tax_form"
    | "receipt"
    | "invoice_doc"
    | "bank_approval"
    | "withholding_certificate"
    | "nii_approval"
    | "other";
  file: File;
  tax_year?: number | null;
  annual_report_id?: number | null;
  notes?: string | null;
}

export interface ListDocumentsByClientParams {
  tax_year?: number;
}
