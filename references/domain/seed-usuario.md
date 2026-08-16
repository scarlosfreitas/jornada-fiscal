# Seed: domínio Usuario

**Suspensão de restrições durante o seed:**
- As tabelas Usuario e Usuario_Origem devem ter as restrições NOT NULL suspensas durante o seed.
- Ao concluir o seed, reativar as restrições.
  
Ao inserir os seeds nas tabelas, os campos a seguir devem ser utilizados:

| criado_por                           | atualizado_por                       | criado_em                            | atualizado_em   | deletado_em     |
| ------------------------------------ | ------------------------------------ | ------------------------------------ | --------------- | --------------- |
| 019c0b11-a400-7000-8000-000000000000 | 019c0b11-a400-7000-8000-000000000000 | 019c0b11-a400-7000-8000-000000000000 | timestamp atual | timestamp atual |


## Tabela: Usuario
Tabela de Usuários

| usr_id                               | usr_username      | usr_nome                         | usr_email                         | usr_email_secundario         | us_password                                                                                       | usr_telefone | usr_image | origem_id |
| ------------------------------------ | ----------------- | -------------------------------- | --------------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------- | ------------ | --------- | --------- |
| 019c0b11-a400-7000-8000-000000000000 | admin             | Administrador                    | scarlosfreitas@gmail.com          | scarlosfreitas@gmail.com     | $argon2id$v=19$m=65536,t=3,p=4$Hb0e9EC2CGOcaEGyuSYizg$leMiKxtSaRVQt20Adqc+3qqFlEL4qRklUhusiF6kouA | 96981411414  |           | 1         |
| 019c0b11-a400-7000-8000-000000000001 | usuario           | Usuário Comum                    | usuario@email.com                 | scarlosfreitas@gmail.com     | $argon2id$v=19$m=65536,t=3,p=4$Hb0e9EC2CGOcaEGyuSYizg$leMiKxtSaRVQt20Adqc+3qqFlEL4qRklUhusiF6kouA |              |           |           |
| 019c0b11-a400-7000-8000-000000000002 | auditor           | Auditor                          | auditor@email.com                 | scarlosfreitas@gmail.com     | $argon2id$v=19$m=65536,t=3,p=4$Hb0e9EC2CGOcaEGyuSYizg$leMiKxtSaRVQt20Adqc+3qqFlEL4qRklUhusiF6kouA |              |           |           |
| 019c0b11-a400-7000-8000-000000000003 | gerente           | Gerente                          | gerente@email.com                 | scarlosfreitas@gmail.com     | $argon2id$v=19$m=65536,t=3,p=4$Hb0e9EC2CGOcaEGyuSYizg$leMiKxtSaRVQt20Adqc+3qqFlEL4qRklUhusiF6kouA |              |           |           |
| 019c0b11-a400-7000-8000-000000000011 | carlos.silva      | Carlos Vinicius de Freitas Silva | carlos.silva@sefaz.ap.gov.br      | scarlosfreitas@gmail.com     | $argon2id$v=19$m=65536,t=3,p=4$Hb0e9EC2CGOcaEGyuSYizg$leMiKxtSaRVQt20Adqc+3qqFlEL4qRklUhusiF6kouA | 96981411414  |           | 1         |
| 019c0b11-a400-7000-8000-000000000012 | carlos.filgueiras | Carlos Marcelo Filgueiras        | carlos.filgueiras@sefaz.ap.gov.br |                              | $argon2id$v=19$m=65536,t=3,p=4$Hb0e9EC2CGOcaEGyuSYizg$leMiKxtSaRVQt20Adqc+3qqFlEL4qRklUhusiF6kouA |              |           | 1         |
| 019c0b11-a400-7000-8000-000000000013 | jean.brito        | Jean Carlos Brito                | jean.brito@sefaz.ap.gov.br        |                              | $argon2id$v=19$m=65536,t=3,p=4$Hb0e9EC2CGOcaEGyuSYizg$leMiKxtSaRVQt20Adqc+3qqFlEL4qRklUhusiF6kouA |              |           | 1         |
| 019c0b11-a400-7000-8000-000000000014 | andrei.martins    | Andrei Martins                   | andrei.martins@sefaz.ap.gov.br    |                              | $argon2id$v=19$m=65536,t=3,p=4$Hb0e9EC2CGOcaEGyuSYizg$leMiKxtSaRVQt20Adqc+3qqFlEL4qRklUhusiF6kouA |              |           | 1         |
| 019c0b11-a400-7000-8000-000000000015 | beatriz.cruz      | Beatriz Souza                    | beatriz.souza@sefaz.ap.gov.br     |                              | $argon2id$v=19$m=65536,t=3,p=4$Hb0e9EC2CGOcaEGyuSYizg$leMiKxtSaRVQt20Adqc+3qqFlEL4qRklUhusiF6kouA |              |           | 1         |

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

