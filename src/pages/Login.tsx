import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import {
  loginDefaultValues,
  loginSchema,
  type LoginFormValues,
} from "../features/auth/schemas";
import { useAuthStore } from "../store/auth.store";

export const Login: React.FC = () => {
  const { login, isAuthenticated, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<LoginFormValues>({
    defaultValues: loginDefaultValues,
    resolver: zodResolver(loginSchema),
  });

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const onSubmit = handleSubmit(async (values) => {
    clearError();

    await login(values.email, values.password);

    if (useAuthStore.getState().isAuthenticated) {
      navigate("/");
    }
  });

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <Card className="w-full max-w-md" title="כניסה למערכת">
        <form onSubmit={onSubmit} className="space-y-4">
          <Input
            label="דוא״ל"
            type="email"
            placeholder="הכנס כתובת דוא״ל"
            error={errors.email?.message}
            disabled={isLoading}
            {...register("email")}
          />

          <Input
            label="סיסמה"
            type="password"
            placeholder="הכנס סיסמה"
            error={errors.password?.message}
            disabled={isLoading}
            {...register("password")}
          />

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            isLoading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? "מתחבר..." : "כניסה"}
          </Button>
        </form>
      </Card>
    </div>
  );
};
