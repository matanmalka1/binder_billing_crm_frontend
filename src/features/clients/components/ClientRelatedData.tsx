import { type FC } from "react";
import { ChevronRight, FolderOpen, Receipt } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import type { ClientBinderSummary, ClientChargeSummary } from "../types";
import { formatDate } from "../../../utils/utils";
import { getChargeStatusLabel } from "../../../utils/enums";

type ClientRelatedDataProps = {
  clientId: number;
  binders: ClientBinderSummary[];
  bindersTotal: number;
  charges: ClientChargeSummary[];
  chargesTotal: number;
  canViewCharges: boolean;
};

export const ClientRelatedData: FC<ClientRelatedDataProps> = ({
  clientId,
  binders,
  bindersTotal,
  charges,
  chargesTotal,
  canViewCharges,
}) => {
  return (
    <>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <Card>
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 rounded-lg p-3">
            <FolderOpen className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">{bindersTotal}</div>
            <div className="text-sm text-gray-600">קלסרים</div>
          </div>
        </div>
      </Card>
      {canViewCharges && (
        <Card>
          <div className="flex items-center gap-3">
            <div className="bg-green-100 rounded-lg p-3">
              <Receipt className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{chargesTotal}</div>
              <div className="text-sm text-gray-600">חיובים</div>
            </div>
          </div>
        </Card>
      )}
    </div>

    {binders.length > 0 && (
      <Card
        title="קלסרים אחרונים"
        footer={
          bindersTotal > 5 ? (
            <Link to={`/binders?client_id=${clientId}`} className="text-sm text-blue-600">
              צפה בכל הקלסרים ({bindersTotal})
            </Link>
          ) : undefined
        }
      >
        <div className="space-y-3">
          {binders.slice(0, 5).map((b) => (
            <div
              key={b.id}
              className="flex items-center justify-between rounded-lg border border-gray-200 p-3 hover:bg-gray-50"
            >
              <div>
                <div className="font-medium text-gray-900">{b.binder_number}</div>
                <div className="text-sm text-gray-600">נקלט: {formatDate(b.received_at)}</div>
              </div>
              <Link to={`/binders/${b.id}`}>
                <Button variant="ghost" size="sm" className="gap-1">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </Card>
    )}

    {canViewCharges && charges.length > 0 && (
      <Card
        title="חיובים אחרונים"
        footer={
          chargesTotal > 5 ? (
            <Link to={`/charges?client_id=${clientId}`} className="text-sm text-blue-600">
              צפה בכל החיובים ({chargesTotal})
            </Link>
          ) : undefined
        }
      >
        <div className="space-y-3">
          {charges.slice(0, 5).map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between rounded-lg border border-gray-200 p-3 hover:bg-gray-50"
            >
              <div>
                <div className="font-medium text-gray-900">חיוב #{c.id}</div>
                <div className="text-sm text-gray-600">
                  {c.charge_type} • {getChargeStatusLabel(c.status)}
                </div>
              </div>
              <Link to={`/charges/${c.id}`}>
                <Button variant="ghost" size="sm" className="gap-1">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </Card>
    )}
    </>
  );
};
