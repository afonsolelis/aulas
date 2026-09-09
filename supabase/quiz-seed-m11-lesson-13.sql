-- =====================================================================
-- Aula 13 do Módulo 11 — Transformação e Carga
-- Dez perguntas extraídas do material lesson-13-material.html, cuja fonte
-- é o objeto 13 de pages/module-11-eng-software/lesson-content.js, e do
-- deck slide-lesson-13.html, que expõe o mesmo conteúdo em sala.
--
-- Noventa segundos de resposta por questão. A pergunta fecha sozinha ao
-- fim do tempo, sem depender de comando do professor, e o resultado é
-- exibido de imediato. A décima questão tem peso 2, de modo que a última
-- rodada mantém a disputa aberta até o encerramento.
--
-- As questões são de aplicação: cada uma apresenta uma situação de
-- pipeline e pede o diagnóstico ou a intervenção correspondente. Os
-- distratores reproduzem erros correntes na prática — antecipar horário
-- em vez de declarar dependência, resolver duplicidade por operador de
-- conjunto, tomar teste que nunca falhou por evidência de qualidade. A
-- posição da resposta correta é distribuída entre as quatro letras e o
-- comprimento das alternativas é equilibrado, para que nem a posição nem
-- a extensão sirvam de atalho.
--
-- Cobertura: uma questão por seção, nas dez seções do material, na ordem
-- em que a exposição as percorre.
--
-- O token do professor NÃO é versionado: este repositório é público, e quem
-- tem o token abre, revela e reinicia a sessão. É o MESMO em todas as salas
-- (QUIZ_HOST_TOKEN no .env da raiz), mas quiz_host() valida o par
-- (session_slug, token) — logo, toda sala nova precisa da sua linha:
--
--   set -a; . ./.env; set +a
--   psql "$DATABASE_URL?sslmode=require" -c \
--     "insert into quiz_host_tokens (session_slug, token)
--      values ('transformacao-m11-a13', '$QUIZ_HOST_TOKEN')
--      on conflict (session_slug) do update set token = excluded.token;"
--
-- Sem essa linha o painel recusa a entrada com "Token do professor inválido."
--
-- Rodar depois de quiz-schema.sql, quiz-funcoes.sql, quiz-relatorio.sql e
-- quiz-ingestao.sql. É idempotente.
-- =====================================================================

insert into quiz_sessions (slug, titulo) values
  ('transformacao-m11-a13', 'Aula 13 — Transformação e Carga')
on conflict (slug) do update set titulo = excluded.titulo;

-- Compõe a data_tag do arquivamento: <turma>-<slug>.
update quiz_sessions set turma = '2026-2A' where slug = 'transformacao-m11-a13';

delete from quiz_questions where session_slug = 'transformacao-m11-a13';

