#!/usr/bin/env node
/**
 * Ensaio ponta a ponta de uma sala de quiz, pelas mesmas RPCs que as
 * páginas chamam. Percorre o ciclo inteiro — entrada, resposta, expiração
 * do tempo, pontuação, pódio e publicação das perguntas — e falha no
 * primeiro desvio.
 *
 * A expiração é forçada recuando `aberta_em` por psql, para não exigir
 * noventa segundos reais por questão. É a única operação que não passa
 * pela API pública; o restante do ensaio é o que o aparelho do estudante
 * e o painel do professor de fato executam.
 *
 * Uso:
 *   set -a; . ./.env; set +a
 *   node scripts/testar-quiz.mjs [slug]
 *
 * Ao terminar reinicia a sala, para a turma não encontrar os jogadores
 * do ensaio no placar.
 */

import { execFileSync } from 'node:child_process';

const URL_BASE = process.env.SUPABASE_URL || 'https://lcyxqwdgsrbcpecqyqje.supabase.co';
const CHAVE = process.env.SUPABASE_KEY || 'sb_publishable_x68LvlGFJns-zsrYTERvqw_-x5GWA8p';
const SLUG = process.argv[2] || 'stakeholders-m7-a6';
const TOKEN = process.env.QUIZ_HOST_TOKEN;
const BANCO = process.env.DATABASE_URL;

if (!TOKEN) { console.error('Defina QUIZ_HOST_TOKEN (está no .env da raiz).'); process.exit(2); }
if (!BANCO) { console.error('Defina DATABASE_URL (está no .env da raiz).'); process.exit(2); }

const falhas = [];
let verificacoes = 0;

function conferir(condicao, descricao, detalhe) {
  verificacoes += 1;
  if (condicao) { console.log(`  ok   ${descricao}`); return true; }
  console.log(`  FALHA ${descricao}${detalhe ? ` — ${detalhe}` : ''}`);
  falhas.push(descricao);
  return false;
}

