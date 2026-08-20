# Seed: domínio Regras de Alerta & FollowTheMoney (FtM)

Este documento contém a **carga inicial completa (seed)** para o motor de regras de alerta e inteligência fiscal baseado na ontologia **FollowTheMoney (FtM)**, documentado em [`references/domain/data-model-regra.md`](file:///code/sefaz/jornada-fiscal/references/domain/data-model-regra.md).

---

## 1. Regras Gerais de Seed e Auditoria

**Suspensão e Ordem de Inserção:**
1. A ordem topológica de importação para respeitar as chaves estrangeiras deve ser:
   - `ftm_property_type` (Tipos primitivos e semânticos)
   - `ftm_operator` e `ftm_operator_type` (Catálogo de operadores e compatibilidade)
   - `ftm_schema` (Schemas de entidades e relacionamentos)
   - `ftm_property` (Propriedades e observáveis de cada schema)
   - `ftm_list` e `ftm_list_item` (Watchlists de observáveis com SCD Tipo 2)
   - `ftm_action` (Ações e canais disparados)
   - `ftm_rule` e `ftm_rule_definition` (Regras de alerta e ASTs em JSONB)
2. Durante o seed, todas as tabelas recebem o bloco de auditoria padrão vinculado ao Administrador do Sistema (`019c0b11-a400-7000-8000-000000000000`):

| criado_por | atualizado_por | criado_em | atualizado_em | deletado_em |
| :--- | :--- | :--- | :--- | :--- |
| `019c0b11-a400-7000-8000-000000000000` | `019c0b11-a400-7000-8000-000000000000` | timestamp atual | timestamp atual | NULL |

---

## 2. Tabela: `ftm_property_type`
Catálogo dos tipos de dados primitivos e semânticos FtM.

| type_id | type_name | type_label | type_desc |
| :--- | :--- | :--- | :--- |
| 1 | `string` | Texto | Cadeia de caracteres de texto livre |
| 2 | `number` | Numérico Decimal | Ponto flutuante para valores monetários, alíquotas e pontuações |
| 3 | `integer` | Inteiro | Número inteiro para quantidades, dias, contadores e prazos |
| 4 | `boolean` | Booleano | Valor lógico (Verdadeiro ou Falso) |
| 5 | `date` | Data | Data civil no formato ISO AAAA-MM-DD |
| 6 | `timestamp` | Data e Hora | Timestamp UTC com milissegundos para eventos em tempo real |
| 7 | `identifier` | Identificador / Observável | Chave identificadora única (CNPJ, CPF, IE, Chave NFe, CRC) |
| 8 | `entity` | Referência a Entidade | Aponta para outra entidade / aresta do grafo FtM |
| 9 | `address` | Endereço | Logradouro, Bairro, CEP, Município e UF |
| 10 | `phone` | Telefone | Número de telefone fixo ou celular com DDD |
| 11 | `email` | E-mail | Endereço eletrônico normalizado |
| 12 | `currency` | Moeda | Código de moeda ISO 4217 (padrão BRL) |

---

## 3. Tabela: `ftm_operator`
Catálogo de operadores lógicos e relacionais suportados pelo motor.

| operator_id | operator_code | operator_symbol | operator_label | requires_value | requires_list | operator_desc |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | `EQUAL` | `=` | Igual a | true | false | Comparação exata de igualdade |
| 2 | `NOT_EQUAL` | `!=` | Diferente de | true | false | Comparação de não-igualdade |
| 3 | `GREATER_THAN` | `>` | Maior que | true | false | Maior que (aplicável a números e datas) |
| 4 | `GREATER_THAN_OR_EQUAL` | `>=` | Maior ou igual a | true | false | Maior ou igual a |
| 5 | `LESS_THAN` | `<` | Menor que | true | false | Menor que (aplicável a números e datas) |
| 6 | `LESS_THAN_OR_EQUAL` | `<=` | Menor ou igual a | true | false | Menor ou igual a |
| 7 | `IN` | `em` | Contido no conjunto | true | false | O valor do campo pertence a uma lista literal de constantes |
| 8 | `NOT_IN` | `não em` | Não contido no conjunto | true | false | O valor do campo não pertence à lista literal |
| 9 | `IN_LIST` | `na lista` | Presente na Watchlist | false | true | O observável pertence a uma Watchlist ativa |
| 10 | `NOT_IN_LIST` | `não na lista` | Não presente na Watchlist | false | true | O observável não pertence à Watchlist |
| 11 | `CONTAINS` | `contém` | Contém texto | true | false | Substring presente no texto (case-insensitive) |
| 12 | `STARTS_WITH` | `começa com` | Começa com | true | false | Prefixo de texto |
| 13 | `ENDS_WITH` | `termina com` | Termina com | true | false | Sufixo de texto |
| 14 | `EXISTS` | `preenchido` | Campo existe / não nulo | false | false | Verifica se o atributo está presente e não-nulo |
| 15 | `NOT_EXISTS` | `vazio` | Campo nulo / ausente | false | false | Verifica se o atributo está nulo ou ausente |
| 16 | `BETWEEN` | `entre` | Intervalo fechado | true | false | O valor encontra-se dentro da faixa [min, max] |

---

## 4. Tabela: `ftm_operator_type`
Matriz de compatibilidade entre Operadores e Tipos de Propriedade.

| operator_id | type_id |
| :--- | :--- |
| 1 (`EQUAL`), 2 (`NOT_EQUAL`) | 1 (`string`), 2 (`number`), 3 (`integer`), 4 (`boolean`), 5 (`date`), 6 (`timestamp`), 7 (`identifier`), 11 (`email`), 12 (`currency`) |
| 3 (`GREATER_THAN`), 4 (`GTE`), 5 (`LESS_THAN`), 6 (`LTE`), 16 (`BETWEEN`) | 2 (`number`), 3 (`integer`), 5 (`date`), 6 (`timestamp`) |
| 7 (`IN`), 8 (`NOT_IN`) | 1 (`string`), 2 (`number`), 3 (`integer`), 7 (`identifier`), 12 (`currency`) |
| 9 (`IN_LIST`), 10 (`NOT_IN_LIST`) | 7 (`identifier`), 1 (`string`), 9 (`address`), 10 (`phone`), 11 (`email`) |
| 11 (`CONTAINS`), 12 (`STARTS_WITH`), 13 (`ENDS_WITH`) | 1 (`string`), 9 (`address`), 11 (`email`) |
| 14 (`EXISTS`), 15 (`NOT_EXISTS`) | Todos os tipos (1 a 12) |

---

## 5. Tabela: `ftm_schema`
Catálogo de Schemas de Entidades e Relacionamentos FtM.

| schema_id | schema_name | parent_schema_id | schema_label | is_edge | schema_desc |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | `Thing` | NULL | Objeto Base | false | Entidade raiz de todos os objetos do sistema |
| 2 | `LegalEntity` | 1 | Pessoa Jurídica / Física | false | Entidade com personalidade e identificação fiscal |
| 3 | `Person` | 2 | Pessoa Física | false | Pessoa natural identificada por CPF |
| 4 | `Company` | 2 | Empresa / Contribuinte | false | Pessoa jurídica inscrita no CNPJ e no Cadastro Estadual |
| 5 | `PublicBody` | 2 | Órgão Público | false | Entidades governamentais e administração direta |
| 6 | `FiscalDocument` | 1 | Documento Fiscal Eletrônico | false | NF-e, NFC-e, CT-e, MDF-e, NFCom, NF3e |
| 7 | `TaxDeclaration` | 1 | Declaração Fiscal | false | Escriturações e declarações (PGDASD, EFD, DSTDA) |
| 8 | `CadastralEvent` | 1 | Evento Cadastral | false | Eventos da REDESIM e alterações cadastrais do SATE |
| 9 | `EconomicEvent` | 1 | Operação Econômica | false | Recolhimentos, DIMP, extratos e transações financeiras |
| 10 | `AccountingService`| 1 | Serviço Contábil | true | Vínculo entre Contribuinte e Contador com vigência |
| 11 | `Ownership` | 1 | Participação Societária | true | Vínculo societário entre Empresa e Sócio com cotas e vigência |
| 12 | `Directorship` | 1 | Administração | true | Cargo de administrador exercido por pessoa física |
| 13 | `Representation` | 1 | Representação Legal | true | Vínculo de procurador ou representante outorgado |
| 14 | `TaxResponsibility`| 1 | Responsabilidade Tributária | true | Vínculo de corresponsabilidade fiscal apurada |

---

## 6. Tabela: `ftm_property`
Catálogo exaustivo de propriedades e observáveis por Schema FtM.

| property_id | schema_id | property_name | property_label | type_id | target_schema_id | is_multi | is_observable | property_status | property_desc |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | 1 (`Thing`) | `name` | Nome Principal | 1 (`string`) | NULL | false | false | ATIVA | Nome principal ou razão social do objeto |
| 2 | 1 (`Thing`) | `description` | Descrição | 1 (`string`) | NULL | false | false | ATIVA | Descrição complementar do objeto |
| 3 | 1 (`Thing`) | `country` | País | 1 (`string`) | NULL | false | false | ATIVA | Código de país ISO (padrão: BRA) |
| 4 | 2 (`LegalEntity`) | `taxNumber` | CNPJ / CPF | 7 (`identifier`) | NULL | false | true | ATIVA | Identificador fiscal principal do contribuinte ou pessoa física |
| 5 | 2 (`LegalEntity`) | `stateRegistration` | Inscrição Estadual (IE) | 7 (`identifier`) | NULL | false | true | ATIVA | Inscrição estadual junto à SEFAZ |
| 6 | 2 (`LegalEntity`) | `status` | Situação Cadastral | 1 (`string`) | NULL | false | false | ATIVA | Situação (HABILITADO, SUSPENSO, CANCELADO, BAIXADO, INAPTO) |
| 7 | 2 (`LegalEntity`) | `address` | Endereço Completo | 9 (`address`) | NULL | true | true | ATIVA | Logradouro, número, bairro e município |
| 8 | 2 (`LegalEntity`) | `phone` | Telefone de Contato | 10 (`phone`) | NULL | true | true | ATIVA | Telefone de contato cadastrado |
| 9 | 2 (`LegalEntity`) | `email` | E-mail de Contato | 11 (`email`) | NULL | true | true | ATIVA | Endereço de correio eletrônico |
| 10 | 2 (`LegalEntity`) | `jurisdiction` | UF / Jurisdição | 1 (`string`) | NULL | false | false | ATIVA | UF da circunscrição fiscal (ex: AP, PA, SP) |
| 11 | 2 (`LegalEntity`) | `riskScore` | Pontuação de Risco | 2 (`number`) | NULL | false | false | ATIVA | Score de risco fiscal apurado (0 a 100) |
| 12 | 3 (`Person`) | `birthDate` | Data de Nascimento | 5 (`date`) | NULL | false | false | ATIVA | Data de nascimento da pessoa física |
| 13 | 3 (`Person`) | `motherName` | Nome da Mãe | 1 (`string`) | NULL | false | false | ATIVA | Nome da mãe para conferência cadastral |
| 14 | 3 (`Person`) | `crc` | Registro no CRC | 7 (`identifier`) | NULL | false | true | ATIVA | Número de registro no Conselho Regional de Contabilidade |
| 15 | 3 (`Person`) | `occupation` | Ocupação Principal | 1 (`string`) | NULL | false | false | ATIVA | Ocupação ou profissão declarada |
| 16 | 4 (`Company`) | `incorporationDate` | Data de Abertura | 5 (`date`) | NULL | false | false | ATIVA | Data de constituição registrada na Junta Comercial |
| 17 | 4 (`Company`) | `tempoAberturaDias` | Dias desde a Abertura | 3 (`integer`) | NULL | false | false | ATIVA | Dias decorridos desde a data de constituição |
| 18 | 4 (`Company`) | `capital` | Capital Social | 2 (`number`) | NULL | false | false | ATIVA | Valor total do capital social integralizado |
| 19 | 4 (`Company`) | `regimeEstadual` | Regime Estadual | 1 (`string`) | NULL | false | false | ATIVA | Regime de recolhimento estadual (NORMAL, SUBSTITUTO, ISENTO) |
| 20 | 4 (`Company`) | `regimeFederal` | Regime Federal | 1 (`string`) | NULL | false | false | ATIVA | Regime tributário federal (SIMPLES_NACIONAL, LUCRO_PRESUMIDO, REAL) |
| 21 | 4 (`Company`) | `cnaePrincipal` | CNAE Principal | 7 (`identifier`) | NULL | false | true | ATIVA | Código de atividade econômica principal |
| 22 | 4 (`Company`) | `cnaeSecundario` | CNAE Secundário | 7 (`identifier`) | NULL | true | true | ATIVA | Lista de códigos de atividades econômicas secundárias |
| 23 | 4 (`Company`) | `faturamento12m` | Faturamento Acumulado 12M | 2 (`number`) | NULL | false | false | ATIVA | Valor total de saídas/faturamento nos últimos 12 meses |
| 24 | 4 (`Company`) | `compras12m` | Compras Acumuladas 12M | 2 (`number`) | NULL | false | false | ATIVA | Valor total de entradas/compras nos últimos 12 meses |
| 25 | 4 (`Company`) | `dimp3m` | Movimentação DIMP 3M | 2 (`number`) | NULL | false | false | ATIVA | Movimentação de cartão/PIX declarada na DIMP nos últimos 3 meses |
| 26 | 4 (`Company`) | `accountant` | Contador Responsável | 8 (`entity`) | 3 (`Person`) | false | false | ATIVA | Contador vinculado como responsável técnico |
| 27 | 4 (`Company`) | `shareholders` | Quadro de Sócios (QSA) | 8 (`entity`) | 2 (`LegalEntity`) | true | false | ATIVA | Sócios e acionistas com participação na empresa |
| 28 | 4 (`Company`) | `directors` | Administradores | 8 (`entity`) | 3 (`Person`) | true | false | ATIVA | Administradores e diretores estatutários |
| 29 | 6 (`FiscalDocument`) | `documentType` | Modelo do Documento | 1 (`string`) | NULL | false | false | ATIVA | Modelo do documento (NFE, NFCE, CTE, MDFE, NFCOM, NF3E) |
| 30 | 6 (`FiscalDocument`) | `accessKey` | Chave de Acesso | 7 (`identifier`) | NULL | false | true | ATIVA | Chave de acesso de 44 dígitos do documento |
| 31 | 6 (`FiscalDocument`) | `date` | Data e Hora de Emissão | 6 (`timestamp`) | NULL | false | false | ATIVA | Timestamp de autorização do documento fiscal |
| 32 | 6 (`FiscalDocument`) | `amount` | Valor Total da Nota | 2 (`number`) | NULL | false | false | ATIVA | Valor total bruto do documento fiscal |
| 33 | 6 (`FiscalDocument`) | `taxAmount` | Valor do ICMS | 2 (`number`) | NULL | false | false | ATIVA | Valor total do ICMS próprio destacado |
| 34 | 6 (`FiscalDocument`) | `taxAmountST` | Valor do ICMS-ST | 2 (`number`) | NULL | false | false | ATIVA | Valor total do ICMS retido por Substituição Tributária |
| 35 | 6 (`FiscalDocument`) | `cfop` | CFOP Predominante | 7 (`identifier`) | NULL | false | true | ATIVA | Código Fiscal de Operações e Prestações |
| 36 | 6 (`FiscalDocument`) | `naturezaOperacao` | Natureza da Operação | 1 (`string`) | NULL | false | false | ATIVA | Descrição da natureza da operação fiscal |
| 37 | 6 (`FiscalDocument`) | `emitter` | Emitente | 8 (`entity`) | 4 (`Company`) | false | false | ATIVA | Empresa emitente do documento fiscal |
| 38 | 6 (`FiscalDocument`) | `receiver` | Destinatário | 8 (`entity`) | 4 (`Company`) | false | false | ATIVA | Empresa destinatária do documento fiscal |
| 39 | 6 (`FiscalDocument`) | `transporter` | Transportador | 8 (`entity`) | 4 (`Company`) | false | false | ATIVA | Empresa responsável pelo transporte da carga |
| 40 | 7 (`TaxDeclaration`) | `declarationType` | Tipo de Declaração | 1 (`string`) | NULL | false | false | ATIVA | Tipo (PGDASD, EFD_ICMS_IPI, DSTDA) |
| 41 | 7 (`TaxDeclaration`) | `period` | Período de Apuração | 1 (`string`) | NULL | false | false | ATIVA | Mês/Ano de apuração (formato AAAA-MM) |
| 42 | 7 (`TaxDeclaration`) | `deliveredAt` | Data da Entrega | 6 (`timestamp`) | NULL | false | false | ATIVA | Data e hora em que a declaração foi transmitida |
| 43 | 7 (`TaxDeclaration`) | `debitoDeclarado` | Total de Débitos | 2 (`number`) | NULL | false | false | ATIVA | Total de débitos de ICMS declarados no período |
| 44 | 7 (`TaxDeclaration`) | `creditoDeclarado` | Total de Créditos | 2 (`number`) | NULL | false | false | ATIVA | Total de créditos de ICMS aproveitados |
| 45 | 7 (`TaxDeclaration`) | `icmsRecolher` | ICMS a Recolher | 2 (`number`) | NULL | false | false | ATIVA | Saldo devedor de ICMS a recolher apurado |
| 46 | 7 (`TaxDeclaration`) | `declarant` | Contribuinte Declarante | 8 (`entity`) | 4 (`Company`) | false | false | ATIVA | Empresa que transmitiu a declaração |
| 47 | 9 (`EconomicEvent`) | `eventType` | Tipo de Operação | 1 (`string`) | NULL | false | false | ATIVA | Tipo (RECOLHIMENTO_DARE, DIMP_PIX, DIMP_CARTAO) |
| 48 | 9 (`EconomicEvent`) | `eventDate` | Data da Operação | 6 (`timestamp`) | NULL | false | false | ATIVA | Data da transação financeira |
| 49 | 9 (`EconomicEvent`) | `amount` | Valor da Operação | 2 (`number`) | NULL | false | false | ATIVA | Valor transacionado |
| 50 | 9 (`EconomicEvent`) | `receiverPixKey` | Chave PIX Destino | 7 (`identifier`) | NULL | false | true | ATIVA | Chave PIX receptora da transferência |
| 51 | 9 (`EconomicEvent`) | `party` | Contribuinte Titular | 8 (`entity`) | 4 (`Company`) | false | false | ATIVA | Contribuinte vinculado à movimentação |
| 52 | 10 (`AccountingService`)| `client` | Empresa Cliente | 8 (`entity`) | 4 (`Company`) | false | false | ATIVA | Empresa que contratou o serviço contábil |
| 53 | 10 (`AccountingService`)| `accountant` | Profissional Contábil | 8 (`entity`) | 3 (`Person`) | false | false | ATIVA | Contador responsável técnico |
| 54 | 10 (`AccountingService`)| `startDate` | Início da Responsabilidade | 5 (`date`) | NULL | false | false | ATIVA | Data de início do vínculo contábil |
| 55 | 10 (`AccountingService`)| `endDate` | Fim da Responsabilidade | 5 (`date`) | NULL | false | false | ATIVA | Data de término/rescisão do vínculo |
| 56 | 11 (`Ownership`) | `asset` | Empresa Investida | 8 (`entity`) | 4 (`Company`) | false | false | ATIVA | Empresa na qual o titular detém participação |
| 57 | 11 (`Ownership`) | `owner` | Sócio / Titular | 8 (`entity`) | 2 (`LegalEntity`) | false | false | ATIVA | Sócio pessoa física ou jurídica |
| 58 | 11 (`Ownership`) | `percentage` | Percentual de Participação | 2 (`number`) | NULL | false | false | ATIVA | Percentual de cotas no capital social (0.00 a 100.00) |
| 59 | 11 (`Ownership`) | `startDate` | Início da Participação | 5 (`date`) | NULL | false | false | ATIVA | Data de ingresso no quadro societário |
| 60 | 11 (`Ownership`) | `endDate` | Saída da Sociedade | 5 (`date`) | NULL | false | false | ATIVA | Data de retirada / cessão das cotas |
| 61 | 12 (`Directorship`) | `organization` | Empresa Administrada | 8 (`entity`) | 4 (`Company`) | false | false | ATIVA | Empresa sob administração |
| 62 | 12 (`Directorship`) | `director` | Administrador | 8 (`entity`) | 3 (`Person`) | false | false | ATIVA | Pessoa física investida no cargo de direção |
| 63 | 12 (`Directorship`) | `role` | Cargo / Qualificação | 1 (`string`) | NULL | false | false | ATIVA | Qualificação do administrador (Sócio-Administrador, Diretor) |
| 64 | 12 (`Directorship`) | `startDate` | Início do Mandato | 5 (`date`) | NULL | false | false | ATIVA | Data de início da investidura no cargo |
| 65 | 12 (`Directorship`) | `endDate` | Fim do Mandato | 5 (`date`) | NULL | false | false | ATIVA | Data de destituição ou término do mandato |

---

## 7. Tabela: `ftm_list`
Watchlists de Observáveis para Cruzamento em Tempo Real.

| list_id | list_code | list_name | property_id | list_status | list_desc |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 101 | `LST_CNPJ_NOTEIRAS` | CNPJs Suspeitos de Empresas Noteiras | 4 (`taxNumber`) | ATIVA | Empresas com indícios de emissão de documentos inidôneos sem circulação real de mercadorias |
| 102 | `LST_CONTADORES_ALVO_OP_CADEADO` | Contadores Alvo de Investigação Fiscal | 14 (`crc`) | ATIVA | Profissionais contábeis investigados por abertura em massa de empresas fantasmas |
| 103 | `LST_SOCIOS_LARANJAS_CONHECIDOS` | CPFs de Sócios Laranjas / Interpostas Pessoas | 4 (`taxNumber`) | ATIVA | Pessoas físicas sem capacidade econômico-financeira usadas em quadros societários fraudulentos |
| 104 | `LST_CNAES_BEBIDAS_COMBUSTIVEIS` | CNAEs com Regime Especial de ST | 21 (`cnaePrincipal`) | ATIVA | Setores econômicos com regimes tributários especiais e acompanhamento intensivo |
| 105 | `LST_ENDERECOS_VIRTUAIS_RISCO` | Endereços de Fachada / Coworkings Suspeitos | 7 (`address`) | ATIVA | Endereços que concentram dezenas de empresas inaptas ou com irregularidades fiscais |
| 106 | `LST_CHAVES_PIX_SUSPEITAS` | Chaves PIX Vinculadas a Operações Atípicas | 50 (`receiverPixKey`) | ATIVA | Chaves PIX utilizadas para recebimentos de vendas sem emissão de NFC-e |

---

## 8. Tabela: `ftm_list_item`
Itens com Histórico Temporal (SCD Tipo 2) e Governança Fiscal.

| list_item_id | list_id | item_value | item_reason_in | item_reason_out | valid_from | valid_to |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | 101 | `04123456000178` | Operação Cadeado Fiscal - Dossiê CEPAF 2026/04 | NULL | 2026-07-01 00:00:00 | NULL |
| 2 | 101 | `05987654000133` | Mandado Fiscal MPF-2026-881 | NULL | 2026-07-01 00:00:00 | NULL |
| 3 | 101 | `03111222000199` | Inquérito Policial Civil 441/2025 | Regularização fiscal comprovada com vistorias | 2026-01-01 00:00:00 | 2026-06-30 23:59:59 |
| 4 | 102 | `AP-004512/O` | Responsável por 12 empresas inaptas por inexistência de fato | NULL | 2026-07-01 00:00:00 | NULL |
| 5 | 102 | `PA-009821/O` | Investigação COFIS/NUSEG - Operação Carga Fantasma | NULL | 2026-07-01 00:00:00 | NULL |
| 6 | 103 | `12345678900` | Sócio formal em 18 empresas sem declaração de renda correspondente | NULL | 2026-07-01 00:00:00 | NULL |
| 7 | 103 | `98765432100` | Beneficiário de programas sociais figurando com capital de R$ 5M | NULL | 2026-07-01 00:00:00 | NULL |
| 8 | 104 | `4723-7/00` | Comércio varejista de bebidas | NULL | 2026-07-01 00:00:00 | NULL |
| 9 | 104 | `4681-8/01` | Comércio atacadista de combustíveis e lubrificantes | NULL | 2026-07-01 00:00:00 | NULL |
| 10 | 105 | `Av. FAB, 1000 - Sala 12, Macapá - AP` | Endereço com 42 empresas registradas sem espaço físico | NULL | 2026-07-01 00:00:00 | NULL |
| 11 | 106 | `96981411414` | Chave PIX vinculada a CNPJ cancelado recebendo créditos diários | NULL | 2026-07-01 00:00:00 | NULL |

---

## 9. Tabela: `ftm_action`
Catálogo de Ações e Canais de Alerta.

| action_id | action_code | action_name | action_desc |
| :--- | :--- | :--- | :--- |
| 1 | `INDICACAO_TELA` | Indicação em Tela | Destaca o contribuinte com badge amarelo no painel operacional |
| 2 | `ALERTA_TELEGRAM` | Alerta no Telegram | Dispara notificação imediata via bot para o canal de plantão fiscal |
| 3 | `GERAR_OS` | Gerar Ordem de Serviço | Cria automaticamente uma Ordem de Serviço de Intervenção Fiscal |
| 4 | `FLAG_MALHA` | Retenção em Malha Fiscal | Bloqueia emissão ou suspende autorização automática no SATE |
| 5 | `EMAIL` | Notificação por E-mail | Envia relatório circunstanciado para a coordenadoria responsável |
| 6 | `PRODOC` | Abertura de PRODOC | Autua processo administrativo eletrônico no sistema Prodoc |

---

## 10. Tabela: `ftm_rule` & `ftm_rule_definition`

### Regra 1: `NFE_0001`
- **Código**: `NFE_0001`
- **Nome**: NFe de Alto Valor com Contador Alvo de Investigação Fiscal
- **Descrição**: Identifica notas fiscais com valor expressivo emitidas por empresas vinculadas a contadores sob investigação, quando destinadas a estabelecimentos recém-abertos.
- **Target Schema**: `FiscalDocument` (id 6)
- **Prioridade**: 900
- **Situação**: `ATIVA`
- **Definição AST JSONB**:

```json
{
  "version": "1.0",
  "name": "NFe de Alto Valor com Contador Alvo de Investigação Fiscal",
  "target_schema": "FiscalDocument",
  "conditions": {
    "all": [
      {
        "path": "amount",
        "operator": "GREATER_THAN",
        "value": 50000.00
      },
      {
        "path": "emitter.accountant.crc",
        "operator": "IN_LIST",
        "list_id": 102,
        "list_code": "LST_CONTADORES_ALVO_OP_CADEADO"
      },
      {
        "path": "receiver.tempoAberturaDias",
        "operator": "LESS_THAN",
        "value": 60
      }
    ]
  },
  "actions": [
    {
      "type": "GERAR_OS",
      "severity": "ALTA",
      "params": {
        "tipo_intervencao": "VISTORIA_TRANSITO",
        "mensagem": "NFe emitida por empresa com contador investigado para destinatário recém-aberto."
      }
    },
    {
      "type": "ALERTA_TELEGRAM",
      "severity": "ALTA",
      "params": {
        "canal": "PLANTÃO_FISCAL"
      }
    }
  ]
}
```

---

### Regra 2: `CAD_0002`
- **Código**: `CAD_0002`
- **Nome**: Alteração Societária com Ingresso de Sócio Laranja
- **Descrição**: Alerta quando uma alteração cadastral no SATE/RedeSIM inclui sócio que consta na lista de interpostas pessoas conhecidas.
- **Target Schema**: `Company` (id 4)
- **Prioridade**: 850
- **Situação**: `ATIVA`
- **Definição AST JSONB**:

```json
{
  "version": "1.0",
  "name": "Alteração Societária com Ingresso de Sócio Laranja",
  "target_schema": "Company",
  "conditions": {
    "all": [
      {
        "path": "shareholders.taxNumber",
        "operator": "IN_LIST",
        "list_id": 103,
        "list_code": "LST_SOCIOS_LARANJAS_CONHECIDOS"
      },
      {
        "path": "capital",
        "operator": "GREATER_THAN",
        "value": 100000.00
      }
    ]
  },
  "actions": [
    {
      "type": "FLAG_MALHA",
      "severity": "CRITICA",
      "params": {
        "score_risco": 95,
        "motivo": "Empresa com capital elevado tendo sócio registrado em lista de fraude cadastral."
      }
    },
    {
      "type": "ALERTA_TELEGRAM",
      "severity": "ALTA",
      "params": {
        "canal": "COFIS_CADASTRO"
      }
    }
  ]
}
```

---

### Regra 3: `DIMP_0003`
- **Código**: `DIMP_0003`
- **Nome**: Faturamento DIMP Incompatível com Simples Nacional
- **Descrição**: Detecta empresas do Simples Nacional cuja movimentação de cartão/PIX na DIMP nos últimos 3 meses excede o limite proporcional do regime.
- **Target Schema**: `Company` (id 4)
- **Prioridade**: 700
- **Situação**: `ATIVA`
- **Definição AST JSONB**:

```json
{
  "version": "1.0",
  "name": "Faturamento DIMP Incompatível com Simples Nacional",
  "target_schema": "Company",
  "conditions": {
    "all": [
      {
        "path": "regimeFederal",
        "operator": "EQUAL",
        "value": "SIMPLES_NACIONAL"
      },
      {
        "path": "dimp3m",
        "operator": "GREATER_THAN",
        "value": 1200000.00
      }
    ]
  },
  "actions": [
    {
      "type": "FLAG_MALHA",
      "severity": "ALTA",
      "params": {
        "score_risco": 75,
        "mensagem": "Movimentação financeira trimestral excede o teto operacional do Simples Nacional."
      }
    }
  ]
}
```
