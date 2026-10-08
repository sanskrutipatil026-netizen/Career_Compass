"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type HistoryItem = {
  question: string;
  answer: string;
  topic: string;
  difficulty: string;
  score: number;
  feedback: string;
  status: "Answered" | "Skipped";
};

type ResultType = {
  _id?: string;
  resumeScore?: number;
  score?: number;
  totalScore?: number;
  totalQuestions?: number;
  answered: number;
  skipped: number;
  difficulty: string;
  time: string;
  history?: HistoryItem[];
  questions?: HistoryItem[];
  createdAt?: string;
};

export default function ResultPage() {
  const router = useRouter();

  const [result, setResult] =
    useState<ResultType | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // =========================================================
  // LOAD LATEST INTERVIEW FROM MONGODB
  // =========================================================

  useEffect(() => {
    const loadLatestInterview = async () => {
      try {
        setIsLoading(true);
        setError("");

        console.log(
          "FETCHING LATEST INTERVIEW FROM MONGODB..."
        );

        const response = await fetch(
          "http://localhost:5000/api/interview/latest",
          {
            method: "GET",
            cache: "no-store",
          }
        );

        const responseText =
          await response.text();

        console.log(
          "LATEST INTERVIEW STATUS:",
          response.status
        );

        console.log(
          "LATEST INTERVIEW RESPONSE:",
          responseText
        );

        let data;

        try {
          data = JSON.parse(responseText);
        } catch {
          throw new Error(
            "Interview API returned invalid JSON."
          );
        }

        if (!response.ok) {
          throw new Error(
            data?.message ||
              data?.error ||
              `Failed to load interview result. Server returned ${response.status}.`
          );
        }

        if (
          !data?.success ||
          !data?.interview
        ) {
          throw new Error(
            "No interview result found in MongoDB."
          );
        }

        const mongoInterview =
          data.interview;

        // =====================================================
        // CONVERT MONGODB DATA TO RESULT FORMAT
        // =====================================================

        const formattedResult: ResultType = {
          _id:
            mongoInterview._id,

          resumeScore:
            Number(
              mongoInterview.resumeScore
            ) || 0,

          score:
            Number(
              mongoInterview.totalScore
            ) || 0,

          totalScore:
            Number(
              mongoInterview.totalScore
            ) || 0,

          totalQuestions:
            Number(
              mongoInterview.totalQuestions
            ) || 5,

          answered:
            Number(
              mongoInterview.answered
            ) || 0,

          skipped:
            Number(
              mongoInterview.skipped
            ) || 0,

          difficulty:
            mongoInterview.difficulty ||
            "easy",

          time:
            mongoInterview.time ||
            "00:00",

          questions:
            Array.isArray(
              mongoInterview.questions
            )
              ? mongoInterview.questions
              : [],

          createdAt:
            mongoInterview.createdAt,
        };

        console.log(
          "FORMATTED MONGODB RESULT:",
          formattedResult
        );

        setResult(
          formattedResult
        );
      } catch (error) {
        console.error(
          "LOAD RESULT ERROR:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load interview result from MongoDB."
        );

        setResult(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadLatestInterview();
  }, []);

  // =========================================================
  // LOADING
  // =========================================================

  if (isLoading) {
    return (
      <div className="min-h-screen bg-amber-100 flex items-center justify-center">

        <div className="bg-white rounded-xl shadow-lg p-10 text-center">

          <div className="w-10 h-10 border-4 border-[#A67B5B] border-t-transparent rounded-full animate-spin mx-auto"></div>

          <h2 className="text-2xl font-bold text-gray-800 mt-5">
            Loading Interview Result
          </h2>

          <p className="text-gray-500 mt-2">
            Fetching your interview result from MongoDB...
          </p>

        </div>

      </div>
    );
  }

  // =========================================================
  // NO RESULT / MONGODB ERROR
  // =========================================================

  if (!result) {
    return (
      <div className="min-h-screen bg-amber-100 flex items-center justify-center">

        <div className="bg-white rounded-xl shadow-lg p-10 text-center max-w-md">

          <h2 className="text-2xl font-bold text-gray-800">
            No Interview Result Found
          </h2>

          <p className="text-gray-500 mt-2">
            {error ||
              "Please complete an interview first."}
          </p>

          <button
            onClick={() =>
              router.push(
                "/interview"
              )
            }
            className="mt-6 bg-[#A67B5B] text-white px-8 py-3 rounded-lg hover:bg-blue-700"
          >
            Start Interview
          </button>

        </div>

      </div>
    );
  }

  // =========================================================
  // NORMALIZE SCORE + HISTORY
  // =========================================================

  const finalScore =
    Number(
      result.totalScore ??
        result.score ??
        0
    );

  const finalHistory =
    result.questions ??
    result.history ??
    [];

  // =========================================================
  // INTERVIEW PERCENTAGE
  // =========================================================

  const totalQuestions =
    Number(
      result.totalQuestions
    ) || 5;

  const maximumScore =
    totalQuestions * 10;

  const interviewPercentage =
    maximumScore > 0
      ? Math.round(
          (finalScore /
            maximumScore) *
            100
        )
      : 0;

  // =========================================================
  // VERDICT
  // =========================================================

  let verdict = "";
  let color = "";

  if (finalScore >= 40) {
    verdict = "⭐ Excellent";
    color = "text-green-600";
  } else if (finalScore >= 30) {
    verdict = "Good";
    color = "text-blue-600";
  } else if (finalScore >= 20) {
    verdict = "Average";
    color = "text-yellow-600";
  } else {
    verdict =
      "Needs Improvement";
    color = "text-red-600";
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="min-h-screen bg-amber-100">

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <nav className="bg-[#A67B5B] shadow px-8 py-4 flex justify-between items-center">

        <div className="flex items-center gap-2">

          <div className="w-10 h-10 rounded-xl bg-amber-100 text-[#A67B5B] flex items-center justify-center font-bold">
            AI
          </div>

          <div>

            <h1 className="font-bold text-amber-100 text-lg">
              MockInterview
            </h1>

            <p className="text-xs text-gray-200">
              AI POWERED
            </p>

          </div>

        </div>

        <div className="flex gap-8 font-md justify-center">

          <button
            className="text-gray-200 hover:text-blue-500"
            onClick={() =>
              router.push(
                "/dashboard"
              )
            }
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

        <div className="flex items-center justify-center gap-4">

          <div className="flex justify-center gap-2 bg-gray-100 rounded-full px-3 py-2">

            <div className="w-8 h-8 rounded-full bg-[#A67B5B] text-white flex items-center justify-center font-bold">
              S
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
          TITLE
      ===================================================== */}

      <h1 className="text-4xl font-bold text-center mb-8 mt-8 text-[#A67B5B]">
        Interview Result
      </h1>

      {/* =====================================================
          SCORE SUMMARY
      ===================================================== */}

      <div className="grid grid-cols-1 md:grid-cols-5 gap-5 mb-10 px-10">

        {/* SCORE */}

        <div className="bg-white rounded-xl shadow p-5 text-center">

          <p className="text-black">
            Score
          </p>

          <h2 className="text-3xl font-bold text-gray-700">
            {finalScore}/
            {maximumScore}
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            {interviewPercentage}%
          </p>

        </div>

        {/* ANSWERED */}

        <div className="bg-white rounded-xl shadow p-5 text-center">

          <p className="text-black">
            Answered
          </p>

          <h2 className="text-3xl font-bold text-gray-700">
            {result.answered}
          </h2>

        </div>

        {/* SKIPPED */}

        <div className="bg-white rounded-xl shadow p-5 text-center">

          <p className="text-black">
            Skipped
          </p>

          <h2 className="text-3xl font-bold text-gray-700">
            {result.skipped}
          </h2>

        </div>

        {/* DIFFICULTY */}

        <div className="bg-white rounded-xl shadow p-5 text-center">

          <p className="text-black">
            Difficulty
          </p>

          <h2 className="text-3xl font-bold text-gray-700">
            {result.difficulty}
          </h2>

        </div>

        {/* TIME */}

        <div className="bg-white rounded-xl shadow p-5 text-center">

          <p className="text-black">
            Time
          </p>

          <h2 className="text-3xl font-bold text-gray-700">
            {result.time}
          </h2>

        </div>

      </div>

      {/* =====================================================
          RESUME SCORE
      ===================================================== */}

      <div className="px-10 mb-8">

        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-2xl font-bold mb-3 text-gray-700">
            Resume Score Used
          </h2>

          <p className="text-gray-600 text-lg">
            Your resume score used for this interview:
          </p>

          <p className="text-4xl font-bold text-[#A67B5B] mt-2">
            {Number(
              result.resumeScore || 0
            )}
            /100
          </p>

        </div>

      </div>

      {/* =====================================================
          CANDIDATE PROGRESS
      ===================================================== */}

      <div className="bg-white rounded-xl shadow p-6 mb-8 mx-10">

        <h2 className="text-2xl font-bold mb-5 text-gray-700">
          Candidate Progress
        </h2>

        {finalHistory.length === 0 ? (
          <p className="text-gray-500">
            No question details found.
          </p>
        ) : (
          finalHistory.map(
            (item, index) => (

              <div
                key={index}
                className="border rounded-xl p-5 mb-5 text-gray-500"
              >

                <h3 className="font-bold text-lg text-gray-700">
                  Question {index + 1}
                </h3>

                <p className="mt-2 text-gray-500">
                  <b>Question:</b>{" "}
                  {item.question}
                </p>

                <p>
                  <b>Your Answer:</b>{" "}
                  {item.answer}
                </p>

                <p>
                  <b>Status:</b>{" "}
                  {item.status}
                </p>

                <p>
                  <b>Topic:</b>{" "}
                  {item.topic}
                </p>

                <p>
                  <b>Difficulty:</b>{" "}
                  {item.difficulty}
                </p>

                <p>
                  <b>Score:</b>{" "}
                  {item.score}/10
                </p>

                <p className="text-blue-600">
                  <b>AI Feedback:</b>{" "}
                  {item.feedback}
                </p>

              </div>

            )
          )
        )}

      </div>

      {/* =====================================================
          INTERVIEW VERDICT
      ===================================================== */}

      <div className="bg-white rounded-xl shadow p-6 mb-8 mx-10">

        <h2 className="text-2xl font-bold mb-4 text-gray-700">
          Interview Verdict
        </h2>

        <p
          className={`text-3xl font-bold ${color}`}
        >
          {verdict}
        </p>

      </div>

      {/* =====================================================
          BUTTONS
      ===================================================== */}

      <div className="flex justify-center gap-5 pb-10">

        <button
          onClick={() =>
            router.push(
              "/interview"
            )
          }
          className="bg-[#A67B5B] text-white px-8 py-3 rounded-lg hover:bg-blue-700"
        >
          Practice Again
        </button>

        <button
          onClick={() =>
            router.push(
              "/history"
            )
          }
          className="bg-[#A67B5B] text-white px-8 py-3 rounded-lg hover:bg-blue-700"
        >
          History
        </button>

      </div>

    </div>
  );
}