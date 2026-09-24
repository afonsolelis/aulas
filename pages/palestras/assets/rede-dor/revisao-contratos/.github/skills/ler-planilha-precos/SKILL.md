---
name: ler-planilha-precos
description: Lê a planilha de composição de preços de um caso com um script, grava casos/<id>/precos.md e compara a soma com o valor declarado no contrato e os itens com o Anexo I. Use depois da extração de cláusulas.
---

# Ler a planilha de preços

A planilha é lida por programa, e não pela leitura do modelo, porque o programa processa todas as linhas e devolve a soma exata.

1. Execute no terminal, a partir da raiz do repositório:

   ```bash
   python scripts/ler_precos.py casos/<id>/anexo-precos.csv casos/<id>/precos.md
   ```

   Se o Python não estiver disponível, escreva um script equivalente na linguagem disponível e peça aprovação antes de executá-lo. O script precisa informar linhas lidas e soma.
2. Confira o resumo que o script imprime: linhas lidas, soma mensal recorrente, itens de parcela única e valor anual calculado.
3. Compare, em `precos.md`, na seção `## Conferência com o contrato`:
   - o valor anual calculado com o valor da cl. 7.1;
   - cada equipamento da planilha com o Anexo I, marcando os que não constam dele;
   - cada item cobrado que não é equipamento, como taxas.
4. Registre cada diferença em **pendências** do cabeçalho.
