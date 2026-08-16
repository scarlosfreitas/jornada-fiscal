import { prisma } from "@/lib/db";

// Fonte da verdade da carga inicial: references/domain/seed-usuario.md.
// Os ids abaixo são os literais do documento (não gerados) e os hashes de
// senha também são literais (Argon2id já calculado) — nunca re-hasheados
// aqui, ou a senha combinada deixaria de funcionar.

const ADMIN_ID = "019c0b11-a400-7000-8000-000000000000";

// "timestamp atual" do documento, fixado uma vez para toda a execução do seed.
const AGORA = new Date();

// As datas do documento estão em formato brasileiro DD/MM/AAAA.
const VIGENCIA_1_JUL_2026 = new Date("2026-07-01T00:00:00.000Z");
const VIGENCIA_2_JUL_2026 = new Date("2026-07-02T00:00:00.000Z");

interface UsuarioSeed {
  id: string;
  username: string;
  nome: string;
  email: string;
  emailSecundario: string | null;
  telefone: string | null;
}

const SENHA_HASH =
  "$argon2id$v=19$m=65536,t=3,p=4$Hb0e9EC2CGOcaEGyuSYizg$leMiKxtSaRVQt20Adqc+3qqFlEL4qRklUhusiF6kouA";

const USUARIOS: UsuarioSeed[] = [
  {
    id: "019c0b11-a400-7000-8000-000000000000",
    username: "admin",
    nome: "Administrador",
    email: "scarlosfreitas@gmail.com",
    emailSecundario: "scarlosfreitas@gmail.com",
    telefone: "96981411414",
  },
  {
    id: "019c0b11-a400-7000-8000-000000000001",
    username: "usuario",
    nome: "Usuário Comum",
    email: "usuario@email.com",
    emailSecundario: "scarlosfreitas@gmail.com",
    telefone: null,
  },
  {
    id: "019c0b11-a400-7000-8000-000000000002",
    username: "auditor",
    nome: "Auditor",
    email: "auditor@email.com",
    emailSecundario: "scarlosfreitas@gmail.com",
    telefone: null,
  },
  {
    id: "019c0b11-a400-7000-8000-000000000003",
    username: "gerente",
    nome: "Gerente",
    email: "gerente@email.com",
    emailSecundario: "scarlosfreitas@gmail.com",
    telefone: null,
  },
  {
    id: "019c0b11-a400-7000-8000-000000000011",
    username: "carlos.silva",
    nome: "Carlos Vinicius de Freitas Silva",
    email: "carlos.silva@sefaz.ap.gov.br",
    emailSecundario: "scarlosfreitas@gmail.com",
    telefone: "96981411414",
  },
  {
    id: "019c0b11-a400-7000-8000-000000000012",
    username: "carlos.filgueiras",
    nome: "Carlos Marcelo Filgueiras",
    email: "carlos.filgueiras@sefaz.ap.gov.br",
    emailSecundario: null,
    telefone: null,
  },
  {
    id: "019c0b11-a400-7000-8000-000000000013",
    username: "jean.brito",
    nome: "Jean Carlos Brito",
    email: "jean.brito@sefaz.ap.gov.br",
    emailSecundario: null,
    telefone: null,
  },
  {
    id: "019c0b11-a400-7000-8000-000000000014",
    username: "andrei.martins",
    nome: "Andrei Martins",
    email: "andrei.martins@sefaz.ap.gov.br",
    emailSecundario: null,
    telefone: null,
  },
  {
    id: "019c0b11-a400-7000-8000-000000000015",
    username: "beatriz.cruz",
    nome: "Beatriz Cruz",
    email: "beatriz.cruz@sefaz.ap.gov.br",
    emailSecundario: null,
    telefone: null,
  },
];

const USUARIO_ORIGENS = [
  { id: 1, nome: "Seed do sistema" },
  { id: 2, nome: "Cadastro no sistema" },
  { id: 3, nome: "Inserção do AD" },
];

const SITUACOES = [
  { id: 10, nome: "Criado", descricao: "Criado" },
  { id: 20, nome: "Bloqueado", descricao: "Bloqueado" },
  { id: 30, nome: "Ativo", descricao: "Ativo" },
  { id: 40, nome: "Encerrado", descricao: "Encerrado" },
];

