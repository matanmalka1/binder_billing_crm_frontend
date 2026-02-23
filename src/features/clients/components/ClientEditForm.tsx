import { useForm } from "react-hook-form";
import { format, parseISO } from "date-fns";
import { he } from "date-fns/locale";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import type { ClientResponse, UpdateClientPayload } from "../../../api/clients.api";
import { clientEditSchema, type ClientEditFormValues } from "../schemas";

interface Props {
  client: ClientResponse;
  onSave: (data: UpdateClientPayload) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const ClientEditForm: React.FC<Props> = ({ client, onSave, onCancel, isLoading = false }) => {
  const { register, handleSubmit, formState: { errors, isDirty } } = useForm<ClientEditFormValues>({
    resolver: zodResolver(clientEditSchema),
    defaultValues: {
      full_name: client.full_name,
      phone: client.phone || "",
      email: client.email || "",
      status: client.status as "active" | "frozen" | "closed",
      notes: "",
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    const payload: UpdateClientPayload = {
      ...data,
      phone: data.phone ? data.phone : null,
      email: data.email ? data.email : null,
      notes: data.notes ? data.notes : null,
    };
    await onSave(payload);
  });

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">מידע בסיסי</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input label="שם מלא *" error={errors.full_name?.message} disabled={isLoading} {...register("full_name")} />
          <Select label="סטטוס *" error={errors.status?.message} disabled={isLoading} {...register("status")}>
            <option value="active">פעיל</option>
            <option value="frozen">מוקפא</option>
            <option value="closed">סגור</option>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">פרטי התקשרות</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input label="טלפון" type="tel" placeholder="050-1234567" error={errors.phone?.message} disabled={isLoading} {...register("phone")} />
          <Input label="אימייל" type="email" placeholder="הזן כתובת אימייל" error={errors.email?.message} disabled={isLoading} {...register("email")} />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">הערות</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">הערות לעדכון (אופציונלי)</label>
          <textarea rows={4} className="w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="הוסף הערות על העדכון..." disabled={isLoading} {...register("notes")} />
          {errors.notes && (<p className="mt-1 text-xs text-red-600">{errors.notes.message}</p>)}
        </div>
      </div>

      <div className="rounded-lg bg-gray-50 p-4 border border-gray-200">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">מידע שאינו ניתן לעריכה</h4>
        <div className="grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
          <div><span className="text-gray-600">מזהה לקוח:</span> <span className="font-medium">#{client.id}</span></div>
          <div><span className="text-gray-600">מספר זהות/ח.פ:</span> <span className="font-medium">{client.id_number}</span></div>
          <div><span className="text-gray-600">סוג לקוח:</span> <span className="font-medium">{client.client_type}</span></div>
          <div><span className="text-gray-600">תאריך פתיחה:</span> <span className="font-medium">{format(parseISO(client.opened_at), "d.M.yyyy", { locale: he })}</span></div>
        </div>
        <p className="mt-2 text-xs text-gray-500">שדות אלה לא ניתנים לעריכה. לשינויים, פנה למנהל המערכת.</p>
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>ביטול</Button>
        <Button type="submit" variant="primary" isLoading={isLoading} disabled={isLoading || !isDirty}>שמור שינויים</Button>
      </div>

      {!isDirty && (<p className="text-sm text-gray-500 text-center">לא בוצעו שינויים בטופס</p>)}
    </form>
  );
};
