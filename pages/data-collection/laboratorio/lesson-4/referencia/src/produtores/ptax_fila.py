"""Produtor de PTAX: uma mensagem na fila por arquivo de entrada/ptax/*.jsonl, com a lista de boletins.

Uso, na pasta referencia/:  python -m src.produtores.ptax_fila [../entrada/ptax]
"""
import json, sys
from pathlib import Path
from src.fila import conectar, PERSISTENTE
from src.config import FILA

pasta = Path(sys.argv[1] if len(sys.argv) > 1 else "../entrada/ptax")
con, ch = conectar()
ch.confirm_delivery()
mensagens = boletins = 0
for arq in sorted(pasta.glob("*.jsonl")):
    lista = [json.loads(l) for l in open(arq, encoding="utf-8") if l.strip()]
    ch.basic_publish("", FILA, json.dumps({"data_tag": "ptax", "data": lista}, ensure_ascii=False).encode(),
                     PERSISTENTE)
    mensagens += 1
    boletins += len(lista)
con.close()
print(json.dumps({"mensagens": mensagens, "boletins": boletins}))