const SISTEMAS = [
  { id: 1, nome: "Jornada Fiscal", descricao: "Jornada Fiscal e acompanhamento de regras de alerta" },
  { id: 2, nome: "SATE", descricao: "Sistema corporativo da Secretaria de Receita" },
  { id: 3, nome: "AD", descricao: "Active Directory local" },
  { id: 4, nome: "Matheus", descricao: "Sistema de Gestão de transito Matheus" },
];

const CARGOS = [
  { id: 0, nome: "Administrador do Sistema", efetivo: true },
  { id: 1, nome: "Auditor da Receita", efetivo: true },
  { id: 2, nome: "Fiscal da Receita", efetivo: true },
  { id: 3, nome: "Secretário da Fazenda", efetivo: false },
  { id: 4, nome: "Subsecretário da Receita", efetivo: false },
  { id: 11, nome: "Coordenador da COFIS", efetivo: false },
  { id: 12, nome: "Coordenador da COARE", efetivo: false },
  { id: 13, nome: "Coordenador da COTRI", efetivo: false },
  { id: 14, nome: "Coordenador da COTEC", efetivo: false },
  { id: 21, nome: "Gerente do CEPAF", efetivo: false },
  { id: 22, nome: "Gerente do NUFES", efetivo: false },
  { id: 23, nome: "Gerente do NUSEG", efetivo: false },
  { id: 51, nome: "Presidente da Junta de Fulgamento", efetivo: false },
  { id: 52, nome: "Representante da Junta de Fulgamento", efetivo: false },
  { id: 61, nome: "Presidente do Concelho Fiscal", efetivo: false },
  { id: 62, nome: "Membro do Concelho Fiscal", efetivo: false },
  { id: 101, nome: "Responsável pela Unidade X", efetivo: false },
];

const USUARIO_CARGOS: { usuarioId: string; cargoId: number }[] = [
  { usuarioId: "019c0b11-a400-7000-8000-000000000000", cargoId: 0 },
  { usuarioId: "019c0b11-a400-7000-8000-000000000001", cargoId: 1 },
  { usuarioId: "019c0b11-a400-7000-8000-000000000002", cargoId: 1 },
  { usuarioId: "019c0b11-a400-7000-8000-000000000003", cargoId: 21 },
  { usuarioId: "019c0b11-a400-7000-8000-000000000011", cargoId: 1 },
  { usuarioId: "019c0b11-a400-7000-8000-000000000012", cargoId: 1 },
  { usuarioId: "019c0b11-a400-7000-8000-000000000013", cargoId: 1 },
  { usuarioId: "019c0b11-a400-7000-8000-000000000014", cargoId: 1 },
  { usuarioId: "019c0b11-a400-7000-8000-000000000015", cargoId: 1 },
];

const SETORES: { id: number; paiId: number | null; sigla: string; nome: string }[] = [
  { id: 1, paiId: null, sigla: "SEFAZ", nome: "Secretaria de Estado da Receita" },
  { id: 2, paiId: 1, sigla: "RECEITA", nome: "Subsecretaria da Receita" },
  { id: 3, paiId: 2, sigla: "COFIS", nome: "Coordenadoria de Fiscalização" },
  { id: 4, paiId: 2, sigla: "COARE", nome: "Coordenadoria de Arrecadação" },
  { id: 5, paiId: 2, sigla: "COTRI", nome: "Coordenadoria de Tributação" },
  { id: 6, paiId: 1, sigla: "COTEC", nome: "Cooredenadoria de Tecnologia" },
  { id: 21, paiId: 1, sigla: "CEPAF", nome: "Centro de Pesquisa e Análise Fiscal" },
  { id: 22, paiId: 2, sigla: "NUFES", nome: "Núcleo de Estabelecimento" },
  { id: 23, paiId: 2, sigla: "NUSEG", nome: "Núcleo de Macro Segmentos" },
];

const USUARIO_LOTACOES: { usuarioId: string; setorId: number }[] = USUARIOS.map((usuario) => ({
  usuarioId: usuario.id,
  setorId: 1,
}));

