import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { CheckCircle2, XCircle, Clock, AlertTriangle, FileSignature, ShieldCheck } from "lucide-react";
import { signerApi } from "../api/signatureRequests.api";
import { Button } from "../components/ui/Button";
import { Textarea } from "../components/ui/Textarea";
import { formatDate } from "../utils/utils";
import { getSignatureRequestTypeLabel } from "../utils/enums";

type PageState = "loading" | "ready" | "confirming_approve" | "confirming_decline" | "signed" | "declined" | "error";

/* ── Shared card shell ─────────────────────────────────────── */
const Shell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
    {children}
  </div>
);

/* ── Status illustration ───────────────────────────────────── */
const StatusIllustration: React.FC<{
  icon: React.ReactNode;
  bg: string;
  title: string;
  body: string;
}> = ({ icon, bg, title, body }) => (
  <div className="flex flex-col items-center gap-3 py-6 text-center">
    <div className={`flex h-16 w-16 items-center justify-center rounded-full ${bg}`}>{icon}</div>
    <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
    <p className="max-w-xs text-sm text-gray-500">{body}</p>
  </div>
);

/* ── Main page ─────────────────────────────────────────────── */
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
    mutationFn: () => signerApi.decline(token!, { reason: declineReason.trim() || undefined }),
    onSuccess: () => setPageState("declined"),
    onError: () => setPageState("error"),
  });

  const effectiveState: PageState = (() => {
    if (isLoading) return "loading";
    if (error || !data) return "error";
    if (data.status === "signed") return "signed";
    if (data.status === "declined") return "declined";
    if (data.status === "expired" || data.status === "canceled") return "error";
    return pageState === "loading" ? "ready" : pageState;
  })();

  const isExpired = data?.expires_at && new Date(data.expires_at) < new Date();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50 p-4" dir="rtl">
      {/* Branding */}
      <div className="mb-8 flex flex-col items-center gap-3 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 shadow-md">
          <FileSignature className="h-7 w-7 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">חתימה דיגיטלית</h1>
          <p className="mt-0.5 text-xs text-gray-500">מערכת ניהול משרד · מאובטח ומוצפן</p>
        </div>
      </div>

      {/* Loading */}
      {effectiveState === "loading" && (
        <Shell>
          <div className="flex flex-col items-center gap-3 py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
            <p className="text-sm text-gray-500">טוען מסמך...</p>
          </div>
        </Shell>
      )}

      {/* Error / expired / canceled */}
      {effectiveState === "error" && (
        <Shell>
          <StatusIllustration
            icon={<AlertTriangle className="h-8 w-8 text-red-500" />}
            bg="bg-red-100"
            title={data?.status === "expired" ? "הקישור פג תוקף" : "בקשה לא זמינה"}
            body={
              data?.status === "expired"
                ? "קישור זה לחתימה פג תוקפו. פנה למשרד לקבלת קישור חדש."
                : "הקישור שגוי, בוטל, או שאירעה שגיאה. פנה למשרד לבירור."
            }
          />
        </Shell>
      )}

      {/* Already signed */}
      {effectiveState === "signed" && (
        <Shell>
          <StatusIllustration
            icon={<CheckCircle2 className="h-8 w-8 text-green-600" />}
            bg="bg-green-100"
            title="המסמך נחתם בהצלחה"
            body="תודה! חתימתך נקלטה במערכת."
          />
        </Shell>
      )}

      {/* Already declined */}
      {effectiveState === "declined" && (
        <Shell>
          <StatusIllustration
            icon={<XCircle className="h-8 w-8 text-gray-500" />}
            bg="bg-gray-100"
            title="הבקשה נדחתה"
            body="דחית את בקשת החתימה. פנה למשרד לפרטים נוספים."
          />
        </Shell>
      )}

      {/* Ready to sign */}
      {effectiveState === "ready" && data && (
        <Shell>
          <div className="space-y-5">
            {/* Document info */}
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <h2 className="font-semibold text-gray-900">{data.title}</h2>
              <p className="mt-0.5 text-xs text-gray-500">
                {getSignatureRequestTypeLabel(data.request_type)}
              </p>
              {data.description && (
                <p className="mt-2 text-sm leading-relaxed text-gray-700">{data.description}</p>
              )}
            </div>

            {/* Signer info */}
            <dl className="space-y-2">
              <div className="flex justify-between text-sm">
                <dt className="text-gray-500">שם החותם</dt>
                <dd className="font-medium text-gray-900">{data.signer_name}</dd>
              </div>
              {data.expires_at && (
                <div className="flex justify-between text-sm">
                  <dt className="text-gray-500">תוקף הקישור</dt>
                  <dd className={`font-medium ${isExpired ? "text-red-600" : "text-gray-900"}`}>
                    {isExpired ? "פג תוקף" : formatDate(data.expires_at)}
                  </dd>
                </div>
              )}
            </dl>

            {/* Expired warning */}
            {isExpired && (
              <div className="flex gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                <p className="text-sm text-red-700">
                  קישור זה פג תוקפו. לא ניתן לחתום. פנה למשרד לחידוש הבקשה.
                </p>
              </div>
            )}

            {/* Disclaimer + Actions */}
            {!isExpired && (
              <>
                <div className="flex gap-2.5 rounded-xl border border-blue-100 bg-blue-50 p-3">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
                  <p className="text-xs leading-relaxed text-blue-700">
                    בלחיצה על "אני מאשר/ת וחותם/ת" הנך מאשר/ת את תוכן המסמך ומסכים/ה לחתימה
                    דיגיטלית מחייבת בהתאם לחוק חתימה אלקטרונית (התשס"א-2001).
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPageState("confirming_decline")}
                    className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
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
                    <CheckCircle2 className="h-4 w-4" />
                    אני מאשר/ת וחותם/ת
                  </Button>
                </div>
              </>
            )}
          </div>
        </Shell>
      )}

      {/* Confirm approve */}
      {effectiveState === "confirming_approve" && data && (
        <Shell>
          <div className="space-y-5">
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 className="h-7 w-7 text-green-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">אישור חתימה</h2>
              <p className="text-sm text-gray-500">
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
        </Shell>
      )}

      {/* Confirm decline */}
      {effectiveState === "confirming_decline" && data && (
        <Shell>
          <div className="space-y-4">
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
                <XCircle className="h-7 w-7 text-red-500" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">דחיית בקשה</h2>
              <p className="text-sm text-gray-500">
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
                variant="outline"
                size="md"
                isLoading={declineMutation.isPending}
                onClick={() => declineMutation.mutate()}
                className="flex-[2] border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
              >
                דחיית הבקשה
              </Button>
            </div>
          </div>
        </Shell>
      )}

      {/* Footer */}
      <p className="mt-8 text-center text-xs text-gray-400">
        מערכת ניהול משרד · חתימה מאובטחת ומוצפנת
      </p>
    </div>
  );
};
