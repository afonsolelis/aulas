# Especificação de Arquivos de Configuração JSON

## Visão Geral

Esta especificação define a estrutura e o uso dos arquivos de configuração JSON no projeto Aulas. Estes arquivos centralizam metadados, estruturas de aula e configurações visuais dos módulos.

## Estrutura de Diretórios

```
config/
├── template-config.json          # Configuração base de cores e recursos
├── template_aula.json            # Template de estrutura de aula
├── template.html                 # Template HTML base
├── module-5-adm-tech.json        # Config específica do módulo 5
├── module-6-eng-software.json    # Config específica do módulo 6
├── module-9-sistemas-informacao.json  # Config específica do módulo 9
└── module-<N>-<CURSO>.json       # Padrão para novos módulos
```

## Arquivo: template-config.json

### Propósito

Define configurações globais de cores, URLs de recursos e assets compartilhados entre todos os módulos.

### Estrutura

```json
{
  "logo": "<URL_DA_LOGO_PRINCIPAL>",
  "logo_compact": "<URL_DA_LOGO_COMPACTA>",
  "meme": "<URL_DE_IMAGEM_ILUSTRATIVA>",
  "background_image": "<URL_DE_IMAGEM_DE_FUNDO>",
  "colors": {
    "primary": {
      "purple": "#2e2640",
      "blue": "#89cea5"
    },
    "secondary": {
      "dark_purple": "#2e2640",
      "very_dark_purple": "#2e2640",
      "light_purple": "#caced6",
      "light_orange": "#ff4545",
      "green": "#89cea5",
      "pink": "#ff4545"
    },
    "basic": {
      "black": "#2e2640",
      "white": "#ffffff"
    },
    "gradients": {
      "purple_to_dark": "linear-gradient(180deg, #2e2640 0%, #89cea5 100%)"
    }
  }
}
```

### Campos Obrigatórios

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `logo` | string | URL da logo principal do Inteli |
| `colors.primary` | object | Cores primárias da identidade visual |
| `colors.basic` | object | Cores básicas (preto/branco) |

### Uso Recomendado

```javascript
// Carregar configurações em tempo de execução
fetch('../config/template-config.json')
  .then(res => res.json())
  .then(config => {
    document.documentElement.style.setProperty(
      '--inteli-purple',
      config.colors.primary.purple
    );
  });
```

## Arquivo: template_aula.json

### Propósito

Define a estrutura padrão de uma aula, incluindo capa, agenda e sequência de slides.

### Estrutura

```json
{
  "module": "Projeto N - Nome do Módulo",
  "lesson_title": "Título da Aula",
  "professor": "Nome do Professor",
  "slides_structure": [
    {
      "order": 1,
      "type": "presentation",
      "description": "Capa padrão com título da aula e nome do professor"
    },
    {
      "order": 2,
      "type": "agenda",
      "title": "Agenda do Dia",
      "items": [
        {
          "topic": "Tópico 1",
          "duration": "60 minutos"
        },
        {
          "topic": "Tópico 2",
          "duration": "60 minutos"
        }
      ],
      "disclaimer": "⚠️ Observação importante (opcional)"
    }
  ]
}
```

### Tipos de Slide

| Tipo | Descrição | Campos Obrigatórios |
|------|-----------|---------------------|
| `presentation` | Slide de capa | `order`, `type`, `description` |
| `agenda` | Agenda do dia | `order`, `type`, `title`, `items` |
| `content` | Conteúdo teórico | `order`, `type`, `title` |
| `activity` | Atividade prática | `order`, `type`, `instructions` |
| `summary` | Resumo/fechamento | `order`, `type`, `key_points` |

### Campos da Agenda

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `topic` | string | Nome do tópico |
| `duration` | string | Duração estimada |
| `disclaimer` | string | Observação opcional |

### Exemplo Completo

```json
{
  "module": "Projeto 9 - Sistemas de Informação",
  "lesson_title": "Setup de Máquina + Discovery de Dados",
  "professor": "Afonso Lelis",
  "slides_structure": [
    {
      "order": 1,
      "type": "presentation",
      "description": "Capa padrão com título da aula e nome do professor"
    },
    {
      "order": 2,
      "type": "agenda",
      "title": "Agenda do Dia",
      "items": [
        {
          "topic": "Setup de Máquina",
          "duration": "60 minutos"
        },
        {
          "topic": "Discovery de dados com IA",
          "duration": "60 minutos"
        }
      ],
      "disclaimer": "⚠️ Importante: No terceiro ano a daily não é mais no horário de instrução."
    },
    {
      "order": 3,
      "type": "content",
      "title": "Conceitos Fundamentais",
      "description": "Apresentação dos conceitos básicos"
    },
    {
      "order": 4,
      "type": "activity",
      "title": "Atividade Prática",
      "instructions": "Abra o terminal e execute os comandos..."
    },
    {
      "order": 5,
      "type": "summary",
      "title": "Resumo da Aula",
      "key_points": [
        "Ponto importante 1",
        "Ponto importante 2",
        "Ponto importante 3"
      ]
    }
  ]
}
```

