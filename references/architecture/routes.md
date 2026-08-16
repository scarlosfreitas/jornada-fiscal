# Arquitetura de Roteamento e Proteção de Escopos (Next.js)

## 1. Visão Geral

O projeto usa **Next.js App Router** com todo o roteamento em `app/` na raiz do repositório (sem diretório `src/`). Existem três escopos — dois já implementados e um planejado:

- **Landing pública** (`/`) — **planejada, ainda não implementada**. Página institucional pública, sem exigir sessão.
- **Autenticação** (`/login`) — **planejada, ainda não implementada**. Hoje a tela de login vive em `/`; a arquitetura alvo é movê-la para `/login`, liberando `/` para a landing.
- **Aplicação** (`/app/*`) — **implementada**. Telas operacionais autenticadas (Dashboard, Alertas, Regras, Ordens de Serviço, Contribuintes, Configurações, Perfil); `/app` abre o Dashboard.

Estado atual (para clareza): `/` ainda é a própria tela de login (`app/page.tsx`), sem landing pública separada. Route Groups (`(marketing)`, `(auth)`) e `middleware.ts` **não existem** no código hoje; a proteção de rotas é feita por outro mecanismo (ver seção 4). As seções 2 e 3 abaixo marcam explicitamente o que já está no ar e o que é arquitetura alvo.

---

## 2. Mapa de Rotas e Visibilidade

| Escopo | Rota | Visibilidade | Descrição |
| :--- | :--- | :--- | :--- |
| **Landing (planejada)** | `/` | Pública | Página institucional pública. Ainda não implementada — hoje `/` é a tela de login. |
| **Autenticação (planejada)** | `/login` | Pública / Restrita | Tela de autenticação. Ainda não implementada — hoje o login está em `/` (`app/page.tsx`). Deve redirecionar para `/app` se já houver sessão válida. |
| **API Auth** | `/api/auth/*` | Pública (protocolo NextAuth) | Route handler do NextAuth v5 (`app/api/auth/[...nextauth]/route.ts`). |
| **Aplicação** | `/app` | Privada | Dashboard principal. |
| **Aplicação** | `/app/profile` | Privada | Meu perfil (dados pessoais, cargo, foto). |
| **Aplicação** | `/app/change-password` | Privada | Troca de senha. |
| **Aplicação (planejada em `lib/routes.ts`)** | `/app/regras/regras-de-alerta` | Privada | Regras de alerta. |
| **Aplicação (planejada)** | `/app/regras/alertas-gerados` | Privada | Alertas gerados. |
| **Aplicação (planejada)** | `/app/monitoramento` | Privada | Monitoramento. |
| **Aplicação (planejada)** | `/app/contribuintes/historico` | Privada | Jornada do contribuinte. |
| **Aplicação (planejada)** | `/app/contribuintes/situacao-cadastral` | Privada | Situação cadastral. |
| **Aplicação (planejada)** | `/app/ordens-de-servico` | Privada | Ordens de serviço. |
| **Aplicação (planejada)** | `/app/relatorios` | Privada | Relatórios. |
| **Aplicação (planejada)** | `/app/configuracoes/usuarios` | Privada | Gestão de usuários. |
| **Aplicação (planejada)** | `/app/configuracoes/perfis` | Privada | Gestão de perfis de acesso. |

As rotas de `/app/*` marcadas como "planejada" já estão definidas em `lib/routes.ts` (fonte da verdade dos caminhos) mas ainda não têm `page.tsx` implementado; nenhuma delas está no ar hoje além de `/app`, `/app/profile` e `/app/change-password`. Já `/` (landing) e `/login` são planejadas num sentido diferente: ainda não há nem rota nem constante em `lib/routes.ts` para elas — são arquitetura alvo definida pelo usuário, a ser desenhada.

A visibilidade acima é binária (autenticado / não autenticado). O sistema não implementa ainda controle por perfil de acesso (Usuário, Administrador, Cadastrador, Bloqueador de Cadastro, Validador de Cadastro) nas rotas, embora a sessão já carregue `perfis` e `cargo` (ver `auth.ts`).

---

## 3. Estrutura de Diretórios (`app/`)

Estado atual + arquitetura alvo (itens marcados **novo/planejado** ainda não existem no código):

