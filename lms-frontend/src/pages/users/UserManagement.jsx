import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useUsers } from "../../context/UserContext";
import api from "../../api/api";

const UserManagement = () => {
  const { user } = useAuth();
    const { refreshUsers } = useUsers();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =====================================================
  // ROLES
  // =====================================================

  const roles = [
    "student",
    "teacher",
    "admin",
    "librarian",
    "superadmin",
    "hod",
    "staff",
    "visitor",
    "accountant",
    "researcher",
    "digital",
    "library",
  ];

  // =====================================================
  // LOAD USERS
  // =====================================================

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/users");

      console.log("USERS RESPONSE:", response.data);

      setUsers(response.data.users || []);
    } catch (error) {
      console.error(
        "GET USERS ERROR:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
          "Unable to load users."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // =====================================================
  // CHANGE ROLE
  // =====================================================

//   const handleRoleChange = async (userId, newRole) => {
//     try {
//       setActionLoading(userId);
//       setError("");
//       setSuccess("");

//       const response = await api.put(
//         `/users/change-role/${userId}`,
//         {
//           role: newRole,
//         }
//       );

//       console.log("ROLE UPDATE RESPONSE:", response.data);

//       setUsers((previousUsers) =>
//         previousUsers.map((item) =>
//           item._id === userId
//             ? response.data.user
//             : item
//         )
//       );

//       setSuccess("User role updated successfully.");
//     } catch (error) {
//       console.error(
//         "CHANGE ROLE ERROR:",
//         error.response?.data || error.message
//       );

//       setError(
//         error.response?.data?.message ||
//           "Unable to change user role."
//       );
//     } finally {
//       setActionLoading("");
//     }
//   };
const handleRoleChange = async (userId, newRole) => {
  try {
    setActionLoading(userId);
    setError("");
    setSuccess("");

    const response = await api.put(
      `/users/change-role/${userId}`,
      {
        role: newRole,
      }
    );

    console.log("ROLE UPDATE RESPONSE:", response.data);

    // ============================================
    // UPDATE LOCAL USER MANAGEMENT LIST
    // ============================================

    setUsers((previousUsers) =>
      previousUsers.map((item) =>
        item._id === userId
          ? response.data.user
          : item
      )
    );

    // ============================================
    // IMPORTANT:
    // UPDATE GLOBAL USER CONTEXT
    // ============================================

    await refreshUsers();

    setSuccess("User role updated successfully.");

  } catch (error) {
    console.error(
      "CHANGE ROLE ERROR:",
      error.response?.data || error.message
    );

    setError(
      error.response?.data?.message ||
        "Unable to change user role."
    );
  } finally {
    setActionLoading("");
  }
};

  // =====================================================
  // DELETE USER
  // =====================================================

  const handleDelete = async (userId, userName) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${
        userName || "this user"
      }?`
    );

    if (!confirmed) return;

    try {
      setActionLoading(userId);
      setError("");
      setSuccess("");

      const response = await api.delete(
        `/users/${userId}`
      );

      console.log("DELETE USER RESPONSE:", response.data);

      setUsers((previousUsers) =>
        previousUsers.filter(
          (item) => item._id !== userId
        )
      );

      setSuccess("User deleted successfully.");
    } catch (error) {
      console.error(
        "DELETE USER ERROR:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
          "Unable to delete user."
      );
    } finally {
      setActionLoading("");
    }
  };

  // =====================================================
  // ROLE BADGE
  // =====================================================

  const getRoleBadge = (role) => {
    const normalizedRole = role?.toLowerCase();

    if (normalizedRole === "superadmin") {
      return "bg-[#890C25] text-white";
    }

    if (normalizedRole === "admin") {
      return "bg-blue-600 text-white";
    }

    if (normalizedRole === "student") {
      return "bg-slate-700 text-white";
    }

    return "bg-slate-200 text-slate-700";
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 p-6">
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[#890C25] border-t-transparent" />

            <p className="mt-4 font-semibold text-slate-600">
              Loading users...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen bg-slate-100 px-4 pb-8 pt-10 sm:px-6 sm:pt-12 lg:px-8 lg:pt-14">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="mx-auto mb-7 max-w-7xl overflow-hidden rounded-3xl bg-[#890C25] shadow-2xl">

        <div className="relative p-6 sm:p-8">

          {/* Decorative Circles */}

          <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full border border-white/20 bg-white/5" />

          <div className="absolute -bottom-24 left-1/3 h-56 w-56 rounded-full border border-white/10 bg-white/5" />

          <div className="absolute right-20 top-10 h-16 w-16 rounded-full bg-[#D58A98]/10 blur-xl" />

          <div className="relative">

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#D58A98]">
              Super Admin
            </p>

            <h1 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
              User Management
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-white/75 sm:text-base">
              Manage LMS users, roles and account access from one place.
            </p>

          </div>
        </div>
      </div>

      {/* =================================================
          ALERTS
      ================================================= */}

      {error && (
        <div className="mx-auto mb-5 max-w-7xl rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700 shadow-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="mx-auto mb-5 max-w-7xl rounded-2xl border border-[#D58A98] bg-[#D58A98]/20 px-5 py-4 text-sm font-semibold text-[#890C25] shadow-sm">
          {success}
        </div>
      )}

      {/* =================================================
          STAT CARDS
      ================================================= */}

      <div className="mx-auto mb-7 grid max-w-7xl gap-5 sm:grid-cols-2 lg:grid-cols-4">

        {/* TOTAL USERS */}

        <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl">

          <div className="absolute right-0 top-0 h-2 w-20 rounded-bl-full bg-[#890C25]" />

          <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-[#890C25]/10 transition group-hover:scale-125" />

          <div className="relative">

            <div className="mb-3 flex items-center justify-between">

              <p className="text-sm font-semibold text-slate-500">
                Total Users
              </p>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#890C25]/10 text-lg text-[#890C25]">
                👥
              </div>

            </div>

            <p className="text-3xl font-extrabold text-[#890C25]">
              {users.length}
            </p>

            <div className="mt-3 h-1 w-16 rounded-full bg-[#890C25]" />

          </div>
        </div>

        {/* SUPER ADMINS */}

        <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl">

          <div className="absolute left-0 top-0 h-2 w-20 rounded-br-full bg-[#890C25]" />

          <div className="absolute -bottom-10 -right-10 h-24 w-24 rounded-full bg-[#890C25]/10 transition group-hover:scale-125" />

          <div className="relative">

            <div className="mb-3 flex items-center justify-between">

              <p className="text-sm font-semibold text-slate-500">
                Super Admins
              </p>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#890C25] text-lg text-white shadow-md">
                ★
              </div>

            </div>

            <p className="text-3xl font-extrabold text-[#890C25]">
              {
                users.filter(
                  (item) => item.role === "superadmin"
                ).length
              }
            </p>

            <div className="mt-3 h-1 w-16 rounded-full bg-[#890C25]" />

          </div>
        </div>

        {/* ADMINS */}

        <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl">

          <div className="absolute right-0 top-0 h-2 w-20 rounded-bl-full bg-blue-600" />

          <div className="absolute -bottom-10 -left-10 h-24 w-24 rounded-full bg-[#890C25]/10 transition group-hover:scale-125" />

          <div className="relative">

            <div className="mb-3 flex items-center justify-between">

              <p className="text-sm font-semibold text-slate-500">
                Admins
              </p>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-lg text-white shadow-md">
                🛡
              </div>

            </div>

            <p className="text-3xl font-extrabold text-blue-600">
              {
                users.filter(
                  (item) => item.role === "admin"
                ).length
              }
            </p>

            <div className="mt-3 h-1 w-16 rounded-full bg-[#890C25]" />

          </div>
        </div>

        {/* ACTIVE USERS */}

        <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl">

          <div className="absolute bottom-0 right-0 h-2 w-20 rounded-tl-full bg-[#890C25]" />

          <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-[#890C25]/10 transition group-hover:scale-125" />

          <div className="relative">

            <div className="mb-3 flex items-center justify-between">

              <p className="text-sm font-semibold text-slate-500">
                Active Users
              </p>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-lg text-green-600">
                ●
              </div>

            </div>

            <p className="text-3xl font-extrabold text-slate-700">
              {
                users.filter(
                  (item) =>
                    item.status === "active"
                ).length
              }
            </p>

            <div className="mt-3 h-1 w-16 rounded-full bg-[#890C25]" />

          </div>
        </div>

      </div>

      {/* =================================================
          USERS TABLE
      ================================================= */}

      <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl border-2 border-[#890C25]/30 bg-white shadow-2xl">

        {/* TABLE HEADER */}

        <div className="flex flex-col gap-3 border-b-2 border-[#890C25]/20 bg-slate-50 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <div className="flex items-center gap-3">

              <div className="h-9 w-1.5 rounded-full bg-[#890C25]" />

              <h2 className="text-xl font-extrabold text-slate-800">
                All Users
              </h2>

            </div>

            <p className="mt-1 pl-4 text-sm text-slate-500">
              View and manage registered LMS accounts.
            </p>

          </div>

          <button
            type="button"
            onClick={fetchUsers}
            className="
              rounded-xl
              bg-[#890C25]
              px-5
              py-2.5
              text-sm
              font-bold
              text-white
              shadow-md
              transition
              hover:bg-[#6f091e]
              hover:shadow-lg
              active:scale-95
            "
          >
            Refresh Users
          </button>

        </div>

        {/* DESKTOP TABLE */}

        <div className="hidden overflow-x-auto lg:block">

          <table className="w-full">

            <thead>

              <tr className="border-b-2 border-[#890C25]/20 bg-slate-100">

                <th className="px-5 py-4 text-left text-xs font-extrabold uppercase tracking-wider text-[#890C25]">
                  User
                </th>

                <th className="px-5 py-4 text-left text-xs font-extrabold uppercase tracking-wider text-[#890C25]">
                  Email
                </th>

                <th className="px-5 py-4 text-left text-xs font-extrabold uppercase tracking-wider text-[#890C25]">
                  Role
                </th>

                <th className="px-5 py-4 text-left text-xs font-extrabold uppercase tracking-wider text-[#890C25]">
                  Status
                </th>

                <th className="px-5 py-4 text-right text-xs font-extrabold uppercase tracking-wider text-[#890C25]">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {users.map((item) => {

                const isCurrentUser =
                  item._id === user?._id;

                const isActionLoading =
                  actionLoading === item._id;

                return (
                  <tr
                    key={item._id}
                    className="
                      border-b
                      border-slate-200
                      transition
                      hover:bg-[#890C25]/[0.04]
                    "
                  >

                    {/* USER */}

                    <td className="px-5 py-4">

                      <div className="flex items-center gap-3">

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#890C25] font-bold text-white shadow-md">
                          {item.name
                            ?.charAt(0)
                            ?.toUpperCase() || "U"}
                        </div>

                        <div>

                          <p className="font-bold text-slate-800">
                            {item.name || "Unnamed User"}
                          </p>

                          {isCurrentUser && (
                            <span className="text-xs font-semibold text-[#890C25]">
                              You
                            </span>
                          )}

                        </div>

                      </div>

                    </td>

                    {/* EMAIL */}

                    <td className="px-5 py-4 text-sm font-medium text-slate-600">
                      {item.email}
                    </td>

                    {/* ROLE */}

                    <td className="px-5 py-4">

                      {isCurrentUser ? (

                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${getRoleBadge(
                            item.role
                          )}`}
                        >
                          {item.role}
                        </span>

                      ) : (

                        <select
                          value={item.role || ""}
                          disabled={isActionLoading}
                          onChange={(e) =>
                            handleRoleChange(
                              item._id,
                              e.target.value
                            )
                          }
                          className="
                            rounded-xl
                            border
                            border-slate-300
                            bg-white
                            px-3
                            py-2
                            text-sm
                            font-semibold
                            text-slate-700
                            outline-none
                            transition
                            focus:border-[#890C25]
                            focus:ring-2
                            focus:ring-[#890C25]/20
                          "
                        >

                          {roles.map((role) => (

                            <option
                              key={role}
                              value={role}
                            >
                              {role}
                            </option>

                          ))}

                        </select>

                      )}

                    </td>

                    {/* STATUS */}

                    <td className="px-5 py-4">

                      <span
                        className={`
                          inline-flex
                          rounded-full
                          px-3
                          py-1
                          text-xs
                          font-bold
                          ${
                            item.status === "active"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }
                        `}
                      >
                        {item.status || "unknown"}
                      </span>

                    </td>

                    {/* ACTIONS */}

                    <td className="px-5 py-4 text-right">

                      {!isCurrentUser && (
                        <button
                          type="button"
                          disabled={isActionLoading}
                          onClick={() =>
                            handleDelete(
                              item._id,
                              item.name
                            )
                          }
                          className="
                            rounded-xl
                            bg-red-600
                            px-4
                            py-2
                            text-xs
                            font-bold
                            text-white
                            shadow-md
                            transition
                            hover:bg-red-700
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                          "
                        >
                          {isActionLoading
                            ? "Processing..."
                            : "Delete"}
                        </button>
                      )}

                    </td>

                  </tr>
                );
              })}

            </tbody>

          </table>

        </div>

        {/* MOBILE CARDS */}

        <div className="space-y-4 p-4 lg:hidden">

          {users.map((item) => {

            const isCurrentUser =
              item._id === user?._id;

            const isActionLoading =
              actionLoading === item._id;

            return (
              <div
                key={item._id}
                className="
                  rounded-2xl
                  border-2
                  border-[#890C25]/20
                  bg-slate-50
                  p-4
                  shadow-sm
                "
              >

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#890C25] font-bold text-white">
                    {item.name
                      ?.charAt(0)
                      ?.toUpperCase() || "U"}
                  </div>

                  <div className="min-w-0">

                    <p className="truncate font-bold text-slate-800">
                      {item.name || "Unnamed User"}
                    </p>

                    <p className="truncate text-sm text-slate-500">
                      {item.email}
                    </p>

                  </div>

                </div>

                <div className="mt-4 grid gap-3">

                  <div>

                    <label className="mb-1 block text-xs font-bold uppercase text-slate-500">
                      Role
                    </label>

                    {isCurrentUser ? (

                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${getRoleBadge(
                          item.role
                        )}`}
                      >
                        {item.role}
                      </span>

                    ) : (

                      <select
                        value={item.role || ""}
                        disabled={isActionLoading}
                        onChange={(e) =>
                          handleRoleChange(
                            item._id,
                            e.target.value
                          )
                        }
                        className="
                          w-full
                          rounded-xl
                          border
                          border-slate-300
                          bg-white
                          px-3
                          py-2
                          text-sm
                          font-semibold
                          outline-none
                          focus:border-[#890C25]
                        "
                      >

                        {roles.map((role) => (

                          <option
                            key={role}
                            value={role}
                          >
                            {role}
                          </option>

                        ))}

                      </select>

                    )}

                  </div>

                  <div>

                    <label className="mb-1 block text-xs font-bold uppercase text-slate-500">
                      Status
                    </label>

                    <span
                      className={`
                        inline-flex
                        rounded-full
                        px-3
                        py-1
                        text-xs
                        font-bold
                        ${
                          item.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }
                      `}
                    >
                      {item.status || "unknown"}
                    </span>

                  </div>

                  {!isCurrentUser && (
                    <button
                      type="button"
                      disabled={isActionLoading}
                      onClick={() =>
                        handleDelete(
                          item._id,
                          item.name
                        )
                      }
                      className="
                        w-full
                        rounded-xl
                        bg-red-600
                        px-4
                        py-2.5
                        text-sm
                        font-bold
                        text-white
                        shadow-md
                        hover:bg-red-700
                        disabled:opacity-50
                      "
                    >
                      {isActionLoading
                        ? "Processing..."
                        : "Delete User"}
                    </button>
                  )}

                </div>

              </div>
            );
          })}

        </div>

        {/* EMPTY */}

        {users.length === 0 && (
          <div className="px-6 py-16 text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#890C25]/10 text-2xl text-[#890C25]">
              👤
            </div>

            <h3 className="mt-4 text-lg font-bold text-slate-800">
              No Users Found
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              There are currently no users in the system.
            </p>

          </div>
        )}

      </div>

    </div>
  );
};

export default UserManagement;

