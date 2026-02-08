"use client";

import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

export default function DashboardTopbar({ onOpenMobile }) {
  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    } finally {
      window.location.href = "/login";
    }
  }

  return (
    <header
      className="
        sticky top-3 z-30
        rounded-2xl border bg-background/70
        px-3 py-3
        backdrop-blur-xl
        shadow-sm
      "
    >
      <div className="flex items-center justify-between gap-3">
        {/* Left */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobile}
            className="md:hidden rounded-xl border px-3 py-2 text-sm hover:bg-muted transition active:scale-[0.98]"
            aria-label="Open menu"
          >
            ☰
          </button>

          <Link href="/dashboard" className="group flex items-center gap-2">
            <div
              className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-emerald-400 shadow-sm transition 
            group-hover:scale-[1.03]"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-emerald-500 text-white shadow-lg">
                ✓
              </span>
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold ms-2">Pro Todo</div>
              <div className="text-xs text-muted-foreground ms-2">
                Advanced Dashboard
              </div>
            </div>
          </Link>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          {/* ✅ Theme Toggle on Dashboard */}
          <div className="rounded-xl border bg-background/60 px-2 py-1">
            <ThemeToggle />
          </div>

          <button
            onClick={handleLogout}
            className="
              rounded-xl border px-4 py-2 text-sm
              hover:bg-muted transition
              active:scale-[0.98]
            "
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
