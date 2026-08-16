## Purpose

Define o Painel operacional do Gertor de Alertas: a visão consolidada, na entrada do sistema, de alertas gerados, monitoramentos ativos, ordens de serviço de intervenção e canais de comunicação, filtrável por período.

## ADDED Requirements

### Requirement: Painel operacional no índice da aplicação

O sistema SHALL exibir o Painel operacional no índice da aplicação (`/app`), dentro da moldura padrão da aplicação. A página SHALL fornecer apenas o conteúdo da área de conteúdo; barra lateral, barra superior e rodapé SHALL ser os mesmos de todas as demais telas.

#### Scenario: Acesso ao painel

- **WHEN** a pessoa usuária acessa `/app`
- **THEN** o Painel operacional é exibido dentro da moldura padrão, com o item "Painel" destacado como ativo na navegação lateral

#### Scenario: Cabeçalho da página

- **WHEN** o painel é exibido
- **THEN** o cabeçalho mostra o caminho "Operações / Painel", o título "Painel operacional" e o subtítulo "Visão consolidada de alertas, monitoramentos e ordens de serviço"

### Requirement: Filtro de período

O painel SHALL oferecer um seletor de período com as opções "Últimos 7 dias", "Últimos 30 dias" e "Últimos 90 dias", iniciando em 7 dias. A troca de período SHALL atualizar os indicadores e as visualizações que dependem de janela temporal.

#### Scenario: Período inicial

- **WHEN** o painel é exibido pela primeira vez
- **THEN** o seletor mostra "Últimos 7 dias" e os dados exibidos correspondem a esse período

#### Scenario: Troca de período

- **WHEN** a pessoa usuária seleciona outro período
- **THEN** os valores e comparativos dos indicadores, o gráfico de alertas por dia e o gráfico de regras que mais disparam passam a refletir o período escolhido, sem recarregar a página

#### Scenario: Rótulo do período nas visualizações

- **WHEN** um período está selecionado
- **THEN** os cartões cujo conteúdo depende do período exibem o rótulo do período selecionado em seu subtítulo

### Requirement: Indicadores consolidados

O painel SHALL exibir quatro indicadores no topo, cada um com rótulo, ícone, valor e uma linha de comparação ou meta. Os indicadores SHALL cobrir alertas gerados, regras ativas, ordens de serviço em aberto e taxa de conclusão.

#### Scenario: Exibição dos indicadores

- **WHEN** o painel é exibido
- **THEN** os quatro indicadores aparecem lado a lado, cada um com seu valor em destaque e sua linha de comparação abaixo

#### Scenario: Indicadores acompanham o período

- **WHEN** a pessoa usuária troca o período
- **THEN** o valor e a linha de comparação de cada indicador são atualizados para o novo período

### Requirement: Evolução de alertas por nível

O painel SHALL exibir a evolução temporal dos alertas gerados, separada pelos três níveis de monitoramento — alerta (vermelho), indicação (amarelo) e intervenção (cinza) — com legenda identificando cada nível por cor.

#### Scenario: Séries por nível

- **WHEN** o painel é exibido
- **THEN** o gráfico mostra uma série para cada um dos três níveis, com a legenda associando cada cor ao seu nível

#### Scenario: Detalhe de um ponto

- **WHEN** a pessoa usuária aponta para um ponto do gráfico
- **THEN** o valor daquele nível naquele intervalo é exibido

#### Scenario: Granularidade por período

- **WHEN** a pessoa usuária seleciona 7, 30 ou 90 dias
- **THEN** o eixo temporal passa a mostrar, respectivamente, dias, semanas ou meses

### Requirement: Distribuição das ordens de serviço por situação

O painel SHALL exibir a distribuição das ordens de serviço de intervenção entre as situações aberta, solicitada, delegada, concluída, rejeitada e decaída, com legenda identificando cada situação.

#### Scenario: Distribuição por situação

- **WHEN** o painel é exibido
- **THEN** o gráfico mostra a participação de cada uma das seis situações, com legenda nomeando cada uma

#### Scenario: Detalhe de uma situação

- **WHEN** a pessoa usuária aponta para uma fatia do gráfico
- **THEN** a quantidade de ordens de serviço naquela situação é exibida

### Requirement: Regras que mais disparam

O painel SHALL exibir o ranking das regras que mais geraram alertas no período, identificadas pelo código da regra, ordenadas da que mais disparou para a que menos disparou, com acesso à tela de regras.

#### Scenario: Ranking de regras

- **WHEN** o painel é exibido
- **THEN** as regras aparecem em ordem decrescente de alertas emitidos, cada uma identificada pelo seu código

#### Scenario: Acesso às regras

- **WHEN** a pessoa usuária aciona "Ver regras"
- **THEN** o sistema navega para a tela de regras de alerta

### Requirement: Entregas por canal de comunicação

O painel SHALL exibir, para cada canal de comunicação — tela do sistema, Telegram, Prodoc, e-mail e pessoal — a natureza do canal, a quantidade de entregas no período e a proporção dessas entregas em relação ao canal de maior volume.

#### Scenario: Lista de canais

- **WHEN** o painel é exibido
- **THEN** cada canal aparece com seu nome, sua descrição curta, a quantidade de entregas e uma barra proporcional ao volume

### Requirement: Últimos alertas gerados

O painel SHALL exibir a fila dos alertas mais recentes, com hora, nível do alerta, identificação do alvo (nome e documento) e a regra que o originou. Cada regra listada SHALL dar acesso à regra correspondente, e a lista SHALL dar acesso à tela completa de alertas gerados.

#### Scenario: Fila de alertas recentes

- **WHEN** o painel é exibido
- **THEN** os alertas mais recentes aparecem em ordem decrescente de hora, cada linha com hora, nível, alvo e regra

#### Scenario: Nível visualmente distinguível

- **WHEN** um alerta é listado
- **THEN** seu nível — Alerta, Indicação ou Intervenção — é exibido com a cor correspondente ao nível de monitoramento

#### Scenario: Acesso a todos os alertas

- **WHEN** a pessoa usuária aciona "Ver todos"
- **THEN** o sistema navega para a tela de alertas gerados

### Requirement: Monitoramentos ativos com intervenção em aberto

O painel SHALL exibir os monitoramentos ativos que possuem ordens de serviço de intervenção em aberto, com código, descrição, escopo, nível e a quantidade de ordens de serviço associadas, e SHALL dar acesso à tela de monitoramento.

#### Scenario: Lista de monitoramentos

- **WHEN** o painel é exibido
- **THEN** cada monitoramento aparece com código, descrição, escopo, nível e a contagem de ordens de serviço

#### Scenario: Acesso ao monitoramento

- **WHEN** a pessoa usuária aciona "Ver monitoramentos"
- **THEN** o sistema navega para a tela de monitoramento

### Requirement: Ações do painel

O painel SHALL oferecer a ação "Atualizar", que recarrega os dados exibidos, e SHALL apresentar a ação "Exportar" de forma visível porém indisponível enquanto a exportação não estiver implementada.

#### Scenario: Atualizar os dados

- **WHEN** a pessoa usuária aciona "Atualizar"
- **THEN** os dados do painel são recarregados para o período selecionado e o período em vigor é mantido

#### Scenario: Exportação indisponível

- **WHEN** a pessoa usuária visualiza a ação "Exportar"
- **THEN** a ação aparece desabilitada e sinaliza que a exportação ainda não está disponível
