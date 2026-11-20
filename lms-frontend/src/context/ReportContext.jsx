
import {
  createContext,
  useContext,
  useState,
} from "react";

import API from "../api/api";

const ReportContext = createContext();

export const ReportProvider = ({ children }) => {
  const [overviewReport, setOverviewReport] =
    useState(null);

  const [usersReport, setUsersReport] =
    useState(null);

  const [booksReport, setBooksReport] =
    useState(null);

  const [issuesReport, setIssuesReport] =
    useState(null);

  const [returnsReport, setReturnsReport] =
    useState(null);

  const [finesReport, setFinesReport] =
    useState(null);

  const [digitalLibraryReport, setDigitalLibraryReport] =
    useState(null);

  const [reports, setReports] =
    useState([]);

  const [currentReport, setCurrentReport] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  // =====================================================
  // GET OVERVIEW REPORT
  // =====================================================

  const getOverviewReport = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get(
        "/reports/overview"
      );

      setOverviewReport(
        response.data?.report || null
      );

      return response.data;
    } catch (error) {
      console.error(
        "Get overview report error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load overview report."
      );

      return null;
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // GET USERS REPORT
  // =====================================================

  const getUsersReport = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get(
        "/reports/users"
      );

      setUsersReport(
        response.data || null
      );

      return response.data;
    } catch (error) {
      console.error(
        "Get users report error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load users report."
      );

      return null;
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // GET BOOKS REPORT
  // =====================================================

  const getBooksReport = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get(
        "/reports/books"
      );

      setBooksReport(
        response.data || null
      );

      return response.data;
    } catch (error) {
      console.error(
        "Get books report error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load books report."
      );

      return null;
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // GET ISSUES REPORT
  // =====================================================

  const getIssuesReport = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get(
        "/reports/issues"
      );

      setIssuesReport(
        response.data || null
      );

      return response.data;
    } catch (error) {
      console.error(
        "Get issues report error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load issues report."
      );

      return null;
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // GET RETURNS REPORT
  // =====================================================

  const getReturnsReport = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get(
        "/reports/returns"
      );

      setReturnsReport(
        response.data || null
      );

      return response.data;
    } catch (error) {
      console.error(
        "Get returns report error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load returns report."
      );

      return null;
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // GET FINES REPORT
  // =====================================================

  const getFinesReport = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get(
        "/reports/fines"
      );

      setFinesReport(
        response.data || null
      );

      return response.data;
    } catch (error) {
      console.error(
        "Get fines report error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load fines report."
      );

      return null;
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // GET DIGITAL LIBRARY REPORT
  // =====================================================

  const getDigitalLibraryReport =
    async () => {
      try {
        setLoading(true);
        setError("");

        const response = await API.get(
          "/reports/digital-library"
        );

        setDigitalLibraryReport(
          response.data || null
        );

        return response.data;
      } catch (error) {
        console.error(
          "Get digital library report error:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load digital library report."
        );

        return null;
      } finally {
        setLoading(false);
      }
    };

  // =====================================================
  // GET SAVED REPORTS
  // =====================================================

  const getReports = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get(
        "/reports"
      );

      setReports(
        response.data?.reports || []
      );

      return response.data;
    } catch (error) {
      console.error(
        "Get reports error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load reports."
      );

      return null;
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // GET SINGLE REPORT
  // =====================================================

  const getReportById = async (id) => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get(
        `/reports/${id}`
      );

      setCurrentReport(
        response.data?.report || null
      );

      return response.data;
    } catch (error) {
      console.error(
        "Get report by ID error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load report."
      );

      return null;
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // CREATE / SAVE REPORT
  // =====================================================

  const createReport = async (reportData) => {
    try {
      setLoading(true);
      setError("");

      const response = await API.post(
        "/reports",
        reportData
      );

      if (response.data?.report) {
        setReports((prev) => [
          response.data.report,
          ...prev,
        ]);
      }

      return response.data;
    } catch (error) {
      console.error(
        "Create report error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to save report."
      );

      return null;
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // DELETE REPORT
  // =====================================================

  const deleteReport = async (id) => {
    try {
      setLoading(true);
      setError("");

      const response = await API.delete(
        `/reports/${id}`
      );

      setReports((prev) =>
        prev.filter(
          (report) =>
            report._id !== id
        )
      );

      if (
        currentReport?._id === id
      ) {
        setCurrentReport(null);
      }

      return response.data;
    } catch (error) {
      console.error(
        "Delete report error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to delete report."
      );

      return null;
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // CLEAR ERROR
  // =====================================================

  const clearError = () => {
    setError("");
  };

  return (
    <ReportContext.Provider
      value={{
        overviewReport,
        usersReport,
        booksReport,
        issuesReport,
        returnsReport,
        finesReport,
        digitalLibraryReport,

        reports,
        currentReport,

        loading,
        error,

        getOverviewReport,
        getUsersReport,
        getBooksReport,
        getIssuesReport,
        getReturnsReport,
        getFinesReport,
        getDigitalLibraryReport,

        getReports,
        getReportById,

        createReport,
        deleteReport,

        clearError,
      }}
    >
      {children}
    </ReportContext.Provider>
  );
};

export const useReports = () => {
  const context = useContext(
    ReportContext
  );

  if (!context) {
    throw new Error(
      "useReports must be used inside ReportProvider"
    );
  }

  return context;
};

