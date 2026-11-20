
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  FaArrowLeft,
  FaBookOpen,
  FaSave,
  FaUpload,
  FaTimes,
  FaFileAlt,
  FaUserTie,
  FaCode,
  FaBuilding,
  FaGraduationCap,
  FaInfoCircle,
  FaEdit,
} from "react-icons/fa";

import { useCourses } from "../../context/CourseContext";
import { useUsers } from "../../context/UserContext";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/api";

// =====================================================
// EDIT COURSE
// =====================================================

const EditCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { getCourse, updateCourse } = useCourses();
  const { teachers = [] } = useUsers();
  const { user } = useAuth();

  // =====================================================
  // STATE
  // =====================================================

  const [formData, setFormData] = useState({
    title: "",
    code: "",
    department: "",
    semester: "",
    teacher: "",
    description: "",
  });

  const [existingMaterial, setExistingMaterial] = useState("");
  const [selectedMaterial, setSelectedMaterial] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =====================================================
  // ROLE
  // =====================================================

  const role = user?.role
    ?.toString()
    ?.trim()
    ?.toLowerCase();

  const isAdmin =
    role === "admin" ||
    role === "superadmin";

  const isHOD = role === "hod";

  // =====================================================
  // LOAD COURSE
  // =====================================================

  useEffect(() => {
    const loadCourse = async () => {
      try {
        setLoading(true);
        setError("");

        const course = await getCourse(id);

        setFormData({
          title: course?.title || "",
          code: course?.code || "",
          department: course?.department || "",
          semester: course?.semester || "",
          teacher:
            course?.teacher?._id ||
            course?.teacher?.id ||
            "",
          description:
            course?.description || "",
        });

        setExistingMaterial(
          course?.material || ""
        );
      } catch (err) {
        console.error(
          "LOAD COURSE ERROR:",
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
  // HANDLE INPUT
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  // =====================================================
  // HANDLE MATERIAL
  // =====================================================

  const handleMaterialChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setSelectedMaterial(file);
    setError("");
    setSuccess("");
  };

  // =====================================================
  // REMOVE SELECTED MATERIAL
  // =====================================================

  const removeSelectedMaterial = () => {
    setSelectedMaterial(null);

    const fileInput =
      document.getElementById("material");

    if (fileInput) {
      fileInput.value = "";
    }
  };

  // =====================================================
  // MATERIAL URL
  // =====================================================

  const getMaterialUrl = (material) => {
    if (!material) {
      return "";
    }

    if (
      material.startsWith("http://") ||
      material.startsWith("https://")
    ) {
      return material;
    }

    const backendUrl =
      api.defaults.baseURL?.replace(
        /\/api\/?$/,
        ""
      ) || "";

    return `${backendUrl}${material}`;
  };

  const existingMaterialUrl =
    getMaterialUrl(existingMaterial);

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      // -----------------------------------------------
      // VALIDATION
      // -----------------------------------------------

      if (!formData.title.trim()) {
        setError("Course title is required");
        setSaving(false);
        return;
      }

      if (!formData.code.trim()) {
        setError("Course code is required");
        setSaving(false);
        return;
      }

      if (!formData.department.trim()) {
        setError("Department is required");
        setSaving(false);
        return;
      }

      if (!formData.semester) {
        setError("Semester is required");
        setSaving(false);
        return;
      }

      // -----------------------------------------------
      // UPDATED COURSE
      // -----------------------------------------------

      const updatedCourse = {
        title: formData.title.trim(),
        code: formData.code.trim(),
        department: formData.department.trim(),
        semester: formData.semester,
        description:
          formData.description.trim(),
        teacher: formData.teacher,
        material: selectedMaterial,
      };

      await updateCourse(
        id,
        updatedCourse
      );

      setSuccess(
        "Course updated successfully."
      );

      setTimeout(() => {
        navigate(`/courses/${id}`);
      }, 900);
    } catch (err) {
      console.error(
        "UPDATE COURSE ERROR:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
          "Failed to update course"
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // LOADING
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
  // PAGE
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
            to={`/courses/${id}`}
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
            Back to Course
          </Link>

          <div
            className="
              inline-flex
              items-center
              gap-2
              self-start
              rounded-full
              border
              border-[#890C25]/10
              bg-white
              px-4
              py-2
              text-xs
              font-bold
              text-[#890C25]
              shadow-sm
              sm:self-auto
            "
          >
            <FaEdit size={11} />
            Course Editor
          </div>
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

          {/* Decorative Circle */}

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

          {/* Decorative Circle */}

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
                    Update Learning Management System Course
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
                  EDIT MODE
                </span>

                {formData.code && (
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
                    {formData.code}
                  </span>
                )}

                {formData.semester && (
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
                    Semester {formData.semester}
                  </span>
                )}

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
                Edit Course
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70">
                Update course information, instructor,
                description and learning material.
              </p>

            </div>

            {/* Edit Badge */}

            <div
              className="
                group/editbadge
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
                  group-hover/editbadge:scale-125
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
                  <FaEdit size={24} />
                </div>

                <p
                  className="
                    mt-4
                    text-[11px]
                    font-black
                    uppercase
                    tracking-[0.2em]
                    text-blue-100/75
                  "
                >
                  Course
                </p>

                <p className="mt-1 text-3xl font-black text-white">
                  EDIT
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
                    group-hover/editbadge:w-20
                  "
                />

              </div>
            </div>

          </div>
        </div>

        {/* =================================================
            ALERTS
        ================================================= */}

        {error && (
          <div
            className="
              relative
              mb-6
              overflow-hidden
              rounded-2xl
              border
              border-red-200
              bg-white
              p-4
              shadow-lg
            "
          >
            <div
              className="
                absolute
                left-0
                top-0
                h-full
                w-1.5
                bg-red-500
              "
            />

            <div className="flex items-start gap-3 pl-2">

              <div
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-red-50
                  text-red-500
                "
              >
                <FaInfoCircle size={16} />
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-wider text-red-500">
                  Update Error
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-600">
                  {error}
                </p>
              </div>

            </div>
          </div>
        )}

        {success && (
          <div
            className="
              relative
              mb-6
              overflow-hidden
              rounded-2xl
              border
              border-green-200
              bg-white
              p-4
              shadow-lg
            "
          >
            <div
              className="
                absolute
                left-0
                top-0
                h-full
                w-1.5
                bg-green-500
              "
            />

            <div className="flex items-start gap-3 pl-2">

              <div
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-green-50
                  text-green-600
                "
              >
                <FaSave size={14} />
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-wider text-green-600">
                  Success
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-600">
                  {success}
                </p>
              </div>

            </div>
          </div>
        )}

        {/* =================================================
            FORM
        ================================================= */}

        <form onSubmit={handleSubmit}>

          {/* =================================================
              COURSE INFORMATION SECTION
          ================================================= */}

          <section
            className="
              group/section
              relative
              mb-6
              overflow-hidden
              rounded-3xl
              border
              border-slate-200
              bg-white
              shadow-xl
              transition-all
              duration-300
              hover:-translate-y-1
              hover:border-[#890C25]/30
              hover:shadow-2xl
            "
          >

            {/* Top Line */}

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
                to-[#D58A98]
              "
            />

            {/* Ring */}

            <div
              className="
                pointer-events-none
                absolute
                -bottom-14
                -right-14
                h-36
                w-36
                rounded-full
                border-2
                border-[#890C25]/15
                bg-[#890C25]/5
                transition-all
                duration-500
                group-hover/section:scale-125
              "
            />

            {/* Header */}

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
                  className="
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-[#890C25]/10
                    text-[#890C25]
                    shadow-sm
                    transition
                    duration-300
                    group-hover/section:scale-105
                  "
                >
                  <FaBookOpen size={17} />
                </div>

                <div className="min-w-0">

                  <h2 className="break-words text-xl font-extrabold text-slate-800">
                    Course Information
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Update the basic details of this course.
                  </p>

                </div>

              </div>
            </div>

            {/* Body */}

            <div className="relative p-6">

              <div className="grid gap-5 md:grid-cols-2">

                {/* =================================================
                    COURSE TITLE
                ================================================= */}

                <FormField
                  label="Course Title"
                  icon={<FaBookOpen size={13} />}
                  full
                >
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter course title"
                    className={inputClass}
                  />
                </FormField>

                {/* =================================================
                    COURSE CODE
                ================================================= */}

                <FormField
                  label="Course Code"
                  icon={<FaCode size={13} />}
                >
                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    placeholder="e.g. CS-301"
                    className={inputClass}
                  />
                </FormField>

                {/* =================================================
                    DEPARTMENT
                ================================================= */}

                <FormField
                  label="Department"
                  icon={<FaBuilding size={13} />}
                >
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    placeholder="e.g. Computer Science"
                    className={inputClass}
                  />
                </FormField>

                {/* =================================================
                    SEMESTER
                ================================================= */}

                <FormField
                  label="Semester"
                  icon={<FaGraduationCap size={13} />}
                >
                  <select
                    name="semester"
                    value={formData.semester}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="">
                      Select Semester
                    </option>

                    {Array.from(
                      { length: 8 },
                      (_, index) => index + 1
                    ).map((semester) => (
                      <option
                        key={semester}
                        value={semester}
                      >
                        Semester {semester}
                      </option>
                    ))}
                  </select>
                </FormField>

                {/* =================================================
                    TEACHER
                ================================================= */}

                {(isAdmin || isHOD) && (
                  <FormField
                    label="Teacher"
                    icon={<FaUserTie size={13} />}
                  >
                    <select
                      name="teacher"
                      value={formData.teacher}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      <option value="">
                        Select Teacher
                      </option>

                      {teachers.map((teacher) => {
                        const teacherId =
                          teacher?._id ||
                          teacher?.id;

                        return (
                          <option
                            key={teacherId}
                            value={teacherId}
                          >
                            {teacher?.name ||
                              teacher?.email ||
                              "Teacher"}
                          </option>
                        );
                      })}
                    </select>
                  </FormField>
                )}

                {/* =================================================
                    DESCRIPTION
                ================================================= */}

                <FormField
                  label="Description"
                  icon={<FaFileAlt size={13} />}
                  full
                >
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={6}
                    placeholder="Write course description..."
                    className={`${inputClass} resize-none`}
                  />
                </FormField>

              </div>

              {/* Hover Bottom Line */}

              <div
                className="
                  mt-6
                  h-1
                  w-16
                  rounded-full
                  bg-gradient-to-r
                  from-[#65091c]
                  via-[#890C25]
                  to-[#D58A98]
                  transition-all
                  duration-500
                  group-hover/section:w-full
                "
              />

            </div>
          </section>

          {/* =================================================
              COURSE MATERIAL SECTION
          ================================================= */}

          <section
            className="
              group/materialsection
              relative
              mb-6
              overflow-hidden
              rounded-3xl
              border
              border-slate-200
              bg-white
              shadow-xl
              transition-all
              duration-300
              hover:-translate-y-1
              hover:border-blue-300
              hover:shadow-2xl
            "
          >

            {/* Top Line */}

            <div
              className="
                absolute
                left-0
                right-0
                top-0
                z-20
                h-2
                bg-gradient-to-r
                from-blue-800
                via-blue-600
                to-[#890C25]
              "
            />

            {/* Ring */}

            <div
              className="
                pointer-events-none
                absolute
                -bottom-14
                -right-14
                h-36
                w-36
                rounded-full
                border-2
                border-blue-200/60
                bg-blue-500/5
                transition-all
                duration-500
                group-hover/materialsection:scale-125
              "
            />

            {/* Header */}

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
                  className="
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-blue-100
                    text-blue-600
                    shadow-sm
                    transition
                    duration-300
                    group-hover/materialsection:scale-105
                  "
                >
                  <FaFileAlt size={17} />
                </div>

                <div className="min-w-0">

                  <h2 className="break-words text-xl font-extrabold text-slate-800">
                    Course Material
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Keep the current material or upload a new file.
                  </p>

                </div>

              </div>
            </div>

            {/* Body */}

            <div className="relative p-6">

              {/* =================================================
                  EXISTING MATERIAL
              ================================================= */}

              {existingMaterial &&
                !selectedMaterial && (
                  <div
                    className="
                      group/current
                      relative
                      mb-5
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
                        -bottom-10
                        -right-10
                        h-28
                        w-28
                        rounded-full
                        border
                        border-blue-200/50
                        bg-blue-100/30
                        transition
                        duration-500
                        group-hover/current:scale-125
                      "
                    />

                    <div
                      className="
                        relative
                        flex
                        flex-col
                        gap-4
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                      "
                    >

                      <div className="flex min-w-0 items-center gap-4">

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
                          "
                        >
                          <FaFileAlt size={20} />
                        </div>

                        <div className="min-w-0">

                          <p className="text-xs font-bold uppercase tracking-wider text-blue-500">
                            Current Material
                          </p>

                          <h3 className="mt-1 truncate text-base font-extrabold text-slate-800">
                            Course Learning File
                          </h3>

                          <div className="mt-2 flex items-center gap-2">

                            <span className="h-2 w-2 rounded-full bg-green-500" />

                            <span className="text-xs font-bold text-green-600">
                              Currently Available
                            </span>

                          </div>

                        </div>

                      </div>

                      {existingMaterialUrl && (
                        <a
                          href={existingMaterialUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="
                            inline-flex
                            items-center
                            justify-center
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
                          <FaFileAlt size={11} />
                          View Material
                        </a>
                      )}

                    </div>
                  </div>
                )}

              {/* =================================================
                  NEW MATERIAL
              ================================================= */}

              {selectedMaterial && (
                <div
                  className="
                    mb-5
                    flex
                    items-center
                    justify-between
                    rounded-2xl
                    border
                    border-green-200
                    bg-green-50
                    p-5
                  "
                >

                  <div className="flex min-w-0 items-center gap-4">

                    <div
                      className="
                        flex
                        h-14
                        w-14
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        bg-green-500
                        text-white
                        shadow-lg
                      "
                    >
                      <FaFileAlt size={20} />
                    </div>

                    <div className="min-w-0">

                      <p className="text-xs font-bold uppercase tracking-wider text-green-600">
                        New Material
                      </p>

                      <p className="mt-1 truncate text-sm font-extrabold text-slate-700">
                        {selectedMaterial.name}
                      </p>

                      <p className="mt-1 text-xs text-green-600">
                        Ready to upload
                      </p>

                    </div>

                  </div>

                  <button
                    type="button"
                    onClick={
                      removeSelectedMaterial
                    }
                    className="
                      ml-3
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      bg-white
                      text-red-500
                      shadow-sm
                      transition
                      hover:bg-red-50
                    "
                    title="Remove selected file"
                  >
                    <FaTimes size={13} />
                  </button>

                </div>
              )}

              {/* =================================================
                  UPLOAD BOX
              ================================================= */}

              <label
                htmlFor="material"
                className="
                  group/upload
                  relative
                  flex
                  cursor-pointer
                  flex-col
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-2xl
                  border-2
                  border-dashed
                  border-slate-200
                  bg-gradient-to-br
                  from-slate-50
                  via-white
                  to-blue-50
                  px-6
                  py-10
                  text-center
                  transition
                  duration-300
                  hover:border-blue-300
                  hover:bg-blue-50
                "
              >

                {/* Decorative Circle */}

                <div
                  className="
                    pointer-events-none
                    absolute
                    -bottom-16
                    -right-16
                    h-40
                    w-40
                    rounded-full
                    border-2
                    border-blue-200/40
                    bg-blue-100/20
                    transition
                    duration-500
                    group-hover/upload:scale-125
                  "
                />

                <div
                  className="
                    relative
                    flex
                    h-16
                    w-16
                    items-center
                    justify-center
                    rounded-2xl
                    bg-blue-100
                    text-blue-600
                    shadow-sm
                    transition
                    duration-300
                    group-hover/upload:bg-blue-600
                    group-hover/upload:text-white
                    group-hover/upload:shadow-lg
                  "
                >
                  <FaUpload size={21} />
                </div>

                <p className="relative mt-5 text-base font-extrabold text-slate-700">
                  {selectedMaterial
                    ? "Choose another file"
                    : "Upload new material"}
                </p>

                <p className="relative mt-2 max-w-md text-xs leading-5 text-slate-400">
                  Leave this empty if you want to keep
                  the current course material.
                </p>

                <span
                  className="
                    relative
                    mt-4
                    rounded-full
                    border
                    border-blue-100
                    bg-white
                    px-4
                    py-2
                    text-[10px]
                    font-black
                    uppercase
                    tracking-wider
                    text-blue-500
                    shadow-sm
                  "
                >
                  Select File
                </span>

                <input
                  id="material"
                  type="file"
                  onChange={
                    handleMaterialChange
                  }
                  className="hidden"
                />

              </label>

              {/* Bottom Line */}

              <div
                className="
                  mt-6
                  h-1
                  w-16
                  rounded-full
                  bg-gradient-to-r
                  from-blue-800
                  via-blue-600
                  to-[#890C25]
                  transition-all
                  duration-500
                  group-hover/materialsection:w-full
                "
              />

            </div>
          </section>

          {/* =================================================
              ACTIONS
          ================================================= */}

          <div
            className="
              relative
              overflow-hidden
              rounded-3xl
              border
              border-slate-200
              bg-white
              p-5
              shadow-xl
              sm:p-6
            "
          >

            <div
              className="
                absolute
                left-0
                right-0
                top-0
                h-1.5
                bg-gradient-to-r
                from-[#65091c]
                via-[#890C25]
                to-blue-600
              "
            />

            <div
              className="
                flex
                flex-col-reverse
                gap-3
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >

              <Link
                to={`/courses/${id}`}
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  border-slate-200
                  bg-slate-50
                  px-6
                  py-3
                  text-sm
                  font-bold
                  text-slate-600
                  shadow-sm
                  transition
                  hover:bg-slate-100
                  hover:text-slate-800
                "
              >
                <FaTimes size={12} />
                Cancel
              </Link>

              <button
                type="submit"
                disabled={saving}
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-[#890C25]
                  px-7
                  py-3
                  text-sm
                  font-bold
                  text-white
                  shadow-lg
                  shadow-[#890C25]/20
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:bg-[#6f091e]
                  hover:shadow-xl
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {saving ? (
                  <>
                    <div
                      className="
                        h-4
                        w-4
                        animate-spin
                        rounded-full
                        border-2
                        border-white/40
                        border-t-white
                      "
                    />
                    Updating...
                  </>
                ) : (
                  <>
                    <FaSave size={13} />
                    Update Course
                  </>
                )}
              </button>

            </div>
          </div>

        </form>
      </div>
    </div>
  );
};

// =====================================================
// FORM FIELD
// =====================================================

const FormField = ({
  label,
  icon,
  children,
  full = false,
}) => {
  return (
    <div
      className={
        full ? "md:col-span-2" : ""
      }
    >
      <label
        className="
          mb-2
          flex
          items-center
          gap-2
          text-sm
          font-bold
          text-slate-700
        "
      >
        <span className="text-[#890C25]">
          {icon}
        </span>

        {label}
      </label>

      {children}
    </div>
  );
};

// =====================================================
// INPUT CLASS
// =====================================================

const inputClass = `
  w-full
  rounded-xl
  border
  border-slate-200
  bg-white
  px-4
  py-3.5
  text-sm
  font-medium
  text-slate-700
  outline-none
  transition-all
  duration-300
  placeholder:text-slate-400
  hover:border-slate-300
  focus:border-[#890C25]
  focus:ring-4
  focus:ring-[#890C25]/10
`;

export default EditCourse;

