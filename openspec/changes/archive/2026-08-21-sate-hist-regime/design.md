## Context

Ver proposal.md — Why para a motivação. O que importa para o desenho:

**Origem dos dados.** `analytics.sate_hist_regime` é uma view do banco analítico, verificada neste ambiente: 403.719 linhas, 82.774 `cad_id` distintos, até 607 linhas para um mesmo contribuinte. Colunas relevantes:

```
cad_id            bigint      cad_situacao_id   bigint
cad_cnpj          text        cad_situacao_nome varchar
cad_cpf           text        cad_estab_id      text
cad_hist_ini      text        cad_estab_nome    text
cad_hist_fim      text        cad_razao_social  text
cad_reg_est_id    bigint      cad_nat_jur_id    bigint
cad_reg_est_nome  varchar     cad_nat_jur_nome  varchar
cad_reg_fed_id    bigint      cad_municipio     text
cad_reg_fed_nome  varchar     cad_uf            text
```

`cad_hist_ini`/`cad_hist_fim` são **texto** no formato `YYYY-MM-DD HH:MM:SS` (ex.: `2025-10-08 20:22:15`), não `timestamp`. `cad_id` é a mesma chave já usada pelo segmento `[id]` da rota e por `analytics.sate_instituicao`. Não existe `cad_data_ini`/`cad_data_fim` em nenhuma relação do schema `analytics` — a consulta a `information_schema.columns` retornou vazio para esses nomes.

**Padrão de acesso já estabelecido.** `lib/sate-instituicao.ts` e `lib/consulta-entidade.ts` fixaram a forma: módulo `server-only`, `prisma.$queryRaw` com `Prisma.sql` parametrizado, e `catch` que reconhece `PrismaClientKnownRequestError` código `P2010` com `meta.code === "42P01"` (relação inexistente) para degradar em vez de estourar.

**Estado da barra lateral.** `Sidebar` e `Topbar` são componentes de cliente irmãos, montados lado a lado por `app/app/layout.tsx` (componente de servidor). Não há hoje nenhum estado compartilhado entre eles: `searchOpen` vive dentro de `Topbar`, e a `Sidebar` não tem como acioná-lo.

**Forma atual da tabela de histórico.** `HistoricoCadastralTab` já é um componente de cliente puramente apresentacional que recebe `{ colunas, registros }`: `colunas` descreve rótulo, campo, largura, se é monoespaçada, se é fixa e se entra na comparação; `registros` é a lista de linhas. A dedução de linhas alteradas, a seleção de colunas e o destaque já existem e não mudam.

## Goals / Non-Goals

**Goals:**
- Conectar a aba Histórico a `analytics.sate_hist_regime` mantendo intacta a lógica de dedução/seleção de colunas que já existe.
- Acrescentar Município como mais uma coluna do mesmo mecanismo, sem caso especial no componente.
- Fazer com que nenhum link do produto leve a um endereço de aba do contribuinte sem `id`.

**Non-Goals:**
- Migrar as outras abas da ficha (Recolhimentos, Declarações, Valores, Documentos) — cada uma tem fonte própria.
- Paginar ou virtualizar a tabela do histórico. 607 linhas é o pior caso medido e a tabela já rola horizontalmente; paginar mudaria o requisito "quantidade exibida em relação ao total".
- Aposentar `lib/mock/contribuinte-detalhe.ts` — as demais abas ainda dependem dele.
- Redesenhar a busca de contribuinte da barra superior. Ela só ganha uma segunda forma de ser aberta.

## Decisions

### 1. Módulo `lib/sate-hist-regime.ts`, espelhando `lib/sate-instituicao.ts`

**Escolha**: novo módulo `server-only` com `getHistoricoRegime(idContribuinte: string): Promise<HistoricoRegimeLinha[]>`, consultando via `prisma.$queryRaw(Prisma.sql\`...\`)` com `cad_id = ${idBigInt}`.

