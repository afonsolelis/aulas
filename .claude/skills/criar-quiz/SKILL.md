---
name: criar-quiz
description: Procedimento para criar um quiz ao vivo (estilo Kahoot) de uma aula, derivando as questões do material de leitura, dos slides e dos autoestudos correspondentes. Cobre a redação das questões, os dados da sala para a plataforma aulas-projeto, a revisão dos vícios que permitem acertar sem estudar, a verificação e a publicação. Use ao preparar quiz de qualquer encontro do acervo e ao revisar questões já existentes.
type: workflow
---

# criar-quiz

Cria o quiz ao vivo de um encontro. A sessão é conduzida pelo professor, os
estudantes respondem no próprio aparelho após entrar por código QR, e o
resultado alimenta um relatório que aponta o que a turma precisa retomar.

A infraestrutura já existe e **não se recria por aula**. O banco e as funções
do quiz moram na plataforma `aulas-projeto` (FastAPI + MongoDB,
`app/rpc/inteli_quiz.py`), que serve as páginas deste repositório em
`/inteli/<caminho>`; as páginas estão em
`pages/module-7-sistemas-informacao/quiz/`. O que cada aula exige são as
questões da sala e, quando a navegação precisar apontar para outra aula, uma
cópia das páginas com os caminhos ajustados.

O Supabase foi desligado. Os arquivos `supabase/*.sql` são histórico somente
leitura (`supabase/README.md`): servem de modelo de formato, mas não se
aplicam mais em lugar nenhum.

## 0. Como a sessão se comporta

| Comportamento | Onde está | Observação |
|---|---|---|
| Noventa segundos por questão, calibráveis | `segundos` da questão; `quiz_tempo()` | A sala nasce com 90. O campo **Tempo** do painel (10 a 600 s) chama `quiz_tempo`, que troca o valor de todas as questões da sala. Só entre perguntas (com pergunta aberta o servidor recusa) e persiste no Reiniciar |
| A pergunta fecha sozinha ao fim do tempo | `quiz_fechar_expirada()` | Chamada no início de `quiz_estado` e `quiz_host`; a virada de `quiz_sessions` chega à turma pelo WebSocket de eventos, e o resultado aparece sem comando do professor |
| Resposta após o prazo é recusada | `quiz_responder()` | Tolerância de um segundo, para a latência do aparelho |
| A última questão vale o dobro | `peso` da questão | A última tem peso 2; as páginas anunciam antes de a turma responder |
| Pódio no encerramento | páginas do painel e do estudante | Três degraus, o primeiro ao centro; do quarto em diante segue a lista |
| Perguntas publicadas para estudo | `publicado` da sala | Alternado pelo painel; enquanto falso, `quiz_perguntas()` não devolve gabarito algum |

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

## 4. Registrar as questões e pedir a sala

O conteúdo das questões fica neste repositório, como sempre. Tome
`supabase/quiz-seed-lesson-5.sql` como modelo do formato: sessão (slug,
título) e, por questão, enunciado, quatro alternativas, gabarito, explicação,
`tema`, `secao`, `segundos` (90) e `peso` (2 na última).

**A sala é criada no banco do `aulas-projeto`.** Ainda não há comando para
carregar sala nova (README de lá, "Ainda falta: criar sala nova"). Entregue os
dados da sala ao mantenedor da plataforma e espere a confirmação de que ela
existe antes de publicar as páginas. Não há mais `psql`, `DATABASE_URL` nem
SQL Editor neste fluxo.

### O token do professor

**O token é o mesmo em todas as salas** (DEC-002 do `aulas-projeto`). O
professor usa uma única passphrase para entrar em qualquer painel do acervo;
não se gera token novo por encontro. A plataforma guarda só o hash, e salas
novas usam o mesmo token por padrão. O valor nunca vai para arquivo
versionado: o repositório é público, e quem tem o token abre, revela e
reinicia a sessão. Se o painel recusar com "Token do professor inválido." numa
sala nova, confira com o mantenedor se a sala foi carregada com o token.

## 5. Revisar as questões — obrigatório

Antes de entregar a sala, confira à mão, sobre o texto das questões, o que a
seção 3 exige: distribuição do gabarito entre A, B, C e D, comprimento das
corretas contra o dos distratores, `tema` e `secao` em todas e cobertura das
seções do encontro. Corrija até passar.

## 6. Páginas

Para uma sala nova há dois caminhos:

- **Reusar as páginas existentes** com `?sala=<slug>`, quando os links de
  material, slides e plano da Aula 5 não atrapalharem.
