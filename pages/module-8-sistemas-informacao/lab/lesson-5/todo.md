# Preparação do computador da aula (Linux Mint)

Checklist para a Aula 5 de SI08 (quinta, 05/11/2026, 11:00 às 13:00). A aula constrói ao vivo, por prompts, a
camada Silver híbrida: enriquecimento em DuckDB, lake no RustFS e cópia tática no ClickHouse. Tudo roda offline
depois que as imagens e os pacotes estiverem baixados, exceto o agente de IA, que precisa de internet.

Os comandos valem para o Linux Mint 21 ou 22, que usam a base do Ubuntu 22.04 ou 24.04. Se o Docker já foi
instalado para a Aula 2 de ES08 (`remo-api/laboratorio/todo.md`), pule a primeira seção.

## Na véspera

- [ ] Docker Engine e plugin do Compose pelo repositório oficial da Docker (não o `docker.io` do Mint):

      sudo apt-get update
      sudo apt-get install -y ca-certificates curl git python3-venv python3-pip
      sudo install -m 0755 -d /etc/apt/keyrings
      sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
      sudo chmod a+r /etc/apt/keyrings/docker.asc
      echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$UBUNTU_CODENAME") stable" \
        | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
      sudo apt-get update
      sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
      sudo usermod -aG docker $USER      # encerrar a sessão e entrar de novo
      sudo systemctl enable --now docker
      docker compose version             # precisa ser v2

- [ ] Python 3.10 ou mais novo com venv: `python3 --version` e `python3 -m venv --help`. No Mint o venv vem do
      pacote `python3-venv`, instalado acima.
- [ ] Baixar as duas imagens com antecedência:

      docker pull rustfs/rustfs:1.0.4
      docker pull clickhouse/clickhouse-server:26.8.15.10

- [ ] Clonar ou atualizar o repositório das aulas e montar a pasta da aula:

      git clone https://github.com/afonsolelis/aulas.git ~/aulas || git -C ~/aulas pull
      rm -rf ~/lesson_05_dw
      cp -r ~/aulas/pages/module-8-sistemas-informacao/lab/lesson-5 ~/lesson_05_dw
      cd ~/lesson_05_dw
      mkdir -p specs docs/adr sql src tests/fixtures warehouse
      printf '.env\n.venv/\n__pycache__/\nwarehouse/\n' > .gitignore
      cp .env.example .env

- [ ] Trocar as duas senhas do `.env` (`S3_SECRET_KEY` e `CLICKHOUSE_PASSWORD`)
      por valores de `openssl rand -base64 24`, editando num editor fora da projeção.
- [ ] Criar o venv e instalar os pacotes com internet, para não depender da rede da sala:

      python3 -m venv .venv && source .venv/bin/activate
      pip install -r requirements.txt
      python -c "import duckdb, clickhouse_connect, pytz; print(duckdb.__version__)"

- [ ] Pré-instalar a extensão `httpfs` do DuckDB, que ele baixa na primeira leitura do S3:

      python -c "import duckdb; duckdb.sql('INSTALL httpfs')"

- [ ] Claude Code instalado e com login (`curl -fsSL https://claude.ai/install.sh | bash`, terminal novo,
      `cd ~/lesson_05_dw && claude`), aceitando a confiança na pasta.
- [ ] Portas 8123, 9000 e 9001 livres: `ss -ltn | grep -E ':(8123|9000|9001)\b'` não deve imprimir nada.

## Ensaio no computador da aula (recomendado, 20 min)

    cd ~/lesson_05_dw && source .venv/bin/activate
    docker compose up -d --wait
    python generate_bronze.py
    echo "@AGENTS.md" > CLAUDE.md
    claude          # rode os prompts das Etapas 01 a 04 (material, seção do laboratório)

Compare com os números de referência do `README.md` desta pasta (24.677 linhas depois da Etapa 02; 26.453 no lake
e 24.695 no ClickHouse depois da Etapa 03). As contagens têm de ser iguais; os tempos mudam com a máquina.

Depois do ensaio, volte ao estado inicial da aula:

    docker compose down -v
    rm -rf specs docs sql src tests warehouse CLAUDE.md
    mkdir -p specs docs/adr sql src tests/fixtures warehouse

## Na manhã da aula

- [ ] `docker compose up -d --wait` em `~/lesson_05_dw` e `docker compose ps` com os dois serviços `healthy`.
- [ ] `source .venv/bin/activate && python generate_bronze.py` (a Bronze de 14 dias já fica pronta antes da aula;
      o slide do ambiente mostra os comandos, mas não é preciso rodá-los ao vivo).
- [ ] `echo "@AGENTS.md" > CLAUDE.md`.
- [ ] Console do RustFS aberto em `http://localhost:9001/rustfs/console/` (a raiz da porta devolve 403), numa aba do
      navegador, para mostrar o lake. O login é o par `S3_ACCESS_KEY` e `S3_SECRET_KEY` do `.env`.
- [ ] Terminal com fonte grande (`Ctrl+Shift++`, pelo menos 18 pt) e Claude Code aberto em `~/lesson_05_dw`, em
      modo que pede confirmação antes de editar.
- [ ] Deck aberto: `https://afonsolelis.github.io/aulas/pages/module-8-sistemas-informacao/slides/slide-lesson-5.html`.
- [ ] Material aberto em outra aba, como reserva para copiar os prompts.
- [ ] Tela sem suspensão durante a aula (Menu → Gerenciamento de energia).

## Se algo falhar durante a aula

- **`permission denied` no Docker:** a sessão não recarregou o grupo; rode `newgrp docker` no terminal.
- **RustFS não fica `healthy` ou o login do console falha:** `docker compose logs rustfs`; o compose exige
  `S3_ACCESS_KEY` e `S3_SECRET_KEY` no `.env`, e o console fica em `/rustfs/console/`, não na raiz da porta 9001.
- **ClickHouse não fica `healthy`:** `docker compose logs clickhouse`; se faltar a senha, o `.env` está sem
  `CLICKHOUSE_PASSWORD`.
- **`ModuleNotFoundError: pytz`:** o venv não está ativo ou foi criado antes do `requirements.txt` atual.
- **Binder Error "does not have a column named lote" na Etapa 02:** o agente leu o CSV do fornecedor com
  `union_by_name` esperando a versão 2, que só chega na Etapa 03. É um bom exemplo para a turma; peça ao agente que
  acrescente as colunas ausentes.
- **Para recomeçar do zero:** `docker compose down -v && docker compose up -d --wait && python generate_bronze.py`.
- **Sem internet na sala:** o lab local funciona, mas o agente não. Siga pelo material e pelos números do `README.md`.

## Depois da aula

- [ ] `docker compose down -v` em `~/lesson_05_dw`.
- [ ] Guardar `docs/` e `sql/` gerados se quiser mostrá-los à turma na Aula 6.
