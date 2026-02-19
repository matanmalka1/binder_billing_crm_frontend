import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { CheckCircle, XCircle, Clock, AlertTriangle, FileSignature } from "lucide-react";
import { signerApi } from "../api/signatureRequests.api";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Textarea } from "../components/ui/Textarea";
import { formatDate } from "../utils/utils";
import { getSignatureRequestTypeLabel } from "../utils/enums";

type PageState = "loading" | "ready" | "confirming_approve" | "confirming_decline" | "signed" | "declined" | "error";

export const SigningPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [pageState, setPageState] = useState<PageState>("loading");
  const [declineReason, setDeclineReason] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["signer", token],
    queryFn: () => signerApi.view(token!),
    enabled: !!token,
    retry: false,
    staleTime: Infinity,
  });

  const approveMutation = useMutation({
    mutationFn: () => signerApi.approve(token!),
    onSuccess: () => setPageState("signed"),
    onError: () => setPageState("error"),
  });

  const declineMutation = useMutation({
    mutationFn: () =>
      signerApi.decline(token!, { reason: declineReason.trim() || undefined }),
    onSuccess: () => setPageState("declined"),
    onError: () => setPageState("error"),
  });

  // Determine effective page state
  const effectiveState: PageState = (() => {
    if (isLoading) return "loading";
    if (error || !data) return "error";
    if (data.status === "signed") return "signed";
    if (data.status === "declined") return "declined";
    if (data.status === "expired") return "error";
    if (data.status === "canceled") return "error";
    return pageState === "loading" ? "ready" : pageState;
  })();

  const isExpired = data && data.expires_at && new Date(data.expires_at) < new Date();

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4"
      dir="rtl"
    >
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4">
            <FileSignature className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">חתימה דיגיטלית</h1>
          <p className="text-gray-500 mt-1 text-sm">מערכת CRM – חתימה מאובטחת</p>
        </div>

        {/* Loading */}
        {effectiveState === "loading" && (
          <Card>
            <div className="flex flex-col items-center py-10 gap-3">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-600">טוען מסמך...</p>
            </div>
          </Card>
        )}

        {/* Error / expired / canceled */}
        {effectiveState === "error" && (
          <Card>
            <div className="flex flex-col items-center py-10 gap-3 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">
                {data?.status === "expired" ? "הקישור פג תוקף" : "בקשה לא זמינה"}
              </h2>
              <p className="text-gray-600 max-w-sm">
                {data?.status === "expired"
                  ? "קישור זה לחתימה פג תוקפו. פנה למשרד לקבלת קישור חדש."
                  : "הקישור שגוי, בוטל, או שאירעה שגיאה. פנה למשרד לבירור."}
              </p>
            </div>
          </Card>
        )}

        {/* Already signed */}
        {effectiveState === "signed" && (
          <Card>
            <div className="flex flex-col items-center py-10 gap-3 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">המסמך נחתם בהצלחה</h2>
              <p className="text-gray-600">תודה! חתימתך נקלטה במערכת.</p>
            </div>
          </Card>
        )}

        {/* Already declined */}
        {effectiveState === "declined" && (
          <Card>
            <div className="flex flex-col items-center py-10 gap-3 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <XCircle className="h-8 w-8 text-gray-500" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">הבקשה נדחתה</h2>
              <p className="text-gray-600">דחית את בקשת החתימה. פנה למשרד לפרטים נוספים.</p>
            </div>
          </Card>
        )}

        {/* Ready to sign */}
        {effectiveState === "ready" && data && (
          <Card>
            <div className="space-y-5">
              {/* Document info */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="font-semibold text-gray-900 text-base">{data.title}</h2>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {getSignatureRequestTypeLabel(data.request_type)}
                    </p>
                  </div>
                </div>
                {data.description && (
                  <p className="text-sm text-gray-700 leading-relaxed">{data.description}</p>
                )}
              </div>

              {/* Signer info */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">שם החותם</span>
                  <span className="font-medium text-gray-900">{data.signer_name}</span>
                </div>
                {data.expires_at && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">תוקף הקישור</span>
                    <span
                      className={`font-medium ${isExpired ? "text-red-600" : "text-gray-900"}`}
                    >
                      {isExpired ? "פג תוקף" : formatDate(data.expires_at)}
                    </span>
                  </div>
                )}
              </div>

              {/* Expired warning */}
              {isExpired && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex gap-2 items-start">
                  <Clock className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                  <p className="text-sm text-red-700">
                    קישור זה פג תוקפו. לא ניתן לחתום. פנה למשרד לחידוש הבקשה.
                  </p>
                </div>
              )}

              {/* Disclaimer */}
              {!isExpired && (
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                  <p className="text-xs text-blue-700 leading-relaxed">
                    בלחיצה על "אני מאשר/ת וחותם/ת" הנך מאשר/ת את תוכן המסמך ומסכים/ה לחתימה
                    דיגיטלית מחייבת בהתאם לחוק חתימה אלקטרונית (התשס"א-2001).
                  </p>
                </div>
              )}

              {/* Actions */}
              {!isExpired && (
                <div className="flex gap-2 pt-1">
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => setPageState("confirming_decline")}
                    className="flex-1"
                  >
                    <XCircle className="h-4 w-4" />
                    דחייה
                  </Button>
                  <Button
                    variant="primary"
                    size="md"
                    isLoading={approveMutation.isPending}
                    onClick={() => setPageState("confirming_approve")}
                    className="flex-[2]"
                  >
                    <CheckCircle className="h-4 w-4" />
                    אני מאשר/ת וחותם/ת
                  </Button>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Confirm approve */}
        {effectiveState === "confirming_approve" && data && (
          <Card>
            <div className="space-y-5">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-green-100 rounded-full mb-3">
                  <CheckCircle className="h-7 w-7 text-green-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">אישור חתימה</h2>
                <p className="text-gray-600 text-sm mt-1">
                  האם אתה/ת בטוח/ה שברצונך לחתום על "{data.title}"?
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPageState("ready")}
                  className="flex-1"
                  disabled={approveMutation.isPending}
                >
                  חזרה
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  isLoading={approveMutation.isPending}
                  onClick={() => approveMutation.mutate()}
                  className="flex-[2]"
                >
                  כן, אני חותם/ת
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Confirm decline */}
        {effectiveState === "confirming_decline" && data && (
          <Card>
            <div className="space-y-4">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-red-100 rounded-full mb-3">
                  <XCircle className="h-7 w-7 text-red-500" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">דחיית בקשה</h2>
                <p className="text-gray-600 text-sm mt-1">
                  האם אתה/ת בטוח/ה שברצונך לדחות את בקשת החתימה?
                </p>
              </div>
              <Textarea
                label="סיבת דחייה (אופציונלי)"
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                placeholder="תאר/י את הסיבה לדחייה..."
                rows={3}
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPageState("ready")}
                  className="flex-1"
                  disabled={declineMutation.isPending}
                >
                  חזרה
                </Button>
                <Button
                  variant="danger"
                  size="md"
                  isLoading={declineMutation.isPending}
                  onClick={() => declineMutation.mutate()}
                  className="flex-[2]"
                >
                  דחיית הבקשה
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-6">
          מערכת ניהול משרד — חתימה מאובטחת ומוצפנת
        </p>
      </div>
    </div>
  );
};
