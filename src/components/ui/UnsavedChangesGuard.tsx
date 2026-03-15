import { OverlayContainer } from "./OverlayContainer";

interface UnsavedChangesGuardProps {
  onContinue: () => void;
  onDiscard: () => void;
}

export const UnsavedChangesGuard: React.FC<UnsavedChangesGuardProps> = ({
  onContinue,
  onDiscard,
}) => (
  <OverlayContainer open variant="dialog">
    <h3 className="mb-2 text-base font-semibold text-gray-900">לבטל שינויים?</h3>
    <p className="mb-4 text-sm text-gray-600">יש שינויים שלא נשמרו. האם לסגור בכל זאת?</p>
    <div className="flex items-center justify-end gap-2">
      <button
        type="button"
        onClick={onContinue}
        className="rounded-md border border-gray-300 px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        המשך עריכה
      </button>
      <button
        type="button"
        onClick={onDiscard}
        className="rounded-md bg-red-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-red-700"
      >
        סגור בלי לשמור
      </button>
    </div>
  </OverlayContainer>
);

UnsavedChangesGuard.displayName = "UnsavedChangesGuard";
