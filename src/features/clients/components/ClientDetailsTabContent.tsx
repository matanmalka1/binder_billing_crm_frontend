import { type FC } from "react";
import { ClientDocumentsTab } from "../../documents/components/ClientDocumentsTab";
import { ClientTimelineTab } from "../../timeline/components/ClientTimelineTab";
import { VatClientSummaryPanel } from "../../vatReports/components/VatClientSummaryPanel";
import { ClientAdvancePaymentsTab } from "../../advancedPayments/components/ClientAdvancePaymentsTab";
import { FilingTimeline } from "../../taxDeadlines/components/FilingTimeline";
import { NotificationsTab } from "../../notifications/components/NotificationsTab";
import { ClientAnnualReportsTab } from "../../annualReports/components/ClientAnnualReportsTab";
import {
  ClientDetailsOverviewTab,
  type ClientDetailsOverviewTabProps,
} from "./ClientDetailsOverviewTab";
import type { ActiveClientDetailsTab } from "../constants";

type ClientDetailsTabContentProps = {
  activeTab: ActiveClientDetailsTab;
  clientId: number;
  overviewProps: ClientDetailsOverviewTabProps;
};

export const ClientDetailsTabContent: FC<ClientDetailsTabContentProps> = ({
  activeTab,
  clientId,
  overviewProps,
}) => {
  if (activeTab === "details")
    return <ClientDetailsOverviewTab {...overviewProps} />;
  if (activeTab === "documents")
    return <ClientDocumentsTab clientId={clientId} />;
  if (activeTab === "timeline")
    return <ClientTimelineTab clientId={String(clientId)} />;
  if (activeTab === "advance-payments")
    return <ClientAdvancePaymentsTab clientId={clientId} />;
  if (activeTab === "vat") return <VatClientSummaryPanel clientId={clientId} />;
  if (activeTab === "deadlines") return <FilingTimeline clientId={clientId} />;
  if (activeTab === "notifications")
    return <NotificationsTab clientId={clientId} />;
  return <ClientAnnualReportsTab clientId={clientId} />;
};
