
import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // =========================================================
    // DATA FROM FRONTEND
    // =========================================================

    const history = body.history || [];
    const answer = body.answer || "";
    const difficulty = body.difficulty || "easy";
    const askedQuestions = body.askedQuestions || [];

    // IMPORTANT:
    // Resume analysis is now received from the frontend.
    const resume = body.resume || {};

    const mode = body.mode || "answer";

    console.log("INTERVIEW MODE:", mode);
    console.log("RESUME RECEIVED:", resume);
    console.log("HISTORY:", history);
    console.log("ANSWER:", answer);

    // =========================================================
    // EXTRACT RESUME INFORMATION
    // =========================================================

    const resumeSkills = Array.isArray(resume.skills)
      ? resume.skills
      : [];

    const resumeStrengths = Array.isArray(resume.strengths)
      ? resume.strengths
      : [];

    const resumeWeaknesses = Array.isArray(resume.weaknesses)
      ? resume.weaknesses
      : [];

    const resumeCommunicationGaps =
      Array.isArray(resume.communicationGaps)
        ? resume.communicationGaps
        : [];

    const resumeMissingSkills =
      Array.isArray(resume.missingIndustrySkills)
        ? resume.missingIndustrySkills
        : [];

    const resumeDomains = Array.isArray(resume.domains)
      ? resume.domains
      : [];

    // =========================================================
    // BUILD RESUME CONTEXT
    // =========================================================

    const resumeContext = `
CANDIDATE RESUME INFORMATION

Experience Level:
${resume.experienceLevel || "Not specified"}

Overall Resume Score:
${resume.overallScore ?? "Not specified"}

Skills:
${resumeSkills.length > 0
  ? resumeSkills.join(", ")
  : "Not specified"}

Strengths:
${resumeStrengths.length > 0
  ? resumeStrengths.join(", ")
  : "Not specified"}

Weaknesses:
${resumeWeaknesses.length > 0
  ? resumeWeaknesses.join(", ")
  : "Not specified"}

Communication Gaps:
${resumeCommunicationGaps.length > 0
  ? resumeCommunicationGaps.join(", ")
  : "Not specified"}

Missing Industry Skills:
${resumeMissingSkills.length > 0
  ? resumeMissingSkills.join(", ")
  : "Not specified"}

Domains:
${resumeDomains.length > 0
  ? resumeDomains.join(", ")
  : "Not specified"}

Education:
${JSON.stringify(resume.education || "Not specified")}

Experience:
${JSON.stringify(resume.experience || "Not specified")}

Projects:
${JSON.stringify(resume.projects || "Not specified")}

Certifications:
${JSON.stringify(
  resume.certifications ||
    resume.certs ||
    "Not specified"
)}
`;

    // =========================================================
    // PREVIOUS QUESTIONS
    // =========================================================

    const previousQuestions =
      askedQuestions.length > 0
        ? askedQuestions.join("\n")
        : "No questions asked yet.";

    // =========================================================
    // PREVIOUS HISTORY
    // =========================================================

    const previousHistory =
      history.length > 0
        ? JSON.stringify(history)
        : "No previous interview history.";

    // =========================================================
    // START INTERVIEW
    // =========================================================

    const isStarting =
      mode === "start" ||
      answer.toLowerCase() === "start";

    // =========================================================
    // PROMPT
    // =========================================================

    const prompt = `
You are an AI Technical Interviewer conducting a personalized interview.

Your most important task is to ask questions based on the candidate's ACTUAL RESUME.

${resumeContext}

CURRENT DIFFICULTY:
${difficulty}

QUESTIONS ALREADY ASKED:
${previousQuestions}

PREVIOUS INTERVIEW HISTORY:
${previousHistory}

CANDIDATE'S LATEST ANSWER:
${isStarting ? "Interview is starting. There is no candidate answer yet." : answer}

=========================================================
INTERVIEW QUESTION RULES
=========================================================

1. The interview must be PERSONALIZED to this candidate's resume.

2. Use the candidate's actual:
   - Skills
   - Projects
   - Experience
   - Education
   - Certifications
   - Domains

3. Prefer questions about things the candidate has actually mentioned
   in their resume.

4. If the candidate has a project, ask questions about that project.

5. If the candidate has a technical skill, ask questions about that skill.

6. If the candidate has work/internship experience, ask questions about
   what they actually did.

7. Do NOT invent projects, companies, experience, technologies or
   certifications that are not present in the resume.

8. Do NOT ask generic questions when a relevant resume-specific
   question can be asked.

9. Every question must be different from previous questions.

10. Do not ask the exact same concept repeatedly.

11. The interview should gradually become more difficult when the
    candidate answers well.

12. If the candidate performs poorly, maintain or reduce difficulty.

13. Questions should be technical and suitable for the candidate's
    experience level.

14. Ask only ONE question at a time.

=========================================================
QUESTION DISTRIBUTION
=========================================================

Across a 5-question interview, try to cover different areas:

Question 1:
Start with an easy question about a skill, project, education,
or experience from the resume.

Question 2:
Ask about another technical skill or project detail.

Question 3:
Ask a practical/application-based question related to the resume.

Question 4:
Ask a deeper technical or problem-solving question.

Question 5:
Ask a more challenging question related to the candidate's
strongest relevant technical area.

Do not force this exact sequence if the resume does not contain
enough information. Use the available resume information instead.

=========================================================
ANSWER EVALUATION RULES
=========================================================

If this is NOT the first question:

1. Evaluate the candidate's latest answer.

2. Give a score from 0 to 10.

3. Consider:
   - Technical correctness
   - Understanding
   - Relevance
   - Explanation quality

4. Give short and useful feedback.

If the candidate skipped:

- score = 0
- feedback = "Question skipped by candidate."

If this is the FIRST question:

- score = 0
- feedback = "Interview started."

=========================================================
DIFFICULTY
=========================================================

Return one of:

"easy"
"medium"
"hard"

Increase difficulty when the candidate demonstrates good understanding.

Decrease or maintain difficulty when the candidate struggles.

=========================================================
IMPORTANT
=========================================================

Never repeat a question from:

${previousQuestions}

Do not generate a question that tests exactly the same concept as
a previous question.

The next question MUST be related to the candidate's resume whenever
possible.

Return ONLY valid JSON.

Return exactly:

{
  "score": 8,
  "difficulty": "medium",
  "feedback": "Good explanation of the concept.",
  "nextQuestion": "Your question based on the candidate's resume.",
  "topic": "React"
}
`;

    // =========================================================
    // GROQ REQUEST
    // =========================================================

    const completion =
      await groq.chat.completions.create({
        model: "openai/gpt-oss-120b",

        temperature: 0.3,

        response_format: {
          type: "json_object",
        },

        messages: [
          {
            role: "system",
            content:
              "You are an AI technical interviewer. Always return ONLY valid JSON. Questions must be personalized using the candidate's resume.",
          },

          {
            role: "user",
            content: prompt,
          },
        ],
      });

    // =========================================================
    // GET GROQ RESPONSE
    // =========================================================

    const content =
      completion.choices[0]?.message?.content;

    console.log(
      "GROQ RAW INTERVIEW RESPONSE:",
      content
    );

    if (!content) {
      return NextResponse.json(
        {
          error:
            "AI returned an empty response.",
        },
        {
          status: 500,
        }
      );
    }

    // =========================================================
    // PARSE JSON
    // =========================================================

    let result;

    try {
      result = JSON.parse(content);
    } catch (parseError) {
      console.error(
        "FAILED TO PARSE GROQ RESPONSE:",
        content
      );

      return NextResponse.json(
        {
          error:
            "AI returned invalid JSON.",
        },
        {
          status: 500,
        }
      );
    }

    // =========================================================
    // VALIDATE RESULT
    // =========================================================

    if (
      typeof result.score !== "number" ||
      !result.difficulty ||
      !result.feedback ||
      !result.nextQuestion
    ) {
      console.error(
        "INCOMPLETE AI RESULT:",
        result
      );

      return NextResponse.json(
        {
          error:
            "AI returned incomplete interview result.",
        },
        {
          status: 500,
        }
      );
    }

    // =========================================================
    // NORMALIZE SCORE
    // =========================================================

    result.score = Math.max(
      0,
      Math.min(
        10,
        Number(result.score)
      )
    );

    // =========================================================
    // FINAL RESPONSE
    // =========================================================

    console.log(
      "FINAL PERSONALIZED INTERVIEW RESULT:",
      result
    );

    return NextResponse.json({
      result,
    });

  } catch (error: any) {

    console.error(
      "INTERVIEW API ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          error?.message ||
          error?.error?.message ||
          "Failed to generate interview result.",
      },
      {
        status: 500,
      }
    );
  }
}

