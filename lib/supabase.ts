import { createClient } from "@supabase/supabase-js";

// Puxando as chaves secretas do seu arquivo .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Criando a conexão oficial
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
