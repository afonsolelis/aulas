# Ponderada 6 — Ponderada de Programação II

**Aplicada em:** Back-end II - Endpoints de leitura e escrita com documentação própria | **Visão RM-ODP:** Computational
**Formato:** Individual em sala | **Eixo:** Computação | **Peso:** 4

---

## Contexto

Você já tem endpoints implementados e regras de negócio mapeadas. Agora o objetivo é provar que o sistema atende ao negócio testando **um fluxo inteiro** como uma caixa-preta: a requisição entra no Controller, atravessa Service e Repository, e o efeito no banco é verificado. Integrações externas (e-mail, storage, APIs de terceiros) são substituídas por mocks — o banco de dados não é mockado.

---

## Entrega Mínima

A entrega mínima é o que precisa estar presente para a atividade ser considerada — **não garante nota máxima**.

- Compreensão do enunciado e entrega no formato solicitado
- Resposta postada no Adalove na área destinada

Entregas que cumprem apenas o mínimo serão avaliadas na faixa **5,0 a 6,5**.

---

## O que entregar

A entrega mínima é o que precisa estar presente para a atividade ser considerada:
- Um fluxo documentado com justificativa de escolha
- Suite Jest com os 4 casos obrigatórios: sucesso, regra de negócio violada, payload inválido e verificação de persistência no banco
- Banco real utilizado nos testes (não mockado); integrações externas mockadas com `jest.mock()`
- Output de `npm test` com todos os casos passando
- Matriz (RF → RN → Teste) preenchida

A suite deve cobrir o fluxo escolhido de ponta a ponta, com banco real (teste ou em memória) e mock apenas de integrações externas.

Regras da…

---

## Critérios de Avaliação

O teste cobre o fluxo completo (Controller → Service → Repository → Banco)
Cada caso de teste verifica um comportamento de negócio identificável (RN ou RNF)
Integrações externas mockadas corretamente; banco de dados não mockado
Rastreabilidade RF → RN → Teste preenchida e coerente
O que diferencia uma entrega excelente
Cumprir o mínimo coloca o trabalho na média. A nota máxima é alcançada por quem demonstra que os testes são uma documentação viva do negócio, não apenas código que passa.
Nos casos de teste:
- Nomes dos testes descrevem o comportamento esperado do negócio, não a implementação (ex.: "deve impedir cadastro duplicado por e-mail" em vez de "CT02")
- Casos de borda específicos do domínio do projeto — não apenas os 4 obrigatórios (ex.: e-mail com caracteres especiais, nome com…

| Critério | Peso |
|----------|------|
| Compreensão do enunciado | 30% |
| Aplicação correta dos conceitos | 40% |
| Clareza e rastreabilidade da entrega | 30% |

---

## Formato de Entrega

Documento único (`.md`, `.pdf` ou `.docx`) postado na área de resposta do Adalove.
Links externos não serão aceitos, com exceção de imagens indicadas no texto da resposta.
