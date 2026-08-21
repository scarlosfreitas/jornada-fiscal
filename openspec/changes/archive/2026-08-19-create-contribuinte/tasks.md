## 1. Rotas

- [x] 1.1 Em `lib/routes.ts`, adicionar `CONTRIBUINTE_TABS` (tupla `as const` com os sete slugs, na ordem: `linha-do-tempo`, `situacao-cadastral`, `historico`, `recolhimentos`, `entrega-declaracoes`, `valores-declarados`, `emissao-documentos`), o tipo `ContribuinteTab` derivado dela, e `contribuinteTab(id: string, tab: ContribuinteTab)` retornando `/app/contribuintes/{id}/{tab}`
- [x] 1.2 Adicionar `ROUTES.contribuinteLinhaDoTempo` (`/app/contribuintes/linha-do-tempo`), acompanhando as demais rotas estáticas do grupo usadas pela barra lateral; manter `contribuinteDetalhe(id)` com a assinatura atual

## 2. Estilos

- [x] 2.1 Decodificar `references/design/Contribuinte.html` conforme o procedimento do `CLAUDE.md` e extrair do `<style>` embutido as regras das 12 classes ausentes: `ga-cell-sub`, `ga-cell-new`, `ga-cell-old`, `ga-legend-dot`, `ga-legend-new`, `ga-legend-old`, `ga-dot-today`, `ga-dot-future`, `ga-line-dashed`, `ga-date-today`, `ga-date-future`, `ga-title-today`
- [x] 2.2 Acrescentá-las a `app/gestor-alertas.css`, na seção "Ficha do contribuinte" já existente, sem alterar nenhuma regra atual

## 3. Dados mock

- [x] 3.1 Criar `lib/mock/contribuinte-detalhe.ts` com o cabeçalho de comentário no padrão de `lib/mock/dashboard.ts`, registrando que os dados são transcritos do protótipo, que as funções ignoram o `id` por ora, e que o Histórico cadastral traz um contribuinte diferente do restante da ficha por inconsistência herdada do protótipo
- [x] 3.2 Transcrever a identidade (`getContribuinteFicha`): iniciais, razão social, CNPJ, IE, grupo econômico e os três indicadores de destaque com suas variantes de badge
- [x] 3.3 Transcrever a linha do tempo (`getLinhaDoTempo`): os 21 eventos com data, título, categoria, documento vinculado, marcações de hoje/futuro e aviso de prazo; o mapa de categorias com rótulo e cor; o conjunto de fotos com legenda; e a transcrição do atendimento com sigilo e autoria
- [x] 3.4 Transcrever os campos da situação cadastral (`getSituacaoCadastral`): os 11 campos com rótulo, valor, formatação monoespaçada, tempo de vigência e, nos que têm, as linhas de histórico com data, valor e motivo
- [x] 3.5 Transcrever o histórico cadastral (`getHistoricoCadastral`): os 12 registros brutos e a definição das 7 colunas (chave, rótulo, largura, monoespaçada, obrigatória, participa da comparação)
- [x] 3.6 Transcrever recolhimentos, entrega de declarações e emissão de documentos (`getRecolhimentos`, `getDeclaracoes`, `getDocumentosEmitidos`): códigos, descrições, colunas e valores; documentos também com o valor secundário por célula
- [x] 3.7 Transcrever os valores declarados (`getValoresDeclarados`): as 14 rubricas com código e descrição, a lista de períodos e a quantidade de colunas por intervalo escolhido

## 4. Moldura da ficha

- [x] 4.1 Criar `components/contribuinte/EntityBar.tsx` (`ga-entity-bar`): iniciais, razão social, linha "CNPJ · IE · grupo" e os badges de destaque
- [x] 4.2 Criar `components/contribuinte/TabBar.tsx` (`ga-tabbar`/`ga-tab`): recebe o `id` e a aba ativa e renderiza um `Link` por aba, marcando a ativa; server component
- [x] 4.3 Criar `components/contribuinte/TabPageHead.tsx` (`ga-page-head`): trilha "Contribuinte / <aba>", título, subtítulo e slot de ações, com o botão "Exportar" desabilitado no mesmo padrão de `components/dashboard/PageHead.tsx`
- [x] 4.4 Criar `app/app/contribuintes/[id]/layout.tsx` renderizando `EntityBar` + `TabBar` + `{children}`, derivando a aba ativa do segmento de rota
- [x] 4.5 Criar `app/app/contribuintes/[id]/page.tsx` redirecionando para a primeira aba
- [x] 4.6 Criar `components/contribuinte/Toast.tsx` (`ga-toast`) com dispensa automática, reutilizável pelas abas

## 5. Aba Linha do tempo

