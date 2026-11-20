
import { createContext, useContext, useState } from "react";
import API from "../api/api";

// =====================================================
// CREATE CONTEXT
// =====================================================

const RequestContext = createContext();

// =====================================================
// PROVIDER
// =====================================================

export const RequestProvider = ({ children }) => {
  const [requests, setRequests] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =====================================================
  // STUDENT - CREATE REQUEST
  // =====================================================

  const createRequest = async (requestData) => {
    try {
      setLoading(true);
      setError("");

      const { data } = await API.post(
        "/requests",
        requestData
      );

      return data;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Unable to create book request";

      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // STUDENT - MY REQUESTS
  // =====================================================

  const getMyRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await API.get(
        "/requests/my"
      );

      // Backend may return:
      // [...] 
      // OR
      // { requests: [...] }

      const requestList = Array.isArray(data)
        ? data
        : data?.requests || [];

      setMyRequests(requestList);

      return requestList;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Unable to load your requests";

      setError(message);
      setMyRequests([]);

      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // ADMIN / SUPER ADMIN - GET ALL REQUESTS
  // =====================================================

  const getAllRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await API.get(
        "/requests"
      );

      // Backend may return:
      // [...]
      // OR
      // { requests: [...] }

      const requestList = Array.isArray(data)
        ? data
        : data?.requests || [];

      setRequests(requestList);

      return requestList;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Unable to load book requests";

      setError(message);
      setRequests([]);

      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // APPROVE REQUEST
  // =====================================================

  const approveRequest = async (id) => {
    try {
      setLoading(true);
      setError("");

      // Backend route:
      // PUT /api/requests/:id/approve

      const { data } = await API.put(
        `/requests/${id}/approve`
      );

      // Refresh request list
      await getAllRequests();

      return data;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Unable to approve request";

      setError(message);

      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // REJECT REQUEST
  // =====================================================

  const rejectRequest = async (
    id,
    remarks = ""
  ) => {
    try {
      setLoading(true);
      setError("");

      // Backend route:
      // PUT /api/requests/:id/reject

      const { data } = await API.put(
        `/requests/${id}/reject`,
        {
          remarks,
        }
      );

      // Refresh request list
      await getAllRequests();

      return data;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Unable to reject request";

      setError(message);

      throw new Error(message);
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

  // =====================================================
  // PROVIDER
  // =====================================================

  return (
    <RequestContext.Provider
      value={{
        requests,
        myRequests,
        loading,
        error,

        createRequest,
        getMyRequests,
        getAllRequests,
        approveRequest,
        rejectRequest,
        clearError,
      }}
    >
      {children}
    </RequestContext.Provider>
  );
};

// =====================================================
// CUSTOM HOOK
// =====================================================

export const useRequests = () => {
  const context = useContext(RequestContext);

  if (!context) {
    throw new Error(
      "useRequests must be used inside RequestProvider"
    );
  }

  return context;
};

export default RequestContext;

