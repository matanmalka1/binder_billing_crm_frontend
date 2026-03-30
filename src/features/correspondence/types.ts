import type { AuthorityContactResponse } from "@/features/authorityContacts/api";
import type {
  CorrespondenceEntry,
  CorrespondenceListResponse,
  CreateCorrespondencePayload,
  UpdateCorrespondencePayload,
} from "./api";
import type { CorrespondenceFormValues } from "./schemas";

export interface CorrespondenceListParams {
  page?: number;
  page_size?: number;
}

export interface CorrespondenceQueryParams {
  clientId: number;
  params?: CorrespondenceListParams;
}

export interface CorrespondenceCardProps {
  clientId: number;
}

export interface CorrespondenceModalProps {
  open: boolean;
  isCreating: boolean;
  onClose: () => void;
  onSubmit: (values: CorrespondenceFormValues) => Promise<void>;
  existing?: CorrespondenceEntry | null;
  contacts?: AuthorityContactResponse[];
}

export interface CorrespondenceEntryItemProps {
  entry: CorrespondenceEntry;
  isDeleting: boolean;
  onEdit: (entry: CorrespondenceEntry) => void;
  onDelete: (id: number) => void;
}

export interface CorrespondenceHookResult {
  entries: CorrespondenceEntry[];
  total: number;
  isLoading: boolean;
  error: string | null;
  contacts: AuthorityContactResponse[];
  createEntry: (values: CorrespondenceFormValues) => Promise<CorrespondenceEntry>;
  isCreating: boolean;
  updateEntry: (id: number, payload: UpdateCorrespondencePayload) => Promise<CorrespondenceEntry>;
  isUpdating: boolean;
  deleteEntry: (id: number) => void;
  deletingId: number | null;
}

export type CorrespondenceResponse = CorrespondenceListResponse;
export type CorrespondenceCreatePayload = CreateCorrespondencePayload;
export type CorrespondenceUpdatePayload = UpdateCorrespondencePayload;
