## Context

A ficha do contribuinte (`/app/contribuintes/[id]`) atualmente obtém todos os dados de identidade e situação cadastral de `lib/mock/contribuinte-detalhe.ts`, que devolve payloads fictícios via `lerFonteOu`. A view `analytics.sate_instituicao` já existe no banco e contém os dados reais. O padrão de acesso a views analíticas já está estabelecido em `lib/consulta-entidade.ts` (SQL bruto via Prisma `$queryRaw`, módulo `server-only`, degradação graciosa quando a tabela não existe). Ver proposal.md para motivação completa.

A sidebar (`components/layout/nav-data.ts` + `lib/routes.ts`) define as rotas dos subitens do Contribuinte como constantes estáticas (ex.: `/app/contribuintes/situacao-cadastral`), sem o segmento `[id]`. As rotas reais das páginas vivem em `app/app/contribuintes/[id]/<aba>/page.tsx`, portanto os links da sidebar nunca casam com as rotas dinâmicas.

## Goals / Non-Goals

**Goals:**
- Conectar entity bar e aba Situação Cadastral a `analytics.sate_instituicao`.
- Corrigir os links da sidebar do grupo Contribuinte para incluir o `[id]` do contribuinte aberto.
- Manter o padrão arquitetural existente (SQL bruto, `server-only`, degradação graciosa).

**Non-Goals:**
- Migrar outras abas (Linha do Tempo, Histórico, Recolhimentos, etc.) para `sate_instituicao` — cada uma tem fonte de dados própria.
- Alterar o layout da entity bar ou da aba de situação cadastral — apenas a origem dos dados muda.
- Remover o módulo mock (`lib/mock/contribuinte-detalhe.ts`) — ele continua sendo usado pelas outras abas.

## Decisions

### 1. Módulo `lib/sate-instituicao.ts` com SQL bruto via Prisma

**Escolha**: Criar `lib/sate-instituicao.ts` usando `prisma.$queryRawUnsafe` com parâmetros, seguindo o padrão de `lib/consulta-entidade.ts`.

**Alternativa descartada**: Usar Prisma client tipado — a view `sate_instituicao` vive no schema `analytics`, fora do `schema=public` gerenciado pelo Prisma, e não tem model no `schema.prisma`.

**Detalhes**:
- Função `getInstituicao(idContribuinte: string)` que retorna `Instituicao | null`.
- Interface `Instituicao` com os campos: `razao_social`, `nome_fantasia`, `cpf_cnpj`, `inscricao_estadual`, `tipo`, `situacao_cadastral`, `dt_situacao_cadastral`, `motivo_situacao_cadastral`, `ind_atividade`.
- `try/catch` no nível da query para detectar tabela inexistente (code `42P01`) e retornar `null` — mesmo padrão de `lib/consulta-entidade.ts`.

### 2. EntityBar recebe campos individuais em vez de `ContribuinteFicha`

**Escolha**: Alterar a interface de props do `EntityBar` para receber `razaoSocial`, `nomeFantasia`, `cpfCnpj`, `inscricaoEstadual` como props individuais tipadas, em vez do objeto `ContribuinteFicha` do mock.

**Alternativa descartada**: Passar a `Instituicao` inteira — acoplaria o componente presentacional à forma da view analítica.

**Detalhes**:
- O componente permanece presentacional (sem data-fetching interno).
- Os campos `iniciais`, `grupoEconomico` e `badges` continuam existindo como props, derivados pelo layout a partir dos dados disponíveis. Para esta change, `iniciais` serão extraídas da `razaoSocial` e `grupoEconomico`/`badges` permanecerão com valores estáticos até que haja fonte de dados para eles.

### 3. Layout busca dados e passa para EntityBar

**Escolha**: O layout `app/app/contribuintes/[id]/layout.tsx` chama `getInstituicao(id)` e passa os campos para `<EntityBar />`. Se a query retornar `null`, exibe "Contribuinte não encontrado".

**Alternativa descartada**: Cada sub-página buscar os dados da entity bar — duplicaria o fetch em cada aba e perderia a cache do layout (que é compartilhado).

### 4. Sidebar com links dinâmicos extraídos da URL

**Escolha**: O componente `Sidebar` (client component) já tem acesso a `usePathname()`. Extrair o `id` do pathname quando ele casar com `/app/contribuintes/[id]/*` e usar `contribuinteTab(id, tab)` de `lib/routes.ts` para gerar os `href` dos subitens do grupo Contribuinte.

**Alternativa descartada**: Transformar as rotas do Contribuinte em `ROUTES` de constantes para funções — quebraria todos os usos estáticos de `ROUTES.contribuinteX` em `nav-data.ts` e `APP_FEATURES`. Em vez disso, manter as constantes estáticas para quando nenhum contribuinte está aberto (fallback) e sobrepor com links dinâmicos no componente da sidebar quando o `id` é conhecido.

**Detalhes**:
- Na `Sidebar`, detectar se o pathname casa com `/app/contribuintes/\d+/` (ou qualquer `[id]`).
- Se sim, substituir os `href` dos `NavChild` do grupo `contrib` usando `contribuinteTab(id, tab)`.
- Se não, manter os `href` estáticos originais.
- Isso evita mudar a interface de `NavItem`/`NavChild` e a constante `NAV_ITEMS`.

### 5. Situação Cadastral exibe campos de `sate_instituicao`

**Escolha**: A page `situacao-cadastral/page.tsx` chama `getInstituicao(id)` e renderiza os cinco campos (`tipo`, `situacao_cadastral`, `dt_situacao_cadastral`, `motivo_situacao_cadastral`, `ind_atividade`) usando o componente `SituacaoCadastralTab` existente, adaptando os `CampoCadastral[]` a partir dos dados reais.

**Detalhes**:
- Mapear os campos de `Instituicao` para `CampoCadastral[]`, preservando a interface do componente presentacional.
- Histórico de campos não está disponível em `sate_instituicao` (que retorna uma única linha) — os campos serão exibidos sem link de histórico nesta fase.

## Risks / Trade-offs

- **View inexistente em dev local**: Desenvolvedores que não têm a base analítica verão "dados indisponíveis" na entity bar e na aba Situação Cadastral. → Mitigação: degradação graciosa com mensagem clara; o mock continua disponível para as demais abas.
- **Campos `iniciais`, `grupoEconomico` e `badges` sem fonte real**: `sate_instituicao` não tem essas colunas. → Mitigação: derivar `iniciais` da `razaoSocial`; manter `grupoEconomico` e `badges` com valores placeholder até change futura que traga a fonte.
- **Histórico de campos ausente**: A view `sate_instituicao` retorna uma única linha por contribuinte, sem histórico temporal dos campos. → Mitigação: os campos são exibidos sem link de histórico; uma change futura poderá adicionar uma view de histórico.
