# PRD - Gertor de Alertas (Jornada Fiscal)

## 1. Visão Geral

O Gertor de Alertas é o sistema de apoio à jornada fiscal — o conjunto de rotinas que compõe o trabalho de um auditor fiscal. Hoje essa rotina exige excesso de cliques e troca de telas no sistema corporativo para reunir as informações necessárias para avaliar a situação de um contribuinte. O Gertor de Alertas centraliza essas informações em telas rápidas e diretas, trazendo o histórico do contribuinte, declarações entregues, documentos emitidos, recolhimentos e relacionamentos societários em um único lugar.

O sistema se apoia em quatro pilares:

1. **Regras e alertas** — regras configuráveis que disparam avisos a partir de gatilhos como emissão de documentos eletrônicos, mudanças cadastrais ou declarações do contribuinte.
2. **Ordens de serviço** — gestão e acompanhamento das intervenções (vistorias em trânsito, em estabelecimento, sigilosas, e mandados/MPF) originadas pelos alertas.
3. **Canais de comunicação** — Telegram, tela do sistema, e-mail, Prodoc e aviso pessoal, usados para notificar alertas e prazos.
4. **Jornada do contribuinte** — módulo tipo CRM que acompanha a história do contribuinte (situação cadastral, societária, contadores, procedimentos fiscais, notificações) e permite anotações internas dos fiscais.

O acesso a dados do sistema corporativo (SATE) não é feito diretamente ao banco: uma camada de API de integração, desenvolvida em projeto separado, expõe essas informações ao Gertor de Alertas. Da mesma forma, a plataforma de dados moderna (Kubernetes, MinIO, Kafka, Iceberg, Trino) que sustenta a análise em escala é um projeto independente, fora do escopo deste PRD.

---

## 2. Objetivos

* Reduzir o número de telas e cliques necessários para avaliar a situação de um contribuinte, centralizando histórico, declarações, documentos, recolhimentos e relacionamentos em uma única jornada de navegação.
* Gerar alertas automáticos a partir de regras configuráveis, com gatilhos de documentos eletrônicos (NFe, NFCe, CTe, MDFe), mudanças cadastrais (RedeSim, SATE), declarações e dados abertos.
* Classificar avisos por nível de gravidade (indicação em tela, alerta com aviso no Telegram, intervenção que gera ordem de serviço), tornando a régua de risco explícita para o usuário.
* Permitir a gestão de ponta a ponta das ordens de serviço de intervenção (aberta, solicitada, delegada, concluída, rejeitada, decaída), incluindo a efetivação da vistoria (sim, não atendida, alvo não encontrado).
* Distribuir avisos e prazos pelos canais definidos por regra (tela, Telegram, e-mail, Prodoc, aviso pessoal), reduzindo a dependência de consulta manual ao sistema corporativo.
* Apresentar a jornada do contribuinte como uma timeline única, incluindo eventos cadastrais, societários, fiscais e anotações internas visíveis apenas aos fiscais.
* Automatizar operações repetitivas do SATE relacionadas ao acompanhamento de um procedimento fiscal (ciência de MPF, emissão de TIF, cadastro de autos, geração de Prodoc), reduzindo o trabalho manual do auditor no sistema corporativo.
* Controlar o acesso ao sistema por perfis com permissões e restrições específicas, integrando-se futuramente à base do Active Directory para validação de login, cargo e lotação.

---

## 3. Público-alvo

* **Auditor fiscal (perfil Usuário)** — consulta alertas, monitoramentos, a jornada do contribuinte e atua nas ordens de serviço de intervenção.
* **Administrador** — acesso total ao sistema; cria novos perfis e inclui funcionalidades; autentica-se com senha própria, fora do AD.
* **Cadastrador** — atribui perfis de acesso a outros usuários.
* **Bloqueador de Cadastro** — aplica bloqueios de acesso a usuários (ex.: trocas de e-mail secundário ou de senha via administrador do AD).
* **Validador de Cadastro** — libera ou mantém bloqueios de acesso aplicados pelo perfil Bloqueador de Cadastro.
* **Gestão de OS de intervenção** — perfil responsável por validar e encaminhar as intervenções (vistorias) a outros setores.
* **Outros setores fiscais** — recebem e executam as ordens de serviço de intervenção delegadas (vistoria em trânsito, em estabelecimento, sigilosa).

---

## 4. Navegação principal

