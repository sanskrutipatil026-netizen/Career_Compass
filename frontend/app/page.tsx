"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "./context/LanguageContext";
import LanguageSelector from "./components/LanguageSelector";

export default function HomePage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const switchMode = (newMode: "signin" | "signup") => {
    setMode(newMode);
    setError("");
    setSuccess("");
    setPassword("");
    setConfirmPassword("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email.trim() || !password) {
      setError("Email and password are required.");
      return;
    }

    if (mode === "signup") {
      if (!name.trim()) {
        setError("Please provide your full name.");
        return;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
    }

    setLoading(true);

    if (mode === "signup") {
      // SIGN UP FLOW
      try {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password: password,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to create account.");
        }

        // Auto login on successful signup
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: data.user?.id || Date.now().toString(),
            name: data.user?.name || name.trim(),
            email: data.user?.email || email.trim().toLowerCase(),
          })
        );

        setSuccess("Account created successfully! Redirecting...");
        setTimeout(() => {
          router.push("/personalD");
        }, 1000);
      } catch (err: any) {
        console.error("Signup error:", err);
        setError(err.message || "Unable to register. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      // SIGN IN FLOW
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            password: password,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Invalid email or password.");
        }

        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: data.user?.id || Date.now().toString(),
            name: data.user?.name || email.split("@")[0],
            email: data.user?.email || email.trim().toLowerCase(),
          })
        );

        setSuccess("Signed in successfully! Loading dashboard...");
        setTimeout(() => {
          const personalDetails = localStorage.getItem("personalDetails");
          if (personalDetails) {
            router.push("/dashboard");
          } else {
            router.push("/personalD");
          }
        }, 1000);
      } catch (err: any) {
        console.error("Login error:", err);
        setError(err.message || "Invalid email or password.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#FFFBEB] via-[#FEF3C7] to-[#FDE68A] flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8">
      {/* Top Brand Bar */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#704828] via-[#A67B5B] to-[#C49A6C] text-white flex items-center justify-center font-bold text-xl shadow-md border border-white/40">
            🧭
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-[#3D2B1F] tracking-tight">
              {t("brand_name", "Career Compass")}
            </h1>
            <p className="text-[11px] text-[#8C6239] font-medium">
              {t("tagline", "AI-Powered Career & Placement Platform")}
            </p>
          </div>
        </div>

        {/* Top Right Controls: Language Selector & Mode Switch */}
        <div className="flex items-center gap-3">
          <LanguageSelector variant="pill" />

          <button
            onClick={() => switchMode(mode === "signin" ? "signup" : "signin")}
            className="text-xs sm:text-sm font-bold text-[#704828] hover:text-[#3D2B1F] px-4 py-2 rounded-full border border-[#A67B5B]/30 hover:border-[#A67B5B] bg-white/80 backdrop-blur-xs transition shadow-xs"
          >
            {mode === "signin" ? t("nav_signup", "Create Account") : t("nav_login", "Sign In")}
          </button>
        </div>
      </div>

      {/* Center Auth Card & Feature Highlights */}
      <div className="max-w-5xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-6">
        {/* Left Side: Platform Highlights */}
        <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 bg-amber-200/70 border border-amber-300 text-amber-900 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            {t("hero_badge", "Your Personal AI Career Growth Hub")}
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#3D2B1F] leading-tight tracking-tight">
            {t("hero_title_1", "Master Technical Interviews with ")}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B5E3C] to-[#C49A6C]">
              {t("hero_title_2", "Adaptive AI")}
            </span>
          </h2>

          <p className="text-[#6B4E37] text-sm sm:text-base leading-relaxed max-w-lg mx-auto lg:mx-0">
            {t("hero_desc", "Practice real-time technical interviews, evaluate your ATS resume score, discover skill gaps, and explore certified courses.")}
          </p>

          {/* Highlights List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-left">
            <div className="bg-white/80 backdrop-blur-xs p-3.5 rounded-2xl border border-amber-200/80 shadow-xs">
              <div className="text-xl mb-1">🤖</div>
              <h4 className="font-bold text-xs text-[#3D2B1F]">{t("feature_mock_title", "Adaptive Mock Interviews")}</h4>
              <p className="text-[11px] text-[#7A583E] mt-0.5">{t("feature_mock_desc", "Real-time technical scoring & feedback")}</p>
            </div>

            <div className="bg-white/80 backdrop-blur-xs p-3.5 rounded-2xl border border-amber-200/80 shadow-xs">
              <div className="text-xl mb-1">📄</div>
              <h4 className="font-bold text-xs text-[#3D2B1F]">{t("feature_resume_title", "ATS Resume Analyzer")}</h4>
              <p className="text-[11px] text-[#7A583E] mt-0.5">{t("feature_resume_desc", "Instant match score & skill breakdown")}</p>
            </div>

            <div className="bg-white/80 backdrop-blur-xs p-3.5 rounded-2xl border border-amber-200/80 shadow-xs">
              <div className="text-xl mb-1">🧭</div>
              <h4 className="font-bold text-xs text-[#3D2B1F]">{t("feature_multilingual_title", "Multilingual Assistant")}</h4>
              <p className="text-[11px] text-[#7A583E] mt-0.5">{t("feature_multilingual_desc", "Speak & learn in 8+ Indian languages")}</p>
            </div>

            <div className="bg-white/80 backdrop-blur-xs p-3.5 rounded-2xl border border-amber-200/80 shadow-xs">
              <div className="text-xl mb-1">🎓</div>
              <h4 className="font-bold text-xs text-[#3D2B1F]">{t("feature_courses_title", "Certified Courses")}</h4>
              <p className="text-[11px] text-[#7A583E] mt-0.5">{t("feature_courses_desc", "SWAYAM & NPTEL course recommendations")}</p>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Box */}
        <div className="lg:col-span-6 flex justify-center">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl p-7 sm:p-8 border border-amber-200/60 dark:border-zinc-800">
            {/* Mode Toggle Switch */}
            <div className="flex p-1 bg-amber-100/70 dark:bg-zinc-800 rounded-2xl mb-6">
              <button
                type="button"
                onClick={() => switchMode("signin")}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  mode === "signin"
                    ? "bg-white dark:bg-zinc-900 text-[#704828] dark:text-amber-300 shadow-md"
                    : "text-[#8C6239] hover:text-[#3D2B1F]"
                }`}
              >
                {t("nav_login", "Sign In")}
              </button>
              <button
                type="button"
                onClick={() => switchMode("signup")}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  mode === "signup"
                    ? "bg-white dark:bg-zinc-900 text-[#704828] dark:text-amber-300 shadow-md"
                    : "text-[#8C6239] hover:text-[#3D2B1F]"
                }`}
              >
                {t("nav_signup", "Create Account")}
              </button>
            </div>

            <div className="mb-5">
              <h3 className="text-xl sm:text-2xl font-bold text-[#3D2B1F] dark:text-white">
                {mode === "signin" ? t("auth_welcome_back", "Welcome back!") : t("auth_join", "Join Career Compass")}
              </h3>
              <p className="text-xs text-[#7A583E] dark:text-zinc-400 mt-1">
                {mode === "signin"
                  ? t("auth_welcome_sub", "Enter your email & password to access your interviews.")
                  : t("auth_join_sub", "Fill in your details to start practicing today.")}
              </p>
            </div>

            {/* Error & Success Notifications */}
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs font-medium">
                ⚠️ {error}
              </div>
            )}
            {success && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs font-medium">
                ✅ {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "signup" && (
                <div>
                  <label className="block text-xs font-bold text-[#4A3525] dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                    {t("auth_name_label", "Full Name")}
                  </label>
                  <input
                    type="text"
                    placeholder={t("auth_name_placeholder", "e.g. Alex Johnson")}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-[#FFFDF9] dark:bg-zinc-800 text-zinc-900 dark:text-white border border-amber-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#A67B5B]"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#4A3525] dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                  {t("auth_email_label", "Email Address")}
                </label>
                <input
                  type="email"
                  placeholder={t("auth_email_placeholder", "student@example.com")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-[#FFFDF9] dark:bg-zinc-800 text-zinc-900 dark:text-white border border-amber-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#A67B5B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A3525] dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                  {t("auth_password_label", "Password")}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-[#FFFDF9] dark:bg-zinc-800 text-zinc-900 dark:text-white border border-amber-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#A67B5B] pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-zinc-400 hover:text-zinc-600 text-xs font-semibold"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {mode === "signup" && (
                <div>
                  <label className="block text-xs font-bold text-[#4A3525] dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                    {t("auth_confirm_password", "Confirm Password")}
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full bg-[#FFFDF9] dark:bg-zinc-800 text-zinc-900 dark:text-white border border-amber-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#A67B5B]"
                  />
                </div>
              )}

              {mode === "signin" && (
                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-[#6B4E37] dark:text-zinc-400">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      className="rounded accent-[#A67B5B]"
                    />
                    {t("auth_remember", "Remember me")}
                  </label>
                  <a href="/forgot-password" className="text-[#A67B5B] hover:underline font-semibold">
                    {t("auth_forgot", "Forgot password?")}
                  </a>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 bg-gradient-to-r from-[#704828] via-[#A67B5B] to-[#8B5E3C] hover:opacity-95 text-white py-3 rounded-xl font-bold transition shadow-lg disabled:opacity-50 text-sm flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Processing...
                  </>
                ) : mode === "signin" ? (
                  t("auth_btn_signin", "Sign In to Dashboard →")
                ) : (
                  t("auth_btn_signup", "Create Account & Continue →")
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="max-w-6xl w-full mx-auto text-center text-xs text-[#8C6239] pt-4 border-t border-amber-200/60">
        © 2026 {t("brand_name", "Career Compass")} • {t("tagline", "AI-Powered Career & Placement Platform")}
      </footer>
    </main>
  );
}