# Autoestudo: Node.js, Rotas, Models e Controllers

## Sumário
1. [Contexto e Objetivo](#contexto-e-objetivo)
2. [Papel do Node.js no Projeto](#papel-do-nodejs-no-projeto)
3. [Separação por Camadas](#separação-por-camadas)
4. [Fluxo de uma Requisição no Backend](#fluxo-de-uma-requisição-no-backend)
5. [Exemplo Estrutural](#exemplo-estrutural)
6. [Conexão com Banco e API](#conexão-com-banco-e-api)
7. [Aprofundamento Orientado](#aprofundamento-orientado)
8. [Miniestudo de Caso](#miniestudo-de-caso)
9. [Checklist de Estudo](#checklist-de-estudo)
10. [Referências](#referências)

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

## Conexão com Banco e API

Esta aula faz a ponte entre o que foi modelado no banco e o que será exposto em HTTP.

| Origem | Camada que usa |
|--------|----------------|
| tabelas e constraints | model/repositório |
| regras do domínio | service |
| método e rota | controller/roteador |
| payload e resposta | controller |

### Rastreabilidade útil

```text
consulta SQL pronta
→ função no repositório
→ service decide quando usar
→ controller chama o service
→ rota publica a operação
```

---

## Aprofundamento Orientado

### 1. Onde colocar cada tipo de decisão

| Decisão | Lugar preferencial |
|---------|--------------------|
| parse de parâmetro HTTP | controller |
| regra de negócio | service |
| query SQL | repositório/model |
| status code da resposta | controller |

### 2. Acoplamentos perigosos

Alguns sintomas mostram que a estrutura está degradando:

- controller conhece detalhes de tabela
- service depende de objeto `req` ou `res`
- rota contém regra de negócio relevante
- model toma decisão de autorização ou fluxo

### 3. Ponte para a aula 6

Na próxima aula, essa estrutura vira contrato público. Então, ao terminar este autoestudo, o aluno já deveria conseguir responder:

- qual rota chamará cada operação
- que dados entram e saem do controller
- que erros podem subir do service

---

## Miniestudo de Caso

### Endpoint de produtos cresceu sem organização

Em um protótipo inicial, toda a lógica de criação de produto ficou em um único arquivo de rota: leitura do corpo da requisição, validação de preço, acesso ao banco e montagem da resposta HTTP. O código funciona, mas cada ajuste quebra algo diferente.

### Reorganização sugerida

| Responsabilidade | Destino |
|------------------|---------|
| definir `POST /produtos` | rota |
| validar payload básico e responder `201` | controller |
| impedir preço inválido e SKU duplicado | service |
| salvar no banco | repositório/model |

### Valor do caso

O aluno enxerga aqui por que separar camadas não é formalidade. A estrutura reduz acoplamento, facilita teste e prepara o sistema para a documentação de contrato da aula seguinte.

### Perguntas para discutir

1. Que parte desse fluxo deve conhecer `req` e `res`?
2. Se amanhã o cadastro vier por fila ou script interno, que parte do código ainda pode ser reaproveitada?
3. Onde mapear um erro técnico de duplicidade para uma resposta compreensível da API?

---

## Checklist de Estudo

- [ ] Sei explicar o papel de rota, controller e model?
- [ ] Consigo seguir o fluxo de uma requisição ponta a ponta?
- [ ] Consigo apontar onde deveria ficar uma regra de negócio?
- [ ] Consigo reconhecer um backend com responsabilidades misturadas?
- [ ] Consigo organizar um projeto simples em pastas coerentes?

---

## Referências

- [Node.js Documentation](https://nodejs.org/docs/latest/api/)
- [Express Documentation](https://expressjs.com/)
- [SWEBOK — Software Engineering Body of Knowledge](https://www.computer.org/education/bodies-of-knowledge/software-engineering/v4)
