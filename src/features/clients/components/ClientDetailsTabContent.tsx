import { type FC } from "react";
import {
  ClientDetailsOverviewTab,
  type ClientDetailsOverviewTabProps,
} from "./ClientDetailsOverviewTab";

type ClientDetailsTabContentProps = {
  overviewProps: ClientDetailsOverviewTabProps;
};

export const ClientDetailsTabContent: FC<ClientDetailsTabContentProps> = ({
  overviewProps,
}) => <ClientDetailsOverviewTab {...overviewProps} />;
