## Purpose

Define a consulta de entidades da base fiscal: como um texto livre digitado pela pessoa auditora — fragmento de CNPJ, CPF, inscrição estadual, nome, razão social ou nome fantasia — é interpretado, comparado contra a base de entidades e devolvido como uma lista curta e ordenada de contribuintes, e como o sistema lembra as fichas abertas recentemente por cada pessoa usuária.

## Requirements

### Requirement: Fonte da consulta de entidade

A consulta de entidade SHALL ser resolvida sobre a base analítica de entidades (`analytics.consulta_entidade`), que reúne, por entidade, o identificador do cadastro, CNPJ, CPF, inscrição estadual, nome, razão social e nome fantasia.

A consulta SHALL comparar o texto digitado contra a representação normalizada da entidade — a concatenação daqueles seis campos, sem acentuação e em caixa baixa — de modo que o mesmo texto encontre a entidade independentemente de qual desses campos o contenha.

A consulta SHALL ser executada no servidor. Em nenhuma circunstância a base de entidades SHALL ser transmitida ao navegador; apenas os resultados da consulta corrente trafegam.

#### Scenario: Texto que corresponde a um campo qualquer

- **WHEN** a pessoa usuária digita um texto que corresponde ao CNPJ, ao CPF, à inscrição estadual, ao nome, à razão social ou ao nome fantasia de uma entidade
- **THEN** essa entidade aparece entre os resultados

#### Scenario: Texto que não corresponde a nenhuma entidade

- **WHEN** o texto digitado não corresponde a nenhuma entidade da base
- **THEN** a consulta devolve uma lista vazia de resultados

### Requirement: Interpretação do texto digitado

A consulta SHALL interpretar o texto digitado de forma tolerante, no modelo de uma busca textual livre:

- Diferenças de acentuação SHALL ser ignoradas.
- Diferenças de caixa (maiúsculas/minúsculas) SHALL ser ignoradas.
- Pontuação usual de documentos (pontos, barras, hífens) SHALL ser ignorada, de modo que um CNPJ, CPF ou IE digitado com ou sem máscara encontre a mesma entidade.
- O texto SHALL ser dividido em termos separados por espaço; uma entidade SHALL ser considerada correspondente somente quando **todos** os termos casarem com ela.
- Cada termo SHALL casar por correspondência parcial em qualquer posição, e não apenas no início do valor.
- Termos com menos de 3 caracteres SHALL ser descartados, por não serem cobertos pelo índice textual; se, após o descarte, nenhum termo restar, a consulta SHALL se comportar como consulta sem texto — exceto quando o texto digitado, desconsiderada a pontuação, for um documento (CNPJ, CPF ou IE) idêntico ao de alguma entidade, caso em que essa entidade SHALL ser devolvida.

#### Scenario: Documento digitado com máscara

- **WHEN** a pessoa usuária digita `05.985.502/0001-32` e a base guarda esse CNPJ como `05985502000132`
- **THEN** a entidade correspondente aparece entre os resultados

#### Scenario: Texto sem acentuação

- **WHEN** a pessoa usuária digita `metalurgica` e a razão social da entidade é `METALÚRGICA ANDRADE S/A`
- **THEN** a entidade aparece entre os resultados

#### Scenario: Vários termos combinados

- **WHEN** a pessoa usuária digita dois termos, e uma entidade contém apenas o primeiro deles
- **THEN** essa entidade não aparece entre os resultados

#### Scenario: Termos em qualquer ordem

- **WHEN** a pessoa usuária digita dois termos presentes na entidade em ordem inversa à que aparecem nos campos dela
- **THEN** a entidade aparece entre os resultados

#### Scenario: Fragmento no meio do valor

- **WHEN** a pessoa usuária digita um fragmento que aparece no meio da razão social de uma entidade
- **THEN** a entidade aparece entre os resultados

#### Scenario: Texto composto apenas de ruído

