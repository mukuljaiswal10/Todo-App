"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

const NavLink = ({ href, label, active, onClick }) => {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition
        ${active ? "bg-muted font-medium text-foreground" : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"}`}
    >
      <span className="inline-block h-2.5 w-2.5 rounded-full bg-gradient-to-br from-indigo-500 to-emerald-500" />
      {label}
    </Link>
  );
};

export default function DashboardShell({ children }) {
  const [open, setOpen] = useState(false);

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  // ✅ URL se current view read
  const currentView = searchParams.get("view") || "all";

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch (e) {
      console.error(e);
    }
  }

  const nav = [
    { key: "all", href: "/dashboard", label: "Dashboard" },
    { key: "today", href: "/dashboard?view=today", label: "Today" },
    { key: "upcoming", href: "/dashboard?view=upcoming", label: "Upcoming" },
    { key: "overdue", href: "/dashboard?view=overdue", label: "Overdue" },
    { key: "completed", href: "/dashboard?view=completed", label: "Completed" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Topbar */}
      <div className="sticky top-0 z-40 border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/50 md:hidden">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <button
            onClick={() => setOpen(true)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border hover:bg-muted"
            aria-label="Open menu"
          >
            ☰
          </button>

          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-500 to-emerald-500" />
            <div className="leading-tight">
              <div className="text-sm font-semibold">Pro Todo</div>
              <div className="text-xs text-muted-foreground">
                Advanced Dashboard
              </div>
            </div>
          </div>

          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>

      {/* ✅ Mobile Drawer (Smooth) */}
      <div
        className={`fixed inset-0 z-50 md:hidden transition
        ${open ? "pointer-events-auto" : "pointer-events-none"}`}
      >
        {/* Overlay */}
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity duration-200
          ${open ? "opacity-100" : "opacity-0"}`}
          onClick={() => setOpen(false)}
        />

        {/* Panel */}
        <div
          className={`absolute left-0 top-0 h-full w-80 border-r bg-background p-4
          transition-transform duration-200 ease-out
          ${open ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-emerald-500" />
              <div className="leading-tight">
                <div className="text-base font-semibold">Pro Todo</div>
                <div className="text-xs text-muted-foreground">Workspace</div>
              </div>
            </div>

            <button
              className="h-10 w-10 rounded-lg border hover:bg-muted"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>

          <div className="mt-6 space-y-1">
            {nav.map((n) => (
              <NavLink
                key={n.key}
                href={n.href}
                label={n.label}
                active={pathname === "/dashboard" && currentView === n.key}
                onClick={() => setOpen(false)}
              />
            ))}
          </div>

          <div className="mt-6 border-t pt-4">
            <Button className="w-full" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 md:grid-cols-[260px_1fr]">
        {/* Sidebar */}
        <aside className="hidden min-h-screen border-r bg-background md:block">
          <div className="sticky top-0 p-5">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-emerald-500" />
              <div className="leading-tight">
                <div className="text-base font-semibold">Pro Todo</div>
                <div className="text-xs text-muted-foreground">
                  Advanced Dashboard
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-1">
              {nav.map((n) => (
                <NavLink
                  key={n.key}
                  href={n.href}
                  label={n.label}
                  active={pathname === "/dashboard" && currentView === n.key}
                />
              ))}
            </div>

            <div className="mt-6 rounded-xl border bg-muted/30 p-3">
              <div className="text-sm font-medium">Tip</div>
              <div className="mt-1 text-xs text-muted-foreground">
                Use filters (today/upcoming/overdue) to stay on track.
              </div>
            </div>
          </div>
        </aside>

        {/* Content */}
        <div className="min-w-0">
          {/* Desktop Topbar */}
          <header className="sticky top-0 z-30 hidden border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/50 md:block">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
              <div>
                <div className="text-lg font-semibold">Dashboard</div>
                <div className="text-xs text-muted-foreground">
                  Manage your tasks efficiently
                </div>
              </div>

              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </header>

          <main className="mx-auto max-w-6xl p-4 md:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
