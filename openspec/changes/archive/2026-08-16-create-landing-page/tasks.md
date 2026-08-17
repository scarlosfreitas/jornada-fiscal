## 1. Rotas e estrutura

- [x] 1.1 Criar `app/(auth)/layout.tsx` (layout limpo de autenticação, sem sidebar/topbar/rodapé) e `app/(auth)/login/page.tsx`, movendo para lá o conteúdo atual de `app/page.tsx` (chamada a `auth()`, redirect para `ROUTES.painel` se já houver sessão, `LogoIcon`, `LoginForm`), sem alterar a lógica.
- [x] 1.2 Criar `app/(marketing)/layout.tsx` (layout institucional, sem sidebar/topbar/rodapé da aplicação) e `app/(marketing)/page.tsx` com a landing.
- [x] 1.3 Remover `app/page.tsx` (substituído pela rota em `app/(auth)/login/page.tsx` e pela nova landing em `app/(marketing)/page.tsx`).
- [x] 1.4 Adicionar a constante de rota do login em `lib/routes.ts` (ex.: `LOGIN_ROUTE = "/login"`), mantendo `app-routing` com fonte única de rotas.
- [x] 1.5 Atualizar `authConfig.pages.signIn` em `auth.config.ts` de `"/"` para `"/login"`.

## 2. Conteúdo da landing

- [x] 2.1 Implementar a seção hero (nav com âncoras para as demais seções, chamada para ação "Log in"/"Logar agora" apontando para `/login`, headline, subtexto e estatísticas de destaque) usando classes `.ga-*`/tokens `--ga-*`.
- [x] 2.2 Implementar a seção "Regras de aviso" com os quatro cartões de fonte de dados (DFe, RedeSim, Cadastro no SATE, Dados abertos), cada um com título, descrição e chips.
- [x] 2.3 Implementar a seção "Timeline do contribuinte" com o exemplo de linha do tempo (eventos com data, tag colorida por tipo e documento anexado quando houver) e a lista de destaques ao lado.
- [x] 2.4 Implementar a seção "Plataforma de dados" com o pipeline (SATE Oracle → Kafka → MinIO → Iceberg → Trino → Superset → JupyterLab) e as notas da plataforma.
- [x] 2.5 Implementar a seção "Operações conjuntas" com os cartões numéricos e a ilustração de vínculos do contribuinte.
- [x] 2.6 Implementar a seção final de CTA + rodapé institucional (copyright, termos de uso, política de privacidade).

## 3. Verificação

- [x] 3.1 Rodar `npm run lint`.
- [x] 3.2 Rodar `npm run dev` e verificar manualmente: `/` exibe a landing sem sessão e sem moldura da aplicação; `/login` exibe o formulário de login; login bem-sucedido leva a `/app`; acessar `/login` já autenticado redireciona para `/app`; acessar `/app/*` sem sessão continua redirecionando para `/login` (via `auth.config.ts`/`app/app/layout.tsx`).