- **WHEN** o texto digitado, após descartar termos com menos de 3 caracteres, não contém nenhum termo
- **THEN** a consulta se comporta como consulta sem texto

### Requirement: Ordenação e limite dos resultados

A consulta SHALL devolver no máximo 10 resultados, ordenados por relevância decrescente em relação ao texto digitado.

A ordenação SHALL colocar antes as entidades cuja correspondência é mais forte, nesta prioridade:

1. Entidades cujo CNPJ, CPF ou inscrição estadual é exatamente o texto digitado (desconsiderada a pontuação).
2. Entidades cuja representação normalizada começa pelo texto digitado.
3. Demais entidades correspondentes, ordenadas por semelhança textual entre o texto digitado e a representação normalizada da entidade.

Empates SHALL ser desfeitos de forma estável, de modo que a mesma consulta devolva sempre a mesma lista na mesma ordem.

A avaliação de semelhança textual do item 3 MAY ser feita sobre um subconjunto limitado das entidades correspondentes, para preservar o tempo de resposta em textos muito genéricos. As correspondências dos itens 1 e 2 SHALL NOT ser afetadas por esse limite: uma entidade cujo documento é exatamente o texto digitado SHALL sempre aparecer, ainda que o texto seja genérico.

#### Scenario: Documento exato tem prioridade

- **WHEN** a pessoa usuária digita um CNPJ completo que é o documento de uma entidade e também aparece como fragmento em outras
- **THEN** a entidade cujo CNPJ é exatamente o texto digitado aparece em primeiro lugar

#### Scenario: Limite de resultados

- **WHEN** o texto digitado corresponde a mais de 10 entidades
- **THEN** a consulta devolve apenas as 10 mais relevantes

#### Scenario: Ordem estável

- **WHEN** a mesma consulta é executada duas vezes sem que a base tenha mudado
- **THEN** os resultados vêm na mesma ordem nas duas execuções

### Requirement: Conteúdo de cada resultado

Cada resultado da consulta SHALL carregar:

- O identificador da entidade, usado para endereçar a ficha do contribuinte.
- Um nome de exibição: a razão social da entidade; quando ausente, o nome; quando ambos ausentes, o nome fantasia.
- Uma linha de identificação formatada como "CNPJ · IE", com o CNPJ e a inscrição estadual apresentados com a máscara usual. Quando a entidade não tem CNPJ, o CPF SHALL ocupar seu lugar, com a máscara de CPF. Identificadores ausentes SHALL ser omitidos da linha, sem deixar separador solto.
- Uma indicação de situação cadastral. Enquanto a base analítica não expuser a situação cadastral da entidade, essa indicação SHALL ser sempre "Ativo".
- O endereço da ficha do contribuinte correspondente.

#### Scenario: Entidade com CNPJ e IE

- **WHEN** um resultado corresponde a uma entidade com CNPJ e inscrição estadual
- **THEN** o resultado traz a razão social como nome de exibição e a linha "CNPJ · IE" com ambos formatados

#### Scenario: Entidade sem inscrição estadual

- **WHEN** um resultado corresponde a uma entidade sem inscrição estadual
- **THEN** a linha de identificação traz somente o CNPJ, sem separador sobrando

#### Scenario: Entidade identificada por CPF

- **WHEN** um resultado corresponde a uma entidade sem CNPJ e com CPF
- **THEN** a linha de identificação traz o CPF com a máscara de CPF no lugar do CNPJ

#### Scenario: Situação cadastral enquanto a origem não a expõe

- **WHEN** um resultado é apresentado e a base analítica não traz situação cadastral
- **THEN** a indicação de situação do resultado é "Ativo"

### Requirement: Resultado leva à ficha do contribuinte

Cada resultado da consulta SHALL endereçar a ficha do contribuinte correspondente pelo identificador da entidade na base analítica, e o endereço SHALL abrir a ficha na sua aba inicial.

#### Scenario: Abrir a ficha a partir de um resultado

