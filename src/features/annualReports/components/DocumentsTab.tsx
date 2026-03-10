import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { QK } from "../../../lib/queryKeys";
import { documentsApi } from "../../../api/documents.api";
import type { PermanentDocumentResponse } from "../../../api/documents.api";
import { cn, getErrorMessage } from "../../../utils/utils";
import { toast } from "../../../utils/toast";

const DOC_TYPE_LABELS: Record<string, string> = {
  id_copy: "צילום תעודת זהות",
  power_of_attorney: "ייפוי כוח",
  engagement_agreement: "הסכם התקשרות",
};

const DOC_TYPE_ICONS: Record<string, string> = {
  id_copy: "🪪",
  power_of_attorney: "📜",
  engagement_agreement: "📝",
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
      </div>
      <div className="text-xs text-zinc-400 mt-auto">{formatDate(doc.uploaded_at)}</div>
    </div>
  );
};
DocumentCard.displayName = "DocumentCard";

interface MissingDocRowProps {
  clientId: number;
  docType: string;
}

const MissingDocRow = ({ clientId, docType }: MissingDocRowProps) => {
  const label = DOC_TYPE_LABELS[docType] ?? docType;
  const icon = DOC_TYPE_ICONS[docType] ?? "📄";
  const inputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const upload = useMutation({
    mutationFn: (file: File) =>
      documentsApi.upload({ client_id: clientId, document_type: docType as never, file }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QK.documents.clientList(clientId) });
      queryClient.invalidateQueries({ queryKey: QK.documents.clientSignals(clientId) });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "שגיאה בהעלאת המסמך"));
    },
  });

  const handleUploadClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) upload.mutate(file);
  };

  return (
    <div className="flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
      <div className="flex items-center gap-3">
        <span className="text-lg">{icon}</span>
        <span className="text-sm font-medium text-zinc-800">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {upload.isPending && (
          <span className="text-xs text-zinc-400">מעלה...</span>
        )}
        <button
          type="button"
          onClick={handleUploadClick}
          disabled={upload.isPending}
          className={cn(
            "rounded-md px-3 py-1.5 text-xs font-medium text-white transition-colors",
            upload.isPending
              ? "bg-amber-300 cursor-not-allowed"
              : "bg-amber-500 hover:bg-amber-600",
          )}
        >
          העלה
        </button>
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};
MissingDocRow.displayName = "MissingDocRow";

interface DocumentsTabProps {
  clientId: number;
}

export const DocumentsTab = ({ clientId }: DocumentsTabProps) => {
  const { data: docList, isLoading: docsLoading } = useQuery({
    queryKey: QK.documents.clientList(clientId),
    queryFn: () => documentsApi.listByClient(clientId),
  });

  const { data: signals } = useQuery({
    queryKey: QK.documents.clientSignals(clientId),
    queryFn: () => documentsApi.getSignalsByClient(clientId),
  });

  const docs = docList?.items ?? [];
  const uploadedTypes = new Set(docs.map((d) => d.document_type));

  const missingTypes =
    (signals?.missing_documents?.length ?? 0) > 0
      ? (signals?.missing_documents ?? [])
      : ALL_REQUIRED_TYPES.filter((t) => !uploadedTypes.has(t));

  if (docsLoading) {
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
              <MissingDocRow key={type} clientId={clientId} docType={type} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
DocumentsTab.displayName = "DocumentsTab";
