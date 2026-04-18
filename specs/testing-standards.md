# Spec: Testes Automatizados com Playwright

## Objetivo

Padronizar os testes automatizados do portal, garantindo cobertura das specs e qualidade do código.

## Escopo

Aplica-se a todos os testes E2E escritos com Playwright no diretório `tests/`.

## Estrutura de Arquivos

```
tests/
├── playwright.config.ts      # Configuração do Playwright
├── test-helpers.ts           # Funções utilitárias compartilhadas
├── index.spec.ts             # Testes da página inicial
├── specs-compliance.spec.ts  # Testes de conformidade com specs
└── [outros testes futuros]
```

## Configuração do Playwright

### playwright.config.ts

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Adicionar outros browsers conforme necessidade
  ],
});
```

## Test Helpers

### Funções Obrigatórias

```typescript
// test-helpers.ts
import * as path from 'path';
import { pathToFileURL } from 'url';

const repoRoot = path.resolve(__dirname, '..');

// Converte caminho relativo para URL file://
export function toFileUrl(relativePath: string): string {
  return pathToFileURL(path.join(repoRoot, relativePath)).href;
}

// Resolve caminho absoluto no sistema de arquivos
export function resolveRepoPath(relativePath: string): string {
  return path.join(repoRoot, relativePath.replace(/^\/+/, ''));
}

// Resolve caminho relativo a partir de um arquivo HTML
export function resolveHtmlPath(htmlRelativePath: string, targetPath: string): string {
  return path.resolve(path.dirname(resolveRepoPath(htmlRelativePath)), targetPath);
}
```

## Estrutura de Testes

### Describe Blocks por Spec

Organizar testes em blocos `describe` nomeados conforme a spec testada:

```typescript
test.describe('routes-naming.md - Nomenclatura de Rotas', () => {
  test('deve seguir padrão kebab-case', async ({ page }) => {
    // teste
  });
});

test.describe('slides-footer.md - Footer dos Slides', () => {
  test('deve ter botão Home', async ({ page }) => {
    // teste
  });
});
```

### Nomenclatura de Testes

Padrão para nomes de teste:

```typescript
// Formato: [ação] + [objeto] + [expectativa]
test('deve ter botão Home visível no footer', async ({ page }) => {});

// Formato alternativo: [spec] + [regra] + [comportamento]
test('slides-footer: botão Material deve ter contraste forte', async ({ page }) => {});

// Para testes negativos
test('não deve permitir underscores em nomes de arquivo', () => {});
```

## Tipos de Testes

### 1. Testes de Estrutura Visual

Verificam elementos visuais e layout:

```typescript
test('deve ter cabeçalho visível', async ({ page }) => {
  await page.goto(toFileUrl('pages/home-module-2.html'));
  
  const header = page.locator('.portal-header');
  await expect(header).toBeVisible();
});

test('deve ter cor de fundo correta', async ({ page }) => {
  const element = page.locator('.card-header-si');
  await expect(element).toHaveCSS('background-color', 'rgb(137, 206, 165)');
});
```

### 2. Testes de Navegação

Verificam links e navegação:

```typescript
test('botão Voltar deve levar para index', async ({ page }) => {
  await page.goto(toFileUrl('pages/home-module-2.html'));
  
  const backBtn = page.locator('a:has-text("Voltar")');
  const href = await backBtn.getAttribute('href');
  expect(href).toContain('index.html');
});

test('links devem apontar para arquivos existentes', async ({ page }) => {
  const links = page.locator('a[href^="pages/"]');
  const count = await links.count();
  
  for (let i = 0; i < count; i++) {
    const href = await links.nth(i).getAttribute('href');
    expect(fs.existsSync(resolveRepoPath(href))).toBe(true);
  }
});
```

### 3. Testes de Conteúdo

Verificam existência de conteúdo textual:

```typescript
test('deve mencionar TAPI em Principais Tópicos', async ({ page }) => {
  await page.goto(toFileUrl('pages/home-module-2.html'));
  
  const topicosSection = page.locator('text=/Principais Tópicos/i');
  await expect(topicosSection).toBeVisible();
  
  const pageContent = await page.content();
  expect(pageContent).toContain('TAPI');
});
```

### 4. Testes de Arquivos

Verificam existência de arquivos no sistema:

```typescript
test('arquivos não devem usar underscore', () => {
  const pagesDir = resolveRepoPath('pages');
  const files = fs.readdirSync(pagesDir, { recursive: true });
  
  const filesWithUnderscore = files.filter(f => 
    f.endsWith('.html') && f.includes('_')
  );
  
  expect(filesWithUnderscore).toHaveLength(0);
});
```

### 5. Testes de Acessibilidade

Verificam atributos ARIA e navegação por teclado:

```typescript
test('botões desabilitados devem ter aria-disabled', async ({ page }) => {
  const disabledBtn = page.locator('.btn[aria-disabled="true"]');
  await expect(disabledBtn).toHaveAttribute('aria-disabled', 'true');
});

test('imagens devem ter alt text', async ({ page }) => {
  const images = page.locator('img');
  const count = await images.count();
  
  for (let i = 0; i < count; i++) {
    const alt = await images.nth(i).getAttribute('alt');
    expect(alt).toBeDefined();
  }
});
```

## Padrões de Assertiva

### Use Expect do Playwright

```typescript
// ✅ Correto
await expect(element).toBeVisible();
await expect(element).toHaveText('Texto esperado');
await expect(element).toHaveAttribute('href', '/link');
await expect(element).toHaveCSS('color', 'rgb(0, 0, 0)');

