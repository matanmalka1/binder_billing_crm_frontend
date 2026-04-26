import type { ReactNode } from "react";

export type TableCellValue = ReactNode | null | undefined;

export type StatusVariant = "success" | "warning" | "error" | "info" | "neutral";

export type StatusVariantMap = Record<string, StatusVariant>;
