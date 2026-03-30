# Spec: Cards de Módulo na Index

## Objetivo

Padronizar os cards da `index.html`.

## Regras

1. Todo card de módulo deve apontar para uma página `home-module-*` existente.
2. Toda rota de destino usada na `index.html` deve estar em kebab-case.
3. Cards que apontem para páginas removidas não devem permanecer na home.
4. A ordem dos cards deve respeitar a progressão acadêmica acordada.
5. O módulo 2 do ciclo comum deve aparecer antes do módulo 5 de Adm Tech.

## Exceções

1. Cards informativos que não representam módulo podem seguir outra estrutura.
2. Módulos removidos podem ter o card removido em vez de usar link quebrado.
3. Cards informativos como professor, autoestudos e tutorial podem apontar para `home-*.html` fora do padrão `home-module-*`, desde que a rota exista.