## Tabela: Funcionalidade
Tabela de Funcionalidades

| funcionalidade_id | funcionalidade_nome                 | funcionalidade_desc |
| ----------------- | ----------------------------------- | ------------------- |
| 1                 | Cadastrar usuário                   |                     |
| 2                 | Cadastrar cargo                     |                     |
| 3                 | Cadastrar setores                   |                     |
| 4                 | Cadastrar perfis                    |                     |
| 5                 | Cadastrar funcionalidade            |                     |
| 6                 | Validar cadastro                    |                     |
| 7                 | Bloquear cadastro                   |                     |
| 8                 | Desbloquear cadastro                |                     |
| 101               | Criar regra de alerta               |                     |
| 102               | Iniciar regra de alerta             |                     |
| 103               | Deletar regra de alerta             |                     |
| 104               | Criar monitoramento                 |                     |
| 105               | Iniciar monitoramento               |                     |
| 106               | Encerrar monitoramento              |                     |
| 201               | Vizualizar cadastro de usuario      |                     |
| 202               | Vizualizar cadastro de contribuinte |                     |
| 203               | Vizualizar recolhimentos            |                     |
| 204               | Vizualizar declarações              |                     |
| 205               | Vizualizar timeline                 |                     |
| 206               | Vizualizar declarações              |                     |

## Tabela: Perfil_Funcionalidade
Tabela de Funcionalidades do Perfil

| perfil_id | funcionalidade_id | vigencia_inicio |
| --------- | ----------------- | --------------- |
| 3         | 1                 | 1/7/2026        |
| 3         | 2                 | 1/7/2026        |
| 3         | 3                 | 1/7/2026        |
| 3         | 4                 | 1/7/2026        |
| 3         | 5                 | 1/7/2026        |
| 4         | 6                 | 1/7/2026        |
| 5         | 7                 | 1/7/2026        |
| 4         | 8                 | 1/7/2026        |
| 101       | 101               | 1/7/2026        |
| 101       | 102               | 1/7/2026        |
| 101       | 103               | 1/7/2026        |
| 101       | 104               | 1/7/2026        |
| 101       | 105               | 1/7/2026        |
| 101       | 106               | 1/7/2026        |
| 101       | 201               | 1/7/2026        |
| 101       | 202               | 1/7/2026        |
| 101       | 203               | 1/7/2026        |
| 101       | 204               | 1/7/2026        |
| 101       | 205               | 1/7/2026        |
| 101       | 206               | 1/7/2026        |

## Tabela: Usuario_Perfil
Tabela de Perfis do Usuário

| usr_id                               | perfil_id | vigencia_inicio | vigencia_fim |
| ------------------------------------ | --------- | --------------- | ------------ |
| 019c0b11-a400-7000-8000-000000000000 | 1         | 1/7/2026        |              |
| 019c0b11-a400-7000-8000-000000000003 | 11        | 1/7/2026        |              |
| 019c0b11-a400-7000-8000-000000000002 | 101       | 1/7/2026        |              |