## Arquivo: module-<N>-<CURSO>.json

### Propósito

Define metadados específicos de cada módulo, incluindo descrição, aulas e disciplinas relacionadas.

### Estrutura

```json
{
  "module": {
    "name": "Projeto N",
    "course": "Nome do Curso",
    "description": "Descrição detalhada do módulo"
  },
  "lessons": [
    {
      "number": 1,
      "title": "Título da Aula 1",
      "description": "Descrição curta da aula"
    }
  ],
  "disciplines": {
    "nome_disciplina": {
      "topics": [
        "Tópico 1",
        "Tópico 2"
      ]
    }
  }
}
```

### Campos Obrigatórios

#### Seção `module`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `name` | string | Nome do projeto/módulo |
| `course` | string | Nome do curso |
| `description` | string | Descrição detalhada |

#### Seção `lessons`

Array de objetos com:

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `number` | number | Número sequencial da aula |
| `title` | string | Título da aula |
| `description` | string | Descrição curta |

#### Seção `disciplines` (Opcional)

Objeto com disciplinas e seus tópicos:

| Chave | Tipo | Descrição |
|-------|------|-----------|
| `mathematics_physics` | object | Matemática e Física |
| `computing` | object | Computação |
| `design` | object | Design e UX |
| `business` | object | Negócios |
| `leadership` | object | Liderança e Soft Skills |

### Exemplo Completo: module-5-adm-tech.json

```json
{
  "module": {
    "name": "Projeto 5",
    "course": "Administração - Tecnologia",
    "description": "Modelagem financeira e valuation – Modelagem financeira de uma empresa ou projeto e uma avaliação de seu valor de mercado (valuation)"
  },
  "lessons": [
    {
      "number": 1,
      "title": "Estatística e Análise de Dados em Planilhas",
      "description": "Dominando cálculos estatísticos, previsões e valuation com Excel/Google Sheets"
    },
    {
      "number": 2,
      "title": "Macros e Scripts em Planilhas",
      "description": "Automatizando tarefas repetitivas e aumentando a produtividade com macros e scripts."
    },
    {
      "number": 3,
      "title": "Python e Pandas para Leitura de Planilhas",
      "description": "Utilize Python e Pandas para ler, processar e analisar dados de planilhas de forma eficiente."
    }
  ],
  "disciplines": {
    "mathematics_physics": {
      "topics": [
        "Matemática financeira",
        "Simulação de Monte Carlo"
      ]
    },
    "computing": {
      "topics": [
        "Cálculo financeiro",
        "Planilhas eletrônicas avançadas"
      ]
    },
    "business": {
      "topics": [
        "Fluxo de caixa",
        "Contabilidade",
        "Análise de DRE",
        "Valuation: FDC, múltiplos"
      ]
    }
  }
}
```

## Convenções de Nomenclatura

### Arquivos de Configuração de Módulo

| Padrão | Exemplo | Descrição |
|--------|---------|-----------|
| `module-<N>-<CURSO>.json` | `module-5-adm-tech.json` | Config do módulo |

**Cursos válidos:**
- `adm-tech` - Administração em Tecnologia
- `eng-software` - Engenharia de Software
- `sistemas-informacao` - Sistemas de Informação

### Templates

| Arquivo | Descrição |
|---------|-----------|
| `template-config.json` | Configurações globais |
| `template_aula.json` | Estrutura de aula |
| `template.html` | HTML base |

## Validação de Schema

### Schema JSON para Módulo

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["module", "lessons"],
  "properties": {
    "module": {
      "type": "object",
      "required": ["name", "course", "description"],
      "properties": {
        "name": { "type": "string" },
        "course": { "type": "string" },
        "description": { "type": "string" }
      }
    },
    "lessons": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["number", "title", "description"],
        "properties": {
          "number": { "type": "integer", "minimum": 1 },
          "title": { "type": "string" },
          "description": { "type": "string" }
        }
      }
    },
    "disciplines": {
      "type": "object",
      "additionalProperties": {
        "type": "object",
        "properties": {
          "topics": {
            "type": "array",
            "items": { "type": "string" }
          }
        }
      }
    }
  }
}
```

### Validação Manual

Checklist para validar configs:

- [ ] `module.name` não vazio
- [ ] `module.course` é um curso válido
- [ ] `lessons` tem pelo menos 1 item
- [ ] `lessons[].number` é sequencial (1, 2, 3...)
- [ ] `disciplines` usa chaves válidas (se presente)

## Integração com HTML

### Carregando Dados do Módulo

```html
<script>
  fetch('../config/module-5-adm-tech.json')
    .then(res => res.json())
    .then(data => {
      // Preencher header
      document.querySelector('.module-badge').textContent = data.module.course;
      document.querySelector('h1').textContent = data.module.name;
      
      // Gerar lista de aulas
      const lessonsContainer = document.querySelector('.lessons-list');
      data.lessons.forEach(lesson => {
        const card = document.createElement('div');
        card.className = 'lesson-card';
        card.innerHTML = `
          <div class="lesson-number">${lesson.number}</div>
          <h5>${lesson.title}</h5>
          <p>${lesson.description}</p>
        `;
        lessonsContainer.appendChild(card);
      });
    });
