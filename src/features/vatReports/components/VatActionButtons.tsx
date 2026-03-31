import { Send, RotateCcw, PackageCheck } from "lucide-react";
import { Button } from "../../../components/ui/primitives/Button";
import { canMarkReadyForReview, canFile, canSendBack } from "../utils";
import { isClientClosed } from "../../../utils/clientStatus";
import type { VatActionButtonsProps } from "../types";

export const VatActionButtons: React.FC<VatActionButtonsProps> = ({
  status,
  isAdvisor,
  isLoading,
  clientStatus,
  onMaterialsComplete,
  onReadyForReview,
  onFile,
  onSendBack,
}) => {
  const closed = isClientClosed(clientStatus);
  const showMaterialsComplete = status === "pending_materials";
  const showReadyForReview = canMarkReadyForReview(status);
  const showFile = isAdvisor && canFile(status);
  const showSendBack = isAdvisor && canSendBack(status);

  if (!showMaterialsComplete && !showReadyForReview && !showFile && !showSendBack) return null;

  return (
    <div className="flex flex-wrap items-center gap-2" dir="rtl">
      {showMaterialsComplete && (
        <Button variant="primary" size="sm" isLoading={isLoading} disabled={closed} onClick={onMaterialsComplete}>
          <PackageCheck className="h-4 w-4" />
          אישור קבלת חומרים
        </Button>
      )}
      {showReadyForReview && (
        <Button variant="primary" size="sm" isLoading={isLoading} disabled={closed} onClick={onReadyForReview}>
          <Send className="h-4 w-4" />
          שלח לבדיקה
        </Button>
      )}
      {showFile && (
        <Button variant="primary" size="sm" isLoading={isLoading} disabled={closed} onClick={onFile}>
          <Send className="h-4 w-4" />
          הגש מע&quot;מ
        </Button>
      )}
      {showSendBack && (
        <Button
          variant="outline"
          size="sm"
          isLoading={isLoading}
          disabled={closed}
          onClick={onSendBack}
          className="border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100"
        >
          <RotateCcw className="h-4 w-4" />
          החזר לתיקון
        </Button>
      )}
    </div>
  );
};

VatActionButtons.displayName = "VatActionButtons";
