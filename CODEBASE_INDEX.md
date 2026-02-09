# Inteli Educational Platform - Codebase Index

**Date of Indexing:** 2026-02-09
**Total Files:** 42
**Project Type:** Educational Platform (HTML/CSS/JS)

## Overview

The Inteli Educational Platform is a comprehensive educational website created by Professor Afonso Brandão for the Inteli Institute. It contains modules for different courses with interactive slides, lessons, and study materials. The platform uses HTML5, CSS3, JavaScript, and Bootstrap 5.3 for a responsive design.

## Directory Structure

```
/
├── .claude/                    # Claude Code configuration
│   ├── CLAUDE.md               # Project instructions for Claude
│   ├── frontend-best-practices.md # Frontend development guidelines
│   ├── settings.local.json     # Local settings
│   └── system-index.md         # System index
├── assets/                     # Image assets
│   └── image.png
├── config/                     # Configuration and template files
│   ├── module-5-adm-tech.json  # Module 5 configuration
│   ├── module-9-sistemas-informacao.json # Module 9 configuration
│   ├── template-config.json    # Template for color/asset configurations
│   ├── template.html           # HTML template for new lessons
│   └── template_aula.json      # Template for lesson JSON structure
├── css/                        # Stylesheets
│   └── inteli-styles.css       # Main stylesheet
├── pages/                      # HTML pages
│   ├── autoestudos/            # Self-study materials
│   │   ├── arquitetura-software-analista-informacao.html # Software Architecture Article
│   │   └── engenharia-nao-trabalha-sozinha.html          # Engineering Article
│   ├── module-5-adm-tech/      # Module 5 lessons
│   │   ├── lesson-1.html       # Lesson 1
│   │   ├── lesson-2.html       # Lesson 2
│   │   ├── lesson-3.html       # Lesson 3
│   │   ├── lesson-4.html       # Lesson 4
│   │   ├── lesson-4.bak        # Lesson 4 backup
│   │   ├── lesson-5.html       # Lesson 5
│   │   └── lesson-6.html       # Lesson 6
│   ├── module-9-sistemas-informacao/ # Module 9 lessons
│   │   ├── lesson-1.html       # Lesson 1
│   │   ├── lesson-2.html       # Lesson 2
│   │   ├── lesson-3.html       # Lesson 3
│   │   ├── lesson-4.html       # Lesson 4
│   │   ├── lesson-5.html       # Lesson 5
│   │   ├── lesson-6.html       # Lesson 6
│   │   ├── lesson-7.html       # Lesson 7
│   │   ├── lesson-8.html       # Lesson 8
│   │   ├── lesson-9.html       # Lesson 9
│   │   ├── lesson-10.html      # Lesson 10
│   │   ├── lesson-11.html      # Lesson 11
│   │   ├── lesson-12.html      # Lesson 12
│   │   ├── lesson-13.html      # Lesson 13
│   │   └── notas-professor.md  # Professor notes (Lessons 1-3)
│   ├── autoestudos.html        # Self-study portal
│   ├── module-5-adm-tech.html  # Module 5 homepage
│   ├── module-9-sistemas-informacao.html # Module 9 homepage
│   ├── professor.html          # Professor profile
│   └── tutorial-gitlab.html    # GitLab tutorial
├── index.html                  # Main landing page
└── CODEBASE_INDEX.md           # This file (detailed codebase index)
```

## Key Files Analysis

### 1. Main Landing Page (index.html)
- **Purpose:** Main entry point for the educational platform
- **Features:**
  - Responsive grid layout with module cards
  - Interactive cards with hover effects
  - Links to different modules, professor profile, and tutorials
  - Bootstrap 5.3 integration
  - Custom CSS styling with gradient backgrounds
  - Footer with license information

### 2. CSS Stylesheet (css/inteli-styles.css)
- **Purpose:** Main stylesheet defining the design system
- **Features:**
  - CSS variables for consistent color scheme
  - Custom card styles with hover effects
  - Responsive design elements
  - Course-specific color schemes
  - Typography definitions

### 3. Module Configuration Files
- **config/module-5-adm-tech.json:** Contains information about Module 5 (Administração e Tecnologia)
  - 6 lessons covering financial modeling and valuation
  - Disciplines covered: mathematics/physics, computing, design, business, leadership
- **config/module-9-sistemas-informacao.json:** Contains information about Module 9 (Sistemas de Informação)
  - 13 lessons covering software architecture, databases, cloud computing, etc.
  - Disciplines covered: mathematics, computing, UX, business, leadership

### 4. Template Files
- **config/template.html:** Full HTML template for creating new lesson slides (includes slide navigation, keyboard support, fullscreen, and styling)
- **config/template-config.json:** Template for module color and asset configurations
- **config/template_aula.json:** Template for lesson JSON structure

### 5. Lesson Files (pages/module-*/lesson-*.html)
- **Purpose:** Individual lesson slides with interactive content
- **Features:**
  - Slide-based presentation format
  - Keyboard navigation support (arrow keys, space)
  - Fullscreen functionality
  - Progress tracking
  - Code blocks with copy functionality
  - Interactive elements and challenges
  - Mathematical formulas and statistical concepts
  - Case studies and practical examples
  - Copyable datasets for hands-on exercises
  - SVG diagrams for UML and architecture concepts

