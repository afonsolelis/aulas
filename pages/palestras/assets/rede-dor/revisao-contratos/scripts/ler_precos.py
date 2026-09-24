"""Lê a planilha de composição de preços (CSV com ';' e vírgula decimal) e grava precos.md.

Uso: python scripts/ler_precos.py casos/<id>/anexo-precos.csv casos/<id>/precos.md

Usa apenas a biblioteca padrão, para rodar em qualquer instalação do Python 3.
"""
import csv
import sys
from decimal import Decimal


def valor(texto):
    return Decimal(texto.strip().replace(".", "").replace(",", ".") or "0")


def brl(numero):
    inteiro, decimal = f"{numero:,.2f}".split(".")
    return "R$ " + inteiro.replace(",", ".") + "," + decimal


def main(origem, destino):
    with open(origem, encoding="utf-8") as arquivo:
        linhas = list(csv.DictReader(arquivo, delimiter=";"))

    recorrente = Decimal("0")
    unica = Decimal("0")
    tabela = ["| Item | Descrição | Qtd. | Unitário mensal | Total | Observação |",
              "|------|-----------|------|-----------------|-------|------------|"]
    for linha in linhas:
        total = valor(linha["valor_mensal_total"])
        observacao = (linha.get("observacao") or "").strip()
        if "única" in observacao.lower():
            unica += total
        else:
            recorrente += total
        tabela.append(
            f"| {linha['item']} | {linha['equipamento']} | {linha['quantidade']} | "
            f"{brl(valor(linha['valor_mensal_unitario']))} | {brl(total)} | {observacao} |"
        )

    anual = recorrente * 12 + unica
    resumo = [
        f"- Linhas lidas: {len(linhas)}",
        f"- Soma mensal recorrente: {brl(recorrente)}",
        f"- Itens de parcela única: {brl(unica)}",
        f"- Valor anual calculado (12 × recorrente + parcela única): {brl(anual)}",
    ]

    with open(destino, "w", encoding="utf-8") as saida:
        saida.write("# Composição de preços\n\n")
        saida.write(f"Origem: `{origem}`, lida por `scripts/ler_precos.py`.\n\n")
        saida.write("\n".join(tabela) + "\n\n## Resumo da leitura\n\n")
        saida.write("\n".join(resumo) + "\n\n## Conferência com o contrato\n\n")
        saida.write("<a preencher pelo Extrator: valor da cl. 7.1 e itens do Anexo I>\n")

    print("\n".join(resumo))


if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit("Uso: python scripts/ler_precos.py <anexo.csv> <precos.md>")
    main(sys.argv[1], sys.argv[2])
