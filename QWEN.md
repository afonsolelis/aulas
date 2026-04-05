# Projeto Aulas (Inteli) - Contexto para Qwen

## Visão Geral do Projeto

Repositório de materiais didáticos do **Inteli** (Instituto de Tecnologia e Liderança) contendo planos de aula, apresentações em slides e recursos educacionais para múltiplos módulos de cursos de **Administração em Tecnologia**, **Engenharia de Software** e **Sistemas de Informação**.

O projeto funciona como um **site estático** para visualização de aulas e apresentações, utilizando uma interface web central (`index.html`) que navega para páginas específicas de cada módulo.

## Estrutura do Diretório

```
aulas/
├── index.html                          # Portal principal com cards de navegação
├── package.json                        # Configuração Node.js e scripts
├── playwright.config.ts                # Configuração de testes E2E
├── .agents/workflows/                  # Instruções para agentes de IA
│   └── criacao_de_slides.md            # Workflow de criação de slides
├── assets/uml/                         # Diagramas UML (PlantUML e PNG)
├── config/                             # Templates e metadados JSON
│   ├── module-*.json                   # Configurações por módulo
│   ├── template_aula.json              # Template de estrutura de aula
│   └── template.html                   # Template HTML base
├── css/
│   └── inteli-styles.css               # Estilos customizados do projeto
├── pages/
│   ├── home_*.html                     # Páginas iniciais de cada módulo
│   ├── module-*/                       # Diretórios por módulo
│   │   └── slides/                     # Slides Reveal.js por aula
│   └── autoestudos/                    # Materiais de autoestudo
└── tests/
    ├── test-helpers.ts                 # Utilitários para testes
    ├── index.spec.ts                   # Testes da página inicial
    ├── lesson_structure.spec.ts        # Validação de estrutura de slides
    └── home_pages.spec.ts              # Testes das páginas de módulo
```

## Tecnologias Principais

| Tecnologia | Uso |
|------------|-----|
| **HTML5/CSS3** | Estrutura e estilização das páginas |
| **Bootstrap 5** | Grid system e componentes de UI |
| **Reveal.js 5** | Engine para apresentações de slides |
| **PlantUML** | Geração de diagramas de arquitetura |
| **Playwright** | Testes E2E automatizados |
| **TypeScript** | Configuração e testes |
| **Husky** | Git hooks para pré-commit |

## Cores e Identidade Visual

O projeto utiliza variáveis CSS padronizadas no arquivo `css/inteli-styles.css`:

```css
--inteli-purple: #2e2640;      /* Cor primária */
--inteli-blue: #89cea5;        /* Sistemas de Informação */
--inteli-coral: #ff4545;       /* Engenharia de Software */
```

Cada curso possui uma cor temática:
- **Adm Tech**: Navy/Azul (`#2e2640`)
- **Sistemas de Informação**: Verde (`#89cea5`)
- **Engenharia de Software**: Vermelho (`#ff4545`)

## Módulos Disponíveis

| Módulo | Curso | Descrição |
|--------|-------|-----------|
| Módulo 5 | Adm Tech | Modelagem Financeira e Valuation |
| Módulo 5 | Eng. Software | Sistema Digital de Processamento Distribuído |
| Módulo 6 | Eng. Software | Arquitetura Orientada a Serviços |
| Módulo 7 | SI | Sistemas de Gestão e Governança Empresarial |
| Módulo 8 | SI | Integração e Análise de Big Data |
| Módulo 9 | SI | Dashboards Gerenciais |
| Módulo 11 | Eng. Software | Arquitetura e Governança de Dados |

## Comandos e Scripts

### Instalação de Dependências
```bash
npm install
```

### Executar Testes
```bash
npm test
# ou
npx playwright test
```

### Instalar Git Hooks
```bash
npm run prepare
```

### Servir Localmente (usando http-server incluso)
```bash
npx http-server .
```

## Padrões de Desenvolvimento

### Criação de Slides (Reveal.js)

1. **Estrutura obrigatória**:
   ```html
   <div class="reveal">
       <div class="slides">
           <section class="custom-slide">
               <div class="slide-inner">
                   <!-- Conteúdo -->
               </div>
           </section>
       </div>
   </div>
   ```

2. **Navegação**: Use botões no container `.top-nav` antes do fechamento da `</body>`:
   ```html
   <div class="top-nav">
       <a href="javascript:history.back()" class="nav-btn">← Voltar</a>
       <a href="../module.html" class="nav-btn">Material</a>
   </div>
   ```

3. **Inicialização do Reveal.js**:
   ```html
   <script src="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/5.0.4/reveal.min.js"></script>
   <script>
       Reveal.initialize({
           controls: true,
           progress: true,
           slideNumber: 'h.v',
           center: false,
           hash: true,
           transition: 'convex',
           width: '100%',
           height: '100%',
           margin: 0,
           disableLayout: true
       });
   </script>
   ```

### Estrutura de Aulas

Cada aula segue o template definido em `config/template_aula.json`:
- **Slide 1**: Capa com logo, título e tópicos
- **Slide 2**: Agenda do dia com itens e durações
- **Slides subsequentes**: Conteúdo da aula

### Testes com Playwright

Os testes validam:
- Estrutura e identidade visual da página inicial
- Links dos cards apontando para arquivos existentes
- Cores dos cards seguindo o padrão do curso
- Estrutura obrigatória de slides (capa + agenda)
- Presença de botões de navegação

## Workflows de IA

O projeto utiliza agentes de IA para auxiliar na criação de conteúdo. Os workflows estão documentados em `.agents/workflows/`:

- **criacao_de_slides.md**: Diretrizes para criação e migração de apresentações Reveal.js
- Instruções para materiais de leitura e autoestudo

## Convenções de Nomenclatura

| Tipo | Padrão | Exemplo |
|------|--------|---------|
| Páginas home | `home_<modulo>.html` | `home_module-5-adm-tech.html` |
| Slides | `slide_<numero>_<tema>.html` | `slide_01_introducao.html` |
| Materiais | `<nome>-material.html` | `estatistica-material.html` |
| Configurações | `module-<numero>-<curso>.json` | `module-5-adm-tech.json` |

## Observações Importantes

1. **Footer**: O projeto utiliza um footer padronizado com créditos ao professor Afonso Brandão
2. **Logo**: A logo do Inteli é carregada via CDN (Cloudinary)
3. **Favicon**: SVG inline com emoji de livro (📚)
4. **Testes**: Devem ser executados antes de commits para validar integridade dos links e estrutura
5. **Git Hooks**: Husky está configurado para rodar validações no pré-commit
