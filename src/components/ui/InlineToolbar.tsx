import { cn } from "../../utils/utils";

interface InlineToolbarProps {
  children: React.ReactNode;
  className?: string;
}

/** Lightweight filter toolbar — no Card wrapper, no title, no extra chrome. */
export const InlineToolbar: React.FC<InlineToolbarProps> = ({ children, className }) => (
  <div className={cn("rounded-xl border border-gray-200 bg-gray-50/60 px-4 py-3", className)}>
    {children}
  </div>
);

InlineToolbar.displayName = "InlineToolbar";
