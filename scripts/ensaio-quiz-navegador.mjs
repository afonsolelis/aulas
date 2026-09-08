#!/usr/bin/env node
/**
 * Ensaio das páginas do quiz num navegador real: painel do professor,
 * dois aparelhos de estudante e a página das perguntas publicadas.
 *
 * Complementa scripts/testar-quiz.mjs, que exercita apenas as RPCs. Este
 * percorre as telas e verifica o que só aparece no navegador: a virada
 * automática para o resultado ao fim do tempo, o selo da questão que vale
 * o dobro, o enunciado presente na revelação, o pódio do encerramento, a
 * publicação das perguntas e o transbordo do painel em 1024x768, que é a
 * resolução do projetor da sala.
 *
 * Exige um servidor HTTP na raiz do repositório — o cliente do Supabase
 * não funciona sob file://:
 *
 *   python3 -m http.server 8123 &
 *   set -a; . ./.env; set +a
 *   node scripts/ensaio-quiz-navegador.mjs
 *
 * Variáveis: PW_BASE_URL (padrão http://127.0.0.1:8123) e SAIDA, o
 * diretório das capturas de tela. Ao terminar reinicia a sala.
 */

import { chromium } from 'playwright';
import { execFileSync } from 'node:child_process';

const BASE = process.env.PW_BASE_URL || 'http://127.0.0.1:8123';
const DIR = `${BASE}/pages/module-7-sistemas-informacao/quiz`;
const SLUG = 'stakeholders-m7-a6';
const TOKEN = process.env.QUIZ_HOST_TOKEN;
const BANCO = process.env.DATABASE_URL;
const SAIDA = process.env.SAIDA || '/tmp';

const falhas = [];
// Recarregar uma página aborta as consultas em curso, e o cliente do
// Supabase registra isso no console. Não é defeito da página.
let ignorarConsole = false;
const ok = (c, d, x) => { console.log(`  ${c ? 'ok  ' : 'FALHA'} ${d}${!c && x ? ` — ${x}` : ''}`); if (!c) falhas.push(d); };
const expirar = () => execFileSync('psql', [`${BANCO}?sslmode=require`, '-q', '-c',
  `update quiz_sessions set aberta_em = now() - interval '200 seconds' where slug='${SLUG}';`], { stdio: 'pipe' });
const espera = (ms) => new Promise((r) => setTimeout(r, ms));

const navegador = await chromium.launch({ headless: true });
const erros = [];

async function abrir(url, largura, altura) {
  const ctx = await navegador.newContext({ viewport: { width: largura, height: altura } });
  const pg = await ctx.newPage();
  pg.on('console', (m) => { if (m.type() === 'error' && !ignorarConsole) erros.push(`${url}: ${m.text()}`); });
  pg.on('pageerror', (e) => { if (!ignorarConsole) erros.push(`${url}: ${e.message}`); });
  await pg.goto(url, { waitUntil: 'domcontentloaded' });
  return pg;
}

console.log('\nEnsaio das páginas no navegador\n');

// ---- painel do professor, na resolução de projetor ----
const painel = await abrir(`${DIR}/lesson-6-host.html?token=${encodeURIComponent(TOKEN)}`, 1024, 768);
await painel.waitForSelector('[data-tela="lobby"].ativa', { timeout: 20000 });
ok(true, 'o painel autentica e mostra o lobby');
ok(await painel.locator('#qr canvas, #qr img').count() > 0, 'o código QR é gerado');

// Reinicia por dentro da página, para o ensaio partir de sala limpa.
painel.on('dialog', (d) => d.accept());
await painel.click('#btn-reiniciar');
await painel.waitForFunction(() => document.querySelector('#m-jogadores').textContent === '0', null, { timeout: 15000 });

// ---- dois aparelhos de estudante ----
const alunos = [];
for (const nome of ['Ensaio Ana', 'Ensaio Bia']) {
  const pg = await abrir(`${DIR}/lesson-6-quiz.html`, 390, 844);
  await pg.waitForSelector('[data-tela="entrada"].ativa', { timeout: 20000 });
  await pg.fill('#nome', nome);
  await pg.click('#btn-entrar');
  await pg.waitForSelector('[data-tela="espera"].ativa', { timeout: 20000 });
  alunos.push(pg);
}
ok(true, 'os dois estudantes entram na sala');

