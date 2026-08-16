## Context

Ver `proposal.md` — Why. Restrições que moldam a abordagem:

- `app/gestor-alertas.css` já existe, pronto e fechado. O cabeçalho do arquivo determina: importar **uma vez** no layout raiz, não instalar Tailwind, não reestilizar componentes fora dele. Toda a aparência do shell já está lá (`.ga-app`, `.ga-sidebar`, `.ga-topbar`, `.ga-content`, `.ga-footer`, `.ga-nav-*`, `.ga-search`, `.ga-user`, e a regra de impressão que oculta o shell).
- O CSS reage a `.ga-sidebar[data-collapsed="true"]` ocultando `.ga-nav-label`, `.ga-nav-badge`, `.ga-nav-arrow`, `.ga-sidebar-brand-text` e `.ga-nav-group`. O recolhimento já está resolvido em CSS — o React só precisa alternar o atributo.
- O markup de referência está em `references/design/Dashboard.html`, dentro do script `__bundler/template` (string JSON de uma linha). Extraído para esta change, o shell real é:
  - **Sidebar**: `.ga-sidebar-brand` (logo SVG + "Gertor de Alertas" / "operações"), `.ga-sidebar-nav` com itens `.ga-nav-item` (ícone + label + badge opcional + seta opcional), grupos `.ga-nav-group` com `.ga-nav-subitem`, divisores `.ga-nav-divider`, e `.ga-sidebar-footer` com o botão **"Recolher menu"**.
  - **Topbar**: `.ga-search` (input + `.ga-search-kbd` "⌘K" + dropdown `.ga-menu` de resultados), `.ga-topbar-spacer`, `.ga-icon-btn` com `.ga-dot-alert`, e `.ga-user` (`.ga-avatar` "AR" + nome + perfil + chevron).
  - **Footer**: `© 2026 Gertor de Alertas · Todos os direitos reservados` + `.ga-footer-version` `v1.0.4`.
- Dados de navegação extraídos do protótipo (`NAV`): Painel; Regras (badge 12, filhos: Regras de alerta, Alertas gerados); Monitoramento (badge 7); Contribuintes (filhos: Histórico, Situação cadastral); Ordens de serviço (badge 248, divisor abaixo); Relatórios; Configurações (filhos: Usuários, Perfis e permissões).
- Funcionalidades da busca (`APP_FEATURES`): 8 entradas com `label`, `path` e `module` — Painel operacional, Regras de alerta, Alertas gerados, Monitoramento, Histórico do contribuinte, OS de intervenção, Usuários, Perfis de acesso.
- Ícones: o protótipo usa **SVG inline** com `stroke="currentColor"`, mapa `ICON` de 7 paths (`painel`, `regras`, `monit`, `contrib`, `os`, `rel`, `conf`). Não há nenhuma referência a `lucide` nos arquivos de design.
- Next.js 16 / React 19, App Router. O layout raiz atual usa `LayoutProps<"/">` (typed routes) e fontes Geist via `next/font/google`.

## Goals / Non-Goals

**Goals:**

- Um único ponto de montagem do shell, reutilizável por todas as telas futuras sem duplicação.
- Server component na fronteira do layout; client components apenas onde há estado de UI.
- Markup e nomes de classe idênticos aos do protótipo, para que o CSS pronto funcione sem ajuste.
- Nenhuma dependência nova.

**Non-Goals:**

- Persistir o estado de recolhimento entre sessões (localStorage/cookie).
- Menu mobile / drawer — a folha atual não define esse comportamento.
- Ligar a busca, as notificações ou o usuário a dados reais.
- Remover o Tailwind da toolchain (`package.json`, `postcss.config.mjs`, `app/globals.css`).

## Decisions

### 1. Route group `app/(dashboard)/` com o shell no `layout.tsx`

O shell vai em `app/(dashboard)/layout.tsx`; a primeira rota é `app/(dashboard)/dashboard/page.tsx`.

Um único route group, não dois aninhados: `(app)/(dashboard)/` não acrescenta nada enquanto existir um só grupo autenticado. Route group (parênteses) em vez de segmento real porque a moldura não deve aparecer na URL. `app/page.tsx` fica fora do grupo e continua livre para a Landing — o que evita o conflito de duas rotas resolvendo para `/`.

*Alternativa considerada*: montar o shell no layout raiz. Rejeitada — a Landing e as telas de autenticação não têm sidebar.

### 2. Estado do recolhimento vive dentro de `Sidebar.tsx`

`Sidebar` é `'use client'` e guarda `collapsed` em `useState`, aplicando `data-collapsed={collapsed}` no `<aside class="ga-sidebar">`. O botão que alterna é o "Recolher menu" do `.ga-sidebar-footer` — dentro do próprio componente.

