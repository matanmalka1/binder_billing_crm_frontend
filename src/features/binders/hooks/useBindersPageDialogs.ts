import { useState } from "react";
import type { BinderResponse } from "../types";

interface UseBindersPageDialogsParams {
  markReadyBulk: (clientId: number, untilPeriodYear: number, untilPeriodMonth: number) => Promise<unknown>;
  returnBinder: (binderId: number, pickupPersonName: string) => Promise<unknown>;
  deleteBinder: (binderId: number) => Promise<unknown>;
  handoverBinders: (
    clientId: number,
    binderIds: number[],
    receivedByName: string,
    handedOverAt: string,
    untilPeriodYear: number,
    untilPeriodMonth: number,
    notes?: string | null,
  ) => Promise<unknown>;
}

export const useBindersPageDialogs = ({
  markReadyBulk,
  returnBinder,
  deleteBinder,
  handoverBinders,
}: UseBindersPageDialogsParams) => {
  const [confirmDeleteForId, setConfirmDeleteForId] = useState<number | null>(null);
  const [confirmReturnForId, setConfirmReturnForId] = useState<number | null>(null);
  const [pickupPersonName, setPickupPersonName] = useState("");
  const [bulkReadyOpen, setBulkReadyOpen] = useState(false);
  const [handoverOpen, setHandoverOpen] = useState(false);
  const [bulkReadyYear, setBulkReadyYear] = useState(new Date().getFullYear());
  const [bulkReadyMonth, setBulkReadyMonth] = useState(new Date().getMonth() + 1);

  const openDeleteDialog = (binderId: number) => setConfirmDeleteForId(binderId);
  const closeDeleteDialog = () => setConfirmDeleteForId(null);

  const openReturnDialog = (binderId: number) => setConfirmReturnForId(binderId);
  const closeReturnDialog = () => {
    setConfirmReturnForId(null);
    setPickupPersonName("");
  };

  const openBulkReadyDialog = () => setBulkReadyOpen(true);
  const closeBulkReadyDialog = () => setBulkReadyOpen(false);

  const openHandoverDialog = () => setHandoverOpen(true);
  const closeHandoverDialog = () => setHandoverOpen(false);

  const confirmReturn = async () => {
    if (confirmReturnForId === null) return;
    await returnBinder(confirmReturnForId, pickupPersonName);
    closeReturnDialog();
  };

  const confirmDelete = async () => {
    if (confirmDeleteForId === null) return;
    await deleteBinder(confirmDeleteForId);
    closeDeleteDialog();
  };

  const confirmBulkReady = async (selectedBinder: BinderResponse | null) => {
    if (!selectedBinder) return;
    await markReadyBulk(selectedBinder.client_id, bulkReadyYear, bulkReadyMonth);
    closeBulkReadyDialog();
  };

  const submitHandover = async (
    selectedBinder: BinderResponse | null,
    payload: {
      binderIds: number[];
      receivedByName: string;
      handedOverAt: string;
      untilPeriodYear: number;
      untilPeriodMonth: number;
      notes: string | null;
    },
  ) => {
    if (!selectedBinder) return;
    await handoverBinders(
      selectedBinder.client_id,
      payload.binderIds,
      payload.receivedByName,
      payload.handedOverAt,
      payload.untilPeriodYear,
      payload.untilPeriodMonth,
      payload.notes,
    );
    closeHandoverDialog();
  };

  return {
    bulkReadyMonth,
    bulkReadyOpen,
    bulkReadyYear,
    closeBulkReadyDialog,
    closeDeleteDialog,
    closeHandoverDialog,
    closeReturnDialog,
    confirmBulkReady,
    confirmDelete,
    confirmDeleteForId,
    confirmReturn,
    confirmReturnForId,
    handoverOpen,
    openBulkReadyDialog,
    openDeleteDialog,
    openHandoverDialog,
    openReturnDialog,
    pickupPersonName,
    setBulkReadyMonth,
    setBulkReadyYear,
    setPickupPersonName,
    submitHandover,
  };
};
