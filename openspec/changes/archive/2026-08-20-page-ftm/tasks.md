## 1. Dados do catálogo FtM

- [x] 1.1 Criar `lib/mock/ftm.ts` com os tipos `FtmSchema`, `FtmProperty`, `FtmAction`, `FtmStatus` e `FtmSeverity`, e as tabelas de rótulo `FTM_STATUS_LABEL`, `PROPERTY_TYPES`, `SEVERITY_LABEL` e `RULE_BADGE`, conferidas contra `references/domain/data-model-regra.md` §4
- [x] 1.2 Transcrever o seed de schemas (`SCHEMAS`: 14 entradas com nome técnico, pai, rótulo, natureza aresta/entidade, descrição e regras alvo) de `references/design/FtMEntidades.html`, conferindo nomes e hierarquia contra `references/domain/seed-regra.md` §5
- [x] 1.3 Transcrever o seed de propriedades (`PROPERTIES`: 70 entradas com schema, nome técnico, rótulo, tipo, destino, multi, observável, situação e descrição), conferindo contra `references/domain/seed-regra.md` §6 e anotando em comentário qualquer divergência em que o domínio prevaleceu
- [x] 1.4 Transcrever `ACTIONS` (7 tipos de ação com código, nome, descrição, integração, severidade, parâmetros, regras, disparos e habilitação), conferindo contra `references/domain/seed-regra.md` §9
- [x] 1.5 Transcrever `OPERATORS_BY_TYPE` (matriz operador → tipos aceitos), `TARGET_RULES` (regras por schema alvo), `INGESTION_TOPICS` (tópico e chave de partição por schema) e `PROPERTY_USES` (usos por propriedade)
- [x] 1.6 Implementar os derivados puros `schemaById`, `ancestorsOf`, `depthOf`, `ownPropertiesOf(props, schemaId)` e `inheritedPropertiesOf(props, schemaId)`, recebendo a lista corrente de propriedades como argumento
- [x] 1.7 Expor os leitores `getSchemas()`, `getProperties()` e `getActions()` com assinatura de leitura real, e documentar no cabeçalho do arquivo a origem dos dados e a ausência de persistência

## 2. Rotas e navegação

- [x] 2.1 Adicionar `ftmEntidades`, `ftmPropriedades` e `ftmTiposAcao` a `ROUTES` em `lib/routes.ts`, sob `${APP_BASE}/ftm/`
- [x] 2.2 Inserir em `NAV_ITEMS` (`components/layout/nav-data.ts`) o grupo "Ontologia FtM" com os subitens Entidades, Propriedades e Tipos de Ação, posicionado entre "Gestão de Alertas" e "Ordens de Serviço", com ícone `Network`
- [x] 2.3 Adicionar as três telas a `APP_FEATURES` com os caminhos "Ontologia FtM / Entidades", "… / Propriedades" e "… / Tipos de Ação"
- [x] 2.4 Verificar no navegador que o grupo expande, que o subitem da tela aberta aparece ativo e que os três resultados são encontráveis pela busca de funcionalidade

## 3. Componentes compartilhados

- [x] 3.1 Criar `components/ftm/Switch.tsx` — alternância `ga-switch` acessível (papel de switch, estado ligado/desligado, acionável por teclado)
- [x] 3.2 Criar `components/ftm/RowMenu.tsx` — menu de linha `ga-menu` com abertura por `ga-row-menu-btn`, fechamento ao clicar fora e ao pressionar `Esc`, e garantia de um único menu aberto por vez

## 4. Tela Entidades

- [x] 4.1 Criar `app/app/ftm/entidades/page.tsx` (server component) lendo `getSchemas()`/`getProperties()` e definindo `metadata.title`
- [x] 4.2 Criar `components/ftm/EntidadesScreen.tsx` — mantém o estado compartilhado (propriedades correntes, busca, recorte) e alterna entre listagem e detalhe preservando busca e recorte no retorno
- [x] 4.3 Criar `components/ftm/EntidadesTable.tsx` com cabeçalho da página (breadcrumb "Ontologia FtM / Entidades", título, busca, "Ver propriedades", "Nova entidade") e os quatro KPIs (entidades, arestas com vigência, propriedades ativas, observáveis) recalculados a partir do estado corrente
- [x] 4.4 Implementar as abas todos/entidades/arestas com contagem, a busca por nome técnico, rótulo e descrição, e a combinação de ambos
- [x] 4.5 Implementar a tabela de schemas com as colunas Schema, Descrição semântica, Herda de, Natureza, Próprias, Herdadas, Observáveis e Regras alvo, com recuo por profundidade de herança suprimido quando há busca ou filtro de natureza
- [x] 4.6 Implementar o menu de linha (editar entidade e propriedades, cadastrar propriedade, ver contrato Avro do tópico), com navegação para Propriedades e notificação temporária no contrato
- [x] 4.7 Criar `components/ftm/EntidadeDetalhe.tsx` com cabeçalho (breadcrumb, rótulo como título, chips de nome técnico, natureza e cadeia de herança), botões Voltar e Salvar entidade
- [x] 4.8 Implementar o card "Definição do schema": nome técnico, rótulo, seletor de schema pai excluindo o próprio schema, alternância de natureza com texto explicativo e descrição semântica
- [x] 4.9 Implementar o card "Propriedades próprias": tabela com nome, rótulo, tipo, aponta para, múltipla, alternância de observável, seletor de situação (com notificação a cada mudança), destaque reduzido para suspensa/arquivada e rodapé com o resumo de próprias e observáveis
- [x] 4.10 Implementar o card "Propriedades herdadas" somente leitura, com schema de origem por propriedade, omitido quando o schema não tem ancestrais com propriedades
- [x] 4.11 Implementar a coluna lateral: distribuição das propriedades próprias por situação, dados de ingestão (tópico, chave de partição, contrato, enriquecimento, com "—" quando não houver) e regras que usam o schema como alvo, com mensagem explícita quando não houver nenhuma

