Este projeto está focado na jornada fiscal, que é todas as rotinas que ficam abrangidas nos trabalhos de um auditor fiscal. Ele é focado em simplificar a rotina e o excesso de cliques e troca de telas que são necessários no sistema corporativo. O objetivo é trazer de forma simples e rápida as informações necessárias para avaliar a situação de um contribuinte.

O sistema ele vai ter como um dos seus pilares a geração de alertas que são construídos com base em regras construídas nesse sistema. O que pode gerar gatilhos para essas regras são emissões de documentos com informações específicas ou mudanças cadastrais ou declarações feitas pelo próprio contribuinte assim que recebidas.

Outro pilar é a gestão e o acompanhamento das ordens de serviço. Elas são o fruto desses alertas. Afinal, quando um alerta é recebido, ele pode acabar desencadeando uma vistoria física, uma vistoria em trânsito, uma vistoria no estabelecimento ou, inclusive, ao final, gerar um mandado, um MPF.

Outro pilar do projeto são os canais de comunicação. Afinal, quando um alerta é gerado ou um prazo começa a se esgotar ou já está esgotado, é por ele que ficamos sabendo. Entre os canais previstos temos Telegram, a tela do próprio sistema, e-mail, Prodoc ou até mesmo pessoal.

O último pilar é o módulo de gestão da jornada do contribuinte. Nessa jornada, acompanhamos os eventos que ocorrem durante a história do contribuinte, desde a sua criação, troca de contadores, modificações no quadro societário, mudança no capital social, criação de filiais, procedimentos fiscais, notificações e até mesmo, muito importante, a visita ou observações que fazemos diretamente no cadastro do contribuinte, funcionando como se fosse um CRM, em que podemos fazer anotações que são visíveis apenas para os fiscais, mas que ajudam a entender e acompanhar essa jornada do contribuinte.

Uma das dores da jornada fiscal é justamente o excesso de troca de telas e cliques necessários para poder fazer o acompanhamento e a verificação da situação de um contribuinte e entender qual a situação dele quando inicia-se um procedimento fiscal. Por isso, nesse sistema, queremos que de forma rápida e fácil consiga ver informações como histórico do contribuinte, que é uma timeline fácil de se visualizar, as declarações entregues por ele, os documentos emitidos, os recolhimentos feitos e os relacionamentos com outras empresas, sócios, contadores, mesmo que informais, construindo por meio deles grafos que podem ser apresentados em tela.

Este projeto será apoiado fortemente em dados, consumindo uma plataforma moderna de dados em cima de Kubernetes, MinIO, Kafka, Iceberg, Trino. A plataforma de dados em si, ela é independente desse sistema, estando por isso fora do escopo.

O acesso às informações do sistema corporativo não será feita diretamente esse banco de dados e como este não tem nenhuma API, ela será feita por uma camada de API que será criada em um projeto separado. A partir desse projeto de API de integração com o sistema corporativo é que será buscado as informações e apresentadas nesse sistema.

Leia integralmente todos os arquivos da pasta ./references

A pasta ./references contém a fonte da verdade dos dados.

Não faça nenhuma suposição que não possa ser deduzida desses arquivos. E me pergunte se ficar alguma lacuna.
 
Construa o /docs/PRD.md seguindo as melhores práticas de Spec Driven Development, manuais de utilização do OpenSpec e o modelo a seguir:


# Modelo de PRD.md
# PROD - Nome do Projeto

## 1. Visão Geral

texto

---

## 2. Objetivos

texto

* objetivo 1
* objetivo 2
* objetivo 3
* objetivo 4
* objetivo 5

---
## 2. Público alvo

* público 1
* público 2
* público 3
* público 4

---
## 4. Navegação principal

texto

---

## N. Fonte de dados

Os dados iniciais serão carregados através de Seed a partir da pasta ./fontes do projeto

Dados initiais previstos:

* item 1 (informação, não é o nome do arquivo)
* item 2
* item 3

---

## N+1. Estrutura do protótipo

### Estrutura do protótipo

A estrutura esperada é:

'''text (bloco de código com estrutura de pasta)
prototipo/
	css/
		site.css < estilo globais
	js/
		site.js
	docs/
		PRD.md
	fontes/
		documento.txt
		...
	pagina 1.html
	...
'''

---

## N+2. Fora do escopo

Não faz parte da primeira versão

* item 1
* item 2
* item 3

--- 

--- 

## N+3 Critérios de aceitação


## N+4 Evoluções Futuras

### Estrutura do protótipo

* item 1
* item 2
* item 3