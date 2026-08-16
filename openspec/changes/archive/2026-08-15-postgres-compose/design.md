## Context

Ver `proposal.md` — Why. O que existe hoje e condiciona a solução:

- `.devcontainer/docker-compose.yml` tem um único serviço `app`, montando o projeto em `${PROJECT_FOLDER}` e rodando `sleep infinity`. Os valores `${CONTAINER_NAME}`, `${DOCKER_IMAGE_NAME}`, `${PROJECT_FOLDER}` etc. vêm de `.devcontainer/.env`.
- **Compose interpola variáveis a partir do `.env` que está no diretório do arquivo de composição** — ou seja, `.devcontainer/.env`, não o `.env` da raiz. Isso é o ponto central do desenho: o pedido é que as credenciais fiquem no `.env` da raiz, e a interpolação padrão não enxerga esse arquivo.
- `.gitignore` ignora `.env*` e também `.devcontainer/.env`. Não existe nenhum `.env.example`.
- O `.env` da raiz hoje traz `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `NEXT_PUBLIC_APP_NAME` e `NEXT_PUBLIC_APP_URL`. O `DATABASE_URL` é `mysql://…@localhost:3306/` — boilerplate, incompatível com Prisma+PostgreSQL e com a topologia de containers.
- `devcontainer.json` aponta `"service": "app"` e usa `"shutdownAction": "none"`; o `postCreate.sh` já lê `.devcontainer/.env` para credenciais git.

## Goals / Non-Goals

**Goals:**

- Banco disponível junto do ambiente, sem passo manual.
- Credenciais no `.env` da raiz como fonte única, conforme pedido.
- Dados sobrevivendo a rebuild do devcontainer.
- Nenhuma quebra no fluxo atual de subida do devcontainer.

**Non-Goals:**

- Schema Prisma, migrations, seed.
- Ferramenta de administração em container (pgAdmin/Adminer).
- Qualquer ambiente que não seja o desenvolvimento local.
- Ajustes de performance do Postgres (`shared_buffers` e afins) — o padrão da imagem serve.

## Decisions

### 1. Credenciais no `.env` da raiz, entregues por `env_file` — não por interpolação

O serviço `db` recebe `env_file: ../.env`. A imagem oficial do Postgres lê `POSTGRES_USER`, `POSTGRES_PASSWORD` e `POSTGRES_DB` do **próprio ambiente do container** na primeira inicialização, então `env_file` é exatamente o mecanismo certo: os valores nunca precisam ser interpolados pelo Compose.

Essa é a razão de o pedido funcionar sem contorno. Se o desenho dependesse de `${POSTGRES_USER}` escrito no `docker-compose.yml`, o Compose iria procurá-lo em `.devcontainer/.env` e as credenciais teriam de ser duplicadas lá.

*Consequência a aceitar*: o que **precisa** de interpolação continua vindo de `.devcontainer/.env`. É o caso da porta publicada — por isso ela é escrita como `${POSTGRES_HOST_PORT:-5432}:5432`, com valor padrão embutido: funciona sem configuração nenhuma, e quem tiver a 5432 ocupada na máquina hospedeira define `POSTGRES_HOST_PORT` em `.devcontainer/.env`. Isso fica documentado no `.env.example`.

*Alternativa considerada*: mover as credenciais para `.devcontainer/.env` e interpolar. Rejeitada — contraria o pedido e espalharia a configuração do banco por dois arquivos.

### 2. `DATABASE_URL` aponta para o host `db`

`DATABASE_URL=postgresql://<user>:<senha>@db:5432/<banco>?schema=public`.

Dentro do container `app`, `localhost` é o próprio `app`. O nome do serviço (`db`) é o hostname na rede do Compose. Esse é o erro concreto do valor atual, além do protocolo `mysql://`.

### 3. Credenciais duplicadas entre `POSTGRES_*` e `DATABASE_URL`, com o `.env.example` explicando

O Prisma lê uma URL única de `DATABASE_URL`; a imagem do Postgres lê variáveis separadas. Não há como servir os dois sem repetir usuário, senha e nome do banco no mesmo arquivo.

