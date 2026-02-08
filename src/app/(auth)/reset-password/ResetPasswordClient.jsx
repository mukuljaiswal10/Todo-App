"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import AuthCard from "@/components/auth/AuthCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ResetPasswordClient() {
  const sp = useSearchParams();
  const router = useRouter();
  const token = useMemo(() => sp.get("token") || "", [sp]);

  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setMsg("");

    if (!token) {
      setErr("Token missing. Please open reset link again.");
      return;
    }

    if (!password || password.length < 6) {
      setErr("Password must be at least 6 characters.");
      return;
    }

    try {
      setPending(true);
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "Reset failed");

      setMsg("Password updated ✅ Redirecting to login...");
      setTimeout(() => router.push("/login"), 800);
    } catch (e) {
      setErr(e?.message || "Reset failed");
    } finally {
      setPending(false);
    }
  }

  return (
    <AuthCard
      title="Set new password"
      subtitle="Create a new password for your account"
      footer={
        <div className="text-center">
          <Link className="underline underline-offset-4" href="/login">
            Back to Login
          </Link>
        </div>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        {!token ? (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-600">
            Token missing. Please use the email reset link.
          </div>
        ) : null}

        {err ? (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-600">
            {err}
          </div>
        ) : null}

        {msg ? (
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-700">
            {msg}
          </div>
        ) : null}

        <div className="space-y-2">
          <label className="text-sm">New Password</label>
          <Input
            className="h-11 rounded-xl"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password"
            type="password"
            required
          />
        </div>

        <Button className="h-11 w-full rounded-xl" disabled={pending || !token}>
          {pending ? "Updating..." : "Update password"}
        </Button>
      </form>
    </AuthCard>
  );
}
