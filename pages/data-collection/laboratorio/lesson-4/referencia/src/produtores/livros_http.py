"""Produtor de livros: cada linha de entrada/livros/*.jsonl vira um POST /ingest.

Uso, na pasta referencia/:  python -m src.produtores.livros_http [../entrada/livros] [url]
"""
import json, sys, time
from pathlib import Path
import requests

pasta = Path(sys.argv[1] if len(sys.argv) > 1 else "../entrada/livros")
url = sys.argv[2] if len(sys.argv) > 2 else "http://localhost:8000/ingest"
s = requests.Session()
ok = falha = 0
t0 = time.perf_counter()
for arq in sorted(pasta.glob("*.jsonl")):
    with open(arq, encoding="utf-8") as f:
        for linha in f:
            if not linha.strip():
                continue
            r = s.post(url, json={"data_tag": "livros", "data": json.loads(linha)}, timeout=10)
            if r.status_code == 202:
                ok += 1
            else:
                falha += 1
                print(r.status_code, r.text, file=sys.stderr)
print(json.dumps({"aceitos": ok, "recusados": falha, "segundos": round(time.perf_counter() - t0, 3)}))
