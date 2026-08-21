## MODIFIED Requirements

### Requirement: Aba Histórico

A aba Histórico SHALL apresentar as alterações cadastrais do contribuinte ao longo do tempo, em forma de tabela, com data de início e data de fim de cada estado cadastral e os atributos vigentes naquele intervalo.

Os registros SHALL ser obtidos da view `analytics.sate_hist_regime`, filtrada por `cad_id` igual ao `[id]` do segmento de rota, e SHALL ser apresentados em ordem cronológica crescente de data de início. As colunas exibidas SHALL ser:

| Coluna exibida | Coluna de origem (`sate_hist_regime`) |
| --- | --- |
| Data início | `cad_hist_ini` |
| Data fim | `cad_hist_fim` |
| Regime estadual | `cad_reg_est_nome` |
| Regime federal | `cad_reg_fed_nome` |
| Situação | `cad_situacao_nome` |
| Razão social | `cad_razao_social` |
| Natureza jurídica | `cad_nat_jur_nome` |
| Município | `cad_municipio` e `cad_uf`, apresentados juntos como "município-UF" |

As datas de início e fim SHALL ser apresentadas no formato de data e hora do português brasileiro (dia/mês/ano hora:minuto:segundo).

A tabela SHALL exibir apenas os registros em que ao menos um dos atributos exibidos mudou em relação ao registro anterior; registros consecutivos idênticos nos atributos exibidos SHALL ser omitidos. Datas de início e fim SHALL ser desconsideradas nessa comparação.

Os atributos exibidos SHALL ser configuráveis pela pessoa usuária. A data de início SHALL ser sempre exibida e não SHALL poder ser ocultada; ao ser tentada sua ocultação, o sistema SHALL informar que a coluna é obrigatória.

Os valores que mudaram SHALL ser destacados, com legenda explicando o destaque. A quantidade de registros exibidos SHALL ser informada em relação ao total.

Quando a view `analytics.sate_hist_regime` não estiver disponível no ambiente, ou quando o `cad_id` informado não possuir registro nela, a aba SHALL degradar graciosamente, informando que não há histórico cadastral a exibir, sem erro não tratado.

#### Scenario: Apresentação das alterações cadastrais

- **WHEN** a pessoa usuária abre a aba Histórico
- **THEN** as alterações cadastrais são apresentadas em tabela, em ordem cronológica crescente, com data de início, data de fim e os atributos vigentes em cada intervalo, obtidos de `analytics.sate_hist_regime`

#### Scenario: Coluna Município

- **WHEN** a tabela é apresentada
- **THEN** cada registro exibe uma coluna Município formada pelo município e pela UF vigentes naquele intervalo, apresentados juntos

#### Scenario: Registros sem alteração são omitidos

- **WHEN** registros consecutivos possuem os mesmos valores em todos os atributos exibidos
- **THEN** apenas o primeiro deles é apresentado

#### Scenario: Ocultar um atributo

- **WHEN** a pessoa usuária oculta um atributo da tabela
- **THEN** a coluna correspondente deixa de ser exibida e a tabela é recalculada, passando a omitir registros que só se distinguiam por aquele atributo

#### Scenario: Tentar ocultar a data de início

- **WHEN** a pessoa usuária tenta ocultar a coluna de data de início
- **THEN** a coluna permanece exibida e o sistema informa que ela é obrigatória

#### Scenario: Destaque dos valores alterados

- **WHEN** a tabela é apresentada
- **THEN** os valores que mudaram aparecem destacados, acompanhados da legenda que explica o destaque

#### Scenario: Nenhuma alteração nos atributos exibidos

- **WHEN** os atributos exibidos não registram nenhuma alteração
- **THEN** a tabela informa que não há alteração cadastral nos atributos selecionados

#### Scenario: Contribuinte sem histórico cadastral

- **WHEN** o `cad_id` informado não possui registro em `analytics.sate_hist_regime`
- **THEN** a aba informa que não há histórico cadastral a exibir para o contribuinte

#### Scenario: View analítica indisponível

- **WHEN** a view `analytics.sate_hist_regime` não existe no ambiente
- **THEN** a aba informa que não há histórico cadastral a exibir, sem erro não tratado
