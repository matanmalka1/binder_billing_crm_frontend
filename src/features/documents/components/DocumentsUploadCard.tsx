import { useRef, useState } from "react";
import { CloudUpload, X } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Select } from "../../../components/ui/inputs/Select";
import type { UploadDocumentPayload } from "../api";
import type { BusinessResponse } from "@/features/clients";
import {
  documentsUploadDefaultValues,
  documentsUploadSchema,
  type DocumentsUploadFormValues,
} from "../schemas";
import { DOC_TYPE_LABELS } from "../documents.constants";
import { formatFileSize } from "../../../utils/utils";
import { Button } from "../../../components/ui/primitives/Button";

const ACCEPTED_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "image/jpeg",
  "image/png",
];
const MAX_SIZE_BYTES = 10 * 1024 * 1024;

const CURRENT_YEAR = new Date().getFullYear();
const TAX_YEARS = Array.from({ length: 7 }, (_, i) => CURRENT_YEAR - i);

interface DocumentsUploadCardProps {
  businesses: BusinessResponse[];
  businessesLoading: boolean;
  submitUpload: (payload: {
    document_type: UploadDocumentPayload["document_type"];
    business_id?: number | null;
    file: File;
    tax_year?: number | null;
  }) => Promise<boolean>;
  uploadError: string | null;
  uploading: boolean;
  initialTaxYear?: number | null;
  formId: string;
  onSuccess?: () => void;
}

export const DocumentsUploadCard: React.FC<DocumentsUploadCardProps> = ({
  businesses,
  businessesLoading,
  submitUpload,
  uploadError,
  uploading,
  initialTaxYear,
  formId,
  onSuccess,
}) => {
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
    setValue,
    watch,
  } = useForm<DocumentsUploadFormValues>({
    defaultValues: {
      ...documentsUploadDefaultValues,
      tax_year: initialTaxYear ?? null,
    },
    resolver: zodResolver(documentsUploadSchema),
  });

  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const selectedFile = watch("file");
  const selectedDocType = watch("document_type");
  const selectedBusinessId = watch("business_id");
  const selectedTaxYear = watch("tax_year");
  const canSubmit = Boolean(selectedDocType && selectedFile);

  const applyFile = (file: File) => {
    setFileError(null);
    if (file.size > MAX_SIZE_BYTES) {
      setFileError(`הקובץ גדול מדי: ${formatFileSize(file.size)}. המקסימום הוא 10MB`);
      return;
    }
    if (!ACCEPTED_MIME_TYPES.includes(file.type)) {
      setFileError("סוג הקובץ אינו נתמך. מותרים: PDF, Word, Excel, JPEG, PNG");
      return;
    }
    setValue("file", file, { shouldValidate: true });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) applyFile(file);
  };

  const onSubmit = handleSubmit(async (values) => {
    if (!values.file) return;
    const uploaded = await submitUpload({
      document_type: values.document_type,
      business_id: values.business_id,
      file: values.file,
      tax_year: values.tax_year ?? null,
    });
    if (uploaded) {
      reset({ ...documentsUploadDefaultValues, tax_year: initialTaxYear ?? null });
      setFileError(null);
      onSuccess?.();
    }
  });

  const showBusinessSelect = businesses.length > 1;

  return (
    <form id={formId} onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Select
          label="סוג מסמך"
          error={errors.document_type?.message}
          {...register("document_type")}
        >
          <option value="" disabled>בחר סוג מסמך</option>
          {Object.entries(DOC_TYPE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </Select>

        <Select
          label="שנת מס (אופציונלי)"
          value={selectedTaxYear ?? ""}
          onChange={(e) =>
            setValue("tax_year", e.target.value ? Number(e.target.value) : null)
          }
        >
          <option value="">ללא שנה</option>
          {TAX_YEARS.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </Select>

        {showBusinessSelect && (
          <Select
            label="שיוך עסקי"
            value={selectedBusinessId ?? ""}
            onChange={(e) =>
              setValue("business_id", e.target.value ? Number(e.target.value) : null)
            }
            disabled={businessesLoading}
          >
            <option value="">מסמך כללי ללקוח</option>
            {businesses.map((b) => (
              <option key={b.id} value={b.id}>
                {b.business_name ?? `עסק #${b.id}`}
              </option>
            ))}
          </Select>
        )}
      </div>

      {/* File picker */}
      <div className="space-y-2">
        <span className="block text-sm font-medium text-gray-700">קובץ</span>
        <div
          role="button"
          tabIndex={0}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={[
            "flex min-h-16 cursor-pointer flex-col gap-2 rounded-xl border-2 border-dashed px-3 py-3 text-right transition-colors sm:flex-row sm:items-center sm:justify-between",
            isDragging
              ? "border-primary-400 bg-primary-50"
              : selectedFile
              ? "border-positive-400 bg-positive-50"
              : "border-gray-200 bg-gray-50 hover:border-primary-300 hover:bg-gray-100",
          ].join(" ")}
        >
          {selectedFile ? (
            <>
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                <span className="max-w-sm truncate">{selectedFile.name}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setValue("file", null, { shouldValidate: false });
                    setFileError(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="rounded-full p-0.5 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
                  aria-label="הסר קובץ"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span>{formatFileSize(selectedFile.size)}</span>
                <span className="font-medium text-positive-700">מוכן להעלאה</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-400 shadow-sm">
                  <CloudUpload className="h-4 w-4" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-gray-700">גרור קובץ לכאן או לחץ לבחירה</p>
                  <p className="text-[11px] text-gray-400">PDF, Word, Excel, תמונות · עד 10MB</p>
                </div>
              </div>
              <span className="text-[11px] font-medium text-primary-700">בחירת קובץ</span>
            </>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.xlsx,.xls,.jpg,.jpeg,.png"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) applyFile(file);
            e.target.value = "";
          }}
        />
        {(fileError || errors.file?.message) && (
          <p className="text-xs text-negative-600">{fileError ?? errors.file?.message}</p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="submit"
          isLoading={uploading}
          loadingLabel="מעלה..."
          disabled={!canSubmit}
          className="gap-2 shrink-0"
        >
          העלה
        </Button>
        {uploadError && <p className="text-sm text-negative-600">{uploadError}</p>}
      </div>
    </form>
  );
};

DocumentsUploadCard.displayName = "DocumentsUploadCard";
