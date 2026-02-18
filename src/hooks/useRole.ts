import { useMemo } from "react";
import { useAuthStore } from "../store/auth.store";

export const useRole = () => {
  const role = useAuthStore((s) => s.user?.role ?? null);

  return useMemo(
    () => ({
      role,
      isAdvisor: role === "advisor",
      isSecretary: role === "secretary",
      can: {
        createClients: role === "advisor",
        viewChargeAmounts: role === "advisor",
        editClients: role === "advisor",
        performBinderActions: true,
      },
    }),
    [role],
  );
};