A navegação do protótipo segue uma única árvore de informação fiscal, unificando os itens observados nas telas de referência e descartando conceitos genéricos de SaaS de campo (ex.: "Empresas", "Agenda de campo", "Financeiro", "OS de manutenção") que não têm correspondência no domínio descrito em `references/domain/regras-negocio.md`:

* **Painel** — visão geral operacional: KPIs de alertas gerados, monitoramentos ativos, OS em aberto e efetivação das intervenções; gráficos por período (7/30/90 dias); alertas recentes e monitoramentos em destaque.
* **Regras**
  * Regras de alerta — cadastro e consumo de regras (gatilho, parâmetros, período de vigência, restrição de consumo por perfil/usuário, canal de comunicação).
  * Alertas gerados — lista dos avisos disparados pelas regras, filtrável por nível (indicação, alerta, intervenção), canal e tipo de alvo (CNPJ, grupo econômico, sócio).
* **Monitoramento** — entidades monitoradas (CNPJ, CNPJ raiz, grupo econômico, sócio, contador), individualmente ou em grupo, com nível de monitoramento (amarelo/indicação, vermelho/alerta, cinza/intervenção) e prazo de vigência.
* **Contribuintes**
  * Histórico — timeline vertical de eventos do contribuinte.
  * Situação cadastral — posição cadastral atual (CNPJ, IE, razão social, capital social, endereço, contador, administrador, regime estadual/federal) com histórico por campo.
  * Recolhimentos — recolhimentos por código de receita.
  * Entrega de declarações — PGDASD, EFD, DSTDA, por período (mês, mês-1, mês-2, 3/6/12 meses).
  * Valores declarados — rubricas da EFD/PGDASD por período (12 últimos meses, ano corrente).
  * Emissão de documentos — NFe, NFCe, CTe, MDFe, DIMP, EFD.
* **Ordens de serviço** — OS de intervenção (vistoria em trânsito, em estabelecimento, sigilosa), com situação (aberta, solicitada, delegada, concluída, rejeitada, decaída) e efetivação (sim, não atendida, alvo não encontrado). O acompanhamento de uma OS integra as ações do **Operador do SATE** (registro de ciência do MPF, emissão de TIF, cadastro de Auto de embaraço/infração, acompanhamento de MPF, geração de Prodoc).
* **Relatórios** — painéis analíticos (mencionados na navegação das telas de referência; conteúdo específico a detalhar).
* **Configurações**
  * Usuários — cadastro, situação (ativo/bloqueado/pendente/inativo) e atribuição de perfis.
  * Perfis e permissões — cadastro de perfis e das funcionalidades habilitadas em cada um.
  * Preferências gerais — configurações do usuário/sistema.

Uma busca global de funcionalidades ("Buscar funcionalidade") está disponível no topo de todas as telas internas, permitindo navegação direta a qualquer item acima sem depender do menu lateral.

---

## 5. Fonte de dados

Os dados iniciais serão carregados através de Seed a partir da pasta `./fontes` do projeto.

> **Pendência:** os arquivos concretos que irão compor `./fontes` ainda não foram definidos/entregues. A lista abaixo descreve os *tipos* de dado necessários para popular o protótipo, deduzidos das telas de referência e do `regras-negocio.md`; os arquivos-fonte devem ser fornecidos antes da implementação do seed.

Dados iniciais previstos:

* Contribuintes (CNPJ, IE, razão social, data de abertura, capital social, endereço, contador, administrador, situação cadastral, regime estadual e federal — com histórico de cada campo)
* Grupos econômicos (oficiais, com sócios em comum, e informais, com sócios ocultos ou contadores em comum)
* Documentos eletrônicos emitidos (NFe, NFCe, CTe, MDFe, DIMP, EFD)
* Declarações entregues (PGDASD, EFD, DSTDA) por período
* Valores declarados por rubrica da EFD/PGDASD (débitos, créditos, ajustes, saldo, ICMS a recolher, entre outros)
* Recolhimentos por código de receita
* Regras de alerta cadastradas (tipo de gatilho, parâmetros, vigência, canais, restrição de consumo)
* Alertas/avisos gerados pelas regras, com nível (indicação, alerta, intervenção) e canal utilizado
* Monitoramentos ativos e entidades monitoradas (CNPJ, CNPJ raiz, grupo econômico, sócio, contador)
* Ordens de serviço de intervenção (tipo, situação, efetivação, canal, histórico de andamento)
* Eventos da jornada do contribuinte (timeline: cadastro, societário, fiscal, contato)
* Usuários e perfis de acesso (dados espelhados do AD: login, cargo, lotação)

