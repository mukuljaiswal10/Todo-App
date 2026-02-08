"use client";

import { useState } from "react";
import Link from "next/link";
import AuthCard from "@/components/auth/AuthCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setMsg("");
    try {
      setPending(true);
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "Request failed");
      setMsg(data?.message || "If account exists, reset link sent ✅");
    } catch (e) {
      setErr(e.message || "Request failed");
    } finally {
      setPending(false);
    }
  }

  return (
    <AuthCard
      title="Reset password"
      subtitle="We'll send you a reset link on email"
      footer={
        <div className="text-center">
          <Link className="underline underline-offset-4" href="/login">
            Back to Login
          </Link>
        </div>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        {err ? (
          <div className="text-sm text-red-600 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
            {err}
          </div>
        ) : null}

        {msg ? (
          <div className="text-sm text-emerald-700 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3">
            {msg}
          </div>
        ) : null}

        <div className="space-y-2">
          <label className="text-sm">Email</label>
          <Input
            className="rounded-xl"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            type="email"
            required
          />
        </div>

        <Button className="w-full rounded-xl" disabled={pending}>
          {pending ? "Sending..." : "Send reset link"}
        </Button>
      </form>
    </AuthCard>
  );
}
