import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();

const lessons = [
  {
    lesson: 1,
    lessonTitle: 'Introdução aos Sistemas Web',
    markdownFile: 'module_guidelines/in_02/autoestudos/aula_01_fundamentos_sistemas_web.md'
  },
  {
    lesson: 2,
    lessonTitle: 'Banco de Dados I - Conceitos, Modelos e SQL Básico',
    markdownFile: 'module_guidelines/in_02/autoestudos/aula_02_modelagem_er_sql_basico.md'
  },
  {
    lesson: 3,
    lessonTitle: 'Banco de Dados II - Create, Read, Update, Delete',
    markdownFile: 'module_guidelines/in_02/autoestudos/aula_03_crud_integridade_sql.md'
  },
  {
    lesson: 4,
    lessonTitle: 'Banco de Dados III - Joins',
    markdownFile: 'module_guidelines/in_02/autoestudos/aula_04_joins_consultas_relacionais.md'
  },
  {
    lesson: 5,
    lessonTitle: 'Back-End I - Node.js, Models e Controllers',
    markdownFile: 'module_guidelines/in_02/autoestudos/aula_05_node_models_controllers.md'
  },
  {
    lesson: 6,
    lessonTitle: 'Back-End II - Endpoints de Leitura e Escrita com Documentação Própria',
    markdownFile: 'module_guidelines/in_02/autoestudos/aula_06_endpoints_http_documentacao.md'
  },
  {
    lesson: 7,
    lessonTitle: 'Front-End 1 - HTML, DOM e JavaScript',
    markdownFile: 'module_guidelines/in_02/autoestudos/aula_07_html_dom_javascript.md'
  },
  {
    lesson: 8,
    lessonTitle: 'Front-End 2 - JavaScript, Chamadas Assíncronas e Redes',
    markdownFile: 'module_guidelines/in_02/autoestudos/aula_08_async_integracao_redes.md'
  },
  {
    lesson: 9,
    lessonTitle: 'Front-End 3 - CSS e JavaScript',
    markdownFile: 'module_guidelines/in_02/autoestudos/aula_09_css_heuristicas_interface.md'
  },
  {
    lesson: 10,
    lessonTitle: 'Testes e Automação',
    markdownFile: 'module_guidelines/in_02/autoestudos/aula_10_testes_automacao_web.md'
  },
  {
    lesson: 11,
    lessonTitle: 'Mergulhando nas Redes',
    markdownFile: 'module_guidelines/in_02/autoestudos/aula_11_redes_resiliencia.md'
  }
];

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function slugify(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function formatInline(value) {
  let output = escapeHtml(value);
  output = output.replace(/`([^`]+)`/g, '<code>$1</code>');
  output = output.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, href) => {
    if (href.startsWith('#')) {
      return `<a href="#${slugify(href.slice(1))}">${label}</a>`;
    }
    return `<a href="${href}" target="_blank" rel="noopener noreferrer">${label}</a>`;
  });
  output = output.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  output = output.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  return output;
}

function isTableSeparator(line) {
  const normalized = line.replace(/\|/g, '').trim();
  return normalized.length > 0 && /^[\s:-]+$/.test(normalized);
}

function isTableStart(lines, index) {
  const current = lines[index]?.trim() ?? '';
  const next = lines[index + 1]?.trim() ?? '';
  return current.startsWith('|') && next.startsWith('|') && isTableSeparator(next);
}

function renderTable(tableLines) {
  const rows = tableLines.map((line) => {
    const trimmed = line.trim().replace(/^\|/, '').replace(/\|$/, '');
    return trimmed.split('|').map((cell) => cell.trim());
  });
  const [header, , ...body] = rows;
  const headerHtml = header.map((cell) => `<th>${formatInline(cell)}</th>`).join('');
  const bodyHtml = body
    .map((row) => `<tr>${row.map((cell) => `<td>${formatInline(cell)}</td>`).join('')}</tr>`)
    .join('\n');

  return `
    <div class="table-responsive my-4">
      <table class="table table-bordered table-striped align-middle markdown-table">
        <thead><tr>${headerHtml}</tr></thead>
        <tbody>${bodyHtml}</tbody>
      </table>
    </div>
  `;
}

function renderMarkdown(markdown) {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const html = [];
  let index = 0;
  let inCode = false;
  let codeLines = [];
  let codeLanguage = '';
  let listType = null;
  let blockquoteLines = [];

  function flushList() {
    if (!listType) return;
    html.push(`</${listType}>`);
    listType = null;
  }

  function flushBlockquote() {
    if (!blockquoteLines.length) return;
    const content = blockquoteLines.map((line) => formatInline(line)).join('<br>');
    html.push(`<blockquote class="blockquote custom-blockquote"><p class="mb-0">${content}</p></blockquote>`);
    blockquoteLines = [];
  }

  while (index < lines.length) {
    const rawLine = lines[index];
    const line = rawLine.trimEnd();
    const trimmed = line.trim();

    if (inCode) {
      if (trimmed.startsWith('```')) {
        html.push(
          `<pre class="code-block"><code class="language-${escapeHtml(codeLanguage)}">${escapeHtml(codeLines.join('\n'))}</code></pre>`
        );
        inCode = false;
        codeLines = [];
        codeLanguage = '';
      } else {
        codeLines.push(rawLine);
      }
      index += 1;
      continue;
    }

    if (trimmed.startsWith('```')) {
      flushList();
      flushBlockquote();
      inCode = true;
      codeLanguage = trimmed.slice(3).trim();
      index += 1;
      continue;
    }

    if (!trimmed) {
      flushList();
      flushBlockquote();
      index += 1;
      continue;
    }

    if (trimmed === '>') {
      index += 1;
      continue;
    }

    if (trimmed.startsWith('> ')) {
      flushList();
      blockquoteLines.push(trimmed.slice(2));
      index += 1;
      continue;
    }

    flushBlockquote();

    if (/^#{1,6}\s+/.test(trimmed)) {
      flushList();
      const level = trimmed.match(/^#+/)[0].length;
      const text = trimmed.replace(/^#{1,6}\s+/, '');
      const tag = `h${Math.min(level + 1, 6)}`;
      html.push(`<${tag} id="${slugify(text)}">${formatInline(text)}</${tag}>`);
      index += 1;
      continue;
    }

    if (/^---+$/.test(trimmed)) {
      flushList();
      html.push('<hr>');
      index += 1;
      continue;
    }

    if (isTableStart(lines, index)) {
      flushList();
      const tableLines = [trimmed, lines[index + 1].trim()];
      index += 2;
      while (index < lines.length && lines[index].trim().startsWith('|')) {
        tableLines.push(lines[index].trim());
        index += 1;
      }
      html.push(renderTable(tableLines));
      continue;
    }

    const orderedMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
    if (orderedMatch) {
      if (listType !== 'ol') {
        flushList();
        html.push('<ol>');
        listType = 'ol';
      }
      html.push(`<li>${formatInline(orderedMatch[2])}</li>`);
      index += 1;
      continue;
    }

    const unorderedMatch = trimmed.match(/^[-*]\s+(.*)$/);
    if (unorderedMatch) {
      if (listType !== 'ul') {
        flushList();
        html.push('<ul>');
        listType = 'ul';
      }
      html.push(`<li>${formatInline(unorderedMatch[1])}</li>`);
      index += 1;
      continue;
    }

    flushList();

    const paragraphLines = [trimmed];
    index += 1;
    while (index < lines.length) {
      const next = lines[index].trim();
      if (
        !next ||
        /^#{1,6}\s+/.test(next) ||
        next.startsWith('```') ||
        /^[-*]\s+/.test(next) ||
        /^\d+\.\s+/.test(next) ||
        next.startsWith('> ') ||
        /^---+$/.test(next) ||
        isTableStart(lines, index)
      ) {
        break;
      }
      paragraphLines.push(next);
      index += 1;
    }

    html.push(`<p>${formatInline(paragraphLines.join(' '))}</p>`);
  }

  flushList();
  flushBlockquote();
  return html.join('\n');
}

