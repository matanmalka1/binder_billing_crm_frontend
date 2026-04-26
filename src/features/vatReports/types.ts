import type { PagedFilters } from "@/types";
import type {
  CreateVatInvoicePayload,
  CreateVatWorkItemPayload,
  UpdateVatInvoicePayload,
  VatInvoiceResponse,
  VatWorkItemResponse,
} from "./api";
import type { ExpenseCategoryRow } from "./vatBreakdown.utils";

export type VatWorkItemsFilters = PagedFilters<{
  status: string;
  period: string;
  clientSearch: string;
}>;

export type VatWorkItemAction = "materialsComplete" | "readyForReview" | "sendBack";

export interface VatInvoiceRowProps {
  inv: VatInvoiceResponse;
  sectionType: "income" | "expense";
  accentBorder: string;
  canEdit: boolean;
  editingAny: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export interface VatHistoryTabProps {
  workItemId: number;
}

export interface VatExportButtonsProps {
  clientId: number;
  period?: string;
  showYearSelector?: boolean;
}

export interface VatCategoryTableProps {
  rows: ExpenseCategoryRow[];
  totalExpenseNet: number;
  totalGrossVat: number;
  totalInputVat: number;
}


export interface VatFiledBannerProps {
  filedAt: string;
  filedByName?: string | null;
  filedBy?: number | null;
  filingMethod?: string | null;
  submissionReference?: string | null;
  isAmendment?: boolean;
  amendsItemId?: number | null;
}

export interface VatClientSummaryPanelProps {
  clientId: number;
}

export interface VatInvoiceTabProps {
  invoiceType: "income" | "expense";
  workItemId: number;
  status: string;
  invoices: VatInvoiceResponse[];
  clientStatus?: string | null;
  isFilingPending?: boolean;
}

export interface VatActionButtonsProps {
  status: string;
  isAdvisor: boolean;
  isLoading: boolean;
  clientStatus?: string | null;
  onMaterialsComplete: () => void;
  onReadyForReview: () => void;
  onFile: () => void;
  onSendBack: () => void;
}

export interface VatSendBackFormProps {
  onCancel: () => void;
  onSubmit: (note: string) => Promise<void>;
  loading: boolean;
}

export interface VatInvoiceAddFormProps {
  invoiceType: "income" | "expense";
  addInvoice: (payload: CreateVatInvoicePayload) => Promise<boolean>;
  isAdding: boolean;
  onCancel?: () => void;
}

export interface VatInvoiceEditRowProps {
  invoice: VatInvoiceResponse;
  sectionType: "income" | "expense";
  accentBorder: string;
  onSave: (payload: UpdateVatInvoicePayload) => Promise<boolean>;
  onCancel: () => void;
  isSaving: boolean;
}

export interface VatProgressBarProps {
  currentStatus: string;
}

export interface VatInvoiceAddModalProps {
  open: boolean;
  invoiceType: "income" | "expense";
  addInvoice: (payload: CreateVatInvoicePayload) => Promise<boolean>;
  isAdding: boolean;
  onClose: () => void;
}

export interface VatSummaryTabProps {
  workItem: VatWorkItemResponse;
  invoices: VatInvoiceResponse[];
}

export interface VatInvoiceTableProps {
  invoices: VatInvoiceResponse[];
  canEdit: boolean;
  workItemId: number;
  sectionType: "income" | "expense";
  emptyMessage?: string;
}

export interface VatWorkItemRowActionsProps {
  item: VatWorkItemResponse;
  isLoading: boolean;
  isDisabled: boolean;
  runAction: (itemId: number, action: VatWorkItemAction) => Promise<void>;
}

export interface VatWorkItemsCreateModalProps {
  open: boolean;
  createError: string | null;
  createLoading: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateVatWorkItemPayload) => Promise<boolean>;
  initialClientId?: number;
  initialPeriod?: string;
}

export interface VatWorkItemsFiltersCardProps {
  filters: VatWorkItemsFilters;
  onClear: () => void;
  onFilterChange: (key: string, value: string) => void;
}

export interface VatWorkItemSummaryBarProps {
  workItem: VatWorkItemResponse;
  onFilingPendingChange?: (isPending: boolean) => void;
}

export interface ColumnOpts {
  isLoading: boolean;
  isDisabled: boolean;
  runAction: (itemId: number, action: VatWorkItemAction) => Promise<void>;
}