// ---- questão 1 ----
await painel.click('#btn-abrir');
await painel.waitForSelector('[data-tela="pergunta"].ativa', { timeout: 15000 });
ok(await painel.locator('#selo-dobro').isHidden(), 'a questão 1 não é anunciada como valendo o dobro');
const seg = await painel.textContent('#m-tempo');
ok(Number(seg) > 80 && Number(seg) <= 90, 'o painel conta a partir de noventa segundos', `restante = ${seg}`);

for (const pg of alunos) await pg.waitForSelector('[data-tela="pergunta"].ativa', { timeout: 20000 });
ok(await alunos[0].locator('#pergunta-dobro').isHidden(), 'o aparelho não anuncia dobro na questão 1');
await alunos[0].locator('.alt').first().click();
await alunos[0].waitForSelector('[data-tela="respondido"].ativa', { timeout: 15000 });
await alunos[1].locator('.alt').nth(1).click();
await alunos[1].waitForSelector('[data-tela="respondido"].ativa', { timeout: 15000 });
ok(true, 'as respostas são aceitas pelo aparelho');

// ---- fim do tempo: a revelação deve vir sozinha, sem clique ----
expirar();
await alunos[0].waitForSelector('[data-tela="revelacao"].ativa', { timeout: 20000 });
ok(true, 'o resultado aparece no aparelho assim que o tempo acaba, sem comando do professor');
ok((await alunos[0].textContent('#rev-enunciado')).trim().length > 40,
   'a pergunta permanece na tela do resultado');
await painel.waitForSelector('[data-tela="revelacao"].ativa', { timeout: 20000 });
ok((await painel.textContent('#rev-enunciado')).trim().length > 40,
   'o painel mantém o enunciado na revelação, para a discussão');
await painel.screenshot({ path: `${SAIDA}/quiz-revelacao-painel.png` });
await alunos[0].screenshot({ path: `${SAIDA}/quiz-revelacao-aluno.png` });

// ---- questões 2 a 10 ----
for (let ordem = 2; ordem <= 10; ordem += 1) {
  await painel.click('#btn-abrir');
  await painel.waitForSelector('[data-tela="pergunta"].ativa', { timeout: 15000 });
  // A pergunta aberta também é projetada, e é a tela mais longa do painel.
  const cortaPergunta = await painel.evaluate(() => {
    const m = document.querySelector('main');
    return m.scrollHeight - m.clientHeight;
  });
  if (cortaPergunta > 2) ok(false, `a pergunta ${ordem} cabe na tela projetada`, `${cortaPergunta}px cortados`);

  for (const pg of alunos) {
    await pg.waitForSelector('[data-tela="pergunta"].ativa', { timeout: 20000 });
    // O selo é conferido com a pergunta ainda aberta: depois de responder,
    // o aparelho já trocou de tela e nada haveria para ver.
    if (ordem === 10 && pg === alunos[0]) {
      ok(await pg.locator('#pergunta-dobro').isVisible(), 'o aparelho anuncia que a última vale o dobro');
      ok(await painel.locator('#selo-dobro').isVisible(), 'a última questão é anunciada como valendo o dobro no painel');
      await painel.screenshot({ path: `${SAIDA}/quiz-ultima-pergunta.png` });
      await pg.screenshot({ path: `${SAIDA}/quiz-ultima-pergunta-aluno.png` });
    }
    await pg.locator('.alt').first().click();
    await pg.waitForSelector('[data-tela="respondido"].ativa', { timeout: 15000 });
  }
  expirar();
  await painel.waitForSelector('[data-tela="revelacao"].ativa', { timeout: 20000 });
  await espera(250);
  // A revelação é projetada: enunciado, alternativas e explicação precisam
  // caber sem rolagem em 1024x768, para cada uma das dez questões.
  const corta = await painel.evaluate(() => {
    const m = document.querySelector('main');
    return m.scrollHeight - m.clientHeight;
  });
  if (corta > 2) ok(false, `a revelação da questão ${ordem} cabe na tela projetada`, `${corta}px cortados`);
}
ok(true, 'as dez perguntas e as dez revelações couberam em 1024x768');

ok((await painel.textContent('#btn-encerrar')).includes('pódio'),
   'revelada a última, o comando de encerrar oferece o pódio',
   await painel.textContent('#btn-encerrar'));

