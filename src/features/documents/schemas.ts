import { z } from "zod";
import type { UploadDocumentPayload } from "../../api/documents.api";

export type DocumentStatus = "pending" | "received" | "approved" | "rejected";

export interface DocumentsUploadFormValues {
  document_type: UploadDocumentPayload["document_type"];
  file: File | null;
  tax_year: number | null;
  annual_report_id: number | null;
  notes: string | null;
}

export const documentsUploadSchema = z.object({
  document_type: z.enum([
    "id_copy",
    "power_of_attorney",
    "engagement_agreement",
    "tax_form",
    "receipt",
    "invoice_doc",
    "bank_approval",
    "withholding_certificate",
    "nii_approval",
    "other",
  ]),
  file: z
    .custom<File | null>((value) => value === null || value instanceof File)
    .refine(
      (file) =>
        file !== null &&
        Object.prototype.toString.call(file) === "[object File]",
      { message: "יש לבחור קובץ לפני העלאה" },
    ),
  tax_year: z.number().nullable(),
  annual_report_id: z.number().nullable(),
  notes: z.string().nullable(),
});

export const documentsUploadDefaultValues: DocumentsUploadFormValues = {
  document_type: "id_copy",
  file: null,
  tax_year: null,
  annual_report_id: null,
  notes: null,
};

export const rejectDocumentSchema = z.object({
  notes: z.string().min(1, "יש להזין הערה"),
});

export type RejectDocumentFormValues = z.infer<typeof rejectDocumentSchema>;
