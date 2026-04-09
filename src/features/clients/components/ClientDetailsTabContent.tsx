import { useState, type FC } from "react";
import { ClientDetailsOverviewTab, type ClientDetailsOverviewTabProps } from "./ClientDetailsOverviewTab";
import { ClientDetailsTabBar } from "./ClientDetailsTabBar";
import { type ActiveClientDetailsTab } from "../constants";

type ClientDetailsTabContentProps = {
  initialTab?: ActiveClientDetailsTab;
  overviewProps: Omit<ClientDetailsOverviewTabProps, "activeTab">;
};

export const ClientDetailsTabContent: FC<ClientDetailsTabContentProps> = ({
  initialTab = "details",
  overviewProps,
}) => {
  const [activeTab, setActiveTab] = useState<ActiveClientDetailsTab>(initialTab);

  return (
    <div className="space-y-4">
      <ClientDetailsTabBar activeTab={activeTab} onTabChange={setActiveTab} />
      <ClientDetailsOverviewTab {...overviewProps} activeTab={activeTab} />
    </div>
  );
};
