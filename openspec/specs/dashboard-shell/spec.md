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

A barra lateral SHALL apresentar a marca do produto e a navegação principal do sistema. A navegação SHALL conter os itens Painel, Regras, Monitoramento, Contribuintes, Ordens de serviço, Relatórios e Configurações, cada um com ícone e rótulo. Itens com subitens SHALL exibir um indicador de expansão; itens com contagem pendente SHALL exibir essa contagem ao lado do rótulo.

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

A barra lateral SHALL oferecer um controle "Recolher menu" no seu rodapé. Quando recolhida, a barra SHALL reduzir sua largura e ocultar rótulos, contagens, indicadores de expansão, textos da marca e grupos de subitens, preservando os ícones.

#### Scenario: Recolher a barra lateral

- **WHEN** a pessoa usuária aciona o controle "Recolher menu" com a barra expandida
- **THEN** a barra lateral reduz para a largura recolhida e passa a exibir apenas os ícones dos itens de navegação

#### Scenario: Expandir a barra lateral

- **WHEN** a pessoa usuária aciona o controle "Recolher menu" com a barra recolhida
- **THEN** a barra lateral retorna à largura expandida e volta a exibir rótulos, contagens e a marca

#### Scenario: Estado de recolhimento ao mudar de tela

- **WHEN** a pessoa usuária recolhe a barra lateral e em seguida navega para outra tela do produto
- **THEN** a barra lateral permanece recolhida

### Requirement: Busca de funcionalidade na barra superior

A barra superior SHALL oferecer um campo de busca de funcionalidades do sistema, com o atalho de teclado indicado visualmente. A busca SHALL filtrar as funcionalidades pelo texto digitado e, para cada resultado, SHALL exibir o nome da funcionalidade, seu caminho no sistema e o módulo a que pertence. Acionar um resultado SHALL navegar para a funcionalidade.

#### Scenario: Abrir a busca pelo atalho de teclado

- **WHEN** a pessoa usuária pressiona o atalho indicado no campo de busca
- **THEN** o campo de busca recebe foco e a lista de resultados é exibida

#### Scenario: Filtrar funcionalidades

- **WHEN** a pessoa usuária digita um texto no campo de busca
- **THEN** somente as funcionalidades cujo nome ou caminho correspondem ao texto são listadas

#### Scenario: Nenhuma funcionalidade correspondente

- **WHEN** o texto digitado não corresponde a nenhuma funcionalidade
- **THEN** a lista informa que nenhuma funcionalidade foi encontrada

#### Scenario: Navegar por um resultado

- **WHEN** a pessoa usuária aciona um resultado da busca
- **THEN** o sistema navega para a funcionalidade correspondente e a lista de resultados é fechada

#### Scenario: Fechar a busca

- **WHEN** a pessoa usuária pressiona `Esc` ou aciona a área fora da lista com a lista aberta
- **THEN** a lista de resultados é fechada

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
