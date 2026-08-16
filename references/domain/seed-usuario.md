# Seed: domínio Usuario

**Suspensão de restrições durante o seed:**
- As tabelas Usuario e Usuario_Origem devem ter as restrições NOT NULL suspensas durante o seed.
- Inicie a importação pela tabela Usuario
- Ao concluir o seed, reativar as restrições.
  
Ao inserir os seeds nas tabelas, os campos a seguir devem ser utilizados:

| criado_por                           | atualizado_por                       | criado_em                            | atualizado_em   | deletado_em     |
| ------------------------------------ | ------------------------------------ | ------------------------------------ | --------------- | --------------- |
| 019c0b11-a400-7000-8000-000000000000 | 019c0b11-a400-7000-8000-000000000000 | timestamp atual | timestamp atual | Null |


## Tabela: Usuario
Tabela de Usuários

| usr_id                               | usr_username      | usr_nome                         | usr_email                         | usr_email_secundario         | usr_password                                                                                       | usr_telefone | usr_image | origem_id |
| ------------------------------------ | ----------------- | -------------------------------- | --------------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------- | ------------ | --------- | --------- |
| 019c0b11-a400-7000-8000-000000000000 | admin             | Administrador                    | scarlosfreitas@gmail.com          | scarlosfreitas@gmail.com     | $argon2id$v=19$m=65536,t=3,p=4$Hb0e9EC2CGOcaEGyuSYizg$leMiKxtSaRVQt20Adqc+3qqFlEL4qRklUhusiF6kouA | 96981411414  |           | 1         |
| 019c0b11-a400-7000-8000-000000000001 | usuario           | Usuário Comum                    | usuario@email.com                 | scarlosfreitas@gmail.com     | $argon2id$v=19$m=65536,t=3,p=4$Hb0e9EC2CGOcaEGyuSYizg$leMiKxtSaRVQt20Adqc+3qqFlEL4qRklUhusiF6kouA |              |           | 1         |
| 019c0b11-a400-7000-8000-000000000002 | auditor           | Auditor                          | auditor@email.com                 | scarlosfreitas@gmail.com     | $argon2id$v=19$m=65536,t=3,p=4$Hb0e9EC2CGOcaEGyuSYizg$leMiKxtSaRVQt20Adqc+3qqFlEL4qRklUhusiF6kouA |              |           | 1         |
| 019c0b11-a400-7000-8000-000000000003 | gerente           | Gerente                          | gerente@email.com                 | scarlosfreitas@gmail.com     | $argon2id$v=19$m=65536,t=3,p=4$Hb0e9EC2CGOcaEGyuSYizg$leMiKxtSaRVQt20Adqc+3qqFlEL4qRklUhusiF6kouA |              |           | 1         |
| 019c0b11-a400-7000-8000-000000000011 | carlos.silva      | Carlos Vinicius de Freitas Silva | carlos.silva@sefaz.ap.gov.br      | scarlosfreitas@gmail.com     | $argon2id$v=19$m=65536,t=3,p=4$Hb0e9EC2CGOcaEGyuSYizg$leMiKxtSaRVQt20Adqc+3qqFlEL4qRklUhusiF6kouA | 96981411414  |           | 1         |
| 019c0b11-a400-7000-8000-000000000012 | carlos.filgueiras | Carlos Marcelo Filgueiras        | carlos.filgueiras@sefaz.ap.gov.br |                              | $argon2id$v=19$m=65536,t=3,p=4$Hb0e9EC2CGOcaEGyuSYizg$leMiKxtSaRVQt20Adqc+3qqFlEL4qRklUhusiF6kouA |              |           | 1         |
| 019c0b11-a400-7000-8000-000000000013 | jean.brito        | Jean Carlos Brito                | jean.brito@sefaz.ap.gov.br        |                              | $argon2id$v=19$m=65536,t=3,p=4$Hb0e9EC2CGOcaEGyuSYizg$leMiKxtSaRVQt20Adqc+3qqFlEL4qRklUhusiF6kouA |              |           | 1         |
| 019c0b11-a400-7000-8000-000000000014 | andrei.martins    | Andrei Martins                   | andrei.martins@sefaz.ap.gov.br    |                              | $argon2id$v=19$m=65536,t=3,p=4$Hb0e9EC2CGOcaEGyuSYizg$leMiKxtSaRVQt20Adqc+3qqFlEL4qRklUhusiF6kouA |              |           | 1         |
| 019c0b11-a400-7000-8000-000000000015 | beatriz.cruz      | Beatriz Cruz                    | beatriz.cruz@sefaz.ap.gov.br     |                              | $argon2id$v=19$m=65536,t=3,p=4$Hb0e9EC2CGOcaEGyuSYizg$leMiKxtSaRVQt20Adqc+3qqFlEL4qRklUhusiF6kouA |              |           | 1         |

