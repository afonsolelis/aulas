# Especificações do Projeto Aulas (Inteli)

Este diretório contém as especificações técnicas e padrões para desenvolvimento de conteúdo educacional no repositório Aulas do Inteli.

## Documentos de Especificação

| Arquivo | Descrição |
|---------|-----------|
| `01-estrutura-diretorios.md` | Estrutura de pastas e organização de arquivos |
| `02-slides-especificacao.md` | Padrões para criação de slides Reveal.js |
| `03-materiais-leitura.md` | Especificações para materiais de leitura |
| `04-home-module.md` | Estrutura das páginas home de cada módulo |
| `05-casos-teste.md` | Casos de teste e validações automatizadas |
| `06-assets-recursos.md` | Padrões para assets (imagens, diagramas UML) |
| `07-config-json.md` | Estrutura dos arquivos de configuração JSON |

## Visão Geral do Projeto

O projeto **Aulas** é um site estático que disponibiliza materiais didáticos para os cursos do Inteli:

- **Administração em Tecnologia (Adm Tech)**
- **Engenharia de Software (Eng. Software)**
- **Sistemas de Informação (SI)**

Cada módulo contém:
- Página home do módulo
- Slides das aulas (Reveal.js)
- Materiais de leitura em HTML
- Assets (diagramas, imagens)

## Cores e Identidade Visual

| Curso | Cor | Hex | Variável CSS |
|-------|-----|-----|--------------|
| Adm Tech | Navy | `#2e2640` | `--adm-tech-navy` |
| SI | Verde | `#89cea5` | `--si-blue` |
| Eng. Software | Vermelho | `#ff4545` | `--eng-software-yellow` |

## Tecnologias Utilizadas

- **HTML5/CSS3** - Estrutura e estilização
- **Bootstrap 5** - Componentes de UI
- **Reveal.js 4.5+** - Apresentações de slides
- **PlantUML** - Diagramas UML
- **Playwright** - Testes E2E
- **TypeScript** - Configuração e testes

## Links Relacionados

- [Workflow de Criação de Slides](../.agents/workflows/criacao_de_slides.md)
- [Estilos Globais](../css/inteli-styles.css)
- [Configuração de Testes](../playwright.config.ts)
