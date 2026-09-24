# Exemplo 02 · Apresentação mensal do giro de leitos em PowerPoint

**Área:** Operações Hospitalares · **Saída:** apresentação `.pptx` · **Topologia:** sequencial com revisor de números

## Problema

Todo mês, os indicadores de giro de leitos saem de uma planilha exportada do sistema e são copiados para uma apresentação da reunião de operações. A cópia manual dos números é a principal fonte de erro, e o texto de análise é reescrito do zero a cada mês.

## Entrada e saída

- Entrada: `casos/2026-09/giro-leitos.csv` (exportação do sistema) e `conceitos/indicadores.md`, com a fórmula e a meta de cada indicador.
- Saída: `casos/2026-09/giro-leitos-2026-09.pptx`, com capa, um slide por indicador (valor, meta, gráfico e duas frases de análise) e um slide de pendências.

## Etapas e papéis

| Etapa | Papel | Saída | Critério de aceite |
|-------|-------|-------|--------------------|
| 1 | Calculador | `indicadores.md` | Cada indicador calculado por script, com a fórmula de `indicadores.md` e o número de linhas usadas |
| 2 | Analista | `analise.md` | Cada frase de análise cita o valor e a meta do indicador; nenhuma causa é afirmada sem dado |
| 3 | Gerador da apresentação | `.pptx` | Número de slides = indicadores + 2; cada número do slide aparece em `indicadores.md` |
| 4 | Revisor de números | `revisao.md` | Todo número da apresentação foi conferido contra `indicadores.md` |

## Skills

- `calcular-indicadores`: script que lê o CSV e grava `indicadores.md` com valor, meta e desvio.
- `gerar-pptx`: script com `python-pptx` que monta os slides a partir de `indicadores.md` e `analise.md`, e imprime a contagem de slides.
- `conferir-numeros`: extrai os números do `.pptx` gerado e compara com `indicadores.md`.

## Onde o consenso entra

Na análise. Dois analistas independentes escrevem as frases de cada indicador, e o consolidador marca como divergente o indicador em que um apontou piora e o outro, estabilidade. Esses indicadores vão para a pessoa responsável antes da reunião.

## Primeira mensagem ao orquestrador

`Conduza o caso casos/2026-09 até a apresentação do giro de leitos.`
