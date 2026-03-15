import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner"; // 1. Importamos o motor de notificações
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 2. Trocamos o nome da aba do navegador para a nossa marca!
export const metadata: Metadata = {
  title: "Lyncar OS | Portal do Cliente",
  description: "O sistema operacional premium para agências e freelancers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-zinc-950 text-zinc-50 antialiased`}
      >
        {children}
        {/* 3. Colocamos o Toaster aqui para ele funcionar em todas as páginas */}
        <Toaster theme="dark" position="bottom-right" richColors />
      </body>
    </html>
  );
}
