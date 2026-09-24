# Exemplo 08 · Minuta de recurso de glosa em Word

**Área:** Recebíveis · **Saída:** documento `.docx` · **Topologia:** sequencial com revisor de fundamentação

## Problema

O recurso de glosa exige citar a cláusula do contrato com o convênio, a norma aplicável e a evidência do prontuário. Redigido do zero a cada caso, o recurso varia de qualidade conforme quem o escreve, e a fundamentação às vezes cita regra que não se aplica.

## Entrada e saída

- Entrada: `casos/<glosa>/glosa.md` (item, valor, motivo alegado pelo convênio), `casos/<glosa>/evidencias.md` (trechos do prontuário anonimizado), `conceitos/contrato-convenio.md` e `conceitos/modelos-recurso.md`.
- Saída: `casos/<glosa>/recurso.docx`, no modelo da área, e `casos/<glosa>/fundamentacao.md`, com a origem de cada argumento.

## Etapas e papéis

| Etapa | Papel | Saída | Critério de aceite |
|-------|-------|-------|--------------------|
| 1 | Analista da glosa | `fundamentacao.md` | Cada argumento cita a cláusula do contrato com o convênio e o trecho do prontuário |
| 2 | Revisor de fundamentação | `revisao.md` | Toda citação confere; argumento sem evidência é retirado |
| 3 | Redator | `recurso.md` | O texto segue `modelos-recurso.md` e usa apenas argumentos aprovados |
| 4 | Gerador do documento | `recurso.docx` | Documento gerado por script com `python-docx`, com o número de argumentos igual ao aprovado |

## Skills

- `fundamentar-recurso`, `conferir-citacao` (reaproveitada do kit de contratos), `redigir-recurso` e `gerar-docx`.

## Onde o consenso entra

Em recursos acima de um valor definido pela área, dois analistas fundamentam em separado e o consolidador marca os argumentos que só um deles encontrou. Abaixo desse valor, o revisor de fundamentação basta.

## Primeira mensagem ao orquestrador

`Conduza o caso casos/glosa-0042 até o recurso em Word.`
