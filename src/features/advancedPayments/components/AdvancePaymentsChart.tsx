import { useQuery } from "@tanstack/react-query";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { advancePaymentsApi, advancedPaymentsQK } from "../api";
import { getAdvancePaymentShortMonthLabel } from "../utils";

interface AdvancePaymentsChartProps {
  clientId: number;
  year: number;
}

export const AdvancePaymentsChart: React.FC<AdvancePaymentsChartProps> = ({
  clientId,
  year,
}) => {
  const { data, isLoading } = useQuery({
    queryKey: advancedPaymentsQK.chart(clientId, year),
    queryFn: () => advancePaymentsApi.getChartData(clientId, year),
    enabled: clientId > 0 && year > 0,
  });

  if (isLoading || !data) return null;

  const chartData = data.months.map((row) => ({
    name: getAdvancePaymentShortMonthLabel(row.period, row.period_months_count),
    צפוי: row.expected_amount,
    שולם: row.paid_amount,
    פיגור: row.overdue_amount,
  }));

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">ביצוע חודשי</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={chartData} margin={{ top: 4, right: 8, left: 8, bottom: 0 }}>
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: "#6b7280" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: "#9ca3af" }}
            axisLine={false}
            tickLine={false}
            width={48}
            tickFormatter={(v: number) => `₪${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip
            formatter={(value, name) => [
              typeof value === "number"
                ? `₪${value.toLocaleString("he-IL")}`
                : String(value),
              name,
            ]}
            contentStyle={{ fontSize: 12, direction: "rtl" }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="צפוי" fill="#94a3b8" radius={[3, 3, 0, 0]} />
          <Bar dataKey="שולם" fill="#10b981" radius={[3, 3, 0, 0]} />
          <Bar dataKey="פיגור" fill="#ef4444" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

AdvancePaymentsChart.displayName = "AdvancePaymentsChart";