**Alternativa descartada**: model tipado no Prisma. A view vive no schema `analytics`, fora do `schema=public` gerenciado pelo `schema.prisma`; foi a mesma razão registrada em `2026-08-21-sate-instituicao/design.md`, decisão 1.

**Detalhes**:
- `BigInt(idContribuinte)` dentro de `try/catch` — um `[id]` não numérico (é o que acontece hoje ao cair em `/app/contribuintes/historico/linha-do-tempo`) devolve lista vazia em vez de lançar.
- `ORDER BY cad_hist_ini` no SQL. Como o formato textual é `YYYY-MM-DD HH:MM:SS`, a ordem lexicográfica coincide com a cronológica; não é preciso converter para `timestamp` só para ordenar.
- `catch` reconhecendo `P2010`/`42P01` → devolve `[]` e registra no log do servidor, como em `sate-instituicao.ts`. Lista vazia e contribuinte sem registro convergem para o mesmo estado vazio da aba, que é o que a spec pede.

### 2. Município é concatenado no SQL, não no componente

**Escolha**: a consulta projeta `cad_municipio || '-' || cad_uf AS cad_municipio_uf`, e a coluna da tabela aponta para esse campo único.

**Alternativa descartada**: passar `cad_municipio` e `cad_uf` separados e juntar na renderização. Isso obrigaria `HistoricoCadastralTab` a conhecer uma coluna com dois campos — hoje cada coluna é `field: keyof HistoricoRegistro`, um campo só. Um caso especial quebraria também a dedução de linhas (`anterior.row[c.field] !== row[c.field]`), que compara campo a campo.

**Detalhe**: `||` em Postgres devolve `NULL` se qualquer operando for `NULL`. Usar `concat_ws('-', cad_municipio, cad_uf)`, que ignora nulos e devolve `''` quando ambos faltam; a formatação converte vazio em `—`, como as demais colunas. Na carga atual nenhum dos dois campos é nulo, mas a consulta não depende disso. O resultado sai como `MACAPA-AP`.

### 3. Formatação de datas no servidor, na projeção da consulta

**Escolha**: `to_char(cad_hist_ini::timestamp, 'DD/MM/YYYY HH24:MI:SS')` na própria consulta, entregando ao componente a string já pronta.

**Alternativa descartada**: formatar em JavaScript. A coluna é texto e algumas linhas trazem `0001-01-01 00:00:00` como sentinela de "desde sempre" — `new Date()` no cliente aplicaria fuso horário e poderia deslocar o dia. `to_char` sobre o `::timestamp` é determinístico e não envolve fuso.

**Detalhe**: o mock atual já exibia exatamente esse formato, então a aparência da tabela não muda.

### 4. A `page` do histórico monta as colunas; o componente não muda

**Escolha**: `app/app/contribuintes/[id]/historico/page.tsx` (componente de servidor) chama `getHistoricoRegime(id)` e monta o mesmo objeto `{ colunas, registros }` que `HistoricoCadastralTab` já consome. A definição de colunas — hoje a constante `HISTORICO_COLUNAS` do mock — passa a viver junto do módulo da view, acrescida de Município.

**Alternativa descartada**: o componente buscar os dados. Ele é `"use client"` por causa da seleção de colunas e do `useMemo`; manter a consulta no servidor preserva `server-only` e evita expor a base analítica.

**Detalhe**: os tipos `HistoricoColuna`/`HistoricoRegistro`/`HistoricoCadastral` migram de `lib/mock/contribuinte-detalhe.ts` para `lib/sate-hist-regime.ts`, e `HistoricoCadastralTab` passa a importá-los de lá. `getHistoricoCadastral` e as constantes do mock são removidas; o restante do módulo mock fica.

### 5. Subitens do Contribuinte inertes viram um dado do item de navegação

**Escolha**: `NavChild` ganha `href?: string` opcional — ausente significa inerte. `getNavItems` deixa de reescrever hrefs quando não há `id`: devolve os subitens do grupo `contrib` sem `href`. A `Sidebar` renderiza `<span className="ga-nav-subitem is-disabled" aria-disabled="true">` no lugar do `<Link>` quando `href` é ausente.

