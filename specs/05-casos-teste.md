# Especificação de Casos de Teste

## Visão Geral

Esta especificação define os casos de teste automatizados e manuais para validação do conteúdo do projeto Aulas. Os testes são executados usando **Playwright** com TypeScript.

## Configuração dos Testes

### Arquivo de Configuração

`playwright.config.ts`:

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
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
```

### Scripts npm

```json
{
  "scripts": {
    "test": "npx playwright test",
    "prepare": "husky install"
  }
}
```

### Execução de Testes

```bash
# Instalar dependências
npm install

# Rodar todos os testes
npm test

# Rodar testes com UI
npx playwright test --ui

# Rodar testes específicos
npx playwright test index.spec.ts

# Rodar testes em modo headless
npx playwright test --headed

# Gerar relatório
npx playwright show-report
```

## Estrutura de Arquivos de Teste

```
tests/
├── test-helpers.ts                 # Utilitários compartilhados
├── index.spec.ts                   # Testes da página inicial
├── home_pages.spec.ts              # Testes das home pages de módulo
├── lesson_structure.spec.ts        # Validação de slides
└── auth.spec.ts                    # (opcional) Testes de autenticação
```

## Test Helpers

`tests/test-helpers.ts`:

```typescript
import * as path from 'path';
import { pathToFileURL } from 'url';

const repoRoot = path.resolve(__dirname, '..');

/**
 * Converte caminho relativo para URL de arquivo
 */
export function toFileUrl(relativePath: string): string {
  const normalized = relativePath.replace(/^\/+/, '');
  return pathToFileURL(path.join(repoRoot, normalized)).href;
}

/**
 * Resolve caminho absoluto no repositório
 */
export function resolveRepoPath(relativePath: string): string {
  return path.join(repoRoot, relativePath.replace(/^\/+/, ''));
}

/**
 * Resolve caminho HTML relativo
 */
