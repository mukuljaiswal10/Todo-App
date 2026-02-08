"use client";

import { useState } from "react";
import DashboardSidebar from "./DashboardSidebar";
import DashboardTopbar from "./DashboardTopbar";

export default function DashboardShell({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Premium background glow */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-24 left-1/2 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.18),transparent_60%)] blur-2xl" />
        <div className="absolute bottom-0 right-0 h-[360px] w-[560px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.14),transparent_60%)] blur-2xl" />
      </div>

      <div className="mx-auto flex w-full max-w-[1400px] gap-6 px-3 py-4 md:px-6">
        {/* Sidebar (desktop) */}
        <aside className="hidden md:block">
          <DashboardSidebar />
        </aside>

        {/* Main */}
        <div className="flex min-w-0 flex-1 flex-col">
          <DashboardTopbar onOpenMobile={() => setMobileOpen(true)} />

          {/* Mobile sidebar overlay */}
          {mobileOpen ? (
            <div className="md:hidden">
              <div
                className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] animate-in fade-in"
                onClick={() => setMobileOpen(false)}
              />
              <div
                className="
                  fixed left-0 top-0 z-50 h-full w-[82%] max-w-[320px]
                  border-r bg-background/95 backdrop-blur-xl
                  shadow-2xl
                  animate-in slide-in-from-left duration-300
                "
              >
                <div className="p-3">
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="mb-2 rounded-lg border px-3 py-2 text-sm hover:bg-muted transition"
                  >
                    Close
                  </button>
                </div>
                <div onClick={() => setMobileOpen(false)}>
                  <DashboardSidebar />
                </div>
              </div>
            </div>
          ) : null}

          {/* Content */}
          <main
            className="
              mt-4 flex-1 rounded-2xl border bg-background/60
              p-4 shadow-sm
              backdrop-blur-xl
              md:p-6
              animate-in fade-in-50
            "
          >
            {children}
          </main>

          {/* Footer micro */}
          <div className="mt-4 pb-2 text-center text-xs text-muted-foreground">
            Pro Todo • Premium SaaS Dashboard
          </div>
        </div>
      </div>
    </div>
  );
}
