# Sprint 5 - Refinamento Final e Publicação

## Descrição

Este artefato consolida o fechamento técnico do projeto. O objetivo é refinar o sistema que ja deve estar rodando desde a sprint anterior, melhorar a qualidade interna do software, concluir a documentacao técnica e entregar uma camada simples de autenticacao e autorizacao na aplicação.

## O que deve conter

- versão final refinada do sistema
- refatoracoes e correcoes finais
- autenticacao simples implementada na aplicação
- persistencia de usuarios com hash de senha no banco de dados
- controle de autenticacao e autorizacao baseado em `session id`
- suite de testes estabilizada
- documentacao técnica revisada e concluida
- arquitetura, WebAPI e modelagem consistentes com o código final
- consolidação final dos requisitos não funcionais por eixos
- evidencias finais de execução e qualidade

## Alinhamento com as Aulas (Onde Queremos Chegar)

Esta seção garante que os critérios deste artefato respondam diretamente as metas estabelecidas nas aulas correspondentes:

### Metas da Aula 10
- [ ] Identificar duplicações, lacunas, baixa legibilidade
- [ ] Refatorar testes (clareza, isolamento)
- [ ] Manter cobertura de fluxos críticos
- [ ] Revisar impactos de autenticação/autorização após refatorações
- [ ] RTM atualizado pós-refatoração

### Metas da Aula 11
- [ ] Fundamentos HTTP/IP aplicados ao projeto
- [ ] Estratégias de robustez (timeout, retry, circuit breaker)
- [ ] Autenticação com senha hasheada persistida no banco
- [ ] Sessão baseada em `session id` implementada
- [ ] Regras de autorização aplicadas nas rotas e fluxos principais
- [ ] RNF de comunicação validado (nível 1º ano)
- [ ] Documentação final da sprint/trilha

## Critérios de aceite

- a versão final corrige pendencias técnicas identificadas na sprint anterior sem introduzir regressao funcional relevante
- as refatoracoes melhoram legibilidade, manutencao ou organizacao do código sem quebrar contratos ja estabelecidos
- a aplicação possui fluxo funcional de autenticacao com credenciais persistidas de forma segura por meio de hash de senha no banco de dados
- o controle de sessao baseado em `session id` permite identificar usuarios autenticados de forma consistente entre requisicoes
- existem regras explícitas de autorizacao para restringir acesso a rotas, telas ou operacoes conforme o perfil ou estado autenticado do usuario
- a suite de testes final executa com estabilidade e cobre os comportamentos criticos do sistema
- a documentacao técnica final esta consistente entre arquitetura, WebAPI, banco de dados e comportamento observado no código
- não existem divergencias relevantes entre nomes, estruturas e fluxos descritos nos artefatos técnicos e na implementação final
- os RNFs apresentam fechamento evolutivo coerente com as decisões tomadas ao longo das sprints e com evidencias técnicas de atendimento
- as evidencias finais demonstram execução do sistema, funcionamento dos fluxos principais, autenticacao/autorizacao operantes e verificacao automatizada mínima da qualidade
- o projeto final apresenta nivel adequado de organizacao para manutencao, continuidade de desenvolvimento e entrega academica
