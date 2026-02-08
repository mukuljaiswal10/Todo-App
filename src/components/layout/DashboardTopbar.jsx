"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/theme/ThemeToggle";

export default function DashboardTopbar() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    try {
      setLoading(true);
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <header className="sticky top-0 z-30 border-b bg-background/70 backdrop-blur">
      <div className="max-w-6xl mx-auto p-4 sm:px-8 flex items-center justify-between gap-3">
        {/* Left */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-emerald-400 shadow-sm" />
          <div className="leading-tight">
            <div className="font-semibold">Pro Todo</div>
            <div className="text-xs text-muted-foreground">
              Advanced Dashboard
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            variant="outline"
            onClick={handleLogout}
            disabled={loading}
            className="rounded-xl"
          >
            {loading ? "Logging out..." : "Logout"}
          </Button>
        </div>
      </div>
    </header>
  );
}
