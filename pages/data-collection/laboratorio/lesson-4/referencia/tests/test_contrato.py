# Exemplos de envelope em laboratorio/fixtures/exemplos/ (a pasta acima de referencia/).
from pathlib import Path
import pytest
from src import contrato

EX = Path(__file__).resolve().parents[2] / "fixtures" / "exemplos"
DOM = frozenset({"telemetria", "livros", "ptax"})


@pytest.mark.parametrize("arq", sorted(EX.glob("valido_*")), ids=lambda p: p.name)
def test_validos(arq):
    tag, itens = contrato.validar(arq.read_bytes(), DOM)
    assert tag in DOM and itens and all(isinstance(i, dict) for i in itens)


@pytest.mark.parametrize("arq", sorted(EX.glob("invalido_*")), ids=lambda p: p.name)
def test_invalidos(arq):
    esperado = contrato.CorpoNaoJson if "_400_" in arq.name else contrato.EnvelopeInvalido
    with pytest.raises(esperado):
        contrato.validar(arq.read_bytes(), DOM)


def test_lista_vira_uma_linha_por_objeto():
    _, itens = contrato.validar(b'{"data_tag":"ptax","data":[{"a":1},{"a":2}]}', DOM)
    assert len(itens) == 2
