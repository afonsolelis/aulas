# Autoestudo: Fundamentos de Sistemas Web, Requisitos e Minimundo

## Sumário
1. [Contexto e Objetivo](#contexto-e-objetivo)
2. [Arquitetura Básica de um Sistema Web](#arquitetura-básica-de-um-sistema-web)
3. [Fluxo Requisição-Resposta](#fluxo-requisição-resposta)
4. [RF, RN e RNF](#rf-rn-e-rnf)
5. [Minimundo e Escopo Inicial](#minimundo-e-escopo-inicial)
6. [Como Isso se Conecta às Próximas Aulas](#como-isso-se-conecta-às-próximas-aulas)
7. [Aprofundamento Orientado](#aprofundamento-orientado)
8. [Miniestudo de Caso](#miniestudo-de-caso)
9. [Checklist de Estudo](#checklist-de-estudo)
10. [Referências](#referências)

---

## Contexto e Objetivo

Esta aula abre o módulo e precisa dar vocabulário comum para tudo que vem depois: interface, servidor, banco, rede, requisitos e domínio. O foco aqui não é aprofundar tecnologia específica, mas entender como as partes se conectam e como o problema de negócio começa a ser traduzido em software.

---

## Arquitetura Básica de um Sistema Web

Um sistema web simples pode ser lido em quatro blocos:

| Camada | Papel | Exemplo |
|--------|------|---------|
| Cliente | Exibe interface e recebe interação | Navegador |
| Servidor | Processa regras e responde requisições | Node.js, Java, Python |
| Banco de Dados | Persiste informações | PostgreSQL, MySQL |
| Rede | Transporta mensagens entre cliente e servidor | HTTP sobre TCP/IP |

### Perguntas que o aluno precisa conseguir responder

- O que roda no navegador e o que roda no servidor?
- Quando uma informação precisa ser persistida?
- O que acontece quando o usuário clica em um botão de envio?
- Onde uma falha pode ocorrer: interface, servidor, banco ou rede?

---

## Fluxo Requisição-Resposta

O ciclo mínimo de uma aplicação web é:

1. O usuário realiza uma ação na interface.
2. O navegador monta uma requisição HTTP.
3. O servidor recebe, valida e executa uma regra.
4. O servidor consulta ou grava dados, se necessário.
5. O servidor envia uma resposta.
6. A interface interpreta o resultado e atualiza a tela.

### Exemplo

```text
Usuário preenche formulário de cadastro
→ navegador envia POST /usuarios
→ servidor valida os dados
→ banco salva o usuário
→ servidor responde 201 Created
→ tela mostra "cadastro realizado com sucesso"
```

---

## RF, RN e RNF

Antes de programar, é preciso diferenciar tipos de requisito:

| Tipo | Pergunta que responde | Exemplo |
|------|-----------------------|---------|
| RF | O que o sistema faz? | Cadastrar usuário |
| RN | Que regra de negócio limita o comportamento? | E-mail deve ser único |
| RNF | Como o sistema deve operar? | Responder em até 2 segundos |

### Exemplo encadeado

| Elemento | Exemplo |
|----------|---------|
| RF | O sistema deve permitir login |
| RN | Usuário precisa estar ativo |
| RNF | Login deve ter resposta rápida e proteger a senha |

---

## Minimundo e Escopo Inicial

O minimundo é a descrição textual do domínio do problema. Ele ajuda a evitar que o time comece a desenhar solução sem entender o contexto.

### Um minimundo bom responde

- Quem usa o sistema?
- Qual problema real será resolvido?
- Quais entidades aparecem no domínio?
- O que está dentro e fora do escopo?

### Exemplo curto

> O sistema apoia uma pequena operação de vendas. Atendentes precisam consultar produtos, registrar pedidos e acompanhar estoque. O gerente acompanha relatórios simples de vendas e reposição. O sistema não cobre faturamento fiscal nem integração bancária nesta etapa.

---

## Como Isso se Conecta às Próximas Aulas

Esta aula sustenta todo o restante do módulo:

| Conceito aprendido aqui | Onde reaparece depois |
|-------------------------|-----------------------|
| Minimundo | Aula 2, ao identificar entidades e relacionamentos |
| RF, RN e RNF | Aula 6, ao documentar endpoints e erros |
| Cliente, servidor e banco | Aula 5, ao estruturar backend |
| Fluxo de requisição-resposta | Aula 8, ao tratar chamadas assíncronas |
| Papel da rede | Aula 11, ao discutir HTTP, timeout e resiliência |

### Perguntas de transição

- Quais entidades do minimundo precisariam virar tabelas?
- Quais ações do usuário claramente exigem persistência?
- Quais RNFs já aparecem mesmo antes de haver código?

---

## Aprofundamento Orientado

### 1. Transformando problema em backlog técnico

Um erro comum em projetos iniciais é sair do workshop com ideias vagas e já começar a programar. O movimento correto é:

1. registrar o problema de negócio em linguagem do domínio
2. identificar atores e objetivos
3. separar o que é requisito funcional do que é regra de negócio
4. transformar qualidades desejadas em RNFs observáveis

### 2. Mapa inicial de rastreabilidade

Mesmo sem implementar nada, o aluno já pode montar uma tabela inicial:

| Persona/Atores | Objetivo | RF inicial | RN associada | RNF associado |
|----------------|----------|-----------|--------------|---------------|
| Atendente | registrar pedido | cadastrar pedido | pedido precisa ter item | resposta rápida |
| Gerente | acompanhar estoque | listar produtos | estoque não pode ser negativo | disponibilidade |

### 3. Erro frequente a evitar

Não misturar solução prematura com descrição de problema.

Exemplo ruim:

> "O sistema terá React, PostgreSQL e autenticação JWT."

Exemplo melhor:

> "O usuário precisa consultar produtos, registrar pedidos e distinguir itens com estoque crítico."

---

## Miniestudo de Caso

### Loja universitária com operação enxuta

Uma loja de campus vende camisetas, cadernos e canecas. Dois atendentes registram pedidos manualmente em planilhas, e o gerente reclama de três problemas: estoque divergente, demora para localizar produtos e dificuldade para saber o que vende mais.

### Leitura aplicada do cenário

| Elemento | Exemplo no caso |
|----------|-----------------|
| Atores | atendente, gerente |
| RF inicial | cadastrar pedido, consultar produto, listar estoque |
| RN inicial | produto não pode ter estoque negativo |
| RNF inicial | consulta de produto precisa ser rápida no balcão |
| Fora de escopo | emissão fiscal e pagamento online |

### Decisão de análise

Antes de pensar em tela ou tecnologia, o time deveria transformar o caso em minimundo e rastrear quais partes do problema exigem banco, quais exigem interface e quais dependem de comunicação entre cliente e servidor.

### Perguntas para discutir

1. Quais entidades aparecem naturalmente nesse cenário?
2. Que ação do atendente claramente dispara uma requisição ao servidor?
3. Qual RNF já impacta decisões futuras de API e banco?

---

## Checklist de Estudo

- [ ] Consigo explicar a diferença entre cliente, servidor, banco e rede?
- [ ] Consigo descrever o fluxo de uma requisição HTTP simples?
- [ ] Consigo distinguir RF, RN e RNF?
- [ ] Consigo redigir um minimundo curto sem misturar solução e problema?
- [ ] Consigo apontar o que está fora do escopo do projeto?

---

## Referências

- MDN Web Docs — HTTP Overview
- SWEBOK v3 — Software Requirements
- SEBoK — System Life Cycle and Stakeholder Needs
