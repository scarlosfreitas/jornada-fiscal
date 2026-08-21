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

Os subitens do grupo Contribuinte SHALL gerar links dinâmicos que incluem o `id_contribuinte` do contribuinte atualmente aberto. Os caminhos SHALL ser:

| Label | Rota |
| --- | --- |
| Linha do Tempo | `/app/contribuintes/[id]` ou `/app/contribuintes/[id]/linha-do-tempo` |
| Situação Cadastral | `/app/contribuintes/[id]/situacao-cadastral` |
| Histórico | `/app/contribuintes/[id]/historico` |
| Recolhimentos | `/app/contribuintes/[id]/recolhimentos` |
| Entrega de Declarações | `/app/contribuintes/[id]/entrega-declaracoes` |
| Valores Declarados | `/app/contribuintes/[id]/valores-declarados` |
| Emissão de Documentos | `/app/contribuintes/[id]/emissao-documentos` |

Quando nenhum contribuinte estiver aberto (navegação fora da ficha), os subitens do grupo Contribuinte SHALL manter os links estáticos existentes (sem `[id]`).

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

#### Scenario: Links do Contribuinte com ficha aberta

- **WHEN** a pessoa usuária está na ficha de um contribuinte com `id` igual a "123"
- **THEN** os subitens do grupo Contribuinte na sidebar geram links como `/app/contribuintes/123/situacao-cadastral`, `/app/contribuintes/123/historico`, etc.

#### Scenario: Links do Contribuinte sem ficha aberta

- **WHEN** a pessoa usuária está fora da ficha de um contribuinte
- **THEN** os subitens do grupo Contribuinte mantêm os links estáticos existentes

#### Scenario: Destaque do item correspondente à tela atual

- **WHEN** uma tela do produto é exibida
- **THEN** o item de navegação correspondente àquela tela aparece destacado como ativo, e, quando a tela corresponde a um subitem, o item pai aparece expandido
