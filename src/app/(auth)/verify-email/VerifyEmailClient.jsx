"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function VerifyEmailClient() {
  const sp = useSearchParams();
  const router = useRouter();
  const token = sp.get("token") || "";

  const [status, setStatus] = useState("loading"); // loading | ok | error
  const [msg, setMsg] = useState("");

  useEffect(() => {
    let alive = true;

    async function run() {
      if (!token) {
        setStatus("error");
        setMsg("Token missing.");
        return;
      }

      try {
        const res = await fetch(
          `/api/auth/verify-email?token=${encodeURIComponent(token)}`,
        );
        const data = await res.json().catch(() => ({}));

        if (!res.ok || data?.ok === false)
          throw new Error(data?.message || "Verification failed");

        if (!alive) return;
        setStatus("ok");
        setMsg(data?.message || "Email verified ✅");
        setTimeout(() => router.push("/login"), 1200);
      } catch (e) {
        if (!alive) return;
        setStatus("error");
        setMsg(e?.message || "Verification failed");
      }
    }

    run();
    return () => {
      alive = false;
    };
  }, [token, router]);

  return (
    <main className="min-h-screen grid place-items-center p-4">
      <Card className="w-full max-w-md p-6 sm:p-8">
        <h1 className="text-2xl font-semibold">Verify email</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Completing verification...
        </p>

        <div className="mt-5">
          {status === "loading" ? (
            <p className="text-sm">Verifying...</p>
          ) : status === "ok" ? (
            <p className="text-sm text-green-600">{msg}</p>
          ) : (
            <p className="text-sm text-red-600">{msg}</p>
          )}
        </div>

        <div className="mt-6 flex gap-2">
          <Button asChild variant="outline" className="w-full">
            <Link href="/login">Go to Login</Link>
          </Button>
        </div>
      </Card>
    </main>
  );
}
