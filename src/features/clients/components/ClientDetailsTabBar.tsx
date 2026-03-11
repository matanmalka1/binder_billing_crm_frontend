import { type FC } from "react";
import { cn } from "../../../utils/utils";
import { CLIENT_DETAILS_TABS, CLIENT_DETAILS_TAB_LABELS, type ActiveClientDetailsTab } from "../constants";

type ClientDetailsTabBarProps = {
  activeTab: ActiveClientDetailsTab;
  onTabChange: (tab: ActiveClientDetailsTab) => void;
};

export const ClientDetailsTabBar: FC<ClientDetailsTabBarProps> = ({
  activeTab,
  onTabChange,
}) => (
  <div className="flex gap-1 rounded-lg border border-gray-200 bg-gray-100 p-1 self-start">
    {CLIENT_DETAILS_TABS.map((tab) => (
      <button
        key={tab}
        type="button"
        onClick={() => onTabChange(tab)}
        className={cn(
          "rounded-md px-4 py-1.5 text-sm font-medium transition-all",
          activeTab === tab
            ? "bg-white text-gray-900 shadow-sm"
            : "text-gray-500 hover:text-gray-700",
        )}
      >
        {CLIENT_DETAILS_TAB_LABELS[tab]}
      </button>
    ))}
  </div>
);
