# Spec: Placeholders e Conteúdo em Construção

## Objetivo

Definir padrões para páginas e componentes em desenvolvimento, garantindo experiência adequada durante a construção do conteúdo.

## Escopo

Aplica-se a todas as páginas e componentes em desenvolvimento no portal.

## Princípios

1. **Transparência**: Usuário deve saber que está vendo conteúdo incompleto
2. **Progresso**: Placeholders devem indicar caminho para conteúdo final
3. **Qualidade**: Placeholder não é desculpa para baixa qualidade visual
4. **Temporariedade**: Placeholders devem ser removidos quando conteúdo for implementado

## Tipos de Placeholders

### 1. Módulo em Construção

Quando um módulo inteiro ainda não tem aulas publicadas:

```html
<div class="module-under-construction">
  <div class="topic-icon">🚧</div>
  <h2>Módulo em Construção</h2>
  <p>Este módulo está sendo desenvolvido e estará disponível em breve.</p>
  <p class="text-muted">Enquanto isso, explore outros módulos ou volte para o início.</p>
  <a href="../index.html" class="btn btn-primary">Voltar para o Início</a>
</div>
```

**Requisitos:**
- Ícone de construção (🚧 ou similar)
- Mensagem clara de que está em desenvolvimento
- Botão de ação alternativa (voltar, explorar outros)
- Manter header e footer padrão da home

### 2. Aula em Construção

Quando uma aula específica não tem conteúdo:

```html
<div class="lesson-card lesson-placeholder">
  <div class="lesson-number">Aula 5</div>
  <h3>Título da Aula</h3>
  <div class="lesson-date">
    <span class="badge bg-warning">Em breve</span>
  </div>
  <div class="lesson-buttons disabled">
    <span class="btn btn-secondary disabled" aria-disabled="true">
      🎞️ Slides
    </span>
    <span class="btn btn-secondary disabled" aria-disabled="true">
      📝 Material
    </span>
  </div>
</div>
```

**Requisitos:**
- Badge "Em breve" ou "Em construção"
- Botões desabilitados visualmente
- Manter número e título da aula
- aria-disabled="true" para acessibilidade

### 3. Slide Placeholder

Quando um slide deck existe mas conteúdo é incompleto:

```html
<div class="slide slide-placeholder">
  <h2>Título do Slide</h2>
  <div class="placeholder-content">
    <p>📝 <em>Conteúdo em desenvolvimento</em></p>
    <p class="text-muted">Este slide será preenchido com:</p>
    <ul>
      <li>Tópicos a serem cobertos</li>
      <li>Exemplos práticos</li>
      <li>Referências bibliográficas</li>
    </ul>
  </div>
</div>
```

**Requisitos:**
- Indicador visual claro de placeholder
- Lista de tópicos planejados (opcional mas recomendado)
- Manter navegação e footer funcionais
- Contador de slides deve funcionar normalmente

### 4. Material Placeholder

Quando o material de apoio ainda não existe:

```html
<!-- No footer do slide -->
<a href="lesson-3-material.html" class="btn-material placeholder">
  📖 Material <span class="badge bg-secondary">Em breve</span>
</a>
```

**Requisitos:**
- Badge indicativa
- Link pode existir mas página deve ter placeholder
- Ou usar href="#" com aria-disabled

### 5. Link Placeholder em Tópicos

Quando lista de tópicos tem itens não implementados:

```html
<ul class="topicos-list">
  <li><a href="recurso-existente.html">TAPI</a></li>
  <li><a href="" class="placeholder-link">Recurso em Desenvolvimento</a></li>
  <li><span class="text-muted">Tópico Futuro</span> <small>(em breve)</small></li>
</ul>
```

**Requisitos:**
- href="" ou href="#" com indicação visual
- Texto "(em breve)" ou similar
- Não parecer link clicável se não funcionar

## Estilos Visuais para Placeholders

### Cores e Badges

