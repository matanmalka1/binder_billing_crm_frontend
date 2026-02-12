export const documentsKeys = {
  all: ["documents"] as const,
  clients: () => [...documentsKeys.all, "clients"] as const,
  byClient: (clientId: number) => [...documentsKeys.all, "client", clientId] as const,
  listByClient: (clientId: number) => [...documentsKeys.byClient(clientId), "list"] as const,
  signalsByClient: (clientId: number) =>
    [...documentsKeys.byClient(clientId), "signals"] as const,
};
