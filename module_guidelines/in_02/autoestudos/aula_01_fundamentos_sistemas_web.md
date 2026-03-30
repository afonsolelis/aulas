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

### RNF não é opinião; é critério observável

Um erro comum de aluno iniciante é falar:

> "O sistema é bom."

Essa frase não serve para engenharia porque não define eixo de qualidade, métrica, carga, ambiente nem evidência. O discurso técnico esperado é outro:

> "O sistema atende o RF de cadastro por meio da suíte E2E `cadastro-produto.spec.ts` e atende o RNF de eficiência sob carga de 100 requisições simultâneas, com `p99 < 300ms` no endpoint `POST /produtos`."

O ponto central é este:

- RF costuma ser evidenciado por fluxo funcional e teste de comportamento
- RN traduz restrição de negócio que limita o comportamento aceito
- RNF precisa ser expresso como atributo de qualidade com critério verificável

### Os 8 eixos de RNF que orientam a disciplina

Ao falar de requisitos não funcionais neste módulo, a referência é a decomposição de qualidade em 8 eixos adotada no curso com base em SWEBOK e ISO/IEC 25010. O aluno não deve dizer apenas que "o software tem qualidade"; ele deve dizer em qual eixo, com qual métrica e com qual evidência.

| Eixo | Pergunta de engenharia | Exemplo de formulação aceitável |
|------|------------------------|---------------------------------|
| Adequação funcional | O comportamento entregue cobre a necessidade prevista? | "Os fluxos RF01 e RF02 estão cobertos pela suíte de integração `produtos.api.spec.ts`." |
| Eficiência de desempenho | Quão rápido e econômico o sistema opera sob carga definida? | "`GET /produtos` mantém `p99 < 300ms` com 100 usuários simultâneos." |
| Compatibilidade | O sistema convive e integra corretamente com outros componentes? | "A API responde JSON compatível com o contrato consumido pelo front-end e validado por testes de contrato." |
| Usabilidade | O usuário entende o sistema e consegue operar sem fricção excessiva? | "95% dos usuários concluem o cadastro sem ajuda em até 2 minutos no teste moderado." |
| Confiabilidade | O sistema mantém operação correta mesmo com falhas previstas? | "A busca de produtos possui retry controlado e taxa de sucesso de 99,5% nas chamadas em rede degradada simulada." |
| Segurança | O sistema protege dados, acesso e operações sensíveis? | "Senhas são persistidas com hash e endpoints administrativos exigem sessão válida." |
| Manutenibilidade | O software pode ser alterado com segurança e baixo acoplamento? | "Controllers, services e repositórios estão separados e a suíte unitária cobre regras críticas do domínio." |
| Portabilidade | O sistema pode ser executado ou implantado em ambientes distintos com baixo atrito? | "A aplicação sobe em ambiente local e de homologação via variáveis de ambiente sem alterar código-fonte." |

### Exemplos de linguagem fraca versus linguagem de engenharia

| Formulação fraca | Problema | Formulação esperada |
|------------------|----------|---------------------|
| "O sistema é rápido." | não informa carga, métrica nem percentil | "O endpoint `GET /produtos` atende 100 requisições simultâneas com `p95 < 200ms` e `p99 < 300ms`." |
| "O sistema é seguro." | não indica ameaça, controle nem escopo | "As senhas são armazenadas com hash e rotas protegidas retornam `401` sem sessão válida." |
| "O sistema é confiável." | não informa cenário de falha nem taxa de sucesso | "Chamadas ao catálogo tratam timeout de 5s e usam retry apenas para 502, 503 e 504." |
| "O sistema é fácil de manter." | não mostra evidência estrutural | "As regras de negócio estão concentradas em services e cobertas por testes unitários." |

### Como transformar qualidade em requisito mensurável

Uma escrita de RNF mais madura normalmente explicita:

1. eixo de qualidade
2. cenário ou operação observada
3. carga ou condição de uso
4. métrica
5. limiar aceitável
6. forma de evidência