// ---- pódio ----
await painel.click('#btn-encerrar');
await painel.waitForSelector('[data-tela="final"].ativa', { timeout: 15000 });
ok(await painel.locator('#podio .degrau').count() === 2, 'o pódio do painel traz os colocados do ensaio',
   String(await painel.locator('#podio .degrau').count()));
ok(await painel.locator('#podio .degrau.lugar-1 .medalha').textContent() === '🥇', 'o primeiro colocado ocupa o degrau central');
await painel.screenshot({ path: `${SAIDA}/quiz-podio-painel.png` });

for (const pg of alunos) await pg.waitForSelector('[data-tela="final"].ativa', { timeout: 20000 });
ok(await alunos[0].locator('#podio .degrau').count() === 2, 'o pódio aparece também no aparelho');
ok(await alunos[0].locator('#link-perguntas').isHidden(), 'sem publicação, o aparelho não oferece o gabarito');
await alunos[0].screenshot({ path: `${SAIDA}/quiz-podio-aluno.png` });

// ---- publicação ----
const perguntas = await abrir(`${DIR}/lesson-6-perguntas.html`, 900, 900);
await perguntas.waitForSelector('[data-tela="fechado"].ativa', { timeout: 20000 });
ok(true, 'a página das perguntas avisa que ainda não foram publicadas');

ok((await painel.textContent('#btn-publicar')).trim() === 'Publicar perguntas', 'o painel oferece publicar as perguntas');
await painel.click('#btn-publicar');
await painel.waitForFunction(() => document.querySelector('#btn-publicar').textContent.includes('Despublicar'), null, { timeout: 15000 });
ok(true, 'publicadas, o botão passa a oferecer a despublicação');

ignorarConsole = true;
await perguntas.reload({ waitUntil: 'domcontentloaded' });
ignorarConsole = false;
await perguntas.waitForSelector('[data-tela="perguntas"].ativa', { timeout: 20000 });
ok(await perguntas.locator('.questao').count() === 10, 'a página publica as dez perguntas',
   String(await perguntas.locator('.questao').count()));
ok(await perguntas.locator('.alt.certa').count() === 10, 'cada pergunta assinala a alternativa correta');
ok(await perguntas.locator('.explicacao').count() === 10, 'cada pergunta traz a explicação do gabarito');
ok(await perguntas.locator('.questao').nth(9).locator('.selo.dobro').isVisible(), 'a última pergunta declara o peso na página');
await perguntas.screenshot({ path: `${SAIDA}/quiz-perguntas-publicadas.png`, fullPage: false });

ignorarConsole = true;
await alunos[0].reload({ waitUntil: 'domcontentloaded' });
ignorarConsole = false;
await alunos[0].waitForSelector('[data-tela="final"].ativa', { timeout: 20000 });
ok(await alunos[0].locator('#link-perguntas').isVisible(), 'publicadas, o aparelho oferece rever as perguntas');

await painel.click('#btn-publicar');
await painel.waitForFunction(() => document.querySelector('#btn-publicar').textContent.trim() === 'Publicar perguntas', null, { timeout: 15000 });
ok(true, 'a despublicação volta ao estado anterior');

// ---- transbordo do painel na resolução de projetor ----
const transbordo = await painel.evaluate(() => ({
  h: document.documentElement.scrollHeight, v: window.innerHeight,
  w: document.documentElement.scrollWidth, vw: window.innerWidth,
}));
ok(transbordo.h <= transbordo.v + 1 && transbordo.w <= transbordo.vw + 1,
   'o painel cabe em 1024x768 sem transbordar', JSON.stringify(transbordo));

// ---- limpeza ----
await painel.click('#btn-reiniciar');
await painel.waitForFunction(() => document.querySelector('#m-jogadores').textContent === '0', null, { timeout: 15000 });
ok(true, 'a sala foi reiniciada ao fim do ensaio');

execFileSync('psql', [`${BANCO}?sslmode=require`, '-q', '-c',
  `delete from quiz_relatorios where data_tag like '%${SLUG}' and data::text like '%Ensaio %';`], { stdio: 'pipe' });

await navegador.close();

const relevantes = erros.filter((e) => !/favicon|net::ERR_|Failed to load resource/i.test(e));
ok(relevantes.length === 0, 'nenhum erro de console nas páginas', relevantes.slice(0, 3).join(' | '));

console.log(`\n${falhas.length} falha(s).`);
if (falhas.length) { falhas.forEach((f) => console.log(` - ${f}`)); process.exit(1); }
