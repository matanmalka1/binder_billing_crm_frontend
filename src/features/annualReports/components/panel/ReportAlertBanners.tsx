import { AlertTriangle, CheckCircle, Info, XCircle, Send } from "lucide-react";
import { Button } from "../../../../components/ui/primitives/Button";
import { cn } from "../../../../utils/utils";
import type { AnnualReportDetail } from "../../types";

interface Props {
  report: AnnualReportDetail;
  advances?: { balance_type: "due" | "refund" | "zero"; final_balance: number };
}

interface BannerItem {
  variant: "error" | "warning" | "info" | "success";
  icon: React.ReactNode;
  message: string;
  cta?: { label: string; onClick: () => void };
}

const VARIANT_STYLES = {
  error: "bg-red-50 border-red-200 text-red-800",
  warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
  info: "bg-blue-50 border-blue-200 text-blue-800",
  success: "bg-green-50 border-green-200 text-green-800",
};

const ICON_STYLES = {
  error: "text-red-500",
  warning: "text-yellow-500",
  info: "text-blue-500",
  success: "text-green-500",
};

const Banner: React.FC<BannerItem> = ({ variant, icon, message, cta }) => (
  <div
    className={cn(
      "flex items-start justify-between gap-3 rounded-lg border px-4 py-3",
      VARIANT_STYLES[variant],
    )}
  >
    <div className="flex items-start gap-2">
      <span className={cn("mt-0.5 shrink-0", ICON_STYLES[variant])}>{icon}</span>
      <p className="text-sm leading-snug">{message}</p>
    </div>
    {cta && (
      <Button
        variant="outline"
        size="sm"
        onClick={cta.onClick}
        className="shrink-0 gap-1.5 text-xs"
      >
        <Send className="h-3 w-3" />
        {cta.label}
      </Button>
    )}
  </div>
);

export const ReportAlertBanners: React.FC<Props> = ({ report, advances }) => {
  const banners: BannerItem[] = [];

  // Balance due alert
  if (advances?.balance_type === "due" && advances.final_balance > 0) {
    const formatted = advances.final_balance.toLocaleString("he-IL", {
      style: "currency",
      currency: "ILS",
      maximumFractionDigits: 0,
    });
    banners.push({
      variant: "error",
      icon: <XCircle className="h-4 w-4" />,
      message: `יתרת מס לתשלום — ${formatted}. לאחר קיזוז מקדמות ששולמו.`,
      cta: { label: "שלח הודעה", onClick: () => {} },
    });
  }

  // Deadline warning
  const now = new Date();
  if (report.filing_deadline) {
    const deadline = new Date(report.filing_deadline);
    const daysLeft = Math.ceil(
      (deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (daysLeft > 0 && daysLeft <= 60) {
      banners.push({
        variant: "warning",
        icon: <AlertTriangle className="h-4 w-4" />,
        message: `מועד הגשת הדוח לשנת מס ${report.tax_year} הוא ${deadline.toLocaleDateString("he-IL")} — נותרו ${daysLeft} ימים.`,
      });
    } else if (daysLeft < 0) {
      banners.push({
        variant: "error",
        icon: <XCircle className="h-4 w-4" />,
        message: `מועד הגשת הדוח לשנת מס ${report.tax_year} חלף לפני ${Math.abs(daysLeft)} ימים.`,
      });
    }
  }

  // Submitted info
  if (report.status === "submitted" && report.submitted_at) {
    const d = new Date(report.submitted_at).toLocaleDateString("he-IL");
    banners.push({
      variant: "info",
      icon: <Info className="h-4 w-4" />,
      message: `הדוח הוגש ב-${d} ממתין לאישור רשות המסים.`,
    });
  }

  // Accepted / completed
  if (report.status === "accepted" || report.status === "closed") {
    banners.push({
      variant: "success",
      icon: <CheckCircle className="h-4 w-4" />,
      message: `דוח שנת מס ${report.tax_year} אושר וסגור בהצלחה.`,
    });
  }

  // Refund
  if (advances?.balance_type === "refund" && advances.final_balance < 0) {
    const formatted = Math.abs(advances.final_balance).toLocaleString("he-IL", {
      style: "currency",
      currency: "ILS",
      maximumFractionDigits: 0,
    });
    banners.push({
      variant: "success",
      icon: <CheckCircle className="h-4 w-4" />,
      message: `צפוי החזר מס בסך ${formatted} לשנת מס ${report.tax_year}.`,
    });
  }

  if (banners.length === 0) return null;

  return (
    <div className="space-y-2">
      {banners.map((b, i) => (
        <Banner key={i} {...b} />
      ))}
    </div>
  );
};
