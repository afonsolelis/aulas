# Sprint 3 - Modelagem Dinâmica, Arquitetura e Primeira Versão do Backend

## Descrição

Este artefato consolida a transicao da modelagem para a implementação. O objetivo é detalhar a modelagem dinâmica dos fluxos prioritários, descrever a arquitetura da aplicação e entregar a primeira versão funcional do backend com WebAPI operante.

## O que deve conter

- arquitetura da aplicação em padrão MVC
- modelagem dinamica com diagrama de sequencia UML de ao menos um fluxo prioritário
- modelagem dinamica complementar com diagrama de atividades ou estados, em UML ou BPMN, para ao menos um fluxo relevante
- referencia ao diagrama de classes do domínio e sua evolução para as camadas implementadas
- primeira versão funcional do sistema
- WebAPI documentada
- endpoints principais implementados
- evolução dos requisitos não funcionais por eixos com foco computacional
- relatório de desenvolvimento da primeira versão

## Alinhamento com as Aulas (Onde Queremos Chegar)

Esta seção garante que os critérios deste artefato respondam diretamente as metas estabelecidas nas aulas correspondentes:

### Metas da Aula 4
- [ ] Diagrama de Sequência (fluxo de sucesso)
- [ ] Diagrama de Atividades ou Estados para fluxo relevante
- [ ] 1 teste Jest por caso de uso (Red → Green)
- [ ] Contratos de entrada/saída definidos

### Metas da Aula 5
- [ ] Matriz RF → RN → Teste
- [ ] Endpoints de leitura e escrita funcionando
- [ ] Testes para: sucesso, falha de validação, regra violada
- [ ] Diagramas UML atualizados conforme implementação

### Metas da Aula 6
- [ ] Cada RN representada em ≥1 teste
- [ ] Fluxos alternativos testados
- [ ] RTM: RF → RN → Teste → Evidência
- [ ] Revisão dos 8 eixos de RNF (tabela simples)

## Critérios de aceite

- a arquitetura identifica com clareza as camadas principais do sistema é suas responsabilidades
- o padrão MVC esta refletido tanto na documentacao quanto na organizacao do código
- o diagrama de sequencia UML descreve corretamente um fluxo prioritário do sistema, incluindo interacao entre camadas, entrada, processamento e resposta
- o diagrama de atividades ou estados complementa a leitura do comportamento do sistema em um fluxo relevante
- a evolução do diagrama de classes para a arquitetura implementada esta explicitada na documentação
- a modelagem dinamica esta coerente com os endpoints implementados e com a arquitetura descrita
- a primeira versão do backend sobe localmente sem erros impeditivos
- os endpoints principais previstos para a sprint estão implementados e acessiveis
- a documentacao da WebAPI informa endereco, método, parâmetros de entrada e formatos de resposta
- os RNFs foram evoluidos do nivel conceitual para decisões técnicas de validacao, tratamento de erro, desempenho, testabilidade e manutencao
- existe coerencia entre os endpoints implementados, os requisitos priorizados e as regras de negócio mapeadas
- o relatório de desenvolvimento registra de forma objetiva o que foi implementado, o que não foi concluído e quais dificuldades técnicas surgiram
