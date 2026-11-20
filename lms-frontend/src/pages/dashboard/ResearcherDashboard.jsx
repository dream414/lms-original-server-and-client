import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

import {
  FaBook,
  FaBookOpen,
  FaSearch,
  FaDigitalTachograph,
  FaUserTie,
  FaArrowRight,
  FaDatabase,
  FaBell,
  FaLayerGroup,
  FaUniversity,
  FaGlobe,
  FaFileAlt,
  FaCircle,
  FaChevronRight,
  FaExternalLinkAlt,
  FaGraduationCap,
  FaLightbulb,
} from "react-icons/fa";

const ResearcherDashboard = () => {
  const { user } = useAuth();

  // =====================================================
  // MAIN RESEARCH RESOURCES
  // Each route appears only once
  // =====================================================

  const researchResources = [
    {
      title: "Physical Library",
      subtitle: "BOOK COLLECTION",
      description:
        "Explore physical books and academic collections available for research and study.",
      icon: FaBookOpen,
      path: "/library/books",
      number: "01",
      accent: "maroon",
    },
    {
      title: "Digital Library",
      subtitle: "DIGITAL RESOURCES",
      description:
        "Discover digital books and electronic academic resources for your research work.",
      icon: FaDigitalTachograph,
      path: "/digital-library/books",
      number: "02",
      accent: "blue",
    },
    {
      title: "My Digital Collection",
      subtitle: "PERSONAL RESOURCES",
      description:
        "Access the digital resources that are available in your personal research collection.",
      icon: FaDatabase,
      path: "/digital-library/my-books",
      number: "03",
      accent: "maroon",
    },
  ];

  // =====================================================
  // PERSONAL TOOLS
  // =====================================================

  const personalTools = [
    {
      title: "My Profile",
      description: "View and manage your researcher profile.",
      icon: FaUserTie,
      path: "/profile",
      accent: "maroon",
    },
    {
      title: "Notifications",
      description: "Stay updated with important academic and library alerts.",
      icon: FaBell,
      path: "/notifications",
      accent: "blue",
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-100 p-4 md:p-6 lg:p-8">

      {/* =====================================================
          ANIMATED BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        {/* Large Maroon Glow */}

        <div className="absolute -right-32 -top-32 h-96 w-96 animate-[pulse_7s_ease-in-out_infinite] rounded-full bg-[#890C25]/10 blur-3xl" />

        {/* Large Blue Glow */}

        <div className="absolute -left-40 top-[38%] h-[28rem] w-[28rem] animate-[pulse_9s_ease-in-out_infinite] rounded-full bg-blue-500/10 blur-3xl" />

        {/* Bottom Pink Glow */}

        <div className="absolute bottom-[-150px] right-[15%] h-96 w-96 animate-[pulse_8s_ease-in-out_infinite] rounded-full bg-[#D58A98]/10 blur-3xl" />

        {/* Floating Dots */}

        <div className="absolute left-[15%] top-[20%] h-3 w-3 animate-bounce rounded-full bg-[#890C25]/20" />

        <div className="absolute right-[28%] top-[35%] h-3 w-3 animate-ping rounded-full bg-blue-500/25" />

        <div className="absolute bottom-[24%] left-[42%] h-2.5 w-2.5 animate-pulse rounded-full bg-[#D58A98]/30" />

        <div className="absolute right-[8%] bottom-[18%] h-2 w-2 animate-bounce rounded-full bg-[#890C25]/20" />

      </div>

      <div className="relative z-10">

        {/* =====================================================
            HERO
        ===================================================== */}

        <section className="group relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#890C25] via-[#76091f] to-black p-6 shadow-2xl md:p-8 lg:p-10  mt-6">

          {/* Animated Top Line */}

          <div className="absolute left-0 top-0 h-1 w-0 bg-white transition-all duration-1000 group-hover:w-full" />

          {/* Moving Light */}

          <div className="absolute left-[-35%] top-0 h-full w-[25%] rotate-12 bg-white/5 blur-2xl transition-all duration-[1800ms] group-hover:left-[110%]" />

          {/* Decorative Circles */}

          <div className="absolute -right-24 -top-24 h-80 w-80 animate-[spin_25s_linear_infinite] rounded-full border border-white/10" />

          <div className="absolute -right-8 -top-8 h-56 w-56 rounded-full border border-white/10 bg-white/5" />

          <div className="absolute -bottom-28 right-[20%] h-72 w-72 animate-[pulse_6s_ease-in-out_infinite] rounded-full border border-white/10 bg-white/5" />

          <div className="absolute left-[48%] top-[-40px] h-44 w-44 rounded-full border border-white/5 bg-white/5" />

          <div className="relative z-10 flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">

            {/* Hero Content */}

            <div className="max-w-3xl">

              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold tracking-wide text-white shadow-lg backdrop-blur-md md:text-sm">

                <span className="relative flex h-2.5 w-2.5">

                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#D58A98] opacity-75" />

                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#D58A98]" />

                </span>

                Research & Academic Portal

              </div>

              <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl lg:text-5xl">

                Researcher Dashboard

              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70 md:text-base">

                Welcome back,{" "}

                <span className="font-bold text-white">
                  {user?.name || "Researcher"}
                </span>

                . Explore academic collections, digital knowledge
                and research resources through your dedicated
                research workspace.

              </p>

              {/* Research Status */}

              <div className="mt-7 flex flex-wrap items-center gap-3">

                <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur-md">

                  <FaSearch className="text-[#D58A98]" />

                  <span className="text-xs font-medium text-white/80">
                    Research Access Active
                  </span>

                </div>

                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-4 py-2">

                  <FaGraduationCap className="text-blue-300" />

                  <span className="text-xs font-medium text-white/70">
                    Academic Researcher
                  </span>

                </div>

              </div>

            </div>

            {/* Hero Icon */}

            <div className="relative hidden h-40 w-40 shrink-0 items-center justify-center lg:flex">

              <div className="absolute inset-0 animate-ping rounded-full border border-white/10" />

              <div className="absolute inset-4 animate-[spin_15s_linear_infinite] rounded-full border border-dashed border-white/15" />

              <div className="absolute inset-8 rounded-full border border-white/10 bg-white/5 backdrop-blur-md" />

              <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-white/20 bg-white/10 shadow-2xl backdrop-blur-md">

                <FaSearch className="text-4xl text-white transition-transform duration-500 group-hover:scale-110" />

              </div>

            </div>

          </div>

        </section>

        {/* =====================================================
            RESEARCH IDENTITY BAR
        ===================================================== */}

        <section className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">

          {/* Academic Library */}

          <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-lg">

            <div className="absolute left-0 top-0 h-1 w-0 bg-[#890C25] transition-all duration-500 group-hover:w-full" />

            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#890C25]/10 text-[#890C25] transition-all duration-500 group-hover:scale-110">

                <FaUniversity />

              </div>

              <div>

                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Access
                </p>

                <h3 className="mt-1 font-bold text-slate-800">
                  Academic Library
                </h3>

              </div>

            </div>

          </div>

          {/* Digital Knowledge */}

          <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-lg">

            <div className="absolute left-0 top-0 h-1 w-0 bg-blue-600 transition-all duration-500 group-hover:w-full" />

            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600 transition-all duration-500 group-hover:scale-110">

                <FaGlobe />

              </div>

              <div>

                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Resources
                </p>

                <h3 className="mt-1 font-bold text-slate-800">
                  Digital Knowledge
                </h3>

              </div>

            </div>

          </div>

          {/* Research Support */}

          <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-lg">

            <div className="absolute left-0 top-0 h-1 w-0 bg-[#890C25] transition-all duration-500 group-hover:w-full" />

            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#890C25]/10 text-[#890C25] transition-all duration-500 group-hover:scale-110">

                <FaFileAlt />

              </div>

              <div>

                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Purpose
                </p>

                <h3 className="mt-1 font-bold text-slate-800">
                  Research Support
                </h3>

              </div>

            </div>

          </div>

        </section>

        {/* =====================================================
            RESEARCH COLLECTION
        ===================================================== */}

        <section className="mt-8">

          <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">

            <div>

              <p className="text-sm font-bold uppercase tracking-wider text-[#890C25]">
                Explore
              </p>

              <h2 className="mt-1 text-2xl font-extrabold text-slate-800 md:text-3xl">
                Research Collection
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Explore physical and digital resources available for your academic work.
              </p>

            </div>

            <div className="hidden items-center gap-2 text-xs font-semibold text-slate-400 md:flex">

              <FaCircle className="text-[6px] text-[#890C25]" />

              Academic Resources

            </div>

          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">

            {researchResources.map((item) => {

              const Icon = item.icon;

              return (
                <Link
                  key={item.number}
                  to={item.path}
                  className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
                >

                  {/* Top Animated Line */}

                  <div
                    className={`absolute left-0 top-0 h-1 w-0 transition-all duration-700 group-hover:w-full ${
                      item.accent === "blue"
                        ? "bg-blue-600"
                        : "bg-[#890C25]"
                    }`}
                  />

                  {/* Number */}

                  <div className="absolute right-5 top-3 text-5xl font-black text-slate-100 transition-all duration-500 group-hover:text-slate-200">
                    {item.number}
                  </div>

                  <div className="relative z-10">

                    {/* Icon */}

                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-2xl text-xl shadow-sm transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 ${
                        item.accent === "blue"
                          ? "bg-blue-600/10 text-blue-600 group-hover:bg-blue-600 group-hover:text-white"
                          : "bg-[#890C25]/10 text-[#890C25] group-hover:bg-[#890C25] group-hover:text-white"
                      }`}
                    >
                      <Icon />
                    </div>

                    <p className="mt-6 text-xs font-bold uppercase tracking-widest text-slate-400">
                      {item.subtitle}
                    </p>

                    <h3 className="mt-2 text-xl font-extrabold text-slate-800">
                      {item.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-slate-500">
                      {item.description}
                    </p>

                    <div
                      className={`mt-6 flex items-center gap-2 text-sm font-bold ${
                        item.accent === "blue"
                          ? "text-blue-600"
                          : "text-[#890C25]"
                      }`}
                    >
                      Open Resource
                      <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-2" />
                    </div>

                  </div>

                </Link>
              );
            })}

          </div>

        </section>

        {/* =====================================================
            RESEARCH MATERIALS — FEATURED
        ===================================================== */}

        <section className="group relative mt-8 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl">

          {/* Animated Top Line */}

          <div className="absolute left-0 top-0 h-1 w-0 bg-[#890C25] transition-all duration-1000 group-hover:w-full" />

          {/* Background Circle */}

          <div className="absolute -right-24 -top-24 h-72 w-72 animate-[pulse_7s_ease-in-out_infinite] rounded-full bg-[#890C25]/5 blur-3xl" />

          <div className="absolute -bottom-28 -left-24 h-72 w-72 animate-[pulse_8s_ease-in-out_infinite] rounded-full bg-blue-500/5 blur-3xl" />

          <div className="relative z-10 grid items-center gap-8 p-6 md:p-8 lg:grid-cols-2 lg:p-10">

            {/* =================================================
                LEFT CONTENT
            ================================================= */}

            <div>

              <div className="inline-flex items-center gap-2 rounded-full border border-[#890C25]/10 bg-[#890C25]/5 px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#890C25]">

                <FaLayerGroup />

                Research Materials

              </div>

              <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-800 md:text-4xl">

                Knowledge for Your
                <span className="text-[#890C25]"> Research Journey</span>

              </h2>

              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-500 md:text-base">

                Explore books and academic resources that can help
                you discover information, build knowledge and support
                your research work.

              </p>

              {/* Research Features */}

              <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">

                <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-md">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#890C25]/10 text-[#890C25]">

                    <FaBook />

                  </div>

                  <div>

                    <p className="text-sm font-bold text-slate-800">
                      Academic Books
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Library collection
                    </p>

                  </div>

                </div>

                <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-md">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600">

                    <FaDatabase />

                  </div>

                  <div>

                    <p className="text-sm font-bold text-slate-800">
                      Digital Resources
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Online knowledge
                    </p>

                  </div>

                </div>

              </div>

              {/* Small Animated Line */}

              <div className="mt-7 flex items-center gap-3">

                <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100">

                  <div className="h-full w-1/2 animate-pulse rounded-full bg-[#890C25]" />

                </div>

                <span className="text-xs font-semibold text-slate-400">
                  Research resources available
                </span>

              </div>

            </div>

            {/* =================================================
                RIGHT IMAGE AREA
            ================================================= */}

            <div className="relative flex min-h-[330px] items-center justify-center">

              {/* Outer Animated Ring */}

              <div className="absolute h-72 w-72 animate-[spin_20s_linear_infinite] rounded-full border border-dashed border-[#890C25]/20" />

              {/* Second Ring */}

              <div className="absolute h-60 w-60 animate-[pulse_5s_ease-in-out_infinite] rounded-full border border-[#D58A98]/30" />

              {/* Soft Circle */}

              <div className="absolute h-52 w-52 rounded-full bg-[#890C25]/5 blur-xl" />

              {/* Image Circle */}

              <div className="relative h-52 w-52 overflow-hidden rounded-full border-[7px] border-white bg-slate-100 shadow-2xl ring-4 ring-[#890C25]/10">

                <img
                  src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=900&q=85"
                  alt="Researcher studying books in a library"
                  className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />

                {/* Image Overlay */}

                <div className="absolute inset-0 bg-gradient-to-t from-[#890C25]/50 via-transparent to-transparent" />

              </div>

              {/* Floating Research Badge */}

              <div className="absolute left-[5%] top-[15%] flex animate-bounce items-center gap-2 rounded-2xl border border-white bg-white/95 px-4 py-3 shadow-xl">

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#890C25]/10 text-[#890C25]">

                  <FaSearch />

                </div>

                <div>

                  <p className="text-xs font-bold text-slate-800">
                    Research
                  </p>

                  <p className="text-[10px] text-slate-400">
                    Explore knowledge
                  </p>

                </div>

              </div>

              {/* Floating Book Badge */}

              <div className="absolute bottom-[13%] right-[2%] flex items-center gap-2 rounded-2xl border border-white bg-white/95 px-4 py-3 shadow-xl">

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600">

                  <FaBookOpen />

                </div>

                <div>

                  <p className="text-xs font-bold text-slate-800">
                    Materials
                  </p>

                  <p className="text-[10px] text-slate-400">
                    Academic resources
                  </p>

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* =====================================================
            RESEARCH FOCUS
        ===================================================== */}

        <section className="mt-8 grid gap-6 lg:grid-cols-5">

          {/* Focus Panel */}

          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800 p-7 text-white shadow-xl lg:col-span-3">

            <div className="absolute -right-24 -top-24 h-64 w-64 animate-[pulse_6s_ease-in-out_infinite] rounded-full border border-white/10 bg-white/5" />

            <div className="absolute -bottom-24 -left-20 h-52 w-52 animate-[pulse_7s_ease-in-out_infinite] rounded-full border border-white/10 bg-white/5" />

            <div className="absolute right-[25%] top-[15%] h-3 w-3 animate-ping rounded-full bg-white/30" />

            <div className="relative z-10">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/20 bg-white/10 backdrop-blur-md">

                <FaLightbulb className="text-lg" />

              </div>

              <p className="mt-6 text-xs font-bold uppercase tracking-widest text-white/50">
                Research Focus
              </p>

              <h2 className="mt-2 text-2xl font-extrabold md:text-3xl">
                Build Your Knowledge
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-7 text-white/70">

                Use physical library collections and digital
                academic resources to discover information,
                strengthen your knowledge and support your research.

              </p>

              {/* Animated Progress */}

              <div className="mt-7">

                <div className="flex items-center justify-between text-xs text-white/50">

                  <span>Research Journey</span>

                  <span>Explore</span>

                </div>

                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">

                  <div className="h-full w-2/3 animate-pulse rounded-full bg-white/70" />

                </div>

              </div>

              <Link
                to="/digital-library/books"
                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-blue-700 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-slate-100"
              >
                Explore Digital Library
                <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

            </div>

          </div>

          {/* Research Insight */}

          <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 shadow-xl lg:col-span-2">

            <div className="absolute right-0 top-0 h-1 w-0 bg-[#890C25] transition-all duration-700 group-hover:w-full" />

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs font-bold uppercase tracking-widest text-[#890C25]">
                  Research Insight
                </p>

                <h2 className="mt-2 text-2xl font-extrabold text-slate-800">
                  Explore With Purpose
                </h2>

              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#890C25]/10 text-[#890C25] transition-transform duration-500 group-hover:rotate-12">

                <FaSearch />

              </div>

            </div>

            <p className="mt-6 text-sm leading-7 text-slate-500">

              Start with a reliable collection, explore relevant
              resources and build your research knowledge step by step.

            </p>

            {/* Research Steps */}

            <div className="mt-6 space-y-3">

              <div className="flex items-center gap-3">

                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#890C25]/10 text-xs font-bold text-[#890C25]">
                  01
                </div>

                <span className="text-sm font-semibold text-slate-700">
                  Discover resources
                </span>

              </div>

              <div className="ml-4 h-5 w-px bg-slate-200" />

              <div className="flex items-center gap-3">

                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600/10 text-xs font-bold text-blue-600">
                  02
                </div>

                <span className="text-sm font-semibold text-slate-700">
                  Explore knowledge
                </span>

              </div>

              <div className="ml-4 h-5 w-px bg-slate-200" />

              <div className="flex items-center gap-3">

                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#890C25]/10 text-xs font-bold text-[#890C25]">
                  03
                </div>

                <span className="text-sm font-semibold text-slate-700">
                  Strengthen research
                </span>

              </div>

            </div>

          </div>

        </section>

        {/* =====================================================
            PERSONAL TOOLS
        ===================================================== */}

        <section className="mt-8">

          <div className="mb-5">

            <p className="text-sm font-bold uppercase tracking-wider text-[#890C25]">
              Personal Space
            </p>

            <h2 className="mt-1 text-2xl font-extrabold text-slate-800">
              Researcher Tools
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Keep your account and important updates within easy reach.
            </p>

          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

            {personalTools.map((tool) => {

              const Icon = tool.icon;

              return (
                <Link
                  key={tool.title}
                  to={tool.path}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >

                  <div
                    className={`absolute bottom-0 left-0 h-0 w-full transition-all duration-500 group-hover:h-full ${
                      tool.accent === "blue"
                        ? "bg-blue-600/5"
                        : "bg-[#890C25]/5"
                    }`}
                  />

                  <div className="relative z-10 flex items-center justify-between">

                    <div className="flex items-center gap-4">

                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110 ${
                          tool.accent === "blue"
                            ? "bg-blue-600/10 text-blue-600 group-hover:bg-blue-600 group-hover:text-white"
                            : "bg-[#890C25]/10 text-[#890C25] group-hover:bg-[#890C25] group-hover:text-white"
                        }`}
                      >
                        <Icon />
                      </div>

                      <div>

                        <h3 className="font-bold text-slate-800">
                          {tool.title}
                        </h3>

                        <p className="mt-1 text-xs text-slate-500">
                          {tool.description}
                        </p>

                      </div>

                    </div>

                    <FaChevronRight className="text-slate-300 transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#890C25]" />

                  </div>

                </Link>
              );
            })}

          </div>

        </section>

        {/* =====================================================
            FINAL RESEARCH BANNER
        ===================================================== */}

        <section className="group relative mt-8 overflow-hidden rounded-3xl bg-gradient-to-r from-[#890C25] via-[#8e102a] to-[#a51d3d] p-6 shadow-xl md:p-7">

          <div className="absolute -left-20 top-1/2 h-40 w-40 -translate-y-1/2 animate-pulse rounded-full bg-white/5 blur-2xl" />

          <div className="absolute -right-20 -top-16 h-52 w-52 rounded-full border border-white/10 bg-white/5 transition-transform duration-700 group-hover:scale-125" />

          <div className="relative z-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

            <div className="flex items-start gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white backdrop-blur-md">

                <FaBook />

              </div>

              <div>

                <p className="text-xs font-bold uppercase tracking-widest text-white/50">
                  Research Resources
                </p>

                <h3 className="mt-1 text-xl font-extrabold text-white">
                  Keep Exploring Knowledge
                </h3>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-white/70">

                  Continue discovering academic books and digital
                  resources to support your research journey.

                </p>

              </div>

            </div>

            <Link
              to="/library/books"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#890C25] shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-slate-100"
            >
              Explore Library
              <FaExternalLinkAlt className="text-xs" />
            </Link>

          </div>

        </section>

        {/* =====================================================
            FOOTER
        ===================================================== */}

        <footer className="mt-8 pb-4 text-center">

          <div className="mx-auto mb-3 h-px w-24 bg-gradient-to-r from-transparent via-[#890C25]/30 to-transparent" />

          <p className="text-sm font-semibold text-slate-400">
            Research & Academic Resource Center
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Supporting research through knowledge, collections and
            digital academic resources
          </p>

        </footer>

      </div>
    </div>
  );
};

export default ResearcherDashboard;