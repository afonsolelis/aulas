import { test, expect, type BrowserContext, type Page } from '@playwright/test';
import path from 'path';

/**
 * TBL da Aula 1 do Módulo 8 — sequência de questões por categoria de exceção.
 *
 * O Supabase é simulado por interceptação de `/rest/v1/rpc/*`: as funções
 * respondem com o mesmo contrato de `supabase/tbl-funcoes.sql`, o que
 * permite exercitar a página do aluno e o painel do professor sem tocar
 * no banco. O corte de informação por fase é reproduzido aqui justamente
 * para que o teste falhe caso a página passe a exibir o que a fase não
 * libera: as questões seguintes e o dado novo antes da discussão.
 */

const ALUNO = 'file://' + path.resolve(__dirname, '../pages/module-8-eng-software/tbl/lesson-1-tbl.html');
const PAINEL = 'file://' + path.resolve(__dirname, '../pages/module-8-eng-software/tbl/lesson-1-painel.html');
const TOKEN = 'token-de-teste';
const TOTAL_QUESTOES = 3;

const alternativasDe = (q: number) => ['A', 'B', 'C', 'D'].map((letra, i) => ({
  letra, titulo: `Tática ${letra} da questão ${q}`, tatica: `Família ${letra}`,
  texto: `Descrição da tática ${letra} na questão ${q}.`,
  ganho: `Ganho de ${letra}.`, custo: `Custo de ${letra}.`
}));

const QUESTOES = [
  { ordem: 1, categoria: 'Regra de negócio incompleta', titulo: 'A combinação que a regra não previu',
    pergunta: 'Como a equipe trata o que a regra não previu?', dado_novo: null },
  { ordem: 2, categoria: 'Infraestrutura: conexão e integridade', titulo: 'A ordem liquidada cuja resposta não chegou',
    pergunta: 'Qual tática a equipe adota contra a duplicidade?', dado_novo: null },
  { ordem: 3, categoria: 'Segurança: fraude e imprecisão', titulo: 'A resposta primária à perda do canal',
    pergunta: 'Qual tática a instituição adota como resposta primária?',
    dado_novo: {
      titulo: 'A classificação individual das 1.870 ocorrências',
      texto: 'Em 78% delas o titular enunciou o comando pretendido.',
      evidencias: ['Confirmação concluída em 96% das ocorrências.'],
      pergunta: 'A sua escolha anterior sobrevive a este dado?'
    } }
].map(q => ({ ...q, alternativas: alternativasDe(q.ordem) }));

