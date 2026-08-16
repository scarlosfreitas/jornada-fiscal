## Context

`LoginForm.tsx` (ver proposal.md - Why) já tem toda a UI de erro pronta e correta: `hasError` controla `is-invalid` nos dois inputs e renderiza `<span className="ga-field-error" role="alert">E-mail ou senha incorretos.</span>`, e as classes CSS correspondentes (`.ga-field-error`, `.ga-input.is-invalid`) já existem em `app/gestor-alertas.css`. O problema não é de UI, é de fluxo: nada popula `hasError` quando `signIn` rejeita em vez de resolver.

## Goals / Non-Goals

**Goals:**
- Garantir que qualquer falha de `signIn` (rejeição ou `{ error }` na resolução) resulte em `hasError = true` e `isSubmitting = false`.

**Non-Goals:**
- Mudar o texto da mensagem, o design visual do erro, ou diferenciar mensagens por tipo de falha (a spec `autenticacao` exige mensagem indistinguível entre e-mail inexistente e senha errada — mantido).
- Tratar erros de rede/infraestrutura de forma diferente de credenciais inválidas — ambos caem no mesmo catch e mostram a mesma mensagem, o que já é consistente com o requisito de não vazar qual parte da credencial está errada.

## Decisions

**`try/catch` ao redor de `signIn`, com o mesmo tratamento de erro nos dois caminhos.** Em vez de investigar e depender do comportamento exato desta versão beta do Auth.js (`next-auth@5.0.0-beta.32`), que pode mudar entre betas, o fix cobre os dois formatos possíveis de falha: rejeição da Promise (`catch`) e resolução com `!result || result.error` (já existente). Isso é mais robusto do que apostar em qual dos dois a lib usa nesta versão.

```ts
try {
  const result = await signIn("credentials", { email, password, redirect: false });
  if (!result || result.error) {
    setHasError(true);
    return;
  }
  router.push(callbackUrl);
  router.refresh();
} catch {
  setHasError(true);
} finally {
  setIsSubmitting(false);
}
```

`setIsSubmitting(false)` move para um `finally` para garantir que o botão nunca fique preso em "Entrando…" independentemente de qual caminho for tomado — hoje ele só é restaurado no bloco de erro por resolução, não em sucesso (mascarado pela navegação) nem em rejeição.

## Risks / Trade-offs

- [O `catch` também engole erros de rede genuínos (ex. backend fora do ar) mostrando "E-mail ou senha incorretos", que é impreciso] → aceito: a spec `autenticacao` já exige mensagem indistinguível para não vazar qual credencial está errada, e o projeto não tem um requisito separado para erro de infraestrutura na tela de entrada; não é escopo desta correção.
