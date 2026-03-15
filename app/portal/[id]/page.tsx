"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ExternalLink, CheckCircle2, Clock } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { SkeletonCard } from "@/components/SkeletonCard";

export default function PortalDoCliente() {
  const params = useParams();
  const [projeto, setProjeto] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarProjetoPublico() {
      // Aqui NÃO verificamos sessão de login, pois o cliente final não tem senha!
      // Ele acessa apenas com o Link Mágico (ID do projeto).
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
      }
      setLoading(false);
    }

    carregarProjetoPublico();
  }, [params.id]);

  if (!loading && !projeto) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-zinc-50">
        <h1 className="text-2xl font-bold mb-2">Projeto não encontrado</h1>
        <p className="text-zinc-500">
          O link pode estar quebrado ou o projeto foi removido.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 font-sans text-zinc-50 selection:bg-emerald-500/30">
      {/* Topbar Minimalista do Cliente */}
      <header className="border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Logótipo Lyncar"
              width={32}
              height={32}
              className="drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]"
            />
            <span className="text-xl font-bold tracking-tight text-zinc-50">
              Lyncar<span className="text-emerald-500">.</span>
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-zinc-400 bg-zinc-900/50 px-4 py-2 rounded-full border border-zinc-800">
            <CheckCircle2 size={16} className="text-emerald-500" />
            <span>Ambiente Seguro</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {loading ? (
          <div>
            <div className="h-12 w-3/4 bg-zinc-900 rounded-lg animate-pulse mb-4"></div>
            <div className="h-6 w-1/3 bg-zinc-900 rounded-lg animate-pulse mb-12"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SkeletonCard />
              <SkeletonCard />
            </div>
          </div>
        ) : (
          <>
            {/* Cabeçalho do Projeto */}
            <div className="mb-12">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-zinc-500">
                {projeto.nome}
              </h1>
              <div className="flex items-center gap-4 text-zinc-400">
                <span className="flex items-center gap-2">
                  <Clock size={18} className="text-emerald-500" />
                  Status:{" "}
                  <strong className="text-zinc-200 capitalize">
                    {projeto.status}
                  </strong>
                </span>
                <span className="text-zinc-700">•</span>
                <span>Acompanhamento de Entregas</span>
              </div>
            </div>

            {/* Lista de Entregáveis (Somente Leitura) */}
            {projeto.entregaveis && projeto.entregaveis.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projeto.entregaveis.map((entrega: any) => (
                  <div
                    key={entrega.id}
                    className="group relative p-8 rounded-2xl bg-gradient-to-b from-zinc-900/80 to-zinc-900/30 border border-zinc-800 hover:border-emerald-500/50 transition-all duration-500 flex flex-col h-full shadow-lg"
                  >
                    {/* Efeito Glow Premium */}
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-emerald-500/0 to-transparent group-hover:via-emerald-500/80 transition-all duration-700"></div>

                    <h3 className="font-bold text-2xl text-zinc-100 mb-3">
                      {entrega.conteudo.titulo}
                    </h3>
                    <p className="text-base text-zinc-400 mb-8 flex-1 leading-relaxed">
                      {entrega.conteudo.comentarios ||
                        "Sem descrição adicional."}
                    </p>

                    {entrega.conteudo.link_figma && (
                      <a
                        href={entrega.conteudo.link_figma}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-auto block"
                      >
                        <Button className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold py-6 text-md shadow-[0_0_20px_rgba(16,185,129,0.15)] hover:shadow-[0_0_25px_rgba(16,185,129,0.3)] transition-all">
                          Acessar Material
                          <ExternalLink size={18} className="ml-2" />
                        </Button>
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-zinc-900/20 border border-zinc-800/50 rounded-3xl border-dashed">
                <Clock className="mx-auto text-zinc-600 mb-4" size={48} />
                <h3 className="text-xl font-medium text-zinc-300 mb-2">
                  Aguardando materiais
                </h3>
                <p className="text-zinc-500">
                  As entregas deste projeto aparecerão aqui em breve.
                </p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