## Tabela: Situacao
Tabela de Situação

| situacao_id | situacao_nome | situacao_desc |
| ----------- | ------------- | ------------- |
| 10          | Criado        | Criado        |
| 20          | Bloqueado     | Bloqueado     |
| 30          | Ativo         | Ativo         |
| 40          | Encerrado     | Encerrado     |

## Tabela: Usuario_Situacao
Tabela de Origem do Cadastro do Usuário


| usr_id                               | situacao_id | vigencia_inicio | vigencia_fim |
| ------------------------------------ | ----------- | --------------- | ------------ |
| 019c0b11-a400-7000-8000-000000000000 | 10          | 1/7/2026        | 2/7/2026     |
| 019c0b11-a400-7000-8000-000000000001 | 10          | 1/7/2026        | 2/7/2026     |
| 019c0b11-a400-7000-8000-000000000002 | 10          | 1/7/2026        | 2/7/2026     |
| 019c0b11-a400-7000-8000-000000000003 | 10          | 1/7/2026        | 2/7/2026     |
| 019c0b11-a400-7000-8000-000000000011 | 10          | 1/7/2026        | 2/7/2026     |
| 019c0b11-a400-7000-8000-000000000012 | 10          | 1/7/2026        | 2/7/2026     |
| 019c0b11-a400-7000-8000-000000000013 | 10          | 1/7/2026        | 2/7/2026     |
| 019c0b11-a400-7000-8000-000000000014 | 10          | 1/7/2026        | 2/7/2026     |
| 019c0b11-a400-7000-8000-000000000015 | 10          | 1/7/2026        | 2/7/2026     |
| 019c0b11-a400-7000-8000-000000000000 | 30          | 2/7/2026        |              |
| 019c0b11-a400-7000-8000-000000000001 | 30          | 2/7/2026        |              |
| 019c0b11-a400-7000-8000-000000000002 | 30          | 2/7/2026        |              |
| 019c0b11-a400-7000-8000-000000000003 | 30          | 2/7/2026        |              |
| 019c0b11-a400-7000-8000-000000000011 | 30          | 2/7/2026        |              |
| 019c0b11-a400-7000-8000-000000000012 | 30          | 2/7/2026        |              |
| 019c0b11-a400-7000-8000-000000000013 | 30          | 2/7/2026        |              |
| 019c0b11-a400-7000-8000-000000000014 | 30          | 2/7/2026        |              |
| 019c0b11-a400-7000-8000-000000000015 | 30          | 2/7/2026        |              |

## Usuario_Origem
Tabela de Origem do Cadastro do Usuário

| origem_id | origem_nome         |
| --------- | ------------------- |
| 1         | Seed do sistema     |
| 2         | Cadastro no sistema |
| 3         | Inserção do AD      |

## Tabela: Sistema
Tabela de Sistemas e API

| sistema_id | sistema_nome   | sistema_desc                                        |
| ---------- | -------------- | --------------------------------------------------- |
| 1          | Jornada Fiscal | Jornada Fiscal e acompanhamento de regras de alerta |
| 2          | SATE           | Sistema corporativo da Secretaria de Receita        |
| 3          | AD             | Active Directory local                              |
| 4          | Matheus        | Sistema de Gestão de transito Matheus               |

## Tabela: Cargo
Tabela de Cargos

| cargo_id | cargo_nome                           | cargo_efetivo |
| -------- | ------------------------------------ | ------------- |
| 0        | Administrador do Sistema             | True          |
| 1        | Auditor da Receita                   | True          |
| 2        | Fiscal da Receita                    | True          |
| 3        | Secretário da Fazenda                | False         |
| 4        | Subsecretário da Receita             | False         |
| 11       | Coordenador da COFIS                 | False         |
| 12       | Coordenador da COARE                 | False         |
| 13       | Coordenador da COTRI                 | False         |
| 14       | Coordenador da COTEC                 | False         |
| 21       | Gerente do CEPAF                     | False         |
| 22       | Gerente do NUFES                     | False         |
| 23       | Gerente do NUSEG                     | False         |
| 51       | Presidente da Junta de Fulgamento    | False         |
| 52       | Representante da Junta de Fulgamento | False         |
| 61       | Presidente do Concelho Fiscal        | False         |
| 62       | Membro do Concelho Fiscal            | False         |
| 101      | Responsável pela Unidade X           | False         |

