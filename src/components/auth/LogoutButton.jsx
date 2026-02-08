"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

export default function LogoutButton() {
  const router = useRouter();

  async function logout() {
    try {
      await api.post("/api/auth/logout");
    } catch {}
    router.replace("/login");
    router.refresh();
  }

  return (
    <Button variant="outline" onClick={logout}>
      Logout
    </Button>
  );
}
