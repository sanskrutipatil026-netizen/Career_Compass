"use client";

import { useEffect, useMemo, useState } from "react";

interface Course {
  ncCode?: string;
  title?: string;
  explorerInstructorName?: string;
  instructorInstitute?: string;
  weeks?: string | number;
  credits?: string | number;
  enrollment?: string;
  openForRegistration?: boolean;
  url?: string;
}


const internshipPlatforms = [
  {
    name: "LinkedIn Internships",
    subtitle: "Global Professional Network",
    icon: "in",
    description:
      "Explore millions of student internships with direct recruiter outreach and alumni employee referrals.",
    button: "Open LinkedIn",
  },
  {
    name: "Internshala",
    subtitle: "India #1 Student Portal",
    icon: "🎓",
    description:
      "Over 10,000+ verified paid internships with stipend guarantees and fast-track application certificates.",
    button: "Open Internshala",
  },
  {
    name: "Wellfound (AngelList)",
    subtitle: "High-Growth Startups & YC",
    icon: "♨",
    description:
      "Direct access to founding teams, high equity options, and early-stage startup developer internships.",
    button: "Open Wellfound",
  },
  {
    name: "AICTE Govt Internship Portal",
    subtitle: "Government of India & PSUs",
    icon: "🏛",
    description:
      "Official portal covering Smart Cities, NHAI, Ministry research labs, and academic credit schemes.",
    button: "Open AICTE Portal",
  },
];

/* =========================================================
   INTERNSHIP OFFERS
========================================================= */

const internshipOffers = [
  {
    company: "Vercel Ecosystem Labs",
    title: "Full-Stack Developer Intern",
    salary: "$3,500/mo",
    location: "Remote",
    duration: "3 Months (Summer)",
    icon: "V",
    tags: [
      "React",
      "Next.js",
      "TypeScript",
      "Node.js",
      "Tailwind CSS",
      "Git",
    ],
    description:
      "Build high-performance web applications, UI component libraries, and interactive developer interfaces.",
    applyUrl: "https://www.linkedin.com/jobs/",
  },

  {
    company: "Stripe Infrastructure",
    title: "Backend Systems & API Intern",
    salary: "₹75,000/mo",
    location: "Bengaluru / Hybrid",
    duration: "6 Months",
    icon: "S",
    tags: [
      "Node.js",
      "Python",
      "Go",
      "PostgreSQL",
      "Docker",
      "REST API",
    ],
    description:
      "Design resilient microservices, payment webhook handlers, and high-throughput transactional databases.",
    applyUrl: "https://www.linkedin.com/jobs/",
  },

  {
    company: "Hugging Face Open Lab",
    title: "AI & Machine Learning Research Intern",
    salary: "$4,000/mo",
    location: "Remote",
    duration: "4 Months",
    icon: "H",
    tags: [
      "Python",
      "PyTorch",
      "TensorFlow",
      "NLP",
      "Transformers",
    ],
    description:
      "Fine-tune open-source LLMs, evaluate diffusion models, and develop reproducible benchmarks.",
    applyUrl: "https://www.linkedin.com/jobs/",
  },

  {
    company: "Microsoft",
    title: "Software Engineering Intern",
    salary: "Competitive",
    location: "Hyderabad / Hybrid",
    duration: "3 Months",
    icon: "M",
    tags: [
      "C++",
      "Azure",
      "Algorithms",
      "Git",
      "System Design",
    ],
    description:
      "Work with engineering teams to build reliable software and solve large-scale technical problems.",
    applyUrl: "https://www.linkedin.com/jobs/",
  },

  {
    company: "Google",
    title: "Data & AI Intern",
    salary: "Competitive",
    location: "Bengaluru",
    duration: "3 Months",
    icon: "G",
    tags: [
      "Python",
      "SQL",
      "Machine Learning",
      "TensorFlow",
    ],
    description:
      "Work on data pipelines, machine learning systems, experimentation, and AI-powered products.",
    applyUrl: "https://www.linkedin.com/jobs/",
  },

  {
    company: "Adobe",
    title: "UI/UX Product Design Intern",
    salary: "₹60,000/mo",
    location: "Noida / Hybrid",
    duration: "4 Months",
    icon: "A",
    tags: [
      "Figma",
      "UX Research",
      "Prototyping",
      "Design Systems",
    ],
    description:
      "Design intuitive product experiences, build prototypes, and collaborate with product teams.",
    applyUrl: "https://www.linkedin.com/jobs/",
  },
];

