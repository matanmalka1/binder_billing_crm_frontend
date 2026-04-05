import { FileText, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "../../../components/ui/primitives/Badge";
import { DOC_TYPE_LABELS, STATUS_LABELS, STATUS_BADGE_VARIANT } from "@/features/documents";
import type { DocumentSearchResult } from "../api";
import { cn } from "../../../utils/utils";

const DOCUMENT_SEARCH_LIMIT = 50;

interface DocumentResultsSectionProps {
  documents: DocumentSearchResult[];
}

const getDocumentTypeLabel = (documentType: string) =>
  DOC_TYPE_LABELS[documentType] ?? "סוג מסמך לא ידוע";

const getDocumentStatusLabel = (status: string) =>
  STATUS_LABELS[status] ?? "סטטוס לא ידוע";

export const DocumentResultsSection: React.FC<DocumentResultsSectionProps> = ({ documents }) => {
  if (documents.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 px-1">
        <FileText className="h-4 w-4 text-purple-600" />
        <span className="text-sm font-semibold text-gray-800">מסמכים</span>
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-purple-100 px-1.5 text-xs font-semibold text-purple-700">
          {documents.length}
        </span>
        {documents.length >= DOCUMENT_SEARCH_LIMIT && (
          <span className="text-xs text-gray-400">מוצגים {DOCUMENT_SEARCH_LIMIT} ראשונים</span>
        )}
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50 text-right text-xs font-medium text-gray-500">
              <th className="px-4 py-2.5">סוג מסמך</th>
              <th className="px-4 py-2.5">שם קובץ</th>
              <th className="px-4 py-2.5">שנת מס</th>
              <th className="px-4 py-2.5">סטטוס</th>
              <th className="px-4 py-2.5">לקוח</th>
              <th className="px-4 py-2.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {documents.map((doc) => (
              <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-800">
                  {getDocumentTypeLabel(doc.document_type)}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-gray-600 max-w-xs truncate">
                  {doc.original_filename ?? <span className="text-gray-300">—</span>}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {doc.tax_year ?? <span className="text-gray-300">—</span>}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={STATUS_BADGE_VARIANT[doc.status] ?? "neutral"} className="text-xs">
                    {getDocumentStatusLabel(doc.status)}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-gray-700">{doc.client_name}</td>
                <td className="px-4 py-3">
                  <Link
                    to={`/clients/${doc.client_id}/businesses/${doc.business_id}/documents`}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-lg",
                      "border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium",
                      "text-gray-600 shadow-sm transition-all duration-200",
                      "hover:border-purple-400 hover:bg-purple-50 hover:text-purple-800 hover:shadow-md",
                    )}
                  >
                    <ExternalLink className="h-3 w-3" />
                    פירוט
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
