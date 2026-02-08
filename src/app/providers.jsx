"use client";

import ThemeProvider from "@/components/theme/ThemeProvider";
import QueryProvider from "@/components/providers/QueryProvider";

export default function Providers({ children }) {
  return (
    <ThemeProvider>
      <QueryProvider>{children}</QueryProvider>
    </ThemeProvider>
  );
}
