> Parar ao final de cada grupo numerado para revisão, conforme pedido.

## 0. Preparação

- [x] 0.1 Confirmar na máquina hospedeira que o PostgreSQL do `postgres-compose` está de pé e saudável (`docker compose ps`, `pg_isready`) — as tarefas 6.1 a 6.4 daquela change continuam abertas e `prisma migrate` não roda sem banco
- [x] 0.2 Corrigir no delta pendente `openspec/changes/page-dashboard/specs/dashboard-panel/spec.md` o requisito "Painel operacional na rota /dashboard" e as menções a `/dashboard` nos textos de `dashboard-shell` e `page-dashboard`
- [x] 0.3 Instalar `lucide-react` e `tsx` (esta como devDependency)

## 1. Prisma: schema, migration e singleton

- [x] 1.1 Criar `prisma/schema.prisma` com `datasource` PostgreSQL lendo `env("DATABASE_URL")` e `generator client`
- [x] 1.2 Declarar o model `Usuario` com `id`, `nome`, `sobrenome`, `email` único, `password`, `telefone`, `image`, `cargo`, `lotacao`, `sq_situacao`, `dt_criacao` e `dt_atualizacao`
- [x] 1.3 Declarar os models `Perfil` (com `nome` único) e `UsuarioPerfil` (chave composta, `onDelete: Cascade` nos dois lados)
- [x] 1.4 Criar `lib/db.ts` com o singleton do `PrismaClient` no padrão `globalThis`, para o hot reload não abrir conexão nova a cada recompilação
- [x] 1.5 Rodar `npx prisma migrate dev --name init_usuarios_perfis` e conferir as tabelas criadas

## 2. Configuração do Auth.js

- [x] 2.1 Criar `auth.config.ts` com `pages: { signIn: "/" }`, `session: { strategy: "jwt" }`, callback `authorized` e `providers: []` — sem importar Prisma nem bcrypt, porque é o que o proxy carrega no edge
- [x] 2.2 Criar `auth.ts` na raiz com `NextAuth({ ...authConfig, providers: [Credentials(...)] })`, exportando `{ handlers, auth, signIn, signOut }`
- [x] 2.3 Implementar `authorize()` na ordem: validar com `zod` → buscar por e-mail → `bcryptjs.compare` → retornar o usuário sem o campo `password` e com a lista de nomes de perfis, ou `null`
- [x] 2.4 Garantir que usuário inexistente e senha incorreta produzem resultado indistinguível, sem log da senha nem do motivo da falha
- [x] 2.5 Implementar os callbacks `jwt` e `session` levando `id` e `perfis` para a sessão
- [x] 2.6 Criar `types/next-auth.d.ts` com a augmentation de `Session` e `JWT` para tipar `id` e `perfis`
- [x] 2.7 Criar `app/api/auth/[...nextauth]/route.ts` com `export const { GET, POST } = handlers`

## 3. Mover a aplicação para `/app`

- [x] 3.1 `git mv app/(dashboard)/layout.tsx app/app/layout.tsx` e `git mv app/(dashboard)/dashboard/page.tsx app/app/page.tsx`; remover a pasta vazia `app/(dashboard)/`
- [x] 3.2 Tipar `app/app/layout.tsx` como `LayoutProps<"/app">`, alinhando com o typed routes já usado em `app/layout.tsx`, e ajustar o `metadata` de `app/app/page.tsx`
- [x] 3.3 Criar `lib/routes.ts` com `APP_BASE = "/app"` e o objeto `ROUTES` cobrindo todas as telas de `NAV_ITEMS` e `APP_FEATURES`
- [x] 3.4 Fazer `components/layout/nav-data.ts` referenciar `ROUTES.*` no lugar dos literais
- [x] 3.5 Corrigir os três `<Link>` divergentes para `ROUTES.*`: `PainelOperacional.tsx:72` (`/regras`), `UltimosAlertasTable.tsx:12` (`/alertas-gerados`) e `MonitoramentosAtivosTable.tsx:12` (`/monitoramento`)
- [x] 3.6 Ajustar a detecção de item ativo da `Sidebar`: igualdade para o índice `/app`, prefixo para os demais, de modo que "Painel" não fique aceso nas outras telas

