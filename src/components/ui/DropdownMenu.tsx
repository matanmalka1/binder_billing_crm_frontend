import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MoreHorizontal } from "lucide-react";
import { cn } from "../../utils/utils";

interface DropdownMenuProps {
  ariaLabel?: string;
  children: React.ReactNode;
}

/**
 * A `...` button that renders its dropdown via a portal so it is never
 * clipped by an ancestor with overflow:hidden/auto/scroll.
 * Uses position:fixed with viewport coords — unaffected by scroll or overflow.
 */
export const DropdownMenu: React.FC<DropdownMenuProps> = ({ ariaLabel, children }) => {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<{ top: number; bottom: number; left: number } | null>(null);
  const [openAbove, setOpenAbove] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const MENU_WIDTH = 160;

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (open) { setOpen(false); return; }
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const spaceBelow = window.innerHeight - rect.bottom;
    const above = spaceBelow < 200;
    // Align right edge of menu to right edge of button, clamped so menu stays in viewport
    const left = Math.max(MENU_WIDTH + 8, rect.right);
    setOpenAbove(above);
    setCoords({ top: rect.bottom, bottom: window.innerHeight - rect.top, left });
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (triggerRef.current && triggerRef.current.contains(e.target as Node)) return;
      // Delay so click handlers on portal items fire before the portal is removed
      setTimeout(() => setOpen(false), 0);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  // Close on scroll so the menu doesn't float away
  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener("scroll", close, true);
    return () => window.removeEventListener("scroll", close, true);
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={toggle}
        className="flex h-7 w-7 items-center justify-center rounded-md border border-transparent text-gray-400 transition-colors hover:border-gray-200 hover:bg-gray-100 hover:text-gray-600"
        aria-label={ariaLabel ?? "פעולות"}
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>

      {open && coords && createPortal(
        <div
          style={{
            position: "fixed",
            top: openAbove ? undefined : coords.top,
            bottom: openAbove ? coords.bottom : undefined,
            left: coords.left,
            minWidth: MENU_WIDTH,
            transform: "translateX(-100%)",
            zIndex: 9999,
          }}
          className="rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>,
        document.body,
      )}
    </>
  );
};

export const DropdownMenuItem = ({
  label,
  onClick,
  icon,
  danger = false,
  disabled = false,
}: {
  label: string;
  onClick: () => void;
  icon: React.ReactNode;
  danger?: boolean;
  disabled?: boolean;
}) => (
  <button
    type="button"
    disabled={disabled}
    onClick={(e) => { e.stopPropagation(); onClick(); }}
    className={cn(
      "w-full px-3 py-2 text-right text-sm transition-colors hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed",
      danger ? "text-red-600 hover:bg-red-50" : "text-gray-700",
    )}
  >
    <span className="grid w-full grid-cols-[minmax(0,1fr)_1rem] items-center gap-2">
      <span className="truncate">{label}</span>
      <span className="flex h-4 w-4 items-center justify-center">{icon}</span>
    </span>
  </button>
);

DropdownMenu.displayName = "DropdownMenu";
DropdownMenuItem.displayName = "DropdownMenuItem";
