import Link from "next/link";
import { LayoutDashboard, FolderKanban, Settings, LogOut } from "lucide-react";

export function Sidebar() {
  return (
    <aside className="w-64 bg-zinc-950 border-r border-zinc-800 min-h-screen p-4 flex flex-col">
      {/* Logo */}
      <div className="mb-10 mt-4 px-4">
        <h2 className="text-2xl font-bold text-zinc-50 tracking-tight">
          Lyncar<span className="text-emerald-500">.</span>
        </h2>
      </div>

      {/* Links de Navegação */}
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

      {/* Botão de Sair no rodapé */}
      <div className="mt-auto">
        <Link
          href="/login"
          className="flex items-center gap-3 px-4 py-2 text-zinc-400 hover:text-red-400 hover:bg-red-950/30 rounded-md transition-colors"
        >
          <LogOut size={20} />
          <span>Sair</span>
        </Link>
      </div>
    </aside>
  );
}
