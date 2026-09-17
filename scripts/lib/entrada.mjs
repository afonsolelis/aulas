/**
 * Tratamento de valores que chegam aos scripts por linha de comando, por
 * ambiente ou por resposta do servidor — tudo que o script não escreveu.
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';

/** Raiz do repositório, deduzida da posição deste módulo (scripts/lib/). */
export const RAIZ = path.resolve(fileURLToPath(import.meta.url), '../../..');

/**
 * Resolve um caminho recebido por argumento contra a raiz do repositório e
 * recusa o que escapar dela. Sem a checagem, um `../` no argumento faz o
 * script ler ou sobrescrever arquivo fora do projeto.
 */
export function caminhoNoProjeto(caminho, rotulo = 'caminho') {
  const absoluto = path.resolve(RAIZ, caminho);
  if (absoluto !== RAIZ && !absoluto.startsWith(RAIZ + path.sep)) {
    throw new Error(`${rotulo} fora do projeto: ${paraLog(caminho, 120)}`);
  }
  return absoluto;
}

/** Caminho de `caminhoNoProjeto`, expresso relativo à raiz e com barras de URL. */
export function relativoAoProjeto(absoluto) {
  return path.relative(RAIZ, absoluto).split(path.sep).join('/');
}

/**
 * Slug de sala de quiz: minúsculas, dígitos e hífen, como os seeds em
 * `supabase/`. Barra o que não tem essa forma antes de o valor alcançar o
 * banco ou o console.
 */
export function slugDeSala(valor) {
  if (typeof valor !== 'string' || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(valor)) {
    throw new Error(`slug de sala inválido: ${paraLog(valor, 60)}`);
  }
  return valor;
}

/**
 * Prepara para o console um valor de origem externa. Os caracteres de
 * controle saem porque é com eles que uma mensagem forjada inventaria linhas
 * de log que nunca aconteceram.
 */
export function paraLog(valor, limite = 300) {
  const texto = typeof valor === 'string' ? valor : (JSON.stringify(valor) ?? String(valor));
  return texto.replace(/[\p{Cc}\p{Cf}]/gu, ' ').slice(0, limite);
}
