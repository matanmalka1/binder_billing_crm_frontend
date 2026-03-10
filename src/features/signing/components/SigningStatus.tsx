import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import type { SignatureRequestStatus } from "../../../api/signatureRequests.api";
import type { SigningTerminalState } from "../types";

interface StatusIllustrationProps {
  icon: React.ReactNode;
  bg: string;
  title: string;
  body: string;
}

const StatusIllustration: React.FC<StatusIllustrationProps> = ({
  icon,
  bg,
  title,
  body,
}) => (
  <div className="flex flex-col items-center gap-3 py-6 text-center">
    <div className={`flex h-16 w-16 items-center justify-center rounded-full ${bg}`}>
      {icon}
    </div>
    <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
    <p className="max-w-xs text-sm text-gray-500">{body}</p>
  </div>
);

interface SigningStatusProps {
  state: SigningTerminalState;
  status?: SignatureRequestStatus;
  title?: string;
  body?: string;
}

export const SigningStatus: React.FC<SigningStatusProps> = ({
  state,
  status,
  title,
  body,
}) => {
  if (state === "loading") {
    return (
      <div className="flex flex-col items-center gap-3 py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
        <p className="text-sm text-gray-500">טוען מסמך...</p>
      </div>
    );
  }

  if (state === "signed") {
    return (
      <StatusIllustration
        icon={<CheckCircle2 className="h-8 w-8 text-green-600" />}
        bg="bg-green-100"
        title={title ?? "המסמך נחתם בהצלחה"}
        body={body ?? "תודה! חתימתך נקלטה במערכת."}
      />
    );
  }

  if (state === "declined") {
    return (
      <StatusIllustration
        icon={<XCircle className="h-8 w-8 text-gray-500" />}
        bg="bg-gray-100"
        title={title ?? "הבקשה נדחתה"}
        body={body ?? "דחית את בקשת החתימה. פנה למשרד לפרטים נוספים."}
      />
    );
  }

  return (
    <StatusIllustration
      icon={<AlertTriangle className="h-8 w-8 text-red-500" />}
      bg="bg-red-100"
      title={
        title ??
        (status === "expired" ? "הקישור פג תוקף" : "בקשה לא זמינה")
      }
      body={
        body ??
        (status === "expired"
          ? "קישור זה לחתימה פג תוקפו. פנה למשרד לקבלת קישור חדש."
          : "הקישור שגוי, בוטל, או שאירעה שגיאה. פנה למשרד לבירור.")
      }
    />
  );
};
