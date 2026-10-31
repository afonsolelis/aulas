#!/usr/bin/env python3
"""Gerador de lotes TXT de telemetria de caminhões (Aula 02 de Data Collection and Storage).

Simula o provedor de rastreamento por satélite: para cada caminhão e cada
janela de 15 minutos, escreve um lote de texto na pasta de pouso, que faz o
papel da pasta do SFTP onde o provedor deixaria os arquivos.

    python gerar_lotes.py                                  # última hora completa, 20 caminhões
    python gerar_lotes.py --inicio 2026-10-17T09:00 --horas 2
    python gerar_lotes.py --inicio 2027-03-02T08:00        # depois do firmware novo (TEMP_BAU)

Nome do arquivo: pouso/CAM-XXXX_AAAAMMDDTHHMM.txt (início da janela, horário de Brasília).

Cada lote tem 15 linhas de posição, uma por minuto, misturadas com eventos,
em cinco formatos:

  1. CAM-0412|17/10/26 09:14:03|-23.5481,-46.6390|VEL 087|TAC MOT 03h12
  2. #RADIO 09:14 MOTORISTA: parada posto km 214 BR-116
  3. CAM-0412 17-10-2026 09:15:03 GPS -23.5502 -46.6411 v=85   (firmware novo: + " TEMP_BAU 04.2")
  4. ERR SAT SINAL FRACO
  5. TAC;CAM-0977;20261017T091500;DIRECAO CONTINUA 05:31;ALERTA

Só biblioteca padrão. Determinístico: o conteúdo de cada lote depende apenas
de --seed, do caminhão e da janela, de modo que gerar a mesma janela de novo
produz os mesmos bytes, e gerar duas horas de uma vez ou uma hora por vez dá
o mesmo resultado. Encoding UTF-8, fim de linha "\\n".
"""

from __future__ import annotations

import argparse
import math
import random
import sys
from datetime import date, datetime, timedelta, timezone
from pathlib import Path

try:
    from zoneinfo import ZoneInfo

    FUSO = ZoneInfo("America/Sao_Paulo")
except Exception:  # sem base de fusos (Windows sem tzdata): Brasília não tem horário de verão desde 2019
    FUSO = timezone(timedelta(hours=-3), "BRT")

JANELA_MIN = 15
REFERENCIA = datetime(2026, 1, 1, tzinfo=timezone.utc)  # origem fixa dos ciclos de direção

# Trechos de rodovia (latitude, longitude, rumo em graus, nome) onde os caminhões circulam.
TRECHOS = [
    (-23.5481, -46.6390, 225, "BR-116"),  # São Paulo, sentido Curitiba
    (-23.4205, -46.4986, 60, "BR-116"),   # São Paulo, sentido Rio de Janeiro
    (-22.9056, -47.0608, 330, "SP-330"),  # Campinas, sentido Ribeirão Preto
    (-25.4284, -49.2733, 200, "BR-376"),  # Curitiba, sentido Joinville
    (-19.9167, -43.9345, 160, "BR-381"),  # Belo Horizonte, sentido Vale do Aço
    (-16.6869, -49.2648, 20, "BR-153"),   # Goiânia, sentido Anápolis
    (-12.9714, -38.5014, 300, "BR-324"),  # Salvador, sentido Feira de Santana
    (-30.0346, -51.2177, 260, "BR-290"),  # Porto Alegre, sentido Uruguaiana
]

MENSAGENS_RADIO = [
    "MOTORISTA: parada posto km {km} {br}",
    "MOTORISTA: abastecimento km {km} {br}",
    "MOTORISTA: trânsito lento km {km} {br}",
    "MOTORISTA: chegada no pátio do cliente",
    "MOTORISTA: início de descanso",
    "CENTRAL: confirmar entrega nota {nota}",
    "CENTRAL: desvio por obra km {km} {br}",
]

ERRO_ENLACE = "ERR SAT SINAL FRACO"


