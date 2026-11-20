
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  FaBookOpen,
  FaEdit,
  FaUser,
  FaLayerGroup,
  FaBarcode,
  FaBoxes,
  FaFileAlt,
  FaImage,
  FaArrowLeft,
  FaSave,
} from "react-icons/fa";

import { useBooks } from "../../context/BookContext";

// =====================================================
// EDIT BOOK
// =====================================================

const EditBook = () => {
  const { id } = useParams();

  const {
    getBook,
    updateBook,
    loading,
  } = useBooks();

  const navigate = useNavigate();

  // =====================================================
  // FORM
  // =====================================================

  const [form, setForm] = useState({
    title: "",
    author: "",
    category: "",
    isbn: "",
    quantity: 1,
    description: "",
  });

  const [image, setImage] = useState(null);
  const [currentImage, setCurrentImage] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // IMAGE URL
  // =====================================================

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";

    let cleanImage = String(imagePath).trim();

    if (!cleanImage) return "";

    if (
      cleanImage.startsWith("http://") ||
      cleanImage.startsWith("https://")
    ) {
      return cleanImage;
    }

    cleanImage = cleanImage.replace(/^\/+/, "");

    if (cleanImage.startsWith("uploads/")) {
      return `http://localhost:5000/${cleanImage}`;
    }

    if (cleanImage.startsWith("books/")) {
      return `http://localhost:5000/uploads/${cleanImage}`;
    }

    return `http://localhost:5000/uploads/books/${cleanImage}`;
  };

  // =====================================================
  // LOAD BOOK
  // =====================================================

  useEffect(() => {
    const loadBook = async () => {
      try {
        setPageLoading(true);
        setError("");

        const book = await getBook(id);

        setForm({
          title: book?.title || "",
          author: book?.author || "",
          category: book?.category || "",
          isbn: book?.isbn || "",
          quantity: book?.quantity || 1,
          description: book?.description || "",
        });

        setCurrentImage(book?.image || "");
        setPreviewImage(getImageUrl(book?.image));
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Failed to load book."
        );
      } finally {
        setPageLoading(false);
      }
    };

    if (id) {
      loadBook();
    }
  }, [id]);

  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // IMAGE CHANGE
  // =====================================================

  const handleImageChange = (e) => {
    const selectedImage = e.target.files?.[0] || null;

    setImage(selectedImage);

    if (selectedImage) {
      const objectUrl = URL.createObjectURL(selectedImage);
      setPreviewImage(objectUrl);
    }
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    try {
      const formData = new FormData();

      formData.append("title", form.title);
      formData.append("author", form.author);
      formData.append("category", form.category);
      formData.append("isbn", form.isbn);
      formData.append("quantity", form.quantity);
      formData.append(
        "description",
        form.description
      );

      if (image) {
        formData.append("image", image);
      }

      await updateBook(id, formData);

      navigate("/library/books");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to update book."
      );
    }
  };

  // =====================================================
  // IMAGE ERROR
  // =====================================================

  const handleImageError = () => {
    setPreviewImage("");
  };

  // =====================================================
  // PAGE LOADING
  // =====================================================

  if (pageLoading) {
    return (
      <div
        className="
          min-h-screen
          bg-slate-100
          px-4
          pb-10
          pt-10
          sm:px-6
          lg:px-8
        "
      >
        <div className="mx-auto max-w-7xl">
          <div className="flex min-h-[65vh] items-center justify-center">
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
                  ring-4
                  ring-blue-100/60
                "
              >
                <div
                  className="
                    h-9
                    w-9
                    animate-spin
                    rounded-full
                    border-4
                    border-blue-100
                    border-t-[#890C25]
                  "
                />
              </div>

              <h3 className="mt-5 text-xl font-black text-slate-800">
                Loading Book
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Fetching book information...
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

              <Link
                to="/library/books"
                className="
                  inline-flex
                  items-center
                  gap-2
                  text-sm
                  font-bold
                  text-[#D58A98]
                  transition
                  hover:text-white
                "
              >
                <FaArrowLeft size={12} />
                Back to Books
              </Link>

              <div className="mt-5 flex items-center gap-3">

                {/* BLUE ICON BOX */}

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
                    bg-blue-600
                    text-white
                    shadow-xl
                    transition
                    duration-300
                    hover:bg-blue-700
                  "
                >
                  <FaEdit size={23} />
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
                    Library Management
                  </p>

                  <h1
                    className="
                      mt-1
                      text-3xl
                      font-black
                      text-white
                      sm:text-4xl
                    "
                  >
                    Edit Book
                  </h1>

                  <p className="mt-1 text-xs text-white/55">
                    Update and manage complete book information
                  </p>

                </div>

              </div>

            </div>

            {/* BLUE STATUS BOX */}

            <div
              className="
                group/status
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
                p-5
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
                  -bottom-12
                  -right-12
                  h-36
                  w-36
                  rounded-full
                  border-2
                  border-blue-200/20
                  bg-blue-400/10
                  transition
                  duration-500
                  group-hover/status:scale-125
                "
              />

              <div className="relative">

                <div
                  className="
                    mx-auto
                    flex
                    h-12
                    w-12
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
                  <FaBookOpen size={21} />
                </div>

                <p
                  className="
                    mt-3
                    text-[10px]
                    font-black
                    uppercase
                    tracking-[0.2em]
                    text-blue-100/70
                  "
                >
                  Editing Book
                </p>

                <p className="mt-1 truncate text-sm font-black text-white">
                  {form.title || "Book"}
                </p>

              </div>
            </div>

          </div>
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
              bg-gradient-to-r
              from-red-50
              to-rose-50
              px-5
              py-4
              text-sm
              font-semibold
              text-red-700
              shadow-sm
              ring-2
              ring-red-100/60
            "
          >
            {error}
          </div>
        )}

        {/* =================================================
            MAIN FORM
        ================================================= */}

        <form onSubmit={handleSubmit}>

          <div className="grid gap-6 xl:grid-cols-[1fr_340px]">

            {/* =================================================
                FORM CARD
            ================================================= */}

            <div
              className="
                group/form
                relative
                overflow-hidden
                rounded-3xl
                border
                border-slate-200
                bg-white
                shadow-xl
                ring-2
                ring-blue-100/70
              "
            >

              {/* TOP LINE */}

              <div
                className="
                  absolute
                  left-0
                  right-0
                  top-0
                  z-10
                  h-1.5
                  bg-gradient-to-r
                  from-[#65091c]
                  via-blue-600
                  to-green-500
                "
              />

              <div className="p-6 sm:p-8">

                {/* SECTION HEADER */}

                <div className="mb-7 flex items-center gap-3">

                  <div
                    className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-xl
                      bg-blue-600
                      text-white
                      shadow-lg
                      ring-4
                      ring-blue-100
                    "
                  >
                    <FaBookOpen size={18} />
                  </div>

                  <div>
                    <h2 className="text-xl font-black text-slate-800">
                      Book Information
                    </h2>

                    <p className="text-xs text-slate-400">
                      Update the details of this library book.
                    </p>
                  </div>

                </div>

                <div className="space-y-6">

                  {/* TITLE */}

                  <div
                    className="
                      rounded-2xl
                      border
                      border-blue-100
                      bg-blue-50/30
                      p-4
                      shadow-sm
                      ring-2
                      ring-blue-50
                    "
                  >

                    <label className="mb-2 block text-sm font-black text-slate-700">
                      Book Title
                    </label>

                    <div className="relative">

                      <FaBookOpen
                        className="
                          absolute
                          left-4
                          top-1/2
                          -translate-y-1/2
                          text-blue-600
                        "
                        size={15}
                      />

                      <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        placeholder="Enter book title"
                        required
                        className="
                          w-full
                          rounded-xl
                          border
                          border-blue-100
                          bg-white
                          py-3
                          pl-11
                          pr-4
                          text-sm
                          font-semibold
                          text-slate-800
                          outline-none
                          transition
                          focus:border-blue-500
                          focus:ring-4
                          focus:ring-blue-100
                        "
                      />

                    </div>
                  </div>

                  {/* AUTHOR + CATEGORY */}

                  <div className="grid gap-5 md:grid-cols-2">

                    {/* AUTHOR */}

                    <div
                      className="
                        rounded-2xl
                        border
                        border-green-100
                        bg-green-50/30
                        p-4
                        shadow-sm
                        ring-2
                        ring-green-50
                      "
                    >

                      <label className="mb-2 block text-sm font-black text-slate-700">
                        Author
                      </label>

                      <div className="relative">

                        <FaUser
                          className="
                            absolute
                            left-4
                            top-1/2
                            -translate-y-1/2
                            text-green-600
                          "
                          size={14}
                        />

                        <input
                          type="text"
                          name="author"
                          value={form.author}
                          onChange={handleChange}
                          placeholder="Enter author name"
                          required
                          className="
                            w-full
                            rounded-xl
                            border
                            border-green-100
                            bg-white
                            py-3
                            pl-11
                            pr-4
                            text-sm
                            font-semibold
                            text-slate-800
                            outline-none
                            transition
                            focus:border-green-500
                            focus:ring-4
                            focus:ring-green-100
                          "
                        />

                      </div>
                    </div>

                    {/* CATEGORY */}

                    <div
                      className="
                        rounded-2xl
                        border
                        border-purple-100
                        bg-purple-50/30
                        p-4
                        shadow-sm
                        ring-2
                        ring-purple-50
                      "
                    >

                      <label className="mb-2 block text-sm font-black text-slate-700">
                        Category
                      </label>

                      <div className="relative">

                        <FaLayerGroup
                          className="
                            absolute
                            left-4
                            top-1/2
                            -translate-y-1/2
                            text-purple-600
                          "
                          size={14}
                        />

                        <input
                          type="text"
                          name="category"
                          value={form.category}
                          onChange={handleChange}
                          placeholder="e.g. Computer Science"
                          required
                          className="
                            w-full
                            rounded-xl
                            border
                            border-purple-100
                            bg-white
                            py-3
                            pl-11
                            pr-4
                            text-sm
                            font-semibold
                            text-slate-800
                            outline-none
                            transition
                            focus:border-purple-500
                            focus:ring-4
                            focus:ring-purple-100
                          "
                        />

                      </div>
                    </div>

                  </div>

                  {/* ISBN + QUANTITY */}

                  <div className="grid gap-5 md:grid-cols-2">

                    {/* ISBN */}

                    <div
                      className="
                        rounded-2xl
                        border
                        border-amber-100
                        bg-amber-50/30
                        p-4
                        shadow-sm
                        ring-2
                        ring-amber-50
                      "
                    >

                      <label className="mb-2 block text-sm font-black text-slate-700">
                        ISBN
                      </label>

                      <div className="relative">

                        <FaBarcode
                          className="
                            absolute
                            left-4
                            top-1/2
                            -translate-y-1/2
                            text-amber-600
                          "
                          size={15}
                        />

                        <input
                          type="text"
                          name="isbn"
                          value={form.isbn}
                          onChange={handleChange}
                          placeholder="Enter ISBN"
                          required
                          className="
                            w-full
                            rounded-xl
                            border
                            border-amber-100
                            bg-white
                            py-3
                            pl-11
                            pr-4
                            text-sm
                            font-semibold
                            text-slate-800
                            outline-none
                            transition
                            focus:border-amber-500
                            focus:ring-4
                            focus:ring-amber-100
                          "
                        />

                      </div>
                    </div>

                    {/* QUANTITY */}

                    <div
                      className="
                        rounded-2xl
                        border
                        border-blue-100
                        bg-blue-50/30
                        p-4
                        shadow-sm
                        ring-2
                        ring-blue-50
                      "
                    >

                      <label className="mb-2 block text-sm font-black text-slate-700">
                        Quantity
                      </label>

                      <div className="relative">

                        <FaBoxes
                          className="
                            absolute
                            left-4
                            top-1/2
                            -translate-y-1/2
                            text-blue-600
                          "
                          size={15}
                        />

                        <input
                          type="number"
                          name="quantity"
                          min="1"
                          value={form.quantity}
                          onChange={handleChange}
                          required
                          className="
                            w-full
                            rounded-xl
                            border
                            border-blue-100
                            bg-white
                            py-3
                            pl-11
                            pr-4
                            text-sm
                            font-semibold
                            text-slate-800
                            outline-none
                            transition
                            focus:border-blue-500
                            focus:ring-4
                            focus:ring-blue-100
                          "
                        />

                      </div>
                    </div>

                  </div>

                  {/* DESCRIPTION */}

                  <div
                    className="
                      rounded-2xl
                      border
                      border-indigo-100
                      bg-indigo-50/20
                      p-4
                      shadow-sm
                      ring-2
                      ring-indigo-50
                    "
                  >

                    <label className="mb-2 flex items-center gap-2 text-sm font-black text-slate-700">

                      <span
                        className="
                          flex
                          h-7
                          w-7
                          items-center
                          justify-center
                          rounded-lg
                          bg-indigo-600
                          text-white
                        "
                      >
                        <FaFileAlt size={12} />
                      </span>

                      Description

                    </label>

                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      rows="6"
                      placeholder="Enter book description..."
                      className="
                        w-full
                        resize-none
                        rounded-xl
                        border
                        border-indigo-100
                        bg-white
                        px-4
                        py-3
                        text-sm
                        font-medium
                        text-slate-800
                        outline-none
                        transition
                        focus:border-indigo-500
                        focus:ring-4
                        focus:ring-indigo-100
                      "
                    />

                  </div>

                </div>
              </div>
            </div>

            {/* =================================================
                IMAGE CARD
            ================================================= */}

            <div
              className="
                relative
                h-fit
                overflow-hidden
                rounded-3xl
                border
                border-purple-100
                bg-white
                shadow-xl
                ring-2
                ring-purple-50
              "
            >

              {/* TOP LINE */}

              <div
                className="
                  absolute
                  left-0
                  right-0
                  top-0
                  h-1.5
                  bg-gradient-to-r
                  from-purple-600
                  via-blue-600
                  to-green-500
                "
              />

              <div className="p-6">

                <div className="mb-5 flex items-center gap-3">

                  <div
                    className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-xl
                      bg-purple-600
                      text-white
                      shadow-lg
                      ring-4
                      ring-purple-100
                    "
                  >
                    <FaImage size={18} />
                  </div>

                  <div>

                    <h2 className="text-lg font-black text-slate-800">
                      Book Cover
                    </h2>

                    <p className="text-xs text-slate-400">
                      Current / replacement image
                    </p>

                  </div>

                </div>

                {/* IMAGE PREVIEW */}

                <div
                  className="
                    relative
                    flex
                    min-h-[300px]
                    items-center
                    justify-center
                    overflow-hidden
                    rounded-2xl
                    border
                    border-blue-100
                    bg-gradient-to-br
                    from-blue-50
                    via-white
                    to-purple-50
                    p-5
                    shadow-inner
                    ring-2
                    ring-blue-50
                  "
                >

                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt={form.title || "Book"}
                      onError={handleImageError}
                      className="
                        max-h-[270px]
                        max-w-full
                        rounded-xl
                        object-contain
                        drop-shadow-[0_15px_25px_rgba(15,23,42,0.18)]
                        transition
                        duration-500
                        hover:scale-105
                      "
                    />
                  ) : (
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
                          bg-purple-100
                          text-purple-400
                          ring-4
                          ring-purple-50
                        "
                      >
                        <FaBookOpen size={30} />
                      </div>

                      <p className="mt-4 text-sm font-bold text-slate-400">
                        No Cover Image
                      </p>

                    </div>
                  )}

                </div>

                {/* IMAGE STATUS */}

                <div
                  className="
                    mt-5
                    rounded-2xl
                    border
                    border-green-100
                    bg-green-50/50
                    p-4
                    shadow-sm
                    ring-2
                    ring-green-50
                  "
                >

                  <div className="flex items-center gap-3">

                    <div
                      className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-xl
                        bg-green-600
                        text-white
                        shadow-sm
                      "
                    >
                      <FaImage size={15} />
                    </div>

                    <div>

                      <p className="text-[10px] font-black uppercase tracking-wider text-green-600">
                        Image Status
                      </p>

                      <p className="mt-1 text-sm font-black text-slate-700">
                        {image
                          ? "New image selected"
                          : currentImage
                          ? "Current image"
                          : "No image selected"}
                      </p>

                    </div>

                  </div>

                </div>

                {/* FILE INPUT */}

                <div className="mt-5">

                  <label className="mb-2 block text-sm font-black text-slate-700">
                    Replace Image
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="
                      block
                      w-full
                      cursor-pointer
                      rounded-xl
                      border
                      border-purple-100
                      bg-purple-50/40
                      text-sm
                      font-medium
                      text-slate-600
                      shadow-sm
                      outline-none
                      ring-2
                      ring-purple-50
                      file:mr-4
                      file:border-0
                      file:bg-purple-600
                      file:px-4
                      file:py-3
                      file:font-bold
                      file:text-white
                      file:transition
                      hover:file:bg-purple-700
                    "
                  />

                  <p className="mt-2 text-[11px] font-medium text-slate-400">
                    Select a new image only if you want to replace the
                    current cover.
                  </p>

                </div>

              </div>
            </div>

          </div>

          {/* =================================================
              ACTION BAR
          ================================================= */}

          <div
            className="
              mt-6
              overflow-hidden
              rounded-3xl
              border
              border-slate-200
              bg-white
              p-5
              shadow-xl
              ring-2
              ring-blue-50
            "
          >

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <p className="text-sm font-black text-slate-700">
                  Ready to save changes?
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Your updated book information will be saved to the library.
                </p>

              </div>

              <div className="flex flex-col gap-3 sm:flex-row">

                {/* CANCEL */}

                <Link
                  to="/library/books"
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
                    font-black
                    text-slate-600
                    shadow-sm
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
                    hover:bg-slate-100
                    hover:shadow-md
                  "
                >
                  <FaArrowLeft size={12} />
                  Cancel
                </Link>

                {/* UPDATE */}

                <button
                  type="submit"
                  disabled={loading}
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
                    font-black
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
                  <FaSave size={13} />

                  {loading
                    ? "Updating Book..."
                    : "Update Book"}
                </button>

              </div>

            </div>

          </div>

        </form>

      </div>
    </div>
  );
};

export default EditBook;

