import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaBook,
  FaUser,
  FaTags,
  FaBarcode,
  FaBuilding,
  FaCalendarAlt,
  FaLanguage,
  FaImage,
  FaFilePdf,
  FaSave,
  FaArrowLeft,
  FaSpinner,
  FaInfoCircle,
  FaCheckCircle,
} from "react-icons/fa";

import {
  useDigitalBooks,
} from "../../context/DigitalBookContext";

const EditDigitalBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    currentDigitalBook,
    loading,
    error,
    getDigitalBookById,
    updateDigitalBook,
    clearError,
  } = useDigitalBooks();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [isbn, setIsbn] = useState("");
  const [publisher, setPublisher] = useState("");
  const [publicationYear, setPublicationYear] = useState("");
  const [language, setLanguage] = useState("");

  const [coverImage, setCoverImage] = useState(null);
  const [digitalFile, setDigitalFile] = useState(null);

  const [coverPreview, setCoverPreview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (id) {
      getDigitalBookById(id);
    }
  }, [id]);

  useEffect(() => {
    if (!currentDigitalBook) return;

    setTitle(currentDigitalBook.title || "");
    setAuthor(currentDigitalBook.author || "");
    setDescription(currentDigitalBook.description || "");
    setCategory(currentDigitalBook.category || "");
    setIsbn(currentDigitalBook.isbn || "");
    setPublisher(currentDigitalBook.publisher || "");
    setPublicationYear(
      currentDigitalBook.publicationYear || ""
    );
    setLanguage(currentDigitalBook.language || "English");

    if (currentDigitalBook.coverImage) {
      setCoverPreview(
        `http://localhost:5000${currentDigitalBook.coverImage}`
      );
    }
  }, [currentDigitalBook]);

  useEffect(() => {
    return () => {
      if (
        coverPreview &&
        coverPreview.startsWith("blob:")
      ) {
        URL.revokeObjectURL(coverPreview);
      }
    };
  }, [coverPreview]);

  const handleCoverChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setCoverImage(file);

    const previewUrl = URL.createObjectURL(file);
    setCoverPreview(previewUrl);
  };

  const handleDigitalFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setDigitalFile(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

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

    try {
      setSubmitting(true);

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
        formData.append("coverImage", coverImage);
      }

      if (digitalFile) {
        formData.append("digitalFile", digitalFile);
      }

      const response = await updateDigitalBook(
        id,
        formData
      );

      if (response) {
        setSuccessMessage(
          "Digital book updated successfully."
        );

        setTimeout(() => {
          navigate(`/digital-library/books/${id}`);
        }, 1000);
      }
    } catch (error) {
      console.error(
        "Update digital book error:",
        error
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && !currentDigitalBook) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="text-4xl text-[#890C25] animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-medium">
            Loading digital book...
          </p>
        </div>
      </div>
    );
  }

  if (!currentDigitalBook && error) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-lg w-full text-center">
          <FaInfoCircle className="text-5xl text-red-500 mx-auto mb-4" />

          <h2 className="text-2xl font-bold text-slate-800 mb-3">
            Unable to Load Book
          </h2>

          <p className="text-slate-500 mb-6">
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/digital-library/manage")
            }
            className="px-6 py-3 rounded-xl bg-[#890C25] text-white font-semibold hover:bg-[#6f091e] transition"
          >
            Back to Manage Books
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">

      {/* Decorative Team Circles */}
      <div className="absolute top-24 -left-24 w-72 h-72 bg-[#890C25]/10 rounded-full blur-3xl animate-pulse pointer-events-none" />

      <div className="absolute top-40 left-10 w-28 h-28 border border-[#890C25]/10 rounded-full animate-[spin_18s_linear_infinite] pointer-events-none" />

      <div className="absolute top-1/3 -right-32 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse pointer-events-none" />

      <div className="absolute top-1/2 right-10 w-32 h-32 border border-blue-500/10 rounded-full animate-[spin_22s_linear_infinite_reverse] pointer-events-none" />

      <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-[#D58A98]/10 rounded-full blur-3xl animate-pulse pointer-events-none" />

      <div className="absolute bottom-20 right-1/4 w-24 h-24 border border-[#D58A98]/20 rounded-full animate-[spin_15s_linear_infinite] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">

        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-[#890C25] via-[#890C25] to-[#6f091e] rounded-3xl shadow-xl p-6 sm:p-8 mb-8 text-white">

          {/* Header Top Hover Line */}
          <div className="absolute top-0 left-0 h-1 w-0 bg-gradient-to-r from-[#65091c] via-[#D58A98] to-white transition-all duration-700 ease-out hover:w-full" />

          {/* Team Circles */}
          <div className="absolute -top-20 -right-20 w-56 h-56 rounded-full border border-white/10 animate-[spin_20s_linear_infinite]" />

          <div className="absolute -bottom-24 -left-16 w-48 h-48 rounded-full border border-white/10 animate-[spin_16s_linear_infinite_reverse]" />

          <div className="absolute top-8 right-28 w-20 h-20 rounded-full bg-white/5 blur-xl animate-pulse" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
                  <FaBook className="text-2xl" />
                </div>

                <div>
                  <p className="text-white/70 text-sm">
                    Digital Library
                  </p>

                  <h1 className="text-2xl sm:text-3xl font-bold">
                    Edit Digital Book
                  </h1>
                </div>
              </div>

              <p className="text-white/75 max-w-2xl">
                Update the information, cover image, or
                digital file of this book.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                navigate("/digital-library/manage")
              }
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 transition font-semibold"
            >
              <FaArrowLeft />
              Back to Manage
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-2xl px-5 py-4 flex items-start gap-3">
            <FaInfoCircle className="mt-1 shrink-0" />

            <div>
              <p className="font-semibold">
                Update Error
              </p>

              <p className="text-sm mt-1">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* Success */}
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 rounded-2xl px-5 py-4 flex items-center gap-3">
            <FaCheckCircle />

            <p className="font-semibold">
              {successMessage}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Main Information */}
            <div className="lg:col-span-2 bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden relative group">

              {/* Maroon Left to Right Hover Line */}
              <div className="absolute top-0 left-0 h-1 w-0 bg-gradient-to-r from-[#65091c] via-[#D58A98] to-[#890C25] transition-all duration-700 ease-out group-hover:w-full z-20" />

              <div className="px-6 py-5 border-b border-slate-200 bg-slate-50">
                <h2 className="text-xl font-bold text-slate-800">
                  Book Information
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Update the basic information of your digital
                  book.
                </p>
              </div>

              <div className="p-6 space-y-6">

                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Book Title *
                  </label>

                  <div className="relative">
                    <FaBook className="absolute left-4 top-1/2 -translate-y-1/2 text-[#890C25]" />

                    <input
                      type="text"
                      value={title}
                      onChange={(e) =>
                        setTitle(e.target.value)
                      }
                      placeholder="Enter book title"
                      required
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-300 focus:border-[#890C25] focus:ring-2 focus:ring-[#890C25]/20 outline-none transition"
                    />
                  </div>
                </div>

                {/* Author */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Author *
                  </label>

                  <div className="relative">
                    <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-[#890C25]" />

                    <input
                      type="text"
                      value={author}
                      onChange={(e) =>
                        setAuthor(e.target.value)
                      }
                      placeholder="Enter author name"
                      required
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-300 focus:border-[#890C25] focus:ring-2 focus:ring-[#890C25]/20 outline-none transition"
                    />
                  </div>
                </div>

                {/* Category + Language */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Category *
                    </label>

                    <div className="relative">
                      <FaTags className="absolute left-4 top-1/2 -translate-y-1/2 text-[#890C25]" />

                      <input
                        type="text"
                        value={category}
                        onChange={(e) =>
                          setCategory(e.target.value)
                        }
                        placeholder="e.g. Programming"
                        required
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-300 focus:border-[#890C25] focus:ring-2 focus:ring-[#890C25]/20 outline-none transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Language
                    </label>

                    <div className="relative">
                      <FaLanguage className="absolute left-4 top-1/2 -translate-y-1/2 text-[#890C25]" />

                      <input
                        type="text"
                        value={language}
                        onChange={(e) =>
                          setLanguage(e.target.value)
                        }
                        placeholder="e.g. English"
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-300 focus:border-[#890C25] focus:ring-2 focus:ring-[#890C25]/20 outline-none transition"
                      />
                    </div>
                  </div>
                </div>

                {/* ISBN + Publisher */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      ISBN
                    </label>

                    <div className="relative">
                      <FaBarcode className="absolute left-4 top-1/2 -translate-y-1/2 text-[#890C25]" />

                      <input
                        type="text"
                        value={isbn}
                        onChange={(e) =>
                          setIsbn(e.target.value)
                        }
                        placeholder="Enter ISBN"
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-300 focus:border-[#890C25] focus:ring-2 focus:ring-[#890C25]/20 outline-none transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Publisher
                    </label>

                    <div className="relative">
                      <FaBuilding className="absolute left-4 top-1/2 -translate-y-1/2 text-[#890C25]" />

                      <input
                        type="text"
                        value={publisher}
                        onChange={(e) =>
                          setPublisher(e.target.value)
                        }
                        placeholder="Enter publisher"
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-300 focus:border-[#890C25] focus:ring-2 focus:ring-[#890C25]/20 outline-none transition"
                      />
                    </div>
                  </div>
                </div>

                {/* Publication Year */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Publication Year
                  </label>

                  <div className="relative">
                    <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-[#890C25]" />

                    <input
                      type="number"
                      value={publicationYear}
                      onChange={(e) =>
                        setPublicationYear(e.target.value)
                      }
                      placeholder="e.g. 2026"
                      min="1000"
                      max="9999"
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-300 focus:border-[#890C25] focus:ring-2 focus:ring-[#890C25]/20 outline-none transition"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Description
                  </label>

                  <textarea
                    value={description}
                    onChange={(e) =>
                      setDescription(e.target.value)
                    }
                    placeholder="Write a short description about this book..."
                    rows="6"
                    className="w-full px-4 py-3.5 rounded-xl border border-slate-300 focus:border-[#890C25] focus:ring-2 focus:ring-[#890C25]/20 outline-none transition resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Files Section */}
            <div className="space-y-8">

              {/* Cover */}
              <div className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden relative group">

                {/* Blue Left to Right Hover Line */}
                <div className="absolute top-0 left-0 h-1 w-0 bg-gradient-to-r from-blue-700 via-blue-400 to-blue-600 transition-all duration-700 ease-out group-hover:w-full z-20" />

                <div className="px-6 py-5 border-b border-slate-200 bg-slate-50">
                  <h2 className="text-xl font-bold text-slate-800">
                    Cover Image
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    Optional — upload a new cover to replace
                    the existing one.
                  </p>
                </div>

                <div className="p-6">
                  <div className="w-full aspect-[3/4] rounded-2xl overflow-hidden bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center mb-5">
                    {coverPreview ? (
                      <img
                        src={coverPreview}
                        alt={title || "Book cover"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center text-slate-400">
                        <FaImage className="text-5xl mx-auto mb-3" />

                        <p>No cover image</p>
                      </div>
                    )}
                  </div>

                  <label className="block cursor-pointer">
                    <div className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-[#890C25] text-[#890C25] hover:bg-[#890C25] hover:text-white transition font-semibold">
                      <FaImage />
                      Choose New Cover
                    </div>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverChange}
                      className="hidden"
                    />
                  </label>

                  {coverImage && (
                    <p className="text-xs text-slate-500 mt-3 break-all">
                      Selected: {coverImage.name}
                    </p>
                  )}
                </div>
              </div>

              {/* Digital File */}
              <div className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden relative group">

                {/* Maroon Left to Right Hover Line */}
                <div className="absolute top-0 left-0 h-1 w-0 bg-gradient-to-r from-[#65091c] via-[#D58A98] to-[#890C25] transition-all duration-700 ease-out group-hover:w-full z-20" />

                <div className="px-6 py-5 border-b border-slate-200 bg-slate-50">
                  <h2 className="text-xl font-bold text-slate-800">
                    Digital File
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    Optional — upload a new file to replace
                    the existing one.
                  </p>
                </div>

                <div className="p-6">
                  <div className="rounded-2xl bg-red-50 border border-red-100 p-5 mb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                        <FaFilePdf className="text-2xl text-red-600" />
                      </div>

                      <div className="min-w-0">
                        <p className="font-bold text-slate-800">
                          Current File
                        </p>

                        <p className="text-sm text-slate-500">
                          Existing digital file will remain
                          unchanged unless you select a new
                          file.
                        </p>
                      </div>
                    </div>
                  </div>

                  <label className="block cursor-pointer">
                    <div className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-[#890C25] text-[#890C25] hover:bg-[#890C25] hover:text-white transition font-semibold">
                      <FaFilePdf />
                      Choose New Digital File
                    </div>

                    <input
                      type="file"
                      accept=".pdf,.epub"
                      onChange={handleDigitalFileChange}
                      className="hidden"
                    />
                  </label>

                  {digitalFile && (
                    <div className="mt-4 p-3 rounded-xl bg-slate-100">
                      <p className="text-sm font-semibold text-slate-700 break-all">
                        {digitalFile.name}
                      </p>

                      <p className="text-xs text-slate-500 mt-1">
                        {(digitalFile.size / 1024 / 1024).toFixed(
                          2
                        )}{" "}
                        MB
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="mt-8 bg-white rounded-3xl shadow-lg border border-slate-200 p-5 sm:p-6 relative group overflow-hidden">

            {/* Blue Left to Right Hover Line */}
            <div className="absolute top-0 left-0 h-1 w-0 bg-gradient-to-r from-blue-700 via-blue-400 to-blue-600 transition-all duration-700 ease-out group-hover:w-full z-20" />

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-slate-500">
                <FaInfoCircle className="text-[#890C25]" />

                <p className="text-sm">
                  Leave the file fields empty to keep the
                  existing files.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/digital-library/books/${id}`
                    )
                  }
                  className="px-6 py-3 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-[#890C25] text-white font-bold shadow-lg hover:bg-[#6f091e] transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <FaSave />
                      Update Digital Book
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDigitalBook;