"use client";

import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";

interface LanguageSelectorProps {
  className?: string;
  variant?: "light" | "dark" | "pill";
}

export default function LanguageSelector({
  className = "",
  variant = "light",
}: LanguageSelectorProps) {
  const { currentLang, setLanguage, languages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const buttonStyle =
    variant === "dark"
      ? "bg-[#704828]/40 hover:bg-[#704828]/70 border-white/30 text-white"
      : variant === "pill"
      ? "bg-white/90 hover:bg-white text-[#704828] border-amber-200 shadow-sm"
      : "bg-white/80 hover:bg-white border-amber-200/80 text-[#3D2B1F] shadow-xs";

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${buttonStyle}`}
        aria-expanded={isOpen}
      >
        <span className="text-sm">🌐</span>
        <span>{currentLang.nativeName}</span>
        <svg
          className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white dark:bg-zinc-900 shadow-2xl border border-amber-200 dark:border-zinc-800 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-1.5 border-b border-amber-100 dark:border-zinc-800">
            <p className="text-[10px] font-bold text-amber-900/60 dark:text-zinc-400 uppercase tracking-wider">
              Select Language / भाषा
            </p>
          </div>
          <div className="max-h-60 overflow-y-auto py-1">
            {languages.map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => {
                  setLanguage(lang.code);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2 text-xs text-left transition-colors ${
                  currentLang.code === lang.code
                    ? "bg-amber-100/70 dark:bg-zinc-800 text-[#704828] dark:text-amber-300 font-bold"
                    : "text-zinc-700 dark:text-zinc-300 hover:bg-amber-50 dark:hover:bg-zinc-800/60"
                }`}
              >
                <span>{lang.nativeName}</span>
                <span className="text-[10px] text-zinc-400">({lang.name})</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
