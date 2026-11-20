
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useIssueBooks } from "../../context/IssueBookContext";
import { useReturnBooks } from "../../context/ReturnBookContext";
import { useAuth } from "../../context/AuthContext";

const MyIssuedBooks = () => {
  const navigate = useNavigate();

  const { user } = useAuth();

  const {
    issuedBooks,
    loading,
    error,
    getMyIssuedBooks,
  } = useIssueBooks();

  const {
    requestReturnBook,
    loading: returnLoading,
    error: returnError,
  } = useReturnBooks();

  // =====================================================
  // LOAD MY ISSUED BOOKS
  // =====================================================

  useEffect(() => {
    if (!user) return;

    getMyIssuedBooks().catch((err) => {
      console.error("GET MY ISSUED BOOKS ERROR:", err);
    });
  }, [user]);

  // =====================================================
  // SAFE DATA
  // =====================================================

  const books = Array.isArray(issuedBooks)
    ? issuedBooks
    : [];

  // =====================================================
  // DATE FORMATTER
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "N/A";

    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return "N/A";
    }

    return parsedDate.toLocaleDateString();
  };

  // =====================================================
  // REQUEST RETURN
  // =====================================================

  const handleRequestReturn = async (issueId) => {
    const confirmed = window.confirm(
      "Are you sure you want to request the return of this book?"
    );

    if (!confirmed) return;

    try {
      await requestReturnBook(issueId);

      window.alert(
        "Return request submitted successfully."
      );

      await getMyIssuedBooks();
    } catch (err) {
      console.error(
        "REQUEST RETURN ERROR:",
        err
      );
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading && books.length === 0) {
    return (
      <div className="min-h-screen bg-slate-100 p-6">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl bg-white p-12 text-center shadow-lg">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#890C25]" />

            <p className="text-lg font-semibold text-slate-700">
              Loading issued books...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-6">

      <div className="mx-auto max-w-7xl">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-6">
          <div className="rounded-3xl bg-[#890C25] p-6 text-white shadow-xl">

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

              <div>
                <h1 className="text-2xl font-bold md:text-3xl">
                  My Issued Books
                </h1>

                <p className="mt-2 text-sm text-white/80">
                  View the books currently issued to you
                  and request their return.
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 px-5 py-3 backdrop-blur-sm">
                <p className="text-xs font-medium text-white/70">
                  Issued Books
                </p>

                <p className="mt-1 text-2xl font-bold">
                  {books.length}
                </p>
              </div>

            </div>

          </div>
        </div>

        {/* =================================================
            ERROR
        ================================================= */}

        {(error || returnError) && (
          <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">
            {returnError || error}
          </div>
        )}

        {/* =================================================
            EMPTY
        ================================================= */}

        {books.length === 0 && !loading && (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-lg">

            <div className="mb-4 text-5xl">
              📚
            </div>

            <h2 className="text-xl font-bold text-slate-800">
              No Issued Books
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              You currently have no issued books.
            </p>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="
                mt-6
                rounded-xl
                bg-[#890C25]
                px-6
                py-3
                font-semibold
                text-white
                transition
                hover:bg-[#6f091e]
              "
            >
              Go Back
            </button>

          </div>
        )}

        {/* =================================================
            DESKTOP TABLE
        ================================================= */}

        {books.length > 0 && (
          <div className="hidden overflow-hidden rounded-3xl bg-white shadow-lg md:block">

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-slate-50">
                  <tr>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                      Book
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                      Issue Date
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                      Due Date
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wide text-slate-500">
                      Action
                    </th>

                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">

                  {books.map((issue) => {

                    const book =
                      issue?.book || {};

                    const isReturned =
                      issue?.status
                        ?.toString()
                        .trim()
                        .toLowerCase() ===
                      "returned";

                    const returnRequested =
                      issue?.returnRequested === true;

                    const canRequestReturn =
                      !isReturned &&
                      issue?.received === true &&
                      !returnRequested;

                    return (
                      <tr
                        key={issue._id}
                        className="transition hover:bg-slate-50"
                      >

                        {/* BOOK */}

                        <td className="px-6 py-5">

                          <div className="font-semibold text-slate-800">
                            {book?.title ||
                              "Unknown Book"}
                          </div>

                          <div className="mt-1 text-xs text-slate-500">
                            {book?.author ||
                              "Unknown Author"}
                          </div>

                        </td>

                        {/* ISSUE DATE */}

                        <td className="px-6 py-5 text-sm text-slate-600">
                          {formatDate(
                            issue?.issueDate
                          )}
                        </td>

                        {/* DUE DATE */}

                        <td className="px-6 py-5 text-sm text-slate-600">
                          {formatDate(
                            issue?.dueDate
                          )}
                        </td>

                        {/* STATUS */}

                        <td className="px-6 py-5">

                          <span
                            className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${
                              isReturned
                                ? "border-green-200 bg-green-50 text-green-700"
                                : returnRequested
                                ? "border-yellow-200 bg-yellow-50 text-yellow-700"
                                : "border-blue-200 bg-blue-50 text-blue-700"
                            }`}
                          >
                            {isReturned
                              ? "Returned"
                              : returnRequested
                              ? "Return Requested"
                              : issue?.status ||
                                "Issued"}
                          </span>

                        </td>

                        {/* ACTION */}

                        <td className="px-6 py-5 text-right">

                          {canRequestReturn ? (

                            <button
                              type="button"
                              disabled={returnLoading}
                              onClick={() =>
                                handleRequestReturn(
                                  issue._id
                                )
                              }
                              className="
                                rounded-xl
                                bg-[#890C25]
                                px-4
                                py-2.5
                                text-sm
                                font-bold
                                text-white
                                shadow-md
                                transition
                                hover:bg-[#6f091e]
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                              "
                            >
                              {returnLoading
                                ? "Processing..."
                                : "Request Return"}
                            </button>

                          ) : returnRequested ? (

                            <span className="text-xs font-semibold text-yellow-600">
                              Return Requested
                            </span>

                          ) : isReturned ? (

                            <span className="text-xs font-semibold text-green-600">
                              Returned
                            </span>

                          ) : (

                            <span className="text-xs font-semibold text-slate-400">
                              Receive Book First
                            </span>

                          )}

                        </td>

                      </tr>
                    );
                  })}

                </tbody>

              </table>

            </div>
          </div>
        )}

        {/* =================================================
            MOBILE CARDS
        ================================================= */}

        {books.length > 0 && (
          <div className="space-y-4 md:hidden">

            {books.map((issue) => {

              const book =
                issue?.book || {};

              const isReturned =
                issue?.status
                  ?.toString()
                  .trim()
                  .toLowerCase() ===
                "returned";

              const returnRequested =
                issue?.returnRequested === true;

              const canRequestReturn =
                !isReturned &&
                issue?.received === true &&
                !returnRequested;

              return (
                <div
                  key={issue._id}
                  className="rounded-3xl bg-white p-5 shadow-lg"
                >

                  {/* BOOK */}

                  <div className="mb-5">

                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      Book
                    </p>

                    <h3 className="mt-1 text-lg font-bold text-slate-800">
                      {book?.title ||
                        "Unknown Book"}
                    </h3>

                    <p className="text-sm text-slate-500">
                      {book?.author ||
                        "Unknown Author"}
                    </p>

                  </div>

                  {/* DATES */}

                  <div className="mb-5 grid grid-cols-2 gap-3">

                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-xs text-slate-400">
                        Issue Date
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-700">
                        {formatDate(
                          issue?.issueDate
                        )}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-xs text-slate-400">
                        Due Date
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-700">
                        {formatDate(
                          issue?.dueDate
                        )}
                      </p>
                    </div>

                  </div>

                  {/* STATUS */}

                  <div className="mb-5">

                    <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">
                      Status
                    </p>

                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${
                        isReturned
                          ? "border-green-200 bg-green-50 text-green-700"
                          : returnRequested
                          ? "border-yellow-200 bg-yellow-50 text-yellow-700"
                          : "border-blue-200 bg-blue-50 text-blue-700"
                      }`}
                    >
                      {isReturned
                        ? "Returned"
                        : returnRequested
                        ? "Return Requested"
                        : issue?.status ||
                          "Issued"}
                    </span>

                  </div>

                  {/* ACTION */}

                  {canRequestReturn ? (

                    <button
                      type="button"
                      disabled={returnLoading}
                      onClick={() =>
                        handleRequestReturn(
                          issue._id
                        )
                      }
                      className="
                        w-full
                        rounded-xl
                        bg-[#890C25]
                        px-4
                        py-3
                        text-sm
                        font-bold
                        text-white
                        shadow-md
                        transition
                        hover:bg-[#6f091e]
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                      "
                    >
                      {returnLoading
                        ? "Processing..."
                        : "Request Return"}
                    </button>

                  ) : returnRequested ? (

                    <div className="rounded-xl bg-yellow-50 px-4 py-3 text-center text-xs font-semibold text-yellow-700">
                      Return Request Submitted
                    </div>

                  ) : isReturned ? (

                    <div className="rounded-xl bg-green-50 px-4 py-3 text-center text-xs font-semibold text-green-700">
                      Book Returned
                    </div>

                  ) : (

                    <div className="rounded-xl bg-slate-50 px-4 py-3 text-center text-xs font-semibold text-slate-500">
                      Receive Book First
                    </div>

                  )}

                </div>
              );
            })}

          </div>
        )}

      </div>
    </div>
  );
};

export default MyIssuedBooks;

