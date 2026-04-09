import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { FormField } from "../../../components/ui/inputs/FormField";
import { SelectDropdown } from "../../../components/ui/inputs/SelectDropdown";
import { vatReportsApi } from "../api";
import { vatReportsQK } from "../api/queryKeys";

interface VatPeriodSelectProps {
  clientId: number;
  year: number;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  className?: string;
  enabled?: boolean;
}

export const VatPeriodSelect: React.FC<VatPeriodSelectProps> = ({
  clientId,
  year,
  value,
  onChange,
  error,
  className,
  enabled = true,
}) => {
  const isValidClient = Number.isInteger(clientId) && (clientId as number) > 0;

  const { data, isLoading } = useQuery({
    queryKey: vatReportsQK.periodOptions(clientId, year),
    queryFn: () => vatReportsApi.getPeriodOptions(clientId, year),
    enabled: enabled && isValidClient,
    staleTime: 30_000,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const periodOptions = useMemo(() => data?.options ?? [], [data]);
  const selectedPeriodExists = !value || periodOptions.some((opt) => opt.period === value);

  const options = useMemo(
    () => [
      {
        value: "",
        label: !isValidClient
          ? "יש לבחור לקוח"
          : isLoading
            ? "טוען תקופות..."
            : "בחר תקופה...",
      },
      ...periodOptions.map((opt) => ({
        value: opt.period,
        label: `${opt.label}${opt.is_opened ? " (קיים תיק)" : ""}`,
        disabled: opt.is_opened,
      })),
    ],
    [isValidClient, isLoading, periodOptions],
  );

  const combinedError = error || (!selectedPeriodExists ? "התקופה שנבחרה אינה זמינה ללקוח זה" : undefined);

  return (
    <>
      <FormField label="תקופת דיווח *" error={combinedError} className={className}>
        <SelectDropdown
          value={value}
          onChange={(e) => onChange(e.target.value)}
          options={options}
          disabled={!isValidClient || isLoading}
        />
      </FormField>
      {data?.period_type === "bimonthly" && (
        <p className={`text-xs text-gray-500 ${className ?? ""}`}>
          הלקוח מוגדר לדיווח דו-חודשי
        </p>
      )}
      {!isLoading && isValidClient && periodOptions.length === 0 && (
        <p className={`text-xs text-gray-500 ${className ?? ""}`}>
          לא נמצאו תקופות זמינות לשנה זו
        </p>
      )}
    </>
  );
};

VatPeriodSelect.displayName = "VatPeriodSelect";