const PERFIS = [
  { id: 1, nome: "Administrador", descricao: "Administrador do Sistema" },
  {
    id: 2,
    nome: "Usuário",
    descricao: "Perfil padrão, todo usuário do AD que realizar ou tentar realizar login.",
  },
  { id: 3, nome: "Cadastrador", descricao: "Pode atribuir ou retirar perfil de outros usuários." },
  { id: 4, nome: "Validador", descricao: "Valida o cadastro do usuário" },
  { id: 5, nome: "Bloqueador", descricao: "Pode bloquear o cadastrado dos usuários" },
  { id: 11, nome: "Gerente CEPAF", descricao: "Perfil Operacional do Gerente do CEPAF" },
  { id: 101, nome: "Auditor", descricao: "Perfil Operacional para Auditor" },
  { id: 102, nome: "Fiscal", descricao: "Perfil Operacional para Fiscal" },
];

const FUNC_CATEGORIAS = [
  { id: 1, nome: "Cadastral", descricao: "Cadastro dos usuarios" },
  { id: 2, nome: "Alertas", descricao: "Gestão de alertas" },
  { id: 3, nome: "Ordem de Serviço", descricao: "Ordem de serviços" },
  { id: 4, nome: "Monitoramento", descricao: "Monitoramento de alvos" },
  { id: 5, nome: "Jornada do Contribuinte", descricao: "Vizualização de informações do Contribuinte" },
  { id: 6, nome: "Operação no SATE", descricao: "Operador do SATE" },
];

const FUNCIONALIDADES: { id: number; nome: string; categoriaId: number }[] = [
  { id: 101, nome: "Cadastrar usuário", categoriaId: 1 },
  { id: 102, nome: "Cadastrar cargo", categoriaId: 1 },
  { id: 103, nome: "Cadastrar setores", categoriaId: 1 },
  { id: 104, nome: "Cadastrar perfis", categoriaId: 1 },
  { id: 105, nome: "Cadastrar funcionalidade", categoriaId: 1 },
  { id: 106, nome: "Validar cadastro", categoriaId: 1 },
  { id: 107, nome: "Bloquear cadastro", categoriaId: 1 },
  { id: 108, nome: "Desbloquear cadastro", categoriaId: 1 },
  { id: 201, nome: "Criar regra de alerta", categoriaId: 2 },
  { id: 202, nome: "Ativar regra de alerta", categoriaId: 2 },
  { id: 203, nome: "Suspender regra de alerta", categoriaId: 2 },
  { id: 204, nome: "Deletar regra de alerta", categoriaId: 2 },
  { id: 301, nome: "Criar Ordem de Serviço", categoriaId: 3 },
  { id: 302, nome: "Delegar Ordem de Serviço", categoriaId: 3 },
  { id: 303, nome: "Suspender de Ordem de Serviço", categoriaId: 3 },
  { id: 304, nome: "Deletar Ordem de Serviço", categoriaId: 3 },
  { id: 401, nome: "Criar monitoramento", categoriaId: 4 },
  { id: 402, nome: "Ativar monitoramento", categoriaId: 4 },
  { id: 403, nome: "Suspender monitoramento", categoriaId: 4 },
  { id: 404, nome: "Encerrar monitoramento", categoriaId: 4 },
  { id: 501, nome: "Vizualizar cadastro de usuario", categoriaId: 5 },
  { id: 502, nome: "Vizualizar cadastro de contribuinte", categoriaId: 5 },
  { id: 503, nome: "Vizualizar recolhimentos", categoriaId: 5 },
  { id: 504, nome: "Vizualizar entrega das declarações", categoriaId: 5 },
  { id: 505, nome: "Vizualizar timeline", categoriaId: 5 },
  { id: 506, nome: "Vizualizar declarações", categoriaId: 5 },
  { id: 601, nome: "Consultar MPF", categoriaId: 6 },
  { id: 602, nome: "Emitir TIF", categoriaId: 6 },
  { id: 603, nome: "Preencher Notificação", categoriaId: 6 },
  { id: 604, nome: "Emitir auto de AI de Embaraço", categoriaId: 6 },
  { id: 605, nome: "Emitir auto de AI Principal", categoriaId: 6 },
];

