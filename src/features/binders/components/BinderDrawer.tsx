import type { UseFormReturn } from "react-hook-form";
import { Link } from "react-router-dom";
import { DetailDrawer } from "../../../components/ui/DetailDrawer";
import type { ReceiveBinderFormValues } from "../schemas";
import type { BinderResponse } from "../types";
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
  actionLoading?: boolean;
  receiveForm?: UseFormReturn<ReceiveBinderFormValues>;
  clientQuery?: string;
  selectedClient?: { id: number; name: string; client_status?: string | null } | null;
  businesses?: { id: number; business_name: string | null; business_type: string }[];
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
  actionLoading = false,
  receiveForm,
  clientQuery = "",
  selectedClient = null,
  businesses = [],
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
          <Link to={`/clients/${binder.client_id}`} className="text-sm text-primary-600 hover:underline">
            {binder.client_name ?? `לקוח #${binder.client_id}`}
          </Link>
        )
      : undefined;

  return (
    <DetailDrawer
      open={open}
      title={title}
      subtitle={subtitle}
      onClose={onClose}
      isDirty={mode === "receive" && (receiveForm?.formState.isDirty ?? false)}
    >
      {mode === "receive" && receiveForm && (
        <BinderReceivePanel
          form={receiveForm}
          clientQuery={clientQuery}
          selectedClient={selectedClient}
          businesses={businesses}
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
          />
          <BinderIntakesSection binderId={binder.id} binderType={binder.binder_type} />
          <BinderHistorySection binderId={binder.id} />
        </>
      )}
    </DetailDrawer>
  );
};

BinderDrawer.displayName = "BinderDrawer";
