# 🚀 Lyncar - O Sistema Operacional para Agências

O **Lyncar** é um SaaS (Software as a Service) premium focado na gestão de relacionamento e entregas entre agências/freelancers e seus clientes finais. O objetivo é eliminar o caos de comunicações espalhadas (WhatsApp, E-mail, Drive) e centralizar tudo em um portal elegante, minimalista e com uma experiência de usuário (UX) de alto nível.

## 🛠️ Tecnologias Utilizadas

Este projeto utiliza o que há de mais moderno e performático no ecossistema de desenvolvimento web em 2026:

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **Estilização:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Componentes de UI:** [shadcn/ui](https://ui.shadcn.com/) e [Lucide React](https://lucide.dev/) para ícones.
- **Feedback Visual:** [Sonner](https://sonner.emilkowal.ski/) para notificações Toast de alta performance.
- **Banco de Dados Híbrido:** [Supabase](https://supabase.com/) (PostgreSQL com suporte a JSONB)
- **Autenticação:** Supabase Auth com persistência de sessão.

## 🏛️ Arquitetura do Banco de Dados (Híbrida)

O diferencial técnico do Lyncar é a sua **Arquitetura de Banco de Dados Híbrida**. Em vez de ficarmos presos apenas ao SQL rígido, combinamos o melhor dos dois mundos:

1.  **SQL Estruturado (Relacional):** Para garantir a integridade de dados fundamentais como `Agencias`, `Clientes` e `Projetos`.
2.  **JSONB (NoSQL Flexível):** A tabela de `Entregáveis` utiliza uma coluna JSONB. Isso permite que cada projeto tenha tipos de entrega únicos (links do Figma, vídeos do YouTube, arquivos PDF) sem a necessidade de criar dezenas de tabelas ou colunas nulas.

## ✨ Funcionalidades Principais

**Gestão e Inteligência (Novidades):**

- **Dashboard Analítico:** Painel de inteligência de negócios com métricas em tempo real (Total de Projetos, Em Andamento, Entregues).
- **Portal do Cliente (Read-only):** Geração de links mágicos (`/portal/[id]`) para os clientes finais acessarem os materiais de forma segura, com uma interface premium e livre de distrações.
- **Ciclo de Vida do Projeto:** Gestão completa (CRUD) permitindo editar nomes, alterar status dinâmicos (Ativo, Em Pausa, Concluído) e uma "Danger Zone" para exclusão segura do projeto e seus dados.

**Core (Base Sólida):**

- **Autenticação e Segurança:** Fluxo completo de Login/Logout integrado ao Supabase Auth com proteção de rotas privadas e públicas.
- **Arquitetura Multi-Tenant:** Isolamento de dados no banco, garantindo que o usuário visualize e gerencie apenas os seus projetos.
- **Rotas Dinâmicas de Espaço de Trabalho:** Geração automática de páginas exclusivas para cada projeto (`/projetos/[id]`).
- **Gestão de Entregáveis:** Adição, edição e remoção de links externos e materiais de aprovação salvos em tempo real.
- **Sidebar Dinâmica:** Barra lateral profissional com Active States (identificação inteligente da página atual) e integração de marca visual própria.

## 🎨 Interface e Experiência (UX/UI Premium)

A interface foi refinada com inspiração no padrão de excelência do ecossistema Next.js (como Linear e Vercel), focando em fluidez e percepção de velocidade:

- **Dark Mode Nativo:** Estética "Zinc-Black" profunda e minimalista.
- **Alien Glow & Hover States:** Micro-interações avançadas nos cards, revelando bordas iluminadas e elementos de ação (setas) apenas no foco do usuário.
- **Skeleton Loading:** Substituição de textos estáticos de carregamento por telas "fantasmas" pulsantes, eliminando saltos bruscos de layout (Cumulative Layout Shift) e aumentando a velocidade percebida.
- **Notificações Toast (Sonner):** Feedbacks de sucesso e erro não intrusivos, com design moderno e animações suaves de entrada e saída.
- **Tipografia Otimizada:** Utilização das fontes `Geist` e `Geist Mono` para máxima legibilidade e estética sofisticada.

## 🚀 Como rodar o projeto localmente

1.  **Clone o repositório:**

    ```bash
    git clone [https://github.com/Allan14GDS/lyncar-os.git](https://github.com/Allan14GDS/lyncar-os.git)
    ```

2.  **Instale as dependências:**

    ```bash
    npm install
    ```

3.  **Configure as variáveis de ambiente:**
    Crie um arquivo `.env.local` na raiz do projeto e adicione suas chaves do Supabase:

    ```env
    NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
    NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon_publica
    ```

4.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```

---

Desenvolvido por **Allan** - Focado em criar interfaces incríveis e soluções escaláveis.
