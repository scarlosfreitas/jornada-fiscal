## MODIFIED Requirements

### Requirement: Navegação principal na barra lateral

A barra lateral SHALL apresentar a marca do produto e a navegação principal do sistema. A navegação SHALL conter, nesta ordem, os grupos Painel, Gestão de Alertas, Ordens de Serviço, Contribuinte, Relatórios, Operador e Configuração, cada um com ícone e rótulo. Painel SHALL ser um item sem subitens; os demais grupos SHALL ter subitens:

- Gestão de Alertas: Regras, Listas, Alertas
- Ordens de Serviço: Minhas OS, Gestão de OS
- Contribuinte: Histórico, Situação Cadastral, Recolhimentos, Entrega de Declarações, Valores Declarados, Emissão de Documentos
- Relatórios: Empresas abertas, Reativações, Acumuladores de Crédito, Créditos do Apuração
- Operador: Ciência, TIF, Auto de Embaraço, Auto Principal
- Configuração: Usuários, Perfil de Acesso

Itens com subitens SHALL exibir um indicador de expansão; itens com contagem pendente SHALL exibir essa contagem ao lado do rótulo.

#### Scenario: Item de navegação sem subitens

- **WHEN** a pessoa usuária aciona um item de navegação que não possui subitens
- **THEN** o sistema navega para a tela correspondente

#### Scenario: Expandir um item com subitens

- **WHEN** a pessoa usuária aciona um item de navegação que possui subitens e está recolhido
- **THEN** os subitens desse item passam a ser exibidos abaixo dele e o item passa a se anunciar como expandido para tecnologias assistivas

#### Scenario: Recolher um item com subitens

- **WHEN** a pessoa usuária aciona um item de navegação que possui subitens e está expandido
- **THEN** os subitens deixam de ser exibidos e o item passa a se anunciar como recolhido

#### Scenario: Navegar por um subitem

- **WHEN** a pessoa usuária aciona um subitem
- **THEN** o sistema navega para a tela correspondente

#### Scenario: Destaque do item correspondente à tela atual

- **WHEN** uma tela do produto é exibida
- **THEN** o item de navegação correspondente àquela tela aparece destacado como ativo, e, quando a tela corresponde a um subitem, o item pai aparece expandido

### Requirement: Recolhimento da barra lateral

A barra lateral SHALL oferecer um controle "Recolher menu" no seu rodapé. Quando recolhida, a barra SHALL reduzir sua largura e ocultar rótulos, contagens, indicadores de expansão, textos da marca, grupos de subitens e a busca de funcionalidade, preservando os ícones.

#### Scenario: Recolher a barra lateral

- **WHEN** a pessoa usuária aciona o controle "Recolher menu" com a barra expandida
- **THEN** a barra lateral reduz para a largura recolhida e passa a exibir apenas os ícones dos itens de navegação

#### Scenario: Expandir a barra lateral

- **WHEN** a pessoa usuária aciona o controle "Recolher menu" com a barra recolhida
- **THEN** a barra lateral retorna à largura expandida e volta a exibir rótulos, contagens, a marca e a busca de funcionalidade

#### Scenario: Estado de recolhimento ao mudar de tela

- **WHEN** a pessoa usuária recolhe a barra lateral e em seguida navega para outra tela do produto
- **THEN** a barra lateral permanece recolhida

## REMOVED Requirements

### Requirement: Busca de funcionalidade na barra superior

**Reason**: a busca de funcionalidade passa a ficar no rodapé da barra lateral (ver "Busca de funcionalidade na barra lateral"); a barra superior passa a oferecer busca de contribuinte (ver "Busca de contribuinte na barra superior").

**Migration**: nenhuma migração de dados necessária — é realocação de um componente de UI existente para outro contêiner, com o mesmo conjunto de funcionalidades pesquisáveis.

## ADDED Requirements

### Requirement: Busca de funcionalidade na barra lateral

