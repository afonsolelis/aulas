# Inteli Educational Platform - Codebase Index

**Date of Indexing:** 2026-01-27  
**Total Files:** 32+  
**Project Type:** Educational Platform (HTML/CSS/JS)

## Overview

The Inteli Educational Platform is a comprehensive educational website created by Professor Afonso Brandão for the Inteli Institute. It contains modules for different courses with interactive slides, lessons, and study materials. The platform uses HTML5, CSS3, JavaScript, and Bootstrap 5.3 for a responsive design.

## Directory Structure

```
/home/afonsolelis/Documentos/inteli/aulas/
├── .claude/                    # Claude Code configuration
│   ├── CLAUDE.md               # Project instructions for Claude
│   ├── frontend-best-practices.md # Frontend development guidelines
│   ├── settings.local.json     # Local settings
│   └── system-index.md         # System index
├── assets/                     # Image assets
│   └── image.png
├── config/                     # Configuration files
│   ├── module-5-adm-tech.json  # Module 5 configuration
│   ├── module-9-sistemas-informacao.json # Module 9 configuration
│   ├── template-config.json    # Template for configurations
│   └── template_aula.json      # Template for lessons
├── css/                        # Stylesheets
│   └── inteli-styles.css       # Main stylesheet
├── pages/                      # HTML pages
│   ├── autoestudos/            # Self-study materials
│   │   └── engenharia-nao-trabalha-sozinha.html
│   ├── module-5-adm-tech/      # Module 5 lessons
│   │   ├── lesson-1.html       # Lesson 1
│   │   ├── lesson-2.html       # Lesson 2
│   │   ├── lesson-3.html       # Lesson 3
│   │   ├── lesson-4.html       # Lesson 4
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
│   │   └── lesson-13.html      # Lesson 13
│   ├── autoestudos.html        # Self-study portal
│   ├── module-5-adm-tech.html  # Module 5 homepage
│   ├── module-9-sistemas-informacao.html # Module 9 homepage
│   ├── professor.html          # Professor profile
│   └── tutorial-gitlab.html    # GitLab tutorial
├── index.html                  # Main landing page
├── INDEX.md                    # Project index
└── notes.txt                   # Personal notes
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
  - Disciplines covered: mathematics, computing, design, business, leadership
- **config/module-9-sistemas-informacao.json:** Contains information about Module 9 (Sistemas de Informação)
  - 13 lessons covering software architecture, databases, cloud computing, etc.
  - Disciplines covered: mathematics, computing, UX, business, leadership

### 4. Lesson Files (pages/module-*/lesson-*.html)
- **Purpose:** Individual lesson slides with interactive content
- **Features:**
  - Slide-based presentation format
  - Keyboard navigation support (arrow keys, space)
  - Progress tracking
  - Code blocks with copy functionality
  - Interactive elements and challenges
  - Mathematical formulas and statistical concepts
  - Case studies and practical examples

### 5. Module Homepages
- **pages/module-5-adm-tech.html:** Homepage for Module 5
- **pages/module-9-sistemas-informacao.html:** Homepage for Module 9
- **Features:**
  - Overview of the module
  - List of lessons with links
  - Topic breakdown by discipline
  - Navigation back to main index

### 6. Special Pages
- **pages/professor.html:** Professor profile page
- **pages/autoestudos.html:** Self-study materials portal
- **pages/tutorial-gitlab.html:** GitLab tutorial page
- **pages/autoestudos/engenharia-nao-trabalha-sozinha.html:** Detailed case study article

## Technical Stack

- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Framework:** Bootstrap 5.3.0
- **Fonts:** Google Fonts (Manrope, Space Mono)
- **Images:** Cloudinary CDN
- **Version Control:** Git

## Key Features

1. **Responsive Design:** Works on different screen sizes
2. **Interactive Slides:** Lesson content presented in slide format with navigation
3. **Educational Content:** Comprehensive coverage of topics in administration, technology, and information systems
4. **Case Studies:** Practical examples and real-world applications
5. **Statistical Concepts:** Detailed explanations of statistical methods and financial modeling
6. **Code Examples:** Programming concepts with practical implementations
7. **Accessibility:** Keyboard navigation and semantic HTML

## Content Themes

### Module 5 - Administração e Tecnologia
- Financial modeling and valuation
- Spreadsheet automation
- Statistical analysis
- Business forecasting
- Company valuation techniques

### Module 9 - Sistemas de Informação
- Software architecture
- Database modeling
- Cloud computing
- DevOps and CI/CD
- APIs and web services
- Big Data analytics
- IoT and edge computing

## Design Elements

- **Color Scheme:** Purple (#2e2640) and teal (#89cea5) as primary colors
- **Typography:** Manrope for headings, Space Mono for code
- **Layout:** Card-based design with glassmorphism effects
- **Animations:** Smooth transitions and hover effects
- **Icons:** Emoji-based icons for visual enhancement

## File Organization

The project follows a clear hierarchical structure:
- Root level: Main index and configuration
- Config/: JSON files for module configurations
- CSS/: Styling sheets
- Pages/: All HTML content organized by module
- Pages/autoestudos/: Self-study materials
- Pages/module-[X]/: Module-specific lessons

## Educational Approach

The platform employs a modern educational approach with:
- Interactive slides for engagement
- Practical exercises and challenges
- Real-world case studies
- Step-by-step tutorials
- Visual representations of concepts
- Hands-on learning experiences

## Conclusion

The Inteli Educational Platform is a well-structured, comprehensive educational resource that combines modern web technologies with effective pedagogical approaches. The modular design allows for easy expansion and maintenance, while the interactive elements enhance student engagement and learning outcomes.