export function resolveHtmlPath(htmlRelativePath: string, targetPath: string): string {
  return path.resolve(path.dirname(resolveRepoPath(htmlRelativePath)), targetPath);
}
```

## Casos de Teste

### 1. Página Inicial (index.spec.ts)

**Arquivo:** `tests/index.spec.ts`

#### Teste: Logo do Inteli visível

```typescript
test('o logo do inteli deve estar visível e funcionando', async ({ page }) => {
  const logo = page.locator('.logo-container img');
  await expect(logo).toBeVisible();

  const src = await logo.getAttribute('src');
  expect(src).toContain('res.cloudinary.com');
});
```

**O que valida:**
- Logo está presente na página
- URL da logo aponta para CDN válido (Cloudinary)

#### Teste: Cards apontam para arquivos home_*.html

```typescript
test('todos os cards devem apontar para um arquivo "home_*.html"', async ({ page }) => {
  const cardLinks = page.locator('.row.g-4 a');
  const count = await cardLinks.count();

  expect(count).toBeGreaterThan(0);

  for (let i = 0; i < count; i++) {
    const link = cardLinks.nth(i);
    const href = await link.getAttribute('href');

    if (href !== '#') {
      expect(href, `O link "${href}" deve começar com "pages/home_"`)
        .toMatch(/^pages\/home_/);

      expect(fs.existsSync(resolveRepoPath(href!)), 
        `O arquivo ${href} não foi encontrado`)
        .toBe(true);
    }
  }
});
```

**O que valida:**
- Todos os links começam com `pages/home_`
- Arquivos HTML existem fisicamente no repositório

#### Teste: Cores dos cards de disciplinas

```typescript
test('as cores dos cards de disciplinas devem seguir o padrão estabelecido', async ({ page }) => {
  const colors = {
    si: 'rgb(137, 206, 165)',   // Verde (#89cea5)
    eng: 'rgb(255, 69, 69)',    // Vermelho (#ff4545)
    adm: 'rgb(46, 38, 64)'      // Navy (#2e2640)
  };

  // Testa SI
  const siHeaders = page.locator('.card-header-si');
  const siCount = await siHeaders.count();
  for (let i = 0; i < siCount; i++) {
    await expect(siHeaders.nth(i))
      .toHaveCSS('background-color', colors.si);
  }

  // Testa Eng
  const engHeaders = page.locator('.card-header-eng-software');
  const engCount = await engHeaders.count();
  for (let i = 0; i < engCount; i++) {
    await expect(engHeaders.nth(i))
      .toHaveCSS('background-color', colors.eng);
  }

  // Testa Adm
  const admHeaders = page.locator('.card-header-adm-tech');
  const admCount = await admHeaders.count();
  for (let i = 0; i < admCount; i++) {
    await expect(admHeaders.nth(i))
      .toHaveCSS('background-color', colors.adm);
  }
});
```

**O que valida:**
- Cards de SI têm fundo verde (#89cea5)
- Cards de Eng. Software têm fundo vermelho (#ff4545)
- Cards de Adm Tech têm fundo navy (#2e2640)

### 2. Páginas de Módulos (home_pages.spec.ts)

**Arquivo:** `tests/home_pages.spec.ts`

#### Teste: Cores consistentes

```typescript
test('Cores devem ser consistentes (Header, Badge, Lesson Numbers, Buttons)', async ({ page }) => {
  const colors = {
    adm: 'rgb(46, 38, 64)',   // Navy
    si: 'rgb(137, 206, 165)', // Verde
    eng: 'rgb(255, 69, 69)'   // Vermelho
  };

  let expectedColor = '';
  if (fileName.includes('adm-tech')) expectedColor = colors.adm;
  else if (fileName.includes('sistemas-informacao')) expectedColor = colors.si;
  else if (fileName.includes('eng-software')) expectedColor = colors.eng;

  if (expectedColor) {
    // Header
    const header = page.locator('.module-header');
    await expect(header).toHaveCSS('background-color', expectedColor);

    // Badge
    const badge = page.locator('.module-header .module-badge');
    await expect(badge).toHaveCSS('background-color', expectedColor);

    // Lesson Numbers
    const lessonNumbers = page.locator('.lesson-number');
    const count = await lessonNumbers.count();
    for (let i = 0; i < count; i++) {
      await expect(lessonNumbers.nth(i))
        .toHaveCSS('background-color', expectedColor);
    }

    // Botões de Slides
    const slidesButtons = page.locator('.btn-slides, .btn-adm, .btn-si, .btn-eng')
      .filter({ hasText: /Slides/ });
    const slidesCount = await slidesButtons.count();
    for (let i = 0; i < slidesCount; i++) {
      await expect(slidesButtons.nth(i))
        .toHaveCSS('background-color', expectedColor);
    }
  }
});
```

**O que valida:**
- Header tem cor do curso
- Badge tem mesma cor do header
- Números das lições têm cor do curso
- Botões "Slides" têm cor sólida do curso

#### Teste: Header formatado

```typescript
test('Header deve ter a tag do curso e o nome do projeto formatado', async ({ page }) => {
  const badge = page.locator('.module-header .module-badge');
  await expect(badge).toBeVisible();
  
  const h1 = page.locator('.module-header h1');
  const h3 = page.locator('.module-header h3');
  
  await expect(h1).toContainText(/Projeto \d+/);
  await expect(h3).not.toBeEmpty();
});
```

**O que valida:**
- Badge do curso visível
- H1 contém "Projeto N"
- H3 tem descrição não vazia

#### Teste: Seções obrigatórias

```typescript
test('deve possuir as seções obrigatórias: Sobre, Tópicos e Aulas', async ({ page }) => {
  await expect(page.locator('h5:has-text("Sobre o Módulo")')).toBeVisible();
  await expect(page.locator('h5:has-text("Principais Tópicos")')).toBeVisible();
  await expect(page.locator('h4:has-text("Aulas do Módulo")')).toBeVisible();
});
```

**O que valida:**
- Seção "Sobre o Módulo" presente
- Seção "Principais Tópicos" presente
- Seção "Aulas do Módulo" presente

#### Teste: Link TAPI

```typescript
test('deve conter o link do TAPI nos principais tópicos', async ({ page }) => {
  const tapiLink = page.locator('a[href*="tapi.inteli.edu.br"]');
  await expect(tapiLink).toBeVisible();
  await expect(tapiLink).toHaveAttribute('target', '_blank');
});
```

**O que valida:**
- Link para TAPI presente
- Link abre em nova aba (target="_blank")

#### Teste: Botões Slides e Material

```typescript
test('cada card de aula deve ter botões de Slides e Material', async ({ page }) => {
  const lessonCards = page.locator('.lesson-card');
  const count = await lessonCards.count();
  
  if (count > 0) {
    for (let i = 0; i < count; i++) {
      const card = lessonCards.nth(i);
      const btnSlides = card.locator('a:has-text("Slides"), a:has-text("🖥️")');
      const btnMaterial = card.locator('a:has-text("Material"), a:has-text("📖")');
      
      await expect(btnSlides).toBeVisible();
      await expect(btnMaterial).toBeVisible();
    }
  }
});
```

**O que valida:**
- Cada card tem botão para Slides
- Cada card tem botão para Material

#### Teste: Link Voltar funcional

```typescript
test('deve possuir um link de "Voltar" funcional', async ({ page }) => {
  const backLink = page.locator('a:has-text("Voltar"), a:has-text("←")').first();
  await expect(backLink).toBeVisible();
  
  const href = await backLink.getAttribute('href');
  expect(href).toMatch(/index\.html|^\.\.\/$/);
  expect(fs.existsSync(resolveHtmlPath(pagePath, href!))).toBe(true);
});
```

**O que valida:**
- Link "Voltar" presente
- Link aponta para index.html ou relativo válido
- Arquivo de destino existe

### 3. Validação de Slides (lesson_structure.spec.ts)

**Arquivo:** `tests/lesson_structure.spec.ts`

#### Teste: Estrutura de Slides HTML

```typescript
test('Módulo X - Slide Y: Capa e Agenda', async ({ page }) => {
  await page.goto(toFileUrl(`pages/module-X/slides/slide-lesson-Y.html`));

  // 1. Validação do Slide 1: Capa
  const firstSlide = page.locator('.slide-container .slide').first();
  await expect(firstSlide).toBeVisible();

  const logoCover = firstSlide.locator('img[src*="cloudinary"], .logo-cover');
  await expect(logoCover).toBeVisible();

  const title = firstSlide.locator('h1');
  await expect(title).not.toBeEmpty();

  const topics = firstSlide.locator('.topics-grid');
  await expect(topics).toBeVisible();

  // 2. Validação do Slide 2: Agenda
  await page.keyboard.press('ArrowRight');

  const secondSlide = page.locator('.slide-container .slide').nth(1);
  await expect(secondSlide).toBeVisible();

  const agendaTitle = secondSlide.locator('h2, h1');
  await expect(agendaTitle).toContainText(/Agenda/i);

  const agendaItems = secondSlide.locator('li, .info-card, .topic-item');
  const count = await agendaItems.count();
  expect(count).toBeGreaterThan(0);

  // 3. Botões de Navegação
  const btnHome = page.locator('.btn-home, a[href*="home_module"]');
  const btnMaterial = page.locator('.btn-material, a[href*="materials/lesson"]');
  await expect(btnHome).toBeVisible();
  await expect(btnMaterial).toBeVisible();
});
```

**O que valida:**
- Slide 1 (Capa) tem logo visível
- Slide 1 tem título não vazio
- Slide 1 tem grid de tópicos
- Slide 2 (Agenda) tem título com "Agenda"
- Slide 2 tem itens de agenda
- Botões Home e Material visíveis

## Matriz de Testes

| Arquivo | Descrição | Cobertura |
|---------|-----------|-----------|
| `index.spec.ts` | Página inicial | Logo, cards, cores |
| `home_pages.spec.ts` | Home pages de módulos | Estrutura, cores, links |
| `lesson_structure.spec.ts` | Slides | Capa, agenda, navegação |

## Checklist de Validação Manual

Além dos testes automatizados, valide manualmente:

### Conteúdo

- [ ] Texto sem erros de português
- [ ] Links externos funcionando
- [ ] Imagens carregando corretamente
- [ ] Código formatado corretamente

### Layout

- [ ] Responsivo em mobile
- [ ] Layout consistente entre páginas
- [ ] Cores seguindo padrão do curso
- [ ] Tipografia legível

### Navegação

- [ ] Todos os links internos funcionando
- [ ] Botões de navegação em slides
- [ ] Breadcrumb/voltar funcionando
- [ ] Navegação por teclado em slides

## Adicionando Novos Testes

### Estrutura de Novo Teste

```typescript
import { test, expect } from '@playwright/test';
import { toFileUrl } from './test-helpers';