/* =========================================================
   EXTRA SUGGESTIONS
========================================================= */

const extraPrograms = [
  {
    title: "3D Modelling and Rendering for Virtual Reality",
    institute: "NITTR Chennai",
    type: "SWAYAM Portal",
    credits: "3 University Credits",
    duration: "8 Weeks (Accredited)",
    description:
      "Official Ministry of Education certified course covering VR immersion, shader rendering, and 3D geometric pipelines.",
    url: "https://swayam.gov.in/",
  },

  {
    title: "3D Printing of Auxetic Structures: Theory and Practices",
    institute: "NITTR Chandigarh",
    type: "SWAYAM Portal",
    credits: "3 University Credits",
    duration: "8 Weeks (Accredited)",
    description:
      "Advanced additive manufacturing course focusing on auxetic mechanical structures and rapid physical prototyping.",
    url: "https://swayam.gov.in/",
  },

  {
    title: "Major League Hacking (MLH) Fellowship",
    institute: "Open Source Software Track",
    type: "Fellowship",
    credits: "High Impact Fellowship",
    duration: "12 Weeks (Remote)",
    description:
      "Build real-world open-source software, collaborate with developers globally, and strengthen your engineering portfolio.",
    url: "https://fellowship.mlh.io/",
  },

  {
    title: "Artificial Intelligence and Machine Learning",
    institute: "SWAYAM",
    type: "Certified Course",
    credits: "3 University Credits",
    duration: "8 Weeks",
    description:
      "Build a strong foundation in artificial intelligence, machine learning models, and practical applications.",
    url: "https://swayam.gov.in/",
  },
];

/* =========================================================
   COMPONENT
========================================================= */

