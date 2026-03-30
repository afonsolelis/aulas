# Sprint 2 - Modelagem Estática e Estrutura da Solução

## Descrição

Este artefato consolida a modelagem estática da solução. O objetivo é transformar os casos de uso e requisitos priorizados em estrutura de domínio, diagrama de classes, modelo relacional, modelo fisico e consultas principais que sustentarao o software.

## O que deve conter

- modelo relacional do banco de dados
- modelagem estatica com diagrama de classes
- DER com cardinalidades e chaves
- modelo fisico em SQL
- scripts de migração e população
- consultas principais do sistema
- consultas SQL principais com sua formalização lógica
- evolução dos requisitos não funcionais por eixos com impacto em dados e estrutura
- rastreabilidade entre regra de negócio e entidade/tabela

## Alinhamento com as Aulas (Onde Queremos Chegar)

Esta seção garante que os critérios deste artefato respondam diretamente as metas estabelecidas nas aulas correspondentes:

### Metas da Aula 3
- [ ] ER com entidades e relacionamentos
- [ ] Diagrama de classes do domínio
- [ ] DER com cardinalidades e chaves
- [ ] Migrations DDL criadas
- [ ] Rastreabilidade: RN → Entidade → Tabela

## Critérios de aceite

- o modelo relacional representa corretamente as entidades necessárias para atender os requisitos priorizados
- o diagrama de classes representa as principais entidades, atributos, relacionamentos e responsabilidades do domínio de forma coerente com os casos de uso priorizados
- existe coerencia entre o diagrama de classes e o modelo relacional, sem contradicoes entre nomes, relacoes e estrutura dos dados
- o DER apresenta chaves primarias, estrangeiras e cardinalidades sem inconsistências
- o modelo fisico em SQL pode ser executado sem erros de sintaxe ou de dependencia entre tabelas
- as constraints do banco refletem regras de negócio relevantes, como unicidade, obrigatoriedade e integridade referencial
- os RNFs definidos na sprint anterior foram refinados para o contexto de dados, armazenamento, integridade, desempenho e seguranca
- os scripts de migração executam em ordem previsível e reproduzível
- os scripts de população inserem dados suficientes para validar os fluxos principais do sistema
- as consultas SQL escolhidas são reais do projeto e cobrem cenários representativos
- a formalização lógica das consultas corresponde corretamente aos filtros e conectivos implementados
- a rastreabilidade `RN -> entidade/tabela` esta explícita para os elementos centrais do domínio
