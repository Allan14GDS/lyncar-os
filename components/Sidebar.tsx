"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  LayoutDashboard,
  FolderKanban,
  Settings,
  LogOut,
  User,
} from "lucide-react";

export function Sidebar() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    // Pergunta ao Supabase quem é o utilizador logado
    async function getUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email ?? "");
      }
    }

    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
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

      {/* Nova Secção: Perfil do Utilizador e Logout */}
      <div className="mt-auto border-t border-zinc-800 pt-4 pb-2">
        {/* Bloco de Informação da Conta */}
        <div className="flex items-center gap-3 px-4 py-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20">
            <User size={16} />
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-medium text-zinc-200">
              Minha Conta
            </span>
            <span
              className="text-xs text-zinc-500 truncate"
              title={userEmail || "A carregar..."}
            >
              {userEmail || "A carregar..."}
            </span>
          </div>
        </div>

        {/* Botão de Sair */}
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
