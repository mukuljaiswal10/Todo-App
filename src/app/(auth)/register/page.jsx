"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthCard from "@/components/auth/AuthCard";

function EyeIcon({ open }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      className="opacity-80"
    >
      {open ? (
        <>
          <path
            d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
            stroke="currentColor"
            strokeWidth="2"
          />
        </>
      ) : (
        <>
          <path
            d="M3 3l18 18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M10.6 10.6A2 2 0 0 0 12 14a2 2 0 0 0 1.4-.6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M6.2 6.2C3.9 8 2 12 2 12s3.5 7 10 7c2 0 3.7-.6 5.1-1.4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M9.9 4.2C10.6 4.1 11.3 4 12 4c6.5 0 10 8 10 8s-1.2 2.7-3.4 5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </>
      )}
    </svg>
  );
}

export default function RegisterPage() {
  const [loading, setLoading] = useState(false); // register submit
  const [resendLoading, setResendLoading] = useState(false); // resend verify

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // msg: { type: "success" | "error" | "info", text: string }
  const [msg, setMsg] = useState({ type: "", text: "" });

  // backend says verification needed
  const [needsVerification, setNeedsVerification] = useState(false);

  const emailNormalized = useMemo(() => {
    return String(form.email || "")
      .trim()
      .toLowerCase();
  }, [form.email]);

  function setField(key, val) {
    setForm((p) => ({ ...p, [key]: val }));
  }

  async function handleResendVerification() {
    setMsg({ type: "", text: "" });

    if (!emailNormalized) {
      setMsg({
        type: "error",
        text: "Email missing. Please enter your email.",
      });
      return;
    }

    try {
      setResendLoading(true);

      const res = await fetch("/api/auth/resend-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailNormalized }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || data?.ok === false) {
        throw new Error(
          data?.message || "Failed to resend verification email.",
        );
      }

      setMsg({
        type: "success",
        text: data?.message || "Verification email sent ✅ Please check inbox.",
      });
    } catch (err) {
      setMsg({ type: "error", text: err?.message || "Something went wrong" });
    } finally {
      setResendLoading(false);
    }
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (loading || resendLoading) return;

    setMsg({ type: "", text: "" });
    setNeedsVerification(false);

    const name = String(form.name || "").trim();
    const email = emailNormalized;
    const password = String(form.password || "");
    const confirmPassword = String(form.confirmPassword || "");

    if (!name) return setMsg({ type: "error", text: "Name is required." });
    if (!email) return setMsg({ type: "error", text: "Email is required." });
    if (!password)
      return setMsg({ type: "error", text: "Password is required." });
    if (password.length < 6) {
      return setMsg({
        type: "error",
        text: "Password must be at least 6 characters.",
      });
    }
    if (password !== confirmPassword) {
      return setMsg({ type: "error", text: "Passwords do not match." });
    }

    try {
      setLoading(true);

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || data?.ok === false) {
        throw new Error(data?.message || "Registration failed");
      }

      // ✅ flexible backend flags
      const verifyNeeded =
        data?.needsVerification === true ||
        data?.requireEmailVerify === true ||
        data?.verified === false ||
        data?.isEmailVerified === false;

      if (verifyNeeded) {
        setNeedsVerification(true);
        setMsg({
          type: "info",
          text:
            data?.message ||
            "Registration pending ✅ Please verify your email to activate account.",
        });
        return;
      }

      setMsg({
        type: "success",
        text: data?.message || "Account created ✅ Now you can login.",
      });

      setTimeout(() => {
        window.location.href = "/login";
      }, 800);
    } catch (err) {
      setMsg({ type: "error", text: err?.message || "Something went wrong" });
    } finally {
      setLoading(false);
    }
  }

  const disableForm = loading || resendLoading || needsVerification;

  return (
    <AuthCard
      title="Create your account"
      subtitle="Start managing tasks like a pro."
      footer={
        <div className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-foreground underline underline-offset-4 hover:opacity-90"
          >
            Login
          </Link>
        </div>
      }
    >
      {msg.text ? (
        <div
          className={[
            "mb-4 rounded-xl border px-3 py-2 text-sm",
            msg.type === "success"
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
              : msg.type === "info"
                ? "border-yellow-500/30 bg-yellow-500/10 text-yellow-200"
                : "border-red-500/30 bg-red-500/10 text-red-200",
          ].join(" ")}
        >
          {msg.text}
        </div>
      ) : null}

      {/* ✅ Verification pending UI */}
      {needsVerification ? (
        <div className="mb-4 rounded-xl border border-white/10 bg-background/40 p-3">
          <div className="text-sm">
            Email verification pending. Inbox check karo (Spam bhi).{" "}
            <span className="text-muted-foreground">
              ({emailNormalized || "your email"})
            </span>
          </div>

          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleResendVerification}
              disabled={resendLoading}
            >
              {resendLoading ? "Sending..." : "Resend verification email"}
            </Button>

            <Button asChild className="w-full">
              <Link href="/login">Go to Login</Link>
            </Button>
          </div>
        </div>
      ) : null}

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            placeholder="Mukul Jaiswal"
            value={form.name}
            onChange={(e) => setField("name", e.target.value)}
            autoComplete="name"
            disabled={disableForm}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="mukul@gmail.com"
            value={form.email}
            onChange={(e) => setField("email", e.target.value)}
            autoComplete="email"
            disabled={disableForm}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPass ? "text" : "password"}
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setField("password", e.target.value)}
              autoComplete="new-password"
              className="pr-10"
              disabled={disableForm}
            />
            <button
              type="button"
              onClick={() => setShowPass((p) => !p)}
              className="absolute inset-y-0 right-2 flex items-center justify-center px-2 text-muted-foreground hover:text-foreground disabled:opacity-50"
              aria-label="Toggle password visibility"
              disabled={disableForm}
            >
              <EyeIcon open={showPass} />
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirm ? "text" : "password"}
              placeholder="••••••••"
              value={form.confirmPassword}
              onChange={(e) => setField("confirmPassword", e.target.value)}
              autoComplete="new-password"
              className="pr-10"
              disabled={disableForm}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((p) => !p)}
              className="absolute inset-y-0 right-2 flex items-center justify-center px-2 text-muted-foreground hover:text-foreground disabled:opacity-50"
              aria-label="Toggle confirm password visibility"
              disabled={disableForm}
            >
              <EyeIcon open={showConfirm} />
            </button>
          </div>
        </div>

        <Button className="w-full" disabled={loading || resendLoading}>
          {loading ? "Creating..." : "Create account"}
        </Button>

        <p className="text-xs text-muted-foreground">
          By creating an account, you agree to our{" "}
          <span className="underline underline-offset-4">Terms</span> and{" "}
          <span className="underline underline-offset-4">Privacy Policy</span>.
        </p>
      </form>
    </AuthCard>
  );
}
