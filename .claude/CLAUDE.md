# Inteli Educational Platform - Instruções Claude Code

## Sobre o Projeto

Plataforma educacional do Inteli contendo material de aulas do professor Afonso Brandão. O projeto utiliza HTML/CSS/JS vanilla com Bootstrap 5.3 para criar slides interativos e páginas de módulos de cursos.

## Stack Tecnológica

- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Framework CSS:** Bootstrap 5.3.0
- **Fontes:** Google Fonts (Inter, Poppins)
- **Imagens:** Cloudinary CDN
- **Versionamento:** Git

## Estrutura do Projeto

```
/
├── config/          # JSONs de configuração de módulos
├── css/             # Estilos globais (inteli-styles.css)
├── pages/           # Páginas HTML
│   ├── autoestudos/ # Artigos de autoestudo
│   ├── module-*/    # Aulas por módulo
│   └── *.html       # Páginas gerais
└── index.html       # Página inicial
```

## Convenções de Código

### Nomenclatura de Arquivos
- Módulos: `module-[numero]-[sigla-curso]` (ex: `module-5-adm-tech`)
- Aulas: `lesson-[numero].html` (numeração inicia em 1)
- Kebab-case para todos os arquivos

### CSS
- Usar CSS Variables definidas em `/css/inteli-styles.css`
- Classes seguem padrão: `.module-header`, `.slide-container`, etc.
- Efeitos glassmorphism para cards

### JavaScript
- Sistema de navegação de slides com teclado (Arrow keys, Space)
- Copy to clipboard para blocos de código

## Tarefas Comuns

### Adicionar Nova Aula
1. Copiar template de aula existente
2. Atualizar título, conteúdo e navegação
3. Atualizar JSON de configuração do módulo
4. Adicionar card na página do módulo

### Adicionar Novo Módulo
1. Criar `config/module-X-[curso].json`
2. Criar `pages/module-X-[curso].html`
3. Criar pasta `pages/module-X-[curso]/`
4. Adicionar card no `index.html`

## Arquivos de Referência

- `frontend-best-practices.md` - Padrões de desenvolvimento
- `system-index.md` - Índice completo do sistema
- `/CODEBASE_INDEX.md` - Índice detalhado do codebase

## Regras Importantes

1. Toda página deve ter o footer global do Inteli
2. Usar CSS Variables para cores (nunca hardcode)
3. Testar navegação por teclado em slides
4. Manter JSONs de configuração atualizados
5. Links devem ser relativos
6. Alt text obrigatório em imagens
