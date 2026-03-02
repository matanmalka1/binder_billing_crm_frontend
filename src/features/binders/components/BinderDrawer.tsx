import { Link } from "react-router-dom";
import { DetailDrawer, DrawerField, DrawerSection } from "../../../components/ui/DetailDrawer";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { ClientSearchInput } from "./ClientSearchInput";
import type { BinderResponse } from "../../../api/binders.types";
import type { UseFormReturn } from "react-hook-form";
import type { ReceiveBinderFormValues } from "../schemas";
import type { ActionCommand, BackendAction } from "../../../lib/actions/types";
import { mapActions } from "../../../lib/actions/mapActions";
import {
  getStatusLabel,
  getWorkStateLabel,
  getSignalLabel,
  getBinderTypeLabel,
} from "../../../utils/enums";
import { formatDate, cn } from "../../../utils/utils";
import { BINDER_WORK_STATE_VARIANTS, BINDER_SIGNAL_VARIANTS, BINDER_TYPE_OPTIONS } from "../types";

/* ─── Detail mode ────────────────────────────────────────────── */

interface DetailContentProps {
  binder: BinderResponse;
  activeActionKeyRef: React.RefObject<string | null>;
  onAction: (action: ActionCommand) => void;
}

const DetailContent: React.FC<DetailContentProps> = ({ binder, activeActionKeyRef, onAction }) => {
  const actions = mapActions(binder.available_actions as BackendAction[] | null | undefined);
  const action = actions[0] ?? null;

  const actionButton = (() => {
    if (binder.status === "ready_for_pickup" && action) {
      return (
        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={() => onAction(action)}
          isLoading={activeActionKeyRef.current === action.uiKey}
          disabled={activeActionKeyRef.current !== null && activeActionKeyRef.current !== action.uiKey}
        >
          החזרת קלסר
        </Button>
      );
    }
    if (binder.status === "in_office" && binder.work_state === "in_progress" && action) {
      return (
        <Button
          type="button"
          size="sm"
          onClick={() => onAction(action)}
          isLoading={activeActionKeyRef.current === action.uiKey}
          disabled={activeActionKeyRef.current !== null && activeActionKeyRef.current !== action.uiKey}
          className="bg-green-600 text-white hover:bg-green-700 active:bg-green-800 shadow-sm"
        >
          סיום טיפול
        </Button>
      );
    }
    return null;
  })();

  return (
    <>
      <DrawerSection title="פרטי קלסר">
        <DrawerField label="מספר קלסר" value={binder.binder_number} />
        <DrawerField label="סוג חומר" value={getBinderTypeLabel(binder.binder_type)} />
        <DrawerField label="סטטוס" value={getStatusLabel(binder.status)} />
        <DrawerField label="תאריך קבלה" value={formatDate(binder.received_at)} />
        {binder.returned_at && (
          <DrawerField label="תאריך החזרה" value={formatDate(binder.returned_at)} />
        )}
        {binder.pickup_person_name && (
          <DrawerField label="נאסף על ידי" value={binder.pickup_person_name} />
        )}
        <DrawerField
          label="מצב עבודה"
          value={
            <Badge variant={BINDER_WORK_STATE_VARIANTS[binder.work_state ?? ""] ?? "neutral"}>
              {getWorkStateLabel(binder.work_state ?? "")}
            </Badge>
          }
        />
        <DrawerField
          label="ימים במשרד"
          value={
            binder.days_in_office != null ? (
              <span
                className={cn(
                  "font-mono font-semibold",
                  binder.days_in_office > 90
                    ? "text-red-700"
                    : binder.days_in_office > 60
                    ? "text-orange-600"
                    : "text-gray-900",
                )}
              >
                {binder.days_in_office}
              </span>
            ) : (
              "—"
            )
          }
        />
      </DrawerSection>

      {Array.isArray(binder.signals) && binder.signals.length > 0 && (
        <DrawerSection title="אותות">
          <div className="flex flex-wrap gap-1.5 py-3">
            {binder.signals.map((signal) => (
              <Badge key={signal} variant={BINDER_SIGNAL_VARIANTS[signal] ?? "neutral"}>
                {getSignalLabel(signal)}
              </Badge>
            ))}
          </div>
        </DrawerSection>
      )}

      {actionButton && (
        <div className="pt-2">
          {actionButton}
        </div>
      )}
    </>
  );
};
DetailContent.displayName = "DetailContent";

/* ─── Receive mode ───────────────────────────────────────────── */

interface ReceiveContentProps {
  form: UseFormReturn<ReceiveBinderFormValues>;
  clientQuery: string;
  selectedClient: { id: number; name: string } | null;
  onClientSelect: (client: { id: number; name: string; id_number: string }) => void;
  onClientQueryChange: (query: string) => void;
  onSubmit: (e?: React.BaseSyntheticEvent) => void;
  onClose: () => void;
  isSubmitting: boolean;
}

const ReceiveContent: React.FC<ReceiveContentProps> = ({
  form,
  clientQuery,
  selectedClient,
  onClientSelect,
  onClientQueryChange,
  onSubmit,
  onClose,
  isSubmitting,
}) => {
  const { register, formState: { errors } } = form;

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <ClientSearchInput
        value={clientQuery}
        onChange={onClientQueryChange}
        onSelect={onClientSelect}
        error={
          errors.client_id?.message ??
          (!selectedClient && clientQuery.length > 0 ? "נא לבחור לקוח מהרשימה" : undefined)
        }
      />

      {selectedClient && (
        <p className="text-xs text-green-700 font-medium -mt-2">
          ✓ נבחר: {selectedClient.name} (#{selectedClient.id})
        </p>
      )}

      <Select
        label="סוג חומר"
        error={errors.binder_type?.message}
        options={[...BINDER_TYPE_OPTIONS]}
        {...register("binder_type")}
      />

      <Input
        label="מספר קלסר"
        error={errors.binder_number?.message}
        placeholder="לדוגמה: 2024-003"
        {...register("binder_number")}
      />

      <Input
        type="date"
        label="תאריך קבלה"
        error={errors.received_at?.message}
        {...register("received_at")}
      />

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="ghost" onClick={onClose}>
          ביטול
        </Button>
        <Button type="button" variant="secondary" onClick={onSubmit} isLoading={isSubmitting}>
          קליטה
        </Button>
      </div>
    </form>
  );
};
ReceiveContent.displayName = "ReceiveContent";

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
        <ReceiveContent
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
        <DetailContent
          binder={binder}
          activeActionKeyRef={activeActionKeyRef}
          onAction={onAction}
        />
      )}
    </DetailDrawer>
  );
};
BinderDrawer.displayName = "BinderDrawer";
