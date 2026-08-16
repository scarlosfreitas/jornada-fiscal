# Modelo de dados: domínio Usuario

## Tabela: Usuario
Tabela de Usuários

| Coluna               | Tipo        | Chave/Restrição                       | Descrição                                                        |
| -------------------- | ----------- | ------------------------------------- | ---------------------------------------------------------------- |
| usr_id               | UUIDv7      | PK                                    | UUIDv7 do usuário                                                |
| usr_username         | string (60) | NOT NULL, UNIQUE                      | Username no modelo nome.ultimoNome                               |
| usr_nome             | string(100) | NOT NULL                              | Nome completo                                                    |
| usr_email            | string(120) | NOT NULL, UNIQUE                      | Email                                                            |
| usr_email_secundario | string(120) |                                       | Email                                                            |
| usr_password         | string      | NOT NULL                              | Hash criptográfico da senha utilizando o algoritmo **Argon2id**. |
| usr_telefone         | string(60)  |                                       | Telefone                                                         |
| usr_image            | string      |                                       | URL ou caminho do avatar do usuário.                             |
| origem_id            | inteiro     | FK(Usuario_Origem.origem_id) NOT NULL | Id  do tipo de origem do cadastro                                |
| criado_por           | UUIDv7      | FK(Usuario.usr_id) NOT NULL           | UUIDv7 do usuario que criou o registro                           |
| atualizado_por       | UUIDv7      | FK(Usuario.usr_id) NOT NULL           | UUIDv7 do usuário que será atualizado a cada modificação         |
| criado_em            | timestamp   | NOT NULL                              | Timestamp da data de criação                                     |
| atualizado_em        | timestamp   | NOT NULL                              | Timestamp com a data de atualização ou criação                   |
| deletado_em          | timestamp   |                                       | Timestamp como flag soft-delete (NULL = registro válido)         |

## Tabela: Situacao
Tabela de Situação

| Coluna         | Tipo       | Chave/Restrição             | Descrição                                                |
| -------------- | ---------- | --------------------------- | -------------------------------------------------------- |
| situacao_id    | inteiro    | PK                          | Id do situação                                           |
| situacao_nome  | string(60) | NOT NULL                    | Nome da situação                                         |
| situacao_desc  | string     | NOT NULL                    | Descrição da situação                                    |
| criado_por     | UUIDv7     | FK(Usuario.usr_id) NOT NULL | UUIDv7 do usuario que criou o registro                   |
| atualizado_por | UUIDv7     | FK(Usuario.usr_id) NOT NULL | UUIDv7 do usuário que será atualizado a cada modificação |
| criado_em      | timestamp  | NOT NULL                    | Timestamp da data de criação                             |
| atualizado_em  | timestamp  | NOT NULL                    | Timestamp com a data de atualização ou criação           |
| deletado_em    | timestamp  |                             | Timestamp como flag soft-delete (NULL = registro válido) |

## Tabela: Usuario_Situacao
Tabela de Situação

| Coluna          | Tipo      | Chave/Restrição                         | Descrição                                                |
| --------------- | --------- | --------------------------------------- | -------------------------------------------------------- |
| usr_id          | UUIDv7    | PK Composta / FK(Usuario.usr_id)        | Id do Usuário                                            |
| situacao_id     | inteiro   | PK Composta / FK (Situacao.situacao_id) | Id da situação do usuário                                |
| vigencia_inicio | timestamp | PK Composta NOT NULL                    | Timestamp de início da vigência do vinculo               |
| vigencia_fim    | timestamp |                                         | Timestamp de fim da vigência do vinculo (Null = vigente) |
| criado_por      | UUIDv7    | FK(Usuario.usr_id) NOT NULL             | UUIDv7 do usuario que criou o registro                   |
| atualizado_por  | UUIDv7    | FK(Usuario.usr_id) NOT NULL             | UUIDv7 do usuário que será atualizado a cada modificação |
| criado_em       | timestamp | NOT NULL                                | Timestamp da data de criação                             |
| atualizado_em   | timestamp | NOT NULL                                | Timestamp com a data de atualização ou criação           |
| deletado_em     | timestamp |                                         | Timestamp como flag soft-delete (NULL = registro válido) |

## Tabela: Usuario_Origem
Tabela de Origem do Usuário

