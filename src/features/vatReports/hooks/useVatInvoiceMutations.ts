import { useMutation, useQueryClient } from "@tanstack/react-query";
import { vatReportsApi, type CreateVatInvoicePayload } from "../../../api/vatReports.api";
import { QK } from "../../../lib/queryKeys";
import { showErrorToast } from "../../../utils/utils";
import { toast } from "../../../utils/toast";

export const useAddInvoice = (workItemId: number) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: CreateVatInvoicePayload) =>
      vatReportsApi.addInvoice(workItemId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QK.tax.vatWorkItems.invoices(workItemId) });
      await queryClient.invalidateQueries({ queryKey: QK.tax.vatWorkItems.detail(workItemId) });
      await queryClient.invalidateQueries({ queryKey: QK.tax.vatWorkItems.all });
    },
  });

  const addInvoice = async (payload: CreateVatInvoicePayload): Promise<boolean> => {
    try {
      await mutation.mutateAsync(payload);
      toast.success("החשבונית נוספה בהצלחה");
      return true;
    } catch (err) {
      showErrorToast(err, "שגיאה בהוספת חשבונית");
      return false;
    }
  };

  return { addInvoice, isAdding: mutation.isPending };
};

export const useDeleteInvoice = (workItemId: number) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (invoiceId: number) => vatReportsApi.deleteInvoice(workItemId, invoiceId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QK.tax.vatWorkItems.invoices(workItemId) });
      await queryClient.invalidateQueries({ queryKey: QK.tax.vatWorkItems.detail(workItemId) });
      await queryClient.invalidateQueries({ queryKey: QK.tax.vatWorkItems.all });
    },
  });

  const deleteInvoice = async (invoiceId: number): Promise<boolean> => {
    try {
      await mutation.mutateAsync(invoiceId);
      toast.success("החשבונית נמחקה");
      return true;
    } catch (err) {
      showErrorToast(err, "שגיאה במחיקת חשבונית");
      return false;
    }
  };

  return { deleteInvoice, isDeleting: mutation.isPending };
};