## Tabela: Usuario_Cargo
Tabela de Cargos do Usuario

| usr_id                               | cargo_id | vigencia_inicio | vigencia_fim |
| ------------------------------------ | -------- | --------------- | ------------ |
| 019c0b11-a400-7000-8000-000000000000 | 0        | 1/7/2026        |              |
| 019c0b11-a400-7000-8000-000000000001 | 1        | 1/7/2026        |              |
| 019c0b11-a400-7000-8000-000000000002 | 1        | 1/7/2026        |              |
| 019c0b11-a400-7000-8000-000000000003 | 21       | 1/7/2026        |              |
| 019c0b11-a400-7000-8000-000000000011 | 1        | 1/7/2026        |              |
| 019c0b11-a400-7000-8000-000000000012 | 1        | 1/7/2026        |              |
| 019c0b11-a400-7000-8000-000000000013 | 1        | 1/7/2026        |              |
| 019c0b11-a400-7000-8000-000000000014 | 1        | 1/7/2026        |              |
| 019c0b11-a400-7000-8000-000000000015 | 1        | 1/7/2026        |              |

## Tabela: Setor
Tabela de Setores de Locatação/Unidade

| setor_id | setor_pai | setor_sigla | setor_nome                          |
| -------- | --------- | ----------- | ----------------------------------- |
| 1        |           | SEFAZ       | Secretaria de Estado da Receita     |
| 2        | 1         | RECEITA     | Subsecretaria da Receita            |
| 3        | 2         | COFIS       | Coordenadoria de Fiscalização       |
| 4        | 2         | COARE       | Coordenadoria de Arrecadação        |
| 5        | 2         | COTRI       | Coordenadoria de Tributação         |
| 6        | 1         | COTEC       | Cooredenadoria de Tecnologia        |
| 21       | 1         | CEPAF       | Centro de Pesquisa e Análise Fiscal |
| 22       | 2         | NUFES       | Núcleo de Estabelecimento           |
| 23       | 2         | NUSEG       | Núcleo de Macro Segmentos           |

## Tabela: Usuario_Lotacao
Tabela de Lotações do Usuário

| usr_id                               | setor_id | vigencia_inicio | vigencia_fim |
| ------------------------------------ | -------- | --------------- | ------------ |
| 019c0b11-a400-7000-8000-000000000000 | 1        | 1/7/2026        |              |
| 019c0b11-a400-7000-8000-000000000001 | 1        | 1/7/2026        |              |
| 019c0b11-a400-7000-8000-000000000002 | 1        | 1/7/2026        |              |
| 019c0b11-a400-7000-8000-000000000003 | 1        | 1/7/2026        |              |
| 019c0b11-a400-7000-8000-000000000011 | 1        | 1/7/2026        |              |
| 019c0b11-a400-7000-8000-000000000012 | 1        | 1/7/2026        |              |
| 019c0b11-a400-7000-8000-000000000013 | 1        | 1/7/2026        |              |
| 019c0b11-a400-7000-8000-000000000014 | 1        | 1/7/2026        |              |
| 019c0b11-a400-7000-8000-000000000015 | 1        | 1/7/2026        |              |

## Tabela: Perfil
Tabela de Perfil

| perfil_id | perfil_nome   | perfil_desc                                                              |
| --------- | ------------- | ------------------------------------------------------------------------ |
| 1         | Administrador | Administrador do Sistema                                                 |
| 2         | Usuário       | Perfil padrão, todo usuário do AD que realizar ou tentar realizar login. |
| 3         | Cadastrador   | Pode atribuir ou retirar perfil de outros usuários.                      |
| 4         | Validador     | Valida o cadastro do usuário                                             |
| 5         | Bloqueador    | Pode bloquear o cadastrado dos usuários                                  |
| 11        | Gerente CEPAF | Perfil Operacional do Gerente do CEPAF                                   |
| 101       | Auditor       | Perfil Operacional para Auditor                                          |
| 102       | Fiscal        | Perfil Operacional para Fiscal                                           |


## Tabela: Func_Categoria
Tabela de Categorias de Funcionalidades

| func_categoria_id | func_categoria_nome     | func_categoria_desc                         |
| ----------------- | ----------------------- | ------------------------------------------- |
| 1                 | Cadastral               | Cadastro dos usuarios                       |
| 2                 | Alertas                 | Gestão de alertas                           |
| 3                 | Ordem de Serviço        | Ordem de serviços                           |
| 4                 | Monitoramento           | Monitoramento de alvos                      |
| 5                 | Jornada do Contribuinte | Vizualização de informações do Contribuinte |
| 6                 | Operação no SATE        | Operador do SATE                            |


