## MODIFIED Requirements

### Requirement: Busca de contribuinte na barra superior

A barra superior SHALL oferecer um campo de busca de contribuintes, com texto de apoio indicando que a busca aceita CNPJ, CPF, inscrição estadual, razão social ou nome fantasia. Enquanto o campo estiver em foco, um dropdown SHALL ser exibido:

- Sem texto digitado, o dropdown SHALL listar os contribuintes que a própria pessoa usuária abriu mais recentemente, sob o título "Contribuintes recentes". Quando ela ainda não abriu nenhuma ficha, o dropdown SHALL orientar que se digite CNPJ, CPF, inscrição estadual, razão social ou nome fantasia.
- Com texto digitado, o dropdown SHALL listar, sob o título "Resultados", os contribuintes correspondentes ao texto, conforme a consulta de entidade.

Cada item do dropdown SHALL exibir o nome de exibição do contribuinte como título, a linha de identificação "CNPJ · IE" como subtítulo, e um badge com a situação cadastral do contribuinte. Acionar um item SHALL navegar para a ficha do contribuinte correspondente.

#### Scenario: Abrir a busca sem texto

- **WHEN** a pessoa usuária foca o campo de busca de contribuinte sem ter digitado nada e já abriu fichas de contribuinte antes
- **THEN** o dropdown exibe, sob o título "Contribuintes recentes", as fichas que ela abriu mais recentemente

#### Scenario: Abrir a busca sem texto e sem histórico

- **WHEN** a pessoa usuária foca o campo de busca de contribuinte sem ter digitado nada e ainda não abriu nenhuma ficha
- **THEN** o dropdown orienta que se digite CNPJ, CPF, inscrição estadual, razão social ou nome fantasia

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
