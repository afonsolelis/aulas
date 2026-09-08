---
name: criar-quiz
description: Procedimento para criar um quiz ao vivo (estilo Kahoot) de uma aula, derivando as questões do material de leitura, dos slides e dos autoestudos correspondentes. Cobre a redação das questões, o seed no Supabase, a auditoria de vícios que permitem acertar sem estudar, o teste ponta a ponta e a publicação. Use ao preparar quiz de qualquer encontro do acervo e ao revisar questões já existentes.
type: workflow
---

# criar-quiz

Cria o quiz ao vivo de um encontro. A sessão é conduzida pelo professor, os
estudantes respondem no próprio aparelho após entrar por código QR, e o
resultado alimenta um relatório que aponta o que a turma precisa retomar.

A infraestrutura já existe e **não se recria por aula**: tabelas, funções e
páginas estão em `supabase/quiz-schema.sql`, `supabase/quiz-funcoes.sql`,
`supabase/quiz-relatorio.sql` e `pages/module-7-sistemas-informacao/quiz/`. O
que cada aula exige é um seed próprio e, quando a navegação precisar apontar
para outra aula, uma cópia das páginas com os caminhos ajustados.

## 0. Como a sessão se comporta

| Comportamento | Onde está | Observação |
|---|---|---|
| Noventa segundos por questão | `segundos` em `quiz_questions` | Padrão da coluna; o seed declara o valor |
| A pergunta fecha sozinha ao fim do tempo | `quiz_fechar_expirada()` | Chamada no início de `quiz_estado` e `quiz_host`; a virada de `quiz_sessions` chega à turma pelo Realtime, e o resultado aparece sem comando do professor |
| Resposta após o prazo é recusada | `quiz_responder()` | Tolerância de um segundo, para a latência do aparelho |
| A última questão vale o dobro | `peso` em `quiz_questions` | O seed grava 2 na última; as páginas anunciam antes de a turma responder |
| Pódio no encerramento | páginas do painel e do estudante | Três degraus, o primeiro ao centro; do quarto em diante segue a lista |
| Perguntas publicadas para estudo | `publicado` em `quiz_sessions` | Alternado pelo painel; enquanto falso, `quiz_perguntas()` não devolve gabarito algum |

O gabarito comentado fica em `lesson-N-perguntas.html`, que só mostra conteúdo
depois de o professor publicar.

## 1. Identificar a aula

A fonte da verdade é `config/calendar.json`: localize o módulo ativo e a aula
cuja data corresponde ao encontro. Dela derivam o número da aula, o título e o
caminho dos arquivos.

```bash
python3 -c "
import json; from datetime import date
c=json.load(open('config/calendar.json')); hoje=date.today().strftime('%d/%m/%Y')
for m in c['active_modules']:
    for l in m['lessons']:
        if l['date']==hoje: print(m['id'], '| Aula', l['number'], '|', l['title'])
"
```

## 2. Ler as fontes — todas as três

As questões **derivam do material que o estudante recebeu**, nunca de
conhecimento geral sobre o assunto. Consulte, nesta ordem:

| Fonte | Caminho | Papel |
|---|---|---|
| Material de leitura | `pages/<módulo>/materials/lesson-N-material.html` | Fonte primária. Fornece o texto, as seções numeradas e as tabelas de onde saem enunciado e gabarito |
| Slides | `pages/<módulo>/slides/slide-lesson-N.html` | Indica o que foi efetivamente exposto e com que ênfase. Assunto ausente dos slides raramente cabe no quiz |
| Autoestudos | `pages/autoestudos/` | Não há vínculo formal com módulos; localize por tema em `index.json` (`type: autoestudo`). Quando houver um relacionado, ele amplia o repertório esperado |

Extraia o texto do HTML antes de redigir — ler o arquivo bruto desperdiça
contexto com marcação. Registre, para cada seção, o número e o título: eles
serão gravados na questão e sustentam o relatório.

## 3. Redigir as questões

**Cobrem aplicação, não recuperação.** Cada enunciado apresenta uma situação e
pede classificação, diagnóstico ou intervenção. "Segundo o material, o que é X?"
mede memória; "Dado este caso, como classificar e quem autoriza?" mede
compreensão.

**Os distratores reproduzem erros correntes da prática**, não alternativas
implausíveis. O distrator mais escolhido é o dado mais valioso do relatório:
ele revela a concepção equivocada que a aula seguinte precisa corrigir.

**Cobertura ampla do encontro.** Um quiz que só visita a metade técnica de uma
aula que trata de duas dimensões falseia o diagnóstico. Distribua as questões
entre as seções que o encontro efetivamente percorre.

