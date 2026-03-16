import { Link } from "react-router-dom";
import { DetailDrawer } from "../../../components/ui/DetailDrawer";
import type { BinderResponse } from "../types";
import type { UseFormReturn } from "react-hook-form";
import type { ReceiveBinderFormValues } from "../schemas";
import { BinderDetailsPanel } from "./BinderDetailsPanel";
import { BinderActionsPanel } from "./BinderActionsPanel";
import { BinderReceivePanel } from "./BinderReceivePanel";
import { BinderHistorySection } from "./BinderHistorySection";
import { BinderIntakesSection } from "./BinderIntakesSection";

/* ─── Main drawer ────────────────────────────────────────────── */

type DrawerMode = "detail" | "receive";

interface BinderDrawerProps {
  open: boolean;
  mode: DrawerMode;
  binder?: BinderResponse | null;
  onClose: () => void;
  onMarkReady?: () => void;
  actionLoading?: boolean;
  receiveForm?: UseFormReturn<ReceiveBinderFormValues>;
  clientQuery?: string;
  selectedClient?: { id: number; name: string } | null;
  activeBinder?: BinderResponse | null;
  onClientSelect?: (client: { id: number; name: string; id_number: string }) => void;
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
  actionLoading = false,
  receiveForm,
  clientQuery = "",
  selectedClient = null,
  activeBinder = null,
  onClientSelect,
  onClientQueryChange,
  onReceiveSubmit,
  isSubmitting = false,
}) => {
  const title =
    mode === "receive"
      ? "קליטת חומר מלקוח"
      : binder
      ? `קלסר ${binder.binder_number}`
      : "";

  const subtitle =
    mode === "receive"
      ? undefined
      : binder
      ? (
          <Link
            to={`/clients/${binder.client_id}`}
            className="text-sm text-primary-600 hover:underline"
          >
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
          activeBinder={activeBinder}
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
          />
          <BinderIntakesSection binderId={binder.id} binderType={binder.binder_type} />
          <BinderHistorySection binderId={binder.id} />
        </>
      )}
    </DetailDrawer>
  );
};
BinderDrawer.displayName = "BinderDrawer";