</script>
```

### Gerando Slides Dinamicamente

```javascript
// Exemplo: gerar estrutura de slides a partir do JSON
fetch('config/template_aula.json')
  .then(res => res.json())
  .then(aula => {
    const slidesContainer = document.querySelector('.slide-container');
    
    aula.slides_structure.forEach((slide, i) => {
      const section = document.createElement('section');
      section.className = i === 0 ? 'slide active' : 'slide';
      
      if (slide.type === 'agenda') {
        section.innerHTML = `
          <h2 class="slide-title">${slide.title}</h2>
          <div class="row g-3">
            ${slide.items.map(item => `
              <div class="col-6">
                <div class="info-card">
                  <h4>${item.topic}</h4>
                  <p>Duração: ${item.duration}</p>
                </div>
              </div>
            `).join('')}
          </div>
        `;
      }
      
      slidesContainer.appendChild(section);
    });
  });
```

## Boas Práticas

### Organização

1. **Mantenha configs enxutas**: Apenas dados estruturados, sem HTML ou CSS
2. **Use descrições claras**: Títulos e descrições devem ser autoexplicativos
3. **Valide antes de commitar**: Use JSON lint para verificar sintaxe
4. **Versionamento**: Alterações em configs devem ter commit messages claros

### Performance

1. **Cache de configs**: Se carregar via fetch, considere cache
2. **Minifique em produção**: Para configs muito grandes
3. **Lazy loading**: Carregar configs sob demanda

### Manutenção

1. **Atualize lessons ao adicionar aulas**: Mantenha o array sincronizado
2. **Revise disciplinas**: Adicione novas disciplinas se necessário
3. **Documente mudanças**: Atualize esta spec se adicionar novos campos

## Ferramentas Úteis

### Validação JSON

```bash
# Usando jq (Linux/Mac)
jq . config/module-5-adm-tech.json

# Usando Node.js
node -e "console.log(JSON.parse(require('fs').readFileSync('config/module-5-adm-tech.json', 'utf8')))"

# VS Code: Ctrl+Shift+P > "Format Document"
```

### Schema Validation

Use extensões como "JSON Schema" no VS Code para validar contra schema:

```json
// .vscode/settings.json
{
  "json.schemas": [
    {
      "fileMatch": ["/config/module-*.json"],
      "url": "./schema-module.json"
    }
  ]
}
```

## Checklist de Criação de Novo Módulo

Ao criar um novo módulo:

- [ ] Criar `config/module-<N>-<CURSO>.json`
- [ ] Preencher seção `module` com nome, curso e descrição
- [ ] Adicionar todas as aulas em `lessons`
- [ ] Definir `disciplines` com tópicos relevantes
- [ ] Validar JSON (sem erros de sintaxe)
- [ ] Testar carregamento em HTML (se aplicável)

## Exemplos de Uso Real

### Página Home do Módulo

```html
<!-- pages/home_module-5-adm-tech.html -->
<script>
  // Carregar dados do módulo dinamicamente
  fetch('../config/module-5-adm-tech.json')
    .then(res => res.json())
    .then(config => {
      document.title = `${config.module.name} - ${config.module.course} - Inteli`;
      document.querySelector('.module-badge').textContent = config.module.course;
      document.querySelector('.module-header h1').textContent = config.module.name;
      document.querySelector('.module-description').textContent = config.module.description;
      
      // Gerar cards de aula
      const container = document.querySelector('.lessons-grid');
      config.lessons.forEach(lesson => {
        container.innerHTML += `
          <div class="lesson-card">
            <div class="lesson-number bg-adm-tech">${lesson.number}</div>
            <h5>${lesson.title}</h5>
            <p>${lesson.description}</p>
            <div class="lesson-actions">
              <a href="module-5-adm-tech/slides/slide-lesson-${lesson.number}.html" class="btn btn-slides">🖥️ Slides</a>
              <a href="module-5-adm-tech/materials/lesson-${lesson.number}-material.html" class="btn btn-material">📖 Material</a>
            </div>
          </div>
        `;
      });
    });
</script>
```

## Referências

- [JSON Schema](https://json-schema.org/)
- [JSONLint](https://jsonlint.com/) - Validador online
- [MDN: Working with JSON](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/JSON)
