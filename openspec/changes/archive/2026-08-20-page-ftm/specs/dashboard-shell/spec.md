## MODIFIED Requirements

### Requirement: Navegação principal na barra lateral

A barra lateral SHALL apresentar a marca do produto e a navegação principal do sistema. A navegação SHALL conter, nesta ordem, os grupos Painel, Gestão de Alertas, Ontologia FtM, Ordens de Serviço, Contribuinte, Relatórios, Operador e Configuração, cada um com ícone e rótulo. Painel SHALL ser um item sem subitens; os demais grupos SHALL ter subitens:

- Gestão de Alertas: Regras, Listas, Alertas
- Ontologia FtM: Entidades, Propriedades, Tipos de Ação
- Ordens de Serviço: Minhas OS, Gestão de OS
- Contribuinte: Linha do Tempo, Situação Cadastral, Histórico, Recolhimentos, Entrega de Declarações, Valores Declarados, Emissão de Documentos
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

#### Scenario: Navegar para uma tela da Ontologia FtM

- **WHEN** a pessoa usuária aciona o subitem Entidades, Propriedades ou Tipos de Ação do grupo Ontologia FtM
- **THEN** o sistema navega para a tela correspondente e o subitem acionado aparece destacado como ativo, com o grupo Ontologia FtM expandido

#### Scenario: Destaque do item correspondente à tela atual

- **WHEN** uma tela do produto é exibida
- **THEN** o item de navegação correspondente àquela tela aparece destacado como ativo, e, quando a tela corresponde a um subitem, o item pai aparece expandido

## ADDED Requirements

### Requirement: Telas da Ontologia FtM na busca de funcionalidade

A busca de funcionalidade da barra lateral SHALL incluir as telas Entidades, Propriedades e Tipos de Ação entre as funcionalidades pesquisáveis, cada uma com seu caminho no sistema sob "Ontologia FtM".

#### Scenario: Encontrar uma tela da Ontologia FtM pela busca

- **WHEN** a pessoa usuária digita um texto que corresponde ao nome ou ao caminho de Entidades, Propriedades ou Tipos de Ação no campo "Busca funcionalidade"
- **THEN** a funcionalidade correspondente é listada no dropdown com seu caminho sob "Ontologia FtM", e acioná-la navega para a tela
