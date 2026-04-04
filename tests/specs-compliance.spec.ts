import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import {
  extractAnchorHrefs,
  extractImgTags,
  listHtmlFiles,
  readRepoFile,
  resolveHtmlPath,
  resolveRepoPath,
} from './test-helpers';

const allHomeFiles = listHtmlFiles('pages').filter((file) => /^pages\/home-.*\.html$/.test(file));
const moduleHomeFiles = allHomeFiles.filter((file) => file.includes('/home-module-'));
const publishedModuleHomes = [
  'pages/home-module-2-common.html',
  'pages/home-module-5-adm-tech.html',
  'pages/home-module-5-eng-software.html',
  'pages/home-module-6-eng-software.html',
  'pages/home-module-9-sistemas-informacao.html',
];
const underConstructionHomes = [
  'pages/home-module-7-sistemas-informacao.html',
  'pages/home-module-8-sistemas-informacao.html',
  'pages/home-module-11-eng-software.html',
];
const autoestudoFiles = listHtmlFiles('pages/autoestudos');
const module2Slides = listHtmlFiles('pages/module-2-common/slides');
const module6Slides = listHtmlFiles('pages/module-6-eng-software/slides');
const modernSlides = [...module2Slides, ...module6Slides];
const classicSlides = [
  ...listHtmlFiles('pages/module-5-adm-tech').filter((file) => /lesson-\d+\.html$/.test(file)),
  ...listHtmlFiles('pages/module-5-eng-software').filter((file) => /lesson-\d+\.html$/.test(file)),
  ...listHtmlFiles('pages/module-9-sistemas-informacao').filter((file) => /lesson-\d+\.html$/.test(file)),
];
const slideFiles = [...modernSlides, ...classicSlides];

function read(relativePath: string): string {
  return readRepoFile(relativePath);
}

function anchorHrefByLabel(html: string, label: string): string | null {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`<a\\b[^>]*href=(["'])(.*?)\\1[^>]*>[\\s\\S]*?${escaped}[\\s\\S]*?<\\/a>`, 'i');
  return html.match(regex)?.[2] ?? null;
}

function slideHomeHref(html: string): string | null {
  return html.match(/href=(["'])([^"']*home-module-[^"']+\.html)\1/i)?.[2] ?? null;
}

