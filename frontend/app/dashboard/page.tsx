"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import LanguageSelector from "../components/LanguageSelector";

export default function Dashboard() {
  const router = useRouter();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("history");
  const [totalSessions, setTotalSessions] = useState(0);
  const [averageScore, setAverageScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [totalPracticeTime, setTotalPracticeTime] = useState("00:00");
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    // Auth Guard: redirect to login page if unauthenticated
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const userStr = localStorage.getItem("user");

    if (isLoggedIn !== "true" || !userStr) {
      router.push("/");
      return;
    }

    try {
      const parsedUser = JSON.parse(userStr);
      if (parsedUser.name) setUserName(parsedUser.name);
    } catch (e) {
      // ignore
    }

    const interviews = JSON.parse(
      localStorage.getItem("allInterviews") || "[]"
    );

    setTotalSessions(interviews.length);

    if (interviews.length > 0) {
      const totalScore = interviews.reduce(
        (sum: number, item: any) => sum + item.score,
        0
      );

      setAverageScore(Math.round(totalScore / interviews.length));

      const highest = Math.max(
        ...interviews.map((item: any) => item.score)
      );

      setBestScore(highest);

      let totalSeconds = 0;

      interviews.forEach((item: any) => {
        const [m, s] = item.time.split(":").map(Number);
        totalSeconds += m * 60 + s;
      });

      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;

      setTotalPracticeTime(
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
      );
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-amber-100">
      
      <nav className="bg-[#A67B5B] shadow-sm px-8 py-4 flex justify-between items-center">
        <div className="flex justify-center gap-2">
          <h1 className="text-brown-500 font-bold text-[#A67B5B] w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center font-bold ">
            🧭
          </h1>
          <div>
            <h1 className="font-bold text-amber-100 text-lg ">
              {t("brand_name", "Career Compass")}
            </h1>
            <p className="text-xs text-amber-200">
              {t("tagline", "AI POWERED")}
            </p>
          </div>
        </div> 

        <div className="flex gap-8 font-md">
          <button className="text-amber-100 font-bold hover:text-white">
            ⚡{t("nav_dashboard", "Dashboard")}
          </button>
          <button onClick={() => router.push("/interview")} className="text-amber-200 hover:text-white">
            🎯{t("nav_practice", "Practice")}
          </button>
          <button onClick={() => router.push("/history")} className="text-amber-200 hover:text-white">
            📊{t("nav_my_sessions", "My Sessions")}
          </button>
        </div>
    
        <div className="flex items-center gap-3">
          <LanguageSelector variant="dark" />

          <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1.5 shadow-xs">
            <div className="w-7 h-7 rounded-full bg-[#A67B5B] text-white flex items-center justify-center font-bold text-xs">
              {userName.charAt(0).toUpperCase()}
            </div>
            <span className="text-xs font-semibold text-black">{t("dash_hi", "Hi")}, {userName}</span>
          </div>

          <button
            onClick={handleLogout}
            className="bg-gray-100 hover:bg-red-50 hover:text-red-600 text-black px-4 py-1.5 rounded-full font-semibold transition text-xs shadow-xs"
          >
            {t("nav_logout", "Logout")}
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-8">
        <div className="flex justify-between items-center">
          <div className="text-black">
            <p className="text-gray-600 font-medium">{t("dash_greeting", "Welcome Back 👋")}</p>
            <h2 className="text-4xl font-extrabold mt-1 text-[#3D2B1F]">
              {t("dash_title", "Your Dashboard")}
            </h2>
          </div>

          <button
            onClick={() => router.push("/interview")}
            className="bg-[#A67B5B] hover:bg-[#8B5E3C] text-white px-6 py-3 rounded-2xl font-bold shadow-md transition"
          >
            {t("dash_btn_new_interview", "⚡ New Interview")}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-10">
          <div className="bg-white rounded-2xl shadow p-6 border border-amber-200/50">
            <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider">{t("dash_total_sessions", "Total Sessions")} 📋</h3>
            <p className="text-4xl font-extrabold mt-3 text-[#3D2B1F]">
              {totalSessions}
            </p>
            <p className="text-xs text-gray-500 mt-1">{totalSessions} sessions completed</p>
          </div>

          <div className="bg-white rounded-2xl shadow p-6 border border-amber-200/50">
            <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider">{t("dash_avg_score", "Average Score")} 📈</h3>
            <p className="text-4xl font-extrabold mt-3 text-[#3D2B1F]">
              {averageScore}%
            </p>
            <p className="text-xs text-gray-500 mt-1">Average Performance</p>
          </div>

          <div className="bg-white rounded-2xl shadow p-6 border border-amber-200/50">
            <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider">{t("dash_highest_score", "Highest Score")} 🏆</h3>
            <p className="text-4xl font-extrabold mt-3 text-[#3D2B1F]">
              {bestScore}%
            </p>
            <p className="text-xs text-gray-500 mt-1">Peak Performance</p>
          </div>

          <div className="bg-white rounded-2xl shadow p-6 border border-amber-200/50">
            <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider">{t("dash_practice_time", "Practice Time")} 🕛</h3>
            <p className="text-3xl font-extrabold mt-3 text-[#3D2B1F]">
              {totalPracticeTime}
            </p>
            <p className="text-xs text-gray-500 mt-1">Total Practice Time</p>
          </div>
        </div>

       

        <div className="bg-white rounded-xl shadow mt-10">

          <div className="flex border-b">

            <button
              onClick={() => setActiveTab("history")}
              className={`flex-1 py-4 ${
                activeTab === "history"
                  ? "border-b-4 border-[#A67B5B] text-[#A67B5B] font-semibold"
                  : ""
              }`}
            >
              Interview History
            </button>

            <button
              onClick={() => setActiveTab("resume")}
              className={`flex-1 py-4 ${
                activeTab === "resume"
                  ? "border-b-4 border-[#A67B5B] text-[#A67B5B] font-semibold"
                  : ""
              }`}
            >
              Resume Analysis
            </button>

          </div>

          <div className="p-12 text-center">

            {activeTab === "history" ? (
              <>
                <h2 className="text-2xl font-bold text-black">
                  No sessions yet
                </h2>

                <p className="text-gray-500 mt-3">
                  Start a practice interview or upload your resume for personalised domain suggestions .
                </p>

                <button
                  onClick={() => router.push("/interview")}
                  className="mt-8 bg-[#A67B5B] text-white px-6 py-3 rounded-lg"
                >
                  ⚡Start Interview
                </button>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-black">
                  Analyse Resume
                </h2>

                <p className="text-gray-500 mt-3">
                  Upload your resume and get AI-powered feedback.
                </p>

                <button
                  onClick={() => router.push("/resume")}
                  className="mt-8 bg-[#A67B5B] text-white px-6 py-3 rounded-lg"
                >
                  📄Analyze Resume
                </button>
              </>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}