| Coluna         | Tipo       | Chave/Restrição             | Descrição                                                |
| -------------- | ---------- | --------------------------- | -------------------------------------------------------- |
| origem_id      | inteiro    | PK                          | Id do tipo de origem do codastro                         |
| origem_nome    | string(60) | NOT NULL                    | Nome da origem do cadastro                               |
| criado_por     | UUIDv7     | FK(Usuario.usr_id) NOT NULL | UUIDv7 do usuario que criou o registro                   |
| atualizado_por | UUIDv7     | FK(Usuario.usr_id) NOT NULL | UUIDv7 do usuário que será atualizado a cada modificação |
| criado_em      | timestamp  | NOT NULL                    | Timestamp da data de criação                             |
| atualizado_em  | timestamp  | NOT NULL                    | Timestamp com a data de atualização ou criação           |
| deletado_em    | timestamp  |                             | Timestamp como flag soft-delete (NULL = registro válido) |
 
## Tabela: Sistema
Tabela de Sistemas e API

| Coluna         | Tipo       | Chave/Restrição             | Descrição                                                |
| -------------- | ---------- | --------------------------- | -------------------------------------------------------- |
| sistema_id     | inteiro    | PK                          | Id do sistema                                            |
| sistema_nome   | string(60) | NOT NULL                    | Nome do Sistema                                          |
| sistema_desc   | String     | NOT NULL                    | Descrição do Sistema                                     |
| criado_por     | UUIDv7     | FK(Usuario.usr_id) NOT NULL | UUIDv7 do usuario que criou o registro                   |
| atualizado_por | UUIDv7     | FK(Usuario.usr_id) NOT NULL | UUIDv7 do usuário que será atualizado a cada modificação |
| criado_em      | timestamp  | NOT NULL                    | Timestamp da data de criação                             |
| atualizado_em  | timestamp  | NOT NULL                    | Timestamp com a data de atualização ou criação           |
| deletado_em    | timestamp  |                             | Timestamp como flag soft-delete (NULL = registro válido) |

## Tabela: Usuario_id_externo
Tabela de ID de outros sistemas vinculados ao usuário

| Coluna         | Tipo      | Chave/Restrição                  | Descrição                                                |
| -------------- | --------- | -------------------------------- | -------------------------------------------------------- |
| usr_id         | UUIDv7    | PK Composta / FK(Usuario.usr_id) | Id do Usuário                                            |
| usr_id_externo | string    | PK Composta                      | Id do Usuário no sistema externo                         |
| sistema_id     | inteiro   | PK Composta                      | Id do Sistema externo                                    |
| criado_por     | UUIDv7    | FK(Usuario.usr_id) NOT NULL      | UUIDv7 do usuario que criou o registro                   |
| atualizado_por | UUIDv7    | FK(Usuario.usr_id) NOT NULL      | UUIDv7 do usuário que será atualizado a cada modificação |
| criado_em      | timestamp | NOT NULL                         | Timestamp da data de criação                             |
| atualizado_em  | timestamp | NOT NULL                         | Timestamp com a data de atualização ou criação           |
| deletado_em    | timestamp |                                  | Timestamp como flag soft-delete (NULL = registro válido) |

## Tabela: Cargo
Tabela de Cargos

| Coluna         | Tipo       | Chave/Restrição             | Descrição                                                |
| -------------- | ---------- | --------------------------- | -------------------------------------------------------- |
| cargo_id       | inteiro    | PK                          | Id do cargo                                              |
| cargo_nome     | string(60) | NOT NULL                    | Nome do cargo                                            |
| cargo_efetivo  | bolean     | NOT NULL                    | O cargo é efetivo (ou em comissão/temporário)            |
| criado_por     | UUIDv7     | FK(Usuario.usr_id) NOT NULL | UUIDv7 do usuario que criou o registro                   |
| atualizado_por | UUIDv7     | FK(Usuario.usr_id) NOT NULL | UUIDv7 do usuário que será atualizado a cada modificação |
| criado_em      | timestamp  | NOT NULL                    | Timestamp da data de criação                             |
| atualizado_em  | timestamp  | NOT NULL                    | Timestamp com a data de atualização ou criação           |
| deletado_em    | timestamp  |                             | Timestamp como flag soft-delete (NULL = registro válido) |

## Tabela: Usuario_Cargo
Tabela de Cargos do Usuario

| Coluna          | Tipo      | Chave/Restrição                           | Descrição                                                |
| --------------- | --------- | ----------------------------------------- | -------------------------------------------------------- |
| usr_id          | UUIDv7    | PK Composta / FK(Usuario.usr_id) NOT NULL | UUIDv7 do usuario                                        |
| cargo_id        | inteiro   | PK Composta / FK(Cargo.cargo_id) NOT NULL | Id do cargo       |
| vigencia_inicio | timestamp | PK Composta NOT NULL                      | Timestamp de início da vigência do vinculo               |
| vigencia_fim    | timestamp |                                           | Timestamp de fim da vigência do vinculo (Null = vigente) |
| criado_por      | UUIDv7    | FK(Usuario.usr_id) NOT NULL               | UUIDv7 do usuario que criou o registro                   |
| atualizado_por  | UUIDv7    | FK(Usuario.usr_id) NOT NULL               | UUIDv7 do usuário que será atualizado a cada modificação |
| criado_em       | timestamp | NOT NULL                                  | Timestamp da data de criação                             |
| atualizado_em   | timestamp | NOT NULL                                  | Timestamp com a data de atualização ou criação           |
| deletado_em     | timestamp |                                           | Timestamp como flag soft-delete (NULL = registro válido) |

