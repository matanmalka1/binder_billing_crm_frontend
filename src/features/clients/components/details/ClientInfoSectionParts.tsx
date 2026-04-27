import { type ReactNode } from "react";
import { Card } from "../../../../components/ui/primitives/Card";
import { DefinitionList } from "../../../../components/ui/layout/DefinitionList";
import { cn } from "@/utils/utils";

const EMPTY_VALUE = "לא הוגדר";

type DefinitionItem = {
  label: string;
  value: ReactNode;
};

const EmptyValue = () => <span className="font-medium text-gray-400">{EMPTY_VALUE}</span>;

export const displayValue = (value: ReactNode) => {
  if (value === EMPTY_VALUE || value === "" || value == null) return <EmptyValue />;
  return value;
};

export const SectionCard = ({
  title,
  children,
  className,
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) => (
  <Card
    title={title}
    className={cn("shadow-sm", className)}
  >
    {children}
  </Card>
);

export const DefinitionSectionCard = ({
  title,
  items,
  columns,
}: {
  title: string;
  items: DefinitionItem[];
  columns: 2 | 3;
}) => (
  <SectionCard title={title}>
    <DefinitionList
      columns={columns}
      items={items.map((item) => ({ ...item, value: displayValue(item.value) }))}
      className="gap-x-5 gap-y-3"
    />
  </SectionCard>
);
