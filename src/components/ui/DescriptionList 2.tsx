import { cn } from "../../utils/utils";

export interface DescriptionItem {
  label: string;
  value: React.ReactNode;
  fullWidth?: boolean;
}

export interface DescriptionListProps {
  items: DescriptionItem[];
  columns?: 1 | 2 | 3;
  className?: string;
}

export const DescriptionList: React.FC<DescriptionListProps> = ({
  items,
  columns = 2,
  className,
}) => {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  };

  return (
    <dl className={cn("grid gap-4", gridCols[columns], className)}>
      {items.map((item, index) => (
        <div
          key={`${item.label}-${index}`}
          className={cn(
            "space-y-1",
            item.fullWidth && columns > 1 && "md:col-span-2 lg:col-span-3",
          )}
        >
          <dt className="text-xs font-medium text-gray-500">{item.label}</dt>
          <dd className="text-sm font-medium text-gray-900">
            {item.value || "—"}
          </dd>
        </div>
      ))}
    </dl>
  );
};