## Tabela: Setor
Tabela de Setores de Locatação/Unidade

| Coluna         | Tipo       | Chave/Restrição             | Descrição                                                |
| -------------- | ---------- | --------------------------- | -------------------------------------------------------- |
| setor_id       | inteiro    | PK                          | Id do setor                                              |
| setor_pai      | inteiro    | FK(Setor.setor_id)          | Id do setor pai                                          |
| setor_sigla    | string(12) | NOT NULL                    | Sigla do setor                                           |
| setor_nome     | string(60) | NOT NULL                    | Nome do setor                                            |
| criado_por     | UUIDv7     | FK(Usuario.usr_id) NOT NULL | UUIDv7 do usuario que criou o registro                   |
| atualizado_por | UUIDv7     | FK(Usuario.usr_id) NOT NULL | UUIDv7 do usuário que será atualizado a cada modificação |
| criado_em      | timestamp  | NOT NULL                    | Timestamp da data de criação                             |
| atualizado_em  | timestamp  | NOT NULL                    | Timestamp com a data de atualização ou criação           |
| deletado_em    | timestamp  |                             | Timestamp como flag soft-delete (NULL = registro válido) |

## Tabela: Usuario_Lotacao
Tabela de Lotações do Usuário

| Coluna          | Tipo      | Chave/Restrição                           | Descrição                                                |
| --------------- | --------- | ----------------------------------------- | -------------------------------------------------------- |
| usr_id          | UUIDv7    | PK Composta / FK(Usuario.usr_id) NOT NULL | UUIDv7 do usuario                                        |
| setor_id        | inteiro   | PK Composta / FK(Setor.setor_id) NOT NULL | Id do setor                                              |
| vigencia_inicio | timestamp | PK Composta NOT NULL                      | Timestamp de início da vigência do vinculo               |
| vigencia_fim    | timestamp |                                           | Timestamp de fim da vigência do vinculo (Null = vigente) |
| criado_por      | UUIDv7    | FK(Usuario.usr_id) NOT NULL               | UUIDv7 do usuario que criou o registro                   |
| atualizado_por  | UUIDv7    | FK(Usuario.usr_id) NOT NULL               | UUIDv7 do usuário que será atualizado a cada modificação |
| criado_em       | timestamp | NOT NULL                                  | Timestamp da data de criação                             |
| atualizado_em   | timestamp | NOT NULL                                  | Timestamp com a data de atualização ou criação           |
| deletado_em     | timestamp |                                           | Timestamp como flag soft-delete (NULL = registro válido) |

## Tabela: Perfil
Tabela de Perfil

| Coluna         | Tipo       | Chave/Restrição             | Descrição                                                |
| -------------- | ---------- | --------------------------- | -------------------------------------------------------- |
| perfil_id      | inteiro    | PK                          | Id do Perfil                                             |
| perfil_nome    | string(60) | NOT NULL                    | Nome do Perfil                                           |
| perfil_desc    | string     | NOT NULL                    | Descrição do Perfil                                      |
| criado_por     | UUIDv7     | FK(Usuario.usr_id) NOT NULL | UUIDv7 do usuario que criou o registro                   |
| atualizado_por | UUIDv7     | FK(Usuario.usr_id) NOT NULL | UUIDv7 do usuário que será atualizado a cada modificação |
| criado_em      | timestamp  | NOT NULL                    | Timestamp da data de criação                             |
| atualizado_em  | timestamp  | NOT NULL                    | Timestamp com a data de atualização ou criação           |
| deletado_em    | timestamp  |                             | Timestamp como flag soft-delete (NULL = registro válido) |

## Tabela: Funcionalidade
Tabela de Funcionalidades

