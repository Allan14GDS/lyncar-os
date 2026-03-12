"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Credenciais inválidas.");
      setLoading(false);
    } else {
      router.push("/");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 font-sans">
      <div className="w-full max-w-sm p-8 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl">
        <h2 className="text-2xl font-bold text-zinc-50 mb-2">
          Entrar no Lyncar
        </h2>
        <p className="text-zinc-400 mb-8 text-sm">
          Acesse o seu portal de projetos.
        </p>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300 block">
              Email
            </label>
            <input
              type="email"
              placeholder="seu@email.com"
              className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300 block">
              Senha
            </label>
            <input
              type="password"
              className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-zinc-50 text-zinc-950 font-bold rounded-lg hover:bg-zinc-200 transition-colors disabled:opacity-50"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
