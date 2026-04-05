# Spec: Páginas Home de Módulo

## Escopo

Aplica-se a todas as páginas `pages/home-*.html`.

Para homes de módulo, o padrão principal continua sendo `pages/home-module-*.html`.

## Estrutura mínima

1. Toda home deve usar nome em kebab-case.
2. Toda home deve ter cabeçalho com nome da seção e botão de voltar.
3. Toda home deve ter footer institucional com logo e crédito.

## Estrutura de homes de módulo

1. Cabeçalho do módulo com nome, curso e botão de voltar.
2. Coluna lateral com card `Sobre o Módulo`.
3. Seção `Principais Tópicos`.
4. Área principal com lista de aulas ou mensagem de módulo em construção.

## Principais Tópicos

1. Toda `home-module-*` deve incluir item `TAPI`.
2. O item `TAPI` deve aparecer dentro da lista `Principais Tópicos`.
3. Se o link real do TAPI não estiver definido, pode usar `href=""` como placeholder.

## Aulas

1. Se o módulo já tiver aulas publicadas, a home deve listar os cards de aula.
2. Se o módulo ainda não tiver aulas publicadas, pode exibir mensagem de `Em construção`.
3. Quando houver card de aula, ele deve seguir a spec de cards de aula.

## Homes auxiliares

1. Páginas como `home-professor.html`, `home-autoestudos.html` e `home-tutorial-gitlab.html` também devem seguir o padrão kebab-case.
2. Homes auxiliares não precisam ter lista de aulas nem seção `Principais Tópicos`.
