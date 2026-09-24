# [Nome do fluxo]

[Uma ou duas frases: o que este repositório faz, para qual área e com que resultado. Exemplo: "Este repositório consolida o retorno mensal dos convênios em uma planilha de glosas por motivo, entregue a Recebíveis até o quinto dia útil."]

Cada caso fica em `casos/<id>/` e passa pelas etapas abaixo, conduzidas pelo orquestrador a partir de `casos/<id>/estado.md`.

| Etapa | Papel | Entrada | Saída | Critério de aceite |
|-------|-------|---------|-------|--------------------|
| 1 | [papel] | [arquivo] | [arquivo] | [uma frase verificável] |
| 2 | [papel] | [arquivo] | [arquivo] | [uma frase verificável] |
| 3 | [papel] | [arquivo] | [arquivo] | [uma frase verificável] |

## Regras que valem para todos os agentes

1. Nunca altere os arquivos de origem do caso: [liste-os].
2. Toda afirmação cita a origem: [linha da planilha, página do PDF, identificador da regra].
3. Aplique apenas as regras escritas em `conceitos/`.
4. Se a informação não estiver na entrada, escreva "não localizada".
5. Todo arquivo entregue a outro agente começa pelo cabeçalho de `modelos/cabecalho.md`.
6. A decisão final é de [área ou cargo]. Nenhum agente a toma.

## Vocabulário

- **[termo da área]**: [definição usada neste fluxo].
- **[termo da área]**: [definição usada neste fluxo].
