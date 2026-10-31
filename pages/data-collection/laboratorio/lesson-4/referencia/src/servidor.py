"""Um processo: API HTTP (uvicorn) e consumidor da fila numa thread.

Uso, na pasta referencia/ com o .env do laboratório preenchido:
    python -m src.servidor
"""
import logging, os, threading
import uvicorn
from src.api import app
from src.consumidor import Consumidor

logging.basicConfig(level=os.getenv("LOG_LEVEL", "INFO"), format="%(asctime)s %(name)s %(message)s")
logging.getLogger("pika").setLevel(logging.WARNING)


def main(consumidor_cls=Consumidor):
    consumidor = consumidor_cls()
    t = threading.Thread(target=consumidor.rodar, name="consumidor", daemon=True)
    t.start()
    try:
        uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("API_PORT", "8000")), log_level="warning")
    finally:
        consumidor.parar.set()
        t.join(timeout=10)


if __name__ == "__main__":
    main()
