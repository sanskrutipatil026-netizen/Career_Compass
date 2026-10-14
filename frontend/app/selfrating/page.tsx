"use client";

import { useState } from "react";

interface TeamMember {
  name: string;
  role: string;
  rating: number;
  icon: string;
}

const teamMembers: TeamMember[] = [
  {
    name: "Ayushi Khode",
    role: "Career Assessment & Analytics Developer",
    rating: 3.6,
    icon: "📊",
  },
  {
    name: "Kanak Padgilwar",
    role: "Frontend UI/UX Developer",
    rating: 3.5,
    icon: "🎨",
  },
  {
    name: "Sanskruti Patil",
    role: "Backend Developer",
    rating: 3.6,
    icon: "⚙️",
  },
  {
    name: "Mohini Zode",
    role: "Integration Developer",
    rating: 3.5,
    icon: "🔗",
  },
];

export default function SelfRatingPage() {
  const [selectedMember, setSelectedMember] = useState<string | null>(null);

  const overallRating =
    teamMembers.reduce((sum, member) => sum + member.rating, 0) /
    teamMembers.length;

  const getRatingText = (rating: number) => {
    if (rating >= 4.5) return "Excellent";
    if (rating >= 4) return "Very Good";
    if (rating >= 3.5) return "Good";
    if (rating >= 3) return "Developing";
    return "Needs Improvement";
  };

  return (
    <main className="min-h-screen bg-[#FFFCF5] text-[#4A3728]">

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 border-b border-[#E6D5C5] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-6 lg:px-12">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#A67B5B] text-xl text-white">
              🧭
            </div>

            <span className="text-xl font-bold text-[#76563F]">
              Career Compass
            </span>
          </div>

          {/* Navigation */}
          <div className="hidden items-center gap-8 md:flex">
            <a
              href="/"
              className="text-sm font-medium text-[#806D5E] transition hover:text-[#A67B5B]"
            >
              Home
            </a>

            <a
              href="#"
              className="text-sm font-medium text-[#806D5E] transition hover:text-[#A67B5B]"
            >
              Dashboard
            </a>

            <a
              href="#"
              className="text-sm font-medium text-[#806D5E] transition hover:text-[#A67B5B]"
            >
              Assessment
            </a>

            <a
              href="#"
              className="border-b-2 border-[#A67B5B] pb-1 text-sm font-semibold text-[#A67B5B]"
            >
              Self Rating
            </a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="rounded-b-[45px] bg-[#FEF3C7] px-6 py-14 text-center">

        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#A67B5B] text-2xl text-white shadow-md">
          ✓
        </div>

        <h1 className="mt-5 text-4xl font-bold text-[#76563F] md:text-5xl">
          Team Self Rating
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#806D5E] md:text-base">
          A quick overview of the team members, their roles, and
          self-assessed performance ratings in Career Compass.
        </p>
      </section>

      {/* MAIN CONTENT */}
      <section className="mx-auto w-[92%] max-w-6xl py-12">

        {/* OVERALL SUMMARY */}
        <div className="mb-8 rounded-3xl bg-[#A67B5B] p-7 text-white shadow-lg md:p-9">

          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">

            <div>
              <p className="text-sm font-medium opacity-80">
                Team Overview
              </p>

              <h2 className="mt-1 text-2xl font-bold">
                Overall Team Rating
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 opacity-80">
                The average self-rating of all four Career Compass team
                members.
              </p>
            </div>

            <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-[#FEF3C7] text-[#A67B5B] shadow-md">
              <span className="text-4xl font-bold">
                {overallRating.toFixed(1)}
              </span>

              <span className="text-xs font-medium">
                / 5.0
              </span>
            </div>

          </div>
        </div>

        {/* TEAM MEMBERS */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#76563F]">
            Team Members
          </h2>

          <p className="mt-1 text-sm text-[#806D5E]">
            Individual self-assessment ratings and responsibilities.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">

          {teamMembers.map((member) => (

            <div
              key={member.name}
              onClick={() =>
                setSelectedMember(
                  selectedMember === member.name
                    ? null
                    : member.name
                )
              }
              className="cursor-pointer rounded-3xl border border-[#E6D5C5] bg-white p-6 shadow-[0_8px_25px_rgba(166,123,91,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(166,123,91,0.15)]"
            >

              {/* MEMBER HEADER */}
              <div className="flex items-start justify-between gap-4">

                <div className="flex items-center gap-4">

                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#FEF3C7] text-2xl">
                    {member.icon}
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-[#76563F]">
                      {member.name}
                    </h3>

                    <p className="mt-1 text-sm leading-5 text-[#806D5E]">
                      {member.role}
                    </p>
                  </div>

                </div>

                {/* RATING */}
                <div className="rounded-xl bg-[#FEF3C7] px-3 py-2 text-center">
                  <span className="block text-xl font-bold text-[#A67B5B]">
                    {member.rating}
                  </span>

                  <span className="text-[10px] text-[#806D5E]">
                    / 5
                  </span>
                </div>

              </div>

              {/* RATING BAR */}
              <div className="mt-6">

                <div className="mb-2 flex justify-between text-xs">
                  <span className="font-medium text-[#806D5E]">
                    Self Rating
                  </span>

                  <span className="font-semibold text-[#A67B5B]">
                    {getRatingText(member.rating)}
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-[#FEF3C7]">

                  <div
                    className="h-full rounded-full bg-[#A67B5B] transition-all duration-500"
                    style={{
                      width: `${(member.rating / 5) * 100}%`,
                    }}
                  />

                </div>

              </div>

              {/* STARS */}
              <div className="mt-5 flex items-center justify-between">

                <div className="flex gap-1">

                  {[1, 2, 3, 4, 5].map((star) => (

                    <span
                      key={star}
                      className={
                        star <= Math.round(member.rating)
                          ? "text-lg text-[#A67B5B]"
                          : "text-lg text-[#D9C7B8]"
                      }
                    >
                      ★
                    </span>

                  ))}

                </div>

                <span className="text-xs text-[#806D5E]">
                  Click to view
                </span>

              </div>

              {/* EXPANDED DETAILS */}
              {selectedMember === member.name && (

                <div className="mt-5 rounded-2xl bg-[#FFF8E7] p-4">

                  <p className="text-xs font-semibold uppercase tracking-wide text-[#A67B5B]">
                    Role
                  </p>

                  <p className="mt-1 text-sm font-medium text-[#76563F]">
                    {member.role}
                  </p>

                  <div className="mt-4 grid grid-cols-3 gap-2">

                    <div className="rounded-xl bg-white p-3 text-center">
                      <p className="text-lg font-bold text-[#A67B5B]">
                        {member.rating}
                      </p>
                      <p className="text-[10px] text-[#806D5E]">
                        Rating
                      </p>
                    </div>

                    <div className="rounded-xl bg-white p-3 text-center">
                      <p className="text-lg font-bold text-[#A67B5B]">
                        {Math.round((member.rating / 5) * 100)}%
                      </p>
                      <p className="text-[10px] text-[#806D5E]">
                        Score
                      </p>
                    </div>

                    <div className="rounded-xl bg-white p-3 text-center">
                      <p className="text-lg font-bold text-[#A67B5B]">
                        {getRatingText(member.rating)}
                      </p>
                      <p className="text-[10px] text-[#806D5E]">
                        Level
                      </p>
                    </div>

                  </div>

                </div>

              )}

            </div>

          ))}

        </div>

        {/* REFLECTION / INSIGHT */}
        <div className="mt-8 rounded-3xl border border-[#E6D5C5] bg-white p-7 shadow-[0_8px_25px_rgba(166,123,91,0.08)]">

          <div className="flex items-start gap-4">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#FEF3C7] text-xl">
              💡
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#76563F]">
                Team Insight
              </h2>

              <p className="mt-2 text-sm leading-7 text-[#806D5E]">
                The team has an overall self-rating of{" "}
                <strong className="text-[#A67B5B]">
                  {overallRating.toFixed(1)} / 5
                </strong>
                . The ratings show a balanced level of confidence
                across different responsibilities, with opportunities
                for continuous improvement and skill development.
              </p>
            </div>

          </div>

        </div>

      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#E6D5C5] bg-white px-6 py-7 text-center">

        <p className="text-xs text-[#806D5E]">
          © 2026 Career Compass | Navigate Your Future
        </p>

      </footer>

    </main>
  );
}