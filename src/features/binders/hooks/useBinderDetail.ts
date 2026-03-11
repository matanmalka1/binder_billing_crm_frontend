import { useQuery } from "@tanstack/react-query";
import { bindersApi } from "../../../api/binders.api";
import { QK } from "../../../lib/queryKeys";

export const useBinderDetail = (binderId: number | null) =>
  useQuery({
    queryKey: binderId === null ? ["binders", "detail", "none"] : QK.binders.detail(binderId),
    queryFn: () => bindersApi.getBinder(binderId as number),
    enabled: binderId !== null,
  });
