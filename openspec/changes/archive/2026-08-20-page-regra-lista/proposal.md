## Why

O grupo de navegação "Gestão de Alertas" (barra lateral) já lista os subitens Regras, Listas e Alertas, e a barra superior de Regras já linka para `regraDetalhe(codigo)` a partir do painel — mas nenhuma dessas três telas tem página: hoje elas levam a 404. `references/domain/data-model-regra.md` e `references/domain/seed-regra.md` documentam o motor de regras baseado na ontologia FollowTheMoney (schemas, propriedades, operadores, watchlists, ações e a AST de condições), e `references/design/FtMRegras.html` e `references/design/FtMLista.html` já têm o protótipo visual completo dessas telas. Falta transcrever esse protótipo para páginas reais do produto.

## What Changes

- Nova tela **Regras** (`/app/regras/regras-de-alerta`): lista as regras de alerta cadastradas (`ftm_rule`) com busca, filtro por schema-alvo e por ação, abas por situação (`RASCUNHO`, `EM_TESTE`, `ATIVA`, `INATIVA`, `ERRO`, `ARQUIVADA`), seleção em massa com ativar/desativar/arquivar, e link para o detalhe de cada regra.
- Nova tela **Regra · detalhe** (`/app/regras/{codigo}`, via `regraDetalhe(codigo)` já existente): identificação da regra, editor da árvore de condições (AST recursiva `all`/`any`/`not` navegando em grafo FtM a partir do schema-alvo), tabela de ações disparadas (`ftm_action`) com severidade e parâmetros, AST JSON gerada, e histórico de versões (`ftm_rule_definition`).
- Nova tela **Listas** (`/app/alertas/listas`): lista as watchlists de observáveis (`ftm_list`) com busca e situação, e o detalhe de cada lista com seus itens de vigência temporal (`ftm_list_item`, SCD Tipo 2 — inclusão/encerramento com justificativa) e as regras que a consomem.
- Nova tela **Alertas** (`/app/regras/alertas-gerados`): lista os alertas gerados pelas regras, com filtros por nível (indicação/alerta/intervenção), canal de comunicação e tipo de alvo (CNPJ, grupo econômico, sócio), abas de contagem por nível, e paginação.
- Nova rota `listaDetalhe(codigo)` em `lib/routes.ts` para o detalhe de uma lista, seguindo o mesmo padrão de `regraDetalhe(codigo)`.
- Três novos módulos de mock (`lib/mock/regras.ts`, `lib/mock/listas.ts`, `lib/mock/alertas.ts`) transcrevendo os dados de `references/design/FtMRegras.html`, `references/design/FtMLista.html` e `references/design/AlertasGerados.html`, com tipos alinhados ao modelo FtM de `references/domain/data-model-regra.md`.

## Capabilities

### New Capabilities
- `regras-alerta`: tela de listagem de regras de alerta e tela de detalhe/edição de uma regra (identificação, árvore de condições AST, ações disparadas, versionamento).
- `listas-observaveis`: tela de listagem de watchlists e tela de detalhe de uma lista (itens com vigência temporal, regras consumidoras).
- `alertas-gerados`: tela de listagem dos alertas gerados pelas regras, com filtros e paginação.

### Modified Capabilities
(nenhuma — os subitens Regras/Listas/Alertas e o link `regraDetalhe` já estão especificados em `dashboard-shell`; esta change apenas lhes dá página, sem mudar requisito de navegação.)

## Impact

- Código novo: `app/app/regras/regras-de-alerta/page.tsx`, `app/app/regras/[codigo]/page.tsx`, `app/app/alertas/listas/page.tsx` (+ possível `[codigo]` para detalhe de lista), `app/app/regras/alertas-gerados/page.tsx`, componentes de apoio em `components/regras/`, `components/listas/`, `components/alertas/`, e os três módulos de mock citados acima.
- Código alterado: `lib/routes.ts` (nova função `listaDetalhe`).
- Sem mudança em `app/gestor-alertas.css` prevista — o protótipo usa apenas classes `.ga-*` já existentes; caso a varredura na etapa de design encontre classe faltante, ela será extraída do protótipo, como já ocorreu na change `create-contribuinte`.
- Sem mudança em autenticação, banco de dados ou dependências.
