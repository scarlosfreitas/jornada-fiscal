## Context

Ver `proposal.md` — Why. Restrições que moldam a abordagem:

- O shell (sidebar + topbar + `<main class="ga-content">` + rodapé) já é montado uma única vez em `app/app/layout.tsx`; cada página renderiza apenas o conteúdo interno. As três telas ficam sob `/app/ftm/*` e herdam esse shell.
- Estilização exclusivamente com as classes `ga-*` de `app/gestor-alertas.css`; Tailwind não é usado em componentes do produto (`CLAUDE.md`). Todas as classes exigidas pelos protótipos (`ga-kpi-grid`, `ga-tabs`, `ga-table`, `ga-switch`, `ga-overlay`, `ga-card`, `ga-menu`, `ga-chip`, `ga-badge`, `ga-level`, `ga-pagination`, `ga-form-grid`, `ga-col-span-2`, `ga-toast-msg`) já existem na folha.
- Não há tabelas `ftm_*` em `prisma/schema.prisma`. O padrão vigente (Regras, Listas, Alertas) é ler de `lib/mock/*.ts` por funções síncronas com assinatura de leitura real, e manter as edições como estado local do componente cliente.
- Os três protótipos (`references/design/FtMEntidades.html`, `FtMPropriedade.html`, `FtMTiposAcao.html`) compartilham o mesmo seed de schemas, propriedades, tipos de dado e status — as três telas precisam enxergar exatamente o mesmo catálogo.
- Notificações temporárias já são resolvidas por `react-hot-toast`, com `<Toaster>` no layout raiz e tokens visuais em `.ga-toast-msg`.

## Goals / Non-Goals

**Goals:**

- Um único módulo de dados FtM compartilhado pelas três telas, com os derivados (herança, contagens) calculados a partir dele em vez de duplicados.
- Componentes de apresentação com a mesma divisão server/client já usada em Regras e Listas: `page.tsx` server component que lê o mock e passa por props; interatividade num componente cliente por tela.
- Colunas, abas, filtros, menus e formulários fiéis aos protótipos, sem inventar comportamento não coberto por `docs/PRD.md` ou `references/domain/`.

**Non-Goals:**

- Persistência, migrations Prisma ou server actions para `ftm_schema`/`ftm_property`/`ftm_action`.
- Ligar as telas ao editor de regras (o catálogo é consultado, mas o editor continua com sua própria fonte em `lib/mock/regras.ts`).
- Poda ou desabilitação de itens do sidebar que apontam para rotas ainda não implementadas — decisão do usuário: apenas acrescentar o grupo Ontologia FtM.
- Cadastro de novos schemas ("Nova entidade" permanece como notificação de indisponibilidade, como no protótipo).

## Decisions

### 1. Um módulo `lib/mock/ftm.ts` para as três telas, em vez de um mock por tela

Os protótipos repetem `SCHEMAS`, `PROPS_SEED`, `TYPES` e `FTM_STATUS` em cada arquivo porque cada export é uma página isolada. Aqui isso viraria três cópias divergentes do mesmo catálogo. O módulo exporta os tipos (`FtmSchema`, `FtmProperty`, `FtmPropertyType`, `FtmAction`), as tabelas de rótulo (`FTM_STATUS_LABEL`, `PROPERTY_TYPES`, `SEVERITY_LABEL`, `RULE_BADGE`), os seeds (`SCHEMAS`, `PROPERTIES`, `ACTIONS`, `TARGET_RULES`, `INGESTION_TOPICS`, `PROPERTY_USES`, `OPERATORS_BY_TYPE`) e os leitores `getSchemas()`, `getProperties()`, `getActions()`.

Alternativa descartada: reaproveitar `OBSERVABLES` de `lib/mock/listas.ts` como fonte de propriedades. Aquele array é um recorte de observáveis para o seletor de listas (10 entradas), não o catálogo completo (70) — reaproveitá-lo obrigaria a inflá-lo com campos que as Listas não usam. Fica como está; se houver convergência futura, `listas.ts` é que passa a derivar de `ftm.ts`.

### 2. Herança e contagens derivadas, nunca armazenadas no seed

`ancestorsOf(schemaId)`, `depthOf(schemaId)`, `ownPropertiesOf(schemaId)` e `inheritedPropertiesOf(schemaId)` são funções puras sobre o seed. As colunas "Próprias", "Herdadas", "Observáveis" e os KPIs saem delas. Guardar contagens no seed as deixaria erradas assim que a pessoa usuária alterna observabilidade ou situação de uma propriedade em tela.

