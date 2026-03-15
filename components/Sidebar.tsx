"use client";

import { Home, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import Image from "next/image"; // Importamos o otimizador de imagens do Next.js
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const isActive = (path: string) => {
    if (path === "/" && pathname !== "/") return false;
    if (pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <aside className="w-64 bg-zinc-950 border-r border-zinc-800/50 h-screen flex flex-col">
      {/* Área do Logótipo com a sua Imagem Real */}
      <div className="h-24 flex items-center px-8 border-b border-zinc-800/50">
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src="/logo.png"
            alt="Logótipo Lyncar"
            width={36}
            height={36}
            className="rounded-md drop-shadow-[0_0_8px_rgba(16,185,129,0.3)] group-hover:drop-shadow-[0_0_12px_rgba(16,185,129,0.6)] transition-all duration-300"
          />
          <span className="text-2xl font-bold tracking-tight text-zinc-50 group-hover:text-emerald-400 transition-colors">
            Lyncar<span className="text-emerald-500">.</span>
          </span>
        </Link>
      </div>

      {/* Menu de Navegação */}
      <nav className="flex-1 px-4 py-8 flex flex-col gap-2">
        <p className="px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
          Menu Principal
        </p>

        <Link href="/">
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
              isActive("/")
                ? "bg-zinc-800/50 text-emerald-400 shadow-[inset_2px_0_0_0_#10b981]"
                : "text-zinc-400 hover:text-zinc-50 hover:bg-zinc-900"
            }`}
          >
            <Home
              size={20}
              className={isActive("/") ? "text-emerald-500" : ""}
            />
            <span className="font-medium">Dashboard</span>
          </div>
        </Link>

        <Link href="/configuracoes">
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
              isActive("/configuracoes")
                ? "bg-zinc-800/50 text-emerald-400 shadow-[inset_2px_0_0_0_#10b981]"
                : "text-zinc-400 hover:text-zinc-50 hover:bg-zinc-900"
            }`}
          >
            <Settings
              size={20}
              className={isActive("/configuracoes") ? "text-emerald-500" : ""}
            />
            <span className="font-medium">Definições</span>
          </div>
        </Link>
      </nav>

      {/* Rodapé / Logout */}
      <div className="p-4 border-t border-zinc-800/50">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300"
        >
          <LogOut size={20} />
          <span className="font-medium">Terminar Sessão</span>
        </button>
      </div>
    </aside>
  );
}
