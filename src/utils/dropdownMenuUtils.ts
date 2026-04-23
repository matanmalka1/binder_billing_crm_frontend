interface DropdownPos { top: number; left: number; maxHeight?: number }

const VIEWPORT_PAD = 8;

export const computeDropdownPosition = (
  trigger: { top: number; bottom: number; right: number },
  menu: { width: number; height: number },
  viewport: { width: number; height: number },
): DropdownPos => {
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
};
