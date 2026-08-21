## 1. Módulo de acesso a `analytics.sate_instituicao`

- [x] 1.1 Criar `lib/sate-instituicao.ts` com `import "server-only"`, interface `Instituicao` (campos: `razao_social`, `nome_fantasia`, `cpf_cnpj`, `inscricao_estadual`, `tipo`, `situacao_cadastral`, `dt_situacao_cadastral`, `motivo_situacao_cadastral`, `ind_atividade`) e função `getInstituicao(idContribuinte: string): Promise<Instituicao | null>` usando `prisma.$queryRaw` com SQL parametrizado contra `analytics.sate_instituicao` filtrado por `id_contribuinte`, com `try/catch` para tabela inexistente (code `42P01`) retornando `null`

## 2. Entity Bar — nova interface de props

- [x] 2.1 Alterar `components/contribuinte/EntityBar.tsx`: substituir a prop `ficha: ContribuinteFicha` por props individuais (`razaoSocial: string`, `nomeFantasia: string | null`, `cpfCnpj: string`, `inscricaoEstadual: string`, `iniciais: string`, `grupoEconomico: string`, `badges: ContribuinteBadge[]`), removendo o import de `ContribuinteFicha` do mock e ajustando o template JSX para usar as novas props

## 3. Layout — busca de dados via `sate_instituicao`

- [x] 3.1 Alterar `app/app/contribuintes/[id]/layout.tsx`: substituir a chamada a `getContribuinteFicha(id)` por `getInstituicao(id)` de `lib/sate-instituicao.ts`; derivar `iniciais` da `razaoSocial` (duas primeiras letras maiúsculas); passar os campos individuais para `<EntityBar />`; manter `grupoEconomico` e `badges` com valores placeholder; exibir mensagem "Contribuinte não encontrado" se `getInstituicao` retornar `null`

## 4. Situação Cadastral — dados reais

- [x] 4.1 Alterar `app/app/contribuintes/[id]/situacao-cadastral/page.tsx`: substituir as chamadas a `getContribuinteFicha` e `getSituacaoCadastral` por `getInstituicao(id)`; mapear os campos da `Instituicao` (`tipo`, `situacao_cadastral`, `dt_situacao_cadastral`, `motivo_situacao_cadastral`, `ind_atividade`) para `CampoCadastral[]` sem histórico (sem `rows`); exibir "Contribuinte não encontrado" quando `getInstituicao` retornar `null`

## 5. Sidebar — links dinâmicos do grupo Contribuinte

- [x] 5.1 Alterar `components/layout/Sidebar.tsx`: extrair o `id` do contribuinte do `pathname` (regex `/app/contribuintes/([^/]+)/`); quando presente, sobrepor os `href` dos `NavChild` do grupo `contrib` com os links gerados por `contribuinteTab(id, tab)` de `lib/routes.ts`, mapeando cada `key` do contribuinte ao tab correspondente (`linha_tempo` → `linha-do-tempo`, `sit` → `situacao-cadastral`, `hist` → `historico`, `rec` → `recolhimentos`, `dec` → `entrega-declaracoes`, `val` → `valores-declarados`, `doc` → `emissao-documentos`); quando fora da ficha, manter os `href` estáticos originais

## 6. Verificação

- [x] 6.1 Verificar que a aplicação compila sem erros de TypeScript (`npm run build` ou equivalente)
- [x] 6.2 Navegar para `/app/contribuintes/[id]` e confirmar que a entity bar exibe dados de `sate_instituicao` (ou mensagem de indisponibilidade quando a view não existe)
- [x] 6.3 Navegar para `/app/contribuintes/[id]/situacao-cadastral` e confirmar que os cinco campos são exibidos com dados de `sate_instituicao`
- [x] 6.4 Confirmar que os links da sidebar do grupo Contribuinte navegam para as rotas corretas com o `[id]` do contribuinte aberto
