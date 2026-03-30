# Spec: Nomenclatura de Rotas e Arquivos HTML

## Objetivo

Padronizar os nomes dos arquivos HTML públicos do portal.

## Regras

1. Rotas e arquivos públicos devem usar kebab-case.
2. O caractere `_` não deve ser usado em nomes de páginas acessadas por link.
3. Homes de módulo devem seguir o padrão `pages/home-module-*.html`.
4. Homes auxiliares devem seguir o padrão `pages/home-*.html`.
5. Links internos, testes e specs devem referenciar apenas o nome final em kebab-case.

## Exemplos

1. Válido: `pages/home-module-5-adm-tech.html`
2. Válido: `pages/home-professor.html`
3. Inválido: `pages/home_module-5-adm-tech.html`
4. Inválido: `pages/home_professor.html`