## 4. Tela de login em `/`

- [x] 4.1 Substituir o boilerplate de `app/page.tsx` pela tela de login, montada com `.ga-card`, os campos de formulário e `.ga-btn-primary`, usando `references/design/DesignSystem.html` como catálogo de componentes
- [x] 4.2 Implementar o client component chamando `signIn("credentials", { redirect: false, ... })`, com estado de envio que sinaliza andamento e impede reenvio
- [x] 4.3 Tratar o sucesso redirecionando para `/app` (ou para o `callbackUrl`, quando presente)
- [x] 4.4 Tratar a falha com mensagem genérica única, usando os tokens `--ga-danger*` do design system
- [x] 4.5 Redirecionar para `/app` quem acessa `/` já autenticado, com verificação `auth()` no server component

## 5. Proteção em duas camadas

- [x] 5.1 Criar `proxy.ts` na raiz do projeto — **não** `middleware.ts` — exportando `const { auth: proxy } = NextAuth(authConfig)` e `config.matcher = ["/app/:path*"]`
- [x] 5.2 Confirmar que o matcher deixa de fora `_next/static`, `_next/image`, `public/` e `/api/auth/*`
- [x] 5.3 Acrescentar a verificação `auth()` em `app/app/layout.tsx` com `redirect("/")` quando não houver sessão
- [x] 5.4 Garantir que o redirecionamento preserva o destino pretendido e que a autenticação bem-sucedida leva a ele

## 6. Seed

- [x] 6.1 Criar `prisma/seed.ts` que faz `upsert` dos cinco perfis do domínio: Usuário, Administrador, Cadastrador, Bloqueador de Cadastro e Validador de Cadastro
- [x] 6.2 Fazer `upsert` de um administrador com senha hasheada por `bcryptjs` (custo 10 ou mais), vinculado ao perfil Administrador, com `cargo` e `lotacao` preenchidos
- [x] 6.3 Ler as credenciais do administrador de variáveis de ambiente, com fallback apenas para desenvolvimento; acrescentar as chaves ao `.env` e ao `.env.example` (placeholder no versionado)
- [x] 6.4 Configurar `"prisma": { "seed": "tsx prisma/seed.ts" }` no `package.json`
- [x] 6.5 Rodar `npx prisma db seed` e confirmar no banco que a coluna `password` guarda hash `$2a$…`, nunca texto puro

## 7. Migração dos ícones para lucide-react

- [x] 7.1 Mapear cada um dos 16 componentes de `components/icons/` para o equivalente em lucide, listando os que não têm correspondência fiel (o de Painel é um arranjo próprio de quatro retângulos)
- [x] 7.2 Apresentar a comparação antes/depois dos casos sem equivalente e decidir, caso a caso, entre o ícone mais próximo e a manutenção do SVG inline
- [x] 7.3 Substituir os usos em `components/layout/`, `components/dashboard/` e na tela de login, removendo os componentes que deixarem de ser usados

## 8. Verificação

- [x] 8.1 `npm run lint` e `npm run build` sem erros
- [x] 8.2 `curl -I localhost:3000/app` sem sessão → redirecionamento para `/` com `callbackUrl`
- [x] 8.3 `curl -I localhost:3000/dashboard` → 404
- [x] 8.4 `curl -I` em um asset de `_next/static` → 200, confirmando que o proxy não o interceptou
- [x] 8.5 Autenticar com senha errada e com e-mail inexistente, confirmando mensagens indistinguíveis
- [x] 8.6 Autenticar corretamente e confirmar: chegada em `/app`, painel completo, "Painel" ativo e somente ele, e os links do conteúdo apontando para `/app/...`
- [x] 8.7 Acessar `/` já autenticado e confirmar o redirecionamento para `/app`
- [x] 8.8 Encerrar a sessão e confirmar que `/app` volta a exigir credenciais
- [x] 8.9 `grep -rn 'href="/' components app --include=*.tsx` → nenhuma rota literal fora de `lib/routes.ts`
