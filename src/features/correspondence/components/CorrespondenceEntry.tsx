import { Phone, Mail, FileText, Users } from "lucide-react";
import { Badge } from "../../../components/ui/Badge";
import type { CorrespondenceEntry as CorrespondenceEntryType } from "../../../api/correspondence.api";
import { formatDate } from "../../../utils/utils";

const typeConfig: Record<string, { label: string; icon: React.ReactNode; variant: "info" | "success" | "warning" | "neutral" }> = {
  call: { label: "שיחה", icon: <Phone className="h-4 w-4" />, variant: "info" },
  letter: { label: "מכתב", icon: <FileText className="h-4 w-4" />, variant: "neutral" },
  email: { label: "אימייל", icon: <Mail className="h-4 w-4" />, variant: "warning" },
  meeting: { label: "פגישה", icon: <Users className="h-4 w-4" />, variant: "success" },
};

interface Props { entry: CorrespondenceEntryType }

export const CorrespondenceEntryItem: React.FC<Props> = ({ entry }) => {
  const config = typeConfig[entry.correspondence_type] ?? typeConfig.call;

  return (
    <div className="flex gap-4 py-3 border-b border-gray-100 last:border-0">
      <div className="shrink-0 mt-1">
        <Badge variant={config.variant} className="gap-1 flex items-center">
          {config.icon}
          {config.label}
        </Badge>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900">{entry.subject}</p>
        {entry.notes && <p className="text-sm text-gray-500 mt-0.5 truncate">{entry.notes}</p>}
      </div>
      <div className="shrink-0 text-xs text-gray-400">
        {formatDate(entry.occurred_at)}
      </div>
    </div>
  );
};
