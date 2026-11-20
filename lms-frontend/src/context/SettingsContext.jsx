import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import API from "../api/api";

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // ========================================
  // Get Settings
  // ========================================

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/settings");

      setSettings(response.data?.data || null);
    } catch (error) {
      console.error(
        "Fetch Settings Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to fetch settings."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // ========================================
  // Update Settings
  // ========================================

  const updateSettings = async (updatedData) => {
    try {
      setUpdating(true);
      setError("");
      setSuccessMessage("");

      const response = await API.put(
        "/settings",
        updatedData
      );

      setSettings(response.data?.data || null);

      setSuccessMessage(
        response.data?.message ||
          "Settings updated successfully."
      );

      return {
        success: true,
        data: response.data?.data || null,
      };
    } catch (error) {
      console.error(
        "Update Settings Error:",
        error
      );

      const message =
        error.response?.data?.message ||
        "Failed to update settings.";

      setError(message);

      return {
        success: false,
        message,
      };
    } finally {
      setUpdating(false);
    }
  };

  // ========================================
  // Clear Messages
  // ========================================

  const clearMessages = () => {
    setError("");
    setSuccessMessage("");
  };

  // ========================================
  // Load Settings
  // ========================================

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        loading,
        updating,
        error,
        successMessage,

        fetchSettings,
        updateSettings,
        clearMessages,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

// ========================================
// Custom Hook
// ========================================

export const useSettings = () => {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error(
      "useSettings must be used within a SettingsProvider"
    );
  }

  return context;
};

export default SettingsContext;