function buildMaterialHtml({ lesson, lessonTitle, markdownTitle, markdownBodyHtml }) {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Aula ${lesson} — ${lessonTitle} — Material - Inteli</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="../../../css/inteli-styles.css" rel="stylesheet">
  <style>
    .page-header { background: #b2b6bf; color: white; }
    .study-content { font-size: 1rem; line-height: 1.7; }
    .study-content h2, .study-content h3, .study-content h4, .study-content h5, .study-content h6 { margin-top: 2rem; margin-bottom: 1rem; color: var(--inteli-dark-gray); }
    .study-content h2:first-child { margin-top: 0; }
    .study-content p, .study-content ul, .study-content ol, .study-content blockquote, .study-content .table-responsive, .study-content pre { margin-bottom: 1.25rem; }
    .study-content ul, .study-content ol { padding-left: 1.5rem; }
    .study-content code { background: #f1f3f5; color: #5c2d91; padding: 0.1rem 0.35rem; border-radius: 0.35rem; }
    .study-content pre.code-block { background: #1f2430; color: #f6f7f9; padding: 1rem; border-radius: 0.75rem; overflow-x: auto; }
    .study-content pre.code-block code { background: transparent; color: inherit; padding: 0; }
    .study-content hr { margin: 2rem 0; border-color: #d7dce2; opacity: 1; }
    .custom-blockquote { border-left: 4px solid #b2b6bf; background: #f8f9fb; padding: 1rem 1.25rem; border-radius: 0.5rem; }
    .markdown-table th { white-space: nowrap; }
  </style>
</head>
<body>
  <header class="page-header py-4">
    <div class="container d-flex justify-content-between align-items-center flex-wrap gap-2">
      <div>
        <div><span class="module-badge bg-common">Módulo 2 • Ciclo Comum</span></div>
        <h1 class="h3 mb-1 mt-2">Aula ${lesson} — Material</h1>
        <div>${lessonTitle}</div>
      </div>
      <div class="d-flex gap-2 flex-wrap">
        <a href="../slides/slide_lesson-${lesson}.html" class="btn btn-light">Slides</a>
        <a href="../../home-module-2-common.html" class="btn btn-outline-light">← Voltar ao Módulo</a>
      </div>
    </div>
  </header>
  <main class="container py-5">
    <div class="card shadow-sm border-0">
      <div class="card-body p-4 p-lg-5 study-content">
        <p class="text-muted mb-4">Conteúdo importado de <code>${markdownTitle}</code>.</p>
        ${markdownBodyHtml}
      </div>
    </div>
  </main>
  <div class="logo-container text-center py-4">
    <img src="https://res.cloudinary.com/dyhjjms8y/image/upload/v1769427095/9c2796bb-d4da-4f4e-846a-d38d547249ee_pwwh3l.png" alt="Inteli Logo Compact" style="max-width: 150px;">
  </div>
  <footer class="inteli-footer mt-auto py-4 bg-light border-top">
    <div class="container text-center">
      <p class="mb-1">Material criado pelo professor <strong>Afonso Brandão</strong> para o <strong>Inteli</strong>.</p>
      <small class="text-muted">Licença de leitura aberta</small>
    </div>
  </footer>
</body>
</html>
`;
}

for (const lesson of lessons) {
  const markdownPath = path.join(repoRoot, lesson.markdownFile);
  const markdown = fs.readFileSync(markdownPath, 'utf8');
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const markdownTitle = lines[0].replace(/^#\s+/, '').trim();
  const body = lines.slice(1).join('\n').trim();
  const bodyHtml = renderMarkdown(body);

  const materialPath = path.join(
    repoRoot,
    `pages/module-2-common/materials/lesson-${lesson.lesson}-material.html`
  );

  fs.writeFileSync(
    materialPath,
    buildMaterialHtml({
      lesson: lesson.lesson,
      lessonTitle: lesson.lessonTitle,
      markdownTitle,
      markdownBodyHtml: bodyHtml
    })
  );
}

console.log(`Materiais sincronizados: ${lessons.length}`);
