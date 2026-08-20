# Autoestudo: Ponderada de Programação II

## Sumário
1. [Contexto e Objetivo](#contexto-e-objetivo)
2. [Conceitos-Chave](#conceitos-chave)
3. [Aplicação no Projeto](#aplicação-no-projeto)
4. [Checklist de Estudo](#checklist-de-estudo)
5. [Referências](#referências)

---

## Contexto e Objetivo

Você já tem endpoints implementados e regras de negócio mapeadas. Agora o objetivo é provar que o sistema atende ao negócio testando **um fluxo inteiro** como uma caixa-preta: a requisição entra no Controller, atravessa Service e Repository, e o efeito no banco é verificado. Integrações externas (e-mail, storage, APIs de terceiros) são substituídas por mocks — o banco de dados não é mockado.

**Eixo disciplinar:** Computação
**Assuntos:** —
**Duração recomendada:** 0 min

---

## Conceitos-Chave

Os assuntos centrais deste autoestudo são:

- **—**

Cada conceito deve ser compreendido a ponto de o aluno conseguir explicá-lo com as próprias palavras e aplicá-lo ao projeto em andamento.

---

## Aplicação no Projeto

Relacione o conteúdo deste autoestudo ao projeto do squad:

- Como este conceito se manifesta no domínio do parceiro?
- Quais decisões de arquitetura ou modelagem ele influencia?
- Que artefato (RF, RN, RNF, diagrama, teste) ele sustenta?

## Questão de Autoestudo

A entrega mínima é o que precisa estar presente para a atividade ser considerada:
- Um fluxo documentado com justificativa de escolha
- Suite Jest com os 4 casos obrigatórios: sucesso, regra de negócio violada, payload inválido e verificação de persistência no banco
- Banco real utilizado nos testes (não mockado); integrações externas mockadas com `jest.mock()`
- Output de `npm test` com todos os casos passando
- Matriz (RF → RN → Teste) preenchida

A suite deve cobrir o fluxo escolhido de…

**Barema:** O teste cobre o fluxo completo (Controller → Service → Repository → Banco)
Cada caso de teste verifica um comportamento de negócio identificável (RN ou RNF)
Integrações externas mockadas corretamente; banco de dados não mockado
Rastreabilidade RF → RN → Teste preenchida e coerente
O que diferencia…

---

## Checklist de Estudo

- [ ] Li o material indicado
- [ ] Consigo explicar os conceitos-chave com minhas palavras
- [ ] Identifiquei como o conceito se aplica ao projeto
- [ ] Anotei dúvidas para levar à aula

---

## Referências

- https://www.inteli.edu.br/
