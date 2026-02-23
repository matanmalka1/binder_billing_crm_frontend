import { useState } from "react";
import { MessageSquare, Plus } from "lucide-react";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { ErrorCard } from "../../../components/ui/ErrorCard";
import { EmptyState } from "../../../components/ui/EmptyState";
import { CorrespondenceEntryItem } from "./CorrespondenceEntry";
import { CorrespondenceModal } from "./CorrespondenceModal";
import { useCorrespondence } from "../hooks/useCorrespondence";

interface CorrespondenceCardProps {
  clientId: number;
}

export const CorrespondenceCard = ({ clientId }: CorrespondenceCardProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const { entries, total, isLoading, error, createEntry, isCreating } =
    useCorrespondence(clientId);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const handleSubmit = async (data: Parameters<typeof createEntry>[0]) => {
    await createEntry(data);
    setModalOpen(false);
  };

  return (
    <>
      <Card
        title="יומן תקשורת עם רשויות"
        subtitle={total > 0 ? `${total} רשומות` : undefined}
      >
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleOpenModal}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              הוסף רשומה
            </Button>
          </div>

          {error && <ErrorCard message={error} />}

          {isLoading && (
            <p className="py-4 text-center text-sm text-gray-500">טוען...</p>
          )}

          {!isLoading && entries.length === 0 && (
            <EmptyState
              icon={MessageSquare}
              message="אין רשומות תקשורת עדיין — הוסף את הרשומה הראשונה"
              variant="minimal"
            />
          )}

          {!isLoading && entries.length > 0 && (
            <div className="relative">
              {/* Timeline vertical line */}
              <div className="absolute right-[18px] top-0 bottom-0 w-px bg-gray-200" />
              <ul className="space-y-1">
                {entries.map((entry) => (
                  <CorrespondenceEntryItem key={entry.id} entry={entry} />
                ))}
              </ul>
            </div>
          )}
        </div>
      </Card>

      <CorrespondenceModal
        open={modalOpen}
        isCreating={isCreating}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
      />
    </>
  );
};

CorrespondenceCard.displayName = "CorrespondenceCard";
