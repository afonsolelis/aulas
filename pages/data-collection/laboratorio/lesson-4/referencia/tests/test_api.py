from fastapi.testclient import TestClient
from src import api

publicados = []
api.publicar = lambda corpo, ts: publicados.append(corpo)   # sem RabbitMQ no teste de unidade
cli = TestClient(api.app)


def test_202():
    r = cli.post("/ingest", json={"data_tag": "livros", "data": {"upc": "x"}})
    assert r.status_code == 202 and publicados


def test_422():
    assert cli.post("/ingest", json={"data_tag": "vendas", "data": {}}).status_code == 422


def test_400():
    assert cli.post("/ingest", content=b"nao json").status_code == 400


def test_413():
    assert cli.post("/ingest", content=b"{" + b" " * (2 * 1024 * 1024) + b"}").status_code == 413