## 5. Tela Propriedades

- [x] 5.1 Criar `app/app/ftm/propriedades/page.tsx` (server component) lendo `getProperties()`/`getSchemas()` e definindo `metadata.title`
- [x] 5.2 Criar `components/ftm/PropriedadesTable.tsx` com cabeçalho da página (breadcrumb, título, busca, "Ver entidades", "Cadastrar propriedade")
- [x] 5.3 Implementar as abas todas/observáveis/relacionamentos/suspensas e arquivadas com contagem, os filtros por schema e por tipo de dado, a busca textual, e a combinação de todos os critérios
- [x] 5.4 Implementar a tabela com as colunas Propriedade, Schema, Tipo (com destino quando referência a entidade), Multi, Observ., Situação e Usos, com destaque reduzido para suspensa/arquivada e "—" para propriedade sem usos
- [x] 5.5 Implementar a alternância de observável na linha e o menu de linha com editar e as quatro mudanças de situação, cada uma com notificação temporária
- [x] 5.6 Implementar a faixa de totalização: exibidas no recorte, total do catálogo e observáveis no recorte atual
- [x] 5.7 Criar `components/ftm/PropriedadeFormModal.tsx` sobre `ga-overlay` com schema proprietário, nome técnico, rótulo, descrição, tipo, schema de destino condicionado ao tipo referência a entidade, alternâncias de multi e observável, e situação
- [x] 5.8 Implementar a pré-visualização do caminho em regras (`Schema.propriedade`) e o card de operadores compatíveis, ambos recalculados ao mudar schema, nome ou tipo
- [x] 5.9 Implementar salvar/cancelar: exigência de nome técnico e rótulo com notificação e formulário mantido aberto; ao salvar, descartar o destino quando o tipo não for referencial, refletir na listagem, fechar e notificar (cadastro identificando o schema, edição identificando a propriedade)

## 6. Tela Tipos de Ação

- [x] 6.1 Criar `app/app/ftm/tipo-acao/page.tsx` (server component) lendo `getActions()` e definindo `metadata.title`
- [x] 6.2 Criar `components/ftm/TiposAcaoTable.tsx` com cabeçalho da página (breadcrumb, título, busca, "Criar ação") e as abas todos/habilitados/desabilitados com contagem
- [x] 6.3 Implementar a tabela com as colunas Código, Ação e comportamento (com os parâmetros como chips), Integração, Severidade padrão, Regras · disparos e Situação, com "—" para ação sem regras ou sem disparos
- [x] 6.4 Implementar o menu de linha: editar, disparo de teste (notificação nomeando a integração), ver regras vinculadas (navega para Regras) e desabilitar (atualiza estado, contagens e notifica)
- [x] 6.5 Criar `components/ftm/TipoAcaoFormModal.tsx` sobre `ga-overlay` com código normalizado para maiúsculas aceitando apenas `[A-Z0-9_]`, nome, descrição, integração de destino, severidade padrão, parâmetros separados por vírgula e alternância de habilitação com texto explicativo
- [x] 6.6 Implementar o card de pré-visualização do trecho na AST (código, severidade e parâmetros), recalculado a cada alteração desses campos
- [x] 6.7 Implementar salvar/cancelar: exigência de código e nome com notificação e formulário mantido aberto; ao cadastrar, iniciar sem regras nem disparos; ao salvar, refletir na listagem, fechar e notificar

## 7. Verificação

- [x] 7.1 Rodar `npm run lint` e corrigir as ocorrências introduzidas
- [x] 7.2 Rodar `npm run build` e garantir que as três rotas compilam
- [x] 7.3 Percorrer as três telas no navegador conferindo cada cenário dos specs `ftm-entidades`, `ftm-propriedades` e `ftm-tipos-acao`, e o cenário de navegação do delta de `dashboard-shell`
- [x] 7.4 Comparar visualmente cada tela com o protótipo correspondente em `references/design/` (colunas, abas, KPIs, chips, badges e modais)
