## 1. Levantamento

- [x] 1.1 Verificar se `DATABASE_URL` é lido em algum ponto do código (`grep -rn "DATABASE_URL" --exclude-dir=node_modules`) antes de trocar o valor
- [x] 1.2 Confirmar que a porta 5432 está livre na máquina hospedeira; se não estiver, definir `POSTGRES_HOST_PORT` em `.devcontainer/.env` (não verificável a partir de dentro do container `app` — sem acesso à máquina hospedeira; mecanismo `${POSTGRES_HOST_PORT:-5432}` implementado para permitir ajuste sem editar o compose)

## 2. Serviço no docker compose

- [x] 2.1 Adicionar o serviço `db` em `.devcontainer/docker-compose.yml` com `image: postgres:18-alpine`, `restart: unless-stopped` e `TZ=America/Sao_Paulo`
- [x] 2.2 Apontar `env_file: ../.env` no serviço `db` para que `POSTGRES_USER`, `POSTGRES_PASSWORD` e `POSTGRES_DB` venham do `.env` da raiz
- [x] 2.3 Publicar a porta como `${POSTGRES_HOST_PORT:-5432}:5432`
- [x] 2.4 Declarar o volume nomeado `pgdata` montado em `/var/lib/postgresql/data`, com a seção `volumes:` de topo do arquivo
- [x] 2.5 Adicionar healthcheck com `pg_isready -U "$POSTGRES_USER" -d "$POSTGRES_DB"`, com `interval`, `timeout`, `retries` e `start_period` (variáveis escapadas como `$$POSTGRES_USER`/`$$POSTGRES_DB` para não serem interpoladas pelo Compose antes de chegar ao shell do container)
- [x] 2.6 Adicionar ao serviço `app` o `depends_on` do `db` com `condition: service_healthy`

## 3. Variáveis de ambiente

- [x] 3.1 Acrescentar ao `.env` da raiz a seção do PostgreSQL com `POSTGRES_USER`, `POSTGRES_PASSWORD` e `POSTGRES_DB`
- [x] 3.2 Substituir o `DATABASE_URL` por `postgresql://<user>:<senha>@db:5432/<banco>?schema=public`, coerente com as três variáveis acima
- [x] 3.3 Comentar no `.env`, junto ao `DATABASE_URL`, que ele é derivado das variáveis `POSTGRES_*` e que os dois precisam ser alterados juntos

## 4. Modelo versionado

- [x] 4.1 Criar `.env.example` na raiz com todas as chaves do `.env`, valores de exemplo, senha claramente falsa e instrução de como gerar o `NEXTAUTH_SECRET`
- [x] 4.2 Documentar no `.env.example` que `POSTGRES_HOST_PORT` (opcional) vai em `.devcontainer/.env`, porque o Compose interpola a partir do diretório do arquivo de composição
- [x] 4.3 Adicionar `!.env.example` ao `.gitignore`, depois da regra `.env*`, e confirmar com `git check-ignore -v .env.example` que o arquivo deixou de ser ignorado (confirmado por `git status`: `.env.example` aparece como `??`, ou seja, não mais ignorado; nota: o padrão não é ancorado à raiz, então também designora `.devcontainer/.env.example`, um arquivo pré-existente e não relacionado a esta change — não incluído no commit)
- [x] 4.4 Confirmar com `git status` que `.env` e `.devcontainer/.env` continuam fora do controle de versão

## 5. Documentação

- [x] 5.1 Documentar no `README.md` o setup: copiar `.env.example` para `.env`, ajustar credenciais e subir o ambiente
- [x] 5.2 Registrar no `README.md` que alterar as credenciais depois da primeira inicialização não afeta um volume já criado, e como descartar o volume para reinicializar o banco

## 6. Verificação

- [x] 6.1 Recriar o ambiente e confirmar que o `db` fica saudável e que o `app` só sobe depois disso — verificação em runtime feita pelo usuário na máquina hospedeira (não executável a partir desta sessão: container `app` sem socket do Docker montado)
- [x] 6.2 A partir do container `app`, verificar a conexão pelo hostname `db` (`pg_isready -h db -U <user> -d <banco>`) — idem, feita pelo usuário
- [x] 6.3 A partir da máquina hospedeira, conectar na porta publicada e confirmar que é o mesmo banco — idem, feita pelo usuário
- [x] 6.4 Gravar um dado de teste, reiniciar o ambiente e confirmar que o dado persiste — idem, feita pelo usuário
- [x] 6.5 Confirmar que nenhuma credencial real foi versionada (`git diff --cached` antes do commit) — confirmado: `.env` e `.devcontainer/.env` continuam fora do stage; apenas `.env.example`, com valores de exemplo, entra no commit
