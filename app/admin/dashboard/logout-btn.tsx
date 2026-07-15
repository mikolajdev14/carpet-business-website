"use client";

import { createClient } from "@/lib/supabase/client";
import { LogOut } from "lucide-react";
import { redirect } from "next/navigation";

export default function LogoutButton({ compact = false }: { compact?: boolean }) {
  const handleLogOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    redirect("/admin/login");
  };

  return (
    <button
      type="button"
      onClick={handleLogOut}
      title="Wyloguj się"
      aria-label="Wyloguj się"
      className={
        compact
          ? "flex size-8 shrink-0 items-center justify-center rounded-md text-[#737373] transition-colors hover:bg-white hover:text-neutral-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950"
          : "inline-flex h-9 items-center justify-center gap-2 rounded-md border border-[#d4d4d4] bg-white px-3 text-sm font-semibold text-[#525252] transition-colors hover:border-neutral-950 hover:text-neutral-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950"
      }
    >
      <LogOut size={16} aria-hidden="true" />
      {compact ? null : <span className="hidden sm:inline">Wyloguj się</span>}
    </button>
  );
}
