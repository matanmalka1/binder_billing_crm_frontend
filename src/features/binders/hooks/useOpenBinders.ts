import { useQuery } from "@tanstack/react-query";
import { bindersApi } from "../../../api/binders.api";
import { QK } from "../../../lib/queryKeys";

export const useOpenBinders = (page = 1, pageSize = 20) =>
  useQuery({
    queryKey: QK.binders.open(page, pageSize),
    queryFn: () => bindersApi.getOpenBinders({ page, page_size: pageSize }),
  });
