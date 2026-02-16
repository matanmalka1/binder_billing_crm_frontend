import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FileDown, FileSpreadsheet, Calendar, DollarSign } from "lucide-react";
import { PageHeader } from "./src/components/layout/PageHeader";
import { Card } from "./src/components/ui/Card";
import { Button } from "./src/components/ui/Button";
import { Input } from "./src/components/ui/Input";
import { StatsCard } from "./src/components/ui/StatsCard";
import { DataTable, type Column } from "./src/components/ui/DataTable";
import { PageLoading } from "./src/components/ui/PageLoading";
import { ErrorCard } from "./src/components/ui/ErrorCard";
import { reportsApi, type AgingReportItem } from "./src/api/reports.api";
import { getErrorMessage, cn } from "./src/utils/utils";
import { toast } from "./src/utils/toast";

export const AgingReportPage: React.FC = () => {
  const [asOfDate, setAsOfDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );
  const [exporting, setExporting] = useState<"excel" | "pdf" | null>(null);

  const reportQuery = useQuery({
    queryKey: ["reports", "aging", asOfDate],
    queryFn: () => reportsApi.getAgingReport(asOfDate),
  });

  const handleExport = async (format: "excel" | "pdf") => {
    setExporting(format);
    try {
      const result = await reportsApi.exportAgingReport(format);
      toast.success(`דוח יוצא בהצלחה: ${result.filename}`);
      reportsApi.downloadExport(result.download_url);
    } catch (error) {
      toast.error(getErrorMessage(error, "שגיאה בייצוא דוח"));
    } finally {
      setExporting(null);
    }
  };

  const columns: Column<AgingReportItem>[] = [
    {
      key: "client_name",
      header: "לקוח",
      render: (item) => (
        <div>
          <div className="font-medium text-gray-900">{item.client_name}</div>
          <div className="text-xs text-gray-500">לקוח #{item.client_id}</div>
        </div>
      ),
    },
    {
      key: "total",
      header: 'סה"כ חוב',
      render: (item) => (
        <span className="font-bold text-gray-900">
          ₪
          {item.total_outstanding.toLocaleString("he-IL", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      ),
    },
    {
      key: "current",
      header: "שוטף (0-30)",
      render: (item) => (
        <span className="text-green-700">
          ₪
          {item.current.toLocaleString("he-IL", {
            minimumFractionDigits: 2,
          })}
        </span>
      ),
    },
    {
      key: "days_30",
      header: "31-60 ימים",
      render: (item) => (
        <span className="text-yellow-700">
          ₪
          {item.days_30.toLocaleString("he-IL", {
            minimumFractionDigits: 2,
          })}
        </span>
      ),
    },
    {
      key: "days_60",
      header: "61-90 ימים",
      render: (item) => (
        <span className="text-orange-700">
          ₪
          {item.days_60.toLocaleString("he-IL", {
            minimumFractionDigits: 2,
          })}
        </span>
      ),
    },
    {
      key: "days_90",
      header: "90+ ימים",
      render: (item) => (
        <span className="text-red-700 font-semibold">
          ₪
          {item.days_90_plus.toLocaleString("he-IL", {
            minimumFractionDigits: 2,
          })}
        </span>
      ),
    },
    {
      key: "oldest",
      header: "חוב עתיק ביותר",
      render: (item) =>
        item.oldest_invoice_days ? (
          <div className="text-sm">
            <div className="text-gray-700">{item.oldest_invoice_days} ימים</div>
            <div className="text-xs text-gray-500">
              {item.oldest_invoice_date
                ? new Date(item.oldest_invoice_date).toLocaleDateString("he-IL")
                : "—"}
            </div>
          </div>
        ) : (
          <span className="text-gray-500">—</span>
        ),
    },
  ];

  if (reportQuery.isPending) {
    return (
      <div className="space-y-6">
        <PageHeader title="דוח חובות לקוחות" />
        <PageLoading message="טוען דוח..." />
      </div>
    );
  }

  if (reportQuery.error) {
    return (
      <div className="space-y-6">
        <PageHeader title="דוח חובות לקוחות" />
        <ErrorCard
          message={getErrorMessage(reportQuery.error, "שגיאה בטעינת הדוח")}
        />
      </div>
    );
  }

  const data = reportQuery.data!;

  return (
    <div className="space-y-6">
      <PageHeader
        title="דוח חובות לקוחות (Aging Report)"
        description="ניתוח חובות לפי גיל החוב"
        variant="gradient"
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport("excel")}
              isLoading={exporting === "excel"}
              disabled={exporting !== null}
              className="gap-2"
            >
              <FileSpreadsheet className="h-4 w-4" />
              Excel
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport("pdf")}
              isLoading={exporting === "pdf"}
              disabled={exporting !== null}
              className="gap-2"
            >
              <FileDown className="h-4 w-4" />
              PDF
            </Button>
          </div>
        }
      />

      {/* Date Filter */}
      <Card>
        <div className="flex items-center gap-4">
          <Calendar className="h-5 w-5 text-gray-400" />
          <Input
            type="date"
            label="נכון לתאריך"
            value={asOfDate}
            onChange={(e) => setAsOfDate(e.target.value)}
            className="max-w-xs"
          />
        </div>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
        <StatsCard
          title="סה״כ חובות"
          value={`₪${data.total_outstanding.toLocaleString("he-IL")}`}
          icon={DollarSign}
          variant="blue"
          description="יתרות פתוחות"
        />
        <StatsCard
          title="שוטף (0-30)"
          value={`₪${data.summary.current.toLocaleString("he-IL")}`}
          icon={DollarSign}
          variant="green"
          description="תוך 30 יום"
        />
        <StatsCard
          title="31-60 ימים"
          value={`₪${data.summary.days_30.toLocaleString("he-IL")}`}
          icon={DollarSign}
          variant="orange"
          description="חודש שני"
        />
        <StatsCard
          title="61-90 ימים"
          value={`₪${data.summary.days_60.toLocaleString("he-IL")}`}
          icon={DollarSign}
          variant="orange"
          description="חודש שלישי"
        />
        <StatsCard
          title="90+ ימים"
          value={`₪${data.summary.days_90_plus.toLocaleString("he-IL")}`}
          icon={DollarSign}
          variant="red"
          description="דורש טיפול"
        />
      </div>

      {/* Detailed Table */}
      <DataTable
        data={data.items}
        columns={columns}
        getRowKey={(item) => item.client_id}
        emptyMessage="אין חובות פתוחים"
        rowClassName={(item, index) =>
          cn("animate-fade-in", item.days_90_plus > 0 && "bg-red-50/30")
        }
      />

      {/* Report Metadata */}
      <Card variant="elevated" className="bg-gray-50">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div>
            נוצר בתאריך: {new Date(data.report_date).toLocaleString("he-IL")}
          </div>
          <div>סה״כ {data.items.length} לקוחות עם חובות פתוחים</div>
        </div>
      </Card>
    </div>
  );
};
