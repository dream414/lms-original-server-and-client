
import { useEffect, useMemo, useState } from "react";
import {
  FaUsers,
  FaUserShield,
  FaUserCheck,
  FaUserTimes,
  FaSearch,
  FaSyncAlt,
  FaFilter,
  FaEnvelope,
  FaBuilding,
  FaCalendarAlt,
  FaExclamationTriangle,
  FaChartPie,
  FaArrowLeft,
  FaUserCog,
  FaUserGraduate,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { useReports } from "../../context/ReportContext";

const UsersReport = () => {
  const navigate = useNavigate();

  const {
    usersReport,
    loading,
    error,
    getUsersReport,
  } = useReports();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    getUsersReport();
  }, []);

  // =====================================================
  // REPORT DATA
  // =====================================================

  const report = usersReport?.report || usersReport || {};

  const users = Array.isArray(report?.users)
    ? report.users
    : Array.isArray(report?.data)
    ? report.data
    : Array.isArray(report?.data?.users)
    ? report.data.users
    : [];

  const summary =
    report?.summary ||
    report?.stats ||
    {};

  // =====================================================
  // HELPERS
  // =====================================================

  const getNumber = (...values) => {
    for (const value of values) {
      const number = Number(value);

      if (!Number.isNaN(number)) {
        return number;
      }
    }

    return 0;
  };

  const totalUsers = getNumber(
    summary?.totalUsers,
    report?.totalUsers,
    users.length
  );

  const activeUsers = getNumber(
    summary?.activeUsers,
    report?.activeUsers,
    users.filter(
      (user) =>
        String(user?.status || "").toLowerCase() ===
        "active"
    ).length
  );

  const inactiveUsers = getNumber(
    summary?.inactiveUsers,
    report?.inactiveUsers,
    users.filter(
      (user) =>
        String(user?.status || "").toLowerCase() ===
        "inactive"
    ).length
  );

  const roleStats =
    summary?.roleStats ||
    report?.roleStats ||
    {};

  // =====================================================
  // ROLE LIST
  // =====================================================

  const roles = useMemo(() => {
    const roleSet = new Set();

    users.forEach((user) => {
      if (user?.role) {
        roleSet.add(String(user.role));
      }
    });

    Object.keys(roleStats || {}).forEach((role) => {
      roleSet.add(role);
    });

    return Array.from(roleSet).sort();
  }, [users, roleStats]);

  // =====================================================
  // FILTER USERS
  // =====================================================

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const name = String(
        user?.name || ""
      ).toLowerCase();

      const email = String(
        user?.email || ""
      ).toLowerCase();

      const role = String(
        user?.role || ""
      ).toLowerCase();

      const status = String(
        user?.status || ""
      ).toLowerCase();

      const department =
        typeof user?.department === "object"
          ? String(
              user?.department?.name || ""
            ).toLowerCase()
          : String(
              user?.department || ""
            ).toLowerCase();

      const searchValue =
        search.toLowerCase().trim();

      const matchesSearch =
        !searchValue ||
        name.includes(searchValue) ||
        email.includes(searchValue) ||
        role.includes(searchValue) ||
        department.includes(searchValue);

      const matchesRole =
        roleFilter === "all" ||
        role === roleFilter.toLowerCase();

      const matchesStatus =
        statusFilter === "all" ||
        status === statusFilter.toLowerCase();

      return (
        matchesSearch &&
        matchesRole &&
        matchesStatus
      );
    });
  }, [
    users,
    search,
    roleFilter,
    statusFilter,
  ]);

  // =====================================================
  // REFRESH
  // =====================================================

  const handleRefresh = async () => {
    await getUsersReport();
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) {
      return "N/A";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "N/A";
    }

    return parsedDate.toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =====================================================
  // ROLE COUNT
  // =====================================================

  const getRoleCount = (role) => {
    const directValue =
      roleStats?.[role];

    if (
      directValue !== undefined &&
      directValue !== null
    ) {
      if (
        typeof directValue === "object"
      ) {
        return getNumber(
          directValue?.count,
          directValue?.total
        );
      }

      return getNumber(directValue);
    }

    return users.filter(
      (user) =>
        String(user?.role || "")
          .toLowerCase() ===
        String(role).toLowerCase()
    ).length;
  };

  // =====================================================
  // STATUS BADGE
  // =====================================================

  const getStatusStyle = (status) => {
    const normalized =
      String(status || "")
        .toLowerCase();

    if (normalized === "active") {
      return "bg-emerald-400/10 text-emerald-300 border-emerald-400/20";
    }

    if (normalized === "inactive") {
      return "bg-red-400/10 text-red-300 border-red-400/20";
    }

    return "bg-white/10 text-white/60 border-white/10";
  };

  // =====================================================
  // ROLE BADGE
  // =====================================================

  const getRoleStyle = (role) => {
    const normalized =
      String(role || "")
        .toLowerCase();

    if (
      normalized === "superadmin" ||
      normalized === "admin"
    ) {
      return "bg-[#D58A98]/15 text-[#D58A98] border-[#D58A98]/20";
    }

    if (
      normalized === "teacher" ||
      normalized === "hod"
    ) {
      return "bg-blue-400/10 text-blue-300 border-blue-400/20";
    }

    if (
      normalized === "student"
    ) {
      return "bg-indigo-400/10 text-indigo-300 border-indigo-400/20";
    }

    return "bg-white/10 text-white/65 border-white/10";
  };

  // =====================================================
  // LOADING STATE
  // =====================================================

  if (
    loading &&
    !usersReport
  ) {
    return (
      <div className="min-h-screen bg-slate-100 px-4 py-6 md:px-6 lg:px-8">

        <div className="mx-auto flex  min-h-[70vh] max-w-[1600px] items-center justify-center">

          <div className="text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#890C25]/10">
              <FaSyncAlt className="animate-spin text-2xl text-[#890C25]" />
            </div>

            <p className="mt-4 text-sm font-bold text-slate-600">
              Loading Users Report...
            </p>

          </div>

        </div>
      </div>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-6 md:px-6 lg:px-8">

      <div className="mx-auto mt-10 max-w-[1600px] space-y-6">

        {/* =================================================
            HERO
        ================================================= */}

        <section
          className="relative overflow-hidden rounded-[2rem] p-6 shadow-2xl md:p-8 lg:p-10"
          style={{
            background:
              "linear-gradient(135deg, #890C25 0%, #6f091e 55%, #420512 100%)",
          }}
        >

          {/* Decorative circles */}

          <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/10" />

          <div className="pointer-events-none absolute -bottom-32 left-10 h-80 w-80 rounded-full bg-[#D58A98]/10" />

          <div className="pointer-events-none absolute right-[22%] top-10 h-28 w-28 rounded-full border border-white/10 bg-white/5" />

          <div className="pointer-events-none absolute bottom-8 right-12 h-16 w-16 rounded-full border border-white/10 bg-white/5" />

          {/* Animated top line */}

          <div className="absolute left-0 right-0 top-0 h-[3px] overflow-hidden bg-white/10">
            <div className="h-full w-1/3 animate-pulse bg-white/70" />
          </div>

          <div className="relative z-10">

            {/* Controls */}

            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <button
                type="button"
                onClick={() => navigate(-1)}
                className="group inline-flex w-fit items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-md transition-all duration-300 hover:bg-white/20"
              >
                <FaArrowLeft className="transition-transform duration-300 group-hover:-translate-x-1" />
                Back to Reports
              </button>

              <button
                type="button"
                onClick={handleRefresh}
                disabled={loading}
                className="inline-flex w-fit items-center gap-2 rounded-xl bg-[#2563EB] px-5 py-2.5 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FaSyncAlt
                  className={
                    loading
                      ? "animate-spin"
                      : ""
                  }
                />

                {loading
                  ? "Refreshing..."
                  : "Refresh Report"}
              </button>

            </div>

            {/* Hero content */}

            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

              <div className="flex items-start gap-5">

                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/10 shadow-xl backdrop-blur-md md:h-20 md:w-20">

                  <FaUsers className="text-3xl text-white md:text-4xl" />

                </div>

                <div>

                  <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-[#D58A98]">
                    Administration Analytics
                  </p>

                  <h1 className="text-3xl font-black tracking-tight text-white md:text-4xl lg:text-5xl">
                    Users Report
                  </h1>

                  <p className="mt-3 max-w-2xl text-sm leading-6 text-white/75 md:text-base">
                    Monitor LMS users, account activity,
                    roles, status and user distribution
                    from one centralized report.
                  </p>

                </div>

              </div>

              {/* Live status */}

              <div className="w-fit rounded-2xl border border-white/10 bg-white/10 px-5 py-4 backdrop-blur-md">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                    <FaUserShield className="text-[#D58A98]" />
                  </div>

                  <div>

                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">
                      Report Status
                    </p>

                    <p className="mt-1 flex items-center gap-2 text-sm font-bold text-white">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                      Live User Data
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>
        </section>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 shadow-sm">

            <div className="flex items-center gap-3 text-red-700">

              <FaExclamationTriangle />

              <p className="text-sm font-semibold">
                {error}
              </p>

            </div>

          </div>
        )}

        {/* =================================================
            STAT CARDS
        ================================================= */}

        <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

          {/* Total Users */}

          <div
            className="group relative overflow-hidden rounded-3xl p-6 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
            style={{
              background:
                "linear-gradient(145deg, #890C25, #65081b)",
            }}
          >

            <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10 transition-transform duration-500 group-hover:scale-125" />

            <div className="absolute bottom-[-35px] left-[-25px] h-24 w-24 rounded-full bg-[#D58A98]/10" />

            <div className="relative z-10">

              <div className="mb-5 flex items-center justify-between">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                  <FaUsers className="text-xl text-white" />
                </div>

                <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#D58A98]">
                  Users
                </span>

              </div>

              <p className="text-xs font-bold uppercase tracking-wider text-[#D58A98]">
                Total Users
              </p>

              <h2 className="mt-2 text-3xl font-black text-white">
                {totalUsers.toLocaleString()}
              </h2>

              <p className="mt-2 text-xs text-white/55">
                Registered LMS accounts
              </p>

            </div>
          </div>

          {/* Active Users */}

          <div
            className="group relative overflow-hidden rounded-3xl p-6 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
            style={{
              background:
                "linear-gradient(145deg, #890C25, #65081b)",
            }}
          >

            <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-emerald-400/10 transition-transform duration-500 group-hover:scale-125" />

            <div className="relative z-10">

              <div className="mb-5 flex items-center justify-between">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15">
                  <FaUserCheck className="text-xl text-emerald-300" />
                </div>

                <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                  Active
                </span>

              </div>

              <p className="text-xs font-bold uppercase tracking-wider text-[#D58A98]">
                Active Users
              </p>

              <h2 className="mt-2 text-3xl font-black text-white">
                {activeUsers.toLocaleString()}
              </h2>

              <p className="mt-2 text-xs text-white/55">
                Currently active accounts
              </p>

            </div>
          </div>

          {/* Inactive Users */}

          <div
            className="group relative overflow-hidden rounded-3xl p-6 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
            style={{
              background:
                "linear-gradient(145deg, #890C25, #65081b)",
            }}
          >

            <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-red-400/10 transition-transform duration-500 group-hover:scale-125" />

            <div className="relative z-10">

              <div className="mb-5 flex items-center justify-between">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/15">
                  <FaUserTimes className="text-xl text-red-300" />
                </div>

                <span className="rounded-full bg-red-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-red-300">
                  Inactive
                </span>

              </div>

              <p className="text-xs font-bold uppercase tracking-wider text-[#D58A98]">
                Inactive Users
              </p>

              <h2 className="mt-2 text-3xl font-black text-white">
                {inactiveUsers.toLocaleString()}
              </h2>

              <p className="mt-2 text-xs text-white/55">
                Inactive LMS accounts
              </p>

            </div>
          </div>

          {/* Roles */}

          <div
            className="group relative overflow-hidden rounded-3xl p-6 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
            style={{
              background:
                "linear-gradient(145deg, #2563EB, #1e40af)",
            }}
          >

            <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10 transition-transform duration-500 group-hover:scale-125" />

            <div className="absolute bottom-[-35px] left-[-25px] h-24 w-24 rounded-full bg-white/10" />

            <div className="relative z-10">

              <div className="mb-5 flex items-center justify-between">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                  <FaUserShield className="text-xl text-white" />
                </div>

                <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white/80">
                  Roles
                </span>

              </div>

              <p className="text-xs font-bold uppercase tracking-wider text-blue-100">
                User Roles
              </p>

              <h2 className="mt-2 text-3xl font-black text-white">
                {roles.length}
              </h2>

              <p className="mt-2 text-xs text-blue-100/70">
                Active LMS role categories
              </p>

            </div>
          </div>

        </section>

        {/* =================================================
            CONTROL CENTER
        ================================================= */}

        <section
          className="relative overflow-hidden rounded-[2rem] p-6 shadow-2xl md:p-8"
          style={{
            background:
              "linear-gradient(145deg, #890C25, #65081b)",
          }}
        >

          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5" />

          <div className="pointer-events-none absolute -bottom-28 left-1/4 h-72 w-72 rounded-full bg-[#D58A98]/5" />

          <div className="relative z-10">

            <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 shadow-lg">
                  <FaUserCog className="text-lg text-white" />
                </div>

                <div>

                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#D58A98]">
                    Control Center
                  </p>

                  <h2 className="mt-1 text-2xl font-black text-white">
                    User Activity Overview
                  </h2>

                </div>

              </div>

              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-bold text-white backdrop-blur-md">

                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />

                Live User Activity

              </div>

            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

              {/* Active Rate */}

              <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-md transition-all duration-300 hover:bg-white/[0.14]">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-xs font-bold uppercase tracking-wider text-[#D58A98]">
                      Active Rate
                    </p>

                    <p className="mt-2 text-3xl font-black text-white">
                      {totalUsers > 0
                        ? Math.round(
                            (activeUsers /
                              totalUsers) *
                              100
                          )
                        : 0}
                      %
                    </p>

                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/15">
                    <FaUserCheck className="text-xl text-emerald-300" />
                  </div>

                </div>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">

                  <div
                    className="h-full rounded-full bg-emerald-400 transition-all duration-700"
                    style={{
                      width:
                        totalUsers > 0
                          ? `${Math.min(
                              (activeUsers /
                                totalUsers) *
                                100,
                              100
                            )}%`
                          : "0%",
                    }}
                  />

                </div>

              </div>

              {/* Inactive Rate */}

              <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-md transition-all duration-300 hover:bg-white/[0.14]">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-xs font-bold uppercase tracking-wider text-[#D58A98]">
                      Inactive Rate
                    </p>

                    <p className="mt-2 text-3xl font-black text-white">
                      {totalUsers > 0
                        ? Math.round(
                            (inactiveUsers /
                              totalUsers) *
                              100
                          )
                        : 0}
                      %
                    </p>

                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/15">
                    <FaUserTimes className="text-xl text-red-300" />
                  </div>

                </div>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">

                  <div
                    className="h-full rounded-full bg-red-400 transition-all duration-700"
                    style={{
                      width:
                        totalUsers > 0
                          ? `${Math.min(
                              (inactiveUsers /
                                totalUsers) *
                                100,
                              100
                            )}%`
                          : "0%",
                    }}
                  />

                </div>

              </div>

              {/* Role Count */}

              <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-md transition-all duration-300 hover:bg-white/[0.14]">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-xs font-bold uppercase tracking-wider text-[#D58A98]">
                      Role Categories
                    </p>

                    <p className="mt-2 text-3xl font-black text-white">
                      {roles.length}
                    </p>

                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/15">
                    <FaChartPie className="text-xl text-blue-300" />
                  </div>

                </div>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">

                  <div
                    className="h-full rounded-full bg-blue-400"
                    style={{
                      width: `${Math.min(
                        roles.length * 8,
                        100
                      )}%`,
                    }}
                  />

                </div>

              </div>

            </div>

          </div>
        </section>

        {/* =================================================
            ROLE ANALYTICS
        ================================================= */}

        <section
          className="relative overflow-hidden rounded-[2rem] p-6 shadow-2xl md:p-8"
          style={{
            background:
              "linear-gradient(145deg, #890C25, #65081b)",
          }}
        >

          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/5" />

          <div className="relative z-10">

            <div className="mb-7 flex items-center justify-between">

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600">
                  <FaChartPie className="text-lg text-white" />
                </div>

                <div>

                  <p className="text-xs font-bold uppercase tracking-widest text-[#D58A98]">
                    Distribution Analytics
                  </p>

                  <h2 className="text-xl font-black text-white">
                    Users by Role
                  </h2>

                </div>

              </div>

              <div className="hidden rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-bold text-white/70 sm:block">
                {roles.length} Roles
              </div>

            </div>

            {roles.length === 0 ? (

              <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center">

                <FaUsers className="mx-auto text-3xl text-white/25" />

                <p className="mt-3 text-sm text-white/50">
                  No role statistics available.
                </p>

              </div>

            ) : (

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

                {roles.map((role, index) => {

                  const count =
                    getRoleCount(role);

                  const percentage =
                    totalUsers > 0
                      ? Math.min(
                          (count /
                            totalUsers) *
                            100,
                          100
                        )
                      : 0;

                  return (
                    <div
                      key={`${role}-${index}`}
                      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.14]"
                    >

                      <div className="absolute left-0 top-0 h-1 w-0 bg-blue-400 transition-all duration-500 group-hover:w-full" />

                      <div className="mb-4 flex items-center justify-between">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">

                          {role.toLowerCase() ===
                          "student" ? (
                            <FaUserGraduate className="text-[#D58A98]" />
                          ) : (
                            <FaUserShield className="text-[#D58A98]" />
                          )}

                        </div>

                        <span className="text-2xl font-black text-white">
                          {count}
                        </span>

                      </div>

                      <p className="text-sm font-bold capitalize text-white">
                        {role}
                      </p>

                      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">

                        <div
                          className="h-full rounded-full bg-blue-400 transition-all duration-700"
                          style={{
                            width: `${percentage}%`,
                          }}
                        />

                      </div>

                      <p className="mt-2 text-xs text-white/45">
                        {percentage.toFixed(1)}%
                        of total users
                      </p>

                    </div>
                  );
                })}

              </div>

            )}

          </div>
        </section>

        {/* =================================================
            FILTERS
        ================================================= */}

        <section
          className="relative overflow-hidden rounded-[2rem] p-6 shadow-2xl md:p-8"
          style={{
            background:
              "linear-gradient(145deg, #890C25, #65081b)",
          }}
        >

          <div className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-white/5" />

          <div className="relative z-10">

            <div className="mb-6 flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600">
                <FaFilter className="text-lg text-white" />
              </div>

              <div>

                <p className="text-xs font-bold uppercase tracking-widest text-[#D58A98]">
                  Search & Filter
                </p>

                <h2 className="text-xl font-black text-white">
                  Find Users
                </h2>

              </div>

            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">

              {/* Search */}

              <div>

                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#D58A98]">
                  Search Users
                </label>

                <div className="relative">

                  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />

                  <input
                    type="text"
                    value={search}
                    onChange={(e) =>
                      setSearch(e.target.value)
                    }
                    placeholder="Name, email, role..."
                    className="w-full rounded-xl border border-white/10 bg-white/10 py-3 pl-11 pr-4 text-sm font-medium text-white outline-none backdrop-blur-md transition-all placeholder:text-white/40 focus:border-blue-400/60 focus:bg-white/[0.14] focus:ring-2 focus:ring-blue-400/20"
                  />

                </div>

              </div>

              {/* Role */}

              <div>

                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#D58A98]">
                  Role
                </label>

                <select
                  value={roleFilter}
                  onChange={(e) =>
                    setRoleFilter(e.target.value)
                  }
                  className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-semibold text-white outline-none backdrop-blur-md transition-all focus:border-blue-400/60 focus:ring-2 focus:ring-blue-400/20"
                >

                  <option
                    value="all"
                    className="bg-[#65081b] text-white"
                  >
                    All Roles
                  </option>

                  {roles.map((role) => (
                    <option
                      key={role}
                      value={role}
                      className="bg-[#65081b] text-white"
                    >
                      {role}
                    </option>
                  ))}

                </select>

              </div>

              {/* Status */}

              <div>

                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#D58A98]">
                  Status
                </label>

                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value)
                  }
                  className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-semibold text-white outline-none backdrop-blur-md transition-all focus:border-blue-400/60 focus:ring-2 focus:ring-blue-400/20"
                >

                  <option
                    value="all"
                    className="bg-[#65081b] text-white"
                  >
                    All Status
                  </option>

                  <option
                    value="active"
                    className="bg-[#65081b] text-white"
                  >
                    Active
                  </option>

                  <option
                    value="inactive"
                    className="bg-[#65081b] text-white"
                  >
                    Inactive
                  </option>

                </select>

              </div>

            </div>

          </div>
        </section>

        {/* =================================================
            USER TABLE
        ================================================= */}

        <section
          className="relative overflow-hidden rounded-[2rem] shadow-2xl"
          style={{
            background:
              "linear-gradient(145deg, #890C25, #65081b)",
          }}
        >

          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5" />

          <div className="relative z-10">

            {/* Header */}

            <div className="flex flex-col gap-4 border-b border-white/10 p-6 md:flex-row md:items-center md:justify-between md:p-8">

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600">
                  <FaUsers className="text-lg text-white" />
                </div>

                <div>

                  <p className="text-xs font-bold uppercase tracking-widest text-[#D58A98]">
                    User Directory
                  </p>

                  <h2 className="mt-1 text-xl font-black text-white">
                    User Details
                  </h2>

                </div>

              </div>

              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2">

                <span className="text-xs font-semibold text-white/50">
                  Showing
                </span>

                <span className="text-sm font-black text-white">
                  {filteredUsers.length}
                </span>

                <span className="text-xs font-semibold text-white/50">
                  of
                </span>

                <span className="text-sm font-black text-white">
                  {users.length}
                </span>

              </div>

            </div>

            {/* Empty state */}

            {filteredUsers.length === 0 ? (

              <div className="flex min-h-[350px] items-center justify-center p-8">

                <div className="max-w-md text-center">

                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">

                    <FaUsers className="text-2xl text-white/30" />

                  </div>

                  <h3 className="mt-5 text-lg font-black text-white">
                    No Users Found
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-white/50">
                    No users match your current search or
                    filter criteria.
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setRoleFilter("all");
                      setStatusFilter("all");
                    }}
                    className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-blue-500"
                  >
                    Clear Filters
                  </button>

                </div>

              </div>

            ) : (

              <div className="overflow-x-auto">

                <table className="min-w-[1200px] w-full">

                  <thead>

                    <tr className="border-b border-white/10 bg-black/10">

                      <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-wider text-[#D58A98]">
                        #
                      </th>

                      <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-wider text-[#D58A98]">
                        User
                      </th>

                      <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-wider text-[#D58A98]">
                        Email
                      </th>

                      <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-wider text-[#D58A98]">
                        Role
                      </th>

                      <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-wider text-[#D58A98]">
                        Department
                      </th>

                      <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-wider text-[#D58A98]">
                        Status
                      </th>

                      <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-wider text-[#D58A98]">
                        Created
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {filteredUsers.map(
                      (user, index) => {

                        const department =
                          typeof user?.department ===
                          "object"
                            ? user?.department?.name
                            : user?.department;

                        const normalizedStatus =
                          String(
                            user?.status || ""
                          ).toLowerCase();

                        return (
                          <tr
                            key={
                              user?._id ||
                              user?.id ||
                              index
                            }
                            className="group border-b border-white/5 transition-all duration-300 hover:bg-white/[0.06]"
                          >

                            {/* Number */}

                            <td className="px-6 py-5">

                              <span className="text-sm font-bold text-white/35">
                                {String(
                                  index + 1
                                ).padStart(2, "0")}
                              </span>

                            </td>

                            {/* User */}

                            <td className="px-6 py-5">

                              <div className="flex items-center gap-3">

                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 transition-all duration-300 group-hover:bg-blue-600">

                                  <FaUsers className="text-sm text-white/80 group-hover:text-white" />

                                </div>

                                <div className="min-w-0">

                                  <p className="max-w-[180px] truncate text-sm font-bold text-white">
                                    {user?.name ||
                                      "Unknown User"}
                                  </p>

                                  <p className="mt-1 text-[11px] text-white/35">
                                    ID:{" "}
                                    {String(
                                      user?._id ||
                                        user?.id ||
                                        "N/A"
                                    ).slice(-8)}
                                  </p>

                                </div>

                              </div>

                            </td>

                            {/* Email */}

                            <td className="px-6 py-5">

                              <div className="flex items-center gap-2">

                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5">
                                  <FaEnvelope className="text-xs text-[#D58A98]" />
                                </div>

                                <span className="max-w-[220px] truncate text-sm text-white/70">
                                  {user?.email ||
                                    "N/A"}
                                </span>

                              </div>

                            </td>

                            {/* Role */}

                            <td className="px-6 py-5">

                              <span
                                className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-bold capitalize ${getRoleStyle(
                                  user?.role
                                )}`}
                              >
                                {user?.role ||
                                  "N/A"}
                              </span>

                            </td>

                            {/* Department */}

                            <td className="px-6 py-5">

                              <div className="flex items-center gap-2">

                                <FaBuilding className="text-xs text-[#D58A98]" />

                                <span className="max-w-[150px] truncate text-sm text-white/65">
                                  {department ||
                                    "Not Assigned"}
                                </span>

                              </div>

                            </td>

                            {/* Status */}

                            <td className="px-6 py-5">

                              <span
                                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold capitalize ${getStatusStyle(
                                  user?.status
                                )}`}
                              >

                                <span
                                  className={`h-1.5 w-1.5 rounded-full ${
                                    normalizedStatus ===
                                    "active"
                                      ? "bg-emerald-400"
                                      : "bg-red-400"
                                  }`}
                                />

                                {user?.status ||
                                  "Unknown"}

                              </span>

                            </td>

                            {/* Created */}

                            <td className="px-6 py-5">

                              <div className="flex items-center gap-2">

                                <FaCalendarAlt className="text-xs text-[#D58A98]" />

                                <span className="text-sm text-white/60">
                                  {formatDate(
                                    user?.createdAt
                                  )}
                                </span>

                              </div>

                            </td>

                          </tr>
                        );
                      }
                    )}

                  </tbody>

                </table>

              </div>

            )}

            {/* Footer */}

            {filteredUsers.length > 0 && (

              <div className="border-t border-white/10 px-6 py-5 md:px-8">

                <div className="flex flex-col gap-3 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">

                  <p>
                    Showing{" "}
                    <span className="font-bold text-white/80">
                      {filteredUsers.length}
                    </span>{" "}
                    matching users.
                  </p>

                  <p>
                    Total registered users:{" "}
                    <span className="font-bold text-white/80">
                      {totalUsers}
                    </span>
                  </p>

                </div>

              </div>

            )}

          </div>
        </section>

        {/* =================================================
            FOOTER SUMMARY
        ================================================= */}

        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#890C25]/10">
                <FaUsers className="text-[#890C25]" />
              </div>

              <div>

                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Total Users
                </p>

                <p className="mt-1 text-xl font-black text-slate-800">
                  {totalUsers}
                </p>

              </div>

            </div>

          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600/10">
                <FaUserCheck className="text-emerald-600" />
              </div>

              <div>

                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Active Users
                </p>

                <p className="mt-1 text-xl font-black text-slate-800">
                  {activeUsers}
                </p>

              </div>

            </div>

          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600/10">
                <FaUserShield className="text-blue-600" />
              </div>

              <div>

                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Role Categories
                </p>

                <p className="mt-1 text-xl font-black text-slate-800">
                  {roles.length}
                </p>

              </div>

            </div>

          </div>

        </section>

      </div>
    </div>
  );
};

export default UsersReport;