function salaFalsa() {
  const sala = {
    fase: 'lobby' as string,
    questao: 1,
    termina: null as number | null,
    pessoas: [] as { id: string; nome: string }[],
    votos: [] as { id: string; questao: number; rodada: number; escolha: number; justificativa: string }[]
  };
  const duracao: Record<string, number> = { voto1: 180, discussao: 240, voto2: 120 };
  const proxima: Record<string, string> = {
    lobby: 'voto1', voto1: 'discussao', discussao: 'voto2', voto2: 'sintese'
  };

  const questaoDe = (n: number) => QUESTOES.find(q => q.ordem === n)!;

  const distribuicao = (questao: number, rodada: number) => [0, 1, 2, 3].map(escolha => ({
    escolha, votos: sala.votos.filter(v => v.questao === questao && v.rodada === rodada && v.escolha === escolha).length
  }));
  const justificativas = (questao: number, rodada: number) => sala.votos
    .filter(v => v.questao === questao && v.rodada === rodada)
    .map(v => ({ escolha: v.escolha, texto: v.justificativa }));
  const trajetos = (questao: number) => {
    const mapa = new Map<string, number>();
    for (const a of sala.votos.filter(v => v.questao === questao && v.rodada === 1)) {
      const b = sala.votos.find(v => v.questao === questao && v.rodada === 2 && v.id === a.id);
      if (!b) continue;
      const k = `${a.escolha}-${b.escolha}`;
      mapa.set(k, (mapa.get(k) || 0) + 1);
    }
    return [...mapa].map(([k, pessoas]) => ({ de: +k.split('-')[0], para: +k.split('-')[1], pessoas }));
  };
  const consolidado = () => QUESTOES.map(q => ({
    ordem: q.ordem, categoria: q.categoria, titulo: q.titulo, pergunta: q.pergunta,
    alternativas: q.alternativas,
    rodada1: distribuicao(q.ordem, 1), rodada2: distribuicao(q.ordem, 2), trajetos: trajetos(q.ordem)
  }));

  const estado = (id: string | null) => {
    const q = questaoDe(sala.questao);
    const rodadaCorrente = { voto1: 1, voto2: 2 }[sala.fase] ?? null;
    const meus: Record<string, unknown> = {};
    for (const v of sala.votos.filter(v => v.id === id && v.questao === sala.questao)) {
      meus[String(v.rodada)] = { escolha: v.escolha, justificativa: v.justificativa };
    }
    const base: Record<string, unknown> = {
      ok: true, slug: 'teste', titulo: 'TBL de teste', fase: sala.fase,
      questao: sala.questao, total_questoes: TOTAL_QUESTOES,
      restante: sala.termina === null ? null : Math.max(0, Math.round((sala.termina - Date.now()) / 1000)),
      votacao_aberta: rodadaCorrente !== null,
      participantes: sala.pessoas.length, inscritos: sala.pessoas.length,
      votos_rodada: rodadaCorrente === null ? 0
        : sala.votos.filter(v => v.questao === sala.questao && v.rodada === rodadaCorrente).length,
      inscrito: sala.pessoas.some(p => p.id === id),
      caso_titulo: 'A ordem que o sistema entendeu corretamente',
      caso_texto: 'Instituição de pagamento com PIX por linguagem natural.',
      contexto: [{ rotulo: 'Perda', valor: 'R$ 3,1 milhões', nota: '1.870 ocorrências' }],
      categoria: q.categoria, questao_titulo: q.titulo, pergunta: q.pergunta,
      alternativas: q.alternativas, meus_votos: meus
    };
    if (['discussao', 'voto2', 'sintese', 'revelacao'].includes(sala.fase)) {
      base.rodada1 = distribuicao(sala.questao, 1);
      base.justificativas1 = justificativas(sala.questao, 1);
      base.dado_novo = q.dado_novo;
    }
    if (['sintese', 'revelacao'].includes(sala.fase)) {
      base.rodada2 = distribuicao(sala.questao, 2);
      base.justificativas2 = justificativas(sala.questao, 2);
      base.trajetos = trajetos(sala.questao);
    }
    if (sala.fase === 'revelacao') base.consolidado = consolidado();
    return base;
  };

  const rpc: Record<string, (args: any) => unknown> = {
    tbl_entrar: ({ p_nome, p_id }) => {
      const nome = String(p_nome || '').trim();
      if (nome.length < 2) return { ok: false, erro: 'O nome deve ter entre 2 e 24 caracteres.' };
      const existente = p_id ? sala.pessoas.find(p => p.id === p_id) : null;
      if (existente) { existente.nome = nome; return { ok: true, participante_id: existente.id, nome }; }
      if (sala.pessoas.some(p => p.nome.toLowerCase() === nome.toLowerCase())) {
        return { ok: false, erro: 'Esse nome já está em uso nesta sala. Escolha outro.' };
      }
      const id = 'id-' + (sala.pessoas.length + 1);
      sala.pessoas.push({ id, nome });
      return { ok: true, participante_id: id, nome };
    },
    tbl_votar: ({ p_participante, p_rodada, p_escolha, p_justificativa }) => {
      if (sala.fase !== 'voto' + p_rodada) return { ok: false, erro: 'Esta rodada não está aberta.' };
      const just = String(p_justificativa || '').trim();
      if (just.length < 10) return { ok: false, erro: 'Registre a justificativa com pelo menos 10 caracteres.' };
      const anterior = sala.votos.find(v => v.id === p_participante
        && v.questao === sala.questao && v.rodada === p_rodada);
      if (anterior) { anterior.escolha = p_escolha; anterior.justificativa = just; }
      else sala.votos.push({ id: p_participante, questao: sala.questao, rodada: p_rodada, escolha: p_escolha, justificativa: just });
      return { ok: true };
    },
    tbl_estado: ({ p_participante }) => estado(p_participante ?? null),
    tbl_host: ({ p_token, p_acao }) => {
      if (p_token !== TOKEN) return { ok: false, erro: 'Token do professor inválido.' };
      const proximaQuestao = () => {
        if (sala.questao >= TOTAL_QUESTOES) { sala.fase = 'revelacao'; sala.termina = null; }
        else { sala.questao += 1; sala.fase = 'voto1'; sala.termina = Date.now() + duracao.voto1 * 1000; }
      };
      if (p_acao === 'avancar') {
        if (['sintese', 'revelacao'].includes(sala.fase)) proximaQuestao();
        else {
          sala.fase = proxima[sala.fase] || 'sintese';
          sala.termina = duracao[sala.fase] ? Date.now() + duracao[sala.fase] * 1000 : null;
        }
      } else if (p_acao === 'proxima') {
        proximaQuestao();
      } else if (p_acao === 'anterior') {
        if (sala.questao <= 1) return { ok: false, erro: 'Esta é a primeira questão.' };
        sala.questao -= 1; sala.fase = 'sintese'; sala.termina = null;
      } else if (p_acao === 'iniciar') {
        sala.votos = []; sala.questao = 1; sala.fase = 'voto1'; sala.termina = Date.now() + duracao.voto1 * 1000;
      } else if (p_acao === 'revelar') {
        sala.fase = 'revelacao'; sala.termina = null;
      } else if (p_acao === 'lobby') {
        sala.votos = []; sala.questao = 1; sala.fase = 'lobby'; sala.termina = null;
      } else if (p_acao === 'reiniciar') {
        sala.votos = []; sala.pessoas = []; sala.questao = 1; sala.fase = 'lobby'; sala.termina = null;
      }
      const base = estado(null) as Record<string, unknown>;
      return {
        ...base, host: true,
        turma: sala.pessoas.map(p => ({
          nome: p.nome, online: true,
          r1: sala.votos.find(v => v.id === p.id && v.questao === sala.questao && v.rodada === 1)?.escolha ?? null,
          r2: sala.votos.find(v => v.id === p.id && v.questao === sala.questao && v.rodada === 2)?.escolha ?? null
        })),
        dado_novo: questaoDe(sala.questao).dado_novo,
        rodada1: distribuicao(sala.questao, 1), rodada2: distribuicao(sala.questao, 2),
        justificativas1: justificativas(sala.questao, 1), justificativas2: justificativas(sala.questao, 2),
        trajetos: trajetos(sala.questao), consolidado: consolidado(),
        votos1: sala.votos.filter(v => v.questao === sala.questao && v.rodada === 1).length,
        votos2: sala.votos.filter(v => v.questao === sala.questao && v.rodada === 2).length
      };
    }
  };

  const ligar = async (context: BrowserContext) => {
    await context.route('**/rest/v1/rpc/*', async route => {
      const fn = new URL(route.request().url()).pathname.split('/').pop() as string;
      const corpo = route.request().postDataJSON();
      await route.fulfill({
        status: 200, contentType: 'application/json',
        body: JSON.stringify(rpc[fn] ? rpc[fn](corpo) : { ok: false, erro: 'função inexistente' })
      });
    });
    // O canal de Realtime não é exercitado aqui; a consulta periódica cobre a virada de fase.
    await context.route('**/realtime/**', route => route.abort());
  };

  return { sala, ligar };
}

