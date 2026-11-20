import { useEffect, useMemo, useState } from "react";

import {
  FaBuilding,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaTimes,
  FaSave,
  FaCode,
  FaFileAlt,
  FaToggleOn,
  FaToggleOff,
  FaInfoCircle,
} from "react-icons/fa";

import { useDepartments } from "../../context/DepartmentContext";
import { useAuth } from "../../context/AuthContext";

// =====================================================
// DEPARTMENTS
// =====================================================

const Departments = () => {
  const {
    departments = [],
    loading,
    error,
    getDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    clearError,
  } = useDepartments();

  const { user } = useAuth();

  // ===================================================
  // STATE
  // ===================================================

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [editingDepartment, setEditingDepartment] =
    useState(null);

  const [saving, setSaving] = useState(false);

  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    status: "Active",
  });

  // ===================================================
  // ROLE
  // ===================================================

  const role = user?.role
    ?.toString()
    ?.trim()
    ?.toLowerCase();

  const canManage =
    role === "superadmin" ||
    role === "admin" ||
    role === "hod";

  // ===================================================
  // LOAD
  // ===================================================

  useEffect(() => {
    getDepartments();
  }, [getDepartments]);

  // ===================================================
  // CLEAR SUCCESS MESSAGE
  // ===================================================

  useEffect(() => {
    if (!success) return;

    const timer = setTimeout(() => {
      setSuccess("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [success]);

  // ===================================================
  // FORM CHANGE
  // ===================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    clearError?.();
    setSuccess("");
  };

  // ===================================================
  // OPEN CREATE MODAL
  // ===================================================

  const openCreateModal = () => {
    setEditingDepartment(null);

    setFormData({
      name: "",
      code: "",
      description: "",
      status: "Active",
    });

    clearError?.();
    setSuccess("");
    setShowModal(true);
  };

  // ===================================================
  // OPEN EDIT MODAL
  // ===================================================

  const openEditModal = (department) => {
    setEditingDepartment(department);

    setFormData({
      name: department?.name || "",
      code: department?.code || "",
      description: department?.description || "",
      status: department?.status || "Active",
    });

    clearError?.();
    setSuccess("");
    setShowModal(true);
  };

  // ===================================================
  // CLOSE MODAL
  // ===================================================

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditingDepartment(null);

    setFormData({
      name: "",
      code: "",
      description: "",
      status: "Active",
    });

    clearError?.();
  };

  // ===================================================
  // SUBMIT
  // ===================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      return;
    }

    if (!formData.code.trim()) {
      return;
    }

    try {
      setSaving(true);
      clearError?.();
      setSuccess("");

      const data = {
        name: formData.name.trim(),
        code: formData.code.trim().toUpperCase(),
        description: formData.description.trim(),
        status: formData.status,
      };

      if (editingDepartment) {
        await updateDepartment(
          editingDepartment._id,
          data
        );

        setSuccess(
          "Department updated successfully."
        );
      } else {
        await createDepartment(data);

        setSuccess(
          "Department created successfully."
        );
      }

      setShowModal(false);
      setEditingDepartment(null);

      setFormData({
        name: "",
        code: "",
        description: "",
        status: "Active",
      });

      await getDepartments();
    } catch (err) {
      console.error(
        "DEPARTMENT SAVE ERROR:",
        err.response?.data || err.message
      );
    } finally {
      setSaving(false);
    }
  };

  // ===================================================
  // DELETE
  // ===================================================

  const handleDelete = async (department) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${department?.name}"?`
    );

    if (!confirmed) return;

    try {
      clearError?.();
      setSuccess("");

      await deleteDepartment(department._id);

      setSuccess(
        "Department deleted successfully."
      );
    } catch (err) {
      console.error(
        "DELETE DEPARTMENT ERROR:",
        err.response?.data || err.message
      );
    }
  };

  // ===================================================
  // FILTER
  // ===================================================

  const filteredDepartments = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return departments;

    return departments.filter((department) => {
      return (
        department?.name
          ?.toLowerCase()
          .includes(query) ||
        department?.code
          ?.toLowerCase()
          .includes(query) ||
        department?.description
          ?.toLowerCase()
          .includes(query) ||
        department?.status
          ?.toLowerCase()
          .includes(query)
      );
    });
  }, [departments, search]);

  // ===================================================
  // STATS
  // ===================================================

  const totalDepartments = departments.length;

  const activeDepartments = departments.filter(
    (department) =>
      department?.status === "Active"
  ).length;

  const inactiveDepartments = departments.filter(
    (department) =>
      department?.status === "Inactive"
  ).length;

  // ===================================================
  // LOADING
  // ===================================================

  if (loading && departments.length === 0) {
    return (
      <div className="min-h-screen bg-slate-100 px-4 py-10 sm:px-6 lg:px-8">

        <div className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center">

          <div className="text-center">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-white shadow-xl">

              <div className="h-9 w-9 animate-spin rounded-full border-4 border-[#890C25]/20 border-t-[#890C25]" />

            </div>

            <h3 className="mt-5 text-xl font-black text-slate-800">
              Loading Departments
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Fetching department information...
            </p>

          </div>

        </div>

      </div>
    );
  }

  // ===================================================
  // PAGE
  // ===================================================

  return (
    <div className="min-h-screen bg-slate-100 px-4 pb-12 pt-8 sm:px-6 sm:pt-10 lg:px-8 lg:pt-12">

      <div className="mx-auto max-w-7xl">

        {/* =================================================
            HERO
        ================================================= */}

        <div className="group relative mb-6 overflow-hidden rounded-3xl bg-[#890C25] shadow-2xl">

          {/* Decorative Circle 1 */}

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

          {/* Decorative Circle 2 */}

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

          {/* Decorative Glow */}

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

          {/* Hero Content */}

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

              {/* Icon + Label */}

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
                  <FaBuilding size={24} />
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

                  <p className="mt-1 text-xs text-white/60">
                    Organize your institution departments
                  </p>

                </div>

              </div>

              {/* Heading */}

              <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
                Departments
              </h1>

              <p
                className="
                  mt-3
                  max-w-2xl
                  text-sm
                  leading-6
                  text-white/70
                "
              >
                Create, manage and organize academic
                departments for your Learning Management
                System.
              </p>

            </div>

            {/* Create Button */}

            {canManage && (
              <button
                type="button"
                onClick={openCreateModal}
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-2xl
                  bg-blue-700
                  px-6
                  py-4
                  text-sm
                  font-extrabold
                  text-white
                  shadow-xl
                  shadow-blue-950/30
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:bg-blue-600
                  hover:shadow-2xl
                "
              >
                <FaPlus size={13} />
                Create Department
              </button>
            )}

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
              rounded-3xl
              border
              border-red-200
              bg-white
              p-5
              shadow-xl
            "
          >

            <div className="absolute left-0 top-0 h-full w-1.5 bg-red-500" />

            <div className="flex items-start gap-4 pl-2">

              <div
                className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-red-50
                  text-red-500
                "
              >
                <FaInfoCircle size={17} />
              </div>

              <div>

                <p
                  className="
                    text-xs
                    font-black
                    uppercase
                    tracking-wider
                    text-red-500
                  "
                >
                  Error
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
              rounded-3xl
              border
              border-green-200
              bg-white
              p-5
              shadow-xl
            "
          >

            <div className="absolute left-0 top-0 h-full w-1.5 bg-green-500" />

            <div className="flex items-start gap-4 pl-2">

              <div
                className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-green-50
                  text-green-600
                "
              >
                <FaSave size={15} />
              </div>

              <div>

                <p
                  className="
                    text-xs
                    font-black
                    uppercase
                    tracking-wider
                    text-green-600
                  "
                >
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
            STATISTICS
        ================================================= */}

        <div className="mb-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

          <StatCard
            icon={<FaBuilding />}
            label="Total Departments"
            value={totalDepartments}
            iconClass="bg-[#890C25]/10 text-[#890C25]"
            accentClass="bg-[#890C25]"
          />

          <StatCard
            icon={<FaToggleOn />}
            label="Active Departments"
            value={activeDepartments}
            iconClass="bg-green-100 text-green-600"
            accentClass="bg-green-500"
          />

          <StatCard
            icon={<FaToggleOff />}
            label="Inactive Departments"
            value={inactiveDepartments}
            iconClass="bg-slate-100 text-slate-500"
            accentClass="bg-slate-400"
          />

        </div>

        {/* =================================================
            DEPARTMENT LIST
        ================================================= */}

        <section
          className="
            relative
            overflow-hidden
            rounded-3xl
            border-2
            border-[#890C25]/20
            bg-white
            shadow-xl
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
              border-[#890C25]/10
              bg-[#890C25]/[0.025]
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              -bottom-28
              left-1/4
              h-64
              w-64
              rounded-full
              border
              border-[#890C25]/10
              bg-[#890C25]/[0.025]
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
              bg-gradient-to-r
              from-slate-50
              via-white
              to-[#D58A98]/5
              p-5
              sm:p-6
            "
          >

            <div
              className="
                flex
                flex-col
                gap-5
                lg:flex-row
                lg:items-center
                lg:justify-between
              "
            >

              {/* Title */}

              <div className="flex items-center gap-4">

                <div
                  className="
                    flex
                    h-12
                    w-12
                    shrink-0
                    items-center
                    justify-center
                    rounded-2xl
                    bg-[#890C25]
                    text-white
                    shadow-lg
                    shadow-[#890C25]/20
                  "
                >
                  <FaBuilding size={20} />
                </div>

                <div>

                  <h2 className="text-xl font-extrabold text-slate-800">
                    Department List
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Manage all academic departments.
                  </p>

                </div>

              </div>

              {/* Search */}

              <div className="relative w-full lg:max-w-sm">

                <FaSearch
                  className="
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                  "
                  size={13}
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search departments..."
                  className="
                    w-full
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    py-3.5
                    pl-11
                    pr-11
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
                  "
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="
                      absolute
                      right-3
                      top-1/2
                      flex
                      h-7
                      w-7
                      -translate-y-1/2
                      items-center
                      justify-center
                      rounded-lg
                      text-slate-400
                      transition
                      hover:bg-red-50
                      hover:text-red-500
                    "
                  >
                    <FaTimes size={12} />
                  </button>
                )}

              </div>

            </div>

          </div>

          {/* =================================================
              EMPTY STATE
          ================================================= */}

          {filteredDepartments.length === 0 ? (
            <div className="relative px-6 py-20 text-center">

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
                  shadow-inner
                "
              >
                <FaBuilding size={28} />
              </div>

              <h3 className="mt-6 text-xl font-extrabold text-slate-800">

                {search
                  ? "No Departments Found"
                  : "No Departments Yet"}

              </h3>

              <p
                className="
                  mx-auto
                  mt-2
                  max-w-md
                  text-sm
                  leading-6
                  text-slate-500
                "
              >
                {search
                  ? "Try changing your search keyword."
                  : "Create your first department to get started."}
              </p>

              {!search && canManage && (
                <button
                  type="button"
                  onClick={openCreateModal}
                  className="
                    mt-6
                    inline-flex
                    items-center
                    gap-2
                    rounded-2xl
                    bg-[#890C25]
                    px-6
                    py-3.5
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
                  "
                >
                  <FaPlus size={12} />
                  Create Department
                </button>
              )}

            </div>
          ) : (

            /* =================================================
               TABLE
            ================================================= */

            <div className="relative overflow-x-auto">

              <table className="w-full min-w-[800px]">

                <thead>

                  <tr
                    className="
                      border-b
                      border-slate-200
                      bg-slate-50/80
                      text-left
                    "
                  >

                    <th className={tableHeadClass}>
                      Department
                    </th>

                    <th className={tableHeadClass}>
                      Code
                    </th>

                    <th className={tableHeadClass}>
                      Description
                    </th>

                    <th className={tableHeadClass}>
                      Status
                    </th>

                    {canManage && (
                      <th
                        className="
                          px-6
                          py-4
                          text-right
                          text-xs
                          font-black
                          uppercase
                          tracking-wider
                          text-slate-500
                        "
                      >
                        Actions
                      </th>
                    )}

                  </tr>

                </thead>

                <tbody>

                  {filteredDepartments.map(
                    (department) => (
                      <tr
                        key={department._id}
                        className="
                          group
                          border-b
                          border-slate-100
                          transition-all
                          duration-300
                          hover:bg-[#890C25]/[0.025]
                        "
                      >

                        {/* DEPARTMENT */}

                        <td className="px-6 py-5">

                          <div className="flex items-center gap-3">

                            <div
                              className="
                                flex
                                h-12
                                w-12
                                shrink-0
                                items-center
                                justify-center
                                rounded-2xl
                                bg-[#890C25]/10
                                text-[#890C25]
                                transition-all
                                duration-300
                                group-hover:scale-105
                                group-hover:bg-[#890C25]
                                group-hover:text-white
                              "
                            >
                              <FaBuilding size={17} />
                            </div>

                            <div className="min-w-0">

                              <p
                                className="
                                  truncate
                                  text-sm
                                  font-extrabold
                                  text-slate-800
                                "
                              >
                                {department.name}
                              </p>

                              <p
                                className="
                                  mt-1
                                  text-xs
                                  font-medium
                                  text-slate-400
                                "
                              >
                                Academic Department
                              </p>

                            </div>

                          </div>

                        </td>

                        {/* CODE */}

                        <td className="px-6 py-5">

                          <span
                            className="
                              inline-flex
                              items-center
                              gap-2
                              rounded-xl
                              border
                              border-blue-100
                              bg-blue-50
                              px-3
                              py-2
                              text-xs
                              font-black
                              text-blue-600
                            "
                          >
                            <FaCode size={10} />
                            {department.code}
                          </span>

                        </td>

                        {/* DESCRIPTION */}

                        <td className="max-w-sm px-6 py-5">

                          <div
                            className="
                              flex
                              items-start
                              gap-2
                              text-sm
                              leading-6
                              text-slate-500
                            "
                          >

                            <FaFileAlt
                              className="
                                mt-1
                                shrink-0
                                text-[#D58A98]
                              "
                              size={12}
                            />

                            <span className="line-clamp-2">

                              {department.description ||
                                "No description provided."}

                            </span>

                          </div>

                        </td>

                        {/* STATUS */}

                        <td className="px-6 py-5">

                          {department.status ===
                          "Active" ? (

                            <span
                              className="
                                inline-flex
                                items-center
                                gap-2
                                rounded-full
                                bg-green-50
                                px-4
                                py-2
                                text-xs
                                font-bold
                                text-green-600
                              "
                            >

                              <span className="h-2.5 w-2.5 rounded-full bg-green-500" />

                              Active

                            </span>

                          ) : (

                            <span
                              className="
                                inline-flex
                                items-center
                                gap-2
                                rounded-full
                                bg-slate-100
                                px-4
                                py-2
                                text-xs
                                font-bold
                                text-slate-500
                              "
                            >

                              <span className="h-2.5 w-2.5 rounded-full bg-slate-400" />

                              Inactive

                            </span>

                          )}

                        </td>

                        {/* ACTIONS */}

                        {canManage && (

                          <td className="px-6 py-5">

                            <div className="flex justify-end gap-2">

                              {/* EDIT */}

                              <button
                                type="button"
                                onClick={() =>
                                  openEditModal(
                                    department
                                  )
                                }
                                className="
                                  flex
                                  h-10
                                  w-10
                                  items-center
                                  justify-center
                                  rounded-xl
                                  bg-blue-50
                                  text-blue-600
                                  shadow-sm
                                  transition-all
                                  duration-300
                                  hover:-translate-y-0.5
                                  hover:bg-blue-600
                                  hover:text-white
                                  hover:shadow-lg
                                "
                                title="Edit Department"
                              >
                                <FaEdit size={13} />
                              </button>

                              {/* DELETE */}

                              <button
                                type="button"
                                onClick={() =>
                                  handleDelete(
                                    department
                                  )
                                }
                                className="
                                  flex
                                  h-10
                                  w-10
                                  items-center
                                  justify-center
                                  rounded-xl
                                  bg-red-50
                                  text-red-500
                                  shadow-sm
                                  transition-all
                                  duration-300
                                  hover:-translate-y-0.5
                                  hover:bg-red-500
                                  hover:text-white
                                  hover:shadow-lg
                                "
                                title="Delete Department"
                              >
                                <FaTrash size={12} />
                              </button>

                            </div>

                          </td>

                        )}

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>
          )}

        </section>

      </div>

      {/* =================================================
          CREATE / EDIT MODAL
      ================================================= */}

      {showModal && (

        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            overflow-y-auto
            bg-slate-950/50
            p-4
            backdrop-blur-sm
          "
        >

          <div
            className="
              relative
              my-8
              w-full
              max-w-2xl
              overflow-hidden
              rounded-3xl
              border
              border-white/20
              bg-white
              shadow-2xl
            "
          >

            {/* =================================================
                MODAL HEADER
            ================================================= */}

            <div
              className="
                relative
                overflow-hidden
                bg-[#890C25]
                px-6
                py-6
                sm:px-8
              "
            >

              {/* Decorative Circle */}

              <div
                className="
                  pointer-events-none
                  absolute
                  -right-10
                  -top-10
                  h-40
                  w-40
                  rounded-full
                  border
                  border-white/20
                  bg-white/5
                "
              />

              <div
                className="
                  pointer-events-none
                  absolute
                  -bottom-16
                  left-1/2
                  h-32
                  w-32
                  rounded-full
                  bg-[#D58A98]/10
                  blur-2xl
                "
              />

              <div
                className="
                  relative
                  flex
                  items-center
                  justify-between
                "
              >

                <div className="flex items-center gap-3">

                  <div
                    className="
                      flex
                      h-12
                      w-12
                      items-center
                      justify-center
                      rounded-2xl
                      border
                      border-white/20
                      bg-white/10
                      text-white
                      shadow-lg
                      backdrop-blur-md
                    "
                  >
                    {editingDepartment ? (
                      <FaEdit size={18} />
                    ) : (
                      <FaBuilding size={18} />
                    )}
                  </div>

                  <div>

                    <h2 className="text-xl font-extrabold text-white">

                      {editingDepartment
                        ? "Edit Department"
                        : "Create Department"}

                    </h2>

                    <p className="mt-1 text-xs text-white/60">

                      {editingDepartment
                        ? "Update department information."
                        : "Add a new academic department."}

                    </p>

                  </div>

                </div>

                {/* CLOSE */}

                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-white/10
                    bg-white/10
                    text-white
                    transition-all
                    duration-300
                    hover:bg-white/20
                    hover:scale-105
                    disabled:opacity-50
                  "
                >
                  <FaTimes size={14} />
                </button>

              </div>

            </div>

            {/* =================================================
                FORM
            ================================================= */}

            <form
              onSubmit={handleSubmit}
              className="p-6 sm:p-8"
            >

              <div className="grid gap-5 sm:grid-cols-2">

                {/* NAME */}

                <FormField
                  label="Department Name"
                  icon={<FaBuilding size={12} />}
                >

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Computer Science"
                    className={inputClass}
                  />

                </FormField>

                {/* CODE */}

                <FormField
                  label="Department Code"
                  icon={<FaCode size={12} />}
                >

                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    placeholder="e.g. CS"
                    maxLength={20}
                    className={inputClass}
                  />

                </FormField>

                {/* DESCRIPTION */}

                <FormField
                  label="Description"
                  icon={<FaFileAlt size={12} />}
                  full
                >

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Write department description..."
                    className={`${inputClass} resize-none`}
                  />

                </FormField>

                {/* STATUS */}

                <FormField
                  label="Status"
                  icon={<FaToggleOn size={14} />}
                >

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className={inputClass}
                  >

                    <option value="Active">
                      Active
                    </option>

                    <option value="Inactive">
                      Inactive
                    </option>

                  </select>

                </FormField>

              </div>

              {/* =================================================
                  FORM ACTIONS
              ================================================= */}

              <div
                className="
                  mt-8
                  flex
                  flex-col-reverse
                  gap-3
                  sm:flex-row
                  sm:justify-end
                "
              >

                {/* CANCEL */}

                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
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
                    transition-all
                    duration-300
                    hover:bg-slate-100
                    hover:-translate-y-0.5
                    disabled:opacity-50
                  "
                >
                  <FaTimes size={11} />
                  Cancel
                </button>

                {/* SAVE */}

                <button
                  type="submit"
                  disabled={
                    saving ||
                    !formData.name.trim() ||
                    !formData.code.trim()
                  }
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
                    disabled:opacity-50
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

                      Saving...
                    </>
                  ) : (
                    <>
                      <FaSave size={12} />

                      {editingDepartment
                        ? "Update Department"
                        : "Create Department"}
                    </>
                  )}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
};

// =====================================================
// STAT CARD
// =====================================================

const StatCard = ({
  icon,
  label,
  value,
  iconClass,
  accentClass,
}) => {
  return (
    <div
      className="
        group
        relative
        overflow-hidden
        rounded-3xl
        border
        border-slate-200
        bg-white
        p-5
        shadow-lg
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-2xl
      "
    >

      {/* Top Accent */}

      <div
        className={`
          absolute
          left-0
          top-0
          h-1.5
          w-20
          rounded-br-full
          ${accentClass}
        `}
      />

      {/* Decorative Circle */}

      <div
        className="
          pointer-events-none
          absolute
          -right-10
          -top-10
          h-24
          w-24
          rounded-full
          bg-slate-100
          transition
          duration-300
          group-hover:scale-125
        "
      />

      <div className="relative flex items-center gap-4">

        <div
          className={`
            flex
            h-14
            w-14
            shrink-0
            items-center
            justify-center
            rounded-2xl
            text-xl
            shadow-sm
            transition
            duration-300
            group-hover:scale-105
            ${iconClass}
          `}
        >
          {icon}
        </div>

        <div className="min-w-0">

          <p
            className="
              text-xs
              font-bold
              uppercase
              tracking-wider
              text-slate-400
            "
          >
            {label}
          </p>

          <p
            className="
              mt-1
              text-3xl
              font-black
              text-slate-800
            "
          >
            {value}
          </p>

        </div>

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
    <div className={full ? "sm:col-span-2" : ""}>

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
  rounded-2xl
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

// =====================================================
// TABLE HEAD CLASS
// =====================================================

const tableHeadClass = `
  px-6
  py-4
  text-xs
  font-black
  uppercase
  tracking-wider
  text-slate-500
`;

// =====================================================
// EXPORT
// =====================================================

export default Departments;