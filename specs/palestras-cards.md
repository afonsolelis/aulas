# Spec: Cards de Palestras

## Objetivo

Cada palestra na página `home-palestras.html` deve identificar claramente a empresa parceira que a originou.

---

## Regras obrigatórias

### Tag de empresa (obrigatória)

Todo card de palestra **deve ter** um elemento com a classe `company-tag` exibindo o nome da empresa.

```html
<div><span class="company-tag">🏢 Nome da Empresa</span></div>
```

**Posição:** imediatamente após o logo da empresa (ou após o ícone/header do card), antes do título `<h3>`.

**CSS obrigatório (definido em `home-palestras.html`):**
```css
.company-tag {
  display: inline-block;
  background: #f1f4f8;
  border: 1px solid #dfe5ec;
  color: #374151;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 999px;
  margin-bottom: 10px;
  letter-spacing: 0.02em;
}
```

---

## Estrutura completa do card

```html
<div class="col-md-6 col-lg-4">
  <div class="card topic-card p-4 text-center">
    <!-- Logo da empresa (opcional se não houver) -->
    <img src="..." alt="Logo da Empresa" style="height: 40px; margin-bottom: 12px;">
    <!-- Tag de empresa (obrigatória) -->
    <div><span class="company-tag">🏢 Nome da Empresa</span></div>
    <!-- Título da palestra -->
    <h3 class="h4">Título da Palestra</h3>
    <p class="text-muted">Descrição breve da palestra.</p>
    <div class="d-flex justify-content-center gap-2 mt-auto">
      <a href="palestras/slides/slide_xxx.html" class="btn btn-sm btn-primary">Slides</a>
      <a href="palestras/materials/xxx-material.html" class="btn btn-sm btn-outline-secondary">Material</a>
    </div>
  </div>
</div>
```

---

## Exemplos de empresas

| Empresa | Tag |
|---------|-----|
| BNP Paribas Cardif (seguradora) | `🏢 BNP Paribas Cardif` |

---

## Regras de validação

1. Todo card em `home-palestras.html` deve conter `class="company-tag"`.
2. O texto da tag deve identificar a empresa real que deu ou patrocinou a palestra.
3. O emoji `🏢` é obrigatório antes do nome.
