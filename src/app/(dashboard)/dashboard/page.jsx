// "use client";

// import { useSearchParams, useRouter } from "next/navigation";
// import AddTodoDialog from "@/components/todo/AddTodoDialog";
// import TodoList from "@/components/todo/TodoList";
// import { useTodos } from "@/components/todo/useTodos";
// import { Input } from "@/components/ui/input";

// export default function DashboardPage() {
//   const searchParams = useSearchParams();
//   const router = useRouter();

//   const view = searchParams.get("view") || "all";
//   const q = searchParams.get("q") || "";

//   const params = view === "all" ? { limit: 20, q } : { view, limit: 20, q };

//   const { data, isLoading, isError, error } = useTodos(params);

//   function setViewInUrl(nextView) {
//     const sp = new URLSearchParams(searchParams.toString());
//     if (nextView === "all") sp.delete("view");
//     else sp.set("view", nextView);
//     router.push(`/dashboard?${sp.toString()}`);
//   }

//   function setQInUrl(nextQ) {
//     const sp = new URLSearchParams(searchParams.toString());
//     if (!nextQ) sp.delete("q");
//     else sp.set("q", nextQ);
//     router.push(`/dashboard?${sp.toString()}`);
//   }

//   return (
//     <>
//       <div className="flex items-center justify-between gap-3">
//         <div>
//           <h1 className="text-2xl font-semibold">Dashboard</h1>
//           <p className="text-sm text-muted-foreground">
//             Manage your tasks efficiently
//           </p>
//         </div>
//         <AddTodoDialog />
//       </div>

//       {/* ✅ Search Bar */}
//       <div className="mt-4">
//         <Input
//           value={q}
//           onChange={(e) => setQInUrl(e.target.value)}
//           placeholder="Search todos..."
//           className="max-w-xl"
//         />
//       </div>

//       {/* ✅ Tabs */}
//       <div className="mt-4 flex flex-wrap gap-2">
//         {["all", "today", "upcoming", "overdue", "completed"].map((v) => (
//           <button
//             key={v}
//             onClick={() => setViewInUrl(v)}
//             className={`rounded-lg border px-3 py-2 text-sm transition ${
//               view === v
//                 ? "bg-foreground text-background"
//                 : "bg-background hover:bg-muted"
//             }`}
//           >
//             {v}
//           </button>
//         ))}
//       </div>

//       <div className="mt-4">
//         {isLoading ? (
//           <div className="text-sm text-muted-foreground">Loading...</div>
//         ) : isError ? (
//           <div className="text-sm text-red-600">
//             {String(error?.message || "Error")}
//           </div>
//         ) : (
//           <TodoList items={data?.items || data || []} />
//         )}
//       </div>
//     </>
//   );
// }

// "use client";

// import { useMemo } from "react";
// import { useSearchParams, useRouter } from "next/navigation";
// import AddTodoDialog from "@/components/todo/AddTodoDialog";
// import TodoList from "@/components/todo/TodoList";
// import { useTodos } from "@/components/todo/useTodos";
// import { Input } from "@/components/ui/input";

// export default function DashboardPage() {
//   const searchParams = useSearchParams();
//   const router = useRouter();

//   const view = searchParams.get("view") || "all";
//   const q = searchParams.get("q") || "";

//   const params = useMemo(() => {
//     return view === "all" ? { limit: 20, q } : { view, limit: 20, q };
//   }, [view, q]);

//   const { data, isLoading, isError, error } = useTodos(params);

//   function setViewInUrl(nextView) {
//     const sp = new URLSearchParams(searchParams.toString());
//     if (nextView === "all") sp.delete("view");
//     else sp.set("view", nextView);

//     // when tab changes, keep search but reset pagination etc (optional)
//     router.push(`/dashboard?${sp.toString()}`);
//   }

//   function setQInUrl(nextQ) {
//     const sp = new URLSearchParams(searchParams.toString());
//     if (!nextQ) sp.delete("q");
//     else sp.set("q", nextQ);
//     router.push(`/dashboard?${sp.toString()}`);
//   }

//   return (
//     <div className="p-4 md:p-8">
//       {/* Premium background layer inside page (optional) */}
//       <div className="pointer-events-none absolute inset-0 -z-10 opacity-60 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)] bg-[radial-gradient(circle_at_10%_10%,rgba(99,102,241,0.20),transparent_35%),radial-gradient(circle_at_90%_20%,rgba(16,185,129,0.16),transparent_40%),radial-gradient(circle_at_50%_90%,rgba(236,72,153,0.12),transparent_45%)]" />

//       {/* Header */}
//       <div className="flex items-start justify-between gap-4">
//         <div className="space-y-1">
//           <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
//             Dashboard
//           </h1>
//           <p className="text-sm text-muted-foreground">
//             Manage your tasks efficiently
//           </p>
//         </div>

//         {/* Add Todo button (dialog) */}
//         <div className="shrink-0">
//           <div className="rounded-2xl border bg-card/70 backdrop-blur supports-[backdrop-filter]:bg-card/50 shadow-sm hover:shadow-md transition">
//             <div className="p-1">
//               <AddTodoDialog />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Search + Tabs card */}
//       <div className="mt-6 rounded-2xl border bg-card/70 backdrop-blur supports-[backdrop-filter]:bg-card/50 shadow-sm">
//         <div className="p-4 md:p-5 space-y-4">
//           {/* ✅ Search Bar */}
//           <div className="relative max-w-xl">
//             <Input
//               value={q}
//               onChange={(e) => setQInUrl(e.target.value)}
//               placeholder="Search todos..."
//               className="h-11 rounded-xl bg-background/60 pr-10"
//             />
//             {/* <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-muted-foreground">
//               ⌘K
//             </div> */}
//             <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
//           </div>

