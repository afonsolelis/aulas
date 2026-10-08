---
name: redator-cientifico
description: Procedimento de redação e reescrita técnica e acadêmica trazido do projeto irmão `tese` (`.claude/commands/escrita/redator-cientifico.md`). Converte rascunhos, tópicos e textos com ritmo de rede social em prosa técnica, fluida e encadeada, em dois estágios (esqueleto com a fonte de cada afirmação, depois prosa) e com edição cirúrgica. Use ao escrever ou reescrever seções de material, slides, planos, guias e arquivos de apoio, junto com estilo-academico, escrita-afonso e humanizacao.
---

# Redator científico

Adaptação, para o acervo de aulas, do agente `redator-cientifico` da tese
(`../../../../tese/.claude/commands/escrita/redator-cientifico.md`, projeto irmão). Na tese, ele
redige capítulos em LaTeX no padrão ABNT; aqui, redige e reescreve em HTML e Markdown o texto
destinado ao aluno e ao participante de treinamento. O estilo de frase é definido por
[estilo-academico](../estilo-academico/SKILL.md), a voz autoral por
[escrita-afonso](../escrita-afonso/SKILL.md) e a revisão de vícios por
[humanizacao](../humanizacao/SKILL.md). Esta skill acrescenta o procedimento de redação. Em caso
de conflito, vale a regra mais restritiva.

## Quando usar

- Escrever ou reescrever uma seção de material de leitura, de plano de ensino, de guia do
  facilitador ou de arquivo de apoio (`.md` de kit, roteiro de prática).
- Converter anotações, tópicos soltos ou texto gerado por IA em prosa técnica encadeada.
- Tornar um texto existente mais técnico, fluido e acadêmico sem alterar o que ele afirma.
- Reescrever subtítulos, boxes e callouts de slides para que expliquem em vez de anunciar.

## Princípios

1. **Nenhuma invenção.** Toda afirmação factual, todo número e toda referência rastreiam a uma
   fonte do repositório (material, slides, plano, `config/`, arquivos do kit, referências já
   citadas) ou a uma obra verificável. Diante de fonte inexistente, a lacuna é sinalizada com
   `[FONTE FALTANDO]`, e não preenchida com texto plausível.
2. **Dois estágios.** Em texto novo ou em reescrita extensa, primeiro se monta um esqueleto com
   um ponto por linha e a fonte de cada um; só depois o esqueleto vira prosa. Em ajustes
   pontuais, o esqueleto pode ser mental, mas a verificação de fonte continua obrigatória.
3. **Prosa corrida onde o gênero pede prosa.** No material de leitura, no plano e no guia, o
   argumento avança em parágrafos encadeados, sem listas usadas como substituto do raciocínio.
   Listas permanecem quando enumeram conteúdo técnico (arquivos, campos, etapas de um roteiro,
   critérios) e em slides, conforme a seção "Adaptação a slides" de `estilo-academico`.
4. **Termo técnico preciso.** O texto nomeia o mecanismo pelo termo da área (por exemplo,
   comparabilidade, linha de base, alçada, critério de aceite) e o define na primeira ocorrência,
   em vez de recorrer a metáfora ou a expressão coloquial.
5. **Edição cirúrgica.** Parágrafo correto não é reescrito por gosto. Mexe-se no mínimo
   necessário para corrigir o problema apontado, mantendo terminologia, nomes de arquivo,
   horários, marcação HTML e blocos gerados (`encontro:*`, `semana:*`).

## Fluxo

1. **Ler o alvo inteiro e o contexto vizinho**, para herdar tom, terminologia e convenções do
   arquivo (por exemplo, segunda pessoa do plural nas instruções de prática dos slides e voz
   impessoal no material).
2. **Reunir as fontes** de cada número e de cada afirmação factual do trecho.
3. **Diagnosticar** os problemas de estilo com o procedimento de `estilo-academico` (travessão
   na prosa, manchete com dois-pontos, antítese, fragmento, fecho de efeito, título-aforismo) e,
   além deles, os problemas de precisão técnica: termo vago, quantificador sem base, relação
   causal afirmada sem mecanismo.
4. **Reescrever** no modelo princípio, justificativa e consequência, com conectivos explícitos
   entre os períodos.
5. **Validar**: `npm run validate:slides -- <arquivo>` para slides, `npm test` para o acervo, e
   regeneração dos blocos derivados quando a fonte for `config/encontros.json`.
6. **Relatar** o que mudou, com exemplos de antes e depois, e listar o que ficou pendente de
   fonte.

## Limites

- Não altera números, datas, horários, código, prompts nem o conteúdo de gabaritos.
- Não acrescenta conteúdo novo à aula sem pedido explícito do professor; reescrever é
  transformação de forma.
- Conteúdo de avaliação segue a Key Rule 10 do `CLAUDE.md` e nunca entra no repositório.
