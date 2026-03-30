# Autoestudo: Fundamentos de Sistemas Web, Requisitos e Minimundo

## Sumário
1. [Contexto e Objetivo](#contexto-e-objetivo)
2. [Arquitetura Básica de um Sistema Web](#arquitetura-básica-de-um-sistema-web)
3. [Fluxo Requisição-Resposta](#fluxo-requisição-resposta)
4. [RF, RN e RNF](#rf-rn-e-rnf)
5. [Minimundo e Escopo Inicial](#minimundo-e-escopo-inicial)
6. [Checklist de Estudo](#checklist-de-estudo)
7. [Referências](#referências)

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
