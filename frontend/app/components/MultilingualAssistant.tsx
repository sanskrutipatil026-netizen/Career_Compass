"use client";

import React, { useState, useEffect, useRef } from "react";
import { useLanguage, INDIAN_LANGUAGES } from "../context/LanguageContext";

export interface AssistantLangDetails {
  code: string;
  name: string;
  nativeName: string;
  speechCode: string;
  placeholder: string;
  welcome: string;
  quickPrompts: string[];
}

export const ASSISTANT_LANGUAGES: AssistantLangDetails[] = [
  {
    code: "en",
    name: "English",
    nativeName: "English",
    speechCode: "en-US",
    placeholder: "Ask anything about interviews, resume, careers...",
    welcome: "👋 Hi! I'm Compass Mitra, your AI Career Guide. How can I guide your career journey today?",
    quickPrompts: [
      "🎯 How do I prepare for AI Mock Interviews?",
      "📄 How can I optimize my Resume for ATS?",
      "💡 Give me 5 key tips for technical interviews",
      "🚀 What features does Career Compass offer?",
    ],
  },
  {
    code: "hi",
    name: "Hindi",
    nativeName: "हिन्दी",
    speechCode: "hi-IN",
    placeholder: "साक्षात्कार, रिज्यूमे या करियर के बारे में पूछें...",
    welcome: "👋 नमस्ते! मैं कम्पास मित्र (Compass Mitra) हूँ, आपका AI करियर साथी। आज मैं आपकी क्या सहायता कर सकता हूँ?",
    quickPrompts: [
      "🎯 मॉक इंटरव्यू की तैयारी कैसे करें?",
      "📄 रिज्यूमे को बेहतर कैसे बनाएं?",
      "💡 तकनीकी इंटरव्यू के लिए 5 मुख्य सुझाव दें",
      "🚀 करियर कम्पास की प्रमुख विशेषताएं क्या हैं?",
    ],
  },
  {
    code: "mr",
    name: "Marathi",
    nativeName: "मराठी",
    speechCode: "mr-IN",
    placeholder: "मुलाखत, रेझ्युमे किंवा करिअरबद्दल विचारा...",
    welcome: "👋 नमस्कार! मी कंपास मित्र (Compass Mitra), तुमचा AI करिअर मार्गदर्शक. आज मी तुम्हाला कशी मदत करू?",
    quickPrompts: [
      "🎯 मॉक इंटरव्यूची तयारी कशी करावी?",
      "📄 रेझ्युमे अधिक प्रभावी कसा बनवावा?",
      "💡 टेक्निकल इंटरव्ह्यूसाठी ५ महत्त्वाच्या टिप्स द्या",
      "🚀 करिअर कंपासमध्ये कोणती वैशिष्ट्ये आहेत?",
    ],
  },
  {
    code: "bn",
    name: "Bengali",
    nativeName: "বাংলা",
    speechCode: "bn-IN",
    placeholder: "ইন্টারভিউ, জীবনবৃত্তান্ত বা ক্যারিয়ার সম্পর্কে জিজ্ঞাসা করুন...",
    welcome: "👋 নমস্কার! আমি কম্পাস মিত্র (Compass Mitra), আপনার এআই ক্যারিয়ার সহায়ক। আজ কীভাবে সাহায্য করতে পারি?",
    quickPrompts: [
      "🎯 মক ইন্টারভিউয়ের প্রস্তুতি কীভাবে নেব?",
      "📄 কীভাবে জীবনবৃত্তান্ত উন্নত করব?",
      "💡 টেকনিক্যাল ইন্টারভিউয়ের জন্য ৫টি গুরুত্বপূর্ণ টিপস দিন",
      "🚀 ক্যারিয়ার কম্পাসের সুবিধাগুলো কী কী?",
    ],
  },
  {
    code: "te",
    name: "Telugu",
    nativeName: "తెలుగు",
    speechCode: "te-IN",
    placeholder: "ఇంటర్వ్యూ, రెజ్యూమ్ లేదా కెరీర్ గురించి అడగండి...",
    welcome: "👋 నమస్కారం! నేను కంపాస్ మిత్ర (Compass Mitra), మీ AI కెరీర్ సహాయకుడిని. మీకు ఎలా సహాయపడగలను?",
    quickPrompts: [
      "🎯 మాక్ ఇంటర్వ్యూలకు ఎలా సిద్ధం కావాలి?",
      "📄 రెజ్యూమ్‌ను ఎలా ఆప్టిమైజ్ చేయాలి?",
      "💡 టెక్నికల్ ఇంటర్వ్యూ కోసం 5 ముఖ్యమైన చిట్కాలు ఇవ్వండి",
      "🚀 కెరీర్ కంపాస్ ఫీచర్లు ఏమిటి?",
    ],
  },
  {
    code: "ta",
    name: "Tamil",
    nativeName: "தமிழ்",
    speechCode: "ta-IN",
    placeholder: "நேர்காணல், ரெஸ்யூம் பற்றி கேளுங்கள்...",
    welcome: "👋 வணக்கம்! நான் காம்பஸ் மித்ரா (Compass Mitra), உங்கள் AI தொழில் வழிகாட்டி. உங்களுக்கு எவ்வாறு உதவ முடியும்?",
    quickPrompts: [
      "🎯 மாக் நேர்காணலுக்கு எவ்வாறு தயாராவது?",
      "📄 ரெஸ்யூமை எவ்வாறு மேம்படுத்துவது?",
      "💡 தொழில்நுட்ப நேர்காணலுக்கான 5 குறிப்புகள் தாருங்கள்",
      "🚀 கேரியர் காம்பஸின் சிறப்பம்சங்கள் என்ன?",
    ],
  },
  {
    code: "gu",
    name: "Gujarati",
    nativeName: "ગુજરાતી",
    speechCode: "gu-IN",
    placeholder: "ઇન્ટરવ્યુ, રેઝ્યૂમે અથવા કરિયર વિશે પૂછો...",
    welcome: "👋 નમસ્તે! હું કંપાસ મિત્ર (Compass Mitra), તમારો AI કરિયર સાથી. આજે હું તમને કેવી રીતે મદદ કરી શકું?",
    quickPrompts: [
      "🎯 મોક ઇન્ટરવ્યુની તૈયારી કેવી રીતે કરવી?",
      "📄 રેઝ્યૂમે કેવી રીતે સુધારવો?",
      "💡 ટેકનિકલ ઇન્ટરવ્યુ માટે ૫ મહત્વપૂર્ણ ટિપ્સ આપો",
      "🚀 કરિયર કંપાસની સુવિધાઓ શું છે?",
    ],
  },
  {
    code: "kn",
    name: "Kannada",
    nativeName: "ಕನ್ನಡ",
    speechCode: "kn-IN",
    placeholder: "ಸಂದರ್ಶನ, ರೆಸ್ಯೂಮ್ ಬಗ್ಗೆ ಕೇಳಿ...",
    welcome: "👋 ನಮಸ್ಕಾರ! ನಾನು ಕಂಪಾಸ್ ಮಿತ್ರ (Compass Mitra), ನಿಮ್ಮ AI ಕರಿಯರ್ ಸಹಾಯಕ. ಇಂದು ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?",
    quickPrompts: [
      "🎯 ಮಾಕ್ ಸಂದರ್ಶನಕ್ಕೆ ಹೇಗೆ ಸಿದ್ಧತೆ ಮಾಡಿಕೊಳ್ಳುವುದು?",
      "📄 ರೆಸ್ಯೂಮ್ ಅನ್ನು ಹೇಗೆ ಉತ್ತಮಗೊಳಿಸುವುದು?",
      "💡 ತಾಂತ್ರಿಕ ಸಂದರ್ಶನಕ್ಕಾಗಿ 5 ಪ್ರಮುಖ ಸಲಹೆಗಳನ್ನು ನೀಡಿ",
      "🚀 ಕರಿಯರ್ ಕಂಪಾಸ್‌ನ ವೈಶಿಷ್ಟ್ಯಗಳೇನು?",
    ],
  },
];