| Estado | Cor | Badge |
|--------|-----|-------|
| Em construção | Amarelo/Warning | "Em construção" |
| Em breve | Azul/Info | "Em breve" |
| Desabilitado | Cinza/Secondary | "Indisponível" |

### Efeitos Visuais

```css
/* Card placeholder */
.lesson-card.placeholder {
  opacity: 0.7;
  background: repeating-linear-gradient(
    45deg,
    #f8f9fa,
    #f8f9fa 10px,
    #e9ecef 10px,
    #e9ecef 20px
  );
}

/* Botão desabilitado */
.btn.disabled,
.btn[aria-disabled="true"] {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

/* Link placeholder */
a.placeholder-link {
  color: #6c757d;
  text-decoration: none;
  cursor: default;
}
```

## Mensagens de Placeholder

### Padrão

```
🚧 [Elemento] em Construção

Este [elemento] está sendo desenvolvido e estará disponível em breve.

[Opcional: Detalhes do que será incluído]

[Link para ação alternativa]
```

### Variações

**Para aulas:**
```
📚 Aula em Desenvolvimento

O conteúdo desta aula está sendo preparado.

Previsto para: [data se disponível]
```

**Para materiais:**
```
📝 Material em Breve

O material de apoio complementar será disponibilizado em breve.
```

**Para slides:**
```
🎞️ Conteúdo em Construção

Este slide está sendo desenvolvido.
Tópicos planejados: [lista]
```

## Prazos e Remoção

### Timeline Recomendada

1. **Placeholder Inicial**: Máximo 2 semanas
2. **Conteúdo Parcial**: Máximo 4 semanas
3. **Conteúdo Completo**: Idealmente antes de cada aula

### Processo de Remoção

1. Implementar conteúdo real
2. Remover todos os indicadores de placeholder
3. Testar navegação e links
4. Atualizar testes automatizados se aplicável
5. Commit com mensagem clara da mudança

### Monitoramento

1. Manter lista de placeholders ativos (opcional)
2. Revisar antes de cada sprint/módulo
3. Priorizar remoção em ordem de uso (aulas atuais primeiro)

## Exceções

1. **Conteúdo Opcional**: Materiais complementares podem permanecer como placeholder por mais tempo
2. **Recursos Experimentais**: Features em beta podem ter placeholder permanente com indicação clara
3. **Conteúdo Externo**: Links para recursos de terceiros podem ter fallback se recurso sair do ar

## Validação

1. Placeholders devem ser visualmente distintos
2. Mensagens devem ser claras e em português
3. Navegação não deve quebrar em páginas com placeholder
4. Tests devem passar mesmo com placeholders (usando aria-disabled)

## Exemplo Completo: Home de Módulo em Construção

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <title>Módulo X - Em Construção</title>
  <!-- styles -->
</head>
<body>
  <header class="portal-header">
    <a href="../index.html" class="btn-voltar">← Voltar</a>
    <h1>Módulo X: Nome do Módulo</h1>
  </header>

  <main class="container">
    <div class="row">
      <aside class="col-md-3">
        <div class="card">
          <h3>Sobre o Módulo</h3>
          <p>Descrição do módulo.</p>
        </div>
      </aside>

      <div class="col-md-9">
        <div class="module-under-construction text-center py-5">
          <div class="topic-icon">🚧</div>
          <h2>Módulo em Construção</h2>
          <p class="lead">Estamos preparando este conteúdo com cuidado para você.</p>
          <p class="text-muted">
            As aulas serão disponibilizadas progressivamente.<br>
            Previsto para: <strong>Próximo mês</strong>
          </p>
          <hr class="my-4">
          <a href="../index.html" class="btn btn-primary">
            Explorar Outros Módulos
          </a>
        </div>
      </div>
    </div>
  </main>

  <footer class="inteli-footer">
    <!-- footer content -->
  </footer>
</body>
</html>
```

## Recursos

- Use emojis para tornar placeholders mais amigáveis
- Mantenha tom positivo e profissional
- Inclua prazos quando possível (mesmo que estimados)
- Forneça alternativas de navegação sempre
