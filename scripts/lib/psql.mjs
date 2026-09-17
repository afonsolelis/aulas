/**
 * Chamadas ao psql feitas pelos ensaios do quiz.
 *
 * Dois cuidados que cada script repetia e agora ficam num lugar só:
 *
 *   1. O binário é resolvido para um caminho absoluto conhecido em vez de
 *      depender do PATH. Quem controlasse o PATH escolheria qual programa
 *      recebe a URL do banco como argumento.
 *   2. Valores vindos de argumento ou de ambiente entram como variáveis do
 *      psql (`-v nome=valor`, lidas no SQL como `:'nome'`), que o próprio
 *      psql cita como literal. Interpolados direto no texto do comando,
 *      um valor com aspas reescreveria o SQL.
 */

import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const CANDIDATOS = [
  '/usr/bin/psql',
  '/usr/local/bin/psql',
  '/opt/homebrew/bin/psql',
  path.join(os.homedir(), '.local', 'bin', 'psql'),
];

let resolvido = null;

/** Caminho absoluto do psql. `PSQL_BIN` tem precedência sobre a busca. */
export function binarioPsql() {
  if (resolvido) return resolvido;
  const busca = process.env.PSQL_BIN ? [process.env.PSQL_BIN, ...CANDIDATOS] : CANDIDATOS;
  const achado = busca.find((c) => path.isAbsolute(c) && existsSync(c));
  if (!achado) {
    throw new Error(
      `psql não encontrado em ${busca.join(', ')}. ` +
      'Defina PSQL_BIN com o caminho absoluto do binário.');
  }
  resolvido = achado;
  return resolvido;
}

/**
 * Executa um comando SQL. Cada entrada de `vars` vira `-v nome=valor`; no
 * SQL, referencie como `:'nome'` para que o psql a cite como literal.
 *
 * O SQL entra por stdin (`-f -`), e não por `-c`: psql só interpola as
 * variáveis quando lê de arquivo ou da entrada padrão.
 */
export function executarPsql(urlBanco, sql, vars = {}) {
  const args = [`${urlBanco}?sslmode=require`, '-v', 'ON_ERROR_STOP=1', '-q'];
  for (const [nome, valor] of Object.entries(vars)) args.push('-v', `${nome}=${valor}`);
  args.push('-f', '-');
  return execFileSync(binarioPsql(), args, { input: sql, stdio: 'pipe' });
}
