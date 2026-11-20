import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  FaArrowLeft,
  FaBookOpen,
  FaCode,
  FaBuilding,
  FaGraduationCap,
  FaChalkboardTeacher,
  FaEnvelope,
  FaFileAlt,
  FaDownload,
  FaEdit,
  FaCalendarAlt,
  FaLayerGroup,
  FaEye,
  FaInfoCircle,
  FaUpload,
} from "react-icons/fa";

import { useCourses } from "../../context/CourseContext";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/api";

// =====================================================
// COURSE DETAILS
// =====================================================

const CourseDetails = () => {
  const { id } = useParams();

  const { getCourse } = useCourses();
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // ROLE
  // =====================================================

  const role = user?.role
    ?.toString()
    ?.trim()
    ?.toLowerCase();

  // =====================================================
  // LOAD COURSE
  // =====================================================

  useEffect(() => {
    const loadCourse = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getCourse(id);

        setCourse(data);
      } catch (err) {
        console.error(
          "LOAD COURSE DETAILS ERROR:",
          err.response?.data || err.message
        );

        setError(
          err.response?.data?.message ||
            "Failed to load course"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadCourse();
    }
  }, [id, getCourse]);

  // =====================================================
  // USER IDS
  // =====================================================

  const currentUserId =
    user?._id || user?.id;

  const courseTeacherId =
    course?.teacher?._id ||
    course?.teacher?.id;

  // =====================================================
  // EDIT PERMISSION
  // =====================================================

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

  // =====================================================
  // TEACHER
  // =====================================================

  const teacherName =
    course?.teacher?.name ||
    "Not Assigned";

  const teacherEmail =
    course?.teacher?.email ||
    "";

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
  // MATERIAL URL
  // =====================================================

  const getMaterialUrl = () => {
    if (!course?.material) {
      return "";
    }

    if (
      course.material.startsWith("http://") ||
      course.material.startsWith("https://")
    ) {
      return course.material;
    }

    const backendUrl =
      api.defaults.baseURL.replace(
        /\/api\/?$/,
        ""
      );

    return `${backendUrl}${course.material}`;
  };

  const materialUrl = getMaterialUrl();

  // =====================================================
  // DATE FORMAT
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =====================================================
  // LOADING STATE
  // =====================================================

  if (loading) {
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
        <div className="mx-auto max-w-6xl">

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
                Loading Course
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Fetching course information...
              </p>

            </div>

          </div>

        </div>
      </div>
    );
  }

  // =====================================================
  // ERROR STATE
  // =====================================================

  if (error || !course) {
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

        <div className="mx-auto max-w-6xl">

          <Link
            to="/courses"
            className="
              mb-6
              inline-flex
              items-center
              gap-2
              text-sm
              font-bold
              text-slate-500
              transition
              hover:text-[#890C25]
            "
          >
            <FaArrowLeft size={12} />
            Back to Courses
          </Link>

          <div
            className="
              relative
              overflow-hidden
              rounded-3xl
              border-2
              border-red-200
              bg-white
              p-12
              text-center
              shadow-2xl
            "
          >

            <div
              className="
                absolute
                -right-16
                -top-16
                h-44
                w-44
                rounded-full
                bg-red-500/5
              "
            />

            <div
              className="
                absolute
                -bottom-20
                -left-16
                h-48
                w-48
                rounded-full
                bg-[#890C25]/5
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
                  bg-red-50
                  text-red-500
                "
              >
                <FaInfoCircle size={28} />
              </div>

              <h2 className="mt-5 text-2xl font-extrabold text-slate-800">
                Course Not Found
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                {error ||
                  "The requested course could not be found."}
              </p>

              <Link
                to="/courses"
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
                  shadow-[#890C25]/20
                  transition
                  hover:bg-[#6f091e]
                "
              >
                <FaArrowLeft size={11} />
                Back to Courses
              </Link>

            </div>
          </div>

        </div>
      </div>
    );
  }

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

      <div className="mx-auto max-w-6xl">

        {/* =================================================
            TOP NAVIGATION
        ================================================= */}

        <div
          className="
            mb-6
            flex
            flex-col
            gap-4
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >

          <Link
            to="/courses"
            className="
              inline-flex
              items-center
              gap-2
              text-sm
              font-bold
              text-slate-500
              transition
              hover:text-[#890C25]
            "
          >
            <FaArrowLeft size={12} />
            Back to Courses
          </Link>

          {canEdit && (
            <Link
              to={`/courses/${course._id}/edit`}
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-[#890C25]
                px-5
                py-3
                text-sm
                font-bold
                text-white
                shadow-lg
                shadow-[#890C25]/20
                transition
                hover:bg-[#6f091e]
                hover:shadow-xl
              "
            >
              <FaEdit size={13} />
              Edit Course
            </Link>
          )}

        </div>

        {/* =================================================
            HERO
        ================================================= */}

        <div
          className="
            group
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
              group-hover:scale-110
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              -bottom-28
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
              right-32
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
              gap-6
              p-6
              sm:p-8
              md:flex-row
              md:items-center
              md:justify-between
            "
          >

            {/* =================================================
                COURSE INFO
            ================================================= */}

            <div className="min-w-0">

              <div className="mb-4 flex items-center gap-3">

                <div
                  className="
                    flex
                    h-14
                    w-14
                    shrink-0
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

              <div className="mb-3 flex flex-wrap gap-3">

                <span
                  className="
                    rounded-full
                    border
                    border-white/20
                    bg-white/10
                    px-4
                    py-2
                    text-xs
                    font-bold
                    text-white
                    backdrop-blur-md
                  "
                >
                  {course.code || "N/A"}
                </span>

                <span
                  className="
                    rounded-full
                    border
                    border-white/20
                    bg-white/10
                    px-4
                    py-2
                    text-xs
                    font-bold
                    text-white
                    backdrop-blur-md
                  "
                >
                  Semester {course.semester || "—"}
                </span>

                <span
                  className="
                    rounded-full
                    border
                    border-white/20
                    bg-white/10
                    px-4
                    py-2
                    text-xs
                    font-bold
                    text-white
                    backdrop-blur-md
                  "
                >
                  {course.department || "Department"}
                </span>

              </div>

              <h1
                className="
                  break-words
                  text-3xl
                  font-extrabold
                  text-white
                  sm:text-4xl
                "
              >
                {course.title || "Untitled Course"}
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70">
                {course.description ||
                  "No course description has been added yet."}
              </p>

            </div>

            {/* =================================================
                SEMESTER BOX
            ================================================= */}

            <div
              className="
                group/semester
                relative
                w-full
                overflow-hidden
                rounded-3xl
                border
                border-blue-300/40
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
                lg:w-52
              "
            >

              {/* One bottom ring */}

              <div
                className="
                  pointer-events-none
                  absolute
                  -bottom-12
                  -right-12
                  h-36
                  w-36
                  rounded-full
                  border-2
                  border-blue-200/25
                  bg-blue-400/10
                  transition-all
                  duration-500
                  group-hover/semester:scale-125
                  group-hover/semester:bg-blue-300/20
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
                  <FaGraduationCap size={25} />
                </div>

                <p className="mt-4 text-[11px] font-black uppercase tracking-[0.2em] text-blue-100/75">
                  Semester
                </p>

                <p className="mt-1 text-5xl font-black leading-none text-white">
                  {String(
                    course.semester || 0
                  ).padStart(2, "0")}
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
                    group-hover/semester:w-20
                  "
                />

              </div>
            </div>

          </div>
        </div>

        {/* =================================================
            FOUR INFORMATION CARDS
        ================================================= */}

        <div className="mb-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          <CourseInfoCard
            title="Course Code"
            value={course.code || "N/A"}
            icon={<FaCode size={17} />}
            color="maroon"
          />

          <CourseInfoCard
            title="Department"
            value={course.department || "N/A"}
            icon={<FaBuilding size={17} />}
            color="blue"
          />

          <CourseInfoCard
            title="Semester"
            value={
              course.semester
                ? `Semester ${course.semester}`
                : "N/A"
            }
            icon={
              <FaGraduationCap size={18} />
            }
            color="green"
          />

          <CourseInfoCard
            title="Instructor"
            value={teacherName}
            icon={
              <FaChalkboardTeacher
                size={17}
              />
            }
            color="purple"
          />

        </div>

        {/* =================================================
            MAIN GRID
        ================================================= */}

        <div className="grid gap-6 lg:grid-cols-3">

          {/* =================================================
              LEFT SIDE
          ================================================= */}

          <div className="space-y-6 lg:col-span-2">

            {/* =================================================
                COURSE DESCRIPTION
            ================================================= */}

            <CourseSection
              title="Course Description"
              subtitle="Course overview and details"
              icon={<FaBookOpen size={17} />}
              color="maroon"
            >

              <div
                className="
                  relative
                  overflow-hidden
                  rounded-2xl
                  border
                  border-[#890C25]/10
                  bg-gradient-to-br
                  from-[#890C25]/5
                  via-white
                  to-slate-50
                  p-5
                "
              >

                <p className="whitespace-pre-line text-sm leading-8 text-slate-600">
                  {course.description ||
                    "No course description has been added yet."}
                </p>

              </div>

            </CourseSection>

            {/* =================================================
                COURSE MATERIAL
            ================================================= */}

            <CourseSection
              title="Course Material"
              subtitle="Learning resources uploaded for this course"
              icon={<FaFileAlt size={17} />}
              color="blue"
            >

              {course.material ? (

                <div
                  className="
                    group/materialbox
                    relative
                    overflow-hidden
                    rounded-2xl
                    border
                    border-blue-100
                    bg-blue-50
                    p-5
                  "
                >

                  <div
                    className="
                      pointer-events-none
                      absolute
                      -bottom-12
                      -right-12
                      h-36
                      w-36
                      rounded-full
                      border
                      border-blue-200/40
                      bg-blue-100/30
                      transition
                      duration-500
                      group-hover/materialbox:scale-125
                    "
                  />

                  <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                    <div className="flex items-center gap-4">

                      <div
                        className="
                          flex
                          h-14
                          w-14
                          shrink-0
                          items-center
                          justify-center
                          rounded-xl
                          bg-blue-600
                          text-white
                          shadow-lg
                          transition
                          duration-300
                          group-hover/materialbox:bg-[#890C25]
                        "
                      >
                        <FaFileAlt size={20} />
                      </div>

                      <div>

                        <p className="text-xs font-semibold text-blue-500">
                          Available Material
                        </p>

                        <h3 className="mt-1 text-base font-extrabold text-slate-800">
                          Course Learning File
                        </h3>

                        <div className="mt-1 flex items-center gap-2">

                          <span className="h-2 w-2 rounded-full bg-green-500" />

                          <span className="text-xs font-semibold text-green-600">
                            Available
                          </span>

                        </div>

                      </div>

                    </div>

                    <div className="flex flex-wrap gap-3">

                      <a
                        href={materialUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="
                          inline-flex
                          items-center
                          gap-2
                          rounded-xl
                          border
                          border-blue-200
                          bg-white
                          px-5
                          py-3
                          text-xs
                          font-bold
                          text-blue-600
                          shadow-sm
                          transition
                          hover:bg-blue-100
                        "
                      >
                        <FaEye size={11} />
                        View
                      </a>

                      <a
                        href={materialUrl}
                        download
                        className="
                          inline-flex
                          items-center
                          gap-2
                          rounded-xl
                          bg-blue-600
                          px-5
                          py-3
                          text-xs
                          font-bold
                          text-white
                          shadow-md
                          transition
                          hover:bg-blue-700
                        "
                      >
                        <FaDownload size={11} />
                        Download
                      </a>

                    </div>

                  </div>

                </div>

              ) : (

                <div
                  className="
                    group/empty
                    relative
                    overflow-hidden
                    rounded-2xl
                    border-2
                    border-dashed
                    border-[#890C25]/20
                    bg-gradient-to-br
                    from-[#890C25]/5
                    via-slate-50
                    to-blue-50
                    p-10
                    text-center
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
                      border-[#890C25]/15
                      bg-[#890C25]/5
                      transition
                      duration-500
                      group-hover/empty:scale-125
                      group-hover/empty:bg-[#890C25]/10
                    "
                  />

                  <div className="relative">

                    <div
                      className="
                        mx-auto
                        flex
                        h-16
                        w-16
                        items-center
                        justify-center
                        rounded-2xl
                        bg-[#890C25]/10
                        text-[#890C25]
                        transition
                        duration-300
                        group-hover/empty:bg-[#890C25]
                        group-hover/empty:text-white
                      "
                    >
                      <FaFileAlt size={21} />
                    </div>

                    <h3 className="mt-5 text-lg font-extrabold text-slate-700">
                      No Material Available
                    </h3>

                    <p className="mt-2 text-sm text-slate-400">
                      No learning material has been uploaded for this course.
                    </p>

                    {canEdit && (
                      <Link
                        to={`/courses/${course._id}/edit`}
                        className="
                          mt-5
                          inline-flex
                          items-center
                          gap-2
                          rounded-xl
                          bg-[#890C25]
                          px-5
                          py-3
                          text-xs
                          font-bold
                          text-white
                          shadow-lg
                          transition
                          hover:bg-[#6f091e]
                        "
                      >
                        <FaUpload size={11} />
                        Add Material
                      </Link>
                    )}

                  </div>

                </div>
              )}

            </CourseSection>

          </div>

          {/* =================================================
              RIGHT SIDE
          ================================================= */}

          <div className="space-y-6">

            {/* =================================================
                INSTRUCTOR
            ================================================= */}

            <CourseSection
              title="Instructor"
              subtitle="Course instructor"
              icon={
                <FaChalkboardTeacher size={17} />
              }
              color="maroon"
            >

              <div className="flex items-center gap-4">

                <div
                  className="
                    relative
                    flex
                    h-16
                    w-16
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-blue-600
                    text-2xl
                    font-extrabold
                    text-white
                    shadow-lg
                    transition
                    duration-300
                    hover:bg-[#890C25]
                  "
                >

                  {getInitial(teacherName)}

                  <span
                    className="
                      absolute
                      bottom-0
                      right-0
                      h-4
                      w-4
                      rounded-full
                      border-2
                      border-white
                      bg-green-500
                    "
                  />

                </div>

                <div className="min-w-0">

                  <p className="text-xs font-semibold text-slate-400">
                    Course Teacher
                  </p>

                  <h3 className="mt-1 break-words text-lg font-extrabold text-slate-800">
                    {teacherName}
                  </h3>

                </div>

              </div>

              {teacherEmail && (
                <div
                  className="
                    mt-5
                    flex
                    items-start
                    gap-3
                    rounded-2xl
                    bg-slate-50
                    p-4
                  "
                >

                  <div
                    className="
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      bg-[#890C25]/10
                      text-[#890C25]
                    "
                  >
                    <FaEnvelope size={13} />
                  </div>

                  <div className="min-w-0">

                    <p className="text-xs font-semibold text-slate-400">
                      Email Address
                    </p>

                    <p className="mt-1 break-all text-xs font-bold text-slate-600">
                      {teacherEmail}
                    </p>

                  </div>

                </div>
              )}

            </CourseSection>

            {/* =================================================
                COURSE INFORMATION
            ================================================= */}

            <CourseSection
              title="Course Information"
              subtitle="Course data"
              icon={<FaLayerGroup size={17} />}
              color="blue"
            >

              <div className="space-y-3">

                <InfoRow
                  icon={<FaCode size={13} />}
                  label="Course Code"
                  value={course.code}
                  color="maroon"
                />

                <InfoRow
                  icon={<FaBuilding size={13} />}
                  label="Department"
                  value={course.department}
                  color="blue"
                />

                <InfoRow
                  icon={
                    <FaGraduationCap size={14} />
                  }
                  label="Semester"
                  value={
                    course.semester
                      ? `Semester ${course.semester}`
                      : "—"
                  }
                  color="green"
                />

                <InfoRow
                  icon={
                    <FaChalkboardTeacher
                      size={13}
                    />
                  }
                  label="Instructor"
                  value={teacherName}
                  color="purple"
                />

              </div>

            </CourseSection>

            {/* =================================================
                COURSE ACTIVITY
            ================================================= */}

            <CourseSection
              title="Course Activity"
              subtitle="Course creation and update information"
              icon={<FaCalendarAlt size={17} />}
              color="green"
            >

              <div className="space-y-3">

                <ActivityRow
                  label="Created"
                  value={formatDate(
                    course.createdAt
                  )}
                  color="maroon"
                />

                <ActivityRow
                  label="Last Updated"
                  value={formatDate(
                    course.updatedAt
                  )}
                  color="blue"
                />

              </div>

            </CourseSection>

          </div>
        </div>

        {/* =================================================
            FULL WIDTH COURSE ACCESS
        ================================================= */}

        <div className="mt-6">

          <CourseAccessCard
            course={course}
          />

        </div>

      </div>
    </div>
  );
};

// =====================================================
// FOUR INFORMATION CARDS
// =====================================================

const CourseInfoCard = ({
  title,
  value,
  icon,
  color,
}) => {

  const colors = {

    maroon: {
      accent: "bg-[#890C25]",
      light: "bg-[#890C25]/10",
      text: "text-[#890C25]",
      border: "hover:border-[#890C25]/30",
    },

    blue: {
      accent: "bg-blue-600",
      light: "bg-blue-100",
      text: "text-blue-600",
      border: "hover:border-blue-500/30",
    },

    green: {
      accent: "bg-green-500",
      light: "bg-green-100",
      text: "text-green-600",
      border: "hover:border-green-500/30",
    },

    purple: {
      accent: "bg-purple-600",
      light: "bg-purple-100",
      text: "text-purple-600",
      border: "hover:border-purple-500/30",
    },
  };

  const theme =
    colors[color] || colors.blue;

  return (
    <div
      className={`
        group
        relative
        overflow-hidden
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-5
        shadow-lg
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-xl
        ${theme.border}
      `}
    >

      {/* =================================================
          TOP COLOR LINE
      ================================================= */}

      <div
        className={`
          absolute
          right-0
          top-0
          h-1.5
          w-20
          rounded-bl-full
          ${theme.accent}
        `}
      />

      {/* =================================================
          ONE DECORATIVE CIRCLE
      ================================================= */}

      <div
        className={`
          pointer-events-none
          absolute
          -bottom-10
          -right-10
          h-24
          w-24
          rounded-full
          ${theme.light}
          transition-all
          duration-500
          group-hover:scale-125
        `}
      />

      <div className="relative">

        <div className="mb-4 flex items-center justify-between">

          <p className="text-sm font-semibold text-slate-500">
            {title}
          </p>

          {/* ICON */}

          <div
            className="
              relative
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              overflow-hidden
              rounded-xl
              shadow-sm
            "
          >

            {/* Default icon background */}

            <div
              className={`
                absolute
                inset-0
                ${theme.light}
                transition-opacity
                duration-300
                group-hover:opacity-0
              `}
            />

            {/* Hover colored background */}

            <div
              className={`
                absolute
                inset-0
                ${theme.accent}
                opacity-0
                transition-opacity
                duration-300
                group-hover:opacity-100
              `}
            />

            {/* Default icon */}

            <span
              className={`
                relative
                z-10
                ${theme.text}
                transition
                duration-300
                group-hover:scale-110
                group-hover:text-white
              `}
            >
              {icon}
            </span>

          </div>

        </div>

        <p
          className={`
            break-words
            text-xl
            font-extrabold
            ${theme.text}
          `}
        >
          {value}
        </p>

        {/* =================================================
            BOTTOM HOVER LINE
        ================================================= */}

        <div
          className={`
            mt-4
            h-1
            w-16
            rounded-full
            ${theme.accent}
            transition-all
            duration-500
            group-hover:w-full
          `}
        />

      </div>

    </div>
  );
};

// =====================================================
// COURSE SECTION
// Top colored line + one ring + hover bottom line
// =====================================================

const CourseSection = ({
  title,
  subtitle,
  icon,
  color,
  children,
}) => {

  const colors = {

    maroon: {
      top:
        "bg-gradient-to-r from-[#65091c] via-[#890C25] to-[#D58A98]",

      icon:
        "bg-[#890C25]/10 text-[#890C25]",

      ring:
        "border-[#890C25]/15 bg-[#890C25]/5",

      border:
        "hover:border-[#890C25]/30",
    },

    blue: {
      top:
        "bg-gradient-to-r from-blue-800 via-blue-600 to-[#890C25]",

      icon:
        "bg-blue-100 text-blue-600",

      ring:
        "border-blue-200/60 bg-blue-500/5",

      border:
        "hover:border-blue-300",
    },

    green: {
      top:
        "bg-gradient-to-r from-green-700 via-green-500 to-[#890C25]",

      icon:
        "bg-green-100 text-green-600",

      ring:
        "border-green-200/60 bg-green-500/5",

      border:
        "hover:border-green-300",
    },

    purple: {
      top:
        "bg-gradient-to-r from-purple-700 via-purple-500 to-[#890C25]",

      icon:
        "bg-purple-100 text-purple-600",

      ring:
        "border-purple-200/60 bg-purple-500/5",

      border:
        "hover:border-purple-300",
    },
  };

  const theme =
    colors[color] || colors.blue;

  return (
    <section
      className={`
        group/section
        relative
        overflow-hidden
        rounded-3xl
        border
        border-slate-200
        bg-white
        shadow-xl
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-2xl
        ${theme.border}
      `}
    >

      {/* =================================================
          TOP COLORED LINE — CLEARLY VISIBLE
      ================================================= */}

      <div
        className={`
          absolute
          left-0
          right-0
          top-0
          z-20
          h-2
          ${theme.top}
        `}
      />

      {/* =================================================
          ONE DECORATIVE RING
      ================================================= */}

      <div
        className={`
          pointer-events-none
          absolute
          -bottom-14
          -right-14
          h-36
          w-36
          rounded-full
          border-2
          ${theme.ring}
          transition-all
          duration-500
          group-hover/section:scale-125
        `}
      />

      {/* =================================================
          HEADER
      ================================================= */}

      <div
        className="
          relative
          border-b
          border-slate-200
          bg-gradient-to-r
          from-slate-50
          via-white
          to-slate-50
          px-6
          py-6
          pt-7
        "
      >

        <div className="flex items-center gap-3">

          <div
            className={`
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-xl
              ${theme.icon}
              shadow-sm
              transition
              duration-300
              group-hover/section:scale-105
            `}
          >
            {icon}
          </div>

          <div className="min-w-0">

            <h2 className="break-words text-xl font-extrabold text-slate-800">
              {title}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {subtitle}
            </p>

          </div>

        </div>

      </div>

      {/* =================================================
          BODY
      ================================================= */}

      <div className="relative p-6">

        {children}

        {/* =================================================
            FULL WIDTH HOVER STRIP
        ================================================= */}

        <div
          className={`
            mt-5
            h-1
            w-16
            rounded-full
            ${theme.top}
            transition-all
            duration-500
            group-hover/section:w-full
          `}
        />

      </div>

    </section>
  );
};

// =====================================================
// INFO ROW
// =====================================================

const InfoRow = ({
  icon,
  label,
  value,
  color = "blue",
}) => {

  const colors = {

    maroon:
      "bg-[#890C25]/10 text-[#890C25]",

    blue:
      "bg-blue-100 text-blue-600",

    green:
      "bg-green-100 text-green-600",

    purple:
      "bg-purple-100 text-purple-600",
  };

  return (
    <div
      className="
        group/row
        flex
        items-center
        gap-3
        rounded-2xl
        border
        border-slate-100
        bg-slate-50
        p-3
        transition-all
        duration-300
        hover:border-[#890C25]/15
        hover:bg-white
        hover:shadow-sm
      "
    >

      <div
        className={`
          flex
          h-10
          w-10
          shrink-0
          items-center
          justify-center
          rounded-xl
          transition
          duration-300
          group-hover/row:scale-105
          ${colors[color] || colors.blue}
        `}
      >
        {icon}
      </div>

      <div className="min-w-0">

        <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
          {label}
        </p>

        <p className="mt-1 truncate text-sm font-black text-slate-700">
          {value || "—"}
        </p>

      </div>

    </div>
  );
};

// =====================================================
// ACTIVITY ROW
// =====================================================

const ActivityRow = ({
  label,
  value,
  color = "blue",
}) => {

  const colors = {

    maroon: "bg-[#890C25]",
    blue: "bg-blue-600",
    green: "bg-green-500",
    purple: "bg-purple-600",
  };

  return (
    <div
      className="
        group/activityrow
        relative
        flex
        items-center
        justify-between
        gap-4
        overflow-hidden
        rounded-2xl
        border
        border-slate-100
        bg-slate-50
        px-4
        py-4
        transition-all
        duration-300
        hover:border-[#890C25]/15
        hover:bg-white
        hover:shadow-sm
      "
    >

      <div
        className={`
          absolute
          bottom-0
          left-0
          h-1
          w-8
          ${colors[color] || colors.blue}
          transition-all
          duration-500
          group-hover/activityrow:w-full
        `}
      />

      <span className="text-xs font-bold text-slate-400">
        {label}
      </span>

      <span className="text-xs font-black text-slate-700">
        {value}
      </span>

    </div>
  );
};

// =====================================================
// FULL WIDTH COURSE ACCESS
// =====================================================

const CourseAccessCard = ({
  course,
}) => {

  return (
    <section
      className="
        group/access
        relative
        overflow-hidden
        rounded-3xl
        border-2
        border-[#890C25]/20
        bg-white
        shadow-xl
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-[#890C25]/30
        hover:shadow-2xl
      "
    >

      {/* =================================================
          TOP COLORED LINE
      ================================================= */}

      <div
        className="
          absolute
          left-0
          right-0
          top-0
          z-20
          h-2
          bg-gradient-to-r
          from-[#65091c]
          via-[#890C25]
          to-blue-600
        "
      />

      {/* =================================================
          ONE RING
      ================================================= */}

      <div
        className="
          pointer-events-none
          absolute
          -bottom-24
          -right-24
          h-56
          w-56
          rounded-full
          border-2
          border-[#890C25]/15
          bg-[#890C25]/5
          transition
          duration-700
          group-hover/access:scale-125
          group-hover/access:bg-[#890C25]/10
        "
      />

      {/* =================================================
          HEADER
      ================================================= */}

      <div
        className="
          relative
          border-b
          border-slate-200
          bg-slate-50
          px-6
          py-6
          pt-7
        "
      >

        <div className="flex items-center gap-3">

          <div
            className="
              h-9
              w-1.5
              rounded-full
              bg-[#890C25]
              transition-all
              duration-500
              group-hover/access:h-12
            "
          />

          <div>

            <h2 className="text-xl font-extrabold text-slate-800">
              Course Access
            </h2>

            <p className="text-sm text-slate-500">
              Course availability and access information.
            </p>

          </div>

        </div>

      </div>

      {/* =================================================
          BODY
      ================================================= */}

      <div className="relative p-6">

        <div
          className="
            relative
            overflow-hidden
            rounded-2xl
            bg-gradient-to-r
            from-[#890C25]
            to-[#6f091e]
            p-5
            shadow-lg
            transition-all
            duration-300
            group-hover/access:shadow-2xl
          "
        >

          <div
            className="
              pointer-events-none
              absolute
              -bottom-12
              -right-12
              h-36
              w-36
              rounded-full
              border
              border-white/15
              bg-white/5
              transition
              duration-500
              group-hover/access:scale-125
            "
          />

          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <p
                className="
                  text-xs
                  font-bold
                  uppercase
                  tracking-[0.2em]
                  text-[#D58A98]
                "
              >
                Current Course
              </p>

              <h3
                className="
                  mt-1
                  break-words
                  text-2xl
                  font-extrabold
                  text-white
                "
              >
                {course.title || "Course"}
              </h3>

              <p className="mt-2 text-sm text-white/65">
                {course.code || "N/A"} • Semester{" "}
                {course.semester || "—"} •{" "}
                {course.department || "Department"}
              </p>

            </div>

            <div
              className="
                rounded-2xl
                border
                border-white/20
                bg-white/10
                px-6
                py-4
                text-center
                backdrop-blur-md
                transition
                duration-300
                group-hover/access:bg-white/15
              "
            >

              <p className="text-xs font-semibold text-white/60">
                Course Status
              </p>

              <p className="mt-1 text-sm font-extrabold text-white">
                Available
              </p>

            </div>

          </div>

        </div>

        {/* FULL WIDTH HOVER LINE */}

        <div
          className="
            mt-5
            h-1
            w-16
            rounded-full
            bg-[#890C25]
            transition-all
            duration-500
            group-hover/access:w-full
          "
        />

      </div>
    </section>
  );
};

export default CourseDetails;