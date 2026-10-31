"""Testes de unidade do contrato: rodam em milissegundos, sem Docker nem rede."""

import json
from datetime import UTC, datetime

import pytest
from pydantic import ValidationError

from leitura_sensor import LeituraBruta, motivo, validar_lote

CADASTRO = {
    "estufa-a-03": {"local": "Estufa A", "tipo_local": "estufa"},
    "germinacao-01": {"local": "Sala de germinação", "tipo_local": "germinacao"},
}

AGORA = datetime(2026, 11, 14, 12, 45, tzinfo=UTC)  # relógio fixo do teste

VALIDA = {
    "event_id": "6f1c2a9e-5b7d-4c55-9a51-0e3c1d2b7f40",
    "device_id": "estufa-a-03",
    "medido_em": "2026-11-14T12:41:03.120Z",
    "temperatura": 24.6,
    "unidade_temperatura": "C",
    "umidade": 61.2,
}


def corpo(**alteracoes) -> bytes:
    return json.dumps({**VALIDA, **alteracoes}).encode()


def test_fahrenheit_e_normalizado_para_celsius_e_enriquecido():
    leitura = LeituraBruta.model_validate_json(
        corpo(temperatura=76.28, unidade_temperatura="F"), context={"agora": AGORA}
    )
    linha = leitura.normalizar(CADASTRO)
    assert linha.temperatura_c == 24.6  # (76.28 - 32) * 5 / 9
    assert linha.umidade_pct == 61.2
    assert linha.tipo_local == "estufa"
    assert linha.medido_em.utcoffset().total_seconds() == 0


@pytest.mark.parametrize(
    "alteracoes, motivo_esperado",
    [
        ({"unidade_temperatura": "K"}, "unidade_desconhecida"),
        ({"umidade": 104.0}, "umidade_fora_da_faixa"),
        ({"temperatura": 150.0, "unidade_temperatura": "F"}, "temperatura_fora_da_faixa"),  # 65,56 °C
        ({"medido_em": "2099-01-01T00:00:00Z"}, "medido_em_no_futuro"),
        ({"medido_em": "2026-11-14T12:41:03"}, "tipo_invalido"),  # sem fuso
        ({"event_id": "abc"}, "tipo_invalido"),
        ({"bateria": 87}, "campo_desconhecido"),  # extra="forbid"
    ],
)
def test_leitura_invalida_recebe_o_motivo_da_aula_06(alteracoes, motivo_esperado):
    with pytest.raises(ValidationError) as info:
        LeituraBruta.model_validate_json(corpo(**alteracoes), context={"agora": AGORA})
    assert motivo(info.value.errors()) == motivo_esperado


def test_lote_separa_validas_de_rejeitadas_sem_parar():
    sem_umidade = {k: v for k, v in VALIDA.items() if k != "umidade"}
    lote = [
        corpo(),
        b"{nao e json",
        json.dumps(sem_umidade).encode(),
        corpo(device_id="estufa-c-09"),  # formato válido, fora do cadastro
        corpo(device_id="germinacao-01", temperatura=71.6, unidade_temperatura="F"),
    ]
    validas, rejeitadas = validar_lote(lote, CADASTRO, agora=AGORA)
    assert [v.device_id for v in validas] == ["estufa-a-03", "germinacao-01"]
    assert validas[1].temperatura_c == 22.0
    assert [(r["posicao"], r["motivo"]) for r in rejeitadas] == [
        (1, "json_invalido"),
        (2, "campo_ausente"),
        (3, "sensor_desconhecido"),
    ]
    assert rejeitadas[2]["device_id"] == "estufa-c-09"
    assert rejeitadas[0]["payload"] == "{nao e json"
