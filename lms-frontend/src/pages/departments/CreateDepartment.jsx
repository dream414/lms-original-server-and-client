
import { useState } from "react";
import {
  FaArrowLeft,
  FaBuilding,
  FaSave,
  FaTimes,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useDepartments } from "../../context/DepartmentContext";

const CreateDepartment = () => {
  const navigate = useNavigate();

  const { createDepartment, loading, error } =
    useDepartments();

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
  });

  const [success, setSuccess] = useState("");

  // =====================================================
  // CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccess("");

    if (!formData.name.trim()) {
      return;
    }

    try {
      await createDepartment({
        name: formData.name.trim(),
        code: formData.code.trim(),
        description: formData.description.trim(),
      });

      setSuccess(
        "Department created successfully."
      );

      setTimeout(() => {
        navigate("/departments");
      }, 700);
    } catch (err) {
      console.error(
        "CREATE DEPARTMENT PAGE ERROR:",
        err
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">

        {/* =================================================
            BACK
        ================================================= */}

        <Link
          to="/departments"
          className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-[#890C25]"
        >
          <FaArrowLeft size={12} />
          Back to Departments
        </Link>

        {/* =================================================
            CARD
        ================================================= */}

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">

          {/* HEADER */}

          <div className="relative overflow-hidden bg-[#890C25] px-6 py-8 sm:px-8">
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full border border-white/20 bg-white/5" />

            <div className="relative flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-white shadow-lg">
                <FaBuilding size={23} />
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#D58A98]">
                  Academic Management
                </p>

                <h1 className="mt-1 text-3xl font-black text-white">
                  Create Department
                </h1>

                <p className="mt-2 text-sm text-white/70">
                  Add a new academic department to the LMS.
                </p>
              </div>
            </div>
          </div>

          {/* FORM */}

          <form
            onSubmit={handleSubmit}
            className="p-6 sm:p-8"
          >
            {error && (
              <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-5 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-semibold text-green-600">
                {success}
              </div>
            )}

            <div className="grid gap-6 md:grid-cols-2">

              {/* NAME */}

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700">
                  <FaBuilding
                    size={13}
                    className="text-[#890C25]"
                  />
                  Department Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Computer Science"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-medium text-slate-700 outline-none transition focus:border-[#890C25] focus:ring-4 focus:ring-[#890C25]/10"
                />
              </div>

              {/* CODE */}

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Department Code
                </label>

                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  placeholder="e.g. CS"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-medium text-slate-700 outline-none transition focus:border-[#890C25] focus:ring-4 focus:ring-[#890C25]/10"
                />
              </div>

              {/* DESCRIPTION */}

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Write department description..."
                  className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-medium text-slate-700 outline-none transition focus:border-[#890C25] focus:ring-4 focus:ring-[#890C25]/10"
                />
              </div>
            </div>

            {/* ACTIONS */}

            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">

              <Link
                to="/departments"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-6 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-100"
              >
                <FaTimes size={12} />
                Cancel
              </Link>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#890C25] px-7 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-[#6f091e] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Creating...
                  </>
                ) : (
                  <>
                    <FaSave size={13} />
                    Create Department
                  </>
                )}
              </button>

            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateDepartment;

