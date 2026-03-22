# Projeto Aulas (Inteli)

Este repositório contém materiais didáticos, planos de aula, slides e recursos para módulos educacionais do Inteli (Instituto de Tecnologia e Liderança). Ele funciona como um site estático para visualização de aulas e apresentações.

## Visão Geral do Diretório

- **`/pages/`**: Contém as páginas de cada módulo (ex: Adm Tech, Eng Software, Sistemas de Informação) e as aulas individuais em formato HTML.
    - Cada aula costuma ter um arquivo `.html` (apresentação de slides) e um `-material.html` (material de leitura).
- **`/config/`**: Arquivos de configuração JSON que servem como templates ou metadados para as aulas e módulos.
- **`/css/`**: Estilos customizados, incluindo `inteli-styles.css` para padronização visual.
- **`/assets/`**: Imagens e diagramas (UML em PlantUML e PNG).
- **`/materiais/`**: Documentos de apoio, como PDFs.
- **`/.agents/`**: Instruções e workflows para assistentes de IA ajudarem na criação de conteúdo (slides, materiais de leitura, etc.).

## Tecnologias Principais

- **HTML5/CSS3**: Estrutura e estilização.
- **Bootstrap 5**: Grid e componentes de UI.
- **Reveal.js**: Engine para apresentações de slides interativas.
- **PlantUML**: Utilizado para geração de diagramas de arquitetura e processos.

## Fluxo de Trabalho (Workflows)

O projeto utiliza assistentes de IA (agentes) para facilitar a manutenção e criação de conteúdo. Os workflows estão documentados em `.agents/workflows/` e nas pastas específicas dos módulos.

- **Criação de Slides**: Slides devem seguir a estrutura do Reveal.js integrada ao layout do projeto. Veja `.agents/workflows/criacao_de_slides.md`.
- **Materiais de Leitura**: Materiais de apoio seguem uma estrutura HTML específica para facilitar a leitura e o autoestudo.

## Uso e Visualização

Para visualizar o conteúdo localmente, basta abrir o `index.html` na raiz do projeto em qualquer navegador moderno. A navegação entre módulos e aulas é feita através da interface do site.
