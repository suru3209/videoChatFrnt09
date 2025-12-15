"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";

import { useAuth } from "@/context/AuthContext";
import { VanishForm } from "@/components/ui/skiper-ui/skiper56";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_API_URL + "/api/v1/users" ||
  "http://localhost:8080/api/v1/users";

type Step =
  | "username"
  | "login-password"
  | "signup-name"
  | "signup-email"
  | "signup-password";

export default function AuthPage() {
  const router = useRouter();
  const { login, signup } = useAuth();

  const [step, setStep] = useState<Step>("username");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    username: "",
    password: "",
    name: "",
    email: "",
  });

  /* ----------------------------------
     STEP 1: USERNAME CHECK
  -----------------------------------*/
  const handleUsernameSubmit = async () => {
    if (!form.username.trim()) {
      toast.error("Username is required");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.get(`${API_URL}/checkUsername`, {
        params: { username: form.username },
      });

      if (res.data.exists) {
        setStep("login-password"); // 🔐 LOGIN FLOW
      } else {
        setStep("signup-name"); // 📝 SIGNUP FLOW
      }
    } catch (err) {
      toast.error("Unable to check username");
    } finally {
      setLoading(false);
    }
  };

  /* ----------------------------------
     LOGIN FLOW
  -----------------------------------*/
  const handleLogin = async () => {
    if (!form.password.trim()) {
      toast.error("Password is required");
      return;
    }

    if (form.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    try {
      await login(form.username, form.password);
      router.push("/");
    } catch {}
  };

  /* ----------------------------------
     SIGNUP FLOW
  -----------------------------------*/
  const handleSignup = async () => {
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (!form.email.trim()) {
      toast.error("Email is required");
      return;
    }

    if (!form.password.trim()) {
      toast.error("Password is required");
      return;
    }

    if (form.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    try {
      await signup(form.username, form.name, form.email, form.password);

      // 🔥 AUTO LOGIN AFTER SIGNUP
      await login(form.username, form.password);

      router.push("/");
    } catch {}
  };

  /* ----------------------------------
     UI (ONE INPUT AT A TIME)
  -----------------------------------*/
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FFFFFF]">
      <div className="w-full max-w-xl">
        {step === "username" && (
          <VanishForm
            autoFocus
            placeholder="Username"
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            onSubmit={handleUsernameSubmit}
          />
        )}

        {step === "login-password" && (
          <VanishForm
            autoFocus
            placeholder="Password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            onSubmit={handleLogin}
          />
        )}

        {step === "signup-name" && (
          <VanishForm
            autoFocus
            placeholder="Full Name"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            onSubmit={() => setStep("signup-email")}
          />
        )}

        {step === "signup-email" && (
          <VanishForm
            autoFocus
            placeholder="Email Address"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            onSubmit={() => setStep("signup-password")}
          />
        )}

        {step === "signup-password" && (
          <VanishForm
            autoFocus
            placeholder="Password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            onSubmit={handleSignup}
          />
        )}

        {loading && (
          <p className="mt-4 text-center text-sm opacity-60">
            Checking username…
          </p>
        )}
      </div>
    </div>
  );
}
