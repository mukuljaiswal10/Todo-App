"use client";

import { useSearchParams, useRouter } from "next/navigation";

const NAV = [
  { key: "all", label: "Dashboard" },
  { key: "today", label: "Today" },
  { key: "upcoming", label: "Upcoming" },
  { key: "overdue", label: "Overdue" },
  { key: "completed", label: "Completed" },
];

export default function DashboardSidebar() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const view = searchParams.get("view") || "all";

  function go(v) {
    const sp = new URLSearchParams(searchParams.toString());
    if (v === "all") sp.delete("view");
    else sp.set("view", v);
    router.push(`/dashboard?${sp.toString()}`);
  }

  return (
    <div
      className="
        w-[260px]
        rounded-2xl border bg-background/60
        p-3
        shadow-sm
        backdrop-blur-xl
      "
    >
      <div className="mb-3 rounded-2xl border bg-background/70 p-3">
        <div className="text-sm font-semibold">Quick Filters</div>
        <div className="text-xs text-muted-foreground">
          Click to switch views instantly
        </div>
      </div>

      <nav className="space-y-1">
        {NAV.map((item) => {
          const active = view === item.key;
          return (
            <button
              key={item.key}
              onClick={() => go(item.key)}
              className={[
                "w-full rounded-xl px-3 py-2 text-left text-sm transition",
                "hover:bg-muted active:scale-[0.99]",
                active
                  ? "bg-foreground text-background shadow-sm"
                  : "bg-transparent",
              ].join(" ")}
            >
              <span className="inline-flex items-center gap-2">
                <span
                  className={[
                    "h-2.5 w-2.5 rounded-full",
                    active ? "bg-background" : "bg-foreground/25",
                  ].join(" ")}
                />
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="mt-4 rounded-2xl border bg-background/70 p-3">
        <div className="text-xs font-semibold">Tip</div>
        <div className="text-xs text-muted-foreground">
          Use search to find tasks faster.
        </div>
      </div>
    </div>
  );
}
