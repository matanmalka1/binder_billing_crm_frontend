import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Pencil, Plus, Snowflake, Trash2, Undo2 } from "lucide-react";
import { Button } from "../../../components/ui/primitives/Button";
import { StatusBadge } from "../../../components/ui/primitives/StatusBadge";
import { DropdownMenu, DropdownMenuItem } from "../../../components/ui/overlays/DropdownMenu";
import { ConfirmDialog } from "../../../components/ui/overlays/ConfirmDialog";
import { Modal } from "../../../components/ui/overlays/Modal";
import { ModalFormActions } from "../../../components/ui/overlays/ModalFormActions";
import { Input } from "../../../components/ui/inputs/Input";
import { clientsApi, clientsQK } from "../api";
import type { BusinessResponse, UpdateBusinessPayload } from "../api";
import { BUSINESS_STATUS_LABELS } from "../constants";
import { CLIENT_ROUTES } from "../api/endpoints";
import { formatDate } from "@/utils/utils";
import { useBusinessActions } from "../hooks/useBusinessActions";

const BUSINESS_STATUS_VARIANTS: Record<string, "success" | "warning" | "error" | "info" | "neutral"> = {
  active: "success",
  frozen: "warning",
  closed: "neutral",
};


interface Props {
  clientId: number;
  canEdit: boolean;
  onAddBusiness: () => void;
}

interface EditState {
  business: BusinessResponse;
  name: string;
  notes: string;
  status: BusinessResponse["status"];
  closedAt: string;
}

