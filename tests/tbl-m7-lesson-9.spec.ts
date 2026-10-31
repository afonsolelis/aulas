import { test, expect, type BrowserContext, type Page } from '@playwright/test';
import { existsSync, readFileSync } from 'fs';
import path from 'path';

/**
 * TBL da Aula 9 do Módulo 7 — sequência de questões sobre o plano de tecnologia.
 *
 * O app é simulado por interceptação das rotas do contrato próprio
 * (`/api/v1/inteli/tbl/{sala}/{acao}`, ADR-18 do aulas-projeto): as rotas
 * respondem com as mesmas chaves e os mesmos erros do app, o que permite
 * exercitar a página do aluno e o painel do professor sem subir o servidor.
 * O corte de informação por fase é reproduzido aqui justamente para que o
 * teste falhe caso a página passe a exibir o que a fase não libera: as
 * questões seguintes e o dado novo antes da discussão.
 *
 * As páginas são servidas de uma origem fictícia (http://aulas.teste), a
 * partir dos arquivos do repositório; o cliente `/static/js/aulas.js` vem do
 * aulas-projeto (AULAS_JS, ou ../aulas-projeto ao lado deste repositório).
 * Sem ele o teste é pulado: a página não funciona sem o cliente do app.
 */

const RAIZ = path.resolve(__dirname, '..');
const ORIGEM = 'http://aulas.teste';
const ALUNO = ORIGEM + '/pages/module-7-sistemas-informacao/tbl/lesson-9-tbl.html';
const PAINEL = ORIGEM + '/pages/module-7-sistemas-informacao/tbl/lesson-9-painel.html';
const AULAS_JS = process.env.AULAS_JS || path.resolve(RAIZ, '../aulas-projeto/app/static/js/aulas.js');
const TIPOS: Record<string, string> = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon', '.json': 'application/json',
};
const TOKEN = 'token-de-teste';
const TOTAL_QUESTOES = 3;

const alternativasDe = (q: number) => ['A', 'B', 'C', 'D'].map((letra, i) => ({
  letra, titulo: `Tática ${letra} da questão ${q}`, tatica: `Família ${letra}`,
  texto: `Descrição da tática ${letra} na questão ${q}.`,
  ganho: `Ganho de ${letra}.`, custo: `Custo de ${letra}.`
}));

