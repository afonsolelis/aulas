# Exemplo 05 · Classificação dos motivos de atraso de alta com dois classificadores

**Área:** Operações Hospitalares · **Saída:** planilha categorizada e resumo · **Topologia:** dois classificadores independentes, consolidador e revisão humana

## Problema

Os motivos de atraso de alta e de liberação de leito são registrados em texto livre e transcritos à mão para a planilha de giro. A classificação muda conforme quem transcreve, o que impede comparar meses. Dois classificadores independentes, com a mesma tabela de categorias, mostram em que registros a própria categoria é ambígua.

## Entrada e saída

- Entrada: `casos/2026-09/registros.csv` (data, unidade, texto livre) e `conceitos/categorias-atraso.md`, com definição e exemplos de cada categoria.
- Saída: `casos/2026-09/atrasos-classificados.csv` e `casos/2026-09/resumo.md`, com contagem por categoria e lista dos registros em disputa.

## Etapas e papéis

| Etapa | Papel | Saída | Critério de aceite |
|-------|-------|-------|--------------------|
| 1 | Preparador | `registros.md` | Registros lidos por script, com identificador; total igual ao do CSV |
| 2a | Classificador A | `classes-a.md` | Todo registro com uma categoria e a expressão do texto que a justifica |
| 2b | Classificador B | `classes-b.md` | Idem, em conversa separada, sem acesso a `classes-a.md` |
| 3 | Consolidador | `consenso.md` | Taxa de concordância calculada; registros divergentes listados com as duas justificativas |
| 4 | Revisão humana | decisão em `consenso.md` | Cada divergência decidida pela pessoa responsável, com o motivo |
| 5 | Gerador | `.csv` e `resumo.md` | Contagem por categoria soma o total da etapa 1 |

## Skills

- `classificar-registro`, com a tabela de categorias e a exigência de citar a expressão do texto.
- `consolidar-consenso`, que calcula a concordância simples entre A e B.
- `gerar-planilha-atrasos`.

## Onde o consenso entra

É o centro do fluxo. A taxa de concordância mede a clareza da tabela de categorias: se ela fica abaixo de 80%, as categorias em disputa precisam de definição melhor em `categorias-atraso.md`, e cada decisão da pessoa responsável vira exemplo nessa tabela para o mês seguinte.

## Primeira mensagem ao orquestrador

`Conduza o caso casos/2026-09 até a planilha de atrasos classificados.`
