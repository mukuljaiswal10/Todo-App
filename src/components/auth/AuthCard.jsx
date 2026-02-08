"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import ThemeToggle from "@/components/theme/ThemeToggle";

export default function AuthCard({
  title = "Welcome back",
  subtitle = "Sign in to continue",
  children,
  footer,
  className,
}) {
  return (
    <div className="relative w-full max-w-md">
      {/* glow */}
      <div className="pointer-events-none absolute -inset-1 rounded-3xl bg-gradient-to-r from-indigo-500/25 via-emerald-500/15 to-cyan-500/25 blur-2xl" />

      {/* gradient border */}
      <div className="relative rounded-3xl bg-gradient-to-r from-indigo-500/40 via-transparent to-emerald-500/30 p-[1px]">
        {/* glass card */}
        <div
          className={cn(
            "relative overflow-hidden rounded-3xl border border-white/10 bg-background/70 backdrop-blur-xl shadow-2xl",
            className,
          )}
        >
          {/* top shine */}
          <div className="pointer-events-none absolute inset-x-0 -top-24 h-40 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.18),transparent_55%)]" />

          {/* header */}
          <div className="flex items-center justify-between px-6 pt-6">
            <Link href="/" className="group inline-flex items-center gap-2">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-emerald-500 text-white shadow-lg">
                ✓
              </span>
              <div className="leading-tight">
                <div className="text-sm font-semibold tracking-tight">
                  Pro Todo
                </div>
                <div className="text-xs text-muted-foreground">
                  Premium workspace
                </div>
              </div>
            </Link>

            {/* theme toggle */}
            <div className="rounded-xl border border-white/10 bg-background/60 px-2 py-1">
              <ThemeToggle />
            </div>
          </div>

          <div className="px-6 pb-6 pt-5">
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            {subtitle ? (
              <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
            ) : null}

            <div className="mt-6">{children}</div>

            {/* footer slot */}
            {footer ? (
              <div className="mt-6 border-t border-white/10 pt-4 text-sm text-muted-foreground">
                {footer}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

