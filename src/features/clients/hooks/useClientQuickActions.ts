import { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { chargesApi, chargesQK, type CreateChargePayload } from "@/features/charges/api";
import { bindersQK } from "@/features/binders/api";
import { useReceiveBinderDrawer } from "@/features/binders";
import { toast } from "@/utils/toast";
import { showErrorToast } from "@/utils/utils";

export const useClientQuickActions = (client: { id: number; name: string }) => {
  const queryClient = useQueryClient();
  const [showCreateCharge, setShowCreateCharge] = useState(false);
  const [showReceiveBinder, setShowReceiveBinder] = useState(false);

  const createChargeMutation = useMutation({
    mutationFn: (payload: CreateChargePayload) => chargesApi.create(payload),
    onSuccess: async () => {
      toast.success("חיוב נוצר בהצלחה");
      await queryClient.invalidateQueries({ queryKey: chargesQK.all });
      setShowCreateCharge(false);
    },
    onError: (err) => showErrorToast(err, "שגיאה ביצירת חיוב"),
  });

  const submitCreateCharge = async (payload: CreateChargePayload): Promise<boolean> => {
    try {
      await createChargeMutation.mutateAsync(payload);
      return true;
    } catch {
      return false;
    }
  };

  const receive = useReceiveBinderDrawer({
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: bindersQK.all });
      setShowReceiveBinder(false);
    },
    initialClient: client,
  });

  return {
    showCreateCharge,
    openCreateCharge: () => setShowCreateCharge(true),
    closeCreateCharge: () => setShowCreateCharge(false),
    submitCreateCharge,
    createChargeLoading: createChargeMutation.isPending,
    createChargeError: createChargeMutation.error
      ? String(createChargeMutation.error)
      : null,

    showReceiveBinder,
    openReceiveBinder: () => setShowReceiveBinder(true),
    closeReceiveBinder: () => {
      receive.handleReset();
      setShowReceiveBinder(false);
    },
    receive,
  };
};
