"""API HTTP: valida o envelope e publica na fila. Responde 202 depois da confirmação do broker."""
import threading, time
import pika
from fastapi import FastAPI, Request
from fastapi.concurrency import run_in_threadpool
from fastapi.responses import JSONResponse
from src import contrato
from src.config import DOMINIOS, HTTP_MAX_BYTES, FILA
from src.fila import conectar

app = FastAPI(title="Servidor de ingestão · Aula 04")
_trava = threading.Lock()      # pika não é thread-safe: um publicador, uma trava
_canal = None


def publicar(corpo: bytes, recebido_ms: int) -> None:
    global _canal
    with _trava:
        for tentativa in range(2):
            try:
                if _canal is None or _canal.is_closed:
                    _, _canal = conectar()
                    _canal.confirm_delivery()          # basic_publish só volta depois do ack do broker
                props = pika.BasicProperties(delivery_mode=pika.DeliveryMode.Persistent,
                                             content_type="application/json",
                                             headers={"recebido_em_ms": recebido_ms})
                _canal.basic_publish(exchange="", routing_key=FILA, body=corpo, properties=props)
                return
            except pika.exceptions.AMQPError:
                _canal = None
                if tentativa:
                    raise


@app.post("/ingest", status_code=202)
async def ingest(request: Request):
    recebido_ms = time.time_ns() // 1_000_000
    if int(request.headers.get("content-length") or 0) > HTTP_MAX_BYTES:
        return JSONResponse({"erro": f"corpo maior que {HTTP_MAX_BYTES} bytes"}, status_code=413)
    corpo = await request.body()
    if len(corpo) > HTTP_MAX_BYTES:
        return JSONResponse({"erro": f"corpo maior que {HTTP_MAX_BYTES} bytes"}, status_code=413)
    try:
        tag, itens = contrato.validar(corpo, DOMINIOS)
    except contrato.CorpoNaoJson as e:
        return JSONResponse({"erro": str(e)}, status_code=400)
    except contrato.EnvelopeInvalido as e:
        return JSONResponse({"erro": str(e)}, status_code=422)
    try:
        await run_in_threadpool(publicar, corpo, recebido_ms)
    except pika.exceptions.AMQPError:
        return JSONResponse({"erro": "fila indisponível"}, status_code=503)
    return {"status": "aceito", "data_tag": tag, "itens": len(itens), "recebido_em_ms": recebido_ms}


@app.get("/health")
def health():
    return {"status": "ok"}
