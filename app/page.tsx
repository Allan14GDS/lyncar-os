"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/Sidebar";
import { Plus, X } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [projetos, setProjetos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nomeProjeto, setNomeProjeto] = useState("");
  const [salvando, setSalvando] = useState(false);

  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function carregarPainel() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
        return;
      }

      setUserId(session.user.id);

      const { data, error } = await supabase
        .from("projetos")
        .select("*, entregaveis(*)")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (data) {
        setProjetos(data);
      }
      setLoading(false);
    }

    carregarPainel();
  }, [router]);

  const handleCriarProjeto = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvando(true);

    const { data, error } = await supabase
      .from("projetos")
      .insert([
        {
          nome: nomeProjeto,
          status: "ativo",
          user_id: userId,
        },
      ])
      .select("*, entregaveis(*)");

    if (!error && data) {
      setProjetos([data[0], ...projetos]);
      setNomeProjeto("");
      setIsModalOpen(false);
    } else {
      alert("Erro ao criar projeto.");
    }

    setSalvando(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 font-sans text-zinc-50">
        <p className="animate-pulse text-lg text-emerald-500">
          Abrindo as portas do Lyncar...
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-zinc-950 font-sans text-zinc-50 relative">
      <Sidebar />

      <main className="flex-1 p-10 h-screen overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="text-4xl font-bold tracking-tight mb-2">
                Visão Geral
              </h1>
              <p className="text-zinc-400">
                Bem-vindo ao Lyncar OS. Aqui estão os seus projetos ativos.
              </p>
            </div>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-semibold flex items-center gap-2"
            >
              <Plus size={20} />
              Novo Projeto
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projetos?.length === 0 ? (
              <div className="col-span-1 md:col-span-2 p-10 text-center border border-dashed border-zinc-800 rounded-xl">
                <p className="text-zinc-500 mb-4">
                  Você ainda não tem nenhum projeto.
                </p>
                <Button
                  onClick={() => setIsModalOpen(true)}
                  variant="outline"
                  className="border-zinc-700 text-zinc-300"
                >
                  Criar meu primeiro projeto
                </Button>
              </div>
            ) : (
              projetos?.map((projeto) => (
                <Link href={`/projetos/${projeto.id}`} key={projeto.id}>
                  <Card className="border-zinc-800 bg-zinc-900 text-zinc-50 hover:border-emerald-500/50 hover:shadow-md hover:shadow-emerald-900/10 transition-all cursor-pointer h-full">
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-xl">
                          {projeto.nome}
                        </CardTitle>
                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 capitalize">
                          {projeto.status}
                        </span>
                      </div>
                    </CardHeader>

                    <CardContent className="grid gap-4">
                      <p className="text-sm text-zinc-500">
                        Clique para abrir e gerenciar as entregas e links deste
                        projeto.
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))
            )}
          </div>
        </div>
      </main>

      {/* MODAL DE NOVO PROJETO */}
      {isModalOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl w-full max-w-md p-6 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-50"
            >
              <X size={20} />
            </button>
            <h2 className="text-2xl font-bold mb-2">Criar Novo Projeto</h2>
            <form onSubmit={handleCriarProjeto} className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-medium text-zinc-300 block mb-2">
                  Nome do Projeto
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={nomeProjeto}
                  onChange={(e) => setNomeProjeto(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <Button
                  type="submit"
                  disabled={salvando || !nomeProjeto.trim()}
                  className="bg-emerald-500 text-zinc-950 font-semibold"
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