| Coluna            | Tipo       | Chave/Restrição                               | Descrição                                                |
| ----------------- | ---------- | --------------------------------------------- | -------------------------------------------------------- |
| func_id           | inteiro    | PK                                            | Id da funcionalidade                                     |
| func_nome         | string(60) | NOT NULL                                      | Nome da funcionalidade                                   |
| func_desc         | string     | NOT NULL                                      | Descrição da funcionalidade                              |
| func_categoria_id | inteiro    | FK(Func_Categoria.func_categoria_id) NOT NULL | Id da categoria de funcionalidade                        |
| criado_por        | UUIDv7     | FK(Usuario.usr_id) NOT NULL                   | UUIDv7 do usuario que criou o registro                   |
| atualizado_por    | UUIDv7     | FK(Usuario.usr_id) NOT NULL                   | UUIDv7 do usuário que será atualizado a cada modificação |
| criado_em         | timestamp  | NOT NULL                                      | Timestamp da data de criação                             |
| atualizado_em     | timestamp  | NOT NULL                                      | Timestamp com a data de atualização ou criação           |
| deletado_em       | timestamp  |                                               | Timestamp como flag soft-delete (NULL = registro válido) |

## Tabela: Func_Categoria
Tabela de Categorias de Funcionalidades

| Coluna              | Tipo       | Chave/Restrição             | Descrição                                                |
| ------------------- | ---------- | --------------------------- | -------------------------------------------------------- |
| func_categoria_id   | inteiro    | PK                          | Id da categoria de funcionalidade                        |
| func_categoria_nome | string(60) | NOT NULL                    | Nome da categoria de funcionalidade                      |
| func_categoria_desc | string     | NOT NULL                    | Descrição da categoria de funcionalidade                 |
| criado_por          | UUIDv7     | FK(Usuario.usr_id) NOT NULL | UUIDv7 do usuario que criou o registro                   |
| atualizado_por      | UUIDv7     | FK(Usuario.usr_id) NOT NULL | UUIDv7 do usuário que será atualizado a cada modificação |
| criado_em           | timestamp  | NOT NULL                    | Timestamp da data de criação                             |
| atualizado_em       | timestamp  | NOT NULL                    | Timestamp com a data de atualização ou criação           |
| deletado_em         | timestamp  |                             | Timestamp como flag soft-delete (NULL = registro válido) |

## Tabela: Perfil_Funcionalidade
Tabela de Funcionalidades do Perfil

| Coluna          | Tipo      | Chave/Restrição                                   | Descrição                                                |
| --------------- | --------- | ------------------------------------------------- | -------------------------------------------------------- |
| perfil_id       | inteiro   | PK Composta / FK(Perfil.perfil_id) NOT NULL       | Id do Perfil                                             |
| func_id         | inteiro   | PK Composta / FK(Funcionalidade.func_id) NOT NULL | Id da funcionalidade                                     |
| vigencia_inicio | timestamp | PK Composta NOT NULL                              | Timestamp de início da vigência do vinculo               |
| vigencia_fim    | timestamp |                                                   | Timestamp de fim da vigência do vinculo (Null = vigente) |
| criado_por      | UUIDv7    | FK(Usuario.usr_id) NOT NULL                       | UUIDv7 do usuario que criou o registro                   |
| atualizado_por  | UUIDv7    | FK(Usuario.usr_id) NOT NULL                       | UUIDv7 do usuário que será atualizado a cada modificação |
| criado_em       | timestamp | NOT NULL                                          | Timestamp da data de criação                             |
| atualizado_em   | timestamp | NOT NULL                                          | Timestamp com a data de atualização ou criação           |
| deletado_em     | timestamp |                                                   | Timestamp como flag soft-delete (NULL = registro válido) |

## Tabela: Usuario_Perfil
Tabela de Perfis do Usuário

| Coluna          | Tipo      | Chave/Restrição                             | Descrição                                                |
| --------------- | --------- | ------------------------------------------- | -------------------------------------------------------- |
| usr_id          | UUIDv7    | PK Composta / FK(Usuario.usr_id) NOT NULL   | UUIDv7 do usuario                                        |
| perfil_id       | inteiro   | PK Composta / FK(Perfil.perfil_id) NOT NULL | Id do Perfil                                             |
| vigencia_inicio | timestamp | PK Composta NOT NULL                        | Timestamp de início da vigência do vinculo               |
| vigencia_fim    | timestamp |                                             | Timestamp de fim da vigência do vinculo (Null = vigente) |
| criado_por      | UUIDv7    | FK(Usuario.usr_id) NOT NULL                 | UUIDv7 do usuario que criou o registro                   |
| atualizado_por  | UUIDv7    | FK(Usuario.usr_id) NOT NULL                 | UUIDv7 do usuário que será atualizado a cada modificação |
| criado_em       | timestamp | NOT NULL                                    | Timestamp da data de criação                             |
| atualizado_em   | timestamp | NOT NULL                                    | Timestamp com a data de atualização ou criação           |
| deletado_em     | timestamp |                                             | Timestamp como flag soft-delete (NULL = registro válido) |