---
name: criar-quiz
description: Procedimento para criar um quiz ao vivo (estilo Kahoot) de uma aula, derivando as questões do material de leitura, dos slides e dos autoestudos correspondentes. Cobre a redação das questões, o seed no Supabase, a auditoria de vícios que permitem acertar sem estudar, o teste ponta a ponta e a publicação. Use ao preparar quiz de qualquer encontro do acervo e ao revisar questões já existentes.
type: workflow
---

# criar-quiz

Cria o quiz ao vivo de um encontro. A sessão é conduzida pelo professor, os
estudantes respondem no próprio aparelho após entrar por código QR, e o
resultado alimenta um relatório que aponta o que a turma precisa retomar.

A infraestrutura já existe e **não se recria por aula**: esquema, funções e
páginas estão em `supabase/quiz-schema.sql`, `supabase/quiz-relatorio.sql` e
`pages/module-7-sistemas-informacao/quiz/`. O que cada aula exige é um seed
próprio e, quando a navegação precisar apontar para outra aula, uma cópia das
páginas com os caminhos ajustados.

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

**O token do professor não vai para o arquivo** — o repositório é público, e
quem tem o token abre, revela e reinicia a sessão. Defina-o à parte:

```sql
insert into quiz_host_tokens (session_slug, token) values ('<slug>', '<token>')
on conflict (session_slug) do update set token = excluded.token;
```

Aplicação pelo pooler (a conexão direta é IPv6 e não funciona nesta máquina):

```bash
PGPASSWORD='<senha>' psql \
  "postgresql://postgres.<ref>@aws-0-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require" \
  -v ON_ERROR_STOP=1 -f supabase/quiz-seed-lesson-N.sql
```

Alternativa sem senha: colar o conteúdo no SQL Editor do painel.

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

```bash
npm test                          # specs de filesystem, roda no pre-commit
```

E um ensaio ponta a ponta com dois navegadores — professor e estudante —
percorrendo todas as questões, conferindo o gabarito exibido, o placar e o
encerramento. Verifique especificamente:

- o QR aponta para a URL pública, não para `127.0.0.1`;
- os controles do painel ficam visíveis em 1024x768, resolução comum de projetor;
- a revelação mostra enunciado, escolha do estudante e alternativa correta.

**Limpe a sala ao terminar os testes** (`reiniciar` pelo painel ou pela RPC),
para a turma não encontrar jogadores de teste no placar.

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
  cascade`, o que leva junto sessão, token e questões.
- **Corrida em teste automatizado:** aguarde a confirmação da resposta do
  estudante antes de revelar, ou o servidor recusa corretamente e o teste
  acusa falha inexistente.
- **`color-mix` computa como `color(srgb 0-1)`**, o que quebra medições de
  contraste que assumem `rgb(0-255)`.

## Referências

- `supabase/quiz-schema.sql` — tabelas, RLS e funções. O gabarito nunca chega
  ao cliente: as tabelas sensíveis têm RLS sem policy, e só `quiz_sessions` é
  legível, por não guardar segredo.
- `supabase/quiz-relatorio.sql` — colunas `tema`/`secao` e a função de relatório.
- `supabase/quiz-ingestao.sql` — tabela de recepção e arquivamento no reinício.
- `scripts/auditar-quiz.mjs` — auditoria das questões.
- Skills `escrita-academica` e `revisar-escrita` — registro da redação.
