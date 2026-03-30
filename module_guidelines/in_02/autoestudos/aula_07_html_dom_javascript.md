# Autoestudo: HTML Semântico, DOM e JavaScript no Front-end

## Sumário
1. [Contexto e Objetivo](#contexto-e-objetivo)
2. [HTML Semântico](#html-semântico)
3. [DOM e Seleção de Elementos](#dom-e-seleção-de-elementos)
4. [Eventos e Manipulação com JavaScript](#eventos-e-manipulação-com-javascript)
5. [Validação Simples no Cliente](#validação-simples-no-cliente)
6. [Conexão com API e Fluxo de Tela](#conexão-com-api-e-fluxo-de-tela)
7. [Aprofundamento Orientado](#aprofundamento-orientado)
8. [Miniestudo de Caso](#miniestudo-de-caso)
9. [Checklist de Estudo](#checklist-de-estudo)
10. [Referências](#referências)

---

## Contexto e Objetivo

Esta aula começa a construção da interface. O aluno deve conseguir estruturar uma página com HTML semântico, localizar elementos na árvore DOM e responder a eventos com JavaScript.

---

## HTML Semântico

HTML semântico ajuda leitura, acessibilidade e manutenção.

| Tag | Uso |
|-----|-----|
| `header` | cabeçalho da página |
| `nav` | navegação |
| `main` | conteúdo principal |
| `section` | agrupamento temático |
| `form` | formulário |
| `button` | ação acionável |

### Exemplo

```html
<main>
  <section>
    <h1>Novo Produto</h1>
    <form id="produto-form">
      <label for="nome">Nome</label>
      <input id="nome" name="nome">
      <button type="submit">Salvar</button>
    </form>
  </section>
</main>
```

---

## DOM e Seleção de Elementos

O DOM representa a página como árvore de objetos manipuláveis por JavaScript.

### Seleções comuns

```javascript
const form = document.querySelector('#produto-form');
const campoNome = document.querySelector('#nome');
const botoes = document.querySelectorAll('button');
```

### Operações úteis

- ler valor de input
- alterar texto
- adicionar ou remover classe
- criar ou remover elementos

---

## Eventos e Manipulação com JavaScript

Eventos ligam ação do usuário ao comportamento da interface.

```javascript
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const nome = campoNome.value.trim();
  console.log(nome);
});
```

### Eventos comuns

| Evento | Uso |
|--------|-----|
| `click` | clique em botão |
| `submit` | envio de formulário |
| `input` | digitação em campo |
| `change` | mudança de valor |

---

## Validação Simples no Cliente

A validação no cliente melhora usabilidade, mas não substitui validação no servidor.

### Exemplo

```javascript
if (!campoNome.value.trim()) {
  campoNome.classList.add('is-invalid');
}
```

### O que validar nesta etapa

- campo obrigatório
- formato básico
- feedback visual imediato
- mensagens simples de erro

---

## Conexão com API e Fluxo de Tela

O HTML e o DOM não existem isolados. Eles preparam a interface para a integração das próximas aulas.

| Elemento da tela | Ligação futura |
|------------------|----------------|
| formulário | envio para endpoint |
| lista ou tabela | renderização de resposta da API |
| botão | evento que dispara ação |
| mensagem de erro | feedback após validação ou falha |

### Exemplo de encadeamento

```text
usuário preenche formulário
→ submit é interceptado
→ JavaScript lê os campos
→ validação básica acontece
→ requisição poderá ser enviada
→ resposta futura atualizará o DOM
```

---

## Aprofundamento Orientado

### 1. Pensar a tela como estrutura + comportamento

Uma boa prática é desenhar cada tela em duas camadas mentais:

- estrutura semântica: o que existe na página
- comportamento: o que muda quando o usuário interage

### 2. Seletores estáveis

Evite depender de texto visual quando um `id` ou `data-*` pode deixar a lógica mais estável.

| Estratégia | Vantagem |
|-----------|----------|
| `#id` | seleção direta |
| `.classe` | útil para grupos |
| `data-testid` ou `data-role` | ajuda automação e scripts |

### 3. Ponte para a aula 8

Antes de falar em chamada assíncrona, a tela precisa já saber:

- onde o usuário aciona a operação
- que dados serão lidos
- onde o resultado será exibido
- onde erros e estados de carregamento aparecerão

---

## Miniestudo de Caso

### Formulário de cadastro de produto no navegador

O grupo precisa montar uma tela com três campos: nome, SKU e preço. O usuário deve preencher, clicar em salvar e receber feedback imediato se algum campo obrigatório estiver vazio.

### Decisões de implementação

| Necessidade | Solução provável |
|-------------|------------------|
| organizar a tela | HTML semântico com `form`, `label` e `input` |
| capturar envio | evento `submit` |
| ler dados | `querySelector` e `.value` |
| mostrar erro visual | classe CSS em campos inválidos |

### Valor do caso

O aluno percebe que front-end não começa com consumo de API. Primeiro a tela precisa ter estrutura, pontos de interação e estados locais claros.

### Perguntas para discutir

1. Que elementos precisam de `id` estável para facilitar script e teste?
2. O que deve acontecer visualmente quando o formulário está inválido?
3. Que parte já pode ser preparada agora para a futura chamada assíncrona da aula 8?

---

## Checklist de Estudo

- [ ] Consigo montar uma página com HTML semântico?
- [ ] Consigo selecionar elementos com `querySelector`?
- [ ] Consigo reagir a `click` e `submit`?
- [ ] Consigo alterar texto e classes via JavaScript?
- [ ] Sei por que validar no cliente não elimina validação no backend?

---

## Referências

- [MDN Web Docs — HTML](https://developer.mozilla.org/en-US/docs/Web/HTML)
- [MDN Web Docs — DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model)
- [JavaScript.info — DOM Nodes](https://javascript.info/dom-nodes)
