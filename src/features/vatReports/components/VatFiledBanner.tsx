import { CheckCircle2 } from "lucide-react";
import { formatDateTime } from "../../../utils/utils";

const FILING_METHOD_LABELS: Record<string, string> = {
  manual: "ידנית",
  online: "אונליין",
};

interface VatFiledBannerProps {
  filedAt: string;
  filedByName?: string | null;
  filedBy?: number | null;
  filingMethod?: string | null;
}

export const VatFiledBanner: React.FC<VatFiledBannerProps> = ({
  filedAt,
  filedByName,
  filedBy,
  filingMethod,
}) => {
  const methodLabel = filingMethod ? FILING_METHOD_LABELS[filingMethod] : null;
  const byLabel = filedByName ?? (filedBy != null ? `#${filedBy}` : null);

  return (
    <div
      className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-3"
      dir="rtl"
    >
      <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
      <p className="text-sm font-medium text-emerald-800">
        הדוח הוגש ב‑{formatDateTime(filedAt)}
        {byLabel && (
          <span className="font-normal text-emerald-700"> על ידי {byLabel}</span>
        )}
        {methodLabel && (
          <span className="font-normal text-emerald-600"> · {methodLabel}</span>
        )}
      </p>
    </div>
  );
};

VatFiledBanner.displayName = "VatFiledBanner";
