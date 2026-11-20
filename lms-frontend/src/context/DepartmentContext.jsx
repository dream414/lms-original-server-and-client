import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../api/api";

// =====================================================
// CREATE CONTEXT
// =====================================================

const DepartmentContext = createContext();

// =====================================================
// PROVIDER
// =====================================================

export const DepartmentProvider = ({ children }) => {
  // ===================================================
  // STATE
  // ===================================================

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ===================================================
  // GET ALL DEPARTMENTS
  // ===================================================

  const getDepartments = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/departments");

      const data = response?.data;

      setDepartments(data?.departments || []);

      return data?.departments || [];
    } catch (err) {
      console.error(
        "GET DEPARTMENTS ERROR:",
        err.response?.data || err.message
      );

      const message =
        err.response?.data?.message ||
        "Failed to fetch departments";

      setError(message);

      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ===================================================
  // GET SINGLE DEPARTMENT
  // ===================================================

  const getDepartment = useCallback(async (id) => {
    try {
      setError("");

      const response = await api.get(
        `/departments/${id}`
      );

      return response?.data?.department;
    } catch (err) {
      console.error(
        "GET DEPARTMENT ERROR:",
        err.response?.data || err.message
      );

      const message =
        err.response?.data?.message ||
        "Failed to fetch department";

      setError(message);

      throw err;
    }
  }, []);

  // ===================================================
  // CREATE DEPARTMENT
  // ===================================================

  const createDepartment = useCallback(
    async (departmentData) => {
      try {
        setError("");

        const response = await api.post(
          "/departments",
          departmentData
        );

        const newDepartment =
          response?.data?.department;

        // Add newly created department to state
        if (newDepartment) {
          setDepartments((prev) => [
            newDepartment,
            ...prev,
          ]);
        }

        return newDepartment;
      } catch (err) {
        console.error(
          "CREATE DEPARTMENT ERROR:",
          err.response?.data || err.message
        );

        const message =
          err.response?.data?.message ||
          "Failed to create department";

        setError(message);

        throw err;
      }
    },
    []
  );

  // ===================================================
  // UPDATE DEPARTMENT
  // ===================================================

  const updateDepartment = useCallback(
    async (id, departmentData) => {
      try {
        setError("");

        const response = await api.put(
          `/departments/${id}`,
          departmentData
        );

        const updatedDepartment =
          response?.data?.department;

        // Update department inside state
        if (updatedDepartment) {
          setDepartments((prev) =>
            prev.map((department) =>
              department._id === id
                ? updatedDepartment
                : department
            )
          );
        }

        return updatedDepartment;
      } catch (err) {
        console.error(
          "UPDATE DEPARTMENT ERROR:",
          err.response?.data || err.message
        );

        const message =
          err.response?.data?.message ||
          "Failed to update department";

        setError(message);

        throw err;
      }
    },
    []
  );

  // ===================================================
  // DELETE DEPARTMENT
  // ===================================================

  const deleteDepartment = useCallback(
    async (id) => {
      try {
        setError("");

        const response = await api.delete(
          `/departments/${id}`
        );

        // Remove department from state
        setDepartments((prev) =>
          prev.filter(
            (department) =>
              department._id !== id
          )
        );

        return response?.data;
      } catch (err) {
        console.error(
          "DELETE DEPARTMENT ERROR:",
          err.response?.data || err.message
        );

        const message =
          err.response?.data?.message ||
          "Failed to delete department";

        setError(message);

        throw err;
      }
    },
    []
  );

  // ===================================================
  // CLEAR ERROR
  // ===================================================

  const clearError = useCallback(() => {
    setError("");
  }, []);

  // ===================================================
  // LOAD DEPARTMENTS
  // ===================================================

  useEffect(() => {
    getDepartments();
  }, [getDepartments]);

  // ===================================================
  // CONTEXT VALUE
  // ===================================================

  const value = {
    departments,
    loading,
    error,

    getDepartments,
    getDepartment,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    clearError,
  };

  return (
    <DepartmentContext.Provider value={value}>
      {children}
    </DepartmentContext.Provider>
  );
};

// =====================================================
// CUSTOM HOOK
// =====================================================

export const useDepartments = () => {
  const context = useContext(DepartmentContext);

  if (!context) {
    throw new Error(
      "useDepartments must be used inside DepartmentProvider"
    );
  }

  return context;
};

export default DepartmentContext;