import { useState, type FC } from "react";
import { useParams } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { Alert } from "@/components/ui/overlays/Alert";
import { PageStateGuard } from "@/components/ui/layout/PageStateGuard";
import { cn } from "@/utils/utils";
import { ClientDocumentsTab } from "@/features/documents";
import { ClientTimelineTab } from "@/features/timeline";
import { VatClientSummaryPanel } from "@/features/vatReports";
import { ClientAdvancePaymentsTab } from "@/features/advancedPayments";
import { FilingTimeline } from "@/features/taxDeadlines";
import { ClientAnnualReportsTab } from "@/features/annualReports";
import { TaxProfileCard } from "@/features/taxProfile";
import { CorrespondenceCard } from "@/features/correspondence";
import { SignatureRequestsCard } from "@/features/signatureRequests";
import {
  BUSINESS_DETAILS_TABS,
  BUSINESS_DETAILS_TAB_LABELS,
  type ActiveBusinessDetailsTab,
} from "../constants";
import { useBusinessDetails } from "../hooks/useBusinessDetails";

const BUSINESS_TYPE_LABELS: Record<string, string> = {
  osek_patur: "עוסק פטור",
  osek_murshe: "עוסק מורשה",
  company: 'חברה בע"מ',
  employee: "שכיר",
};

interface BusinessDetailsProps {
  initialTab?: ActiveBusinessDetailsTab;
}

export const BusinessDetails: FC<BusinessDetailsProps> = ({
  initialTab = "details",
}) => {
  const { clientId, businessId } = useParams<{
    clientId: string;
    businessId: string;
  }>();
  const clientIdNum = clientId ? Number(clientId) : null;
  const businessIdNum = businessId ? Number(businessId) : null;

  const [activeTab, setActiveTab] = useState<ActiveBusinessDetailsTab>(initialTab);

  const { client, business, isLoading, error, isValidId, can } = useBusinessDetails({
    clientId: clientIdNum,
    businessId: businessIdNum,
  });

  if (!isValidId) {
    return (
      <div className="space-y-6">
        <PageHeader title="פרטי עסק" />
        <Alert variant="error" message="מזהה לא תקין" />
      </div>
    );
  }

  const businessDisplayName = business
    ? `${BUSINESS_TYPE_LABELS[business.business_type] ?? business.business_type}${business.business_name ? ` — ${business.business_name}` : ""}`
    : "פרטי עסק";

  const clientName = client?.full_name ?? "לקוח";

  return (
    <PageStateGuard
      isLoading={isLoading}
      error={error}
      header={
        <PageHeader
          title={businessDisplayName}
          breadcrumbs={[
            { label: "לקוחות", to: "/clients" },
            { label: clientName, to: `/clients/${clientId}` },
            { label: businessDisplayName, to: `/clients/${clientId}/businesses/${businessId}` },
          ]}
        />
      }
      loadingMessage="טוען פרטי עסק..."
    >
      {business && businessIdNum != null ? (
        <div className="space-y-6">
          {/* Tab bar */}
          <div className="flex gap-1 rounded-lg border border-gray-200 bg-gray-100 p-1 self-start">
            {BUSINESS_DETAILS_TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "rounded-md px-4 py-1.5 text-sm font-medium transition-all",
                  activeTab === tab
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700",
                )}
              >
                {BUSINESS_DETAILS_TAB_LABELS[tab]}
              </button>
            ))}
          </div>

          {/* Main content */}
          <div>
            {activeTab === "details" && (
              <div className="space-y-6">
                <TaxProfileCard businessId={businessIdNum} readOnly={!can.editClients} />
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  {client && businessIdNum != null && <CorrespondenceCard businessId={businessIdNum} />}
                  {client && businessIdNum != null && <SignatureRequestsCard client={client} businessId={businessIdNum} canManage={can.editClients} />}
                </div>
              </div>
            )}
            {activeTab === "documents" && <ClientDocumentsTab businessId={businessIdNum} />}
            {activeTab === "timeline" && <ClientTimelineTab businessId={String(businessIdNum)} />}
            {activeTab === "vat" && <VatClientSummaryPanel businessId={businessIdNum} />}
            {activeTab === "advance-payments" && <ClientAdvancePaymentsTab businessId={businessIdNum} />}
            {activeTab === "deadlines" && <FilingTimeline businessId={businessIdNum} />}
            {activeTab === "annual-reports" && <ClientAnnualReportsTab businessId={businessIdNum} />}
          </div>
        </div>
      ) : null}
    </PageStateGuard>
  );
};
