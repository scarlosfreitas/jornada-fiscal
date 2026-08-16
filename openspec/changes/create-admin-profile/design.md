## Context

`Topbar.tsx` já é `"use client"` e já implementa o toggle, o fechamento por clique-fora e por `Esc` do menu do usuário (`userMenuOpen` state, `userContainerRef`) — construído junto com a busca de funcionalidades. O menu em si (`.ga-menu` / `.ga-menu-item`) só precisa de conteúdo novo, não de mecânica nova. Ver proposal.md - Why.

`app/app/layout.tsx` é um Server Component que já chama `auth()` para proteger a rota e hoje descarta o resultado além do redirect. `Topbar` é renderizado ali sem props.

`.ga-menu-item` é `display:block` (sem flex); o padrão já usado no próprio arquivo para item com ícone é `className="ga-menu-item ga-row"` (a busca de funcionalidades já faz isso), que dá `display:flex; gap`. Reaproveitar essa combinação para os três itens do menu do usuário.

## Goals / Non-Goals

**Goals:**
- Conteúdo real (3 itens com ícone) e dados de sessão reais no menu do usuário existente.
- Fechar o menu ao selecionar qualquer item, além dos fechamentos já existentes.
- Logout funcional via Auth.js v5.

**Non-Goals:**
- Criar as telas `/app/profile` e `/app/change-password` (apenas os links).
- Alterar o mecanismo de abertura/fechamento do menu (já implementado).
- Exibir o perfil (Administrador, Usuário etc.) real no lugar de "Coordenação" — fora do pedido original; mantido como está.

## Decisions

**Sessão via props do layout, não `useSession`.** `app/app/layout.tsx` já chama `auth()` no servidor. Passar `session.user.name` e as iniciais derivadas dele como props para `Topbar` evita um segundo fetch de sessão no cliente (`useSession` faria uma chamada a `/api/auth/session` na montagem, com o nome aparecendo só depois de um flash). `Topbar` continua `"use client"` só pelo estado dos menus/busca, não pela sessão.

**Iniciais derivadas do nome no cliente**, não persistidas: primeira letra do primeiro e do último token de `session.user.name`, maiúsculas. Não há campo de iniciais no schema (`Usuario` tem `nome`/`sobrenome`; `session.user.name` já é `"${nome} ${sobrenome}"` — ver `auth.ts`). Fallback: se só houver um token, usar suas duas primeiras letras; se não houver nome, usar `"?"`.

**Itens do menu direto em `Topbar.tsx`**, sem extrair `UserMenu.tsx`. A regra do prompt original ("extrair só se Topbar virar server component") não se aplica: `Topbar` já é client component. Extrair agora seria uma abstração sem necessidade — mantém tudo (estado, refs, itens) em um único arquivo já responsável pelo menu.

**Rotas em `lib/routes.ts`**, seguindo o padrão existente (`ROUTES.painel`, etc.) em vez de strings soltas: `perfil: "${APP_BASE}/profile"` e `alterarSenha: "${APP_BASE}/change-password"`. Ficam sob `/app` como as demais rotas protegidas, já que são acessadas de dentro do shell autenticado — o pedido original omitiu o prefixo, mas todas as outras rotas do produto o usam.

**Logout com `signOut("/", { redirectTo: "/" })`** do `next-auth/react`, chamado direto no `onClick` do item Sair, fechando o menu antes (mesmo padrão de `goToFeature`, que fecha e navega). Não precisa de `router.push` adicional: `signOut` já navega. A proteção de rota em `auth.config.ts` (`authorized` callback) já impede reentrar em `/app` sem sessão, então não há tratamento extra a fazer aqui.

**Ícones**: `User` (Perfil), `KeyRound` (Alterar senha), `LogOut` (Sair) de `lucide-react`, no mesmo tamanho (`size={14}`) usado pelos outros ícones da Topbar.

## Risks / Trade-offs

- [Nome de sessão ausente ou vazio, ex. dado legado sem `nome`/`sobrenome`] → fallback `"?"` nas iniciais e nome vazio tratado no template com um traço, evitando quebrar o layout do bloco `.ga-user`.
- [`/app/profile` e `/app/change-password` ainda não existem] → aceito conforme proposal.md; os links resultam em 404 até uma change futura criar as telas.
