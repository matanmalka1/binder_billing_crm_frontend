import { Check, Pencil, Trash2, X } from "lucide-react";
import { Input } from "../../../../components/ui/inputs/Input";
import { Button } from "../../../../components/ui/primitives/Button";
import type { AnnexDataLine } from "../../api";
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
                    <Input
                      type={field.type === "date" ? "date" : field.type === "number" ? "number" : "text"}
                      value={formData[field.key] ?? ""}
                      onChange={(event) => onFormChange(field.key, event.target.value)}
                      className="py-1 text-xs"
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
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => onSaveEdit(line.id)}
                        disabled={isUpdating}
                        className="p-0.5 text-positive-500 hover:text-positive-700 hover:bg-transparent"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={onCancelEdit}
                        className="p-0.5 text-gray-500 hover:text-gray-700 hover:bg-transparent"
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </>
                  ) : (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      aria-label="עריכת שורה"
                      onClick={() => onStartEdit(line)}
                      className="p-0.5 text-info-400 hover:text-info-600 hover:bg-transparent"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(line.id)}
                    disabled={isDeleting}
                    className="p-0.5 text-negative-400 hover:text-negative-600 hover:bg-transparent"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
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
