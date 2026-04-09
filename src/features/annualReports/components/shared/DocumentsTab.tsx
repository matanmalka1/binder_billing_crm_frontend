import { useQuery } from "@tanstack/react-query";
import { FileCheck, FileWarning, FileText } from "lucide-react";
import { documentsApi, documentsQK } from "@/features/documents/api";
import { DocumentCard, MissingDocRow } from "./DocumentParts";
import { semanticMonoToneClasses } from "@/utils/semanticColors";

const ALL_REQUIRED_TYPES = ["id_copy", "power_of_attorney", "engagement_agreement"] as const;

interface DocumentsTabProps { clientId: number; reportId?: number; }

export const DocumentsTab = ({ clientId, reportId }: DocumentsTabProps) => {
  const byClient = useQuery({
    queryKey: documentsQK.clientList(clientId),
    queryFn: () => documentsApi.listByClient(clientId),
    enabled: !!clientId && reportId == null,
  });

  const byReport = useQuery({
    queryKey: documentsQK.byAnnualReport(reportId!),
    queryFn: () => documentsApi.listByAnnualReport(reportId!),
    enabled: !!reportId,
  });

  const { data: signals } = useQuery({
    queryKey: documentsQK.clientSignals(clientId),
    queryFn: () => documentsApi.getSignalsByClient(clientId),
    enabled: !!clientId,
  });

  const activeQuery = reportId != null ? byReport : byClient;
  const docs = activeQuery.data?.items ?? [];
  const uploadedTypes = new Set(docs.map((d) => d.document_type));

  const missingTypes =
    (signals?.missing_documents?.length ?? 0) > 0
      ? (signals?.missing_documents ?? [])
      : ALL_REQUIRED_TYPES.filter((t) => !uploadedTypes.has(t));

  if (activeQuery.isPending) {
    return <div className="flex items-center justify-center py-16 text-sm text-gray-400">טוען מסמכים...</div>;
  }

  return (
    <div className="space-y-8" dir="rtl">
      <section>
        <div className="mb-4 flex items-center gap-2">
          <FileCheck className="h-4 w-4 text-gray-400" />
          <h3 className="text-sm font-semibold text-gray-700">מסמכים מקושרים ({docs.length})</h3>
        </div>
        {docs.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 py-12 text-center text-gray-400">
            <FileText className="mx-auto mb-2 h-8 w-8 opacity-30" />
            <p className="text-sm">אין מסמכים מקושרים ללקוח זה.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {docs.map((doc) => <DocumentCard key={doc.id} doc={doc} />)}
          </div>
        )}
      </section>

      {missingTypes.length > 0 && (
        <section>
          <div className="mb-4 flex items-center gap-2">
            <FileWarning className="h-4 w-4 text-warning-500" />
            <h3 className={`text-sm font-semibold ${semanticMonoToneClasses.warning}`}>מסמכים חסרים ({missingTypes.length})</h3>
          </div>
          <div className="space-y-2">
            {missingTypes.map((type) => (
              <MissingDocRow key={type} clientId={clientId} docType={type} annualReportId={reportId} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
DocumentsTab.displayName = "DocumentsTab";