## Tabela: Funcionalidade
Tabela de Funcionalidades

| func_id | func_nome                           | func_desc | func_categoria_id |
| ------- | ----------------------------------- | --------- | ----------------- |
| 101     | Cadastrar usuário                   |           | 1                 |
| 102     | Cadastrar cargo                     |           | 1                 |
| 103     | Cadastrar setores                   |           | 1                 |
| 104     | Cadastrar perfis                    |           | 1                 |
| 105     | Cadastrar funcionalidade            |           | 1                 |
| 106     | Validar cadastro                    |           | 1                 |
| 107     | Bloquear cadastro                   |           | 1                 |
| 108     | Desbloquear cadastro                |           | 1                 |
| 201     | Criar regra de alerta               |           | 2                 |
| 202     | Ativar regra de alerta              |           | 2                 |
| 203     | Suspender regra de alerta           |           | 2                 |
| 204     | Deletar regra de alerta             |           | 2                 |
| 301     | Criar Ordem de Serviço              |           | 3                 |
| 302     | Delegar Ordem de Serviço            |           | 3                 |
| 303     | Suspender de Ordem de Serviço       |           | 3                 |
| 304     | Deletar Ordem de Serviço            |           | 3                 |
| 401     | Criar monitoramento                 |           | 4                 |
| 402     | Ativar monitoramento                |           | 4                 |
| 403     | Suspender monitoramento             |           | 4                 |
| 404     | Encerrar monitoramento              |           | 4                 |
| 501     | Vizualizar cadastro de usuario      |           | 5                 |
| 502     | Vizualizar cadastro de contribuinte |           | 5                 |
| 503     | Vizualizar recolhimentos            |           | 5                 |
| 504     | Vizualizar entrega das declarações  |           | 5                 |
| 505     | Vizualizar timeline                 |           | 5                 |
| 506     | Vizualizar declarações              |           | 5                 |
| 601     | Consultar MPF                       |           | 6                 |
| 602     | Emitir TIF                          |           | 6                 |
| 603     | Preencher Notificação               |           | 6                 |
| 604     | Emitir auto de AI de Embaraço       |           | 6                 |
| 605     | Emitir auto de AI Principal         |           | 6                 |

## Tabela: Perfil_Funcionalidade
Tabela de Funcionalidades do Perfil

| perfil_id | func_id | vigencia_inicio |
| --------- | ------- | --------------- |
| 3         | 101     | 1/7/2026        |
| 3         | 102     | 1/7/2026        |
| 3         | 103     | 1/7/2026        |
| 3         | 104     | 1/7/2026        |
| 3         | 105     | 1/7/2026        |
| 4         | 106     | 1/7/2026        |
| 5         | 107     | 1/7/2026        |
| 4         | 108     | 1/7/2026        |
| 101       | 201     | 1/7/2026        |
| 101       | 202     | 1/7/2026        |
| 101       | 203     | 1/7/2026        |
| 101       | 204     | 1/7/2026        |
| 101       | 301     | 1/7/2026        |
| 101       | 302     | 1/7/2026        |
| 101       | 303     | 1/7/2026        |
| 101       | 304     | 1/7/2026        |
| 101       | 401     | 1/7/2026        |
| 101       | 402     | 1/7/2026        |
| 101       | 403     | 1/7/2026        |
| 101       | 404     | 1/7/2026        |
| 101       | 501     | 1/7/2026        |
| 101       | 502     | 1/7/2026        |
| 101       | 503     | 1/7/2026        |
| 101       | 504     | 1/7/2026        |
| 101       | 505     | 1/7/2026        |
| 101       | 506     | 1/7/2026        |
| 101       | 601     | 1/7/2026        |
| 101       | 602     | 1/7/2026        |
| 101       | 603     | 1/7/2026        |
| 101       | 604     | 1/7/2026        |

## Tabela: Usuario_Perfil
Tabela de Perfis do Usuário

| usr_id                               | perfil_id | vigencia_inicio | vigencia_fim |
| ------------------------------------ | --------- | --------------- | ------------ |
| 019c0b11-a400-7000-8000-000000000000 | 1         | 1/7/2026        |              |
| 019c0b11-a400-7000-8000-000000000003 | 11        | 1/7/2026        |              |
| 019c0b11-a400-7000-8000-000000000002 | 101       | 1/7/2026        |              |