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

interface DocumentsUploadCardProps {
  submitUpload: (payload: {
    document_type: UploadDocumentPayload["document_type"];
    file: File;
    tax_year?: number | null;
  }) => Promise<boolean>;
  uploadError: string | null;
  uploading: boolean;
  taxYears: number[];
}

export const DocumentsUploadCard: React.FC<DocumentsUploadCardProps> = ({
  submitUpload,
  uploadError,
  uploading,
  taxYears,
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
      tax_year: values.tax_year ?? null,
    });
    if (uploaded) reset(documentsUploadDefaultValues);
  });

  const taxYearValue = watch("tax_year");

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2 sm:flex-row sm:items-end sm:gap-3">
      <div className="min-w-0 flex-1">
        <Select
          label="סוג מסמך"
          error={errors.document_type?.message}
          {...register("document_type")}
        >
          <option value="id_copy">צילום תעודה מזהה</option>
          <option value="power_of_attorney">ייפוי כוח</option>
          <option value="engagement_agreement">הסכם התקשרות</option>
        </Select>
      </div>

      <div className="min-w-0 flex-1 space-y-1">
        <label className="block text-sm font-medium text-gray-700">שנת מס</label>
        <select
          value={taxYearValue ?? ""}
          onChange={(e) => setValue("tax_year", e.target.value ? Number(e.target.value) : null)}
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700"
        >
          <option value="">ללא שנה</option>
          {taxYears.map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
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

      {uploadError && (
        <p className="mt-2 text-sm text-red-600 sm:col-span-3">{uploadError}</p>
      )}
    </form>
  );
};

DocumentsUploadCard.displayName = "DocumentsUploadCard";
