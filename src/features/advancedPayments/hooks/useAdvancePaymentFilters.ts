import { useMemo } from "react";
import { getYear } from "date-fns";
import { useSearchParams } from "react-router-dom";
import { parsePositiveInt } from "../../../utils/utils";

export const useAdvancePaymentFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(() => ({
    client_id: parsePositiveInt(searchParams.get("client_id"), 0),
    year: parsePositiveInt(searchParams.get("year"), getYear(new Date())),
  }), [searchParams]);

  const setFilter = (key: "client_id" | "year", value: number) => {
    const next = new URLSearchParams(searchParams);
    if (value > 0) next.set(key, String(value));
    else next.delete(key);
    setSearchParams(next);
  };

  return { filters, setFilter };
};
