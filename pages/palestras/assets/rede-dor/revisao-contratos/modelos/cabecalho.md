# Cabeçalho de passagem entre agentes

Todo arquivo que um agente entrega a outro começa por este bloco. O agente que recebe confere os campos antes de começar e devolve o arquivo ao orquestrador, com o motivo, se algum campo estiver vazio ou incoerente.

```yaml
---
emissor: analista-contrato          # papel que produziu o arquivo
destinatario: consolidador          # papel que vai trabalhar sobre ele
caso: 2026-031
tarefa: consolidar-consenso         # nome da skill que o destinatário executa
entradas: [clausulas.md, conceitos/politica-contratos.md]
pendencias: ["anexo de preços com item fora do Anexo I"]
rastro: { etapa: 2, tentativa: 1 }
---
```

## Formato de um achado

```markdown
## A-03 · Gatilho cambial no reajuste
- Cláusula: cl. 7.3, p. 4, "aplicar-se-á esta última"
- Regra: politica-contratos.md#POL-4.3
- Classificação: divergente
- Motivo: o dólar substitui o IPCA sem teto, o que anula o limite de 10% da cl. 7.2.
```
