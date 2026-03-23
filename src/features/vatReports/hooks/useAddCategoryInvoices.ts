import { useMutation, useQueryClient } from "@tanstack/react-query";
import { vatReportsApi } from "../api";
import { vatReportsQK } from "../api/queryKeys";
import { toast } from "../../../utils/toast";
import { showErrorToast } from "../../../utils/utils";
import {
  toCategoryInvoicePayloads,
  type CategoryEntryFormValues,
} from "../schemas/categoryEntry.schema";

export const useAddCategoryInvoices = (workItemId: number) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (values: CategoryEntryFormValues & { period: string }) => {
      const { period, ...formValues } = values;
      const payloads = toCategoryInvoicePayloads(formValues, period);
      if (payloads.length === 0) throw new Error("לא הוזנו סכומים");
      await Promise.all(payloads.map((p) => vatReportsApi.addInvoice(workItemId, p)));
    },
    onSuccess: async () => {
      toast.success("הנתונים נשמרו בהצלחה");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: vatReportsQK.invoices(workItemId) }),
        queryClient.invalidateQueries({ queryKey: vatReportsQK.all }),
      ]);
    },
  });

  const submit = async (values: CategoryEntryFormValues, period: string): Promise<boolean> => {
    try {
      await mutation.mutateAsync({ ...values, period });
      return true;
    } catch (err: unknown) {
      showErrorToast(err, "שגיאה בשמירת הנתונים");
      return false;
    }
  };

  return { submit, isLoading: mutation.isPending };
};