test.describe('Nova Funcionalidade', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto(toFileUrl('pages/alvo.html'));
  });

  test('deve fazer algo específico', async ({ page }) => {
    // Arrange
    const elemento = page.locator('.seletor');
    
    // Act
    await elemento.click();
    
    // Assert
    await expect(elemento).toHaveClass('ativo');
  });
});
```

### Boas Práticas

1. **Use describe para agrupar** testes relacionados
2. **beforeEach** para setup comum
3. **Nomes descritivos** para testes
4. **Assertions específicos** com mensagens de erro claras
5. **Use helpers** para caminhos e URLs

## Tratamento de Erros Comuns

### Erro: Arquivo não encontrado

```typescript
// Use resolveRepoPath para validar existência
expect(fs.existsSync(resolveRepoPath(caminho)))
  .toBe(true);
```

### Erro: Seletor não encontrado

```typescript
// Verifique visibilidade antes
const elemento = page.locator('.seletor');
await expect(elemento).toBeVisible();
```

### Erro: Cor não corresponde

```typescript
// Use formato RGB para comparações
// rgb(46, 38, 64) em vez de #2e2640
await expect(elemento).toHaveCSS('background-color', 'rgb(46, 38, 64)');
```

## Relatório de Testes

Após executar os testes, visualize o relatório:

```bash
npx playwright show-report
```

O relatório HTML inclui:
- Lista de testes passados/falhados
- Screenshots de falhas
- Traços de execução (trace)
- Tempo de execução por teste
