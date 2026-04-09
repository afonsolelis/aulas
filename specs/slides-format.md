# Spec: Formato dos Slides

## Objetivo

Padronizar a estrutura dos arquivos de slides do portal.

## Regras

1. Novos slides não devem usar `Reveal.js` como engine padrão.
2. O formato preferencial é HTML simples com navegação via JavaScript local.
3. Cada slide deck deve ter uma estrutura navegável com:
   - container principal de slides
   - slides individuais com troca por botão/teclado
   - contador de slides
4. Cada deck deve existir como arquivo HTML estático versionado no repositório.
5. Quando uma aula ainda não tiver conteúdo completo, o slide pode ser placeholder, mas deve existir e abrir normalmente.
6. Slides placeholder devem deixar claro que o conteúdo ainda será refinado.

## Organização de arquivos

1. Slides antigos podem existir como `lesson-N.html`.
2. Slides de módulos com estrutura nova podem existir como `slides/slide-lesson-N.html`.
3. Em ambos os casos, a navegação e o footer devem seguir a spec de footer.
