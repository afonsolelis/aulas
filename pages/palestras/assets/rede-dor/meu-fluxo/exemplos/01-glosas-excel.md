# Exemplo 01 · Consolidação mensal de glosas em Excel

**Área:** Recebíveis · **Saída:** planilha `.xlsx` · **Topologia:** sequencial com revisor

## Problema

Cada convênio devolve o demonstrativo de glosas num layout próprio, e a equipe copia as linhas à mão para a planilha de acompanhamento. A transcrição consome dias no início do mês e os motivos de glosa chegam com nomes diferentes para a mesma causa.

## Entrada e saída

- Entrada: `casos/2026-09/retornos/*.csv`, um arquivo por convênio, e `conceitos/motivos-glosa.md`, com o código interno de cada motivo e os sinônimos usados pelos convênios.
- Saída: `casos/2026-09/glosas-2026-09.xlsx`, com uma aba por convênio, uma aba de consolidado por motivo e uma aba de conferência.

## Etapas e papéis

| Etapa | Papel | Saída | Critério de aceite |
|-------|-------|-------|--------------------|
| 1 | Leitor de retornos | `linhas.md` | Linhas lidas por arquivo iguais às linhas do CSV; soma glosada por convênio calculada por script |
| 2 | Classificador de motivo | `classificacao.md` | Todo motivo recebeu código de `motivos-glosa.md` ou foi marcado como "sem correspondência" |
| 3 | Revisor | `revisao.md` | Os itens "sem correspondência" e uma amostra de 10% dos demais foram conferidos |
| 4 | Gerador da planilha | `glosas-2026-09.xlsx` | A soma da aba consolidada é igual à soma da etapa 1 |

## Skills

- `ler-retornos`: script que lê todos os CSV, normaliza colunas e imprime linhas e soma por arquivo.
- `classificar-motivo`: aplica `motivos-glosa.md` e cita a seção usada (`motivos-glosa.md#M-07`).
- `gerar-planilha-glosas`: script com `openpyxl` que grava as abas e a aba de conferência com as somas.

## Onde o consenso entra

Não é necessário: a classificação segue tabela de sinônimos, e o revisor por amostragem basta. Se a taxa de "sem correspondência" passar de 5%, a tabela de sinônimos precisa de revisão pela área, e não de um segundo classificador.

## Primeira mensagem ao orquestrador

`Conduza o caso casos/2026-09 até a planilha de glosas.`
