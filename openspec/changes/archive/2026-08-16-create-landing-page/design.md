## Context

Hoje `app/page.tsx` serve a tela de login diretamente na raiz (`/`), sem route groups. `app/layout.tsx` (raiz) já centraliza fontes, `gestor-alertas.css` e o `Toaster` para toda a aplicação — não fornece nenhuma moldura de página (sidebar/topbar), então tanto a landing quanto o login continuam livres para definir seu próprio layout de página sem herdar nada indesejado. `references/architecture/routes.md` já descreve a estrutura alvo com `app/(marketing)/` e `app/(auth)/`; este design segue exatamente essa estrutura. O protótipo `references/design/Landing.html` define o conteúdo e a disposição visual da landing, mas usa CSS inline e cores hex fixas — a implementação real usa as classes `.ga-*` e os tokens `--ga-*` de `gestor-alertas.css`, adaptando a hierarquia visual (não reproduzindo pixel a pixel os valores inline do protótipo).

## Goals / Non-Goals

**Goals:**
- Landing pública em `/`, sem sessão, sem moldura da aplicação autenticada, construída com o design system do produto.
- Login movido para `/login`, preservando o comportamento já especificado em `autenticacao` (redirecionamento se já autenticado, sinalização de andamento, tratamento de erro).
- Estrutura de diretórios alinhada a `references/architecture/routes.md` (`(marketing)`, `(auth)`).

**Non-Goals:**
- Não implementa `middleware.ts` — a proteção de `/app/*` continua feita em `app/app/layout.tsx`, como já documentado em `references/architecture/routes.md` seção 4. Fora de escopo desta change.
- Não implementa fluxo real de "solicitar demonstração" nem qualquer captura de lead — no protótipo isso é um toast local; aqui, se mantido, permanece como interação de UI sem persistência.
- Não introduz analytics, SEO avançado ou internacionalização.

## Decisions

- **Route groups `(marketing)` e `(auth)`**: cria `app/(marketing)/page.tsx` (landing, rota `/`) e `app/(auth)/login/page.tsx` (login, rota `/login`), cada um com seu próprio `layout.tsx` de grupo. Alternativa considerada: manter tudo em `app/page.tsx` com lógica condicional — rejeitada por misturar duas telas com propósitos e status de autenticação opostos no mesmo arquivo, contrariando a estrutura já acordada em `routes.md`.
- **Reaproveitar `LoginForm` e `LogoIcon` existentes**: o conteúdo funcional de `app/page.tsx` (chamada a `auth()`, redirect se já houver sessão, `LoginForm`, `LogoIcon`) migra para `app/(auth)/login/page.tsx` sem mudança de lógica, apenas de local.
- **Landing como Server Component estático**: sem necessidade de dados dinâmicos (os números e listas do hero/seções são conteúdo institucional fixo, como no protótipo), a página não precisa de client-side state; os poucos elementos interativos do protótipo (toast ao clicar em "Log in"/"Logar agora") são substituídos por `<Link>` para `/login` via `ROUTES` — não há necessidade de toast nessa jornada real.
- **`auth.config.ts`**: `pages.signIn` passa de `"/"` para `"/login"`, alinhando com o requisito modificado de `autenticacao`.
- **`lib/routes.ts`**: recebe uma constante para `/login` (fora de `ROUTES.painel`/`APP_BASE`, já que login não é uma rota autenticada sob `/app`), respeitando o requisito de fonte única de rotas de `app-routing`.
- **Fidelidade ao protótipo**: a landing segue as mesmas seções e conteúdo textual de `references/design/Landing.html` (hero, regras de aviso, timeline, plataforma de dados, operações conjuntas, CTA + rodapé), mas remapeada para classes `.ga-*` existentes; onde não houver classe `.ga-*` equivalente para um elemento específico do protótipo (ex.: o mock de timeline dentro do card do hero, o grafo SVG de vínculos), a estrutura visual é recriada com marcação própria da página, e não com CSS inline copiado do protótipo.

## Risks / Trade-offs

- [O design system `gestor-alertas.css` pode não ter classes prontas para todas as seções do protótipo (hero escuro, pipeline da plataforma de dados, grafo SVG)] → aceitar compor essas seções com marcação própria da página quando não houver classe `.ga-*` equivalente, mantendo os tokens `--ga-*` para cor/tipografia sempre que possível.
- [Mover `pages.signIn` para `/login` afeta qualquer redirecionamento automático do NextAuth para usuário não autenticado] → como não existe `middleware.ts` hoje, o único consumidor de `pages.signIn` é o próprio NextAuth ao lidar com erros de autenticação; validar manualmente o fluxo de login/logout após a mudança.
