
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  FaBookOpen,
  FaUserEdit,
  FaLayerGroup,
  FaBarcode,
  FaHashtag,
  FaAlignLeft,
  FaImage,
  FaArrowLeft,
  FaPlus,
  FaSave,
} from "react-icons/fa";

import { useBooks } from "../../context/BookContext";

// =====================================================
// ADD BOOK
// =====================================================

const AddBook = () => {
  const { addBook, loading } = useBooks();

  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    author: "",
    category: "",
    isbn: "",
    quantity: 1,
    description: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");

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
  // IMAGE
  // =====================================================

  const handleImageChange = (e) => {
    const file = e.target.files?.[0] || null;

    setImage(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview("");
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
      formData.append("description", form.description);

      if (image) {
        formData.append("image", image);
      }

      await addBook(formData);

      navigate("/library/books");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to add book."
      );
    }
  };

  // =====================================================
  // INPUT CLASS
  // =====================================================

  const inputClass = `
    w-full
    rounded-xl
    border
    border-slate-200
    bg-slate-50
    px-4
    py-3
    text-sm
    font-semibold
    text-slate-700
    outline-none
    transition-all
    duration-200
    placeholder:text-slate-400
    hover:border-[#890C25]/20
    focus:border-[#890C25]
    focus:bg-white
    focus:ring-4
    focus:ring-[#890C25]/10
  `;

  // =====================================================
  // RENDER
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
            HERO HEADER
        ================================================= */}

        <div
          className="
            group/hero
            relative
            mb-7
            overflow-hidden
            rounded-3xl
            bg-[#890C25]
            shadow-2xl
          "
        >

          {/* DECORATIVE CIRCLE */}

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
              gap-6
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

              <div className="mt-5 flex items-center gap-4">

                {/* BLUE ICON BOX */}

                <div
                  className="
                    flex
                    h-16
                    w-16
                    shrink-0
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-blue-300/30
                    bg-blue-600
                    text-white
                    shadow-xl
                    shadow-blue-950/20
                    transition
                    duration-300
                    hover:scale-105
                    hover:bg-blue-700
                  "
                >
                  <FaBookOpen size={27} />
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
                      tracking-tight
                      text-white
                      sm:text-4xl
                    "
                  >
                    Add New Book
                  </h1>

                  <p className="mt-2 text-sm text-white/60">
                    Add a new book to your university library collection.
                  </p>

                </div>

              </div>

            </div>

            {/* RIGHT INFO */}

            <div
              className="
                relative
                overflow-hidden
                rounded-3xl
                border
                border-blue-300/30
                bg-gradient-to-br
                from-blue-600
                via-blue-700
                to-blue-900
                px-7
                py-5
                text-center
                shadow-xl
                lg:w-52
              "
            >

              <div
                className="
                  pointer-events-none
                  absolute
                  -bottom-12
                  -right-12
                  h-32
                  w-32
                  rounded-full
                  border-2
                  border-blue-200/20
                  bg-blue-400/10
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
                    bg-white/10
                    text-white
                    shadow-lg
                  "
                >
                  <FaPlus size={18} />
                </div>

                <p
                  className="
                    mt-3
                    text-[10px]
                    font-black
                    uppercase
                    tracking-[0.18em]
                    text-blue-100/70
                  "
                >
                  Library Action
                </p>

                <p className="mt-1 text-sm font-black text-white">
                  New Book
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
              font-bold
              text-red-700
              shadow-sm
              ring-1
              ring-red-100
            "
          >
            {error}
          </div>
        )}

        {/* =================================================
            MAIN FORM CARD
        ================================================= */}

        <div
          className="
            relative
            overflow-hidden
            rounded-3xl
            border
            border-slate-200
            bg-white
            shadow-xl
          "
        >

          {/* TOP COLOR LINE */}

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

          <div className="p-6 sm:p-8 lg:p-10">

            {/* FORM HEADER */}

            <div
              className="
                mb-8
                flex
                flex-col
                gap-4
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >

              <div className="flex items-center gap-3">

                <div
                  className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-xl
                    bg-[#890C25]/10
                    text-[#890C25]
                    ring-4
                    ring-[#890C25]/5
                  "
                >
                  <FaBookOpen size={18} />
                </div>

                <div>

                  <h2 className="text-xl font-black text-slate-800">
                    Book Information
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Enter complete details for the new library book.
                  </p>

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
                  border-green-200
                  bg-green-50
                  px-4
                  py-2
                  text-xs
                  font-black
                  text-green-700
                  shadow-sm
                  ring-4
                  ring-green-50
                "
              >
                <span className="h-2 w-2 rounded-full bg-green-500" />
                Ready to Add
              </div>

            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-7"
            >

              {/* =================================================
                  TITLE
              ================================================= */}

              <div
                className="
                  rounded-2xl
                  border
                  border-blue-100
                  bg-gradient-to-br
                  from-blue-50/60
                  via-white
                  to-blue-50/30
                  p-5
                  shadow-sm
                  ring-1
                  ring-blue-50
                "
              >

                <label
                  className="
                    mb-2
                    flex
                    items-center
                    gap-2
                    text-sm
                    font-black
                    text-slate-700
                  "
                >

                  <span
                    className="
                      flex
                      h-8
                      w-8
                      items-center
                      justify-center
                      rounded-lg
                      bg-blue-600
                      text-white
                      shadow-sm
                      ring-4
                      ring-blue-50
                    "
                  >
                    <FaBookOpen size={13} />
                  </span>

                  Book Title

                </label>

                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Enter book title"
                  required
                  className={inputClass}
                />

              </div>

              {/* =================================================
                  AUTHOR + CATEGORY
              ================================================= */}

              <div className="grid gap-6 md:grid-cols-2">

                {/* AUTHOR */}

                <div
                  className="
                    rounded-2xl
                    border
                    border-green-100
                    bg-gradient-to-br
                    from-green-50/60
                    via-white
                    to-emerald-50/30
                    p-5
                    shadow-sm
                    ring-1
                    ring-green-50
                  "
                >

                  <label
                    className="
                      mb-2
                      flex
                      items-center
                      gap-2
                      text-sm
                      font-black
                      text-slate-700
                    "
                  >

                    <span
                      className="
                        flex
                        h-8
                        w-8
                        items-center
                        justify-center
                        rounded-lg
                        bg-green-600
                        text-white
                        shadow-sm
                        ring-4
                        ring-green-50
                      "
                    >
                      <FaUserEdit size={13} />
                    </span>

                    Author

                  </label>

                  <input
                    type="text"
                    name="author"
                    value={form.author}
                    onChange={handleChange}
                    placeholder="Enter author name"
                    required
                    className={inputClass}
                  />

                </div>

                {/* CATEGORY */}

                <div
                  className="
                    rounded-2xl
                    border
                    border-purple-100
                    bg-gradient-to-br
                    from-purple-50/60
                    via-white
                    to-violet-50/30
                    p-5
                    shadow-sm
                    ring-1
                    ring-purple-50
                  "
                >

                  <label
                    className="
                      mb-2
                      flex
                      items-center
                      gap-2
                      text-sm
                      font-black
                      text-slate-700
                    "
                  >

                    <span
                      className="
                        flex
                        h-8
                        w-8
                        items-center
                        justify-center
                        rounded-lg
                        bg-purple-600
                        text-white
                        shadow-sm
                        ring-4
                        ring-purple-50
                      "
                    >
                      <FaLayerGroup size={13} />
                    </span>

                    Category

                  </label>

                  <input
                    type="text"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    placeholder="e.g. Computer Science"
                    required
                    className={inputClass}
                  />

                </div>

              </div>

              {/* =================================================
                  ISBN + QUANTITY
              ================================================= */}

              <div className="grid gap-6 md:grid-cols-2">

                {/* ISBN */}

                <div
                  className="
                    rounded-2xl
                    border
                    border-amber-100
                    bg-gradient-to-br
                    from-amber-50/60
                    via-white
                    to-yellow-50/30
                    p-5
                    shadow-sm
                    ring-1
                    ring-amber-50
                  "
                >

                  <label
                    className="
                      mb-2
                      flex
                      items-center
                      gap-2
                      text-sm
                      font-black
                      text-slate-700
                    "
                  >

                    <span
                      className="
                        flex
                        h-8
                        w-8
                        items-center
                        justify-center
                        rounded-lg
                        bg-amber-500
                        text-white
                        shadow-sm
                        ring-4
                        ring-amber-50
                      "
                    >
                      <FaBarcode size={14} />
                    </span>

                    ISBN

                  </label>

                  <input
                    type="text"
                    name="isbn"
                    value={form.isbn}
                    onChange={handleChange}
                    placeholder="Enter ISBN"
                    required
                    className={inputClass}
                  />

                </div>

                {/* QUANTITY */}

                <div
                  className="
                    rounded-2xl
                    border
                    border-cyan-100
                    bg-gradient-to-br
                    from-cyan-50/60
                    via-white
                    to-sky-50/30
                    p-5
                    shadow-sm
                    ring-1
                    ring-cyan-50
                  "
                >

                  <label
                    className="
                      mb-2
                      flex
                      items-center
                      gap-2
                      text-sm
                      font-black
                      text-slate-700
                    "
                  >

                    <span
                      className="
                        flex
                        h-8
                        w-8
                        items-center
                        justify-center
                        rounded-lg
                        bg-cyan-600
                        text-white
                        shadow-sm
                        ring-4
                        ring-cyan-50
                      "
                    >
                      <FaHashtag size={13} />
                    </span>

                    Quantity

                  </label>

                  <input
                    type="number"
                    name="quantity"
                    min="1"
                    value={form.quantity}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />

                </div>

              </div>

              {/* =================================================
                  DESCRIPTION
              ================================================= */}

              <div
                className="
                  rounded-2xl
                  border
                  border-indigo-100
                  bg-gradient-to-br
                  from-indigo-50/60
                  via-white
                  to-blue-50/30
                  p-5
                  shadow-sm
                  ring-1
                  ring-indigo-50
                "
              >

                <label
                  className="
                    mb-2
                    flex
                    items-center
                    gap-2
                    text-sm
                    font-black
                    text-slate-700
                  "
                >

                  <span
                    className="
                      flex
                      h-8
                      w-8
                      items-center
                      justify-center
                      rounded-lg
                      bg-indigo-600
                      text-white
                      shadow-sm
                      ring-4
                      ring-indigo-50
                    "
                  >
                    <FaAlignLeft size={13} />
                  </span>

                  Description

                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Enter book description..."
                  className={`
                    ${inputClass}
                    resize-none
                  `}
                />

              </div>

              {/* =================================================
                  IMAGE UPLOAD
              ================================================= */}

              <div
                className="
                  rounded-2xl
                  border
                  border-pink-100
                  bg-gradient-to-br
                  from-pink-50/60
                  via-white
                  to-rose-50/30
                  p-5
                  shadow-sm
                  ring-1
                  ring-pink-50
                "
              >

                <label
                  className="
                    mb-4
                    flex
                    items-center
                    gap-2
                    text-sm
                    font-black
                    text-slate-700
                  "
                >

                  <span
                    className="
                      flex
                      h-8
                      w-8
                      items-center
                      justify-center
                      rounded-lg
                      bg-pink-600
                      text-white
                      shadow-sm
                      ring-4
                      ring-pink-50
                    "
                  >
                    <FaImage size={13} />
                  </span>

                  Book Cover Image

                </label>

                <div className="grid gap-5 md:grid-cols-[1fr_180px]">

                  {/* FILE */}

                  <div>

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
                        border-slate-200
                        bg-slate-50
                        text-sm
                        font-semibold
                        text-slate-600
                        shadow-sm
                        file:mr-4
                        file:cursor-pointer
                        file:border-0
                        file:bg-[#890C25]
                        file:px-5
                        file:py-3
                        file:font-black
                        file:text-white
                        hover:file:bg-[#6f091e]
                      "
                    />

                    <p className="mt-3 text-xs font-medium text-slate-400">
                      Upload a JPG, PNG or other supported image as the
                      book cover.
                    </p>

                  </div>

                  {/* PREVIEW */}

                  <div
                    className="
                      relative
                      flex
                      h-44
                      items-center
                      justify-center
                      overflow-hidden
                      rounded-2xl
                      border
                      border-pink-100
                      bg-gradient-to-br
                      from-pink-50
                      via-white
                      to-rose-50
                      shadow-sm
                      ring-4
                      ring-pink-50
                    "
                  >

                    {preview ? (
                      <img
                        src={preview}
                        alt="Book Preview"
                        className="
                          h-full
                          w-full
                          object-contain
                          p-3
                          drop-shadow-xl
                        "
                      />
                    ) : (
                      <div className="text-center">

                        <div
                          className="
                            mx-auto
                            flex
                            h-14
                            w-14
                            items-center
                            justify-center
                            rounded-2xl
                            bg-pink-100
                            text-pink-500
                          "
                        >
                          <FaImage size={22} />
                        </div>

                        <p className="mt-3 text-xs font-bold text-slate-400">
                          Image Preview
                        </p>

                      </div>
                    )}

                  </div>

                </div>

              </div>

              {/* =================================================
                  BOTTOM ACTIONS
              ================================================= */}

              <div
                className="
                  flex
                  flex-col
                  gap-3
                  border-t
                  border-slate-100
                  pt-6
                  sm:flex-row
                  sm:justify-end
                "
              >

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
                    bg-white
                    px-6
                    py-3
                    text-sm
                    font-black
                    text-slate-600
                    shadow-sm
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
                    hover:border-slate-300
                    hover:bg-slate-50
                    hover:shadow-md
                  "
                >
                  <FaArrowLeft size={12} />
                  Cancel
                </Link>

                <button
                  type="submit"
                  disabled={loading}
                  onClick={handleSubmit}
                  className="
                    group/save
                    relative
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    overflow-hidden
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
                      group-hover/save:scale-125
                    "
                  />

                  {loading ? (
                    <>
                      <span
                        className="
                          h-4
                          w-4
                          animate-spin
                          rounded-full
                          border-2
                          border-white/30
                          border-t-white
                        "
                      />
                      Adding Book...
                    </>
                  ) : (
                    <>
                      <FaSave size={13} />
                      Add Book
                    </>
                  )}

                </button>

              </div>

            </form>

          </div>

        </div>

        {/* =================================================
            BOTTOM DECORATIVE STRIP
        ================================================= */}

        <div className="mt-6 flex justify-center">

          <div
            className="
              h-1
              w-20
              rounded-full
              bg-gradient-to-r
              from-[#890C25]
              via-purple-500
              to-blue-600
              shadow-sm
            "
          />

        </div>

      </div>
    </div>
  );
};

export default AddBook;

