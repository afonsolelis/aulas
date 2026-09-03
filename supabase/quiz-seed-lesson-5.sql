-- =====================================================================
-- Aula 5 do Módulo 7 — Gestão de mudanças (GMUD)
-- Cinco perguntas extraídas do material lesson-5-material.html.
-- Rodar depois de quiz-schema.sql. É idempotente.
-- =====================================================================

insert into quiz_sessions (slug, titulo) values
  ('gmud-m7-a5', 'Aula 5 — Gestão de mudanças')
on conflict (slug) do update set titulo = excluded.titulo;

-- O token do professor NÃO é versionado: este repositório é público, e quem
-- tem o token abre, revela e reinicia a sessão. Defina-o à mão no SQL Editor,
-- uma vez por sessão, substituindo o valor abaixo:
--
--   insert into quiz_host_tokens (session_slug, token)
--   values ('gmud-m7-a5', 'COLE-O-TOKEN-AQUI')
--   on conflict (session_slug) do update set token = excluded.token;
--
-- Para gerar um token novo:  python3 -c "import secrets;print(secrets.token_urlsafe(9))"

delete from quiz_questions where session_slug = 'gmud-m7-a5';

with novas as (
  insert into quiz_questions (session_slug, ordem, enunciado, alternativas, segundos)
  values
  ('gmud-m7-a5', 1,
   'A expressão "gestão de mudanças" designa duas disciplinas distintas. O que caracteriza o sentido técnico, designado no mercado brasileiro pela sigla GMUD?',
   '["A transição das pessoas do estado atual para o estado futuro, por consciência, capacitação e reforço",
     "O controle das alterações em ambiente produtivo: quem solicita, quem avalia o risco, quem autoriza e como se retorna ao estado anterior",
     "O treinamento dos usuários-chave e a rede de multiplicadores antes da entrada em operação",
     "A negociação de prazo e de escopo do projeto com o cliente antes da virada"]'::jsonb, 40),

  ('gmud-m7-a5', 2,
   'Segundo o material, uma proporção de mudanças emergenciais acima de dez por cento do total sinaliza o quê?',
   '["Maturidade da equipe de sustentação, que responde rapidamente aos incidentes",
     "Planejamento insuficiente ou uso da categoria para contornar a alçada de autorização",
     "Excesso de rigor do comitê de mudanças, que devolve requisições em demasia",
     "Necessidade de ampliar a janela de manutenção publicada no calendário"]'::jsonb, 40),

  ('gmud-m7-a5', 3,
   'A alteração de um parâmetro de arredondamento é trivial de executar e modifica o valor de todas as notas emitidas. Que proposição esse exemplo sustenta?',
   '["Toda alteração de configuração deve ser classificada como mudança padrão",
     "Complexidade técnica e impacto são dimensões independentes entre si",
     "O plano de retorno é dispensável quando a alteração é de pequeno porte",
     "Mudanças de parâmetro dispensam a passagem pelo comitê de mudanças"]'::jsonb, 40),

  ('gmud-m7-a5', 4,
   'O que a segregação de funções exige, no contexto da governança da mudança?',
   '["Que quem desenvolve não autorize nem aplique a alteração em produção, com acesso ao ambiente produtivo restrito e registrado",
     "Que cada área afetada mantenha o seu próprio comitê de mudanças independente",
     "Que o acesso emergencial ao ambiente produtivo seja concedido em caráter permanente à equipe técnica",
     "Que o solicitante e o responsável técnico pela execução sejam sempre a mesma pessoa"]'::jsonb, 40),

  ('gmud-m7-a5', 5,
   'Tempo de ciclo elevado combinado com taxa de sucesso baixa caracteriza o quê?',
   '["Um comitê emergencial bem calibrado, que filtra o que não deve passar",
     "Rito burocrático sem efeito protetivo: a mudança demora a ser autorizada e ainda assim falha",
     "Excesso de mudanças do tipo padrão registradas no período",
     "Boa adoção organizacional acompanhada de atraso apenas técnico"]'::jsonb, 40)
  returning id, ordem
)
insert into quiz_answer_key (question_id, correta, explicacao)
select n.id,
       g.correta,
       g.explicacao
  from novas n
  join (values
    (1, 1, 'O sentido técnico trata da alteração em produção — configuração, código, versão, infraestrutura e interface. O sentido organizacional, tratado na seção 12, cuida da transição das pessoas.'),
    (2, 1, 'A categoria emergencial existe para restabelecer serviço. Usada em excesso, ela indica planejamento insuficiente ou desvio da alçada de autorização.'),
    (3, 1, 'Executar a alteração é trivial; o efeito alcança o valor de todas as notas emitidas. Por isso risco e impacto são avaliados em separado da complexidade.'),
    (4, 0, 'A segregação de funções é exigência de controle interno e de auditoria independente. O acesso emergencial, quando necessário, é concedido por tempo determinado e revisado depois.'),
    (5, 1, 'O rito só se justifica se protege a operação. Ciclo longo com falha frequente indica formalidade sem efeito.')
  ) as g(ordem, correta, explicacao) on g.ordem = n.ordem;

select ordem, left(enunciado, 60) || '...' as pergunta
  from quiz_questions where session_slug = 'gmud-m7-a5' order by ordem;
