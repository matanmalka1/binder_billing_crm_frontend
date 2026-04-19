import { useQuery } from "@tanstack/react-query";
import { clientsApi, type CreateClientPayload } from "../api";
import type { ClientCreationImpactResponse } from "../api/contracts";

type ImpactParams = Pick<CreateClientPayload, "entity_type" | "vat_reporting_frequency">;

export const useClientCreationImpact = (
  params: Partial<ImpactParams> | null,
): { data: ClientCreationImpactResponse | undefined; isLoading: boolean } => {
  const enabled = !!(params?.entity_type && params?.vat_reporting_frequency);

  return useQuery({
    queryKey: ["client-creation-impact", params?.entity_type, params?.vat_reporting_frequency],
    queryFn: () =>
      clientsApi.previewImpact({
        entity_type: params!.entity_type!,
        vat_reporting_frequency: params!.vat_reporting_frequency!,
      } as CreateClientPayload),
    enabled,
    staleTime: 60_000,
  });
};