with novas as (
  insert into quiz_questions (session_slug, ordem, enunciado, alternativas, segundos, peso, tema, secao)
  values
  ('transformacao-m11-a13', 1,
   'A equipe propõe aplicar as regras de cálculo antes de gravar no destino, para reduzir o volume armazenado. A definição de receita líquida ainda está em discussão com o parceiro e deve ser fechada nos próximos meses. Qual decisão é coerente com esse contexto?',
   '["ETL, porque transformar antes da gravação reduz o volume armazenado e o custo de processamento no destino",
     "ELT, porque a bronze preservada permite recalcular a série inteira quando a definição for fechada",
     "ETL, desde que a definição nova seja aplicada apenas às cargas futuras e o passado permaneça como está",
     "ELT, porque transformar no destino dispensa registrar a definição da métrica no contrato da camada"]'::jsonb, 90, 1, 'ETL e ELT', 'seção 1'),

  ('transformacao-m11-a13', 2,
   'Um backfill de 24 meses executado em julho e repetido em setembro, com os mesmos parâmetros de execução, devolve conjuntos distintos. A consulta filtra pela data corrente menos trinta dias e elege o registro vencedor com função de janela particionada por pedido, sem cláusula de ordenação. Qual correção restaura o determinismo?',
   '["Receber a janela como parâmetro externo e acrescentar ordenação total com critério de desempate à função de janela",
     "Fixar o fuso horário e o momento do arredondamento, e registrar em cada carga a versão do código que a produziu",
     "Executar o backfill sempre no mesmo dia do mês, para que a expressão sobre a data corrente delimite a mesma janela",
     "Ordenar fisicamente os arquivos da bronze antes da leitura, para que a função de janela receba a ordem estável"]'::jsonb, 90, 1, 'Determinismo', 'seção 2'),

  ('transformacao-m11-a13', 3,
   'A receita publicada caiu 3% após a última carga. Nenhuma execução registrou erro, os testes de schema e de unicidade passaram e a origem manteve o volume habitual. A gold monta o fato por junção interna com a dimensão de produto, cujo cadastro recebeu produtos novos na semana. Qual é a causa provável e a defesa correspondente?',
   '["Nulo em medida tratado como zero na agregação; declarar no teste de qualidade se o nulo é zero, ignorado ou rejeitado",
     "Arredondamento aplicado por linha em vez de sobre a soma; declarar o momento do arredondamento na definição da métrica",
     "Fato sem dimensão correspondente descartado na junção; medir a contagem antes e depois dela e adotar membro desconhecido",
     "Fuso horário divergente entre a origem e o destino; registrar no contrato da camada de consumo o fuso adotado na publicação"]'::jsonb, 90, 1, 'Decisões silenciosas', 'seção 3'),

  ('transformacao-m11-a13', 4,
   'Como evidência de qualidade da silver, a equipe apresenta doze testes que passam desde a primeira execução e cobrem schema, obrigatoriedade, unicidade e relacionamento. O que essa evidência sustenta?',
   '["Que a silver está conforme o contrato, porque as quatro famílias de verificação exigidas pela camada estão cobertas",
     "Que a cobertura é suficiente, restando acrescentar apenas a reconciliação de contagem e de soma com o sistema de origem",
     "Que o conjunto é adequado, desde que passe a rodar a cada carga e bloqueie a publicação quando a origem mudar de comportamento",
     "Nada sobre a capacidade de detecção: nenhum dos doze falhou, e a falha inicial é a prova de que o teste acusa o defeito"]'::jsonb, 90, 1, 'Qualidade', 'seção 4'),

  ('transformacao-m11-a13', 5,
   'A deduplicação da bronze ordena pelo carimbo de chegada. Depois de reprocessar o mesmo período, a regra passou a eleger registros diferentes dos eleitos na carga original, e o valor do painel mudou sem que a origem tivesse alterado qualquer pedido. Qual correção resolve o problema?',
   '["Substituir a função de janela pela seleção distinta das linhas, que elimina a duplicidade sem depender de ordenação",
     "Registrar em cada execução quantas duplicatas foram descartadas, para que a divergência entre as cargas fique visível",
     "Ordenar pelo carimbo da origem, com desempate determinístico, porque o de chegada reflete a ordem de processamento",
     "Ampliar a chave de partição com o identificador do lote, de modo que cada reprocessamento eleja o vencedor do lote"]'::jsonb, 90, 1, 'Deduplicação', 'seção 5'),

  ('transformacao-m11-a13', 6,
   'Depois de seis semanas de cargas por merge, a dimensão de produto apresenta três linhas para o mesmo produto e nenhuma execução registrou erro. A chave usada no merge combina o código do produto com o nome da categoria, que a origem reescreve de tempos em tempos. Qual é a correção?',
   '["Trocar o merge pela sobrescrita da partição inteira, recomposta a cada carga a partir da silver conformada",
     "Usar no merge apenas a chave estável do produto, porque a chave que muda converte atualização em inserção",
     "Acrescentar teste de unicidade da chave da dimensão, que interrompe a carga assim que a duplicação aparecer",
     "Garantir a atomicidade da publicação por troca de ponteiro, para que a carga pela metade não chegue ao consumidor"]'::jsonb, 90, 1, 'Carga incremental', 'seção 6'),

  ('transformacao-m11-a13', 7,
   'O parceiro precisa apurar a receita pela categoria a que o produto pertencia na data da venda. A origem altera a categoria de algumas dezenas de produtos por mês, a dimensão tem 32 mil linhas e a carga atual sobrescreve o atributo. Qual política de histórico e qual carga atendem à necessidade?',
   '["Sobrescrita, com merge pela chave natural: a categoria vigente passa a valer para toda a série apurada",
     "Atributo anterior em coluna própria, com merge que copia o valor antigo antes de gravar o valor novo",
     "Instantâneo diário do cadastro inteiro, com append particionado pela data em que o instantâneo foi gravado",
     "Nova versão com vigência, com merge que encerra a versão vigente e abre a seguinte na data da mudança"]'::jsonb, 90, 1, 'Histórico da dimensão', 'seção 7'),

  ('transformacao-m11-a13', 8,
   'A extração está agendada para as 2h30 e a transformação para as 3h. Nos dias de maior volume a extração termina às 3h10, e o painel publica um número menor sem que nenhuma das duas tarefas falhe. Qual medida corrige a causa?',
   '["Declarar a dependência entre as tarefas, de modo que a transformação parta da conclusão da extração",
     "Antecipar a extração para as 2h, ampliando a folga entre as duas tarefas nos dias de maior volume",
     "Habilitar novas tentativas automáticas na transformação, para que ela se repita quando o dado vier incompleto",
     "Alertar quando a extração ultrapassar o horário previsto, para que a equipe acompanhe a publicação do dia"]'::jsonb, 90, 1, 'Orquestração', 'seção 8'),

  ('transformacao-m11-a13', 9,
   'Para provar que a carga é repetível, o grupo executa-a duas vezes com os mesmos parâmetros e verifica que a contagem de linhas do fato permanece na mesma ordem de grandeza. Que verificação falta, e por quê?',
   '["A saída dos cinco testes nas duas execuções, porque a devolução de zero em ambas já comprova a repetibilidade",
     "A soma da receita, porque a junção que duplica linhas altera o total sem mudar a ordem de grandeza da contagem",
     "A contagem por mês além do total, porque o período divergente não aparece quando as linhas são somadas no agregado",
     "A execução em ambiente distinto do de desenvolvimento, porque a repetibilidade se demonstra na promoção entre ambientes"]'::jsonb, 90, 1, 'Repetibilidade da carga', 'seção 9'),

  ('transformacao-m11-a13', 10,
   'A conferência da silver registra 99 441 linhas na bronze, 98 200 conformadas, 900 rejeitadas com motivo e 200 duplicatas removidas. O grupo conclui que toda linha da entrada tem destino conhecido. Como avaliar a conclusão?',
   '["Correta: conformadas, rejeitadas e duplicatas somam a contagem da bronze, e nenhuma linha ficou sem destino registrado",
     "Correta, desde que as duplicatas removidas sejam contadas entre as rejeitadas, porque ambas saem da camada conformada",
     "Incorreta: as três parcelas somam 99 300, e as 141 linhas restantes saíram sem rejeição nem registro de duplicidade",
     "Incorreta: a conferência só se sustenta contra o sistema de origem, e a contagem da bronze não serve de referência"]'::jsonb, 90, 2, 'Conferência da silver', 'seção 10')
  returning id, ordem
)
insert into quiz_answer_key (question_id, correta, explicacao)
select n.id, g.correta, g.explicacao
  from novas n
  join (values
    (1, 1, 'O critério de escolha é a necessidade futura de responder qual seria o número sob outra regra. Com a definição de receita ainda em discussão, o bruto precisa ser preservado, e a transformação roda sobre a bronze. Aplicar a regra nova apenas às cargas futuras é o erro descrito na seção: a série passa a misturar dois critérios (seção 1).'),
    (2, 0, 'Duas das quatro construções que quebram o determinismo estão presentes: a data corrente dentro da transformação e a ordenação parcial na função de janela. A janela vira parâmetro de entrada e a ordenação passa a ser total, com desempate explícito. Fixar fuso e arredondamento é recomendação da mesma seção, mas não corrige nenhuma das duas (seção 2).'),
    (3, 2, 'A junção interna descarta o fato cuja dimensão ainda não existe, e é a mais perigosa das quatro decisões silenciosas porque reduz o total sem emitir aviso. Os produtos novos ainda não estão na dimensão. A defesa é comparar a contagem antes e depois de cada junção e preservar o fato com membro desconhecido (seções 3 e 10).'),
    (4, 3, 'O teste é escrito antes da transformação e precisa falhar, porque a falha inicial é a única prova de que ele detecta o defeito. Doze testes verdes desde a primeira execução não demonstram capacidade de detecção, qualquer que seja a cobertura declarada (seção 4).'),
    (5, 2, 'O carimbo de chegada reflete a ordem em que o pipeline processou, e não a ordem em que os fatos ocorreram; sob reprocessamento essa ordem se inverte e o vencedor muda. A ordenação precisa partir do carimbo da origem, com desempate determinístico. A seleção distinta não resolve duplicata que difere em alguma coluna, e contar as descartadas apenas torna a divergência visível (seção 5).'),
    (6, 1, 'Merge sem chave estável insere linha nova em vez de atualizar a existente, e a dimensão duplica em silêncio ao longo das cargas. A chave do merge não pode conter atributo que a origem reescreve. O teste de unicidade detecta a duplicação depois de ocorrida; a atomicidade responde por outro problema (seção 6).'),
    (7, 3, 'Responder qual era o estado na data do fato exige nova versão com vigência, carregada por merge que encerra a linha vigente e abre a seguinte. A sobrescrita perde o valor anterior, o atributo anterior responde apenas pelo valor imediatamente precedente, e o instantâneo diário grava 32 mil linhas por dia para algumas dezenas de mudanças por mês (seção 7).'),
    (8, 0, 'O encadeamento por horário pressupõe que a etapa anterior sempre termina no tempo previsto, e a premissa falha exatamente nos dias de maior volume. Com a dependência declarada, a transformação aguarda a conclusão da extração em vez de processar dado incompleto. Ampliar a folga adia o incidente, o alerta apenas o comunica, e o retry sobre carga não idempotente multiplica o defeito (seção 8).'),
    (9, 1, 'A comparação por soma de receita é mais sensível que a contagem: a junção que duplica linhas mantém a contagem na mesma ordem de grandeza e altera o total de imediato. A prova de repetibilidade é a soma idêntica até o centavo entre duas execuções com os mesmos parâmetros (seções 9 e 10).'),
    (10, 2, 'A conferência exige que conformadas, rejeitadas e duplicatas removidas igualem a contagem da bronze, sem resíduo. As parcelas somam 99 300 contra 99 441 da entrada: 141 linhas saíram da silver sem rejeição registrada e sem constar como duplicatas, o que é descarte silencioso (seção 10).')
  ) as g(ordem, correta, explicacao) on g.ordem = n.ordem;

select count(*) || ' perguntas carregadas' as resultado
  from quiz_questions where session_slug = 'transformacao-m11-a13';
