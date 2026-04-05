# Especificação de Estrutura de Diretórios

## Visão Geral

Esta especificação define a organização padrão de pastas e arquivos para módulos, aulas e recursos no projeto Aulas.

## Estrutura da Raiz do Projeto

```
aulas/
├── index.html                          # Portal principal
├── package.json                        # Dependências e scripts
├── playwright.config.ts                # Configuração Playwright
├── .gitignore
├── QWEN.md                             # Contexto para IA
├── GEMINI.md                           # Contexto para IA
│
├── .agents/
│   └── workflows/
│       └── criacao_de_slides.md        # Workflow de criação de slides
│
├── .claude/                            # Configurações Claude
├── .husky/                             # Git hooks
│
├── assets/
│   └── uml/                            # Diagramas PlantUML (.puml) e PNG
│       ├── Agregacao.puml
│       ├── Associacao.puml
│       ├── Composicao.puml
│       └── ContaBancaria.puml
│
├── config/
│   ├── template_aula.json              # Template de estrutura de aula
│   ├── template-config.json            # Configuração base
│   ├── template.html                   # Template HTML base
│   ├── module-5-adm-tech.json          # Config específico do módulo
│   ├── module-6-eng-software.json
│   └── module-9-sistemas-informacao.json
│
├── css/
│   └── inteli-styles.css               # Estilos globais do projeto
│
├── pages/                              # Páginas HTML dos módulos
│   ├── home_professor.html             # Página sobre o professor
│   ├── home_autoestudos.html           # Portal de autoestudos
│   ├── home_tutorial-gitlab.html       # Tutorial GitLab
│   │
│   ├── module-5-adm-tech/              # Módulo específico
│   │   ├── slides/                     # Slides Reveal.js (formato atual)
│   │   ├── materials/                  # Materiais de leitura
│   │   ├── lesson-1.html               # ⚠️ LEGADO: antigos slides (em migração)
│   │   ├── lesson-2.html
│   │   └── ...
│   │
│   ├── module-5-eng-software/
│   │   ├── slides/
│   │   └── materials/
│   │
│   ├── module-6-eng-software/
│   │   ├── slides/
│   │   └── materials/
│   │
│   ├── module-7-sistemas-informacao/
│   │   ├── slides/
│   │   └── materials/
│   │
│   ├── module-8-sistemas-informacao/
│   │   ├── slides/
│   │   └── materials/
│   │
│   ├── module-9-sistemas-informacao/
│   │   ├── slides/
│   │   ├── materials/
│   │   ├── .agents/                    # Instruções específicas do módulo
│   │   └── notas-professor.md          # Notas internas
│   │
│   └── module-11-eng-software/
│       ├── slides/
│       └── materials/
│
├── specs/                              # Documentação de especificações
│   ├── README.md
│   ├── 01-estrutura-diretorios.md
│   ├── 02-slides-especificacao.md
│   ├── 03-materiais-leitura.md
│   ├── 04-home-module.md
│   ├── 05-casos-teste.md
│   ├── 06-assets-recursos.md
│   └── 07-config-json.md
│
├── tests/                              # Testes Playwright
│   ├── test-helpers.ts                 # Utilitários de teste
│   ├── index.spec.ts                   # Testes da página inicial
│   ├── home_pages.spec.ts              # Testes das home pages
│   └── lesson_structure.spec.ts        # Validação de slides
│
├── playwright-report/                  # Relatório HTML dos testes (gitignore)
└── test-results/                       # Resultados de testes (gitignore)
```

## Estrutura de Cada Módulo

Cada módulo deve seguir esta estrutura obrigatória:

```
pages/module-<NUMERO>-<CURSO>/
├── slides/                             # Formato atual: Slides Reveal.js
│   ├── slide_lesson-1.html
│   ├── slide_lesson-2.html
│   └── ...
│
├── materials/                          # Materiais de leitura em HTML
│   ├── lesson-1-material.html
│   ├── lesson-2-material.html
│   └── ...
│
├── lesson-1.html                       # ⚠️ LEGADO: antigos slides (não remover)
├── lesson-2.html                       # Contém conteúdo não migrado ainda
│   ├── slide_lesson-*.html             # Formato atual (usar este)
│
├── lesson-3.ipynb                      # Opcional: notebooks Jupyter
├── lesson-3-requirements.txt           # Opcional: dependências Python
└── .agents/                            # Opcional: instruções específicas
```

### Status dos Arquivos

