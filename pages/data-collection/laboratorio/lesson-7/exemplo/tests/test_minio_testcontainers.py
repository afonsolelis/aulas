"""Teste de integração: MinIO real num contêiner descartável.

Requer Docker. Sem Docker, o teste é pulado com motivo explícito, em vez de
falhar com um erro de conexão difícil de ler.
"""

import io
import json
from datetime import UTC, datetime

import pytest

from leitura_sensor import validar_lote

IMAGEM_MINIO = "coollabsio/minio:RELEASE.2025-10-15T17-29-55Z"


def docker_disponivel() -> bool:
    """Verifica o daemon, não só o binário: o comando pode existir com o daemon parado."""
    try:
        import docker

        docker.from_env().ping()
        return True
    except Exception:
        return False


pytestmark = [
    pytest.mark.integracao,
    pytest.mark.skipif(not docker_disponivel(), reason="Docker indisponível neste ambiente"),
]


@pytest.fixture(scope="session")
def minio():
    # Importado aqui para que os testes de unidade rodem mesmo sem testcontainers.
    from testcontainers.community.minio import MinioContainer

    container = MinioContainer(image=IMAGEM_MINIO)
    # A imagem atual lê MINIO_ROOT_USER/MINIO_ROOT_PASSWORD; o módulo define as
    # variáveis antigas, então declaramos as atuais com as mesmas credenciais.
    container.with_env("MINIO_ROOT_USER", container.access_key)
    container.with_env("MINIO_ROOT_PASSWORD", container.secret_key)
    with container:
        yield container


def test_rejeicao_gravada_e_lida_no_minio(minio):
    # No projeto, a leitura IoT recusada vai para leituras.dlq e
    # iot.leituras_rejeitadas (Aula 06); a quarentena no MinIO é o caminho
    # dos lotes da Aula 03. Aqui o MinIO guarda uma cópia de auditoria do
    # lote só para demonstrar gravação e leitura com contêiner real.
    cliente = minio.get_client()
    cliente.make_bucket("raw")

    mensagem = {"event_id": "6f1c2a9e-5b7d-4c55-9a51-0e3c1d2b7f40", "device_id": "estufa-a-03",
                "medido_em": "2026-11-14T12:41:03.120Z", "temperatura": 999.0,
                "unidade_temperatura": "C", "umidade": 61.2}
    agora = datetime(2026, 11, 14, 12, 45, tzinfo=UTC)
    _, rejeitadas = validar_lote([json.dumps(mensagem).encode()], {}, agora=agora)
    linhas = "\n".join(json.dumps(r, default=str) for r in rejeitadas).encode()
    chave = "quarantine/iot/data=2026-11-14/lote-0001.jsonl"
    cliente.put_object("raw", chave, io.BytesIO(linhas), length=len(linhas),
                       content_type="application/x-ndjson")

    lido = [json.loads(l) for l in cliente.get_object("raw", chave).read().splitlines()]
    assert lido[0]["motivo"] == "temperatura_fora_da_faixa"
    assert json.loads(lido[0]["payload"])["temperatura"] == 999.0
