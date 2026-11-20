import { createContext, useContext, useState } from "react";
import api from "../api/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
 
  // =====================================
  // LOGIN
  // =====================================

  const login = async (email, password) => {
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      console.log("LOGIN RESPONSE:", response.data);

      const loggedInUser = response.data.user;

      setUser(loggedInUser);

      return response.data;
    } catch (error) {
      console.error(
        "LOGIN ERROR:",
        error.response?.data || error.message
      );

      throw error;
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // REGISTER
  // =====================================

  const register = async (name, email, password) => {
    setLoading(true);

    try {
      const response = await api.post("/auth/register", {
        name,
        email,
        password,
      });

      console.log("REGISTER RESPONSE:", response.data);

      const registeredUser = response.data.user;

      setUser(registeredUser);

      return response.data;
    } catch (error) {
      console.error(
        "REGISTER ERROR:",
        error.response?.data || error.message
      );

      throw error;
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // LOGOUT
  // =====================================

  const logout = async () => {
    try {
      setLoading(true);

      await api.post("/auth/logout");

      setUser(null);
    } catch (error) {
      console.error(
        "LOGOUT ERROR:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// =====================================
// useAuth
// =====================================

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};