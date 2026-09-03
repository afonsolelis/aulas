#!/usr/bin/env node
/**
 * Auditoria de qualidade das questões de um quiz ao vivo.
 *
 * Verifica os vícios que permitem pontuar sem ler o material:
 *   1. concentração da resposta correta em poucas letras;
 *   2. resposta correta sistematicamente mais longa que os distratores;
 *   3. desequilíbrio no número de alternativas;
 *   4. temas e seções ausentes, que o relatório exige para orientar o estudo.
 *
 * Uso:
 *   QUIZ_TOKEN=... node scripts/auditar-quiz.mjs [slug]
 *
 * Lê do banco, que é a fonte de verdade — o seed pode divergir do aplicado.
 */

const URL_BASE = process.env.SUPABASE_URL || 'https://lcyxqwdgsrbcpecqyqje.supabase.co';
const CHAVE = process.env.SUPABASE_KEY || 'sb_publishable_x68LvlGFJns-zsrYTERvqw_-x5GWA8p';
const SLUG = process.argv[2] || 'gmud-m7-a5';
const TOKEN = process.env.QUIZ_TOKEN;

if (!TOKEN) {
  console.error('Defina QUIZ_TOKEN com o token da sessão.');
  process.exit(2);
}

const LETRAS = ['A', 'B', 'C', 'D', 'E'];

const resposta = await fetch(`${URL_BASE}/rest/v1/rpc/quiz_relatorio`, {
  method: 'POST',
  headers: { apikey: CHAVE, Authorization: `Bearer ${CHAVE}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({ p_slug: SLUG, p_token: TOKEN }),
});
const dados = await resposta.json();
if (!dados.ok) {
  console.error('Falha:', dados.erro || JSON.stringify(dados));
  process.exit(2);
}

const questoes = [...dados.questoes].sort((a, b) => a.ordem - b.ordem);
if (!questoes.length) { console.error('Nenhuma questão nesta sala.'); process.exit(2); }

const problemas = [];
const avisos = [];

// 1. Distribuição da resposta correta entre as letras
const posicoes = questoes.map((q) => LETRAS[q.correta]);
const contagem = posicoes.reduce((m, l) => ({ ...m, [l]: (m[l] || 0) + 1 }), {});
const nAlt = Math.max(...questoes.map((q) => q.alternativas.length));
const esperado = questoes.length / nAlt;
const teto = Math.max(2, Math.ceil(esperado * 1.6));
Object.entries(contagem).forEach(([letra, n]) => {
  if (n > teto) problemas.push(
    `Resposta correta em ${letra} ${n}x de ${questoes.length} (limite ${teto}). ` +
    `Quem perceber o padrão pontua sem ler.`);
});
LETRAS.slice(0, nAlt).forEach((l) => {
  if (!contagem[l]) avisos.push(`Nenhuma resposta correta na alternativa ${l}.`);
});

// 2. Viés de comprimento: a correta não pode ser a mais longa por hábito
let maisLonga = 0;
questoes.forEach((q) => {
  const t = q.alternativas.map((a) => a.length);
  const max = Math.max(...t);
  if (t[q.correta] === max && t.filter((x) => x === max).length === 1) maisLonga++;
});
const limiteLongas = Math.ceil(questoes.length * 0.4);
if (maisLonga > limiteLongas) problemas.push(
  `A correta é a única mais longa em ${maisLonga} de ${questoes.length} questões ` +
  `(limite ${limiteLongas}). Encorpe os distratores.`);

// 3. Número de alternativas uniforme
const tamanhos = [...new Set(questoes.map((q) => q.alternativas.length))];
if (tamanhos.length > 1) avisos.push(`Questões com número desigual de alternativas: ${tamanhos.join(', ')}.`);

// 4. Tema e seção — o relatório depende deles
const semTema = questoes.filter((q) => !q.tema).map((q) => q.ordem);
const semSecao = questoes.filter((q) => !q.secao).map((q) => q.ordem);
if (semTema.length) problemas.push(`Questões sem tema: ${semTema.join(', ')}. O relatório não orienta o estudo sem isso.`);
if (semSecao.length) avisos.push(`Questões sem seção do material: ${semSecao.join(', ')}.`);
const temas = new Set(questoes.map((q) => q.tema).filter(Boolean));
if (temas.size < Math.ceil(questoes.length / 2))
  avisos.push(`Apenas ${temas.size} temas distintos em ${questoes.length} questões — cobertura estreita.`);

// 5. Enunciados muito curtos sugerem questão de memorização, não de aplicação
const curtas = questoes.filter((q) => q.enunciado.length < 90).map((q) => q.ordem);
if (curtas.length) avisos.push(
  `Enunciados curtos (< 90 caracteres) nas questões ${curtas.join(', ')} — ` +
  `verifique se cobram aplicação e não apenas recuperação.`);

// ---- Relatório ----
console.log(`\nAuditoria — sala "${SLUG}" · ${questoes.length} questões · ${nAlt} alternativas\n`);
console.log('POSIÇÃO DA RESPOSTA CORRETA');
console.log('  ' + questoes.map((q) => `Q${q.ordem}=${LETRAS[q.correta]}`).join('  '));
console.log('  distribuição: ' + JSON.stringify(contagem) + `  (equilíbrio ideal ≈ ${esperado.toFixed(1)} por letra)`);
console.log('\nVIÉS DE COMPRIMENTO');
questoes.forEach((q) => {
  const t = q.alternativas.map((a) => a.length);
  const max = Math.max(...t);
  const marca = t[q.correta] === max && t.filter((x) => x === max).length === 1 ? 'SIM' : 'não';
  console.log(`  Q${q.ordem}: correta ${t[q.correta]}c | mais longa ${max}c | é a mais longa: ${marca}`);
});
console.log(`  → ${maisLonga} de ${questoes.length} (limite ${limiteLongas})`);
console.log('\nCOBERTURA');
questoes.forEach((q) => console.log(`  Q${q.ordem}: ${q.secao || '(sem seção)'} — ${q.tema || '(SEM TEMA)'}`));

console.log('\n' + '─'.repeat(64));
if (problemas.length) {
  console.log(`\n❌ ${problemas.length} problema(s) que reprovam:\n`);
  problemas.forEach((p) => console.log('  • ' + p));
}
if (avisos.length) {
  console.log(`\n⚠️  ${avisos.length} aviso(s):\n`);
  avisos.forEach((a) => console.log('  • ' + a));
}
if (!problemas.length && !avisos.length) console.log('\n✅ Nenhum vício detectado.');
console.log();
process.exit(problemas.length ? 1 : 0);
