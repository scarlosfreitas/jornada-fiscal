## 1. Persistência dos contribuintes recentes

- [x] 1.1 Adicionar o model `ContribuinteAcesso` (tabela `contribuinte_acesso`) ao `prisma/schema.prisma`: PK composta `(usuarioId, cadId)` mapeada para `(usr_id, cad_id)`, `acessadoEm` → `acessado_em timestamptz`, bloco de auditoria (`criado_por`, `atualizado_por`, `criado_em`, `atualizado_em`, `deletado_em`) e FKs de auditoria para `Usuario` com `onDelete/onUpdate: NoAction`, seguindo as convenções já usadas no arquivo.
- [x] 1.2 Declarar o índice `@@index([usuarioId, acessadoEm(sort: Desc)])` e as back-relations correspondentes em `Usuario`.
- [x] 1.3 Gerar e aplicar a migração (`npx prisma migrate dev --name contribuinte_acesso`) e conferir que o SQL gerado só cria a tabela nova, sem tocar nas existentes.

## 2. Módulo de consulta de entidade

- [x] 2.1 Criar `lib/consulta-entidade.ts` com `import "server-only"`, expondo o tipo de resultado (reaproveitando o formato `ContribuinteResult` consumido pela `Topbar`) e as funções de consulta com texto e de leitura dos recentes.
- [x] 2.2 Implementar a normalização do texto digitado: minúsculas, remoção de acentos, extração de `digitos` (só dígitos) e divisão em termos com descarte dos que têm menos de 3 caracteres.
- [x] 2.3 Implementar a consulta com texto em `prisma.$queryRaw` parametrizado sobre `analytics.consulta_entidade`, com as três faixas do design: documento exato (`cnpj`/`cpf`/`ie`), prefixo de `search_index` e `LIKE '%termo%'` combinados por `AND`, ordenando por faixa, depois por `similarity(search_index, <texto>)` e por `cad_id` como desempate estável, com `LIMIT 10`.
- [x] 2.4 Aplicar o teto de 500 candidatos no subselect da faixa "contém", garantindo que as faixas de documento exato e prefixo não passem por esse teto.
- [x] 2.5 Implementar a montagem do resultado: `cad_id` convertido para `string`; nome de exibição pela cascata `razao_social → nome → nome_fantasia`; linha "CNPJ · IE" com máscaras aplicadas, CPF no lugar do CNPJ quando o CNPJ falta e omissão de ausentes sem separador solto; badge fixo `Ativo`/`success` com comentário explicando que a origem passará a trazer a situação; `href` para `/app/contribuintes/<cad_id>`.
- [x] 2.6 Implementar a leitura dos recentes: até 5 registros de `contribuinte_acesso` do usuário da sessão, ordenados por `acessado_em` decrescente, resolvidos contra `analytics.consulta_entidade` e devolvidos no mesmo formato de resultado; `cad_id` sem entidade correspondente é omitido.
- [x] 2.7 Tratar a ausência da relação `analytics.consulta_entidade` como "sem resultados", registrando o motivo no log do servidor sem derrubar a barra superior; garantir que nenhum log inclua documento ou razão social.

## 3. Server actions e registro de acesso

- [x] 3.1 Reapontar `buscarContribuintes` em `app/app/actions.ts` para o novo módulo, mantendo a exigência de sessão (`auth()`) e o retorno de lista vazia sem sessão, e devolvendo os recentes do usuário quando o texto está vazio.
- [x] 3.2 Criar a função de registro de acesso (upsert em `contribuinte_acesso` por `(usr_id, cad_id)` atualizando `acessado_em`) e chamá-la em `app/app/contribuintes/[id]/layout.tsx`, engolindo falhas com log para que a ficha seja apresentada mesmo assim.
- [x] 3.3 Resolver os recentes iniciais no servidor onde a `Topbar` é montada, substituindo a lista vinda de `lib/mock/contribuintes.ts`.

## 4. Barra superior

- [x] 4.1 Atualizar o placeholder do campo de busca em `components/layout/Topbar.tsx` para indicar CNPJ, CPF, inscrição estadual, razão social e nome fantasia.
- [x] 4.2 Ajustar os títulos do dropdown ("Contribuintes recentes" sem texto, "Resultados" com texto) e o estado vazio: orientação para digitar quando não há recentes, e a mensagem de nenhum contribuinte encontrado quando a consulta com texto não retorna nada.
- [x] 4.3 Conferir que o debounce e o descarte de resposta fora de ordem continuam valendo e que o texto com menos de 3 caracteres úteis mantém os recentes no dropdown em vez de disparar consulta.
- [x] 4.4 Confirmar que acionar um resultado navega para `/app/contribuintes/<cad_id>`, abre a aba inicial e fecha o dropdown.

## 5. Limpeza e verificação

- [x] 5.1 Remover de `lib/mock/contribuintes.ts` o que deixou de ser usado pela barra superior, preservando o que ainda alimenta outras telas.
- [x] 5.2 Rodar `npm run lint` e `npm run build` sem erros.
- [x] 5.3 Verificar manualmente os cenários do spec: CNPJ com e sem máscara, CPF, IE, razão social sem acento, dois termos em ordem inversa, fragmento no meio da razão social, texto sem correspondência, dropdown sem texto com e sem histórico, reabertura de ficha não duplicando o recente.
- [x] 5.4 Medir o tempo de resposta de uma consulta com termo genérico (ex. "ltda") e confirmar que fica dentro do orçamento previsto no design (~200 ms).
