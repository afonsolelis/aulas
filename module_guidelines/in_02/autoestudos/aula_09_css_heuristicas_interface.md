# Autoestudo: CSS, Layout e Heurísticas de Interface

## Sumário
1. [Contexto e Objetivo](#contexto-e-objetivo)
2. [Fundamentos de CSS para Interfaces Web](#fundamentos-de-css-para-interfaces-web)
3. [Layout com Flexbox](#layout-com-flexbox)
4. [Estados Visuais com JavaScript](#estados-visuais-com-javascript)
5. [Heurísticas de Usabilidade](#heurísticas-de-usabilidade)
6. [Conexão com Front-end 1 e 2](#conexão-com-front-end-1-e-2)
7. [Aprofundamento Orientado](#aprofundamento-orientado)
8. [Miniestudo de Caso](#miniestudo-de-caso)
9. [Checklist de Estudo](#checklist-de-estudo)
10. [Referências](#referências)

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

## Conexão com Front-end 1 e 2

Esta aula não substitui HTML, DOM e integração assíncrona; ela organiza e torna utilizável o que já foi construído.

| Aula anterior | O que ela entrega | O que esta aula melhora |
|---------------|-------------------|--------------------------|
| Aula 7 | estrutura e eventos | clareza visual e consistência |
| Aula 8 | integração e estados | representação visual desses estados |

### Exemplo de continuidade

```text
formulário funcional
→ recebe estilos coerentes
→ ganha feedback visual de erro
→ mostra loading, sucesso e falha com hierarquia clara
```

---

## Aprofundamento Orientado

### 1. Nem todo problema de UX é visual

Muitas vezes a interface está "bonita", mas continua ruim porque:

- a ordem das ações está confusa
- o feedback demora
- o usuário não entende a consequência do clique

### 2. Revisão heurística rápida de uma tela

Use este roteiro:

1. o usuário sabe onde começar?
2. a ação principal está visualmente destacada?
3. o sistema responde quando algo é salvo ou falha?
4. os erros aparecem perto do ponto de interação?
5. o layout continua legível em diferentes larguras?

### 3. Ponte para a aula 10

Uma interface mais estável e consistente também fica mais testável. Portanto, ao finalizar este estudo, o aluno deveria enxergar:

- que estados precisam ser cobertos por teste
- que mensagens críticas merecem validação
- que seletores visuais podem ajudar automação

---

## Miniestudo de Caso

### Tela funcional, mas difícil de usar

O formulário de cadastro já envia dados, porém o botão principal não se destaca, os erros aparecem longe dos campos e o usuário não percebe quando o salvamento terminou. A funcionalidade existe, mas a experiência continua ruim.

### Melhorias guiadas por heurística

| Problema observado | Ajuste de interface |
|--------------------|---------------------|
| ação principal pouco visível | reforçar hierarquia visual do botão |
| erro distante do campo | feedback próximo ao ponto de interação |
| ausência de retorno do sistema | estado visual de carregando e sucesso |
| layout confuso | espaçamento, agrupamento e alinhamento coerentes |

### Valor do caso

O aluno consegue ligar CSS e heurísticas a um problema real de uso. A aula deixa de ser apenas estilização e passa a tratar qualidade de interação.

### Perguntas para discutir

1. O que deve mudar visualmente entre os estados normal, carregando e erro?
2. Como destacar a ação principal sem poluir a tela?
3. Que escolhas de CSS ajudam depois na automação de testes da interface?

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
