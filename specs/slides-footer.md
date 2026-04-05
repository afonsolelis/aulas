# Spec: Footer dos Slides

## Objetivo

Garantir que todos os slides tenham navegação e links consistentes.

## Regras obrigatórias

1. Todo slide deck deve ter footer fixo.
2. O footer deve conter botão `🏠 Home`.
3. O footer deve conter botão `📖 Material`.
4. O footer deve conter navegação de `Anterior` e `Próximo`.
5. O footer deve conter contador de slides.
6. Se o deck suportar fullscreen, o footer deve conter botão de tela cheia.

## Regras de link

1. O botão `Home` deve sempre apontar para a `home-module-*` correta.
2. O destino de `Home` deve usar kebab-case.
3. O botão `Material` deve sempre apontar para um arquivo existente.
4. Se o material final ainda não existir, deve haver ao menos um placeholder HTML para evitar link quebrado.

## Regras visuais

1. O botão `Material` deve usar contraste forte e legível.
2. O texto do botão `Material` não pode depender de hover para ficar visível.
3. A cor padronizada atual do botão `Material` é verde escuro com texto branco.
