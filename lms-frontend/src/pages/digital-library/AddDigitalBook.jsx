import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  FaBook,
  FaBookOpen,
  FaCloudUploadAlt,
  FaImage,
  FaFilePdf,
  FaArrowLeft,
  FaSave,
  FaTimes,
  FaInfoCircle,
} from "react-icons/fa";

import { useDigitalBooks } from "../../context/DigitalBookContext";

const AddDigitalBook = () => {
  const navigate = useNavigate();

  const { createDigitalBook, loading, error, clearError } =
    useDigitalBooks();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [isbn, setIsbn] = useState("");
  const [publisher, setPublisher] = useState("");
  const [publicationYear, setPublicationYear] =
    useState("");
  const [language, setLanguage] = useState("English");

  const [coverImage, setCoverImage] = useState(null);
  const [digitalFile, setDigitalFile] = useState(null);

  const [coverPreview, setCoverPreview] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  const handleCoverChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setCoverImage(file);

    const previewUrl =
      URL.createObjectURL(file);

    setCoverPreview(previewUrl);
  };

  const handleDigitalFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setDigitalFile(file);
  };

  const removeCover = () => {
    setCoverImage(null);
    setCoverPreview("");

    const input =
      document.getElementById("coverImage");

    if (input) {
      input.value = "";
    }
  };

  const removeDigitalFile = () => {
    setDigitalFile(null);

    const input =
      document.getElementById("digitalFile");

    if (input) {
      input.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    clearError();
    setSuccessMessage("");

    if (!title.trim()) {
      return;
    }

    if (!author.trim()) {
      return;
    }

    if (!category.trim()) {
      return;
    }

    if (!digitalFile) {
      return;
    }

    const formData = new FormData();

    formData.append("title", title);
    formData.append("author", author);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("isbn", isbn);
    formData.append("publisher", publisher);
    formData.append(
      "publicationYear",
      publicationYear
    );
    formData.append("language", language);

    if (coverImage) {
      formData.append(
        "coverImage",
        coverImage
      );
    }

    formData.append(
      "digitalFile",
      digitalFile
    );

    const result =
      await createDigitalBook(formData);

    if (result) {
      setSuccessMessage(
        "Digital book added successfully."
      );

      setTimeout(() => {
        navigate("/digital-library/books");
      }, 1200);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 relative overflow-hidden">

      {/* ================================= */}
      {/* BACKGROUND DECORATION */}
      {/* ================================= */}

      <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#890C25]/10 blur-3xl pointer-events-none animate-pulse" />

      <div className="absolute top-[45%] -left-32 w-80 h-80 rounded-full bg-[#D58A98]/10 blur-3xl pointer-events-none animate-pulse" />

      <div className="absolute bottom-0 right-[20%] w-72 h-72 rounded-full bg-blue-500/5 blur-3xl pointer-events-none animate-pulse" />

      <div className="relative z-10 p-4 sm:p-6 lg:p-8">

        {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}

        <div className="mb-7 mt-5">

          <Link
            to="/digital-library/books"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#890C25] hover:text-[#6f091e] mb-5 transition"
          >
            <FaArrowLeft />
            Back to Digital Books
          </Link>

          <div className="flex items-center gap-3">

            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#890C25] to-[#5f0719] flex items-center justify-center shadow-lg shadow-[#890C25]/20">
              <FaBookOpen className="text-white text-xl" />
            </div>

            <div>

              <p className="text-sm font-semibold text-[#890C25] uppercase tracking-wider">
                Digital Library
              </p>

              <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
                Add Digital Book
              </h1>

            </div>

          </div>

          <p className="text-slate-500 mt-3 max-w-2xl">
            Add a new digital resource to your LMS
            library by providing its details and
            uploading the digital file.
          </p>

        </div>

        {/* ================================= */}
        {/* ERROR */}
        {/* ================================= */}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-between gap-4">

            <div className="flex items-center gap-3">

              <div className="w-9 h-9 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-bold">
                !
              </div>

              <p className="text-sm text-red-700">
                {error}
              </p>

            </div>

            <button
              type="button"
              onClick={clearError}
              className="text-red-500 hover:text-red-700"
            >
              <FaTimes />
            </button>

          </div>
        )}

        {/* ================================= */}
        {/* SUCCESS */}
        {/* ================================= */}

        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">

            <div className="w-9 h-9 rounded-lg bg-green-100 text-green-600 flex items-center justify-center">
              ✓
            </div>

            <p className="text-sm font-semibold text-green-700">
              {successMessage}
            </p>

          </div>
        )}

        {/* ================================= */}
        {/* FORM */}
        {/* ================================= */}

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 xl:grid-cols-3 gap-6"
        >

          {/* ================================= */}
          {/* BOOK INFORMATION */}
          {/* ================================= */}

          <div className="relative group xl:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

            {/* Animated Top Line */}
            <div className="absolute top-0 left-0 h-1 w-0 bg-gradient-to-r from-[#65091c] via-[#D58A98] to-[#890C25] transition-all duration-700 ease-out group-hover:w-full z-30" />

            {/* Animated Circles */}
            <div className="absolute -right-16 -top-16 w-40 h-40 rounded-full bg-[#890C25]/5 animate-pulse pointer-events-none" />

            <div className="absolute -right-5 top-10 w-20 h-20 rounded-full border border-[#890C25]/10 animate-[spin_16s_linear_infinite] pointer-events-none" />

            <div className="absolute -left-12 bottom-10 w-28 h-28 rounded-full border border-[#D58A98]/15 animate-[spin_20s_linear_infinite_reverse] pointer-events-none" />

            <div className="relative z-10">

              {/* <div className="px-5 sm:px-6 py-5 border-b border-slate-100">

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-xl bg-[#890C25]/10 flex items-center justify-center">
                    <FaInfoCircle className="text-[#890C25]" />
                  </div>

                  <div>

                    <h2 className="font-bold text-slate-800">
                      Book Information
                    </h2>

                    <p className="text-xs text-slate-400">
                      Enter the basic information of the book
                    </p>

                  </div>

                </div>

              </div> */}
              <div className="relative px-5 sm:px-6 py-5 border-b border-[#D58A98]/30 overflow-hidden">

  {/* Theme Background Circles */}

  <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-[#890C25]/8 blur-sm animate-pulse pointer-events-none" />

  <div className="absolute right-12 top-8 w-12 h-12 rounded-full border border-[#D58A98]/25 animate-[spin_14s_linear_infinite] pointer-events-none" />

  <div className="absolute -left-8 bottom-[-18px] w-24 h-24 rounded-full bg-[#890C25]/6 blur-sm animate-pulse pointer-events-none" />

  <div className="absolute left-16 bottom-[-12px] w-16 h-16 rounded-full border border-[#D58A98]/20 animate-[spin_18s_linear_infinite_reverse] pointer-events-none" />

  <div className="absolute right-[30%] bottom-[-20px] w-20 h-20 rounded-full bg-[#D58A98]/5 blur-sm animate-pulse pointer-events-none" />

  <div className="absolute right-5 bottom-[-8px] w-10 h-10 rounded-full border border-[#890C25]/15 animate-[spin_12s_linear_infinite] pointer-events-none" />

  {/* Soft Maroon Glow */}

  <div className="absolute left-[40%] bottom-0 w-32 h-8 bg-[#890C25]/5 blur-2xl pointer-events-none" />

  {/* Content */}

  <div className="relative z-10 flex items-center gap-3">

    <div className="w-10 h-10 rounded-xl bg-[#890C25]/10 flex items-center justify-center">
      <FaInfoCircle className="text-[#890C25]" />
    </div>

    <div>
      <h2 className="font-bold text-slate-800">
        Book Information
      </h2>

      <p className="text-xs text-slate-400">
        Enter the basic information of the book
      </p>
    </div>

  </div>

</div>

              <div className="p-5 sm:p-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  {/* Title */}

                  <div className="md:col-span-2">

                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Book Title
                      <span className="text-red-500 ml-1">
                        *
                      </span>
                    </label>

                    <input
                      type="text"
                      value={title}
                      onChange={(e) =>
                        setTitle(e.target.value)
                      }
                      placeholder="Enter book title"
                      required
                      className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 outline-none focus:border-[#890C25] focus:ring-2 focus:ring-[#890C25]/10 transition"
                    />

                  </div>

                  {/* Author */}

                  <div>

                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Author
                      <span className="text-red-500 ml-1">
                        *
                      </span>
                    </label>

                    <input
                      type="text"
                      value={author}
                      onChange={(e) =>
                        setAuthor(e.target.value)
                      }
                      placeholder="Enter author name"
                      required
                      className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 outline-none focus:border-[#890C25] focus:ring-2 focus:ring-[#890C25]/10 transition"
                    />

                  </div>

                  {/* Category */}

                  <div>

                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Category
                      <span className="text-red-500 ml-1">
                        *
                      </span>
                    </label>

                    <input
                      type="text"
                      value={category}
                      onChange={(e) =>
                        setCategory(e.target.value)
                      }
                      placeholder="e.g. Computer Science"
                      required
                      className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 outline-none focus:border-[#890C25] focus:ring-2 focus:ring-[#890C25]/10 transition"
                    />

                  </div>

                  {/* ISBN */}

                  <div>

                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      ISBN
                    </label>

                    <input
                      type="text"
                      value={isbn}
                      onChange={(e) =>
                        setIsbn(e.target.value)
                      }
                      placeholder="Enter ISBN"
                      className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 outline-none focus:border-[#890C25] focus:ring-2 focus:ring-[#890C25]/10 transition"
                    />

                  </div>

                  {/* Publisher */}

                  <div>

                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Publisher
                    </label>

                    <input
                      type="text"
                      value={publisher}
                      onChange={(e) =>
                        setPublisher(e.target.value)
                      }
                      placeholder="Enter publisher"
                      className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 outline-none focus:border-[#890C25] focus:ring-2 focus:ring-[#890C25]/10 transition"
                    />

                  </div>

                  {/* Publication Year */}

                  <div>

                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Publication Year
                    </label>

                    <input
                      type="number"
                      value={publicationYear}
                      onChange={(e) =>
                        setPublicationYear(
                          e.target.value
                        )
                      }
                      placeholder="e.g. 2025"
                      min="1000"
                      max="2100"
                      className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 outline-none focus:border-[#890C25] focus:ring-2 focus:ring-[#890C25]/10 transition"
                    />

                  </div>

                  {/* Language */}

                  <div>

                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Language
                    </label>

                    <select
                      value={language}
                      onChange={(e) =>
                        setLanguage(e.target.value)
                      }
                      className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 outline-none focus:border-[#890C25] focus:ring-2 focus:ring-[#890C25]/10 transition"
                    >

                      <option value="English">
                        English
                      </option>

                      <option value="Urdu">
                        Urdu
                      </option>

                      <option value="Arabic">
                        Arabic
                      </option>

                      <option value="Other">
                        Other
                      </option>

                    </select>

                  </div>

                  {/* Description */}

                  <div className="md:col-span-2">

                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Description
                    </label>

                    <textarea
                      value={description}
                      onChange={(e) =>
                        setDescription(
                          e.target.value
                        )
                      }
                      placeholder="Write a short description about this digital book..."
                      rows="5"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 outline-none resize-none focus:border-[#890C25] focus:ring-2 focus:ring-[#890C25]/10 transition"
                    />

                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* ================================= */}
          {/* UPLOAD SECTION */}
          {/* ================================= */}

          <div className="space-y-6">

            {/* Cover Image */}

            <div className="relative group bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

              {/* Animated Top Line */}
              <div className="absolute top-0 left-0 h-1 w-0 bg-gradient-to-r from-[#65091c] via-[#D58A98] to-[#890C25] transition-all duration-700 ease-out group-hover:w-full z-30" />

              {/* Animated Circles */}
              <div className="absolute -right-12 -top-12 w-32 h-32 rounded-full bg-[#890C25]/5 animate-pulse pointer-events-none" />

              <div className="absolute right-6 top-6 w-16 h-16 rounded-full border border-[#D58A98]/20 animate-[spin_16s_linear_infinite] pointer-events-none" />

              <div className="absolute -left-8 bottom-4 w-24 h-24 rounded-full border border-[#890C25]/10 animate-[spin_18s_linear_infinite_reverse] pointer-events-none" />

              <div className="relative z-10">

                <div className="px-5 py-4 border-b border-slate-100">

                  <div className="flex items-center gap-3">

                    <div className="w-9 h-9 rounded-lg bg-[#890C25]/10 flex items-center justify-center">
                      <FaImage className="text-[#890C25]" />
                    </div>

                    <div>

                      <h3 className="font-bold text-slate-800 text-sm">
                        Cover Image
                      </h3>

                      <p className="text-[11px] text-slate-400">
                        Optional book cover
                      </p>

                    </div>

                  </div>

                </div>

                <div className="p-5">

                  {coverPreview ? (

                    <div className="relative">

                      <div className="h-64 rounded-xl overflow-hidden bg-slate-100">

                        <img
                          src={coverPreview}
                          alt="Book cover preview"
                          className="w-full h-full object-cover"
                        />

                      </div>

                      <button
                        type="button"
                        onClick={removeCover}
                        className="absolute top-3 right-3 w-9 h-9 rounded-lg bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition shadow-lg"
                      >
                        <FaTimes />
                      </button>

                    </div>

                  ) : (

                    <label
                      htmlFor="coverImage"
                      className="block cursor-pointer"
                    >

                      <div className="h-64 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 hover:bg-[#890C25]/5 hover:border-[#D58A98] flex flex-col items-center justify-center transition-all">

                        <div className="w-14 h-14 rounded-2xl bg-[#890C25]/10 flex items-center justify-center mb-3">
                          <FaCloudUploadAlt className="text-[#890C25] text-2xl" />
                        </div>

                        <p className="text-sm font-semibold text-slate-700">
                          Upload Cover Image
                        </p>

                        <p className="text-xs text-slate-400 mt-1 text-center px-4">
                          PNG, JPG or JPEG
                        </p>

                      </div>

                    </label>

                  )}

                  <input
                    id="coverImage"
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    onChange={handleCoverChange}
                    className="hidden"
                  />

                  {coverImage && (
                    <p className="text-xs text-slate-500 mt-3 truncate">
                      Selected:{" "}
                      <span className="font-semibold">
                        {coverImage.name}
                      </span>
                    </p>
                  )}

                </div>

              </div>

            </div>

            {/* Digital File */}

            <div className="relative group bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

              {/* Animated Top Line */}
              <div className="absolute top-0 left-0 h-1 w-0 bg-gradient-to-r from-[#65091c] via-[#D58A98] to-[#890C25] transition-all duration-700 ease-out group-hover:w-full z-30" />

              {/* Animated Circles */}
              <div className="absolute -right-12 -top-12 w-32 h-32 rounded-full bg-[#890C25]/5 animate-pulse pointer-events-none" />

              <div className="absolute right-8 top-8 w-14 h-14 rounded-full border border-[#890C25]/10 animate-[spin_14s_linear_infinite_reverse] pointer-events-none" />

              <div className="absolute -left-7 bottom-5 w-24 h-24 rounded-full border border-[#D58A98]/20 animate-[spin_18s_linear_infinite] pointer-events-none" />

              <div className="relative z-10">

                <div className="px-5 py-4 border-b border-slate-100">

                  <div className="flex items-center gap-3">

                    <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center">
                      <FaFilePdf className="text-red-600" />
                    </div>

                    <div>

                      <h3 className="font-bold text-slate-800 text-sm">
                        Digital File
                      </h3>

                      <p className="text-[11px] text-slate-400">
                        Required digital book file
                      </p>

                    </div>

                  </div>

                </div>

                <div className="p-5">

                  {!digitalFile ? (

                    <label
                      htmlFor="digitalFile"
                      className="block cursor-pointer"
                    >

                      <div className="min-h-40 rounded-xl border-2 border-dashed border-[#D58A98]/50 bg-[#890C25]/[0.02] hover:bg-[#890C25]/5 hover:border-[#890C25] flex flex-col items-center justify-center transition-all p-5">

                        <div className="w-14 h-14 rounded-2xl bg-[#890C25]/10 flex items-center justify-center mb-3">
                          <FaCloudUploadAlt className="text-[#890C25] text-2xl" />
                        </div>

                        <p className="text-sm font-semibold text-slate-700 text-center">
                          Upload Digital Book
                        </p>

                        <p className="text-xs text-slate-400 mt-1 text-center">
                          Select your digital file
                        </p>

                      </div>

                    </label>

                  ) : (

                    <div className="rounded-xl border border-green-200 bg-green-50 p-4">

                      <div className="flex items-start gap-3">

                        <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center shrink-0">
                          <FaFilePdf className="text-red-600 text-xl" />
                        </div>

                        <div className="min-w-0 flex-1">

                          <p className="text-sm font-semibold text-slate-700 break-all">
                            {digitalFile.name}
                          </p>

                          <p className="text-xs text-slate-400 mt-1">
                            {(
                              digitalFile.size /
                              (1024 * 1024)
                            ).toFixed(2)}{" "}
                            MB
                          </p>

                        </div>

                        <button
                          type="button"
                          onClick={removeDigitalFile}
                          className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200 transition shrink-0"
                        >
                          <FaTimes />
                        </button>

                      </div>

                    </div>

                  )}

                  <input
                    id="digitalFile"
                    type="file"
                    accept=".pdf,.epub,.doc,.docx"
                    onChange={handleDigitalFileChange}
                    className="hidden"
                  />

                  <div className="mt-3 flex items-start gap-2">

                    <FaInfoCircle className="text-slate-400 text-xs mt-0.5 shrink-0" />

                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Upload the digital version of the
                      book. PDF is recommended for the
                      best reading experience.
                    </p>

                  </div>

                </div>

              </div>

            </div>

            {/* ================================= */}
            {/* SUBMIT BUTTONS */}
            {/* ================================= */}

            <div className="relative group bg-white rounded-2xl border border-slate-200 shadow-sm p-5 overflow-hidden">

              {/* Animated Top Line */}
              <div className="absolute top-0 left-0 h-1 w-0 bg-gradient-to-r from-[#65091c] via-[#D58A98] to-[#890C25] transition-all duration-700 ease-out group-hover:w-full z-20" />

              {/* Animated Circles */}
              <div className="absolute -right-10 -top-10 w-28 h-28 rounded-full bg-[#890C25]/5 animate-pulse pointer-events-none" />

              <div className="absolute right-8 bottom-2 w-16 h-16 rounded-full border border-[#D58A98]/20 animate-[spin_14s_linear_infinite] pointer-events-none" />

              <div className="absolute -left-8 bottom-0 w-20 h-20 rounded-full border border-[#890C25]/10 animate-[spin_18s_linear_infinite_reverse] pointer-events-none" />

              <div className="relative z-10">

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[#890C25] text-white font-semibold shadow-lg shadow-[#890C25]/20 hover:bg-[#6f091e] hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-all duration-300"
                >

                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <FaSave />
                      Add Digital Book
                    </>
                  )}

                </button>

                <Link
                  to="/digital-library/books"
                  className="w-full mt-3 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-100 text-slate-600 font-semibold hover:bg-slate-200 transition"
                >
                  <FaTimes />
                  Cancel
                </Link>

              </div>

            </div>

          </div>

        </form>

        {/* ================================= */}
        {/* BOTTOM INFO */}
        {/* ================================= */}

        <div className="relative group mt-8 bg-gradient-to-r from-[#890C25] via-[#890C25] to-[#6f091e] rounded-2xl p-5 sm:p-6 text-white overflow-hidden shadow-xl">

          {/* Animated Top Line */}
          <div className="absolute top-0 left-0 h-1 w-0 bg-gradient-to-r from-white/20 via-white/70 to-white/20 transition-all duration-700 ease-out group-hover:w-full z-20" />

          {/* Animated Circles */}
          <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-white/10 animate-pulse pointer-events-none" />

          <div className="absolute right-16 top-4 w-20 h-20 rounded-full border border-white/10 animate-[spin_16s_linear_infinite] pointer-events-none" />

          <div className="absolute -left-10 bottom-0 w-28 h-28 rounded-full border border-white/10 animate-[spin_20s_linear_infinite_reverse] pointer-events-none" />

          <div className="absolute left-[45%] -bottom-10 w-20 h-20 rounded-full bg-white/5 animate-pulse pointer-events-none" />

          <div className="relative z-10 flex items-start gap-4">

            <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
              <FaBook />
            </div>

            <div>

              <h3 className="font-bold">
                Digital Library Resource
              </h3>

              <p className="text-sm text-white/65 mt-1 max-w-3xl leading-relaxed">
                Once uploaded, this digital book will
                become available in the Digital Library
                according to its status and access
                permissions.
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default AddDigitalBook;