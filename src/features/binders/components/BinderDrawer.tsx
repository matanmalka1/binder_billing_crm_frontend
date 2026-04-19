import type { UseFormReturn } from "react-hook-form";
import { Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { DetailDrawer } from "../../../components/ui/overlays/DetailDrawer";
import { Button } from "../../../components/ui/primitives/Button";
import type { ReceiveBinderFormValues } from "../schemas";
import type { BinderResponse } from "../types";
import type { AnnualReportFull } from "@/features/annualReports";
import { BinderActionsPanel } from "./BinderActionsPanel";
import { BinderDetailsPanel } from "./BinderDetailsPanel";
import { BinderHistorySection } from "./BinderHistorySection";
import { BinderIntakesSection } from "./BinderIntakesSection";
import { BinderReceivePanel } from "./BinderReceivePanel";

type DrawerMode = "detail" | "receive";

interface BinderDrawerProps {
  open: boolean;
  mode: DrawerMode;
  binder?: BinderResponse | null;
  onClose: () => void;
  onMarkReady?: () => void;
  onRevertReady?: () => void;
  onReturn?: () => void;
  onBulkReady?: () => void;
  onOpenHandover?: () => void;
  onDelete?: () => void;
  actionLoading?: boolean;
  receiveForm?: UseFormReturn<ReceiveBinderFormValues>;
  clientQuery?: string;
  selectedClient?: { id: number; name: string; client_status?: string | null } | null;
  businesses?: { id: number; business_name: string | null }[];
  annualReports?: AnnualReportFull[];
  hasActiveBinder?: boolean;
  vatType?: "monthly" | "bimonthly" | "exempt" | null;
  onClientSelect?: (client: { id: number; name: string; id_number: string; client_status?: string | null }) => void;
  onClientQueryChange?: (query: string) => void;
  onReceiveSubmit?: (e?: React.BaseSyntheticEvent) => void;
  isSubmitting?: boolean;
}

export const BinderDrawer: React.FC<BinderDrawerProps> = ({
  open,
  mode,
  binder,
  onClose,
  onMarkReady,
  onRevertReady,
  onReturn,
  onBulkReady,
  onOpenHandover,
  onDelete,
  actionLoading = false,
  receiveForm,
  clientQuery = "",
  selectedClient = null,
  businesses = [],
  annualReports = [],
  hasActiveBinder = false,
  vatType = null,
  onClientSelect,
  onClientQueryChange,
  onReceiveSubmit,
  isSubmitting = false,
}) => {
  const title = mode === "receive" ? "קליטת חומר מלקוח" : binder ? `קלסר ${binder.binder_number}` : "";

  const subtitle =
    mode === "receive"
      ? undefined
      : binder
      ? (
          <div className="flex flex-col gap-0.5">
            <Link to={`/clients/${binder.client_id}`} className="text-sm text-primary-600 hover:underline">
              {binder.client_name ?? `לקוח #${binder.client_id}`}
            </Link>
            <span className="font-mono text-xs text-gray-500 tabular-nums">
              {binder.client_id_number ?? "—"}
            </span>
          </div>
        )
      : undefined;

  return (
    <DetailDrawer
      open={open}
      title={title}
      subtitle={subtitle}
      onClose={onClose}
      isDirty={mode === "receive" && (receiveForm?.formState.isDirty ?? false)}
      footer={
        mode === "detail" && binder && onDelete ? (
          <div className="flex justify-end">
            <Button variant="danger" size="sm" onClick={onDelete}>
              <Trash2 className="h-4 w-4 ml-1" />
              מחק קלסר
            </Button>
          </div>
        ) : undefined
      }
    >
      {mode === "receive" && receiveForm && (
        <BinderReceivePanel
          form={receiveForm}
          clientQuery={clientQuery}
          selectedClient={selectedClient}
          businesses={businesses}
          annualReports={annualReports}
          hasActiveBinder={hasActiveBinder}
          vatType={vatType}
          onClientSelect={onClientSelect!}
          onClientQueryChange={onClientQueryChange!}
          onSubmit={onReceiveSubmit!}
          onClose={onClose}
          isSubmitting={isSubmitting}
        />
      )}

      {mode === "detail" && !binder && (
        <div className="flex items-center justify-center py-12 text-sm text-gray-400">טוען...</div>
      )}

      {mode === "detail" && binder && (
        <>
          <BinderDetailsPanel binder={binder} />
          <BinderActionsPanel
            status={binder.status}
            disabled={actionLoading}
            onMarkReady={() => onMarkReady?.()}
            onRevertReady={() => onRevertReady?.()}
            onReturn={() => onReturn?.()}
            onBulkReady={onBulkReady ? () => onBulkReady() : undefined}
            onOpenHandover={onOpenHandover ? () => onOpenHandover() : undefined}
          />
          <BinderIntakesSection binderId={binder.id} clientId={binder.client_id} />
          <BinderHistorySection binderId={binder.id} />
        </>
      )}
    </DetailDrawer>
  );
};

BinderDrawer.displayName = "BinderDrawer";
