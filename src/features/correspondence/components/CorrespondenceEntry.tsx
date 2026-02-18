import { Phone, Mail, FileText, Users } from "lucide-react";
import { Badge } from "../../../components/ui/Badge";
import type { CorrespondenceEntry as CorrespondenceEntryType } from "../../../api/correspondence.api";
import { formatDate } from "../../../utils/utils";

/* ─── Type config map ────────────────────────────────────────── */

interface TypeConfig {
  label: string;
  icon: React.ReactNode;
  variant: "info" | "success" | "warning" | "neutral";
  dotColor: string;
}

const TYPE_CONFIG: Record<string, TypeConfig> = {
  call: {
    label: "שיחה",
    icon: <Phone className="h-3.5 w-3.5" />,
    variant: "info",
    dotColor: "bg-blue-500",
  },
  letter: {
    label: "מכתב",
    icon: <FileText className="h-3.5 w-3.5" />,
    variant: "neutral",
    dotColor: "bg-gray-400",
  },
  email: {
    label: "אימייל",
    icon: <Mail className="h-3.5 w-3.5" />,
    variant: "warning",
    dotColor: "bg-orange-400",
  },
  meeting: {
    label: "פגישה",
    icon: <Users className="h-3.5 w-3.5" />,
    variant: "success",
    dotColor: "bg-green-500",
  },
};

const DEFAULT_CONFIG: TypeConfig = TYPE_CONFIG.call;

/* ─── Component ──────────────────────────────────────────────── */

interface CorrespondenceEntryItemProps {
  entry: CorrespondenceEntryType;
}

export const CorrespondenceEntryItem = ({ entry }: CorrespondenceEntryItemProps) => {
  const config = TYPE_CONFIG[entry.correspondence_type] ?? DEFAULT_CONFIG;

  return (
    <li className="flex gap-4 py-3 pl-2">
      {/* Timeline dot — sits over the vertical line rendered by parent */}
      <div className="relative shrink-0 pt-0.5">
        <div
          className={`h-4 w-4 rounded-full border-2 border-white shadow-sm ${config.dotColor}`}
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Badge variant={config.variant} className="inline-flex items-center gap-1 shrink-0">
              {config.icon}
              {config.label}
            </Badge>
            <p className="truncate text-sm font-semibold text-gray-900">
              {entry.subject}
            </p>
          </div>
          <time className="shrink-0 text-xs text-gray-400 tabular-nums">
            {formatDate(entry.occurred_at)}
          </time>
        </div>

        {entry.notes && (
          <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
            {entry.notes}
          </p>
        )}
      </div>
    </li>
  );
};

CorrespondenceEntryItem.displayName = "CorrespondenceEntryItem";
