import { useMemo } from "react";

export interface UsePaginationProps {
  total: number;
  pageSize: number;
  currentPage: number;
  siblingCount?: number;
}

export interface UsePaginationReturn {
  totalPages: number;
  pageNumbers: (number | "ellipsis")[];
  hasNext: boolean;
  hasPrevious: boolean;
  isFirstPage: boolean;
  isLastPage: boolean;
}

export const usePagination = ({
  total,
  pageSize,
  currentPage,
  siblingCount = 1,
}: UsePaginationProps): UsePaginationReturn => {
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(total / pageSize));
  }, [total, pageSize]);

  const pageNumbers = useMemo(() => {
    // Always show: first page, last page, current page, and siblings
    const totalNumbers = siblingCount * 2 + 3; // current + siblings on both sides + first + last
    const totalBlocks = totalNumbers + 2; // + 2 ellipsis

    if (totalPages <= totalBlocks) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftEllipsis = leftSiblingIndex > 2;
    const shouldShowRightEllipsis = rightSiblingIndex < totalPages - 1;

    const result: (number | "ellipsis")[] = [];

    // Always show first page
    result.push(1);

    // Left ellipsis
    if (shouldShowLeftEllipsis) {
      result.push("ellipsis");
    } else if (leftSiblingIndex === 2) {
      result.push(2);
    }

    // Page numbers around current
    for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
      if (i !== 1 && i !== totalPages) {
        result.push(i);
      }
    }

    // Right ellipsis
    if (shouldShowRightEllipsis) {
      result.push("ellipsis");
    } else if (rightSiblingIndex === totalPages - 1) {
      result.push(totalPages - 1);
    }

    // Always show last page
    if (totalPages > 1) {
      result.push(totalPages);
    }

    return result;
  }, [currentPage, siblingCount, totalPages]);

  return {
    totalPages,
    pageNumbers,
    hasNext: currentPage < totalPages,
    hasPrevious: currentPage > 1,
    isFirstPage: currentPage === 1,
    isLastPage: currentPage === totalPages,
  };
};
