## Why

O motor de regras de alerta é escrito sobre a ontologia FollowTheMoney: toda condição de uma regra referencia um schema (`ftm_schema`), uma propriedade daquele schema (`ftm_property`) e toda regra dispara ações de um catálogo (`ftm_action`). Hoje esse catálogo só existe em `references/domain/` e nos mocks internos das telas de Regras e Listas — não há nenhuma tela onde o auditor consulte quais entidades, propriedades e tipos de ação estão disponíveis, o que herda de quê, o que é observável indexável em watchlist e o que está ativo, em teste, suspenso ou arquivado. Sem essa camada de catálogo, quem escreve uma regra não tem como saber o vocabulário que pode usar.

## What Changes

- Nova tela **Entidades** (`/app/ftm/entidades`): catálogo de schemas FtM (`ftm_schema`) com KPIs, abas (todos / entidades / arestas com vigência), busca, hierarquia por herança indentada e, por schema: descrição semântica, schema pai, natureza (entidade ou aresta), contagem de propriedades próprias, herdadas, observáveis e regras que o usam como alvo.
- Detalhe de uma entidade, na mesma rota: edição da definição do schema (nome técnico, rótulo, pai, natureza, descrição), tabela de propriedades próprias com alternância de observável e de situação, tabela somente-leitura de propriedades herdadas dos ancestrais, resumo de situação das propriedades, dados de ingestão (tópico Kafka, chave de partição, contrato, enriquecimento) e regras que usam o schema como evento disparador.
- Nova tela **Propriedades** (`/app/ftm/propriedades`): catálogo de `ftm_property` com busca, abas (todas / observáveis / relacionamentos / suspensas e arquivadas), filtros por schema e por tipo de dado, alternância de observável na linha, mudança de situação pelo menu da linha e modal de cadastro/edição com pré-visualização do caminho na regra e dos operadores compatíveis com o tipo escolhido.
- Nova tela **Tipos de Ação** (`/app/ftm/tipo-acao`): catálogo de `ftm_action` com busca, abas (todos / habilitados / desabilitados), integração de destino, severidade padrão, parâmetros esperados, regras vinculadas e disparos, e modal de cadastro/edição com pré-visualização do trecho correspondente na AST.
- Barra lateral ganha o grupo **Ontologia FtM** (Entidades, Propriedades, Tipos de Ação), posicionado logo após Gestão de Alertas, e as três telas passam a ser encontráveis pela busca de funcionalidade.
- Os dados vêm de mocks derivados de `references/domain/` (mesma abordagem já usada em Regras e Listas); as edições são estado local em memória, sem persistência.

## Capabilities

### New Capabilities

- `ftm-entidades`: catálogo de schemas FtM (entidades e arestas), sua hierarquia de herança e o detalhe de um schema com suas propriedades próprias e herdadas.
- `ftm-propriedades`: catálogo de propriedades FtM (`ftm_property`), com filtros por schema e tipo, controle de observabilidade e de situação, e cadastro/edição de propriedade.
- `ftm-tipos-acao`: catálogo de tipos de ação (`ftm_action`) disparáveis pelas regras, com integração, severidade padrão, parâmetros e habilitação no editor de regras.

### Modified Capabilities

- `dashboard-shell`: a navegação principal passa a conter o grupo "Ontologia FtM" com os subitens Entidades, Propriedades e Tipos de Ação, entre Gestão de Alertas e Ordens de Serviço.

## Impact

- `app/app/ftm/entidades/page.tsx`, `app/app/ftm/propriedades/page.tsx`, `app/app/ftm/tipo-acao/page.tsx` (novas rotas sob o shell autenticado já montado em `app/app/layout.tsx`).
- `components/ftm/*` (novos componentes de apresentação, todos usando as classes `ga-*` de `app/gestor-alertas.css`).
- `lib/mock/ftm.ts` (novo): schemas, propriedades, tipos de dado, operadores por tipo e tipos de ação, derivados de `references/domain/data-model-regra.md` e `references/domain/seed-regra.md`.
- `lib/routes.ts`: três novas entradas em `ROUTES`.
- `components/layout/nav-data.ts`: novo grupo em `NAV_ITEMS` e três entradas em `APP_FEATURES`.
- Sem alteração de banco: as tabelas `ftm_*` ainda não existem em `prisma/schema.prisma`; nada é persistido nesta change.
