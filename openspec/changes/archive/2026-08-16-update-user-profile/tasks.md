## 1. Página e carregamento de dados

- [x] 1.1 Criar `app/app/profile/page.tsx` (server component): chamar `auth()`, buscar o `Usuario` pelo id da sessão via Prisma, montar os dados iniciais (nome, sobrenome, email, telefone, image) — nunca incluir a senha
- [x] 1.2 Definir `metadata.title` da página seguindo o padrão das demais telas (`app/app/page.tsx`)

## 2. Formulário (client component)

- [x] 2.1 Criar `components/profile/ProfileForm.tsx` (`"use client"`), recebendo os dados iniciais como props e usando classes `ga-field`/`ga-input`/`ga-avatar`/`ga-btn` existentes
- [x] 2.2 Campos: nome, sobrenome, e-mail, telefone; sem campo de senha e sem qualquer controle de perfil de acesso (comentário no código explicando por quê, conforme design.md)
- [x] 2.3 Campo de imagem: preview do avatar atual, input de arquivo (ícone `lucide-react`) para selecionar nova imagem
- [x] 2.4 Estado de sucesso após salvar (ex. mensagem de confirmação) e limpar/replicar o preview com a imagem salva

## 3. Server Action de atualização

- [x] 3.1 Criar a Server Action (`"use server"`) que lê `userId` de `auth()` no servidor — nunca de um valor enviado pelo cliente
- [x] 3.2 Validar entrada com `zod`: nome, sobrenome, email, telefone; e o arquivo de imagem (tipo `image/jpeg`/`image/png`/`image/webp`, tamanho máx. 2 MB), todos opcionais exceto os campos obrigatórios do cadastro
- [x] 3.3 Se o e-mail mudou, checar unicidade contra outra pessoa (`prisma.usuario.findUnique` excluindo o próprio id) antes de salvar, e tratar também a violação da constraint `@unique` do banco como "e-mail já em uso"
- [x] 3.4 Ignorar qualquer campo de perfil de acesso presente na submissão — o schema zod da action não deve nem declarar esse campo
- [x] 3.5 Se houver novo arquivo de imagem, salvar em `public/uploads/avatars/${userId}-${Date.now()}.${ext}` e usar esse caminho como novo `image`; sem remover o arquivo antigo (ver design.md)
- [x] 3.6 `prisma.usuario.update` com os campos permitidos; nunca tocar em `password`
- [x] 3.7 Ao final, `revalidatePath("/app/profile")` e `revalidatePath("/app", "layout")`

## 4. Verificação

- [x] 4.1 `npm run lint`
- [x] 4.2 Testar manualmente: tela pré-preenchida sem senha; salvar nome/telefone; trocar e-mail para um livre (sucesso) e para um já usado (erro); trocar imagem e ver preview e barra superior atualizados; confirmar que não há nenhum controle de perfil de acesso na tela; acesso sem sessão redireciona para a tela de entrada