async function abrirAluno(context: BrowserContext, nome: string): Promise<Page> {
  const page = await context.newPage();
  await page.goto(ALUNO);
  await page.fill('#nome', nome);
  await page.click('#form-entrada button');
  await expect(page.locator('#tela-sala')).toBeVisible();
  return page;
}

async function abrirPainel(context: BrowserContext): Promise<Page> {
  const page = await context.newPage();
  page.on('dialog', d => d.accept());
  await page.goto(PAINEL);
  await page.fill('#token', TOKEN);
  await page.click('#form-token button');
  await expect(page.locator('#painel')).toBeVisible();
  return page;
}

// Em sala, a virada de fase chega ao aparelho pelo canal de Realtime. O teste
// mantém esse canal desligado e o Chromium reduz a frequência dos
// temporizadores das abas ocultas, de modo que a consulta periódica não é
// previsível aqui: a atualização é solicitada explicitamente após cada avanço.
async function sincronizar(page: Page) {
  await page.bringToFront();
  await page.evaluate(() => (window as unknown as { atualizar: () => Promise<void> }).atualizar());
}

// A página consulta o estado a cada quatro segundos e redesenha quando ele
// muda, o que pode recriar o formulário entre o preenchimento e o clique. O
// registro é, por isso, tentado até passar: reenviar a mesma decisão é
// idempotente, tanto na página quanto no banco.
async function votar(page: Page, letra: number, texto: string) {
  await sincronizar(page);
  await expect(async () => {
    await page.click(`button.opcao[data-escolha="${letra}"]`);
    await page.fill('#justificativa', texto);
    await expect(page.locator('#registrar')).toBeEnabled({ timeout: 1000 });
    await page.click('#registrar', { timeout: 1000 });
    await expect(page.locator('#recado')).toContainText('Decisão registrada', { timeout: 1000 });
  }).toPass({ timeout: 15000 });
}