**Cada questão declara `tema` e `secao`.** Sem isso o relatório conta acertos
mas não orienta o estudo, que é o propósito dele.

**Explicação com a razão, não com a letra.** A página já assinala a alternativa
correta e a escolha do estudante lado a lado; o texto deve dizer *por que*, e
citar a seção de origem.

### Vícios que reprovam

Dois atalhos permitem pontuar sem ler, e ambos surgem sozinhos quando se
redige a lista em sequência:

1. **Concentração da resposta correta em poucas letras.** Distribua entre A, B,
   C e D. Uma turma que percebe o padrão nas duas primeiras chuta o resto.
2. **Resposta correta sistematicamente mais longa.** Acontece porque a correta
   precisa ser completa e os distratores saem curtos. Encorpe os distratores
   até que a extensão não denuncie nada.

## 4. Escrever e aplicar o seed

Tome `supabase/quiz-seed-lesson-5.sql` como modelo. O arquivo é idempotente:
cria a sessão, apaga as questões anteriores daquele slug e insere as novas com
`tema` e `secao`.

### O token do professor

**O token é o mesmo em todas as salas.** O professor usa uma única passphrase
para entrar em qualquer painel do acervo; não se gera token novo por encontro.
O valor fica em `QUIZ_HOST_TOKEN` no `.env` da raiz — que o `.gitignore` já
ignora — e nunca em arquivo versionado: o repositório é público, e quem tem o
token abre, revela e reinicia a sessão.

**`quiz_host()` valida o par `(session_slug, token)`.** Um token cadastrado
numa sala não vale em outra. Toda sala nova precisa da sua linha em
`quiz_host_tokens`, ainda que o valor seja o mesmo — sem ela o painel recusa a
entrada com "Token do professor inválido.", que é o sintoma de sala sem token,
não de token errado. **Cadastrar o token é passo obrigatório da criação da
sala, logo após aplicar o seed:**

```bash
set -a; . ./.env; set +a
psql "$DATABASE_URL?sslmode=require" -v ON_ERROR_STOP=1 -c \
  "insert into quiz_host_tokens (session_slug, token)
   values ('<slug>', '$QUIZ_HOST_TOKEN')
   on conflict (session_slug) do update set token = excluded.token;"
```

Aplicação do seed pelo pooler (a conexão direta é IPv6 e não funciona nesta
máquina). `DATABASE_URL` já aponta para o pooler, na porta 6543 — trocar para
5432 quando o script tiver DDL, porque o transaction mode não serve para
migração. É o caso de `quiz-funcoes.sql`, que acrescenta colunas:

```bash
set -a; . ./.env; set +a
psql "$DATABASE_URL?sslmode=require" -v ON_ERROR_STOP=1 \
  -f supabase/quiz-seed-lesson-N.sql
```

Alternativa sem o `.env`: colar o conteúdo no SQL Editor do painel.

Conferir ao final, com a mesma chamada que a página do professor faz:

```bash
curl -s -X POST "$SUPABASE_URL/rest/v1/rpc/quiz_host" \
  -H "apikey: <chave publicável>" -H "Content-Type: application/json" \
  -d '{"p_slug":"<slug>","p_token":"'"$QUIZ_HOST_TOKEN"'","p_acao":"ver"}'
```

A ação `ver` é somente leitura: serve de teste sem mexer no estado da sala.

## 5. Auditar — obrigatório

```bash
QUIZ_TOKEN=<token> node scripts/auditar-quiz.mjs <slug>
```

Verifica distribuição do gabarito, viés de comprimento, uniformidade das
alternativas, presença de tema e seção e amplitude da cobertura. Sai com código
1 quando há problema que reprova. Corrija o seed e reaplique até passar.

## 6. Páginas

Para uma sala nova há dois caminhos:

- **Reusar as páginas existentes** com `?sala=<slug>`, quando os links de
  material, slides e plano da Aula 5 não atrapalharem.
- **Duplicar as três páginas** (`lesson-N-quiz.html`, `lesson-N-host.html`,
  `lesson-N-relatorio.html`) ajustando os caminhos relativos de navegação.

Ao duplicar pela segunda vez, extraia antes o CSS e o JS comuns para
`css/quiz.css` e `js/quiz-*.js`: hoje há nove tokens redefinidos e o bootstrap
do cliente repetido em cada página, e a terceira cópia consolida a dívida.

Toda página nova exige favicon SVG inline com emoji e entrada em `index.json`
com `type: ferramenta` — que a mantém fora da exigência de ficha de encontro.

