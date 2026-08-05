import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { readRepoFile } from './test-helpers';

/**
 * Padrão de encontro — toda página de aula do acervo deve trazer:
 *   1. botão de exportação em PDF com o nome padronizado ANO-MÊS-DIA-Nome-NoSequencial;
 *   2. ficha do encontro com objetivo de aprendizagem, estratégia e estrutura.
 *
 * Ver .claude/skills/padrao-encontro/SKILL.md
 */

const REPO = path.resolve(__dirname, '..');

interface Encontro {
  titulo: string;
  data: string;
  docente: string;
  objetivo: string;
  estrategia: string;
  agenda: string[];
}

interface Pagina {
  path: string;
  encontro: string;
  seq: string;
}

const cfg: { encontros: Record<string, Encontro>; paginas: Pagina[] } = JSON.parse(
  readRepoFile('config/encontros.json'),
);

const TIPOS_DE_AULA = ['slide', 'material', 'plano', 'aula'];
const indexJson: { items: { path: string; type: string }[] } = JSON.parse(readRepoFile('index.json'));
const paginasDeAula = indexJson.items.filter((i) => TIPOS_DE_AULA.includes(i.type)).map((i) => i.path);

/** Conteúdo da página e, quando ela é gerada em JavaScript, o do seu gerador. */
function conteudoEfetivo(pagePath: string): string {
  const html = readRepoFile(pagePath);
  const scripts = [...html.matchAll(/<script src="([^"]+\.js)"/g)].map((m) => m[1]);
  const extras = scripts
    .map((src) => path.resolve(REPO, path.dirname(pagePath), src))
    .filter((abs) => abs.startsWith(REPO) && fs.existsSync(abs))
    .map((abs) => fs.readFileSync(abs, 'utf8'));
  return [html, ...extras].join('\n');
}

test.describe('padrao-encontro.md - Cobertura', () => {
  test('toda página de aula do index.json tem ficha de encontro registrada', () => {
    const registradas = new Set(cfg.paginas.map((p) => p.path));
    const faltando = paginasDeAula.filter((p) => !registradas.has(p));
    expect(faltando, `páginas de aula fora de config/encontros.json: ${faltando.join(', ')}`).toEqual([]);
  });

  test('toda página registrada existe no disco', () => {
    const inexistentes = cfg.paginas.filter((p) => !fs.existsSync(path.join(REPO, p.path))).map((p) => p.path);
    expect(inexistentes, `registradas mas ausentes: ${inexistentes.join(', ')}`).toEqual([]);
  });

  test('toda página aponta para um encontro existente', () => {
    const orfas = cfg.paginas.filter((p) => !cfg.encontros[p.encontro]).map((p) => `${p.path} -> ${p.encontro}`);
    expect(orfas).toEqual([]);
  });
});

test.describe('padrao-encontro.md - Ficha do encontro', () => {
  test('todo encontro declara objetivo, estratégia e estrutura preenchidos', () => {
    const incompletos: string[] = [];
    for (const [key, e] of Object.entries(cfg.encontros)) {
      if (!e.objetivo || e.objetivo.trim().length < 30) incompletos.push(`${key}: objetivo`);
      if (!e.estrategia || e.estrategia.trim().length < 30) incompletos.push(`${key}: estratégia`);
      if (!Array.isArray(e.agenda) || e.agenda.length < 3) incompletos.push(`${key}: agenda`);
    }
    expect(incompletos, `fichas incompletas: ${incompletos.join(' | ')}`).toEqual([]);
  });

  test('todo encontro declara docente responsável', () => {
    const sem = Object.entries(cfg.encontros)
      .filter(([, e]) => !e.docente || !/^[A-ZÁÂÃÉÊÍÓÔÕÚÇ][\wÀ-ú-]*$/.test(e.docente))
      .map(([k]) => k);
    expect(sem, `docente ausente ou fora do padrão (primeiro nome): ${sem.join(', ')}`).toEqual([]);
  });

  test('datas declaradas usam o formato AAAA-MM-DD', () => {
    const invalidas = Object.entries(cfg.encontros)
      .filter(([, e]) => e.data && !/^\d{4}-\d{2}-\d{2}$/.test(e.data))
      .map(([k, e]) => `${k}: ${e.data}`);
    expect(invalidas).toEqual([]);
  });
});

for (const pagina of cfg.paginas) {
  test.describe(`padrao-encontro.md - ${pagina.path}`, () => {
    test('tem botão de exportação em PDF', () => {
      const html = readRepoFile(pagina.path);
      expect(html, 'botão .pdf-export-btn ausente').toContain('class="pdf-export-btn"');
      expect(html, 'script js/encontro-pdf.js não referenciado').toMatch(/src="[^"]*js\/encontro-pdf\.js"/);
    });

    test('carrega a folha de estilo do padrão (botão e impressão A4)', () => {
      const html = readRepoFile(pagina.path);
      const link = /<link[^>]+href="([^"]*css\/encontro\.css)"/.exec(html);
      expect(link, 'css/encontro.css não referenciado — sem ele o botão fica sem estilo e o PDF não sai em A4').not.toBeNull();
      const abs = path.resolve(REPO, path.dirname(pagina.path), link![1]);
      expect(fs.existsSync(abs), `caminho não resolve: ${link![1]} em ${pagina.path}`).toBe(true);
    });

    test('o script de exportação resolve por caminho relativo válido', () => {
      const html = readRepoFile(pagina.path);
      const src = /src="([^"]*js\/encontro-pdf\.js)"/.exec(html);
      expect(src, 'referência ao script não encontrada').not.toBeNull();
      const abs = path.resolve(REPO, path.dirname(pagina.path), src![1]);
      expect(fs.existsSync(abs), `caminho não resolve: ${src![1]} em ${pagina.path}`).toBe(true);
    });

    test('o botão declara docente e sequencial do padrão de nome', () => {
      const html = readRepoFile(pagina.path);
      const enc = cfg.encontros[pagina.encontro];
      expect(html).toContain(`data-encontro-docente="${enc.docente}"`);
      expect(html).toContain(`data-encontro-seq="${pagina.seq}"`);
      expect(['01', '02', '03'], `sequencial inesperado em ${pagina.path}`).toContain(pagina.seq);
      const data = /data-encontro-data="([^"]*)"/.exec(html);
      expect(data).not.toBeNull();
      if (data![1]) expect(data![1]).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    test('exibe objetivo de aprendizagem, estratégia e estrutura do encontro', () => {
      const conteudo = conteudoEfetivo(pagina.path);
      expect(conteudo, 'ficha do encontro ausente').toContain('data-encontro-ficha');
      for (const item of ['objetivo', 'estrategia', 'agenda']) {
        expect(conteudo, `bloco "${item}" ausente`).toContain(`data-encontro="${item}"`);
      }
    });
  });
}
