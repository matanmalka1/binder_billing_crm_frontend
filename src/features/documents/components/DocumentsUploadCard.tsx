import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
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
    if (!values.file) {
      return;
    }
    const uploaded = await submitUpload({
      document_type: values.document_type,
      file: values.file,
    });
    if (uploaded) {
      reset(documentsUploadDefaultValues);
    }
  });

  return (
    <Card title="העלאת מסמך">
      <form onSubmit={onSubmit} className="grid grid-cols-1 gap-3 md:grid-cols-4">
        <Select
          label="סוג מסמך"
          error={errors.document_type?.message}
          {...register("document_type")}
        >
          <option value="id_copy">צילום תעודה מזהה</option>
          <option value="power_of_attorney">ייפוי כוח</option>
          <option value="engagement_agreement">הסכם התקשרות</option>
        </Select>
        <label className="space-y-1 md:col-span-2">
          <span className="block text-sm font-medium text-gray-700">קובץ</span>
          <input
            type="file"
            onChange={(event) => {
              setValue("file", event.target.files?.[0] ?? null, { shouldValidate: true });
            }}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
          {errors.file?.message && <p className="text-xs text-red-600">{errors.file.message}</p>}
        </label>
        <div className="flex items-end">
          <Button type="submit" isLoading={uploading}>
            העלאה
          </Button>
        </div>
        {uploadError && <p className="text-sm text-red-600 md:col-span-4">{uploadError}</p>}
      </form>
    </Card>
  );
};