async function rpc(funcao, corpo) {
  const r = await fetch(`${URL_BASE}/rest/v1/rpc/${funcao}`, {
    method: 'POST',
    headers: { apikey: CHAVE, Authorization: `Bearer ${CHAVE}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(corpo),
  });
  if (!r.ok) throw new Error(`${funcao}: HTTP ${r.status} ${await r.text()}`);
  return r.json();
}

const host = (acao) => rpc('quiz_host', { p_slug: SLUG, p_token: TOKEN, p_acao: acao });
const estado = (player) => rpc('quiz_estado', { p_slug: SLUG, p_player: player ?? null });
const responder = (player, escolha) => rpc('quiz_responder', { p_player: player, p_escolha: escolha });

/** Recua a abertura da pergunta para além do prazo, simulando o fim do tempo. */
function expirar(segundos = 200) {
  execFileSync('psql', [
    `${BANCO}?sslmode=require`, '-v', 'ON_ERROR_STOP=1', '-q', '-c',
    `update quiz_sessions set aberta_em = now() - interval '${segundos} seconds' where slug = '${SLUG}';`,
  ], { stdio: 'pipe' });
}

// ---------------------------------------------------------------------

console.log(`\nEnsaio da sala ${SLUG}\n`);

console.log('1. Sala e questões');
let d = await host('ver');
conferir(d.ok === true, 'o token do professor é aceito', d.erro);
if (!d.ok) process.exit(2);
const TOTAL = d.total;
conferir(TOTAL === 10, 'a sala tem dez questões', `total = ${TOTAL}`);

// Estado limpo antes de começar.
await host('reiniciar');
d = await host('ver');
conferir(d.estado === 'lobby' && d.jogadores === 0, 'a sala começa vazia, no lobby');

console.log('\n2. Entrada dos jogadores');
const nomes = ['Ensaio Um', 'Ensaio Dois', 'Ensaio Tres'];
const jogadores = [];
for (const nome of nomes) {
  const e = await rpc('quiz_entrar', { p_slug: SLUG, p_nome: nome });
  if (!e.ok) { console.log(`  FALHA entrada de ${nome} — ${e.erro}`); falhas.push('entrada'); process.exit(2); }
  jogadores.push(e.player_id);
}
d = await host('ver');
conferir(d.jogadores === 3, 'os três jogadores constam da sala', `jogadores = ${d.jogadores}`);

console.log('\n3. Percurso das dez questões');
let pontosQ1 = null, pontosQ10 = null;

for (let ordem = 1; ordem <= TOTAL; ordem += 1) {
  const abriu = await host('abrir');
  const p = abriu.pergunta;
  const pesoEsperado = ordem === TOTAL ? 2 : 1;

  if (ordem === 1 || ordem === TOTAL) {
    conferir(abriu.estado === 'pergunta' && abriu.ordem === ordem,
      `questão ${ordem} abre para a turma`, `estado ${abriu.estado}, ordem ${abriu.ordem}`);
    conferir(p.segundos === 90, `questão ${ordem} dá noventa segundos`, `segundos = ${p.segundos}`);
    conferir(p.peso === pesoEsperado,
      `questão ${ordem} tem peso ${pesoEsperado}`, `peso = ${p.peso}`);
  }

  // O gabarito não chega ao aluno enquanto a pergunta está aberta.
  const antes = await estado(jogadores[0]);
  if (ordem === 1) {
    conferir(antes.estado === 'pergunta' && antes.gabarito === undefined,
      'o gabarito não é enviado ao aluno com a pergunta aberta');
    conferir(antes.pergunta && antes.pergunta.peso === 1, 'o aluno recebe o peso da questão');
  }

  const certa = p.correta;
  const errada = (certa + 1) % p.alternativas.length;
  const r1 = await responder(jogadores[0], certa);
  const r2 = await responder(jogadores[1], errada);
  if (ordem === 1) {
    conferir(r1.ok === true && r2.ok === true, 'as respostas são registradas', JSON.stringify(r1));
    const repetida = await responder(jogadores[0], errada);
    conferir(repetida.ok === false, 'a segunda resposta do mesmo jogador é recusada');
  }
  // O terceiro jogador só responde a partir da segunda questão: na
  // primeira ele serve para conferir a recusa por tempo esgotado.
  if (ordem > 1) await responder(jogadores[2], certa);

  // Fim do tempo, sem comando do professor.
  expirar();
  const depois = await estado(jogadores[0]);

  if (ordem === 1) {
    conferir(depois.estado === 'revelacao',
      'a pergunta fecha sozinha quando o tempo acaba', `estado = ${depois.estado}`);
    conferir(depois.gabarito && depois.gabarito.correta === certa,
      'a revelação traz o gabarito da questão');
    conferir(!!(depois.gabarito && depois.gabarito.explicacao),
      'a revelação traz a explicação do gabarito');
    conferir(!!(depois.pergunta && depois.pergunta.enunciado),
      'o enunciado permanece disponível na revelação');
    conferir(depois.acertei === true && depois.pontos_rodada > 0,
      'quem acertou recebe pontos', `pontos = ${depois.pontos_rodada}`);
    pontosQ1 = depois.pontos_rodada;

    const atrasada = await responder(jogadores[2], certa);
    conferir(atrasada.ok === false, 'a resposta enviada após o tempo é recusada', JSON.stringify(atrasada));

    const painel = await host('ver');
    conferir(!!(painel.pergunta && painel.pergunta.enunciado),
      'o painel do professor mostra o enunciado na revelação');
  }

  if (ordem === TOTAL) {
    pontosQ10 = depois.pontos_rodada;
    conferir(depois.estado === 'revelacao', 'a última questão também fecha por tempo');
  }
}

conferir(pontosQ1 !== null && pontosQ10 !== null && pontosQ10 > 1000,
  'a última questão vale o dobro',
  `questão 1 = ${pontosQ1} pt, questão ${TOTAL} = ${pontosQ10} pt`);

console.log('\n4. Encerramento e pódio');
d = await host('encerrar');
conferir(d.estado === 'encerrado', 'a sessão encerra');
conferir(Array.isArray(d.ranking) && d.ranking.length === 3,
  'o placar traz os três jogadores', `linhas = ${d.ranking && d.ranking.length}`);
conferir(d.ranking[0].pontos >= d.ranking[1].pontos && d.ranking[1].pontos >= d.ranking[2].pontos,
  'o placar está em ordem decrescente de pontos');

const fim = await estado(jogadores[0]);
conferir(fim.estado === 'encerrado' && Array.isArray(fim.ranking) && fim.ranking.length >= 3,
  'o aluno recebe o placar para montar o pódio');
conferir(Array.isArray(fim.meus_temas), 'o aluno recebe os temas a retomar');

console.log('\n5. Publicação das perguntas');
let pg = await rpc('quiz_perguntas', { p_slug: SLUG });
conferir(pg.ok === true && pg.publicado === false && pg.perguntas === undefined,
  'sem publicação, as perguntas não saem do banco', JSON.stringify(pg).slice(0, 120));

d = await host('publicar');
conferir(d.publicado === true, 'o painel publica as perguntas');
pg = await rpc('quiz_perguntas', { p_slug: SLUG });
conferir(pg.publicado === true && pg.perguntas.length === TOTAL,
  'publicadas, as dez perguntas ficam disponíveis', `recebidas = ${pg.perguntas && pg.perguntas.length}`);
conferir(pg.perguntas.every((q) => Number.isInteger(q.correta) && q.explicacao && q.tema && q.secao),
  'cada pergunta publicada traz gabarito, explicação, tema e seção');
conferir(pg.perguntas[TOTAL - 1].peso === 2, 'a última pergunta publicada declara o peso 2');
conferir(pg.perguntas.map((q) => q.ordem).join(',') === Array.from({ length: TOTAL }, (_, i) => i + 1).join(','),
  'as perguntas publicadas vêm na ordem do quiz');

d = await host('despublicar');
conferir(d.publicado === false, 'o painel despublica as perguntas');
pg = await rpc('quiz_perguntas', { p_slug: SLUG });
conferir(pg.publicado === false && pg.perguntas === undefined, 'despublicadas, as perguntas somem de novo');

console.log('\n6. Limpeza');
d = await host('reiniciar');
conferir(d.estado === 'lobby' && d.jogadores === 0, 'a sala volta ao lobby, sem jogadores');
conferir(d.arquivadas > 0, 'o resultado do ensaio foi arquivado antes de apagar', `linhas = ${d.arquivadas}`);

// O arquivamento do ensaio não deve ficar na série histórica da turma.
execFileSync('psql', [
  `${BANCO}?sslmode=require`, '-v', 'ON_ERROR_STOP=1', '-q', '-c',
  `delete from quiz_relatorios where data_tag like '%${SLUG}' and data::text like '%Ensaio %';`,
], { stdio: 'pipe' });
console.log('  ok   o arquivamento do ensaio foi removido da série histórica');

console.log(`\n${verificacoes} verificações, ${falhas.length} falha(s).`);
if (falhas.length) { falhas.forEach((f) => console.log(` - ${f}`)); process.exit(1); }
console.log('Sala pronta para o encontro.\n');
