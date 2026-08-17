## Purpose

Apresenta o Gertor de Alertas a visitantes sem sessão na raiz do domínio, comunicando a proposta de valor do produto e oferecendo o caminho para entrar na aplicação.

## ADDED Requirements

### Requirement: Página institucional pública na raiz do domínio

O sistema SHALL servir uma página institucional pública na raiz do domínio, acessível sem sessão e sem exigir autenticação. Essa página SHALL usar o design system do produto (`gestor-alertas.css`) e SHALL não renderizar a sidebar, a topbar nem o rodapé da aplicação autenticada.

#### Scenario: Acesso público à raiz

- **WHEN** uma pessoa sem sessão acessa a raiz do domínio
- **THEN** a página institucional é exibida, sem exigir credenciais

#### Scenario: Sem moldura da aplicação

- **WHEN** a página institucional é exibida
- **THEN** a sidebar, a topbar e o rodapé da aplicação autenticada não aparecem

### Requirement: Conteúdo institucional da landing

A página institucional SHALL apresentar, no mínimo: uma seção de destaque (hero) com a proposta de valor do produto e uma chamada para entrar na aplicação; uma seção descrevendo as regras de aviso (indicação, alerta, intervenção); uma seção ilustrando a timeline do contribuinte; uma seção descrevendo a plataforma de dados subjacente; uma seção sobre operações conjuntas de vistoria; e um rodapé institucional.

#### Scenario: Seções presentes

- **WHEN** a página institucional é carregada
- **THEN** as seções de destaque, regras de aviso, timeline do contribuinte, plataforma de dados, operações conjuntas e rodapé estão presentes

### Requirement: Chamada para entrar na aplicação

A página institucional SHALL oferecer ao menos uma chamada para ação que leve à tela de entrada da aplicação.

#### Scenario: Acionar a chamada para entrar

- **WHEN** uma pessoa sem sessão aciona a chamada para entrar na landing
- **THEN** é levada à tela de entrada da aplicação

### Requirement: Pessoa já autenticada na landing

O sistema SHALL permitir que uma pessoa já autenticada acesse a página institucional pública sem ser forçada a sair da sessão.

#### Scenario: Acesso com sessão ativa

- **WHEN** uma pessoa já autenticada acessa a raiz do domínio
- **THEN** a página institucional é exibida normalmente, sem exigir novo login
