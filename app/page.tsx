"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import {
  FolderKanban,
  Plus,
  X,
  ArrowRight,
  Activity,
  CheckCircle2,
  Layers,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { SkeletonCard } from "@/components/SkeletonCard";

export default function Dashboard() {
  const [projetos, setProjetos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nomeProjeto, setNomeProjeto] = useState("");
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    async function carregarDados() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
        .from("projetos")
        .select("*")
        .order("created_at", { ascending: false });

      if (data) setProjetos(data);
      setLoading(false);
    }

    carregarDados();
  }, [router]);

  const handleCriarProjeto = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvando(true);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    const { data, error } = await supabase
      .from("projetos")
      .insert([
        {
          nome: nomeProjeto,
          usuario_id: session?.user.id,
          status: "ativo",
        },
      ])
      .select();

    if (error) {
      toast.error("Erro ao criar projeto: " + error.message);
    } else if (data) {
      setProjetos([data[0], ...projetos]);
      setNomeProjeto("");
      setIsModalOpen(false);
      toast.success("Projeto criado com sucesso!");
    }

    setSalvando(false);
  };

  // --- LÓGICA DE MÉTRICAS (ANALYTICS) ---
  const totalProjetos = projetos.length;
  const projetosAtivos = projetos.filter((p) => p.status === "ativo").length;
  const projetosConcluidos = projetos.filter(
    (p) => p.status === "concluido",
  ).length;

  return (
    <div className="flex min-h-screen bg-zinc-950 font-sans text-zinc-50 relative">
      <Sidebar />

      <main className="flex-1 p-10 h-screen overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {/* Cabeçalho */}
          <div className="flex justify-between items-end mb-8 border-b border-zinc-800/50 pb-6">
            <div>
              <h1 className="text-4xl font-bold tracking-tight mb-2 flex items-center gap-3">
                <FolderKanban className="text-emerald-500" size={32} />
                Dashboard
              </h1>
              <p className="text-zinc-400">
                Visão geral da sua agência e progresso dos clientes.
              </p>
            </div>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-all"
            >
              <Plus size={20} />
              Novo Projeto
            </Button>
          </div>

          {/* ÁREA DE MÉTRICAS (ANALYTICS) */}
          {!loading && projetos.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Card: Total */}
              <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 flex items-center gap-4">
                <div className="p-4 bg-zinc-800/50 rounded-xl text-zinc-400">
                  <Layers size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-500 mb-1">
                    Total de Projetos
                  </p>
                  <p className="text-3xl font-bold text-zinc-100">
                    {totalProjetos}
                  </p>
                </div>
              </div>

              {/* Card: Ativos */}
              <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 flex items-center gap-4 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
                <div className="p-4 bg-emerald-500/10 rounded-xl text-emerald-500">
                  <Activity size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-500 mb-1">
                    Em Andamento
                  </p>
                  <p className="text-3xl font-bold text-emerald-400">
                    {projetosAtivos}
                  </p>
                </div>
              </div>

              {/* Card: Concluídos */}
              <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 flex items-center gap-4 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
                <div className="p-4 bg-blue-500/10 rounded-xl text-blue-500">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-500 mb-1">
                    Entregues
                  </p>
                  <p className="text-3xl font-bold text-blue-400">
                    {projetosConcluidos}
                  </p>
                </div>
              </div>
            </div>
          )}

          <h2 className="text-xl font-semibold mb-6 text-zinc-100">
            Seus Espaços de Trabalho
          </h2>

          {/* Área de Projetos */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : projetos.length === 0 ? (
            <div className="text-center py-20 bg-zinc-900/30 border border-zinc-800/50 rounded-2xl border-dashed">
              <FolderKanban className="mx-auto text-zinc-600 mb-4" size={48} />
              <h2 className="text-xl font-medium text-zinc-300 mb-2">
                Nenhum projeto encontrado
              </h2>
              <p className="text-zinc-500 max-w-sm mx-auto">
                Você ainda não tem nenhum espaço de trabalho criado. Comece
                adicionando o seu primeiro cliente.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projetos.map((projeto) => (
                <Link href={`/projetos/${projeto.id}`} key={projeto.id}>
                  <div className="group relative bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 hover:bg-zinc-800/50 hover:border-emerald-500/30 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col h-full">
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-emerald-500/0 to-transparent group-hover:via-emerald-500/50 transition-all duration-500"></div>

                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-semibold text-xl text-zinc-100 group-hover:text-emerald-400 transition-colors pr-2">
                        {projeto.nome}
                      </h3>
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full border capitalize shrink-0 ${
                          projeto.status === "concluido"
                            ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                            : projeto.status === "pausado"
                              ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                              : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        }`}
                      >
                        {projeto.status}
                      </span>
                    </div>

                    <div className="mt-auto flex justify-between items-end pt-6">
                      <p className="text-sm text-zinc-500">
                        Acessar espaço de trabalho
                      </p>
                      <div className="opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0 duration-300">
                        <ArrowRight className="text-emerald-500" size={20} />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modal Premium (Sem alterações) */}
      {isModalOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl w-full max-w-md p-8 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-zinc-500 hover:text-zinc-50 transition-colors"
            >
              <X size={20} />
            </button>
            <h2 className="text-2xl font-bold mb-2">Novo Projeto</h2>
            <p className="text-zinc-400 text-sm mb-6">
              Dê um nome ao espaço de trabalho do seu cliente.
            </p>
            <form onSubmit={handleCriarProjeto} className="flex flex-col gap-4">
              <div>
                <input
                  type="text"
                  placeholder="Ex: App de Delivery"
                  required
                  autoFocus
                  className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-50 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
                  value={nomeProjeto}
                  onChange={(e) => setNomeProjeto(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <Button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-transparent hover:bg-zinc-800 text-zinc-300 border border-zinc-700"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={salvando || !nomeProjeto.trim()}
                  className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold"
                >
                  {salvando ? "Criando..." : "Criar Projeto"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
