## Why

O `app/` ainda é o boilerplate do `create-next-app`: `app/page.tsx` e o `<title>` não têm relação com o produto, e o layout raiz importa Tailwind (`globals.css`) em vez do design system real do projeto (`app/gestor-alertas.css`). As 10 telas de `references/design/` compartilham exatamente o mesmo shell (sidebar + topbar + `<main class="ga-content">` + footer), e enquanto esse shell não existir montado uma única vez, nenhuma página do produto pode ser construída sem duplicá-lo.

## What Changes

- **BREAKING** (só afeta o boilerplate, não há código de produto ainda): `app/layout.tsx` passa a importar `app/gestor-alertas.css`; o import de `./globals.css` e as classes Tailwind aplicadas em `<html>`/`<body>` (`h-full antialiased`, `min-h-full flex flex-col`) são removidos — a folha `gestor-alertas.css` já estiliza `html, body`. `lang` passa de `en` para `pt-BR` e o `metadata` deixa de ser "Create Next App".
- Novo route group `app/(dashboard)/` com um `layout.tsx` **server component** que monta o shell uma única vez: `.ga-app` > `Sidebar` + `.ga-app-main` > `Topbar` + `<main class="ga-content">{children}</main>` + `Footer`.
- Nova rota `app/(dashboard)/dashboard/page.tsx` como primeira página consumidora do shell (conteúdo placeholder — o painel real é escopo de outra change). `app/page.tsx` permanece livre para a Landing.
- Novos componentes em `components/layout/`: `Sidebar.tsx` e `Topbar.tsx` como client components (estado de UI), `Footer.tsx` como server component.
- Novos componentes de ícone em `components/icons/`, extraídos dos SVGs inline do protótipo. Nenhuma biblioteca de ícones é instalada (o protótipo **não** usa `lucide` — zero ocorrências nos arquivos de design).
- O comportamento interativo do protótipo (recolher menu, abrir/fechar grupos de navegação, busca de funcionalidade, menu do usuário) é reescrito como estado React. Os scripts inline e os atributos do bundler de design (`sc-if`, `sc-for`, `sc-camel-on-*`) não são portados.
- Nenhuma dependência nova é adicionada ao `package.json`.

## Capabilities

### New Capabilities
- `dashboard-shell`: o invólucro visual e de navegação compartilhado por todas as telas autenticadas do Gertor de Alertas — barra lateral com navegação hierárquica e recolhimento, barra superior com busca de funcionalidade, notificações e identificação do usuário, área de conteúdo e rodapé.

### Modified Capabilities
Nenhuma — `openspec/specs/` está vazio.

## Impact

- **Código**: `app/layout.tsx` (modificado), `app/(dashboard)/layout.tsx` (novo), `app/(dashboard)/dashboard/page.tsx` (novo), `components/layout/*` (novo), `components/icons/*` (novo).
- **Estilos**: `app/gestor-alertas.css` passa a ser a única folha global. `app/globals.css` fica órfão (a remoção do arquivo e da toolchain Tailwind do `package.json`/`postcss.config.mjs` fica fora do escopo desta change — apenas o import é removido).
- **Dependências**: nenhuma alteração. Especificamente, `lucide-react` **não** é instalado.
- **Fora do escopo**: conteúdo real do painel (KPIs, gráficos, tabelas), autenticação/sessão real (o usuário na topbar é estático nesta change), as demais 9 páginas, e responsividade mobile além do que a folha `gestor-alertas.css` já entrega.
