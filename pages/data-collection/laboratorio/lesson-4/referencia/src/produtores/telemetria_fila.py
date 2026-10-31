"""Produtor de telemetria: cada linha de entrada/telemetria/*.txt vira uma mensagem {arquivo, numero_linha, linha}.

Uso, na pasta referencia/:  python -m src.produtores.telemetria_fila [../entrada/telemetria] [limite]
"""
import json, sys, time
from pathlib import Path
from src.fila import conectar, PERSISTENTE
from src.config import FILA

pasta = Path(sys.argv[1] if len(sys.argv) > 1 else "../entrada/telemetria")
limite = int(sys.argv[2]) if len(sys.argv) > 2 else None
con, ch = conectar()
ch.confirm_delivery()
n = 0
t0 = time.perf_counter()
for txt in sorted(pasta.glob("*.txt")):
    for i, linha in enumerate(txt.read_text(encoding="utf-8").splitlines(), start=1):
        env = {"data_tag": "telemetria",
               "data": {"arquivo": f"entrada/telemetria/{txt.name}", "numero_linha": i, "linha": linha}}
        ch.basic_publish("", FILA, json.dumps(env, ensure_ascii=False).encode(), PERSISTENTE)
        n += 1
        if limite and n >= limite:
            break
    if limite and n >= limite:
        break
con.close()
print(json.dumps({"mensagens": n, "segundos": round(time.perf_counter() - t0, 3)}))
