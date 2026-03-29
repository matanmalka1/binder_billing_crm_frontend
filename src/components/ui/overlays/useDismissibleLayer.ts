import { useEffect, type RefObject } from "react";

interface UseDismissibleLayerOptions {
  open: boolean;
  triggerRef: RefObject<HTMLElement | null>;
  layerRef: RefObject<HTMLElement | null>;
  onDismiss: () => void;
  closeOnEscape?: boolean;
  closeOnScroll?: boolean;
  closeOnResize?: boolean;
}

export const useDismissibleLayer = ({
  open,
  triggerRef,
  layerRef,
  onDismiss,
  closeOnEscape = false,
  closeOnScroll = false,
  closeOnResize = false,
}: UseDismissibleLayerOptions) => {
  useEffect(() => {
    if (!open) return;

    const handleMouseDown = (event: MouseEvent) => {
      if (triggerRef.current?.contains(event.target as Node)) return;
      if (layerRef.current?.contains(event.target as Node)) return;
      onDismiss();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (closeOnEscape && event.key === "Escape") {
        onDismiss();
      }
    };

    const handleViewportChange = () => onDismiss();

    document.addEventListener("mousedown", handleMouseDown);
    if (closeOnEscape) {
      document.addEventListener("keydown", handleKeyDown);
    }
    if (closeOnScroll) {
      window.addEventListener("scroll", handleViewportChange, true);
    }
    if (closeOnResize) {
      window.addEventListener("resize", handleViewportChange);
    }

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      if (closeOnEscape) {
        document.removeEventListener("keydown", handleKeyDown);
      }
      if (closeOnScroll) {
        window.removeEventListener("scroll", handleViewportChange, true);
      }
      if (closeOnResize) {
        window.removeEventListener("resize", handleViewportChange);
      }
    };
  }, [closeOnEscape, closeOnResize, closeOnScroll, layerRef, onDismiss, open, triggerRef]);
};