def ler_argumentos(argv: list[str] | None = None) -> argparse.Namespace:
    p = argparse.ArgumentParser(description="Gera lotes TXT de telemetria de caminhões na pasta de pouso.")
    p.add_argument("--caminhoes", type=int, default=20, help="quantidade de caminhões (padrão 20)")
    p.add_argument(
        "--inicio",
        help="início da geração, ISO no horário de Brasília, múltiplo de 15 min "
        "(padrão: a última hora completa, por exemplo 09:00 se agora são 10:37)",
    )
    p.add_argument("--horas", type=int, default=1, help="quantas horas gerar (padrão 1)")
    p.add_argument("--saida", default="pouso", help="pasta de pouso (padrão pouso/)")
    p.add_argument("--seed", type=int, default=42, help="semente (padrão 42)")
    p.add_argument(
        "--firmware-novo",
        default="2027-03-01",
        help="data (AAAA-MM-DD) a partir da qual parte da frota acrescenta TEMP_BAU ao formato 3 (padrão 2027-03-01)",
    )
    return p.parse_args(argv)


def resolver_inicio(texto: str | None) -> datetime:
    if texto is None:
        agora = datetime.now(FUSO).replace(minute=0, second=0, microsecond=0)
        return agora - timedelta(hours=1)
    try:
        inicio = datetime.fromisoformat(texto)
    except ValueError:
        raise SystemExit(f"--inicio inválido: {texto!r}. Use, por exemplo, 2026-10-17T09:00")
    if inicio.tzinfo is None:
        inicio = inicio.replace(tzinfo=FUSO)
    else:
        inicio = inicio.astimezone(FUSO)
    if inicio.minute % JANELA_MIN or inicio.second or inicio.microsecond:
        raise SystemExit("--inicio precisa cair numa janela de 15 minutos (minuto 00, 15, 30 ou 45)")
    return inicio


def frota(seed: int, quantidade: int) -> list[str]:
    """Identificadores estáveis: os N primeiros de uma permutação fixa pela semente."""
    if not 1 <= quantidade <= 9999:
        raise SystemExit("--caminhoes precisa estar entre 1 e 9999")
    numeros = list(range(1, 10000))
    random.Random(f"frota:{seed}").shuffle(numeros)
    return sorted(f"CAM-{n:04d}" for n in numeros[:quantidade])


def perfil(seed: int, caminhao: str) -> dict:
    """Características fixas de um caminhão, derivadas só da semente e do identificador."""
    r = random.Random(f"perfil:{seed}:{caminhao}")
    lat, lon, rumo, br = r.choice(TRECHOS)
    return {
        "lat": lat + r.uniform(-0.05, 0.05),
        "lon": lon + r.uniform(-0.05, 0.05),
        "rumo": math.radians(rumo + r.uniform(-15, 15)),
        "br": br,
        "km_base": r.randint(20, 600),
        "segundo": r.randint(0, 59),                 # segundo fixo em que o equipamento registra
        "conducao": r.randint(240, 380),             # minutos dirigindo antes de parar
        "pausa": r.randint(30, 45),                  # minutos parado
        "fase": r.randint(0, 600),                   # deslocamento do ciclo em relação à referência
        "firmware_novo": r.random() < 0.3,           # parte da frota recebe o firmware com TEMP_BAU
        "temp_bau": r.uniform(2.0, 7.0),             # baú refrigerado, em graus Celsius
    }