// ❌ Evitar
const isVisible = await element.isVisible();
expect(isVisible).toBe(true);
```

### Mensagens de Erro Personalizadas

```typescript
expect(
  fs.existsSync(resolveRepoPath(href!)), 
  `Arquivo ${href} não foi encontrado no repositório`
).toBe(true);
```

## Testando Múltiplas Páginas

### Loop sobre Lista de Arquivos

```typescript
test('todas as homes devem ter footer', async ({ page }) => {
  const homeFiles = [
    'pages/home-module-2-common.html',
    'pages/home-module-5-adm-tech.html',
    'pages/home-module-5-eng-software.html',
  ];

  for (const homeFile of homeFiles) {
    if (fs.existsSync(resolveRepoPath(homeFile))) {
      await page.goto(toFileUrl(homeFile));
      
      const footer = page.locator('footer');
      await expect(footer).toBeVisible();
    }
  }
});
```

### Testes Condicionais

```typescript
test('slides devem ter navegação', async ({ page }) => {
  const slideFiles = ['pages/module-2-common/slides/slide-lesson-1.html'];
  
  for (const slideFile of slideFiles) {
    if (fs.existsSync(resolveRepoPath(slideFile))) {
      await page.goto(toFileUrl(slideFile));
      
      const nav = page.locator('.slide-navigation');
      await expect(nav).toBeVisible();
    }
  }
});
```

## Hooks e Fixtures

### beforeEach para Navegação Comum

```typescript
test.describe('Página Inicial', () => {
  beforeEach(async ({ page }) => {
    await page.goto(toFileUrl('index.html'));
  });

  test('deve ter logo visível', async ({ page }) => {
    const logo = page.locator('.logo-container img');
    await expect(logo).toBeVisible();
  });
});
```

### beforeAll para Setup Pesado

```typescript
test.describe('Testes de Performance', () => {
  let page;
  
  beforeAll(async ({ browser }) => {
    page = await browser.newPage();
  });
  
  // testes...
});
```

## Cobertura de Specs

### Matriz de Cobertura

| Spec | Status do Teste |
|------|-----------------|
| routes-naming.md | ✅ specs-compliance.spec.ts |
| slides-format.md | ✅ specs-compliance.spec.ts |
| slides-footer.md | ✅ specs-compliance.spec.ts |
| home-pages.md | ✅ specs-compliance.spec.ts |
| lesson-cards.md | ✅ specs-compliance.spec.ts |
| index-module-cards.md | ✅ index.spec.ts + specs-compliance.spec.ts |
| module-2-common.md | ✅ specs-compliance.spec.ts |
| accessibility.md | 🔄 Parcial |
| navigation-links.md | 🔄 Parcial |
| placeholders.md | ⏳ Pendente |
| autoestudos-pages.md | ⏳ Pendente |

## Executando Testes

### Comandos

```bash
# Rodar todos os testes
npx playwright test

# Rodar com UI
npx playwright test --ui

# Rodar projeto específico
npx playwright test --project=chromium

# Rodar arquivo específico
npx playwright test tests/index.spec.ts

# Rodar teste específico por nome
npx playwright test -g "deve ter logo"

# Rodar com relatório HTML
npx playwright test --reporter=html
```

### CI/CD Integration

```yaml
# Exemplo GitHub Actions
name: Playwright Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npx playwright test
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```

## Boas Práticas

### ✅ Faça

- Nomear testes de forma descritiva
- Agrupar testes por spec/domínio
- Usar helpers para caminhos de arquivo
- Adicionar mensagens de erro personalizadas
- Testar arquivos existentes antes de navegar
- Usar `aria-disabled` em vez de verificar estado visual
- Manter testes independentes e idempotentes

### ❌ Não Faça

- Não usar caminhos absolutos hardcoded
- Não depender de ordem de execução de testes
- Não usar timeouts longos sem necessidade
- Não testar implementação interna, testar comportamento
- Não ignorar falhas de teste sem justificativa
- Não commitar testes quebrados

## Manutenção de Testes

### Quando Atualizar Testes

1. Nova spec criada → adicionar testes de conformidade
2. Spec modificada → atualizar testes afetados
3. Nova página/componente → adicionar testes específicos
4. Bug encontrado → adicionar teste regressivo

### Quando Remover Testes

1. Spec removida oficialmente
2. Feature descontinuada com aprovação
3. Teste duplicado por outro mais abrangente

## Debugging

### Modo Debug

```bash
# Rodar com debugger
npx playwright test --debug

# Rodar com headed (browser visível)
npx playwright test --headed

# Rodar teste específico com debug
npx playwright test -g "nome do teste" --debug
```

### Trace Viewer

```bash
# Rodar com trace habilitado (já configurado no config)
npx playwright test

# Ver trace após falha
npx playwright show-trace trace.zip
```

## Recursos

- [Playwright Documentation](https://playwright.dev/)
- [Playwright Assertions](https://playwright.dev/docs/test-assertions)
- [Test Fixtures](https://playwright.dev/docs/test-fixtures)
