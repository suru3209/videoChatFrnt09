"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

// ================= TYPES =================
interface User {
  token: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  signup: (
    username: string,
    name: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
  addToUserHistory: (meetingCode: string) => Promise<void>;
  getHistoryOfUser: () => Promise<any[]>;
}

// ================= CONTEXT =================
const AuthContext = createContext<AuthContextType | null>(null);

// ================= PROVIDER =================
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  // ================= AXIOS INSTANCE =================
  const api = axios.create({
    baseURL:
      process.env.NEXT_PUBLIC_API_URL + "/api/v1/users" ||
      "http://localhost:8080/api/v1/users",
    headers: { "Content-Type": "application/json" },
  });

  // 🔐 Attach token to every request
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // 🔁 Restore login on refresh
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setUser({ token });
  }, []);

  // ================= LOGIN =================
  const login = async (username: string, password: string) => {
    try {
      const res = await api.post("/login", {
        username,
        password,
      });
      console.log("LOGIN RESPONSE 👉", res.data); // ✅ ADD THIS

      localStorage.setItem("token", res.data.token);
      setUser({ token: res.data.token });

      console.log("TOKEN SAVED 👉", res.data.token); // ✅ ADD THIS

      toast.success("Login successful 🎉");
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Invalid username or password"
      );
      throw err;
    }
  };

  // ================= SIGNUP =================
  const signup = async (
    username: string,
    name: string,
    email: string,
    password: string
  ) => {
    try {
      const res = await api.post("/signup", {
        username,
        name,
        email,
        password,
      });

      console.log("LOGIN RESPONSE 👉", res.data); // ✅ ADD THIS

      toast.success("Signup successful ✅ Please login");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Signup failed");
      throw err;
    }
  };

  //addToUserHistory

  const addToUserHistory = async (meetingCode: string) => {
    const token = localStorage.getItem("token");
    if (!token) return; // ✅ guest => skip

    await api.post(
      "/meeting/add",
      { meeting_code: meetingCode },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  };

  //getHistoryOfUser
  const getHistoryOfUser = async () => {
    if (!user?.token) return [];

    const res = await api.get("/meeting/history", {
      params: { token: user.token },
    });

    return res.data || [];
  };

  // ================= LOGOUT =================
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    toast.success("Logged out 👋");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        getHistoryOfUser,
        addToUserHistory,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ================= CUSTOM HOOK =================
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
};
