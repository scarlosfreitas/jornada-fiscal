## Purpose

Define a estrutura de URLs do Gertor de Alertas: o que é servido na raiz do domínio, o que vive sob o prefixo da aplicação, e a exigência de que as rotas tenham uma fonte única no código.

## ADDED Requirements

### Requirement: Separação entre raiz pública e prefixo da aplicação

A raiz do domínio SHALL servir a área pública do produto. Todas as telas da aplicação SHALL viver sob o prefixo `/app`. O painel operacional SHALL ser o índice desse prefixo, respondendo em `/app`.

#### Scenario: Painel operacional no índice da aplicação

- **WHEN** uma pessoa autenticada acessa `/app`
- **THEN** o painel operacional é exibido

#### Scenario: Telas da aplicação sob o prefixo

- **WHEN** uma pessoa autenticada acessa uma tela da aplicação
- **THEN** a URL dessa tela começa com `/app`

#### Scenario: Rota anterior do painel

- **WHEN** alguém acessa `/dashboard`
- **THEN** a rota não existe

#### Scenario: Área pública sem a moldura da aplicação

- **WHEN** a raiz do domínio é exibida
- **THEN** a barra lateral, a barra superior e o rodapé da aplicação não são renderizados

### Requirement: Fonte única para as rotas

As rotas do produto SHALL ser declaradas em um único módulo e referenciadas a partir dele. Nenhum componente SHALL conter caminho de rota escrito diretamente.

#### Scenario: Referência a uma rota

- **WHEN** um componente precisa apontar para outra tela
- **THEN** obtém o caminho do módulo de rotas, sem escrevê-lo diretamente

#### Scenario: Alteração de um caminho

- **WHEN** o caminho de uma tela muda
- **THEN** a alteração em um único ponto do módulo de rotas basta para que todos os apontamentos passem a refletir o novo caminho

#### Scenario: Coerência entre navegação e conteúdo

- **WHEN** uma tela é referenciada tanto pela navegação lateral quanto por um atalho dentro do conteúdo
- **THEN** ambos levam exatamente ao mesmo caminho

### Requirement: Destaque de navegação coerente com o índice

O item de navegação correspondente à tela atual SHALL ser destacado como ativo, e somente ele. O fato de o painel operacional ocupar o índice do prefixo da aplicação SHALL não fazer com que ele apareça ativo nas demais telas.

#### Scenario: Painel ativo apenas no painel

- **WHEN** uma pessoa autenticada está em uma tela da aplicação que não é o painel
- **THEN** o item "Painel" não aparece destacado como ativo

#### Scenario: Item ativo na tela correspondente

- **WHEN** uma pessoa autenticada está em uma tela da aplicação
- **THEN** o item de navegação daquela tela aparece destacado como ativo
