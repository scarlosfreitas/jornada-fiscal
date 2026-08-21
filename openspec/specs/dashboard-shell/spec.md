## Purpose

Define o invólucro visual e de navegação compartilhado por todas as telas autenticadas do Gertor de Alertas: barra lateral de navegação, barra superior, área de conteúdo e rodapé. Garante que toda página do produto apareça dentro da mesma moldura, com navegação e identidade visual consistentes.

## Requirements

### Requirement: Moldura única para as telas do produto

Toda tela do produto SHALL ser apresentada dentro de uma moldura composta por barra lateral, barra superior, área de conteúdo e rodapé, nessa disposição. O conteúdo específico de cada tela SHALL ocupar apenas a área de conteúdo; a moldura SHALL permanecer visualmente idêntica entre telas.

#### Scenario: Abertura de uma tela do produto

- **WHEN** a pessoa usuária abre qualquer tela do produto
- **THEN** a barra lateral aparece à esquerda ocupando a altura total da janela, a barra superior aparece no topo da coluna restante, o conteúdo da tela aparece abaixo dela e o rodapé aparece ao final da mesma coluna

#### Scenario: Navegação entre telas

- **WHEN** a pessoa usuária navega de uma tela do produto para outra
- **THEN** apenas a área de conteúdo é substituída, e barra lateral, barra superior e rodapé permanecem com a mesma aparência e o mesmo estado de rolagem da janela no topo

#### Scenario: Barra superior fixa durante a rolagem

- **WHEN** a pessoa usuária rola uma tela cujo conteúdo excede a altura da janela
- **THEN** a barra superior permanece visível no topo e a barra lateral permanece visível à esquerda

#### Scenario: Impressão da tela

- **WHEN** a pessoa usuária imprime uma tela do produto
- **THEN** barra lateral, barra superior e rodapé são omitidos e apenas a área de conteúdo é impressa

### Requirement: Identidade e idioma da aplicação

A aplicação SHALL se identificar como produto "Gertor de Alertas" e SHALL declarar português do Brasil como idioma do documento.

#### Scenario: Título da aba do navegador

- **WHEN** a pessoa usuária abre qualquer tela do produto
- **THEN** o título exibido pelo navegador identifica o Gertor de Alertas, e não o texto padrão do gerador de projeto

#### Scenario: Idioma declarado

- **WHEN** um leitor de tela ou o navegador inspeciona o documento
- **THEN** o idioma declarado é `pt-BR`

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

O contribuinte atualmente aberto SHALL ser determinado exclusivamente pelo endereço da tela em exibição. Um segmento que corresponda ao nome de uma das abas da ficha NÃO SHALL ser tratado como `id_contribuinte`.

Quando nenhum contribuinte estiver aberto (navegação fora da ficha), os sete subitens do grupo Contribuinte SHALL ser apresentados inertes: sem link, sem destino de navegação, visualmente distinguidos como indisponíveis e anunciados como desabilitados para tecnologias assistivas. Nenhum subitem do grupo Contribuinte SHALL, em nenhuma situação, apontar para um endereço sem `id_contribuinte`.

Quando nenhum contribuinte estiver aberto, acionar o item pai "Contribuinte" SHALL abrir a busca de contribuinte da barra superior com o foco no campo de busca, exibindo o mesmo conteúdo que seria exibido ao focar o campo diretamente. Havendo contribuinte aberto, acionar o item pai SHALL apenas expandir ou recolher seus subitens, como nos demais grupos.

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
- **THEN** os sete subitens do grupo Contribuinte aparecem inertes, sem link, distinguidos como indisponíveis e anunciados como desabilitados

#### Scenario: Acionar um subitem inerte do Contribuinte

- **WHEN** a pessoa usuária aciona um subitem do grupo Contribuinte estando fora da ficha de um contribuinte
- **THEN** nenhuma navegação ocorre e a tela em exibição permanece a mesma

#### Scenario: Acionar o item Contribuinte sem ficha aberta

- **WHEN** a pessoa usuária aciona o item "Contribuinte" da barra lateral estando fora da ficha de um contribuinte
- **THEN** a busca de contribuinte da barra superior é aberta com o foco no campo de busca, listando os contribuintes recentes da pessoa usuária

#### Scenario: Acionar o item Contribuinte com ficha aberta

- **WHEN** a pessoa usuária aciona o item "Contribuinte" da barra lateral estando na ficha de um contribuinte
- **THEN** os subitens do grupo alternam entre exibidos e ocultos, e a busca da barra superior permanece fechada

#### Scenario: Nome de aba não é confundido com um contribuinte

- **WHEN** o endereço em exibição não corresponde à ficha de um contribuinte, ainda que contenha o nome de uma aba da ficha
- **THEN** os subitens do grupo Contribuinte permanecem inertes, sem tratar o nome da aba como `id_contribuinte`

