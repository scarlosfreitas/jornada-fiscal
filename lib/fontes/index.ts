import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";

/**
 * Leitor dos payloads da API (SATE) guardados fora do controle de versão.
 *
 * Os arquivos trazem dado real de contribuinte, protegido por sigilo fiscal, e o
 * repositório é público — por isso vivem em `FONTES_DIR` (padrão `./fontes`, que o
 * .gitignore ignora) e nunca no bundle do cliente. O `import "server-only"` acima
 * transforma um import acidental a partir de um client component em erro de build,
 * em vez de vazamento silencioso.
 *
 * Quando o arquivo esperado não existe, quem chama cai de volta nos mocks fictícios
 * de `lib/mock/*` — o projeto builda e roda sem a pasta, e quem clonar o repo não
 * precisa dos dados reais para trabalhar. Ver fontes/README.md.
 */

function fontesDir() {
  return process.env.FONTES_DIR ?? path.join(process.cwd(), "fontes");
}

/**
 * Lê `<FONTES_DIR>/<nome>.json`. Devolve `null` quando o arquivo não existe, que é
 * o caso normal de quem não tem os dados reais — o chamador usa o fallback.
 * Erros de leitura ou de JSON inválido sobem, porque aí o arquivo existe e está
 * quebrado: silenciar viraria "sumiu o dado" difícil de diagnosticar.
 */
export async function lerFonte<T>(nome: string): Promise<T | null> {
  const arquivo = path.join(fontesDir(), `${nome}.json`);

  let conteudo: string;
  try {
    conteudo = await readFile(arquivo, "utf8");
  } catch (erro) {
    if ((erro as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw erro;
  }

  try {
    return JSON.parse(conteudo) as T;
  } catch (erro) {
    throw new Error(
      `Fonte "${nome}" existe em ${arquivo} mas não é JSON válido: ${(erro as Error).message}`,
    );
  }
}

/**
 * Lê a fonte e, na ausência dela, devolve o fallback. Açúcar para o padrão que todo
 * `getX` da camada de dados usa.
 */
export async function lerFonteOu<T>(nome: string, fallback: T): Promise<T> {
  return (await lerFonte<T>(nome)) ?? fallback;
}
