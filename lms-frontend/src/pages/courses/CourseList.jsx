import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  FaBookOpen,
  FaChalkboardTeacher,
  FaGraduationCap,
  FaEdit,
  FaTrash,
  FaEye,
  FaSearch,
  FaPlus,
  FaFileAlt,
  FaBuilding,
} from "react-icons/fa";

import { useCourses } from "../../context/CourseContext";
import { useAuth } from "../../context/AuthContext";

// =====================================================
// COURSE LIST
// =====================================================

const CourseList = () => {
  const {
    courses = [],
    loading,
    error,
    deleteCourse,
  } = useCourses();

  const { user } = useAuth();

  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  // =====================================================
  // ROLE
  // =====================================================

  const role = user?.role
    ?.toString()
    ?.trim()
    ?.toLowerCase();

  // =====================================================
  // PERMISSIONS
  // =====================================================

  const canCreate = [
    "teacher",
    "admin",
    "superadmin",
    "hod",
  ].includes(role);

  const canDelete = [
    "admin",
    "superadmin",
  ].includes(role);

  // =====================================================
  // SEARCH
  // =====================================================

  const filteredCourses = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return courses;
    }

    return courses.filter((course) => {
      return (
        course?.title
          ?.toLowerCase()
          .includes(value) ||

        course?.code
          ?.toLowerCase()
          .includes(value) ||

        course?.department
          ?.toLowerCase()
          .includes(value) ||

        course?.teacher?.name
          ?.toLowerCase()
          .includes(value)
      );
    });
  }, [courses, search]);

  // =====================================================
  // DELETE COURSE
  // =====================================================

  const handleDelete = async (id, title) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${title}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);

      await deleteCourse(id);
    } catch (err) {
      console.error(
        "DELETE COURSE ERROR:",
        err
      );
    } finally {
      setDeletingId(null);
    }
  };

  // =====================================================
  // INITIAL
  // =====================================================

  const getInitial = (name) => {
    return (
      name
        ?.trim()
        ?.charAt(0)
        ?.toUpperCase() || "T"
    );
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading && courses.length === 0) {
    return (
      <div
        className="
          min-h-screen
          bg-slate-100
          px-4
          pb-10
          pt-10
          sm:px-6
          sm:pt-12
          lg:px-8
          lg:pt-14
        "
      >
        <div className="mx-auto max-w-7xl">

          <div className="flex min-h-[60vh] items-center justify-center">

            <div className="text-center">

              <div
                className="
                  mx-auto
                  flex
                  h-20
                  w-20
                  items-center
                  justify-center
                  rounded-3xl
                  border
                  border-[#890C25]/10
                  bg-white
                  shadow-2xl
                "
              >

                <div
                  className="
                    h-9
                    w-9
                    animate-spin
                    rounded-full
                    border-4
                    border-[#890C25]/20
                    border-t-[#890C25]
                  "
                />

              </div>

              <h3 className="mt-5 text-xl font-black text-slate-800">
                Loading Courses
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Fetching course records...
              </p>

            </div>

          </div>

        </div>
      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div
      className="
        min-h-screen
        bg-slate-100
        px-4
        pb-12
        pt-10
        sm:px-6
        sm:pt-12
        lg:px-8
        lg:pt-14
      "
    >

      <div className="mx-auto max-w-7xl">

        {/* =================================================
            HERO HEADER
        ================================================= */}

        <div
          className="
            group/hero
            relative
            mb-6
            overflow-hidden
            rounded-3xl
            bg-[#890C25]
            shadow-2xl
          "
        >

          <div
            className="
              pointer-events-none
              absolute
              -right-20
              -top-20
              h-64
              w-64
              rounded-full
              border
              border-white/20
              bg-white/5
              transition
              duration-500
              group-hover/hero:scale-110
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              -bottom-24
              left-1/3
              h-64
              w-64
              rounded-full
              border
              border-white/10
              bg-white/5
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              right-24
              top-20
              h-20
              w-20
              rounded-full
              bg-[#D58A98]/10
              blur-2xl
            "
          />

          <div
            className="
              relative
              flex
              flex-col
              gap-7
              p-6
              sm:p-8
              lg:flex-row
              lg:items-center
              lg:justify-between
            "
          >

            {/* LEFT */}

            <div>

              <div className="mb-4 flex items-center gap-3">

                <div
                  className="
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-white/20
                    bg-white/10
                    text-white
                    shadow-xl
                    backdrop-blur-md
                  "
                >
                  <FaBookOpen size={24} />
                </div>

                <div>

                  <p
                    className="
                      text-xs
                      font-black
                      uppercase
                      tracking-[0.2em]
                      text-[#D58A98]
                    "
                  >
                    Academic Management
                  </p>

                  <p className="mt-1 text-xs text-white/55">
                    Learning Management System
                  </p>

                </div>

              </div>

              <h1
                className="
                  text-3xl
                  font-extrabold
                  text-white
                  sm:text-4xl
                "
              >
                Courses
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70 sm:text-base">
                Manage, explore and access all available LMS courses
                from one place.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">

                <div
                  className="
                    flex
                    items-center
                    gap-2
                    rounded-full
                    border
                    border-white/15
                    bg-white/10
                    px-4
                    py-2
                    text-xs
                    font-bold
                    text-white/85
                    backdrop-blur-md
                  "
                >
                  <span className="h-2 w-2 rounded-full bg-green-400" />
                  Course Directory
                </div>

                <div
                  className="
                    rounded-full
                    border
                    border-white/15
                    bg-white/10
                    px-4
                    py-2
                    text-xs
                    font-bold
                    text-white/85
                    backdrop-blur-md
                  "
                >
                  {courses.length} Courses
                </div>

              </div>

            </div>

            {/* TOTAL COURSES */}

            <div
              className="
                group/total
                relative
                w-full
                overflow-hidden
                rounded-3xl
                border
                border-blue-300/30
                bg-gradient-to-br
                from-blue-600
                via-blue-700
                to-blue-900
                p-6
                text-center
                shadow-xl
                transition
                duration-300
                hover:-translate-y-1
                hover:shadow-blue-900/40
                lg:w-56
              "
            >

              <div
                className="
                  pointer-events-none
                  absolute
                  -bottom-14
                  -right-14
                  h-40
                  w-40
                  rounded-full
                  border-2
                  border-blue-200/25
                  bg-blue-400/10
                  transition
                  duration-500
                  group-hover/total:scale-125
                "
              />

              <div className="relative">

                <div
                  className="
                    mx-auto
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-white/20
                    bg-white/15
                    text-white
                    shadow-lg
                  "
                >
                  <FaBookOpen size={24} />
                </div>

                <p className="mt-4 text-[11px] font-black uppercase tracking-[0.2em] text-blue-100/70">
                  Total Courses
                </p>

                <p
                  className="
                    mt-1
                    text-5xl
                    font-black
                    leading-none
                    text-white
                  "
                >
                  {String(courses.length).padStart(2, "0")}
                </p>

                <div
                  className="
                    mx-auto
                    mt-4
                    h-1
                    w-12
                    rounded-full
                    bg-white/60
                    transition-all
                    duration-500
                    group-hover/total:w-20
                  "
                />

              </div>

            </div>

          </div>
        </div>

        {/* =================================================
            SEARCH + CREATE
        ================================================= */}

        <div
          className="
            mb-6
            grid
            gap-5
            lg:grid-cols-[1fr_auto]
          "
        >

          <div
            className="
              group/search
              relative
              overflow-hidden
              rounded-2xl
              border
              border-slate-200
              bg-white
              shadow-lg
              transition
              duration-300
              hover:border-[#890C25]/20
              hover:shadow-xl
            "
          >

            <div
              className="
                absolute
                left-0
                top-0
                h-1.5
                w-20
                rounded-br-full
                bg-[#890C25]
                transition-all
                duration-500
                group-hover/search:w-full
              "
            />

            <div className="relative flex items-center">

              <FaSearch
                className="
                  absolute
                  left-5
                  text-[#890C25]
                "
                size={15}
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search by course title, code, department or teacher..."
                className="
                  w-full
                  rounded-2xl
                  bg-transparent
                  py-4
                  pl-12
                  pr-5
                  text-sm
                  font-semibold
                  text-slate-700
                  outline-none
                  placeholder:text-slate-400
                "
              />

            </div>

          </div>

          {canCreate && (
            <Link
              to="/courses/create"
              className="
                group/create
                relative
                inline-flex
                items-center
                justify-center
                gap-2
                overflow-hidden
                rounded-2xl
                bg-[#890C25]
                px-7
                py-4
                text-sm
                font-black
                text-white
                shadow-lg
                shadow-[#890C25]/20
                transition-all
                duration-300
                hover:-translate-y-1
                hover:bg-[#6f091e]
                hover:shadow-xl
              "
            >

              <span
                className="
                  absolute
                  -right-8
                  -top-8
                  h-20
                  w-20
                  rounded-full
                  bg-white/5
                  transition
                  duration-500
                  group-hover/create:scale-125
                "
              />

              <FaPlus size={13} />

              Create Course

            </Link>
          )}

        </div>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div
            className="
              mb-6
              rounded-2xl
              border
              border-red-200
              bg-red-50
              px-5
              py-4
              text-sm
              font-semibold
              text-red-700
              shadow-sm
            "
          >
            {error}
          </div>
        )}

        {/* =================================================
            SECTION HEADER
        ================================================= */}

        <div
          className="
            mb-6
            flex
            flex-col
            gap-4
            sm:flex-row
            sm:items-end
            sm:justify-between
          "
        >

          <div>

            <div className="flex items-center gap-3">

              <div className="h-10 w-1.5 rounded-full bg-[#890C25]" />

              <div>

                <h2
                  className="
                    text-2xl
                    font-black
                    tracking-tight
                    text-slate-800
                  "
                >
                  All Courses
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Browse and manage registered LMS courses.
                </p>

              </div>

            </div>

          </div>

          <div
            className="
              flex
              w-fit
              items-center
              gap-2
              rounded-full
              border
              border-[#890C25]/10
              bg-white
              px-5
              py-2.5
              text-xs
              font-black
              text-[#890C25]
              shadow-sm
            "
          >

            <span className="h-2 w-2 rounded-full bg-[#890C25]" />

            Showing {filteredCourses.length}

          </div>

        </div>

        {/* =================================================
            EMPTY
        ================================================= */}

        {filteredCourses.length === 0 ? (

          <div
            className="
              relative
              overflow-hidden
              rounded-3xl
              border-2
              border-dashed
              border-[#890C25]/20
              bg-white
              px-6
              py-16
              text-center
              shadow-xl
            "
          >

            <div
              className="
                pointer-events-none
                absolute
                -right-16
                -top-16
                h-48
                w-48
                rounded-full
                bg-[#890C25]/5
              "
            />

            <div
              className="
                pointer-events-none
                absolute
                -bottom-20
                -left-16
                h-56
                w-56
                rounded-full
                bg-blue-500/5
              "
            />

            <div className="relative">

              <div
                className="
                  mx-auto
                  flex
                  h-20
                  w-20
                  items-center
                  justify-center
                  rounded-3xl
                  bg-[#890C25]/10
                  text-[#890C25]
                "
              >
                <FaBookOpen size={27} />
              </div>

              <h3 className="mt-6 text-xl font-black text-slate-800">
                No Courses Found
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                {search
                  ? "Try searching with another course title, code, department or teacher."
                  : "There are currently no courses available in the LMS."}
              </p>

              {canCreate && !search && (
                <Link
                  to="/courses/create"
                  className="
                    mt-6
                    inline-flex
                    items-center
                    gap-2
                    rounded-xl
                    bg-[#890C25]
                    px-5
                    py-3
                    text-sm
                    font-bold
                    text-white
                    shadow-lg
                    transition
                    hover:bg-[#6f091e]
                  "
                >
                  <FaPlus size={11} />
                  Create First Course
                </Link>
              )}

            </div>

          </div>

        ) : (

          /* =================================================
             COURSE GRID
          ================================================= */

          <div
            className="
              grid
              grid-cols-1
              gap-6
              md:grid-cols-2
              xl:grid-cols-3
            "
          >

            {filteredCourses.map((course) => {

              const teacherName =
                course?.teacher?.name ||
                "Not Assigned";

              const teacherInitial =
                getInitial(teacherName);

              const currentUserId =
                user?._id || user?.id;

              const courseTeacherId =
                course?.teacher?._id ||
                course?.teacher?.id;

              const canEdit =
                role === "admin" ||
                role === "superadmin" ||
                role === "hod" ||
                (
                  role === "teacher" &&
                  currentUserId &&
                  courseTeacherId &&
                  currentUserId.toString() ===
                    courseTeacherId.toString()
                );

              const isDeleting =
                deletingId === course._id;

              return (

                <div
                  key={course._id}
                  className="
                    group/card
                    relative
                    overflow-hidden
                    rounded-3xl
                    border
                    border-slate-200
                    bg-white
                    shadow-lg
                    transition-all
                    duration-300
                    hover:-translate-y-2
                    hover:border-[#890C25]/20
                    hover:shadow-[0_25px_55px_rgba(137,12,37,0.14)]
                  "
                >

                  {/* =================================================
                      TOP COLOR LINE
                  ================================================= */}

                  <div
                    className="
                      absolute
                      left-0
                      right-0
                      top-0
                      z-20
                      h-1.5
                      bg-gradient-to-r
                      from-[#65091c]
                      via-[#890C25]
                      to-[#D58A98]
                    "
                  />

                  {/* =================================================
                      CARD HEADER
                  ================================================= */}

                  <div
                    className="
                      relative
                      overflow-hidden
                      bg-gradient-to-br
                      from-[#890C25]
                      via-[#9d1833]
                      to-[#65091c]
                      px-6
                      pb-6
                      pt-7
                      text-white
                    "
                  >

                    <div
                      className="
                        pointer-events-none
                        absolute
                        -right-10
                        -top-10
                        h-32
                        w-32
                        rounded-full
                        border
                        border-white/15
                        bg-white/5
                        transition
                        duration-500
                        group-hover/card:scale-125
                      "
                    />

                    <div
                      className="
                        pointer-events-none
                        absolute
                        -bottom-8
                        left-1/3
                        h-20
                        w-20
                        rounded-full
                        bg-white/5
                      "
                    />

                    <div className="relative">

                      <div className="flex items-start justify-between gap-3">

                        {/* BLUE ICON BOX */}

                        <div
                          className="
                            flex
                            h-12
                            w-12
                            items-center
                            justify-center
                            rounded-xl
                            bg-blue-600
                            text-white
                            shadow-lg
                            transition-all
                            duration-300
                            group-hover/card:scale-105
                            group-hover/card:bg-blue-700
                          "
                        >
                          <FaGraduationCap size={21} />
                        </div>

                        <span
                          className="
                            rounded-lg
                            border
                            border-white/15
                            bg-white/10
                            px-3
                            py-1.5
                            text-xs
                            font-black
                            backdrop-blur-md
                          "
                        >
                          {course?.code || "N/A"}
                        </span>

                      </div>

                      <div className="mt-5">

                        <h2
                          className="
                            line-clamp-2
                            text-xl
                            font-black
                          "
                        >
                          {course?.title ||
                            "Untitled Course"}
                        </h2>

                        <p className="mt-2 flex items-center gap-2 text-xs font-medium text-white/65">

                          <FaBuilding size={10} />

                          {course?.department ||
                            "Department not specified"}

                        </p>

                      </div>

                    </div>
                  </div>

                  {/* =================================================
                      CARD BODY
                  ================================================= */}

                  <div className="relative p-6">

                    {/* SEMESTER */}

                    <div
                      className="
                        group/semester
                        relative
                        mb-5
                        overflow-hidden
                        rounded-2xl
                        border
                        border-slate-100
                        bg-slate-50
                        p-4
                        transition-all
                        duration-300
                        hover:border-[#890C25]/15
                        hover:bg-white
                        hover:shadow-sm
                      "
                    >

                      <div
                        className="
                          pointer-events-none
                          absolute
                          -bottom-10
                          -right-10
                          h-24
                          w-24
                          rounded-full
                          bg-[#890C25]/5
                          transition
                          duration-500
                          group-hover/semester:scale-125
                        "
                      />

                      <div className="relative flex items-center gap-3">

                        {/* BLUE ICON BOX */}

                        <div
                          className="
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            bg-blue-600
                            text-white
                            shadow-sm
                            transition
                            duration-300
                            group-hover/semester:bg-blue-700
                          "
                        >
                          <FaGraduationCap size={15} />
                        </div>

                        <div>

                          <p
                            className="
                              text-[10px]
                              font-black
                              uppercase
                              tracking-wider
                              text-slate-400
                            "
                          >
                            Semester
                          </p>

                          <p className="mt-1 text-sm font-black text-slate-700">
                            Semester{" "}
                            {course?.semester || "—"}
                          </p>

                        </div>

                      </div>

                    </div>

                    {/* =================================================
                        TEACHER
                    ================================================= */}

                    <div className="mb-5 flex items-center gap-3">

                      <div
                        className="
                          relative
                          flex
                          h-12
                          w-12
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                          bg-[#7B1E2B]
                          text-base
                          font-black
                          text-white
                          shadow-md
                          transition
                          duration-300
                          group-hover/card:bg-[#890C25]
                        "
                      >
                        {teacherInitial}

                        <span
                          className="
                            absolute
                            bottom-0
                            right-0
                            h-3
                            w-3
                            rounded-full
                            border-2
                            border-white
                            bg-green-500
                          "
                        />

                      </div>

                      <div className="min-w-0">

                        <p
                          className="
                            text-[10px]
                            font-black
                            uppercase
                            tracking-wider
                            text-slate-400
                          "
                        >
                          Instructor
                        </p>

                        <p className="truncate text-sm font-black text-slate-700">
                          {teacherName}
                        </p>

                      </div>

                    </div>

                    {/* =================================================
                        MATERIAL
                    ================================================= */}

                    <div
                      className="
                        group/material
                        mb-5
                        relative
                        overflow-hidden
                        rounded-2xl
                        border
                        border-slate-100
                        bg-slate-50
                        px-4
                        py-3
                        transition
                        duration-300
                        hover:border-blue-200
                        hover:bg-blue-50/60
                      "
                    >

                      <div
                        className="
                          pointer-events-none
                          absolute
                          -bottom-8
                          -right-8
                          h-20
                          w-20
                          rounded-full
                          bg-blue-500/5
                          transition
                          duration-500
                          group-hover/material:scale-125
                        "
                      />

                      <div className="relative flex items-center justify-between gap-3">

                        <div className="flex items-center gap-2">

                          {/* BLUE ICON BOX */}

                          <div
                            className="
                              flex
                              h-9
                              w-9
                              items-center
                              justify-center
                              rounded-lg
                              bg-blue-600
                              text-white
                              shadow-sm
                            "
                          >
                            <FaFileAlt size={14} />
                          </div>

                          <span className="text-xs font-bold text-slate-500">
                            Course Material
                          </span>

                        </div>

                        <span
                          className={`
                            rounded-full
                            px-3
                            py-1
                            text-[10px]
                            font-black
                            ${
                              course?.material
                                ? "bg-green-100 text-green-700"
                                : "bg-slate-200 text-slate-400"
                            }
                          `}
                        >
                          {course?.material
                            ? "Available"
                            : "Not Available"}
                        </span>

                      </div>

                    </div>

                    {/* =================================================
                        ACTIONS
                    ================================================= */}

                    <div className="flex items-center gap-2">

                      {/* VIEW */}

                      <Link
                        to={`/courses/${course._id}`}
                        className="
                          group/view
                          flex
                          flex-1
                          items-center
                          justify-center
                          gap-2
                          rounded-xl
                          border
                          border-slate-200
                          px-3
                          py-3
                          text-xs
                          font-black
                          text-slate-600
                          transition-all
                          duration-300
                          hover:border-[#890C25]/20
                          hover:bg-[#890C25]
                          hover:text-white
                        "
                      >
                        <FaEye
                          size={12}
                          className="transition group-hover/view:scale-110"
                        />
                        View
                      </Link>

                      {/* EDIT */}

                      {canEdit && (
                        <Link
                          to={`/courses/${course._id}/edit`}
                          className="
                            group/edit
                            flex
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            bg-blue-600
                            px-4
                            py-3
                            text-xs
                            font-black
                            text-white
                            shadow-sm
                            transition-all
                            duration-300
                            hover:bg-blue-700
                            hover:shadow-md
                          "
                        >
                          <FaEdit
                            size={12}
                            className="transition group-hover/edit:scale-110"
                          />
                          Edit
                        </Link>
                      )}

                      {/* DELETE */}

                      {canDelete && (
                        <button
                          type="button"
                          disabled={isDeleting}
                          onClick={() =>
                            handleDelete(
                              course._id,
                              course.title
                            )
                          }
                          className="
                            group/delete
                            flex
                            items-center
                            justify-center
                            rounded-xl
                            bg-red-50
                            px-3.5
                            py-3
                            text-red-500
                            transition-all
                            duration-300
                            hover:bg-red-600
                            hover:text-white
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                          "
                          title="Delete Course"
                        >
                          <FaTrash
                            size={12}
                            className="transition group-hover/delete:scale-110"
                          />
                        </button>
                      )}

                    </div>

                    {/* =================================================
                        BOTTOM HOVER STRIP
                    ================================================= */}

                    <div
                      className="
                        mt-5
                        h-1
                        w-16
                        rounded-full
                        bg-[#890C25]
                        transition-all
                        duration-500
                        group-hover/card:w-full
                      "
                    />

                  </div>

                </div>
              );
            })}

          </div>
        )}

        {/* =================================================
            RESULT COUNT
        ================================================= */}

        {courses.length > 0 && (
          <div
            className="
              mt-6
              text-center
              text-xs
              font-semibold
              text-slate-400
            "
          >
            Showing{" "}
            <span className="font-black text-[#890C25]">
              {filteredCourses.length}
            </span>{" "}
            of{" "}
            <span className="font-black text-slate-600">
              {courses.length}
            </span>{" "}
            courses
          </div>
        )}

      </div>
    </div>
  );
};

export default CourseList;