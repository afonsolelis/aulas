---
name: modelo-skill
description: '[O que o procedimento faz e em que situação usá-lo. O modelo decide carregar a skill a partir deste texto, então nomeie a entrada, a saída e o momento do fluxo.]'
---

# [Nome do procedimento]

Renomeie a pasta e o campo `name` para o mesmo identificador, em letras minúsculas e hífens.

1. Abra `casos/<id>/[entrada]`.
2. [Passo do procedimento, com o formato exato do que deve ser gravado.]
3. [Passo de conferência: some, conte ou compare com a origem.]
4. Se a conferência não fechar, pare e devolva o motivo ao orquestrador.
5. Grave `casos/<id>/[saída]` começando pelo cabeçalho de `modelos/cabecalho.md`.

## Quando a saída é um arquivo do Office

Escreva um script em `scripts/` que gere o arquivo a partir dos dados conferidos, execute-o no terminal com aprovação e registre no cabeçalho o que o script conferiu (linhas escritas, soma, número de abas ou de slides). Se a biblioteca do Office não estiver disponível no ambiente, gere CSV ou HTML e registre a limitação em **pendências**.
