"""Layout do lake (Aula 03): chaves nome=valor, data em America/Sao_Paulo, raw com uma linha por envelope."""
import json
from src.lake import chave_manifesto, chaves, dia_e_hora, linha_raw, novo_lote


def test_data_da_particao_em_brasilia():
    # 31/10/2026 01:30 UTC ainda é 30/10/2026 22:30 em São Paulo
    assert dia_e_hora(1793410200000) == ("2026-10-30", "223000")


def test_chaves_raw_bronze_e_manifesto():
    c = chaves("lote_223000_abcd1234", "livros", "2026-10-30")
    assert c["raw"] == "ingestao/data_tag=livros/data=2026-10-30/lote_223000_abcd1234.jsonl"
    assert c["bronze"] == "ingestao/data_tag=livros/data=2026-10-30/lote_223000_abcd1234.parquet"
    assert chave_manifesto("lote_223000_abcd1234", "2026-10-30") == \
        "_manifestos/ingestao/data=2026-10-30/lote_223000_abcd1234.json"


def test_novo_lote_tem_hora_e_sufixo():
    lote = novo_lote(1793410200000)
    assert lote.startswith("lote_223000_") and len(lote) == len("lote_223000_") + 8


def test_linha_raw_guarda_o_envelope_em_uma_linha():
    corpo = b'{\n  "data_tag": "ptax",\r\n  "data": [{"a": "x y"}]\n}'
    linha = linha_raw(1793410200000, corpo)
    assert linha.endswith(b"\n") and linha.count(b"\n") == 1
    obj = json.loads(linha)
    assert obj["recebido_em_ms"] == 1793410200000
    assert obj["envelope"] == json.loads(corpo)