```text
app/
├── layout.tsx                        # Root layout: fontes, gestor-alertas.css, Toaster
├── (marketing)/                      # NOVO/PLANEJADO
│   ├── layout.tsx                    # Layout institucional (Navbar pública, Footer)
│   └── page.tsx                      # Rota '/' — landing (hoje '/' é a tela de login)
├── (auth)/                           # NOVO/PLANEJADO
│   ├── layout.tsx                    # Layout limpo de autenticação
│   └── login/
│       └── page.tsx                  # Rota '/login' (mover conteúdo do atual app/page.tsx)
├── gestor-alertas.css                # Design system do produto
├── api/
│   └── auth/
│       └── [...nextauth]/
│           └── route.ts              # Handlers do NextAuth v5
└── app/
    ├── layout.tsx                    # Layout autenticado (Sidebar, Topbar, Footer)
    │                                  # Faz a checagem de sessão (auth() + redirect)
    ├── page.tsx                      # Rota '/app' (Dashboard)
    ├── profile/
    │   ├── page.tsx                  # Rota '/app/profile'
    │   └── actions.ts                # Server Action updateProfile
    └── change-password/
        ├── page.tsx                  # Rota '/app/change-password'
        └── actions.ts                # Server Action changePassword
```

Hoje, sem `(marketing)` e `(auth)`, a rota `/` é servida diretamente por `app/page.tsx` (tela de login). A migração para a estrutura acima envolve: criar `app/(marketing)/page.tsx` com o novo conteúdo institucional de `/`, mover o conteúdo atual de `app/page.tsx` para `app/(auth)/login/page.tsx` (rota `/login`), e ajustar `authConfig.pages.signIn` (hoje `"/"` em `auth.config.ts`) para `"/login"` — essa última é uma mudança de **código**, citada aqui apenas como ponto de atenção para quando a implementação for feita.

Arquivos de suporte relevantes fora de `app/`: `auth.ts` (config do NextAuth + provider Credentials), `auth.config.ts` (config compartilhada, incluindo callback `authorized`), `lib/routes.ts` (constantes de rota).

---

## 4. Considerações sobre a proteção de rotas

- **Não existe `middleware.ts`** no projeto. A proteção de `/app/*` é feita dentro do próprio Server Component `app/app/layout.tsx`, que chama `auth()` e faz `redirect("/")` quando não há sessão. Esse padrão — checar a sessão na camada de dados/página em vez de depender só de middleware — é, hoje, a prática recomendada pelo próprio Next.js: middleware isolado não deve ser tratado como fronteira de autorização, especialmente após o histórico de bypass de middleware via header `x-middleware-subrequest` (CVE-2025-29927). A abordagem atual do projeto já está alinhada com essa recomendação.

- As **Server Actions** (`changePassword` em `app/app/change-password/actions.ts` e `updateProfile` em `app/app/profile/actions.ts`) fazem sua própria checagem de sessão via `auth()` antes de qualquer leitura ou escrita, de forma independente do layout. Isso é importante porque Server Actions não passam pelo `matcher` de um eventual middleware de página da mesma forma que rotas — cada action precisa validar sessão por conta própria, como já ocorre.

- `auth.config.ts` já define um callback `authorized` (`callbacks.authorized`, checando `pathname.startsWith("/app")`) que só faz sentido para consumo por um `middleware.ts` — mas esse middleware **não existe** hoje. O callback está órfão: não tem efeito nenhum sobre a proteção real das rotas, que é garantida pelo `redirect()` em `app/app/layout.tsx` e pelas checagens dentro das Server Actions.

- **Recomendação para uma eventual introdução de `middleware.ts`**: tratá-lo como camada adicional de UX (redirecionamento antecipado, antes de renderizar o layout autenticado), nunca como a única fronteira de autorização. As checagens de `auth()` em `app/app/layout.tsx` e em cada Server Action devem permanecer mesmo que o middleware passe a existir — removê-las "por redundância" reduziria a segurança do sistema, não aumentaria.

- **Lacuna atual**: não há controle de acesso por perfil (RBAC) nas rotas — apenas autenticado/não autenticado. Rotas sensíveis como `/app/configuracoes/usuarios` e `/app/configuracoes/perfis` (ainda não implementadas) provavelmente exigirão perfil Administrador; isso precisará ser decidido e documentado quando essas telas forem implementadas.