A barra lateral SHALL oferecer, no seu rodapé, acima do controle "Recolher menu", um campo de busca de funcionalidades do sistema, rotulado "Busca funcionalidade". A busca SHALL filtrar as funcionalidades pelo texto digitado e, para cada resultado, SHALL exibir o nome da funcionalidade e seu caminho no sistema. Acionar um resultado SHALL navegar para a funcionalidade. O dropdown de resultados SHALL abrir para cima, a partir do campo de busca. Esse campo SHALL ficar oculto quando a barra lateral estiver recolhida.

#### Scenario: Abrir a busca ao focar o campo

- **WHEN** a pessoa usuária foca o campo "Busca funcionalidade"
- **THEN** o dropdown de resultados é exibido acima do campo

#### Scenario: Filtrar funcionalidades

- **WHEN** a pessoa usuária digita um texto no campo "Busca funcionalidade"
- **THEN** somente as funcionalidades cujo nome ou caminho correspondem ao texto são listadas no dropdown

#### Scenario: Nenhuma funcionalidade correspondente

- **WHEN** o texto digitado não corresponde a nenhuma funcionalidade
- **THEN** o dropdown informa que nenhuma funcionalidade foi encontrada

#### Scenario: Navegar por um resultado

- **WHEN** a pessoa usuária aciona um resultado da busca
- **THEN** o sistema navega para a funcionalidade correspondente e o dropdown é fechado

#### Scenario: Fechar a busca

- **WHEN** a pessoa usuária pressiona `Esc` ou aciona a área fora do dropdown com ele aberto
- **THEN** o dropdown de resultados é fechado

#### Scenario: Barra lateral recolhida

- **WHEN** a barra lateral está recolhida
- **THEN** o campo "Busca funcionalidade" não é exibido

### Requirement: Busca de contribuinte na barra superior

A barra superior SHALL oferecer um campo de busca de contribuintes, com texto de apoio indicando que a busca aceita CNPJ, razão social, sócio ou contador. Enquanto o campo estiver em foco, um dropdown SHALL ser exibido:

- Sem texto digitado, o dropdown SHALL listar os contribuintes recentes.
- Com texto digitado, o dropdown SHALL listar os contribuintes cujo CNPJ, razão social, sócio ou contador correspondem ao texto.

Cada item do dropdown SHALL exibir a razão social do contribuinte como título, "CNPJ · IE" como subtítulo, e um badge com a situação cadastral do contribuinte. Acionar um item SHALL navegar para a tela do contribuinte correspondente.

#### Scenario: Abrir a busca sem texto

- **WHEN** a pessoa usuária foca o campo de busca de contribuinte sem ter digitado nada
- **THEN** o dropdown exibe a lista de contribuintes recentes

#### Scenario: Filtrar contribuintes por texto

- **WHEN** a pessoa usuária digita um CNPJ, razão social, nome de sócio ou de contador no campo de busca
- **THEN** o dropdown passa a listar somente os contribuintes cujo CNPJ, razão social, sócio ou contador correspondem ao texto digitado

#### Scenario: Nenhum contribuinte correspondente

- **WHEN** o texto digitado não corresponde a nenhum contribuinte
- **THEN** o dropdown informa que nenhum contribuinte foi encontrado para o texto digitado

#### Scenario: Conteúdo de cada item do dropdown

- **WHEN** o dropdown de busca de contribuinte exibe um resultado
- **THEN** o item mostra a razão social como título, "CNPJ · IE" como subtítulo e um badge com a situação cadastral do contribuinte

#### Scenario: Navegar por um resultado

- **WHEN** a pessoa usuária aciona um item do dropdown de busca de contribuinte
- **THEN** o sistema navega para a tela do contribuinte correspondente e o dropdown é fechado

#### Scenario: Fechar a busca

- **WHEN** a pessoa usuária pressiona `Esc` ou aciona a área fora do dropdown com ele aberto
- **THEN** o dropdown é fechado
