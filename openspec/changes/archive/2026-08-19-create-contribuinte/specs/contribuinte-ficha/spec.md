## Purpose

Define a ficha do contribuinte: a tela onde a pessoa auditora investiga uma empresa específica, reunindo sob uma identidade única a linha do tempo de eventos, a situação cadastral e seu histórico, os recolhimentos, as declarações entregues, os valores declarados e os documentos emitidos.

## ADDED Requirements

### Requirement: Identidade do contribuinte compartilhada entre as abas

A ficha SHALL exibir, acima da navegação por abas e visível em todas elas, uma barra de identidade do contribuinte contendo as iniciais da razão social, a razão social, uma linha com CNPJ, inscrição estadual e grupo econômico, e os indicadores de destaque do contribuinte (situação cadastral, alertas em aberto e regime).

A identidade exibida SHALL corresponder ao contribuinte da ficha aberta e SHALL permanecer inalterada ao trocar de aba.

#### Scenario: Abertura da ficha

- **WHEN** a pessoa usuária abre a ficha de um contribuinte
- **THEN** a barra de identidade mostra as iniciais, a razão social, a linha "CNPJ · IE · grupo econômico" e os indicadores de destaque do contribuinte

#### Scenario: Identidade preservada ao trocar de aba

- **WHEN** a pessoa usuária troca de aba dentro da ficha
- **THEN** a barra de identidade permanece exibida, com o mesmo conteúdo

### Requirement: Navegação por abas da ficha

A ficha SHALL oferecer uma barra de abas própria, posicionada abaixo da identidade do contribuinte e acima do conteúdo, com sete abas nesta ordem: Linha do tempo, Situação cadastral, Histórico, Recolhimentos, Entrega de declarações, Valores declarados e Emissão de documentos.

Cada aba SHALL ter endereço próprio, de modo que a aba aberta possa ser compartilhada, recarregada e alcançada pelo histórico do navegador. A aba correspondente ao endereço atual SHALL aparecer destacada como ativa, e apenas ela.

Cada aba SHALL apresentar um cabeçalho com trilha de navegação "Contribuinte / <aba>", título e subtítulo próprios.

#### Scenario: Abrir a ficha sem indicar aba

- **WHEN** a pessoa usuária abre a ficha de um contribuinte sem indicar uma aba
- **THEN** o sistema apresenta a primeira aba, Linha do tempo

#### Scenario: Trocar de aba

- **WHEN** a pessoa usuária aciona uma aba diferente da atual
- **THEN** o endereço passa a ser o daquela aba, o conteúdo exibido é o dela e a aba acionada passa a aparecer destacada como ativa

#### Scenario: Recarregar uma aba

- **WHEN** a pessoa usuária recarrega a página estando em uma aba
- **THEN** a mesma aba é reapresentada, destacada como ativa

#### Scenario: Voltar pelo histórico do navegador

- **WHEN** a pessoa usuária troca de aba e em seguida aciona voltar no navegador
- **THEN** a aba anterior é reapresentada, destacada como ativa

### Requirement: Aba Linha do tempo

A aba Linha do tempo SHALL apresentar os eventos do contribuinte em ordem cronológica, cada um com data, título e, quando houver, a categoria do evento (cadastro, fiscalização, autuação, prazo ou contato).

Eventos vinculados a um documento SHALL oferecer acesso ao documento correspondente. Eventos de verificação in loco SHALL apresentar as fotos registradas. Eventos de contato SHALL apresentar a transcrição do atendimento, com a indicação de sigilo e a autoria do registro.

A data atual SHALL ser assinalada na linha do tempo, e eventos posteriores a ela SHALL ser distinguidos visualmente como futuros. Eventos futuros com inconsistência de prazo SHALL exibir o aviso correspondente.

#### Scenario: Listagem dos eventos

- **WHEN** a pessoa usuária abre a aba Linha do tempo
- **THEN** os eventos do contribuinte são apresentados em ordem cronológica, cada um com sua data, título e categoria

#### Scenario: Marcação do momento atual

- **WHEN** a linha do tempo é apresentada
- **THEN** a data atual aparece assinalada e os eventos posteriores a ela aparecem distinguidos como futuros

#### Scenario: Evento com aviso de prazo

- **WHEN** um evento futuro possui inconsistência de prazo
- **THEN** o evento exibe o aviso descrevendo a inconsistência

#### Scenario: Fotos de uma verificação in loco

- **WHEN** a pessoa usuária aciona as fotos de um evento de verificação in loco
- **THEN** as fotos são apresentadas uma por vez, com legenda e a posição da foto no conjunto, e a pessoa pode avançar e retroceder entre elas

#### Scenario: Transcrição de um atendimento

- **WHEN** um evento de contato é apresentado
- **THEN** a transcrição do atendimento é exibida junto da indicação de sigilo e de quem registrou o atendimento, com a data do registro

### Requirement: Aba Situação cadastral

A aba Situação cadastral SHALL apresentar a posição cadastral atual do contribuinte como uma relação de campos, cada um com seu rótulo e valor. Campos cuja vigência é conhecida SHALL indicar há quanto tempo o valor atual vigora.

Campos que possuem histórico SHALL oferecer acesso a ele; ao ser acionado, o histórico daquele campo SHALL ser apresentado com os valores anteriores, cada um com a data e o motivo da alteração, sem sair da aba.

#### Scenario: Apresentação dos campos cadastrais

- **WHEN** a pessoa usuária abre a aba Situação cadastral
- **THEN** os campos da posição cadastral atual são apresentados com rótulo e valor, e os campos com vigência conhecida indicam há quanto tempo o valor atual vigora

#### Scenario: Consultar o histórico de um campo

