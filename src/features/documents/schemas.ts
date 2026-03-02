import { z } from "zod";
import type { UploadDocumentPayload } from "../../api/documents.api";

export interface DocumentsUploadFormValues {
  document_type: UploadDocumentPayload["document_type"];
  file: File | null;
}

export const documentsUploadSchema = z.object({
  document_type: z.enum(["id_copy", "power_of_attorney", "engagement_agreement"]),
  file: z
    .custom<File | null>((value) => value === null || value instanceof File)
    .refine(
      (file) =>
        file !== null &&
        Object.prototype.toString.call(file) === "[object File]",
      { message: "יש לבחור קובץ לפני העלאה" },
    ),
});

export const documentsUploadDefaultValues: DocumentsUploadFormValues = {
  document_type: "id_copy",
  file: null,
};