Mitigação: as duas seções ficam adjacentes no `.env` e no `.env.example`, com um comentário dizendo explicitamente que `DATABASE_URL` é derivada das três variáveis acima e que alterar uma exige alterar a outra.

*Alternativa considerada*: montar a URL em código a partir das partes. Rejeitada — o Prisma resolve `env("DATABASE_URL")` no schema, antes de qualquer código nosso rodar.

### 4. `.env.example` versionado, com exceção no `.gitignore`

`.gitignore` ignora `.env*`; é preciso `!.env.example` para versioná-lo. O arquivo lista todas as chaves com valores de exemplo (senha claramente falsa, `NEXTAUTH_SECRET` como placeholder com instrução de como gerar) e nenhum segredo real.

Isso é acréscimo ao pedido, e vale porque hoje nada no repositório revela quais variáveis o projeto espera — com `.env*` inteiramente ignorado, quem clona descobre por tentativa e erro.

### 5. Imagem, versão e healthcheck

`postgres:18-alpine`, major fixado. `latest` faria uma recriação futura do ambiente saltar de major sem aviso, com risco de incompatibilidade no diretório de dados do volume; `alpine` reduz o download.

Healthcheck com `pg_isready -U "$POSTGRES_USER" -d "$POSTGRES_DB"`, e o `app` com `depends_on: { db: { condition: service_healthy } }`. Sem a condição de saúde, `depends_on` só garante que o container do banco *iniciou* — e o Postgres leva alguns segundos até aceitar conexões na primeira subida, o que faria uma migration disparada no `postCreate` falhar de forma intermitente.

### 6. Volume nomeado

`pgdata:/var/lib/postgresql/data`, declarado como volume nomeado do Compose. O `/home/app` do container é descartado a cada rebuild (o próprio `postCreate.sh` documenta isso); um volume nomeado é o que mantém os dados fora desse ciclo. Não usar bind mount para o diretório de dados: gera problemas de permissão e de UID entre hospedeira e container, e sujaria a árvore do projeto.

### 7. `TZ=America/Sao_Paulo` também no `db`

O serviço `app` já define esse fuso. Deixar o banco em UTC enquanto a aplicação está em `America/Sao_Paulo` produz divergência em `now()` e em timestamps sem timezone — exatamente o tipo de detalhe que só aparece muito depois, e o domínio é cheio de prazo e decadência.

## Risks / Trade-offs

- **`DATABASE_URL` antigo apontando para MySQL pode estar em uso em algum lugar** → mitigado: não há `prisma/schema.prisma` nem código lendo a variável hoje; a busca por usos faz parte das tarefas.
- **Porta 5432 ocupada na máquina hospedeira** → `${POSTGRES_HOST_PORT:-5432}` permite mudar sem editar o compose (decisão 1).
- **Trocar credencial no `.env` não altera um banco já inicializado** → as variáveis `POSTGRES_*` só têm efeito na primeira inicialização do volume; mudar a senha depois exige `ALTER USER` ou descartar o volume. Documentado no `.env.example` e no README.
- **Senha real em `env_file` legível dentro do container** → aceitável em ambiente de desenvolvimento local; nada disso vale para homologação/produção, que estão fora do escopo.
- **`.env.example` desatualizar em relação ao `.env`** → risco permanente e sem solução automática aqui; mitigado mantendo os dois com a mesma ordem e os mesmos comentários de seção.

## Migration Plan

1. Atualizar `.env` da raiz (arquivo local, não versionado) com as variáveis `POSTGRES_*` e o novo `DATABASE_URL`.
2. Recriar o ambiente de desenvolvimento (rebuild do devcontainer ou `docker compose up -d`), o que baixa a imagem e inicializa o cluster.
3. Verificar com `pg_isready` e uma conexão de teste a partir do container `app`.

Rollback: remover o serviço `db`, o volume e o `depends_on` do compose, e restaurar o `DATABASE_URL` anterior. Como não há schema nem dados ainda, nada se perde.

## Open Questions

Nenhuma.
