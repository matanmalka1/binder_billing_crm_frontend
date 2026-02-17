import { useState } from "react";
import { MessageSquare, Plus } from "lucide-react";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { ErrorCard } from "../../../components/ui/ErrorCard";
import { CorrespondenceEntryItem } from "./CorrespondenceEntry";
import { CorrespondenceModal } from "./CorrespondenceModal";
import { useCorrespondence } from "../hooks/useCorrespondence";

interface Props {
  clientId: number;
}

export const CorrespondenceCard: React.FC<Props> = ({ clientId }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const { entries, isLoading, error, createEntry, isCreating } =
    useCorrespondence(clientId);

  return (
    <>
      <Card
        title="יומן תקשורת עם רשויות"
        subtitle={`${entries.length} רשומות`}
      >
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => setModalOpen(true)}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              הוסף רשומה
            </Button>
          </div>

          {error && <ErrorCard message={error} />}

          {isLoading ? (
            <p className="text-sm text-gray-500 text-center py-4">טוען...</p>
          ) : entries.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8 text-gray-400">
              <MessageSquare className="h-10 w-10" />
              <p className="text-sm">אין רשומות תקשורת עדיין</p>
            </div>
          ) : (
            <div className="relative">
              <div className="absolute top-0 bottom-0 right-5 w-0.5 bg-gray-200" />
              <ul className="space-y-4">
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
        onClose={() => setModalOpen(false)}
        onSubmit={async (data) => {
          await createEntry(data);
          setModalOpen(false);
        }}
        isCreating={isCreating}
      />
    </>
  );
};
