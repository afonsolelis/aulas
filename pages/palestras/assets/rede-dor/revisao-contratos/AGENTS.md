# Revisão de contratos com agentes

Este repositório conduz a revisão de contratos de prestação de serviços antes da assinatura. Cada contrato é um caso, guardado em `casos/<id>/`, e passa por seis etapas executadas por agentes com papel restrito. O Orquestrador de revisão decide a etapa seguinte a partir de `casos/<id>/estado.md`.

## Regras que valem para todos os agentes

1. Nunca altere `contrato.md` nem `anexo-precos.csv`. São a origem do caso e servem de prova.
2. Toda afirmação sobre o contrato cita a cláusula e a página, no formato `cl. 7.3, p. 4`, e reproduz o trecho literal entre aspas.
3. Toda afirmação sobre a política cita a regra pelo endereço, como `politica-contratos.md#POL-4.3`.
4. Se a informação não estiver no contrato, escreva "não localizada". Não estime o que o fornecedor provavelmente quis dizer.
5. Aplique apenas as regras escritas em `conceitos/`. Critério que não está na política não gera achado.
6. Todo arquivo entregue a outro agente começa pelo cabeçalho descrito em `modelos/cabecalho.md`.
7. A decisão de assinar, renegociar ou recusar é do Jurídico e de Suprimentos. Nenhum agente recomenda a assinatura.

## Vocabulário

- **Achado**: divergência, ausência ou atendimento de uma regra, sempre com a cláusula e a regra citadas.
- **Classificação**: `atendida`, `divergente`, `ausente` (cláusula obrigatória não localizada) ou `incoerente` (o próprio contrato se contradiz).
- **Consenso**: os dois analistas registraram o mesmo achado, sobre a mesma cláusula e a mesma regra, com a mesma classificação.
- **Divergência**: um analista registrou o achado e o outro não, ou os dois o classificaram de forma diferente.
- **Escalonamento**: o caso ou o achado segue para a pessoa responsável, com o que já foi apurado e o motivo.

## Mapa do repositório

- `.github/agents/` guarda os papéis; `.github/skills/` guarda os procedimentos que eles executam.
- `conceitos/` é a base de conhecimento: política, decisões anteriores e cláusulas-padrão.
- `modelos/` traz o cabeçalho de passagem e o modelo de `estado.md`.
- `scripts/` traz o leitor da planilha de preços.
- `casos/<id>/` guarda o contrato, a planilha e cada arquivo produzido pelas etapas.
