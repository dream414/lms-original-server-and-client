import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../api/api";
import { useAuth } from "./AuthContext";

// =====================================================
// USER CONTEXT
// =====================================================

const UserContext = createContext(null);

// =====================================================
// USER PROVIDER
// =====================================================

export const UserProvider = ({ children }) => {
  const { user } = useAuth();

  // ===================================================
  // STATES
  // ===================================================

  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

  // ===================================================
  // FETCH ALL USERS
  // ===================================================

  const fetchUsers = async () => {
    // -----------------------------------------------
    // No logged-in user
    // -----------------------------------------------

    if (!user) {
      setUsers([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.get("/users");

      console.log("USERS RESPONSE:", response.data);

      const fetchedUsers = response.data?.users || [];

      setUsers(fetchedUsers);
    } catch (error) {
      console.error(
        "FETCH USERS ERROR:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
          "Failed to fetch users"
      );

      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // ===================================================
  // FETCH USERS WHEN AUTH USER CHANGES
  // ===================================================

  useEffect(() => {
    if (user) {
      fetchUsers();
    } else {
      setUsers([]);
    }
  }, [user]);

  // ===================================================
  // NORMALIZE ROLE
  // ===================================================

  const normalizeRole = (role) => {
    if (!role) return "";

    return role
      .toString()
      .trim()
      .toLowerCase()
      .replace(/_/g, "-")
      .replace(/\s+/g, "-");
  };

  // ===================================================
  // ROLE BASED USERS
  // ===================================================

  const teachers = users.filter(
    (item) =>
      normalizeRole(item.role) === "teacher"
  );

  const students = users.filter(
    (item) =>
      normalizeRole(item.role) === "student"
  );

  const staff = users.filter(
    (item) =>
      normalizeRole(item.role) === "staff"
  );

  const librarians = users.filter(
    (item) => {
      const role = normalizeRole(item.role);

      return (
        role === "librarian" ||
        role === "library"
      );
    }
  );

  const hods = users.filter(
    (item) =>
      normalizeRole(item.role) === "hod"
  );

  // ===================================================
  // OTHER ROLES
  // ===================================================

  const admins = users.filter(
    (item) => {
      const role = normalizeRole(item.role);

      return (
        role === "admin" ||
        role === "superadmin"
      );
    }
  );

  const accountants = users.filter(
    (item) => {
      const role = normalizeRole(item.role);

      return (
        role === "accountant" ||
        role === "account-1" ||
        role === "account"
      );
    }
  );

  const researchers = users.filter(
    (item) =>
      normalizeRole(item.role) === "researcher"
  );

  const visitors = users.filter(
    (item) =>
      normalizeRole(item.role) === "visitor"
  );

  const digitalUsers = users.filter(
    (item) =>
      normalizeRole(item.role) === "digital"
  );

  // ===================================================
  // GET USERS BY ROLE
  // ===================================================

  const getUsersByRole = (role) => {
    const normalizedRole = normalizeRole(role);

    return users.filter(
      (item) =>
        normalizeRole(item.role) === normalizedRole
    );
  };

  // ===================================================
  // FIND USER BY ID
  // ===================================================

  const getUserById = (id) => {
    if (!id) return null;

    return users.find(
      (item) =>
        item._id === id ||
        item.id === id
    ) || null;
  };

  // ===================================================
  // REFRESH USERS
  // ===================================================

  const refreshUsers = async () => {
    await fetchUsers();
  };

  // ===================================================
  // CONTEXT VALUE
  // ===================================================

  const value = {
    // -----------------------------------------------
    // All Users
    // -----------------------------------------------

    users,

    // -----------------------------------------------
    // Role Based Users
    // -----------------------------------------------

    teachers,
    students,
    staff,
    librarians,
    hods,

    // -----------------------------------------------
    // Other Roles
    // -----------------------------------------------

    admins,
    accountants,
    researchers,
    visitors,
    digitalUsers,

    // -----------------------------------------------
    // Functions
    // -----------------------------------------------

    fetchUsers,
    refreshUsers,
    getUsersByRole,
    getUserById,

    // -----------------------------------------------
    // States
    // -----------------------------------------------

    loading,
    error,
  };

  // ===================================================
  // PROVIDER
  // ===================================================

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

// =====================================================
// useUsers HOOK
// =====================================================

export const useUsers = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error(
      "useUsers must be used inside UserProvider"
    );
  }

  return context;
};