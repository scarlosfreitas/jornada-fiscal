## Context

Ver proposal.md - Why.

Estado atual relevante:

- `app/app/layout.tsx` monta o shell (barra lateral, barra superior, `<main class="ga-content">`, rodapé) uma única vez. Qualquer tela nova só precisa renderizar dentro de `{children}` — é o que garante que esta change não toque no shell.
- `lib/routes.ts` já tem seis rotas estáticas `contribuinte*` (`/app/contribuintes/historico`, `/app/contribuintes/situacao-cadastral`, …) usadas apenas pelos subitens da barra lateral, nenhuma com página, e uma `contribuinteDetalhe(id)` → `/app/contribuintes/{id}` usada pelo dropdown de busca da barra superior, que hoje leva a 404.
- `lib/mock/contribuintes.ts` traz oito contribuintes (`c1`…`c8`) com razão social, CNPJ, IE, situação, sócio e contador — o suficiente para a busca da barra superior, insuficiente para a ficha.
- `app/gestor-alertas.css` já tem a seção "Ficha do contribuinte" (`.ga-entity-bar`, `.ga-tabbar`, `.ga-tab`), além de `.ga-timeline*`, `.ga-matrix`, `.ga-modal*`, `.ga-photo-*`, `.ga-quote`, `.ga-field-row`, `.ga-toast` — tudo pronto e sem nenhum consumidor. Faltam apenas 12 classes que o protótipo usa (verificado por varredura na folha): `ga-cell-sub`, `ga-cell-new`, `ga-cell-old`, `ga-legend-dot`, `ga-legend-new`, `ga-legend-old`, `ga-dot-today`, `ga-dot-future`, `ga-line-dashed`, `ga-date-today`, `ga-date-future`, `ga-title-today`.
- O protótipo é um export bundlado; o `CLAUDE.md` documenta como decodificá-lo. As regras CSS faltantes devem ser extraídas do `<style>` embutido nele, não reinventadas.

## Goals / Non-Goals

**Goals:**
- Ficha do contribuinte com identidade compartilhada e sete abas, cada uma com endereço próprio.
- Conteúdo das sete abas transcrito fielmente do protótipo, com a interatividade que ele demonstra.
- Barra lateral com os sete subitens do grupo Contribuinte, mexendo só nos dados de navegação.

**Non-Goals:**
- Dados reais. Tudo vem de mock, como o painel já faz. Consequência assumida: a ficha é a mesma para qualquer `id`.
- Uma tela de entrada do módulo Contribuinte (lista/seleção de contribuinte). As seis rotas estáticas da barra lateral continuam sem página, como hoje — chega-se a uma ficha pela busca da barra superior. Ver a decisão sobre isso adiante.
- Corrigir as inconsistências de dados do protótipo. A instrução foi transcrever o modelo; as inconsistências vão junto, documentadas.
- Exportação. O botão "Exportar" fica desabilitado com o mesmo tratamento já dado em `components/dashboard/PageHead.tsx`.
- Mexer em `Sidebar.tsx`, `Topbar.tsx` ou `Footer.tsx`.

## Decisions

**Rotas aninhadas por contribuinte, um segmento por aba: `/app/contribuintes/{id}/{aba}`.** É o que a instrução pede ("a navegação de cada aba será feita acima de contribuinte/") e o que o protótipo implica — a ficha é sempre de um contribuinte específico, então a aba é um sub-recurso dele. Dá endereço próprio a cada aba de graça: compartilhável, recarregável, e o botão voltar funciona sem código. Alternativa descartada: `?tab=` como parâmetro de consulta — mesma URL para conteúdos diferentes, e obrigaria a página inteira a virar client component só para ler o parâmetro.

**A identidade e a barra de abas ficam em `app/app/contribuintes/[id]/layout.tsx`, não em cada página.** É o idioma do App Router para "moldura compartilhada entre rotas irmãs": as duas não remontam ao trocar de aba, e cada `page.tsx` de aba fica reduzida ao conteúdo dela. A aba ativa sai do próprio segmento de rota, o que mantém a barra de abas como server component — sem `usePathname`, sem `"use client"`.

**`contribuinteDetalhe(id)` mantém a assinatura e ganha uma página índice que redireciona para a primeira aba.** O dropdown de busca da barra superior já aponta para `/app/contribuintes/{id}`; preservar a rota faz aquele link passar a funcionar sem tocar em `Topbar.tsx`. Alternativa descartada: apontar a busca direto para a primeira aba — mexeria em `Topbar.tsx` e espalharia a decisão de "qual é a primeira aba" para fora da ficha.