### 6. Module Homepages
- **pages/module-5-adm-tech.html:** Homepage for Module 5
- **pages/module-9-sistemas-informacao.html:** Homepage for Module 9
- **Features:**
  - Overview of the module
  - List of lessons with links
  - Topic breakdown by discipline
  - Roadmap section for module deliverables
  - Navigation back to main index

### 7. Professor Notes (pages/module-9-sistemas-informacao/notas-professor.md)
- **Purpose:** Detailed teaching guide for the professor
- **Content:** Covers lessons 1-3 with slide-by-slide notes including:
  - Objective for each slide
  - How to conduct the topic
  - Practical notes and tips for the professor
- **Lessons covered:**
  - Aula 1: Setup de Máquina + Discovery de Dados (25 slides)
  - Aula 2: Arquitetura de Software com UML (46 slides)
  - Aula 3: SQL Avançado, Segurança e Modelagem para NoSQL (24 slides)

### 8. Special Pages
- **pages/professor.html:** Professor profile page
- **pages/autoestudos.html:** Self-study materials portal
- **pages/tutorial-gitlab.html:** GitLab tutorial page (updated with new repo creation instructions)
- **pages/autoestudos/engenharia-nao-trabalha-sozinha.html:** Detailed case study article
- **pages/autoestudos/arquitetura-software-analista-informacao.html:** Detailed software architecture article

## Technical Stack

- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Framework:** Bootstrap 5.3.0
- **Fonts:** Google Fonts (Manrope, Space Mono)
- **Images:** Cloudinary CDN
- **Version Control:** Git

## Key Features

1. **Responsive Design:** Works on different screen sizes
2. **Interactive Slides:** Lesson content presented in slide format with navigation
3. **Fullscreen Mode:** Slides support fullscreen presentation
4. **Educational Content:** Comprehensive coverage of topics in administration, technology, and information systems
5. **Case Studies:** Practical examples and real-world applications
6. **Statistical Concepts:** Detailed explanations of statistical methods and financial modeling
7. **Code Examples:** Programming concepts with practical implementations (C#, Blazor, SQL, Python)
8. **Copyable Datasets:** Hands-on datasets that can be copied directly for exercises
9. **SVG Diagrams:** Inline UML and architecture diagrams
10. **Accessibility:** Keyboard navigation and semantic HTML

## Content Themes

### Module 5 - Administração e Tecnologia
- Estatística e Análise de Dados em Planilhas
- Macros e Scripts em Planilhas
- Python e Pandas para Leitura de Planilhas
- Cálculos Financeiros em Python
- Relatórios Automatizados com Python
- Integração e Modelagem Completa de Análise

### Module 9 - Sistemas de Informação
- Setup de Máquina + Discovery de Dados (C#, .NET, Blazor, Docker)
- Arquitetura de Software com UML (ATAM, RM-ODP, SOA, EDA, Kafka)
- SQL Avançado e Modelagem de Dados (Dapper, ACID, DDD, NoSQL)
- Orientação a Objetos com TDD
- Padrões de Software (Design Patterns)
- Classes, Instâncias e Herança (MVC)
- Protocolos de Comunicação Web
- Gerenciamento de Aplicação em Nuvem
- Segurança e Autorização em API
- Programação por Domínios (DDD)
- SOLID
- Refatoração de Código
- Revisão e Acompanhamento

## Design Elements

- **Color Scheme:** Purple (#2e2640) and teal (#89cea5) as primary colors
- **Typography:** Manrope for headings, Space Mono for code
- **Layout:** Card-based design with glassmorphism effects
- **Animations:** Smooth transitions and hover effects
- **Icons:** Emoji-based icons for visual enhancement

## File Organization

The project follows a clear hierarchical structure:
- Root level: Main index (index.html) and detailed codebase index (CODEBASE_INDEX.md)
- Config/: JSON configuration files and HTML/JSON templates for new content
- CSS/: Styling sheets
- Pages/: All HTML content organized by module
- Pages/autoestudos/: Self-study materials
- Pages/module-[X]/: Module-specific lessons and professor notes

## Recent Changes (since 2026-01-29)

- Added professor notes for module 9 lessons 1-3 (`notas-professor.md`)
- Added HTML template for new lessons (`config/template.html`)
- Expanded ACID slide and added DDD slide in lesson 3
- Added Blazor WebApp anatomy slide in lesson 1
- Added roadmap section for module 9 deliverables
- Added copyable datasets to challenge slides (DCF, TechFlow, salary)
- Added pivot tables slide and dispersão figure
- Updated GitLab tutorial with new repo creation instructions
- Added fullscreen functionality to slide template
- Removed `notes.txt` (no longer present)

## Educational Approach

The platform employs a modern educational approach with:
- Interactive slides for engagement
- Practical exercises and challenges
- Real-world case studies
- Step-by-step tutorials
- Visual representations of concepts (inline SVG diagrams)
- Hands-on learning experiences with copyable datasets
- Detailed professor teaching guides (notas-professor.md)
