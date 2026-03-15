import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { QK } from "../../../../lib/queryKeys";
import { documentsApi } from "../../../../api/documents.api";
import type { PermanentDocumentResponse } from "../../../../api/documents.api";
import { cn, getErrorMessage } from "../../../../utils/utils";
import { toast } from "../../../../utils/toast";
import { Badge } from "../../../../components/ui/Badge";
import { DOC_TYPE_LABELS, STATUS_LABELS, STATUS_BADGE_VARIANT } from "../../../documents/documents.constants";

const DOC_TYPE_ICONS: Record<string, string> = {
  id_copy: "🪪",
  power_of_attorney: "📜",
  engagement_agreement: "📝",
  tax_form: "📄",
  receipt: "📄",
  invoice_doc: "📄",
  bank_approval: "📄",
  withholding_certificate: "📄",
  nii_approval: "📄",
  other: "📄",
};

const ALL_REQUIRED_TYPES = ["id_copy", "power_of_attorney", "engagement_agreement"] as const;

const formatDate = (dateStr: string): string =>
  new Date(dateStr).toLocaleDateString("he-IL", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

interface DocumentCardProps {
  doc: PermanentDocumentResponse;
}

const DocumentCard = ({ doc }: DocumentCardProps) => {
  const label = DOC_TYPE_LABELS[doc.document_type] ?? doc.document_type;
  const icon = DOC_TYPE_ICONS[doc.document_type] ?? "📄";

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="text-2xl">{icon}</div>
      <div className="font-medium text-zinc-800 text-sm leading-tight">{label}</div>
      <div className="flex flex-wrap gap-2 text-xs text-zinc-500">
        <span className="rounded-full bg-zinc-100 px-2 py-0.5">{doc.document_type}</span>
        {doc.tax_year != null && (
          <span className="rounded-full bg-blue-50 text-blue-700 px-2 py-0.5">
            {doc.tax_year}
          </span>
        )}
        <Badge variant={STATUS_BADGE_VARIANT[doc.status] ?? "neutral"}>
          {STATUS_LABELS[doc.status] ?? doc.status}
        </Badge>
      </div>
      <div className="text-xs text-zinc-400 mt-auto">{formatDate(doc.uploaded_at)}</div>
    </div>
  );
};
DocumentCard.displayName = "DocumentCard";

interface MissingDocRowProps {
  clientId: number;
  docType: string;
  annualReportId?: number;
}

const MissingDocRow = ({ clientId, docType, annualReportId }: MissingDocRowProps) => {
  const label = DOC_TYPE_LABELS[docType] ?? docType;
  const icon = DOC_TYPE_ICONS[docType] ?? "📄";
  const inputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const upload = useMutation({
    mutationFn: (file: File) =>
      documentsApi.upload({
        client_id: clientId,
        document_type: docType as never,
        file,
        ...(annualReportId != null ? { annual_report_id: annualReportId } : {}),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QK.documents.clientList(clientId) });
      queryClient.invalidateQueries({ queryKey: QK.documents.clientSignals(clientId) });
      if (annualReportId != null) {
        queryClient.invalidateQueries({ queryKey: QK.documents.byAnnualReport(annualReportId) });
      }
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "שגיאה בהעלאת המסמך"));
    },
  });

  return (
    <div className="flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
      <div className="flex items-center gap-3">
        <span className="text-lg">{icon}</span>
        <span className="text-sm font-medium text-zinc-800">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {upload.isPending && <span className="text-xs text-zinc-400">מעלה...</span>}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={upload.isPending}
          className={cn(
            "rounded-md px-3 py-1.5 text-xs font-medium text-white transition-colors",
            upload.isPending ? "bg-amber-300 cursor-not-allowed" : "bg-amber-500 hover:bg-amber-600",
          )}
        >
          העלה
        </button>
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) upload.mutate(f); }}
        />
      </div>
    </div>
  );
};
MissingDocRow.displayName = "MissingDocRow";

interface DocumentsTabProps {
  clientId: number;
  reportId?: number;
}

export const DocumentsTab = ({ clientId, reportId }: DocumentsTabProps) => {
  const byClient = useQuery({
    queryKey: QK.documents.clientList(clientId),
    queryFn: () => documentsApi.listByClient(clientId),
    enabled: reportId == null,
  });

  const byReport = useQuery({
    queryKey: QK.documents.byAnnualReport(reportId!),
    queryFn: () => documentsApi.listByAnnualReport(reportId!),
    enabled: reportId != null,
  });

  const { data: signals } = useQuery({
    queryKey: QK.documents.clientSignals(clientId),
    queryFn: () => documentsApi.getSignalsByClient(clientId),
  });

  const activeQuery = reportId != null ? byReport : byClient;
  const docs = activeQuery.data?.items ?? [];
  const uploadedTypes = new Set(docs.map((d) => d.document_type));

  const missingTypes =
    (signals?.missing_documents?.length ?? 0) > 0
      ? (signals?.missing_documents ?? [])
      : ALL_REQUIRED_TYPES.filter((t) => !uploadedTypes.has(t));

  if (activeQuery.isPending) {
    return (
      <div className="flex items-center justify-center py-16 text-zinc-400 text-sm">
        טוען מסמכים...
      </div>
    );
  }

  return (
    <div className="space-y-8" dir="rtl">
      <section>
        <h3 className="mb-4 text-sm font-semibold text-zinc-600 uppercase tracking-wide">
          מסמכים מקושרים ({docs.length})
        </h3>
        {docs.length === 0 ? (
          <p className="text-sm text-zinc-400">אין מסמכים מקושרים ללקוח זה.</p>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {docs.map((doc) => (
              <DocumentCard key={doc.id} doc={doc} />
            ))}
          </div>
        )}
      </section>

      {missingTypes.length > 0 && (
        <section>
          <h3 className="mb-4 text-sm font-semibold text-amber-600 uppercase tracking-wide">
            מסמכים חסרים ({missingTypes.length})
          </h3>
          <div className="space-y-2">
            {missingTypes.map((type) => (
              <MissingDocRow
                key={type}
                clientId={clientId}
                docType={type}
                annualReportId={reportId}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
DocumentsTab.displayName = "DocumentsTab";
