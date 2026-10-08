"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Question = {
  question: string;
  answer: string;
  topic?: string;
  difficulty?: string;
  score: number;
  feedback: string;
  status: string;
};

type Interview = {
  _id: string;
  totalScore: number;
  totalQuestions: number;
  answered: number;
  skipped: number;
  difficulty: string;
  time: string;
  createdAt: string;
  questions: Question[];
};

export default function HistoryPage() {
  const router = useRouter();

  const [history, setHistory] = useState<Interview[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================================
  // FETCH INTERVIEW HISTORY FROM MONGODB
  // ==========================================================

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "http://127.0.0.1:5000/api/interview/history",
          {
            method: "GET",
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to fetch interview history."
          );
        }

        setHistory(data.interviews || []);
      } catch (error) {
        console.error(
          "❌ Failed to fetch interview history:",
          error
        );

        setError(
          "Unable to load interview history from MongoDB."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  // ==========================================================
  // DELETE INTERVIEW FROM MONGODB
  // ==========================================================

  const deleteInterview = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this interview?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:5000/api/interview/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete interview."
        );
      }

      setHistory((previousHistory) =>
        previousHistory.filter(
          (item) => item._id !== id
        )
      );

      setOpenIndex(null);

    } catch (error) {
      console.error(
        "❌ Delete interview error:",
        error
      );

      alert(
        "Failed to delete interview from MongoDB."
      );
    }
  };

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <div className="text-2xl font-bold text-[#A67B5B]">
            Loading Interview History...
          </div>

          <p className="text-gray-500 mt-2">
            Fetching your interviews from MongoDB
          </p>
        </div>
      </div>
    );
  }

  // ==========================================================
  // CALCULATIONS
  // ==========================================================

  const scores = history.map(
    (item) => Number(item.totalScore) || 0
  );

  const bestScore =
    scores.length > 0
      ? Math.max(...scores)
      : 0;

  const latestScore =
    history.length > 0
      ? Number(history[0].totalScore) || 0
      : 0;

  const oldestScore =
    history.length > 0
      ? Number(
          history[history.length - 1].totalScore
        ) || 0
      : 0;

  const improvement =
    history.length > 1
      ? latestScore - oldestScore
      : 0;

  // ==========================================================
  // MAIN UI
  // ==========================================================

  return (
    <div className="min-h-screen bg-amber-100">

      {/* ====================================================
          NAVBAR
      ==================================================== */}

      <nav className="bg-[#A67B5B] shadow px-8 py-4 flex justify-between items-center">

        {/* LOGO */}

        <div className="flex items-center gap-2">

          <div className="w-10 h-10 rounded-xl bg-amber-100 text-[#A67B5B] flex items-center justify-center font-bold">
            AI
          </div>

          <div>
            <h1 className="font-bold text-amber-100 text-lg">
              MockInterview
            </h1>

            <p className="text-xs text-amber-100">
              AI POWERED
            </p>
          </div>

        </div>

        {/* NAVIGATION */}

        <div className="flex gap-8 font-medium justify-center">

          <button
            className="text-gray-200 hover:text-blue-300"
            onClick={() =>
              router.push("/dashboard")
            }
          >
            ⚡Dashboard
          </button>

          <button
            onClick={() =>
              router.push("/interview")
            }
            className="text-gray-200 hover:text-blue-300"
          >
            🎯Practice
          </button>

          <button
            onClick={() =>
              router.push("/history")
            }
            className="text-white font-bold"
          >
            📊My Sessions
          </button>

        </div>

        {/* USER */}

        <div className="flex items-center justify-center gap-4">

          <div className="flex justify-center gap-2 bg-gray-100 rounded-full px-3 py-2">

            <div className="w-8 h-8 rounded-full bg-[#A67B5B] text-white flex items-center justify-center font-bold">
              U
            </div>

            <span className="font-medium text-black">
              Hi,
            </span>

            <span className="font-bold text-black">
              User
            </span>

          </div>

          <button
            className="bg-gray-100 text-black px-5 py-2 rounded-full"
            onClick={() => {
              router.push("/login");
            }}
          >
            Logout
          </button>

        </div>

      </nav>

      {/* ====================================================
          PAGE CONTENT
      ==================================================== */}

      <div className="min-h-screen bg-gray-100 p-8">

        {/* ERROR */}

        {error && (
          <div className="bg-red-50 border border-red-300 text-red-700 rounded-xl p-5 mb-8">
            <p className="font-semibold">
              {error}
            </p>

            <p className="text-sm mt-2">
              Make sure your Express backend is running
              on port 5000.
            </p>
          </div>
        )}

        {/* ==================================================
            EMPTY STATE
        ================================================== */}

        {history.length === 0 ? (

          <div className="bg-white rounded-xl shadow-lg p-10 text-center">

            <h2 className="text-2xl font-bold text-gray-800">
              No Interview History
            </h2>

            <p className="text-gray-500 mt-3">
              Complete an interview to see your
              results here.
            </p>

            <button
              onClick={() =>
                router.push("/interview")
              }
              className="mt-6 bg-[#A67B5B] text-white px-6 py-3 rounded-lg"
            >
              Start Interview
            </button>

          </div>

        ) : (

          <>
            {/* ==================================================
                PROGRESS OVERVIEW
            ================================================== */}

            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">

              <h2 className="text-2xl font-bold text-gray-800 mb-5">
                📈 Progress Overview
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                {/* BEST SCORE */}

                <div className="bg-blue-50 rounded-xl p-5">

                  <p className="text-gray-500">
                    Best Interview Score
                  </p>

                  <p className="text-3xl font-bold text-blue-600 mt-2">
                    {bestScore}/50
                  </p>

                </div>

                {/* LATEST SCORE */}

                <div className="bg-green-50 rounded-xl p-5">

                  <p className="text-gray-500">
                    Latest Interview Score
                  </p>

                  <p className="text-3xl font-bold text-green-600 mt-2">
                    {latestScore}/50
                  </p>

                </div>

                {/* IMPROVEMENT */}

                <div className="bg-purple-50 rounded-xl p-5">

                  <p className="text-gray-500">
                    Improvement
                  </p>

                  <p className="text-3xl font-bold text-purple-600 mt-2">

                    {history.length > 1
                      ? `${
                          improvement >= 0
                            ? "+"
                            : ""
                        }${improvement}`
                      : "0"}

                  </p>

                </div>

              </div>

            </div>

            {/* ==================================================
                INTERVIEW CARDS
            ================================================== */}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">

              {history.map(
                (item, index) => {

                  const percentage =
                    Math.round(
                      (item.totalScore / 50) *
                        100
                    );

                  return (

                    <div
                      key={item._id}
                      className="bg-white rounded-xl shadow-lg p-6 h-fit"
                    >

                      {/* TITLE */}

                      <h2 className="text-xl font-bold text-[#A67B5B]">
                        Interview #{history.length - index}
                      </h2>

                      {/* DATE */}

                      <p className="text-black mt-3">
                        🗓 Interview Date:{" "}
                        {new Date(
                          item.createdAt
                        ).toLocaleDateString()}
                      </p>

                      {/* SCORE */}

                      <p className="text-black">
                        ⭐ Score:{" "}
                        {item.totalScore}/50
                      </p>

                      {/* ANSWERED */}

                      <p className="text-black">
                        ✅ Answered:{" "}
                        {item.answered}
                      </p>

                      {/* SKIPPED */}

                      <p className="text-black">
                        ⏩ Skipped:{" "}
                        {item.skipped}
                      </p>

                      {/* DIFFICULTY */}

                      <p className="text-black">
                        🎯 Difficulty:{" "}
                        {item.difficulty}
                      </p>

                      {/* TIME */}

                      <p className="text-black">
                        🕛 Time:{" "}
                        {item.time}
                      </p>

                      {/* VERDICT */}

                      <p className="text-black font-semibold mt-2">

                        🏆 Final Verdict:

                        {percentage >= 80
                          ? " Excellent"
                          : percentage >= 60
                          ? " Good"
                          : percentage >= 40
                          ? " Average"
                          : " Needs Improvement"}

                      </p>

                      {/* SCORE BAR */}

                      <div className="mt-4">

                        <div className="flex justify-between text-sm mb-2">

                          <span>
                            Score Progress
                          </span>

                          <span>
                            {percentage}%
                          </span>

                        </div>

                        <div className="w-full bg-gray-300 rounded-full h-3">

                          <div
                            className={`${
                              percentage >= 80
                                ? "bg-green-500"
                                : percentage >= 60
                                ? "bg-blue-500"
                                : percentage >= 40
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            } h-3 rounded-full`}
                            style={{
                              width: `${Math.min(
                                percentage,
                                100
                              )}%`,
                            }}
                          />

                        </div>

                      </div>

                      {/* BUTTONS */}

                      <div className="flex gap-3 mt-5">

                        <button
                          onClick={() =>
                            setOpenIndex(
                              openIndex === index
                                ? null
                                : index
                            )
                          }
                          className="bg-[#A67B5B] text-white px-4 py-2 rounded-lg"
                        >
                          📄 View Details
                        </button>

                        <button
                          onClick={() =>
                            deleteInterview(
                              item._id
                            )
                          }
                          className="bg-red-500 text-white px-4 py-2 rounded-lg"
                        >
                          🗑 Delete
                        </button>

                      </div>

                      {/* QUESTIONS */}

                      {openIndex === index && (

                        <div className="mt-5 border-t pt-4">

                          <h3 className="font-bold mb-3 text-green-600">
                            Questions & Answers
                          </h3>

                          {item.questions.map(
                            (q, i) => (

                              <div
                                key={i}
                                className="bg-gray-700 text-white rounded-lg p-4 mb-3"
                              >

                                <p>
                                  <b>
                                    Question:
                                  </b>{" "}
                                  {q.question}
                                </p>

                                <p className="mt-2">
                                  <b>
                                    Answer:
                                  </b>{" "}
                                  {q.answer ||
                                    "No answer"}
                                </p>

                                <p className="mt-2">
                                  <b>
                                    Feedback:
                                  </b>{" "}
                                  {q.feedback ||
                                    "No feedback"}
                                </p>

                                <p className="mt-2">
                                  <b>
                                    Score:
                                  </b>{" "}
                                  {q.score}/10
                                </p>

                                <p className="mt-2">
                                  <b>
                                    Status:
                                  </b>{" "}
                                  {q.status}
                                </p>

                              </div>

                            )
                          )}

                        </div>

                      )}

                    </div>

                  );
                }
              )}

            </div>

            {/* ==================================================
                PROGRESS GRAPH
            ================================================== */}

            <div className="bg-white rounded-xl shadow-lg p-6 mt-8">

              <h2 className="text-2xl font-bold text-gray-800 mb-5">
                📈 Interview Progress
              </h2>

              <div className="flex items-end gap-4 h-64 border-b border-l border-gray-300 px-4 overflow-x-auto">

                {[...history]
                  .reverse()
                  .map(
                    (item, index) => {

                      const percentage =
                        Math.round(
                          (item.totalScore /
                            50) *
                            100
                        );

                      return (

                        <div
                          key={item._id}
                          className="min-w-16 flex flex-col items-center justify-end h-full"
                        >

                          <span className="text-sm font-bold text-blue-600 mb-2">
                            {percentage}%
                          </span>

                          <div
                            className="w-12 bg-[#A67B5B] rounded-t-lg"
                            style={{
                              height: `${Math.max(
                                percentage,
                                5
                              )}%`,
                            }}
                          />

                          <span className="text-xs text-gray-500 mt-2">
                            #{index + 1}
                          </span>

                        </div>

                      );
                    }
                  )}

              </div>

              <p className="text-center text-gray-500 mt-4">
                Interview attempts
              </p>

            </div>

            {/* ==================================================
                CANDIDATE POTENTIAL
            ================================================== */}

            {history.length >= 2 && (

              <div className="bg-white rounded-xl shadow-lg p-6 mt-8">

                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  ⭐ Candidate Potential
                </h2>

                {improvement >= 15 ? (

                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">

                    <h3 className="text-xl font-bold text-blue-700">
                      Strong Improvement
                    </h3>

                    <p className="text-gray-600 mt-2">
                      Your latest interview score is{" "}
                      <b>
                        {Math.abs(
                          improvement
                        )}
                      </b>{" "}
                      points higher than your
                      earliest recorded interview.
                    </p>

                  </div>

                ) : (

                  <div className="bg-gray-50 border rounded-xl p-5">

                    <h3 className="text-xl font-bold text-gray-700">
                      Keep Practicing
                    </h3>

                    <p className="text-gray-600 mt-2">
                      Continue practicing interviews
                      and review the feedback from
                      previous attempts.
                    </p>

                  </div>

                )}

              </div>

            )}

            {/* ==================================================
                RECOMMENDATIONS
            ================================================== */}

            <div className="bg-white rounded-xl shadow-lg p-6 mt-8">

              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                🤖 Personalized Recommendations
              </h2>

              {history.length === 1 ? (

                <div className="bg-blue-50 rounded-xl p-4">

                  <p className="text-gray-700">
                    Complete more interviews to
                    receive personalized
                    recommendations based on your
                    progress.
                  </p>

                </div>

              ) : (

                <div className="space-y-3">

                  {latestScore <
                    oldestScore && (

                    <div className="border rounded-lg p-3 text-gray-700">

                      ⚠️ Your latest interview score
                      is lower than your earliest
                      recorded score. Review the
                      feedback from your previous
                      interview.

                    </div>

                  )}

                  {latestScore >=
                    oldestScore && (

                    <div className="border rounded-lg p-3 text-gray-700">

                      ✅ Your latest interview score
                      is at or above your earliest
                      recorded score. Continue
                      practicing consistently.

                    </div>

                  )}

                  {latestScore < 30 && (

                    <div className="border rounded-lg p-3 text-gray-700">

                      📚 Focus on fundamental
                      technical concepts and
                      problem-solving questions.

                    </div>

                  )}

                  {latestScore >= 40 && (

                    <div className="border rounded-lg p-3 text-gray-700">

                      🚀 Consider practicing more
                      advanced interview questions
                      and real-world problems.

                    </div>

                  )}

                </div>

              )}

            </div>

          </>

        )}

      </div>

    </div>
  );
}