//           {/* ✅ Tabs */}
//           <div className="flex flex-wrap gap-2">
//             {["all", "today", "upcoming", "overdue", "completed"].map((v) => {
//               const active = view === v;
//               return (
//                 <button
//                   key={v}
//                   onClick={() => setViewInUrl(v)}
//                   className={[
//                     "group relative overflow-hidden rounded-xl border px-4 py-2 text-sm transition",
//                     "hover:-translate-y-[1px] hover:shadow-sm active:translate-y-0",
//                     active
//                       ? "bg-foreground text-background border-foreground"
//                       : "bg-background/50 hover:bg-muted/60",
//                   ].join(" ")}
//                 >
//                   <span className="relative z-10 capitalize">{v}</span>

//                   {/* subtle shine */}
//                   {!active ? (
//                     <span className="pointer-events-none absolute -inset-y-6 -left-20 w-16 rotate-12 bg-white/10 blur-md opacity-0 group-hover:opacity-100 group-hover:translate-x-[220%] transition duration-700" />
//                   ) : null}
//                 </button>
//               );
//             })}
//           </div>
//         </div>
//       </div>

//       {/* Content */}
//       <div className="mt-6">
//         {isLoading ? (
//           <div className="rounded-2xl border bg-card/70 backdrop-blur supports-[backdrop-filter]:bg-card/50 p-5 text-sm text-muted-foreground">
//             Loading todos...
//           </div>
//         ) : isError ? (
//           <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-200">
//             {String(error?.message || "Error")}
//           </div>
//         ) : (
//           <div className="rounded-2xl border bg-card/70 backdrop-blur supports-[backdrop-filter]:bg-card/50 shadow-sm hover:shadow-md transition">
//             <div className="p-4 md:p-5">
//               <TodoList items={data?.items || data || []} />
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// "use client";

// import { useSearchParams, useRouter } from "next/navigation";
// import AddTodoDialog from "@/components/todo/AddTodoDialog";
// import TodoList from "@/components/todo/TodoList";
// import { useTodos } from "@/components/todo/useTodos";
// import { Input } from "@/components/ui/input";

// export default function DashboardPage() {
//   const searchParams = useSearchParams();
//   const router = useRouter();

//   const view = searchParams.get("view") || "all";
//   const q = searchParams.get("q") || "";

//   const params = view === "all" ? { limit: 20, q } : { view, limit: 20, q };
//   const { data, isLoading, isError, error } = useTodos(params);

//   function setViewInUrl(nextView) {
//     const sp = new URLSearchParams(searchParams.toString());
//     if (nextView === "all") sp.delete("view");
//     else sp.set("view", nextView);
//     router.push(`/dashboard?${sp.toString()}`);
//   }

//   function setQInUrl(nextQ) {
//     const sp = new URLSearchParams(searchParams.toString());
//     if (!nextQ) sp.delete("q");
//     else sp.set("q", nextQ);
//     router.push(`/dashboard?${sp.toString()}`);
//   }

//   const items = data?.items || data || [];

//   return (
//     <div className="animate-in fade-in-50">
//       {/* Header row */}
//       <div className="flex items-center justify-between gap-3">
//         <div>
//           <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
//           <p className="text-sm text-muted-foreground">
//             Manage your tasks efficiently
//           </p>
//         </div>

//         <div className="transition hover:scale-[1.02] active:scale-[0.99]">
//           <AddTodoDialog />
//         </div>
//       </div>

//       {/* Search */}
//       <div className="mt-4">
//         <div className="relative max-w-xl">
//           <Input
//             value={q}
//             onChange={(e) => setQInUrl(e.target.value)}
//             placeholder="Search todos..."
//             className="h-11 rounded-xl bg-background/60 pr-10"
//           />
//           <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
//         </div>
//       </div>

//       {/* Tabs */}
//       <div className="mt-4 flex flex-wrap gap-2">
//         {["all", "today", "upcoming", "overdue", "completed"].map((v) => {
//           const active = view === v;
//           return (
//             <button
//               key={v}
//               onClick={() => setViewInUrl(v)}
//               className={[
//                 "rounded-xl border px-3 py-2 text-sm transition",
//                 "hover:bg-muted active:scale-[0.98]",
//                 active ? "bg-foreground text-background shadow-sm" : "",
//               ].join(" ")}
//             >
//               {v}
//             </button>
//           );
//         })}
//       </div>

//       {/* Content */}
//       <div className="mt-5">
//         {isLoading ? (
//           <div className="text-sm text-muted-foreground">Loading...</div>
//         ) : isError ? (
//           <div className="text-sm text-red-600">
//             {String(error?.message || "Error")}
//           </div>
//         ) : (
//           <div className="animate-in fade-in-50">
//             {/* premium list wrapper */}
//             <div className="space-y-4">
//               <TodoList items={items} />
//             </div>

//             {/* empty state */}
//             {!items?.length ? (
//               <div className="mt-6 rounded-2xl border bg-background/60 p-6 text-center">
//                 <div className="text-lg font-semibold">No tasks found</div>
//                 <div className="text-sm text-muted-foreground">
//                   Try changing filter or search query.
//                 </div>
//               </div>
//             ) : null}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

export const dynamic = "force-dynamic";
export const revalidate = 0;

import { Suspense } from "react";
import DashboardClient from "./DashboardClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6">Loading dashboard...</div>}>
      <DashboardClient />
    </Suspense>
  );
}