#### Scenario: Destaque do item correspondente à tela atual

- **WHEN** uma tela do produto é exibida
- **THEN** o item de navegação correspondente àquela tela aparece destacado como ativo, e, quando a tela corresponde a um subitem, o item pai aparece expandido

### Requirement: Telas da Ontologia FtM na busca de funcionalidade

A busca de funcionalidade da barra lateral SHALL incluir as telas Entidades, Propriedades e Tipos de Ação entre as funcionalidades pesquisáveis, cada uma com seu caminho no sistema sob "Ontologia FtM".

#### Scenario: Encontrar uma tela da Ontologia FtM pela busca

- **WHEN** a pessoa usuária digita um texto que corresponde ao nome ou ao caminho de Entidades, Propriedades ou Tipos de Ação no campo "Busca funcionalidade"
- **THEN** a funcionalidade correspondente é listada no dropdown com seu caminho sob "Ontologia FtM", e acioná-la navega para a tela

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

### Requirement: Busca de funcionalidade na barra lateral

A barra lateral SHALL oferecer, no seu rodapé, acima do controle "Recolher menu", um campo de busca de funcionalidades do sistema, rotulado "Busca funcionalidade". A busca SHALL filtrar as funcionalidades pelo texto digitado e, para cada resultado, SHALL exibir o nome da funcionalidade e seu caminho no sistema. Acionar um resultado SHALL navegar para a funcionalidade. O dropdown de resultados SHALL abrir para cima, a partir do campo de busca. Esse campo SHALL ficar oculto quando a barra lateral estiver recolhida.

As abas da ficha do contribuinte NÃO SHALL constar entre as funcionalidades pesquisáveis, por dependerem de um contribuinte escolhido: não há endereço para elas sem `id_contribuinte`. A escolha de contribuinte se dá pela busca de contribuinte da barra superior.

#### Scenario: Abrir a busca ao focar o campo

- **WHEN** a pessoa usuária foca o campo "Busca funcionalidade"
- **THEN** o dropdown de resultados é exibido acima do campo

#### Scenario: Filtrar funcionalidades

- **WHEN** a pessoa usuária digita um texto no campo "Busca funcionalidade"
- **THEN** somente as funcionalidades cujo nome ou caminho correspondem ao texto são listadas no dropdown

#### Scenario: Nenhuma funcionalidade correspondente

- **WHEN** o texto digitado não corresponde a nenhuma funcionalidade
- **THEN** o dropdown informa que nenhuma funcionalidade foi encontrada

#### Scenario: Abas do contribuinte fora da busca de funcionalidade

- **WHEN** a pessoa usuária digita o nome de uma aba da ficha do contribuinte no campo "Busca funcionalidade"
- **THEN** nenhuma aba da ficha do contribuinte é listada no dropdown

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

A barra superior SHALL oferecer um campo de busca de contribuintes, com texto de apoio indicando que a busca aceita CNPJ, CPF, inscrição estadual, razão social ou nome fantasia. Enquanto o campo estiver em foco, um dropdown SHALL ser exibido:

- Sem texto digitado, o dropdown SHALL listar os contribuintes que a própria pessoa usuária abriu mais recentemente, sob o título "Contribuintes recentes". Quando ela ainda não abriu nenhuma ficha, o dropdown SHALL orientar que se digite CNPJ, CPF, inscrição estadual, razão social ou nome fantasia.
- Com texto digitado, o dropdown SHALL listar, sob o título "Resultados", os contribuintes correspondentes ao texto, conforme a consulta de entidade.

Cada item do dropdown SHALL exibir o nome de exibição do contribuinte como título, a linha de identificação "CNPJ · IE" como subtítulo, e um badge com a situação cadastral do contribuinte. Acionar um item SHALL navegar para a ficha do contribuinte correspondente.

A busca SHALL poder ser aberta também a partir do item "Contribuinte" da barra lateral, quando nenhuma ficha estiver aberta. Aberta por essa via, ela SHALL se comportar exatamente como se a pessoa usuária tivesse focado o campo de busca: mesmo conteúdo do dropdown, mesmo foco no campo e mesmas formas de fechamento.

#### Scenario: Abrir a busca sem texto

- **WHEN** a pessoa usuária foca o campo de busca de contribuinte sem ter digitado nada e já abriu fichas de contribuinte antes
- **THEN** o dropdown exibe, sob o título "Contribuintes recentes", as fichas que ela abriu mais recentemente

#### Scenario: Abrir a busca sem texto e sem histórico

- **WHEN** a pessoa usuária foca o campo de busca de contribuinte sem ter digitado nada e ainda não abriu nenhuma ficha
- **THEN** o dropdown orienta que se digite CNPJ, CPF, inscrição estadual, razão social ou nome fantasia

#### Scenario: Abrir a busca pela barra lateral

