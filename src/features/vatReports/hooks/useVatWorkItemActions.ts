import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { vatReportsApi } from "../api";
import { toast } from "../../../utils/toast";
import { showErrorToast } from "../../../utils/utils";
import { vatReportsQK } from "../api/queryKeys";

export const useVatWorkItemActions = (workItemId: number) => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const invalidate = async () => {
    await queryClient.invalidateQueries({ queryKey: vatReportsQK.detail(workItemId) });
    await queryClient.invalidateQueries({ queryKey: vatReportsQK.all });
  };

  const run = async (fn: () => Promise<unknown>, successMsg: string, errMsg: string) => {
    setLoading(true);
    try {
      await fn();
      toast.success(successMsg);
      await invalidate();
    } catch (err) {
      showErrorToast(err, errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleReadyForReview = () =>
    run(
      () => vatReportsApi.markReadyForReview(workItemId),
      "התיק נשלח לבדיקה",
      "שגיאה בשינוי סטטוס",
    );

  const handleSendBack = (note: string) =>
    run(
      () => vatReportsApi.sendBack(workItemId, note),
      "התיק הוחזר לתיקון",
      "שגיאה בהחזרה לתיקון",
    );

  return { handleReadyForReview, handleSendBack, isLoading: loading };
};
