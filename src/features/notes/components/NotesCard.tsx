import { useState } from "react";
import { StickyNote, Pencil, Trash2, Plus, X, Check } from "lucide-react";
import { Card } from "@/components/ui/primitives/Card";
import { Button } from "@/components/ui/primitives/Button";
import { Alert } from "@/components/ui/overlays/Alert";
import { StateCard } from "@/components/ui/feedback/StateCard";
import { ConfirmDialog } from "@/components/ui/overlays/ConfirmDialog";
import { Textarea } from "@/components/ui/inputs/Textarea";
import type { EntityNote } from "../api";
import { formatDate } from "@/utils/utils";

export interface NotesHookResult {
  notes: EntityNote[];
  total: number;
  isLoading: boolean;
  error: string | null;
  addNote: (note: string) => Promise<EntityNote>;
  isAdding: boolean;
  updateNote: (noteId: number, note: string) => Promise<EntityNote>;
  isUpdating: boolean;
  deleteNote: (noteId: number) => void;
  deletingId: number | null;
}

interface NoteRowProps {
  note: EntityNote;
  isDeleting: boolean;
  onEdit: (note: EntityNote) => void;
  onDelete: (id: number) => void;
}

const NoteRow = ({ note, isDeleting, onEdit, onDelete }: NoteRowProps) => (
  <li className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
    <div className="flex-1 min-w-0">
      <p className="text-sm text-gray-800 whitespace-pre-wrap break-words">{note.note}</p>
      <p className="mt-1 text-xs text-gray-400">{formatDate(note.created_at)}</p>
    </div>
    <div className="flex items-center gap-1 shrink-0">
      <button
        type="button"
        onClick={() => onEdit(note)}
        className="p-1 text-gray-400 hover:text-gray-600 rounded"
        title="ערוך"
      >
        <Pencil className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        onClick={() => onDelete(note.id)}
        disabled={isDeleting}
        className="p-1 text-gray-400 hover:text-negative-600 rounded disabled:opacity-50"
        title="מחק"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  </li>
);

interface NotesCardProps {
  hook: NotesHookResult;
  canEdit: boolean;
}

export const NotesCard = ({ hook, canEdit }: NotesCardProps) => {
  const {
    notes, total, isLoading, error,
    addNote, isAdding,
    updateNote, isUpdating,
    deleteNote, deletingId,
  } = hook;

  const [showAdd, setShowAdd] = useState(false);
  const [addText, setAddText] = useState("");
  const [editing, setEditing] = useState<EntityNote | null>(null);
  const [editText, setEditText] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const handleAdd = async () => {
    if (!addText.trim()) return;
    await addNote(addText.trim());
    setAddText("");
    setShowAdd(false);
  };

  const handleEditStart = (note: EntityNote) => {
    setEditing(note);
    setEditText(note.note);
  };

  const handleEditSave = async () => {
    if (!editing || !editText.trim()) return;
    await updateNote(editing.id, editText.trim());
    setEditing(null);
    setEditText("");
  };

  const handleEditCancel = () => {
    setEditing(null);
    setEditText("");
  };

  return (
    <>
      <Card
        title="הערות"
        subtitle={total > 0 ? `${total} הערות` : undefined}
        actions={
          canEdit && !showAdd ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowAdd(true)}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              הוסף הערה
            </Button>
          ) : undefined
        }
      >
        {error && <Alert variant="error" message={error} />}

        {showAdd && (
          <div className="mb-4 space-y-2">
            <Textarea
              rows={3}
              placeholder="הזן הערה..."
              value={addText}
              onChange={(e) => setAddText(e.target.value)}
              disabled={isAdding}
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => { setShowAdd(false); setAddText(""); }}
                disabled={isAdding}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handleAdd}
                isLoading={isAdding}
                disabled={isAdding || !addText.trim()}
              >
                <Check className="h-3.5 w-3.5" />
                שמור
              </Button>
            </div>
          </div>
        )}

        {isLoading && (
          <p className="py-4 text-center text-sm text-gray-500">טוען...</p>
        )}

        {!isLoading && notes.length === 0 && !showAdd && (
          <StateCard icon={StickyNote} message="אין הערות עדיין" variant="minimal" />
        )}

        {!isLoading && notes.length > 0 && (
          <ul className="divide-y divide-gray-100">
            {notes.map((note) =>
              editing?.id === note.id ? (
                <li key={note.id} className="py-3 space-y-2">
                  <Textarea
                    rows={3}
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    disabled={isUpdating}
                    autoFocus
                  />
                  <div className="flex gap-2 justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleEditCancel}
                      disabled={isUpdating}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      onClick={handleEditSave}
                      isLoading={isUpdating}
                      disabled={isUpdating || !editText.trim()}
                    >
                      <Check className="h-3.5 w-3.5" />
                      שמור
                    </Button>
                  </div>
                </li>
              ) : (
                <NoteRow
                  key={note.id}
                  note={note}
                  isDeleting={deletingId === note.id}
                  onEdit={handleEditStart}
                  onDelete={(id) => setConfirmDeleteId(id)}
                />
              )
            )}
          </ul>
        )}
      </Card>

      <ConfirmDialog
        open={confirmDeleteId !== null}
        title="מחיקת הערה"
        message="האם למחוק את ההערה? פעולה זו אינה הפיכה."
        confirmLabel="מחק"
        cancelLabel="ביטול"
        isLoading={deletingId === confirmDeleteId}
        onConfirm={() => {
          if (confirmDeleteId !== null) deleteNote(confirmDeleteId);
          setConfirmDeleteId(null);
        }}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </>
  );
};
