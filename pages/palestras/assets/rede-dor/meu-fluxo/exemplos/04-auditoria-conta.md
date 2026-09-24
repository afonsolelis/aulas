# Exemplo 04 · Auditoria de conta hospitalar contra a tabela de conceitos

**Área:** Recebíveis · **Saída:** relatório de achados em markdown e planilha de itens · **Topologia:** hierárquica com dois analistas e consenso

## Problema

A auditoria compara a conta hospitalar com o prontuário e com a tabela de conceitos do convênio. Feita numa única conversa, a comparação falha quando o prontuário é longo, porque o trecho que justifica o item fica diluído. Separar a leitura de cada fonte e confrontá-las por item permite conferir cada passo.

## Entrada e saída

- Entrada: `casos/<conta>/conta.csv`, `casos/<conta>/prontuario.md` (anonimizado) e `conceitos/tabela-conceitos.md`, uma seção por conceito com identificador.
- Saída: `casos/<conta>/achados.md` e `casos/<conta>/itens-auditados.csv`, com a decisão por item.

## Etapas e papéis

| Etapa | Papel | Saída | Critério de aceite |
|-------|-------|-------|--------------------|
| 1 | Leitor da conta | `itens.md` | Todos os itens da conta, com quantidade e valor; soma igual à do CSV |
| 2 | Leitor do prontuário | `evidencias.md` | Cada procedimento, material e medicamento registrado, com data e trecho |
| 3a | Auditor pela conta | `achados-a.md` | Todo item da conta tem evidência citada ou é marcado "sem evidência" |
| 3b | Auditor pelo prontuário | `achados-b.md` | Todo registro do prontuário tem item correspondente ou é marcado "não cobrado" |
| 4 | Consolidador | `consenso.md` | Todo item em exatamente uma categoria: consenso, divergência ou único |
| 5 | Revisor | `achados.md` | Divergências decididas pela evidência; itens com valor acima do limite conferidos um a um |

## Skills

- `ler-conta`, `ler-prontuario`, `confrontar-conceitos` e `consolidar-consenso`, esta última reaproveitada do kit de contratos.

## Onde o consenso entra

Na etapa 3. Ler a partir da conta encontra cobrança sem evidência; ler a partir do prontuário encontra procedimento feito e não cobrado. Cada leitura deixa passar o que a outra encontra, e por isso a divergência entre elas aponta os itens que merecem atenção.

## Primeira mensagem ao orquestrador

`Conduza a auditoria da conta casos/conta-0001 até achados.md.`
