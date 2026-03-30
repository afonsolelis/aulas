# Sprint 4 - Sistema Integrado e Operacional

## Descrição

Este artefato consolida a entrega do sistema em funcionamento. O objetivo é apresentar a segunda versão do software com backend completo, frontend integrado, integração operacional, testes automatizados e documentacao técnica atualizada.

## O que deve conter

- sistema rodando com fluxos principais completos
- frontend implementado com as telas principais integradas ao backend
- relatório de desenvolvimento da segunda versão
- testes automatizados da WebAPI
- documentacao atualizada da WebAPI
- documentação das telas, contratos e fluxos de integração front-back
- arquitetura e banco revisados conforme a implementação
- evolução dos requisitos não funcionais por eixos com foco em integração e operação
- RTM técnica entre requisito, regra, endpoint, teste e evidencia
- Kanban e `README.md` atualizados

## Alinhamento com as Aulas (Onde Queremos Chegar)

Esta seção garante que os critérios deste artefato respondam diretamente as metas estabelecidas nas aulas correspondentes:

### Metas da Aula 7
- [ ] Frontend com telas principais implementadas
- [ ] Cada tela vinculada a RF específico
- [ ] Contratos de integração definidos (entradas, saídas, erros)
- [ ] Personas → Necessidade → RF → Endpoint → Tela
- [ ] Testes Jest ajustados se houve mudança de contrato

### Metas da Aula 8
- [ ] Chamadas assíncronas implementadas
- [ ] Estados: carregamento, sucesso, erro
- [ ] Tratamento de falha de rede (timeout, retry)
- [ ] Fluxos principais executáveis de ponta a ponta pela interface
- [ ] RTM com evidências de integração

### Metas da Aula 9
- [ ] RTM completo (persona → teste → evidência)
- [ ] RNF introdutórios registrados (tabela de atendimento)
- [ ] Documentação consolidada
- [ ] README com instruções de execução e validação da interface integrada
- [ ] Testes Jest estáveis

## Critérios de aceite

- o sistema executa os fluxos principais definidos para a entrega sem depender de simulacoes manuais fora do processo normal
- o backend contempla as rotas necessárias para suportar os fluxos priorizados de ponta a ponta
- o frontend implementa as telas e interacoes necessárias para executar os fluxos priorizados de ponta a ponta
- cada tela principal esta vinculada a um requisito funcional e consome os endpoints correspondentes sem divergencia de contrato
- os contratos de integração entre frontend e backend estao documentados com entradas, saidas e tratamento de erro
- os testes automatizados cobrem cenários de sucesso, falha de validacao e erro de negócio para os endpoints principais
- a suite de testes pode ser executada localmente com resultado reproduzível
- a documentacao da WebAPI esta atualizada e corresponde ao comportamento real do código
- a arquitetura documentada reflete a solução efetivamente implementada, sem divergencias estruturais relevantes
- a modelagem do banco permanece consistente com o estado atual da aplicação e com os dados manipulados pelos endpoints
- os RNFs foram refinados para o contexto de integração, cobrindo comunicação, confiabilidade, desempenho, seguranca e observabilidade mínima
- a RTM técnica permite seguir de `RF -> RN -> endpoint -> teste -> evidencia` nos fluxos centrais
- o `README.md` descreve de forma suficiente como executar, testar e validar a aplicação, incluindo a interface e sua integração com a API
- o relatório da segunda versão registra claramente o que foi consolidado entre a primeira entrega funcional e o sistema operacional
