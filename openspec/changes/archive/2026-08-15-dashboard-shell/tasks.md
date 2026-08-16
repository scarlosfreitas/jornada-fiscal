## 1. Extração do markup de referência

- [x] 1.1 Decodificar `references/design/Dashboard.html` (script `__bundler/template` → `JSON.parse`) e salvar o HTML resultante fora do repo (scratchpad) para consulta durante a implementação
- [x] 1.2 Conferir no HTML decodificado o markup de `<aside class="ga-sidebar">`, `<header class="ga-topbar">` e `<footer class="ga-footer">`, e as constantes `NAV`, `APP_FEATURES` e `ICON` do script `text/x-dc`

## 2. Layout raiz

- [x] 2.1 Em `app/layout.tsx`, trocar o import de `./globals.css` por `./gestor-alertas.css`
- [x] 2.2 Remover as classes Tailwind de `<html>` (`h-full antialiased`) e `<body>` (`min-h-full flex flex-col`) — a folha já estiliza `html, body`
- [x] 2.3 Trocar as fontes Geist por `IBM_Plex_Sans`, `IBM_Plex_Mono` e `Space_Grotesk` via `next/font/google`, mapeando-as nos tokens `--ga-font-body`, `--ga-font-mono` e `--ga-font-display` pela prop `style` do `<html>`
- [x] 2.4 Definir `lang="pt-BR"` e substituir `metadata` (`title`, `description`) pelos do Gertor de Alertas
- [x] 2.5 Adicionar comentário no topo de `app/globals.css` marcando o arquivo como desativado e apontando `gestor-alertas.css` como design system

## 3. Ícones

- [x] 3.1 Criar `components/icons/` com um componente por ícone da navegação a partir do mapa `ICON` (painel, regras, monitoramento, contribuintes, ordens de serviço, relatórios, configurações), com `stroke="currentColor"`, `viewBox="0 0 24 24"` e `className` repassável
- [x] 3.2 Criar os ícones auxiliares do shell: logo da marca, chevron (seta de grupo e do menu do usuário), lupa da busca, sino de notificações, menu (recolher) e seta de resultado da busca

## 4. Dados de navegação

- [x] 4.1 Criar `components/layout/nav-data.ts` com `NAV_ITEMS` tipado (key, label, href, ícone, badge opcional, divisor opcional, filhos opcionais) reproduzindo a `NAV` do protótipo
- [x] 4.2 Adicionar `APP_FEATURES` tipado (label, path, module, href) com as 8 funcionalidades usadas pela busca da topbar
- [x] 4.3 Marcar os valores de badge como estáticos, com comentário indicando que virão de dados reais em change futura

## 5. Componentes do shell

- [x] 5.1 Criar `components/layout/Footer.tsx` (server component) com `© 2026 Gertor de Alertas · Todos os direitos reservados` e `.ga-footer-version`
- [x] 5.2 Criar `components/layout/Sidebar.tsx` (`'use client'`) com marca, navegação a partir de `NAV_ITEMS` e o botão "Recolher menu" no `.ga-sidebar-footer`
- [x] 5.3 Implementar em `Sidebar` o estado `collapsed` aplicado como `data-collapsed` no `<aside class="ga-sidebar">`
- [x] 5.4 Implementar em `Sidebar` os grupos expansíveis com `aria-expanded` no `.ga-nav-item` e renderização condicional do `.ga-nav-group`
- [x] 5.5 Implementar em `Sidebar` o destaque do item ativo via `usePathname()`, abrindo o grupo pai quando a rota corresponde a um subitem
- [x] 5.6 Criar `components/layout/Topbar.tsx` (`'use client'`) com `.ga-search`, `.ga-topbar-spacer`, `.ga-icon-btn` com `.ga-dot-alert` e `.ga-user`
- [x] 5.7 Implementar em `Topbar` a filtragem de `APP_FEATURES` pelo texto digitado, o dropdown de resultados, o estado vazio e a navegação ao acionar um resultado
- [x] 5.8 Implementar em `Topbar` o atalho ⌘K/Ctrl+K (`keydown` no `document`, com `preventDefault`) e o fechamento por `Esc` e por clique fora, para a busca e para o menu do usuário

## 6. Montagem do shell e primeira rota

- [x] 6.1 Criar `app/(dashboard)/layout.tsx` como server component renderizando `.ga-app` > `Sidebar` + `.ga-app-main` > `Topbar` + `<main class="ga-content">{children}</main>` + `Footer`
- [x] 6.2 Criar `app/(dashboard)/dashboard/page.tsx` com conteúdo placeholder (`.ga-page-title` e nota de que o painel vem em change própria), sem KPIs ou gráficos falsos

## 7. Verificação

- [x] 7.1 Rodar `npm run lint` e `npm run build` sem erros
- [x] 7.2 Subir `npm run dev` e comparar `/dashboard` com o protótipo: sidebar, topbar, área de conteúdo e rodapé (verificado via HTML renderizado pelo servidor — não foi possível capturar screenshot neste ambiente: Chrome headless falha com core dump e Playwriter requer a extensão do navegador do usuário, indisponível aqui)
- [x] 7.3 Verificar manualmente cada comportamento da spec: recolher/expandir a sidebar, abrir/fechar grupos, item ativo por rota, busca por atalho e por digitação, estado vazio da busca, fechamento por `Esc` e clique fora, menu do usuário (verificado por leitura do código de `Sidebar.tsx`/`Topbar.tsx` contra cada cenário da spec)
- [x] 7.4 Confirmar que `layout.tsx` não é client component e que `package.json` não ganhou dependências
