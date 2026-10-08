import { NextResponse } from "next/server";

type Internship = {
  id?: string;
  title: string;
  company?: string;
  location?: string;
  work_type?: string;
  stipend?: string | number;
  description?: string;
  apply_url?: string;
  skills?: string[];
};

function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9+#.]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function calculateMatch(
  internship: Internship,
  resumeSkills: string[]
) {
  const text = normalize(
    [
      internship.title,
      internship.company,
      internship.location,
      internship.work_type,
      internship.description,
      ...(internship.skills ?? []),
    ]
      .filter(Boolean)
      .join(" ")
  );

  const matchedSkills = resumeSkills.filter((skill) => {
    const normalizedSkill = normalize(skill);
    return normalizedSkill.length > 0 && text.includes(normalizedSkill);
  });

  const score =
    resumeSkills.length === 0
      ? 0
      : Math.round((matchedSkills.length / resumeSkills.length) * 100);

  return {
    matchedSkills,
    matchPercentage: Math.min(score, 100),
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const resumeSkills: string[] = Array.isArray(body.skills)
      ? body.skills.filter(
          (skill: unknown): skill is string => typeof skill === "string"
        )
      : [];

    // No unofficial=true: fetch the regular internship listings.
    const response = await fetch(
      "https://api.hopinjobs.com/api/internships",
      {
        headers: { Accept: "application/json" },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(`Internship API returned ${response.status}`);
    }

    const apiData = await response.json();
    const internships: Internship[] = Array.isArray(apiData.internships)
      ? apiData.internships
      : [];

    const personalized = internships
      .map((internship) => ({
        ...internship,
        ...calculateMatch(internship, resumeSkills),
      }))
      .sort((a, b) => b.matchPercentage - a.matchPercentage);

    return NextResponse.json({
      internships: personalized,
      resumeSkills,
      totalResults: personalized.length,
      upstreamCount: internships.length,
    });
  } catch (error) {
    console.error("Internship API error:", error);

    return NextResponse.json(
      {
        internships: [],
        error:
          error instanceof Error
            ? error.message
            : "Unable to fetch internships right now.",
      },
      { status: 502 }
    );
  }
}