- **WHEN** a pessoa usuária aciona o histórico de um campo que o possui
- **THEN** os valores anteriores daquele campo são apresentados, cada um com data e motivo da alteração

#### Scenario: Fechar o histórico de um campo

- **WHEN** a pessoa usuária fecha o histórico de um campo
- **THEN** a relação de campos volta a ser exibida, na mesma aba

#### Scenario: Campo sem histórico

- **WHEN** um campo não possui histórico
- **THEN** o campo é apresentado sem acesso a histórico

### Requirement: Aba Histórico

A aba Histórico SHALL apresentar as alterações cadastrais do contribuinte ao longo do tempo, em forma de tabela, com data de início e data de fim de cada estado cadastral e os atributos vigentes naquele intervalo.

A tabela SHALL exibir apenas os registros em que ao menos um dos atributos exibidos mudou em relação ao registro anterior; registros consecutivos idênticos nos atributos exibidos SHALL ser omitidos. Datas de início e fim SHALL ser desconsideradas nessa comparação.

Os atributos exibidos SHALL ser configuráveis pela pessoa usuária. A data de início SHALL ser sempre exibida e não SHALL poder ser ocultada; ao ser tentada sua ocultação, o sistema SHALL informar que a coluna é obrigatória.

Os valores que mudaram SHALL ser destacados, com legenda explicando o destaque. A quantidade de registros exibidos SHALL ser informada em relação ao total.

#### Scenario: Apresentação das alterações cadastrais

- **WHEN** a pessoa usuária abre a aba Histórico
- **THEN** as alterações cadastrais são apresentadas em tabela, com data de início, data de fim e os atributos vigentes em cada intervalo

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

### Requirement: Aba Recolhimentos

A aba Recolhimentos SHALL apresentar os recolhimentos do contribuinte agrupados por código de receita, exibindo para cada código a sua descrição e os valores do mês corrente, dos dois meses anteriores e as médias de três meses, seis meses e do ano.

#### Scenario: Apresentação dos recolhimentos

- **WHEN** a pessoa usuária abre a aba Recolhimentos
- **THEN** cada código de receita é apresentado com sua descrição e os valores do mês corrente, dos dois meses anteriores e as médias de três meses, seis meses e do ano

### Requirement: Aba Entrega de declarações

A aba Entrega de declarações SHALL apresentar as entregas do contribuinte agrupadas por tipo de declaração, exibindo para cada tipo a sua descrição e as quantidades do mês corrente, dos dois meses anteriores e os totais de três meses, seis meses e do ano.

#### Scenario: Apresentação das entregas

- **WHEN** a pessoa usuária abre a aba Entrega de declarações
- **THEN** cada tipo de declaração é apresentado com sua descrição e as quantidades do mês corrente, dos dois meses anteriores e os totais de três meses, seis meses e do ano

### Requirement: Aba Valores declarados

A aba Valores declarados SHALL apresentar as rubricas da apuração do contribuinte em uma matriz, com uma linha por rubrica — identificada por código e descrição — e uma coluna por período.

O intervalo de períodos SHALL ser escolhido pela pessoa usuária, e a quantidade de colunas apresentadas SHALL acompanhar essa escolha. A matriz SHALL poder ser percorrida horizontalmente quando exceder a largura disponível, e o cabeçalho SHALL indicar o intervalo em vigor e a origem dos valores.

#### Scenario: Apresentação das rubricas

- **WHEN** a pessoa usuária abre a aba Valores declarados
- **THEN** cada rubrica é apresentada com código, descrição e seus valores por período, e o cabeçalho indica o intervalo em vigor e a origem dos valores

#### Scenario: Trocar o intervalo de períodos

- **WHEN** a pessoa usuária escolhe outro intervalo de períodos
- **THEN** a quantidade de colunas de período apresentadas passa a corresponder ao intervalo escolhido, e o cabeçalho passa a indicá-lo

### Requirement: Aba Emissão de documentos

A aba Emissão de documentos SHALL apresentar os documentos emitidos pelo contribuinte agrupados por tipo, exibindo para cada tipo a sua descrição, a quantidade e o valor correspondente no mês corrente, nos dois meses anteriores e nas médias de três meses, seis meses e do ano.

A aba SHALL permitir escolher se os documentos considerados são aqueles em que o contribuinte figura como emitente ou como destinatário, e qual métrica de valor é considerada.

#### Scenario: Apresentação dos documentos emitidos

- **WHEN** a pessoa usuária abre a aba Emissão de documentos
- **THEN** cada tipo de documento é apresentado com sua descrição, quantidade e valor no mês corrente, nos dois meses anteriores e nas médias de três meses, seis meses e do ano

#### Scenario: Escolher a posição do contribuinte e a métrica

- **WHEN** a pessoa usuária escolhe a posição do contribuinte ou a métrica de valor
- **THEN** a escolha passa a constar como critério em vigor da aba

### Requirement: Busca dentro da aba

As abas que o protótipo prevê com busca — Linha do tempo, Entrega de declarações e Valores declarados — SHALL oferecer um campo de busca que filtra os itens apresentados naquela aba pelo texto digitado, com texto de apoio indicando o que pode ser buscado.

O texto digitado SHALL ser descartado ao trocar de aba.

#### Scenario: Filtrar os itens de uma aba

- **WHEN** a pessoa usuária digita um texto no campo de busca da aba
- **THEN** somente os itens da aba que correspondem ao texto permanecem apresentados

#### Scenario: Nenhum item correspondente

- **WHEN** o texto digitado não corresponde a nenhum item da aba
- **THEN** a aba informa que nenhum item foi encontrado

#### Scenario: Troca de aba descarta a busca

- **WHEN** a pessoa usuária digita um texto na busca e em seguida troca de aba
- **THEN** a nova aba é apresentada sem filtro aplicado e com o campo de busca vazio
