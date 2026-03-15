"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Sidebar } from "@/components/Sidebar";
import { ArrowLeft, Plus, FileText, X, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ProjetoDetalhes() {
  const params = useParams();
  const router = useRouter();
  const [projeto, setProjeto] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Estados para o Modal de Nova Entrega
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
        // Vamos ordenar os entregáveis para os mais novos aparecerem primeiro
        if (data.entregaveis) {
          data.entregaveis.sort(
            (a: any, b: any) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime(),
          );
        }
        setProjeto(data);
      } else {
        alert("Projeto não encontrado!");
        router.push("/");
      }
      setLoading(false);
    }

    carregarProjeto();
  }, [params.id, router]);

  // Função para salvar a nova entrega no Supabase
  const handleCriarEntrega = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvando(true);

    const novaEntrega = {
      projeto_id: projeto.id,
      tipo: "link", // <--- ADICIONE ESTA LINHA AQUI! A chave que faltava!
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
      // Atualiza a tela instantaneamente
      setProjeto({
        ...projeto,
        entregaveis: [data[0], ...(projeto.entregaveis || [])],
      });

      // Limpa o formulário e fecha o modal
      setTitulo("");
      setDescricao("");
      setLinkEntrega("");
      setIsModalOpen(false);
    } else {
      alert("Erro ao criar entrega.");
    }
    setSalvando(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 font-sans text-zinc-50">
        <p className="animate-pulse text-emerald-500">
          Carregando espaço de trabalho...
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-zinc-950 font-sans text-zinc-50 relative">
      <Sidebar />

      <main className="flex-1 p-10 h-screen overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          {/* Botão de Voltar */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-emerald-500 transition-colors mb-6"
          >
            <ArrowLeft size={16} />
            <span>Voltar para o Dashboard</span>
          </Link>

          {/* Cabeçalho do Projeto */}
          <div className="flex justify-between items-end mb-8 pb-6 border-b border-zinc-800">
            <div>
              <h1 className="text-4xl font-bold tracking-tight mb-2">
                {projeto?.nome}
              </h1>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 capitalize">
                  {projeto?.status}
                </span>
                <span className="text-zinc-500 text-sm">
                  Espaço de trabalho do projeto
                </span>
              </div>
            </div>

            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-semibold flex items-center gap-2"
            >
              <Plus size={20} />
              Nova Entrega
            </Button>
          </div>

          {/* Área Principal: Lista de Entregas ou Palco Vazio */}
          {!projeto?.entregaveis || projeto.entregaveis.length === 0 ? (
            <div className="bg-zinc-900 border border-dashed border-zinc-800 rounded-xl p-10 text-center">
              <div className="w-16 h-16 bg-zinc-950 rounded-full flex items-center justify-center mx-auto mb-4 border border-zinc-800">
                <FileText className="text-zinc-500" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-zinc-200 mb-2">
                Nenhuma entrega adicionada
              </h3>
              <p className="text-zinc-400 mb-6 max-w-md mx-auto">
                Centralize links importantes, documentos ou faturas para o seu
                cliente acessar rapidamente.
              </p>
              <Button
                onClick={() => setIsModalOpen(true)}
                className="bg-transparent border border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-50"
              >
                Adicionar primeira entrega
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projeto.entregaveis.map((entrega: any) => (
                <div
                  key={entrega.id}
                  className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col"
                >
                  <h3 className="font-semibold text-lg text-zinc-100 mb-2">
                    {entrega.conteudo.titulo}
                  </h3>
                  <p className="text-sm text-zinc-400 mb-6 flex-1">
                    {entrega.conteudo.comentarios}
                  </p>

                  {entrega.conteudo.link_figma && (
                    <a
                      href={entrega.conteudo.link_figma}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto"
                    >
                      <Button className="w-full bg-zinc-950 border border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-emerald-400 flex items-center gap-2 transition-colors">
                        <ExternalLink size={16} />
                        Acessar Link
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
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl w-full max-w-md p-6 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-50 transition-colors"
            >
              <X size={20} />
            </button>

            <h2 className="text-2xl font-bold mb-2">Adicionar Entrega</h2>
            <p className="text-zinc-400 text-sm mb-6">
              Insira os detalhes do link ou material que deseja compartilhar.
            </p>

            <form onSubmit={handleCriarEntrega} className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-medium text-zinc-300 block mb-2">
                  Título da Entrega
                </label>
                <input
                  type="text"
                  placeholder="Ex: Link do Site em Teste"
                  required
                  autoFocus
                  className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-zinc-300 block mb-2">
                  Link (URL)
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  required
                  className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={linkEntrega}
                  onChange={(e) => setLinkEntrega(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-zinc-300 block mb-2">
                  Descrição ou Observação (Opcional)
                </label>
                <textarea
                  placeholder="Ex: Segue a primeira versão do site para aprovação..."
                  rows={3}
                  className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
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
                  className="bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-semibold"
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
