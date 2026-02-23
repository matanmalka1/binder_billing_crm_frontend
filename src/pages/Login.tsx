import { useState } from "react";
import { getYear } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Navigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from "lucide-react";

import {
  loginDefaultValues,
  loginSchema,
  type LoginFormValues,
} from "../features/auth/schemas";
import { useAuthStore } from "../store/auth.store";
import { selectIsAuthenticated } from "../store/auth.selectors";
import { useShallow } from "zustand/react/shallow";

export const Login: React.FC = () => {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const login = useAuthStore((s) => s.login);
  const clearError = useAuthStore((s) => s.clearError);
  const { isLoading, error } = useAuthStore(
    useShallow((s) => ({ isLoading: s.isLoading, error: s.error })),
  );
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

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleRememberMeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRememberMe(e.target.checked);
  };

  const onSubmit = handleSubmit(async (values) => {
    clearError();
    await login(values.email, values.password, rememberMe);
  });

  return (
    <div className="flex min-h-screen overflow-hidden bg-slate-950 text-right" dir="rtl">

      {/* ── Right panel — form ──────────────────────────────────────────── */}
      <div className="relative flex w-full flex-col items-center justify-center px-6 py-12 lg:w-[52%] bg-[#F7F6F2]">

        {/* Subtle top-right corner accent */}
        <div className="pointer-events-none absolute top-0 left-0 h-48 w-48 rounded-br-full bg-slate-100/70" />

        <div className="relative z-10 w-full max-w-md animate-fade-in">

          {/* Logo mark (mobile only — full brand shown on left panel on desktop) */}
          <div className="mb-10 flex items-center gap-3 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white">
              <span className="text-sm font-black tracking-tight">ב</span>
            </div>
            <span className="text-lg font-bold text-slate-900 tracking-tight">יוסף מאיר המלך </span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="mb-1.5 text-3xl font-black tracking-tight text-slate-900">
              ברוכים השבים
            </h1>
            <p className="text-sm text-slate-500">
              התחברו לחשבון הניהול שלכם להמשיך
            </p>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} noValidate className="space-y-5">

            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-widest text-slate-500">
                כתובת דוא״ל
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  placeholder="name@company.co.il"
                  disabled={isLoading}
                  autoComplete="email"
                  className={[
                    "w-full rounded-xl border bg-white py-3 pr-10 pl-4 text-sm text-slate-900",
                    "shadow-sm ring-0 transition-all placeholder:text-slate-300",
                    "focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-400",
                    "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-60",
                    errors.email ? "border-red-400 bg-red-50/40" : "border-slate-200",
                  ].join(" ")}
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="text-xs font-medium text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  className="text-xs font-medium text-slate-400 hover:text-slate-700 transition-colors"
                >
                  שכחת סיסמה?
                </button>
                <label className="block text-xs font-semibold uppercase tracking-widest text-slate-500">
                  סיסמה
                </label>
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  disabled={isLoading}
                  autoComplete="current-password"
                  className={[
                    "w-full rounded-xl border bg-white py-3 pr-10 pl-12 text-sm text-slate-900",
                    "shadow-sm ring-0 transition-all placeholder:text-slate-300",
                    "focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-400",
                    "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-60",
                    errors.password ? "border-red-400 bg-red-50/40" : "border-slate-200",
                  ].join(" ")}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={handleTogglePassword}
                  disabled={isLoading}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors disabled:cursor-not-allowed"
                  aria-label={showPassword ? "הסתר סיסמה" : "הצג סיסמה"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs font-medium text-red-500">{errors.password.message}</p>
              )}
            </div>

            {/* Remember me */}
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={handleRememberMeChange}
                className="h-4 w-4 rounded border-slate-300 text-slate-900 accent-slate-900 focus:ring-slate-700"
              />
              <span className="text-sm text-slate-600">זכור אותי במכשיר זה</span>
            </label>

            {/* Server error */}
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-sm font-medium text-red-600">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className={[
                "group relative mt-2 flex w-full items-center justify-center gap-2 overflow-hidden",
                "rounded-xl bg-slate-900 px-6 py-3.5 text-sm font-bold text-white",
                "transition-all duration-200 hover:bg-slate-800 active:scale-[0.98]",
                "focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2",
                "disabled:cursor-not-allowed disabled:opacity-60",
              ].join(" ")}
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  <span>מתחבר...</span>
                </>
              ) : (
                <>
                  <span>כניסה למערכת</span>
                  <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
                </>
              )}
              {/* Shimmer on hover */}
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
            </button>
          </form>

          {/* Footer */}
          <p className="mt-10 text-center text-xs text-slate-400">
            מערכת פנים-ארגונית בלבד — גישה מורשית בלבד
          </p>
        </div>
      </div>

      {/* ── Left panel — brand wall ─────────────────────────────────────── */}
      <div className="relative hidden overflow-hidden bg-slate-950 lg:flex lg:w-[48%] lg:flex-col lg:items-start lg:justify-between lg:p-14">

        {/* Dot-grid texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: "radial-gradient(circle, #94a3b8 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Diagonal accent lines */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -bottom-40 -left-40 h-[600px] w-[600px] rotate-12 rounded-[80px] border border-slate-700/40" />
          <div className="absolute -bottom-60 -left-60 h-[800px] w-[800px] rotate-12 rounded-[120px] border border-slate-700/25" />
          <div className="absolute top-20 right-[-120px] h-[400px] w-[400px] -rotate-6 rounded-[60px] border border-slate-700/30" />
        </div>

        {/* Large watermark */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 flex items-end justify-center overflow-hidden pb-0">
          <span className="select-none text-[200px] font-black leading-none tracking-tighter text-white/[0.03]">
            בינדר
          </span>
        </div>

        {/* Top: logo */}
        <div className="relative z-10 flex items-center gap-3 animate-fade-in">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20">
            <span className="text-base font-black text-white">ב</span>
          </div>
          <div>
            <p className="text-base font-bold tracking-tight text-white">בינדר ■ חיוב</p>
            <p className="text-xs text-slate-500">מערכת ניהול</p>
          </div>
        </div>

        {/* Center: headline */}
        <div className="relative z-10 space-y-6">
          <div className="h-px w-12 bg-slate-600" />
          <h2 className="text-4xl font-black leading-[1.15] tracking-tight text-white">
            ניהול לקוחות,<br />
            <span className="text-slate-400">קלסרים וחיובים</span><br />
            במקום אחד
          </h2>
          <p className="max-w-xs text-sm leading-relaxed text-slate-500">
            פלטפורמת הניהול הפנים-ארגונית של יוסף מאיר — מרוכזת, מאובטחת, ויעילה.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2 pt-2">
            {["קלסרים", "לקוחות", "חיובים", "מסמכים", "דוחות מס"].map((label) => (
              <span
                key={label}
                className="rounded-full border border-slate-700 bg-slate-800/60 px-3 py-1 text-xs font-medium text-slate-400"
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom: legal */}
        <p className="relative z-10 text-xs text-slate-700">
          © {getYear(new Date())} יוסף מאיר — כל הזכויות שמורות
        </p>
      </div>
    </div>
  );
};