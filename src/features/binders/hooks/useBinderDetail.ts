import { useQuery } from "@tanstack/react-query";
import { bindersApi, bindersQK } from "../api";

export const useBinderDetail = (binderId: number | null) =>
  useQuery({
    queryKey: binderId === null ? ["binders", "detail", "none"] : bindersQK.detail(binderId),
    queryFn: () => bindersApi.getBinder(binderId as number),
    enabled: binderId !== null,
  });