---

## 6. Estrutura do protótipo

A estrutura esperada é:

```text
prototipo/
    css/
        site.css                 < estilos globais
    js/
        site.js
    docs/
        PRD.md
    fontes/
        (arquivos de dados de seed — a definir, ver seção 5)
    landing.html                 < página institucional / apresentação do produto
    dashboard.html                < painel operacional
    regras-alerta.html            < regras de alerta
    alertas-gerados.html          < alertas gerados pelas regras
    monitoramento.html            < entidades monitoradas
    contribuinte.html             < jornada do contribuinte (histórico, situação, recolhimentos, declarações, valores, documentos)
    ordens-servico.html           < ordens de serviço de intervenção
    lista-usuarios.html           < cadastro de usuários
    perfis.html                   < cadastro de perfis e permissões
    design-system.html            < guia de estilo (cores, tipografia, espaçamento, componentes)
```

---

## 7. Fora do escopo

Não faz parte da primeira versão:

* A plataforma de dados moderna (Kubernetes, MinIO, Kafka, Iceberg, Trino) — projeto independente, fora do escopo deste sistema.
* A camada de API de integração com o sistema corporativo (SATE) — desenvolvida em projeto separado; este protótipo assume que os dados já chegam por essa camada.
* Login por certificado digital A3 ICP-Brasil e funcionalidades limitadas para quem não possui certificado (ver seção 9, Evoluções Futuras).
* Módulos genéricos de SaaS de campo presentes em parte das telas de referência sem correspondência no domínio fiscal: Empresas (como cadastro comercial), Agenda de campo, Financeiro/faturamento, OS de manutenção.
* Visualização em grafo dos relacionamentos entre contribuintes, sócios e contadores (mencionada como ambição do produto, mas sem tela de referência construída — ver seção 9).
* Conteúdo detalhado da tela de Relatórios (a estrutura de navegação a reserva, mas os painéis específicos não foram detalhados nas referências).

---

## 8. Critérios de aceitação

* O usuário consegue visualizar o histórico do contribuinte (timeline), a situação cadastral atual, recolhimentos, declarações, valores declarados e documentos emitidos sem sair da jornada do contribuinte.
* Campos históricos da situação cadastral (endereço, contador, situação cadastral, regime estadual, regime federal) exibem havia quanto tempo estão no valor atual e permitem consultar o histórico anterior.
* Uma regra de alerta cadastrada com gatilho, parâmetros e canal de comunicação gera um alerta visível na tela de Alertas Gerados quando o gatilho ocorre, respeitando a restrição de consumo (perfis/usuários) configurada.
* O nível do alerta (amarelo/indicação, vermelho/alerta, cinza/intervenção) determina o comportamento esperado: indicação em tela, aviso via Telegram, ou abertura de OS de intervenção, respectivamente.
* Um monitoramento pode ser criado sobre uma ou mais entidades (CNPJ, CNPJ raiz, grupo econômico, sócio, contador), simultaneamente, com prazo de início e fim opcional.
* Uma OS de intervenção percorre as situações previstas (aberta, solicitada, delegada, concluída, rejeitada, decaída) e registra a efetivação (sim, não atendida, alvo não encontrado) ao ser concluída.
* Toda modificação em uma OS de intervenção fica registrada para fins de auditoria.
* Um usuário sem perfil atribuído, ao tentar logar, é direcionado a uma página orientando-o a contatar um cadastrador.
* Um perfil Bloqueador de Cadastro consegue aplicar um bloqueio de usuário, e esse bloqueio só é removido por um perfil Validador de Cadastro.
* O Operador do SATE executa, a partir de uma OS de intervenção, as ações de registro de ciência do MPF, emissão de TIF, cadastro de Auto de embaraço/infração, acompanhamento de MPF e geração de Prodoc.

---

## 9. Evoluções Futuras

* Login por certificado digital A3 ICP-Brasil, com conjunto de funcionalidades reduzido para usuários que ainda não utilizam certificado A3.
* Visualização em grafo dos relacionamentos entre contribuintes, sócios, contadores e grupos econômicos (formais e informais).
* Expansão dos tipos de gatilho de regra de alerta para novas fontes de dados abertos.
* Detalhamento completo do módulo de Relatórios/painéis analíticos.
