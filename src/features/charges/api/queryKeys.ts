import { createQueryKeys } from "@/lib/queryKeys";

export const chargesQK = {
  ...createQueryKeys("charges"),
  forClientPage: (clientId: number, page: number, pageSize: number) =>
    ["charges", "client", clientId, { page, page_size: pageSize }] as const,
};
