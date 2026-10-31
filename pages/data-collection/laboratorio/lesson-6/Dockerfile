# Imagem única para os processos Python do mini projeto IoT.
# Cada serviço do Railway usa esta mesma imagem e escolhe o processo
# pela variável PROCESSO (simulador, transformador, armazenador ou
# transformador_armazenador, se o grupo juntar os dois).
#
# Espera a estrutura: requirements.txt na raiz e src/<PROCESSO>.py
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY src/ ./src/

CMD ["sh", "-c", "exec python -m src.${PROCESSO:?defina PROCESSO}"]