export default function Home() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] =
    useState("All Opportunities");

  /* =======================================================
     LOAD SWAYAM COURSES
  ======================================================= */

  useEffect(() => {
    fetch("/swayam_courses.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load swayam_courses.json");
        }

        return response.json();
      })
      .then((data: Course[]) => {
        setCourses(data);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
      });
  }, []);

  /* =======================================================
     SEARCH
  ======================================================= */

  const filteredOffers = useMemo(() => {
    if (!search.trim()) return internshipOffers;

    const query = search.toLowerCase();

    return internshipOffers.filter((offer) =>
      [
        offer.title,
        offer.company,
        offer.description,
        offer.location,
        ...offer.tags,
      ].some((value) =>
        value.toLowerCase().includes(query)
      )
    );
  }, [search]);

  const filteredPlatforms = useMemo(() => {
    if (!search.trim()) return internshipPlatforms;

    const query = search.toLowerCase();

    return internshipPlatforms.filter((platform) =>
      [
        platform.name,
        platform.subtitle,
        platform.description,
      ].some((value) =>
        value.toLowerCase().includes(query)
      )
    );
  }, [search]);

  const filteredPrograms = useMemo(() => {
    if (!search.trim()) return extraPrograms;

    const query = search.toLowerCase();

    return extraPrograms.filter((program) =>
      [
        program.title,
        program.institute,
        program.type,
        program.description,
      ].some((value) =>
        value.toLowerCase().includes(query)
      )
    );
  }, [search]);

  /* =======================================================
     ERROR
  ======================================================= */

  if (error) {
    return (
      <main className="min-h-screen bg-[#f8f4ec] flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-md p-8 max-w-md text-center border border-[#e8ddce]">

          <div className="text-5xl mb-4">
            ⚠️
          </div>

          <h1 className="text-2xl font-extrabold text-[#34261d]">
            Something went wrong
          </h1>

          <p className="text-[#766b61] mt-3">
            {error}
          </p>

        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f4ec] text-[#34261d]">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="pt-6 pb-5 px-5 md:px-8">

        <div className="max-w-[1500px] mx-auto text-center">

          <h1 className="text-3xl md:text-4xl lg:text-[42px] font-extrabold tracking-tight">

            Navigate Your{" "}

            <span className="text-[#c66b18]">
              Internship
            </span>{" "}

            &{" "}

            <span className="text-[#a66b42]">
              Career Opportunities
            </span>

          </h1>

          <p className="mt-3 text-sm md:text-base text-[#81766c] max-w-3xl mx-auto">
            Explore major internship platforms, discover curated internship
            offers, and unlock extra growth opportunities including certified
            SWAYAM university courses and fellowships.
          </p>

        </div>

      </header>

      {/* =====================================================
          SEARCH BAR
      ===================================================== */}

      <section className="px-5 md:px-8">

        <div className="max-w-[1500px] mx-auto">

          <div className="bg-white rounded-[26px] border border-[#e8dfd4] p-3 shadow-sm">

            <div className="flex flex-col xl:flex-row gap-3">

              {/* SEARCH */}

              <div className="relative flex-1">

                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[#a19890] text-xl">
                  🔍
                </span>

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search internships, platforms, or courses..."
                  className="w-full h-12 rounded-2xl border border-[#eee6dc] bg-[#fffdfa] pl-12 pr-5 outline-none text-sm placeholder:text-[#aaa097] focus:border-[#c77a2b]"
                />

              </div>

              {/* FILTERS */}

              <div className="flex gap-2 overflow-x-auto">

                {[
                  "All Opportunities",
                  "Engineering & Tech",
                  "Data & AI",
                  "UI/UX Design",
                  "Product & Growth",
                ].map((category) => (

                  <button
                    key={category}
                    onClick={() =>
                      setActiveCategory(category)
                    }
                    className={`h-12 px-5 rounded-full whitespace-nowrap text-sm font-semibold border transition ${
                      activeCategory === category
                        ? "bg-[#a97556] text-white border-[#a97556]"
                        : "bg-white text-[#665b53] border-[#e6ddd3] hover:bg-[#fff8ef]"
                    }`}
                  >
                    {category}
                  </button>

                ))}

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          THREE COLUMNS
      ===================================================== */}

      <section className="max-w-[1500px] mx-auto px-5 md:px-8 py-7">

        {/* IMPORTANT:
            lg:grid-cols-3 = THREE EQUAL COLUMNS
        */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">

          {/* =================================================
              COLUMN 1
              INTERNSHIP PLATFORMS
          ================================================= */}

          <div className="bg-[#fffdf9] rounded-[25px] border border-[#e7ddcf] overflow-hidden">

            <div className="border-t-4 border-[#d07818] p-5">

              <div className="flex items-center justify-between gap-3">

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-xl bg-[#fff0c8] flex items-center justify-center">
                    🌐
                  </div>

                  <div>

                    <h2 className="text-lg font-extrabold">
                      Internship Platforms
                    </h2>

                    <p className="text-xs text-[#91867b]">
                      Major portals with instant search triggers
                    </p>

                  </div>

                </div>

                <span className="bg-[#fff0c8] text-[#8c681c] px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap">
                  8 Platforms
                </span>

              </div>

              <div className="border-b border-[#eee6dc] mt-4" />

            </div>

            <div className="px-4 pb-5 space-y-3">

              {filteredPlatforms.map((platform) => (

                <div
                  key={platform.name}
                  className="bg-white rounded-[20px] border border-[#ebe2d7] p-4 hover:shadow-md transition"
                >

                  {/* TOP */}

                  <div className="flex gap-3">

                    <div className="w-11 h-11 shrink-0 rounded-xl bg-[#fff0c8] flex items-center justify-center font-extrabold text-[#3477b5]">
                      {platform.icon}
                    </div>

                    <div>

                      <h3 className="font-extrabold text-[15px]">
                        {platform.name}
                      </h3>

                      <p className="text-xs text-[#91867b] mt-1">
                        {platform.subtitle}
                      </p>

                    </div>

                  </div>

                  {/* DESCRIPTION */}

                  <p className="text-sm text-[#756b62] leading-relaxed mt-4">
                    {platform.description}
                  </p>

                  {/* FOOTER */}

                  <div className="flex items-center justify-between border-t border-[#eee7df] mt-4 pt-3">

                    <span className="text-[11px] font-bold text-[#bd761f]">
                      ● Verified Portal
                    </span>

                    <a
                      href="#"
                      className="bg-[#fff1c9] hover:bg-[#fbe5aa] text-[#865c20] px-4 py-2.5 rounded-xl text-xs font-bold transition"
                    >
                      {platform.button} ↗
                    </a>

                  </div>

                </div>

              ))}

            </div>

          </div>

          {/* =================================================
              COLUMN 2
              INTERNSHIP OFFERS
          ================================================= */}

          <div className="bg-[#fffdf9] rounded-[25px] border border-[#e7ddcf] overflow-hidden">

            <div className="border-t-4 border-[#9d745d] p-5">

              <div className="flex items-center justify-between gap-3">

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-xl bg-[#f5e9df] flex items-center justify-center">
                    💼
                  </div>

                  <div>

                    <h2 className="text-lg font-extrabold">
                      Internship Offers
                    </h2>

                    <p className="text-xs text-[#91867b]">
                      Curated internship listings & direct roles
                    </p>

                  </div>

                </div>

                <span className="bg-[#f5e8df] text-[#866451] px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap">
                  8 Offers
                </span>

              </div>

              <div className="border-b border-[#eee6dc] mt-4" />

            </div>

            <div className="px-4 pb-5 space-y-3">

              {filteredOffers.map((offer) => (

                <div
                  key={offer.title}
                  className="bg-white rounded-[20px] border border-[#ebe2d7] p-4 hover:shadow-md transition"
                >

                  {/* TITLE */}

                  <div className="flex gap-3">

                    <div className="w-11 h-11 shrink-0 rounded-xl bg-[#fff0c8] flex items-center justify-center font-extrabold text-[#bd7621]">
                      {offer.icon}
                    </div>

                    <div className="flex-1">

                      <div className="flex justify-between gap-2">

                        <div>

                          <h3 className="font-extrabold text-[15px] leading-snug">
                            {offer.title}
                          </h3>

                          <p className="text-xs text-[#756b62] mt-1">
                            ▣ {offer.company}
                          </p>

                        </div>

                        <button className="text-[#9a9087] text-xl hover:text-[#9b694c]">
                          ♡
                        </button>

                      </div>

                    </div>

                  </div>

                  {/* META */}

                  <div className="flex flex-wrap gap-2 mt-4">

                    <span className="bg-[#fff0c5] text-[#8d6320] px-2.5 py-1 rounded-full text-[11px] font-bold">
                      ⚡ {offer.salary}
                    </span>

                    <span className="bg-[#f8e9df] text-[#765b4e] px-2.5 py-1 rounded-full text-[11px] font-bold">
                      📍 {offer.location}
                    </span>

                    <span className="bg-[#fff0c5] text-[#8d6320] px-2.5 py-1 rounded-full text-[11px] font-bold">
                      ◷ {offer.duration}
                    </span>

                  </div>

                  {/* DESCRIPTION */}

                  <p className="text-sm text-[#756b62] leading-relaxed mt-3">
                    {offer.description}
                  </p>

                  {/* SKILLS */}

                  <div className="flex flex-wrap gap-1.5 mt-3">

                    {offer.tags.map((tag) => (

                      <span
                        key={tag}
                        className="bg-[#fff5d9] border border-[#f0dfad] text-[#81652f] px-2.5 py-1 rounded-full text-[10px] font-semibold"
                      >
                        {tag}
                      </span>

                    ))}

                  </div>

                  {/* =========================================
                      BOTTOM ACTIONS
                      THIS IS THE APPLY NOW BUTTON
                  ========================================= */}

                  <div className="flex items-center justify-between border-t border-[#eee7df] mt-4 pt-3">

                    <button className="text-xs font-bold text-[#625850] hover:text-[#a86c43]">
                      ● View Details
                    </button>

                    <a
                      href={offer.applyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 bg-[#ae7859] hover:bg-[#966247] text-white px-5 py-2.5 rounded-xl text-xs font-extrabold shadow-sm transition"
                    >
                      Apply Now ↗
                    </a>

                  </div>

                </div>

              ))}

            </div>

          </div>

          {/* =================================================
              COLUMN 3
              EXTRA SUGGESTIONS
          ================================================= */}

          <div className="bg-[#fffdf9] rounded-[25px] border border-[#e7ddcf] overflow-hidden">

            <div className="border-t-4 border-[#bc6619] p-5">

              <div className="flex items-center justify-between gap-3">

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-xl bg-[#fff0c8] flex items-center justify-center">
                    💡
                  </div>

                  <div>

                    <h2 className="text-lg font-extrabold">
                      Extra Suggestions
                    </h2>

                    <p className="text-xs text-[#91867b]">
                      SWAYAM university courses & fellowships
                    </p>

                  </div>

                </div>

                <span className="bg-[#fff0c8] text-[#8c681c] px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap">
                  6 Programs
                </span>

              </div>

              <div className="border-b border-[#eee6dc] mt-4" />

            </div>

            <div className="px-4 pb-5 space-y-3">

              {filteredPrograms.map((program) => (

                <div
                  key={program.title}
                  className="bg-white rounded-[20px] border border-[#ebe2d7] p-4 hover:shadow-md transition"
                >

                  {/* TITLE */}

                  <div className="flex gap-3">

                    <div className="w-11 h-11 shrink-0 rounded-xl bg-[#fff0c8] flex items-center justify-center text-lg">
                      🎓
                    </div>

                    <div className="flex-1">

                      <div className="flex justify-between gap-2">

                        <div>

                          <h3 className="font-extrabold text-[15px] leading-snug">
                            {program.title}
                          </h3>

                          <p className="text-xs text-[#756b62] mt-2">
                            🏛 {program.institute} • {program.type}
                          </p>

                        </div>

                        <button className="text-[#9a9087] text-xl">
                          ♡
                        </button>

                      </div>

                    </div>

                  </div>

                  {/* META */}

                  <div className="flex flex-wrap gap-2 mt-4">

                    <span className="bg-[#fff0c5] text-[#8d6320] px-2.5 py-1 rounded-full text-[11px] font-bold">
                      {program.credits}
                    </span>

                    <span className="bg-[#fff0c5] text-[#8d6320] px-2.5 py-1 rounded-full text-[11px] font-bold">
                      ◷ {program.duration}
                    </span>

                  </div>

                  {/* DESCRIPTION */}

                  <p className="text-sm text-[#756b62] leading-relaxed mt-3">
                    {program.description}
                  </p>

                  {/* WHY IT HELPS */}

                  <div className="mt-3 bg-[#fff4c9] border border-[#efdfa6] rounded-xl p-3">

                    <p className="text-[11px] text-[#755c25] leading-relaxed">

                      💡 <strong>Why it helps:</strong>{" "}
                      Earn transferable university grade credits directly
                      accredited by AICTE/UGC.

                    </p>

                  </div>

                  {/* ACTIONS */}

                  <div className="flex items-center justify-between border-t border-[#eee7df] mt-4 pt-3">

                    <button className="text-xs font-bold text-[#625850]">
                      ● Details
                    </button>

                    <a
                      href={program.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#c56812] hover:bg-[#aa570b] text-white px-5 py-2.5 rounded-xl text-xs font-extrabold transition"
                    >
                      Enroll on SWAYAM ↗
                    </a>

                  </div>

                </div>

              ))}

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="border-t border-[#e6dccf] mt-3">

        <div className="max-w-[1500px] mx-auto px-6 py-6 flex justify-between items-center">

          <p className="text-xs text-[#8c8177]">
            © 2026 Career Opportunity Explorer
          </p>

          <p className="text-xs text-[#a09286]">
            Explore • Learn • Grow
          </p>

        </div>

      </footer>

    </main>
  );
}