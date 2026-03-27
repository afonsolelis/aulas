# 🚀 CI/CD Pipeline - Quick Start

## ✅ O que foi criado

Um pipeline **completo** de CI/CD com GitHub Actions que:

- ✅ **Roda testes automaticamente** em cada push e pull request
- ✅ **Faz deploy automático** no GitHub Pages quando os testes passam
- ✅ **Valida qualidade de código** (JSON, naming, segurança)
- ✅ **Comenta resultados** diretamente nos pull requests
- ✅ **Armazena relatórios** de teste por 30 dias

## 📁 Arquivos Criados

```
.github/
├── workflows/
│   ├── ci-cd.yml                    # Pipeline principal (teste + deploy)
│   └── quality-checks.yml           # Validação de código
├── CI-CD-PIPELINE.md                # Documentação técnica detalhada
├── PAGES-SETUP.md                   # Guia de setup do GitHub Pages
├── copilot-instructions.md          # Instruções para assistentes IA
```

## 🎯 Como Usar

### 1️⃣ Setup Inicial (1x)

```bash
# Verifique se está no branch principal
git branch -a

# Se precisar, crie/mude para 'main'
git checkout -b main

# Faça push para ativar os workflows
git push -u origin main
```

### 2️⃣ Habilitar GitHub Pages

1. Vá para **Settings** → **Pages**
2. Selecione **Source:** "GitHub Actions"
3. Clique **Save**

Pronto! ✅

### 3️⃣ Usar o Pipeline

**Workflow padrão:**

```bash
# Desenvolva suas mudanças
# ...

# Teste localmente
npm test

# Se passar, faça commit e push
git add .
git commit -m "Add module 9 materials"
git push origin main
```

**Depois do push:**
- ✅ GitHub Actions roda os testes automaticamente
- ✅ Se passarem, faz deploy em ~5-8 minutos
- ✅ Site fica disponível em: `https://afonsolelis.github.io/aulas/`

## 🔍 Monitorando

### Em PR (Pull Request)
- Testes rodam automaticamente
- Resultados aparecem como comentário no PR
- Você vê logo qual teste passou/falhou

### Em Push (main/develop)
- Testes rodam
- Se ✅ passarem → Deploy automático
- Se ❌ falharem → Pipeline para (sem deploy)

### Ver Detalhes
1. Vá para **Actions** tab
2. Clique no workflow mais recente
3. Expanda os jobs para ver logs

## 🧪 Testes Locais

Antes de fazer push, sempre teste localmente:

```bash
# Instalar dependências (primeira vez)
npm install

# Rodar todos os testes
npm test

# Rodar um teste específico
npx playwright test tests/home_pages.spec.ts

# Debug interativo
npx playwright test --ui

# Ver relatório anterior
npx playwright show-report
```

## 📊 Relatórios

Todos os testes geram relatórios HTML:

**Localmente:**
```bash
npx playwright show-report
```

**No GitHub:**
1. Actions → Workflow run → "Run Tests" job
2. Seção "Artifacts" → Download `playwright-report`
3. Abra `index.html` no navegador

## 🚨 Se algo falhar

### ❌ Testes falhando
1. Ver logs na aba "Run Tests"
2. Descarregar relatório Playwright
3. Reproduzir localmente com `npm test`
4. Corrigir e fazer novo push

### ❌ Deploy não acontece
1. Verificar se Pages está habilitado (Settings → Pages)
2. Verificar se Source está em "GitHub Actions"
3. Que testes passaram (verde no Actions)
4. Esperar 1-2 minutos pela propagação

### ❌ Site mostra conteúdo antigo
1. Limpar cache do navegador (Ctrl+F5)
2. Ou limpar cookies
3. Ou acessar de incógnito

## 📚 Documentação Completa

- **[CI-CD-PIPELINE.md](./CI-CD-PIPELINE.md)** - Detalhes técnicos do pipeline
- **[PAGES-SETUP.md](./PAGES-SETUP.md)** - Setup do GitHub Pages
- **[copilot-instructions.md](./copilot-instructions.md)** - Instruções para IA

## 🎯 Próximos Passos (Opcional)

Futuras melhorias podem incluir:
- [ ] Deploy preview em PRs (usar-url-temporária-para-revisar)
- [ ] Notificações no Slack/Discord
- [ ] Screenshots automatizados
- [ ] Teste de performance (Lighthouse)
- [ ] Teste de acessibilidade

## ✨ Tudo Pronto!

O pipeline está configurado e pronto para usar. Agora é só:

1. **Fazer mudanças** no código
2. **Testar localmente** (`npm test`)
3. **Fazer push** para `main` ou `develop`
4. **Tudo acontece automaticamente!** 🎉

---

**Tempo total do pipeline:** ~5-8 minutos
- Node setup: 30s
- Instalar deps: 20-40s
- Playwright setup: 30-60s
- Testes: 2-3 min
- Deploy: 1-2 min
