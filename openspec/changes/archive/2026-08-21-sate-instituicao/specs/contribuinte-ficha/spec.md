## MODIFIED Requirements

### Requirement: Identidade do contribuinte compartilhada entre as abas

A ficha SHALL exibir, acima da navegação por abas e visível em todas elas, uma barra de identidade do contribuinte contendo as iniciais da razão social, a razão social, uma linha com CNPJ, inscrição estadual e grupo econômico, e os indicadores de destaque do contribuinte (situação cadastral, alertas em aberto e regime).

A identidade exibida SHALL corresponder ao contribuinte da ficha aberta e SHALL permanecer inalterada ao trocar de aba.

Os dados da barra de identidade SHALL ser obtidos da view `analytics.sate_instituicao`, filtrada por `id_contribuinte` igual ao `[id]` do segmento de rota. Os campos exibidos SHALL ser:

| Campo exibido | Coluna de origem (`sate_instituicao`) |
| --- | --- |
| Razão Social | `razao_social` |
| Nome Fantasia | `nome_fantasia` |
| CPF / CNPJ | `cpf_cnpj` |
| Inscrição Estadual | `inscricao_estadual` |

As iniciais, o grupo econômico e os badges de destaque SHALL continuar sendo exibidos conforme a especificação vigente; esta mudança afeta apenas a origem dos quatro campos acima.

Quando a view `analytics.sate_instituicao` não estiver disponível no ambiente (tabela inexistente), o sistema SHALL degradar graciosamente, exibindo uma mensagem de indisponibilidade em vez de falhar com erro não tratado.

#### Scenario: Abertura da ficha

- **WHEN** a pessoa usuária abre a ficha de um contribuinte
- **THEN** a barra de identidade mostra as iniciais, a razão social, a linha "CNPJ · IE · grupo econômico" e os indicadores de destaque do contribuinte, com os dados obtidos de `analytics.sate_instituicao`

#### Scenario: Identidade preservada ao trocar de aba

- **WHEN** a pessoa usuária troca de aba dentro da ficha
- **THEN** a barra de identidade permanece exibida, com o mesmo conteúdo

#### Scenario: View analítica indisponível

- **WHEN** a view `analytics.sate_instituicao` não existe no ambiente
- **THEN** o sistema exibe uma mensagem informando que os dados do contribuinte não estão disponíveis, sem erro não tratado

### Requirement: Aba Situação cadastral

A aba Situação cadastral SHALL apresentar os dados da situação cadastral atual do contribuinte, obtidos da view `analytics.sate_instituicao` filtrada por `id_contribuinte` igual ao `[id]` do segmento de rota.

Os campos exibidos SHALL ser:

| Campo exibido | Coluna de origem (`sate_instituicao`) |
| --- | --- |
| Tipo | `tipo` |
| Situação Cadastral | `situacao_cadastral` |
| Data da Situação Cadastral | `dt_situacao_cadastral` |
| Motivo da Situação Cadastral | `motivo_situacao_cadastral` |
| Indicador de Atividade | `ind_atividade` |

Cada campo SHALL ser apresentado com rótulo e valor. Campos com vigência conhecida SHALL indicar há quanto tempo o valor atual vigora. Campos que possuem histórico SHALL oferecer acesso a ele; ao ser acionado, o histórico daquele campo SHALL ser apresentado com os valores anteriores, cada um com a data e o motivo da alteração, sem sair da aba.

#### Scenario: Apresentação dos campos cadastrais

- **WHEN** a pessoa usuária abre a aba Situação cadastral
- **THEN** os campos tipo, situação cadastral, data da situação cadastral, motivo da situação cadastral e indicador de atividade são apresentados com rótulo e valor, obtidos de `analytics.sate_instituicao`

#### Scenario: Contribuinte não encontrado

- **WHEN** o `id_contribuinte` informado não possui registro em `analytics.sate_instituicao`
- **THEN** a aba exibe a mensagem "Contribuinte não encontrado"

#### Scenario: Consultar o histórico de um campo

- **WHEN** a pessoa usuária aciona o histórico de um campo que o possui
- **THEN** os valores anteriores daquele campo são apresentados, cada um com data e motivo da alteração

#### Scenario: Fechar o histórico de um campo

- **WHEN** a pessoa usuária fecha o histórico de um campo
- **THEN** a relação de campos volta a ser exibida, na mesma aba

#### Scenario: Campo sem histórico

- **WHEN** um campo não possui histórico
- **THEN** o campo é apresentado sem acesso a histórico
