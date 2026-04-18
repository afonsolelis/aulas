# Spec: Formato dos Slides

## Objetivo

Padronizar a estrutura dos arquivos de slides do portal.

## Regras

1. O formato padrão é HTML standalone com navegação via JavaScript local — sem libs externas de apresentação.
2. Cada slide deck deve ter uma estrutura navegável com:
   - container principal de slides
   - slides individuais com troca por botão/teclado
   - contador de slides
3. Cada deck deve existir como arquivo HTML estático versionado no repositório.
4. Quando uma aula ainda não tiver conteúdo completo, o slide pode ser placeholder, mas deve existir e abrir normalmente.
5. Slides placeholder devem deixar claro que o conteúdo ainda será refinado.

## Organização de arquivos

1. Slides antigos podem existir como `lesson-N.html`.
2. Slides de módulos com estrutura nova podem existir como `slides/slide-lesson-N.html`.
3. Em ambos os casos, a navegação e o footer devem seguir a spec de footer.
