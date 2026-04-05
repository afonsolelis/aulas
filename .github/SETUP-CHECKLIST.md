# ✅ Checklist de Setup do Pipeline CI/CD

Use este checklist para garantir que o pipeline está pronto para usar.

## 🔧 Instalação (Primeira Vez)

- [ ] Dependências instaladas localmente: `npm install`
- [ ] Testes rodam localmente: `npm test` ✅ passa
- [ ] Seu repositório é **público** (requirement do GitHub Pages)

## 📋 Configurações do GitHub

### GitHub Pages
- [ ] Settings → Pages
- [ ] Source: **GitHub Actions**
- [ ] Clique **Save**

### Branches
- [ ] Você tem um branch `main` ou `develop`
- [ ] Branch principal está configurado (Settings → Branches → Default)
- [ ] Proteção de branch configurada (opcional, recomendado)

### Workflows
- [ ] Vá para **Actions** tab
- [ ] Você vê "CI/CD - Test & Deploy to Pages" workflow
- [ ] Você vê "Code Quality Checks" workflow

## 🚀 Teste Inicial

Execute este teste para confirmar que está tudo funcionando:

```bash
# 1. Crie uma branch de teste
git checkout -b test-pipeline

# 2. Faça uma mudança pequena (ex: comentário)
echo "<!-- Test pipeline -->" >> index.html

# 3. Commit e push
git add index.html
git commit -m "Test: Pipeline validation"
git push -u origin test-pipeline

# 4. Crie um Pull Request para 'main' ou 'develop'
# (GitHub vai mostrar opção no output do push)

# 5. Vá para seu repo no GitHub
# Actions tab → Aguarde os workflows rodar (2-3 minutos)
# PR → Veja os comentários de teste aparecerem
```

### Resultados Esperados

**No Pull Request:**
- ✅ Status check "CI/CD - Test & Deploy to Pages" aparece
- ✅ Status check "Code Quality Checks" aparece
- ✅ Ambos mostram ✅ verde (tests passed)
- ✅ Um comentário com "Test Results" aparece na PR

**No Actions Tab:**
- ✅ Workflow "CI/CD - Test & Deploy to Pages" está verde
- ✅ Job "Run Tests" está verde
- ✅ Job "Deploy" aparece em cinza (não roda em PR)

**Não esperado em PR:**
- ❌ Deploy job NÃO roda em PR (só em push para main/develop)

## ✅ Merging & Deploy

Quando tudo estiver OK:

```bash
# 1. Merge da PR (via GitHub UI ou CLI)
# 2. Vá para Actions tab novamente
# 3. Veja o workflow rodar novamente
# 4. Desta vez, o job "Deploy" vai executar
# 5. Aguarde ~5-8 minutos total
# 6. Vá para https://afonsolelis.github.io/aulas/
# 7. Verifique se sua mudança aparece
```

### Resultados Esperados após Merge

- ✅ Workflow roda novamente
- ✅ Job "Run Tests" passa (verde)
- ✅ Job "Deploy" executa (verde)
- ✅ Site atualizado em ~5-8 minutos
- ✅ Sua mudança aparece no site

## 🧹 Limpeza

Após o teste bem-sucedido:

```bash
# Delete a branch de teste (local e remoto)
git checkout main
git branch -d test-pipeline
git push origin --delete test-pipeline
```

## 🆘 Troubleshooting

### ❌ Workflow não aparece em Actions tab
- **Causa:** Workflows não foram detectados
- **Solução:** Verifique que `ci-cd.yml` e `quality-checks.yml` estão em `.github/workflows/`

### ❌ Testes falhando em CI mas passando localmente
- **Causa:** Diferença de ambiente
- **Solução:** 
  - Verifique `npm ci` (não `npm install`)
  - Verifique Playwright version matching

### ❌ Deploy não acontece após merge
- **Causa:** Source não está em "GitHub Actions"
- **Solução:** Settings → Pages → Source → GitHub Actions → Save

### ❌ Site mostra conteúdo antigo
- **Causa:** Cache do navegador
- **Solução:** Hard refresh (Ctrl+F5) ou modo incógnito

### ❌ "Read access with auth token has expired"
- **Causa:** Token de permissão expirado
- **Solução:** Rerun workflow (botão retry no Actions tab)

## 📊 Status Esperado

Após setup completo, você verá:

### Em cada PR
```
✅ CI/CD - Test & Deploy to Pages
✅ Code Quality Checks
📊 Test Results (comentário automático)
```

### Em cada merge para main/develop
```
✅ CI/CD - Test & Deploy to Pages (com Deploy job verde)
✅ Site atualizado em https://afonsolelis.github.io/aulas/
```

## 📚 Próximas Leituras

- `.github/QUICKSTART.md` - Uso diário do pipeline
- `.github/CI-CD-PIPELINE.md` - Documentação técnica
- `.github/PAGES-SETUP.md` - Setup avançado do Pages

---

**Pronto?** 🎉 Quando tudo passar, está 100% configurado!
