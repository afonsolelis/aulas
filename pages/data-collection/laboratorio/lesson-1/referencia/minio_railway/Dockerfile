# MinIO do grupo no Railway (Aula 01 - Data Collection and Storage)
#
# Imagem mantida pela coolLabs, construída a partir das releases oficiais do
# MinIO. A edição comunitária do MinIO entrou em modo de manutenção em dez/2025
# e deixou de publicar imagens Docker oficiais. A tag é fixada (ADR-001):
# nunca use "latest" neste projeto.
FROM ghcr.io/coollabsio/minio:RELEASE.2025-10-15T17-29-55Z

# 9000 = API compatível com S3 (publicada com `railway domain --port 9000`)
# 9001 = console web (não publicado no Railway; use o console local, ADR-002)
EXPOSE 9000 9001

# O volume do Railway deve estar montado em /data (`railway volume add --mount-path /data`).
# MINIO_ROOT_USER e MINIO_ROOT_PASSWORD vêm das variáveis do serviço no Railway,
# nunca deste arquivo.
CMD ["server", "/data", "--console-address", ":9001"]
