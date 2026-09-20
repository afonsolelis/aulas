---
name: revisar-escrita
description: Procedimento de revisão que retira de um texto já escrito as construções retóricas de rede social — antítese "não é X, é Y", punch line com travessão, tricolon publicitário, aforismo, slogan — e as reescreve como proposições afirmativas em registro acadêmico. Use ao revisar slides, materiais, planos, autoestudos, READMEs e mensagens de commit, e sempre que o texto tiver sido gerado por IA. Complementa a skill escrita-academica, que define o padrão; esta define como auditá-lo.
type: reference
---

# Revisar Escrita

A skill [`escrita-academica`](../escrita-academica/SKILL.md) define **o padrão**. Esta
define **o procedimento de auditoria**: como encontrar, no texto já escrito, as construções
que violam esse padrão, e como reescrevê-las.

O alvo não é a negação — que é legítima e frequente em texto técnico ("dado não
estruturado", "escrita não atômica", "requisito não funcional"). O alvo é a **figura
retórica usada para produzir efeito**, que desloca a autoridade do argumento para o tom.

## As oito construções proscritas

### 1. Antítese corretiva — "não é X, é Y"

A forma mais comum e a mais nociva. Constrói a afirmação negando primeiro uma proposição
que ninguém defendeu, para depois afirmar a verdadeira. O leitor processa duas ideias para
receber uma.

| Proscrito | Prescrito |
|---|---|
| "Objeto não é arquivo." | "Modelo de objetos: namespace plano e escrita imutável." |
| "O bucket entrega durabilidade, não organização." | "O serviço garante durabilidade; a organização cabe ao projeto." |
| "Tiering é regra automática, não faxina manual." | "A transição entre classes é definida como regra automática." |
| "Uma alteração que muda a resposta não é otimização, é defeito." | "Alteração de layout que modifica a resposta constitui defeito." |
| "Inferência não é declaração." | "A inferência automática exige verificação." |
| "Bytes lidos, não." | "Os bytes lidos refletem a estrutura física do dado." |

**Regra:** afirme o que a coisa é. Quando o contraste for parte do conteúdo, use dois
predicados afirmativos em paralelo ("A garante X; B responde por Y").

### 2. Punch line com travessão

O travessão que suspende a frase para entregar um remate. Distinto do travessão que isola
aposto ou inciso, que permanece correto.

| Proscrito | Prescrito |
|---|---|
| "É uma escolha de negócio — e ela muda as três respostas." | "Trata-se de escolha de negócio, com efeito direto sobre as três respostas." |
| "A verificação é engenharia — e é ela que separa o correto do plausível." | "A verificação permanece atribuição do grupo e determina a correção do resultado." |

### 3. Tricolon publicitário

Três termos em ritmo crescente ou decrescente, com função de slogan.

| Proscrito | Prescrito |
|---|---|
| "Um binário, um arquivo, nenhum servidor." | "O motor roda no próprio processo e lê os arquivos do disco." |
| "Pequeno o bastante para caber, sujo o bastante para ensinar." | "O conjunto cabe em qualquer máquina da sala e contém chave repetida, data nula e evento fora de ordem." |

### 4. Aforismo e sentença de efeito

Frase que se pretende memorável e, por isso, abre mão da precisão.

| Proscrito | Prescrito |
|---|---|
| "Sem número anotado, a decisão vira opinião." | "O registro das medidas antes e depois da alteração sustenta a decisão." |
| "Nada é corrigido aqui." | "A camada preserva o conteúdo de origem." |
| "O grão decide tudo." | "O grão do fato determina o nível de agregação disponível." |

### 5. Interpelação do leitor

Segunda pessoa em tom de conversa, pergunta retórica, exclamação. O imperativo técnico de
um checklist ("Declare o fator de replicação") é legítimo e permanece.

| Proscrito | Prescrito |
|---|---|
| "Sabe o que acontece quando um nó cai?" | "A queda de um nó produz os seguintes efeitos:" |
| "Por que MinIO e não uma pasta local:" | "Justificativa do MinIO:" |

### 6. Hipérbole e metáfora de venda

"Revolucionário", "poderosíssimo", "quebra tudo", "mata a performance", "é dinheiro".
Substituir pelo termo técnico e pela magnitude medida.

### 7. Fechamento comentado

O bloco termina com uma frase que comenta o que acabou de ser dito, sem acrescentar
informação. Aparece em callout de slide, em fim de seção e em fim de parágrafo, e é a
construção mais frequente em texto gerado por modelo de linguagem. Reconhece-se pelas
fórmulas "é o que permite", "é o que sustenta", "é o que distingue", "é ela que", "é por
isso que".

| Proscrito | Prescrito |
|---|---|
| "A exigência de citar o trecho literal é o que permite conferir a classificação sem reler a menção inteira." | "Com o trecho citado, a conferência se faz por amostra: sorteia-se a linha, lê-se o trecho e compara-se com o post de origem." |
| "O último item é o que distingue uma instrução utilizável de uma demonstração." | "Instruções sem tratamento para o caso fora do padrão falham na primeira entrada que não se encaixa." |
| "É esse documento que abre a live de encerramento do ciclo." | "A live de encerramento começa pela leitura das cartas de aplicação da turma." |

**Regra:** se a frase final apenas qualifica a anterior, corte-a. Se houver consequência
nova, enuncie a consequência.

### 8. Paralelismo especular

Duas sentenças com a mesma estrutura sintática, invertendo ou espelhando os termos. Produz
simetria agradável e informação redundante.

| Proscrito | Prescrito |
|---|---|
| "Uma solução com falhas conhecidas e declaradas é utilizável sob supervisão. Uma solução sem falhas declaradas apenas ainda não foi testada o suficiente." | "A solução opera sob supervisão humana, e as três falhas acima são as que o teste já identificou. Outras aparecerão conforme o volume de menções aumentar." |
| "O certificado atesta que você construiu. O selo atesta que você aplicou." | "O certificado é emitido ao final do dia, mediante a entrega do assistente e do fluxo documentado. O selo depende do Check de Aplicação, trinta dias depois." |
| "Prompt é meio, não fim." | "A instrução da Gem é um dos componentes da solução, ao lado do insumo, dos arquivos de critério e do formato de saída." |

**Regra:** quando as duas metades disserem a mesma coisa em ordem invertida, escreva uma só
e acrescente o dado que falta — prazo, condição, magnitude ou responsável.

## Sinais de texto gerado por modelo

Além das oito construções, três marcas rítmicas denunciam o texto não revisado. Nenhuma é
defeito isoladamente; a concentração das três é.

1. **Monotonia de período.** Sentenças de comprimento semelhante, em sequência, sem
   subordinação. A prosa autoral alterna período longo explicativo com afirmação curta.
2. **Simetria de série.** Listas cujos itens têm a mesma extensão e a mesma estrutura
   sintática, quase sempre em três. Séries reais têm itens desiguais.
3. **Comentário em vez de conectivo.** Frases justapostas sem "porque", "quando", "ao passo
   que", "visto que", substituídas por uma terceira frase que explica a relação.

A amostra de prosa autoral está em
[`escrita-afonso/references/amostra-prosa-autoral.md`](../escrita-afonso/references/amostra-prosa-autoral.md).

## Procedimento

1. **Varra o texto por marcadores.** Em HTML, extraia primeiro o texto visível:

   ```bash
   python3 - <<'EOF'
   import re, io
   s = io.open('<arquivo>.html', encoding='utf-8').read()
   s = re.sub(r'<div class="code-block".*?</div>', '[CODE]', s, flags=re.S)
   linhas = [l.strip() for l in re.split(r'\|+', re.sub(r'<[^>]+>', '|', s)) if l.strip()]
   alvo = re.compile(r', não |não é |nem |jamais|nunca|em vez de| — |apenas|só '
                     r'|é o que |é ela que |é ele que |é por isso que |é essa ')
   for l in linhas:
       if alvo.search(l) and len(l) > 12:
           print('-', l[:190])
   EOF
   ```

2. **Classifique cada ocorrência.** Negação técnica legítima permanece. Figura retórica é
   reescrita.

3. **Reescreva como proposição.** Pergunte: *qual é a afirmação que esta frase quer fazer?*
   Escreva apenas essa afirmação. Se a frase perder força ao ser reescrita, a força estava
   no tom, e não no conteúdo.

4. **Preserve o conteúdo técnico.** A reescrita não remove informação, número, termo
   consagrado nem enunciado normativo. "Deve", "é obrigatório", "constitui falha" e "não se
   admite" são a forma correta de ser contundente.

5. **Aplique com verificação.** Substituições em massa devem falhar de forma visível quando
   o trecho não é encontrado:

   ```python
   for old, new in PARES:
       assert old in s, old[:70]
       s = s.replace(old, new, 1)
   ```

6. **Revalide.** Texto mais longo ocupa mais espaço: em deck de slides, rode
   `npm run validate:slides -- <arquivo>` e confirme ausência de `OVERFLOW`.

## Onde as construções se concentram

| Elemento | Risco |
|---|---|
| Título de slide | Alto — é onde a antítese e o aforismo aparecem primeiro |
| Subtítulo e callout | Alto — punch line e sentença de efeito |
| Bloco "erro comum" | Médio — descrever o erro é legítimo; moralizar sobre ele não é |
| Fim de seção e de parágrafo | Alto — fechamento comentado e paralelismo especular |
| Checklist | Baixo — o imperativo técnico é a forma correta |
| Tabela e código | Baixo |

## Critério de aceitação

O texto está revisado quando toda proposição pode ser lida isoladamente, fora do slide ou
do parágrafo, e permanecer verdadeira, precisa e verificável — sem depender do contraste
com a frase anterior nem do ritmo da construção.
