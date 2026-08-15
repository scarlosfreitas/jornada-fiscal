
# Regras de alertas

## Objetivo

Este documento define as regras de negócio do sistema de alertas de documentos eletrônicos e mudanças cadastrais.

---

## Login de usuários

O controle de senha será gerido inicialmente pela aplicação, mas ainda no PRD será utilizado o AD para validação do login, cargo e lotação.

- Inicialmente controlada pela aplicação
- Ainda no PRD será utilizada a senha do AD.
- Todo usuário do AD será um usuário potencial, 
- Usuários sem perfil serão registrados e direcionados para uma pagina indicando que ele deve contatar um cadastrador.
- O setor do usuário é verificada 

**Melhorias futuras:**
- Login por certificado A3 icpbrasil
- funcionalidade limitadas para quem não usa certificado A3

---

## Perfis

Perfis de acesso do sistema.  

- Novos podem ser cadastrados e funcionalidades incluídas neles;
- Cada usuário pode ter várias perfils
- admin tem senha fora do AD

**Perfis iniciais:**
- **Usuário:** perfil padrão, todo usuário do AD que realizar ou tentar realizar login.
- **Administrador:** acesso total e senha fora do AD. Cria novos perfis e inclui funcionalidades.
- **Cadastrador:** pode atribuir perfis a outros usuários.
- **Bloqueador de cadastro:** pode aplicar bloqueio a cadastro de usuários.
- **Validador de cadastro:** pode retirar ou adicionar restrições de bloqueio de usuário.

---

## Bloqueio de usuário

Bloqueios de usuário são liberados com a validação do perfil "Validador de Cadastro".

- Bloqueios aplicados pelo perfil "Bloqueador de Cadastro"
- Mudanças de login realizadas pelo administrador do AD geram bloqueio (trocas de senha devem acontecer por recuperação com e-meil secundário).
- Troca de e-mail secundário geram bloqueio (precisam de validação).
- Estrutura de lotação do AD inconsistente (a lotação atual do servidor deve estar corretamente estruturada no AD).

---

## Monitoramento

Entidades monitoradas podem servir como alvo de regras de alerta. O monitoramento pode adicionar uma ou mais entidades, inclusive, de categorias diferentes.

- **Entidades monitoradas (individualmente ou em grupo):**
	- CNPJ
	- CNPJ Raiz
	- Grupo Econômico
	- Sócio
	- Contador
- Prazo: início e fim (opcional)
- Nível de monitoramento

---

## Nível de monitoramento

A utilização da nomenclaturas de canais do GTRAN podem causar confusão, uma classificação mais direta do que se espera pode ser mais adequado.

- Amarelo/Indicação em tela (ex. empresas recém criadas)
- Vermelho/Alerta: gera avisos telegram
- Cinza/intervenção (geram os de intervenção)

---

## Grupo Econômico

Um grupo econômico pode ser criado para rastreamento em grupo, sejam ele oficiais (sócios em comum com controle societário) ou informais (grupos com sócios ocultos ou com contadores em comum).

---

## Regras de alerta

Regras para geração de alertas a partir de gatilhos cadastrados. Elas poderão ser consumidas pelos usuários, podendo ser restringidas em sua configuração.

- Tipo de gatilho: DFe, RedeSIM, Cadastral, Dados abertos
- Parâmetros do gatilho: dependem do tipo de gatilho
- Início e fim (opcional)
- Restrição de consumo: quais perfis ou usuários poderão consumir.
- Meio de comunicação: Tela, Telegram ou indicação de parada no posto

## Tipo de Gatilho de regra de alerta

**Documentos eletrônicos em geral:**
- Tipos
	- Nota Fiscal Eletrônica - NFe
	- Nota Fiscal ao Consumidor Eletrônica- NFCe
	- Conhecimento de Transporte Eletrônico- CTe
	- Manifesto de Carga Eletrônico - MDFe 
- Parâmetros
	- Emissor
	- Destinatário
	- Valor individual
	- Valor por período (diario, mensal, anual ou 12 meses)
**Cadastral:**
- Tipos:
	- RedeSim
	- Cadastro SATE: 
		- Quando forem cadastradas, o registro atual é registrado no sistema. Cada nova modificação no cadastro é comparado e uma vez ao dia é verificado a situação com a atual do SATE (nem todas modificação cadastral gera FIAC).
		- Mudanças cadastrais do SATE rastreadas:
			- Situação cadastral
			- Regime estadual
			- Regime federal
			- Contador
			- Sócio
