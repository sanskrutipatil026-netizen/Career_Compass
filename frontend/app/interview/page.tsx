"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Message = {
  sender: "AI" | "You";
  text: string;
  type?: "question" | "feedback";
};

type InterviewItem = {
  question: string;
  answer: string;
  topic: string;
  difficulty: string;
  score: number;
  feedback: string;
  status: "Answered" | "Skipped";
};

type ResumeResult = {
  overallScore?: number;
  experienceLevel?: string;
  skills?: string[];
  strengths?: string[];
  weaknesses?: string[];
  communicationGaps?: string[];
  missingIndustrySkills?: string[];
  education?: unknown;
  experience?: unknown;
  projects?: unknown;
  certifications?: unknown;
  certs?: unknown;
  domains?: string[];
};

export default function InterviewPage() {
  const router = useRouter();

  const [currentQuestion, setCurrentQuestion] =
    useState("");

  const [currentTopic, setCurrentTopic] =
    useState("Resume");

  const [difficulty, setDifficulty] =
    useState("easy");

  const [answer, setAnswer] =
    useState("");

  const [questionCount, setQuestionCount] =
    useState(1);

  const [score, setScore] =
    useState(0);

  const [answered, setAnswered] =
    useState(0);

  const [skipped, setSkipped] =
    useState(0);

  const [previousAnswers, setPreviousAnswers] =
    useState<string[]>([]);

  const [interviewHistory, setInterviewHistory] =
    useState<InterviewItem[]>([]);

  const [messages, setMessages] =
    useState<Message[]>([]);

  const [seconds, setSeconds] =
    useState(0);

  const [isLoading, setIsLoading] =
    useState(false);

  const [isStarting, setIsStarting] =
    useState(true);

  const [resumeData, setResumeData] =
    useState<ResumeResult | null>(null);

  // =========================================================
  // TIMER
  // =========================================================

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(
        (previous) => previous + 1
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // =========================================================
  // FORMAT TIME
  // =========================================================

  const formatTime = () => {
    const minutes = String(
      Math.floor(seconds / 60)
    ).padStart(2, "0");

    const secondsValue = String(
      seconds % 60
    ).padStart(2, "0");

    return `${minutes}:${secondsValue}`;
  };

  // =========================================================
  // SAVE COMPLETE INTERVIEW TO MONGODB
  // =========================================================

  const saveInterviewToMongoDB = async (
    history: InterviewItem[],
    finalScore: number,
    finalAnswered: number,
    finalSkipped: number,
    finalDifficulty: string
  ) => {
    try {
      console.log(
        "SAVING COMPLETE INTERVIEW TO MONGODB..."
      );

      const response = await fetch(
        "http://localhost:5000/api/interview/save",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            resumeScore:
              Number(
                resumeData?.overallScore
              ) || 0,

            questions: history,

            totalScore:
              Number(finalScore) || 0,

            totalQuestions:
              history.length,

            answered:
              Number(finalAnswered) || 0,

            skipped:
              Number(finalSkipped) || 0,

            difficulty:
              finalDifficulty || "easy",

            time:
              formatTime(),
          }),
        }
      );

      const responseText =
        await response.text();

      console.log(
        "MONGODB INTERVIEW SAVE STATUS:",
        response.status
      );

      console.log(
        "MONGODB INTERVIEW SAVE RESPONSE:",
        responseText
      );

      let data;

      try {
        data = JSON.parse(responseText);
      } catch {
        throw new Error(
          "Interview server returned invalid JSON."
        );
      }

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.error ||
            "Failed to save interview to MongoDB."
        );
      }

      if (!data?.success) {
        throw new Error(
          data?.message ||
            "MongoDB did not save the interview."
        );
      }

      console.log(
        "INTERVIEW SAVED SUCCESSFULLY TO MONGODB"
      );

      return data;
    } catch (error) {
      console.error(
        "MONGODB INTERVIEW SAVE ERROR:",
        error
      );

      throw error;
    }
  };

  // =========================================================
  // LOAD RESUME FROM MONGODB + START INTERVIEW
  // =========================================================

  useEffect(() => {
    startInterview();
  }, []);

  const startInterview = async () => {
    try {
      setIsStarting(true);

      console.log(
        "FETCHING RESUME ANALYSIS FROM MONGODB..."
      );

      // =======================================================
      // GET RESUME ANALYSIS FROM MONGODB
      // =======================================================

      const resumeResponse =
        await fetch(
          "http://localhost:5000/api/resume-analysis/latest",
          {
            method: "GET",
            cache: "no-store",
          }
        );

      const resumeText =
        await resumeResponse.text();

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

      let resumeDataResponse;

      try {
        resumeDataResponse =
          JSON.parse(resumeText);
      } catch {
        throw new Error(
          "Resume analysis API returned invalid JSON."
        );
      }

      console.log(
        "MONGODB RESUME DATA:",
        resumeDataResponse
      );

      if (
        !resumeDataResponse.success ||
        !resumeDataResponse.resumeAnalysis
          ?.analysis
      ) {
        throw new Error(
          "No resume analysis found in MongoDB. Please upload and analyze your resume first."
        );
      }

      const resumeResult: ResumeResult =
        resumeDataResponse
          .resumeAnalysis.analysis;

      console.log(
        "RESUME DATA FOR INTERVIEW:",
        resumeResult
      );

      setResumeData(
        resumeResult
      );

      // =======================================================
      // GENERATE FIRST AI QUESTION
      // =======================================================

      const response =
        await fetch(
          "/api/interview",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              mode: "start",

              resume:
                resumeResult,

              history: [],

              askedQuestions: [],

              answer: "start",

              difficulty: "easy",
            }),
          }
        );

      const data =
        await response.json();

      console.log(
        "FIRST INTERVIEW RESPONSE:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Failed to start interview."
        );
      }

      if (!data?.result) {
        throw new Error(
          "AI did not return the first question."
        );
      }

      const result =
        typeof data.result ===
        "string"
          ? JSON.parse(data.result)
          : data.result;

      if (!result?.nextQuestion) {
        throw new Error(
          "AI did not generate a question."
        );
      }

      // =======================================================
      // SET FIRST QUESTION
      // =======================================================

      setCurrentQuestion(
        result.nextQuestion
      );

      setCurrentTopic(
        result.topic ||
          "Resume"
      );

      setDifficulty(
        result.difficulty ||
          "easy"
      );

      setMessages([
        {
          sender: "AI",
          text:
            result.nextQuestion,
          type: "question",
        },
      ]);
    } catch (error) {
      console.error(
        "START INTERVIEW ERROR:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to start AI interview."
      );

      router.push("/dashboard");
    } finally {
      setIsStarting(false);
    }
  };

  // =========================================================
  // GENERATE UNIQUE NEXT QUESTION
  // =========================================================

  const getUniqueQuestion = async (
    history: InterviewItem[],
    currentDifficulty: string
  ) => {
    while (true) {
      const response =
        await fetch(
          "/api/interview",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              mode: "continue",

              resume:
                resumeData,

              history:
                history,

              askedQuestions:
                history.map(
                  (item) =>
                    item.question
                ),

              answer:
                "continue",

              difficulty:
                currentDifficulty,
            }),
          }
        );

      const data =
        await response.json();

      console.log(
        "NEXT QUESTION RESPONSE:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Failed to generate next question."
        );
      }

      if (!data?.result) {
        throw new Error(
          "AI result is missing."
        );
      }

      const result =
        typeof data.result ===
        "string"
          ? JSON.parse(data.result)
          : data.result;

      if (!result?.nextQuestion) {
        throw new Error(
          "AI did not generate the next question."
        );
      }

      const exists =
        history.some(
          (item) =>
            item.question
              .trim()
              .toLowerCase() ===
            result.nextQuestion
              .trim()
              .toLowerCase()
        );

      if (!exists) {
        return result;
      }
    }
  };

  // =========================================================
  // SEND ANSWER
  // =========================================================

  const handleSend = async () => {
    if (isLoading) return;

    if (!answer.trim()) {
      return;
    }

    setIsLoading(true);

    try {
      const userAnswer =
        answer.trim();

      const isRepeated =
        previousAnswers.some(
          (previous) =>
            previous.toLowerCase() ===
            userAnswer.toLowerCase()
        );

      if (isRepeated) {
        alert(
          "You already gave the same answer. Try explaining differently."
        );

        setIsLoading(false);
        return;
      }

      const response =
        await fetch(
          "/api/interview",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              mode: "answer",

              resume:
                resumeData,

              history:
                interviewHistory,

              askedQuestions:
                interviewHistory.map(
                  (item) =>
                    item.question
                ),

              answer:
                userAnswer,

              difficulty,
            }),
          }
        );

      const data =
        await response.json();

      console.log(
        "ANSWER RESPONSE:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "API request failed."
        );
      }

      if (!data?.result) {
        throw new Error(
          "AI did not return a result."
        );
      }

      const aiResult =
        typeof data.result ===
        "string"
          ? JSON.parse(data.result)
          : data.result;

      console.log(
        "AI EVALUATION:",
        aiResult
      );

      // =======================================================
      // SCORE
      // =======================================================

      const answerScore =
        Number(aiResult.score) ||
        0;

      const newScore =
        score + answerScore;

      setScore(
        newScore
      );

      // =======================================================
      // DIFFICULTY
      // =======================================================

      const nextDifficulty =
        aiResult.difficulty ||
        difficulty;

      setDifficulty(
        nextDifficulty
      );

      // =======================================================
      // STORE ANSWER IN REACT STATE ONLY
      // =======================================================

      setPreviousAnswers(
        (previous) => [
          ...previous,
          userAnswer,
        ]
      );

      setMessages(
        (previous) => [
          ...previous,

          {
            sender: "You",
            text:
              userAnswer,
          },

          {
            sender: "AI",
            text:
              `Feedback: ${
                aiResult.feedback ||
                "Answer evaluated."
              }\nScore: ${answerScore}/10`,
            type: "feedback",
          },
        ]
      );

      // =======================================================
      // ADD TO HISTORY
      // =======================================================

      const updatedHistory:
        InterviewItem[] = [
          ...interviewHistory,

          {
            question:
              currentQuestion,

            answer:
              userAnswer,

            topic:
              currentTopic,

            difficulty:
              nextDifficulty,

            score:
              answerScore,

            feedback:
              aiResult.feedback ||
              "Answer evaluated.",

            status:
              "Answered",
          },
        ];

      setInterviewHistory(
        updatedHistory
      );

      // =======================================================
      // ANSWERED COUNT
      // =======================================================

      const newAnswered =
        answered + 1;

      setAnswered(
        newAnswered
      );

      setAnswer("");

      // =======================================================
      // INTERVIEW COMPLETE
      // =======================================================

      if (
        updatedHistory.length >= 5
      ) {
        const finalScore =
          updatedHistory.reduce(
            (
              total,
              item
            ) =>
              total +
              Number(
                item.score || 0
              ),
            0
          );

        const finalAnswered =
          updatedHistory.filter(
            (item) =>
              item.status ===
              "Answered"
          ).length;

        const finalSkipped =
          updatedHistory.filter(
            (item) =>
              item.status ===
              "Skipped"
          ).length;

        // =====================================================
        // SAVE TO MONGODB
        // =====================================================

        await saveInterviewToMongoDB(
          updatedHistory,
          finalScore,
          finalAnswered,
          finalSkipped,
          nextDifficulty
        );

        // =====================================================
        // GO TO RESULT
        // =====================================================

        router.push(
          "/result"
        );

        return;
      }

      // =======================================================
      // GENERATE NEXT QUESTION
      // =======================================================

      const uniqueResult =
        await getUniqueQuestion(
          updatedHistory,
          nextDifficulty
        );

      setMessages(
        (previous) => [
          ...previous,

          {
            sender: "AI",
            text:
              uniqueResult.nextQuestion,
            type: "question",
          },
        ]
      );

      setCurrentQuestion(
        uniqueResult.nextQuestion
      );

      setCurrentTopic(
        uniqueResult.topic ||
          "Resume"
      );

      setDifficulty(
        uniqueResult.difficulty ||
          nextDifficulty
      );

      setQuestionCount(
        (previous) =>
          previous + 1
      );
    } catch (error) {
      console.error(
        "SEND ANSWER ERROR:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to evaluate answer."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // =========================================================
  // SKIP QUESTION
  // =========================================================

  const handleSkip = async () => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      const response =
        await fetch(
          "/api/interview",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              mode: "skip",

              resume:
                resumeData,

              history:
                interviewHistory,

              askedQuestions:
                interviewHistory.map(
                  (item) =>
                    item.question
                ),

              answer:
                "Skipped",

              difficulty,
            }),
          }
        );

      const data =
        await response.json();

      console.log(
        "SKIP RESPONSE:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Failed to skip question."
        );
      }

      if (!data?.result) {
        throw new Error(
          "AI did not return a result."
        );
      }

      const aiResult =
        typeof data.result ===
        "string"
          ? JSON.parse(data.result)
          : data.result;

      const updatedHistory:
        InterviewItem[] = [
          ...interviewHistory,

          {
            question:
              currentQuestion,

            answer:
              "Skipped",

            topic:
              currentTopic,

            difficulty:
              aiResult.difficulty ||
              difficulty,

            score:
              0,

            feedback:
              "Question skipped by candidate.",

            status:
              "Skipped",
          },
        ];

      setInterviewHistory(
        updatedHistory
      );

      const newSkipped =
        skipped + 1;

      setSkipped(
        newSkipped
      );

      // =======================================================
      // INTERVIEW COMPLETE
      // =======================================================

      if (
        updatedHistory.length >= 5
      ) {
        const finalScore =
          updatedHistory.reduce(
            (
              total,
              item
            ) =>
              total +
              Number(
                item.score || 0
              ),
            0
          );

        const finalAnswered =
          updatedHistory.filter(
            (item) =>
              item.status ===
              "Answered"
          ).length;

        const finalSkipped =
          updatedHistory.filter(
            (item) =>
              item.status ===
              "Skipped"
          ).length;

        const finalDifficulty =
          aiResult.difficulty ||
          difficulty;

        // =====================================================
        // SAVE TO MONGODB
        // =====================================================

        await saveInterviewToMongoDB(
          updatedHistory,
          finalScore,
          finalAnswered,
          finalSkipped,
          finalDifficulty
        );

        // =====================================================
        // GO TO RESULT
        // =====================================================

        router.push(
          "/result"
        );

        return;
      }

      // =======================================================
      // GENERATE NEXT QUESTION
      // =======================================================

      const uniqueResult =
        await getUniqueQuestion(
          updatedHistory,
          aiResult.difficulty ||
            difficulty
        );

      setMessages(
        (previous) => [
          ...previous,

          {
            sender: "AI",
            text:
              "Feedback: Question skipped by candidate.\nScore: 0/10",
            type: "feedback",
          },

          {
            sender: "AI",
            text:
              uniqueResult.nextQuestion,
            type: "question",
          },
        ]
      );

      setCurrentQuestion(
        uniqueResult.nextQuestion
      );

      setCurrentTopic(
        uniqueResult.topic ||
          "Resume"
      );

      setDifficulty(
        uniqueResult.difficulty ||
          difficulty
      );

      setQuestionCount(
        (previous) =>
          previous + 1
      );
    } catch (error) {
      console.error(
        "SKIP ERROR:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to skip question."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // =========================================================
  // LOADING SCREEN
  // =========================================================

  if (isStarting) {
    return (
      <div className="min-h-screen bg-amber-100 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-10 text-center">
          <div className="w-10 h-10 border-4 border-[#A67B5B] border-t-transparent rounded-full animate-spin mx-auto"></div>

          <h2 className="text-2xl font-bold text-gray-800 mt-5">
            Preparing Your AI Interview
          </h2>

          <p className="text-gray-500 mt-2">
            Analyzing your resume and generating personalized questions...
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="min-h-screen bg-amber-100">

      {/* NAVBAR */}

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

        <div className="flex gap-8 font-medium justify-center">

          <button
            type="button"
            className="text-gray-200 hover:text-blue-500"
            onClick={() =>
              router.push("/dashboard")
            }
          >
            Dashboard
          </button>

          <button
            type="button"
            onClick={() =>
              router.push("/interview")
            }
            className="text-gray-200 hover:text-blue-500"
          >
            Practice
          </button>

          <button
            type="button"
            onClick={() =>
              router.push("/history")
            }
            className="text-gray-200 hover:text-blue-500"
          >
            My Sessions
          </button>

        </div>

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
            type="button"
            className="bg-gray-100 text-black px-5 py-2 rounded-full"
          >
            Logout
          </button>

        </div>

      </nav>

      {/* INTERVIEW HEADER */}

      <div className="bg-white mx-10 mt-6 rounded-xl shadow p-6">

        <div className="flex flex-wrap justify-between items-center gap-6">

          <div>

            <h2 className="text-2xl font-bold text-black">
              Resume-Based AI Interview
            </h2>

            <p className="text-gray-400">
              Personalized interview generated from your resume
            </p>

          </div>

          <p className="text-green-600 font-semibold rounded-full bg-green-100 px-3 py-1">
            ● Live
          </p>

          <div className="text-center">

            <p className="text-gray-500">
              Question {questionCount} of 5
            </p>

            <p className="font-bold text-xl text-gray-400">
              {formatTime()}
            </p>

          </div>

          <button
            type="button"
            onClick={() =>
              router.push("/dashboard")
            }
            className="bg-[#A67B5B] text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Exit
          </button>

        </div>

      </div>

      {/* INTERVIEW STATUS */}

      <div className="mx-10 mt-6 bg-white rounded-xl shadow-lg p-6">

        <h3 className="text-lg font-bold text-gray-700 mb-4">
          Interview Status
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-blue-50 rounded-xl p-4 text-center">

            <p className="text-gray-500">
              Progress
            </p>

            <h2 className="text-3xl font-bold text-blue-600">
              {Math.min(
                Math.round(
                  (questionCount / 5) *
                    100
                ),
                100
              )}
              %
            </h2>

          </div>

          <div className="bg-yellow-50 rounded-xl p-4 text-center">

            <p className="text-gray-500">
              Difficulty Level
            </p>

            <h2 className="text-3xl font-bold text-yellow-600">
              {difficulty.toUpperCase()}
            </h2>

          </div>

          <div className="bg-green-50 rounded-xl p-4 text-center">

            <p className="text-gray-500">
              Score
            </p>

            <h2 className="text-3xl font-bold text-green-600">
              {score}/50
            </h2>

          </div>

        </div>

        <div className="w-full bg-gray-200 rounded-full h-3 mt-6">

          <div
            className="bg-blue-600 h-3 rounded-full transition-all"
            style={{
              width: `${Math.min(
                (questionCount / 5) *
                  100,
                100
              )}%`,
            }}
          />

        </div>

      </div>

      {/* CHAT */}

      <div className="mx-10 mt-6 bg-white rounded-xl shadow h-[520px] flex flex-col">

        <div className="flex-1 overflow-y-auto p-6 space-y-5">

          {messages.map(
            (msg, index) => (

              <div
                key={index}
                className={`flex ${
                  msg.sender === "AI"
                    ? "justify-start"
                    : "justify-end"
                }`}
              >

                <div
                  className={`max-w-xl rounded-xl px-5 py-3 ${
                    msg.sender === "AI"
                      ? "bg-gray-200 text-black"
                      : "bg-blue-500 text-white"
                  }`}
                >

                  <p
                    className={`font-bold mb-1 ${
                      msg.sender === "AI"
                        ? "text-black"
                        : "text-white"
                    }`}
                  >
                    {msg.sender}
                  </p>

                  <p className="whitespace-pre-line">
                    {msg.text}
                  </p>

                </div>

              </div>
            )
          )}

          {isLoading && (
            <div className="flex justify-start">

              <div className="bg-gray-200 text-gray-500 rounded-xl px-5 py-3">
                AI is thinking...
              </div>

            </div>
          )}

        </div>

        {/* ANSWER INPUT */}

        <div className="border-t p-5">

          <div className="flex gap-3">

            <input
              value={answer}
              onChange={(event) =>
                setAnswer(
                  event.target.value
                )
              }
              onKeyDown={(event) => {
                if (
                  event.key === "Enter" &&
                  !event.shiftKey
                ) {
                  event.preventDefault();

                  handleSend();
                }
              }}
              placeholder="Type your answer..."
              disabled={isLoading}
              className="flex-1 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black border"
            />

            <button
              type="button"
              onClick={handleSend}
              disabled={
                isLoading ||
                !answer.trim()
              }
              className="bg-[#A67B5B] text-white px-8 rounded-lg disabled:opacity-50"
            >
              Send
            </button>

            <button
              type="button"
              onClick={handleSkip}
              disabled={isLoading}
              className="bg-[#A67B5B] text-white px-8 rounded-lg disabled:opacity-50"
            >
              Skip
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}