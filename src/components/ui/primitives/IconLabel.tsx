import { cn } from "../../../utils/utils";

interface IconLabelProps {
  icon?: React.ReactNode;
  label: string;
  /** Enables font-mono (MetaChip mode) */
  mono?: boolean;
  /** Adds border (MetaChip mode) */
  bordered?: boolean;
  className?: string;
}

export const IconLabel: React.FC<IconLabelProps> = ({
  icon,
  label,
  mono,
  bordered,
  className,
}) => (
  <span
    className={cn(
      "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs",
      mono && "font-mono",
      bordered && "border",
      className,
    )}
  >
    {icon}
    {label}
  </span>
);

IconLabel.displayName = "IconLabel";