### Template prático

```text
No eixo [qualidade], o sistema deve [comportamento observável]
sob [condição/carga], medido por [métrica], com limite [valor],
validado por [teste, ferramenta ou evidência].
```

### Exemplos melhores para aula 1

```text
Eficiência de desempenho:
O sistema deve responder à consulta de produtos com p99 abaixo de 300ms
sob 100 requisições simultâneas, validado por teste de carga.
```

```text
Confiabilidade:
O sistema deve manter o fluxo de listagem funcional mesmo sob timeout
de serviço externo, com tratamento explícito de erro e retry controlado,
validado por teste de integração com falha simulada.
```

```text
Usabilidade:
O formulário de cadastro deve permitir conclusão sem erro em até 2 minutos
por usuários novatos em teste moderado com roteiro definido.
```

### Relação entre RF, RN e RNF em linguagem madura

Um discurso mais técnico sobre uma funcionalidade pode ficar assim:

| Tipo | Exemplo com linguagem de engenharia |
|------|-------------------------------------|
| RF | "O sistema deve permitir cadastrar produtos com nome, SKU e preço." |
| RN | "O SKU deve ser único e o preço deve ser maior que zero." |
| RNF | "O cadastro deve responder com `201` em `p99 < 300ms` para 100 requisições simultâneas e estar coberto pelos testes `produto.service.spec.ts` e `produtos.api.spec.ts`." |

### O que o aluno deve evitar a partir de agora

- elogio genérico sem métrica
- qualidade sem eixo
- desempenho sem carga definida
- confiabilidade sem cenário de falha
- segurança sem mecanismo de controle
- frase bonita sem evidência técnica

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

### 2.1 Evoluindo o RNF para linguagem verificável

A coluna de RNF da tabela acima ainda está em nível inicial. O passo seguinte é refinar:

| Formulação inicial | Formulação madura |
|--------------------|-------------------|
| resposta rápida | `GET /produtos` com `p99 < 300ms` sob 100 requisições simultâneas |
| disponibilidade | fluxo de consulta com taxa de sucesso acima de 99% no período observado |
| segurança | autenticação obrigatória em rotas de escrita e senha armazenada com hash |

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

### Refinando o RNF do caso para "engenheirês"

Em vez de dizer:

> "A busca precisa ser rápida."

O aluno deveria evoluir para algo como:

> "No eixo eficiência de desempenho, a consulta de produtos deve responder com `p99 < 300ms` sob 100 requisições simultâneas no horário de pico, validado por teste de carga; no eixo adequação funcional, o fluxo de consulta está coberto pela suíte `catalogo.e2e.spec.ts`."

### Perguntas para discutir

1. Quais entidades aparecem naturalmente nesse cenário?
2. Que ação do atendente claramente dispara uma requisição ao servidor?
3. Qual RNF já impacta decisões futuras de API e banco?

---

## Checklist de Estudo

- [ ] Consigo explicar a diferença entre cliente, servidor, banco e rede?
- [ ] Consigo descrever o fluxo de uma requisição HTTP simples?
- [ ] Consigo distinguir RF, RN e RNF?
- [ ] Consigo nomear os 8 eixos de RNF usados na disciplina?
- [ ] Consigo transformar "o sistema é bom" em uma frase com métrica, carga e evidência?
- [ ] Consigo diferenciar um RNF vago de um RNF mensurável?
- [ ] Consigo redigir um minimundo curto sem misturar solução e problema?
- [ ] Consigo apontar o que está fora do escopo do projeto?

---

## Referências

- [MDN Web Docs — Overview of HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview)
- [SWEBOK — Software Engineering Body of Knowledge](https://www.computer.org/education/bodies-of-knowledge/software-engineering/v4)
- [SEBoK — Stakeholder Needs Definition](https://sebokwiki.org/wiki/Stakeholder_Needs_Definition)
