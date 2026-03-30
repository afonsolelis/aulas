# Sprint 2 - Modelagem de Dados e Estrutura da Solucao

## Descricao

Este artefato consolida a estruturacao tecnica da solucao em termos de dados e modelagem. O objetivo e transformar os requisitos em modelo relacional, modelo fisico e consultas principais que sustentarao o software.

## O que deve conter

- modelo relacional do banco de dados
- modelagem estatica com diagrama de classes
- DER com cardinalidades e chaves
- modelo fisico em SQL
- scripts de migracao e populacao
- consultas principais do sistema
- consultas SQL principais com sua formalizacao logica
- evolucao dos requisitos nao funcionais por eixos com impacto em dados e estrutura
- rastreabilidade entre regra de negocio e entidade/tabela

## Criterios de aceite

- o modelo relacional representa corretamente as entidades necessarias para atender os requisitos priorizados
- o diagrama de classes representa as principais entidades, atributos, relacionamentos e responsabilidades do dominio
- existe coerencia entre o diagrama de classes e o modelo relacional, sem contradicoes entre nomes, relacoes e estrutura dos dados
- o DER apresenta chaves primarias, estrangeiras e cardinalidades sem inconsistencias
- o modelo fisico em SQL pode ser executado sem erros de sintaxe ou de dependencia entre tabelas
- as constraints do banco refletem regras de negocio relevantes, como unicidade, obrigatoriedade e integridade referencial
- os RNFs definidos na sprint anterior foram refinados para o contexto de dados, armazenamento, integridade, desempenho e seguranca
- os scripts de migracao executam em ordem previsivel e reproduzivel
- os scripts de populacao inserem dados suficientes para validar os fluxos principais do sistema
- as consultas SQL escolhidas sao reais do projeto e cobrem cenarios representativos
- a formalizacao logica das consultas corresponde corretamente aos filtros e conectivos implementados
- a rastreabilidade `RN -> entidade/tabela` esta explicita para os elementos centrais do dominio
