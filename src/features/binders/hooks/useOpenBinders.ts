import { useQuery } from "@tanstack/react-query";
import { bindersApi, bindersQK } from "../api";

export const useOpenBinders = (page = 1, pageSize = 20) =>
  useQuery({
    queryKey: bindersQK.open(page, pageSize),
    queryFn: () => bindersApi.getOpenBinders({ page, page_size: pageSize }),
  });
