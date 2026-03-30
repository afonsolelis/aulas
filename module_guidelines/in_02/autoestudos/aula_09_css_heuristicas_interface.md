# Autoestudo: CSS, Layout e Heurísticas de Interface

## Sumário
1. [Contexto e Objetivo](#contexto-e-objetivo)
2. [Fundamentos de CSS para Interfaces Web](#fundamentos-de-css-para-interfaces-web)
3. [Layout com Flexbox](#layout-com-flexbox)
4. [Estados Visuais com JavaScript](#estados-visuais-com-javascript)
5. [Heurísticas de Usabilidade](#heurísticas-de-usabilidade)
6. [Checklist de Estudo](#checklist-de-estudo)
7. [Referências](#referências)

---

## Contexto e Objetivo

Esta aula consolida a camada de apresentação. O objetivo é sair do HTML funcional para uma interface organizada, legível e consistente, usando CSS e pequenos comportamentos em JavaScript.

---

## Fundamentos de CSS para Interfaces Web

| Tema | O que dominar |
|------|---------------|
| Seletores | classe, id, descendência |
| Box model | margin, border, padding, width |
| Tipografia | tamanho, peso, hierarquia |
| Cores | contraste, estados e consistência |

### Exemplo

```css
.card {
  padding: 16px;
  border-radius: 12px;
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}
```

---

## Layout com Flexbox

Flexbox resolve muitos layouts comuns de interface.

```css
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}
```

### Casos típicos

- alinhar botões na horizontal
- distribuir cards
- centralizar conteúdo
- criar espaços consistentes

---

## Estados Visuais com JavaScript

CSS e JavaScript trabalham juntos quando a interface muda de estado.

```javascript
botaoSalvar.disabled = true;
mensagem.classList.add('sucesso');
card.classList.toggle('selecionado');
```

### Exemplos de estados

| Estado | Efeito esperado |
|--------|------------------|
| carregando | spinner ou texto de espera |
| sucesso | mensagem positiva |
| erro | destaque visual e instrução |
| desabilitado | ação indisponível com clareza |

---

## Heurísticas de Usabilidade

Algumas perguntas simples ajudam a revisar a interface:

1. O usuário entende o que aconteceu após uma ação?
2. A tela usa linguagem do domínio, e não jargão técnico?
3. Os botões mais importantes estão visíveis?
4. Erros aparecem de forma clara?
5. O layout mantém consistência entre páginas?

### Pontos de atenção

| Heurística | Exemplo prático |
|-----------|-----------------|
| Visibilidade do status | mostrar feedback ao salvar |
| Consistência | mesmo estilo para botões iguais |
| Prevenção de erro | desabilitar envio inválido |
| Clareza visual | hierarquia tipográfica e espaçamento |

---

## Checklist de Estudo

- [ ] Sei aplicar CSS para melhorar legibilidade e hierarquia?
- [ ] Sei usar Flexbox em layouts simples?
- [ ] Consigo representar estados visuais da interface?
- [ ] Consigo identificar problemas de contraste e consistência?
- [ ] Consigo revisar uma tela usando heurísticas básicas?

---

## Referências

- MDN Web Docs — CSS
- CSS Tricks — Complete Guide to Flexbox
- Nielsen Norman Group — Usability Heuristics
