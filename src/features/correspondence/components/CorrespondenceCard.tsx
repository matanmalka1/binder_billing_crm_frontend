import { useState } from "react";
import { MessageSquare, Plus } from "lucide-react";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { ErrorCard } from "../../../components/ui/ErrorCard";
import { EmptyState } from "../../../components/ui/EmptyState";
import { CorrespondenceEntryItem } from "./CorrespondenceEntry";
import { CorrespondenceModal } from "./CorrespondenceModal";
import { useCorrespondence } from "../hooks/useCorrespondence";
import type { CorrespondenceEntry } from "../../../api/correspondence.api";
import type { CorrespondenceFormValues } from "../schemas";

interface CorrespondenceCardProps {
  clientId: number;
}

export const CorrespondenceCard = ({ clientId }: CorrespondenceCardProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<CorrespondenceEntry | null>(null);

  const {
    entries,
    total,
    isLoading,
    error,
    createEntry,
    isCreating,
    updateEntry,
    isUpdating,
    deleteEntry,
    deletingId,
    contacts,
  } = useCorrespondence(clientId);

  const handleSubmit = async (data: CorrespondenceFormValues) => {
    if (editing) {
      await updateEntry(editing.id, { ...data, notes: data.notes || null });
    } else {
      await createEntry(data);
    }
    setModalOpen(false);
    setEditing(null);
  };

  const handleEdit = (entry: CorrespondenceEntry) => {
    setEditing(entry);
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setEditing(null);
  };

  return (
    <>
      <Card
        title="יומן תקשורת עם רשויות"
        subtitle={total > 0 ? `${total} רשומות` : undefined}
        actions={
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setModalOpen(true)}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            הוסף רשומה
          </Button>
        }
      >
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
          <div className="relative mt-2">
            <div className="absolute right-[18px] top-0 bottom-0 w-px bg-gray-200" />
            <ul className="space-y-1">
              {entries.map((entry) => (
                <CorrespondenceEntryItem
                  key={entry.id}
                  entry={entry}
                  isDeleting={deletingId === entry.id}
                  onEdit={handleEdit}
                  onDelete={deleteEntry}
                />
              ))}
            </ul>
          </div>
        )}
      </Card>

      <CorrespondenceModal
        open={modalOpen}
        isCreating={isCreating || isUpdating}
        onClose={handleClose}
        onSubmit={handleSubmit}
        existing={editing}
        contacts={contacts}
      />
    </>
  );
};

CorrespondenceCard.displayName = "CorrespondenceCard";