// Descrições não vieram no documento — os campos `func_desc` são NOT NULL,
// então usamos o próprio nome como descrição mínima.
const PERFIL_FUNCIONALIDADES: { perfilId: number; funcionalidadeId: number }[] = [
  { perfilId: 3, funcionalidadeId: 101 },
  { perfilId: 3, funcionalidadeId: 102 },
  { perfilId: 3, funcionalidadeId: 103 },
  { perfilId: 3, funcionalidadeId: 104 },
  { perfilId: 3, funcionalidadeId: 105 },
  { perfilId: 4, funcionalidadeId: 106 },
  { perfilId: 5, funcionalidadeId: 107 },
  { perfilId: 4, funcionalidadeId: 108 },
  { perfilId: 101, funcionalidadeId: 201 },
  { perfilId: 101, funcionalidadeId: 202 },
  { perfilId: 101, funcionalidadeId: 203 },
  { perfilId: 101, funcionalidadeId: 204 },
  { perfilId: 101, funcionalidadeId: 301 },
  { perfilId: 101, funcionalidadeId: 302 },
  { perfilId: 101, funcionalidadeId: 303 },
  { perfilId: 101, funcionalidadeId: 304 },
  { perfilId: 101, funcionalidadeId: 401 },
  { perfilId: 101, funcionalidadeId: 402 },
  { perfilId: 101, funcionalidadeId: 403 },
  { perfilId: 101, funcionalidadeId: 404 },
  { perfilId: 101, funcionalidadeId: 501 },
  { perfilId: 101, funcionalidadeId: 502 },
  { perfilId: 101, funcionalidadeId: 503 },
  { perfilId: 101, funcionalidadeId: 504 },
  { perfilId: 101, funcionalidadeId: 505 },
  { perfilId: 101, funcionalidadeId: 506 },
  { perfilId: 101, funcionalidadeId: 601 },
  { perfilId: 101, funcionalidadeId: 602 },
  { perfilId: 101, funcionalidadeId: 603 },
  { perfilId: 101, funcionalidadeId: 604 },
];

const USUARIO_PERFIS: { usuarioId: string; perfilId: number }[] = [
  { usuarioId: "019c0b11-a400-7000-8000-000000000000", perfilId: 1 },
  { usuarioId: "019c0b11-a400-7000-8000-000000000003", perfilId: 11 },
  { usuarioId: "019c0b11-a400-7000-8000-000000000002", perfilId: 101 },
];

async function seedUsuariosEOrigem() {
  // Bootstrap circular: Usuario.origem_id aponta para Usuario_Origem, e
  // Usuario_Origem.criado_por aponta de volta para Usuario. Resolvido
  // suspendendo temporariamente o NOT NULL de `origem_id`, inserindo todos
  // os usuários primeiro (com origem_id nulo), depois Usuario_Origem
  // (criado_por já pode apontar para o admin, que já existe), e por fim
  // preenchendo origem_id e reativando a restrição. O admin se
  // auto-referencia em criado_por/atualizado_por — válido porque o próprio
  // id já é conhecido (é literal, não gerado) antes do INSERT.
  await prisma.$executeRaw`ALTER TABLE usuario ALTER COLUMN origem_id DROP NOT NULL`;

  try {
    for (const usuario of USUARIOS) {
      await prisma.$executeRaw`
        INSERT INTO usuario (
          usr_id, usr_username, usr_nome, usr_email, usr_email_secundario,
          usr_password, usr_telefone, usr_image, origem_id,
          criado_por, atualizado_por, criado_em, atualizado_em
        ) VALUES (
          ${usuario.id}::uuid, ${usuario.username}, ${usuario.nome}, ${usuario.email},
          ${usuario.emailSecundario}, ${SENHA_HASH}, ${usuario.telefone}, NULL, NULL,
          ${ADMIN_ID}::uuid, ${ADMIN_ID}::uuid, ${AGORA}, ${AGORA}
        )
        ON CONFLICT (usr_id) DO NOTHING
      `;
    }

    for (const origem of USUARIO_ORIGENS) {
      await prisma.$executeRaw`
        INSERT INTO usuario_origem (origem_id, origem_nome, criado_por, atualizado_por, criado_em, atualizado_em)
        VALUES (${origem.id}, ${origem.nome}, ${ADMIN_ID}::uuid, ${ADMIN_ID}::uuid, ${AGORA}, ${AGORA})
        ON CONFLICT (origem_id) DO NOTHING
      `;
    }

    // Todos os usuários seedados vêm da mesma origem: "Seed do sistema" (id 1).
    await prisma.$executeRaw`UPDATE usuario SET origem_id = 1 WHERE origem_id IS NULL`;
  } finally {
    await prisma.$executeRaw`ALTER TABLE usuario ALTER COLUMN origem_id SET NOT NULL`;
  }

  // Mantém o auto-increment de usuario_origem consistente com os ids fixos inseridos via SQL cru.
  await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('usuario_origem', 'origem_id'), (SELECT MAX(origem_id) FROM usuario_origem))`;
}

async function seedSituacoes() {
  for (const situacao of SITUACOES) {
    await prisma.situacao.upsert({
      where: { id: situacao.id },
      update: {},
      create: {
        id: situacao.id,
        nome: situacao.nome,
        descricao: situacao.descricao,
        criadoPor: ADMIN_ID,
        atualizadoPor: ADMIN_ID,
      },
    });
  }
  await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('situacao', 'situacao_id'), (SELECT MAX(situacao_id) FROM situacao))`;

  for (const usuario of USUARIOS) {
    await prisma.usuarioSituacao.upsert({
      where: {
        usuarioId_situacaoId_vigenciaInicio: {
          usuarioId: usuario.id,
          situacaoId: 10,
          vigenciaInicio: VIGENCIA_1_JUL_2026,
        },
      },
      update: {},
      create: {
        usuarioId: usuario.id,
        situacaoId: 10,
        vigenciaInicio: VIGENCIA_1_JUL_2026,
        vigenciaFim: VIGENCIA_2_JUL_2026,
        criadoPor: ADMIN_ID,
        atualizadoPor: ADMIN_ID,
      },
    });

    await prisma.usuarioSituacao.upsert({
      where: {
        usuarioId_situacaoId_vigenciaInicio: {
          usuarioId: usuario.id,
          situacaoId: 30,
          vigenciaInicio: VIGENCIA_2_JUL_2026,
        },
      },
      update: {},
      create: {
        usuarioId: usuario.id,
        situacaoId: 30,
        vigenciaInicio: VIGENCIA_2_JUL_2026,
        vigenciaFim: null,
        criadoPor: ADMIN_ID,
        atualizadoPor: ADMIN_ID,
      },
    });
  }
}