def estado_no_minuto(p: dict, instante: datetime) -> tuple[bool, int, float]:
    """(dirigindo, minutos de direção contínua, km percorridos no trecho) num instante."""
    minuto = int((instante - REFERENCIA).total_seconds() // 60) + p["fase"]
    ciclo = p["conducao"] + p["pausa"]
    no_ciclo = minuto % ciclo
    dirigindo = no_ciclo < p["conducao"]
    continuo = no_ciclo + 1 if dirigindo else 0
    # Minutos efetivamente dirigidos: parado, o caminhão não sai do lugar.
    rodados = (minuto // ciclo) * p["conducao"] + min(no_ciclo, p["conducao"])
    # Vai e volta num trecho de 300 km a cerca de 75 km/h: onda triangular com período de 8 h.
    t = (rodados % 480) / 480
    km = 300 * (2 * t if t < 0.5 else 2 - 2 * t)
    return dirigindo, continuo, km


def hhmm(minutos: int, sep: str) -> str:
    return f"{minutos // 60:02d}{sep}{minutos % 60:02d}"


def gerar_lote(seed: int, caminhao: str, janela: datetime, firmware_desde: date) -> str:
    """Texto de um lote: depende só de (seed, caminhão, janela)."""
    p = perfil(seed, caminhao)
    r = random.Random(f"lote:{seed}:{caminhao}:{janela.strftime('%Y%m%dT%H%M')}")
    com_temp = p["firmware_novo"] and janela.date() >= firmware_desde

    # Eventos da janela, sorteados antes das posições: em que minuto entram.
    radios = r.choices([0, 1, 2], weights=[40, 45, 15])[0]
    erros = r.choices([0, 1, 2], weights=[60, 30, 10])[0]
    minutos_radio = sorted(r.sample(range(JANELA_MIN), radios))
    minutos_erro = sorted(r.sample(range(JANELA_MIN), erros))

    linhas: list[str] = []
    alerta_emitido = False
    for m in range(JANELA_MIN):
        instante = janela + timedelta(minutes=m, seconds=p["segundo"])
        dirigindo, continuo, km = estado_no_minuto(p, instante.astimezone(timezone.utc))
        lat = p["lat"] + km * 0.009 * math.cos(p["rumo"]) + r.uniform(-0.0004, 0.0004)
        lon = p["lon"] + km * 0.009 * math.sin(p["rumo"]) + r.uniform(-0.0004, 0.0004)
        vel = r.randint(62, 96) if dirigindo else 0

        if r.random() < 0.22:  # formato 3, equipamento com firmware de outra geração
            linha = (
                f"{caminhao} {instante:%d-%m-%Y %H:%M:%S} GPS {lat:.4f} {lon:.4f} v={vel}"
            )
            if com_temp:
                linha += f" TEMP_BAU {p['temp_bau'] + r.uniform(-0.6, 0.6):04.1f}"
        else:  # formato 1
            linha = (
                f"{caminhao}|{instante:%d/%m/%y %H:%M:%S}|{lat:.4f},{lon:.4f}"
                f"|VEL {vel:03d}|TAC MOT {hhmm(continuo, 'h')}"
            )
        linhas.append(linha)

        if continuo > 330 and not alerta_emitido:  # mais de 5h30 de direção contínua
            marca = (janela + timedelta(minutes=m)).strftime("%Y%m%dT%H%M00")
            linhas.append(f"TAC;{caminhao};{marca};DIRECAO CONTINUA {hhmm(continuo, ':')};ALERTA")
            alerta_emitido = True

        for _ in range(minutos_radio.count(m)):
            texto = r.choice(MENSAGENS_RADIO).format(
                km=p["km_base"] + int(km), br=p["br"], nota=r.randint(10000, 99999)
            )
            linhas.append(f"#RADIO {janela + timedelta(minutes=m):%H:%M} {texto}")
        for _ in range(minutos_erro.count(m)):
            linhas.append(ERRO_ENLACE)

    return "\n".join(linhas) + "\n"


def main(argv: list[str] | None = None) -> int:
    args = ler_argumentos(argv)
    inicio = resolver_inicio(args.inicio)
    try:
        firmware_desde = date.fromisoformat(args.firmware_novo)
    except ValueError:
        raise SystemExit("--firmware-novo precisa estar no formato AAAA-MM-DD")
    if args.horas < 1:
        raise SystemExit("--horas precisa ser pelo menos 1")

    saida = Path(args.saida)
    saida.mkdir(parents=True, exist_ok=True)
    caminhoes = frota(args.seed, args.caminhoes)
    janelas = [inicio + timedelta(minutes=JANELA_MIN * i) for i in range(args.horas * 60 // JANELA_MIN)]

    total_bytes = 0
    for janela in janelas:
        for cam in caminhoes:
            conteudo = gerar_lote(args.seed, cam, janela, firmware_desde).encode("utf-8")
            destino = saida / f"{cam}_{janela:%Y%m%dT%H%M}.txt"
            destino.write_bytes(conteudo)
            total_bytes += len(conteudo)

    n = len(janelas) * len(caminhoes)
    fim = janelas[-1] + timedelta(minutes=JANELA_MIN)
    print(
        f"{n} lotes em {saida}/ ({len(caminhoes)} caminhões x {len(janelas)} janelas), "
        f"{inicio:%d/%m/%Y %H:%M} a {fim:%H:%M} (Brasília), {total_bytes} bytes, "
        f"média {total_bytes / n:.0f} bytes por lote"
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