Consequência: como o estado local da tela pode divergir do seed, as funções derivadas recebem a lista corrente de propriedades como argumento (`ownPropertiesOf(props, schemaId)`), não leem o módulo diretamente.

### 3. Estado local por tela, com o seed como valor inicial

Cada tela é um componente cliente que inicializa `useState` a partir das props vindas do server component. Alternância de observável, mudança de situação, habilitação de ação e gravação de formulário mutam apenas esse estado, e cada operação dispara um `toast` — exatamente como `RegrasTable`/`ListaEditor` já fazem, e coerente com "sem persistência real ainda".

Alternativa descartada: server actions com revalidação. Não há onde gravar; criaria a impressão de persistência.

### 4. Entidades: listagem e detalhe na mesma rota, alternados por estado

O protótipo troca `screen: 'list' | 'edit'` sem mudar de URL, e o botão "Voltar" preserva busca e recorte. Uma sub-rota `/app/ftm/entidades/[schema]` daria URL compartilhável, mas remontaria o estado e perderia as alterações locais de observabilidade/situação feitas na sessão — que, sem persistência, são o único estado existente. Mantém-se a alternância por estado; quando houver banco, a sub-rota passa a ser viável sem perda.

Requisito derivado: "Retorno do detalhe para a listagem" (spec `ftm-entidades`) exige que recorte e busca sobrevivam ao ida-e-volta — o estado de filtro vive no componente pai, acima da alternância de tela.

### 5. Componentes por tela, com extração apenas do que repete

- `components/ftm/EntidadesScreen.tsx` (alterna lista/detalhe), `EntidadesTable.tsx`, `EntidadeDetalhe.tsx`
- `components/ftm/PropriedadesTable.tsx` + `PropriedadeFormModal.tsx`
- `components/ftm/TiposAcaoTable.tsx` + `TipoAcaoFormModal.tsx`
- `components/ftm/Switch.tsx` (a alternância `ga-switch` aparece em quatro contextos distintos nas três telas) e `components/ftm/RowMenu.tsx` (menu de linha com fechamento ao clicar fora, comportamento repetido nas três).

Alternativa descartada: uma tabela genérica parametrizada pelas três telas. As colunas, os menus e os agregados divergem o bastante para que a abstração custasse mais do que a repetição.

### 6. Operadores compatíveis calculados por tipo, a partir da matriz do domínio

`OPERATORS_BY_TYPE` reproduz a matriz `ftm_operator_type` de `references/domain/data-model-regra.md` §4 e §8, na forma código do operador → tipos aceitos. A pré-visualização do formulário de propriedade filtra essa matriz pelo tipo selecionado. Manter a matriz no formato do domínio (e não uma lista pronta por tipo) preserva a rastreabilidade com o seed e com a futura tabela.

### 7. Rotas e navegação

`lib/routes.ts` ganha `ftmEntidades`, `ftmPropriedades` e `ftmTiposAcao` sob `${APP_BASE}/ftm/...`; `nav-data.ts` ganha o grupo `ontologia` (ícone de grafo, `Network` do lucide-react, o mais próximo do path SVG do protótipo) entre `alertas` e `os`, e três entradas em `APP_FEATURES` com caminho "Ontologia FtM / …". O casamento de rota ativa do `Sidebar` já cobre esses subitens por igualdade/prefixo — nenhum `matchExtra` é necessário, porque não há rota de detalhe fora do prefixo.

## Risks / Trade-offs

- **Seed de 70 propriedades transcrito à mão do protótipo pode divergir de `references/domain/seed-regra.md`** → a transcrição é conferida contra §6 do seed do domínio; onde protótipo e domínio divergirem, o domínio prevalece (é a fonte da verdade declarada em `CLAUDE.md`) e a divergência é anotada em comentário no mock.
- **Estado local se perde ao navegar entre as três telas** (marcar uma propriedade como observável em Propriedades não aparece em Entidades) → limitação aceita e inerente à ausência de persistência; é o mesmo comportamento já existente em Regras e Listas.
- **Detalhe de entidade sem URL própria não é compartilhável nem sobrevive a refresh** → aceito conscientemente (decisão 4); revisitar quando as tabelas `ftm_*` existirem.
- **A listagem de propriedades renderiza ~70 linhas sem paginação real** (o protótipo só exibe a totalização) → volume irrelevante para o navegador; a `ga-pagination` é usada apenas como faixa de totalização, como no protótipo, sem controles de página.