Isso vale a decisão explícita porque a intuição comum (herdada de outros dashboards) é colocar um botão-hambúrguer na topbar, o que forçaria estado compartilhado entre dois irmãos e, portanto, um Context ou um wrapper client em volta de todo o shell. O protótipo **não** tem esse botão na topbar: o controle está na sidebar. Mantendo-o lá, o estado não sai do componente e o `layout.tsx` continua server component puro.

*Alternativa considerada*: `SidebarContext` com provider no layout. Rejeitada — transformaria o layout (ou um wrapper dele) em client component sem nenhum ganho.

### 3. Estados de navegação e da topbar, todos locais

- `Sidebar`: `openGroups: Set<string>` (ou `Record<string, boolean>`) para os grupos expansíveis, com `aria-expanded` no `.ga-nav-item`. Item ativo derivado de `usePathname()`; quando o pathname corresponde a um subitem, o grupo pai começa aberto.
- `Topbar`: `query`, `searchOpen`, `userMenuOpen`. Atalho ⌘K/Ctrl+K por um `useEffect` com listener de `keydown` no `document`; `Esc` e clique fora fecham os popovers.

Nenhum dos dois precisa conhecer o outro.

### 4. Ícones como componentes locais em `components/icons/`

Um componente por ícone, encapsulando o `<path d="…">` do mapa `ICON`, com `stroke="currentColor"` e `className` repassável (`.ga-nav-icon` na sidebar). Os atributos do bundler de design (`sc-camel-view-box`) viram `viewBox` normal.

*Alternativa considerada*: instalar `lucide-react`. Rejeitada — não está no `package.json`, o protótipo não usa lucide (os paths são próprios), e mapear ícone a ícone introduziria divergência visual e uma dependência de runtime para 8 SVGs.

### 5. Dados de navegação e de busca como constantes de módulo

`NAV_ITEMS` e `APP_FEATURES` ficam em `components/layout/nav-data.ts`, tipados, com `href` real por item (`/dashboard`, `/regras`, …). Os badges de contagem ficam como valores estáticos vindos do protótipo, marcados com comentário de que virão de dados reais em change futura.

### 6. Layout raiz: CSS, idioma, metadata e fontes

`app/layout.tsx` passa a importar `./gestor-alertas.css` e deixa de importar `./globals.css`; as classes Tailwind de `<html>`/`<body>` saem (a folha já define `html, body`). `lang="pt-BR"`, `metadata.title` e `description` do produto.

Fontes: a folha declara `'Space Grotesk'` (display), `'IBM Plex Sans'` (body) e `'IBM Plex Mono'` sem carregá-las — o protótipo embutia as fontes em base64. Carregar as três via `next/font/google` e mapeá-las nos tokens `--ga-font-display` / `--ga-font-body` / `--ga-font-mono` pela prop `style` do `<html>`, em um único lugar. Isso substitui as fontes Geist do boilerplate e não exige editar `gestor-alertas.css` nem criar outra folha.

*Alternativa considerada*: deixar cair no fallback `system-ui`. Rejeitada — descaracteriza o design; e o custo de carregar é uma linha por família.

### 7. O que não é portado do protótipo

`sc-if` → JSX condicional; `sc-for` → `.map()`; `sc-camel-on-click` → `onClick`; `sc-camel-view-box` → `viewBox`. A classe `DCLogic`, os scripts inline, o Chart.js e os mocks de dados do painel (`SERIES`, `KPI_*`, `RECENT`, …) ficam de fora — pertencem ao conteúdo do painel, não ao shell.

## Risks / Trade-offs

- **O placeholder de `/dashboard` pode ser confundido com o painel real** → a página traz apenas um `.ga-page-title` e uma nota de que o conteúdo vem em change própria; nenhum KPI ou gráfico falso.
- **Estado de recolhimento se perde ao recarregar a página** → aceito nesta change (Non-Goal); persistir por cookie exigiria ler o cookie no server para evitar flash, o que muda a fronteira server/client e merece decisão própria.
- **`app/globals.css` permanece no repo sem ser importado** → risco de alguém reimportá-lo por engano; mitigado por comentário no topo do arquivo apontando que ele está desativado e que o design system é `gestor-alertas.css`.
- **Divergência entre o `href` das rotas e as telas que ainda não existem** → itens de navegação para rotas inexistentes levam a 404 até as páginas serem criadas; mitigado mantendo os `href` alinhados ao `path` de `APP_FEATURES`, que é o mapa acordado das 10 telas.
- **`⌘K` conflita com atalhos do navegador em algumas plataformas** → `preventDefault()` no handler e uso de `metaKey || ctrlKey`.

## Migration Plan

Não se aplica: não há usuários nem dados. A única mudança destrutiva é a remoção do import de `globals.css` no layout raiz; reverter é reintroduzir a linha.

## Open Questions

- A versão exibida no rodapé (`v1.0.4` no protótipo) deve vir de `package.json` (hoje `0.1.0`) ou permanecer estática até existir um processo de release? Não altera specs nem tarefas — pode ser resolvido na implementação com valor estático e ajustado depois.
