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
  Share2,
  Trash2,
  Settings,
  AlertTriangle,
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

  // Estados para Nova Entrega
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [linkEntrega, setLinkEntrega] = useState("");
  const [salvando, setSalvando] = useState(false);

  // Estados para Configurações do Projeto
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [editNome, setEditNome] = useState("");
  const [editStatus, setEditStatus] = useState("ativo");
  const [salvandoConfig, setSalvandoConfig] = useState(false);

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
        setEditNome(data.nome);
        setEditStatus(data.status);
      } else {
        toast.error("Projeto não encontrado.");
        router.push("/");
      }
      setLoading(false);
    }

    carregarProjeto();
  }, [params.id, router]);

  // --- Funções de Entregas ---
  const handleCriarEntrega = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvando(true);

    const novaEntrega = {
      projeto_id: projeto.id,
      tipo: "link",
      conteudo: { titulo, comentarios: descricao, link_figma: linkEntrega },
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

  const handleEliminarEntrega = async (id: string) => {
    if (!window.confirm("Tem a certeza que deseja eliminar esta entrega?"))
      return;
    const { error } = await supabase.from("entregaveis").delete().eq("id", id);
    if (!error) {
      setProjeto({
        ...projeto,
        entregaveis: projeto.entregaveis.filter((e: any) => e.id !== id),
      });
      toast.success("Entrega eliminada com sucesso!");
    } else {
      toast.error("Erro ao eliminar: " + error.message);
    }
  };

  const copiarLinkPortal = () => {
    const link = `${window.location.origin}/portal/${params.id}`;
    navigator.clipboard.writeText(link);
    toast.success("Link do portal copiado! Pode enviar ao seu cliente.");
  };

  // --- Funções do Projeto (Configurações) ---
  const handleAtualizarProjeto = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvandoConfig(true);

    const { error } = await supabase
      .from("projetos")
      .update({ nome: editNome, status: editStatus })
      .eq("id", projeto.id);

    if (!error) {
      setProjeto({ ...projeto, nome: editNome, status: editStatus });
      setIsConfigModalOpen(false);
      toast.success("Definições do projeto atualizadas!");
    } else {
      toast.error("Erro ao atualizar o projeto: " + error.message);
    }
    setSalvandoConfig(false);
  };

  const handleEliminarProjetoInteiro = async () => {
    // Dupla confirmação para evitar desastres
    const confirmacao1 = window.confirm(
      "CUIDADO: Tem a certeza absoluta que deseja eliminar este projeto?",
    );
    if (!confirmacao1) return;

    const confirmacao2 = window.confirm(
      "Isto irá apagar TODAS as entregas e links associados. Esta ação é irreversível. Continuar?",
    );
    if (!confirmacao2) return;

    // Se o Supabase tiver "Cascade Delete" configurado, apagar o projeto apaga as entregas.
    // Caso contrário, apagamos primeiro as entregas para não dar erro de chave estrangeira.
    await supabase.from("entregaveis").delete().eq("projeto_id", projeto.id);
    const { error } = await supabase
      .from("projetos")
      .delete()
      .eq("id", projeto.id);

    if (!error) {
      toast.success("Projeto eliminado com sucesso.");
      router.push("/"); // Volta para o Dashboard
    } else {
      toast.error("Erro ao eliminar projeto: " + error.message);
    }
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

          {loading ? (
            <div className="mb-8 pb-6 border-b border-zinc-800/50 flex justify-between items-end">
              <div>
                <div className="h-10 w-64 bg-zinc-900 rounded-md animate-pulse mb-3"></div>
                <div className="h-5 w-40 bg-zinc-900 rounded-md animate-pulse"></div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 pb-6 border-b border-zinc-800/50 gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
                    <LayoutDashboard className="text-emerald-500" size={32} />
                    {projeto?.nome}
                  </h1>
                  {/* Botão de Definições (Engrenagem) */}
                  <button
                    onClick={() => setIsConfigModalOpen(true)}
                    className="p-2 text-zinc-500 hover:text-emerald-400 hover:bg-zinc-900 rounded-lg transition-colors ml-2"
                    title="Definições do Projeto"
                  >
                    <Settings size={22} />
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full border capitalize ${
                      projeto?.status === "concluido"
                        ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                        : projeto?.status === "pausado"
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    }`}
                  >
                    {projeto?.status}
                  </span>
                  <span className="text-zinc-500 text-sm">
                    Espaço de trabalho do cliente
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <Button
                  onClick={copiarLinkPortal}
                  variant="outline"
                  className="bg-zinc-900/50 border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-emerald-400 hover:border-emerald-500/50 flex-1 md:flex-none"
                >
                  <Share2 size={18} className="mr-2" />
                  Copiar Link
                </Button>

                <Button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-all flex-1 md:flex-none"
                >
                  <Plus size={20} />
                  Nova Entrega
                </Button>
              </div>
            </div>
          )}

          {/* Área Principal das Entregas */}
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
                cliente aceder rapidamente.
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
                  <button
                    onClick={() => handleEliminarEntrega(entrega.id)}
                    className="absolute top-4 right-4 p-2 text-zinc-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all opacity-0 group-hover:opacity-100 z-10"
                    title="Eliminar entrega"
                  >
                    <Trash2 size={18} />
                  </button>
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-emerald-500/0 to-transparent group-hover:via-emerald-500/50 transition-all duration-500"></div>
                  <h3 className="font-semibold text-xl text-zinc-100 mb-2 group-hover:text-emerald-400 transition-colors pr-8">
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
                      className="mt-auto block relative z-10"
                    >
                      <Button className="w-full bg-zinc-950 border border-zinc-800 text-zinc-300 hover:bg-zinc-900 hover:text-emerald-400 hover:border-emerald-500/30 flex items-center justify-center gap-2 transition-all">
                        <ExternalLink size={16} />
                        Aceder ao Material
                      </Button>
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* MODAL: NOVA ENTREGA */}
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
              Insira os detalhes do link ou material que deseja partilhar.
            </p>
            <form onSubmit={handleCriarEntrega} className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block mb-2">
                  Título da Entrega
                </label>
                <input
                  type="text"
                  placeholder="Ex: Layout da Home"
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
                  placeholder="Ex: Segue a primeira versão..."
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
                  {salvando ? "A Guardar..." : "Guardar Entrega"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DEFINIÇÕES DO PROJETO */}
      {isConfigModalOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="p-8 relative">
              <button
                onClick={() => setIsConfigModalOpen(false)}
                className="absolute top-6 right-6 text-zinc-500 hover:text-zinc-50 transition-colors"
              >
                <X size={20} />
              </button>
              <h2 className="text-2xl font-bold mb-2">Definições do Projeto</h2>
              <p className="text-zinc-400 text-sm mb-6">
                Ajuste os detalhes ou o estado do espaço de trabalho.
              </p>

              <form
                onSubmit={handleAtualizarProjeto}
                className="flex flex-col gap-4"
              >
                <div>
                  <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block mb-2">
                    Nome do Projeto
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-50 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
                    value={editNome}
                    onChange={(e) => setEditNome(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block mb-2">
                    Estado
                  </label>
                  <select
                    className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-50 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all appearance-none"
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                  >
                    <option value="ativo">Ativo (Em andamento)</option>
                    <option value="pausado">
                      Em Pausa (A aguardar cliente)
                    </option>
                    <option value="concluido">Concluído (Finalizado)</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3 mt-4">
                  <Button
                    type="button"
                    onClick={() => setIsConfigModalOpen(false)}
                    className="bg-transparent hover:bg-zinc-800 text-zinc-300 border border-zinc-700"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={salvandoConfig || !editNome.trim()}
                    className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold"
                  >
                    {salvandoConfig ? "A Atualizar..." : "Guardar Alterações"}
                  </Button>
                </div>
              </form>
            </div>

            {/* ZONA DE PERIGO (Danger Zone) */}
            <div className="bg-red-950/20 border-t border-red-900/30 p-8 flex flex-col gap-4">
              <div className="flex items-center gap-2 text-red-500 font-semibold">
                <AlertTriangle size={20} />
                <span>Zona de Perigo</span>
              </div>
              <p className="text-sm text-red-400/80">
                Ao eliminar este projeto, todas as entregas e links associados
                serão permanentemente apagados da base de dados.
              </p>
              <Button
                onClick={handleEliminarProjetoInteiro}
                variant="destructive"
                className="bg-red-500/10 hover:bg-red-500 hover:text-white text-red-500 border border-red-500/20 transition-all self-start"
              >
                Eliminar Projeto Irreversivelmente
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
