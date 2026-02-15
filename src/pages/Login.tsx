import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
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
  const { login, isAuthenticated, isLoading, error, clearError } =
    useAuthStore();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

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
    await login(values.email, values.password, rememberMe);

    if (useAuthStore.getState().isAuthenticated) {
      navigate("/");
    }
  });

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-gray-200">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              ברוכים הבאים
            </h1>
            <p className="text-gray-600 text-sm">התחבר לחשבון שלך כדי להמשיך</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            <Input
              label="כתובת אימייל"
              type="email"
              placeholder="name@company.com"
              disabled={isLoading}
              error={errors.email?.message}
              leftIcon={<Mail className="w-5 h-5" />}
              {...register("email")}
            />

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  שכחת סיסמה?
                </button>
                <label className="block text-sm font-medium text-gray-700">
                  סיסמה
                </label>
              </div>
              
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="הזן את הסיסמה שלך"
                disabled={isLoading}
                error={errors.password?.message}
                leftIcon={<Lock className="w-5 h-5" />}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                }
                {...register("password")}
              />
            </div>

            {/* Remember Me */}
            <div className="flex">
              <label className="flex flex-row-reverse items-center gap-2 cursor-pointer text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span>זכור אותי במכשיר זה</span>
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600 text-right">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full py-3 text-base font-semibold shadow-lg hover:shadow-xl transition-shadow"
              isLoading={isLoading}
              disabled={isLoading}
            >
              {isLoading ? "מתחבר..." : "התחברות"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};
