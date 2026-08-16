## Why

A aplicação está inteiramente aberta: o painel operacional responde em `/dashboard` sem qualquer verificação de sessão, e `/` ainda serve o boilerplate do `create-next-app` — que, desde que `globals.css` deixou de ser importado, renderiza sem estilo nenhum. Não há `prisma/schema.prisma`, então não existe usuário, perfil nem senha em lugar algum, apesar de `next-auth`, `@auth/prisma-adapter`, `bcryptjs` e `zod` já estarem instalados.

Duas necessidades se resolvem juntas porque dependem do mesmo desenho de URLs: separar o público do privado (`/` de entrada, `/app` para a aplicação) e fechar o acesso ao que é privado. `pages.signIn`, os redirects de sucesso e o matcher da guarda de rotas derivam todos dessa decisão.

## What Changes

**Estrutura de rotas**
- **BREAKING**: toda a aplicação passa de `/` para o prefixo `/app`. O painel operacional deixa de responder em `/dashboard` e passa a ser o índice de `/app`. O route group `app/(dashboard)/` é eliminado — a pasta literal `app/app/` passa a ser a fronteira do layout.
- `app/page.tsx` deixa de ser boilerplate e passa a renderizar a tela de login.
- Novo `lib/routes.ts` como fonte única das rotas. Hoje há três `<Link>` com caminhos que divergem entre si e do `components/layout/nav-data.ts`.

**Persistência**
- Novo `prisma/schema.prisma` com `Usuario`, `Perfil` e a tabela de junção `UsuarioPerfil`, mais a primeira migration.
- Novo `lib/db.ts` com o singleton do `PrismaClient`, para o hot reload do desenvolvimento não abrir conexão nova a cada recompilação.
- Novo `prisma/seed.ts` criando os cinco perfis iniciais do domínio e um administrador com senha hasheada.

**Autenticação**
- Auth.js v5 com provider `Credentials` (e-mail + senha), sessão por JWT, validação de entrada com `zod` e verificação de senha com `bcryptjs.compare`.
- Novos `auth.config.ts`, `auth.ts`, `app/api/auth/[...nextauth]/route.ts` e a augmentation de tipos da sessão.
- Proteção em duas camadas: `proxy.ts` na raiz do projeto (em Next.js 16 o `middleware.ts` foi renomeado para `proxy.ts`) e uma verificação de sessão dentro do layout da aplicação.

**Ícones**
- `lucide-react` passa a ser o sistema único de ícones, substituindo os 16 componentes SVG de `components/icons/`. Isso reverte a decisão tomada em `dashboard-shell`, que optara por SVG inline extraído do protótipo.

## Capabilities

### New Capabilities
- `autenticacao`: identificação da pessoa usuária no sistema — credenciais, sessão, encerramento, e o controle de acesso às áreas privadas, incluindo os perfis que a sessão carrega.
- `app-routing`: a estrutura de URLs do produto — o que é público na raiz do domínio, o que vive sob o prefixo da aplicação, e como as rotas são referenciadas no código.

### Modified Capabilities
Nenhuma declarada aqui. `dashboard-shell` e `dashboard-panel` existem apenas como deltas **pendentes** em `openspec/changes/` (nada foi arquivado, `openspec/specs/` está vazio), e o requisito "Painel operacional na rota /dashboard" de `page-dashboard` contradiz esta change. A tarefa 0 corrige esse texto no delta pendente. Se as três changes forem arquivadas antes desta ser aplicada, o ajuste deve virar um `MODIFIED Requirements` sobre `dashboard-panel`.

## Impact

- **Depende de**: o PostgreSQL do `postgres-compose` em execução. As tarefas 6.1 a 6.4 daquela change ficaram abertas porque a sessão que a implementou rodava dentro do container `app`, sem socket do Docker. `prisma migrate` exige banco de pé.
- **Código novo**: `prisma/schema.prisma`, `prisma/seed.ts`, `lib/db.ts`, `lib/routes.ts`, `auth.config.ts`, `auth.ts`, `proxy.ts`, `types/next-auth.d.ts`, `app/api/auth/[...nextauth]/route.ts`, componentes da tela de login.
- **Código movido**: `app/(dashboard)/layout.tsx` → `app/app/layout.tsx`; `app/(dashboard)/dashboard/page.tsx` → `app/app/page.tsx`.
- **Código alterado**: `app/page.tsx`, `components/layout/nav-data.ts`, `components/layout/Sidebar.tsx`, `components/dashboard/{PainelOperacional,UltimosAlertasTable,MonitoramentosAtivosTable}.tsx`, todo `components/icons/`, `package.json`, `.env`, `.env.example`.
- **Dependências**: `+lucide-react`, `+tsx` (devDependency, para executar o seed em TypeScript). `next-auth@5.0.0-beta.32`, `bcryptjs`, `zod` e `@prisma/client` já estão instalados.
- **Fora de escopo**: integração com o Active Directory; telas de cadastro de usuários e de perfis (`ListaUsuarios.html`, `Perfis.html`); recuperação de senha por e-mail secundário e as regras de bloqueio de usuário; login por certificado digital A3; a landing page pública real.
