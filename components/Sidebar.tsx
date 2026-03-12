"use client"; // Precisamos disso para o botão funcionar

import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { LayoutDashboard, FolderKanban, Settings, LogOut } from "lucide-react";

export function Sidebar() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login"); // Manda de volta para o login após sair
  };

  return (
    <aside className="w-64 bg-zinc-950 border-r border-zinc-800 min-h-screen p-4 flex flex-col">
      <div className="mb-10 mt-4 px-4">
        <h2 className="text-2xl font-bold text-zinc-50 tracking-tight">
          Lyncar<span className="text-emerald-500">.</span>
        </h2>
      </div>

      <nav className="flex-1 space-y-2">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-2 text-zinc-50 bg-zinc-900 rounded-md transition-colors border border-zinc-800"
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </Link>

        <Link
          href="#"
          className="flex items-center gap-3 px-4 py-2 text-zinc-400 hover:text-zinc-50 hover:bg-zinc-900/50 rounded-md transition-colors"
        >
          <FolderKanban size={20} />
          <span>Projetos</span>
        </Link>

        <Link
          href="#"
          className="flex items-center gap-3 px-4 py-2 text-zinc-400 hover:text-zinc-50 hover:bg-zinc-900/50 rounded-md transition-colors"
        >
          <Settings size={20} />
          <span>Configurações</span>
        </Link>
      </nav>

      {/* Botão de Sair Real */}
      <div className="mt-auto">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2 text-zinc-400 hover:text-red-400 hover:bg-red-950/30 rounded-md transition-colors"
        >
          <LogOut size={20} />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
}
