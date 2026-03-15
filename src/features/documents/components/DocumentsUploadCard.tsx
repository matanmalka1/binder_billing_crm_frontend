import { Upload } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "../../../components/ui/Button";
import { Select } from "../../../components/ui/Select";
import type { UploadDocumentPayload } from "../../../api/documents.api";
import {
  documentsUploadDefaultValues,
  documentsUploadSchema,
  type DocumentsUploadFormValues,
} from "../schemas";
import { DOC_TYPE_LABELS } from "../documents.constants";

interface DocumentsUploadCardProps {
  submitUpload: (payload: {
    document_type: UploadDocumentPayload["document_type"];
    file: File;
    tax_year?: number | null;
    notes?: string | null;
    annual_report_id?: number | null;
  }) => Promise<boolean>;
  uploadError: string | null;
  uploading: boolean;
  selectedTaxYear: number | null;
  showAnnualReportField?: boolean;
}

export const DocumentsUploadCard: React.FC<DocumentsUploadCardProps> = ({
  submitUpload,
  uploadError,
  uploading,
  selectedTaxYear,
  showAnnualReportField = false,
}) => {
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
    setValue,
    watch,
  } = useForm<DocumentsUploadFormValues>({
    defaultValues: documentsUploadDefaultValues,
    resolver: zodResolver(documentsUploadSchema),
  });

  const onSubmit = handleSubmit(async (values) => {
    if (!values.file) return;
    const uploaded = await submitUpload({
      document_type: values.document_type,
      file: values.file,
      tax_year: selectedTaxYear ?? null,
      notes: values.notes ?? null,
      annual_report_id: values.annual_report_id ?? null,
    });
    if (uploaded) reset(documentsUploadDefaultValues);
  });

  const annualReportIdValue = watch("annual_report_id");

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-3 sm:items-end">
        <div className="min-w-0 flex-1">
          <Select
            label="סוג מסמך"
            error={errors.document_type?.message}
            {...register("document_type")}
          >
            {Object.entries(DOC_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </Select>
        </div>

        <div className="min-w-0 flex-1 space-y-1">
          <span className="block text-sm font-medium text-gray-700">קובץ</span>
          <input
            type="file"
            onChange={(e) => setValue("file", e.target.files?.[0] ?? null, { shouldValidate: true })}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 transition-colors file:mr-3 file:rounded file:border-0 file:bg-gray-100 file:px-2 file:py-1 file:text-xs file:font-medium file:text-gray-600 hover:border-gray-300"
          />
          {errors.file?.message && (
            <p className="text-xs text-red-600">{errors.file.message}</p>
          )}
        </div>

        <Button type="submit" isLoading={uploading} className="shrink-0 gap-2 sm:mb-0.5">
          <Upload className="h-4 w-4" />
          העלאה
        </Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="min-w-0 flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">הערות</label>
          <textarea
            {...register("notes")}
            placeholder="הערות"
            rows={2}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 resize-none"
          />
        </div>

        {showAnnualReportField && (
          <div className="min-w-0 w-40 space-y-1">
            <label className="block text-sm font-medium text-gray-700">מזהה דו"ח שנתי</label>
            <input
              type="number"
              value={annualReportIdValue ?? ""}
              onChange={(e) =>
                setValue("annual_report_id", e.target.value ? Number(e.target.value) : null)
              }
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700"
            />
          </div>
        )}
      </div>

      {uploadError && (
        <p className="text-sm text-red-600">{uploadError}</p>
      )}
    </form>
  );
};

DocumentsUploadCard.displayName = "DocumentsUploadCard";