**Alternativa descartada**: manter os hrefs estáticos e interceptar o clique. Um `<a>` com destino real continua navegável por meio-clique, "abrir em nova aba" e teclado — é exatamente por onde o bug atual entra.

**Detalhes**:
- As constantes `ROUTES.contribuinte*` deixam de existir; quem gera link para a ficha usa `contribuinteTab(id, tab)`.
- `item.href` do grupo `contrib` também perde o destino: o item pai já é um `<button>` que só alterna o grupo.
- `extractContribuinteId` continua rejeitando um segmento que seja nome de aba, o que hoje já impede tratar `"historico"` como `id`. Com os subitens inertes, a URL `/app/contribuintes/historico/linha-do-tempo` deixa de ser alcançável a partir da barra lateral.
- As sete entradas de Contribuinte saem de `APP_FEATURES` — a busca de funcionalidade navega por `href`, e essas telas não têm endereço sem `id`.

### 6. Coordenação Sidebar → Topbar por contexto de cliente

**Escolha**: um provider de cliente (`components/layout/ShellSearchProvider.tsx`) expondo `{ abrirBuscaContribuinte: () => void, registrarAbertura: (fn) => void }`, montado em `app/app/layout.tsx` envolvendo `Sidebar` e `Topbar`. A `Topbar` registra o gatilho que abre o dropdown e foca o input (o `searchInputRef` já existe); a `Sidebar` o aciona no `onClick` do item "Contribuinte" quando não há `id` na rota.

**Alternativa descartada A**: `CustomEvent` no `document`. Funciona, mas foge do modelo de dados do React e não é rastreável por tipos.

**Alternativa descartada B**: subir `searchOpen` para o layout. `app/app/layout.tsx` é componente de servidor — teria de virar cliente, arrastando `auth()` e `getContribuintesRecentes()` para fora do servidor.

**Detalhe**: o provider é um envoltório fino de estado; não move nenhuma consulta nem transforma o layout em componente de cliente, porque só o provider leva `"use client"`.

## Risks / Trade-offs

- **Volume: até 607 linhas para um contribuinte, todas renderizadas de uma vez.** → A tabela já é `overflow-x: auto` dentro de `ga-table-wrap` e o `useMemo` da dedução roda só quando muda a seleção de colunas. Se o volume incomodar na prática, paginar é uma change própria, com requisito próprio (a spec hoje pede a contagem em relação ao total).
- **`cad_hist_ini`/`cad_hist_fim` são texto: um valor fora do formato faria `::timestamp` derrubar a consulta inteira** (o `catch` do módulo só trata `42P01`). → Verificado no ambiente: zero linhas fora de `^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$` entre as 403.719, e nenhum `cad_hist_fim`, `cad_municipio` ou `cad_uf` nulo. O `to_char(x::timestamp, ...)` é seguro sobre a carga atual; se uma carga futura trouxer lixo, o sintoma é a aba estourar, e a correção é trocar por `to_timestamp` tolerante.
- **A data sentinela `0001-01-01 00:00:00` aparece como `01/01/0001` na coluna Data início.** → É o que a fonte diz e o mock já exibia sentinelas equivalentes (`31/12/4000`). Traduzi-la para "desde sempre" seria interpretação de domínio sem respaldo em `references/domain/regras-negocio.md`; fica fora desta change.
- **View ausente em desenvolvimento local.** → Aba vazia com mensagem, mesmo comportamento já aceito para `sate_instituicao`.
- **Remover as entradas de Contribuinte de `APP_FEATURES` diminui o que a busca de funcionalidade encontra.** → É a consequência pretendida: aquelas entradas só levavam ao beco descrito na proposal. A busca da barra superior é o caminho para chegar a um contribuinte, e o item "Contribuinte" da barra lateral agora a abre.
