import pika
from src.config import env, FILA


def conectar():
    cred = pika.PlainCredentials(env("RABBITMQ_USER"), env("RABBITMQ_PASSWORD"))
    params = pika.ConnectionParameters(env("RABBITMQ_HOST", "localhost"), int(env("RABBITMQ_PORT", "5672")),
                                       credentials=cred, heartbeat=30)
    con = pika.BlockingConnection(params)
    ch = con.channel()
    ch.queue_declare(queue=FILA, durable=True)   # a fila sobrevive a reinício do broker
    return con, ch


PERSISTENTE = pika.BasicProperties(delivery_mode=pika.DeliveryMode.Persistent, content_type="application/json")
