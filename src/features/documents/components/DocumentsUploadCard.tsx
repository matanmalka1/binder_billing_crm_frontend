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
  }) => Promise<boolean>;
  uploadError: string | null;
  uploading: boolean;
}

export const DocumentsUploadCard: React.FC<DocumentsUploadCardProps> = ({
  submitUpload,
  uploadError,
  uploading,
}) => {
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
    setValue,
  } = useForm<DocumentsUploadFormValues>({
    defaultValues: documentsUploadDefaultValues,
    resolver: zodResolver(documentsUploadSchema),
  });

  const onSubmit = handleSubmit(async (values) => {
    if (!values.file) return;
    const uploaded = await submitUpload({ document_type: values.document_type, file: values.file });
    if (uploaded) reset(documentsUploadDefaultValues);
  });

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="border-b border-gray-100 bg-gray-50 px-4 py-3">
        <p className="text-sm font-semibold text-gray-700">העלאת מסמך</p>
      </div>
      <form onSubmit={onSubmit} className="p-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Select
            label="סוג מסמך"
            error={errors.document_type?.message}
            {...register("document_type")}
          >
            <option value="id_copy">צילום תעודה מזהה</option>
            <option value="power_of_attorney">ייפוי כוח</option>
            <option value="engagement_agreement">הסכם התקשרות</option>
          </Select>

          <label className="space-y-1">
            <span className="block text-sm font-medium text-gray-700">קובץ</span>
            <input
              type="file"
              onChange={(e) => setValue("file", e.target.files?.[0] ?? null, { shouldValidate: true })}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 transition-colors file:mr-3 file:rounded file:border-0 file:bg-gray-100 file:px-2 file:py-1 file:text-xs file:font-medium file:text-gray-600 hover:border-gray-300"
            />
            {errors.file?.message && (
              <p className="text-xs text-red-600">{errors.file.message}</p>
            )}
          </label>

          <div className="flex items-end">
            <Button
              type="submit"
              isLoading={uploading}
              className="w-full gap-2"
            >
              <Upload className="h-4 w-4" />
              העלאה
            </Button>
          </div>
        </div>

        {uploadError && (
          <p className="mt-3 text-sm text-red-600">{uploadError}</p>
        )}
      </form>
    </div>
  );
};
