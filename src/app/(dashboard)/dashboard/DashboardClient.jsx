"use client";

import { useSearchParams, useRouter } from "next/navigation";
import AddTodoDialog from "@/components/todo/AddTodoDialog";
import TodoList from "@/components/todo/TodoList";
import { useTodos } from "@/components/todo/useTodos";
import { Input } from "@/components/ui/input";

export default function DashboardClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const view = searchParams.get("view") || "all";
  const q = searchParams.get("q") || "";

  const params = view === "all" ? { limit: 20, q } : { view, limit: 20, q };
  const { data, isLoading, isError, error } = useTodos(params);

  function setViewInUrl(nextView) {
    const sp = new URLSearchParams(searchParams.toString());
    if (nextView === "all") sp.delete("view");
    else sp.set("view", nextView);
    router.push(`/dashboard?${sp.toString()}`);
  }

  function setQInUrl(nextQ) {
    const sp = new URLSearchParams(searchParams.toString());
    if (!nextQ) sp.delete("q");
    else sp.set("q", nextQ);
    router.push(`/dashboard?${sp.toString()}`);
  }

  const items = data?.items || data || [];

  return (
    <div className="animate-in fade-in-50">
      {/* Header row */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Manage your tasks efficiently
          </p>
        </div>

        <div className="transition hover:scale-[1.02] active:scale-[0.99]">
          <AddTodoDialog />
        </div>
      </div>

      {/* Search */}
      <div className="mt-4">
        <div className="relative max-w-xl">
          <Input
            value={q}
            onChange={(e) => setQInUrl(e.target.value)}
            placeholder="Search todos..."
            className="h-11 rounded-xl bg-background/60 pr-10"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-4 flex flex-wrap gap-2">
        {["all", "today", "upcoming", "overdue", "completed"].map((v) => {
          const active = view === v;
          return (
            <button
              key={v}
              onClick={() => setViewInUrl(v)}
              className={[
                "rounded-xl border px-3 py-2 text-sm transition",
                "hover:bg-muted active:scale-[0.98]",
                active ? "bg-foreground text-background shadow-sm" : "",
              ].join(" ")}
            >
              {v}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="mt-5">
        {isLoading ? (
          <div className="text-sm text-muted-foreground">Loading...</div>
        ) : isError ? (
          <div className="text-sm text-red-600">
            {String(error?.message || "Error")}
          </div>
        ) : (
          <div className="animate-in fade-in-50">
            <div className="space-y-4">
              <TodoList items={items} />
            </div>

            {!items?.length ? (
              <div className="mt-6 rounded-2xl border bg-background/60 p-6 text-center">
                <div className="text-lg font-semibold">No tasks found</div>
                <div className="text-sm text-muted-foreground">
                  Try changing filter or search query.
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
