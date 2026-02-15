import React from "react";
import { Card } from "../../../components/ui/Card";
import type { OperationalSignalsResponse, PermanentDocumentResponse } from "../../../api/documents.api";
import { formatDateTime } from "../../../utils/utils";

interface DocumentsDataCardsProps {
  documents: PermanentDocumentResponse[];
  signals: OperationalSignalsResponse;
}

export const DocumentsDataCards: React.FC<DocumentsDataCardsProps> = ({ documents, signals }) => (
  <>
    <Card title="מסמכים שהועלו">
      {documents.length === 0 ? (
        <p className="py-6 text-center text-gray-500">לא נמצאו מסמכים ללקוח זה</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200">
              <tr className="text-right">
                <th className="pb-3 pr-4 font-semibold text-gray-700">מזהה</th>
                <th className="pb-3 pr-4 font-semibold text-gray-700">סוג</th>
                <th className="pb-3 pr-4 font-semibold text-gray-700">קיים</th>
                <th className="pb-3 pr-4 font-semibold text-gray-700">הועלה בתאריך</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50">
                  <td className="py-3 pr-4 text-gray-700">#{doc.id}</td>
                  <td className="py-3 pr-4 text-gray-700">{doc.document_type}</td>
                  <td className="py-3 pr-4 text-gray-700">{doc.is_present ? "כן" : "לא"}</td>
                  <td className="py-3 pr-4 text-gray-700">{formatDateTime(doc.uploaded_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
    <Card title="אותות תפעוליים">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <section>
          <h4 className="text-sm font-semibold text-gray-800">מסמכים חסרים</h4>
          {signals.missing_documents.length === 0 ? (
            <p className="mt-2 text-sm text-gray-500">—</p>
          ) : (
            <ul className="mt-2 list-disc space-y-1 pr-5 text-sm text-gray-700">
              {signals.missing_documents.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
        </section>
        <section>
          <h4 className="text-sm font-semibold text-gray-800">תיקים מתקרבים ל-SLA</h4>
          <p className="mt-2 text-sm text-gray-700">{signals.binders_nearing_sla.length}</p>
        </section>
        <section>
          <h4 className="text-sm font-semibold text-gray-800">תיקים באיחור</h4>
          <p className="mt-2 text-sm text-gray-700">{signals.binders_overdue.length}</p>
        </section>
      </div>
    </Card>
  </>
);
