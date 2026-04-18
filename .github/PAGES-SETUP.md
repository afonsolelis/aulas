# GitHub Pages Setup

Este arquivo guia o setup do GitHub Pages para publicar automaticamente os materiais de aula.

## Pré-requisitos

- ✅ Repository deve ser **público** (requirement do GitHub Pages)
- ✅ Owner do repositório tem acesso às configurações
- ✅ Node.js 20+ instalado localmente (para testes antes de push)

## Setup Automático (Recomendado)

O pipeline está configurado para fazer deploy automático. Você precisa apenas:

### 1. Habilitar GitHub Pages

1. Vá para **Settings** → **Pages**
2. Em "Build and deployment":
   - **Source:** Selecione "GitHub Actions"
   - Clique **Save**

### 2. Criar/Verificar Branch Principal

Certifique-se de que você tem um branch principal (`main` ou `develop`):

```bash
# Criar branch main se não existir
git checkout -b main

# Fazer push da branch
git push -u origin main
```

### 3. Verificar Workflows

1. Vá para **Actions** tab
2. Você deve ver dois workflows:
   - ✅ "CI/CD - Test & Deploy to Pages"
   - ✅ "Code Quality Checks"

## Como Funciona

```
Você faz push para 'main' ou 'develop'
        ↓
GitHub Actions dispara os workflows
        ↓
Testes são executados (Playwright)
        ↓
    ✓ Todos passam?
        ↓
Código é deplorado para GitHub Pages
        ↓
Site fica disponível em:
https://afonsolelis.github.io/aulas/
```

## Testando Localmente Antes de Push

Antes de fazer push, sempre rode os testes:

```bash
# Instalar dependências
npm install

# Rodar testes
npm test

# Ver relatório detalhado
npx playwright show-report
```

Se todos os testes passarem localmente, pode fazer push com segurança!

## Monitorando o Deploy

### Ver Status em Tempo Real

1. Vá para **Actions** tab
2. Clique no workflow mais recente
3. Veja o progresso dos jobs

### Verificar Deployment Bem-Sucedido

1. Espere o workflow completar (verde ✅)
2. Visite: `https://afonsolelis.github.io/aulas/`
3. Verifique se as mudanças aparecem

## Troubleshooting

### ❌ Pipeline falha no job "Deploy"

**Problema:** Pages não está habilitado

**Solução:**
1. Settings → Pages
2. Mude "Source" para "GitHub Actions"
3. Espere 1-2 minutos
4. Faça novo push

### ❌ Testes falhando antes do deploy

**Problema:** Algum teste está quebrando

**Solução:**
1. Vá para Actions → workflow → "Run Tests" job
2. Baixe o artifact "playwright-report"
3. Abra `index.html` para ver qual teste falhou
4. Corrija localmente com `npm test --ui`
5. Faça novo push

### ❌ Site mostra conteúdo antigo

**Problema:** Cache do navegador

**Solução:**
```bash
# Limpar cache (Ctrl + Shift + Delete no Chrome/Firefox)
# Ou fazer hard refresh: Ctrl + F5
```

### ❌ Arquivo "404 Not Found"

**Problema:** Caminho relativo incorreto

**Solução:**
- Usar caminhos relativos em todos os links
- Ex: `pages/module-5-adm-tech/slides/slide-lesson-1.html`
- NÃO: `https://example.com/pages/...`

## Configurações Avançadas (Opcional)

### Adicionar Domínio Customizado

1. Settings → Pages
2. Em "Custom domain", insira seu domínio
3. Configure DNS CNAME no seu registrador de domínios
4. Aguarde validação (até 24h)

### Habilitar HTTPS

GitHub Pages faz isso automaticamente. Você verá um badge "https" na URL.

### Deploy Preview para PRs

Futura melhoria: Adicionar preview automático de PRs antes do merge.

## Workflows Inclusos

### 1. `.github/workflows/ci-cd.yml`
- Testa o código em push/PR
- Faz deploy em push para `main`/`develop`
- Comenta resultados em PRs

### 2. `.github/workflows/quality-checks.yml`
- Valida JSON files
- Verifica convenções de nomeação
- Scans de segurança

## Dúvidas?

Consulte:
- `.github/CI-CD-PIPELINE.md` – Documentação detalhada do pipeline
- `.github/copilot-instructions.md` – Instruções para assistentes de IA
- `specs/05-casos-teste.md` – Detalhes sobre os testes

---

**Status:** ✅ Pipeline pronto para usar!