- **WHEN** a pessoa usuária aciona o item "Contribuinte" da barra lateral estando fora da ficha de um contribuinte
- **THEN** o campo de busca da barra superior recebe o foco e o dropdown é exibido com o mesmo conteúdo que exibiria se o campo tivesse sido focado diretamente

#### Scenario: Filtrar contribuintes por texto

- **WHEN** a pessoa usuária digita um CNPJ, CPF, inscrição estadual, razão social ou nome fantasia no campo de busca
- **THEN** o dropdown passa a listar, sob o título "Resultados", os contribuintes correspondentes ao texto digitado

#### Scenario: Nenhum contribuinte correspondente

- **WHEN** o texto digitado não corresponde a nenhum contribuinte
- **THEN** o dropdown informa que nenhum contribuinte foi encontrado para o texto digitado

#### Scenario: Conteúdo de cada item do dropdown

- **WHEN** o dropdown de busca de contribuinte exibe um resultado
- **THEN** o item mostra o nome de exibição como título, a linha "CNPJ · IE" como subtítulo e um badge com a situação cadastral do contribuinte

#### Scenario: Navegar por um resultado

- **WHEN** a pessoa usuária aciona um item do dropdown de busca de contribuinte
- **THEN** o sistema navega para a ficha do contribuinte correspondente e o dropdown é fechado

#### Scenario: Fechar a busca

- **WHEN** a pessoa usuária pressiona `Esc` ou aciona a área fora do dropdown com ele aberto
- **THEN** o dropdown é fechado

### Requirement: Notificações e identificação do usuário na barra superior

A barra superior SHALL exibir um acesso a notificações e a identificação da pessoa usuária autenticada com iniciais, nome e cargo. O acesso a notificações SHALL sinalizar visualmente a existência de notificações não lidas. As iniciais, o nome e o cargo exibidos SHALL corresponder à pessoa usuária da sessão autenticada, nunca a um valor fixo.

O cargo exibido SHALL ser o cargo comissionado vigente mais recente da pessoa usuária; não havendo cargo comissionado vigente, SHALL ser o cargo efetivo vigente.

O menu do usuário SHALL oferecer três acessos, cada um com ícone: Perfil, Alterar senha e Sair. Perfil e Alterar senha SHALL navegar para as telas correspondentes. Sair SHALL encerrar a sessão da pessoa usuária e levá-la à tela de entrada.

#### Scenario: Sinalização de notificações pendentes

- **WHEN** existem notificações não lidas
- **THEN** o acesso a notificações exibe um indicador visual de pendência

#### Scenario: Identificação da pessoa usuária

- **WHEN** uma tela do produto é exibida
- **THEN** a barra superior mostra as iniciais, o nome e o cargo da pessoa usuária autenticada, obtidos da sessão

#### Scenario: Cargo comissionado tem precedência

- **WHEN** a pessoa usuária autenticada possui cargo comissionado vigente
- **THEN** a barra superior exibe o cargo comissionado vigente mais recente

#### Scenario: Sem cargo comissionado

- **WHEN** a pessoa usuária autenticada não possui cargo comissionado vigente, apenas cargo efetivo vigente
- **THEN** a barra superior exibe o cargo efetivo

#### Scenario: Sem cargo algum

- **WHEN** a pessoa usuária autenticada não possui nenhum cargo vigente
- **THEN** a barra superior exibe nome e iniciais normalmente, sem apresentar cargo

#### Scenario: Abrir o menu do usuário

- **WHEN** a pessoa usuária aciona a área de identificação
- **THEN** o menu do usuário é exibido, com os acessos Perfil, Alterar senha e Sair

#### Scenario: Fechar o menu do usuário

- **WHEN** a pessoa usuária aciona a área de identificação novamente, pressiona `Esc` ou aciona a área fora do menu
- **THEN** o menu do usuário é fechado

#### Scenario: Selecionar Perfil

- **WHEN** a pessoa usuária aciona o item Perfil no menu do usuário
- **THEN** o sistema navega para a tela de perfil e o menu do usuário é fechado

#### Scenario: Selecionar Alterar senha

- **WHEN** a pessoa usuária aciona o item Alterar senha no menu do usuário
- **THEN** o sistema navega para a tela de alteração de senha e o menu do usuário é fechado

#### Scenario: Selecionar Sair

- **WHEN** a pessoa usuária aciona o item Sair no menu do usuário
- **THEN** a sessão é encerrada, o menu do usuário é fechado e a pessoa é levada à tela de entrada

### Requirement: Rodapé institucional

O rodapé SHALL exibir a identificação do produto com aviso de direitos reservados e a versão da aplicação, em português do Brasil.

#### Scenario: Conteúdo do rodapé

- **WHEN** uma tela do produto é exibida
- **THEN** o rodapé mostra "© 2026 Gertor de Alertas · Todos os direitos reservados" à esquerda e a versão da aplicação à direita
