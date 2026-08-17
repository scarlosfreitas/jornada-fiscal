## Why

Hoje a raiz do domínio (`/`) é ocupada pela tela de login (`app/page.tsx`), sem nenhuma página institucional pública. `references/architecture/routes.md` já define a arquitetura alvo — landing pública em `/`, login em `/login` — e `references/design/Landing.html` já traz o protótipo aprovado dessa landing. Falta implementar essa separação: criar a landing e liberar a raiz do domínio para ela, movendo a tela de entrada para `/login`.

## What Changes

- Criar a página institucional pública (landing) em `/`, com o conteúdo e a estrutura do protótipo `references/design/Landing.html` (hero, regras de aviso, timeline do contribuinte, plataforma de dados, operações conjuntas, CTA + rodapé), usando o design system `gestor-alertas.css` do produto em vez do CSS inline do protótipo.
- **BREAKING**: mover a tela de entrada (login) de `/` para `/login`. Quem tentar entrar sem sessão em `/login` vê o formulário de login; quem já tem sessão e acessa `/login` é redirecionado para `/app`.
- Reorganizar `app/` em route groups: `(marketing)` para a landing pública e `(auth)` para o login, conforme `references/architecture/routes.md`.
- Atualizar `authConfig.pages.signIn` (hoje `"/"` em `auth.config.ts`) para `"/login"`.
- Os botões "Log in" / "Logar agora" da landing SHALL apontar para `/login` (no protótipo eles só disparam um toast local — isso é ajustado na implementação real).

## Capabilities

### New Capabilities
- `landing-page`: página institucional pública servida na raiz do domínio, sem exigir sessão e sem a moldura (sidebar/topbar/rodapé) da aplicação autenticada.

### Modified Capabilities
- `app-routing`: a raiz do domínio passa a servir a landing pública (não mais a tela de login); o requisito "Área pública sem a moldura da aplicação" passa a valer para a landing.
- `autenticacao`: a tela de entrada deixa de ser servida na raiz do domínio e passa a ser servida em `/login`; o redirecionamento de quem já tem sessão passa a ocorrer a partir de `/login`, não de `/`.

## Impact

- Código: `app/page.tsx` (removido/movido), novo `app/(marketing)/layout.tsx` + `app/(marketing)/page.tsx` (landing), novo `app/(auth)/layout.tsx` + `app/(auth)/login/page.tsx` (login), `auth.config.ts` (`pages.signIn`).
- Rotas: `/` passa a ser pública/institucional; `/login` passa a existir como rota nova.
- Sem mudança em dados, APIs ou dependências externas.
