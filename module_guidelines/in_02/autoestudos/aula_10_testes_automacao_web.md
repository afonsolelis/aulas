# Autoestudo: Testes em Aplicações Web e Automação Básica

## Sumário
1. [Contexto e Objetivo](#contexto-e-objetivo)
2. [Tipos de Teste](#tipos-de-teste)
3. [O que Vale Automatizar Primeiro](#o-que-vale-automatizar-primeiro)
4. [Estrutura de um Bom Caso de Teste](#estrutura-de-um-bom-caso-de-teste)
5. [Automação e Evidência](#automação-e-evidência)
6. [Checklist de Estudo](#checklist-de-estudo)
7. [Referências](#referências)

---

## Contexto e Objetivo

Esta aula consolida a verificação do sistema. O aluno precisa entender quais tipos de teste existem, o que automatizar primeiro e como registrar evidências úteis para mostrar que os principais fluxos continuam funcionando.

---

## Tipos de Teste

| Tipo | Foco | Exemplo |
|------|------|---------|
| Unitário | pequena unidade isolada | função de cálculo |
| Integração | interação entre partes | endpoint + banco |
| Interface/E2E | fluxo do ponto de vista do usuário | cadastro na tela |

### Regra prática

- regra de negócio simples: teste unitário
- contrato entre camadas: teste de integração
- fluxo crítico do usuário: teste E2E

---

## O que Vale Automatizar Primeiro

Nem tudo precisa ser automatizado no primeiro momento.

### Prioridades

1. Fluxos principais do projeto
2. Regras de negócio com maior risco
3. Cenários de erro relevantes
4. Regressões que quebraram antes

### Exemplo

| Fluxo | Prioridade |
|-------|------------|
| login | alta |
| cadastro de produto | alta |
| listagem com filtro | média |
| animação visual cosmética | baixa |

---

## Estrutura de um Bom Caso de Teste

Um teste bom deixa claro:

- o cenário
- a ação
- o resultado esperado

### Estrutura AAA

| Etapa | Significado |
|------|-------------|
| Arrange | prepara o cenário |
| Act | executa a ação |
| Assert | verifica o resultado |

```typescript
it('deve criar produto com dados válidos', async () => {
  const dto = { nome: 'Camiseta', sku: 'CAM-001', preco_cents: 4990 };
  const resultado = await service.criar(dto);
  expect(resultado.sku).toBe('CAM-001');
});
```

---

## Automação e Evidência

Automação não é só rodar teste. É conseguir repetir a validação e mostrar evidência.

### Evidências úteis

- relatório do Playwright
- saída do comando de teste
- screenshots quando fizer sentido
- associação do teste ao requisito coberto

### Exemplo de rastreabilidade

| RF | Teste | Evidência |
|----|-------|-----------|
| RF01 | criar produto com sucesso | `npm test` |
| RF02 | impedir SKU duplicado | teste de integração |
| RF03 | exibir erro de validação na tela | teste E2E |

---

## Checklist de Estudo

- [ ] Sei diferenciar teste unitário, integração e interface?
- [ ] Sei decidir o que automatizar primeiro?
- [ ] Consigo escrever um teste com Arrange, Act e Assert?
- [ ] Consigo relacionar um teste a um requisito?
- [ ] Consigo produzir uma evidência simples de execução?

---

## Referências

- SWEBOK v3 — Software Testing
- Martin Fowler — Test Pyramid
- Playwright Documentation
