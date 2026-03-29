import { useEffect, useRef, useState, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { MoreHorizontal } from "lucide-react";
import { cn } from "../../utils/utils";

const VIEWPORT_PAD = 8;

interface DropdownPos { top: number; left: number; maxHeight?: number }

export function computeDropdownPosition(
  trigger: { top: number; bottom: number; right: number },
  menu: { width: number; height: number },
  viewport: { width: number; height: number },
): DropdownPos {
  const spaceBelow = viewport.height - trigger.bottom - VIEWPORT_PAD;
  const spaceAbove = trigger.top - VIEWPORT_PAD;

  let top: number;
  let maxHeight: number | undefined;

  if (menu.height <= spaceBelow) {
    top = trigger.bottom;
  } else if (menu.height <= spaceAbove) {
    top = trigger.top - menu.height;
  } else if (spaceBelow >= spaceAbove) {
    top = trigger.bottom;
    maxHeight = spaceBelow;
  } else {
    top = VIEWPORT_PAD;
    maxHeight = spaceAbove;
  }

  // RTL-friendly: align right edge of menu to right edge of trigger, clamp left
  let left = trigger.right - menu.width;
  if (left < VIEWPORT_PAD) left = VIEWPORT_PAD;
  if (left + menu.width > viewport.width - VIEWPORT_PAD) {
    left = viewport.width - VIEWPORT_PAD - menu.width;
  }

  return maxHeight ? { top, left, maxHeight } : { top, left };
}

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

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (triggerRef.current?.contains(e.target as Node)) return;
      if (portalRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
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
