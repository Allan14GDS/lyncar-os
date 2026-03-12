# 🚀 Lyncar - O Sistema Operacional para Agências

O **Lyncar** é um SaaS (Software as a Service) premium focado na gestão de relacionamento e entregas entre agências/freelancers e seus clientes finais. O objetivo é eliminar o caos de comunicações espalhadas (WhatsApp, E-mail, Drive) e centralizar tudo em um portal elegante, minimalista e com uma experiência de usuário (UX) de alto nível.

## 🛠️ Tecnologias Utilizadas

Este projeto utiliza o que há de mais moderno e performático no ecossistema de desenvolvimento web em 2026:

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **Estilização:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Componentes de UI:** [shadcn/ui](https://ui.shadcn.com/) e [Lucide React](https://lucide.dev/) para ícones.
- **Banco de Dados Híbrido:** [Supabase](https://supabase.com/) (PostgreSQL com suporte a JSONB)
- **Autenticação:** Supabase Auth com persistência de sessão.

## 🏛️ Arquitetura do Banco de Dados (Híbrida)

O diferencial técnico do Lyncar é a sua **Arquitetura de Banco de Dados Híbrida**. Em vez de ficarmos presos apenas ao SQL rígido, combinamos o melhor dos dois mundos:

1.  **SQL Estruturado (Relacional):** Para garantir a integridade de dados fundamentais como `Agencias`, `Clientes` e `Projetos`.
2.  **JSONB (NoSQL Flexível):** A tabela de `Entregáveis` utiliza uma coluna JSONB. Isso permite que cada projeto tenha tipos de entrega únicos (links do Figma, arquivos PDF, faturas, blocos de texto) sem a necessidade de criar dezenas de tabelas ou colunas nulas.

## ✨ Funcionalidades Atuais

- **Interface Premium Base:** Layout escuro (Dark Mode) responsivo configurado.
- **Autenticação Real:** Fluxo completo de Login e Logout integrado ao Supabase Auth, permitindo acesso apenas a usuários cadastrados.
- **Sidebar de Navegação:** Barra lateral profissional com navegação entre Dashboard, Projetos e Configurações.
- **Integração com Banco de Dados:** Conexão Server-Side direta e segura com o Supabase utilizando `@supabase/ssr`.
- **Dashboard Dinâmico:** Leitura em tempo real de projetos e entregáveis, transformando dados `JSONB` em elementos visuais (renderização de paletas de cores, comentários e links externos).

## 🎨 Interface e Experiência

A interface foi construída seguindo princípios de design premium:

- **Dark Mode Nativo:** Estética escura inspirada em ferramentas como Vercel e Linear.
- **Componentização:** Uso rigoroso de componentes atômicos para garantir consistência visual.
- **Responsividade:** Experiência fluida tanto em desktops quanto em dispositivos móveis.

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