function slideMaterialHref(html: string): string | null {
  return html.match(/href=(["'])([^"']*lesson-\d+-material\.html)\1/i)?.[2] ?? null;
}

function existingRelativeTargets(htmlPath: string, hrefs: string[]): string[] {
  return hrefs.filter((href) => {
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
      return true;
    }
    if (/^(https?:)?\/\//i.test(href)) {
      return true;
    }
    return fs.existsSync(resolveHtmlPath(htmlPath, href));
  });
}

test.describe('README.md - Índice das Specs', () => {
  test('README deve listar specs principais existentes', () => {
    const readme = read('specs/README.md');
    [
      'routes-naming.md',
      'slides-format.md',
      'slides-footer.md',
      'home-pages.md',
      'lesson-cards.md',
      'index-module-cards.md',
      'module-2-common.md',
      'module2-slides.md',
      'lesson-materials.md',
    ].forEach((file) => {
      expect(readme).toContain(file);
      expect(fs.existsSync(resolveRepoPath(`specs/${file}`))).toBe(true);
    });
  });
});

test.describe('routes-naming.md - Nomenclatura de Rotas e Arquivos HTML', () => {
  test('homes devem usar kebab-case', () => {
    allHomeFiles.forEach((file) => {
      expect(file).toMatch(/^pages\/home-[a-z0-9-]+\.html$/);
    });
  });

  test('homes de módulo devem seguir padrão home-module-*', () => {
    moduleHomeFiles.forEach((file) => {
      expect(path.basename(file)).toMatch(/^home-module-\d+-[a-z0-9-]+\.html$/);
    });
  });

  test('não deve restar referência real a home_ fora de exemplos inválidos', () => {
    const filesToCheck = [
      'index.html',
      ...listHtmlFiles('pages'),
      ...listHtmlFiles('tests'),
      ...listHtmlFiles('specs').filter(() => false),
      'specs/README.md',
      'specs/home-pages.md',
      'specs/index-module-cards.md',
      'specs/lesson-cards.md',
      'specs/module-2-common.md',
      'specs/slides-footer.md',
      'specs/slides-format.md',
      'specs/navigation-links.md',
      'specs/autoestudos-pages.md',
      'specs/accessibility.md',
      'specs/placeholders.md',
      'specs/testing-standards.md',
    ];

    const offenders = filesToCheck.filter((file) => {
      const content = fs.readFileSync(resolveRepoPath(file), 'utf8');
      if (!content.includes('home_') && !content.includes('pages/home_')) {
        return false;
      }
      return !file.endsWith('routes-naming.md') && !file.endsWith('navigation-links.md');
    });

    expect(offenders).toEqual([]);
  });
});

test.describe('index-module-cards.md - Cards de Módulo na Index', () => {
  test('cards da index devem apontar para home-* existente em kebab-case', () => {
    const indexHtml = read('index.html');
    const homeLinks = extractAnchorHrefs(indexHtml).filter((href) => href.startsWith('pages/home-'));

    expect(homeLinks.length).toBeGreaterThan(0);
    homeLinks.forEach((href) => {
      expect(href).toMatch(/^pages\/home-[a-z0-9-]+\.html$/);
      expect(fs.existsSync(resolveRepoPath(href)), `${href} deve existir`).toBe(true);
    });
  });

  test('módulo 2 deve aparecer antes do módulo 5 de Adm Tech', () => {
    const indexHtml = read('index.html');
    expect(indexHtml.indexOf('pages/home-module-2-common.html')).toBeGreaterThanOrEqual(0);
    expect(indexHtml.indexOf('pages/home-module-5-adm-tech.html')).toBeGreaterThanOrEqual(0);
    expect(indexHtml.indexOf('pages/home-module-2-common.html')).toBeLessThan(indexHtml.indexOf('pages/home-module-5-adm-tech.html'));
  });

  test('card removido do módulo 4 não deve permanecer na index', () => {
    const indexHtml = read('index.html');
    expect(indexHtml).not.toMatch(/home-module-4|home_module-4/);
  });
});

test.describe('home-pages.md - Páginas Home', () => {
  test('toda home deve ter link de volta e footer institucional', () => {
    allHomeFiles.forEach((file) => {
      const html = read(file);
      expect(html).toMatch(/index\.html/);
      expect(html).toMatch(/<footer[\s\S]*Inteli/i);
    });
  });

  test('homes de módulo devem ter "Sobre o Módulo" e item TAPI', () => {
    moduleHomeFiles.forEach((file) => {
      const html = read(file);
      expect(html).toMatch(/Sobre o Módulo|About the Module/i);
      expect(html).toContain('TAPI');
    });
  });

  test('módulos em construção devem indicar estado de construção', () => {
    underConstructionHomes.forEach((file) => {
      const html = read(file);
      expect(html).toMatch(/Em construção|sendo preparadas/i);
      expect(html).toContain('Voltar para Página Inicial');
    });
  });
});

test.describe('lesson-cards.md - Cards de Aula nas Homes', () => {
  test('homes publicadas devem ter cards com número, título, slides e material válidos', () => {
    publishedModuleHomes.forEach((file) => {
      const html = read(file);
      const slideLinks = [...html.matchAll(/<a[^>]*href="([^"]+)"[^>]*>[\s\S]*?🎞️\s*Slides[\s\S]*?<\/a>/g)].map((match) => match[1]);
      const materialLinks = [...html.matchAll(/<a[^>]*href="([^"]+)"[^>]*>[\s\S]*?📝\s*Material[\s\S]*?<\/a>/g)].map((match) => match[1]);

      expect(html).toContain('lesson-number');
      expect(html).toContain('card-title');
      expect(slideLinks.length, `${file} deve ter botões de slides`).toBeGreaterThan(0);
      expect(materialLinks.length, `${file} deve ter botões de material`).toBe(slideLinks.length);
      expect(html).not.toMatch(/<a[^>]*class="[^"]*card-link[^"]*"[^>]*>\s*<div[^>]*class="[^"]*lesson-card/i);

      expect(existingRelativeTargets(file, slideLinks)).toEqual(slideLinks);
      expect(existingRelativeTargets(file, materialLinks)).toEqual(materialLinks);
    });
  });
});

test.describe('slides-footer.md - Footer dos Slides', () => {
  test('slides devem manter Home, Material, navegação e contador', () => {
    slideFiles.forEach((file) => {
      const html = read(file);
      const homeHref = slideHomeHref(html);
      const materialHref = slideMaterialHref(html);

      expect(homeHref, `${file} deve ter Home`).not.toBeNull();
      expect(materialHref, `${file} deve ter Material`).not.toBeNull();
      expect(homeHref).toMatch(/home-module-[a-z0-9-]+\.html$/);
      expect(existingRelativeTargets(file, [homeHref!, materialHref!])).toEqual([homeHref!, materialHref!]);
      expect(html).toMatch(/Anterior|Próximo/);
      expect(html).toMatch(/slide-counter|current-slide|total-slides/);
    });
  });

  test('botão Material deve manter estilo contrastante no HTML/CSS dos slides modernos', () => {
    modernSlides.slice(0, 2).forEach((file) => {
      const html = read(file);
      expect(html).toMatch(/\.back-home\.material\s*\{\s*background:\s*#2f8f78/i);
      expect(html).toMatch(/\.back-home\.material\s*\{[\s\S]*color:\s*white/i);
    });
  });
});

test.describe('slides-format.md - Formato dos Slides', () => {
  test('slides modernos não devem usar Reveal.js e devem manter estrutura própria', () => {
    modernSlides.forEach((file) => {
      const html = read(file);
      expect(html).not.toMatch(/Reveal\.initialize|reveal\.js|new Reveal/i);
      expect(html).toContain('slide-container');
      expect(html).toContain('showSlide');
      expect(html).toContain('class="slide');
    });
  });

  test('decks modernos devem existir como HTML versionado', () => {
    expect(module2Slides).toHaveLength(11);
    expect(module6Slides).toHaveLength(14);
    [...module2Slides, ...module6Slides].forEach((file) => {
      expect(fs.existsSync(resolveRepoPath(file))).toBe(true);
    });
  });
});

test.describe('module-2-common.md - Módulo 2 do Ciclo Comum', () => {
  test('módulo 2 deve manter identidade cinza e home própria', () => {
    const indexHtml = read('index.html');
    const css = readRepoFile('css/inteli-styles.css');

    expect(indexHtml).toContain('pages/home-module-2-common.html');
    expect(indexHtml).toContain('card-header-common');
    expect(indexHtml).toContain('bg-common');
    expect(css).toMatch(/\.card-header-common\s*\{[\s\S]*background-color:\s*var\(--inteli-dark-gray\)/);
    expect(css).toMatch(/\.bg-common\s*\{[\s\S]*background-color:\s*var\(--inteli-dark-gray\)/);
    expect(fs.existsSync(resolveRepoPath('pages/home-module-2-common.html'))).toBe(true);
  });

  test('módulo 2 deve ter 11 aulas e diretórios próprios', () => {
    const homeHtml = read('pages/home-module-2-common.html');
    expect((homeHtml.match(/🎞️\s*Slides/g) || []).length).toBe(11);
    expect((homeHtml.match(/📝\s*Material/g) || []).length).toBe(11);
    expect(module2Slides).toHaveLength(11);
    expect(listHtmlFiles('pages/module-2-common/materials')).toHaveLength(11);
  });
});

test.describe('navigation-links.md - Navegação e Estrutura de Links', () => {
  test('links internos da index para home-* devem existir', () => {
    const indexHtml = read('index.html');
    const homeLinks = extractAnchorHrefs(indexHtml).filter((href) => href.startsWith('pages/home-'));
    expect(homeLinks.length).toBeGreaterThan(0);
    homeLinks.forEach((href) => {
      expect(fs.existsSync(resolveRepoPath(href))).toBe(true);
    });
  });

  test('links externos do portal de autoestudos devem usar target e rel seguros', () => {
    ['pages/home-autoestudos.html', ...autoestudoFiles].forEach((file) => {
      const html = read(file);
      const invalidLinks = [...html.matchAll(/<a\b[^>]*href=(["'])(https?:\/\/.*?)\1(?=[^>]*target="_blank")(?![^>]*rel="noopener noreferrer")[^>]*>/gi)];
      expect(invalidLinks, `${file} contém link externo sem rel seguro`).toHaveLength(0);
    });
  });

  test('links Home e Material dos slides devem resolver por caminho relativo', () => {
    slideFiles.forEach((file) => {
      const html = read(file);
      const hrefs = [slideHomeHref(html), slideMaterialHref(html)].filter(Boolean) as string[];
      expect(existingRelativeTargets(file, hrefs)).toEqual(hrefs);
    });
  });
});

test.describe('placeholders.md - Placeholders e Conteúdo em Construção', () => {
  test('módulos em construção devem manter mensagem clara e navegação de retorno', () => {
    underConstructionHomes.forEach((file) => {
      const html = read(file);
      expect(html).toMatch(/Em construção|sendo preparadas/i);
      expect(html).toContain('Voltar para Página Inicial');
    });
  });

  test('placeholders de slides e materiais devem indicar caráter temporário', () => {
    [
      'pages/module-6-eng-software/slides/slide_lesson-10.html',
      'pages/module-6-eng-software/materials/lesson-10-material.html',
    ].forEach((file) => {
      expect(read(file)).toMatch(/Placeholder|em organização|em desenvolvimento|em breve/i);
    });
  });

  test('conteúdos publicados não devem mais ser tratados como placeholder no módulo 2', () => {
    [
      'pages/module-2-common/materials/lesson-1-material.html',
    ].forEach((file) => {
      expect(read(file)).not.toMatch(/Placeholder|em organização|em desenvolvimento|em breve/i);
    });
  });
});

test.describe('accessibility.md - Acessibilidade e Contraste Visual', () => {
  test('páginas centrais devem manter imagens com alt', () => {
    const files = [
      'index.html',
      ...allHomeFiles,
      'pages/home-autoestudos.html',
      ...autoestudoFiles,
      'pages/module-2-common/slides/slide_lesson-1.html',
      'pages/module-6-eng-software/slides/slide_lesson-1.html',
    ];

    files.forEach((file) => {
      extractImgTags(read(file)).forEach((imgTag) => {
        expect(imgTag).toMatch(/\balt=(["']).*?\1/i);
      });
    });
  });

  test('botão Material deve ter texto branco e fundo não transparente no CSS dos decks novos', () => {
    modernSlides.slice(0, 2).forEach((file) => {
      const html = read(file);
      expect(html).toMatch(/\.back-home\.material\s*\{[\s\S]*background:\s*#2f8f78/i);
      expect(html).toMatch(/\.back-home\.material\s*\{[\s\S]*color:\s*white/i);
    });
  });
});

test.describe('autoestudos-pages.md - Páginas de Autoestudos', () => {
  test('home de autoestudos deve ter header, cards e links válidos', () => {
    const html = read('pages/home-autoestudos.html');
    const internalLinks = extractAnchorHrefs(html).filter((href) => href.startsWith('autoestudos/'));

    expect(html).toContain('Portal de Autoestudos');
    expect(html).toContain('← Voltar para o Início');
    expect(html).toContain('topic-card');
    expect(internalLinks.length).toBeGreaterThan(0);
    expect(existingRelativeTargets('pages/home-autoestudos.html', internalLinks)).toEqual(internalLinks);
  });

  test('páginas internas de autoestudo devem usar kebab-case, voltar para a home e ter footer', () => {
    autoestudoFiles.forEach((file) => {
      const html = read(file);
      expect(path.basename(file)).toMatch(/^[a-z0-9-]+\.html$/);
      expect(html).toContain('../home-autoestudos.html');
      expect(html).toMatch(/<footer[\s\S]*Inteli/i);
    });
  });
});

test.describe('testing-standards.md - Testes Automatizados com Playwright', () => {
  test('estrutura base de testes deve existir', () => {
    [
      'playwright.config.ts',
      'tests/test-helpers.ts',
      'tests/index.spec.ts',
      'tests/specs-compliance.spec.ts',
    ].forEach((file) => {
      expect(fs.existsSync(resolveRepoPath(file)), `${file} deve existir`).toBe(true);
    });
  });

  test('configuração do Playwright deve manter diretório, reporter e projeto chromium', () => {
    const config = read('playwright.config.ts');
    expect(config).toContain("testDir: './tests'");
    expect(config).toContain("reporter: 'html'");
    expect(config).toContain("name: 'chromium'");
  });

  test('specs-compliance deve conter blocos para cada spec relevante', () => {
    const suite = read('tests/specs-compliance.spec.ts');
    [
      'README.md',
      'routes-naming.md',
      'index-module-cards.md',
      'home-pages.md',
      'lesson-cards.md',
      'slides-footer.md',
      'slides-format.md',
      'module-2-common.md',
      'navigation-links.md',
      'placeholders.md',
      'accessibility.md',
      'autoestudos-pages.md',
      'testing-standards.md',
      'module2-slides.md',
      'lesson-materials.md',
    ].forEach((label) => {
      expect(suite).toContain(label);
    });
  });
});

test.describe('module2-slide-structure.md - Estrutura Obrigatória dos Slides do Módulo 2', () => {
  test('todos os slides devem ter daily com cronômetro', () => {
    module2Slides.forEach((file) => {
      const html = read(file);
      expect(html).toContain('daily-timer');
      expect(html).toContain('startDaily');
      expect(html).toContain('resetDaily');
      expect(html).toContain('dailyInterval');
    });
  });

  test('todos os slides devem ter slide de capa com cv-badge e cv-tags', () => {
    module2Slides.forEach((file) => {
      const html = read(file);
      expect(html).toContain('cv-badge');
      expect(html).toContain('cv-tags');
      expect(html).toContain('cv-tag');
    });
  });

  test('todos os slides devem ter slide de agenda', () => {
    module2Slides.forEach((file) => {
      const html = read(file);
      expect(html).toMatch(/animAgenda|Agenda da Aula/i);
    });
  });

  test('daily deve ter as 4 tags obrigatórias (dt0–dt3)', () => {
    module2Slides.forEach((file) => {
      const html = read(file);
      expect(html).toContain('id="dt0"');
      expect(html).toContain('id="dt1"');
      expect(html).toContain('id="dt2"');
      expect(html).toContain('id="dt3"');
    });
  });
});

test.describe('module2-slides.md - Slides do Módulo 2', () => {
  test('slides do módulo 2 devem usar sistema próprio de navegação (sem Reveal.js)', () => {
    module2Slides.forEach((file) => {
      const html = read(file);
      expect(html).not.toMatch(/Reveal\.initialize|reveal\.js/i);
      expect(html).toContain('slide-container');
      expect(html).toContain('showSlide');
    });
  });

  test('slides do módulo 2 devem ter animMap e timer helpers Cardiff', () => {
    module2Slides.forEach((file) => {
      const html = read(file);
      expect(html).toContain('animMap');
      expect(html).toMatch(/function\s+T\s*\(/);
      expect(html).toMatch(/function\s+clearT\s*\(/);
    });
  });

  test('slides do módulo 2 devem conter slides RM-ODP e RF/RNF', () => {
    module2Slides.forEach((file) => {
      const html = read(file);
      expect(html).toMatch(/RM-ODP|rm-odp/i);
      expect(html).toMatch(/RF.*RNF|RNF.*RF|8 Eixos|animRfRnf/i);
    });
  });

  test('slides do módulo 2 devem ter footer com botão Material verde', () => {
    module2Slides.forEach((file) => {
      const html = read(file);
      expect(html).toMatch(/back-home.*material|material.*back-home/i);
      expect(html).toMatch(/#2f8f78/);
    });
  });
});

test.describe('lesson-materials.md - Materiais de Leitura Livro-Didático', () => {
  // Todos os materiais do Módulo 2 migrados para o padrão livro-didático.
  const upgradedMaterials = listHtmlFiles('pages/module-2-common/materials');

  test('materiais migrados devem ter barra de progresso de leitura', () => {
    upgradedMaterials.forEach((file) => {
      const html = read(file);
      expect(html).toContain('progress-bar');
    });
  });

  test('materiais migrados devem ter floating nav com Slides e Módulo', () => {
    upgradedMaterials.forEach((file) => {
      const html = read(file);
      expect(html).toContain('float-nav');
      expect(html).toMatch(/fn-btn|float.*nav/i);
    });
  });

  test('materiais migrados devem ter sidebar TOC', () => {
    upgradedMaterials.forEach((file) => {
      const html = read(file);
      expect(html).toMatch(/mat-toc|mat-sidebar/i);
    });
  });

  test('materiais migrados não devem ser placeholders', () => {
    upgradedMaterials.forEach((file) => {
      const html = read(file);
      expect(html).not.toMatch(/Placeholder|em organização|em desenvolvimento|em breve/i);
    });
  });
});