async function seedSistemas() {
  for (const sistema of SISTEMAS) {
    await prisma.sistema.upsert({
      where: { id: sistema.id },
      update: {},
      create: {
        id: sistema.id,
        nome: sistema.nome,
        descricao: sistema.descricao,
        criadoPor: ADMIN_ID,
        atualizadoPor: ADMIN_ID,
      },
    });
  }
  await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('sistema', 'sistema_id'), (SELECT MAX(sistema_id) FROM sistema))`;
}

async function seedCargos() {
  for (const cargo of CARGOS) {
    await prisma.cargo.upsert({
      where: { id: cargo.id },
      update: {},
      create: {
        id: cargo.id,
        nome: cargo.nome,
        efetivo: cargo.efetivo,
        criadoPor: ADMIN_ID,
        atualizadoPor: ADMIN_ID,
      },
    });
  }
  await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('cargo', 'cargo_id'), (SELECT MAX(cargo_id) FROM cargo))`;

  for (const vinculo of USUARIO_CARGOS) {
    await prisma.usuarioCargo.upsert({
      where: {
        usuarioId_cargoId_vigenciaInicio: {
          usuarioId: vinculo.usuarioId,
          cargoId: vinculo.cargoId,
          vigenciaInicio: VIGENCIA_1_JUL_2026,
        },
      },
      update: {},
      create: {
        usuarioId: vinculo.usuarioId,
        cargoId: vinculo.cargoId,
        vigenciaInicio: VIGENCIA_1_JUL_2026,
        vigenciaFim: null,
        criadoPor: ADMIN_ID,
        atualizadoPor: ADMIN_ID,
      },
    });
  }
}

