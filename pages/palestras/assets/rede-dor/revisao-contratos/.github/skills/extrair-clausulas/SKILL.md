---
name: extrair-clausulas
description: Converte o contrato de um caso em casos/<id>/clausulas.md, uma seção por cláusula, com trecho literal e página, e confere o total contra o sumário. Use ao abrir um caso novo, antes de qualquer confronto com a política.
---

# Extrair cláusulas

1. Abra `casos/<id>/contrato.md` e localize o sumário.
2. Percorra o corpo do contrato do início ao fim, incluindo os anexos, e grave uma seção por cláusula no formato abaixo. A página é a da marca `[p. N]` mais recente antes da cláusula.

   ```markdown
   ## cl. 7 · Preço e reajuste · p. 4
   - 7.1: "Pelos serviços, a CONTRATANTE pagará ..." (texto integral)
   - 7.2: "O valor será reajustado ..."
   ```

3. Copie cada item com o texto integral. Não resuma, não corrija a grafia e não reordene.
4. Conte as cláusulas do corpo e compare com o sumário.
   - Se o corpo tiver cláusula que o sumário não lista, extraia a cláusula normalmente e registre em **pendências** "cl. X fora do sumário". Essa cláusula passa a ser leitura obrigatória dos dois analistas.
   - Se o sumário listar cláusula que o corpo não tem, registre "cl. X listada e não localizada".
5. Extraia os anexos como seções próprias (`## Anexo I · ...`), preservando as tabelas.
6. Ao final do arquivo, grave a seção `## Conferência` com: cláusulas no sumário, cláusulas no corpo, diferenças encontradas.
