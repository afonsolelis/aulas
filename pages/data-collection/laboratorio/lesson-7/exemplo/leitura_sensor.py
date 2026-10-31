"""Contrato mínimo da leitura IoT publicada pela Aula 06 (referência da Aula 07).

Exemplo didático, não é a solução do projeto. A mensagem segue o contrato
da Aula 06 (material, seção 12.1):

    {"event_id": "<uuid>", "device_id": "estufa-a-03",
     "medido_em": "2026-11-14T12:41:03.120Z", "temperatura": 24.6,
     "unidade_temperatura": "C", "umidade": 61.2}

LeituraBruta valida a mensagem; LeituraNormalizada tem os nomes das colunas
de iot.leituras (laboratorio/sql/001_criar_tabelas.sql da Aula 06).
"""

from __future__ import annotations

import json
from datetime import UTC, datetime, timedelta
from typing import Annotated, Literal
from uuid import UUID

from pydantic import (
    AwareDatetime,
    BaseModel,
    ConfigDict,
    Field,
    ValidationError,
    ValidationInfo,
    model_validator,
)
from pydantic_core import PydanticCustomError

# Hipóteses, validação pendente: confirmar na spec do grupo antes de usar.
FAIXA_TEMPERATURA_C = (-10.0, 60.0)
TOLERANCIA_FUTURO = timedelta(minutes=5)

# Estufas A, B e C com três sensores cada e a sala de germinação (Aula 06).
# O padrão é um filtro de formato; quem decide se o sensor existe é o cadastro.
DeviceId = Annotated[str, Field(pattern=r"^(estufa-[a-c]|germinacao)-[0-9]{2}$")]


class LeituraBruta(BaseModel):
    """Mensagem como chega da fila leituras.brutas."""

    model_config = ConfigDict(extra="forbid", frozen=True)

    event_id: UUID
    device_id: DeviceId
    medido_em: AwareDatetime
    temperatura: float = Field(allow_inf_nan=False)
    unidade_temperatura: Literal["C", "F"]
    umidade: float = Field(ge=0, le=100, allow_inf_nan=False)

    @property
    def temperatura_c(self) -> float:
        if self.unidade_temperatura == "F":
            return round((self.temperatura - 32) * 5 / 9, 2)
        return self.temperatura

    @model_validator(mode="after")
    def regras_da_aula_06(self, info: ValidationInfo) -> "LeituraBruta":
        minimo, maximo = FAIXA_TEMPERATURA_C
        if not minimo <= self.temperatura_c <= maximo:
            raise PydanticCustomError(
                "temperatura_fora_da_faixa",
                "temperatura {celsius} °C fora da faixa [{minimo}, {maximo}]",
                {"celsius": self.temperatura_c, "minimo": minimo, "maximo": maximo},
            )
        # O relógio entra pelo contexto para que o teste não dependa da data
        # em que roda: model_validate_json(corpo, context={"agora": ...}).
        agora = (info.context or {}).get("agora") or datetime.now(UTC)
        if self.medido_em > agora + TOLERANCIA_FUTURO:
            raise PydanticCustomError(
                "medido_em_no_futuro",
                "medido_em {medido_em} está no futuro além da tolerância",
                {"medido_em": self.medido_em.isoformat()},
            )
        return self

    def normalizar(self, cadastro: dict[str, dict[str, str]]) -> "LeituraNormalizada":
        """Converte para Celsius e UTC e enriquece com local e tipo_local."""
        sensor = cadastro[self.device_id]  # KeyError tratado em validar_lote
        return LeituraNormalizada(
            event_id=str(self.event_id),
            device_id=self.device_id,
            local=sensor["local"],
            tipo_local=sensor["tipo_local"],
            medido_em=self.medido_em.astimezone(UTC),
            temperatura_c=self.temperatura_c,
            umidade_pct=self.umidade,
        )


class LeituraNormalizada(BaseModel):
    """Linha pronta para iot.leituras (colunas da DDL da Aula 06)."""

    model_config = ConfigDict(extra="forbid", frozen=True)

    event_id: str
    device_id: str
    local: str
    tipo_local: str
    medido_em: AwareDatetime
    temperatura_c: float
    umidade_pct: Annotated[float, Field(ge=0, le=100)]


def motivo(erros: list[dict]) -> str:
    """Traduz o primeiro erro do Pydantic para o código de motivo da Aula 06."""
    erro = erros[0]
    campo = erro["loc"][0] if erro["loc"] else None
    if erro["type"] in ("temperatura_fora_da_faixa", "medido_em_no_futuro"):
        return erro["type"]
    if erro["type"] == "json_invalid":
        return "json_invalido"
    if erro["type"] == "missing":
        return "campo_ausente"
    if erro["type"] == "extra_forbidden":
        return "campo_desconhecido"
    if campo == "unidade_temperatura":
        return "unidade_desconhecida"
    if campo == "umidade" and erro["type"] in ("greater_than_equal", "less_than_equal"):
        return "umidade_fora_da_faixa"
    return "tipo_invalido"


def validar_lote(
    corpos: list[bytes],
    cadastro: dict[str, dict[str, str]],
    agora: datetime | None = None,
) -> tuple[list[LeituraNormalizada], list[dict]]:
    """Valida corpos de mensagem sem interromper o lote.

    Cada rejeição tem os campos de iot.leituras_rejeitadas (device_id,
    motivo, payload) mais a posição e os erros do Pydantic, para rastreio.
    """
    validas: list[LeituraNormalizada] = []
    rejeitadas: list[dict] = []
    for posicao, corpo in enumerate(corpos):
        try:
            bruta = LeituraBruta.model_validate_json(corpo, context={"agora": agora})
        except ValidationError as erro:
            erros = erro.errors(include_url=False, include_context=False)
            rejeitadas.append(_rejeicao(posicao, corpo, motivo(erros), erros))
            continue
        if bruta.device_id not in cadastro:
            rejeitadas.append(_rejeicao(posicao, corpo, "sensor_desconhecido", []))
            continue
        validas.append(bruta.normalizar(cadastro))
    return validas, rejeitadas


def _rejeicao(posicao: int, corpo: bytes, codigo: str, erros: list[dict]) -> dict:
    texto = corpo.decode("utf-8", errors="replace")
    device_id = ""
    try:
        device_id = str(json.loads(texto).get("device_id", ""))
    except (ValueError, AttributeError):
        pass
    return {"posicao": posicao, "device_id": device_id, "motivo": codigo,
            "payload": texto, "erros": erros}
