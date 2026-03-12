import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/Sidebar"; // Puxando a nossa nova barra!

export default async function Home() {
  const { data: projetos, error } = await supabase
    .from("projetos")
    .select("*, entregaveis(*)");

  if (error) {
    return <div className="p-10 text-red-500">Erro: {error.message}</div>;
  }

  return (
    // Transformamos a tela toda em um Flexbox (lado a lado)
    <div className="flex min-h-screen bg-zinc-950 font-sans text-zinc-50">
      {/* A nossa Sidebar fica fixa na esquerda */}
      <Sidebar />

      {/* O conteúdo principal ocupa o resto da tela (flex-1) */}
      <main className="flex-1 p-10 h-screen overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Visão Geral
          </h1>
          <p className="text-zinc-400 mb-8">
            Bem-vindo ao Lyncar OS. Aqui estão os seus projetos ativos.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projetos?.map((projeto) => (
              <Card
                key={projeto.id}
                className="border-zinc-800 bg-zinc-900 text-zinc-50"
              >
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl">{projeto.nome}</CardTitle>
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 capitalize">
                      {projeto.status}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="grid gap-4">
                  {projeto.entregaveis?.map((entregavel: any) => (
                    <div
                      key={entregavel.id}
                      className="p-5 rounded-lg bg-zinc-950 border border-zinc-800"
                    >
                      <h3 className="font-semibold text-zinc-200 mb-1">
                        {entregavel.conteudo.titulo}
                      </h3>
                      <p className="text-sm text-zinc-400 mb-5">
                        {entregavel.conteudo.comentarios}
                      </p>

                      {entregavel.conteudo.cores_aprovadas && (
                        <div className="mb-5">
                          <span className="text-xs text-zinc-500 uppercase tracking-wider mb-2 block">
                            Paleta Aprovada
                          </span>
                          <div className="flex gap-2">
                            {entregavel.conteudo.cores_aprovadas.map(
                              (cor: string) => (
                                <div
                                  key={cor}
                                  className="w-8 h-8 rounded-full border border-zinc-700 shadow-sm"
                                  style={{ backgroundColor: cor }}
                                  title={cor}
                                />
                              ),
                            )}
                          </div>
                        </div>
                      )}

                      {entregavel.conteudo.link_figma && (
                        <a
                          href={entregavel.conteudo.link_figma}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button className="w-full bg-zinc-50 text-zinc-950 hover:bg-zinc-200">
                            Acessar no Figma
                          </Button>
                        </a>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
