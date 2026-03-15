"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Sidebar } from "@/components/Sidebar";
import {
  ArrowLeft,
  Plus,
  FileText,
  X,
  ExternalLink,
  LayoutDashboard,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { SkeletonCard } from "@/components/SkeletonCard";

export default function ProjetoDetalhes() {
  const params = useParams();
  const router = useRouter();
  const [projeto, setProjeto] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [linkEntrega, setLinkEntrega] = useState("");
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    async function carregarProjeto() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
        .from("projetos")
        .select("*, entregaveis(*)")
        .eq("id", params.id)
        .single();

      if (data) {
        if (data.entregaveis) {
          data.entregaveis.sort(
            (a: any, b: any) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime(),
          );
        }
        setProjeto(data);
      } else {
        toast.error("Projeto não encontrado.");
        router.push("/");
      }
      setLoading(false);
    }

    carregarProjeto();
  }, [params.id, router]);

  const handleCriarEntrega = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvando(true);

    const novaEntrega = {
      projeto_id: projeto.id,
      tipo: "link",
      conteudo: {
        titulo: titulo,
        comentarios: descricao,
        link_figma: linkEntrega,
      },
    };

    const { data, error } = await supabase
      .from("entregaveis")
      .insert([novaEntrega])
      .select();

    if (!error && data) {
      setProjeto({
        ...projeto,
        entregaveis: [data[0], ...(projeto.entregaveis || [])],
      });

      setTitulo("");
      setDescricao("");
      setLinkEntrega("");
      setIsModalOpen(false);
      toast.success("Entrega adicionada com sucesso!");
    } else {
      toast.error("Erro ao criar entrega: " + error?.message);
    }
    setSalvando(false);
  };

  return (
    <div className="flex min-h-screen bg-zinc-950 font-sans text-zinc-50 relative">
      <Sidebar />

      <main className="flex-1 p-10 h-screen overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          {/* Botão de Voltar Premium */}
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-zinc-500 hover:text-emerald-400 transition-colors mb-8 text-sm font-medium"
          >
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span>Voltar para o Dashboard</span>
          </Link>

          {/* Área de Loading do Cabeçalho */}
          {loading ? (
            <div className="mb-8 pb-6 border-b border-zinc-800/50 flex justify-between items-end">
              <div>
                <div className="h-10 w-64 bg-zinc-900 rounded-md animate-pulse mb-3"></div>
                <div className="h-5 w-40 bg-zinc-900 rounded-md animate-pulse"></div>
              </div>
              <div className="h-10 w-36 bg-zinc-900 rounded-md animate-pulse"></div>
            </div>
          ) : (
            <div className="flex justify-between items-end mb-8 pb-6 border-b border-zinc-800/50">
              <div>
                <h1 className="text-4xl font-bold tracking-tight mb-2 flex items-center gap-3">
                  <LayoutDashboard className="text-emerald-500" size={32} />
                  {projeto?.nome}
                </h1>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 capitalize">
                    {projeto?.status}
                  </span>
                  <span className="text-zinc-500 text-sm">
                    Espaço de trabalho do cliente
                  </span>
                </div>
              </div>

              <Button
                onClick={() => setIsModalOpen(true)}
                className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-all"
              >
                <Plus size={20} />
                Nova Entrega
              </Button>
            </div>
          )}

          {/* Área Principal: Skeletons, Palco Vazio ou Entregas */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : !projeto?.entregaveis || projeto.entregaveis.length === 0 ? (
            <div className="bg-zinc-900/30 border border-dashed border-zinc-800/50 rounded-2xl p-16 text-center">
              <div className="w-16 h-16 bg-zinc-900/50 rounded-full flex items-center justify-center mx-auto mb-6 border border-zinc-800">
                <FileText className="text-zinc-500" size={24} />
              </div>
              <h3 className="text-xl font-medium text-zinc-300 mb-2">
                Nenhuma entrega adicionada
              </h3>
              <p className="text-zinc-500 mb-8 max-w-md mx-auto">
                Centralize links importantes, documentos ou faturas para o seu
                cliente acessar rapidamente.
              </p>
              <Button
                onClick={() => setIsModalOpen(true)}
                className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 hover:border-emerald-500/50 transition-all"
              >
                Adicionar primeira entrega
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projeto.entregaveis.map((entrega: any) => (
                <div
                  key={entrega.id}
                  className="group relative p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 flex flex-col hover:bg-zinc-800/50 hover:border-emerald-500/30 transition-all duration-300 overflow-hidden"
                >
                  {/* Efeito Glow no Card de Entrega */}
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-emerald-500/0 to-transparent group-hover:via-emerald-500/50 transition-all duration-500"></div>

                  <h3 className="font-semibold text-xl text-zinc-100 mb-2 group-hover:text-emerald-400 transition-colors">
                    {entrega.conteudo.titulo}
                  </h3>
                  <p className="text-sm text-zinc-400 mb-8 flex-1 leading-relaxed">
                    {entrega.conteudo.comentarios}
                  </p>

                  {entrega.conteudo.link_figma && (
                    <a
                      href={entrega.conteudo.link_figma}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto block"
                    >
                      <Button className="w-full bg-zinc-950 border border-zinc-800 text-zinc-300 hover:bg-zinc-900 hover:text-emerald-400 hover:border-emerald-500/30 flex items-center justify-center gap-2 transition-all">
                        <ExternalLink size={16} />
                        Acessar Material
                      </Button>
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* MODAL DE NOVA ENTREGA */}
      {isModalOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl w-full max-w-md p-8 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-zinc-500 hover:text-zinc-50 transition-colors"
            >
              <X size={20} />
            </button>

            <h2 className="text-2xl font-bold mb-2">Adicionar Material</h2>
            <p className="text-zinc-400 text-sm mb-6">
              Insira os detalhes do link ou material que deseja compartilhar com
              o cliente.
            </p>

            <form onSubmit={handleCriarEntrega} className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block mb-2">
                  Título da Entrega
                </label>
                <input
                  type="text"
                  placeholder="Ex: Layout da Home - Figma"
                  required
                  autoFocus
                  className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-50 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block mb-2">
                  Link (URL)
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  required
                  className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-50 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
                  value={linkEntrega}
                  onChange={(e) => setLinkEntrega(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block mb-2">
                  Descrição (Opcional)
                </label>
                <textarea
                  placeholder="Ex: Segue a primeira versão para aprovação..."
                  rows={3}
                  className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-50 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none transition-all"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
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
                  disabled={salvando || !titulo.trim() || !linkEntrega.trim()}
                  className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold"
                >
                  {salvando ? "Salvando..." : "Salvar Entrega"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
