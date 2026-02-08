"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import AuthCard from "@/components/auth/AuthCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function EyeIcon(props) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function EyeOffIcon(props) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M3 3l18 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M10.6 10.6A3 3 0 0 0 12 15a3 3 0 0 0 2.4-4.4"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M6.7 6.7C4 8.7 2 12 2 12s3.5 7 10 7c2 0 3.7-.5 5.2-1.3"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M9.9 5.2C10.6 5.1 11.3 5 12 5c6.5 0 10 7 10 7s-1.2 2.4-3.4 4.3"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

function normalizeEmail(v) {
  return String(v || "")
    .trim()
    .toLowerCase();
}

export default function LoginPage() {
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Controlled inputs (needed for resend)
  const [email, setEmail] = useState("");
  const emailNormalized = useMemo(() => normalizeEmail(email), [email]);
  const [password, setPassword] = useState("");

  const [remember, setRemember] = useState(true);

  const [err, setErr] = useState("");
  const [info, setInfo] = useState(""); // success/info banner
  const [needVerify, setNeedVerify] = useState(false);
  const [resending, setResending] = useState(false);

  async function handleResendVerification() {
    setErr("");
    setInfo("");

    if (!emailNormalized) {
      setErr("Please enter your email first, then click resend.");
      return;
    }

    try {
      setResending(true);

      const res = await fetch("/api/auth/resend-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailNormalized }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || data?.ok === false) {
        setErr(data?.message || "Failed to resend verification email.");
        return;
      }

      setInfo(data?.message || "Verification email sent ✅ Check inbox/spam.");
    } catch (e) {
      setErr("Network error while resending. Please try again.");
    } finally {
      setResending(false);
    }
  }

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setInfo("");
    setNeedVerify(false);

    const emailVal = emailNormalized;
    const passVal = String(password || "");

    if (!emailVal || !passVal) {
      setErr("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailVal,
          password: passVal,
          remember: Boolean(remember),
        }),
      });

      const data = await res.json().catch(() => ({}));

      // ✅ Email not verified UX
      if (res.status === 403 && data?.code === "EMAIL_NOT_VERIFIED") {
        setNeedVerify(true);
        setErr(data?.message || "Please verify your email first.");
        return;
      }

      if (!res.ok || data?.ok === false) {
        setErr(data?.message || "Login failed. Check your credentials.");
        return;
      }

      window.location.href = "/dashboard";
    } catch (e) {
      setErr("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard
      title="Login"
      subtitle="Welcome back! Please enter your details."
      footer={
        <div className="flex items-center justify-between">
          <span>
            New here?{" "}
            <Link className="underline underline-offset-4" href="/register">
              Create account
            </Link>
          </span>
          <Link
            className="underline underline-offset-4"
            href="/forgot-password"
          >
            Forgot password?
          </Link>
        </div>
      }
    >
      {/* ✅ Email not verified banner + resend */}
      {needVerify ? (
        <div className="mb-4 rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-200">
          <div className="font-medium">Email verification required</div>
          <div className="mt-1 opacity-90">
            Please verify your email to continue. If you didn’t get the email,
            resend it.
          </div>

          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              className="w-full rounded-xl"
              onClick={handleResendVerification}
              disabled={resending}
            >
              {resending ? "Sending..." : "Resend verification email"}
            </Button>

            <Button asChild className="w-full rounded-xl">
              <Link href="/register">Change email</Link>
            </Button>
          </div>
        </div>
      ) : null}

      {/* ✅ Error banner */}
      {err ? (
        <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {err}
        </div>
      ) : null}

      {/* ✅ Info banner */}
      {info ? (
        <div className="mb-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          {info}
        </div>
      ) : null}

      <form onSubmit={onSubmit} className="space-y-4">
        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              className="h-11 rounded-xl bg-background/60"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPass ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="current-password"
              className="h-11 rounded-xl bg-background/60 pr-12"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPass((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-muted-foreground hover:text-foreground"
              aria-label={showPass ? "Hide password" : "Show password"}
            >
              {showPass ? <EyeOffIcon /> : <EyeIcon />}
            </button>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>
        </div>

        {/* Remember + Link */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <input
              id="remember"
              name="remember"
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4"
            />
            <label htmlFor="remember" className="text-sm text-muted-foreground">
              Remember me
            </label>
          </div>

          <Link
            href="/forgot-password"
            className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          className="h-11 w-full rounded-xl"
          disabled={loading}
        >
          {loading ? "Login..." : "Login"}
        </Button>

        {/* Divider */}
        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-background/70 px-3 text-xs text-muted-foreground">
              Secure login • JWT cookies
            </span>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          By continuing, you agree to our{" "}
          <span className="underline underline-offset-4">Terms</span> and{" "}
          <span className="underline underline-offset-4">Privacy Policy</span>.
        </p>
      </form>
    </AuthCard>
  );
}
