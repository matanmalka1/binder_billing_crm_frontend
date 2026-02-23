import { CheckCircle2, XCircle, FileText, AlertTriangle } from "lucide-react";
import type { OperationalSignalsResponse, PermanentDocumentResponse } from "../../../api/documents.api";
import { formatDateTime } from "../../../utils/utils";

const DOC_TYPE_LABELS: Record<string, string> = {
  id_copy: "צילום תעודה מזהה",
  power_of_attorney: "ייפוי כוח",
  engagement_agreement: "הסכם התקשרות",
};

interface DocumentsDataCardsProps {
  documents: PermanentDocumentResponse[];
  signals: OperationalSignalsResponse;
}

export const DocumentsDataCards: React.FC<DocumentsDataCardsProps> = ({ documents, signals }) => (
  <div className="space-y-4">
    {signals.missing_documents.length > 0 && (
      <div className="flex gap-3 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
        <div>
          <p className="text-sm font-semibold text-orange-800">מסמכים חסרים</p>
          <ul className="mt-1 space-y-0.5 text-sm text-orange-700">
            {signals.missing_documents.map((item) => (
              <li key={item}>{DOC_TYPE_LABELS[item] ?? item}</li>
            ))}
          </ul>
        </div>
      </div>
    )}

    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="border-b border-gray-100 bg-gray-50 px-4 py-3">
        <p className="text-sm font-semibold text-gray-700">מסמכים שהועלו</p>
      </div>
      {documents.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-10 text-center">
          <FileText className="h-8 w-8 text-gray-300" />
          <p className="text-sm text-gray-400">לא נמצאו מסמכים ללקוח זה</p>
        </div>
      ) : (
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50 text-right">
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">סוג מסמך</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">קיים</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">הועלה בתאריך</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {documents.map((doc) => (
              <tr key={doc.id} className="transition-colors duration-100 hover:bg-gray-50/60">
                <td className="px-4 py-3.5 text-sm font-medium text-gray-900">
                  {DOC_TYPE_LABELS[doc.document_type] ?? doc.document_type}
                </td>
                <td className="px-4 py-3.5">
                  {doc.is_present ? (
                    <span className="inline-flex items-center gap-1.5 text-green-700">
                      <CheckCircle2 className="h-4 w-4" />
                      <span className="text-xs font-medium">קיים</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-red-500">
                      <XCircle className="h-4 w-4" />
                      <span className="text-xs font-medium">חסר</span>
                    </span>
                  )}
                </td>
                <td className="px-4 py-3.5 text-sm text-gray-500 tabular-nums">
                  {formatDateTime(doc.uploaded_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  </div>
);
