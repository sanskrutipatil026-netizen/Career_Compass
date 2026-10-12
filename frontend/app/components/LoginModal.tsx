"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  openSignup: () => void;
}

export default function LoginModal({
  isOpen,
  onClose,
  openSignup,
}: LoginModalProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please fill in both email and password.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Invalid credentials");
      }

      // Save user session in localStorage
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: data.user?.id || Date.now().toString(),
          name: data.user?.name || email.split("@")[0],
          email: data.user?.email || email,
        })
      );

      onClose();
      // Check if personal details are already filled
      const personalDetails = localStorage.getItem("personalDetails");
      if (personalDetails) {
        router.push("/dashboard");
      } else {
        router.push("/personalD");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      // If backend is not running, provide graceful fallback
      if (err.message.includes("Failed to fetch") || err.message.includes("NetworkError")) {
        // Fallback demo sign in
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: Date.now().toString(),
            name: email.split("@")[0],
            email: email,
          })
        );
        onClose();
        router.push("/personalD");
      } else {
        setError(err.message || "Failed to sign in. Please check your credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl w-full max-w-md p-8 relative border border-amber-200/50 dark:border-zinc-800 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-black dark:hover:text-white text-xl p-1 rounded-full transition"
        >
          ✕
        </button>

        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#704828] via-[#A67B5B] to-[#C49A6C] flex items-center justify-center text-white text-2xl font-bold shadow-md">
            🧭
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
          Welcome Back
        </h2>

        <p className="text-center text-gray-500 dark:text-gray-400 text-sm mt-1 mb-6">
          Sign in to your Career Compass account
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white border border-gray-200 dark:border-zinc-700 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#A67B5B]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white border border-gray-200 dark:border-zinc-700 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#A67B5B]"
            />
          </div>

          <div className="flex justify-end">
            <a href="/forgot-password" className="text-xs text-[#A67B5B] hover:underline">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#A67B5B] to-[#8B5E3C] hover:opacity-95 text-white py-3 rounded-xl font-semibold transition shadow-md disabled:opacity-50 text-sm flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </button>

          <p className="text-center text-xs text-gray-600 dark:text-gray-400 mt-4">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => {
                onClose();
                openSignup();
              }}
              className="text-[#A67B5B] font-bold hover:underline"
            >
              Create Account
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}