- [x] 5.1 Criar `components/contribuinte/PhotoViewer.tsx` (`ga-photo-frame`, `ga-photo-nav`): uma foto por vez, com legenda, posição no conjunto e navegação anterior/próxima
- [x] 5.2 Criar `components/contribuinte/LinhaDoTempoTab.tsx` (`ga-timeline*`): eventos com data, marcador, título, chip de categoria, aviso de prazo, link do documento, fotos na verificação in loco e bloco de transcrição (`ga-quote`) com sigilo e autoria; marcação do dia atual e distinção dos eventos futuros
- [x] 5.3 Implementar a busca da aba (filtra evento, processo ou documento) e o botão "Adicionar evento" disparando o toast
- [x] 5.4 Criar `app/app/contribuintes/[id]/linha-do-tempo/page.tsx` com `metadata` e composição a partir de `getLinhaDoTempo`

## 6. Aba Situação cadastral

- [x] 6.1 Criar `components/contribuinte/FieldHistoryModal.tsx` (`ga-overlay`/`ga-modal`): título do campo, linhas de histórico com data, valor e motivo, fecho por botão, `Esc` e clique fora
- [x] 6.2 Criar `components/contribuinte/SituacaoCadastralTab.tsx` (`ga-card`/`ga-field-row`): rótulo, valor, tempo de vigência e acesso ao histórico apenas nos campos que o têm
- [x] 6.3 Criar `app/app/contribuintes/[id]/situacao-cadastral/page.tsx`

## 7. Aba Histórico

- [x] 7.1 Criar `components/contribuinte/HistoricoCadastralTab.tsx`: tabela larga com rolagem horizontal, colunas conforme a seleção vigente
- [x] 7.2 Implementar a dedução de linhas — manter um registro apenas quando algum atributo visível diferir do último registro mantido, ignorando as datas — recalculada a cada mudança de seleção de colunas
- [x] 7.3 Implementar o menu "Colunas" com as sete opções, mantendo "Data início" sempre marcada e disparando o toast de coluna obrigatória quando a pessoa tentar desmarcá-la
- [x] 7.4 Implementar o destaque dos valores alterados, a legenda e o rodapé com a contagem de registros com alteração sobre o total; incluir o estado vazio
- [x] 7.5 Criar `app/app/contribuintes/[id]/historico/page.tsx`

## 8. Abas de tabela simples

- [x] 8.1 Criar um componente de tabela simples compartilhado pelas três abas (código/tipo com descrição abaixo, colunas de período, valor secundário opcional por célula)
- [x] 8.2 Criar `components/contribuinte/RecolhimentosTab.tsx` e `app/app/contribuintes/[id]/recolhimentos/page.tsx`
- [x] 8.3 Criar `components/contribuinte/EntregaDeclaracoesTab.tsx` (com busca de declaração) e `app/app/contribuintes/[id]/entrega-declaracoes/page.tsx`
- [x] 8.4 Criar `components/contribuinte/EmissaoDocumentosTab.tsx` (com os seletores de emitente/destinatário e de métrica) e `app/app/contribuintes/[id]/emissao-documentos/page.tsx`

## 9. Aba Valores declarados

- [x] 9.1 Criar `components/contribuinte/ValoresDeclaradosTab.tsx` (`ga-matrix`): uma linha por rubrica, uma coluna por período, rolagem horizontal, cabeçalho com o intervalo em vigor e a origem dos valores
- [x] 9.2 Implementar o seletor de intervalo alterando a quantidade de colunas de período, a busca por rubrica e o rodapé com a contagem
- [x] 9.3 Criar `app/app/contribuintes/[id]/valores-declarados/page.tsx`

## 10. Barra lateral

- [x] 10.1 Em `components/layout/nav-data.ts`, atualizar os subitens do grupo Contribuinte para os sete do protótipo, na ordem da spec, acrescentando "Linha do Tempo" e reposicionando "Histórico"
- [x] 10.2 Acrescentar a entrada correspondente em `APP_FEATURES`, mantendo o padrão de rótulo e caminho das demais

## 11. Verificação

- [x] 11.1 `npm run lint` e `npx tsc --noEmit`
- [x] 11.2 Subir `npm run dev` e percorrer as sete abas em `/app/contribuintes/c1/...`, conferindo que os dados batem com o protótipo e que a aba ativa é destacada corretamente
- [x] 11.3 Conferir a navegação: `/app/contribuintes/c1` redireciona para a primeira aba, o link do dropdown de busca da barra superior chega à ficha, e o botão voltar do navegador retorna à aba anterior
- [x] 11.4 Conferir a interatividade: modal de histórico de campo, visualizador de fotos, seleção de colunas com o toast da coluna obrigatória, toast de "Adicionar evento", seletor de período mudando as colunas de mês, e a busca filtrando em cada aba que a possui
- [x] 11.5 Conferir a barra lateral com os sete subitens do grupo Contribuinte, e que barra superior e rodapé seguem inalterados
