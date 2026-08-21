## Why

A change `menu-header` deixou a navegação apontando para telas de Contribuinte que ainda não existem, e registrou explicitamente que cada uma seria "conteúdo de uma change futura". Esta é essa change: a ficha do contribuinte — a tela que o auditor abre para investigar uma empresa específica, reunindo em um só lugar linha do tempo de eventos, situação cadastral, histórico de alterações, recolhimentos, declarações, valores declarados e documentos emitidos. Hoje o dropdown de busca de contribuinte da barra superior já leva para `/app/contribuintes/{id}`, que não tem página e resulta em 404.

O protótipo `references/design/Contribuinte.html` já define a tela inteira, e o design system em `app/gestor-alertas.css` já traz uma seção "Ficha do contribuinte" (`.ga-entity-bar`, `.ga-tabbar`) preparada para ela e até hoje não usada por nenhuma página.

## What Changes

- Cria a ficha do contribuinte em rotas aninhadas por contribuinte: `/app/contribuintes/{id}/{aba}`, com uma barra de identidade (razão social, CNPJ · IE · grupo econômico, badges de situação) compartilhada por todas as abas e uma barra de abas própria da página, acima do conteúdo.
- Implementa as **7 abas** do protótipo: Linha do tempo, Situação cadastral, Histórico, Recolhimentos, Entrega de declarações, Valores declarados, Emissão de documentos. O protótipo separa "Linha do tempo" (eventos cronológicos) de "Histórico" (tabela de alterações cadastrais) — são abas distintas, não uma só.
- Implementa a interatividade do protótipo: busca por aba, modal de histórico por campo (Situação cadastral), visualizador de fotos da verificação in loco (Linha do tempo), seleção de colunas com uma coluna obrigatória (Histórico), seletor de período (Valores declarados), seletores de emitente/métrica (Emissão de documentos) e toast de retorno.
- Atualiza os subitens do grupo Contribuinte na barra lateral de 6 para os 7 do protótipo (acrescenta "Linha do tempo" e reposiciona "Histórico"), alterando apenas os dados de navegação — nenhum componente de barra lateral, barra superior ou rodapé é modificado.
- Acrescenta ao design system as 12 classes que o protótipo usa e que ainda não existem na folha de estilo: `ga-cell-sub`, `ga-cell-new`, `ga-cell-old`, `ga-legend-dot`, `ga-legend-new`, `ga-legend-old`, `ga-dot-today`, `ga-dot-future`, `ga-line-dashed`, `ga-date-today`, `ga-date-future`, `ga-title-today`.
- Acrescenta um módulo de dados mock com o conteúdo transcrito do protótipo (linha do tempo, campos cadastrais e seus históricos, alterações cadastrais, recolhimentos, declarações, rubricas, documentos).

## Capabilities

### New Capabilities
- `contribuinte-ficha`: a ficha do contribuinte — identidade compartilhada, navegação por abas e o conteúdo de cada uma das sete abas.

### Modified Capabilities
- `dashboard-shell`: a lista de subitens do grupo Contribuinte na barra lateral passa de 6 para 7 itens, na ordem do protótipo.

## Impact

- Novas páginas em `app/app/contribuintes/[id]/` (layout, índice com redirecionamento e uma página por aba)
- Novos componentes em `components/contribuinte/`
- Novo `lib/mock/contribuinte-detalhe.ts`
- `lib/routes.ts` (rotas por aba da ficha)
- `components/layout/nav-data.ts` (apenas os dados de navegação; `Sidebar.tsx`, `Topbar.tsx` e `Footer.tsx` não mudam)
- `app/gestor-alertas.css` (as 12 classes faltantes)
- Nenhuma mudança em autenticação, banco ou integrações — a ficha lê dados mock, como o painel já faz