| Arquivo | Status | Descrição |
|---------|--------|-----------|
| `slides/slide_lesson-*.html` | ✅ **ATIVO** | Slides no formato Reveal.js (padrão atual) |
| `materials/lesson-*-material.html` | ✅ **ATIVO** | Materiais de leitura em HTML |
| `lesson-*.html` (raiz) | ⚠️ **LEGADO** | Antigos slides em migração - **não remover** |
| `lesson-*.ipynb` | ✅ **ATIVO** | Notebooks Jupyter (quando aplicável) |

### Migração de Slides

Os arquivos `lesson-*.html` na raiz de cada módulo são **legado do formato antigo** de slides e devem:

1. **Permanecer no repositório** até que o conteúdo seja migrado
2. **Não ser removidos** sem verificar se todo conteúdo foi portado para `slides/slide_lesson-*.html`
3. **Ser ignorados** como fonte primária - usar sempre `slides/slide_lesson-*.html`

**Fluxo de migração:**

```
lesson-1.html (legado)
    ↓
slide_lesson-1.html (novo formato Reveal.js)
```

Quando um módulo estiver totalmente migrado, os arquivos `lesson-*.html` podem ser removidos.

## Convenções de Nomenclatura

### Diretórios de Módulos

| Padrão | Exemplo | Descrição |
|--------|---------|-----------|
| `module-<N>-<CURSO>` | `module-5-adm-tech` | Diretório do módulo |

**Cursos válidos:**
- `adm-tech` - Administração em Tecnologia
- `eng-software` - Engenharia de Software
- `sistemas-informacao` - Sistemas de Informação

### Slides

| Padrão | Exemplo | Descrição |
|--------|---------|-----------|
| `slide_lesson-<N>.html` | `slide_lesson-1.html` | Slide da aula N |
| `template_reveal.html` | `template_reveal.html` | Template base Reveal.js |

### Materiais de Leitura

| Padrão | Exemplo | Descrição |
|--------|---------|-----------|
| `lesson-<N>-material.html` | `lesson-1-material.html` | Material da aula N |

### Páginas Home

| Padrão | Exemplo | Descrição |
|--------|---------|-----------|
| `home_module-<N>-<CURSO>.html` | `home_module-5-adm-tech.html` | Home do módulo |
| `home_<TEMA>.html` | `home_professor.html` | Páginas especiais |

### Arquivos de Configuração

| Padrão | Exemplo | Descrição |
|--------|---------|-----------|
| `module-<N>-<CURSO>.json` | `module-5-adm-tech.json` | Config do módulo |
| `template_aula.json` | `template_aula.json` | Template de aula |
| `template-config.json` | `template-config.json` | Config base |

### Assets

| Padrão | Exemplo | Descrição |
|--------|---------|-----------|
| `<Nome>.puml` | `Agregacao.puml` | Diagrama PlantUML |
| `<Nome>.png` | `DiagramaER.png` | Imagem PNG |

## Regras de Validação

### Diretórios Obrigatórios por Módulo

1. **`slides/`** - Deve existir mesmo que vazio inicialmente
2. **`materials/`** - Deve existir mesmo que vazio inicialmente

### Arquivos Obrigatórios por Módulo

1. **`home_module-<N>-<CURSO>.html`** - Página home do módulo em `pages/`

### Links e Referências

Todos os links devem ser relativos e seguir:

```
# De slides para home
<a href="../../home_module-5-adm-tech.html">

# De materials para slides
<a href="../slides/slide_lesson-1.html">

# De lesson-X.html para materials
<a href="materials/lesson-1-material.html">

# CSS global
<link href="../../../css/inteli-styles.css" rel="stylesheet">
```

## Arquivos Ignorados (.gitignore)

Os seguintes arquivos/diretórios são ignorados:

```
# Drafts locais
questoes.txt

# Playwright
playwright-report/
test-results/

# Node.js
node_modules/

# Python
.venv/, venv/, __pycache__/, *.pyc

# OS e IDE
.DS_Store, .vscode/, .idea/
```

## Checklist de Criação de Novo Módulo

- [ ] Criar diretório `pages/module-<N>-<CURSO>/`
- [ ] Criar subdiretórios `slides/` e `materials/`
- [ ] Criar `pages/home_module-<N>-<CURSO>.html`
- [ ] Criar `config/module-<N>-<CURSO>.json`
- [ ] Adicionar card no `index.html`
- [ ] Criar arquivo de configuração de aula (opcional)
- [ ] Adicionar testes específicos se necessário
