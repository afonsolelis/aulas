"""Contrato do envelope: só a casca. O conteúdo de data não é validado aqui (Aula 07)."""
import json

CAMPOS = {"data_tag", "data"}


class EnvelopeInvalido(ValueError):
    pass


class CorpoNaoJson(EnvelopeInvalido):
    """O corpo nem chega a ser JSON: na API vira 400, não 422."""


def validar(corpo: bytes | str, dominios: frozenset[str]) -> tuple[str, list[dict]]:
    """Devolve (data_tag, lista de objetos) ou levanta EnvelopeInvalido com o motivo."""
    try:
        env = json.loads(corpo)
    except (ValueError, UnicodeDecodeError) as e:
        raise CorpoNaoJson(f"corpo não é JSON: {e}") from None
    if not isinstance(env, dict):
        raise EnvelopeInvalido("envelope precisa ser um objeto JSON")
    faltando = CAMPOS - env.keys()
    if faltando:
        raise EnvelopeInvalido(f"campos obrigatórios ausentes: {sorted(faltando)}")
    extras = env.keys() - CAMPOS
    if extras:
        raise EnvelopeInvalido(f"campos não permitidos no envelope: {sorted(extras)}")
    tag, data = env["data_tag"], env["data"]
    if not isinstance(tag, str) or tag not in dominios:
        raise EnvelopeInvalido(f"data_tag desconhecida: {tag!r}; aceitas: {sorted(dominios)}")
    if isinstance(data, dict):
        return tag, [data]
    if isinstance(data, list) and data and all(isinstance(i, dict) for i in data):
        return tag, data
    raise EnvelopeInvalido("data precisa ser um objeto ou uma lista não vazia de objetos")