- **Duplicar as três páginas** (`lesson-N-quiz.html`, `lesson-N-host.html`,
  `lesson-N-relatorio.html`) ajustando os caminhos relativos de navegação.

Toda página que fala com a plataforma carrega o cliente dela e não leva URL
nem chave de banco:

```html
<script src="/_app/aulas.js"></script>
<script>
  const db = aulas.cliente();
  const { data, error } = await db.rpc('quiz_estado', { p_slug: SLUG, p_player: eu });
  if (error) throw new Error(error.message);
</script>
```

`db.rpc(fn, args)` faz `POST /inteli/api/{fn}`; recusa chega como `error`
(HTTP 4xx/5xx com `{erro, codigo, message}`). A atualização ao vivo usa
`db.channel(...).on('postgres_changes', { event: 'UPDATE', schema: 'public',
table: 'quiz_sessions', filter: 'slug=eq.' + SLUG }, cb).subscribe()`, que
corre pelo WebSocket `/inteli/api/eventos`. O contrato completo está no ADR-18
do `aulas-projeto`.

Ao duplicar pela segunda vez, extraia antes o CSS e o JS comuns para
`css/quiz.css` e `js/quiz-*.js`: hoje há nove tokens redefinidos e o bootstrap
do cliente repetido em cada página, e a terceira cópia consolida a dívida.

Toda página nova exige favicon SVG inline com emoji e entrada em `index.json`
com `type: ferramenta` — que a mantém fora da exigência de ficha de encontro.

## 7. Verificar antes da aula

```bash
npm test                                    # specs deste repositório, roda no pre-commit
```

As páginas não funcionam por `file://` nem por `http.server` local: dependem
de `/_app/aulas.js` e de `/inteli/api/`, que só a plataforma serve. O ensaio
real é feito com o `aulas-projeto` rodando (README de lá), abrindo
`/inteli/pages/<módulo>/quiz/...` e percorrendo entrada, resposta, expiração do
tempo, questão de peso 2, pódio, publicação e o transbordo do painel em
1024x768 — resolução do projetor da sala, em que cada pergunta e cada
revelação precisam caber sem rolagem. Os testes ponta a ponta das páginas
contra a plataforma ficam em `aulas-projeto/e2e/`. Reinicie a sala ao
terminar, para a turma não encontrar jogadores de teste no placar.

Verifique ainda, à mão, que o QR aponta para a URL pública e não para
`127.0.0.1`.

## 8. Publicar

A sala vale assim que o mantenedor a carrega na plataforma. As páginas
dependem de deploy: publique pela skill `devops-push` e confirme o deploy
antes do encontro.

## 9. Depois da aula

O relatório traz os temas por dificuldade, a distribuição por alternativa e o
desempenho individual, e exporta em CSV.

**Reiniciar arquiva antes de apagar.** As respostas vão para
`quiz_relatorios`, no banco da plataforma, no grão de uma linha por
estudante e questão, sob a `data_tag` no padrão `ANO-TRIMESTRE-conteudo` — de
onde qualquer agregação pode ser refeita depois.

A `data_tag` compõe-se do campo `turma` da sala, que deve receber o código do
trimestre corrente de `config/calendar.json`, mais o slug da sala. Informe o
trimestre ao mantenedor junto com os dados da sala.

Sessão sem resposta não gera registro, para reinícios de teste não poluírem a
série histórica.

## Armadilhas conhecidas

- **Sessão encerrada não limpa nada.** Encerrar apenas muda o estado; só
  `reiniciar` apaga — arquivando antes em `quiz_relatorios`. Reusar uma sala
  sem reiniciar mistura turmas.
- **Mudar um `supabase/*.sql` não muda a sala.** Esses arquivos são
  histórico; a sala vive no banco do `aulas-projeto`.
- **Página aberta por `file://` não conecta.** O cliente `/_app/aulas.js` e a
  API `/inteli/api/` só existem na plataforma.
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

- `aulas-projeto/app/rpc/inteli_quiz.py` — as funções do quiz (`quiz_entrar`,
  `quiz_estado`, `quiz_host`, `quiz_responder`, `quiz_tempo`,
  `quiz_perguntas`, `quiz_relatorio`) e o arquivamento em `quiz_relatorios`.
- `aulas-projeto/app/static/aulas.js` e o ADR-18 de lá — o cliente e o
  contrato das páginas.
- `supabase/quiz-seed-lesson-5.sql` — modelo do formato das questões
  (histórico, não se aplica).
- `supabase/README.md` — por que a pasta `supabase/` ficou só como histórico.
- Skills `escrita-academica` e `revisar-escrita` — registro da redação.
