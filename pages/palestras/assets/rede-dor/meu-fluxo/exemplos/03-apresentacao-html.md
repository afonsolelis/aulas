# Exemplo 03 · Apresentação em HTML para a reunião de diretoria

**Área:** qualquer · **Saída:** um arquivo `.html` autocontido · **Topologia:** sequencial com revisor

## Problema

A reunião mensal pede um resumo visual de poucos indicadores e das decisões pendentes. Um HTML único abre em qualquer navegador, dispensa licença de software de apresentação e pode ser enviado por e-mail ou publicado na intranet.

## Entrada e saída

- Entrada: `casos/2026-09/dados.csv`, `casos/2026-09/pauta.md` (tópicos e decisões pendentes) e `conceitos/identidade-visual.md` (cores, fonte e ordem dos blocos).
- Saída: `casos/2026-09/apresentacao.html`, com navegação por setas, um slide por tópico e nenhum recurso externo.

## Etapas e papéis

| Etapa | Papel | Saída | Critério de aceite |
|-------|-------|-------|--------------------|
| 1 | Preparador de dados | `numeros.md` | Cada número da pauta calculado por script, com a linha de origem |
| 2 | Roteirista | `roteiro.md` | Um slide por tópico da pauta, título descritivo e no máximo quatro itens por slide |
| 3 | Construtor do HTML | `apresentacao.html` | Arquivo único, sem link externo, com o número de slides do roteiro |
| 4 | Revisor | `revisao.md` | Todo número do HTML confere com `numeros.md`; nenhum slide tem texto que transborde a tela |

## Skills

- `montar-roteiro`: transforma a pauta em roteiro slide a slide.
- `gerar-html-slides`: gera o HTML a partir do roteiro, com CSS e JavaScript no próprio arquivo, seguindo `identidade-visual.md`.
- `conferir-html`: conta os slides, lista os números presentes no HTML e compara com `numeros.md`.

## Onde o consenso entra

Não é necessário. O risco está nos números, e a conferência automática contra `numeros.md` o cobre melhor do que uma segunda leitura.

## Primeira mensagem ao orquestrador

`Conduza o caso casos/2026-09 até a apresentação em HTML.`
