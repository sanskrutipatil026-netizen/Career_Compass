"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Question = {
  question: string;
  options: string[];
  answer: string;
  skill: string;
};

type ResumeResult = {
  skills?: string[];
  experienceLevel?: string;
  overallScore?: number;
};

export default function SkillsPage() {
  const router = useRouter();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);

  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  // =========================================================
  // GENERATE QUESTIONS
  // =========================================================

  useEffect(() => {
    generateQuestions();
  }, []);

  const generateQuestions = async () => {
    try {
      setLoading(true);
      setError("");
      setFinished(false);
      setCurrent(0);
      setScore(0);

      // =======================================================
      // GET RESUME ANALYSIS FROM MONGODB
      // =======================================================

      console.log("Fetching resume analysis from MongoDB...");

      const resumeResponse = await fetch(
        "http://localhost:5000/api/resume-analysis/latest",
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const resumeText = await resumeResponse.text();

      console.log(
        "RESUME API STATUS:",
        resumeResponse.status
      );

      console.log(
        "RESUME API RESPONSE:",
        resumeText
      );

      if (!resumeResponse.ok) {
        throw new Error(
          `Failed to load resume analysis. Server returned ${resumeResponse.status}.`
        );
      }

      let resumeData;

      try {
        resumeData = JSON.parse(resumeText);
      } catch {
        throw new Error(
          "Resume analysis API returned invalid JSON."
        );
      }

      console.log(
        "MONGODB RESUME DATA:",
        resumeData
      );

      if (
        !resumeData.success ||
        !resumeData.resumeAnalysis?.analysis
      ) {
        throw new Error(
          "No resume analysis found in MongoDB. Please analyze your resume first."
        );
      }

      const result: ResumeResult =
        resumeData.resumeAnalysis.analysis;

      console.log(
        "RESUME ANALYSIS:",
        result
      );

      // =======================================================
      // GET SKILLS FROM RESUME
      // =======================================================

      const skills = result.skills || [];

      console.log(
        "SKILLS FROM MONGODB:",
        skills
      );

      if (
        !Array.isArray(skills) ||
        skills.length === 0
      ) {
        throw new Error(
          "No skills were found in your resume. Please analyze your resume again."
        );
      }

      // =======================================================
      // SEND RESUME SKILLS TO GROQ API
      // =======================================================

      const response = await fetch(
        "/api/interview/skill",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            skills: skills,
            experienceLevel:
              result.experienceLevel || "Fresher",
          }),
        }
      );

      const data = await response.json();

      console.log(
        "SKILL API STATUS:",
        response.status
      );

      console.log(
        "SKILL API RESPONSE:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Failed to generate skill assessment."
        );
      }

      // =======================================================
      // CHECK QUESTIONS
      // =======================================================

      if (
        !data.questions ||
        !Array.isArray(data.questions) ||
        data.questions.length === 0
      ) {
        throw new Error(
          "AI did not return any questions."
        );
      }

      console.log(
        "GENERATED QUESTIONS:",
        data.questions
      );

      setQuestions(data.questions);
      setCurrent(0);
      setScore(0);
      setFinished(false);
    } catch (error) {
      console.error(
        "SKILLS ASSESSMENT ERROR:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to generate AI assessment."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // SAVE FINAL SCORE TO MONGODB
  // =========================================================

  const saveAssessment = async (
    finalScore: number
  ) => {
    try {
      setSaving(true);
      setError("");

      // =======================================================
      // GET RESUME ANALYSIS FROM MONGODB AGAIN
      // =======================================================

      console.log(
        "Fetching resume data from MongoDB before saving..."
      );

      const resumeResponse = await fetch(
        "http://localhost:5000/api/resume-analysis/latest",
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const resumeText =
        await resumeResponse.text();

      if (!resumeResponse.ok) {
        throw new Error(
          `Failed to fetch resume analysis. Server returned ${resumeResponse.status}.`
        );
      }

      let resumeData;

      try {
        resumeData = JSON.parse(resumeText);
      } catch {
        throw new Error(
          "Resume analysis API returned invalid JSON."
        );
      }

      if (
        !resumeData.success ||
        !resumeData.resumeAnalysis?.analysis
      ) {
        throw new Error(
          "Resume analysis was not found in MongoDB."
        );
      }

      const resumeResult: ResumeResult =
        resumeData.resumeAnalysis.analysis;

      // =======================================================
      // CALCULATE PERCENTAGE
      // =======================================================

      const percentage =
        questions.length > 0
          ? Math.round(
              (finalScore / questions.length) *
                100
            )
          : 0;

      // =======================================================
      // DATA TO SAVE
      // =======================================================

      const assessmentData = {
        score: finalScore,
        percentage: percentage,
        totalQuestions: questions.length,

        skills: Array.isArray(
          resumeResult.skills
        )
          ? resumeResult.skills
          : [],

        experienceLevel:
          resumeResult.experienceLevel ||
          "Fresher",

        date: new Date().toISOString(),
      };

      console.log(
        "SAVING ASSESSMENT TO MONGODB:",
        assessmentData
      );

      // =======================================================
      // SAVE TO EXPRESS BACKEND
      // =======================================================

      const response = await fetch(
        "http://localhost:5000/api/skill-assessment/save",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            assessmentData
          ),
        }
      );

      const responseText =
        await response.text();

      console.log(
        "MONGODB SAVE STATUS:",
        response.status
      );

      console.log(
        "MONGODB SAVE RESPONSE:",
        responseText
      );

      let data;

      try {
        data = JSON.parse(responseText);
      } catch {
        throw new Error(
          "Skill assessment server returned invalid JSON."
        );
      }

      if (!response.ok) {
        throw new Error(
          data?.error ||
            data?.message ||
            "Failed to save assessment score."
        );
      }

      console.log(
        "ASSESSMENT SAVED SUCCESSFULLY TO MONGODB"
      );

      return true;
    } catch (error) {
      console.error(
        "SAVE SCORE ERROR:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to save assessment score."
      );

      return false;
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // HANDLE ANSWER
  // =========================================================

  const handleAnswer = async (
    option: string
  ) => {
    if (saving) return;

    const question =
      questions[current];

    if (!question) return;

    // =======================================================
    // CHECK ANSWER
    // =======================================================

    const isCorrect =
      option.trim().toLowerCase() ===
      question.answer
        .trim()
        .toLowerCase();

    const newScore = isCorrect
      ? score + 1
      : score;

    console.log(
      "SELECTED ANSWER:",
      option
    );

    console.log(
      "CORRECT ANSWER:",
      question.answer
    );

    console.log(
      "IS CORRECT:",
      isCorrect
    );

    console.log(
      "CURRENT SCORE:",
      newScore
    );

    setScore(newScore);

    // =======================================================
    // LAST QUESTION
    // =======================================================

    if (
      current ===
      questions.length - 1
    ) {
      console.log(
        "FINAL SCORE:",
        newScore
      );

      const saved =
        await saveAssessment(
          newScore
        );

      if (saved) {
        setFinished(true);
      }

      return;
    }

    // =======================================================
    // NEXT QUESTION
    // =======================================================

    setCurrent(
      current + 1
    );
  };

  // =========================================================
  // LOADING SCREEN
  // =========================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-100 flex items-center justify-center">
        <div className="text-center bg-white p-10 rounded-2xl shadow-lg">
          <div className="w-12 h-12 border-4 border-[#A67B5B] border-t-transparent rounded-full animate-spin mx-auto mb-5"></div>

          <h2 className="text-2xl font-bold text-gray-800">
            Generating Your Assessment
          </h2>

          <p className="text-gray-600 mt-2">
            AI is creating questions based on your resume skills...
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // ERROR SCREEN
  // =========================================================

  if (error && !finished) {
    return (
      <div className="min-h-screen bg-amber-100">
        <nav className="bg-[#A67B5B] text-white px-6 py-4 flex justify-between items-center shadow-md">
          <div>
            <h1 className="text-xl font-bold">
              MockInterview
            </h1>

            <p className="text-xs opacity-90">
              AI POWERED
            </p>
          </div>

          <div className="flex gap-6 text-sm">
            <button
              onClick={() =>
                router.push(
                  "/dashboard"
                )
              }
              className="hover:text-amber-100"
            >
              Dashboard
            </button>

            <button
              onClick={() =>
                router.push(
                  "/practice"
                )
              }
              className="hover:text-amber-100"
            >
              Practice
            </button>

            <button
              onClick={() =>
                router.push(
                  "/sessions"
                )
              }
              className="hover:text-amber-100"
            >
              My Sessions
            </button>
          </div>
        </nav>

        <div className="flex items-center justify-center min-h-[80vh] px-5">
          <div className="bg-white rounded-2xl shadow-lg p-10 max-w-lg w-full text-center">
            <div className="text-5xl mb-5">
              !
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Assessment Error
            </h2>

            <p className="text-gray-600 mb-7">
              {error}
            </p>

            <div className="flex gap-3 justify-center">
              <button
                onClick={
                  generateQuestions
                }
                className="px-6 py-3 bg-[#A67B5B] text-white rounded-lg font-semibold hover:bg-[#8B6247] transition"
              >
                Try Again
              </button>

              <button
                onClick={() =>
                  router.push(
                    "/dashboard"
                  )
                }
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // RESULT SCREEN
  // =========================================================

  if (finished) {
    const percentage =
      questions.length > 0
        ? Math.round(
            (score /
              questions.length) *
              100
          )
        : 0;

    return (
      <div className="min-h-screen bg-amber-100">
        <nav className="bg-[#A67B5B] text-white px-6 py-4 flex justify-between items-center shadow-md">
          <div>
            <h1 className="text-xl font-bold">
              MockInterview
            </h1>

            <p className="text-xs opacity-90">
              AI POWERED
            </p>
          </div>

          <div className="flex gap-6 text-sm">
            <button
              onClick={() =>
                router.push(
                  "/dashboard"
                )
              }
              className="hover:text-amber-100"
            >
              Dashboard
            </button>

            <button
              onClick={() =>
                router.push(
                  "/practice"
                )
              }
              className="hover:text-amber-100"
            >
              Practice
            </button>

            <button
              onClick={() =>
                router.push(
                  "/sessions"
                )
              }
              className="hover:text-amber-100"
            >
              My Sessions
            </button>
          </div>
        </nav>

        <div className="flex items-center justify-center min-h-[80vh] px-5">
          <div className="bg-white rounded-3xl shadow-xl p-10 max-w-xl w-full text-center">
            <div className="text-6xl mb-5">
              ✓
            </div>

            <h2 className="text-3xl font-bold text-gray-800">
              Assessment Completed!
            </h2>

            <p className="text-gray-600 mt-3">
              Your AI-powered skill assessment has been completed.
            </p>

            <div className="mt-8 bg-amber-100 rounded-2xl p-8">
              <p className="text-gray-600 text-sm">
                Your Skill Assessment Score
              </p>

              <p className="text-6xl font-bold text-[#A67B5B] mt-2">
                {percentage}%
              </p>

              <p className="text-gray-700 mt-3">
                You scored{" "}
                <span className="font-bold">
                  {score}
                </span>{" "}
                out of{" "}
                <span className="font-bold">
                  {questions.length}
                </span>
              </p>
            </div>

            <div className="mt-5 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
              Your assessment score has been saved successfully.
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <button
                onClick={() =>
                  router.push(
                    "/placement"
                  )
                }
                className="flex-1 px-6 py-3 bg-[#A67B5B] text-white rounded-lg font-semibold hover:bg-[#8B6247] transition"
              >
                Check Placement Score
              </button>

              <button
                onClick={
                  generateQuestions
                }
                className="flex-1 px-6 py-3 border-2 border-[#A67B5B] text-[#A67B5B] rounded-lg font-semibold hover:bg-amber-50 transition"
              >
                Retake Assessment
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // QUESTION SCREEN
  // =========================================================

  const question =
    questions[current];

  if (!question) {
    return null;
  }

  const progress =
    ((current + 1) /
      questions.length) *
    100;

  return (
    <div className="min-h-screen bg-amber-100">
      <nav className="bg-[#A67B5B] text-white px-6 py-4 flex justify-between items-center shadow-md">
        <div>
          <h1 className="text-xl font-bold">
            MockInterview
          </h1>

          <p className="text-xs opacity-90">
            AI POWERED
          </p>
        </div>

        <div className="flex gap-6 text-sm">
          <button
            onClick={() =>
              router.push(
                "/dashboard"
              )
            }
            className="hover:text-amber-100"
          >
            Dashboard
          </button>

          <button
            onClick={() =>
              router.push(
                "/practice"
              )
            }
            className="hover:text-amber-100"
          >
            Practice
          </button>

          <button
            onClick={() =>
              router.push(
                "/sessions"
              )
            }
            className="hover:text-amber-100"
          >
            My Sessions
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-5 py-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            AI Skill Assessment
          </h2>

          <p className="text-gray-600 mt-2">
            Questions are generated from the skills detected in
            your resume.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-5 mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-semibold text-gray-700">
              Question {current + 1} of{" "}
              {questions.length}
            </span>

            <span className="text-sm font-semibold text-[#A67B5B]">
              {Math.round(progress)}%
            </span>
          </div>

          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#A67B5B] transition-all duration-300"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10">
          <div className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            Skill: {question.skill}
          </div>

          <h3 className="text-xl md:text-2xl font-bold text-gray-800 leading-relaxed mb-8">
            {question.question}
          </h3>

          <div className="space-y-4">
            {question.options.map(
              (option, index) => (
                <button
                  key={index}
                  onClick={() =>
                    handleAnswer(
                      option
                    )
                  }
                  disabled={saving}
                  className="w-full text-left px-5 py-4 border-2 border-gray-200 rounded-xl bg-white hover:border-[#A67B5B] hover:bg-amber-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center gap-4">
                    <span className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 font-bold text-gray-700">
                      {String.fromCharCode(
                        65 + index
                      )}
                    </span>

                    <span className="text-gray-800 font-medium">
                      {option}
                    </span>
                  </div>
                </button>
              )
            )}
          </div>

          {saving && (
            <div className="mt-6 text-center">
              <div className="inline-flex items-center gap-3 bg-amber-50 px-5 py-3 rounded-lg text-[#8B6247] font-semibold">
                <div className="w-5 h-5 border-2 border-[#A67B5B] border-t-transparent rounded-full animate-spin"></div>

                Saving your assessment score...
              </div>
            </div>
          )}
        </div>

        <div className="text-center mt-6">
          <p className="text-gray-600">
            Current Score:{" "}
            <span className="font-bold text-gray-800">
              {score}
            </span>
          </p>
        </div>
      </main>
    </div>
  );
}