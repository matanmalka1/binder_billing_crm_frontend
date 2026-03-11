import { Check, Pencil, Trash2, X } from "lucide-react";
import type { AnnexDataLine } from "../../../../api/annualReport.api";
import type { FieldDef } from "../../annex.constants";

interface AnnexDataTableProps {
  lines: AnnexDataLine[];
  fields: FieldDef[];
  editingLineId: number | null;
  formData: Record<string, string>;
  isUpdating: boolean;
  isDeleting: boolean;
  onFormChange: (key: string, value: string) => void;
  onStartEdit: (line: AnnexDataLine) => void;
  onCancelEdit: () => void;
  onSaveEdit: (lineId: number) => void;
  onDelete: (lineId: number) => void;
}

export const AnnexDataTable: React.FC<AnnexDataTableProps> = ({
  lines,
  fields,
  editingLineId,
  formData,
  isUpdating,
  isDeleting,
  onFormChange,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onDelete,
}) => (
  <div className="overflow-x-auto">
    <table className="w-full text-xs">
      <thead>
        <tr className="text-gray-500 border-b">
          {fields.map((field) => (
            <th key={field.key} className="text-right py-1 px-2 font-medium">
              {field.label}
            </th>
          ))}
          <th />
        </tr>
      </thead>
      <tbody>
        {lines.map((line) => {
          const isEditing = editingLineId === line.id;
          return (
            <tr key={line.id} className="border-b border-gray-100 hover:bg-gray-50">
              {fields.map((field) => (
                <td key={field.key} className="py-1 px-2 text-gray-700">
                  {isEditing ? (
                    <input
                      type={field.type === "date" ? "date" : field.type === "number" ? "number" : "text"}
                      value={formData[field.key] ?? ""}
                      onChange={(event) => onFormChange(field.key, event.target.value)}
                      className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
                    />
                  ) : (
                    String((line.data as Record<string, unknown>)[field.key] ?? "")
                  )}
                </td>
              ))}
              <td className="py-1 px-2">
                <div className="flex items-center gap-1">
                  {isEditing ? (
                    <>
                      <button
                        type="button"
                        onClick={() => onSaveEdit(line.id)}
                        disabled={isUpdating}
                        className="text-green-500 hover:text-green-700"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={onCancelEdit}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      aria-label="עריכת שורה"
                      onClick={() => onStartEdit(line)}
                      className="text-blue-400 hover:text-blue-600"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onDelete(line.id)}
                    disabled={isDeleting}
                    className="text-red-400 hover:text-red-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

AnnexDataTable.displayName = "AnnexDataTable";
