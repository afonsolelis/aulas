# Autoestudo: Testes em Aplicações Web e Automação Básica

## Sumário
1. [Contexto e Objetivo](#contexto-e-objetivo)
2. [Tipos de Teste](#tipos-de-teste)
3. [O que Vale Automatizar Primeiro](#o-que-vale-automatizar-primeiro)
4. [Estrutura de um Bom Caso de Teste](#estrutura-de-um-bom-caso-de-teste)
5. [Automação e Evidência](#automação-e-evidência)
6. [Conexão com Requisitos e Arquitetura](#conexão-com-requisitos-e-arquitetura)
7. [Aprofundamento Orientado](#aprofundamento-orientado)
8. [Miniestudo de Caso](#miniestudo-de-caso)
9. [Checklist de Estudo](#checklist-de-estudo)
10. [Referências](#referências)

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

## Conexão com Requisitos e Arquitetura

Teste útil não nasce do nada; ele nasce do que o sistema promete fazer.

| Origem | Vira teste de... |
|--------|------------------|
| RF | fluxo principal |
| RN | caso de erro ou restrição |
| contrato de endpoint | integração |
| comportamento de tela | interface/E2E |

### Encadeamento recomendado

```text
RF definido
→ regra associada
→ endpoint ou ação de tela
→ cenário de teste
→ evidência de execução
```

---

## Aprofundamento Orientado

### 1. Cobertura não é sinônimo de qualidade

Dois projetos podem ter a mesma cobertura e qualidade muito diferente. Vale observar:

- o teste falha pelo motivo certo?
- o nome do teste comunica intenção?
- o cenário cobre sucesso e falha?
- o teste é estável ou intermitente?

### 2. O que normalmente quebra primeiro

| Área | Tipo de regressão |
|------|-------------------|
| backend | contrato alterado |
| banco | regra ou constraint não respeitada |
| frontend | seletor mudou, mensagem sumiu, fluxo quebrou |
| integração | payload incompatível |

### 3. Ponte para a aula 11

Quando o sistema entra em rede real, falhas deixam de ser só lógicas. Então, antes de avançar, é útil já pensar:

- o que acontece se o serviço demora demais?
- o teste distingue erro de validação de erro de comunicação?
- há evidência de comportamento sob falha e não só sob sucesso?

---

## Miniestudo de Caso

### Cadastro de produto quebra após ajuste no backend

Depois de uma refatoração, o endpoint continua respondendo, mas o front-end deixou de mostrar a mensagem de sucesso e o formulário não limpa mais os campos. Em revisão manual, parte da equipe percebe o problema e parte não.

### Estratégia de teste aplicada

| Camada | Teste útil |
|--------|------------|
| service | impedir preço inválido e SKU duplicado |
| integração | garantir contrato de `POST /produtos` |
| interface/E2E | preencher formulário, salvar e validar feedback |

### Valor do caso

Esse cenário ajuda a mostrar que automação existe para detectar regressão em fluxo crítico, não apenas para aumentar cobertura. O conjunto de testes protege regra, contrato e experiência do usuário.

### Perguntas para discutir

1. Qual teste detectaria primeiro a quebra descrita?
2. Que evidência vale guardar para provar que o fluxo voltou a funcionar?
3. Como nomear esse teste para que a intenção fique clara para o time?

---

## Checklist de Estudo

- [ ] Sei diferenciar teste unitário, integração e interface?
- [ ] Sei decidir o que automatizar primeiro?
- [ ] Consigo escrever um teste com Arrange, Act e Assert?
- [ ] Consigo relacionar um teste a um requisito?
- [ ] Consigo produzir uma evidência simples de execução?

---

## Referências

- [SWEBOK — Software Engineering Body of Knowledge](https://www.computer.org/education/bodies-of-knowledge/software-engineering/v4)
- [Martin Fowler — Test Pyramid](https://martinfowler.com/bliki/TestPyramid.html)
- [Playwright Documentation](https://playwright.dev/)