## 7. Verificar antes da aula

Três ensaios, nesta ordem. Os dois primeiros reiniciam a sala ao terminar, de
modo que a turma não encontre jogadores de teste no placar.

```bash
npm test                                    # specs de filesystem, roda no pre-commit

set -a; . ./.env; set +a
node scripts/testar-quiz.mjs <slug>         # ciclo completo pelas RPCs

python3 -m http.server 8123 &               # o cliente do Supabase não roda em file://
node scripts/ensaio-quiz-navegador.mjs      # as páginas num navegador real
```

`testar-quiz.mjs` percorre entrada, resposta, expiração do tempo, pontuação da
questão de peso 2, encerramento e publicação, e confere que o gabarito não sai
do banco antes da hora. `ensaio-quiz-navegador.mjs` percorre as telas e
verifica o que só aparece no navegador: a virada automática para o resultado, o
selo da questão que vale o dobro, o enunciado presente na revelação, o pódio e
o transbordo do painel em 1024x768 — resolução do projetor da sala, em que
cada pergunta e cada revelação precisam caber sem rolagem.

A expiração é forçada recuando `aberta_em` por `psql`, para o ensaio não exigir
noventa segundos reais por questão.

Verifique ainda, à mão, que o QR aponta para a URL pública e não para
`127.0.0.1`.

## 8. Publicar

O seed não depende de deploy — vale no banco assim que aplicado. As páginas,
sim: publique pela skill `devops-push` e confirme o deploy antes do encontro.

## 9. Depois da aula

O relatório traz os temas por dificuldade, a distribuição por alternativa e o
desempenho individual, e exporta em CSV.

**Reiniciar arquiva antes de apagar.** As respostas vão para
`quiz_relatorios`, no grão de uma linha por estudante e questão, sob a
`data_tag` no padrão `ANO-TRIMESTRE-conteudo` — de onde qualquer agregação
pode ser refeita depois:

```sql
select l->>'tema' as tema, count(*) as respostas,
       round(100.0*count(*) filter (where (l->>'acertou')::bool)/count(*),1) as taxa
  from quiz_relatorios r, jsonb_array_elements(r.data) l
 where r.data_tag like '2026-2A-%'
 group by 1 order by 3;
```

A `data_tag` compõe-se do campo `turma` da sessão, que deve receber o código do
trimestre corrente de `config/calendar.json`, mais o slug da sala:

```sql
update quiz_sessions set turma = '2026-2A' where slug = '<slug>';
```

Sessão sem resposta não gera registro, para reinícios de teste não poluírem a
série histórica.

## Armadilhas conhecidas

- **Sessão encerrada não limpa nada.** Encerrar apenas muda o estado; só
  `reiniciar` apaga — arquivando antes em `quiz_relatorios`. Reusar uma sala
  sem reiniciar mistura turmas.
- **Reaplicar `quiz-schema.sql` derruba tudo** — começa com `drop table
  cascade`, o que leva junto sessão, token e questões. Para alterar a lógica de
  um banco em uso, aplique `quiz-funcoes.sql`.
- **Regra de componente vence o atributo `hidden`.** `display` declarado numa
  classe tem precedência sobre a folha do navegador, e um selo marcado como
  oculto continua na tela. As páginas do quiz trazem
  `[hidden] { display: none !important; }` por isso.
- **Corrida em teste automatizado:** aguarde a confirmação da resposta do
  estudante antes de revelar, ou o servidor recusa corretamente e o teste
  acusa falha inexistente.
- **`color-mix` computa como `color(srgb 0-1)`**, o que quebra medições de
  contraste que assumem `rgb(0-255)`.

## Referências

- `supabase/quiz-schema.sql` — tabelas, RLS e Realtime. O gabarito nunca chega
  ao cliente: as tabelas sensíveis têm RLS sem policy, e só `quiz_sessions` é
  legível, por não guardar segredo. **Começa por `drop table cascade`**: só se
  aplica a banco novo.
- `supabase/quiz-funcoes.sql` — as RPCs e as colunas de comportamento (`peso`,
  `publicado`). Idempotente e não destrutivo: é o arquivo a aplicar quando a
  lógica muda com a sala já criada.
- `supabase/quiz-relatorio.sql` — colunas `tema`/`secao` e a função de relatório.
- `supabase/quiz-ingestao.sql` — tabela de recepção e arquivamento no reinício.
- `scripts/auditar-quiz.mjs` — auditoria das questões.
- Skills `escrita-academica` e `revisar-escrita` — registro da redação.
