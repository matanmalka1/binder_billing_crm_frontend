import { Send, RotateCcw } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { canMarkReadyForReview, canFile, canSendBack } from "../utils";

interface VatActionButtonsProps {
  status: string;
  isAdvisor: boolean;
  isLoading: boolean;
  onReadyForReview: () => void;
  onFile: () => void;
  onSendBack: () => void;
}

export const VatActionButtons: React.FC<VatActionButtonsProps> = ({
  status,
  isAdvisor,
  isLoading,
  onReadyForReview,
  onFile,
  onSendBack,
}) => {
  const showReadyForReview = canMarkReadyForReview(status);
  const showFile = isAdvisor && canFile(status);
  const showSendBack = isAdvisor && canSendBack(status);

  if (!showReadyForReview && !showFile && !showSendBack) return null;

  return (
    <div className="flex flex-wrap items-center gap-2" dir="rtl">
      {showReadyForReview && (
        <Button variant="primary" size="sm" isLoading={isLoading} onClick={onReadyForReview}>
          <Send className="h-4 w-4" />
          שלח לבדיקה
        </Button>
      )}
      {showFile && (
        <Button variant="primary" size="sm" isLoading={isLoading} onClick={onFile}>
          <Send className="h-4 w-4" />
          הגש מע&quot;מ
        </Button>
      )}
      {showSendBack && (
        <Button
          variant="outline"
          size="sm"
          isLoading={isLoading}
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
