import { useRef, useState } from "react";
import { CloudUpload, X } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "../../../components/ui/primitives/Button";
import { Select } from "../../../components/ui/inputs/Select";
import { Input } from "../../../components/ui/inputs/Input";
import type { UploadDocumentPayload } from "../api";
import {
  documentsUploadDefaultValues,
  documentsUploadSchema,
  type DocumentsUploadFormValues,
} from "../schemas";
import { DOC_TYPE_LABELS } from "../documents.constants";
import { formatFileSize } from "../../../utils/utils";

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

  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const selectedFile = watch("file");
  const annualReportIdValue = watch("annual_report_id");

  const applyFile = (file: File) => {
    setFileError(null);
    if (file.size > MAX_SIZE_BYTES) {
      setFileError("גודל הקובץ חורג מהמותר (מקסימום 10MB)");
      return;
    }
    if (!ACCEPTED_MIME_TYPES.includes(file.type)) {
      setFileError("סוג הקובץ אינו נתמך");
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
      file: values.file,
      tax_year: selectedTaxYear ?? null,
      notes: values.notes ?? null,
      annual_report_id: values.annual_report_id ?? null,
    });
    if (uploaded) {
      reset(documentsUploadDefaultValues);
      setFileError(null);
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Row 1: doc type + notes */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Select
          label="סוג מסמך"
          error={errors.document_type?.message}
          {...register("document_type")}
        >
          {Object.entries(DOC_TYPE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </Select>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">הערות</label>
          <textarea
            {...register("notes")}
            placeholder="הערות"
            rows={2}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 resize-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:outline-none"
          />
        </div>

        {showAnnualReportField && (
          <Input
            label='מזהה דו"ח שנתי'
            type="number"
            value={annualReportIdValue ?? ""}
            onChange={(e) =>
              setValue("annual_report_id", e.target.value ? Number(e.target.value) : null)
            }
          />
        )}
      </div>

      {/* Row 2: full-width drop zone */}
      <div className="space-y-1.5">
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
            "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed py-10 text-center transition-colors",
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
              <span className="text-xs text-gray-400">{formatFileSize(selectedFile.size)}</span>
            </>
          ) : (
            <>
              <CloudUpload className="h-10 w-10 text-gray-300" />
              <div className="space-y-0.5">
                <p className="text-sm font-medium text-gray-700">גרור קובץ לכאן או לחץ לבחירה</p>
                <p className="text-xs text-gray-400">PDF, Word, Excel, תמונות · עד 10MB</p>
              </div>
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

      <div className="flex items-center gap-4">
        <Button type="submit" isLoading={uploading} className="gap-2 shrink-0">
          העלאה
        </Button>
        {uploadError && <p className="text-sm text-negative-600">{uploadError}</p>}
      </div>
    </form>
  );
};

DocumentsUploadCard.displayName = "DocumentsUploadCard";