// Percorre uma questão inteira: primeira decisão, discussão, segunda decisão
// e síntese, deixando a sala na síntese da questão corrente.
async function percorrerQuestao(professor: Page, alunos: Page[], escolhas: [number, number][]) {
  await professor.click('#btn-avancar');           // abre voto1
  for (const [i, aluno] of alunos.entries()) {
    await votar(aluno, escolhas[i][0], `Primeira decisão registrada pelo participante ${i + 1}.`);
  }
  await professor.click('#btn-avancar');           // discussão
  await professor.click('#btn-avancar');           // voto2
  for (const [i, aluno] of alunos.entries()) {
    await votar(aluno, escolhas[i][1], `Segunda decisão registrada pelo participante ${i + 1}.`);
  }
  await professor.click('#btn-avancar');           // síntese
}

test.describe('TBL · Aula 1 do Módulo 8 · exceções fora do caminho feliz', () => {
  test('sequência de questões, com discussão e segunda decisão em cada uma', async ({ browser }) => {
    const sala = salaFalsa();

    const ctxProfessor = await browser.newContext();
    await sala.ligar(ctxProfessor);
    const professor = await abrirPainel(ctxProfessor);

    const ctxAna = await browser.newContext();
    await sala.ligar(ctxAna);
    const ana = await abrirAluno(ctxAna, 'Ana');

    const ctxBruno = await browser.newContext();
    await sala.ligar(ctxBruno);
    const bruno = await abrirAluno(ctxBruno, 'Bruno');

    // Painel: acesso da turma por link e por código QR, e cronômetro sem prazo
    // no lobby — a ausência de contagem é explicada, e não exibida como relógio
    // parado.
    await expect(professor.locator('#url-aluno')).toContainText('lesson-1-tbl.html');
    await expect(professor.locator('#qr-alvo svg')).toBeVisible();
    await expect(professor.locator('#tempo-grande')).toHaveText('--:--');
    await expect(professor.locator('#tempo-etiqueta')).toContainText('começa quando a questão abrir');

    // Lobby: o caso é legível, nada é votável e as questões não aparecem.
    await expect(ana.locator('#conteudo')).toContainText('A ordem que o sistema entendeu corretamente');
    await expect(ana.locator('button.opcao')).toHaveCount(0);
    await expect(ana.locator('#conteudo')).not.toContainText('A combinação que a regra não previu');
    await expect(ana.locator('.passo')).toHaveCount(TOTAL_QUESTOES);

    // Questão 1 — primeira decisão, sem informação sobre a turma.
    await professor.click('#btn-avancar');
    await sincronizar(ana);
    await expect(ana.locator('#selo-fase')).toContainText('Primeira decisão · questão 1 de 3');
    await expect(ana.locator('#conteudo')).toContainText('Regra de negócio incompleta');
    await expect(ana.locator('button.opcao')).toHaveCount(4);
    await expect(ana.locator('.barras')).toHaveCount(0);

    // Projeção: as quatro alternativas são discutidas com a turma olhando para
    // elas, então precisam caber lado a lado e acima da dobra.
    const layout = await professor.evaluate(() => {
      const cartoes = [...document.querySelectorAll('#projecao .opcao')];
      return {
        cartoes: cartoes.length,
        linhas: new Set(cartoes.map(c => Math.round(c.getBoundingClientRect().top))).size,
        fim: Math.max(...cartoes.map(c => c.getBoundingClientRect().bottom)),
        altura: window.innerHeight,
      };
    });
    expect(layout.cartoes).toBe(4);
    expect(layout.linhas).toBe(1);
    expect(layout.fim).toBeLessThanOrEqual(layout.altura);

    // Com a questão aberta, o cronômetro do painel conta o prazo da fase.
    await expect(professor.locator('#tempo-grande')).toHaveText(/^0[23]:\d{2}$/);
    await expect(professor.locator('#tempo-etiqueta')).toContainText('Primeira decisão individual · questão 1');

    // A justificativa é condição para registrar a decisão.
    await ana.click('button.opcao[data-escolha="0"]');
    await expect(ana.locator('#registrar')).toBeDisabled();
    await ana.fill('#justificativa', 'curto');
    await expect(ana.locator('#registrar')).toBeDisabled();

    await votar(ana, 0, 'Negar por omissão evita executar o caso não analisado.');
    await votar(bruno, 3, 'A tabela de decisão expõe a lacuna antes da implantação.');
    await expect(professor.locator('#decidiram')).toHaveText('2');

    // A decisão pode ser alterada enquanto a rodada está aberta.
    await votar(ana, 1, 'A pontuação contínua trata a combinação não enumerada.');
    await expect(ana.locator('button.opcao[data-escolha="1"]')).toHaveAttribute('aria-pressed', 'true');

    // Discussão: a distribuição e as justificativas passam a circular.
    await professor.click('#btn-avancar');
    await sincronizar(ana);
    await expect(ana.locator('#selo-fase')).toContainText('Discussão · questão 1 de 3');
    await expect(ana.locator('#conteudo')).toContainText('A tabela de decisão expõe a lacuna');
    await expect(ana.locator('.barras')).toHaveCount(1);
    await expect(ana.locator('button.opcao')).toHaveCount(0);
    // As alternativas continuam na tela, agora sem serem clicáveis, com o
    // placar da primeira rodada dentro de cada cartão.
    await expect(ana.locator('div.opcao')).toHaveCount(4);
    await expect(ana.locator('.placar')).toHaveCount(4);
    await expect(professor.locator('#projecao div.opcao')).toHaveCount(4);

    // Segunda decisão: a turma permanece à vista e a decisão começa em branco.
    await professor.click('#btn-avancar');
    await sincronizar(ana);
    await expect(ana.locator('#selo-fase')).toContainText('Segunda decisão · questão 1 de 3');
    await expect(ana.locator('.barras')).toHaveCount(1);
    await expect(ana.locator('button.opcao[aria-pressed="true"]')).toHaveCount(0);
    await expect(ana.locator('#justificativa')).toHaveValue('');
    await votar(ana, 1, 'Mantenho a pontuação após ouvir o custo das demais.');
    await votar(bruno, 1, 'A discussão me deslocou da tabela para a pontuação.');

    // Síntese da questão 1: as duas distribuições e a trajetória.
    await professor.click('#btn-avancar');
    await sincronizar(ana);
    await expect(ana.locator('#selo-fase')).toContainText('Síntese · questão 1 de 3');
    await expect(ana.locator('.barras')).toHaveCount(2);
    // A síntese é onde a discussão acontece: as alternativas não saem da tela,
    // e cada cartão carrega os placares das duas rodadas.
    await expect(ana.locator('div.opcao')).toHaveCount(4);
    await expect(professor.locator('#projecao div.opcao')).toHaveCount(4);
    await expect(professor.locator('#projecao .placar').first()).toContainText('1ª');
    await expect(professor.locator('#projecao .placar').first()).toContainText('2ª');
    await expect(ana.locator('#conteudo')).toContainText('D → B');

    // Questão 2: a sala avança de questão e a decisão recomeça em branco.
    await professor.click('#btn-avancar');
    await sincronizar(ana);
    await expect(ana.locator('#selo-fase')).toContainText('Primeira decisão · questão 2 de 3');
    await expect(ana.locator('#conteudo')).toContainText('Infraestrutura: conexão e integridade');
    await expect(ana.locator('button.opcao[aria-pressed="true"]')).toHaveCount(0);
    await expect(ana.locator('.barras')).toHaveCount(0);
    await votar(ana, 0, 'A chave de idempotência elimina a duplicidade na origem.');
    await votar(bruno, 2, 'A fila durável trata a indisponibilidade momentânea.');
    await professor.click('#btn-avancar');   // discussão
    await professor.click('#btn-avancar');   // segunda decisão
    await votar(ana, 0, 'Sigo com a idempotência declarada pelo cliente.');
    await votar(bruno, 0, 'Aceito a idempotência após a objeção sobre a janela.');
    await professor.click('#btn-avancar');   // síntese

    // Questão 3: o dado novo não chega antes da discussão.
    await professor.click('#btn-avancar');
    await sincronizar(ana);
    await expect(ana.locator('#selo-fase')).toContainText('Primeira decisão · questão 3 de 3');
    await expect(ana.locator('#conteudo')).not.toContainText('classificação individual');
    await votar(ana, 0, 'A verificação intercepta o erro antes do efeito.');
    await votar(bruno, 3, 'A reversão preserva a conversão do canal de voz.');

    await professor.click('#btn-avancar');
    await sincronizar(ana);
    await expect(ana.locator('#selo-fase')).toContainText('Discussão · questão 3 de 3');
    await expect(ana.locator('#conteudo')).toContainText('A classificação individual das 1.870 ocorrências');

    await professor.click('#btn-avancar');
    await sincronizar(ana);
    await expect(ana.locator('#conteudo')).toContainText('sobrevive a este dado');
    await votar(ana, 1, 'Passo ao envelope: o engano do titular atravessa a confirmação.');
    await votar(bruno, 3, 'Mantenho a reversão, que age sobre o resultado da fraude.');

    // Fechamento: o consolidado das questões.
    await professor.click('#btn-avancar');   // síntese da questão 3
    await professor.click('#btn-avancar');   // revelação
    await sincronizar(ana);
    await expect(ana.locator('#selo-fase')).toHaveText('Fechamento');
    await expect(ana.locator('#conteudo')).toContainText('Cinco categorias de exceção');
    await expect(ana.locator('#conteudo')).toContainText('Regra de negócio incompleta');
    await expect(ana.locator('#conteudo')).toContainText('Segurança: fraude e imprecisão');
    await expect(ana.locator('.barras')).toHaveCount(2 * TOTAL_QUESTOES);

    // O painel exibe as decisões individuais apenas quando solicitado.
    await expect(professor.locator('#turma')).toBeHidden();
    await professor.click('#alternar-turma');
    await expect(professor.locator('#turma')).toContainText('Ana');
    await expect(professor.locator('#turma')).toContainText('Bruno');
  });

  test('o painel recusa token inválido', async ({ browser }) => {
    const sala = salaFalsa();
    const context = await browser.newContext();
    await sala.ligar(context);
    const page = await context.newPage();
    await page.goto(PAINEL);
    await page.fill('#token', 'token-errado');
    await page.click('#form-token button');
    await expect(page.locator('#recado-token')).toContainText('Token do professor inválido');
    await expect(page.locator('#painel')).toBeHidden();
  });
});
