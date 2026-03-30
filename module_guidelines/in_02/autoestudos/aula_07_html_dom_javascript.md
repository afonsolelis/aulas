# Autoestudo: HTML Semântico, DOM e JavaScript no Front-end

## Sumário
1. [Contexto e Objetivo](#contexto-e-objetivo)
2. [HTML Semântico](#html-semântico)
3. [DOM e Seleção de Elementos](#dom-e-seleção-de-elementos)
4. [Eventos e Manipulação com JavaScript](#eventos-e-manipulação-com-javascript)
5. [Validação Simples no Cliente](#validação-simples-no-cliente)
6. [Checklist de Estudo](#checklist-de-estudo)
7. [Referências](#referências)

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

## Checklist de Estudo

- [ ] Consigo montar uma página com HTML semântico?
- [ ] Consigo selecionar elementos com `querySelector`?
- [ ] Consigo reagir a `click` e `submit`?
- [ ] Consigo alterar texto e classes via JavaScript?
- [ ] Sei por que validar no cliente não elimina validação no backend?

---

## Referências

- MDN Web Docs — HTML
- MDN Web Docs — DOM
- JavaScript.info — Browser Document