interface Message {
  id: string;
  sender: "user" | "assistant";
  text: string;
  time: string;
}

export default function MultilingualAssistant() {
  const { currentLang, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [hasUnread, setHasUnread] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Active assistant language matching global platform language
  const activeLangConfig =
    ASSISTANT_LANGUAGES.find((l) => l.code === currentLang.code) || ASSISTANT_LANGUAGES[0];

  // Update initial welcome message when language changes
  useEffect(() => {
    setMessages([
      {
        id: "welcome-msg",
        sender: "assistant",
        text: activeLangConfig.welcome,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  }, [activeLangConfig.code]);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isMinimized, isLoading]);

  // Handle Speech Recognition setup
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = activeLangConfig.speechCode;

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInputValue(transcript);
          setIsListening(false);
          handleSendMessage(transcript);
        };

        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);

        recognitionRef.current = recognition;
      }
    }
  }, [activeLangConfig.speechCode]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. Please try Google Chrome or Edge.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.lang = activeLangConfig.speechCode;
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error("Speech recognition start error:", err);
      }
    }
  };

  // Text to Speech
  const speakText = (text: string, messageId: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    if (speakingMessageId === messageId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanSpeech = text.replace(/[*#_~]/g, "");
    const utterance = new SpeechSynthesisUtterance(cleanSpeech);
    utterance.lang = activeLangConfig.speechCode;
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => setSpeakingMessageId(null);
    utterance.onerror = () => setSpeakingMessageId(null);

    setSpeakingMessageId(messageId);
    window.speechSynthesis.speak(utterance);
  };

  const handleLanguageSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCode = e.target.value;
    setLanguage(selectedCode); // Updates both Assistant and Entire Platform!
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSendMessage = async (customText?: string) => {
    const textToSend = (customText || inputValue).trim();
    if (!textToSend || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          language: activeLangConfig.name,
          languageCode: activeLangConfig.code,
          history: messages,
        }),
      });

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: "assistant",
        text: data.reply || "Sorry, I could not process your request at this moment.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      if (!isOpen) {
        setHasUnread(true);
      }
    } catch (err) {
      console.error("Assistant query error:", err);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: "assistant",
        text: "⚠️ Connection error. Please try again.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setSpeakingMessageId(null);
    setMessages([
      {
        id: "welcome-msg",
        sender: "assistant",
        text: activeLangConfig.welcome,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
          <div
            onClick={() => {
              setIsOpen(true);
              setHasUnread(false);
            }}
            className="hidden sm:flex items-center gap-2 bg-white/95 backdrop-blur-md text-amber-900 border border-amber-200 shadow-xl px-3.5 py-2 rounded-full cursor-pointer hover:scale-105 transition-all text-xs font-semibold animate-pulse"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>Compass Mitra ({activeLangConfig.nativeName})</span>
          </div>

          <button
            onClick={() => {
              setIsOpen(true);
              setHasUnread(false);
            }}
            aria-label="Open Compass Mitra AI Assistant"
            className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-[#8B5E3C] via-[#A67B5B] to-[#C49A6C] text-white shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 border-2 border-white/40 group"
          >
            {hasUnread && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-white rounded-full"></span>
            )}
            <svg
              className="w-7 h-7 transform group-hover:rotate-12 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Assistant Popup Card */}
      {isOpen && (
        <div
          className={`fixed bottom-6 right-6 z-50 w-[95vw] sm:w-[420px] max-w-[440px] bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-amber-200/60 dark:border-zinc-800 overflow-hidden flex flex-col transition-all duration-300 ease-in-out ${
            isMinimized ? "h-[74px]" : "h-[620px] max-h-[85vh]"
          }`}
          style={{ boxShadow: "0 25px 50px -12px rgba(166, 123, 91, 0.25)" }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#704828] via-[#A67B5B] to-[#8C6239] text-white px-4 py-3.5 flex items-center justify-between shrink-0 shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-amber-100/20 backdrop-blur-sm border border-white/30 flex items-center justify-center font-bold text-amber-200 text-sm">
                  🧭
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#704828] rounded-full"></span>
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-wide">
                  Compass Mitra
                </h3>
                <p className="text-[11px] text-amber-200/90 font-medium">
                  {activeLangConfig.nativeName} • Indian Languages
                </p>
              </div>
            </div>

            {/* Language Selector & Controls */}
            <div className="flex items-center gap-1.5">
              <select
                value={currentLang.code}
                onChange={handleLanguageSelect}
                className="bg-black/25 hover:bg-black/35 border border-white/30 text-white text-xs font-semibold rounded-lg px-2 py-1 outline-none cursor-pointer transition-colors"
                title="Change Platform Language"
              >
                {ASSISTANT_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code} className="text-zinc-900 bg-white">
                    {lang.nativeName} ({lang.name})
                  </option>
                ))}
              </select>

              <button
                onClick={() => setIsMinimized(!isMinimized)}
                aria-label={isMinimized ? "Expand" : "Minimize"}
                className="p-1.5 text-white/80 hover:text-white hover:bg-white/15 rounded-lg transition-colors"
              >
                {isMinimized ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </button>

              <button
                onClick={() => {
                  setIsOpen(false);
                  if (window.speechSynthesis) window.speechSynthesis.cancel();
                  setSpeakingMessageId(null);
                }}
                aria-label="Close Assistant"
                className="p-1.5 text-white/80 hover:text-white hover:bg-white/15 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Body */}
          {!isMinimized && (
            <>
              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FDFBF7] dark:bg-zinc-900/90 text-sm">
                {messages.map((msg) => {
                  const isAssistant = msg.sender === "assistant";
                  const isSpeaking = speakingMessageId === msg.id;

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isAssistant ? "items-start" : "items-end"}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm shadow-sm relative group ${
                          isAssistant
                            ? "bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 border border-amber-100 dark:border-zinc-700 rounded-tl-sm"
                            : "bg-gradient-to-r from-[#A67B5B] to-[#8B5E3C] text-white rounded-tr-sm"
                        }`}
                      >
                        <div className="whitespace-pre-wrap leading-relaxed">
                          {(() => {
                            if (!msg.text) return null;
                            const parts = msg.text.split(/(\*\*[^*]+\*\*)/g);
                            return parts.map((part, idx) => {
                              if (part.startsWith("**") && part.endsWith("**")) {
                                const boldContent = part.slice(2, -2).replace(/\*/g, "");
                                return (
                                  <strong key={idx} className="font-semibold text-zinc-900 dark:text-zinc-100">
                                    {boldContent}
                                  </strong>
                                );
                              }
                              return <span key={idx}>{part.replace(/\*/g, "")}</span>;
                            });
                          })()}
                        </div>

                        <div
                          className={`mt-1.5 flex items-center gap-2 text-[10px] ${
                            isAssistant
                              ? "text-zinc-400 dark:text-zinc-400 justify-between"
                              : "text-amber-200/80 justify-end"
                          }`}
                        >
                          <span>{msg.time}</span>

                          {isAssistant && (
                            <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => speakText(msg.text, msg.id)}
                                title={isSpeaking ? "Stop Speaking" : "Listen (Text to Speech)"}
                                className={`p-1 rounded hover:bg-amber-100 dark:hover:bg-zinc-700 transition-colors ${
                                  isSpeaking ? "text-amber-600 font-bold animate-pulse" : "text-zinc-500 dark:text-zinc-300"
                                }`}
                              >
                                {isSpeaking ? "🔊 Stop" : "🔈 Listen"}
                              </button>

                              <button
                                onClick={() => copyToClipboard(msg.text, msg.id)}
                                title="Copy message"
                                className="p-1 rounded hover:bg-amber-100 dark:hover:bg-zinc-700 text-zinc-500 dark:text-zinc-300 transition-colors"
                              >
                                {copiedId === msg.id ? "✓ Copied" : "📋 Copy"}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {isLoading && (
                  <div className="flex items-center gap-2 text-zinc-400 text-xs py-1">
                    <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center text-xs">
                      🧭
                    </div>
                    <div className="bg-white dark:bg-zinc-800 border border-amber-100 dark:border-zinc-700 px-3 py-2 rounded-2xl rounded-tl-sm flex items-center gap-1.5 shadow-sm">
                      <span className="w-1.5 h-1.5 bg-amber-600 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                      <span className="w-1.5 h-1.5 bg-amber-600 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="w-1.5 h-1.5 bg-amber-600 rounded-full animate-bounce"></span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompt Chips */}
              {messages.length <= 2 && !isLoading && (
                <div className="px-3 py-2 bg-[#F6F1EA] dark:bg-zinc-800/60 border-t border-amber-100 dark:border-zinc-800 flex flex-wrap gap-1.5">
                  {activeLangConfig.quickPrompts.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(prompt)}
                      className="text-[11px] bg-white dark:bg-zinc-800 text-amber-900 dark:text-amber-200 border border-amber-200/70 dark:border-zinc-700 px-2.5 py-1 rounded-full hover:bg-amber-500 hover:text-white transition-all text-left truncate max-w-full shadow-2xs"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              )}

              {/* Input Area */}
              <div className="p-3 bg-white dark:bg-zinc-900 border-t border-amber-200/50 dark:border-zinc-800 shrink-0">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-2"
                >
                  <button
                    type="button"
                    onClick={clearChat}
                    title="Clear Chat"
                    className="p-2 text-zinc-400 hover:text-red-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>

                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={activeLangConfig.placeholder}
                    className="flex-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#A67B5B] border border-transparent placeholder:text-zinc-400"
                  />

                  <button
                    type="button"
                    onClick={toggleListening}
                    title={isListening ? "Listening... Click to stop" : "Speak (Voice input)"}
                    className={`p-2.5 rounded-xl transition-all ${
                      isListening
                        ? "bg-red-500 text-white animate-pulse shadow-md"
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-amber-100 dark:hover:bg-zinc-700"
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                      />
                    </svg>
                  </button>

                  <button
                    type="submit"
                    disabled={!inputValue.trim() || isLoading}
                    className="bg-gradient-to-r from-[#A67B5B] to-[#8B5E3C] hover:opacity-90 disabled:opacity-40 text-white p-2.5 rounded-xl shadow-sm transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                  </button>
                </form>

                <div className="mt-1.5 flex items-center justify-between text-[10px] text-zinc-400 px-1">
                  <span>Career Compass • {activeLangConfig.nativeName}</span>
                  {isListening && <span className="text-red-500 font-semibold animate-pulse">● Listening ({activeLangConfig.nativeName})...</span>}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
