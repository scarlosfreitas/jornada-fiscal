---
name: spec-dispatch
description: Despacha uma change OpenSpec já pronta e publicada em main para um executor isolado (subagente com worktree próprio, model sonnet) implementar em paralelo. Use depois de propor/validar/publicar uma change, ou quando o usuário pedir explicitamente para despachar/executar uma change em paralelo.
---

Despacha a implementação de uma change OpenSpec para um subagente isolado, sem sair da branch/worktree de planejamento desta sessão.

**Input**: Nome da change a despachar (ex.: `/spec-dispatch add-relatorios`). Se omitido, tente inferir do contexto da conversa; se ambíguo, rode `openspec list --json` e pergunte qual change despachar.

## Por que isso existe

Múltiplas sessões Claude Code compartilhando o mesmo diretório de trabalho colidem: `git add`/`git mv` de uma aparecendo staged na outra, edições concorrentes revertendo umas às outras. A solução é isolamento físico — cada execução em seu próprio git worktree — e não pedir para o usuário abrir sessões extras manualmente: a tool `Agent` com `isolation: "worktree"` já cria esse isolamento por spawn.

## Pré-requisitos (checklist antes de despachar)

1. A change existe em `openspec/changes/<nome>/` com proposal, design e tasks completos.
2. `openspec validate --strict` limpo para essa change.
3. A change está **commitada e publicada em `origin/main`** — não despache uma change que só existe localmente. O worktree do executor nasce de `origin/main` (comportamento padrão de `isolation: "worktree"`), então se a change não estiver lá, o executor não a vê. Se ainda não publicou, rode a receita de push abaixo primeiro.
4. Confirme que a change não foi despachada antes (`openspec list --json` — status `in-progress` com histórico recente pode indicar um despacho já em andamento, ou uma change que voltou sem archive por causa de um desvio ainda não resolvido). Nunca despachar a mesma change duas vezes.

## Receita de publicação (fetch + rebase + push, sem PR)

Use isso tanto para publicar a change antes de despachar quanto é o que o executor usa ao final para publicar o resultado. Não dá para `git checkout main` dentro de um worktree (git recusa a mesma branch em dois worktrees ao mesmo tempo), então publica-se direto da branch do worktree:

```bash
git fetch origin
git rebase origin/main      # traz o que outro spawn já publicou nesse meio tempo
git push origin HEAD:main   # publica direto em main, sem branch intermediária no remoto
```

Se `git rebase` gerar conflito, pare e avise o usuário — não resolva automaticamente sem contexto do que mudou em paralelo.

## Disparando o executor

Chame a tool `Agent` com exatamente esta combinação:

- `subagent_type: "general-purpose"` — precisa de acesso total a arquivos/bash; agentes read-only (`Explore`, `Plan`) não servem.
- `isolation: "worktree"` — cria e isola o worktree automaticamente; o subagente não precisa (e não deve) chamar `EnterWorktree` ele mesmo.
- `model: "sonnet"` — execução sempre em Sonnet, independente do modelo desta sessão de planejamento.
- `description`: curto, ex. `"Implementa change <nome>"`.
- `prompt`: autocontido — o subagente não herda nada desta conversa. Use este template, preenchendo `<nome-da-change>`:

```
Implemente a change OpenSpec "<nome-da-change>" neste repositório (Next.js + OpenSpec).
Você está em um worktree isolado, já na branch correta — não crie outro worktree.

1. Rode `openspec show <nome-da-change>` (ou leia openspec/changes/<nome-da-change>/) para entender proposal, design e tasks.
2. Implemente as tasks em tasks.md, marcando cada uma como concluída ao terminar.
3. Rode lint e os testes relevantes do projeto; corrija o que quebrar por causa da sua mudança.
4. Decisão de archive:
   - Se a implementação bateu com a spec proposta, sem desvios: arquive (openspec archive <nome-da-change> ou o fluxo equivalente), sincronizando a spec principal.
   - Se precisou desviar do que foi proposto (comportamento diferente do descrito na spec delta): NÃO arquive. Deixe a change como está em openspec/changes/<nome-da-change>/, publique só o código (passo 5), e detalhe o desvio no resumo final (passo 6) — o que mudou e por quê.
5. Publique seu trabalho em main:
   git fetch origin
   git rebase origin/main
   git push origin HEAD:main
   Se o rebase conflitar, pare e reporte o conflito em vez de resolver sem contexto.
6. Ao final, reporte um resumo: o que foi implementado, se bateu com a spec ou desviou (e como), se arquivou, se os testes passaram, se o push foi concluído (e se não foi, por quê).
```

Duas changes independentes prontas ao mesmo tempo → dois spawns de `Agent` na mesma mensagem (chamadas em paralelo), um por change.

O executor NÃO deve remover seu próprio worktree — ele está rodando dentro dele, e o git recusa remover o worktree em uso. A limpeza é responsabilidade de quem despachou, depois que a notificação de conclusão chegar (ver seção seguinte).

## Depois do spawn

O agente roda em background; você recebe uma notificação de conclusão, que inclui `worktreePath` e `worktreeBranch`. Ao processar essa notificação:

- Se o executor arquivou e publicou: confirme com `openspec list --json` que a change saiu de `in-progress` e o push está em `origin/main`.
- Se o executor reportou desvio (não arquivou): decida — atualize a spec delta da change (seção `MODIFIED Requirements` em `openspec/changes/<change>/specs/`) para refletir o que foi implementado e arquive você mesmo, ou peça ajuste ao executor via `SendMessage` (se o subagente ainda estiver endereçável) se preferir manter o comportamento originalmente especificado.
- Se o push não foi feito (conflito, erro): rode a receita de publicação você mesmo a partir do worktree do executor, ou peça ao usuário para decidir como resolver.
- Não repita o despacho da mesma change — se algo falhou, corrija e continue a mesma execução em vez de disparar um novo spawn duplicado.

### Limpeza do worktree

Só remova o worktree quando **as duas** condições valerem: o push foi confirmado em `origin/main` **e** não há mais nenhuma pendência nele (nenhum desvio a resolver, nenhum `SendMessage` de continuação em aberto). Nesse caso o worktree não tem mais serventia — ele só existia para isolar essa execução, e o resultado já está em `main`:

```bash
git worktree remove <worktreePath>
git branch -d <worktreeBranch>
```

Se o push não aconteceu, se ficou um desvio pendente de decisão, ou se você ainda pretende continuar a mesma execução via `SendMessage`, não remova — o worktree pode ter estado (ou o agente pode ainda estar endereçável) que você precisa. Nunca use `--force`/`-D` aqui: se `git worktree remove` ou `git branch -d` recusarem por haver algo não mergeado, pare e investigue em vez de forçar.
