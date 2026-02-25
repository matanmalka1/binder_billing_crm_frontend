import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";

// UseFormRegister is contravariant on its type parameter, making shared generics
// impractical across schemas with optional fields. The any cast is isolated here
// at the UI boundary — no logic, no validation, just rendering.
/* eslint-disable @typescript-eslint/no-explicit-any */
type AnyRegister = (name: string, options?: any) => any;
type AnyErrors = Record<string, any>;
/* eslint-enable @typescript-eslint/no-explicit-any */

interface UserFormFieldsProps {
  register: AnyRegister;
  errors: AnyErrors;
  showPassword?: boolean;
}

const fieldError = (errors: AnyErrors, name: string): string | undefined => {
  const message = errors[name]?.message;
  return typeof message === "string" ? message : undefined;
};

export const UserFormFields: React.FC<UserFormFieldsProps> = ({
  register,
  errors,
  showPassword = false,
}) => (
  <div className="space-y-4">
    <Input
      label="שם מלא *"
      {...register("full_name")}
      error={fieldError(errors, "full_name")}
      placeholder="ישראל ישראלי"
    />
    <Input
      label="אימייל *"
      type="email"
      {...register("email")}
      error={fieldError(errors, "email")}
      placeholder="user@example.com"
    />
    <Input
      label="טלפון"
      {...register("phone")}
      error={fieldError(errors, "phone")}
      placeholder="050-0000000"
    />
    <Select
      label="תפקיד *"
      {...register("role")}
      error={fieldError(errors, "role")}
    >
      <option value="secretary">מזכירה</option>
      <option value="advisor">יועץ</option>
    </Select>
    {showPassword && (
      <Input
        label="סיסמה *"
        type="password"
        {...register("password")}
        error={fieldError(errors, "password")}
        placeholder="לפחות 8 תווים"
      />
    )}
  </div>
);

UserFormFields.displayName = "UserFormFields";
