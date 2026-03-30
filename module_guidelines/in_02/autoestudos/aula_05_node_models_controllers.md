# Autoestudo: Node.js, Rotas, Models e Controllers

## Sumário
1. [Contexto e Objetivo](#contexto-e-objetivo)
2. [Papel do Node.js no Projeto](#papel-do-nodejs-no-projeto)
3. [Separação por Camadas](#separação-por-camadas)
4. [Fluxo de uma Requisição no Backend](#fluxo-de-uma-requisição-no-backend)
5. [Exemplo Estrutural](#exemplo-estrutural)
6. [Checklist de Estudo](#checklist-de-estudo)
7. [Referências](#referências)

---

## Contexto e Objetivo

Esta aula introduz a organização do backend. O aluno precisa entender onde colocar rota, controller e model, e por que misturar tudo no mesmo arquivo aumenta acoplamento e dificulta manutenção.

---

## Papel do Node.js no Projeto

Node.js é o ambiente de execução JavaScript no servidor. No contexto desta disciplina, ele cumpre três papéis principais:

- receber requisições HTTP
- aplicar regras e orquestrar operações
- integrar com o banco de dados

### O que ele não substitui

| Componente | Função própria |
|------------|----------------|
| Banco de dados | persistência |
| Navegador | interface |
| Rede | transporte da comunicação |

---

## Separação por Camadas

| Camada | Responsabilidade |
|--------|------------------|
| Rota | Define URL e método HTTP |
| Controller | Recebe entrada e monta resposta |
| Service ou regra | Concentra lógica de negócio |
| Model ou repositório | Acessa dados |

### Erros comuns

| Erro | Consequência |
|------|--------------|
| Controller com SQL embutido | acoplamento alto |
| Rota validando regra de negócio complexa | código espalhado |
| Model tomando decisão de negócio | responsabilidade confusa |

---

## Fluxo de uma Requisição no Backend

```text
POST /produtos
→ rota identifica o endpoint
→ controller valida a entrada básica
→ service aplica regra de negócio
→ model/repositório acessa o banco
→ controller envia resposta HTTP
```

### Perguntas que ajudam a projetar bem

- Esta lógica é de transporte HTTP ou de negócio?
- Esta decisão depende de regra do domínio?
- Este trecho apenas lê/grava dados?

---

## Exemplo Estrutural

```typescript
// routes/produto.routes.ts
router.post('/produtos', produtoController.criar);
```

```typescript
// controllers/produto.controller.ts
export async function criar(req: Request, res: Response) {
  const resultado = await produtoService.criar(req.body);
  res.status(201).json(resultado);
}
```

```typescript
// services/produto.service.ts
export async function criar(dto: CriarProdutoDTO) {
  if (dto.preco_cents <= 0) {
    throw new Error('Preco invalido');
  }
  return produtoRepository.save(dto);
}
```

---

## Checklist de Estudo

- [ ] Sei explicar o papel de rota, controller e model?
- [ ] Consigo seguir o fluxo de uma requisição ponta a ponta?
- [ ] Consigo apontar onde deveria ficar uma regra de negócio?
- [ ] Consigo reconhecer um backend com responsabilidades misturadas?
- [ ] Consigo organizar um projeto simples em pastas coerentes?

---

## Referências

- Node.js Documentation
- Express Documentation
- SWEBOK v3 — Software Construction