async function seedSetores() {
  // Os setores sem pai (setor_pai vazio no documento) precisam ser inseridos
  // antes dos que os referenciam; a lista já está na ordem topológica certa
  // (pai sempre antes do filho).
  for (const setor of SETORES) {
    await prisma.setor.upsert({
      where: { id: setor.id },
      update: {},
      create: {
        id: setor.id,
        paiId: setor.paiId,
        sigla: setor.sigla,
        nome: setor.nome,
        criadoPor: ADMIN_ID,
        atualizadoPor: ADMIN_ID,
      },
    });
  }
  await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('setor', 'setor_id'), (SELECT MAX(setor_id) FROM setor))`;

  for (const lotacao of USUARIO_LOTACOES) {
    await prisma.usuarioLotacao.upsert({
      where: {
        usuarioId_setorId_vigenciaInicio: {
          usuarioId: lotacao.usuarioId,
          setorId: lotacao.setorId,
          vigenciaInicio: VIGENCIA_1_JUL_2026,
        },
      },
      update: {},
      create: {
        usuarioId: lotacao.usuarioId,
        setorId: lotacao.setorId,
        vigenciaInicio: VIGENCIA_1_JUL_2026,
        vigenciaFim: null,
        criadoPor: ADMIN_ID,
        atualizadoPor: ADMIN_ID,
      },
    });
  }
}

async function seedPerfisEFuncionalidades() {
  for (const perfil of PERFIS) {
    await prisma.perfil.upsert({
      where: { id: perfil.id },
      update: {},
      create: {
        id: perfil.id,
        nome: perfil.nome,
        descricao: perfil.descricao,
        criadoPor: ADMIN_ID,
        atualizadoPor: ADMIN_ID,
      },
    });
  }
  await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('perfil', 'perfil_id'), (SELECT MAX(perfil_id) FROM perfil))`;

  for (const categoria of FUNC_CATEGORIAS) {
    await prisma.funcCategoria.upsert({
      where: { id: categoria.id },
      update: {},
      create: {
        id: categoria.id,
        nome: categoria.nome,
        descricao: categoria.descricao,
        criadoPor: ADMIN_ID,
        atualizadoPor: ADMIN_ID,
      },
    });
  }
  await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('func_categoria', 'func_categoria_id'), (SELECT MAX(func_categoria_id) FROM func_categoria))`;

  for (const funcionalidade of FUNCIONALIDADES) {
    await prisma.funcionalidade.upsert({
      where: { id: funcionalidade.id },
      update: {},
      create: {
        id: funcionalidade.id,
        nome: funcionalidade.nome,
        descricao: funcionalidade.nome,
        categoriaId: funcionalidade.categoriaId,
        criadoPor: ADMIN_ID,
        atualizadoPor: ADMIN_ID,
      },
    });
  }
  await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('funcionalidade', 'func_id'), (SELECT MAX(func_id) FROM funcionalidade))`;

  for (const vinculo of PERFIL_FUNCIONALIDADES) {
    await prisma.perfilFuncionalidade.upsert({
      where: {
        perfilId_funcionalidadeId_vigenciaInicio: {
          perfilId: vinculo.perfilId,
          funcionalidadeId: vinculo.funcionalidadeId,
          vigenciaInicio: VIGENCIA_1_JUL_2026,
        },
      },
      update: {},
      create: {
        perfilId: vinculo.perfilId,
        funcionalidadeId: vinculo.funcionalidadeId,
        vigenciaInicio: VIGENCIA_1_JUL_2026,
        vigenciaFim: null,
        criadoPor: ADMIN_ID,
        atualizadoPor: ADMIN_ID,
      },
    });
  }

  for (const vinculo of USUARIO_PERFIS) {
    await prisma.usuarioPerfil.upsert({
      where: {
        usuarioId_perfilId_vigenciaInicio: {
          usuarioId: vinculo.usuarioId,
          perfilId: vinculo.perfilId,
          vigenciaInicio: VIGENCIA_1_JUL_2026,
        },
      },
      update: {},
      create: {
        usuarioId: vinculo.usuarioId,
        perfilId: vinculo.perfilId,
        vigenciaInicio: VIGENCIA_1_JUL_2026,
        vigenciaFim: null,
        criadoPor: ADMIN_ID,
        atualizadoPor: ADMIN_ID,
      },
    });
  }
}

async function main() {
  // Ordem de inserção conforme references/domain/seed-usuario.md: começa por
  // Usuario (com origem_id suspenso), depois o restante, que já pode contar
  // com o admin existente para preencher criado_por/atualizado_por.
  await seedUsuariosEOrigem();
  await seedSituacoes();
  await seedSistemas();
  await seedCargos();
  await seedSetores();
  await seedPerfisEFuncionalidades();

  console.log("Seed do domínio Usuario concluído.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
