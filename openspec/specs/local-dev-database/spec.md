# local-dev-database Specification

## Purpose
Define o banco PostgreSQL do ambiente de desenvolvimento local do Gertor de Alertas: como é provisionado junto do devcontainer, onde ficam suas credenciais, como a aplicação o alcança e o que se preserva entre reinicializações.

## Requirements

### Requirement: Banco provisionado com o ambiente de desenvolvimento

O ambiente de desenvolvimento SHALL provisionar uma instância PostgreSQL junto com o container da aplicação, sem passo manual adicional. O container da aplicação SHALL iniciar somente após o banco estar pronto para aceitar conexões.

#### Scenario: Primeira subida do ambiente

- **WHEN** a pessoa desenvolvedora sobe o ambiente de desenvolvimento pela primeira vez
- **THEN** um serviço PostgreSQL é criado e inicializado com o banco, o usuário e a senha configurados, sem nenhum comando manual além de subir o ambiente

#### Scenario: Ordem de inicialização

- **WHEN** o ambiente é iniciado
- **THEN** o container da aplicação só é considerado iniciado depois que o PostgreSQL responde a uma verificação de saúde

#### Scenario: Banco indisponível

- **WHEN** o PostgreSQL falha ao iniciar
- **THEN** o container da aplicação não é iniciado e a falha do banco fica visível nos logs do ambiente

### Requirement: Alcançabilidade do banco

A aplicação SHALL alcançar o banco pelo nome do serviço na rede interna do ambiente, e não por `localhost`. O banco SHALL também ser alcançável a partir da máquina hospedeira, em uma porta configurável, para uso de ferramentas externas de administração.

#### Scenario: Conexão a partir da aplicação

- **WHEN** a aplicação abre uma conexão usando a URL configurada
- **THEN** a conexão é estabelecida com o serviço PostgreSQL do ambiente

#### Scenario: Conexão a partir da máquina hospedeira

- **WHEN** a pessoa desenvolvedora conecta um cliente PostgreSQL da máquina hospedeira à porta publicada
- **THEN** a conexão é estabelecida com o mesmo banco usado pela aplicação

#### Scenario: Porta já ocupada na máquina hospedeira

- **WHEN** a porta padrão já está em uso na máquina hospedeira
- **THEN** a porta publicada pode ser alterada por configuração, sem editar o arquivo de composição

### Requirement: Credenciais em fonte única

As credenciais do banco SHALL residir no arquivo de ambiente da raiz do projeto e SHALL ser a mesma fonte usada tanto para inicializar o serviço PostgreSQL quanto para compor a URL de conexão da aplicação. As credenciais reais SHALL permanecer fora do controle de versão.

#### Scenario: Alteração de credencial

- **WHEN** a pessoa desenvolvedora altera usuário, senha ou nome do banco no arquivo de ambiente da raiz e recria o ambiente
- **THEN** tanto o serviço PostgreSQL quanto a conexão da aplicação passam a usar os novos valores, sem edição em nenhum outro arquivo

#### Scenario: Credenciais não versionadas

- **WHEN** o repositório é inspecionado
- **THEN** o arquivo de ambiente com as credenciais reais não está versionado

#### Scenario: Modelo de configuração disponível

- **WHEN** uma pessoa desenvolvedora clona o repositório
- **THEN** existe um arquivo de exemplo versionado listando todas as variáveis de ambiente necessárias, com valores de exemplo e sem segredos reais

### Requirement: Persistência dos dados

Os dados do banco SHALL sobreviver à parada, à reinicialização e à recriação dos containers do ambiente. A remoção dos dados SHALL exigir um ato explícito de descarte do volume.

#### Scenario: Reinicialização do ambiente

- **WHEN** a pessoa desenvolvedora para e sobe novamente o ambiente
- **THEN** os dados gravados anteriormente continuam disponíveis

#### Scenario: Recriação do container de desenvolvimento

- **WHEN** o container de desenvolvimento é reconstruído
- **THEN** os dados do banco permanecem intactos

#### Scenario: Descarte deliberado dos dados

- **WHEN** a pessoa desenvolvedora remove explicitamente o volume de dados do banco
- **THEN** a próxima subida do ambiente inicializa um banco vazio com as credenciais configuradas
