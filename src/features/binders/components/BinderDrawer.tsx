import { Link } from "react-router-dom";
import { DetailDrawer } from "../../../components/ui/DetailDrawer";
import type { BinderResponse } from "../types";
import type { UseFormReturn } from "react-hook-form";
import type { ReceiveBinderFormValues } from "../schemas";
import type { ActionCommand } from "../../../lib/actions/types";
import { BinderDetailsPanel } from "./BinderDetailsPanel";
import { BinderActionsPanel } from "./BinderActionsPanel";
import { BinderReceivePanel } from "./BinderReceivePanel";
import { BinderHistorySection } from "./BinderHistorySection";

/* ─── Main drawer ────────────────────────────────────────────── */

type DrawerMode = "detail" | "receive";

interface BinderDrawerProps {
  open: boolean;
  mode: DrawerMode;
  binder?: BinderResponse | null;
  onClose: () => void;
  onAction?: (action: ActionCommand) => void;
  activeActionKeyRef?: React.RefObject<string | null>;
  receiveForm?: UseFormReturn<ReceiveBinderFormValues>;
  clientQuery?: string;
  selectedClient?: { id: number; name: string } | null;
  onClientSelect?: (client: { id: number; name: string; id_number: string }) => void;
  onClientQueryChange?: (query: string) => void;
  onReceiveSubmit?: (e?: React.BaseSyntheticEvent) => void;
  isSubmitting?: boolean;
  onDelete?: () => void;
  isDeleting?: boolean;
}

const NOOP_REF = { current: null } as React.RefObject<string | null>;
const NOOP_ACTION = () => {};

export const BinderDrawer: React.FC<BinderDrawerProps> = ({
  open,
  mode,
  binder,
  onClose,
  onAction = NOOP_ACTION,
  activeActionKeyRef = NOOP_REF,
  receiveForm,
  clientQuery = "",
  selectedClient = null,
  onClientSelect,
  onClientQueryChange,
  onReceiveSubmit,
  isSubmitting = false,
  onDelete,
  isDeleting = false,
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
          onClientSelect={onClientSelect!}
          onClientQueryChange={onClientQueryChange!}
          onSubmit={onReceiveSubmit!}
          onClose={onClose}
          isSubmitting={isSubmitting}
        />
      )}

      {mode === "detail" && binder && (
        <>
          <BinderDetailsPanel binder={binder} />
          <BinderActionsPanel
            binder={binder}
            activeActionKeyRef={activeActionKeyRef}
            onAction={onAction}
            onDelete={onDelete}
            isDeleting={isDeleting}
          />
          <BinderHistorySection binderId={binder.id} />
        </>
      )}
    </DetailDrawer>
  );
};
BinderDrawer.displayName = "BinderDrawer";