export const ClientBusinessesCard: React.FC<Props> = ({ clientId, canEdit, onAddBusiness }) => {
  const { data, isLoading } = useQuery({
    queryKey: clientsQK.businessesAll(clientId),
    queryFn: () => clientsApi.listAllBusinessesForClient(clientId),
    enabled: clientId > 0,
  });

  const { updateBusiness, isUpdating, deleteBusiness, isDeleting } = useBusinessActions(clientId);

  const [editState, setEditState] = useState<EditState | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<BusinessResponse | null>(null);

  const businesses = data?.items ?? [];

  const openEdit = (biz: BusinessResponse) =>
    setEditState({
      business: biz,
      name: biz.business_name ?? "",
      notes: biz.notes ?? "",
      status: biz.status,
      closedAt: biz.closed_at ?? "",
    });

  const submitEdit = async () => {
    if (!editState) return;
    const payload: UpdateBusinessPayload = {
      business_name: editState.name || null,
      notes: editState.notes || null,
      status: editState.status,
      closed_at: editState.status === "closed" ? editState.closedAt || null : null,
    };
    await updateBusiness(editState.business.id, payload);
    setEditState(null);
  };

  const updateBusinessStatus = (businessId: number, status: BusinessResponse["status"], closedAt?: string) =>
    updateBusiness(businessId, {
      status,
      closed_at: status === "closed" ? closedAt ?? new Date().toISOString().slice(0, 10) : null,
    });

  return (
    <>
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-800">עסקים</h3>
          {canEdit && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onAddBusiness}
              className="text-xs text-primary-600 hover:bg-primary-50 px-2 py-1"
            >
              <Plus className="h-3.5 w-3.5" />
              הוסף עסק
            </Button>
          )}
        </div>

        {isLoading ? (
          <p className="text-xs text-gray-400">טוען...</p>
        ) : businesses.length === 0 ? (
          <p className="text-xs text-gray-400">אין עסקים רשומים</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {businesses.map((biz) => {
              return (
                <li key={biz.id} className="flex items-start gap-2 py-2">
                  <div className="min-w-0 flex-1">
                    <Link
                      to={CLIENT_ROUTES.businessDetail(clientId, biz.id)}
                      className="flex min-w-0 items-center justify-between rounded-lg px-1 hover:bg-gray-50 transition-colors"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-gray-900">
                          {biz.business_name ?? "—"}
                        </p>
                        <p className="text-xs text-gray-500">
                          נפתח בתאריך {formatDate(biz.opened_at)}
                        </p>
                      </div>
                      <StatusBadge
                        status={biz.status}
                        getLabel={(s) => BUSINESS_STATUS_LABELS[s as keyof typeof BUSINESS_STATUS_LABELS] ?? s}
                        variantMap={BUSINESS_STATUS_VARIANTS}
                      />
                    </Link>
                  </div>

                  {canEdit && (
                    <div onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu ariaLabel={`פעולות לעסק ${biz.business_name ?? biz.id}`}>
                        <DropdownMenuItem
                          label="עריכה"
                          icon={<Pencil className="h-4 w-4" />}
                          onClick={() => openEdit(biz)}
                        />
                        {biz.status !== "active" && (
                          <DropdownMenuItem
                            label="העבר לפעיל"
                            icon={<Undo2 className="h-4 w-4" />}
                            onClick={() => void updateBusinessStatus(biz.id, "active")}
                          />
                        )}
                        {biz.status !== "frozen" && (
                          <DropdownMenuItem
                            label="הקפא עסק"
                            icon={<Snowflake className="h-4 w-4" />}
                            onClick={() => void updateBusinessStatus(biz.id, "frozen")}
                          />
                        )}
                        {biz.status !== "closed" && (
                          <DropdownMenuItem
                            label="סגור עסק"
                            icon={<Trash2 className="h-4 w-4" />}
                            onClick={() => void updateBusinessStatus(biz.id, "closed")}
                          />
                        )}
                        <DropdownMenuItem
                          label="מחק"
                          icon={<Trash2 className="h-4 w-4" />}
                          danger
                          onClick={() => setDeleteTarget(biz)}
                        />
                      </DropdownMenu>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Edit modal */}
      <Modal
        open={!!editState}
        title="עריכת עסק"
        onClose={() => setEditState(null)}
        footer={
          <ModalFormActions
            onCancel={() => setEditState(null)}
            onSubmit={submitEdit}
            isLoading={isUpdating}
            submitLabel="שמור"
          />
        }
      >
        {editState && (
          <div className="space-y-4">
            <Input
              label="שם עסק"
              value={editState.name}
              onChange={(e) => setEditState((s) => s && { ...s, name: e.target.value })}
              disabled={isUpdating}
            />
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500">סטטוס</label>
              <select
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 disabled:bg-gray-50 disabled:text-gray-500"
                value={editState.status}
                onChange={(e) =>
                  setEditState((s) =>
                    s
                      ? {
                          ...s,
                          status: e.target.value as BusinessResponse["status"],
                          closedAt:
                            e.target.value === "closed"
                              ? s.closedAt || new Date().toISOString().slice(0, 10)
                              : "",
                        }
                      : s,
                  )
                }
                disabled={isUpdating}
              >
                <option value="active">פעיל</option>
                <option value="frozen">מוקפא</option>
                <option value="closed">סגור</option>
              </select>
            </div>
            {editState.status === "closed" && (
              <Input
                label="תאריך סגירה"
                type="date"
                value={editState.closedAt}
                onChange={(e) => setEditState((s) => s && { ...s, closedAt: e.target.value })}
                disabled={isUpdating}
              />
            )}
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500">הערות</label>
              <textarea
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 disabled:bg-gray-50 disabled:text-gray-500"
                rows={3}
                placeholder="הערות חופשיות..."
                disabled={isUpdating}
                value={editState.notes}
                onChange={(e) => setEditState((s) => s && { ...s, notes: e.target.value })}
              />
            </div>
          </div>
        )}
      </Modal>

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="מחיקת עסק"
        message={`האם למחוק את העסק "${deleteTarget?.business_name ?? ""}"? פעולה זו אינה ניתנת לביטול.`}
        confirmLabel="מחק"
        cancelLabel="ביטול"
        isLoading={isDeleting}
        onConfirm={() => {
          if (deleteTarget) deleteBusiness(deleteTarget.id);
          setDeleteTarget(null);
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
};
