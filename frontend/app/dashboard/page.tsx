"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

type Interview = {
  _id: string;
  totalScore?: number;
  score?: number;
  totalQuestions?: number;
  answered?: number;
  skipped?: number;
  difficulty?: string;
  time?: string;
  createdAt?: string;
};

export default function Dashboard() {
  const router = useRouter();

  const [activeTab, setActiveTab] =
    useState("history");

  const [totalSessions, setTotalSessions] =
    useState(0);

  const [averageScore, setAverageScore] =
    useState(0);

  const [bestScore, setBestScore] =
    useState(0);

  const [totalPracticeTime, setTotalPracticeTime] =
    useState("00:00");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // =========================================================
  // LOAD INTERVIEW HISTORY FROM MONGODB
  // =========================================================

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        console.log(
          "FETCHING INTERVIEW HISTORY FROM MONGODB..."
        );

        const response = await fetch(
          "http://127.0.0.1:5000/api/interview/history",
          {
            method: "GET",
            cache: "no-store",
          }
        );

        const responseText =
          await response.text();

        console.log(
          "INTERVIEW HISTORY STATUS:",
          response.status
        );

        console.log(
          "INTERVIEW HISTORY RESPONSE:",
          responseText
        );

        let data;

        try {
          data = JSON.parse(responseText);
        } catch {
          throw new Error(
            "Interview history API returned invalid JSON."
          );
        }

        if (!response.ok) {
          throw new Error(
            data?.message ||
              data?.error ||
              `Failed to load interview history. Server returned ${response.status}.`
          );
        }

        const interviews: Interview[] =
          Array.isArray(data?.interviews)
            ? data.interviews
            : [];

        console.log(
          "MONGODB INTERVIEWS:",
          interviews
        );

        // =====================================================
        // TOTAL SESSIONS
        // =====================================================

        setTotalSessions(
          interviews.length
        );

        // =====================================================
        // SCORE CALCULATIONS
        // =====================================================

        if (interviews.length > 0) {
          const scores =
            interviews.map(
              (item) => {
                const totalScore =
                  Number(
                    item.totalScore ??
                      item.score ??
                      0
                  );

                const totalQuestions =
                  Number(
                    item.totalQuestions
                  ) || 5;

                const maximumScore =
                  totalQuestions * 10;

                if (
                  maximumScore <= 0
                ) {
                  return 0;
                }

                return Math.round(
                  (totalScore /
                    maximumScore) *
                    100
                );
              }
            );

          // ===================================================
          // AVERAGE SCORE
          // ===================================================

          const totalPercentage =
            scores.reduce(
              (
                sum,
                score
              ) =>
                sum + score,
              0
            );

          setAverageScore(
            Math.round(
              totalPercentage /
                scores.length
            )
          );

          // ===================================================
          // BEST SCORE
          // ===================================================

          setBestScore(
            Math.max(...scores)
          );

          // ===================================================
          // TOTAL PRACTICE TIME
          // ===================================================

          let totalSeconds = 0;

          interviews.forEach(
            (item) => {
              if (!item.time) {
                return;
              }

              const parts =
                item.time
                  .split(":")
                  .map(Number);

              if (
                parts.length === 2 &&
                !Number.isNaN(parts[0]) &&
                !Number.isNaN(parts[1])
              ) {
                const minutes =
                  parts[0];

                const seconds =
                  parts[1];

                totalSeconds +=
                  minutes * 60 +
                  seconds;
              }
            }
          );

          const minutes =
            Math.floor(
              totalSeconds / 60
            );

          const seconds =
            totalSeconds % 60;

          setTotalPracticeTime(
            `${String(
              minutes
            ).padStart(
              2,
              "0"
            )}:${String(
              seconds
            ).padStart(
              2,
              "0"
            )}`
          );
        } else {
          setAverageScore(0);
          setBestScore(0);
          setTotalPracticeTime(
            "00:00"
          );
        }
      } catch (error) {
        console.error(
          "DASHBOARD DATA ERROR:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load dashboard data."
        );

        setTotalSessions(0);
        setAverageScore(0);
        setBestScore(0);
        setTotalPracticeTime(
          "00:00"
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="min-h-screen bg-amber-100">

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <nav className="bg-[#A67B5B] shadow-sm px-8 py-4 flex justify-between items-center">

        <div className="flex justify-center gap-2">

          <h1 className="text-brown-500 font-bold text-[#A67B5B] w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center font-bold">
            AI
          </h1>

          <div>

            <h1 className="font-bold text-amber-100 text-lg">
              Career Compass
            </h1>

            <p className="text-xs text-white-500">
              AI POWERED
            </p>

          </div>

        </div>

        <div className="flex gap-8 font-md">

          <button
            className="text-gray-200 hover:text-blue-500"
          >
            ⚡Dashboard
          </button>

          <button
            onClick={() =>
              router.push(
                "/interview"
              )
            }
            className="text-gray-200 hover:text-blue-500"
          >
            🎯Practice
          </button>

          <button
            onClick={() =>
              router.push(
                "/history"
              )
            }
            className="text-gray-200 hover:text-blue-500"
          >
            📊My Sessions
          </button>

        </div>

        <div className="flex items-center gap-4">

          <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-2">

            <div className="w-8 h-8 rounded-full bg-[#A67B5B] text-white flex items-center justify-center font-bold">
              U
            </div>

            <span className="font-md text-black">
              Hi,
            </span>

            <span className="font-bold text-black">
              User
            </span>

          </div>

          <button className="bg-gray-100 text-black px-5 py-2 rounded-full">
            Logout
          </button>

        </div>

      </nav>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <div className="max-w-7xl mx-auto p-8">

        {/* ===================================================
            HEADER
        =================================================== */}

        <div className="flex justify-between items-center">

          <div className="text-black">

            <p className="text-gray-500">
              Welcome Back👋
            </p>

            <h2 className="text-4xl font-bold mt-2">
              Your Dashboard
            </h2>

          </div>

          <button
            onClick={() =>
              router.push(
                "/interview"
              )
            }
            className="bg-[#A67B5B] text-white px-6 py-3 rounded-2xl"
          >
            ⚡New Interview
          </button>

        </div>

        {/* ===================================================
            ERROR
        =================================================== */}

        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 text-red-600 rounded-xl p-4">
            {error}
          </div>
        )}

        {/* ===================================================
            STAT CARDS
        =================================================== */}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-10">

          {/* TOTAL SESSIONS */}

          <div className="bg-white rounded-xl shadow p-6">

            <h3 className="text-gray-500">
              Total Sessions 📋
            </h3>

            <p className="text-4xl font-bold mt-3 text-black">
              {loading
                ? "..."
                : totalSessions}
            </p>

            <p>
              {totalSessions} sessions
            </p>

          </div>

          {/* AVERAGE SCORE */}

          <div className="bg-white rounded-xl shadow p-6">

            <h3 className="text-gray-500">
              Average Score 📈
            </h3>

            <p className="text-4xl font-bold mt-3 text-black">
              {loading
                ? "..."
                : `${averageScore}%`}
            </p>

            <p>
              Average Performance
            </p>

          </div>

          {/* BEST SCORE */}

          <div className="bg-white rounded-xl shadow p-6">

            <h3 className="text-gray-500">
              Best Score 🏆
            </h3>

            <p className="text-4xl font-bold mt-3 text-black">
              {loading
                ? "..."
                : `${bestScore}%`}
            </p>

            <p>
              Highest Score
            </p>

          </div>

          {/* PRACTICE TIME */}

          <div className="bg-white rounded-xl shadow p-6">

            <h3 className="text-gray-500">
              Practice Time 🕛
            </h3>

            <p className="text-3xl font-bold mt-2 text-black">
              {loading
                ? "..."
                : totalPracticeTime}
            </p>

            <p>
              Total Practice Time
            </p>

          </div>

        </div>

        {/* ===================================================
            TABS
        =================================================== */}

        <div className="bg-white rounded-xl shadow mt-10">

          <div className="flex border-b">

            <button
              onClick={() =>
                setActiveTab(
                  "history"
                )
              }
              className={`flex-1 py-4 ${
                activeTab ===
                "history"
                  ? "border-b-4 border-[#A67B5B] text-[#A67B5B] font-semibold"
                  : ""
              }`}
            >
              Interview History
            </button>

            <button
              onClick={() =>
                setActiveTab(
                  "resume"
                )
              }
              className={`flex-1 py-4 ${
                activeTab ===
                "resume"
                  ? "border-b-4 border-[#A67B5B] text-[#A67B5B] font-semibold"
                  : ""
              }`}
            >
              Resume Analysis
            </button>

          </div>

          <div className="p-12 text-center">

            {activeTab ===
            "history" ? (
              <>

                {loading ? (
                  <>
                    <div className="w-10 h-10 border-4 border-[#A67B5B] border-t-transparent rounded-full animate-spin mx-auto"></div>

                    <h2 className="text-2xl font-bold text-black mt-5">
                      Loading Sessions
                    </h2>

                    <p className="text-gray-500 mt-3">
                      Fetching your interview history from MongoDB...
                    </p>
                  </>
                ) : totalSessions ===
                  0 ? (
                  <>
                    <h2 className="text-2xl font-bold text-black">
                      No sessions yet
                    </h2>

                    <p className="text-gray-500 mt-3">
                      Start a practice interview or upload your resume for personalised domain suggestions.
                    </p>

                    <button
                      onClick={() =>
                        router.push(
                          "/interview"
                        )
                      }
                      className="mt-8 bg-[#A67B5B] text-white px-6 py-3 rounded-lg"
                    >
                      ⚡Start Interview
                    </button>
                  </>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-black">
                      {totalSessions} Interview Sessions
                    </h2>

                    <p className="text-gray-500 mt-3">
                      Your interview performance is being loaded from MongoDB.
                    </p>

                    <button
                      onClick={() =>
                        router.push(
                          "/history"
                        )
                      }
                      className="mt-8 bg-[#A67B5B] text-white px-6 py-3 rounded-lg"
                    >
                      📊View Interview History
                    </button>
                  </>
                )}

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
                  onClick={() =>
                    router.push(
                      "/resume"
                    )
                  }
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