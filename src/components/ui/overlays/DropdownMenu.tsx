import { useRef, useState, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { MoreHorizontal } from "lucide-react";
import { cn } from "../../../utils/utils";
import { computeDropdownPosition } from "../../../utils/dropdownMenuUtils";
import { useDismissibleLayer } from "./useDismissibleLayer";

interface DropdownPos { top: number; left: number; maxHeight?: number }

interface DropdownMenuProps {
  ariaLabel?: string;
  children: React.ReactNode;
}

export const DropdownMenu = ({ ariaLabel, children }: DropdownMenuProps) => {
  const [open, setOpen] = useState(false);
  const [triggerRect, setTriggerRect] = useState<DOMRect | null>(null);
  const [pos, setPos] = useState<DropdownPos | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);

  useDismissibleLayer({
    open,
    triggerRef,
    layerRef: portalRef,
    onDismiss: () => setOpen(false),
    closeOnScroll: true,
    closeOnResize: true,
  });

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (open) { setOpen(false); return; }
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setTriggerRect(rect);
    setPos(null); // will measure in layout effect
    setOpen(true);
  };

  // Measure menu after first render, then compute position
  useLayoutEffect(() => {
    if (!open || !triggerRect || pos) return;
    const el = portalRef.current;
    if (!el) return;
    const menuRect = el.getBoundingClientRect();
    setPos(computeDropdownPosition(
      triggerRect,
      { width: menuRect.width, height: menuRect.height },
      { width: window.innerWidth, height: window.innerHeight },
    ));
  }, [open, triggerRect, pos]);

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

      {open && createPortal(
        <div
          ref={portalRef}
          style={pos ? {
            position: "fixed",
            top: pos.top,
            left: pos.left,
            maxHeight: pos.maxHeight,
            overflowY: pos.maxHeight ? "auto" : undefined,
            zIndex: 9999,
          } : {
            position: "fixed",
            visibility: "hidden" as const,
            top: -9999,
            left: -9999,
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

DropdownMenu.displayName = "DropdownMenu";

export const DropdownMenuItem = ({
  label, onClick, icon, danger = false, disabled = false,
}: {
  label: string; onClick: () => void; icon: React.ReactNode;
  danger?: boolean; disabled?: boolean;
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

DropdownMenuItem.displayName = "DropdownMenuItem";
