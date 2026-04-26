import { useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Upload, CreditCard, ScrollText, FileSignature, FileText } from "lucide-react";
import { Button } from "../../../../components/ui/primitives/Button";
import type { ComponentType } from "react";
import { documentsApi, documentsQK } from "@/features/documents";
import type { PermanentDocumentResponse } from "@/features/documents";
import { getErrorMessage } from "../../../../utils/utils";
import { toast } from "../../../../utils/toast";
import { Badge } from "../../../../components/ui/primitives/Badge";
import { DOC_TYPE_LABELS, STATUS_LABELS, STATUS_BADGE_VARIANT } from "@/features/documents";
import { semanticMonoToneClasses } from "@/utils/semanticColors";

const DOC_TYPE_ICONS: Record<string, ComponentType<{ className?: string }>> = {
  id_copy:                 CreditCard,
  power_of_attorney:       ScrollText,
  engagement_agreement:    FileSignature,
  tax_form:                FileText,
  receipt:                 FileText,
  invoice_doc:             FileText,
  bank_approval:           FileText,
  withholding_certificate: FileText,
  nii_approval:            FileText,
  other:                   FileText,
};

const formatDate = (dateStr: string): string =>
  new Date(dateStr).toLocaleDateString("he-IL", { year: "numeric", month: "short", day: "numeric" });

interface DocumentCardProps { doc: PermanentDocumentResponse; }

export const DocumentCard = ({ doc }: DocumentCardProps) => {
  const label = DOC_TYPE_LABELS[doc.document_type] ?? doc.document_type;
  const Icon = DOC_TYPE_ICONS[doc.document_type] ?? FileText;
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:border-gray-300 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info-50">
          <Icon className="h-5 w-5 text-info-600" />
        </div>
        <Badge variant={STATUS_BADGE_VARIANT[doc.status] ?? "neutral"}>
          {STATUS_LABELS[doc.status] ?? doc.status}
        </Badge>
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-800 leading-tight">{label}</p>
        {doc.tax_year != null && <p className="mt-0.5 text-xs text-info-600">שנת מס {doc.tax_year}</p>}
      </div>
      <p className="mt-auto text-xs text-gray-400">{formatDate(doc.uploaded_at)}</p>
    </div>
  );
};
DocumentCard.displayName = "DocumentCard";

interface MissingDocRowProps { clientId: number; docType: string; annualReportId?: number; }

export const MissingDocRow = ({ clientId, docType, annualReportId }: MissingDocRowProps) => {
  const label = DOC_TYPE_LABELS[docType] ?? docType;
  const Icon = DOC_TYPE_ICONS[docType] ?? FileText;
  const inputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const upload = useMutation({
    mutationFn: (file: File) => documentsApi.upload({
      client_record_id: clientId, document_type: docType as never, file,
      ...(annualReportId != null ? { annual_report_id: annualReportId } : {}),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentsQK.clientList(clientId) });
      queryClient.invalidateQueries({ queryKey: documentsQK.clientSignals(clientId) });
      if (annualReportId != null)
        queryClient.invalidateQueries({ queryKey: documentsQK.byAnnualReport(annualReportId) });
    },
    onError: (error) => { toast.error(getErrorMessage(error, "שגיאה בהעלאת המסמך")); },
  });

  return (
    <div className="flex items-center justify-between rounded-xl border border-warning-200 bg-warning-50 px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-warning-100">
          <Icon className="h-4 w-4 text-warning-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-800">{label}</p>
          <p className={`text-xs ${semanticMonoToneClasses.warning}`}>מסמך חסר</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {upload.isPending && <span className="text-xs text-gray-400">מעלה...</span>}
        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={() => inputRef.current?.click()}
          disabled={upload.isPending}
          isLoading={upload.isPending}
          className="text-xs px-3 py-1.5 bg-warning-500 hover:bg-warning-600"
        >
          <Upload className="h-3 w-3" /> העלה
        </Button>
        <input ref={inputRef} type="file" className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) upload.mutate(f); }} />
      </div>
    </div>
  );
};
MissingDocRow.displayName = "MissingDocRow";