Transito:
- Fonte: sistema Matheus
- Alguns tipos de intervenção em canal do Sistema Matheus poderão ser monitorados pelo sistema.

---

## Canais de comunicação

- Tela de monitoramento
- Telegram
- Avisos no posto fiscal
- PRODOC
- Pessoal
- E-mail

---

## Ordens de Serviço

Os monitoramentos mais graves ou avisos escolhidos podem gerar OS de intervenção, que deverão ser efetivadas por outros setores. As intervenções podem ser aprovadas e encaminhadas a outros setores, sendo necessário validação do perfil **Gestão de OS de intervenção**.

Cada modificação nela deverá ser registrada, para fins de auditoria.

Tipos de intervenção:

- Vistoria em trânsito
- Vistoria em estabelecimento
- Vistoria sigilosa

Situação da intervenção:

- Aberta
- Solicitada
- Delegada
- Concluída (intervenção solicitada e concluída)
- Rejeitada (rejeitada pelo solicitado ou delegado)
- Decaída (prazo padrão de 30 dias)


Efetivação:

- Sim
- Não atendida
- Alvo não encontrado
---

## Operador do SATE

Sistema de automação de cliques no SATE. 

Operações:

- Registro de ciência do MPF
- Emissão de TIF
- Cadastro de Auto de embaraço
- Cadastro de Auto de infração
- Acompanhamento de MPF
- Gerar PRODOC

---


## Jornada do Contribuinte

### Histórico do Contribuinte

- Título: Histórico do Contribuinte
- Substítulo: Eventos do ocorridos ao longo do tempo
- Timeline vertical com diversos eventos ocorridos com o contribuinte como:
	- Situação cadastral, societária, contador, administrador, regime estadual ou federal, capital social e eventos na REDE SIM.

### Pagina de Situação cadastral

- Posição cadastral atual
	- CNPJ
	- IE
	- Razão social
	- Data de abertura
	- Capital Social
	- Endereço (quanto tempo)(link histórico pop-up)
	- Contador (quanto tempo)(link histórico pop-up)
	- Administrador
	- Situação cadastral (quanto tempo)(link histórico pop-up)
	- Regime Estadual (quanto tempo)(link histórico pop-up)
	- Regime Federal (quanto tempo)(link histórico pop-up)

### Pagina de Recolhimentos

- Recolhimentos por código de receita

### Controle de Declarações

- Entregas em diversos períodos
- Tipos:
	- Código
	- PGDASD 
	- EFD 
	- DSTDA
- Periodos apresentado:
	-  mês
	- mês -1
	- mês -2
	- total  3 meses
	- total 6 meses
	- total ano

### Valores declarados

**Head:** 
- Valores declarados nas escrituraçãos
- Tipos de declaração:
	- PGDASD
	- EFD
- Periodos apresentados:
	- 12 ultimos meses
	- ano corrente
- Rubricas apresentadas:
	- VL_TOT_DEBITOS | Valor total dos débitos por "Saídas e prestações com débito do imposto" 
	- VL_AJ_DEBITOS | Valor total dos ajustes a débito decorrentes do documento fiscal.
	- VL_TOT_AJ_DEBITOS | Valor total de "Ajustes a débito"
	- VL_ESTORNOS_CRED | Valor total de Ajustes “Estornos de créditos” 
	- VL_TOT_CREDITOS | Valor total dos créditos por "Entradas e aquisições com crédito do imposto" 
	- VL_AJ_CREDITOS | Valor total dos ajustes a crédito decorrentes do documento fiscal.
	- VL_TOT_AJ_CREDITOS | Valor total de "Ajustes a crédito" 
	- VL_ESTORNOS_DEB | Valor total de Ajustes “Estornos de Débitos”
	- VL_SLD_CREDOR_ANT | Valor total de "Saldo credor do período anterior"
	- VL_SLD_APURADO | Valor do saldo devedor apurado 
	- VL_TOT_DED | Valor total de "Deduções"
	- VL_ICMS_RECOLHER | Valor total de "ICMS a recolher (11-12) 
	- VL_SLD_CREDOR_TRA NSPORTAR | Valor total de "Saldo credor a transportar para o período seguinte” 
	- DEB_ESP | Valores recolhidos ou a recolher, extra-apuração. 

### Emissão de documentos 

- lista de Emissão de documentos 
- Tipos de documento:
		- NFe
		- NFCe
		- CTe
		- MDFe
		- DIMP
		- EFD