**Os subitens da barra lateral continuam apontando para as rotas estáticas sem `id`, que continuam sem página.** É desconfortável, mas é o estado que já existe hoje para esses seis itens e para Relatórios e Operador, e mudar isso exige uma decisão de produto que esta change não tem: um item de menu global não sabe de qual contribuinte se trata. A saída natural é uma tela de entrada do módulo (lista ou seleção de contribuinte) que redirecione para a ficha — trabalho de uma change futura, registrado aqui como non-goal. Esta change mexe nesses itens apenas para acrescentar "Linha do Tempo" e reposicionar "Histórico", alinhando o menu às sete abas.

**As sete abas do protótipo, e não as seis do menu atual.** O protótipo trata "Linha do tempo" (eventos cronológicos: aberturas, MPF, TIF, autos, prazos, contatos) e "Histórico" (tabela de estados cadastrais com data de início e fim) como coisas diferentes, com dados e apresentações sem interseção. Fundir as duas produziria uma aba incoerente. Confirmado com o usuário, incluindo a autorização para atualizar o menu.

**Um módulo mock novo, `lib/mock/contribuinte-detalhe.ts`, em vez de inchar `lib/mock/contribuintes.ts`.** O módulo existente serve à busca da barra superior (registros rasos, muitos contribuintes); o novo serve à ficha (um registro, muito profundo). Juntar os dois misturaria propósitos e faria a busca carregar a linha do tempo inteira. Segue o padrão de `lib/mock/dashboard.ts`: interfaces tipadas, consts estáticas, funções `getX(id)` com a assinatura que uma leitura real teria, e o comentário de cabeçalho registrando o que muda quando houver persistência.

**Estado no cliente apenas nos componentes que precisam dele.** Barra de identidade, barra de abas e cabeçalho de cada aba são server components. Viram client component só os que têm interação: busca da aba, modal de histórico de campo, visualizador de fotos, seleção de colunas, seletor de período, seletores de emitente/métrica. A regra é a mesma já aplicada no painel, onde só o componente com estado de período é `"use client"`.

**A dedução de linhas do Histórico cadastral acontece no componente, a partir dos registros brutos.** Quais registros aparecem depende de quais colunas estão visíveis, e isso muda a cada clique da pessoa usuária — então o filtro tem de ser recalculado junto, não pré-computado no mock. O mock entrega os doze registros crus e a definição das sete colunas; o componente compara cada registro com o anterior mantido, considerando só as colunas visíveis e ignorando as datas.

**As 12 classes faltantes entram em `app/gestor-alertas.css` com as regras extraídas do protótipo.** A folha é o design system do produto e o protótipo é sua fonte; reescrever as regras de cabeça produziria divergência visual. Elas entram na seção "Ficha do contribuinte" já existente, junto de `.ga-entity-bar` e `.ga-tabbar`.

## Risks / Trade-offs

[Os dados do protótipo são internamente inconsistentes: a identidade e quase todas as abas são de "Metalúrgica Andrade S/A", mas a tabela de Histórico cadastral traz um contribuinte fictício totalmente diferente, "EDINALDO TAVARES FERREIRA"; e a IE que o protótipo mostra na identidade (`07.302.118-4`) não é a que `lib/mock/contribuintes.ts` já registra para esse mesmo contribuinte (`110.482.331`)] → transcrever como está, conforme instruído, e registrar a inconsistência em comentário no módulo mock, para que quem trocar o mock por dados reais saiba que a divergência veio do protótipo e não de um erro de implementação.

[A ficha ignora o `id` e mostra sempre o mesmo contribuinte, então a busca da barra superior parece funcionar mas leva sempre à mesma empresa] → é o non-goal declarado, e a assinatura `getX(id)` já está pronta para receber a leitura real; o comentário de cabeçalho do módulo registra isso explicitamente.

[Os seis subitens do menu Contribuinte continuam levando a 404] → estado inalterado em relação a hoje, e não é regressão; a tela de entrada do módulo fica registrada como o próximo passo natural.

[A aba Valores declarados é uma matriz larga, com até treze colunas de período] → a folha de estilo já tem `.ga-matrix` com rolagem horizontal e largura mínima definida pelo protótipo; nenhuma solução nova é necessária.