- **WHEN** a pessoa usuária aciona um resultado da consulta
- **THEN** o sistema apresenta a ficha do contribuinte daquela entidade, na aba inicial

### Requirement: Acesso restrito à consulta

A consulta de entidade SHALL exigir sessão autenticada. Uma requisição de consulta sem sessão válida SHALL devolver lista vazia, sem revelar qualquer dado da base.

#### Scenario: Consulta sem sessão

- **WHEN** uma requisição de consulta de entidade chega sem sessão autenticada
- **THEN** a resposta é uma lista vazia e nenhum dado de entidade é devolvido

### Requirement: Registro de contribuintes recentes por usuário

O sistema SHALL registrar, para cada pessoa usuária, a abertura da ficha de um contribuinte, guardando a entidade aberta e o momento da abertura.

Reabrir a ficha de um contribuinte já registrado SHALL atualizar o momento da última abertura em vez de criar um novo registro, de modo que a mesma entidade nunca apareça duas vezes entre os recentes.

O registro SHALL ser por pessoa usuária: os recentes de uma pessoa não SHALL ser visíveis a outra.

Falha ao registrar o acesso SHALL NOT impedir a apresentação da ficha.

#### Scenario: Primeira abertura de uma ficha

- **WHEN** a pessoa usuária abre a ficha de um contribuinte que ainda não estava entre seus recentes
- **THEN** o sistema registra aquele contribuinte como recente dela, com o momento da abertura

#### Scenario: Reabertura de uma ficha

- **WHEN** a pessoa usuária abre novamente a ficha de um contribuinte já registrado entre seus recentes
- **THEN** o registro existente passa a marcar o novo momento de abertura, e o contribuinte continua aparecendo uma única vez entre os recentes

#### Scenario: Recentes são privados

- **WHEN** duas pessoas usuárias diferentes abrem fichas distintas
- **THEN** cada uma vê apenas os contribuintes que ela própria abriu

#### Scenario: Falha ao registrar o acesso

- **WHEN** o registro do acesso não pode ser gravado
- **THEN** a ficha do contribuinte é apresentada normalmente

### Requirement: Consulta sem texto devolve os recentes

Uma consulta de entidade sem texto SHALL devolver os contribuintes abertos mais recentemente pela pessoa usuária da sessão, do mais recente para o mais antigo, no máximo 5, no mesmo formato de resultado da consulta com texto.

Quando a pessoa usuária ainda não abriu nenhuma ficha, a consulta sem texto SHALL devolver lista vazia.

#### Scenario: Pessoa usuária com fichas abertas

- **WHEN** a consulta de entidade é executada sem texto e a pessoa usuária já abriu fichas de contribuinte
- **THEN** a consulta devolve até 5 contribuintes abertos por ela, do mais recente para o mais antigo

#### Scenario: Pessoa usuária sem histórico

- **WHEN** a consulta de entidade é executada sem texto e a pessoa usuária ainda não abriu nenhuma ficha
- **THEN** a consulta devolve lista vazia

### Requirement: Resposta em tempo real

A consulta de entidade SHALL responder em tempo compatível com digitação contínua, apoiada no índice textual da base analítica: a consulta SHALL usar exclusivamente a representação normalizada indexada como critério de correspondência, sem varredura sequencial da base.

Consultas disparadas em sequência enquanto a pessoa digita SHALL ser tratadas de modo que apenas o resultado da consulta mais recente seja apresentado; respostas de consultas anteriores que cheguem fora de ordem SHALL ser descartadas.

#### Scenario: Digitação contínua

- **WHEN** a pessoa usuária digita continuamente no campo de busca
- **THEN** a lista apresentada corresponde sempre ao texto mais recente digitado

#### Scenario: Resposta fora de ordem

- **WHEN** a resposta de uma consulta anterior chega depois da resposta da consulta mais recente
- **THEN** a resposta anterior é descartada e a lista permanece correspondendo ao texto mais recente