const QUESTOES = [
  { ordem: 1, categoria: 'Planejamento estratégico', titulo: 'O ponto de partida do plano',
    pergunta: 'Por onde o plano de tecnologia começa?', dado_novo: null },
  { ordem: 2, categoria: 'Alinhamento entre negócio e TI', titulo: 'O papel da tecnologia na estratégia',
    pergunta: 'Que perspectiva de alinhamento orienta o plano?', dado_novo: null },
  { ordem: 3, categoria: 'Priorização de iniciativas', titulo: 'O que cabe em R$ 2,3 milhões',
    pergunta: 'Que critério prioriza as iniciativas?',
    dado_novo: {
      titulo: 'O detalhamento dos nove pedidos',
      texto: 'A adequação fiscal é obrigatória e não constava dos pedidos.',
      evidencias: ['38% das faturas saíram depois da expedição.'],
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
      slug: 'teste', titulo: 'TBL de teste', fase: sala.fase,
      questao: sala.questao, total_questoes: TOTAL_QUESTOES,
      restante: sala.termina === null ? null : Math.max(0, Math.round((sala.termina - Date.now()) / 1000)),
      votacao_aberta: rodadaCorrente !== null,
      participantes: sala.pessoas.length, inscritos: sala.pessoas.length,
      votos_rodada: rodadaCorrente === null ? 0
        : sala.votos.filter(v => v.questao === sala.questao && v.rodada === rodadaCorrente).length,
      inscrito: sala.pessoas.some(p => p.id === id),
      caso_titulo: 'O plano de tecnologia que o conselho pediu em seis semanas',
      caso_texto: 'Distribuidora com sistema de gestão recém-implantado.',
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

  // Erro no formato do app: status HTTP e {erro: {codigo, mensagem}}.
  class Recusa {
    constructor(public status: number, public codigo: string, public mensagem: string) {}
  }

  type Pedido = { corpo: any; busca: URLSearchParams; token: string | null };
  const rotas: Record<string, (p: Pedido) => unknown> = {
    entrar: ({ corpo: { nome: bruto, participante } }) => {
      const nome = String(bruto || '').trim();
      if (nome.length < 2) throw new Recusa(400, 'entrada_invalida', 'O nome deve ter entre 2 e 60 caracteres.');
      const existente = participante ? sala.pessoas.find(p => p.id === participante) : null;
      if (existente) { existente.nome = nome; return { participante: existente.id, nome }; }
      if (sala.pessoas.some(p => p.nome.toLowerCase() === nome.toLowerCase())) {
        throw new Recusa(409, 'nome_em_uso', 'Esse nome já está em uso nesta sala. Escolha outro.');
      }
      const id = 'id-' + (sala.pessoas.length + 1);
      sala.pessoas.push({ id, nome });
      return { participante: id, nome };
    },
    votar: ({ corpo: { participante, rodada, escolha, justificativa } }) => {
      if (sala.fase !== 'voto' + rodada) throw new Recusa(409, 'rodada_fechada', 'Esta rodada não está aberta.');
      const just = String(justificativa || '').trim();
      if (just.length < 10) throw new Recusa(400, 'justificativa_curta', 'Registre a justificativa com pelo menos 10 caracteres.');
      const anterior = sala.votos.find(v => v.id === participante
        && v.questao === sala.questao && v.rodada === rodada);
      if (anterior) { anterior.escolha = escolha; anterior.justificativa = just; }
      else sala.votos.push({ id: participante, questao: sala.questao, rodada, escolha, justificativa: just });
      return { questao: sala.questao, rodada, escolha };
    },
    estado: ({ busca }) => estado(busca.get('participante')),
    host: ({ corpo: { acao: p_acao }, token }) => {
      if (token !== TOKEN) throw new Recusa(401, 'nao_autenticado', 'Token do professor inválido.');
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
        if (sala.questao <= 1) throw new Recusa(409, 'fora_de_hora', 'Esta é a primeira questão.');
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
    await context.route(ORIGEM + '/**', async route => {
      const pedido = route.request();
      const url = new URL(pedido.url());
      // O tempo real (SSE) não é exercitado aqui; a consulta periódica cobre a virada de fase.
      if (url.pathname.startsWith('/api/v1/inteli/eventos')) return route.abort();
      const api = url.pathname.match(/^\/api\/v1\/inteli\/tbl\/[^/]+\/([a-z-]+)$/);
      if (api) {
        const rota = rotas[api[1]];
        const cab = pedido.headers()['authorization'] || '';
        try {
          if (!rota) throw new Recusa(404, 'acao_inexistente', 'Esta ação não existe.');
          const corpo = rota({
            corpo: pedido.method() === 'POST' ? pedido.postDataJSON() : {},
            busca: url.searchParams,
            token: cab.startsWith('Bearer ') ? cab.slice(7) : null,
          });
          return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(corpo) });
        } catch (e) {
          if (!(e instanceof Recusa)) throw e;
          return route.fulfill({
            status: e.status, contentType: 'application/json',
            body: JSON.stringify({ erro: { codigo: e.codigo, mensagem: e.mensagem } })
          });
        }
      }
      // Arquivos estáticos: o cliente do app e o próprio repositório.
      const arquivo = url.pathname === '/static/js/aulas.js'
        ? AULAS_JS : path.join(RAIZ, decodeURIComponent(url.pathname));
      if (!arquivo.startsWith(RAIZ) && arquivo !== AULAS_JS) return route.fulfill({ status: 403 });
      if (!existsSync(arquivo)) return route.fulfill({ status: 404 });
      return route.fulfill({
        status: 200, body: readFileSync(arquivo),
        contentType: TIPOS[path.extname(arquivo)] || 'application/octet-stream'
      });
    });
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

test.describe('TBL · Aula 9 do Módulo 7 · plano de tecnologia orientado a metas', () => {
  test.skip(!existsSync(AULAS_JS), `cliente do app ausente (${AULAS_JS}); defina AULAS_JS`);

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
    await expect(professor.locator('#url-aluno')).toContainText('lesson-9-tbl.html');
    await expect(professor.locator('#qr-alvo svg')).toBeVisible();
    await expect(professor.locator('#tempo-grande')).toHaveText('--:--');
    await expect(professor.locator('#tempo-etiqueta')).toContainText('começa quando a questão abrir');

    // Lobby: o caso é legível, nada é votável e as questões não aparecem.
    await expect(ana.locator('#conteudo')).toContainText('O plano de tecnologia que o conselho pediu em seis semanas');
    await expect(ana.locator('button.opcao')).toHaveCount(0);
    await expect(ana.locator('#conteudo')).not.toContainText('O ponto de partida do plano');
    await expect(ana.locator('.passo')).toHaveCount(TOTAL_QUESTOES);

    // Questão 1 — primeira decisão, sem informação sobre a turma.
    await professor.click('#btn-avancar');
    await sincronizar(ana);
    await expect(ana.locator('#selo-fase')).toContainText('Primeira decisão · questão 1 de 3');
    await expect(ana.locator('#conteudo')).toContainText('Planejamento estratégico');
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
    // O botão reage à digitação, sem esperar a próxima consulta ao servidor (4 s).
    await ana.fill('#justificativa', 'Justificativa com mais de dez caracteres.');
    await expect(ana.locator('#registrar')).toBeEnabled({ timeout: 500 });

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
    await expect(ana.locator('#conteudo')).toContainText('Alinhamento entre negócio e TI');
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
    await expect(ana.locator('#conteudo')).not.toContainText('detalhamento dos nove pedidos');
    await votar(ana, 0, 'A verificação intercepta o erro antes do efeito.');
    await votar(bruno, 3, 'A reversão preserva a conversão do canal de voz.');

    await professor.click('#btn-avancar');
    await sincronizar(ana);
    await expect(ana.locator('#selo-fase')).toContainText('Discussão · questão 3 de 3');
    await expect(ana.locator('#conteudo')).toContainText('O detalhamento dos nove pedidos');

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
    await expect(ana.locator('#conteudo')).toContainText('Cinco decisões do plano de tecnologia');
    await expect(ana.locator('#conteudo')).toContainText('Planejamento estratégico');
    await expect(ana.locator('#conteudo')).toContainText('Priorização de iniciativas');
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
